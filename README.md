## AERIS WEBAPI SEED PROJECT

### Prerequisites
* Install nodejs  via https://nodejs.org/en/
* Install git via https://git-scm.com/downloads

### Setup

* git clone
* npm install
* npm start (Server will automatically start)

### Configuration
* All the configuration parameters are defined in config.js. The file has default for all the configs defined which will work for development environment. Any config can be overwritten using environment variable. The environment variable name for each config is defined in config.js

### Dependency Management
* package.json defines the application and lists dependencies.
* To add a new dependency use following command:
npm install --save <package name>
* ALWAYS USE FULL VERSION IN THE PACKAGE.JSON. DO NOT USE ~, ^, <, >, or n.n.x in versions

Note:
--------------
1. All the common components like loggers will go into lib/
2. The server/ is where all source code resides. Every module can correspond to a folder under server/. 
Then each module/ can have routes.js with CRUD APIs. 

