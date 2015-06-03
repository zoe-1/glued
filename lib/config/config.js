
var fs = require('fs');
var config = module.exports = {};


//  tls Trasport Layer Security (tls)
config.tls = {
    key: fs.readFileSync('./lib/config/certs/server.key'),
    cert: fs.readFileSync('./lib/config/certs/server.crt'),

    // This is necessary only if using the client certificate authentication.
    requestCert: true,

    // This is necessary only if the client uses the self-signed certificate.
    ca: []
};
