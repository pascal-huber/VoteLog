export async function storeKeys(key, userId){
    try {
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("salt", arrayBufferToHexString(key.salt));
        var encryptionKeyExportPromise = crypto.subtle.exportKey('raw', key.encryptionKey);
        encryptionKeyExportPromise.then(function(raw){
            sessionStorage.setItem("encryptionKey", arrayBufferToHexString(raw));
        });
        var signingKeyExportPromise = crypto.subtle.exportKey('raw', key.signingKey);
        signingKeyExportPromise.then(function(raw){
            sessionStorage.setItem("signingKey", arrayBufferToHexString(raw));
        });
    } catch(error) {
        console.log("storeKeys error:");
        console.log(error);
    }
}

export async function loadKeys(){
    try {
        let userId = sessionStorage.getItem("userId");
        let salt = sessionStorage.getItem("salt");
        let encryptionKeyHex = sessionStorage.getItem("encryptionKey");
        var encryptionKey = await crypto.subtle.importKey(
            'raw',
            hexStringToArrayBuffer(encryptionKeyHex),
            { "name": "AES-GCM" },
            true,
            ["encrypt", "decrypt"]
        );
        let signingKeyHex = sessionStorage.getItem("signingKey");
        var signingKey = await crypto.subtle.importKey(
            'raw',
            hexStringToArrayBuffer(signingKeyHex),
            {
                "name": "HMAC",
                "hash": "SHA-256",
            },
            true,
            ["sign", "verify"]
        );
        return {
            userId: userId,
            salt: salt,
            encryptionKey: encryptionKey,
            signingKey: signingKey,
        }
    } catch(e) {
        return undefined;
    }
}

export async function generateSalt() {
    var array = new Uint8Array(16);
    return window.crypto.getRandomValues(array);
}

export async function generatePassword(){
    var array = new Uint8Array(48);
    const random = await window.crypto.getRandomValues(array);
    return arrayBufferToHexString(random);
}

export async function signData(signingKey, data, lastSignature){
    if(lastSignature){
        data = data + lastSignature;
    }
    try {
        const signature = await window.crypto.subtle.sign(
            "HMAC",
            signingKey,
            hexStringToArrayBuffer(data)
        );
        return signature;
    } catch(error) {
        console.log("error", error);
        throw Error();
    }
}

export async function encryptData(key, data){
    const iv = await window.crypto.getRandomValues(new Uint8Array(16));
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv
        },
        key,
        stringToArrayBuffer(JSON.stringify(data)),
    );
    return {
        encryptedData: arrayBufferToHexString(encryptedData),
        iv: arrayBufferToHexString(iv),
    }
}

export async function decryptData(key, ivString, encryptedDataString){
    const data = hexStringToArrayBuffer(encryptedDataString)
    const iv = hexStringToArrayBuffer(ivString)
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv
        },
        key,
        data
    );
    return JSON.parse(arrayBufferToString(decrypted));
}

// https://gist.github.com/chrisveness/770ee96945ec12ac84f134bf538d89fb
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveBits

export async function importBaseKey(password){
    const passwordBuffer = new TextEncoder("utf-8").encode(password);
    const baseKey = await window.crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        {"name": "PBKDF2"},
        true,
        ["deriveBits"]
    );
    return baseKey;
}
export async function deriveKeys(baseKey, salt){
    if(salt == undefined){
        salt = await generateSalt();
    }
    console.log("deriveKeys");
    console.log("salt: " + salt);
    console.log("baseKey: " + baseKey);
    const keyBits = await window.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            hash: 'SHA-256',
            salt: salt,
            iterations: 103842,
        },
        baseKey,
        384
    );
    const keyArrayEncrypt = await keyBits.slice(0, 32);
    const keyArraySign = await keyBits.slice(32, 48);
    const encryptionKey = await window.crypto.subtle.importKey(
        "raw",
        keyArrayEncrypt,
        { "name": "AES-GCM" },
        true,
        ["encrypt", "decrypt"]
    );
    const signingKey = await window.crypto.subtle.importKey(
        "raw",
        keyArraySign,
        {
            "name": "HMAC",
            "hash": "SHA-256",
        },
        true,
        ["sign", "verify"]
    );
    return {
        salt: salt,
        encryptionKey: encryptionKey,
        signingKey: signingKey,
    }
}

export async function exportKeyToJWK(key){
    return window.crypto.subtle.exportKey("jwk", key);
}

function stringToArrayBuffer(string) {
    var encoder = new TextEncoder("utf-8");
    return encoder.encode(string);
}

function arrayBufferToString(arrayBuffer) {
    var decoder = new TextDecoder("utf-8");
    return decoder.decode(arrayBuffer);
}

export function arrayBufferToHexString(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    var hexString = "";
    var nextHexByte;

    for (var i=0; i<byteArray.byteLength; i++) {
        nextHexByte = byteArray[i].toString(16);  // Integer to base 16
        if (nextHexByte.length < 2) {
            nextHexByte = "0" + nextHexByte;
        }
        hexString += nextHexByte;
    }
    return hexString;
}

export function hexStringToArrayBuffer(hexString) {
    var pairs = hexString.match(/[\dA-F]{2}/gi);
    var integers = pairs.map(function(s) {
        return parseInt(s, 16);
    });
    var array = new Uint8Array(integers);
    return array.buffer;
}
