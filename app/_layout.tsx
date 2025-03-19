import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <AuthProvider>
    <Stack>
      <Stack.Screen ></Stack.Screen>
    </Stack>
  </AuthProvider>

}
