(function() {
  var app;

  app = window.app;

  app.controller("Main", function($scope, DataService) {
    return $scope.user = DataService.user;
  });

  app.controller("Headers", function($scope, DataService) {});

  app.controller("Debate", function($scope, DataService) {
    return $scope.debate = DataService.debate;
  });

}).call(this);
