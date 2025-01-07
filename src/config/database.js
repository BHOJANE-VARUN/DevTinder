const mongoose = require("mongoose");
const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://varunbhojane07:Varunbhojane07@varun-cluster.cv4xb.mongodb.net/devtinder");
}
module.exports = connectDB;
/*
mongodb.net/ is connect to whole cluster
mongodb.net/devtinder is connect to specific database i.e devtinder
*/

