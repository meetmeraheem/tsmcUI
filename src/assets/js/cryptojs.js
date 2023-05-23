const CryptoJS = require('crypto-js');

const secretPass = "tsmconline1234567890application";

const encryptData = (text) => {
    try {
        const data = CryptoJS.AES.encrypt(
            text,
            secretPass
        ).toString();
        return data;
    } catch (error) {
        console.log('encryptData Error', error);
    }
};

const decryptData = (text) => {
    try {
        const bytes = CryptoJS.AES.decrypt(text, secretPass);
        const data = bytes.toString(CryptoJS.enc.Utf8);
        return data;
    } catch (error) {
        console.log('decryptData Error', error);
    }
};

module.exports = {
    encryptData,
    decryptData
}
