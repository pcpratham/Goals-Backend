const express = require('express');
const router = express.Router();
const goals = require("../models/goals");
const availableFunds = require("../models/currentInvestments");
const fundAllocation = require("../models/fundAllocation");


router.get("/",function(req,res){
    res.send(`<h1>Hello world</h1>`);
})


router.post("/data-entry",async (req,res)=>{
    
    try{
        const {name,cost_today,time_left} = await req.body;
        const dbEntry = await goals.create({name,cost_today,time_left});
        return res.status(200).json({
            success: true,
            message:"Entry created successfully",
            dbEntry
        });
    }
    catch(err){
        console.log("Error creating data-entry");
        return res.status(500).json({
            success: false,
            message:err.message,
        });
    }
    

});

router.post("/funds-entry", async(req,res)=>{
    try{
    //    const {fundName,name} = req.body;//fund A
    //    const fundData = await availableFunds.find({fundName:fundName});
    //    console.log("fund data -> ", fundData);
    //    const goalData  = await goals.find({name:name});
    //    console.log("goal data -> ", goalData);
       const {fundType,type,allocatedAmount,category} = req.body;
       console.log(fundType,type);
       const fundData = await availableFunds.findOne({fundName:fundType,type:type});
       console.log(fundData);
       console.log("fund ", fundData._id);
       const goalsData = await goals.find({name:category});
       const fundsEntry = await fundAllocation.create({availabeFund:fundData._id,allocatedAmount:allocatedAmount,category:goalsData[0]._id,type});
       const remainingAvailableFund = fundData.available - allocatedAmount;
       const new_fundData = await availableFunds.findOneAndUpdate({fundName:fundType,type:type},{available:remainingAvailableFund},{new:true});
       return res.status(200).json({
        success: true,
        message: "fund allocated successfully",
        fundEntry: fundsEntry,
        fundData:fundData,
        newFundData:new_fundData
       })
       
    }
    catch(err){
        console.log("Error creating fund allocation");
        return res.status(500).json({
            success: false,
            message:err.message,
        });
    }
})

router.get("/all-goals",async (req,res)=>{
    try{
        const data = await goals.find({});
        return res.status(200).json({
            success: true,
            message:"goals fetched successfully",
            data
        });
    }
    catch(err){
        console.log("Error fetching all entries");
        return res.status(500).json({
            success: false,
            message:err.message,
        });
    }
})

router.post("/all-fields",async (req,res) => {
    try{
        const id = req.body.id;
        const data = await fundAllocation.find({type:"CI",category:id});
        const data1 = await fundAllocation.find({type:"SIP",category:id});

        let sum = 0;
        for(let i=0;i<data.length;i++){
            sum += data[i].allocatedAmount;
        }

        let sum1 = 0;
        for(let i=0;i<data1.length;i++){
            sum1 += data1[i].allocatedAmount;
        }

        // const goal_updated = await goals.findByIdAndUpdate({_id:'658d86927244d3b934e3954c'},{
            
        // },{new:true});

        const goalData = await goals.find({_id:id});
        const FV1 = Math.floor(((sum)*(Math.pow((1+(0.1/12)),(goalData[0].time_left*12))))  + sum1*( ( Math.pow( (1+(0.1/12)), (goalData[0].time_left*12) ) - 1 ) / (0.1/12)  ))

        // console.log("FV ",FV1);

        const gap = goalData[0].target_value - FV1;
        // console.log("gap ",gap);

        const PV = Math.ceil(gap /  Math.pow( (1+(0.1/12)), goalData[0].time_left*12 ));
        // console.log("PV ",PV);
        
        const PMT = Math.ceil(-1*(gap / ((1 - Math.pow( (1+(0.1/12)), (goalData[0].time_left*12))) / (0.1/12))));
        // console.log("SIP ",PMT);
        
        
        
        const new_goal_updated = await goals.findByIdAndUpdate({_id:id},{
            current_value:sum,
            sip_total:sum1,
            projected_value: FV1,
            gap: gap,
            lumpsum:PV,
            sip:PMT
        },{new:true});


        
        
        
        
        
        
        
        
        
        
        
        
        // const data = await fundAllocation.find({type:"SIP",category:"658d86927244d3b934e3954c"});
        // let sum = 0;
        // for(let i=0;i<data.length;i++){
        //     sum += data[i].allocatedAmount;
        // }

        // const goal_updated = await goals.findByIdAndUpdate({_id:'658d86927244d3b934e3954c'},{
        //     sip_total:sum,
        // },{new:true});

        return res.status(200).json({
            success: true,
            message:"current value calculated successfully",
            // data:data,
            goal:new_goal_updated
        });
    }
    catch(err){
        console.log("Error getting all fields");
        return res.status(500).json({
            success: false,
            message:err.message,
        }); 
    }
})

router.post("/investments-entry",async (req,res)=>{
    try{
        const {fundName,total,available,type} = req.body;
        const fundEntry = await availableFunds.create({fundName,total,available,type});
        return res.status(200).json({
            success: true,
            message:"Entry created successfully",
            fundEntry
        });
    }
    catch(err){
        console.log("Error creating investments-entry");
        return res.status(500).json({
            success: false,
            message:err.message,
        });
    }
})

router.post("/calculated_data",async (req,res)=>{
    try{
        const _id = req.body.id;
        const goal = await goals.findById({_id:_id}).populate();
        // console.log(goal);
        const cost_today = goal.cost_today;
        const time_left = goal.time_left;
        const target_value = Math.ceil(cost_today*(Math.pow(1.06,time_left)));
        // console.log(target_value);
        const updated_goal = await goals.findByIdAndUpdate({_id:_id},{
            target_value:target_value,
        },{new:true});
        return res.status(200).json({
            success: true,
            message:"Values updated successfully",
            updated_goal
        });

    }
    catch(err){
        console.log("Error updating value");
        return res.status(500).json({
            success: false,
            message:err.message,
        });
    }
})

router.post( "/all-funds",async(req,res) => {
    try{
        const {type} = req.body;
        const data = await availableFunds.find({type:type});
        return res.status(200).json({
            success: true,
            msg: "all funds fetched",
            data : data,
        })
    }
    catch(err){
        console.log("Error fetching funds value");
        return res.status(500).json({
            success: false,
            message:err.message,
        });
    } 
})

module.exports = router;
