import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Utensils } from "lucide-react-native";

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Utensils size={32} color="#007bff" />
      </View>
      <Text style={styles.title}>Welcome to RestaurantPOS</Text>
      <Text style={styles.subtitle}>
        Let's set up your restaurant's point of sale system in just a few steps.
      </Text>
      <TouchableOpacity onPress={onNext} style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "rgba(0, 123, 255, 0.1)",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
  button: {
    width: "100%",
    backgroundColor: "#007bff",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
