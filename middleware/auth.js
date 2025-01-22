const jwt=require("jsonwebtoken")
const User=require("../models/user")

const authenticate=(req,res,next)=>{
    try{
        const token=req.header("Authorization")
        console.log(token)
        if (!token) {
            throw new Error("Token missing");
          }
        const user=jwt.verify(token,process.env.TOKEN_SECRET) // decrypting anf find user
        console.log("userId>>>>",user.userId)
        User.findByPk(user.userId).then(user =>{

            req.user=user //req is global so i m telling to next function i have that user
            next()
        })
    }catch(err){
        console.log(err)
        return res.status(401).json({success:false})
    }
}
module.exports={
    authenticate
}    
