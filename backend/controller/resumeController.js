const { Report } = require("../llm/structuredAnswer");
const Resume = require("../schemas/resumeSchema");
const pdfParse = require("pdf-parse");
const generateReport = async(req,res) => {
    try {
        const resumeContent = await pdfParse(req.file.buffer);
        const {selfDescription,jobDescription} = req.body;
        const report = await Report(selfDescription, jobDescription, resumeContent.text);
        const InterviewReport = await Resume.create({selfDescription,jobDescription,userId:req.user.id,resume:resumeContent.text,...report});
        res.status(200).json({InterviewReport});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
const getReportById = async(req,res) => {
    try {
        const {id} = req.params;
        const report = await Resume.findOne({ _id : id , userId : req.user.id });
        if(!report){
            return res.status(404).json({message:"Report not found"});
        }

        res.status(200).json({report});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
const allReports = async(req,res) => {
    try {
        const reports = await Resume.find({userId : req.user.id}).sort({createdAt : -1}).select("AtsScore _id");
        if(!reports){
            return res.status(404).json({message:"No reports found"});
        }

        res.status(200).json({reports});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
module.exports = {
    generateReport,
    getReportById,
    allReports
}