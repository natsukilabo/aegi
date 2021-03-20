const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const request = require("request");
var moment = require('moment');
require('dotenv').config();

process.on('uncaughtException', function(err) {
console.log(err);
});

const io = require('socket.io')(server, {
cors: {
origin: "*",
methods: ["GET", "POST"]
}});
const port = process.env.PORT || 4000;

server.listen(port, () => {
console.log('Server listening at port %d', port);
});

io.sockets.on('connection', function(socket) {

socket.on('comment', function(data,fn){
io.emit("comment",{
    fromId : data.fromId,
    fromName : data.fromName,
    fromProfileIcon :data.fromProfileIcon,
    toId : data.toId,
    message : data.message,
    createdAt : moment().format()
})
})

socket.on('disconnect', function (data,fn) {

})
})
