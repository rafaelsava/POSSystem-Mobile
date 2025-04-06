// app/roles/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { ProductProvider } from "@/context/DataContext";
import { OrderProvider } from "@/context/OrderContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (

        <ProductProvider>
            <OrderProvider>
            <Stack screenOptions={{ headerShown: false }} />
            </OrderProvider>
        </ProductProvider>

  );
}