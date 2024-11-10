import {
  Text,
  View,
  Image,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import * as icons from "@/constants/icons";
import * as images from "@/constants/images";
import WeatherWidget from "@/components/WeatherWidget";
import NewsItem from "@/components/NewsItem";
import { getTokens } from "@/lib/secureStore";

declare interface INewsItem {
  city: string;
  description: string;
  id: string;
  pictures: string[];
  published_at: string;
  tag: string;
  title: string;
}

interface Message {
  sender: "bot" | "user";
  content: string;
}

const Home = () => {
  const [news, setNews] = useState<INewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", content: "Hello, how can I help you?" },
  ]);
  const [sendingMessage, setSendingMessage] = useState(false);

  const getAllNews = async () => {
    setLoading(true);
    const API_URL = process.env.EXPO_PUBLIC_NEWS_API;
    const tokens = await getTokens();
    const jwtToken = tokens?.jwtToken;
    try {
      const response = await fetch(`${API_URL}/news/Rijeka`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const data = await response.json();
      setNews(data.news);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllNews();
  }, []);

  const handleSendMessage = async () => {
    if (!message) return;
    setSendingMessage(true);

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", content: message }]);
    setMessage("");

    try {
      const response = await fetch(
        "https://bz1cbiyquc.execute-api.eu-central-1.amazonaws.com/api-v1/chat/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: message }),
        }
      );

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", content: data.answer }]);
    } catch (error) {
      console.error(error);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-black/90">
      <Modal isVisible={chatModalVisible}>
        <View className="bg-white p-5 h-[420px] mb-56 rounded-lg relative">
          <TouchableOpacity
            onPress={() => {
              setMessages([
                { sender: "bot", content: "Hello, how can I help you?" },
              ]);
              setChatModalVisible(false);
            }}
            className="absolute top-2 right-2"
          >
            <Text className="text-black m-3">X</Text>
          </TouchableOpacity>

          {/* Chat Messages */}
          <ScrollView className="flex-1 my-2 mt-8">
            {messages.map((msg, index) => (
              <View
                key={index}
                className={`flex flex-row ${
                  msg.sender === "bot" ? "justify-start" : "justify-end"
                } mb-3`}
              >
                <View
                  className={`p-3 rounded-xl ${
                    msg.sender === "bot"
                      ? "bg-gray-200 rounded-tl-none"
                      : "bg-quinterny-500 rounded-tr-none"
                  } max-w-[80%]`}
                >
                  <Text
                    className={`text-sm ${
                      msg.sender === "bot" ? "text-black" : "text-white"
                    }`}
                  >
                    {msg.content}
                  </Text>
                </View>
              </View>
            ))}
            <View className="h-10" />
          </ScrollView>

          {/* Input Field */}
          <View className="flex flex-col items-center w-full absolute bottom-5">
            <View className="flex flex-row items-center justify-between w-full">
              <TextInput
                value={message}
                onChangeText={(text) => setMessage(text)}
                placeholder="Type a message..."
                className="p-2 border border-quinterny-400 bg-white rounded-xl ml-4 w-64"
                placeholderTextColor={"gray"}
                editable={!sendingMessage} // Disable input while sending
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={sendingMessage} // Disable button while sending
                className={`rounded-full items-center justify-center w-10 h-10 ml-5 ${
                  sendingMessage ? "bg-gray-400" : "bg-quinterny-500"
                }`}
              >
                <Image
                  source={icons.send}
                  className="h-6 w-6 ml-1"
                  tintColor={"white"}
                />
              </TouchableOpacity>
            </View>
            {sendingMessage && (
              <Text className="text-gray-500 text-xs mt-2">Sending...</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Open Chat Button */}
      <TouchableOpacity
        onPress={() => setChatModalVisible(true)}
        className="absolute bottom-24 right-0 mt-5 mr-5 z-50"
      >
        <View className="flex flex-row items-center justify-center bg-quinterny-500 rounded-full w-14 h-14">
          <Image source={icons.chat} className="h-8 w-8" tintColor={"white"} />
        </View>
      </TouchableOpacity>

      {/* Main Content */}
      <ScrollView>
        {/* Header */}
        <View className="flex flex-row items-center justify-between w-full py-2 px-5">
          <View className="flex flex-row items-center justify-center mt-5">
            <View className="flex flex-row items-center">
              <Image source={images.logo} className="h-12 w-10 mb-1" />
              <Text className="text-2xl font-bold text-white ml-2">
                UrbanPulse
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center justify-center bg-white rounded-full w-10 h-10 mt-5">
            <Image source={icons.person} className="h-6 w-6" />
          </View>
        </View>

        {/* Content */}
        <Text className="text-white text-2xl font-bold px-5 mt-5">
          Weather Forecast
        </Text>
        <WeatherWidget />
        <Text className="text-white text-2xl font-bold px-5 mt-5">
          News Feed
        </Text>
        {loading && (
          <ActivityIndicator size="large" color="#fff" className="mt-5" />
        )}
        {news.map((item) => (
          <NewsItem key={item.id} news={item} />
        ))}
        <View className="h-14" />
      </ScrollView>
      <StatusBar barStyle="light-content" />
    </SafeAreaView>
  );
};

export default Home;
