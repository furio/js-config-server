var debugLog = require('debug')('lib-repo-data-filters:filter-encrypted-full');

var CryptoJS = require("crypto-js");

var JsonEncryptedFullFilter = module.exports = function JsonEncryptedFullFilter(options) {
    this.encryptionAlgorithm = options.crypt || 'none';
    this.encryptionKey = options.key;
    this.decryptFunc = null;
};

JsonEncryptedFullFilter.prototype.filterData = function(rawData) {
    if (this.decryptFunc === null) {
        var decryptFunc = null;

        switch(this.encryptionAlgorithm) {
            case 'aes':
            {
                var aesIV = CryptoJS.PBKDF2(this.encryptionKey, this.encryptionAlgorithm);
                decryptFunc = function () {
                    return function (input) {
                        var decByte = CryptoJS.AES.decrypt(input.toString(), this.encryptionKey, {
                            iv: aesIV,
                            mode: CryptoJS.mode.OFB,
                            padding: CryptoJS.pad.NoPadding
                        });
                        return decByte.toString(CryptoJS.enc.Utf8);
                    };
                };
            } break;

            case 'rabbit':
                decryptFunc = function() { return function (input) {
                    var decByte = CryptoJS.Rabbit.decrypt(input.toString(), this.encryptionKey);
                    return decByte.toString(CryptoJS.enc.Utf8);
                }; };
                break;

            default:
                decryptFunc = function() {
                    return function(input) {
                        return input;
                    };
                };
                break;
        }

        this.decryptFunc = decryptFunc();
    }

    var newData = null;
    try {
        newData = this.decryptFunc(rawData);
    } catch( err ) {
        debugLog(err);
        throw err;
    }

    return newData;
};
