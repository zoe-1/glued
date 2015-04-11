var Joi = require('joi');

exports.register = function(server,options,next){

    server.route({
        method: 'GET',
        path: '/',
        config: {
            description: 'Returns joi/index page',  
            handler: function (request, reply) {

                // return reply('/one/index route');
                return reply.view('index');
            }
        }
    });


    server.route({
        method: 'POST',
        path: '/',
        config: {
            description: 'Validation of POST form data.',  
            handler: function (request, reply) {

                //return reply.view('index');
                // If valid returns the payload of a post request. 
                return reply(request.payload);
            },
            validate: {
                payload:{ 
                    username: Joi.string().min(3).max(6),
                    password: Joi.string().min(4) 
                } 
            }
        }
    });
    

    server.route({
        method: 'GET',
        path: '/badstuff',
        config: {
            description: 'Validation GET query string values.',  
            handler: function (request, reply) {

                // Returns the query string of a get request.
                return reply(request.query);
            },
            validate: {
                query:{ 
                    name: Joi.string().min(3).max(5).required(),
                    pass: Joi.string().min(4).required() 
                } 
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
                path: './lib/joi/public/css',
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
                path: './lib/joi/public/images',
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
                path: './lib/joi/public/js',
                listing: true // d/n show diretory tree. 
            }
        }
    });


    return next();
};


exports.register.attributes = {
    name:'joi',
    version:'0.0.1'
};
