import { Stack } from "expo-router";
import { Colors } from "../constants/Colors";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        // headerShown: false,
        animation: "slide_from_right",
        
        // Definições globais de estilo para o header
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
      }}
    />
  );
}