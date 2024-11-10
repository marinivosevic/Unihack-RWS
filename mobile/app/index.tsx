import { Href, router } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as images from "@/constants/images";

export default function Onboarding() {
  const handleSignIn = () => {
    // Navigate to sign-in screen
    router.push("/(auth)/sign-in" as Href);
  };

  const handleSignUp = () => {
    // Navigate to sign-up screen
    router.push("/(auth)/sign-up" as Href);
  };

  return (
    <SafeAreaView className="h-full flex flex-col justify-between items-center bg-black/90">
      <View className="flex flex-col items-center justify-center h-1/2 mt-40">
        <Image source={images.logo} className="h-28 w-24" />
        <Text className="text-4xl font-bold text-center text-white mx-5 mt-1">
          Urban<Text className="text-quinterny-500">Pulse</Text>
        </Text>
        <Text className="text-3xl font-semibold text-center text-white m-5 mt-10">
          <Text className="text-quinterny-500">All</Text> the information
        </Text>
        <Text className="text-3xl font-semibold text-center text-white mx-5">
          <Text className="text-quinterny-500">One</Text> place,{" "}
          <Text className="text-quinterny-500">Few</Text> clicks
        </Text>
      </View>
      <View className="w-full items-center justify-center gap-y-4 px-5">
        <TouchableOpacity
          onPress={handleSignIn}
          className="bg-quinterny-600 p-2 rounded-lg w-full items-center justify-center"
        >
          <Text className="text-lg font-semibold text-white">Sign-in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          className="bg-white border border-quinterny-600 p-2 rounded-lg w-full items-center justify-center"
        >
          <Text className="text-lg font-semibold text-quinterny-600">
            Sign-up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
