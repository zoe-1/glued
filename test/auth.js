
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

    it('Plugin auth index GET request should respond properly.', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            server.inject('/auth', function (response) {

                expect(response.statusCode).to.equal(200);
                server.stop(done);
            });
        });
    });


    it('Plugin auth POST request index should respond properly.', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            server.inject({url:'/auth', method:'POST'}, function (response) {

                expect(response.statusCode).to.equal(200);
                server.stop(done);
            });
        });
    });


    it('Plugin auth POST login request valid username and pw.', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            server.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (response) {

                expect(response.statusCode).to.equal(302);
                server.stop(done);
            });
        });
    });



    it('Plugin auth POST login request user already logged in.', function(done){

        /*
         * This logic of this test does not test what it should.  
         * I do not know how to access server authentication state in tests.
         * How do I access the request.auth.credentials.name?
         * Do you make a mock up for this?
         */
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

                //res.raw.req.auth.isAuthenticated = true;
                // request.auth.isAuthenticated)
                server.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (res) {

                    // How would I access: isAuthenticated to test.
                    // res.raw.req.auth = {};
                    // res.raw.req.auth.isAuthenticated = true;
                    // console.log($('.response_message','body').text());
                    // var result = ($('.response_message','body').text());

                    expect(res.statusCode).to.equal(302);

                    // Forwarded to /loggedin page.
                    expect(res.headers.location).to.include('/loggedin');

                    server.stop(done);
                });
        });
    });
});


describe('Trying to use before after to test if session was already.',function(){

    var test_server = null; 
    lab.before('Login',function(done){

        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            test_server =  server;
            // request.auth.isAuthenticated)
            test_server.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test44'})}, function (res) {


                var $ = Cheerio.load(res.result);
                var result = ($('.response_message','body').text());

                expect(res.statusCode).to.equal(200);
                //expect(test_server.state.name).to.equal('sid-example');
                
                expect(result).to.equal('Invalid username or password');
                
              
            });
        });

            // Wait 1 second
            setTimeout(function () { test_server.stop(done); }, 1000);
    });


    lab.test('Plugin auth POST login request invalid username and pw.', function(done){


        Glued.init(0, function(err, server){

            server.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (response) {

                /* Again...
                 * Trying to get coverage for 
                 * lib/auth/auth.js line 13 , 14
                 */
                //response.raw.req.auth = {};
                //response.raw.req.auth.isAuthenticated = true;
                //expect(response.request.auth.isAuthenticated).to.equal(true);
                //expect(test_server.internals).to.equal(undefined);
                expect(response.statusCode).to.equal(302);

                //test_server.stop(done);
                //test_server.auth.test('session', response.raw.req, test_server.stop(done))
                server.stop(done());
                
            });

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
            server.inject(opts , function (res) {

                expect(res.statusCode).to.equal(302);

                // ?? Is it possible to access request 
                // expect(res.request.auth.credentials.name).to.equal('jon');
                //server.inject({url:'/loggedin'}, function (res) {

                // ****
                server.inject({ method:'GET', url:'/auth/loggedin'}, function (res) {

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


describe('Adopting hapi-auth-cookie docs test to mine',function(){

    it('Inject stuff', function (done) {

        Glued.init(0, function(err, server){

                var server = server;
                //server.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (res) {

                server.inject({url:'/auth', method:'POST', payload: JSON.stringify({username:'zoe@zoe.com', password:'test'})}, function (res) {

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
                    server.inject({ method: 'GET', url: '/auth', headers: res.headers }, function (res) {

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
