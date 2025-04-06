import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import type { User } from "../../interfaces/common";

interface PersonalInfoScreenProps {
  userData: User;
  updateUserData: (data: Partial<User>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PersonalInfoScreen({ userData, updateUserData, onNext, onPrev }: PersonalInfoScreenProps) {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const validate = () => {
    const newErrors = {
      name: userData.name ? "" : "Name is required",
      email: userData.email ? "" : "Email is required",
    };

    if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información Personal</Text>
      <Text style={styles.subtitle}>Cuéntanos un poco sobre ti para crear tu cuenta</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          value={userData.name}
          onChangeText={(text) => updateUserData({ name: text })}
          placeholder="John Doe"
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userData.email}
          onChangeText={(text) => updateUserData({ email: text })}
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onPrev} style={[styles.button, styles.outlineButton]}>
          <Text style={styles.buttonTextOutline}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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