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
import LogoutButton from "../LogoutButton";

interface Order {
  id: string;
  userId: string;
  tableNumber: string; // Nuevo campo
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  status: string;
  createdAt: any;
}

const finishedStatuses = ["Ready for PickUp", "Listo", "Listo para recoger","Paid"];

const Timer: React.FC<{ createdAt: any; status: string }> = ({ createdAt, status }) => {
  // Calculamos en segundos para mostrar en formato HH:MM:SS
  const [elapsed, setElapsed] = useState<number>(() => {
    if (createdAt?.toDate) {
      return Math.floor((new Date().getTime() - createdAt.toDate().getTime()) / 1000);
    }
    return 0;
  });

  useEffect(() => {
    if (!createdAt?.toDate) return;
    const orderDate = createdAt.toDate();
    // Si la orden está finalizada, actualiza una sola vez
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

  // Función para formatear segundos a HH:MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <Text style={styles.timerText}>
      Tiempo transcurrido: {formatTime(elapsed)}
    </Text>
  );
};

export default function ChefOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Ordenamos por 'createdAt' en modo descendente para que la última orden aparezca primero
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
        <View style={styles.headerRow}>
          {/* Se muestra el número de mesa en vez del ID */}
          <Text style={styles.orderId}>Mesa: {item.tableNumber}</Text>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={styles.dateText}>Fecha: {orderDateStr}</Text>
        {orderDateObj && <Timer createdAt={item.createdAt} status={item.status} />}
        <View style={styles.itemsContainer}>
          {item.items.map((orderItem) => (
            <Text key={orderItem.id} style={styles.itemText}>
              • {orderItem.title} x{orderItem.quantity}
            </Text>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" ,paddingBottom: 20}}>
      <Text style={styles.header}>Órdenes de Cocina</Text>
      <LogoutButton></LogoutButton>
      </View>
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 70 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#888" },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  orderId: { fontWeight: "bold" },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginLeft: 10,
    color: "#FF5722",
  },
  dateText: { fontSize: 12, color: "#666" },
  timerText: { fontSize: 14, color: "#333", marginTop: 4 },
  itemsContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
  },
  itemText: { fontSize: 14, color: "#555" },
});