// app/roles/_layout.tsx
import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ProductProvider } from "@/context/DataContext";
import { OrderProvider } from "@/context/OrderContext";
import LogoutButton from "../LogoutButton";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <OrderProvider>
        <SafeAreaView style={styles.container}>
          {/* Encabezado dentro del contenedor blanco */}
          <View style={styles.header}>
            <LogoutButton />
          </View>
          {/* Área principal de contenido */}
          <View style={styles.content}>
            <Stack screenOptions={{ headerShown: false }} />
            {children}
          </View>
        </SafeAreaView>
      </OrderProvider>
    </ProductProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Fondo blanco para toda la pantalla
  },
  header: {
    padding: 10,
    alignItems: "flex-end", // Ubica el botón a la derecha dentro del área blanca
  },
  content: {
    flex: 1,
    padding: 10, // Ajusta según convenga para un buen espaciado
  },
});
