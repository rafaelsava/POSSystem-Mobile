// app/cashier/VerOrdenes.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function OrderStatusScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ordered":
        return "📝";
      case "Cooking":
        return "🔥";
      case "Ready for PickUp":
        return "✅";
      case "Ready for Payment":
        return "💲";
      case "Paid":
        return "✔️";
      default:
        return "❓";
    }
  };

  // Navega a PaymentScreen pasando el pedido seleccionado (serializado a JSON)
  const handleProcessPayment = (order: any) => {
    router.push({
       pathname: "../cashier/PaymentScreen",
       params: { order: JSON.stringify(order) }
    });
  };

  // Actualiza el estado de la orden de "Ready for PickUp" a "Ready for Payment"
  const handleMarkReadyForPayment = async (order: any) => {
    try {
      const db = getFirestore();
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, { status: "Ready for Payment" });
      Alert.alert("Actualizado", "El pedido se ha actualizado a 'Ready for Payment'.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado del pedido.");
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pedidos</Text>

      <View style={styles.filterContainer}>
        {["All", "Ordered", "Cooking", "Ready for PickUp", "Ready for Payment", "Paid"].map((status) => (
          <Text
            key={status}
            onPress={() => setStatusFilter(status === "All" ? null : status)}
            style={[
              styles.filterButton,
              statusFilter === status || (status === "All" && !statusFilter)
                ? styles.filterButtonActive
                : {},
            ]}
          >
            {status}
          </Text>
        ))}
      </View>

      {filteredOrders.length === 0 ? (
        <Text style={styles.empty}>No hay pedidos en este estado</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.orderId}>Pedido</Text>
              <View style={styles.headerRow}>
                <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <Text style={styles.mesa}>Mesa: {item.tableNumber}</Text>
              <Text>Fecha: {new Date(item.createdAt.seconds * 1000).toLocaleString()}</Text>
              <Text>Subtotal: ${item.subtotal}$</Text>
              <Text style={styles.itemsTitle}>Productos:</Text>
              {item.items.map((product: any, index: number) => (
                <Text key={index}>• {product.title} x{product.quantity}</Text>
              ))}
              {item.status === "Ready for PickUp" && (
                <TouchableOpacity style={styles.paymentButton} onPress={() => handleMarkReadyForPayment(item)}>
                  <Text style={styles.paymentButtonText}>Listo para Cobrar</Text>
                </TouchableOpacity>
              )}
              {item.status === "Ready for Payment" && (
                <TouchableOpacity style={styles.paymentButton} onPress={() => handleProcessPayment(item)}>
                  <Text style={styles.paymentButtonText}>Procesar Pago</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 70 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#888" },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  orderId: { fontWeight: "bold" },
  itemsTitle: { marginTop: 8, fontWeight: "bold" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 3, gap: 8 },
  statusText: { fontSize: 16, fontWeight: "bold", textTransform: "capitalize" },
  statusIcon: { fontSize: 20 },
  mesa: { marginBottom: 5 },
  filterContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15, flexWrap: "wrap" },
  filterButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: "#ccc", margin: 4, color: "#555" },
  filterButtonActive: { backgroundColor: "#007bff", color: "#fff", borderColor: "#007bff" },
  paymentButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 8, marginTop: 10, alignItems: "center" },
  paymentButtonText: { color: "#fff", fontWeight: "bold" },
});
