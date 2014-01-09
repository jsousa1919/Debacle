SIDE_TEMPLATE = """
  <div class="col-md-5">
    <div class="row box text-center clickable {{ classes }} {{ (side.id === $parent.debate.chosen) && 'selected' || '' }}" ng-click="select()">
      <h3>{{ side.name }}</h3>
    </div>
    <opinion ng-repeat="opinion in side.opinions | orderBy:opinion_order" object="opinion" classes="{{ classes }}"></opinion>
  </div>
""" # move to external file

OPINION_TEMPLATE = """
  <div class="row box padded1 {{classes}}" style="height: 100%">
    <div class="padded1">
      <b class="black">{{ opinion.author }}</b>
      -
      <i class="faded" ng-show="opinion.date">posted {{ opinion.date }}</i>
    </div>
    <div ng-hide="opinion.editing" ng-bind-html="opinion.text"></div>
    <div ng-show="opinion.editing">
      <textarea ng-model="opinion.text" class="col-md-12"></textarea>
      <button ng-click="post()">Post</button>
    </div>
  </div>
""" # move to external file when on webserver





$.app.controller 'Main', ($rootScope, DataService) ->
  $rootScope.globals = DataService.globals

$.app.controller 'Headers', ($scope, DataService) ->

$.app.controller 'Debate', ($scope, DataService) ->
  $scope.debate = DataService.debate
  $scope.active_sides = DataService.globals.active_sides
  $scope.$on 'choose', (event, side) ->
    $scope.debate.chosen = side.id

$.app.factory 'Backend', ($http, $q) ->
  return {
    vote: (val) ->
# TODO when on server return $http.post '/vote', {val: val}
      tmp = $q.defer()
      tmp.resolve(3)
      return tmp.promise
    opine: (opinion) ->
# TODO when on server return $http.post '/opine', {id: opinion.id, text: opinion.text}
      tmp = $q.defer()
      tmp.resolve('01/01/2014')
      return tmp.promise
  }

$.app.directive 'opinion', (Backend) ->
  return {
    restrict: 'E'
    replace: true
    template: OPINION_TEMPLATE
    scope:
      opinion: '=object'
      classes: '@'
    link: ($scope, element, attrs) ->
      if $scope.opinion.editing
        $(element).hide()
        $(element).slideDown 'slow'
        $(element).find('textarea').focus()

    controller: ($scope) ->
      $scope.vote = (val) ->
        Backend.vote(val).then(
          (res) ->
            $scope.opinion.vote = res
          (err) ->
            console.log 'Vote failed: ' + err
        )

      $scope.post = (val) ->
# TODO some validation
        Backend.opine($scope.opinion).then(
          (res) ->
            $scope.opinion.editing = undefined
            $scope.opinion.date = res
# TODO convert newlines
          (err) ->
            console.log "We don't want your stinking opinion crybaby" + err
        )
  }

$.app.directive 'side', ($rootScope, Backend) ->
  return {
    restrict: 'E'
    replace: true
    template: SIDE_TEMPLATE
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
        if (o for o in $scope.side.opinions when o.editing).length
          return
        $scope.side.opinions.push
          id: 0
          author: $rootScope.globals.user.name
          editing: true
          new: $scope.new--
        $scope.digest

      $scope.choose = () ->
# TODO current opinions will be deleted
        alert "All your current opinions will be EXTERMINATED"
        $scope.$emit 'choose', $scope.side
        $scope.opine()

    controller: ($scope) ->
      $scope.new = 1000
      $scope.opinion_order = ['-new', 'editing', '-score']
  }


