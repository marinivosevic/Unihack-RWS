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
import * as ImagePicker from "expo-image-picker";
import CameraComponent from "@/components/CameraComponent";
import Modal from "react-native-modal";
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
  const [galleryPhoto, setGalleryPhoto] = React.useState<string | null>(null);
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

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [],
        { compress: 0.5, base64: true }
      );
      setGalleryPhoto(
        manipulatedImage.base64?.replace(/^data:image\/\w+;base64,/, "") || null
      );
    }
  };

  const handleSubmit = async () => {
    setSubmitModalVisible(true);
    setValidatingImage(true);
    setSubmitting(true);

    const imageToSend = photo || galleryPhoto;
    const base_url = "https://api.quinternary.com";

    const response = await fetch(`${base_url}/classify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        statement: "empty_garbage",
        image: imageToSend,
      }),
    });
    const data = await response.json();
    if (data.prediction) {
      setValidatingImage(false);
      setSubmitting(false);
      return;
    } else {
      setValidatingImage(true);
      const X = location?.coords.longitude;
      const Y = location?.coords.latitude;

      const response = await fetch(`${base_url}/bins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          X,
          Y,
        }),
      });
    }
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
              <ActivityIndicator size="small" color="#4ADE80" />
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
            <Text className="text-lg text-white">Take Photo +</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImage}>
          <View className="mt-5 flex items-center justify-center bg-quinterny-400 rounded-xl py-2">
            <Text className="text-lg text-white">Select from Gallery</Text>
          </View>
        </TouchableOpacity>

        {(photo || galleryPhoto) && (
          <>
            <Image
              source={{
                uri: `data:image/jpeg;base64,${photo || galleryPhoto}`,
              }}
              className="w-full h-64 mt-4 rounded-xl"
            />
            <View className="mt-5">
              <Text className="text-lg text-white">
                {photo ? "Photo" : "Gallery Photo"} ready
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!photo && !galleryPhoto}
            >
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
