const bcrypt = require("bcrypt");
const saltrounds = 10;

const hashPass = async (pass)=>{
    const hashed = await bcrypt.hash(pass,saltrounds);
    return hashed;
}
const comparePass = async (pass,key)=>{
    return await bcrypt.compare(pass,key);
}
module.exports = {hashPass,comparePass};