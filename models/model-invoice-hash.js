/**
 * Model to create a hash 
 * to be sent to Tippin, 
 * so Tippin can generate invoices on our behalf using it
 * 
 * The key is the seed, 
 * which can be used (only on our node),
 * to derivate the same preImage in a deterministic way
 * so we can then claim the hold invoice
 */

module.exports = () =>{
    return {
        hash: '', //hashed preimage
        seed: '', //the hash used to create a preimage, later hashed and provided above
        signature: '', //a signature of the message: hash+salt+pubkey with our node's privkey
     }
 }