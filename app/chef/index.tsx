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

const finishedStatuses = ["Ready for PickUp", "Listo", "Listo para recoger"];

const Timer: React.FC<{ createdAt: any; status: string }> = ({ createdAt, status }) => {
  // Trabajamos en segundos para poder mostrar HH:MM:SS
  const [elapsed, setElapsed] = useState<number>(() => {
    if (createdAt?.toDate) {
      return Math.floor((new Date().getTime() - createdAt.toDate().getTime()) / 1000);
    }
    return 0;
  });

  useEffect(() => {
    if (!createdAt?.toDate) return;
    const orderDate = createdAt.toDate();
    // Si la orden está finalizada, actualiza el timer una sola vez y no continúa
    if (finishedStatuses.includes(status)) {
      setElapsed(Math.floor((new Date().getTime() - orderDate.getTime()) / 1000));
      return;
    }
    const timer = setInterval(() => {
      const diff = Math.floor((new Date().getTime() - orderDate.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);
    return () => clearInterval(timer);
  }, [createdAt, status]);

  // Función para formatear los segundos a HH:MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <Text style={styles.timePassed}>
      Tiempo transcurrido: {formatTime(elapsed)}
    </Text>
  );
};

export default function ChefOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Orden descendente para que la última orden pedida aparezca primero
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
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
    const orderDateObj = item.createdAt?.toDate ? item.createdAt.toDate() : null;
    const orderDateStr = orderDateObj ? orderDateObj.toLocaleString() : "";
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
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Orden ID: {item.id}</Text>
          <Text style={styles.status}>Estado: {item.status}</Text>
        </View>
        <Text style={styles.date}>Fecha: {orderDateStr}</Text>
        {orderDateObj && <Timer createdAt={item.createdAt} status={item.status} />}
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
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f2f2f2",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "#888",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF5722",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  timePassed: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
  },
  itemsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
  },
  itemText: {
    fontSize: 14,
    color: "#555",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
