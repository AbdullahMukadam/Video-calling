import express from "express"
import { checkAuthentication, GoogleAuth, LogOut, SignInWithCredentials, SignUpWithCredentials } from "../controllers/AuthController.js"

const router = express.Router()

router.post("/sign-up-with-credentials", SignUpWithCredentials)
router.post("/sign-in-with-credentials", SignInWithCredentials)
router.post("/logout", LogOut)
router.post("/google-auth/signup", GoogleAuth)
router.get("/check-auth", checkAuthentication)

export default router