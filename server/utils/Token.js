import jwt from "jsonwebtoken"

const CreateToken = async (email)=>{
   const token = await jwt.sign(email, process.env.JWT_SECRET)

   return token
}

export default CreateToken