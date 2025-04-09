import { eq, or } from "drizzle-orm";
import { db } from "../Db/Db.js";
import { calls } from "../Db/schema.js";

const AddCallHistory = async (req, res) => {
    const { callId, callerId, joinerId } = req.body;

    if (!callId || !callerId) {
        return res.status(400).json({
            message: "Values Missing",
            success: false
        })

    }

    try {
        const isCallExists = await db.select().from(calls).where(eq(calls.callId, callId))
        if (isCallExists[0]) {
            return res.status(201).json({
                success: false,
                message: "Call Already Exists"
            })
        }
        const call = await db.insert(calls).values({
            callId,
            callerId,
            joinerId
        }).returning()

        if (call[0]) {
            return res.status(200).json({
                success: true,
                message: "Call History Saved to Database"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "An Internal Error Occured"
        })
    }
}

const getCallHistory = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Missing the UserId, Please Login Again"
        })
    }

    try {
        const callsDetails = await db.select().from(calls).where(or(eq(calls.callerId, userId), eq(calls.joinerId, userId)))
        if (callsDetails.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Succesfully Fetched the Call History",
                callHistory: callsDetails
            })

        } else {
            return res.status(204).json({
                success: false,
                message: "No Call History Found",
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || "An Internal Error Occured"
        })
    }

}

export {
    AddCallHistory,
    getCallHistory
}