const localVideo = document.getElementById('localVideo');
const videoContainer = document.getElementById('video-container');

let localStream;
const peerConnections = {}; // Definir peerConnections aquí
const serverConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const socket = io();

// Función para enviar mensajes del chat
function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value;
    const username = document.getElementById('name').value || 'Anonymous';
    if (message.trim() !== '') {
        socket.emit('chatMessage', message, username);
        chatInput.value = '';
    }
}

// Función para agregar mensajes al chat
function appendMessage(msg, username, timestamp) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${username}</strong> (${timestamp}): ${msg}`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll al final
}

const toggleCameraButton = document.getElementById('toggleCamera');
const toggleMicButton = document.getElementById('toggleMic');
let cameraEnabled = true;
let micEnabled = true;

async function start() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        socket.on('newUser', id => {
            createPeerConnection(id);
        });

        socket.on('offer', async ({ id, offer }) => {
            if (!peerConnections[id]) {
                createPeerConnection(id);
            }
            const pc = peerConnections[id];
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('answer', { id, answer: pc.localDescription });
            } catch (error) {
                console.error('Error handling offer:', error);
            }
        });

        socket.on('answer', async ({ id, answer }) => {
            const pc = peerConnections[id];
            if (pc) {
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                } catch (error) {
                    console.error('Error setting remote description for answer:', error);
                }
            }
        });

        socket.on('candidate', async ({ id, candidate }) => {
            const pc = peerConnections[id];
            if (pc) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error('Error adding ice candidate:', error);
                }
            }
        });

        socket.on('disconnectUser', id => {
            if (peerConnections[id]) {
                peerConnections[id].close();
                delete peerConnections[id];
                document.getElementById(`remoteVideo-${id}`)?.remove();
            }
        });

        function handleTrack(event, id) {
            let remoteVideo = document.getElementById(`remoteVideo-${id}`);
            if (!remoteVideo) {
                remoteVideo = document.createElement('video');
                remoteVideo.id = `remoteVideo-${id}`;
                remoteVideo.autoplay = true;
                remoteVideo.style.width = '45%';
                remoteVideo.style.border = '2px solid #ccc';
                videoContainer.appendChild(remoteVideo);
            }
            remoteVideo.srcObject = event.streams[0];
        }

        function createPeerConnection(id) {
            const pc = new RTCPeerConnection(serverConfig);
            peerConnections[id] = pc;

            pc.ontrack = event => handleTrack(event, id);
            pc.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit('candidate', { id, candidate: event.candidate });
                }
            };

            localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

            pc.createOffer()
                .then(offer => pc.setLocalDescription(offer))
                .then(() => socket.emit('offer', { id, offer: pc.localDescription }))
                .catch(error => console.error('Error creating offer:', error));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para manejar el estado de la cámara
function toggleCamera() {
    cameraEnabled = !cameraEnabled;
    localStream.getVideoTracks().forEach(track => track.enabled = cameraEnabled);
    toggleCameraButton.textContent = cameraEnabled ? 'Apagar cámara' : 'Encender cámara';
}

// Función para manejar el estado del micrófono
function toggleMic() {
    micEnabled = !micEnabled;
    localStream.getAudioTracks().forEach(track => track.enabled = micEnabled);
    toggleMicButton.textContent = micEnabled ? 'Silenciar' : 'Activar micrófono';
}

// Event listeners para los botones
toggleCameraButton.addEventListener('click', toggleCamera);
toggleMicButton.addEventListener('click', toggleMic);

// Manejar mensajes del chat
socket.on('chatMessage', ({ msg, username, timestamp }) => {
    appendMessage(msg, username, timestamp);
});

// Event listeners
document.getElementById('chat-send-button').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Iniciar la aplicación
start();
