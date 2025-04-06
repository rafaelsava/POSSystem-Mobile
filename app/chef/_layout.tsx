// app/roles/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { ProductProvider } from "@/context/DataContext";

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ProductProvider>
  );
}