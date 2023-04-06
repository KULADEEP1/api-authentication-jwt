const express=require('express');
const router=express.Router();
const UsersData=require("../models/Users");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {registerValidation,loginValidation}=require("../validation")
// used for validation


router.post("/register",async(req,res)=>{
// validate user details.
    const {error}=registerValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    // check if user is already existed.
    const emailExisted=await UsersData.findOne({email:req.body.email});
    if(emailExisted){
        return res.status(400).send("user already existed");
    }
    // hash the password
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(req.body.password,salt);
    console.log(hashPassword)
    // create a new user
    const {name,email,password}=req.body;
    try {
        const newUser=await UsersData.create({name,email,password:hashPassword})
        res.status(200).json(await UsersData.find());
    } catch (error) {
        res.status(404).send(error.message)
    }

})
router.post("/login",async(req,res)=>{
    //  validate login details.
    const {error}=loginValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    // check if user is already existed.
    const user=await UsersData.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send("email is wrong");
    }
    // check the password
    const validPass=await bcrypt.compare(req.body.password,user.password );
    if(!validPass){
       return res.status(400).send("incorrect password");
    }
    // create and assign a token
    const token=jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header("auth-token",token).send(token);
    // res.send("logged in !");
})
module.exports=router;