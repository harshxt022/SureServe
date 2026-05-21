const crypto = require('crypto');

exports.generateOtp = () => {
    // Generate a secure 4 digit OTP
    return String(crypto.randomInt(1000, 10000));
};
