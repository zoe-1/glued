// Init globals

var Glue = require('glue'),
    Manifest = require('./manifest.js'); 


var internals = {
        options: { relativeTo: process.cwd() }
}


exports.init = function (port, cb) {

    Glue.compose(Manifest.settings, internals.options, function (err, server) {


        server.start(function (err) {

            /* Turn on lout documentation here.
            server.register({ register: require('lout') }, function(err) {

            });
            */

            /*
             * Redirect everything to tls
             */
            server.ext('onRequest', function (request, reply) {

                // console.log(request.headers);
                // console.log(request.connection.info.protocol);
                if (request.connection.info.protocol === 'http') {
                    // console.log('redirect to https');
                    return reply.redirect('https://localhost:8001' + request.url.path).code(301);
                    //return reply.redirect('https://' + request.headers.host + request.url.path ).code(301);
                }

                return reply.continue();
            });

            // Do not test errors here. 
            // Glue will asplode if errors are found.
            return cb(err, server);
        });

    });
};
            
