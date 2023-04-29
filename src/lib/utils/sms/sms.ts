export const SMS = {

    generateOTP() {
        // Declare a digits variable 
        // which stores all digits
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }

        return OTP;
    },

    generateNumber() {
        // Declare a digits variable 
        // which stores all digits
        var digits = '0123456789';
        let number = '';
        for (let i = 0; i < 9; i++) {
            number += digits[Math.floor(Math.random() * 10)];
        }

        return number;
    },
};