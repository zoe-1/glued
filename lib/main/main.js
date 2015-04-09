
exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        config: {
            description: 'Returns index page',  
            handler: function (request, reply) {

                return reply('Main/index route');
            }
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'main'
};
