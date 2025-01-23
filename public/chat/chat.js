
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
window.addEventListener("DOMContentLoaded",async()=>{
    
        if(token)
        {
            const decodeToken=parseJwt(token) //decoded token to knowits Premium useror Not
            console.log("decodedToken",decodeToken)
            const userId=decodeToken.userId

            const fetchmessage=async()=>{
                try{
            const response = await axios.get("http://localhost:5000/chat/message",{
                headers: { 'Authorization':token }
            });
        const messages = response.data.data
        console.log("messages==response.data",messages)

        // Display all fetched messages
        const div = document.getElementById("chatting");
        div.innerHTML = "";  // Clear previous messages

        messages.forEach(msg => {
            const li = document.createElement("li");
            li.textContent = `name:${msg.user.name} ,userId:${msg.userId}  ,message: ${msg.message}`;
            div.appendChild(li);
        });

        

        }catch(err)
        {
            console.error("Error fetching messages:", err);
        }
            } 
            
        //Call the function every 2 seconds to update messages
        setInterval(fetchmessage, 2000);
    } else {
        console.error("No token found. User not authorized.");
    }
        
       
})
