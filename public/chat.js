window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://mingle-mukeshkmar.rhcloud.com/');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    function Player(room, pid) {
        this.room = room;
        this.pid = pid;
    }
    var room = $('input').data('room');
var player = new Player(room, '', '');
 
socket.on('connect', function() {
    socket.emit('join', {room: room});
});
 
socket.on('assign', function(data) {
    player.color = data.color;
    player.pid = data.pid;
    if(player.pid == 1) {
        $('.p1-score p').addClass('current');
    }
    else {
        $('.p2-score p').addClass('current');
    }
});
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = function() {
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            socket.emit('send', { message: text, username: name.value });
        }
    };
 
}