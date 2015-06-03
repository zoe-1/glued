
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


describe('Ensure server started up',function(){

    it('Server index should respond properly.', function(done){
    
        Glued.init(0, function(err, server){

            expect(server.info.port).to.be.above(0);

            var tlserver = server.select('web-tls');

            tlserver.inject('/', function (response) {

                expect(response.statusCode).to.equal(200);
                server.stop(done);
            });
        });
    });
});
