/**
 * Sign message from node
 */

var request = require('request');

module.exports = async(parameters) => {
   
   console.log('Calling /v1/getinfo')

   //Read parameters
   const {macaroon, nodeAddress, nodePort} = parameters;

   var options = {
     url: `https://${nodeAddress}:${nodePort}/v1/getinfo`,
     rejectUnauthorized: false,
     json: true,
     timeout: 30 * 1000,
     headers: {
       'Grpc-Metadata-macaroon': macaroon,
     },
   };

   return new Promise((resolve, reject) => {
        //Request
        request.get(options, function(error, response, body) {
            //@response - is the whole response
            //@body - is the body inside response, which is what we need
            //console.log(`GetInfo error=${error} body=${JSON.stringify(body)}`)
            if(error || body.error)
            {
                console.log(`GetInfo error=${error} body=${JSON.stringify(body)}`)
                const msgerror = error || body.error;
                resolve({error: true, message: msgerror});
            }else{
                const pubKey = body.identity_pubkey;
                resolve({pubKey});
            }
        });
    })
   
}