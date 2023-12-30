const mongoose = require('mongoose');
require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log("DB connection established")})
    .catch((err)=>{console.log(err)});
}

module.exports = dbConnect;