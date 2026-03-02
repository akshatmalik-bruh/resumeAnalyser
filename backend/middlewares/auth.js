const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const tokenVerify = async(req,res,next)=>{
    try {
     const headers = req.headers.authorization;
     if(!headers || !headers.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorized"})
     }   
     const token = headers.split(" ")[1];
     const decoded = jwt.verify(token,process.env.JWT_SECRET);
     req.user = decoded;
     next();
    } catch (error) {
        return res.status(401).json({message:"Unauthorized"})
    }
}
module.exports = tokenVerify;