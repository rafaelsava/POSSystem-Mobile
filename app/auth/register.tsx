import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import WelcomeScreen from "./welcome-screen"
import  PersonalInfoScreen from "./personal-info-screen";
import  AccountSetupScreen  from "./account-setup-screen";
import  ConfirmationScreen  from "./confirmation-screen";
import  ProgressIndicator  from "./progress-indicator";
import type { User } from "../../interfaces/common";

export default function RegistrationFlow() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<User>({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const updateUserData = (data: Partial<User>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const totalSteps = 4;

  return (
    <View style={styles.container}>
      <ProgressIndicator currentStep={step} totalSteps={totalSteps} />

      {step === 1 && <WelcomeScreen onNext={nextStep} />}
      {step === 2 && (
        <PersonalInfoScreen
          userData={userData}
          updateUserData={updateUserData}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}
      {step === 3 && (
        <AccountSetupScreen
          userData={userData}
          updateUserData={updateUserData}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}
      {step === 4 && <ConfirmationScreen userData={userData} onPrev={prevStep} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
}); 