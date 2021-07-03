// Taken and modified from: https://github.com/node-webrtc/node-webrtc/issues/605#issuecomment-759172283
declare module 'wrtc' {
    declare const wrtc: {
        // Only properties needed by simple-peer
        RTCPeerConnection: typeof RTCPeerConnection
        RTCSessionDescription: typeof RTCSessionDescription
        RTCIceCandidate: typeof RTCIceCandidate

        // MediaStream: MediaStream
        // MediaStreamTrack: MediaStreamTrack
        // RTCDataChannel: RTCDataChannel
        // RTCDataChannelEvent: RTCDataChannelEvent
        // RTCDtlsTransport: RTCDtlsTransport
        // RTCIceTransport: RTCIceTransport
        // RTCPeerConnectionIceEvent: RTCPeerConnectionIceEvent
        // RTCRtpReceiver: RTCRtpReceiver
        // RTCRtpSender: RTCRtpSender
        // RTCRtpTransceiver: RTCRtpTransceiver
        // RTCSctpTransport: RTCSctpTransport
        // getUserMedia: typeof navigator.mediaDevices['getUserMedia']
        // mediaDevices: typeof navigator.mediaDevices
    }
    export type WRTC = typeof wrtc
    export default wrtc
}
