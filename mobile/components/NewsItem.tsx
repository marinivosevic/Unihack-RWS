import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

declare interface INewsItem {
  city: string;
  description: string;
  id: string;
  pictures: string[];
  published_at: string;
  tag: string;
  title: string;
}

const NewsItem = ({ news }: { news: INewsItem }) => {
  // Construct a URI with the base64 prefix
  const base64ImageUri = `data:image/jpeg;base64,/${news.pictures[0].replace(
    /^dataimage\/jpegbase64\//,
    ""
  )}`;

  return (
    <TouchableOpacity className="flex flex-col rounded-xl bg-white shadow-sm shadow-white/40 mx-5 mt-5">
      <Image
        source={{ uri: base64ImageUri }}
        className="h-48 w-full rounded-t-xl"
      />
      <View className="flex bg-quinterny-400 items-center justify-center px-4 py-2 w-1/3 rounded-full m-2">
        <Text className="text-xs font-bold text-center text-white">
          {news.tag}
        </Text>
      </View>
      <View className="flex flex-col items-start justify-center px-4 pb-4">
        <Text className="text-xl font-bold mt-2">{news.title}</Text>
        <Text className="text-sm text-black/70 mt-2">{news.description}</Text>
        <View className="flex flex-row items-center justify-between w-full mt-2">
          <Text className="text-xs text-gray-500 mt-2">City: {news.city}</Text>
          <Text className="text-xs text-gray-500 mt-2">
            Published at: {news.published_at}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NewsItem;
