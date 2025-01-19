const express=require("express")
const dotenv=require("dotenv")
dotenv.config()
const cors=require("cors")
const bodyparser=require('body-parser')
const sequelize = require("./utils/database")
const app=express()

const userroutes=require('./routes/user')

//middleware
app.use(cors())
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

const User=require("./models/user")


app.use('/user',userroutes)

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