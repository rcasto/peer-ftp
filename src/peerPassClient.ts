import fetch from 'node-fetch';

const baseUrl = 'https://peer-pass.com';
const submitApiUrl = `${baseUrl}/api/peer/submit`;
const retrieveApiUrl = `${baseUrl}/api/peer/retrieve`;

export function submitSDP(sdpData: RTCSessionDescriptionInit): Promise<string> {
    return fetch(submitApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sdpData),
    })
    .then(response => response.json())
    .then(result => result.code);
}

export function retrieveSDP(code: string): Promise<RTCSessionDescriptionInit> {
    return fetch(retrieveApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code,
        }),
    })
    .then(response => response.json());
}