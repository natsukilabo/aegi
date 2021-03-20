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

router.get('/v1/toy/:id', function(req, res, next) {
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
console.log("Connected successfully to server")
db.collection("toys").findOne({uid:req.params.id}, function(err, doc){
res.json(doc);
});
client.close();
});
});

router.post('/v1/user/settings/ytl', function(req, res, next) {
//add user ytl settings
var userid = req.body.uid;
var yt_status = req.body.yt_status;
var yt_api = req.body.yt_api;
var yt_liveid = req.body.yt_liveid;
var yt_comment = req.body.yt_comment;
var yt_speed = req.body.yt_speed;
var yt_sec = req.body.yt_sec;
MongoClient.connect(url, (err, client) => {
assert.equal(null, err)
console.log('Connected successfully to server');
const db = client.db('aegi');
const date1 = new Date();
var doc = {
userid:userid,
yt_status:yt_status,
yt_api:yt_api,
yt_liveid:yt_liveid,
yt_comment:yt_comment,
yt_speed:yt_speed,
yt_sec:yt_sec
}
db.collection('settings').updateOne({userid:userid},{$set:doc},{upsert:true});
client.close();
});
res.send(req.body);
})

router.post('/v1/user/settings', function(req, res, next) {
//add user settings
var userid = req.body.uid;
var hashtag = req.body.hashtag;
var tw_speed = req.body.tw_speed;
var tw_sec = req.body.tw_sec;
var fc2_status = req.body.fc2_status;
var fc2_api = req.body.fc2_api;
var fc2_liveid = req.body.fc2_liveid;
var fc2_comment = req.body.fc2_comment;
var lv_toys = req.body.lv_toys;
MongoClient.connect(url, (err, client) => {
assert.equal(null, err)
console.log('Connected successfully to server');
const db = client.db('aegi');
const date1 = new Date();
var doc = {
userid:userid,
hashtag:hashtag,
tw_speed:tw_speed,
tw_sec:tw_sec,
fc2_status:fc2_status,
fc2_api:fc2_api,
fc2_liveid:fc2_liveid,
fc2_comment:fc2_comment,
lv_toys:lv_toys
}
db.collection('settings').updateOne({userid:userid},{$set:doc},{upsert:true});
client.close();
});
res.send(req.body);
})

router.post('/v1/user/tip', function(req, res, next) {
//add user tip settings
var userid = req.body.uid;
var min = req.body.min;
var max = req.body.max;
var sec = req.body.sec;
var speed = req.body.speed;
MongoClient.connect(url, (err, client) => {
assert.equal(null, err)
console.log('Connected successfully to server');
const db = client.db('aegi');
const date1 = new Date();
var doc = {
settings:
{
min:min,
max:max,
sec:sec,
speed:speed
}
};
db.collection('tip').updateOne({userid:userid},{$push:doc},{upsert:true});
client.close();
});
res.send(req.body);
})

router.get('/v1/user/tip/:uid/:tip', function(req, res, next) {
//get user tip settings
var userid = req.params.uid;
var tip = req.params.tip;
var _setting = [];
MongoClient.connect(url, (err, client) => {
assert.equal(null, err)
console.log('Connected successfully to server');
const db = client.db('aegi');
db.collection("tip").findOne({userid:userid}, function(err, doc){
doc.settings.forEach(function(setting){
var _min = Number(setting.min);
var _max = Number(setting.max);
var _tip = Number(tip);
if(_min <= _tip && _max >= _tip){
var res = {'code':'ok',data:setting};
_setting.push(res);
}
})
if(_setting.length >= 1){
res.json(_setting);
}else{
res.json([{'code':'error'}]);
}
});
client.close();
});
})

module.exports = router;
