$.app.controller 'Main', ($scope, DataService) ->
  $scope.user = DataService.user

$.app.controller 'Headers', ($scope, DataService) ->

$.app.controller 'Debate', ($scope, DataService) ->
  $scope.debate = DataService.debate

$.app.factory 'Backend', ($http) ->
  return {
    vote: (val) ->
      return $http.post '/vote', {val: val}
  }

$.app.directive 'opinion', (Backend) ->
  return {
    restrict: 'E'
    replace: true
    template: '
<div class="row box padded2 {{classes}}">
  <div class="padded1">
    <b class="black">{{ opinion.author }}</b>
    -
    <i class="faded">posted {{ opinion.date }}</i>
  </div>
  <div ng-bind-html="opinion.text"></div>
</div>
    ' # move to external file when on webserver
    scope:
      opinion: '=object'
      classes: '@'
    link: ($scope, element, attrs) ->
      $scope.vote = (val) ->
        Backend.vote(val)
          .then(
            (res) -> opinion.vote = res,
            (err) -> console.log 'Vote failed: ' + err
          )
          
  }
