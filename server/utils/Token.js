import jwt from "jsonwebtoken"
import "dotenv/config"

const CreateToken = async (email) => {
    try {
        const token = jwt.sign({ userEmail: email }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        })

        return token
    } catch (error) {
        console.log("Error in Creating Token", error)
    }
}

export default CreateToken