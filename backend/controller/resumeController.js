const { Report, Resume: generateResumePdf } = require("../llm/structuredAnswer");
const ResumeModel = require("../schemas/resumeSchema");
const pdfParse = require("pdf-parse");
const generateReport = async(req,res) => {
    try {
        if (!req.file) {
    return res.status(400).json({ message: "Please upload a resume PDF" });
}
        const resumeContent = await pdfParse(req.file.buffer);
        const { selfDescription, jobDescription } = req.body;

        // Smart Caching: Check if you've already analyzed exactly this combination
        const existingReport = await ResumeModel.findOne({
            userId: req.user.id,
            selfDescription: selfDescription?.trim(),
            jobDescription: jobDescription?.trim(),
            resume: resumeContent.text?.trim()
        });

        if (existingReport) {
            console.log("Found matching report! Returning cached analysis...");
            return res.status(200).json({ InterviewReport: existingReport });
        }

        console.log("No previous analysis found. Starting AI generation...");
        const report = await Report(selfDescription, jobDescription, resumeContent.text);

        const InterviewReport = await ResumeModel.create({
            selfDescription: selfDescription?.trim(),
            jobDescription: jobDescription?.trim(),
            userId: req.user.id,
            resume: resumeContent.text?.trim(),
            ...report
        });

        res.status(200).json({ InterviewReport });
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
        const reports = await ResumeModel.find({userId : req.user.id}).sort({createdAt : -1}).select("AtsScore _id jobDescription title createdAt");
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
        const report = await ResumeModel.findOne({ _id : id , userId : req.user.id }).select("selfDescription jobDescription resume generatedResumePdf");
        
        if(!report){
            return res.status(404).json({message:"Report not found"});
        }

        let pdfBuffer;

        if (report.generatedResumePdf) {
            console.log("Serving cached PDF from database");
            pdfBuffer = report.generatedResumePdf;
        } else {
            console.log("No cache found. Generating new resume via AI...");
            pdfBuffer = await generateResumePdf({ 
                resume: report.resume, 
                selfDescription: report.selfDescription, 
                jobDescription: report.jobDescription 
            });

            // Cache it in the database for next time
            report.generatedResumePdf = pdfBuffer;
            await report.save();
        }

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${id}.pdf`
        });

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