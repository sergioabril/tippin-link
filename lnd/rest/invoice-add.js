//Get Invoice from Custom node (Tippin Link)
var request = require('request');

module.exports = async(parameters) => {
   
   //Read parameters
   const {macaroon, nodeAddress, nodePort} = parameters;
   const {preImage/*memo, expiry*/} = parameters;

   // Othe params
   var expiry = '3600';
   var memo = 'Tippin' //todo: replace for a given memo by tippin

   //console.log('About to create invoice for preimage ', preImage)

   // On Rest, preimage must be base64
   var preImage_byte_b64 = Buffer.from(preImage, 'hex').toString('base64')
   // console.log('preimage b64', preImage_byte_b64)

   // An object of options to indicate where to post to
   var requestBody = { 
     memo: memo,
     expiry: expiry,
     r_preimage: preImage_byte_b64,
   };

   var options = {
     url: `https://${nodeAddress}:${nodePort}/v1/invoices`,
     rejectUnauthorized: false,
     json: true,
     timeout: 30 * 1000,
     headers: {
       'Grpc-Metadata-macaroon': macaroon,
     },
     form: JSON.stringify(requestBody),
   };

   return new Promise((resolve, reject) => {
        //Request
        request.post(options, function(error, response, body) {
            //@response - is the whole response
            //@body - is the body inside response, which is what we need
            console.log(`AddInvoice error=${error} body=${JSON.stringify(body)}`)
            if(error || body.error)
            {
                const msgerror = error || body.error;
                resolve({error: true, message: msgerror});
            }else{
                resolve(body);
            }
        });
    })
}