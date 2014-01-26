$.app.controller('HeadersController', ($scope, DataService) ->
  $scope.globals = DataService.globals
)

$.app.controller('ListController', ($scope, DataService, Backend) ->
  $scope.globals = DataService.globals
  $scope.debates = DataService.debates
)

$.app.controller('DebateController', ($scope, DataService, Backend, $routeParams) ->
  # TODO something, something, load the debate from the backend if necessary
  $scope.globals = DataService.globals
  $scope.debate = DataService.debates[$routeParams.id || $scope.globals.active_debate]

  $scope.active_sides = $scope.globals.active_sides
  $scope.$on 'choose', (event, side) ->
    $scope.debate.chosen = side.id
)

$.app.directive('debate', (DataService, Backend) ->
  return {
    restrict: 'E'
    replace: true
    templateUrl: 'snippets/_debate.html'
    scope: true
    link: ($scope, element, attrs) ->
      $scope.debate = $scope.$eval(attrs.object)
  }
)

$.app.directive('opinion', (DataService, Backend) ->
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
        if $scope.opinion.author_id == $DataService.globals.user.id
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
$.app.directive('side', (DataService, Backend, $parse) ->
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
          author_id: DataService.globals.user.id
          author: DataService.globals.user.name
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

