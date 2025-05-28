const User=require("../models/user")
const Chat=require("../models/chat")
const Group=require("../models/group")
const GroupMember=require("../models/group-members")
const GroupMessage=require("../models/group-message")

exports.createGroup=async(req,res)=>{
    try{
        console.log("Request body:", req.body);
    const {name} = req.body
    console.log("GrpName ",name )
    if(!name)
    {
        res.status(400).json({message:"Group Name should be required"})
    }
    const newgroup=await Group.create({
        name,
        createdBy:req.user.id
    })
    
    // Add the creator as an admin member of the group
    await GroupMember.create({
        userId:req.user.id,
        groupId:newgroup.id,
        isAdmin:true
    })   
      return res.status(201).json({message:"Group Created Succesfully",group:newgroup})
}catch(err){
    console.log("error",err)
    return res.status(400).json({message:"An Error Occured",err})
}  
}


// Get all groups for the authenticated user
exports.getUserGroups = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("getUserGroups User ID:", userId);

        // Step 1: Fetch all group memberships for the user, including the isAdmin flag
        const groupMemberships = await GroupMember.findAll({
            where: { userId }, // Find records where the user is a member
            attributes: ['groupId', 'isAdmin'], // Fetch the groupId and isAdmin attributes
        });

        // Step 2: Check if the user is part of any groups
        if (groupMemberships.length === 0) {
            return res.status(404).json({ message: 'No groups found for this user' });
        }

        // Extract group IDs and isAdmin flags from the membership records
        const groupDetails = groupMemberships.map((membership) => ({
            groupId: membership.groupId,
            isAdmin: membership.isAdmin
        }));

        // Step 3: Fetch group details for the extracted group IDs
        const groups = await Group.findAll({
            where: {
                id: groupDetails.map(detail => detail.groupId), // Match groups with the IDs found in the GroupMember table
            },
            attributes: ['id', 'name'], // Include only the necessary attributes
        });

        // Step 4: Combine the group details with the isAdmin flag
        const responseGroups = groups.map(group => {
            const membership = groupDetails.find(detail => detail.groupId === group.id);
            return {
                id: group.id,
                name: group.name,
                isAdmin: membership.isAdmin // Include the isAdmin flag for each group
            };
        });

        // Step 5: Send the group details as the response
        return res.status(200).json({ groups: responseGroups });
    } catch (error) {
        console.error("Error fetching groups:", error);
        return res.status(500).json({ message: 'An error occurred while fetching groups', error });
    }
};



// Add a member to a group
exports.addMember = async (req, res) => {
    try {
        const { phonenumber, groupId } = req.body;
        console.log("Adding member with phone:", phonenumber, "to group:", groupId);


        // Ensure the admin user is not trying to add themselves
        if (req.user.phonenumber === phonenumber) {
            return res.status(400).json({ message: "You cannot add yourself to the group" });
        }

        // Step 1: Check if the authenticated user is an admin of the group
        const isAdmin = await GroupMember.findOne({
            where: { userId: req.user.id, groupId, isAdmin: true },
        });

        if (!isAdmin) {
            return res.status(403).json({ message: 'Only admins can add members to the group' });
        }

        // Step 2: Fetch the user ID for the provided phone number
        const user = await User.findOne({
            where: { phonenumber },
        });

        if (!user) {
            return res.status(404).json({ message: 'No user found with the provided mobile number' });
        }

        const userId = user.id;

        // Step 3: Check if the user is already a member of the group
        const isAlreadyMember = await GroupMember.findOne({
            where: { userId, groupId },
        });

        if (isAlreadyMember) {
            return res.status(201).json({ message: 'User is already a member of this group' });
        }

        // Step 4: Add the user to the group
        await GroupMember.create({ userId, groupId });

        return res.status(200).json({ message: 'Member added successfully' });
    } catch (error) {
        console.error("Error adding member:", error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
};
//send message

exports.sendMessage = async (req, res) => {
    try {
        const { message, groupId } = req.body;
        console.log(message, groupId, req.user.id);

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Check if the user is a member of the group
        const isMember = await GroupMember.findOne({
            where: { userId: req.user.id, groupId }
        });

        // If the user is not a member of the group, deny message sending
        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        // Now create the message record in the GroupMessage table
        const newMessage = await GroupMessage.create({
            message,
            userId: req.user.id,
            groupId: groupId
        });

        return res.status(201).json({ message: 'Message sent successfully', groupMessage: newMessage });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
};



// Get the last 10 messages of a group
exports.getLastMessages = async (req, res) => {
    try {
        const { groupId } = req.params; // Get the groupId from request params.

        if (!groupId) {
            return res.status(400).json({ message: 'Group ID is required' });
        }

        // Step 1: Validate if the group exists
        const groupExists = await Group.findByPk(groupId);

        if (!groupExists) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Step 2: Fetch the latest messages from the group with sender's username
        const messages = await GroupMessage.findAll({
            where: { groupId }, // Match the groupId
            attributes: ['id', 'message', 'timestamp'], // Fetch relevant message fields
            include: [{
                model: User, // Join with User model
                attributes: ['id', 'name'], // Fetch user ID and name
            }],
            order: [['timestamp', 'DESC']], // Order by latest messages
            limit: 10, // Fetch only the last 10 messages
        });
 // console.log(JSON.stringify(messages));
        // Step 3: Format the messages for response
        const formattedMessages = messages.map(msg => ({
            username: msg.user ? msg.user.name : 'Unknown', // If user data exists
            message: msg.message,
            timestamp: msg.timestamp,
        }));

        return res.status(200).json({ messages: formattedMessages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
};
