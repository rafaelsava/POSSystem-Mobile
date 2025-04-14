// app/roles/cashier/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import LogoutButton from "../LogoutButton";

export default function CashierIndex() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header con el botón de logout posicionado en la esquina superior derecha */}
      <View style={styles.header}>
        <LogoutButton />
      </View>
      <Text style={styles.title}>Bienvenido 👋</Text>
      <Text style={styles.subtitle}>¿Qué deseas hacer?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("../cashier/CrearPlato")}
      >
        <Text style={styles.buttonText}>🛒 Crear nuevo Plato</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("../cashier/VerOrdenes")}
      >
        <Text style={styles.buttonText}>📦 Ver estado de las órdenes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // centra el contenido verticalmente (salvo el header absoluto)
    padding: 30,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
