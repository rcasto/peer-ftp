import wrtc from 'wrtc';
import Peer from 'simple-peer';
import prompt from 'prompt';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

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

// npx peer-cli -i <input-file-path>   ---> offerer
// npx peer-cli -o <output-file-path>  ---> answerer
async function main() {
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

    if (argv.input) {
        client();
    } else {
        host();
    }
}

main();