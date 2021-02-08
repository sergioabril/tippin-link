const getInfo = require('./getinfo')
const signMessage = require('./signer-signmessage')
const verifyMessage = require('./signer-verifymessage')
const addInvoice = require('./invoice-add')

module.exports = {
    //Getinfo
    getInfo: async(nodeAddress, nodePort, macaroon) => getInfo({nodeAddress, nodePort, macaroon}),

    //Sign message
    signMessage: async(nodeAddress, nodePort, macaroon, message) => signMessage({nodeAddress, nodePort, macaroon, message}),

    //Verify message
    verifyMessage: async(nodeAddress, nodePort, macaroon, message, signature) => verifyMessage({nodeAddress, nodePort, macaroon, message, signature}),

    //Add invoice
    addInvoice: async(nodeAddress, nodePort, macaroon, memo, preImage) => addInvoice({nodeAddress, nodePort, macaroon, memo, preImage})
}