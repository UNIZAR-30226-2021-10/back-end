const express = require('express');   
const http = require('http');    
const socketio = require ('socket.io'); //Socket client (frontend)
const cors = require('cors');
const router = require('./router');
//Funciones diseñadas en fichero users.js
const {addUser, removeUser, getUser, getUsersInChatCode} = require('./users.js');

const chat = express();
const server = http.createServer(chat);
const io = socketio(server);
chat.use(cors());
chat.use(router); 

//URL del servidor de imágenes
const baseUrl = 'http://localhost:3060';
const admin = baseUrl+"/appImages/ventanas/admin.png";

// Conexión al chat
io.on('connection', (socket) => {
    console.log("Se ha establecido una conexion nueva");

    // Unión de un usuario con nombre "username" al chat con codigo "code"
    socket.on('join', ({username, code, firstJoin, avatar}, callback) =>{
        // Añadir usuario al chat: devuelve error o el usuario añadido
        const {error, user} = addUser({id: socket.id, username: username, code: code});
        if (error) return callback(error); 

        // Se une el usuario a su sala (sala con codigo user.code)
        socket.join(user.code); 
        if (firstJoin){
            // 'admin' envía message al usuario que se ha unido 'user.username'
            const mensajeUserJoin = {sender: 'admin', avatar: admin, text: "Bienvenido al chat "+ user.username, date: "admin" };
            socket.emit('message', mensajeUserJoin);
            // 'admin' envía message a todos los usuarios de la sala de 'user.username'
            const mensajeUsersInChat = {sender: 'admin', avatar: admin, text: "Se ha unido "+ user.username, date: "admin" };
            socket.broadcast.to(user.code).emit('message', mensajeUsersInChat);
            // Añadir a jugadores
            const jugador = {username: user.username, avatar: avatar, puntos:'0'}
            socket.broadcast.to(user.code).emit('newPlayer', jugador);
        } else {
            // 'admin' envía message al usuario que se ha unido 'user.username'
            const mensajeUserJoin = {sender: 'admin', avatar: admin, text: "Bienvenido de nuevo "+ user.username, date: "admin" };
            socket.emit('message', mensajeUserJoin);
            // 'admin' envía message a todos los usuarios de la sala de 'user.username'
            const mensajeUsersInChat = {sender: 'admin', avatar: admin, text: "Ha vuelto "+ user.username, date: "admin" };
            socket.broadcast.to(user.code).emit('message', mensajeUsersInChat);
        }
        
        console.log("Se ha unido un usuario al chat. Nombre: "+ username + ", Code: " + code);
        callback();
    });

    // Envío de un mensaje "message" a todos los usuarios de la sala
    socket.on('sendMessage', (message, callback) =>{
        const user = getUser(socket.id); // Buscar usuario del chat
        // 'user.username' envía message "message" a todos los usuarios de su sala
        io.to(user.code).emit('message', message); 

        console.log(user.username + " ha enviado un mensaje en el chat.");
        //callback();
    });
    
    // Desconexión al chat
    socket.on('disconnection', () =>{
        const user = removeUser(socket.id); // Borrar al usuario del chat
        if (user){
            // 'user.username' envía message "message" a todos los usuarios de su sala
            const mensajeUsersInChat = {sender: 'admin', avatar: admin, text: user.username + ' ha salido.', date: "admin" };
            io.to(user.code).emit('message', mensajeUsersInChat);
            console.log("Se ha desconectado el usuario: " + user.username);
        }
    });

});

const PORT = process.env.PORT || 5000;  //Puerto
server.listen(PORT, () => console.log("Server has started on port " + PORT));