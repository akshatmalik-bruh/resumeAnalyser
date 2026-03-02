const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const indexRoutes = require("./routes/indexRoutes");
const connectDB = require("./config/db");
connectDB();

app.use("/api", indexRoutes);


app.listen(process.env.PORT || 3000, () => {
    console.log(`listening on port ${process.env.PORT}`);
});
