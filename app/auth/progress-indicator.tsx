import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepCircle,
              index + 1 === currentStep
                ? styles.currentStep
                : index + 1 < currentStep
                ? styles.completedStep
                : styles.pendingStep,
            ]}
          >
            <Text style={styles.stepText}>{index + 1}</Text>
          </View>
        ))}
      </View>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  currentStep: {
    backgroundColor: "#007bff",
  },
  completedStep: {
    backgroundColor: "rgba(0, 123, 255, 0.2)",
  },
  pendingStep: {
    backgroundColor: "#ccc",
  },
  stepText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#007bff",
  },
});
