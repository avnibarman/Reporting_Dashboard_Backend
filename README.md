## AERIS Reporting Dashboard Backend

Final Result using API
![first](https://user-images.githubusercontent.com/17935788/29504452-ae0e2542-85f4-11e7-8f4a-8e850e44e712.jpg)

![second](https://user-images.githubusercontent.com/17935788/29504466-c580295a-85f4-11e7-9140-e8a0f54449da.jpg)

![third](https://user-images.githubusercontent.com/17935788/29504474-d5af293e-85f4-11e7-9101-94869357b734.jpg)

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

