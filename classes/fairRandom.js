const crypto = require('crypto');

class FairRandom {
    static generateRandomNumber(range) {
        const key = crypto.randomBytes(32).toString('hex');
        const number = crypto.randomInt(range);
        const hmac = crypto.createHmac('sha3-256', key).update(number.toString()).digest('hex');
        return { key, number, hmac };
    }

    static verifyHMAC(key, number, hmac) {
        const calculatedHMAC = crypto.createHmac('sha3-256', key).update(number.toString()).digest('hex');
        return calculatedHMAC === hmac;
    }
}

module.exports = FairRandom;