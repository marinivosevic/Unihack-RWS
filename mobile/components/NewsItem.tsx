import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const NewsItem = () => {
  return (
    <TouchableOpacity className="flex flex-col rounded-xl bg-white shadow-sm shadow-white/40 mx-5 mt-5">
      <View className="h-48 w-full rounded-t-xl bg-black" />
      <View className="flex flex-col items-start justify-center px-4 pb-4">
        <Text className="text-xl font-bold mt-2">News Title</Text>
        <Text className="text-sm text-black/70 mt-2">News Description</Text>
        <Text className="text-xs text-gray-500 mt-2">City: city</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewsItem;
