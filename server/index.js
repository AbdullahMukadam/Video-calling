import express from "express"
import AuthRoutes from "./routes/authRoutes.js"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { Server } from "socket.io";
import { SocketEvents } from "./SocketServer.js"

const PORT = 8000

dotenv.config()
const app = express()
let server;

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['*', 'Authorization'],
    maxAge: 600
}
app.use(cors(corsOptions))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api/user", AuthRoutes)


app.get("/", (req, res) => {
    res.send("hello")
})


server = app.listen(PORT, (err) => {
    if (err) console.log(err)
})

let io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on("connection", (socket) => {
    console.log("Socket connected Successfully:", socket.id)
    SocketEvents(socket, io)
})