import React, { createContext, useContext, useState } from "react"


type Prop = {
    children: React.ReactNode
}

interface callContextType {
    MyId: string;
    setMyId: React.Dispatch<React.SetStateAction<string>>;
    roomId: string;
    setRoomId: React.Dispatch<React.SetStateAction<string>>;
    MySocketId: string;
    setMySocketId: React.Dispatch<React.SetStateAction<string>>;
}

const CallContext = createContext<callContextType | undefined>(undefined)


function CallContextProvider({ children }: Prop) {
    const [MyId, setMyId] = useState<string>("")
    const [roomId, setRoomId] = useState<string>("")
    const [MySocketId, setMySocketId] = useState("")

    return (
        <CallContext.Provider value={{ MyId, setMyId, roomId, setRoomId, MySocketId, setMySocketId}}>
            {children}
        </CallContext.Provider>
    )


}

export const useCall = (): callContextType => {
    const context = useContext(CallContext)
    if (!context) {
        throw new Error("useCall must be used within an CallContextProvider");
    }
    return context;
}

export default CallContextProvider