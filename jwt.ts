const base64Url = require('base64url');

const header: { alg: string; typ: string } = {
    alg: 'HS256',
    typ: 'JWT'
};

const payload = {
    username: 'user1@user.com',
    name: 'Luiz Carlos',
    exp: new Date().getTime(),
};

const headerEncoded = base64Url(JSON.stringify(header))
const payloadEncoded = base64Url(JSON.stringify(payload))

const key: "abcd123456" = 'abcd123456';

const crypt = require('crypto');

const signature = crypt.createHmac('sha256', key)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("bin")


console.log(`${headerEncoded}.${payloadEncoded}.${base64Url.encode(signature)}`);