var Hoek = require('hoek');

exports.register = function(server,options,next){

    var new_server = server;
    server.register(require('hapi-auth-cookie'), function (err) {

        server.auth.strategy('session', 'cookie', {
            password: 'secret',
            ttl: 60 * 1000,
            cookie: 'example',
            redirectTo: '/auth',
            isSecure: false
        });

    });

    next();
};

exports.register.attributes = {
    name:'auth-cookie',
    version:'0.0.1',
    description:'The hapi-auth-cookie include.'
};
