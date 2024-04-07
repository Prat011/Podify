const express = require("express");
const app = express();
const User = require("../models/User")
const router = express.Router();
const bcrypt = require("bcrypt");
const {getToken} = require("../utils/helpers");


router.post("/register",async (req,res)=>{
    //email, password,firstname,lastname,username

    const {email,password,firstName,lastName,username} = req.body;
    //Checking if user with email exists, we throw error if it does exist

    const user = await User.findOne({email: email});
    if(user){
        return res.status(403).json({error:"Email already exists in database"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserData = {email,password: hashedPassword,firstName,lastName,username};
    const newUser = await User.create(newUserData);

    const token = await getToken(email, newUser);

    const userToReturn = {...newUser.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

router.post("/login",async(req,res)=>{

    const {email,password}=req.body;
    const user = await User.findOne({email:email});
    if(!user){
        return res.
        status("403").
        json({"err":"Invalid Credentials"});
    }
    //bcrypt compares passwords in plaintext and hash
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.
        status("403").
        json({"err":"Invalid password"});
    }

    const token = await getToken(user.email, user);
    const userToReturn = {...user.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});



module.exports = router;