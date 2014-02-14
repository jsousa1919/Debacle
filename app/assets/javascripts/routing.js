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
        controller: 'CreateController'
      }).when('/users/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      }).when('/users/register', {
        templateUrl: 'views/register.html',
        controller: 'LoginController'
      }).when('/users/logout', {
        controller: 'LoginController'
      }).otherwise({
        redirectTo: '/'
      });
    }
  ]);

}).call(this);
