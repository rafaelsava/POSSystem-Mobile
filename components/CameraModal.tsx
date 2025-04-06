import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert ,ActivityIndicator} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { storage } from "../utils/FirebaseConfig";  // 🔹 Importa Firebase Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface CameraModalProps {
    isVisible: boolean;
    onClose: () => void;
    onCapture: (imageUrl: string) => void;
}

export default function CameraModal(props: CameraModalProps) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [uploading, setUploading] = useState(false);
    const cameraRef = useRef<CameraView>(null);



    const flip = () => {
        setFacing(facing === 'back' ? 'front' : 'back');
    };

    const take = async () => {
        let result = await cameraRef.current?.takePictureAsync({
            quality: 1,
            base64: false,
        });

        if (result?.uri) {
            await uploadImageToFirebase(result.uri);
        }
    };

    const open = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            await uploadImageToFirebase(result.assets[0].uri);
        }
    };

    // 🔹 Función para subir la imagen a Firebase Storage
    const uploadImageToFirebase = async (imageUri: string) => {
        setUploading(true); // 👈 Inicia el loader

        try {
            // Convertir la imagen en un blob
            const response = await fetch(imageUri);
            const blob = await response.blob();

            // Crear una referencia en Firebase Storage
            const filename = `photos/${Date.now()}.jpg`; // 🔹 Nombre único
            const storageRef = ref(storage, filename);

            // Subir la imagen
            await uploadBytes(storageRef, blob);

            // Obtener la URL de descarga
            const downloadURL = await getDownloadURL(storageRef);
            console.log("Imagen subida: ", downloadURL);

            props.onCapture(downloadURL); // 🔹 Enviar URL de Firebase
            props.onClose(); // Cerrar modal

            Alert.alert("Éxito", "Imagen subida correctamente a Firebase!");
        } catch (error) {
            console.error("Error al subir imagen: ", error);
            Alert.alert("Error", "No se pudo subir la imagen.");
        } finally {
            setUploading(false);
        }
    };

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text>We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <Modal visible={props.isVisible} animationType="slide">
            <View style={styles.container}>
                            {uploading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Subiendo imagen...</Text>
                </View>
                )}

                <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                    <View style={styles.controls}>
                        <TouchableOpacity onPress={take} style={styles.captureButton}>
                            <Text style={styles.buttonText}>📸</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={open} style={styles.libraryButton}>
                            <Text style={styles.buttonText}>📂</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={flip} style={styles.flipButton}>
                            <Text style={styles.buttonText}>🔄</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={props.onClose} style={styles.closeButton}>
                            <Text style={styles.buttonText}>❌</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
        justifyContent: "flex-end",
    },
    controls: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    captureButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
    },
    libraryButton: {
        backgroundColor: "#6c757d",
        padding: 10,
        borderRadius: 5,
    },
    flipButton: {
        backgroundColor: "#17a2b8",
        padding: 10,
        borderRadius: 5,
    },
    closeButton: {
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    permissionButton: {
        marginTop: 10,
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      },
      loadingText: {
        color: "#fff",
        marginTop: 10,
        fontSize: 16,
      },
      
});
