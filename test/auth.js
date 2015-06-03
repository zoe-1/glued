
// Load Modules

var Hapi = require('hapi');
var Hoek = require('hoek');
var Util = require('util');
var Code = require('code');
var Glued = require('../lib');
var Lab = require('lab');
var Cheerio = require('cheerio');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('Ensure plugin "auth" loaded properly',function(){

    it('GET request should respond properly.', function(done){
    
        Glued.init(0, function(err, server){

            var tlserver = server.select('web-tls');

            expect(server.info.port).to.be.above(0);
            tlserver.inject('/auth', function (response) {

                expect(response.statusCode).to.equal(200);
                response.request.auth.session.clear();
                server.stop(done);
            });
        });
    });


    it('POST request index should login.', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            var request = { method: 'POST', url: '/auth', payload: internals.login_credentials('zoe@zoe.com', 'test')};

            var tlserver = server.select('web-tls');

            expect(request.payload).to.equal('{\"username\":\"zoe@zoe.com\",\"password\":\"test\"}');

            //var request = {url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})};  // This request works.
            tlserver.inject(request, function (response) {

                // When request was made the user was not logged in yet.
                expect(response.request.auth.isAuthenticated).to.equal(false);  // request is not logged in yet.
                expect(response.statusCode).to.equal(302);                      // After login get forwarded.
                expect(response.headers['set-cookie']).to.exist();
                server.stop(done);
            });
        });
    });

    it('POST request index should login.', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            var tlserver = server.select('web-tls');

            // var request = { method: 'POST', url: '/auth', payload: internals.login_credentials('', 'test')};        // This request d/n bypass joi.
            // var request = { method: 'POST', url: '/auth', headers: { authorization: internals.header('', 'test') } };  // This request bypasses joi.
            // var request = { method: 'POST', url: '/auth', headers: { authorization: internals.header('zoe@zoe.com', 'test') } };
            var request = {url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})};  // This request works.
            tlserver.inject(request, function (response) {

                // When request was made the user was not logged in yet.
                expect(response.request.auth.isAuthenticated).to.equal(false);  // request is not logged in yet.
                expect(response.statusCode).to.equal(302);                      // After login get forwarded.
                expect(response.headers['set-cookie']).to.exist();
                server.stop(done);
            });
        });
    });
});


describe('DEBUG FOCUS',function(){

    it('POST login request valid username and pw.', function(done){

        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            var tlserver = server.select('web-tls');

            tlserver.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (response) {

                // Ensure redirect occurred.
                expect(response.statusCode).to.equal(302);
                expect(response.headers.location).to.include('/auth/loggedin');

                // Clean up 
                response.request.auth.session.clear();
                server.stop(done);
            });
        });
    });

    it('100% Coverage dev', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            var tlserver = server.select('web-tls');

            tlserver.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (response) {

                expect(response.statusCode).to.equal(302);
                expect(response.headers.location).to.include('/auth/loggedin');

                expect(response.headers['set-cookie']).to.exist();
                var header = response.headers['set-cookie'];
                expect(header.length).to.equal(1);
                expect(header[0]).to.contain('Max-Age=60');
                var cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

                // !!**!! 
                // This got us coverage on line 13
                // !!**!!
                var request = { method: 'GET', url: '/auth', headers: {cookie: 'example='+ cookie[1]} };
                tlserver.inject(request, function (res) {

                    expect(res.statusCode).to.equal(302);
                    expect(res.headers['set-cookie']).to.not.exist();
                    expect(res.request.headers['cookie']).to.exist();

                    //expect(res.result).to.equal('resource');
                    response.request.auth.session.clear();
                    server.stop(done);
                });

                //response.request.auth.session.clear();
                //server.stop(done);
            });
        });
    });


    it('GET /auth while user is already logged in.', function(done){

        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            var tlserver = server.select('web-tls');

            var request1 = { url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'}) };

            tlserver.inject(request1, function (response) {

                // Redirects to /auth/loggedin
                expect(response.statusCode).to.equal(302);
                expect(response.headers['set-cookie']).to.exist();

                // Access the auth cookie
                var header = response.headers['set-cookie'];
                expect(header.length).to.equal(1);
                expect(header[0]).to.contain('Max-Age=60');
                var cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

                // Include the auth cookie to next request.
                var request2 = { method: 'GET', url: '/auth', headers: {cookie: 'example='+ cookie[1]} };
                tlserver.inject(request2, function (res) {

                    // Redirects to loggedin
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.include('/auth/loggedin');

                    // Access session values !!** IMPORTANT
                    expect(res.request.auth.isAuthenticated).to.equal(true);
                    expect(res.request.auth.credentials.name).to.equal('Jon Swenson');

                    // Cookie from inject.
                    expect(res.headers['set-cookie']).to.not.exist();
                    expect(res.request.headers['cookie']).to.exist();
                    var new_header = res.request.headers['cookie'];
                    expect(new_header).to.contain('example=');
                    expect(new_header).to.not.contain('Max-Age=60');

                    // Clean up
                    response.request.auth.session.clear();
                    server.stop(done);
                });
            });
        });
    });
});


