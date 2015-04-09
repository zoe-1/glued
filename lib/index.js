// Init globals

var Glue = require('glue'),
    manifest = require('./manifest.json');


var internals = {
        options: { relativeTo: process.cwd() }
}


exports.init = function (port, cb) {

    Glue.compose(manifest, internals.options, function (err, server) {

        server.start(function (err) {

            // Do not test errors here. 
            // Glue will asplode if errors are found.
            return cb(err, server);
        });
    });
};
            
