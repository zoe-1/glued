#### Glued 

Example of basic hapijs project structure. <br/>
Coding conventions used from  hueniversity learning experiment.<br/> 

###
Project follows the hapijs:
[Style Guide](https://github.com/hapijs/contrib/blob/master/Style.md).

###
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
       

git checkout step-2 Testing the application.
    * use lab and code to execute unit tests.
    * Test ensure server starts up properly. 
    * Test ensure plugins load properly.
    * Configure make file and npm <command> to execute tests.
    * Version plugin has prefix configured. prefix equals "version"