describe('/auth/loggedin coverage',function(){

    it('GET /auth/loggedin after user is logged in.', function(done){

        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            var tlserver = server.select('web-tls');

            tlserver.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (response) {

                // Redirects to /auth/loggedin
                expect(response.statusCode).to.equal(302);
                expect(response.headers['set-cookie']).to.exist();

                // Access the auth cookie
                var header = response.headers['set-cookie'];
                expect(header.length).to.equal(1);
                expect(header[0]).to.contain('Max-Age=60');
                var cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

                // Include the auth cookie to next request.
                tlserver.inject({ method: 'GET', url: '/auth/loggedin', headers: {cookie: 'example='+ cookie[1]}}, function (res) {

                    // Redirects to loggedin
                    expect(res.statusCode).to.equal(200);
                    //expect(res.headers.location).to.include('/auth/loggedin');

                    // Cookie from inject.
                    expect(res.request.headers['set-cookie']).to.not.exist();
                    expect(res.request.headers['cookie']).to.exist();
                    //expect(res.request.headers['cookie']).to.exist();
                    // var new_header = res.request.headers['cookie'];
                    //expect(new_header[0]).to.contain('example=');

                    // Clean up
                    response.request.auth.session.clear();
                    server.stop(done);
                });
            });
        });
    });

    it('GET /auth/logout after user is logged in.', function(done){

        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            var tlserver = server.select('web-tls');

            tlserver.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (response) {

                // Redirects to /auth/loggedin
                expect(response.statusCode).to.equal(302);
                expect(response.headers['set-cookie']).to.exist();

                // Access the auth cookie
                var header = response.headers['set-cookie'];
                expect(header.length).to.equal(1);
                expect(header[0]).to.contain('Max-Age=60');
                var cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

                // Include the auth cookie to next request.
                tlserver.inject({ method: 'GET', url: '/auth/logout', headers: {cookie: 'example='+ cookie[1]}}, function (res) {

                    // Redirects to after logout to /auth 
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.include('/auth');

                    // Cookie from inject.
                    expect(res.request.headers['set-cookie']).to.not.exist();
                    expect(res.request.headers['cookie']).to.exist();

                    // Clean up
                    // response.request.auth.session.clear();  // d/n need this because server code logout out the user destroying session.
                    server.stop(done);
                });
            });
        });
    });
});



it('Logged in with bad account / username. It d/n exist.',function(done){

    Glued.init(0, function(err, server){

        expect(server.info.port).to.be.above(0);

        var tlserver = server.select('web-tls');

        // request.auth.isAuthenticated)
        tlserver.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'bam@zoe.com', password:'test44'})}, function (res) {

            //expect(res.request.headers).to.equal('boom');
            // expect(res.request.path).to.equal('boom');

            expect(res.statusCode).to.equal(200);

            // expect(res.headers.location).to.equal('https://localhost:8001/auth');

            var $ = Cheerio.load(res.result);
            var result = ($('.response_message','body').text());
            expect(result).to.equal('Invalid username or password');

            // Clean up
            // res.request.auth.session.clear(); // session never started.
            server.stop(done);
        });
    });
});


it('Login https',function(done){

    Glued.init(0, function(err, server){

        // Select the tls connection to execute the test with.
        var tlserver = server.select('web-tls');

        var url = {
            protocol: 'https',
            hostname: 'localhost',
            port: '8001',
            pathname: 'auth'
        };


        tlserver.inject({url: url, method:'POST', payload: JSON.stringify({username:'bam@zoe.com', password:'test44'}) }, function (res) {

            //expect(res.headers).to.equal('https://localhost:8001/auth');
            // expect(res.headers.location).to.equal('https://localhost:8001/auth');
            expect(res.statusCode).to.equal(200);
            var $ = Cheerio.load(res.result);
            var result = ($('.response_message','body').text());
            expect(result).to.equal('Invalid username or password');
            server.stop(done);
        });
    });
});


