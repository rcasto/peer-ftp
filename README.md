# peer-ftp
A tool to share files between peers.

## Usage
Tool is very simple right now and doesn't have a ton of levers for configuration. The basic usage and flow is shown below.

### Flow
1. Sender initiates send of file with `peer-ftp`
2. Senders uses external channel to pass one time code to receiver
3. Receiver starts `peer-ftp` and enters one time code from sender
4. Receiver uses external channel to pass one time code to sender
5. Sender enters one time code from receiver into `peer-ftp`
6. Sender and receiver should now be connected and file should start transferring

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
  - Maybe pattern based matching on files to send
  - Allow specifying directory for output
- Allow passing in custom STUN/TURN servers
- ...