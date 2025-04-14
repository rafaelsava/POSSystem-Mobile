// app/cashier/ReceiptScreen.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRoute, useNavigation, StackActions, NavigationProp } from "@react-navigation/native";

type CashierStackParamList = {
  PaymentScreen: { order: string };
  ReceiptScreen: { order: string };
};

type ReceiptScreenParams = {
  order: string;
};

export default function ReceiptScreen() {
  const route = useRoute();
  const { order: orderParam } = route.params as ReceiptScreenParams;
  const order = typeof orderParam === "string" ? JSON.parse(orderParam) : orderParam;
  const navigation = useNavigation<NavigationProp<CashierStackParamList>>();

  // Cabecera de la tabla
  const renderHeader = () => (
    <View style={styles.gridRow}>
      <Text style={[styles.gridCell, styles.gridHeader]}>Producto</Text>
      <Text style={[styles.gridCell, styles.gridHeader]}>Cant.</Text>
      <Text style={[styles.gridCell, styles.gridHeader]}>Precio</Text>
    </View>
  );

  // Cada fila de producto
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.gridRow}>
      <Text style={styles.gridCell}>{item.title}</Text>
      <Text style={styles.gridCell}>{item.quantity}</Text>
      <Text style={styles.gridCell}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recibo</Text>
      <Text style={styles.label}>Orden ID: {order.id}</Text>
      <Text style={styles.label}>Mesa: {order.tableNumber}</Text>
      <Text style={styles.label}>Fecha: {new Date().toLocaleString()}</Text>

      <View style={styles.receiptContainer}>
        {renderHeader()}
        <FlatList
          data={order.items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${order.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Impuesto (10%)</Text>
          <Text style={styles.summaryValue}>${order.tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, styles.totalLabel]}>Total</Text>
          <Text style={[styles.summaryValue, styles.totalValue]}>${order.total.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.finalButton}
        onPress={() => navigation.dispatch(StackActions.popToTop())}
      >
        <Text style={styles.finalButtonText}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 70 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  label: { fontSize: 16, textAlign: "center", marginBottom: 5 },
  receiptContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 20,
  },
  gridRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  gridCell: {
    flex: 1,
    textAlign: "center",
  },
  gridHeader: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 10,
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
  },
  totalLabel: {
    fontWeight: "bold",
  },
  totalValue: {
    fontWeight: "bold",
  },
  finalButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  finalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
