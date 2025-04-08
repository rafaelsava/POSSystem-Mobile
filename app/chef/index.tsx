// app/roles/chef/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/FirebaseConfig";
import { useRouter } from "expo-router";

interface Order {
  id: string;
  userId: string;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  status: string;
  createdAt: any;
}

export default function ChefOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersData: Order[] = [];
        snapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error al obtener órdenes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const renderOrderItem = ({ item }: { item: Order }) => {
    const orderDate = item.createdAt?.toDate
      ? item.createdAt.toDate().toLocaleString()
      : "";
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "../chef/orderid",
            params: { orderId: item.id },
          })
        }
      >
        <Text style={styles.orderId}>Orden ID: {item.id}</Text>
        <Text style={styles.status}>Estado: {item.status}</Text>
        <Text style={styles.date}>Fecha: {orderDate}</Text>
        <View style={styles.itemsContainer}>
          {item.items.map((orderItem) => (
            <Text key={orderItem.id} style={styles.itemText}>
              {orderItem.title} x{orderItem.quantity}
            </Text>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Órdenes de Cocina</Text>
      {orders.length === 0 ? (
        <Text style={styles.empty}>No hay órdenes en este momento.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: "#fff" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#888" },
  card: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  orderId: { fontSize: 16, fontWeight: "bold" },
  status: { fontSize: 14, marginVertical: 5 },
  date: { fontSize: 12, color: "#666" },
  itemsContainer: { marginTop: 10 },
  itemText: { fontSize: 14 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
