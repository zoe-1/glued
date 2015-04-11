
var Util = require('util');
var Code = require('code');
var Glued = require('../lib');
var Lab = require('lab');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('Ensure plugin "one" loaded',function(){

    it('Plugin joi  index should respond properly.', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            server.inject('/joi', function (response) {

                expect(response.statusCode).to.equal(200);
                server.stop(done);
            });
        });
    });


    it('Plugin one should respond properly.', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            server.inject({url:'/joi', method:'POST'}, function (response) {

                expect(response.statusCode).to.equal(200);
                server.stop(done);
            });
        });
    });


    it('Plugin joi should respond with error 400. No params submitted.', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            server.inject({url:'/joi/badstuff'}, function (response) {

                expect(response.statusCode).to.equal(400);
                server.stop(done);
            });
        });
    });


    it('Plugin joi validation fail with error 400. name too long', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            server.inject({url:'/joi/badstuff?name=too_long_fail&pass=12345'}, function (response) {

                expect(response.statusCode).to.equal(400);
                server.stop(done);
            });
        });
    });


    it('Plugin joi GET badstuff validates and passes.', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            server.inject({url:'/joi/badstuff?name=too_&pass=12345'}, function (response) {

                expect(response.statusCode).to.equal(200);
                server.stop(done);
            });
        });
    });

});
