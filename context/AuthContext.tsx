import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/utils/FirebaseConfig";

interface AuthContextInterface {
    currentUser: FirebaseUser | null;
    login: (email: string, password: string) => Promise<Boolean>;
    register: (user: any) => Promise<Boolean>;
    logout: () => Promise<void>;
    updateUser: (user: any) => Promise<void>
    updateRole: (role: "client" | "chef" | "cashier") => Promise<void>
}

export const AuthContext = createContext({} as AuthContextInterface)

export const AuthProvider = ({ children }: any) => {

    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: any) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<Boolean> => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            if (response.user) {
                return true;
            }
        } catch (error) {
            console.log(error);
        }
        return false
    };

    const register = async (user: any): Promise<Boolean> => {
      console.log(user);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            const firebaseUser = userCredential.user;
            await updateProfile(firebaseUser, { displayName: user.name });

            await setDoc(doc(db, "users", firebaseUser.uid), {
                name: user.name,
                email: user.email,
                role: user.role || "client",
                createdAt: new Date()
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

    return <AuthContext.Provider
        value={{
            currentUser,
            login,
            register,
            updateUser,
            updateRole,
            logout
        }}
    >
        {children}
    </AuthContext.Provider>
}