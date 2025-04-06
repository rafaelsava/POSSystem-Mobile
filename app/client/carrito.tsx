// app/client/Cart.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useOrderContext } from "@/context/OrderContext";
import { CartItem } from "@/context/OrderContext";
import { Image } from "react-native";

export default function CartScreen() {
  const { cart, updateItemQuantity, removeFromCart, sendOrder } = useOrderContext();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const confirmSendOrder = () => {
    if (cart.length === 0) {
      Alert.alert("Carrito vacío", "Agrega productos antes de continuar.");
      return;
    }
    Alert.alert("Confirmar orden", "¿Deseas enviar tu orden?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Enviar",
        onPress: () => sendOrder(),
      },
    ]);
  };


  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      {item.photo && (
        <Image source={{ uri: item.photo }} style={styles.image} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
  
        <View style={styles.quantityRow}>
          <TouchableOpacity
            onPress={() => item.id && updateItemQuantity(item.id, item.quantity - 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityNumber}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => item.id && updateItemQuantity(item.id, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => item.id && removeFromCart(item.id)}
        >
          <Text style={styles.removeText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tu Carrito</Text>
      {cart.length === 0 ? (
        <Text style={styles.empty}>Tu carrito está vacío</Text>
      ) : (
        <>
            <FlatList<CartItem>
            data={cart}
            keyExtractor={(item) => item.id || ""}
            renderItem={renderItem}
            />

          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
          <TouchableOpacity style={styles.orderButton} onPress={confirmSendOrder}>
            <Text style={styles.orderButtonText}>Enviar Orden</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" ,paddingTop: 50 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#888" },
  card: {
    flexDirection: "row", // ← importante para mostrar imagen al lado
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontWeight: "bold", fontSize: 16 },
  price: { marginTop: 5, color: "#2ecc71" },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  quantityText: { fontSize: 18 },
  quantityNumber: { marginHorizontal: 15, fontSize: 16 },
  removeButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  removeText: { color: "#e74c3c" },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginVertical: 10,
  },
  orderButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  orderButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
});
