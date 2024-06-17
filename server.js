const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8080;
const rooms = {};

app.use(express.static('public'));

io.on('connection', socket => {
    socket.on('join-call', () => {
        const roomId = 'default-room';
        socket.join(roomId);

        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }
        rooms[roomId].push(socket.id);

        rooms[roomId].forEach(clientId => {
            if (clientId !== socket.id) {
                socket.to(clientId).emit('user-connected', socket.id);
            }
        });

        socket.on('disconnect', () => {
            rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
            socket.to(roomId).emit('user-disconnected', socket.id);
        });

        socket.on('offer', (userId, offer) => {
            socket.to(userId).emit('offer', socket.id, offer);
        });

        socket.on('answer', (userId, answer) => {
            socket.to(userId).emit('answer', socket.id, answer);
        });

        socket.on('ice-candidate', (userId, candidate) => {
            socket.to(userId).emit('ice-candidate', socket.id, candidate);
        });

        socket.on('play', (data) => {
            socket.to(roomId).emit('play', data);
        });

        socket.on('pause', (data) => {
            socket.to(roomId).emit('pause', data);
        });

        socket.on('seek', (data) => {
            socket.to(roomId).emit('seek', data);
        });

        socket.on('chat', (message) => {
            socket.to(roomId).emit('chat', `${socket.id}: ${message}`);
        });
    });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
