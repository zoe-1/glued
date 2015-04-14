var Joi = require('joi');

exports.register = function(server,options,next){

    server.route({
        method: 'GET',
        path: '/',
        config: {
            description: 'Returns auth/index page -- page one of login',  
            handler: function (request, reply) {
               
                // User already logged in.
                if (request.auth.isAuthenticated) {
                    return reply.redirect('/loggedin');
                }

                 
                // return reply('/one/index route');
                return reply.view('index', {message:'Please Login'});
            },
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                 }
            }
        }
    });


    server.route({
        method: 'POST',
        path: '/',
        config: {
            description: 'Hanlde validation of POST login form data.',  
            validate: {
                payload:{ 
                    //username: Joi.string().min(5).max(25).email(),
                    username: Joi.string().min(5).max(25),
                    password: Joi.string().min(4).max(30) 
                } 
            },
            handler: function (request, reply) {

                var users = {
                    'zoe@zoe.com': {
                        id: 'Jon',
                        password: 'test',
                        name: 'Jon Swenson'
                    }, 
                    'ton@zoe.com': {
                        id: 'Jon',
                        password: 'test',
                        name: 'Ton Swenson'
                    } 
                };



                var message = '';
                var account = null;

                if (!request.payload.username ||
                        !request.payload.password) {
                    message = 'Missing username or password';
                }else {
                    account = users[request.payload.username];

                    if (!account ||
                          account.password !== request.payload.password) {
                        message = 'Invalid username or password';
                    }
                }

                if (message) {
                    return reply.view('index', {message:message});
                }

                // Initiates the session with stored values.  
                // Note: session is a auth.strategy we created with the auth-cookie plugin.
                // Store various permission levels in the authsession.
                request.auth.session.set(account);

                return reply.redirect('/auth/loggedin');
            }
        }
    });

    
    server.route({
        method: 'GET',
        path: '/loggedin',
        config: {
            description: 'User successfully logged in.',  
            handler: function (request, reply) {

                // Returns the query string of a get request.
                return reply.view('loggedin', {boom:request.auth.credentials.name});
            },
            auth: 'session'
        }
    });


    server.route({
        method: 'GET',
        path: '/logout',
        config: {
            description: 'Logout the user.',  
            handler: function (request, reply) {

                request.auth.session.clear();
                return reply.redirect('/auth');
                // Returns the query string of a get request.
                //return reply.view('loggedin', {boom:request.auth.credentials.name});
            },
            auth: 'session'
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
                path: './lib/auth/public/css',
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
                path: './lib/auth/public/images',
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
                path: './lib/auth/public/js',
                listing: true // d/n show diretory tree. 
            }
        }
    });


    return next();
};


exports.register.attributes = {
    name:'auth',
    version:'0.0.1'
};
