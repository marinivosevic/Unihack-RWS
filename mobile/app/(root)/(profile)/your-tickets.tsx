import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getTokens } from "@/lib/secureStore";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

interface Ticket {
  id: number;
  ticket: string;
  published_at: string;
  picture: string;
  sender: string;
}

const YourTickets = () => {
  const API_URL = process.env.EXPO_PUBLIC_SUPPORT_API;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserTickets = async () => {
      setLoading(true);
      const tokens = await getTokens();
      const jwtToken = tokens?.jwtToken;

      try {
        const response = await fetch(`${API_URL}/support/sent`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const data = await response.json();
        setTickets(data.tickets);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getUserTickets();
  }, []);

  return (
    <SafeAreaView className="h-full bg-black/90 px-5">
      {/* Modal for displaying ticket details */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View className="bg-black/80 p-6 py-10 rounded-lg shadow-lg">
          {/* Close Button */}
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold mb-4">
            {selectedTicket?.ticket}
          </Text>
          <Text className="text-white/60 mb-2">
            {selectedTicket?.published_at}
          </Text>
          <Text className="text-white mb-5">{selectedTicket?.sender}</Text>
          {selectedTicket?.picture && (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${selectedTicket.picture.replace(
                  /^data:image\/jpeg;base64,/,
                  ""
                )}`,
              }}
              style={{ width: "100%", height: 200, borderRadius: 10 }}
              className="shadow-lg"
            />
          )}
        </View>
      </Modal>

      <BackButton />
      <View>
        <Text className="text-white text-2xl mt-24 font-bold">
          Your Tickets
        </Text>

        {/* Loading Indicator */}
        {loading && (
          <View className="flex justify-center items-center mt-5">
            <ActivityIndicator size="large" color="#5b3ac8" />
          </View>
        )}

        {/* Ticket List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {tickets && tickets.length === 0 ? (
            <Text className="text-white/60 text-center mt-10">
              No tickets available
            </Text>
          ) : (
            tickets.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                onPress={() => {
                  setSelectedTicket(ticket);
                  setModalVisible(true);
                }}
                className="my-4 bg-quinterny-500/80 border border-quinterny-400 p-4 rounded-lg shadow-md"
              >
                <Text className="text-white font-semibold">
                  {ticket.ticket}
                </Text>
                <Text className="text-white/60 mt-2">
                  {ticket.published_at}
                </Text>
              </TouchableOpacity>
            ))
          )}
          <View className="h-28" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default YourTickets;
