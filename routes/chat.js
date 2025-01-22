const express=require("express")
const router=express.Router()

const chatcontrollers=require("../controllers/chat")
const userauthentication=require("../middleware/auth")

router.post("/send",userauthentication.authenticate,chatcontrollers.postmessage)
router.get("/message",userauthentication.authenticate,chatcontrollers.getmessage)
module.exports=router