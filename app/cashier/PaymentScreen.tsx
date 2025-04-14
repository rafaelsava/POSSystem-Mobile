// app/cashier/PaymentScreen.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRoute, useNavigation, NavigationProp } from "@react-navigation/native";
import { getFirestore, doc, updateDoc, Timestamp } from "firebase/firestore";

type CashierStackParamList = {
  PaymentScreen: { order: string };
  ReceiptScreen: { order: string };
};

type PaymentScreenParams = {
  order: string;
};

export default function PaymentScreen() {
  const route = useRoute();
  const { order: orderParam } = route.params as PaymentScreenParams;
  const order = typeof orderParam === "string" ? JSON.parse(orderParam) : orderParam;
  
  const taxRate = 0.1;
  const tax = order.subtotal * taxRate;
  const total = order.subtotal + tax;
  
  const navigation = useNavigation<NavigationProp<CashierStackParamList>>();

  const handleConfirmPayment = async () => {
    try {
      const db = getFirestore();
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, {
        status: "Paid",
        paymentConfirmedAt: Timestamp.now(),
        tax: tax,
        total: total,
      });
      // Tras confirmar el pago se navega a ReceiptScreen
      navigation.navigate("ReceiptScreen", { order: JSON.stringify({ ...order, tax, total }) });
    } catch (error) {
      // Manejo del error según convenga
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del Pedido</Text>
      <Text>Mesa: {order.tableNumber}</Text>
      <Text>Fecha: {new Date(order.createdAt.seconds * 1000).toLocaleString()}</Text>
      
      <FlatList 
        data={order.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.itemText}>
            {item.title} x{item.quantity} - ${ (item.price * item.quantity).toFixed(2) }
          </Text>
        )}
      />

      <Text style={styles.summaryText}>Subtotal: ${order.subtotal.toFixed(2)}</Text>
      <Text style={styles.summaryText}>Impuesto (10%): ${tax.toFixed(2)}</Text>
      <Text style={styles.summaryText}>Total: ${total.toFixed(2)}</Text>

      <TouchableOpacity style={styles.button} onPress={handleConfirmPayment}>
        <Text style={styles.buttonText}>Confirmar Pago</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 70 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  itemText: { fontSize: 16, marginBottom: 4 },
  summaryText: { fontSize: 16, marginTop: 10 },
  button: { backgroundColor: "#28a745", padding: 15, borderRadius: 8, marginTop: 20, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
