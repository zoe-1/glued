
var Hoek = require('hoek');
var Lib = require('./index');


Lib.init(8000, function(err, server){

    server.ext('onRequest', function (request, reply) {

            if (request.headers['x-forwarded-proto'] === 'http') {
                      return reply().redirect('https://' + request.headers.host + request.url.path).code(301);
        }
                reply.continue();
    });

    Hoek.assert(!err, err);
    console.log('Server started at: '+ server.info.uri +'\n'+
        'Using port: '+ server.info.port);
})




















