var express = require('express');
var router = express.Router();
require('dotenv').config()
var request = require('request');
var parser = require('ua-parser-js');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.mongodb;
const uuid = require("uuid");
var multer= require('multer')
var upload = multer()
var io = require('socket.io-client');
const sharp = require('sharp')

router.post('/v1/live/pwd',function(req,res,next){
    var castId = req.body.castId;
    var pwd = req.body.pwd;
    console.log(castId +' / '+pwd);
    MongoClient.connect(url, (err, client) => {
        assert.equal(null, err)
        console.log('Connected successfully to server');
        const db = client.db('aegi');
        db.collection("users").findOne({username:castId}, function(err, doc){
            if(doc.aikotoba == pwd){
                res.json({status:true});
            }else{
                res.json({status:false})
            }
        });
        client.close();
    });
})

/* GET home page. */
router.get('/v1/user/:id', function(req, res, next) {
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
console.log("Connected successfully to server")
db.collection("users").findOne({userid:req.params.id}, function(err, doc){
res.json(doc);
});
client.close();
});
});

//get profile image
router.get('/v1/user/image/:id', function(req, res, next) {
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
console.log("Connected successfully to server")
db.collection("users").findOne({userid:req.params.id}, function(err, doc){
res.redirect(doc.profile_icon);
});
client.close();
});
});

router.get('/v2/user/image/:id', function(req, res, next) {
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
console.log("Connected successfully to server")
db.collection("users").findOne({username:req.params.id}, function(err, doc){
res.redirect(doc.profile_icon);
});
client.close();
});
});

router.post('/v1/broadcast', function(req, res, next) {
    //add user settings
    var castId = req.body.castId;
    var liveStatus = req.body.liveStatus;
    MongoClient.connect(url, (err, client) => {
    assert.equal(null, err)
    console.log('Connected successfully to server');
    const db = client.db('aegi');
    const date1 = new Date();
    var doc = {
        liveStatus:liveStatus,
        aikotoba:req.body.aikotoba,
        liveType:req.body.liveType
    }
    db.collection('users').updateOne({username:castId},{$set:doc},{upsert:true});
    client.close();
    });
    res.send(req.body);
    })

module.exports = router;
