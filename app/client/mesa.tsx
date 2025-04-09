// app/client/ScanTable.tsx
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useOrderContext } from "@/context/OrderContext";
import { router } from "expo-router";

export default function ScanTableScreen() {
  const { setTableNumber, tableNumber } = useOrderContext();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setTableNumber(data);
    router.replace("../client/");
  };
  

  if (hasPermission === null) {
    return <Text>Solicitando permisos de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No tienes acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      {!tableNumber && (
        <View style={styles.messageContainer}>
          <Text style={styles.infoText}>Antes de ordenar, escanea el QR de tu mesa</Text>
        </View>
      )}

      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFillObject}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    position: "absolute",
    top: 50,
    width: "100%",
    zIndex: 10,
    alignItems: "center",
  },
  infoText: {
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  mesaText: {
    backgroundColor: "#28a745",
    color: "white",
    fontSize: 18,
    padding: 10,
    borderRadius: 8,
  },
});
