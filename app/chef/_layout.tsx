// app/roles/chef/_layout.tsx
import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { OrderProvider } from "@/context/OrderContext";
import LogoutButton from "../LogoutButton";

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrderProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <LogoutButton />
        </View>
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }} />
          {children}
        </View>
      </SafeAreaView>
    </OrderProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Fondo blanco para mantener consistencia
  },
  header: {
    padding: 10,
    alignItems: "flex-end", // Ubica el botón a la derecha
    backgroundColor: "#ffff", // Color de fondo para el header (ajústalo según tus estilos)
  },
  content: {
    flex: 1,
    padding: 10, // Espaciado interno para el contenido
  },
});
