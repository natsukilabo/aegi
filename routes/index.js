var express = require('express');
var router = express.Router();
require('dotenv').config()
var request = require('request');
var parser = require('ua-parser-js');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.mongodb;
const uuid = require("uuid");

//トップページ
router.get('/', function(req, res, next) {
res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+';');
var user_token = req.cookies.user_token;
res.render('index', {type:"pc",user_token:user_token});
});

//お気に入りのキャスト一覧用(作成中...)
router.get('/favorite',function(req,res,next){
res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+'livelist;');
var user_token = req.cookies.user_token;
var username = req.params.id;
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
db.collection("users").find({liveStatus:"true"}).toArray(function(err, doc) {
console.log(doc);
res.render('favorite',{
casts:doc,
user_token:user_token
});
});
});
})

//配信中のキャスト一覧用
router.get('/livelist',function(req,res,next){
res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+'livelist;');
var user_token = req.cookies.user_token;
var username = req.params.id;
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
db.collection("users").find({liveStatus:"true"}).toArray(function(err, doc) {
console.log(doc);
res.render('livelist',{
casts:doc,
user_token:user_token
});
});
});
})

//なんかのテスト用
router.get('/test',function(req,res,next){
res.render('test',{});
})

//配信視聴画面用(初期版)
router.get('/live/@:id', function(req, res, next) {
res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+'live/@'+req.params.id+';');
var user_token = req.cookies.user_token;
if(user_token == undefined){
user_token = '_aegi_guest';
}
var username = req.params.id;
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
db.collection("users").findOne({username:username}, function(err, doc){
db.collection("users").findOne({userid:user_token}, function(err, doc2){
res.render('live',{
castId:req.params.id,
cast:doc,
user:doc2,
user_token:user_token
});
});
});
});
});

//配信画面(ラジオ)
router.get('/broadcast/radio', function(req, res, next) {
res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+'broadcast/radio;');
var user_token = req.cookies.user_token;
if(user_token !== undefined){
var username = req.params.id;
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
db.collection("users").findOne({userid:user_token}, function(err, doc){
res.render('broadcast/radio',{
cast:doc,
user_token:user_token
});
});
});
}else{
res.redirect(process.env.app_url+'auth/twitter');
}
});

router.get('/broadcast', function(req, res, next) {
res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+'broadcast;');
var user_token = req.cookies.user_token;
res.render('broadcast', {user_token:user_token});
});

//配信画面(カメラ)
router.get('/broadcast/camera', function(req, res, next) {
    res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+'broadcast/camera;');
    var user_token = req.cookies.user_token;
    if(user_token !== undefined){
    var username = req.params.id;
    MongoClient.connect(url, (err, client) => {
    const db = client.db('aegi');
    assert.equal(null, err)
    db.collection("users").findOne({userid:user_token}, function(err, doc){
    res.render('broadcast/camera',{
    cast:doc,
    user_token:user_token
    });
    });
    });
    }else{
    res.redirect(process.env.app_url+'auth/twitter');
    }
    });

//配信が終わったときの画面 for 視聴者
router.get('/@:id/end', function(req, res, next) {
res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+';');
var user_token = req.cookies.user_token;
var username = req.params.id;
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
db.collection("users").findOne({username:username}, function(err, doc){
res.render('live_end',{
cast:doc,
user_token:user_token
});
});
});
});

//配信が終わったときの画面 for 配信者
router.get('/broadcast/end', function(req, res, next) {
res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+';');
var user_token = req.cookies.user_token;
var username = req.params.id;
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
db.collection("users").findOne({userid:user_token}, function(err, doc){
res.render('broadcast_end',{
cast:doc,
user_token:user_token
});
});
});
});

//PWAインストール方法説明ページ
router.get('/guide/install', function(req, res, next) {
res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+'guide/install;');
var user_token = req.cookies.user_token;
res.render('guide/install', {user_token:user_token});
});

//配信視聴画面
router.get('/@:id', function(req, res, next) {
res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+'@'+req.params.id+';');
var user_token = req.cookies.user_token;
if(user_token == undefined){
user_token = '_aegi_guest';
}
var username = req.params.id;
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
db.collection("users").findOne({username:username}, function(err, doc){
db.collection("users").findOne({userid:user_token}, function(err, doc2){
res.render('live',{
castId:req.params.id,
cast:doc,
user:doc2,
user_token:user_token
});
});
});
});
});

//配信設定ページ(作りかけ...)
router.get('/settings/broadcast',function(req,res,next){
res.setHeader('Set-Cookie', 'back_url='+process.env.app_url+'settings/broadcast;');
var user_token = req.cookies.user_token;
if(user_token !== undefined){
var username = req.params.id;
MongoClient.connect(url, (err, client) => {
const db = client.db('aegi');
assert.equal(null, err)
db.collection("users").findOne({userid:user_token}, function(err, doc){
res.render('settings/broadcast',{
user:doc,
user_token:user_token
});
});
});
}else{
res.redirect(process.env.app_url+'auth/twitter');
}
})

module.exports = router;
