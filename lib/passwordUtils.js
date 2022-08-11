const crypto = require('crypto');

// TODO

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex'); // Provides a synchronous Password-Based Key Derivation Function 2 (PBKDF2) implementation. A selected HMAC digest algorithm specified by digest is applied to derive a key of the requested byte length (keylen) from thepassword, salt and iterations.

    return {
        salt: salt,
        hash: genHash
    }
}

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return hash === hashVerify // check the values with the database values if same then return true else false
}


module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;