it('Logged in with bad pw.',function(done){

    Glued.init(0, function(err, server){

        expect(server.info.port).to.be.above(0);


        var tlserver = server.select('web-tls');

        // request.auth.isAuthenticated)
        tlserver.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test44'})}, function (res) {

            expect(res.statusCode).to.equal(200);

            var $ = Cheerio.load(res.result);
            var result = ($('.response_message','body').text());
            expect(result).to.equal('Invalid username or password');

            // Clean up
            // res.request.auth.session.clear();  // session never started.
            server.stop(done);
        });
    });
});

it('Logged in with no pw.',function(done){

    Glued.init(0, function(err, server){

        expect(server.info.port).to.be.above(0);

        var tlserver = server.select('web-tls');

        // request.auth.isAuthenticated)
        tlserver.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:''})}, function (res) {

            // joi validation test failed. joi error.
            expect(res.statusCode).to.equal(400);
            
            var errorMessage = JSON.parse(res.payload);
            expect(errorMessage.error).to.equal('Bad Request');
            expect(errorMessage.message).to.equal('child \"password\" fails because [\"password\" is not allowed to be empty]');

            // var $ = Cheerio.load(res.result);
            // var result = ($('.response_message','body').text());
            // expect(result).to.equal('Missing username or password');

            // Clean up
            // res.request.auth.session.clear();
            server.stop(done);
        });
    });
});

it('Logged in with no username. bypass joi',function(done){

    Glued.init(0, function(err, server){

        expect(server.info.port).to.be.above(0);

        var tlserver = server.select('web-tls');

        // Note: joi can be configured to validate POST payload, GET query, or headers with validate.headers.
        // Understanding the above allows you to bypass joi tests and get 100% coverage by sending headers data to POST route. 
        // This route is configured to validate payload parameters (POST requests). If only send payload parameters, this would 
        // never get 100% coverage. This may be overkill but it illustrates joi's different levels of validation.  
        // var request = { method: 'POST', url: '/auth', payload: internals.login_credentials('', 'test')};        // This request d/n bypass joi.
        // var request = { method: 'POST', url: '/auth', payload: internals.login_credentials('zoe@zoe.com', 'test') };  // This logs in status code 302 w. correct credentials. test fails wants 200.
        // var request = { method: 'POST', url: '/auth', payload: internals.login_credentials('', 'test') };  // statusCode 400 error joi error message.
        // var request = { method: 'POST', url: '/auth', headers: { authorization: internals.header('', 'test') } };  // This request bypasses joi.
        // var request = { method: 'POST', url: '/auth', headers: { authorization: internals.header('zoe@zoe.com', 'test') } };  // Bypasses joi credentials fail to validate. payload required.
        // For above to be validated by joi must configure validate.headers parameter in joi then headers will be validated.  Hence, we were able to bypass it here.
        // http://www.hapijs.com/tutorials/validation
        var request = { method: 'POST', url: '/auth', headers: { authorization: internals.login_credentials('', 'test')} };  // This fails loggin in event w. correct credentials..
        tlserver.inject(request, function (res) {

            //expect(res.statusCode).to.equal(400);
            expect(res.statusCode).to.equal(200);

            // Confirm response_message is correct on page.
            // joi reject the login request b/c username d/n exist.
            //var errorMessage = JSON.parse(res.payload);
            //expect(errorMessage.error).to.equal('Bad Request');
            //expect(errorMessage.message).to.equal('child \"username\" fails because [\"username\" is not allowed to be empty]');

            var $ = Cheerio.load(res.result);
            var result = ($('.response_message','body').text());
            expect(result).to.equal('Missing username or password');

            // Clean up
            // res.request.auth.session.clear();
            server.stop(done);
        });
    });
});

