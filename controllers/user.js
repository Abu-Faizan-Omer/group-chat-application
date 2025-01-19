const User=require("../models/user")
const bcrypt=require('bcrypt')

function IsStringInvalid(string){
    if(string==undefined || string.length===0)
    {
        return true
    }
    else{
    return false
    } 
}

exports.signup=async(req,res)=>{
    try{
    const {name,email,phonenumber,password}=req.body
    if(IsStringInvalid(name) ||IsStringInvalid(email) || IsStringInvalid(phonenumber) ||IsStringInvalid(password))
    {
        return res.status(500).json({message:`Something is missing`})
    }

    // Check if user already exists
    const finduser = await User.findOne({ where: { email } });
    if (finduser) {
        return res.status(400).json({ message: "User already registered" });
    }

    //use bcrpt to password secure
    const saltround=10
    bcrypt.hash(password,saltround,async(err,hash)=>{       
        const newUser=await User.create({name,email,phonenumber,password:hash})
        return res.status(201).json({message:`User created Succesfully in DB`})
        }
    )
}catch(err)
{
    return res.status(500).json({message:`Failed to create DB`})
}

}

console.log('controller')