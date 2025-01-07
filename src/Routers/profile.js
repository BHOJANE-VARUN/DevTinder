const express = require("express");
const userAuth  = require("../middleware/userauth");
const user = require("../models/user");
const { hashPass } = require("../util/hashingPassword");
const profile = express.Router();
const User = require("../models/user.js")
const validator = require("validator");

const aftervalidator = (req,res,next)=>{
    const validinput = [ 'firstName', 'lastName', 'age', 'gender','skills','photoUrl' ];
    const data = req.body;
    const keys = Object.keys(data);
    console.log(keys);
    if(keys.every((val)=> validinput.includes(val))){
       next();
    }
    else{
        res.status(404).send("hacker hai bhai hacker");
    }
};
const passwordInputValid = (req,res,next)=>{
    const validinput = ["oldPassword","newPassword"];
    const data = req.body;
    const keys = Object.keys(data);
    if(keys.every((val)=> validinput.includes(val)))
    {
        next();
    }
    else{
        res.status(404).send("hacker hai bhai hacker");
    }
}

profile.use(userAuth);


profile.get('/view',(req,res)=>{
    res.json(req.user);  
}) 


// if we put any field to update , which is not present in the schema 
// then mongoos will just ignore it 
profile.put("/user",aftervalidator, async (req,res)=>{
    try{
        const userId = req.user._id;
        const data = req.body;
        //console.log(data);
        //console.log(req.user);
        await user.findByIdAndUpdate(userId,data);
        //console.log(varun);
        res.send("updated successfully");
    }catch(e){
        console.error(e);
        res.send(e);
    }
})

profile.put("/password",passwordInputValid,async (req,res)=>{
    try {
        const {oldPassword,newPassword} = req.body;
        const result = await req.user.isPasswordSame(oldPassword);
        if(result)
        {
            if(!validator.isStrongPassword(newPassword))
            {
                throw new Error("New Password is not strong");
            }
            const hash = await hashPass(newPassword);
            // req.user.password = hash;
            // // when we update a object of model manually then save function
            // // is used to update changes onto database, mongoose doesn't reconize
            // // that password is updated because we did it manually so we have to run validate function manually
            req.user.password = hash;
            await req.user.save();
            // req.user.markModified('password'); // Mark the field as modified
            // console.log(req.user.validateSync()); // Check validation errors
            // await req.user.save(); // Save the changes
            
            res.status(200).send("password updated successfully");
        }
        else{
            throw new Error("Invalid Password");
        }
    } catch (e) {
        res.status(500).send("error"+ e);
    }
})

module.exports = profile;





// profile.get("/user", async (req,res)=>{
//     try {
//         const emailId = req.body.emailId;
//         console.log(emailId);
//         const user = await User.findOne({"emailId":emailId});
//         if(user)
//         {
//             res.send(user);
//         }
//         else{
//             res.status(404).send("user not found");
//         }
//     } catch (e) {
//         console.error(e);
//         res.status(500).send(e);
//     }
// })

// profile.get("/feed",async (req,res)=>{
//     try{
//         const user = await User.find();
//         if(user.length){
//             res.json(user);
//         }
//         else{
//            res.send("no user found");
//         }
//     }
//     catch(e)
//     {
//         console.error(e);
//         res.status(404).send("DB operation error");
//     }
// })

// profile.get("/userId", async (req,res)=>{
//     try{
//         const userId = req.body.userId;
//         const user = await User.findById(userId);
//         if(user)
//         {
//             res.json(user);
//         }
//         else{
//             res.status(404).send("User not found");
//         }
//     }catch(e){
//         console.error(e);
//         res.send(e);
//     }
// })

// profile.delete("/user", async (req,res)=>{
//     try{
//         const userId = req.body.userId;
//         const user = await User.findByIdAndDelete(userId);
//         if(user)
//         {
//             res.json(user);
//         }
//         else{
//             res.status(404).send("User not found");
//         }
//     }catch(e){
//         console.error(e);
//         res.send(e);
//     }
// })


// // if we put any field to upate , which is not present in the schema 
// // then mongoos will just ignore it 
// profile.put("/user",aftervalidator, async (req,res)=>{
//     try{
//         const userId = req.body.userId;
//         const data = req.body;
//         //console.log(data);
//         await User.findByIdAndUpdate(userId,data);
//         res.send("updated successfully");
//     }catch(e){
//         console.error(e);
//         res.send(e);
//     }
// })

// profile.put("/userEmail", async (req,res)=>{
//     try{
//         const emailId = req.body.emailId;
//         const data = req.body;
//       //  console.log(data);
//         const upateddata = await User.updateMany({emailId,},data);
//         res.json(upateddata);
//     }catch(e){
//         console.error(e);
//         res.send(e);
//     }
// })

