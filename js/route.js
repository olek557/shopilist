'use strict'

function Route(name, htmlName, defaultRoute) {
  this.constructor(name, htmlName, defaultRoute);
}

Route.prototype.constructor = function(name, htmlName, defaultRoute) {
  this.name = name;
  this.htmlName = htmlName;
  this.defaultRoute = defaultRoute;
}

Route.prototype.isActiveRoute = function(hashedPath) {
  return hashedPath.replace('#', '') === this.name;
}
