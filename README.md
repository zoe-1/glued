#### Glued 

Example of basic hapijs project structure. <br/>
Coding conventions used from  hueniversity learning experiment.<br/> 

###
Project follows the hapijs:
[Style Guide](https://github.com/hapijs/contrib/blob/master/Style.md).


### step-1 hapijs app skeleton
git checkout template-skeleton
git checkout step-1
    * install packages
      npm install hapi@latest hoek@latest glue@latest --save
      npm install code@latest lab@latest --save-dev
    * Make two modules in library.
      main and version.
      Use glue to load modules.
      See: ./lib/manifest.json
           ./lib/index.js
    * Configure npm start command.
    * Use Makefile to start application.
       

### step-2 Testing the application
git checkout step-2 Testing the application.
    * use lab and code to execute unit tests.
    * Test ensure server starts up properly. 
    * Test ensure plugins load properly.
    * Configure make file and npm <command> to execute tests.
    * Version plugin has prefix configured. prefix equals "version"


### step-3 Configure tls (Transport Layer Security)
git checkout step-3 Configure tls (Transport Layer Security) encryption 
    * Create tls self signed cert for development server (openssl).
    * Create configuration script. ./lib/congfig/config.js
      Store tls cert values in config.js script. 
    * Configure manifest.json file to include tls settings and server.
    * On live server config file is to we swaped out w/ live settings.


### step-4 html templates with css, js, images included. 
    * Make new plugin called "one".
    * Configure "one" plugin's path for views, helpers, and partials.
      Every plugin can serve html files located in the configured view directory.
      view path:
        All views use by reply.view() method must be stored in the configured view
        directory. 
      helpersPath:
        Helpers scripts used inisde view files are located in the configured helpersPath.
      partialsPath:
        Partials used by views are stored in the partialsPath. 
      template engine:

    * Configure route "/" which serves an html view file named index.html.
    * Configure the "one" plugin to serve static assets. (css,images,js).
      index.html view will use assets like css files, image files, 
      and js files. These static assets are located in the plugins "public" folder.  
      One of the unique features of hapi is it's plugin structure. 
      This structure allows static files to be stored inside the plugin. 
      This allows for better code organization because every plugin's css, image, and js files
      are stored inside the plugin itself. Importantly, these static files are accessable across the 
      hapijs application not just inside the plugin.  

    * Learning objectives:
    * Understand hapi configuration of views, partials, and helpers. 
    * Understand hapi configuration of static assets: css, images, and js files. 
    * Learn how to make a route with a hapi plugin.
    * Learn how to configure handlebars.
      Make index route which utilizes static assets - css, images, and js. 
    * Learn how to configure a plugins manifest file settings.


### step-5 configure routes handling RESTful requests.
    * Step-4 configured the "one" plugin's index.html view, now we will add routes
      which will handle RESTful requests from the server.  
    * Make RESTful routes with html views for them:
        post    - form post   POST
        get     - path params GET 
    * See below link for more about RESTFUL requests.
      http://en.wikipedia.org/wiki/Representational_state_transfer
    * tests for the new route
    * Learning Objectives
      - Learn how to make routes that handle RESTful requests.
      - Understand the theory behind RESTful requests.
      

### step-6 validation input using joi.
    * Step-4 & 5 configured "one" plugin's html views and added RESTful routes.  
      Now it is time to add validation of submitted data using joi.  
      joi is an object schema validation tool we will use to validate submitted data.  
    * Make form that submits specific data to be validated.
    * Make requirements of what kind of data can be submitted.


### step-7 sessions and security.
    * sessions -
    * user fingerprint -
    * security planning.


### step-8 logging.
    * log output to file. Track performance etc. 


