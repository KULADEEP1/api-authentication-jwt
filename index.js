const express=require('express');
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv").config();


// import routes
const authRoute=require("./routes/auth");
const postRoute=require("./routes/posts");

// connect mongodb.
mongoose.connect(process.env.DB_CONNECT).then(()=>console.log("DB CONNECTED")).catch((err)=>console.log(err))

app.use(express.json());
app.use("/api/users",authRoute);
app.use("/api/posts",postRoute);

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})