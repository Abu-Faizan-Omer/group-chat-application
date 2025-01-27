console.log("new chat")
// Utility to save messages to localStorage
function saveToLocalStorage(messageInput) {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];

    // Add to messages array
    messages.push(messageInput);
    if (messages.length > 10) {
        messages.shift(); // Keep the latest 10 messages only
    }
    localStorage.setItem('messages', JSON.stringify(messages));
}

// Utility to load messages from localStorage and display them
function loadFromLocalStorage() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const messageArea = document.getElementById("message-area");
    messageArea.innerHTML = ""; // Clear existing messages

    // Ensure messages is an array before calling forEach
    if (Array.isArray(messages)) {  //check it is array or not
        messages.forEach((msg) => {
            const div = document.createElement("div");
            div.textContent = `${msg.userId}: ${msg.message}`;
            messageArea.appendChild(div);
        });
    } else {
        console.error("Expected 'messages' to be an array, but found:", messages);
    }
}

// Utility to parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        window.atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

    return JSON.parse(jsonPayload);
}

const token = localStorage.getItem('token');
if (!token) {
    console.error("No token found in localStorage. Authorization will fail.");
}

// Track the last displayed message ID
let lastDisplayedMessageId = null;

// Event listener to send a message
const sendButton = document.getElementById("send-btn");
sendButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const chatInput = document.getElementById("chat-input").value;
    if (!chatInput) {
        alert("Message cannot be empty");
        return;
    }

    try {
        const token=localStorage.getItem('token')  // store at the time of login
        
        const response = await axios.post("http://localhost:5000/chat/send", 
             { message: chatInput },
             {headers: { 'Authorization': token }});

        if (response.status === 201) {
            alert(response.data.message);
            saveToLocalStorage(response.data.data); // Save to localStorage
            displayMessage(response.data.data); // Display the sent message
        }
        console.log('Message sent:', response.data);
        
        console.log("response.data.data  ",response.data.data)
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Error sending message");
    }
});

// Function to display a message in the chat area
function displayMessage(messageData) {
    if (messageData.id === lastDisplayedMessageId) return; // Avoid re-displaying the same message

    const messageArea = document.getElementById("message-area");
    const div = document.createElement("div");
    div.textContent = `${messageData.userId}: ${messageData.message}`;
    messageArea.appendChild(div);

    lastDisplayedMessageId = messageData.id; // Update the last displayed message ID
}
//find group
// Load messages from localStorage on page load
window.addEventListener("DOMContentLoaded", async () => {
    if (token) {
        const decodedToken = parseJwt(token); // Decode token to check user info
        console.log("Decoded Token:", decodedToken);
        
        loadFromLocalStorage();

        async function fetchMessages() {
            // Get the most recent message from localStorage
            const lastMessage = JSON.parse(localStorage.getItem('messages'))?.[0];

            try {
                 // Send a request to get new messages from the server, only after the last message ID
                const response = await axios.get("http://localhost:5000/chat/message", {
                    headers: { Authorization: token },
                    params: { afterMessageId: lastMessage?.id }, // Send the ID of the last message to fetch new ones
                });

                if (response.data.data && response.data.data.length > 0) {
                     // Add the new messages to localStorage
                    response.data.data.forEach((msg) => {
                        saveToLocalStorage(msg);  // Save only the new messages
                        displayMessage(msg);        // Display the new messages on the screen
                    });
                }
               //loadGroups()
            } catch (error) {
                console.error("Error fetching new messages:", error);
            }
        }

        // Fetch new messages every 2 seconds
        //setInterval(fetchMessages, 2000);

        // Fetch initial messages
        await fetchMessages();
        
    } else {
        console.error("No token found. User not authorized.");
    }
});

//  group
window.addEventListener("DOMContentLoaded",async()=>{
    const groupSidebar = document.getElementById("group-sidebar");
    const groupList = document.getElementById("group-list");
    const createGroupBtn = document.getElementById("create-group-btn");
    const messageArea = document.getElementById("message-area");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
  
    let currentGroupId = null;

    // Load groups from server on page load
async function fetchGroups() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found. User not authorized.");
        return;
    }

    try {
        // Fetching groups from the server
        const response = await axios.get("http://localhost:5000/groups/user-groups", {
            headers: { Authorization: token },
        });

        if (response.status === 200) {
            const groups = response.data.groups;
            console.log("groups ",response)

            const grpList = document.getElementById("group-list");
            grpList.innerHTML = ""; // Clear existing groups

            // Loop through each group and create a list item for it
            groups.forEach((group) => {
                const groupElement = document.createElement("li");
                groupElement.textContent = group.name;
                groupElement.dataset.groupId = group.id;
                // Add event listener for click to load group messages
                groupElement.addEventListener("click", () => loadGroupMessages(group.id, group.isAdmin));
                grpList.appendChild(groupElement);
            });
        }
    } catch (error) {
        console.error("Error loading groups:", error);
    }
}

    // Load messages for a specific group
function loadGroupMessages(groupId,isadmin) {
    localStorage.setItem('isAdmin',isadmin);
    localStorage.setItem('groupid',groupId);
    window.location.href = '../chat/testing.html';
  }

  
//group create
const createGrpBtn=document.getElementById("create-group-btn")
createGrpBtn.addEventListener("click",async()=>{
      const groupName=prompt("Enter a Group name")
      if(!groupName)
      {
        alert("Groupname cannot be empty")
        return
      }
      const token=localStorage.getItem('token')
      console.log("token hai ",token)
      try{
      const response=await axios.post("http://localhost:5000/groups/create",
        { name: groupName }, // Send group name in body
        { headers: { 'Authorization': token } }) // Send token as a header
        if(response.status==201)
        {
            console.log("grp created succesfull")
            alert('Group created successfully')

            const grpList=document.getElementById("group-list")
            const groupelement=document.createElement("Li")
            groupelement.textContent=groupName
            grpList.appendChild(groupelement)
        }
    }catch(err){
        console.log('err',err)
        alert("Not created group succesfully")
    } 
})
fetchGroups();
})
