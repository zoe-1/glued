
var Config = require('./config/config.js');


var manifest = module.exports = {};


manifest.settings = {
  "server": {},
  "connections": [
    {
      "port": 8000,
      "labels": "web"
    }, {
      "port": 8001,
      "labels": "web-tls",
      "tls":Config.tls
    }, {
      "port": 8181,
      "labels": "api"
    }
  ],
  "plugins": {
    "./lib/auth-cookie":[{
      "select": ["web","web-tls"]
    }],
    "./lib/main/main":[{
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

