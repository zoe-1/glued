// Init globals

var Glue = require('glue'),
    manifest = require('./manifest.json');


var internals = {
        options: { relativeTo: process.cwd() }
}


exports.init = function (port, cb) {

    if (typeof port === 'function'){
        cb = port;
        manifest.connections[0].port = 8000;
    }else{
        manifest.connections[0].port = port;
    }


    Glue.compose(manifest, internals.options, function (err, server) {

        server.start(function (err) {

            // Do not test errors here. 
            // Glue will asplode if errors are found.
            return cb(err, server);
        });
    });
};
            
