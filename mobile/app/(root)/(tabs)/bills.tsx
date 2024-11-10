import { View, Text, TextInput, ScrollView, Switch, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from "react-native-modal";

interface Predictions {
  electricity_bill: number;
  other_costs: number;
  potential_cost_of_living: number;
  rent_bill: number;
}

const Bills = () => {
  const city = "Rijeka";
  const [rooms, setRooms] = React.useState(0);
  const [people, setPeople] = React.useState(0);
  const [area, setArea] = React.useState(0);
  const [ac, setAc] = React.useState(false);
  const [tv, setTv] = React.useState(false);
  const [flat, setFlat] = React.useState(false);
  const [income, setIncome] = React.useState(0);
  const [children, setChildren] = React.useState(0);
  const [urban, setUrban] = React.useState(false);
  const [calculating, setCalculating] = React.useState(false);
  const [predictions, setPredictions] = React.useState<Predictions>();
  const [modalVisible, setModalVisible] = React.useState(false);

  const validateFields = () => {
    if (isNaN(rooms) || rooms <= 0) {
      Alert.alert("Validation Error", "Please enter a valid number of rooms.");
      return false;
    }
    if (isNaN(people) || people <= 0) {
      Alert.alert("Validation Error", "Please enter a valid number of people.");
      return false;
    }
    if (isNaN(area) || area <= 0) {
      Alert.alert("Validation Error", "Please enter a valid house area.");
      return false;
    }
    if (isNaN(income) || income <= 0) {
      Alert.alert("Validation Error", "Please enter a valid monthly income.");
      return false;
    }
    if (isNaN(children) || children < 0) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid number of children."
      );
      return false;
    }
    return true;
  };

  const calculate = async () => {
    if (!validateFields()) return;
    setCalculating(true);
    const API_URL = process.env.EXPO_PUBLIC_BILL_API;
    try {
      const response = await fetch(`${API_URL}/bill/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          num_rooms: rooms,
          num_people: people,
          housearea: area,
          is_ac: ac ? 1 : 0,
          is_tv: tv ? 1 : 0,
          is_flat: flat ? 1 : 0,
          ave_monthly_income: income,
          num_children: children,
          is_urban: urban ? 1 : 0,
          year: new Date().getFullYear(),
          city: city,
        }),
      });

      const result = await response.json();
      setPredictions(result);
      setCalculating(false);
      setModalVisible(true);
    } catch (error) {
      console.error(error);
      setCalculating(false);
      Alert.alert("Error", "An error occurred while calculating the bill.");
    }
  };

  return (
    <SafeAreaView className="h-full bg-black/90 px-5">
      <Modal
        isVisible={modalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View className="bg-black/90 p-5 rounded-lg shadow-lg">
          {/* Title Section with Icon */}
          <View className="flex flex-row items-center justify-between mb-8">
            <Text className="text-white font-bold text-2xl">
              <Text className="text-quinterny-500">💡 </Text>Cost of Living
              Prediction
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Predictions Section */}
            <View className="gap-y-6 border-t border-gray-700 pt-4">
              {/* Predicted Electricity Cost */}
              <View className="flex flex-row justify-between items-center">
                <Text className="text-white/70">Electricity:</Text>
                <Text className="font-bold text-white">
                  {predictions?.electricity_bill.toFixed(2)} Euros
                </Text>
              </View>

              {/* Divider */}
              <View className="border-b border-gray-700 my-2" />

              {/* Predicted Other Costs */}
              <View className="flex flex-row justify-between items-center">
                <Text className="text-white/70">Other Costs:</Text>
                <Text className="font-bold text-white">
                  {predictions?.other_costs.toFixed(2)} Euros
                </Text>
              </View>

              {/* Divider */}
              <View className="border-b border-gray-700 my-2" />

              {/* Predicted Rent */}
              <View className="flex flex-row justify-between items-center">
                <Text className="text-white/70">Rent:</Text>
                <Text className="font-bold text-white">
                  {predictions?.rent_bill.toFixed(2)} Euros
                </Text>
              </View>

              {/* Divider */}
              <View className="border-b border-gray-700 my-2" />

              {/* Predicted Total Cost of Living */}
              <View className="flex flex-row justify-between items-center mt-4">
                <Text className="text-white font-semibold">
                  Total Estimated Cost:
                </Text>
                <Text className="font-bold text-quinterny-500 text-lg">
                  {predictions?.potential_cost_of_living.toFixed(2)} Euros
                </Text>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-quinterny-500 mt-8 p-4 rounded-full"
            >
              <Text className="text-white text-center font-semibold">
                Close
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-white font-bold text-2xl mt-5">
          Cost of living prediction
        </Text>
        <Text className="text-white/70 mt-5">Enter the number of rooms</Text>
        <TextInput
          className="bg-black/90 text-white border-white border-[0.5px] mt-2 p-3 rounded-md"
          placeholder="Enter the number of rooms"
          onChangeText={(text) => setRooms(parseInt(text))}
          keyboardType="numeric"
        />
        <Text className="text-white/70 mt-5">
          Enter the number of people in household
        </Text>
        <TextInput
          className="bg-black/90 text-white border-white border-[0.5px] mt-2 p-3 rounded-md"
          placeholder="Enter the number of people"
          onChangeText={(text) => setPeople(parseInt(text))}
          keyboardType="numeric"
        />
        <Text className="text-white/70 mt-5">
          Enter the house area(meters squared)
        </Text>
        <TextInput
          className="bg-black/90 text-white border-white border-[0.5px] mt-2 p-3 rounded-md"
          placeholder="Enter the house area"
          onChangeText={(text) => setArea(parseInt(text))}
          keyboardType="numeric"
        />
        <Text className="text-white/70 mt-5">Do you have an AC?</Text>
        <Switch
          className="mt-2"
          value={ac}
          onValueChange={() => setAc(!ac)}
          thumbColor={"white"}
          trackColor={{ false: "#5b3ac8", true: "#5b3ac8" }}
        />
        <Text className="text-white/70 mt-5">Do you have a TV?</Text>
        <Switch
          className="mt-2"
          value={tv}
          onValueChange={() => setTv(!tv)}
          thumbColor={"white"}
          trackColor={{ false: "#5b3ac8", true: "#5b3ac8" }}
        />
        <Text className="text-white/70 mt-5">Do you live in a flat?</Text>
        <Switch
          className="mt-2"
          value={flat}
          onValueChange={() => setFlat(!flat)}
          thumbColor={"white"}
          trackColor={{ false: "#5b3ac8", true: "#5b3ac8" }}
        />
        <Text className="text-white/70 mt-5">
          What is your monthly income in Euros?
        </Text>
        <TextInput
          className="bg-black/90 text-white border-white border-[0.5px] mt-2 p-3 rounded-md"
          placeholder="Enter your monthly income"
          onChangeText={(text) => setIncome(parseInt(text))}
          keyboardType="numeric"
        />
        <Text className="text-white/70 mt-5">
          How many children do you have?
        </Text>
        <TextInput
          className="bg-black/90 text-white border-white border-[0.5px] mt-2 p-3 rounded-md"
          placeholder="Enter the number of children"
          onChangeText={(text) => setChildren(parseInt(text))}
          keyboardType="numeric"
        />
        <Text className="text-white/70 mt-5">
          Do you live in an urban area?
        </Text>
        <Switch
          className="mt-2"
          value={urban}
          onValueChange={() => setUrban(!urban)}
          thumbColor={"white"}
          trackColor={{ false: "#5b3ac8", true: "#5b3ac8" }}
        />
        <TouchableOpacity
          disabled={calculating}
          onPress={calculate}
          className="bg-quinterny-500 mt-5 p-3 rounded-md"
        >
          <Text className="text-white text-center">
            {calculating ? "Calculating..." : "Calculate"}
          </Text>
        </TouchableOpacity>
        <View className="mt-16" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bills;
