const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const resumeRoutes = require("./resumeRoutes");
router.use("/auth",authRoutes);
router.use("/resume",resumeRoutes);
module.exports = router;