var Pkg = require('../../package.json');


// Declare internals

var internals = {
    response: {
        version: Pkg.version
    }
};


exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        config: {
            description: 'Returns version data',  
            handler: function (request, reply) {

                return reply(internals.response);
            }
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'version'
};
