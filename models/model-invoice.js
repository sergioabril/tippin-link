/**
 * When we need to send Tippin an invoice so they pay us,
 * we sent them the invoice like this, so they can pay us
 */

module.exports = () =>{
    return {
        invoice: '', //an invoice created with the preimage that can be deterministically derivated from salt
        seed: '', //the hash used to create a preimage, later hashed and provided above
        signature: '', //a signature of the message: hash+salt+pubkey with our node's privkey
     }
 }