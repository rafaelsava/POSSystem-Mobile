import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import type { User } from "../../interfaces/common";
import { AuthContext } from "@/context/AuthContext";

interface ConfirmationScreenProps {
  userData: User;
  onPrev: () => void;
}

export default function ConfirmationScreen({ userData, onPrev }: ConfirmationScreenProps) {
  const { register } = useContext(AuthContext);

  const handleSubmit = async () => {
    const success = await register(userData);
    if (success) {
      Alert.alert("Success", "Registration successful! You can now log in to your account.");
    } else {
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "client":
        return "Client";
      case "chef":
        return "Chef";
      case "cashier":
        return "Cashier";
      default:
        return role;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.checkIcon}>✅</Text>
      </View>
      <Text style={styles.title}>Confirm Your Information</Text>
      <Text style={styles.subtitle}>Please review your information before completing registration.</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{userData.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{getRoleLabel(userData.role)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Password:</Text>
          <Text style={styles.value}>••••••••</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onPrev} style={[styles.button, styles.outlineButton]}>
          <Text style={styles.buttonTextOutline}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Complete Registration</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#d4edda",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  checkIcon: {
    fontSize: 30,
    color: "#28a745",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "gray",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  outlineButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007bff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextOutline: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
