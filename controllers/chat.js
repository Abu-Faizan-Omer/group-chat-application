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

  exports.getmessage = async (req, res) => {
    try {
        console.log("User ID from JWT:", req.user.id);

        // Fetch afterMessageId from query params (if available)
        const afterMessageId = req.query.afterMessageId || 0; // Default to 0 if no ID is passed
        console.log("afterMessageId:", afterMessageId);

        // Query condition: Fetch messages after the afterMessageId
        const whereCondition = { userId: req.user.id };
        if (afterMessageId) {
            whereCondition.id = { [sequelize.Op.gt]: afterMessageId }; // Find messages with ID greater than afterMessageId
        }

        // Fetch messages with pagination if needed
        const messages = await Chat.findAll({
            where: whereCondition,
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'ASC']], // Order by createdAt timestamp
        });

        if (messages.length === 0) {
            return res.status(404).json({ message: "No new messages found" });
        }

        res.status(200).json({ message: "Messages fetched successfully", data: messages });
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(400).json({ message: "Error while fetching messages", error: err });
    }
};
