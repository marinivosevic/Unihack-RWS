import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";

const New = () => {
  return (
    <SafeAreaView className="px-5 bg-black/90 h-full">
      <BackButton />
      <Text className="text-2xl font-bold text-white mt-24">
        Add a new bin to the map
      </Text>
      <View className="flex flex-row justify-between items-center mt-8 bg-quinterny-400/70 border border-white/60 py-2 px-4 rounded-xl">
        <Text className="text-white text-lg font-medium">
          No full trash bins
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default New;
