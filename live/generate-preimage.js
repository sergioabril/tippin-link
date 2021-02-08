/**
 * Generates preimage based on a seed, to be used by us to claim a tippin invoice being holded
 * @param {*} seed (a random 16byte hex string)
 */

const {createHash} = require('crypto');

module.exports = async(lightning, seed) => 
{
    console.log('Generating preImage for invoices from a seed...', seed)

    // Check that seed is long enough
    if(seed===undefined || seed.length < 64)
    {
        console.log('Seed to short!',seed.length)
        return {error: true, message: 'Seed too short'}
    }

    //1. Sign a message using seed as message
    var generatedPreimageResult = await lightning.signMessage(seed)
    if(generatedPreimageResult.signature===undefined || generatedPreimageResult.signature==='')
    {
        console.log('ErrorGeneratingSignature')
        return {error: true, message: 'Error generating signature'}
    }
    const signature = generatedPreimageResult.signature;
    const signature_byte = Buffer.from(signature);
    console.log('Signature: ', signature)
    console.log('Signature_byte: ', signature_byte)

    //2. Generate an invoice preimage (keep it secret!) by hashing the signature we got from our seed
    const preImage = createHash('sha256').update(signature_byte).digest('hex');
    const preImage_byte = Buffer.from(preImage, 'hex');
    console.log('preImage', preImage)
    console.log('preImage_byte', preImage_byte)

    //4. Return the hash for this seed
    return {preImage: preImage, seed: seed}
}