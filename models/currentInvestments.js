const mongoose = require('mongoose');

const currentInvestement = new mongoose.Schema({
    fundName:{
        type:String,
    },
    total:{
        type:Number,
    },
    available:{
        type:Number,
    },
    type:{
        type: String,
        enum: ["CI", "SIP"],
        required: true,
    }
});

module.exports = mongoose.model("availableFunds",currentInvestement);