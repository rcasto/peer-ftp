#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { receiver } from './receiver';
import { sender } from './sender';

// simple-peer internally supplies default ice servers:
// https://github.com/feross/simple-peer/blob/d972548299a50f836ca91c36e39304ef0f9474b7/index.js#L1038

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
        await sender(filePath);
    } else {
        await receiver(filePath);
    }
}

main();