const peerConfig = {
    iceServers: [
        // Google STUN Servers
        {
            urls: [
                'stun.l.google.com:19302',
                'stun1.l.google.com:19302',
                'stun2.l.google.com:19302',
            ],
        }
    ],
};

const peer1 = new RTCPeerConnection(peerConfig);
const peer2 = new RTCPeerConnection(peerConfig);