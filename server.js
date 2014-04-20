#!/bin/env node
// OpenShift sample Node application
var express = require("express");
var app = express();
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
 
app.use('/static', express.static(__dirname + '/static'));
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
	share = generateRoom(6);
    res.render('page.jade', {shareURL: req.protocol + '://' + req.get('host') + req.path + share, share: share});
});

app.get('/:room([A-Za-z0-9]{6})', function(req, res) {
    share = req.params.room;
    res.render('page.jade', {shareURL: req.protocol + '://' + req.get('host') + '/' + share, share: share});
});
app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port,ipaddr));
io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to Mingle' });
    socket.emit('connect', {});
    socket.on('send', function (data) {
        io.sockets.in(data.room).emit('message', data);

    });
    socket.on('join', function(data) {
        socket.join(data.room);
        console.log("Connected to room :"+data.room);
    });
});
console.log("Listening on port " + port);

function generateRoom(length) {
    var haystack = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var room = '';
 
    for(var i = 0; i < length; i++) {
        room += haystack.charAt(Math.floor(Math.random() * 62));
    }
 
    return room;
};