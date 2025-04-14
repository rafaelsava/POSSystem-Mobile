// app/roles/_layout.tsx
import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ProductProvider } from "@/context/DataContext";
import LogoutButton from "../LogoutButton";

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <SafeAreaView style={styles.container}>
        {/* Encabezado: se ubica el botón de logout */}
        <View style={styles.header}>
          <LogoutButton />
        </View>
        {/* Área de contenido */}
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }} />
          {children}
        </View>
      </SafeAreaView>
    </ProductProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff", // Pantalla blanca
  },
  header: {
    padding: 1,
    alignItems: "flex-end", // Ubica el botón a la derecha
    backgroundColor: "#0000", // Color de fondo del header (puedes ajustarlo según tus estilos)
  },
  content: {
    flex: 1,
    padding: 1,
    backgroundColor: "#0000", // Color de fondo del contenido (puedes ajustarlo según tus estilos)
  },
});
