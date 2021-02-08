/**
 * Tippin Node Relayer
 * 
 * Standalone or as a plugin (Umbrel, etc)
 * 
 * This lives on the node of the user, and is in charge of pinging tippin, looking for:
 * a) hold invoices pending to be paid (in which we provide an invoice that will reveal the preimage when paid to us)
 * b) lack of hashes on tippin to generate more invoices (in which we send hashes so Tippin can create more invoices)
 * 
 */
// Read .env and assign to process.env so it can be used anywhere
require('dotenv').config()

const serverPort = 6000,
    http = require("http"),
    express = require("express"),
    app = express(),
    server = http.createServer(app);

// Lightning rpc and calls
const Lightning = require('./lnd/lightning')
const lightning = new Lightning();

// Start Live Agents
const LiveAgent = require('./live/live')
const liveAgent = new LiveAgent(lightning);

// If you get here, respond with an error 404.
app.use(function (req, res, next) {
    res.status(404).json({ error: true, code: 404, message: 'Unknown request' });
})
  
// Start Express
server.listen(serverPort, () => {
    console.log(`Tippin Node Relayer running on port ${serverPort}`)
})