'use strict'

function Router(routes) {
  this.constructor(routes);
  this.init();
}

Router.prototype.constructor = function(routes) {
  this.routes = routes;
  this.rootElement = document.getElementById('app');
}

Router.prototype.init = function() {
  window.addEventListener('hashchange', e => {
    this.hasChanged();
  });
  this.hasChanged();
}

Router.prototype.hasChanged = function() {
  let fullPath = window.location.hash.replace('#', ''),
      listId = fullPath.split(':')[1],
      path = fullPath.split(':')[0];
  if(window.location.hash.length > 0) {
    this.routes.forEach((route) => {
      if(route.isActiveRoute(path)) {
        this.goToRoute(route.htmlName);
        currentList = new List(listId);
      }
    });
  }
  else {
    this.routes.forEach((route) => {
      if(route.defaultRoute) {
        this.goToRoute(route.htmlName);
        getAllUserLists();
      }
    });
  }
}

Router.prototype.goToRoute = function(htmlName) {
  (function(scope) {
    var url = 'views/' + htmlName,
      xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        scope.rootElement.innerHTML = this.responseText;
      }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
  })(this);
}