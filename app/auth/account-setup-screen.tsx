import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import type { User } from "../../interfaces/common";

interface AccountSetupScreenProps {
  userData: User;
  updateUserData: (data: Partial<User>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function AccountSetupScreen({ userData, updateUserData, onNext, onPrev }: AccountSetupScreenProps) {
  const [errors, setErrors] = useState({
    password: "",
    role: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {
      password: userData.password ? "" : "Password is required",
      role: userData.role ? "" : "Please select a role",
    };

    if (userData.password && userData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
      <Text style={styles.title}>Account Setup</Text>
      <Text style={styles.subtitle}>Create a secure password and select your role.</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showPassword}
            value={userData.password}
            onChangeText={(text) => updateUserData({ password: text })}
            placeholder="Create a strong password"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
            <Text>{showPassword ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Your Role</Text>
        {(['client', 'chef', 'cashier'] as const).map((role) => (
          <TouchableOpacity
            key={role}
            style={[styles.roleButton, userData.role === role && styles.roleButtonSelected]}
            onPress={() => updateUserData({ role })}
          >
            <Text style={styles.roleText}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
          </TouchableOpacity>
        ))}
        {errors.role ? <Text style={styles.errorText}>{errors.role}</Text> : null}
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
    borderColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  toggleButton: {
    padding: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  roleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 4,
  },
  roleButtonSelected: {
    backgroundColor: "#007bff",
  },
  roleText: {
    fontSize: 16,
    fontWeight: "bold",
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