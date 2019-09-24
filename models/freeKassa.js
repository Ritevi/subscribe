const md5 = require('md5');

module.exports = class FreeKassa {
    constructor({
                    firstSecret, secondSecret, merchantId, ip,
                }) {
        if (!firstSecret) {
            throw new Error('firstSecret is required param')
        } else if (!secondSecret) {
            throw new Error('secondSecret is required param')
        } else if (!merchantId) {
            throw new Error('merchantId is required param')
        } else if(!ip) {
            throw new Error('ip is required param')
        }

        this.ip = ip;
        this.firstSecret = firstSecret;
        this.secondSecret = secondSecret;
        this.merchantId = merchantId;
    }

    getForm(orderAmount, orderId) {
        return 'http://www.free-kassa.ru/merchant/cash.php'
            + `?m=${this.merchantId}`
            + `&oa=${orderAmount}`
            + `&o=${orderId}`
            + `&s=${this.getFormSign(orderAmount, orderId)}`
    }

    getFormSign(orderAmount, orderId) {
        return md5([
            this.merchantId,
            orderAmount,
            this.firstSecret,
            orderId,
        ].join(':'))
    }

    getPaymentSign(orderAmount, orderId) {
        return md5([
            this.merchantId,
            orderAmount,
            this.secondSecret,
            orderId,
        ].join(':'))
    }

    getClientIP(req){
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    }

    validIp(clientIp){
        return this.ip.filter((elem)=>{
            return elem == clientIp;
        })
    }
};