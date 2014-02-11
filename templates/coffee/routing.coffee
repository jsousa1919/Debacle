$.app.config(['$routeProvider',
  ($routeProvider) ->
    $routeProvider.
      when('/', {
        templateUrl: 'views/list.html'
        controller: 'ListController'
      }).
      when('/debate/:id?', {
        templateUrl: 'views/debate.html'
        controller: 'DebateController'
      }).
      when('/new_debate', {
        templateUrl: 'views/new.html',
        controller: 'CreateController'
      }).
      otherwise({
        redirectTo: '/'
      })
])
