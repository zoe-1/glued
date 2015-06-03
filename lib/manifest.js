
var Config = require('./config/config.js');


var manifest = module.exports = {};


manifest.settings = {
  "server": {},
  "connections": [
      {
          host: 'localhost',
          port: 8000,
          labels: ['web']
      },
      {
          host: 'localhost',
          port: 8001,
          labels: ['web-tls'],
          tls: Config.tls
      }
  ],
  "plugins": {
    "./lib/auth-cookie":[{
      "select": ["web","web-tls"]
    }]
    , "./lib/main/main":[{
      "select": ["web", "web-tls"]
    }],
    "./lib/version/version":[{
      "select": ["web","web-tls"],
      "routes": { "prefix":"/version" }
    }],
    "./lib/one/one":[{
      "select": ["web","web-tls"],
      "routes": { "prefix":"/one" }
    }],
    "./lib/joi/joi":[{
      "select": ["web","web-tls"],
      "routes": { "prefix":"/joi" }
    }],
    "./lib/auth/auth":[{
      "select": ["web","web-tls"],
      "routes": { "prefix":"/auth" }
    }]  
  }
};

