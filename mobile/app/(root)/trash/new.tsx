import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import * as Location from "expo-location";
import * as ImageManipulator from "expo-image-manipulator";
import CameraComponent from "@/components/CameraComponent";
import Modal from "react-native-modal";
import { set } from "zod";
import { router } from "expo-router";

interface Location {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const New = () => {
  const [openCamera, setOpenCamera] = React.useState(false);
  const [photo, setPhoto] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState<Location>();
  const [submitModalVisible, setSubmitModalVisible] = React.useState(false);
  const [validatingImage, setValidatingImage] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  useEffect(() => {
    getLocation();
  }, []);

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
    setSubmitModalVisible(true);
    setValidatingImage(true);
    setSubmitting(true);

    setTimeout(() => {
      setValidatingImage(false);
    }, 2000);

    setTimeout(() => {
      setSubmitting(false);
    }, 4000);
  };

  return (
    <>
      <Modal
        isVisible={submitModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="bg-black/70 rounded-xl p-5 shadow-lg">
          <Text className="text-xl font-bold text-white text-center mb-5">
            Process Status
          </Text>

          {/* Validation Status */}
          <View className="flex flex-row items-center justify-between my-4">
            <Text className="text-lg text-white">Validating Image...</Text>
            {validatingImage ? (
              <ActivityIndicator size="small" color="#4ADE80" /> // Light green for active state
            ) : (
              <View className="flex flex-row items-center">
                <Text className="text-lg text-green-400">Image Validated</Text>
                <Text className="ml-1 text-green-400">✔️</Text>
              </View>
            )}
          </View>

          {/* Submission Status */}
          <View className="flex flex-row items-center justify-between my-4">
            <Text className="text-lg text-white">Submitting...</Text>
            {submitting ? (
              <ActivityIndicator size="small" color="#4ADE80" />
            ) : (
              <View className="flex flex-row items-center">
                <Text className="text-lg text-green-400">Submitted</Text>
                <Text className="ml-1 text-green-400">✔️</Text>
              </View>
            )}
          </View>

          {/* Close Button */}
          <TouchableOpacity
            onPress={() => {
              router.dismiss();
              setSubmitModalVisible(false);
            }}
            className="mt-5"
          >
            <View className="bg-quinterny-400 rounded-full py-3 px-6 shadow-md">
              <Text className="text-lg text-white text-center font-semibold">
                Close
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <SafeAreaView className="px-5 bg-black/90 h-full">
        <BackButton />
        <Text className="text-2xl font-bold text-white mt-24">
          Add a new bin to the map
        </Text>

        <TouchableOpacity onPress={() => setOpenCamera(true)}>
          <View className="mt-5 flex items-center justify-center bg-quinterny-400 rounded-xl py-2">
            <Text className="text-lg text-white">Add photo +</Text>
          </View>
        </TouchableOpacity>

        {photo && (
          <>
            <Image
              source={{ uri: `data:image/jpeg;base64,${photo}` }}
              className="w-full h-64 mt-4 rounded-xl"
            />
            <View className="mt-5">
              <Text className="text-lg text-white">Photo ready</Text>
            </View>
            <TouchableOpacity onPress={handleSubmit} disabled={!photo}>
              <View className="mt-5 flex items-center justify-center bg-quinterny-400 rounded-xl py-2">
                <Text className="text-lg text-white">Submit</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
      {openCamera && (
        <CameraComponent onCloseCamera={closeCamera} onSavePhoto={savePhoto} />
      )}
    </>
  );
};

export default New;
