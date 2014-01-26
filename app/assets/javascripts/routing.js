(function() {
  $.app.config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/', {
        templateUrl: 'views/list.html',
        controller: 'ListController'
      }).when('/debate/:id?', {
        templateUrl: 'views/debate.html',
        controller: 'DebateController'
      }).when('/new_debate', {
        templateUrl: 'views/new.html',
        controller: 'DebateCreator'
      }).otherwise({
        redirectTo: '/'
      });
    }
  ]);

}).call(this);
