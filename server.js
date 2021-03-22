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

var live_connection = [];
var live_guest = {};
var broadcast = {};
var numClients = {};

io.sockets.on('connection', function(socket) {

socket.on('live_connect',function(data,fn){
socket.join(data.liveId);
live_guest[socket.id] = data.liveId;
if (numClients[data.liveId] == undefined) {
    numClients[data.liveId] = 1;
} else {
    numClients[data.liveId]++;
}
})

socket.on('broadcast_connect',function(data,fn){
    socket.join(data.liveId);
    broadcast[socket.id] = data.liveId;
})

socket.on('live_guest_count',function(data,fn){
socket.emit('live_guest_count',{count:numClients[data.castId]});
})

socket.on("live_end",function(data,fn){
    io.to(data.liveId).emit("end");
})

socket.on("live_time_update",function(data,fn){
    io.to(data.liveId).emit('live_time_update',{liveTime:data.liveTime});
})

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

socket.on('disconnecting', function (data,fn) {
    console.log(socket.room)
    var _liveid = live_guest[socket.id];
    numClients[_liveid]--;
})
})