describe('Another shot at line 13, 14 coverage',function(){

    /*
     * Get coverage for lib/auth/auth.js line 13 , 14
     */
    it('step1 login, step2 go to auth/ GET should hit line 13 test', function (done) {

        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            var tlserver = server.select('web-tls');

            var users = {
                jon: {
                    id: 'Jon',
                    password: 'test',
                    name: 'Jon Swenson'
                }, 
                ton: {
                    id: 'Jon',
                    password: 'test',
                    name: 'Ton Swenson'
                } 
            };

             var opts = {
                    url: '/auth',
                    method: 'POST',
                    payload: {
                      username: 'zoe@zoe.com',
                      password: 'test'
                    },
                    credentials: users.jon
              };

            // request.auth.isAuthenticated)
            //server.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (res) {
            tlserver.inject(opts , function (res) {

                expect(res.statusCode).to.equal(302);

                // ?? Is it possible to access request 
                // expect(res.request.auth.credentials.name).to.equal('jon');
                //server.inject({url:'/loggedin'}, function (res) {

                // ****
                tlserver.inject({ method:'GET', url:'/auth/loggedin'}, function (res) {

                    var header = res.headers['set-cookie'];

                    // expect(header[0]).to.contain('Max-Age=60');
                    //expect(header.name).to.equal('jon');
                    //expect(res.request.auth.credentials.name).to.equal('jon');
                    expect(res.statusCode).to.equal(302);
                    //expect(session.credentials).to.equal('jon');

                    // Gets redirected to /auth GET route.
                    expect(res.headers.location).to.include('/auth');

                    /*
                     * How do I test if 
                     * res.request.auth.credentials.name
                     */
                    //expect(res.request.auth.credentials.name).to.equal('jon');
                    server.stop(done);
                });
            });
        });
    });
});


describe('Adopting hapi-auth-cookie docs test into project',function(){

    it('Inject stuff', function (done) {

        Glued.init(0, function(err, server){

                //server.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (res) {
                //
                var tlserver = server.select('web-tls');

                tlserver.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (res) {

                    //expect(res.payload).to.equal('invalid');
                    expect(res.statusCode).to.equal(302);

                    var header = res.headers['set-cookie'];
                    expect(header.length).to.equal(1);
                    expect(header[0]).to.contain('Max-Age=60');
                    //expect(header[0]).to.contain('Max-Age=60');

                    var cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

                    //server.inject({ method: 'GET', url: '/auth', headers: 
                    //  { cookie: 'special=' + cookie[1] } }, function (res) {
                    //server.inject({url:'/auth', method:'POST', payload: 
                    //  JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (res) {
                    tlserver.inject({ method: 'GET', url: '/auth', headers: res.headers }, function (res) {

                        // expect(res.headers['set-cookie']).to.not.exist();
                        // 302 redirects to another uri
                        expect(res.statusCode).to.equal(200);
                        server.stop(done);
                        //done();
                    });
                });
        });
    });
});

describe('Test from hapi-auth-cookie docs',function(){

    // Below test take from below:
    // Source: https://github.com/hapijs/hapi-auth-cookie/blob/master/test/index.js
    it('does not clear a request with invalid session (clearInvalid not set)', function (done) {

        var server = new Hapi.Server();
        server.connection({port:0});
        server.register(require('hapi-auth-cookie'), function (err) {

            expect(err).to.not.exist();

            server.auth.strategy('default', 'cookie', true, {
                password: 'password',
                ttl: 60 * 1000,
                domain: 'example.com',
                cookie: 'special',
                validateFunc: function (session, callback) {

                    var override = Hoek.clone(session);
                    override.something = 'new';

                    return callback(null, session.user === 'valid', override);
                }
            });


            server.route({
                method: 'GET', path: '/login/{user}',
                config: {
                    auth: { mode: 'try' },
                handler: function (request, reply) {

                    request.auth.session.set({ user: request.params.user });
                    return reply(request.params.user);
                }
                }
            });


            server.route({
                method: 'GET', path: '/resource', handler: function (request, reply) {

                            expect(request.auth.credentials.something).to.equal('new');
                            return reply('resource');
                        }
            });


            server.inject('/login/invalid', function (res) {

                expect(res.result).to.equal('invalid');
                var header = res.headers['set-cookie'];

                expect(header.length).to.equal(1);
                expect(header[0]).to.contain('Max-Age=60');
                var cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

                server.inject({ method: 'GET', url: '/resource', headers: { cookie: 'special=' + cookie[1] } }, function (res) {

                    expect(res.headers['set-cookie']).to.not.exist();
                    expect(res.statusCode).to.equal(401);
                    done();
                });
            });
        });
    });
});

internals.header = function (username, password) {

        return 'Basic ' + (new Buffer(username + ':' + password, 'utf8')).toString('base64');
};

internals.login_credentials = function (username, password) {

        //return 'Basic ' + (new Buffer('username: '+username + ', password: '+ password, 'utf8')).toString('base64');
        return JSON.stringify({"username": username , "password": password});
};
