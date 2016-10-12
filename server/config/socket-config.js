var socketIO = require('socket.io')();
var Tree = require('./connectionTree.js');
var fs = require('fs');
var path = require('path');
var jwt = require('./authentication.js');
var db = require('../db/rawSQLHandlers.js');

var serverConfig = {
  key: fs.readFileSync(path.join(__dirname, './credentials/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './credentials/cert.pem')),
  // ca: fs.readFileSync(path.join(__dirname, './credentials/chain.pem'))
};

var server = require('https').createServer(serverConfig, require('./app-config.js'));

var io = socketIO.listen(server);

var rooms = {};

var currentRoom = {};


io.sockets.on('connection', function(socket) {


  /////// LiveNow Component Code /////////////////////////////////////

  socket.on('getStreams', function () {
    var results = [];
    var realRoom = true;
    for (var roomName in socket.adapter.rooms) {
      var room = socket.adapter.rooms[roomName];
      for (var socketId in room.sockets) {
        if (socketId === roomName) {
          realRoom = false;
          break;
        }
        break;
      }

      if (realRoom) {
        results.push({ 
          title: roomName,
          size: socket.adapter.rooms[roomName].length,
        });
      }
      realRoom = true;
    }

    socket.emit('allStreams', results);
  });


  /////// WebRTC Code ////////////////////////////////////////////////
  socket.on('ready', function () {
    socket.emit('start', Date.now());
  });

  socket.on('stop', function (data) {
    if (socket.adapter.rooms[data.roomName]) {
      var yourId = socket.id;

      socket.join(data.roomName);
      console.log(data.roomName);

      rooms[data.roomName]._remove(socket.id);
      rooms[data.roomName].add(yourId, Date.now() - data.time, function (targetId, selfId) {

        socket.emit('RTC-target', {
          userIds: [targetId],
          yourId: selfId,
        });

        if (!currentRoom[socket.id]) {
          socket.broadcast.to(data.roomName).emit('chatMessage', {
            user: '',
            text: data.user + ' has joined the room.',
          });
        }
      });

      currentRoom[socket.id] = data.roomName;
    } else {  

      jwt.decode(data.token, function (error, userData) {

        if (error) {

          console.log(error);
          socket.emit('failure', 'That ain\'t a real token!');

        } else {

          db.getUser(userData, {
            send: function (row) {
              for (var i = 0; i < row.ownedStreams.length; i++) { 
                if ((row.username + '/' + row.ownedStreams[i].title).toLowerCase() === data.roomName.toLowerCase()) {
                  socket.join(data.roomName);
                  console.log(data.roomName);

                  rooms[data.roomName] = new Tree(socket.id, 0);
                  
                  socket.emit('created', 'You have created the room: "' + data.roomName + '"');
                  return;
                }
              }

              socket.emit('failure', 'This ain\'t yo stream');
            },
            sendStatus: function () {
              socket.emit('failure', 'That ain\'t a real token!');
            }
          });
        }
      });
    }
  });

  socket.on('offer', function (data) {
    socket.to(data.recipient).emit('offer', data);
  });

  socket.on('answer', function (data) {
    socket.to(data.recipient).emit('answer', data);
  });

  socket.on('ice-candidate', function (data) {
    socket.to(data.recipient).emit('ice-candidate', data);
  });

  socket.on('ice-merge', function (data) {
    socket.to(data.recipient).emit('ice-merge', data);
  });


  socket.on('chatMessage', function (data) {
    socket.broadcast.to(data.room).emit('chatMessage', data);
  });

  socket.on('disconnect', function () {
    if (rooms[currentRoom[socket.id]]) {

      rooms[currentRoom[socket.id]].remove(socket.id, function (targetId, selfId) {
        socket.to(selfId).emit('RTC-target', {
          userIds: [targetId],
          yourId: selfId,
          deleteTarget: socket.id,
        });
      });
    }
  });

  //Whiteboard Events:
  //Join the specified room:
  // socket.on('room', (roomName) => {
  //   room = roomName;
  //   socket.join(roomName);
  // });

  //Broadcast data from the client to other clients in the same room:
  socket.on('dataFromClient', (data) => {
    console.log('Message recieved');
    console.log(data.room);
    socket.broadcast.to(data.room).emit('dataFromServer', data.canvas);
  });

});




module.exports = server;





