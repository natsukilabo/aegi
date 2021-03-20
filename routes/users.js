var express = require('express');
var router = express.Router();
var request = require('request');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.mongodb;
const uuid = require("uuid");

/* GET users listing. */
router.get('/', function(req, res) {
console.log(req.session.passport);
var userid = req.session.passport.user.id;
var uid = uuid.v1();
var icon = req.session.passport.user.photos[0].value.replace("_normal","");
MongoClient.connect(url, (err, client) => {
assert.equal(null, err)
console.log('Connected successfully to server');
const db = client.db('aegi');
var doc2 = {
userid:userid
}
db.collection('tip').updateOne({userid:userid},{$set:doc2},{upsert:true});
var doc = {
uid:uid,
userid:userid,
profile_icon:icon,
username:req.session.passport.user.username,
name:req.session.passport.user.displayName
}
db.collection('users').updateOne({userid:userid},{$set:doc},{upsert:true});
res.render('users',
{
session: req.session.passport,
user_token: userid
});
client.close();
});
});

module.exports = router;
