$.app.controller('HeadersController', ($scope, DataService, Session) ->
  $scope.globals = DataService.globals

  $scope.loggedIn = false
  $scope.email = null
  $scope.name = null

  $scope.logout = () ->
    Session.logout()
    $scope.debates = []

  $scope.$watch(Session.isAuthenticated, (isLoggedIn) ->
    $scope.loggedIn = isLoggedIn
    if (Session.currentUser)
      $scope.email = Session.currentUser.email
      $scope.name = Session.currentUser.name
      if (Session.auth)
        $scope.url = Session.auth.url
  )
)

$.app.controller('ListController', ($scope, DataService, Backend, DebateList, Session) ->
  $scope.globals = DataService.globals

  #TODO turn this into a function that can send searches/filters
  debates = DebateList.get({}, () ->
    $scope.debates = debates.debates
  )
)

$.app.controller('CreateController', ($scope, $location, Debate, DataService)->
  $scope.globals = DataService.globals
  $scope.debates = DataService.debates

  $scope.debate = new Debate({
    debate:
      title: '',
      description: ''
      sides_attributes: [{}, {}]
  })

  $scope.share = (debate) ->
    $scope.debate.recipient = ''
    debate.$save((msg, headers) ->
      debate.id = 5
      # TODO debate should be updated with id here
      $scope.debates[debate.id] = $scope.debate
      $location.path("/debate/" + debate.id)
    )
)


$.app.controller('DebateController', ($scope, DataService, Backend, $routeParams) ->
  # TODO something, something, load the debate from the backend if necessary
  $scope.globals = DataService.globals
  $scope.debate = DataService.debates[$routeParams.id || $scope.globals.active_debate]
)

$.app.directive('debate', () ->
  return {
    restrict: 'E'
    replace: true
    templateUrl: 'snippets/_debate.html'
    scope: true
    controller: ($scope) ->
      $scope.$on 'choose', (event, side) ->
        $scope.debate.chosen = side.id
  }
)

$.app.directive('debateListing', (DataService, Backend) ->
  return {
    restrict: 'E'
    replace: true
    templateUrl: 'snippets/_debate_listing.html'
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
        $(element).slideDown('slow') # TODO try to use css animations, separate DOM manipulation
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

#TODO replace with $resource
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

$.app.config(['$httpProvider', ($httpProvider) ->
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')

  interceptor = ['$location', '$rootScope', '$q', ($location, $rootScope, $q) ->
    success = (response) ->
      return response

    error = (response) ->
      if (response.status == 401)
        $rootScope.$broadcast('event:unauthorized')
        return response

      $q.reject(response)

    return (promise) ->
      return promise.then(success, error)
  ]

  $httpProvider.responseInterceptors.push(interceptor)
])

$.app.factory('Session', ($location, $http, $q) ->
  # Redirect to the given url (defaults to '/')
  redirect = (url) ->
    url = url || '/'
    $location.path(url)

  service =
    login: (email, password) ->
      # just use devise. have it convert to json
      return $http.post('/users/sign_in.json', {user: {email: email, password: password} })
        .then((response) ->
          service.currentUser = response.data
          service.auth = null
          if (service.isAuthenticated())
            $location.path('/')
        )

    logout: () ->
      # just use devise. have it convert to json
      $http.delete('/users/sign_out.json').then((response) ->
        service.currentUser = null
        this.currentUser = null
        $location.path('/')
      )

    register: (email, password, confirm_password) ->
      return $http.post('/users.json', {user: {email: email, password: password, password_confirmation: confirm_password} })
        .then((response) ->
          service.currentUser = response.data
          if (service.isAuthenticated())
            $location.path('/')
        )

    requestCurrentUser: () ->
      if (service.isAuthenticated())
        return $q.when(service.currentUser)
      else
        return $http.get('/current_user').then((response) ->
          service.currentUser = response.data.user
          service.auth = response.data.auth
          return service.currentUser
        )

    currentUser: null,

    isAuthenticated: () ->
      return !!service.currentUser

  return service
)

$.app.controller('LoginController', ($scope, Session) ->
  
  $scope.login = (user) ->
    $scope.authError = null

    Session.login(user.email, user.password)
      .then(
        (response) ->
          if (!response)
            $scope.authError = 'Credentials are not valid'
          else
            $scope.authError = 'Success!'
        ,
        (response) ->
          $scope.authError = 'Server offline, please try later'
      )

  $scope.logout = (user) ->
    Session.logout()

  $scope.register = (user) ->
    $scope.authError = null

    Session.register(user.email, user.password, user.confirm_password)
      .then(
        (response) ->
          null
        ,
        (response) ->
          errors = ''
          $.each(response.data.errors, (index, value) ->
            errors += index.substr(0,1).toUpperCase()+index.substr(1) + ' ' + value + ''
          )
          $scope.authError = errors
      )
)
