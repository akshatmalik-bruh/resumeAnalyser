const mongoose = require("mongoose" );
const resumeSchema = new mongoose.Schema({
    skills : [{
        domain : {
            type : String,
            required : true,
        },
        skill : {
            type : String,
            required : true,
        },
        level : {
            type : String,
            required : true,
            enum : ["easy" , "medium" , "hard"]
        }
  
    }],
    experience : [{
        company : {
            type : String,
            required : true,
        },
        position : {
            type : String,
            required : true,
        },
        description : {
            type : String,
            required : true,
        },
        
    }],
    education : [{
        school : {
            type : String,
            required : true,
        },
        degree : {
            type : String,
            required : true,
        },
        year : {
            type : String,
            required : true,
        },
        gpa : {
            type : String,
            required : true,
        },
    }],
    projects : [{
        name : {
            type : String,
            required : true,
        },
        description : {
            type : String,
            required : true,
        },
        
    }],
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
    
    
},{timestamps:true})
const Resume = mongoose.model("Resume", resumeSchema);
module.exports = Resume;