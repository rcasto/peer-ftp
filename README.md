# PeerPass CLI

A node based CLI tool to establish a peer to peer connection.

- text based chat
- file sharing
- video/audio chat?

## Steps to establish a connection

Host: `npx peerpass text`

Joiner: `npx peerpass text -i` - input offer via standard input

Offer and Answer session descriptions are logged in the console (standard output) as well as a QR code

### Sharing session description

You pick how you want to share the session description, but here are some ideas:

- email
- sms
- Qr code scanning

## Questions

- When creating the offer/answer does the channel of description need to be included in its creation?
  - Video/audio?