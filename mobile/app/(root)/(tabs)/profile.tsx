import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Href } from "expo-router";

const Profile = () => {
  return (
    <SafeAreaView className="bg-black/90 h-full px-5">
      <ScrollView>
        <View className="flex flex-row items-center justify-start bg-quinterny-500 rounded-xl border border-quinterny-600 shadow-sm shadow-gray-400 p-4 mt-10">
          <View className="bg-quinterny-600 rounded-full h-12 w-12" />
          <View className="flex flex-col ml-2">
            <Text className="text-white text-2xl font-bold">User</Text>
            <Text className="text-white/60 text-lg font-light">
              email@gmail.com
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-y-2 items-center justify-start bg-quinterny-500 rounded-xl border border-quinterny-600 shadow-sm shadow-gray-400 p-4 mt-12">
          <TouchableOpacity
            onPress={() => {
              router.push("/personal-info" as Href);
            }}
            className="flex flex-row items-center justify-between w-full pb-4 border-b border-quinterny-600"
          >
            <View className="flex flex-row items-center justify-start">
              <View className="bg-quinterny-600 rounded-full h-8 w-8 mr-2" />
              <Text className="text-white text-lg font-bold">Profile</Text>
            </View>
            <Text className="text-white text-lg font-bold">{">"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/your-tickets");
            }}
            className="flex flex-row border-b border-quinterny-600 items-center justify-between w-full py-4"
          >
            <View className="flex flex-row items-center justify-start">
              <View className="bg-quinterny-600 rounded-full h-8 w-8 mr-2" />
              <Text className="text-white text-lg font-bold">Your Tickets</Text>
            </View>
            <Text className="text-white text-lg font-bold">{">"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/preferences");
            }}
            className="flex flex-row items-center justify-between w-full py-4 border-b border-quinterny-600"
          >
            <View className="flex flex-row items-center justify-start">
              <View className="bg-quinterny-600 rounded-full h-8 w-8 mr-2" />
              <Text className="text-white text-lg font-bold">Preferences</Text>
            </View>
            <Text className="text-white text-lg font-bold">{">"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/privacy-policy");
            }}
            className="flex flex-row items-center justify-between w-full py-4 border-b border-quinterny-600"
          >
            <View className="flex flex-row items-center justify-start">
              <View className="bg-quinterny-600 rounded-full h-8 w-8 mr-2" />
              <Text className="text-white text-lg font-bold">
                Privacy Policy
              </Text>
            </View>
            <Text className="text-white text-lg font-bold">{">"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/faqs");
            }}
            className="flex flex-row items-center justify-between w-full pt-4"
          >
            <View className="flex flex-row items-center justify-start">
              <View className="bg-quinterny-600 rounded-full h-8 w-8 mr-2" />
              <Text className="text-white text-lg font-bold">FAQs</Text>
            </View>
            <Text className="text-white text-lg font-bold">{">"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
