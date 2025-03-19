import { User } from "@/interfaces/common";
import { createContext } from "react";

export const AuthContext = createContext({})

export const AuthProvider = ({ children}:any) => {
    const login = (email:string,password:string) => {
    }

    const logout = () => {  
    }

    const register = (user: User) => {

    }

    const updateUser = (user: User) => {    
    }

    const updateRole = (role:"client"|"chef" | "cashier") => {
    
    }

  return (
    <AuthContext.Provider 
    value={{
        login,
        logout,
        register,
        updateUser,
        updateRole
    }}>
      {children}
    </AuthContext.Provider>
  )
}