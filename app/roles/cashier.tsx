import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useProductContext, Product } from "../../context/DataContext";

export default function ProductsCRUD() {
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductContext();

  const [photo, setPhoto] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const clearForm = () => {
    setPhoto("");
    setTitle("");
    setDescription("");
    setValue("");
    setPrice("");
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!photo || !title || !description || !value || !price) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const productData: Product = {
      photo,
      title,
      description,
      value: parseFloat(value),
      price: parseFloat(price),
    };

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
    setValue(product.value.toString());
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
      <Text>Valor: {item.value}</Text>
      <Text>Descripción: {item.description}</Text>
      <Text>Foto: {item.photo}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => item.id && handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? "Editar Producto" : "Agregar Producto"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="URL de la foto"
        value={photo}
        onChangeText={setPhoto}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
      />
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
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
});



