import wrtc from 'wrtc';
import Peer from 'simple-peer';
import { createWriteStream } from 'fs';
import prompt from 'prompt';
import { retrieveSDP, submitSDP } from './peerPassClient';
import { createHash } from 'crypto';

export async function receiver(outputFilePath: string): Promise<void> {
    const receiverPeer = new Peer({
        initiator: false,
        trickle: false,
        objectMode: true,
        wrtc,
    });
    const outputFileWritableStream = createWriteStream(outputFilePath, {
        encoding: 'binary',
    });
    const hash = createHash('sha256');
    let fileSizeInBytes = 0;
    let numBytesReceived = 0;

    outputFileWritableStream.on('finish', () => {
        console.log('Done receiving file from peer.');
    });
    outputFileWritableStream.on('error', err => {
        console.error(`Error occurred during file transfer: ${err}`);
    });

    receiverPeer.on('signal', async data => {
        const code = await submitSDP(data as RTCSessionDescriptionInit);
        console.log(`\nSend the below answer code back to your peer:\n${code}\n`);
    });
    receiverPeer.on('connect', () => {
        console.log('Connected to peer!');
    });
    receiverPeer.on('data', message => {
        const { type, data } = JSON.parse(message);

        switch(type) {
            case 'size':
                fileSizeInBytes = data;
                console.log(`Size of file being received is ${fileSizeInBytes} bytes`);
                break;
            case 'data':
                numBytesReceived += data.length;
                hash.update(data);
                outputFileWritableStream.write(data);
                console.log(`Received ${(numBytesReceived / fileSizeInBytes * 100).toFixed(2)}%`);
                break;
            case 'end':
                const hashResult = hash.digest('hex');
                const isFileIntegrityRetained = hashResult === data;

                receiverPeer.write(JSON.stringify({
                    type: 'result',
                    data: isFileIntegrityRetained,
                }));
                outputFileWritableStream.end();

                if (isFileIntegrityRetained) {
                    console.log(`File verification has passed. Letting the sender know all is well.`);
                    process.exit(0);
                } else {
                    console.error(`File verification has failed. Letting the sender know now, please try again.`);
                    process.exit(1);
                }
                break;
            default:
                console.log(`Unknown message type ${type} received: ${message}`);
        }
    });
    receiverPeer.on('error', err => {
        console.error(`Error: ${err}`);
    });``

    const { offerCode } = await prompt.get([
        'offerCode',
    ]);
    const sdpData = await retrieveSDP(offerCode as string);

    receiverPeer.signal(sdpData);
}