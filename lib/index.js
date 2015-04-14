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

            // Do not test errors here. 
            // Glue will asplode if errors are found.
            return cb(err, server);
        });

    });
};
            
