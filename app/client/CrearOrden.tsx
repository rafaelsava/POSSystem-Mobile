import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useProductContext, Product } from "@/context/DataContext";
import { useOrderContext } from "@/context/OrderContext";
import { useRouter } from "expo-router";
const categories = ["Entrada", "Plato fuerte", "Postre", "Bebidas"];

export default function CreateOrder() {
  const { products } = useProductContext();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const { cart, addToCart, removeFromCart, updateItemQuantity } = useOrderContext();
  const router = useRouter();


  const currentCategory = categories[selectedCategoryIndex];
  const filteredProducts = products.filter(
    (product) => product.productType === currentCategory
  );

  const getQuantity = (productId: string) => {
    const item = cart.find((i) => i.id === productId);
    return item?.quantity || 0;
  };
  
  const increaseQuantity = (product: Product) => {
    addToCart(product);
  };
  
  const decreaseQuantity = (productId: string) => {
    const item = cart.find((i) => i.id === productId);
    if (item && item.quantity > 1) {
      updateItemQuantity(productId, item.quantity - 1);
    } else {
      removeFromCart(productId);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Selecciona tus {currentCategory}</Text>

      {filteredProducts.length === 0 ? (
        <Text style={styles.emptyMessage}>No hay {currentCategory.toLowerCase()} disponibles por ahora.</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={({ item }) => {
            const quantity = getQuantity(item.id ?? "");
            return (
              <View style={styles.card}>
                {item.photo && (
                  <Image source={{ uri: item.photo }} style={styles.image} />
                )}
                <View style={styles.info}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.price}>${item.price}</Text>

                  <View style={styles.quantityControls}>
                    {quantity > 0 && (
                      <TouchableOpacity
                      onPress={() => item.id && decreaseQuantity(item.id)}
                      style={styles.qtyButton}
                      >
                        <Text style={styles.qtyText}>−</Text>
                      </TouchableOpacity>
                    )}

                    {quantity > 0 && (
                      <Text style={styles.qtyNumber}>{quantity}</Text>
                    )}

                    <TouchableOpacity
                      onPress={() => increaseQuantity(item)}
                      style={styles.qtyButton}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}

      <View style={styles.footer}>
        {selectedCategoryIndex > 0 && (
          <TouchableOpacity
            onPress={() => setSelectedCategoryIndex(selectedCategoryIndex - 1)}
            style={styles.navButton}
          >
            <Text style={styles.navText}>← Atrás</Text>
          </TouchableOpacity>
        )}
        {selectedCategoryIndex < categories.length - 1 ? (
          <TouchableOpacity
            onPress={() => setSelectedCategoryIndex(selectedCategoryIndex + 1)}
            style={styles.navButton}
          >
            <Text style={styles.navText}>Siguiente →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
                router.push("../client/carrito");
            }}
            style={[styles.navButton, styles.reviewButton]}
          >
            <Text style={styles.navText}>Revisar Orden 🛒</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60, paddingHorizontal: 16 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    flexDirection: "row",
  },
  image: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  qtyButton: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  qtyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  navButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  reviewButton: {
    backgroundColor: "#ffc107",
  },
  navText: {

    color: "#fff",
    fontWeight: "bold",
  },
});
