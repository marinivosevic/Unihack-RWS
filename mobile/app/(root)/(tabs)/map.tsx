import React, { useEffect, useState, useMemo } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import * as apiClient from "@/lib/apiClient";
import ContainersJson from "@/constants/container.json";
import { getTokens } from "@/lib/secureStore";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface TrashCan {
  _id: number;
  "GRAD-OPINA": string;
  NASELJE: string;
  "M_O ODBOR": string;
  "NAZIV ULICE": string;
  KBR: string;
  KBR_DOD: string;
  VRSTA_POSUDE: string;
  "INV.BR.": number;
  VOLUMEN: number;
  LOKACIJA: string;
  POSTOLJE: string;
  "VRSTA OTPADA": string;
  "TIP POSUDE": string;
  "KORISNIK POSUDE": string;
  X: string;
  Y: string;
}

interface ParkingPaymentTime {
  dani_i_sati: string;
  vrijeme_start: string;
  vrijeme_kraj: string;
}

// Define the structure for Containers data
interface ContainersData {
  result: {
    records: TrashCan[];
  };
}

interface Supercharger {
  latitude: number;
  longitude: number;
  name: string;
}

interface Parking {
  parking_name: string;
  slobodno: number;
  kapacitet: number;
  lokacija?: {
    // Made optional
    lat: number;
    lng: number;
  };
  highest_cijena: number;
  vrijeme_naplate: ParkingPaymentTime[];
  live_status: boolean;
}

// Assert the type of the imported JSON data
const Containers = ContainersJson as ContainersData;

