var room;
var peers = { length: 0 };

while (!localStorage.user) {
  localStorage.user = prompt('What is your username?');
}

while (!room) {
  room = prompt('Which room do you want to join?');
}


var STUN = {
  urls: 'stun:stun.l.google.com:19302'
};

var TURN = {
  urls: 'turn:turn.bistri.com:80',
  credential: 'homeo',
  username: 'homeo'
};

var ICE = {
  iceServers: [STUN, TURN]
};

var askForCamera = function () {
  navigator.getUserMedia({
    video: true,
    audio: false, 
  }, function (stream) {
    var localSrc = window.URL.createObjectURL(stream);
    document.getElementById('localVideo').src = localSrc;
  }, function (error) {
    setTimeout(function () {
      askForCamera();
    }, 500);
  });
}; 

var sendOffer = function (targetUserId, yourUserId) {
  peers.length++;
  var id = targetUserId;
  navigator.getUserMedia({
    video: true,
    audio: true
  }, function (mediaStream) {
    peers[id] = new RTCPeerConnection(ICE);

    peers[id].addStream(mediaStream);

    peers[id].onaddstream = function (media) {
      var video = document.createElement('video');
      video.src = window.URL.createObjectURL(media.stream);
      document.getElementById('putVidsHere').appendChild(video);
    };

    peers[id].onicecandidate = function (event) {
      if (!!event.candidate) {
        socket.emit('ice-candidate', {
          recipient: targetUserId,
          candidate: event.candidate,
          returnAddress: yourUserId,
        });
      } else {
        socket.emit('ice-merge', {
          recipient: targetUserId,
          sdp: peers[id].localDescription,
          returnAddress: yourUserId,
        });
      }
    };

    peers[id].oniceconnectionstatechange = function(event) {
      if (peers[id].iceConnectionState === 'completed') {
        socket.emit('ice-merge', {
          recipient: targetUserId,
          sdp: peers[id].localDescription,
          returnAddress: yourUserId,
        });
      }
    };

    peers[id].createOffer(function (offerObj) {
      peers[id].setLocalDescription(offerObj);
      socket.emit('offer', {
        recipient: targetUserId,
        offer: offerObj,
        returnAddress: yourUserId,
      });
      console.log('Sent offer!');
    }, function (error) {
      console.log(error);
    });
  }, function (error) {
    console.log(error);
  });
};

var sendAnswer = function (receivedData) {
  peers.length++;
  var id = receivedData.returnAddress;
  navigator.getUserMedia({
    video: true,
    audio: true,
  }, function (mediaStream) {
    peers[id] = new RTCPeerConnection(ICE);

    peers[id].addStream(mediaStream);

    peers[id].onaddstream = function (media) {
      var video = document.createElement('video');
      video.src = window.URL.createObjectURL(media.stream);
      document.getElementById('putVidsHere').appendChild(video); 
    };

    peers[id].onicecandidate = function (event) {
      if (!!event.candidate) {
        socket.emit('ice-candidate', {
          recipient: receivedData.returnAddress,
          candidate: event.candidate,
          returnAddress: receivedData.recipient,
        });
      } else {
        socket.emit('ice-merge', {
          recipient: receivedData.returnAddress,
          sdp: peers[id].localDescription,
          returnAddress: receivedData.recipient,
        });
      }
    };

    peers[id].oniceconnectionstatechange = function(event) {
      if (peers[id].iceConnectionState === 'completed') {
        socket.emit('ice-merge', {
          recipient: receivedData.returnAddress,
          sdp: peers[id].localDescription,
          returnAddress: receivedData.recipient,
        });
      }
    };

    peers[id].setRemoteDescription(new RTCSessionDescription(receivedData.offer))
    .catch(function (error) {
      console.log(error);
    });

    peers[id].createAnswer(function (answerObj) {
      peers[id].setLocalDescription(answerObj);
      socket.emit('answer', {
        answer: answerObj,
        recipient: receivedData.returnAddress,
        returnAddress: receivedData.recipient
      });

      console.log('Sent answer!');
    }, function (error) {
      console.log(error);
    });
  }, function (error) {
    console.log(error);
  });
};

socket = io.connect();

socket.on('joined', function (data) {
  console.log(data.message);
  data.userIds.forEach(function (user, index) {
    sendOffer(user, data.yourId);
  });

}, function (error) {
  console.log(error);
});

socket.on('created', function (data) {
  console.log(data);
});

socket.on('offer', function (data) {
  console.log('Got offer!'); 
  sendAnswer(data);
});

socket.on('answer', function (data) {
  console.log('Got answer!\n');
  peers[data.returnAddress].setRemoteDescription(new RTCSessionDescription(data.answer))
  .catch(function (error) {
    console.log(error);
  });
});

socket.on('ice-candidate', function (data) {
  if (!!peers[data.returnAddress]) {
    peers[data.returnAddress].addIceCandidate(new RTCIceCandidate(data.candidate))
    .catch(function (error) {
      console.error(error);
    });
  }
});

socket.on('ice-merge', function (data) {
  console.log(peers);
  peers[data.returnAddress].setRemoteDescription(new RTCSessionDescription(data.sdp))
  .catch(function (error) {
    console.log(error);
  });
});

askForCamera();

socket.emit('check', room);