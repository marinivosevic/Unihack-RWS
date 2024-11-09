import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton"; // Adjust the path to your actual BackButton component
import { router } from "expo-router";
import { getTokens } from "@/lib/secureStore";
import { chat } from "@/constants/icons";

interface ChatRooms {
  chat_id: string;
  connections: string[];
  lastMessage: string;
}

const Chat = () => {
  const [chatRooms, setChatRooms] = useState<ChatRooms[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Initialize with false

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true); // Start loading
      const API_URL = process.env.EXPO_PUBLIC_CHAT_API_URL;
      const tokens = await getTokens();
      const jwtToken = tokens?.jwtToken;
      console.log("Starting fetch...", jwtToken);

      try {
        const result = await fetch(`${API_URL}/chat/rooms`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!result.ok) {
          // Handle HTTP errors
          const errorData = await result.json();
          console.error("Error fetching chat rooms:", errorData);
          return;
        }

        const roomsAPIdata = await result.json();
        setChatRooms(roomsAPIdata.rooms);
        console.log("Rooms: ", roomsAPIdata.rooms);
      } catch (error) {
        console.error("Error fetching chat rooms", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchRooms();
  }, []); // Empty dependency array to run once on mount

  // Handler for the New Chat button
  const handleNewChat = () => {
    console.log("Navigate to New Chat Screen");
    router.push("/chat/new");
    // You can use router.push("/new-chat") or any navigation logic
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <BackButton />
      <View className="flex-row items-center justify-between px-4 py-4 bg-primary mt-5">
        <Text className="text-txt-100 text-2xl font-bold ml-12">Chats</Text>
        <TouchableOpacity
          onPress={handleNewChat}
          className="bg-secondary-200 p-2 rounded-lg"
        >
          <Text className="text-white text-base font-semibold">New Chat</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2 text-txt-200">Loading chats...</Text>
        </View>
      ) : (
        <ScrollView className="px-4 py-4">
          {chatRooms.length > 0 ? (
            <Text className="text-txt-200 text-base font-semibold mb-3">
              Recent Chats
            </Text>
          ) : (
            <View className="flex items-center justify-center h-52">
              <Image source={chat} className="w-32 h-32" />
              <Text className="text-txt-200 text-lg font-semibold mt-4">
                No chats available
              </Text>
            </View>
          )}
          {chatRooms.length > 0
            ? chatRooms.map((room) => (
                <TouchableOpacity
                  key={room.chat_id}
                  className="flex-row items-center gap-x-3 p-4 bg-secondary-0 rounded-lg mb-3 shadow"
                  onPress={() => router.push(`/chat/${room.chat_id}`)} // Navigate to the chat room
                >
                  <View className="w-12 h-12 bg-secondary-50 rounded-full" />
                  <View className="flex-1">
                    <Text className="text-txt-100 text-base font-semibold">
                      {room.connections[0]}
                    </Text>
                    <Text className="text-txt-200 text-base" numberOfLines={1}>
                      {room.lastMessage}
                    </Text>
                  </View>
                  <Text className="text-txt-200 text-xs">12:30 PM</Text>
                </TouchableOpacity>
              ))
            : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Chat;
