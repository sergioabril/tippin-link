// Get Time
function getTimeString(){
    var d = new Date();
    var date = d.getDate();
    var month = d. getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12.
    var year = d. getFullYear();
    var dateStr = date + "/" + month;
    return dateStr + ' ' + d.toLocaleTimeString() + ' GMT';
}

// Get Req details
function getReqDetails(req){
    var userId = 'userid-'+req.jwtUserId || 'no-userid';
    var userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var userRequest = req.originalUrl || 'no-url';
    return userRequest + ' ' + userIp + ' '+ userId;
}

// Regular message
function logInfo(req, message){
    //No log if it's info, just consumes cpu
    //const podName = process.env.K8S_POD_NAME !==undefined ? process.env.K8S_POD_NAME : "none";
    console.log(getTimeString()+' [Info] '+ getReqDetails(req) + ' msg=' + message);
}

// Possible attack (extradetails contains ip, user, etc)
async function logPossibleAttack(message, extradetails){
    console.log(getTimeString()+' [Attack] ' + message + ' ' + (extradetails!==undefined ? JSON.stringify(extradetails):''));
}
// Error to bbe notified, exception (exception is a string, extradetails can be an object)
async function logException(exception, extradetails = undefined, mustNotify = false){
    console.log(getTimeString()+' [Exception] '+exception + ' ' + (extradetails!==undefined ? JSON.stringify(extradetails):''));
}

module.exports = {
    logInfo,
    logPossibleAttack,
    logException
}