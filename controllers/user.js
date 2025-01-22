const User=require("../models/user")
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")

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

//generate token for sending userId in a encrypted
function generateAccessToken(id,name){
    return jwt.sign({userId:id,name:name},process.env.TOKEN_SECRET)
 }

 // Export generateAccessToken
 exports.generateAccessToken = generateAccessToken;

 exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (IsStringInvalid(email) || IsStringInvalid(password)) {
        return res.status(400).json({ message: "Email or password is missing" });
      }
  
      // Check if the user exists in the database
      const user = await User.findAll({ where: { email } });
  
      if (user.length > 0) {
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (isPasswordValid) {
          // Password matches
          return res.status(200).json({
            message: "Password match successfully",
            token: generateAccessToken(user[0].id, user[0].name),
          });
        } else {
          return res.status(401).json({ message: "Password does not match, user not authorized" });
        }
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  