const express = require('express');
const app = express();
require("dotenv").config();
const dbConnect = require("./config/database");
const router = require("./routes/route");
const PORT = 4000 || process.env.PORT
const cors = require("cors");
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use("/api/v1",router);


app.listen(PORT,(req,res)=>{
    console.log("App started ");
})

dbConnect();