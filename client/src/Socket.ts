
import { io, Socket } from "socket.io-client";

let socket: Socket | null;

export const initializeSocket = () => {
    if (!socket) {
        socket = io(import.meta.env.VITE_BACKEND_URL);
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const handleRoomCreation = (
    userId: string,
    userEmail: string,
    callbacks: {
        setRoomId: (id: string) => void;
        setMyId: (id: string) => void;
        setMySocketId: (id: string) => void;
    }
): Promise<string> => {
    return new Promise((resolve) => {
        const socket = initializeSocket();

        socket.emit("CreateCall", {
            callerId: userId,
            callerEmail: userEmail,
        });

        socket.once("callCreated", (data) => {
            const { roomId, callersocketId, callerId } = data;
            if (roomId) {
                callbacks.setRoomId(roomId);
                callbacks.setMyId(callerId);
                callbacks.setMySocketId(callersocketId);
                resolve("success");
            }
        });

        socket.once("error", (error) => {
            resolve(error.message || "Failed to create room");
        });
    });
};

export const handleRoomJoining = (
    roomId: string,
    userId: string,
    userEmail: string,
): Promise<string> => {
    return new Promise((resolve) => {
        const socket = initializeSocket();

        socket.emit("JoinCall", {
            callId: roomId,
            joinerId: userId,
            joinerEmail: userEmail,
        });

        socket.once("CallReady", (data) => {
            resolve("success");
        });

        socket.once("roomFull", (data) => {
            resolve(data.message || "Room is full")
        })

        socket.once("error", (error) => {
            resolve(error.message || "Failed to join room");
        });
    });
};

export const getSocket = () => {
    return initializeSocket();
};