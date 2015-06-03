#### Glued 

Example of basic hapijs project structure. <br/>
Coding conventions from  hapijs university learning experiment.<br/> 
<br/>
Inspiration taken from:<br/>
https://github.com/hapijs/university and<br/> 
https://github.com/npm/newww<br/>
<br/>

### To Start
git clone https://github.com/zoe-1/glued.git  
<br/><br/>
git branch <br/>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; View all branches / steps.

<br/>
### step-7 is the current step.
Project uses glue to configure the application.<br/>  
TLS/SSL is enforced on all routes.  Application will not accept non TLS requests,<br/>
they are redirected to be https requests.

### Project follows the hapijs:
[Style Guide](https://github.com/hapijs/contrib/blob/master/Style.md).


### step-1 hapijs app skeleton
```
git checkout template-skeleton
git checkout step-1
```
<br/>
* install packages<br/>
  npm install hapi@latest hoek@latest glue@latest --save<br/>
  npm install code@latest lab@latest --save-dev<br/>
* Make two modules in library. <br/>
  main and version.<br/>
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
      

### step-6 validation using joi.

    * Step-4 & 5 showed how to make a plugin ("one") configured to use
      html views, style sheets, page specific JavaScript, image includes,
      and RESTful routes. These are all features any normal web server
      would offer.  At this stage, we have hapijs cofigured to work like a 
      normal webserver.
    * Now it is time to add validation of submitted data using joi.
      joi is an object schema validation tool we will use to validate
      submitted data.  In this step we will use joi to validate form 
      submission (POST requests) and  query strings (GET requests).
    * Make a plugin named "joi".
    * Make a view with an html form which submits specific data to be validated.
    * Make a route that handles POST requests from the above form and
      uses joi to validate data submitted by the form.
    * Make a route named "badstuff" that handles query data submitted by
      a link (GET request).  This route will also use joi to validate the 
      data submitted by the GET request.
    * Configure joi to establish what kind of data can be submitted.
    * Add a new plugin configuration to the manifest.js file for joi plugin.
    * Tests made with 100% coverage.


### step-7 sessions and security.
    * This step utilizes hapi-auth-cookie plugin
    * with a simple login system that works. 
    * But, I am having trouble with getting 100% coverage in the tests.
    * sessions -
    * user fingerprint -
    * security planning.


### step-8 logging.
    * To do
    * log output to file. Track performance etc. 



### Routes
localhost:8000  <br/>
http://localhost:8000/one     GET<br/>
localhost:8000/joi            POST GET<br/>
localhost:8000/joi/badstuff   GET<br/>
localhost:8000/auth           POST GET<br/>
localhost:8000/auth/loggedin          <br/>
localhost:8000/auth/logout          <br/>


### HTML and static assets 
handlebars configured<br/>
static assets<br/>
Each plugin has directories configured for css, image, and js files.


