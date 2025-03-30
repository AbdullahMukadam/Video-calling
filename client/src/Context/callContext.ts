import React, { createContext } from "react";

interface callContextType {
    MyId: string;
    setMyId: React.Dispatch<React.SetStateAction<string>>;
    roomId: string;
    setRoomId: React.Dispatch<React.SetStateAction<string>>;
    MySocketId: string;
    setMySocketId: React.Dispatch<React.SetStateAction<string>>;
    joinerId: string;
    setjoinerId: React.Dispatch<React.SetStateAction<string>>;
    joinerSocketId: string;
    setjoinerSocketId: React.Dispatch<React.SetStateAction<string>>;
    remoteStream: MediaStream | null;
    setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
}

export const CallContext = createContext<callContextType>({
    MyId: "",
    setMyId: () => { },
    roomId: "",
    setRoomId: () => { },
    MySocketId: "",
    setMySocketId: () => { },
    joinerId: "",
    setjoinerId: () => { },
    joinerSocketId: "",
    setjoinerSocketId: () => { },
    remoteStream: null,
    setRemoteStream: () => {}
})

export const CallContextProvider = CallContext.Provider