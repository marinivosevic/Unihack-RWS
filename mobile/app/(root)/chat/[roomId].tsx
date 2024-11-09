import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import * as icons from "@/constants/icons";
import ChatInput from "@/components/ChatInput";
import { getInfo, getTokens } from "@/lib/secureStore";

type Message = {
  message: string;
  sent_from: string; // Could be email or user ID
  chat_id: string; // Chat room ID
  message_id: string; // Unique message ID
  send_to?: string; // Could be email or user ID
  timestamp: string; // Message timestamp
};

const UserMessage = ({
  message,
  timestamp,
}: {
  message: string;
  timestamp: string;
}) => {
  return (
    <View className="flex flex-row-reverse items-center justify-start gap-x-2 m-2">
      <View className="h-10 w-10 rounded-full bg-secondary-200" />
      <View className="bg-secondary-200 py-2 px-4 rounded-xl">
        <Text className="text-white font-regular text-base">{message}</Text>
        <Text className="text-xs text-gray-400 mt-1">
          {new Date(timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

const OtherMessage = ({
  message,
  timestamp,
}: {
  message: string;
  timestamp: string;
}) => {
  return (
    <View className="flex flex-row items-center justify-start gap-x-2 m-2">
      <View className="h-10 w-10 rounded-full bg-secondary-200" />
      <View className="bg-secondary-200 py-2 px-4 rounded-xl">
        <Text className="text-white font-regular text-base">{message}</Text>
        <Text className="text-xs text-gray-400 mt-1">
          {new Date(timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

const ChatRoom = () => {
  const { roomId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_SOCKET_URL;
  const historyURL = process.env.EXPO_PUBLIC_CHAT_API_URL;

  // WebSocket reference
  const ws = useRef<WebSocket | null>(null);

  // FlatList reference to auto-scroll to the latest message
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchUserEmailAndHistory = async () => {
      try {
        // Fetch user email
        const info = await getInfo("email");
        if (!info) {
          console.error("Error fetching user email");
          setMessages([]); // Optionally set to empty array
          setLoading(false);
          return;
        }
        setUserEmail(info);

        // Fetch chat history
        const tokens = await getTokens();
        const jwtToken = tokens?.jwtToken;
        if (!jwtToken) {
          console.error("JWT Token is missing");
          setMessages([]); // Optionally set to empty array
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${historyURL}/chat/history?chat_id=${roomId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const history = await response.json();
        console.log("Chat history:", history);
        const messages = (history.chat_history as Message[]).sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        setMessages(messages);
      } catch (error: any) {
        console.error("Error fetching chat history:", error.message);
        setMessages([]); // Ensure messages is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchUserEmailAndHistory();
  }, [roomId, historyURL]);

  useEffect(() => {
    if (!userEmail) return; // Wait until userEmail is fetched

    const connectWebSocket = () => {
      const initiateWebSocket = async () => {
        try {
          const tokens = await getTokens();
          const jwtToken = tokens?.jwtToken;
          if (!jwtToken) {
            console.error("JWT Token is missing");
            return;
          }

          // Ensure API_URL starts with ws:// or wss://
          const wsUrl = `${API_URL}/?x-access-token=${jwtToken}`;
          ws.current = new WebSocket(wsUrl);

          ws.current.onopen = () => {
            console.log("WebSocket connected");
          };

          ws.current.onmessage = (event) => {
            try {
              console.log("Received message:", event.data);
              const newMessage: Message = {
                message: event.data,
                sent_from: "",
                chat_id: "",
                message_id: `${Date.now()}`,
                timestamp: new Date().toISOString(),
              };
              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, newMessage].sort(
                  (a, b) =>
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime()
                );
                setTimeout(
                  () =>
                    flatListRef.current?.scrollToEnd({
                      animated: true,
                    }),
                  100
                );
                return updatedMessages;
              });
            } catch (err) {
              console.error("Error parsing message: ", err);
            }
          };

          ws.current.onerror = (error: any) => {
            console.error(
              "WebSocket encountered error: ",
              error.message,
              "Closing socket"
            );
            ws.current?.close();
          };

          ws.current.onclose = (event) => {
            console.log(
              `WebSocket disconnected: Code=${event.code}, Reason=${event.reason}`
            );
          };
        } catch (error: any) {
          console.error("WebSocket connection error:", error.message);
        }
      };

      initiateWebSocket();
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userEmail, roomId, API_URL]);

  const handleSendMessage = async () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const messageData = {
        action: "sendmessage",
        chat_id: roomId as string, // Ensure roomId is a string
        message: messageInput,
        sent_from: userEmail,
      };

      console.log("Sending message: ", messageData.message);

      try {
        ws.current.send(JSON.stringify(messageData));
        console.log("Message sent");

        // Optimistically add the message to the chat
        const newMessage: Message = {
          ...messageData,
          message_id: `${Date.now()}`, // Ensure uniqueness
          timestamp: new Date().toISOString(),
          send_to: undefined, // Populate if necessary
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessageInput("");

        // Scroll to the end after sending a message
        flatListRef.current?.scrollToEnd({ animated: true });
      } catch (error: any) {
        console.error("Error sending message:", error.message);
      }
    } else {
      console.error("WebSocket is not open");
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    return item.sent_from === userEmail ? (
      <UserMessage message={item.message} timestamp={item.timestamp} />
    ) : (
      <OtherMessage message={item.message} timestamp={item.timestamp} />
    );
  };

  if (loading) {
    // Render loader while fetching data
    return (
      <View className="flex-1 justify-center items-center bg-secondary-100">
        <ActivityIndicator size="large" color="#333333" />
        <Text className="mt-2 text-base text-txt-200">Loading chat...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-secondary-100">
      {/* Header */}
      <View className="flex flex-row items-center justify-between p-4 bg-secondary-100 border-b border-secondary-200">
        <View className="flex flex-row items-center gap-x-2">
          <TouchableOpacity onPress={() => router.dismiss()}>
            <Image
              source={icons.arrowBack}
              className="h-7 w-7"
              tintColor="#333333"
            />
          </TouchableOpacity>
          <View className="h-10 w-10 rounded-full bg-white" />
          <Text className="text-xl font-semibold text-txt-100">User</Text>
        </View>
        <Image source={icons.search} className="h-7 w-7" tintColor="#333333" />
      </View>

      {/* Chat Messages */}
      {messages && messages.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={messages} // Use messages as is
          renderItem={renderItem}
          keyExtractor={(item) => item.message_id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          // Remove onContentSizeChange
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-txt-200">No messages yet</Text>
        </View>
      )}

      {/* Chat Input */}
      <ChatInput
        value={messageInput}
        onChangeText={setMessageInput}
        onSend={handleSendMessage}
      />
    </SafeAreaView>
  );
};

export default ChatRoom;
