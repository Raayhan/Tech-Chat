const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getSectionUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
//Set Static folder

app.use(express.static(path.join(__dirname, 'public')));

const Admin = 'TechChat';
//Run when a client connects

io.on('connection', socket =>{

    socket.on('joinSection', ({username, section}) =>{

        const user = userJoin(socket.id, username, section);
        socket.join(user.section);

         //Welcome current user
    socket.emit('message', formatMessage(Admin,'Welcome to Tech Chat!'));

    //Broadcast when a user connects
    socket.broadcast.to(user.section).emit('message', formatMessage(Admin,`${user.username} has joined the chat`));

     // Send users & section info

   io.to(user.section).emit('sectionUsers',{
    section : user.section,
    users: getSectionUsers(user.section)
        });
    });
   
  


    //Listen for chatMessage

    socket.on('chatMessage', (msg) => {

        const user = getCurrentUser(socket.id);

        io.to(user.section).emit('message', formatMessage(user.username, msg));
    });

    
    //Runs when client disconnects
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);
        if (user){
            io.to(user.section).emit('message', formatMessage(Admin,`${user.username} has left the chat`));
        
            // Send users & section info

            io.to(user.section).emit('sectionUsers',{
                section : user.section,
                users: getSectionUsers(user.section)
            });

        }
        
    })

});
const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