export default function Map() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [dropdown, setDropdown] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState<apiClient.RacStatusPublic[]>([]);
  const [superchargers, setSuperchargers] = useState<Supercharger[]>([]);
  const [parking, setParking] = useState<any[]>([]);

  const formatWorkingHours = (
    vrijeme_naplate: ParkingPaymentTime[]
  ): string => {
    return vrijeme_naplate
      .map((time) => {
        const { dani_i_sati, vrijeme_start, vrijeme_kraj } = time;
        let days = "";
        let workingHours = "";

        if (dani_i_sati.includes("Radnim danom")) {
          days += "Mon-Fri ";
        }
        if (dani_i_sati.includes("Subotom")) {
          days += "Sat ";
        }
        if (dani_i_sati.includes("nedjeljom")) {
          days += "Sun ";
        }

        workingHours = `${vrijeme_start} - ${vrijeme_kraj}`;

        return `${days.trim()}: ${workingHours}`;
      })
      .join("; ");
  };

  const getParkingMarkerColor = (
    slobodno: number,
    kapacitet: number,
    live_status: boolean
  ): string => {
    if (!live_status) {
      return "gray";
    }
    const availability = slobodno / kapacitet;
    if (availability > 0.7) {
      return "green";
    } else if (availability > 0.3) {
      return "orange";
    } else {
      return "red";
    }
  };

  const getDistanceFromLatLonInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

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

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchBuses = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getAutobusi();
        console.log(response);
        if (!response.err && response.res) {
          setBuses(response.res);
        } else {
          console.error(response.msg || "Failed to fetch buses.");
        }
      } catch (err: any) {
        console.error(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (selected === "Busses") {
      // Fetch immediately
      fetchBuses();
      // Set up polling every 10 seconds
      intervalId = setInterval(fetchBuses, 10000);
    }

    // Cleanup function to clear the interval
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selected]);

  useEffect(() => {
    const API_URL = process.env.EXPO_PUBLIC_TPS_API;

    const getAllParking = async () => {
      const API_URL =
        "https://67l89bzn2b.execute-api.eu-central-1.amazonaws.com/api-v1";
      const tokens = await getTokens();
      const jwtToken = tokens?.jwtToken;

      try {
        const response = await fetch(`${API_URL}/parking-data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const data = await response.json();
        const processedData: Parking[] = data
          .filter((item: any) => item.parking_data.lokacija) // Filter out entries without lokacija
          .map((item: any) => {
            const highestCijena =
              item.parking_data.cijena.length > 0
                ? Math.max(
                    ...item.parking_data.cijena.map((c: any) => c.cijena)
                  )
                : 0; // Default value or handle as needed
            return {
              parking_name: item.parking_name,
              slobodno: item.parking_data.slobodno,
              kapacitet: item.parking_data.kapacitet,
              lokacija: item.parking_data.lokacija, // Safe to assign now
              highest_cijena: highestCijena,
              vrijeme_naplate: item.parking_data.vrijeme_naplate,
              live_status:
                item.parking_data.status_sustava === "OK" ? true : false,
            };
          });

        setParking(processedData);
      } catch (err) {
        console.error(err);
      }
    };

    const getAllSuperChargers = async () => {
      const tokens = await getTokens();
      const jwtToken = tokens?.jwtToken;
      try {
        const response = await fetch(`${API_URL}/superchargers/Rijeka`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const data = await response.json();
        console.log(data.chargers);
        setSuperchargers(data.chargers);
      } catch (err) {
        console.error(err);
      }
    };

    if (selected === "Superchargers") {
      getAllSuperChargers();
    }

    if (selected === "Parking") {
      getAllParking();
    }
  }, [selected]);

  const filteredTrashContainers = useMemo(() => {
    if (!location) return []; // Return an empty array if location is null

    return Containers.result.records.filter((container) => {
      const containerLatitude = parseFloat(container.Y.replace(",", "."));
      const containerLongitude = parseFloat(container.X.replace(",", "."));
      const distance = getDistanceFromLatLonInMeters(
        location.latitude,
        location.longitude,
        containerLatitude,
        containerLongitude
      );
      return distance <= 2500; // 500 meters
    });
  }, [Containers.result.records, location]);

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
              setSelected("Parking");
              setDropdown(false);
            }}
            className="border-b border-quinterny-600 w-full p-2 items-center"
          >
            <Text className="text-white">Parking</Text>
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
        >
          {selected === "Busses" && buses.length > 0
            ? buses.map((bus) => (
                <Marker
                  key={bus.gbr}
                  coordinate={{
                    latitude: bus.lat!,
                    longitude: bus.lon!,
                  }}
                  title={bus.gbr?.toString()}
                  description={`Distance: ${getDistanceFromLatLonInMeters(
                    location.latitude,
                    location.longitude,
                    bus.lat!,
                    bus.lon!
                  ).toFixed(2)} m`}
                />
              ))
            : null}
          {selected === "Trash cans" &&
            filteredTrashContainers.map((container) => {
              const latitude = parseFloat(container.Y.replace(",", "."));
              const longitude = parseFloat(container.X.replace(",", "."));

              return (
                <Marker
                  key={container._id}
                  coordinate={{
                    latitude,
                    longitude,
                  }}
                  pinColor="green"
                  title={container["NAZIV ULICE"]}
                  description={container["VRSTA_POSUDE"]}
                />
              );
            })}
          {selected === "Superchargers" &&
            superchargers.map((charger) => (
              <Marker
                key={charger.name}
                coordinate={{
                  latitude: charger.longitude,
                  longitude: charger.latitude,
                }}
                pinColor="yellow"
                title={charger.name}
              />
            ))}
          {selected === "Parking" &&
            parking.map((park: Parking) => {
              if (!park.lokacija) {
                return null;
              }
              // Assuming `park.lokacija` has `lat` and `lon` properties
              const { lat, lng } = park.lokacija;

              return (
                <Marker
                  key={park.parking_name}
                  coordinate={{
                    latitude: lat,
                    longitude: lng,
                  }}
                  pinColor={getParkingMarkerColor(
                    park.slobodno,
                    park.kapacitet,
                    park.live_status
                  )}
                  title={park.parking_name}
                  description={`Slobodno: ${park.slobodno}/${
                    park.kapacitet
                  }; ${formatWorkingHours(park.vrijeme_naplate)}`}
                />
              );
            })}
        </MapView>
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
