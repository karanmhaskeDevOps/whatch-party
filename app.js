const videoFileInput = document.getElementById('videoFile');
const videoPlayer = document.getElementById('videoPlayer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messages = document.getElementById('messages');
const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');

let localStream;
const peers = {};

// WebSocket setup
const socket = io();

// Video file handling
videoFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        videoPlayer.src = url;
    }
});

// Video playback synchronization
videoPlayer.addEventListener('play', () => {
    socket.emit('play', { time: videoPlayer.currentTime });
});

videoPlayer.addEventListener('pause', () => {
    socket.emit('pause', { time: videoPlayer.currentTime });
});

videoPlayer.addEventListener('seeked', () => {
    socket.emit('seek', { time: videoPlayer.currentTime });
});

socket.on('play', (data) => {
    videoPlayer.currentTime = data.time;
    videoPlayer.play();
});

socket.on('pause', (data) => {
    videoPlayer.currentTime = data.time;
    videoPlayer.pause();
});

socket.on('seek', (data) => {
    videoPlayer.currentTime = data.time;
});

// Chat handling
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    socket.emit('chat', message);
    messageInput.value = '';
    appendMessage(`You: ${message}`);
});

socket.on('chat', (message) => {
    appendMessage(message);
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}

// Video calling setup using WebRTC
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;
        socket.emit('join-call');
    });

socket.on('user-connected', userId => {
    const peerConnection = createPeerConnection(userId);
    peers[userId] = peerConnection;

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });
});

socket.on('user-disconnected', userId => {
    if (peers[userId]) {
        peers[userId].close();
        delete peers[userId];
    }
});

socket.on('offer', (userId, offer) => {
    const peerConnection = createPeerConnection(userId);
    peers[userId] = peerConnection;

    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    peerConnection.createAnswer().then(answer => {
        peerConnection.setLocalDescription(answer);
        socket.emit('answer', userId, answer);
    });
});

socket.on('answer', (userId, answer) => {
    peers[userId].setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('ice-candidate', (userId, candidate) => {
    const peerConnection = peers[userId];
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

function createPeerConnection(userId) {
    const peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit('ice-candidate', userId, event.candidate);
        }
    };

    peerConnection.ontrack = event => {
        const remoteVideo = document.createElement('video');
        remoteVideo.classList.add('remoteVideo');
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        remoteVideos.appendChild(remoteVideo);
    };

    return peerConnection;
}
