const router = require("express").Router();
const {generateReport,getReportById,allReports,resumeGenerator} = require("../controller/resumeController");
const upload = require("../middlewares/fileBuffer");
const auth = require("../middlewares/auth");
router.post("/generateReport",auth,upload.single("resume"),generateReport); 
router.get("/getReportById/:id",auth,getReportById);
router.get("/allReports",auth,allReports);
router.get("/resumeGenerator/:id",auth,resumeGenerator);
module.exports = router;