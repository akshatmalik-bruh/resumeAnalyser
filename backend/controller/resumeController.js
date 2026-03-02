const { Report, Resume: generateResumePdf } = require("../llm/structuredAnswer");
const ResumeModel = require("../schemas/resumeSchema");
const pdfParse = require("pdf-parse");
const generateReport = async(req,res) => {
    try {
        const resumeContent = await pdfParse(req.file.buffer);
        const {selfDescription,jobDescription} = req.body;
        const report = await Report(selfDescription, jobDescription, resumeContent.text);
        const InterviewReport = await ResumeModel.create({selfDescription,jobDescription,userId:req.user.id,resume:resumeContent.text,...report});
        res.status(200).json({InterviewReport});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
const getReportById = async(req,res) => {
    try {
        const {id} = req.params;
        const report = await ResumeModel.findOne({ _id : id , userId : req.user.id });
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
        const reports = await ResumeModel.find({userId : req.user.id}).sort({createdAt : -1}).select("AtsScore _id");
        if(!reports){
            return res.status(404).json({message:"No reports found"});
        }

        res.status(200).json({reports});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
const resumeGenerator = async(req,res)=>{
    try{
        const id = req.params.id;
        const report = await ResumeModel.findOne({ _id : id , userId : req.user.id }).select("selfDescription jobDescription resume");
        if(!report){
            return res.status(404).json({message:"Report not found"});
        }
        const pdfBuffer = await generateResumePdf({ resume: report.resume, selfDescription: report.selfDescription, jobDescription: report.jobDescription });
        res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${id}.pdf`
    })

    res.send(pdfBuffer);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
}
module.exports = {
    generateReport,
    getReportById,
    allReports,
    resumeGenerator
}