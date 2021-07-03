import wrtc from 'wrtc';
import Peer from 'simple-peer';

// simple-peer internally supplies default ice servers:
// https://github.com/feross/simple-peer/blob/d972548299a50f836ca91c36e39304ef0f9474b7/index.js#L1038
//
// const peerConfig = {
//     iceServers: [
//         // Google STUN Servers
//         {
//             urls: [
//                 'stun:stun.l.google.com:19302',
//                 'stun:stun1.l.google.com:19302',
//                 'stun:stun2.l.google.com:19302',
//             ],
//         }
//     ],
// };

async function host() {
    const hostPeer = new Peer({
        initiator: true,
        trickle: false,
        wrtc,
    });

    hostPeer.on('signal', data => {
        console.log(`Host Signal: ${JSON.stringify(data)}`);
    });
}

function client() {
    const clientPeer = new Peer({
        initiator: false,
        trickle: false,
        wrtc,
    });

    clientPeer.on('signal', data => {
        console.log(`Client Signal: ${JSON.stringify(data)}`);
    });
}


// npx peer-cli host (maybe no need to include host/join)
// npx peer-cli join <offer>
// npx peer-cli host -av (audio + video, default data channel)
function main() {
    // Will want to add support for flags later
    const [
        offer,
    ] = process.argv.slice(2);

    if (offer) {
        client()
    } else {
        host();
    }
}

main();