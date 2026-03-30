const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        minlength : 3,
        maxlength : 255
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        match : /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password : {
        type : String,
        required : true
    }
},{timestamps:true})
const User = mongoose.model("User", userSchema);
module.exports = User;
