import React, { createContext } from "react";

interface callContextType {
    MyId: string;
    setMyId: React.Dispatch<React.SetStateAction<string>>;
    roomId: string;
    setRoomId: React.Dispatch<React.SetStateAction<string>>;
    MySocketId: string;
    setMySocketId: React.Dispatch<React.SetStateAction<string>>;
}

export const CallContext = createContext<callContextType>({
    MyId: "",
    setMyId: () => { },
    roomId: "",
    setRoomId: () => { },
    MySocketId: "",
    setMySocketId: () => { },
})

export const CallContextProvider = CallContext.Provider