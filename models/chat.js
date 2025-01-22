const sequelize=require("../utils/database")
const Sequelize=require("sequelize")
//const User=require("./user")

const Chat=sequelize.define('chat',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
   
    message:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=Chat