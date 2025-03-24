import express from "express"
import AuthRoutes from "./routes/authRoutes.js"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"


const PORT = 8000

dotenv.config()
const app = express()

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


app.listen(PORT, (err) => {
    if (err) console.log(err)
})