const rest = require('./rest/index')

module.exports = class Lightning {
    constructor() {
        //Instantiate rpc's
        this.nodeAddress = process.env.LND_ADDRESS || "127.0.0.1"
        this.nodePort = process.env.LND_PORT || "8080"
        this.macaroon = process.env.LND_MACAROON || ""
    }

    //GENERAL
    async getInfo()
    {
        return rest.getInfo(this.nodeAddress, this.nodePort, this.macaroon);
    }

    // MESSAGE VERIFICATION
    async signMessage(message)
    {
        return rest.signMessage(this.nodeAddress, this.nodePort, this.macaroon, message);
    }

    async verifyMessageSignature(message, signature)
    {
        return rest.verifyMessage(this.nodeAddress, this.nodePort, this.macaroon, message, signature);
    }

    async addInvoice(memo, amount, preImage)
    {
        return rest.addInvoice(this.nodeAddress, this.nodePort, this.macaroon, memo, amount, preImage);
    }
}