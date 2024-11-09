import { Text, View, Image, StatusBar } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import * as icons from "@/constants/icons";
import * as images from "@/constants/images";
import WeatherWidget from "@/components/WeatherWidget";
import NewsItem from "@/components/NewsItem";

const Home = () => {
  const [query, setQuery] = useState<string>("");

  const onTextChange = (text: string) => {
    setQuery(text);
  };

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
          <View className="flex flex-row items-center justify-center bg-white rounded-full w-12 h-12 mt-5" />
        </View>
        <Text className="text-white text-2xl font-bold px-5 mt-5">
          Weather Forecast
        </Text>
        <WeatherWidget />
        <Text className="text-white text-2xl font-bold px-5 mt-5">
          News Feed
        </Text>
        <NewsItem />
        <NewsItem />
      </ScrollView>
      <StatusBar barStyle="light-content" />
    </SafeAreaView>
  );
};

export default Home;
