const User = require("../schemas/userSchema");
const z = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const registerSchema = z.object({
    username : z.string().min(3).max(255), 
    email : z.email(),
    password : z.string().min(6).max(255).regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "Password must contain at least one uppercase letter, one number, and one special character")
})
const register = async(req , res) =>{
    try {
        const {username,email,password} = req.body;
        const validate = registerSchema.safeParse({username,email,password});
        if(!validate.success){
            return res.status(400).json({message:validate.error.errors[0].message});
        }
        const existingUser = await User.findOne(
            {$or : [{email:email},{username:username}]});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const user = await User.create({username,email,password:await bcrypt.hash(password,10)});
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.status(201).json({message:"User created successfully",token});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}
const loginSchema = z.object({
    email : z.email(),
    password : z.string().min(6).max(255).regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "Password must contain at least one uppercase letter, one number, and one special character")
})
const login = async(req , res) =>{
    try {
        const {email,password} = req.body;
        const validate = loginSchema.safeParse({email,password});
        if(!validate.success){
            return res.status(400).json({message:validate.error.errors[0].message});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const validPassword = await bcrypt.compare(password,user.password);
        if(!validPassword){
            return res.status(400).json({message:"Invalid password"});
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.status(200).json({message:"User logged in successfully",token});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports ={
    register,
    login
}