// app/roles/client/index.tsx
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useOrderContext } from "@/context/OrderContext";
import LogoutButton from "../LogoutButton"; // Se importa el botón de logout

export default function ClientIndex() {
  const navigation = useNavigation();
  const { setTableNumber, tableNumber } = useOrderContext();
  const router = useRouter();

  useEffect(() => { 
    if (!tableNumber) {
      router.push('../client/mesa'); // Redirige a la pantalla de escaneo si no hay número de mesa
    }
  }, [tableNumber, navigation]);

  return (
    <View style={styles.container}>
      {/* Header con botón de logout */}
      <View style={styles.header}>
        <LogoutButton />
      </View>
      <Text style={styles.title}>Bienvenido 👋. </Text>
      <Text style={styles.subtitle1}>Estas ubicado en la mesa {tableNumber}</Text>
      <Text style={styles.subtitle}>¿Qué deseas hacer?</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("../client/CrearOrden")}
      >
        <Text style={styles.buttonText}>🛒 Crear nueva orden</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("../client/EstadoOrden")}
      >
        <Text style={styles.buttonText}>📦 Ver estado de mis órdenes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.thirdButton]}
        onPress={() => {
          router.push("../client/mesa");
          setTableNumber("");
        }}
      >
        <Text style={styles.buttonText}>🪑 Elegir nueva mesa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centra el contenido (excepto el header absoluto)
    padding: 30,
    backgroundColor: "#fff",
  },
  // Header posicionado absolutamente en la esquina superior derecha
  header: {
    position: "absolute",
    top: 50,
    right: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#000000",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
    color: "#666",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#28a745",
  },
  thirdButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
