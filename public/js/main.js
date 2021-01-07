const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const sectionName = document.getElementById('section-name');
const userList = document.getElementById('users');

//Get Username & Section from URL
const { username, section } = Qs.parse(location.search, {
   ignoreQueryPrefix: true
});


const socket = io();

//Join Chat Section

socket.emit('joinSection',{username, section});

//Get Section and Users
socket.on('sectionUsers', ({section, users}) =>{
   outputSectionName(section);
   outputUsers(users);

})

//Message from server

socket.on('message', message =>{
   console.log(message);
   outputMessage(message);

   //Scroll down
   chatMessages.scrollTop = chatMessages.scrollHeight;


});

//Message Submit
chatForm.addEventListener('submit', (e)=>{
   e.preventDefault();

   //Get message text
   const msg = e.target.elements.msg.value;
   
   //Emit message to the server
   socket.emit('chatMessage', msg);
   
   //Clear inputs
   e.target.elements.msg.value = '';
   e.target.elements.msg.focus();
});

//Output message to DOM

function outputMessage(message){
   const div = document.createElement('div');
   div.classList.add('message');
   div.innerHTML = `	<p class="meta">${message.username} <span> ${message.time}</span></p>
   <p class="text">
     ${message.text}
   </p>`;
   document.querySelector('.chat-messages').appendChild(div);
}

//Add Section name to DOM
function outputSectionName(section){

   sectionName.innerText = section;

}

//Add users to DOM

function outputUsers(users){
   userList.innerHTML = `
   ${users.map(user => `<li>${user.username}</li>`).join('')}
   ` ;
}