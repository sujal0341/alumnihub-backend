const User=require('../models/userModel');
const bcrypt = require('bcryptjs');
// const { sendMail } = require('./helpers/sendMail');
async function UserSignupController(req,res){
    try {
        console.log(req.body);
        const { email, password,name } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        if(!email || !password || !name){
            return res.status(400).json({error:"Please provide all fields"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if(!hashedPassword){
            return res.status(500).json({error:"Error in hashing password"});
        }
        const payload={
            ...req.body,
            password:hashedPassword,
        }
        const user = new User(payload);
        const saveUser = await user.save();
        res.status(201).json({
            message:"User created successfully",
            user:saveUser,
            error:false,
            success:true,
        })}
    catch (error) {
        res.status(500).json({ error: error.message, error:true,
            success:false, });
    }
}
module.exports=UserSignupController;