 console.log("testing check")
 document.addEventListener('DOMContentLoaded', function () {
      const messageArea = document.getElementById('message-area');
      const messageInput = document.getElementById('message-input');
      const sendButton = document.getElementById('send-btn');
      let currentChatId = localStorage.getItem('groupId'); // Retrieve group ID from localStorage
      console.log(currentChatId);
      // Load chat messages dynamically
      function loadChat() {
        let currentChatId = localStorage.getItem('groupid');
        console.log(currentChatId);
        axios.get(`http://localhost:5000/groups/messages/${currentChatId}`, {
          headers: { Authorization: localStorage.getItem('token') }
        })
        .then(response => {
          const messages = response.data.messages;
          messageArea.innerHTML = ''; // Clear the message area
          // Loop through the messages and display them
          messages.reverse().forEach(msg => {
            const div = document.createElement('div');
            div.classList.add('message', 'chat');
            div.innerHTML = `<strong>${msg.username}:</strong> ${msg.message}`;
            messageArea.appendChild(div);
          });
        })
        .catch(err => console.error('Error loading chat:', err));
      }
      // Send message
      sendButton.addEventListener('click', function () {
        const message = messageInput.value;
        let currentChatId = localStorage.getItem('groupid');
        if (message && currentChatId) {
          const payload = {
            message: message,
            groupId: currentChatId
          };
          axios.post('http://localhost:5000/groups/send-message', payload, {
            headers: { Authorization: localStorage.getItem('token') }
          })
          .then(() => {
            messageInput.value = ''; // Clear input field
            loadChat(); // Reload chat messages
          })
          .catch(err => console.error('Error sending message:', err));
        }
      });
      // Check if the user is an admin and show/hide the Add Member button
      const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Assuming 'isAdmin' is stored as 'true' or 'false' in localStorage
      if (isAdmin) {
        const addMemberButton = document.createElement('button');
        addMemberButton.classList.add('btn', 'btn-success', 'add-member-btn');
        addMemberButton.id = 'add-member-btn';
        addMemberButton.textContent = 'Add Member';
        // Add event listener to Add Member button
        addMemberButton.addEventListener('click', function () {
          const phoneNo = prompt('Enter the phone number of the person to add:');
          let currentChatId = localStorage.getItem('groupid');
          if (phoneNo && currentChatId) {
            const payload = {
              phonenumber: phoneNo,
              groupId: currentChatId
            };
            axios.post(`http://localhost:5000/groups/add-member`, payload, {
              headers: { Authorization: localStorage.getItem('token') }
            })
            .then(response => {
             
              let msg = response.data.message;
              
              alert(msg);
             loadChat(); // Reload chat messages
            })
            .catch((err) => 
            alert("Unable to add Member/User doesnt exist"));
          }
        });
        // Append Add Member button to the chat container
        document.querySelector('.chat-container').insertBefore(addMemberButton, messageArea);
      }
      // Initially load chat (Example with group ID from localStorage)
      loadChat();
      // Update chat every 1 second
      //setInterval(loadChat, 1000);
    });