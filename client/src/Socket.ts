import { io, Socket } from "socket.io-client";

let socket: Socket | null;
const getSocket = (): Socket => {
    if (!socket) {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }

    return socket
}

const setSocket = (): void => {
    socket = null
}

export { getSocket, setSocket }