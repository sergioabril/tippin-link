/**
 * Call Tippin Backend periodically and try to 
 * 
 */

// const {OPEN} = require('ws');

//const sendPush = require('../helpers/sendPush')
const log = require('../helpers/log')

const request = require('request')

const {randomBytes} = require('crypto')

const {TIPPIN_API_URL} = require('../helpers/constants')

const sendInvoice = require('./send-invoice')
const sendHashes = require('./send-hashes')

module.exports = class LiveInvoicer {

  constructor(lightning) {
      console.log('Launched LiveInvoicer Agent!') 

      if (!lightning) {
        throw new Error('ExpectedLightning');
      }

      //this.wss = wss;
      this.lightning = lightning;

      // Start checking
      this.launchAgent(this);
  }
  
  async launchAgent(context)
  {
    
      if (!context.lightning) {
        throw new Error('ExpectedLightningOnServer');
      }

      // Ping Tippin
      await pingTippin(context.lightning)
        .catch(e => {
          log.logException('ErrorFetchingTippinPing', e.message)
        })

      // Check again
      context.checkAgain(context);
  }

  
  // Check again after a while
  checkAgain(context)
  {
    // console.log('Restarting Check for Agent')
    var that = context;
    setTimeout(() => {
      that.launchAgent(that);
    }, 60 * 1000);
  }

};


// Ping tippin, and depending on their response:
// ../v1/link/ping
// a) Send them more hashes for invoices, using the model-signedhash
// b) Send them an invoice for a given hash
// @response {
//      error: (bool)
//      message: (string)
//      requireHashes: (bool)
//      requireInvoice: { seed: (string) }
//}

const pingTippin =  async(lightning) => 
{
    // Before fetching, we create a control salt, and we sign it, so tippin know we are the valid owner of this node
    const salt = randomBytes(16);
    const saltHex = salt.toString('hex');
    const signatureResult = await lightning.signMessage(saltHex)
    if(signatureResult.error || !signatureResult.signature)
    {
        log.logException('ErrorCreatingSignatureForTippinPing', signatureResult)
    }
    const signature = signatureResult.signature;

    // Fetch status to tippin
    const pingResponse = await new Promise((resolve, reject) => {
        var requestBody = { 
          salt: saltHex,
          signature: signature,
        };

        var options = {
          url: `${TIPPIN_API_URL}/v1/link/ping`,
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
          console.log(`Tippin Ping error=${error} body=${JSON.stringify(body)}`)
          resolve(body);
        });
    })
    // E: Error?
    if(pingResponse.error)
    {
        log.logException('ErrorFetchingTippin', pingResponse.message);
        return;
    }

    //A. if requireHashes is true, then we need to send them more hashes
    if(pingResponse.requireHashes)
    {
        console.log(`Tippin requires us to send more hashes: ${pingResponse.requireHashes}`)
        await sendHashes(this.lightning);
        return;
    }

    //B. if requireHashes is true, then we need to send them more hashes
    if(pingResponse.requireInvoice)
    {
        console.log(`Tippin requires us to send an invoice for seed=${pingResponse.requireInvoice.seed}, amount=${pingResponse.requireInvoice.amount} and memo=${pingResponse.requireInvoice.memo}`)
        await sendInvoice(lightning, pingResponse.requireInvoice.seed, pingResponse.requireInvoice.amount, pingResponse.requireInvoice.memo)
        return;
    }
}

