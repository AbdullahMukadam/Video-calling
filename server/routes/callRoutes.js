import express from "express"
import { AddCallHistory, getCallHistory } from "../controllers/CallController.js"
const router = express.Router()

router.post("/add-call-history", AddCallHistory)
router.post("/get-all-calls", getCallHistory)


export default router