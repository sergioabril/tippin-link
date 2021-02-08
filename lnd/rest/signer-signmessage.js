
/**
 * Sign message from node
 */

var request = require('request');

module.exports = async(parameters) => {
   
   console.log('Calling /v1/signmessage')

   //Read parameters
   const {macaroon, nodeAddress, nodePort} = parameters;
   const {message} = parameters;

   // Log
   console.log('Message to sign: ',message)

   // Message, for REST, must be bytes encoded as base64
   var encodedMessage = Buffer.from(message, "utf-8").toString('base64');

   // An object of options to indicate where to post to
   var requestBody = { 
     msg: encodedMessage,
   };

   var options = {
     url: `https://${nodeAddress}:${nodePort}/v1/signmessage`,
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
            console.log(`SignMessage error=${error} body=${JSON.stringify(body)}`)
            if(error || body.error)
            {
                const msgerror = error || body.error;
                resolve({error: true, message: msgerror});
            }else{
                const signature = body.signature;
                resolve({signature: signature});
            }
        });
    })
   
}