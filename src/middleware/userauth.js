const jwt = require("jsonwebtoken");
const user = require("./../models/user")


const userAuth = async (req,res,next)=>{
    try {
        const {token} = req.cookies;
        if(!token)
        {
            throw new Error("invalid token");
        }
        const {_id} = jwt.verify(token,"varun");
        const log = await user.findById(_id);
        if(!log)
        {
            throw new Error("invalid token");
        }
        req.user = log;      
        next();
    } catch (e) {
        res.status(402).send("Error" + e);
    }

}
module.exports = userAuth;