const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const request = require("request");
var moment = require('moment');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.mongodb;

process.on('uncaughtException', function(err) {
console.log(err);
});

const io = require('socket.io')(server, {
cors: {
origin: "*",
methods: ["GET", "POST"]
}});
const port = process.env.PORT || 4001;

server.listen(port, () => {
console.log('Server listening at port %d', port);
});

var live_connection = [];
var live_guest = {};
var broadcast = {};
var numClients = {};
var usertype = {};

io.sockets.on('connection', function(socket) {

socket.on('live_connect',function(data,fn){
socket.join(data.liveId);
live_guest[socket.id] = data.liveId;
usertype[socket.id] = "guest";
if (numClients[data.liveId] == undefined) {
    numClients[data.liveId] = 1;
} else {
    numClients[data.liveId]++;
}
})

socket.on('broadcast_connect',function(data,fn){
    socket.join(data.liveId);
    broadcast[socket.id] = data.liveId;
    usertype[socket.id] = "broadcast";
})

socket.on('live_guest_count',function(data,fn){
    var _count = numClients[data.castId];
    if(_count == undefined){
        _count = 0;
    }
    io.to(data.castId).emit('live_guest_count',{count:_count});
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
    if(usertype[socket.id] == "guest"){
        var _liveid = live_guest[socket.id];
        numClients[_liveid]--;
    }else if(usertype[socket.id] == "broadcast"){
        io.to(broadcast[socket.id]).emit("end");
        var castId = broadcast[socket.id];
        var liveStatus = false;
        MongoClient.connect(url, (err, client) => {
        assert.equal(null, err)
        console.log('Connected successfully to server');
        const db = client.db('aegi');
        const date1 = new Date();
        var doc = {
            liveStatus:liveStatus
        }
        db.collection('users').updateOne({username:castId},{$set:doc},{upsert:true});
        client.close();
        });
    }
})
})
