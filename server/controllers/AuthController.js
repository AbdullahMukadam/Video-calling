import { eq } from "drizzle-orm";
import { db } from "../Db/Db.js";
import { users } from "../Db/schema.js";
import CreateToken from "../utils/Token.js";
import bcrypt from "bcryptjs"


const SignInWithCredentials = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: "Please Enter Email and Password"
        })
        return
    }

    const CheckIfEmailExist = await db.select().from(users).where(eq(users.email, email))

    if (CheckIfEmailExist.length > 0) {
        res.status(400).json({
            success: false,
            message: "User Already Exists, Please Use diffrent Email"
        })
        return
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const newUser = await db.insert(users).values({ email, password: hash }).returning()
    if (newUser[0]) {
        const token = await CreateToken(email)
        //send in cookies
    }



}

export { SignInWithCredentials }