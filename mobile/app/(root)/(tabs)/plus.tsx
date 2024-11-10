import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as icons from "@/constants/icons";
import { useRouter } from "expo-router";

const Plus = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="px-5 bg-black/90 h-full">
      <Text className="text-2xl font-bold text-white mt-5">
        What would you like to add?
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/ticket")}
        className="flex flex-row justify-between items-center mt-8 bg-quinterny-400/70 border border-white/60 py-2 px-4 rounded-xl"
      >
        <View className="flex flex-row items-center">
          <Image
            source={icons.ticket}
            className="w-5 h-5 mr-2"
            tintColor={"white"}
          />
          <Text className="text-white text-lg font-medium">
            Add a new ticket
          </Text>
        </View>
        <Image
          source={icons.arrowRight}
          className="w-6 h-6"
          tintColor={"white"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/trash/new")}
        className="flex flex-row justify-between items-center mt-8 bg-quinterny-400/70 border border-white/60 py-2 px-4 rounded-xl"
      >
        <View className="flex flex-row items-center">
          <Image
            source={icons.trash1}
            className="w-5 h-5 mr-2"
            tintColor={"white"}
          />
          <Text className="text-white text-lg font-medium">
            Add a new trash bin
          </Text>
        </View>
        <Image
          source={icons.arrowRight}
          className="w-6 h-6"
          tintColor={"white"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/trash/full")}
        className="flex flex-row justify-between items-center mt-8 bg-quinterny-400/70 border border-white/60 py-2 px-4 rounded-xl"
      >
        <View className="flex flex-row items-center">
          <Image
            source={icons.trash2}
            className="w-5 h-5 mr-2"
            tintColor={"white"}
          />
          <Text className="text-white text-lg font-medium">
            Add a full trash bin
          </Text>
        </View>
        <Image
          source={icons.arrowRight}
          className="w-6 h-6"
          tintColor={"white"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/charger")}
        className="flex flex-row justify-between items-center mt-8 bg-quinterny-400/70 border border-white/60 py-2 px-4 rounded-xl"
      >
        <View className="flex flex-row items-center">
          <Image
            source={icons.bolt}
            className="w-5 h-5 mr-2"
            tintColor={"white"}
          />
          <Text className="text-white text-lg font-medium">
            Add a new charger
          </Text>
        </View>
        <Image
          source={icons.arrowRight}
          className="w-6 h-6"
          tintColor={"white"}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Plus;
