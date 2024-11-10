import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      <Stack.Screen name="(profile)" options={{ headerShown: false }} />
      <Stack.Screen name="ticket/index" options={{ headerShown: false }} />
      <Stack.Screen name="trash" options={{ headerShown: false }} />
      <Stack.Screen name="charger/index" options={{ headerShown: false }} />
    </Stack>
  );
}
