// app/roles/chef/[orderId].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/utils/FirebaseConfig";
import { useRouter, useLocalSearchParams } from "expo-router";

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

export default function ChefOrderDetail() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useLocalSearchParams() as { orderId: string };
  const router = useRouter();

  useEffect(() => {
    if (!orderId) {
      console.error("No se recibió un orderId válido");
      setLoading(false);
      return;
    }
    const docRef = doc(db, "orders", orderId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Datos de la orden actualizados:", data);
          setOrder({ id: docSnap.id, ...data } as Order);
        } else {
          console.warn("Documento no existe para orderId:", orderId);
          Alert.alert("Error", "La orden no existe");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error al obtener la orden:", error);
        Alert.alert("Error", "No se pudo obtener la orden");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [orderId]);

  const updateOrderStatus = async (newStatus: string) => {
    try {
      console.log("Actualizando orden", orderId, "a", newStatus);
      const docRef = doc(db, "orders", orderId);
      await updateDoc(docRef, { status: newStatus });
      console.log("Orden actualizada exitosamente.");
      Alert.alert("Éxito", `El estado se actualizó a "${newStatus}"`);
    } catch (error) {
      console.error("Error actualizando el estado:", error);
      Alert.alert("Error", "No se pudo actualizar el estado de la orden");
    }
  };

  // Al presionar "Iniciar Preparación", se actualiza a "Cooking"
  const handleStartOrder = () => {
    console.log("Botón Iniciar Preparación presionado");
    updateOrderStatus("Cooking");
  };

  // Al presionar "Marcar como Listo", se actualiza a "Ready for PickUp"
  const handleFinishOrder = () => {
    console.log("Botón Marcar como Listo presionado");
    updateOrderStatus("Ready for PickUp");
  };

  if (loading || !order) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Cargando orden...</Text>
      </View>
    );
  }

  console.log("Estado actual de la orden:", order.status);

  const renderItem = ({ item }: { item: Order["items"][0] }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Detalle de la Orden</Text>
      <Text style={styles.orderId}>Orden ID: {order.id}</Text>
      <Text style={styles.status}>Estado: {order.status}</Text>
      <FlatList
        data={order.items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ marginVertical: 20 }}
      />

      {order.status === "Ordered" && (
        <TouchableOpacity style={styles.button} onPress={handleStartOrder}>
          <Text style={styles.buttonText}>Iniciar Preparación</Text>
        </TouchableOpacity>
      )}
      {(order.status === "Cooking" ||
        order.status === "Cocinando" ||
        order.status === "Preparación") && (
        <TouchableOpacity style={styles.button} onPress={handleFinishOrder}>
          <Text style={styles.buttonText}>Marcar como Listo</Text>
        </TouchableOpacity>
      )}
      {(order.status === "Ready for PickUp" ||
        order.status === "Listo" ||
        order.status === "Listo para recoger") && (
        <View style={styles.finishedContainer}>
          <Text style={styles.finishedText}>La orden ya ha sido finalizada.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  orderId: { fontSize: 16, fontWeight: "bold" },
  status: { fontSize: 16, marginVertical: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  itemCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  itemTitle: { fontSize: 16, fontWeight: "600" },
  itemQuantity: { fontSize: 14, marginTop: 5 },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  finishedContainer: { alignItems: "center", marginVertical: 10 },
  finishedText: { textAlign: "center", fontSize: 16, color: "#28a745" },
  backButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007bff",
    alignItems: "center",
  },
  backButtonText: { color: "#007bff", fontSize: 16, fontWeight: "bold" },
});
