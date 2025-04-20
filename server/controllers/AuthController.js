import { eq } from "drizzle-orm";
import { db } from "../Db/Db.js";
import { users } from "../Db/schema.js";
import bcrypt from "bcryptjs"
import "dotenv/config"
import CreateToken from "../utils/Token.js";
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"

const googleOauthClient = new OAuth2Client(process.env.CLIENT_ID)

const SignUpWithCredentials = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please Enter Email and Password"
        })

    }

    const CheckIfEmailExist = await db.select().from(users).where(eq(users.email, email))

    if (CheckIfEmailExist.length > 0) {
        return res.status(400).json({
            success: false,
            message: "User Already Exists, Please Use diffrent Email"
        })
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    try {
        const newUser = await db.insert(users).values({ email, password: hash }).returning()
        if (newUser[0]) {
            const token = await CreateToken(email)
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV,
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000
            })
            res.status(200).json({
                success: true,
                message: "User Succesfully Created",
                user: {
                    id: newUser[0].id,
                    email: newUser[0].email,
                    createdAt: newUser[0].createdAt,
                    updatedAt: newUser[0].updatedAt
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An Internal Error Occured"
        })
    }
}

const SignInWithCredentials = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await db.select().from(users).where(eq(users.email, email))
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        const verifyPass = await bcrypt.compare(password, user[0].password)
        if (!verifyPass) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const token = await CreateToken(email)
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            success: true,
            message: "Welcome",
            userData: {
                id: user[0].id,
                email: user[0].email,
                createdAt: user[0].createdAt,
                updatedAt: user[0].updatedAt
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An Internal Error Occured" || error.message
        })
    }
}

const LogOut = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            expires: new Date(0),
            sameSite: "none",
            secure: true
        })
        res.status(200).json({
            success: true,
            message: "Logout Succesfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An Internal Error Occured" || error.message
        })
    }
}

const checkAuthentication = async (req, res) => {
    try {

        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({
                authenticated: false,
                message: "Token Missing"
            })
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await db.select().from(users).where(eq(users.email, decoded.userEmail))
        if (!user) {
            return res.status(404).json({
                authenticated: false,
                message: "User Not Found"
            })
        }

        return res.status(200).json({
            authenticated: true,
            userData: {
                id: user[0].id,
                email: user[0].email,
                createdAt: user[0].createdAt,
                updatedAt: user[0].updatedAt
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An Internal Error Occured" || error.message
        })
    }
}

const GoogleAuth = async (req, res) => {
    try {
        const { email, googleId, name, picture } = req.body;

        const existingUser = await db.select().from(users).where(eq(users.email, email));

        if (existingUser.length > 0) {
            // User exists
            if (existingUser[0].isGoogleUser === false) {
                return res.status(400).json({
                    success: false,
                    message: "This email is already registered with a different login method"
                });
            }

            // Existing Google user
            const token = await CreateToken(email);
            return res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000
            }).status(200).json({
                success: true,
                message: "Google User Logged In successfully",
                user: {
                    id: existingUser[0].id,
                    email: existingUser[0].email,
                    createdAt: existingUser[0].createdAt,
                    updatedAt: existingUser[0].updatedAt
                }
            });
        }

        // New Google user
        const newUser = await db.insert(users).values({
            email: email,
            isGoogleUser: true,
        }).returning();

        if (newUser[0]) {
            const token = await CreateToken(email);
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                success: true,
                message: "Google User Successfully Created",
                user: {
                    id: newUser[0].id,
                    email: newUser[0].email,
                    createdAt: newUser[0].createdAt,
                    updatedAt: newUser[0].updatedAt
                }
            });
        }

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({
            success: false,
            message: "An Internal Error Occurred",
            error: error.message
        });
    }
};

export { SignUpWithCredentials, checkAuthentication, SignInWithCredentials, LogOut, GoogleAuth }