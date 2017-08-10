module.exports = function(server, options) {

  var routers = [
    './module/routes'
  ];

  var routes = [];
  var tmpRoute;

  routers.forEach(function(route) {
    tmpRoute = require(route);

    if (typeof tmpRoute === 'function') {
      tmpRoute = tmpRoute(server, options);
    }

    routes = routes.concat(tmpRoute);
  });
  return routes;
}
