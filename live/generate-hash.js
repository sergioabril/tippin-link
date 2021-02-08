/**
 * Generates hash based on a seed, to be used on Tippin to create invoices
 * @param {*} seed (a random 16byte hex string)
 */

const {createHash} = require('crypto');

const generatePreImage = require('./generate-preimage')

module.exports = async(lightning, seed) => 
{
    console.log('Generating hash for invoices from a seed...', seed)

    // Check that seed is long enough
    if(seed===undefined || seed.length < 64)
    {
        console.log('Seed to short!',seed.length)
        return {error: true, message: 'Seed too short'}
    }

    //1. Generate PreImage
    var generatedPreimageResult = await generatePreImage(lightning, seed);
    if(generatedPreimageResult.error)
    {
        console.log('ErrorGeneratingPreImage')
        return generatedPreimageResult;
    }
    //2. Generate an invoice preimage (keep it secret!) by hashing the signature we got from our seed
    const preImage = generatedPreimageResult.preImage;
    const preImage_byte = Buffer.from(preImage, 'hex');
    console.log('preImage', preImage)
    console.log('preImage_byte', preImage_byte)


    //3. Hash the preimage, so we can share this to tipping
    const hashed = createHash('sha256').update(preImage_byte).digest('hex');
    const hashed_byte = Buffer.from(hashed, 'hex');
    console.log('hashed preImage', hashed)
    console.log('hashed preImage_byte', hashed_byte)

    //4. Return the hash for this seed
    return {hash: hashed, seed: seed}
}