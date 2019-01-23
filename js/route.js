'use strict'

function Router(routes) {
  this.constructor(routes);
  this.init();
}

Router.prototype.constructor = function() {
  this.routes = routes;
  this.rootElement = document.getElementById('app');
}

Router.prototype.init = function() {
  let r = this.routes;
  (function(scope, r) {
    window.addEventListener('hashchange', e => {
      scope.hasChanged(scope, r);
    });
  })(this, r)
}

Router.prototype.hasChanged = function(scope, r) {
  if(window.location.hash.length > 0) {
    console.log(window.location.hash);
  }
}

Router.prototype.goToRoute = function(htmlName) {
  (function(scope) {
    let url = 'views/' + htmlName;
    console.log(url);
  })(this);
}