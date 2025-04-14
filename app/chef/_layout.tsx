// app/roles/chef/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { OrderProvider } from "@/context/OrderContext";

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrderProvider>
      <Stack screenOptions={{ headerShown: false }} />
      {children}
    </OrderProvider>
  );
}
