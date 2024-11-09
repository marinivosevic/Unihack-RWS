import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Weather = {
  main: string;
  description: string;
};

type ForecastData = {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: Weather[];
};

const WeatherWidget: React.FC = () => {
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const API_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=Rijeka&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Filter data to get one forecast per day
        const dailyForecast = data.list.filter(
          (_: ForecastData, index: number) => index % 8 === 0 // Assuming 3-hour intervals, get one forecast per day
        );

        setForecast(dailyForecast);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the weather data", error);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const renderIcon = (main: string) => {
    switch (main) {
      case "Clear":
        return (
          <MaterialCommunityIcons
            name="weather-sunny"
            size={40}
            color={"yellow"}
          />
        );
      case "Clouds":
        return (
          <MaterialCommunityIcons
            name="weather-cloudy"
            size={40}
            color={"white"}
          />
        );
      case "Rain":
        return (
          <MaterialCommunityIcons
            name="weather-rainy"
            size={40}
            color={"blue"}
          />
        );
      case "Snow":
        return (
          <MaterialCommunityIcons
            name="weather-snowy"
            size={40}
            color={"white"}
          />
        );
      default:
        return (
          <MaterialCommunityIcons name="weather-fog" size={40} color={"gray"} />
        );
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="p-4 gap-x-5"
    >
      {forecast.map((day, index) => (
        <View
          key={index}
          className="flex items-center my-2 w-32 bg-quinterny-300/70 pt-2 pb-1 rounded-xl"
        >
          <Text className="text-lg text-white font-bold">
            {new Date(day.dt_txt).toLocaleDateString("en-US", {
              weekday: "long",
            })}
          </Text>
          {renderIcon(day.weather[0].main)}
          <Text className="text-xl text-white font-semibold">
            {Math.round(day.main.temp)}°C
          </Text>
          <Text className="italic text-white/50">
            {day.weather[0].description}
          </Text>
        </View>
      ))}
      <View className="w-5" />
    </ScrollView>
  );
};

export default WeatherWidget;
