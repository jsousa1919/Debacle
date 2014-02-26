(function() {
  $.app.controller('HeadersController', function($scope, DataService, Session) {
    $scope.globals = DataService.globals;
    $scope.loggedIn = false;
    $scope.email = null;
    $scope.name = null;
    $scope.logout = function() {
      Session.logout();
      return $scope.debates = [];
    };
    return $scope.$watch(Session.isAuthenticated, function(isLoggedIn) {
      $scope.loggedIn = isLoggedIn;
      if (Session.currentUser) {
        $scope.email = Session.currentUser.email;
        $scope.name = Session.currentUser.name;
        if (Session.auth) {
          return $scope.url = Session.auth.url;
        }
      }
    });
  });

  $.app.controller('ListController', function($scope, DataService, Backend, DebateList, Session) {
    var debates;
    $scope.globals = DataService.globals;
    return debates = DebateList.get({}, function() {
      return $scope.debates = debates.debates;
    });
  });

  $.app.controller('CreateController', function($scope, $location, Debate, DataService) {
    $scope.globals = DataService.globals;
    $scope.debates = DataService.debates;
    $scope.debate = {
      title: '',
      description: '',
      sides_attributes: [{}, {}]
    };
    $scope.debate_resource = new Debate({
      debate: $scope.debate
    });
    return $scope.share = function(debate) {
      $scope.debate.recipient = '';
      return $scope.debate_resource.$save(function(msg, headers) {
        debate.id = 5;
        $scope.debates[debate.id] = $scope.debate;
        return $location.path("/debate/" + debate.id);
      });
    };
  });

  $.app.controller('DebateController', function($scope, DataService, Backend, $routeParams) {
    $scope.globals = DataService.globals;
    return $scope.debate = DataService.debates[$routeParams.id || $scope.globals.active_debate];
  });

  $.app.directive('debate', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'snippets/_debate.html',
      scope: true,
      controller: function($scope) {
        return $scope.$on('choose', function(event, side) {
          return $scope.debate.chosen = side.id;
        });
      }
    };
  });

  $.app.directive('debateListing', function(DataService, Backend) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'snippets/_debate_listing.html',
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

  $.app.config([
    '$httpProvider', function($httpProvider) {
      var interceptor;
      $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
      interceptor = [
        '$location', '$rootScope', '$q', function($location, $rootScope, $q) {
          var error, success;
          success = function(response) {
            return response;
          };
          error = function(response) {
            if (response.status === 401) {
              $rootScope.$broadcast('event:unauthorized');
              return response;
            }
            return $q.reject(response);
          };
          return function(promise) {
            return promise.then(success, error);
          };
        }
      ];
      return $httpProvider.responseInterceptors.push(interceptor);
    }
  ]);

  $.app.factory('Session', function($location, $http, $q) {
    var redirect, service;
    redirect = function(url) {
      url = url || '/';
      return $location.path(url);
    };
    service = {
      login: function(email, password) {
        return $http.post('/users/sign_in.json', {
          user: {
            email: email,
            password: password
          }
        }).then(function(response) {
          service.currentUser = response.data;
          service.auth = null;
          if (service.isAuthenticated()) {
            return $location.path('/');
          }
        });
      },
      logout: function() {
        return $http["delete"]('/users/sign_out.json').then(function(response) {
          service.currentUser = null;
          this.currentUser = null;
          return $location.path('/');
        });
      },
      register: function(email, password, confirm_password) {
        return $http.post('/users.json', {
          user: {
            email: email,
            password: password,
            password_confirmation: confirm_password
          }
        }).then(function(response) {
          service.currentUser = response.data;
          if (service.isAuthenticated()) {
            return $location.path('/');
          }
        });
      },
      requestCurrentUser: function() {
        if (service.isAuthenticated()) {
          return $q.when(service.currentUser);
        } else {
          return $http.get('/current_user').then(function(response) {
            service.currentUser = response.data.user;
            service.auth = response.data.auth;
            return service.currentUser;
          });
        }
      },
      currentUser: null,
      isAuthenticated: function() {
        return !!service.currentUser;
      }
    };
    return service;
  });

  $.app.controller('LoginController', function($scope, Session) {
    $scope.login = function(user) {
      $scope.authError = null;
      return Session.login(user.email, user.password).then(function(response) {
        if (!response) {
          return $scope.authError = 'Credentials are not valid';
        } else {
          return $scope.authError = 'Success!';
        }
      }, function(response) {
        return $scope.authError = 'Server offline, please try later';
      });
    };
    $scope.logout = function(user) {
      return Session.logout();
    };
    return $scope.register = function(user) {
      $scope.authError = null;
      return Session.register(user.email, user.password, user.confirm_password).then(function(response) {
        return null;
      }, function(response) {
        var errors;
        errors = '';
        $.each(response.data.errors, function(index, value) {
          return errors += index.substr(0, 1).toUpperCase() + index.substr(1) + ' ' + value + '';
        });
        return $scope.authError = errors;
      });
    };
  });

}).call(this);
