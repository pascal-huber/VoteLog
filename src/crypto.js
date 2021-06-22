
// https://github.com/xbrowsersync/app/blob/master/src/modules/shared/crypto/crypto.service.ts
// https://blog.engelke.com/2015/02/14/deriving-keys-from-passwords-with-webcrypto/
// https://crypto.stackexchange.com/questions/5630/deriving-keys-for-symmetric-encryption-and-authentication
// https://gist.github.com/don/871170d88cf6b9007f7663fdbc23fe09

export function encryptData(key, data){
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    return window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv
        },
        key,
        stringToArrayBuffer(JSON.stringify(data)),
    ).then((encryptedData) => {
        return {
            encryptedData: arrayBufferToHexString(encryptedData),
            iv: arrayBufferToHexString(iv),
        }
    });
}

export function decryptData(key, ivString, encryptedDataString){
    const data = hexStringToArrayBuffer(encryptedDataString)
    const iv = hexStringToArrayBuffer(ivString)
    return crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv
        },
        key,
        data
    ).then((decrypted) => {
        return JSON.parse(arrayBufferToString(decrypted));
    });
}

export function generateKey(password){

    var salt = "aOfj8wio!!WXXq;lio3jnfd@WfRDq29aA38dfPfpq9";
    var extractable = true

    return window.crypto.subtle.importKey(
        "raw",
        stringToArrayBuffer(password),
        {"name": "PBKDF2"},
        false,
        ["deriveKey"]
    ).then((baseKey) => {
        return window.crypto.subtle.deriveKey(
            {
                "name": "PBKDF2",
                "salt": stringToArrayBuffer(salt),
                "iterations": 1000, // TODO: is a 1000 iterations enough?
                "hash": "SHA-256"
            },
            baseKey,
            {
                "name": "AES-GCM",
                "length": 256
            },
            extractable,
            ["encrypt", "decrypt"]
        );
    });
}

function stringToArrayBuffer(string) {
    var encoder = new TextEncoder("utf-8");
    return encoder.encode(string);
}

function arrayBufferToString(arrayBuffer) {
    var decoder = new TextDecoder("utf-8");
    return decoder.decode(arrayBuffer);
}

function arrayBufferToHexString(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    var hexString = "";
    var nextHexByte;

    for (var i=0; i<byteArray.byteLength; i++) {
        nextHexByte = byteArray[i].toString(16);  // Integer to base 16
        if (nextHexByte.length < 2) {
            nextHexByte = "0" + nextHexByte;     // Otherwise 10 becomes just a instead of 0a
        }
        hexString += nextHexByte;
    }
    return hexString;
}

function hexStringToArrayBuffer(hexString) {
    var pairs = hexString.match(/[\dA-F]{2}/gi);
    var integers = pairs.map(function(s) {
        return parseInt(s, 16);
    });
    var array = new Uint8Array(integers);
    return array.buffer;
}
