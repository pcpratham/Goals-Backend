const mongoose = require('mongoose');

const fundAllocation = new mongoose.Schema({
    availabeFund:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"availableFunds",

    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"goals",        
    },
    allocatedAmount:{
        type:Number,
    },
    type:{
        type:String,
        enum:["CI","SIP"],
        required:true,
    }
});

module.exports = mongoose.model('fundAllocation',fundAllocation);