(function() {
  $.app.controller('HeadersController', function($scope, DataService) {
    return $scope.globals = DataService.globals;
  });

  $.app.controller('ListController', function($scope, DataService, Backend) {
    $scope.globals = DataService.globals;
    DataService.debate_func()
      .then(function(data){
        console.log(data.data.debates);
        $scope.debates = data.data.debates;
      });
    //return $scope.debates = DataService.debates;
  });

  $.app.controller('DebateController', function($scope, DataService, Backend, $routeParams) {
    $scope.globals = DataService.globals;
    $scope.debate = DataService.debates[$routeParams.id || $scope.globals.active_debate];
    $scope.active_sides = $scope.globals.active_sides;
    return $scope.$on('choose', function(event, side) {
      return $scope.debate.chosen = side.id;
    });
  });

  $.app.controller('DebateCreator', function($scope, $location, Debate){
    $scope.newDebate = {title: '', description: ''};
    $scope.share = function(debate) {
      var new_debate = new Debate({
        title: debate.title,
        description: debate.description
      });
      new_debate.$save();
      $location.path("/");
      $scope.newDebate.recipient = '';
    }
  });

  $.app.factory('Debate', function($resource){
    var Debate = $resource('/api/debates/:id.json',
      {id: '@id'},
      {}
    );
    return Debate;
  });

  $.app.directive('debate', function(DataService, Backend) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'snippets/_debate.html',
      scope: true,
      link: function($scope, element, attrs) {
        return $scope.debate = $scope.$eval(attrs.object);
      }
    };
  });

  $.app.directive('opinion', function(DataService, Backend) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'snippets/_opinion.html',
      scope: true,
      link: function($scope, element, attrs) {
        if ($scope.opinion.editing) {
          $(element).hide();
          $(element).slideDown('slow');
          return $(element).find('textarea').focus();
        }
      },
      controller: function($scope) {
        $scope.vote = function(val) {
          return Backend.vote(opinion, val).then(function(res) {
            if (res.success) {
              $scope.opinion.vote = res;
            }
            return {
              "else": fail(res.msg)
            };
          }, function(err) {
            return fail('5 Hundo: ' + err);
          });
        };
        $scope.post = function() {
          if ($scope.opinion.new_text) {
            return Backend.opine($scope.opinion).then(function(res) {
              if (res.success) {
                $scope.opinion.editing = void 0;
                $scope.opinion.date = res.date;
                return $scope.opinion.text = res.text;
              } else {
                return fail(res.msg);
              }
            }, function(err) {
              return fail("5 Hundo beeyatch.  We don't want your stinking opinion" + err);
            });
          }
        };
        $scope.edit = function() {
          $scope.opinion.new_text = $scope.opinion.text;
          if ($scope.opinion.author_id === $DataService.globals.user.id) {
            return $scope.opinion.editing = true;
          }
        };
        $scope.cancel = function() {
          $scope.opinion.editing = void 0;
          if (!$scope.opinion.id) {
            return $scope.$emit('remove', $scope.opinion);
          }
        };
        return $scope["delete"] = function() {
          var del;
          del = confirm('Are you sure you want to delete this opinion?');
          if (del) {
            return Backend["delete"]($scope.opinion).then(function(res) {
              if (res.success) {
                return $scope.$emit('remove', $scope.opinion);
              } else {
                return fail(res.msg);
              }
            }, function(err) {
              return fail('5 Hundo.  Noooo doggy... nooooo..');
            });
          }
        };
      }
    };
  });

  $.app.directive('side', function(DataService, Backend, $parse) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'snippets/_side.html',
      scope: true,
      link: function($scope, element, attrs) {
        $scope.side = $scope.$eval(attrs.object);
        $scope.classes = attrs.classes;
        $scope.select = function() {
          if ($scope.$parent.debate.chosen === $scope.side.id) {
            return $scope.opine();
          } else {
            return $scope.choose();
          }
        };
        $scope.opine = function() {
          var o;
          if (((function() {
            var _i, _len, _ref, _results;
            _ref = $scope.side.opinions;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              o = _ref[_i];
              if (o.editing && !o.id) {
                _results.push(o);
              }
            }
            return _results;
          })()).length) {
            return;
          }
          $scope.side.opinions.push({
            id: 0,
            author_id: DataService.globals.user.id,
            author: DataService.globals.user.name,
            editing: true,
            "new": $scope["new"]--
          });
          return $scope.digest;
        };
        return $scope.choose = function() {
          alert("All your current opinions will be EXTERMINATED");
          $scope.$emit('choose', $scope.side);
          return $scope.opine();
        };
      },
      controller: function($scope) {
        $scope["new"] = 0;
        $scope.opinion_order = ['new', '-score'];
        return $scope.$on('remove', function(event, opinion) {
          return $scope.side.opinions.splice($scope.side.opinions.indexOf(opinion), 1);
        });
      }
    };
  });

  /*
   * LOGIN STUFF
   *
   */

  $.app.config(['$httpProvider', function($httpProvider){
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');

    var interceptor = ['$location', '$rootScope', '$q', function($location, $rootScope, $q) {
      function success(response) {
        return response
      };

      function error(response) {
        if (response.status == 401) {
          $rootScope.$broadcast('event:unauthorized');
          $location.path('/users/login');
          return response;
        };
        return $q.reject(response);
      };

      return function(promise) {
        return promise.then(success, error);
      };
    }];

    $httpProvider.responseInterceptors.push(interceptor);
  }]);

        $.app.factory('Session', function($location, $http, $q) {
          // Redirect to the given url (defaults to '/')
          function redirect(url) {
            url = url || '/';
            $location.path(url);
          }
          var service = {
            login: function(email, password) {
              return $http.post('/login.json', {user: {email: email, password: password} })
                .then(function(response) {
                  service.currentUser = response.data.user;
                  if (service.isAuthenticated()) {
                    $location.path('/');
                  }
                });
              },

            logout: function(redirectTo) {
              $http.post('/logout.json').then(function() {
                service.currentUser = null;
                redirect('/');
              });
            },

            register: function(email, password, confirm_password) {
              return $http.post('/users.json', {user: {email: email, password: password, password_confirmation: confirm_password} })
                .then(function(response) {
                  service.currentUser = response.data;
                  if (service.isAuthenticated()) {
                    $location.path('/');
                }
              });
            },
            requestCurrentUser: function() {
              if (service.isAuthenticated()) {
                return $q.when(service.currentUser);
              } else {
                return $http.get('/current_user').then(function(response) {
                  service.currentUser = response.data.user;
                  return service.currentUser;
              });
            }
          },

          currentUser: null,

          isAuthenticated: function(){
            return !!service.currentUser;
          }
        };
        return service;
      });

  $.app.controller('LoginController', function($scope, Session){
    $scope.login = function(user) {
      $scope.authError = null;

      Session.login(user.email, user.password)
        .then(function(response) {
          if (!response) {
            $scope.authError = 'Credentials are not valid';
          } else {
            $scope.authError = 'Success!';
          }
        }, function(response) {
          $scope.authError = 'Server offline, please try later';
        });
      };

    $scope.logout = function(user) {

      };

    $scope.register = function(user) {
      $scope.authError = null;

      Session.register(user.email, user.password, user.confirm_password)
        .then(function(response) {
        }, function(response) {
          var errors = '';
          $.each(response.data.errors, function(index, value) {
            errors += index.substr(0,1).toUpperCase()+index.substr(1) + ' ' + value + ''
          });
          $scope.authError = errors;
        });
      };
    });

}).call(this);
