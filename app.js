const express=require("express")
const dotenv=require("dotenv")
dotenv.config()
const cors=require("cors")
const bodyparser=require('body-parser')
const sequelize = require("./utils/database")
const path=require("path")
const app=express()

const userroutes=require('./routes/user')
const chatroutes=require("./routes/chat")

//middleware
app.use(cors())
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

// app.use((req,res)=>{
//     console.log('urlll',req.url)
//     res.sendFile(path.join(__dirname,`public/${req.url}`))
// })
//app.use(express.static(path.join(__dirname, 'public')));

const User=require("./models/user")
const Chat=require("./models/chat")

app.use('/user',userroutes)
app.use('/chat',chatroutes)

User.hasMany(Chat)
Chat.belongsTo(User)

sequelize.sync()
.then((result)=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is runnig on PORT ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log(`Server has some issue `,err)
})

//this is second sighnup page