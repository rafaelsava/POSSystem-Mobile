import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Agregamos getDoc
import { auth, db } from "@/utils/FirebaseConfig";

interface AuthContextInterface {
  currentUser: FirebaseUser | null;
  // Ahora devolvemos string | null en lugar de Boolean, para saber el rol
  login: (email: string, password: string) => Promise<string | null>;
  register: (user: any) => Promise<Boolean>;
  logout: () => Promise<void>;
  updateUser: (user: any) => Promise<void>;
  updateRole: (role: "client" | "chef" | "cashier") => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextInterface);

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Modificamos esta función para que retorne el rol
  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response.user) {
        // Obtenemos el rol desde Firestore
        const userDocRef = doc(db, "users", response.user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          return data.role || null; // Devolvemos el rol si existe
        }
      }
    } catch (error) {
      console.log(error);
    }
    return null; // Si algo falla, devolvemos null
  };

  const register = async (user: any): Promise<Boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, { displayName: user.name });

      await setDoc(doc(db, "users", firebaseUser.uid), {
        name: user.name,
        email: user.email,
        role: user.role || "client",
        createdAt: new Date(),
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const updateUser = async (user: any) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: user.name });
      await setDoc(doc(db, "users", auth.currentUser.uid), user, { merge: true });
    }
  };

  const updateRole = async (role: "client" | "chef" | "cashier") => {
    if (auth.currentUser) {
      await setDoc(doc(db, "users", auth.currentUser.uid), { role }, { merge: true });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        updateUser,
        updateRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
