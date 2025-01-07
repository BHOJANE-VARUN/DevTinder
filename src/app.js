const express = require("express");
const app = express();
const  connectDB = require("./config/database.js");
const User = require("./models/user.js")
const cookieParser = require('cookie-parser')

// we can not directly access the body of json as object in our request object
// we have to use some middleware to convert the json into js object for us
// express provides a json middleware for us 
app.use(express.json());
app.use(cookieParser());

// import /auth router
const authRouter = require("./Routers/auth.js");
app.use("/auth",authRouter);

// import /user router
const profileRouter = require("./Routers/profile.js");
app.use("/profile",profileRouter);

const requestRouter = require("./Routers/request.js");
app.use("/request",requestRouter);

const userRouter = require("./Routers/user.js");
app.use("/user",userRouter);

connectDB().then(()=>{
    console.log("connection is successfull");
    // always connect to database first then starting to ports
    app.listen(7777,()=>{
        console.log("Server running on port no.",7777);
    })
}).catch((err)=>{
    console.log("connection is unsuccessfull");
})