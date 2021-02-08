
const generateHash = require('./generate-hash')
const modelHash = require('../models/model-invoice-hash')

const log = require('../helpers/log')

const {randomBytes} = require('crypto')

const {TIPPIN_API_URL} = require('../helpers/constants')

module.exports = async (lightning) => {

    //1. Create hashes
    var hashes = [];
    for(var i=0; i<5; i++)
    {
        //1. Generate random seed
        const preSeed = randomBytes(32);
        const seed = preSeed.toString('hex');

        //2. Create hash
        const hash = await generateHash(lightning, seed);
        if(hash.error)
        {
            log.logException('ErrorCreatingHash', hash.message)
            continue;
        }

        //3. Generate model
        var modelInvoiceHash = modelHash();
        modelInvoiceHash.seed = seed;
        modelInvoiceHash.hash = hash.hash;

        //4. Sign model
        const messageToSign = hash+seed;
        const signature = await lightning.signMessage(messageToSign)
        if(signature.error || !signature.signature)
        {
            log.logException('ErrorCreatingHashSignature', signature)
            continue;
        }

        //5. Add and save to array
        modelInvoiceHash.signature = signature.signature;
        hashes.push(modelInvoiceHash)
    }

    //2. Sign all the hashes as a string
    const hashesString = JSON.stringify(hashes);
    const hashesStringSignature = await lightning.signMessage(hashesString)
    if(hashesStringSignature.error || !hashesStringSignature.signature)
    {
        log.logException('ErrorCreatingHashSignatureForArray', signature)
        return {error: true, message: 'ErrorCreatingHashSignatureForArray'}
    }

    //3. Send array of hashes to Tippin
    const sendResponse = await new Promise((resolve, reject) => {
        var requestBody = { 
          hashes: hashes,
          signature: hashesStringSignature,
        };

        var options = {
          url: `${TIPPIN_API_URL}/v1/link/sendhashes`,
          json: true,
          timeout: 30 * 1000,
          headers: {
            'content-type': 'application/json',
          },
          form: JSON.stringify(requestBody),
        };

        //Request
        request.post(options, function(error, response, body) {
          //@response - is the whole response
          //@body - is the body inside response, which is what we need
          console.log(`Tippin SendHashes error=${error} body=${JSON.stringify(body)}`)
          resolve(body);
        });
    })
    

    //5. Send Invoice as body to Tippin
    return sendResponse;
}