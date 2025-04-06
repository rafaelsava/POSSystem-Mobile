// app/roles/cashier.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image
} from "react-native";
import { useProductContext, Product } from "@/context/DataContext";
import CameraModal from "@/components/CameraModal"; // Asegúrate de importar correctamente el modal de la cámara.
export default function Cashier() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductContext();

  const [photo, setPhoto] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false); // Estado para controlar la visibilidad de la cámara

  const clearForm = () => {
    setPhoto("");
    setTitle("");
    setDescription("");
    setProductType("");
    setPrice("");
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!photo || !title || !description || !productType || !price) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const productData: Product = {
      photo,
      title,
      description,
      productType: productType,
      price: parseFloat(price),
    };

    console.log("Guardando producto:", productData);
    if (editingId) {
      await updateProduct(editingId, productData);
    } else {
      await addProduct(productData);
    }
    clearForm();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id || null);
    setPhoto(product.photo);
    setTitle(product.title);
    setDescription(product.description);
    setProductType(product.productType);
    setPrice(product.price.toString());
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar este producto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => await deleteProduct(id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => (
    
    <View style={styles.productItem}>

      <Text style={styles.productTitle}>{item.title}</Text>
      <Text>Precio: {item.price}</Text>
      <Text>Tipo de producto: {item.productType}</Text>
      <Text>Descripción: {item.description}</Text>
      <Image
        source={{ uri: item.photo }}
        style={styles.productImage}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => item.id && handleDelete(item.id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const productTypes = ["Entrada", "Plato fuerte", "Postre", "Bebidas"];

  return (
    <View style={styles.container}>
  <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => setCameraVisible(true)}
      >
        <Text style={styles.buttonText}>Tomar Foto</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        {editingId ? "Editar Producto" : "Agregar Producto"}
      </Text>
            {photo ? (
        <Image
          source={{ uri: photo }}
          style={{ width: "100%", height: 200, borderRadius: 8, marginBottom: 10 }}
          resizeMode="cover"
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Foto"
          value={photo}
          onChangeText={setPhoto}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Tipo de producto</Text>
      <View style={styles.typeContainer}>
        {productTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              productType === type && styles.typeButtonSelected,
            ]}
            onPress={() => setProductType(type)}
          >
            <Text
              style={[
                styles.typeButtonText,
                productType === type && styles.typeButtonTextSelected,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {editingId ? "Actualizar" : "Guardar"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={renderItem}
        style={styles.list}
        ListEmptyComponent={<Text>No hay productos.</Text>}
      />
      {/* Modal de la Cámara */}
      <CameraModal
        isVisible={cameraVisible}
        onClose={() => setCameraVisible(false)}
        onCapture={(imageUri) => {
            setPhoto(imageUri);
            setCameraVisible(false);
        }}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:70,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  typeButtonSelected: {
    backgroundColor: "#007bff",
  },
  typeButtonText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  typeButtonTextSelected: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  productItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  productTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#28a745",
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 5,
  },
  cameraButton: {
    backgroundColor: "#f39c12",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  productImage: {
    width: "50%",
    alignSelf: "center",
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
  
});
