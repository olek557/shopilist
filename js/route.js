'use strict'

function Route(name, htmlName, initFunction, defaultRoute) {
  this.constructor(name, htmlName, initFunction, defaultRoute);
}

Route.prototype.constructor = function(name, htmlName, initFunction, defaultRoute) {
  this.name = name;
  this.htmlName = htmlName;
  this.initFunction = initFunction;
  this.defaultRoute = defaultRoute;
}

Route.prototype.isActiveRoute = function(hashedPath) {
  return hashedPath.replace('#', '') === this.name;
}
