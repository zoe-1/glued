
exports.register = function(server,options,next){

    server.route({
        method: 'GET',
        path: '/',
        config: {
            description: 'Returns one/index page',  
            handler: function (request, reply) {

                // return reply('/one/index route');
                return reply.view('index', {rest:'GET'});
            }
        }
    });


    server.route({
        method: ['POST', 'PUT'],
        path: '/',
        config: {
            description: 'Returns one/index page',  
            handler: function (request, reply) {

                // return reply('/one/index route');
                return reply.view('index', {rest:'POST'});
            }
        }
    });


    /* ****************************************************
     * PLUGIN CONFIGURATIONS BELOW.
     * ****************************************************
     * Configure views, helpers, and partials.
     * Configure static files directory path.
     * ****************************************************/
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './views',
        helpersPath: './views/helpers',
        partialsPath: './views/partials'
    });


    // CONFIG STATIC FILES INCLUDE 
    // load static css 
    server.route({
        method: 'GET',
        path: '/css/{filename*}',
        handler: {
            directory: {
                path: './lib/one/public/css',
                listing: true // d/n show diretory tree. 
            }
        }
    });


    // load static images
    server.route({
        method: 'GET',
        path: '/images/{filename*}',
        handler: {
            directory: {
                path: './lib/one/public/images',
                listing: true // d/n show diretory tree. 
            }
        }
    });


    // load static JavaScript 
    server.route({
        method: 'GET',
        path: '/js/{filename*}',
        handler: {
            directory: {
                path: './lib/one/public/js',
                listing: true // d/n show diretory tree. 
            }
        }
    });


    return next();
};


exports.register.attributes = {
    name:'one',
    version:'0.0.1'
};
