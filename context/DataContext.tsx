import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/utils/FirebaseConfig";

export interface Product {
  id?: string;
  photo: string;
  title: string;
  description: string;
  value: number;
  price: number;
}

interface ProductContextInterface {
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext({} as ProductContextInterface);

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const prods: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as Product);
      setProducts(prods);
    });
    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Product) => {
    try {
      await addDoc(collection(db, "products"), product);
    } catch (error) {
      console.error("Error agregando producto:", error);
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, product);
    } catch (error) {
      console.error("Error actualizando producto:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const productRef = doc(db, "products", id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};


