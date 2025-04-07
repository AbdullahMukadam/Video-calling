import { eq } from "drizzle-orm";
import { db } from "../Db/Db";
import { calls } from "../Db/schema";

const AddCallHistory = async (req, res) => {
    const { callId, callerId, joinerId } = req.body;

    if (!callId || !callerId) {
        return res.status(400).json({
            message: "Values Missing",
            success: false
        })

    }

    try {
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
        const calls = await db.select().from(calls).where(eq(calls.callerId, userId))
        if (calls) {
            console.log(calls)
        }
    } catch (error) {
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