const express=require("express");
const router=express.Router();
const verify=require("./verifyToken");
router.get("/",verify,(req,res)=>{
    res.json({
        post:{
            title:"my first post",
            desc:"you cannot see util you are logged in"
        }
    })
})


module.exports=router;