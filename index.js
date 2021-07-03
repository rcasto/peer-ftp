const { RTCPeerConnection } = require('wrtc');

const peerConfig = {
    iceServers: [
        // Google STUN Servers
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
            ],
        }
    ],
};

// keep track of some negotiation state to prevent races and errors
let makingOffer = false;
let ignoreOffer = false;
let isSettingRemoteAnswerPending = false;

async function host() {
    const peer = new RTCPeerConnection(peerConfig);

    peer.addEventListener('icecandidate', ({ candidate }) => {
        console.log(candidate);
        if (!candidate) {
            console.log('Done with dem ice candidates!!');
        }
    });
    pc.onicecandidate = ({ candidate }) => signaling.send({ candidate });
    peer.addEventListener('negotiationneeded', async () => {
        console.log('negotation needed');

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        // try {
        //     makingOffer = true;
        //     await pc.setLocalDescription();
        //     signaling.send({ description: pc.localDescription });
        // } catch (err) {
        //     console.error(err);
        // } finally {
        //     makingOffer = false;
        // }
    });

    const channel = peer.createDataChannel('test');

    channel.onopen = () => console.log('data channel open');
    channel.onmessage = ({ data }) => console.log('message', data);
}

function client() {

}

function main() {
    // signaling.onmessage = async ({ data: { description, candidate } }) => {
    //     try {
    //         if (description) {
    //             // An offer may come in while we are busy processing SRD(answer).
    //             // In this case, we will be in "stable" by the time the offer is processed
    //             // so it is safe to chain it on our Operations Chain now.
    //             const readyForOffer =
    //                 !makingOffer &&
    //                 (pc.signalingState == "stable" || isSettingRemoteAnswerPending);
    //             const offerCollision = description.type == "offer" && !readyForOffer;

    //             ignoreOffer = !polite && offerCollision;
    //             if (ignoreOffer) {
    //                 return;
    //             }
    //             isSettingRemoteAnswerPending = description.type == "answer";
    //             await pc.setRemoteDescription(description); // SRD rolls back as needed
    //             isSettingRemoteAnswerPending = false;
    //             if (description.type == "offer") {
    //                 await pc.setLocalDescription();
    //                 signaling.send({ description: pc.localDescription });
    //             }
    //         } else if (candidate) {
    //             try {
    //                 await pc.addIceCandidate(candidate);
    //             } catch (err) {
    //                 if (!ignoreOffer) throw err; // Suppress ignored offer's candidates
    //             }
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }
}

main();