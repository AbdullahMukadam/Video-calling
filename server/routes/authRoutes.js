import express from "express"
import { SignInWithCredentials } from "../controllers/AuthController.js"

const router = express.Router()

router.post("/sign-in-with-credentials", SignInWithCredentials)

export default router