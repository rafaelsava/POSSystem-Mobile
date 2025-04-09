// context/OrderContext.tsx
import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/utils/FirebaseConfig"; // Asegúrate que la ruta sea correcta
import { AuthContext } from "@/context/AuthContext";

export interface Product {
    id?: string;
    photo: string;
    title: string;
    description: string;
    productType: string; 
    price: number;
  }
export interface CartItem extends Product {
  quantity: number;
}

interface OrderContextProps {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  sendOrder: () => Promise<void>;
  clearCart: () => void;
  tableNumber: string | null;
  setTableNumber: (table: string) => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
   const [tableNumber, setTableNumber] = useState<string | null>(null);
    const { currentUser } = useContext(AuthContext); 
    const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const sendOrder = async () => {
    console.log("Enviando orden:", cart);
    try {
      if (!currentUser) {
        Alert.alert("Error", "Debes iniciar sesión para hacer un pedido.");
        return;
      }
  
      const newOrder = {
        userId: currentUser.uid,
        tableNumber: tableNumber ?? "Sin número",
        items: cart.map(({ id, title, price, quantity }) => ({
          id, title, price, quantity,
        })),
        status: "Ordered",
        createdAt: Timestamp.now(),
      };
      
  
      await addDoc(collection(db, "orders"), newOrder);
  
      Alert.alert("Orden enviada", "Tu orden ha sido enviada a la cocina");
      clearCart();
    } catch (error) {
      console.error("Error al enviar la orden:", error);
      Alert.alert("Error", "Hubo un problema al enviar tu orden");
    }
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        sendOrder,
        clearCart,
        tableNumber,
        setTableNumber,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext debe usarse dentro de OrderProvider");
  }
  return context;
};
