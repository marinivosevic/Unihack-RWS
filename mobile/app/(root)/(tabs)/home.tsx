import { Text, View, Image, StatusBar, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

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

const Home = () => {
  const [news, setNews] = useState<INewsItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <SafeAreaView className="h-full bg-black/90">
      <ScrollView>
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
