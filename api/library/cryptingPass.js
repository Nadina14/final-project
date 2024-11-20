import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken"
const {JWT_KEY} = process.env

export const hiddenPassword = async (password) => {
    const salt = await bcrypt.genSalt(15);

    const combined = password + JWT_KEY;

    const hashedPassword = await bcrypt.hash(combined,salt)
    return hashedPassword;
}

export const comparePassword = async (password, hashedPassword) => {
    const combined = password + JWT_KEY;
    const match= await bcrypt.compare(combined, hashedPassword);
    return match;
}

export const generateToken = (_id) => {
    const token = jwt.sign({_id}, JWT_KEY, {expiresIn: "30d"})
    return token
}

export const verifyToken = (token) => {
    const { _id } = jwt.verify (token, JWT_KEY)
    return _id;
}


export const requireAuth = (req,res,next)=> {

    try {
        const {authorization}= req.headers;

        if(!authorization){
            throw new Error ("token required")
        }
        const token = authorization.split(" ")[1];
        if(!token){
            throw new Error ("token required");
        }

        verifyToken(token)
        next();
    }catch(error) {
        console.error(error.message);
        return res.status(401).send(`Request is not authorized: ${error.message} `)
    }
    
}