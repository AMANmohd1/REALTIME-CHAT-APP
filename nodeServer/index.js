const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);

app.use(express.static(path.join(__dirname,'public')));


const users = {};

app.get('/',(req,res)=>{
    res.sendFile('D:\WEB DEV\REALTIME CHAT APP\public\index.html')
})

server.listen(3000,()=>{
    console.log('Listening on Port 3000')
});

const io = require('socket.io')(server)

io.on('connection',(socket) =>{
    console.log('New Connection WS');

    socket.on('new-user-joined',name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name)
    });

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message,name: users[socket.id]})
    });
})