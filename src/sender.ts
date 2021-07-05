import wrtc from 'wrtc';
import Peer from 'simple-peer';
import { access, createReadStream, stat } from 'fs';
import prompt from 'prompt';
import { promisify } from 'util';
import { retrieveSDP, submitSDP } from './peerPassClient';

const accessPromise = promisify(access);
const statPromise = promisify(stat);

export async function sender(inputFilePath: string): Promise<void> {
    // Check if input file path exists
    await accessPromise(inputFilePath);

    const senderPeer = new Peer({
        initiator: true,
        trickle: false,
        objectMode: true,
        wrtc,
    });

    senderPeer.on('signal', async data => {
        const code = await submitSDP(data as RTCSessionDescriptionInit);
        console.log(`Send the below offer code to your peer:\n${code}\n`);

        const { answerCode } = await prompt.get([
            'answerCode',
        ]);
        const sdpData = await retrieveSDP(answerCode as string);

        senderPeer.signal(sdpData);
    });
    senderPeer.on('connect', async () => {
        console.log('\nConnected to peer!');

        // Let's find the size of the file
        const { size: fileSizeInBytes } = await statPromise(inputFilePath);
        let numBytesSent = 0;

        console.log(`Size of file being transferred is ${fileSizeInBytes} bytes`);
        senderPeer.write(JSON.stringify({
            type: 'size',
            data: fileSizeInBytes,
        }));

        const inputFileReadableStream = createReadStream(inputFilePath, {
            encoding: 'binary',
        });

        inputFileReadableStream.on('data', chunk => {
            senderPeer.write(JSON.stringify({
                type: 'data',
                data: chunk,
            }));

            numBytesSent += chunk.length;
            console.log(`Sent ${(numBytesSent / fileSizeInBytes * 100).toFixed(2)}%`);
        });
        inputFileReadableStream.on('end', () => {
            console.log('Done transmitting file to peer.');

            // Let peer know the end has been reached
            senderPeer.write(JSON.stringify({
                type: 'end',
            }));
        });
        inputFileReadableStream.on('error', err => {
            console.error(`Error occurred during file transfer: ${err}`);
        });
    });
    senderPeer.on('error', err => {
        console.error(`Error: ${err}`);
    });
}