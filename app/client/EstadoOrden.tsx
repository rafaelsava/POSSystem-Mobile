// app/client/OrderStatusScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getFirestore, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function OrderStatusScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    console.log("Query:", q); // Debugging line 

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Pedidos</Text>
      {orders.length === 0 ? (
        <Text style={styles.empty}>No tienes pedidos aún</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.orderId}>Pedido</Text>
              <Text>Estado: {item.status}</Text>
              <Text>Fecha: {new Date(item.createdAt.seconds * 1000).toLocaleString()}</Text>
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
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
});
