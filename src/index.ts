import wrtc from 'wrtc';
import Peer from 'simple-peer';
import prompt from 'prompt';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { access, createReadStream, createWriteStream } from 'fs';
import { promisify } from 'util';

const accessPromise = promisify(access);

// simple-peer internally supplies default ice servers:
// https://github.com/feross/simple-peer/blob/d972548299a50f836ca91c36e39304ef0f9474b7/index.js#L1038

async function host(inputFilePath: string): Promise<void> {
    // Check if input file path exists
    await accessPromise(inputFilePath);

    const hostPeer = new Peer({
        initiator: true,
        trickle: false,
        objectMode: true,
        wrtc,
    });

    hostPeer.on('signal', async data => {
        console.log(`Send the below offer session description to your peer:\n\n${JSON.stringify(data)}\n`);

        const { answer } = await prompt.get([
            'answer',
        ]);

        hostPeer.signal(answer as string);
    });
    hostPeer.on('connect', () => {
        console.log('Connected to peer!');

        const inputFileReadableStream = createReadStream(inputFilePath, {
            encoding: 'utf8',
        });

        inputFileReadableStream.on('data', chunk => {
            hostPeer.send(JSON.stringify({
                type: 'data',
                data: chunk,
            }));
        });

        inputFileReadableStream.on('end', () => {
            console.log('Done transmitting file to peer.');

            // Let peer know the end has been reached
            hostPeer.send(JSON.stringify({
                type: 'end',
            }));
        });

        inputFileReadableStream.on('error', err => {
            console.error(`Error occurred during file transfer: ${err}`);
        });
    });
    hostPeer.on('error', err => {
        console.error(`Error: ${err}`);
    });
}

async function client(outputFilePath: string): Promise<void> {
    const clientPeer = new Peer({
        initiator: false,
        trickle: false,
        objectMode: true,
        wrtc,
    });
    const outputFileWritableStream = createWriteStream(outputFilePath, {
        encoding: 'utf8',
    });

    outputFileWritableStream.on('finish', () => {
        console.log("Write completed.");
    });
    outputFileWritableStream.on('error', err => {
        console.error(`Error occurred during file transfer: ${err}`);
    });

    clientPeer.on('signal', data => {
        console.log(`\nSend the below answer session description back to your peer:\n\n${JSON.stringify(data)}\n`);
    });
    clientPeer.on('connect', () => {
        console.log('Connected to peer!');
    });
    clientPeer.on('data', message => {
        const { type, data } = JSON.parse(message);

        switch(type) {
            case 'data':
                outputFileWritableStream.write(data);
                break;
            case 'end':
                outputFileWritableStream.end();
                break;
            default:
                console.log(`Unknown message type ${type} received: ${message}`);
        }
    });
    clientPeer.on('error', err => {
        console.error(`Error: ${err}`);
    });

    const { offer } = await prompt.get([
        'offer',
    ]);

    clientPeer.signal(offer as string);
}

// npx peer-cli -i <input-file-path>   ---> offerer
// npx peer-cli -o <output-file-path>  ---> answerer
async function main(): Promise<void> {
    const argv = await yargs(hideBin(process.argv))
        .option('input', {
            alias: 'i',
            description: 'File path to input file being shared with peer.',
            type: 'string',
        })
        .option('output', {
            alias: 'o',
            description: 'File path of where to save file being shared by peer.',
            type: 'string',
        })
        .help()
        .alias('help', 'h')
        .conflicts('input', 'output')
        .check(argv => {
            if (!argv.input && !argv.output) {
                throw new Error('Neither input or output option was set, one of them must be set.');
            }
            return true;
        })
        .argv;

    const filePath = argv.input || argv.output || '';
    const isInputFile = !!argv.input;

    if (isInputFile) {
        await host(filePath);
    } else {
        await client(filePath);
    }
}

main();