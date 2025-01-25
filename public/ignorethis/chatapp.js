
document.addEventListener('DOMContentLoaded', function () {
    const messageArea = document.getElementById('message-area');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
  
    
    const addMessage = (type, text) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}`;
      messageDiv.textContent = text;
      messageArea.appendChild(messageDiv);
    };
  
  
    const loadMessages = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to log in to view messages.');
        window.location.href = '../Login/login.html';
        return;
      }
  
     
      const lastMessageId = localStorage.getItem('lastMessageId') || -1;
  
      axios
        .get(`http://localhost:5000/text/messages?lastMessageId=${lastMessageId}`, {
          headers: { Authorization: token },
        })
        .then((response) => {
          const messages = response.data.messages;
          if (Array.isArray(messages) && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            console.log(lastMessage);
          
            localStorage.setItem('lastMessageId', lastMessage.id);
  
            // Update the messages in localStorage (latest 10 messages)
            const storedMessages = JSON.parse(localStorage.getItem('storedMessages')) || [];
            const updatedMessages = [...storedMessages, ...messages]
              .slice(-10); // Keep only the latest 10 messages
            localStorage.setItem('storedMessages', JSON.stringify(updatedMessages));
          }
        })
        .catch((error) => {
          console.error('Error loading messages:', error);
        })
        .finally(() => {
         // loadMessages();
         // setTimeout(loadMessages, 1000); 
        });
    };
  
    // Display messages from localStorage
    const displayMessages = () => {
      const storedMessages = JSON.parse(localStorage.getItem('storedMessages')) || [];
      messageArea.innerHTML = '';
  
      // Add messages from localStorage to the chat area
      storedMessages.forEach((msg) => {
        const text = `${msg.name}: ${msg.message}`;
        addMessage('chat', text);
      });
  
      
      messageArea.scrollTop = messageArea.scrollHeight;
      
   //   setTimeout(displayMessages, 1000); 
    };
  
    // Send a new message
    sendBtn.addEventListener('click', () => {
      const message = chatInput.value.trim();
  
      if (!message) {
        alert('Please enter a message!');
        return;
      }                                                         
  
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to be logged in to send a message.');
        return;
      }
  
      const payload = { message };
      axios
        .post('http://localhost:5000/chat/send', payload, {
          headers: { Authorization: token },
        })
        .then(() => {
          //loadMessages();
          addMessage('chat', `You: ${message}`);
          chatInput.value = ''; 
          loadMessages(); 
          const messageArea = document.getElementById('message-area');
          messageArea.scrollTop = messageArea.scrollHeight; 
        })
        .catch((error) => {
          console.error('Error sending message:', error);
          alert('Failed to send message. Please try again.');
        });
    });
  
    // Start the two continuous processes
    loadMessages(); 
    displayMessages(); 
  });
  
  
  
  
  
  //group chat
  document.addEventListener("DOMContentLoaded", function () {
    const groupSidebar = document.getElementById("group-sidebar");
    const groupList = document.getElementById("group-list");
    const createGroupBtn = document.getElementById("create-group-btn");
    const messageArea = document.getElementById("message-area");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
  
    let currentGroupId = null;
  
    // Fetch and display groups
    function fetchGroups() {
      const token = localStorage.getItem('token');
  
     
      axios.get('http://localhost:5000/groups/user-groups',{headers: { Authorization: token }}) // Replace with your endpoint
        .then(response => {
          const groups = response.data.groups;
          console.log(groups);
          groupList.innerHTML = '';
          groups.forEach(group => {
            const li = document.createElement('li');
            li.textContent = group.name;
            li.dataset.groupId = group.id;
            li.addEventListener('click', () => loadGroupMessages(group.id,group.isAdmin));
            groupList.appendChild(li);
          });
        })
        .catch(error => console.error(error));
    }
  
    // Load messages for a specific group
    function loadGroupMessages(groupId,isadmin) {
      localStorage.setItem('isAdmin',isadmin);
      localStorage.setItem('groupid',groupId);
      window.location.href = './testing.html';
    }
  
    // Create a new group
    createGroupBtn.addEventListener('click', function () {
      const groupName = prompt("Enter group name:");
      const token = localStorage.getItem('token');
      if (groupName) {
        axios.post('http://localhost:5000/groups/create', { name: groupName },{headers: { Authorization: token }}) // Replace with your endpoint
          .then(() => fetchGroups())
          .catch(error => console.error(error));
      }
    });
  
    // Send a message
    sendBtn.addEventListener('click', function () {
      const text = chatInput.value;
      if (text && currentGroupId) {
        axios.post(`/api/groups/${currentGroupId}/messages`, { text }) // Replace with your endpoint
          .then(() => {
            chatInput.value = '';
            loadGroupMessages(currentGroupId);
          })
          .catch(error => console.error(error));
      }
    });
  
    // Fetch groups on load
    fetchGroups();
  });