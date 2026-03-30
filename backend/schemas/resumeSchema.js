const mongoose = require("mongoose" );
const resumeSchema = new mongoose.Schema({
    jobDescription : {
        type : String,
        required : true
      
    },
    selfDescription : {
        type : String,
        required : true
    },
    AtsScore : {
        type : Number,
        
    },
    technicalQuestions : [{
        question : {type : String, required : true},
        intention : {type : String, required : true},
        answer : {type : String, required : true},

    }],
    behavioralQuestions :[{
        question : {type : String, required : true},
        intention : {type : String, required : true},
        answer : {type : String, required : true},
    }],
    skillGap : [{
        skill : {
            type : String,
            required : true
        },
        level : {
            type : String,
            required : true,
            enum : ["easy" , "medium" , "hard"]
        }
    }],
    title : {
        type : String,
    },
    resume : {
        type : String,
        required : true
    },
    
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    generatedResumePdf : {
        type : Buffer,
    },
    
    
},{timestamps:true})
const Resume = mongoose.model("Resume", resumeSchema);
module.exports = Resume;