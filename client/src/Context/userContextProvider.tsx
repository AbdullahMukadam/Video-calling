import React, { createContext, useContext, useEffect, useState } from "react"
import { User } from "../utils/commonInterfaces";
import api from "../API/CustomApi";
import { Config } from "../API/Config";

type Prop = {
    children: React.ReactNode
}

interface authContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    auth: boolean;
    setAuth: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    CheckAuth: () => Promise<void>;
    handleLogout: () => Promise<void>;
    myId: string;
    setMyId: React.Dispatch<React.SetStateAction<string>>
}

const AuthContext = createContext<authContextType | undefined>(undefined)


function UserContextProvider({ children }: Prop) {
    const [user, setUser] = useState<User | null>(null)
    const [auth, setAuth] = useState<boolean>(false)
    const [loading, setloading] = useState<boolean>(false)
    const [myId, setMyId] = useState<string>("")

    const CheckAuth = async (): Promise<void> => {
        try {
            setloading(true)
            const authStatus = await api.get(Config.checkAuth)

            if (authStatus.status === 200) {
                const userDetails = authStatus.data.userData
                setUser({
                    id: userDetails.id,
                    email: userDetails.email,
                    createdAt: userDetails.createdAt,
                    updatedAt: userDetails.updatedAt
                })
                localStorage.setItem("jwt", "true")
            } else {
                setAuth(false)
                setUser(null)
                localStorage.removeItem("jwt")
                await handleLogout()
            }
        } catch (error) {
            console.log("Error in getting checking auth status:", error)
        } finally {
            setloading(false)
        }
    }

    const handleLogout = async (): Promise<void> => {
        try {
            const response = await api.post(`${Config.baseUrl}/user/logout`)
            if (response.status === 200) {
                setAuth(false)
                setUser(null)
                localStorage.removeItem("jwt")
            }
        } catch (error) {
            console.log("Error in Logging Out", error)
        }
    }

    useEffect(() => {
        CheckAuth()
    }, [])
    return (
        <AuthContext.Provider value={{ user, setUser, auth, setAuth, CheckAuth, loading, handleLogout, myId, setMyId }}>
            {children}
        </AuthContext.Provider>
    )


}

export const useAuth = (): authContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
}

export default UserContextProvider