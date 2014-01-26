(function() {
  $.app.controller('HeadersController', function($scope, DataService) {
    return $scope.globals = DataService.globals;
  });

  $.app.controller('ListController', function($scope, DataService, Backend) {
    $scope.globals = DataService.globals;
    return $scope.debates = DataService.debates;
  });

  $.app.controller('DebateController', function($scope, DataService, Backend, $routeParams) {
    $scope.globals = DataService.globals;
    $scope.debate = DataService.debates[$routeParams.id || $scope.globals.active_debate];
    $scope.active_sides = $scope.globals.active_sides;
    return $scope.$on('choose', function(event, side) {
      return $scope.debate.chosen = side.id;
    });
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

}).call(this);
