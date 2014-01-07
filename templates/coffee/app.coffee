$.app.controller 'Main', ($scope, DataService) ->
  $scope.user = DataService.user

$.app.controller 'Headers', ($scope, DataService) ->

$.app.controller 'Debate', ($scope, DataService) ->
  $scope.debate = DataService.debate
  $scope.active_sides = DataService.active_sides
  $scope.$on 'choose', (event, side) ->
    $scope.debate.chosen = side.id

$.app.factory 'Backend', ($http) ->
  return {
    vote: (val) ->
      return $http.post '/vote', {val: val}
  }

$.app.directive 'opinion', (Backend) ->
  return {
    restrict: 'E'
    replace: true
    template: """
      <div class="row box padded2 {{classes}}">
        <div class="padded1">
          <b class="black">{{ opinion.author }}</b>
          -
          <i class="faded">posted {{ opinion.date }}</i>
        </div>
        <div ng-bind-html="opinion.text"></div>
      </div>
    """ # move to external file when on webserver
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

$.app.directive 'side', (Backend) ->
  return {
    restrict: 'E'
    replace: true
    template: """
      <div class="col-md-5">
        <div class="row box text-center clickable {{ classes }} {{ (side.id === $parent.debate.chosen) && 'selected' || '' }}" ng-click="select()">
          <h3>{{ side.name }}</h3>
        </div>
        <opinion ng-repeat="opinion in side.opinions" object="opinion" classes="{{ classes }}"></opinion>
      </div>
    """ # move to external file
    scope:
      side: '=object'
      classes: '@'
    link: ($scope, element, attrs) ->
      $scope.select = () ->
        if $scope.$parent.debate.chosen == $scope.side.id
          $scope.opine()
        else
          $scope.choose()

      $scope.opine = () ->
        # show new opinion box
        alert "Ohhhh I'm opininnnng"

      $scope.choose = () ->
        # alert that current opinions will be deleted
        alert "All your current opinions will be EXTERMINATED"
        $scope.$emit 'choose', $scope.side
        $scope.opine()
  }

