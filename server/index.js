import express from "express"
import AuthRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

const app = express()
const PORT = 8000

dotenv.config()
app.use(cookieParser())
app.use(express.json())
app.use("/api/", AuthRoutes)


app.get("/", (req, res) => {
    res.send("hello")
})


app.listen(PORT, (err) => {
    if(err) console.log(err)
})