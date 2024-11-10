import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import * as icons from "@/constants/icons";
import CameraComponent from "@/components/CameraComponent";
import * as ImageManipulator from "expo-image-manipulator";
import { getTokens } from "@/lib/secureStore";
import Modal from "react-native-modal";
import { router } from "expo-router";

const Index = () => {
  const [openCamera, setOpenCamera] = React.useState(false);
  const [photo, setPhoto] = React.useState<string | null>(null);
  const [ticket, setTicket] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);
  const city = "Rijeka";

  const closeCamera = () => {
    setOpenCamera(false);
  };

  const savePhoto = async (photo: any) => {
    try {
      // Compress the image to 50% quality before encoding it as base64
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [],
        { compress: 0.5, base64: true }
      );
      setPhoto(
        manipulatedImage.base64?.replace(/^data:image\/\w+;base64,/, "") || null
      );
      setOpenCamera(false);
    } catch (error) {
      console.error("Error encoding image to base64:", error);
    }
  };

  const handleSubmit = async () => {
    const tokens = await getTokens();
    const jwtToken = tokens?.jwtToken;

    if (!jwtToken) {
      console.error("No JWT token found");
      return;
    }

    const API_URL = process.env.EXPO_PUBLIC_SUPPORT_API;

    try {
      const response = await fetch(`${API_URL}/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          city,
          ticket,
          picture: photo,
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to submit ticket");
      }

      const data = await response.json();
      console.log("Ticket created:", data);
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  return (
    <>
      <SafeAreaView className="px-5 bg-black/90 h-full">
        <Modal isVisible={success} className="items-center justify-center">
          <View className="bg-black/90 border border-quinterny-300 w-64 h-64 rounded-xl items-center justify-center">
            <Text className="text-white text-lg font-medium">
              Ticket submitted
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSuccess(false);
                router.dismiss();
              }}
            >
              <Text className="text-quinterny-400 text-lg font-medium mt-4">
                Go back
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <BackButton />
        <Text className="text-2xl font-bold text-white mt-24">New Ticket</Text>
        <TextInput
          className="text-white text-lg font-medium mt-4"
          placeholder="Describe the issue"
          placeholderTextColor="#ffffff88"
          onChangeText={(text) => setTicket(text)}
        />
        <Text className="text-white/80 text-lg font-medium mt-6">
          Add an Image
        </Text>
        <TouchableOpacity
          disabled={photo ? true : false}
          onPress={() => setOpenCamera(true)}
          className="flex flex-row items-center mt-4"
        >
          <View className="bg-white w-12 h-12 rounded-xl items-center justify-center">
            <Image source={icons.camera} className="w-6 h-6" />
          </View>
          <Text className="text-white/80 text-lg font-medium ml-4">
            {photo ? "Photo ready" : "Take a photo"}
          </Text>
        </TouchableOpacity>
        {photo && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${photo}` }}
            className="w-full h-64 mt-4 rounded-xl"
          />
        )}
        <TouchableOpacity
          className="flex flex-row items-center mt-4"
          onPress={handleSubmit}
          disabled={!ticket || !photo}
        >
          <View className="bg-quinterny-400 flex flex-row rounded-xl px-4 py-2 items-center justify-center">
            <Text className="text-white text-lg font-medium ml-4">Submit</Text>
            <Image
              source={icons.send}
              className="w-6 h-6 ml-3"
              tintColor={"white"}
            />
          </View>
        </TouchableOpacity>
      </SafeAreaView>
      {openCamera && (
        <CameraComponent onSavePhoto={savePhoto} onCloseCamera={closeCamera} />
      )}
    </>
  );
};

export default Index;
