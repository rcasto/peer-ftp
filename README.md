# peer-ftp
A tool to share files between peers, simply, and quickly.

## Usage
Sender needs to choose what file to send.  
Receiver needs to choose where to store the file being received.

### Flow
1. Sender initiates send of file with `peer-ftp` passing in input file path.
2. Senders uses external channel to pass generated one time code to receiver.
3. Receiver starts `peer-ftp` passing in output file path.
4. Receiver enters one time code given by sender.
5. Receiver uses external channel to pass one time code to sender.
6. Sender enters one time code given by receiver.
7. Sender and receiver should now be connected and file should start transferring.

**Note:** External channel refers to any means of communication between sender and receiver. Could be email, SMS, carrier pigeon, telepathy, Slack, phone call, ...
### Sender
```
npx peer-ftp -i <input-file-path>
```

### Receiver
```
npx peer-ftp -o <output-file-path>
```

## Potential Improvements/Continual Work
- Send/Receive more than 1 file
- Allow passing in custom STUN/TURN servers
- Browser based compatible lib/client