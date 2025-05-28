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
const grouproutes = require('./routes/group');

//middleware
app.use(cors())
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname, 'public')));

const User=require("./models/user")
const Chat=require("./models/chat")
const Group = require('./models/group');
const  GroupMember = require('./models/group-members');
const GroupMessage = require('./models/group-message');


app.use('/user',userroutes)
app.use('/chat',chatroutes)
app.use('/groups',grouproutes);


User.hasMany(Chat)
Chat.belongsTo(User)

Group.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Group, { foreignKey: 'createdBy', as: 'createdGroups' });

Group.belongsToMany(User, { through: GroupMember });
User.belongsToMany(Group, { through: GroupMember });

GroupMessage.belongsTo(Group, { foreignKey: 'groupId' });
Group.hasMany(GroupMessage, { foreignKey: 'groupId' });

GroupMessage.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(GroupMessage, { foreignKey: 'userId' });

// Serve home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views','signup.html'));  // Home page is home.html
});

// Serve HTML files dynamically from /views folder
app.get("/:page", (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'views', `${page}.html`), (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
        }
    });
});


sequelize.sync()
.then((result)=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is runnig on PORT ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log(`Server has some issue `,err)
})

