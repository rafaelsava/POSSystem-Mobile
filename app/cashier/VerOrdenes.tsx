// app/client/OrderStatusScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getFirestore, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";


export default function OrderStatusScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);


  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();

    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
      
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
    console.log("Status:", status);
    switch (status) {
      case "Ordered":
        return <MaterialCommunityIcons name="clipboard-text-clock" size={24} color="#f39c12" />;
      case "Cooking":
        return <FontAwesome5 name="fire" size={24} color="#e67e22" />;
      case "Ready for PickUp":
        return <Ionicons name="checkmark-done-circle" size={24} color="#27ae60" />;
      default:
        return <Ionicons name="help-circle-outline" size={24} color="#7f8c8d" />;
    }
  };

  const filteredOrders = statusFilter
  ? orders.filter((order) => order.status === statusFilter)
  : orders;

  return (
    
    <View style={styles.container}>
      <Text style={styles.header}>Pedidos</Text>

      <View style={styles.filterContainer}>
      {["All", "Ordered", "Cooking", "Ready for PickUp", "Paid"].map((status) => (
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
                    {getStatusIcon(item.status)}
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
              <Text style={styles.mesa}>Mesa: {item.tableNumber}</Text>
              <Text>Fecha: {new Date(item.createdAt.seconds * 1000).toLocaleString()}</Text>
              <Text>Subtotal: {item.subtotal}$</Text>
              <Text style={styles.itemsTitle}>Productos:</Text>
              {item.items.map((product: any, index: number) => (
                <Text key={index}>• {product.title} x{product.quantity}</Text>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" ,paddingTop: 70 },
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  mesa:{
    marginBottom: 5
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 4,
    color: "#555",
  },
  filterButtonActive: {
    backgroundColor: "#007bff",
    color: "#fff",
    borderColor: "#007bff",
  },
  
});
