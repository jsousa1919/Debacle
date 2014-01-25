$.app.factory('Backend', ($http, $q) ->
  return {
    vote: (opinion, val) ->
# TODO when on server return $http.post '/vote', {opinion: opinion, vote: val}
      tmp = $q.defer()
      tmp.resolve(
        success: true
        score: 3
      )
      return tmp.promise
    opine: (opinion) ->
# TODO when on server return $http.post '/opine', opinion
      tmp = $q.defer()
      tmp.resolve(
        success: true
        date: '01/01/2014'
        text: opinion.new_text
      )
      return tmp.promise
    delete: (opinion) ->
# TODO when on server return $http.post '/delete', opinion
      tmp = $q.defer()
      tmp.resolve(
        success: false
        msg: 'Just an example of something not working'
      )
      return tmp.promise
  }
)

$.app.controller('Main', ($rootScope, DataService) ->
  $rootScope.globals = DataService.globals
)

$.app.controller('Headers', ($scope, DataService) ->
)

$.app.controller('Debate', ($scope, DataService) ->
  $scope.debate = DataService.debate
  $scope.active_sides = DataService.globals.active_sides
  $scope.$on 'choose', (event, side) ->
    $scope.debate.chosen = side.id
)

$.app.directive('opinion', (Backend, $rootScope) ->
  return {
    restrict: 'E'
    replace: true
    templateUrl: 'snippets/_opinion.html'
    scope: true
    link: ($scope, element, attrs) ->
      if $scope.opinion.editing
        $(element).hide()
        $(element).slideDown('slow') # TODO try to use css animations
        $(element).find('textarea').focus()

    controller: ($scope) ->
      $scope.vote = (val) ->
        Backend.vote(opinion, val).then(
          (res) ->
            if res.success
              $scope.opinion.vote = res
            else:
              fail(res.msg)
          (err) ->
            fail('5 Hundo: ' + err)
        )

      $scope.post = () ->
        if $scope.opinion.new_text
          Backend.opine($scope.opinion).then(
            (res) ->
              if res.success
                $scope.opinion.editing = undefined
                $scope.opinion.date = res.date
                $scope.opinion.text = res.text
              else
                fail(res.msg)
            (err) ->
              fail("5 Hundo beeyatch.  We don't want your stinking opinion" + err)
          )

      $scope.edit = () ->
        $scope.opinion.new_text = $scope.opinion.text
        if $scope.opinion.author_id == $rootScope.globals.user.id
          $scope.opinion.editing = true

      $scope.cancel = () ->
        $scope.opinion.editing = undefined
        if not $scope.opinion.id
          $scope.$emit('remove', $scope.opinion)

      $scope.delete = () ->
        del = confirm('Are you sure you want to delete this opinion?')
        if del
          Backend.delete($scope.opinion).then(
            (res) ->
              if res.success
                $scope.$emit('remove', $scope.opinion)
              else
                fail(res.msg)
            (err) ->
              fail('5 Hundo.  Noooo doggy... nooooo..')
          )

  }
)
$.app.directive('side', ($rootScope, Backend, $parse) ->
  return {
    restrict: 'E'
    replace: true
    templateUrl: 'snippets/_side.html'
    scope: true
    link: ($scope, element, attrs) ->
      $scope.side = $scope.$eval(attrs.object) # may need to use $parse to modify root object
      $scope.classes = attrs.classes

      $scope.select = () ->
        if $scope.$parent.debate.chosen == $scope.side.id
          $scope.opine()
        else
          $scope.choose()

      $scope.opine = () ->
        # show new opinion box
        if (o for o in $scope.side.opinions when o.editing and not o.id).length
          return
        $scope.side.opinions.push
          id: 0
          author_id: $rootScope.globals.user.id
          author: $rootScope.globals.user.name
          editing: true
          new: $scope.new--
        $scope.digest

      $scope.choose = () ->
# TODO current opinions will be deleted
        alert("All your current opinions will be EXTERMINATED")
        $scope.$emit('choose', $scope.side)
        $scope.opine()

    controller: ($scope) ->
      $scope.new = 0
      $scope.opinion_order = ['new', '-score']

      $scope.$on('remove', (event, opinion) ->
        $scope.side.opinions.splice($scope.side.opinions.indexOf(opinion), 1)
      )
  }
)

