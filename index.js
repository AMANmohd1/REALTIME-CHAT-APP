require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);

app.use(express.static(path.join(__dirname,'public')));


const users = {};

app.get('/',(req,res)=>{
    res.render('public\index.html')
})

const port = process.env.PORT || 3000;
server.listen(port,()=>{
    console.log(`Listening on Port ${port}`)
});

const io = require('socket.io')(server)

io.on('connection',(socket) =>{
    // console.log('New Connection WS');

    socket.on('new-user-joined',name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name)
    });

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message,name: users[socket.id]})
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id];
    });
})