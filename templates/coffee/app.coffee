app = window.app

app.controller "Main", ($scope, DataService) ->
  $scope.user = DataService.user

app.controller "Headers", ($scope, DataService) ->

app.controller "Debate", ($scope, DataService) ->
  $scope.debate = DataService.debate
