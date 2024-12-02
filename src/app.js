const express = require("express");

const app = express();
app.use("/hello",(req,res)=>{
    res.send("hello world");
})
app.use("/test",(req,res)=>{
    res.send("testing");
})

app.listen(7777,()=>{
    console.log("server running on port:",7777);
});