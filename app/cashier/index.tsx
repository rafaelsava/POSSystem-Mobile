// app/roles/client/index.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ClientIndex() {
  
  const router = useRouter();


  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido 👋 </Text>
      <Text style={styles.subtitle}>¿Qué deseas hacer?</Text>


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("../cashier/CrearPlato")}
      >
        <Text style={styles.buttonText}>🛒 Crear nuevo Plato</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("../cashier/VerOrdenes")}
      >
        <Text style={styles.buttonText}>📦 Ver estado de las órdenes</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#000000",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
    color: "#666",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  thirdButton:{
    backgroundColor: "#dc3545",
  }
});
