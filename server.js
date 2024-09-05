const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', socket => {
    console.log('A user connected');
    
    // Notify all clients of a new user
    socket.broadcast.emit('newUser', socket.id);

    socket.on('offer', ({ id, offer }) => {
        socket.to(id).emit('offer', { id: socket.id, offer });
    });

    socket.on('answer', ({ id, answer }) => {
        socket.to(id).emit('answer', { id: socket.id, answer });
    });

    socket.on('candidate', ({ id, candidate }) => {
        socket.to(id).emit('candidate', { id: socket.id, candidate });
    });

    socket.on('chatMessage', (msg, username) => {
        const timestamp = new Date().toLocaleTimeString();
        io.emit('chatMessage', { msg, username, timestamp });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.broadcast.emit('disconnectUser', socket.id);
    });
});


server.listen(3000, () => {
    console.log('Server running on port 3000');
});
