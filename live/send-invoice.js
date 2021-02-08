
const generatePreImage = require('./generate-preimage')
const modelInvoice = require('../models/model-invoice')

const {TIPPIN_API_URL} = require('../helpers/constants')

module.exports = async (lightning, seed, amount, memo) => {
    
    //1. Create preImage for this invoice
    const preImageResult = await generatePreImage(lightning, seed);
    if(preImageResult.error)
    {
        return preImageResult;
    }
    const preImage = preImageResult.preImage;
    // console.log('[sendInvoice] preImage:', preImage)

    //2. Generate Invoice
    const invoiceResult = await lightning.addInvoice(memo, amount, preImage)
    if(invoiceResult.error)
    {
        return invoiceResult;
    }
    const r_hash = invoiceResult.r_hash; //this is the base64 of the hashed preimage. you can check, they match
    const payment_request = invoiceResult.payment_request;


    //3. Generate model
    var invoice = modelInvoice();
    invoice.seed = seed;
    invoice.invoice = payment_request;

    //4. Generate signature and complete model
    const messageToSign = payment_request+seed;
    const signature = await lightning.signMessage(messageToSign)
    if(signature.error || !signature.signature)
    {
        log.logException('ErrorCreatingInvoiceSignature', signature)
    }
    invoice.signature = signature.signature;
    // console.log('Invoice Model: ',invoice)

    //5. Send InvoiceModel (invoice) as the body on a post request to Tippin
    const sendResponse = await new Promise((resolve, reject) => {
        var requestBody = invoice;

        var options = {
          url: `${TIPPIN_API_URL}/v1/link/sendinvoice`,
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


    //6. Return
    return sendResponse;
}