const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    cost_today:{
        type:Number,
        required:true,
    },
    time_left:{
        type:Number,
        required:true,
    },
    target_value:{
        type:Number
    },
    current_value:{
        type:Number
    },
    sip_total:{
        type:Number
    },
    projected_value:{
        type:Number,
    },
    gap:{
        type:Number,
    },
    lumpsum:{
        type:Number,
    },
    sip:{
        type:Number,
    }
});

module.exports = mongoose.model('goals',goalsSchema);

