// app/components/LogoutButton.tsx
import React, { useContext } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // Utilizamos router.replace para que el usuario no pueda retroceder a la pantalla anterior.
      // Se asume que la ruta hacia el login es "/auth/login"
      router.replace("/auth/login-screen");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.button}>
      <Ionicons name="log-out-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
  },
});
