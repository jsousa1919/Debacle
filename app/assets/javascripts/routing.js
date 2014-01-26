(function() {
  $.app.config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/', {
        templateUrl: 'views/list.html',
        controller: 'ListController'
      }).when('/debate/:id?', {
        templateUrl: 'views/debate.html',
        controller: 'DebateController'
      }).otherwise({
        redirectTo: '/'
      });
    }
  ]);

}).call(this);
