import React, { useEffect, useState } from "react";
import MapView from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import * as Location from "expo-location";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function Map() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [dropdown, setDropdown] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const latitudeDelta = 0.0922;
  const longitudeDelta = 0.0421;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const coords = await Location.geocodeAsync("Rijeka");
      if (coords && coords.length > 0) {
        setLocation({
          latitude: coords[0].latitude,
          longitude: coords[0].longitude,
        });
      } else {
        console.log("Location not found");
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setDropdown(!dropdown)}
        className={`absolute top-24 right-5 bg-black/60 p-2 ${
          !dropdown ? "rounded-lg" : "rounded-lg"
        } z-50 w-32 items-center`}
      >
        <Text className="text-white">
          {selected ? `${selected}` : "Select filter"}
        </Text>
      </TouchableOpacity>
      {dropdown && (
        <View className="absolute top-[135px] bg-black/60 right-5 z-50 rounded-lg w-32 items-center">
          <TouchableOpacity
            onPress={() => {
              setSelected("Busses");
              setDropdown(false);
            }}
            className="border-b border-quinterny-600 w-full p-2 items-center"
          >
            <Text className="text-white">Busses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelected("Trash cans");
              setDropdown(false);
            }}
            className="border-b border-quinterny-600 w-full p-2 items-center"
          >
            <Text className="text-white">Trash Cans</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelected("Superchargers");
              setDropdown(false);
            }}
            className="w-full p-2 items-center"
          >
            <Text className="text-white">Superchargers</Text>
          </TouchableOpacity>
        </View>
      )}
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta,
            longitudeDelta,
          }}
          showsUserLocation={true}
          mapType="mutedStandard"
          userInterfaceStyle="dark"
        />
      ) : (
        <View style={styles.map} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
