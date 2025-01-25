function saveToLocalStorage(messageinput){
    const messages=JSON.parse(localStorage.getItem('messages')) || []

    //Add to messages
    messages.push(messageinput)
    if(messages.length > 10)
    {
        messages.shift() //remove from the last
    }
    localStorage.setItem('messages',JSON.stringify(messages))
}


/// Example of sending a message
document.getElementById("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const message = document.getElementById("message").value;
    console.log("message",message)
    //const user_id = localStorage.getItem("user_id");  // Assuming this is set when the user logs in

    if (!message) {
        alert("Message cannot be empty");
        return;
    }

    try {
        
        const token=localStorage.getItem('token')
        
        const response = await axios.post("http://localhost:5000/chat/send",{message}, {
            headers: { 'Authorization': token }
        });
        if (response.status === 201) {
            alert(response.data.message);
            
            saveToLocalStorage(response.data.data)  //save to localstorage
        }
        console.log('Message sent:', response.data);
        displayMessage(response.data.data);  // Display the sent message
        console.log("response.data.data  ",response.data.data)
    } catch (error) {
        console.error('Error sending message:', error);
        alert("Error sending message");
    }
});

// Function to display messages on screen
function displayMessage(messageData) {
    const div = document.getElementById("chatting");
    const li = document.createElement("li");

    console.log("messageDAta",messageData)

    // Display user name and message
    li.textContent = `${messageData.userId}: ${messageData.message}`;
    div.appendChild(li);
}
//this is downloaded how to decode jwt token frontend for to check
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const token = localStorage.getItem('token');
if (!token) {
    console.error("No token found in localStorage. Authorization will fail.");
}

function loadFromLocalStorage() {
    // Get messages from localStorage, or set to an empty array if nothing is found
    const messages = JSON.parse(localStorage.getItem('messages')) || [];  // If no messages, default to []

    const div = document.getElementById("chatting");
    div.innerHTML = "";  // Clear existing messages

    // Ensure messages is an array before calling forEach
    if (Array.isArray(messages)) {  //check it is array or not
        messages.forEach(msg => {
            const li = document.createElement("li");
            li.textContent = `${msg.userId}: ${msg.message}`;
            div.append(li);
        });
    } else {
        console.error("Expected 'messages' to be an array, but found:", messages);
    }
}


window.addEventListener("DOMContentLoaded",async()=>{
    
        if(token)
        {
            const decodeToken=parseJwt(token) //decoded token to knowits Premium useror Not
            console.log("decodedToken",decodeToken)
            const userId=decodeToken.userId

            loadFromLocalStorage()

    
    async function fetchmessage() {
        // Get the most recent message from localStorage
        const lastMessage = JSON.parse(localStorage.getItem('messages'))?.[0]; 
    
        try {
            // Send a request to get new messages from the server, only after the last message ID
            const response = await axios.get("http://localhost:5000/chat/message", {
                headers: { 'Authorization': localStorage.getItem('token') },
                params: { afterMessageId: lastMessage?.id }  // Send the ID of the last message to fetch new ones
            });
    
            if (response.data.data && response.data.data.length > 0) {
                // Add the new messages to localStorage
                response.data.data.forEach(msg => {
                    saveToLocalStorage(msg);  // Save only the new messages
                    displayMessage(msg);      // Display the new messages on the screen
                });
            }
        } catch (error) {
            console.error('Error fetching new messages:', error);
        }
    }
    

        //Call the function every 2 seconds to update messages
       // setInterval(fetchmessage, 2000);

        // Call fetchmessage() to load new messages
        await fetchmessage();
    } else {
        console.error("No token found. User not authorized.");
    }      
})
