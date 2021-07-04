import wrtc from 'wrtc';
import Peer from 'simple-peer';
import prompt from 'prompt';

// simple-peer internally supplies default ice servers:
// https://github.com/feross/simple-peer/blob/d972548299a50f836ca91c36e39304ef0f9474b7/index.js#L1038

async function host() {
    const hostPeer = new Peer({
        initiator: true,
        trickle: false,
        objectMode: true,
        wrtc,
    });

    hostPeer.on('signal', async data => {
        console.log(`Send the below offer session description to your peer:\n${JSON.stringify(data)}`);

        const { answer } = await prompt.get([
            'answer',
        ]);

        hostPeer.signal(answer as string);
    });

    hostPeer.on('connect', () => {
        console.log('Connected to peer!');

        hostPeer.send('ping');
    });

    hostPeer.on('data', data => {
        console.log(data);
    });

    hostPeer.on('error', err => {
        console.error(`Error: ${err}`);
    });
}

async function client() {
    const clientPeer = new Peer({
        initiator: false,
        trickle: false,
        objectMode: true,
        wrtc,
    });

    clientPeer.on('signal', async data => {
        console.log(`Client Signal:\n${JSON.stringify(data)}`);
    });

    clientPeer.on('connect', () => {
        console.log('Connected to peer!');
    });

    clientPeer.on('data', data => {
        console.log(data);

        clientPeer.send('pong');
    });

    clientPeer.on('error', err => {
        console.error(`Error: ${err}`);
    });

    const { offer } = await prompt.get([
        'offer',
    ]);

    clientPeer.signal(offer as string);
}


// npx peer-cli host (maybe no need to include host/join)
// npx peer-cli --answer
// npx peer-cli host -av (audio + video, default data channel)
function main() {
    const args = process.argv.slice(2);

    const isAnswerer = args.some(arg => arg === '--answer');

    if (isAnswerer) {
        client();
    } else {
        host();
    }
}

main();