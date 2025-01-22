const Chat=require("../models/chat")
const User=require("../models/user")
const sequelize=require("sequelize")


exports.postmessage=async (req, res) => {
    const {  message } = req.body;
    console.log('message',req.body.message)
    console.log('User ID from JWT:', req.user.id);  // Check if req.user is properly set
    
  
    if ( !message) {
      return res.status(400).json({ message: ' message are required' });
    }
  
    try {
      // Create a new chat message
      const chatMessage = await Chat.create(
        {userId:req.user.id, message});
  
      return res.status(201).json({
        message: 'Message sent successfully',
        data: chatMessage,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  exports.getmessage = async (req, res, next) => {
    try {
        console.log("User ID from JWT:", req.user.id);  // Debugging line

        const person = await Chat.findAll({
            where: { userId: req.user.id },
            include: [{ model: User, attributes: ['name'] }] // Include user details
        });

        if (person.length === 0) {
            return res.status(404).json({ message: "No messages found" });
        }

        res.status(200).json({ message: "Messages found", data: person });
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(400).json({ message: "Error while fetching messages" });
    }
};

