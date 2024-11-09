import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Plus = () => {
  return (
    <SafeAreaView className="px-5 bg-black/90 h-full">
      <Text className="text-2xl font-bold text-white">
        What would you like to add?
      </Text>
    </SafeAreaView>
  );
};

export default Plus;
