// @author: Ryednap(Ujjwal Pandey)
// @created-at: 05-22-2022

const Buffer = require('buffer');

/**
 *
 * @param {string} username - username of the user
 * @param {string} password - password of the user
 * @returns {string} - Basic Auth string to be used with Authorization header.
 */
module.exports = function encodeAuthentication(username, password) {
    const token = username + ":" + password;
    const hash = Buffer.btoa(token);
    console.log('Basic ' + hash);
    return 'Basic ' + hash;
}