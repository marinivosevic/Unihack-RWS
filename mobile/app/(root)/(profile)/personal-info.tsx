import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";

const PersonalInfo = () => {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [age, setAge] = useState("30");
  const [phone, setPhone] = useState("+1 (555) 123-4567");

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("User logged out");
  };

  return (
    <SafeAreaView className="flex-1 bg-black/90 p-4">
      <BackButton />

      {/* Personal Information Display */}
      <ScrollView className="">
        <Text className="text-white text-2xl font-bold mb-4 mt-20">
          Personal Information
        </Text>

        {/* Personal Info Sections */}
        <View className="mb-4">
          <Text className="text-white text-lg">First Name:</Text>
          <TextInput
            className="bg-quinterny-300 text-white/80 text-lg p-2 rounded-md"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-white text-lg">Last Name:</Text>
          <TextInput
            className="bg-quinterny-300 text-white/80 text-lg p-2 rounded-md"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-white text-lg">Email:</Text>
          <TextInput
            className="bg-quinterny-300 text-white/80 text-lg p-2 rounded-md"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View className="mb-4">
          <Text className="text-white text-lg">Age:</Text>
          <TextInput
            className="bg-quinterny-300 text-white/80 text-lg p-2 rounded-md"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        <View className="mb-4">
          <Text className="text-white text-lg">Phone:</Text>
          <TextInput
            className="bg-quinterny-300 text-white/80 text-lg p-2 rounded-md"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        {/* Logout Button */}
        <TouchableOpacity
          className="bg-quinterny-500 p-2 rounded-md mt-6"
          onPress={handleLogout}
        >
          <Text className="text-white text-base font-bold text-center">
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalInfo;
