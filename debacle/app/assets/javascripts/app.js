(function() {
  $.app = angular.module("Debacle", ["ngSanitize"]);

  var OPINION_TEMPLATE, SIDE_TEMPLATE;

  SIDE_TEMPLATE = "<div class=\"col-md-5\">\n  <div class=\"row box text-center clickable {{ classes }} {{ (side.id === $parent.debate.chosen) && 'selected' || '' }}\" ng-click=\"select()\">\n    <h3>{{ side.name }}</h3>\n  </div>\n  <opinion ng-repeat=\"opinion in side.opinions | orderBy:opinion_order\"></opinion>\n</div>";

  OPINION_TEMPLATE = "<div class=\"row box padded1 {{classes}}\" style=\"height: 100%\">\n  <div class=\"clickable pull-right\" ng-show=\"opinion.author_id == $root.globals.user.id\" ng-click=\"delete()\">X</div>\n  <div class=\"padded1\">\n    <b class=\"black\">{{ opinion.author }}</b>\n    -\n    <i class=\"faded\" ng-show=\"opinion.date\">posted {{ opinion.date }}</i>\n    <a class=\"pull-right\" ng-show=\"opinion.author_id == $root.globals.user.id && !opinion.editing\" ng-click=\"edit()\">Edit</a>\n  </div>\n  <div ng-hide=\"opinion.editing\" ng-bind-html=\"opinion.text | nohtml | newlines\" style=\"word-wrap: break-word;\"></div>\n  <div ng-show=\"opinion.editing\">\n    <textarea ng-model=\"opinion.new_text\" class=\"col-md-12\"></textarea>\n    <button ng-click=\"cancel()\">Cancel</button>\n    <button ng-click=\"post()\" class=\"pull-right\">Post</button>\n  </div>\n</div>";

  $.app.filter('newlines', function() {
    return function(text) {
      return text.replace(/\n/g, '<br/>');
    };
  });

  $.app.filter('nohtml', function() {
    return function(text) {
      return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
  });

  $.app.factory('Backend', function($http, $q) {
    return {
      vote: function(opinion, val) {
        var tmp;
        tmp = $q.defer();
        tmp.resolve({
          success: true,
          score: 3
        });
        return tmp.promise;
      },
      opine: function(opinion) {
        var tmp;
        tmp = $q.defer();
        tmp.resolve({
          success: true,
          date: '01/01/2014',
          text: opinion.new_text
        });
        return tmp.promise;
      },
      "delete": function(opinion) {
        var tmp;
        tmp = $q.defer();
        tmp.resolve({
          success: false,
          msg: 'Just an example of something not working'
        });
        return tmp.promise;
      }
    };
  });

  $.app.controller('Main', function($rootScope, DataService) {
    return $rootScope.globals = DataService.globals;
  });

  $.app.controller('Headers', function($scope, DataService) {});

  $.app.controller('Debate', function($scope, DataService) {
    $scope.debate = DataService.debate;
    $scope.active_sides = DataService.globals.active_sides;
    return $scope.$on('choose', function(event, side) {
      return $scope.debate.chosen = side.id;
    });
  });

  $.app.directive('opinion', function(Backend, $rootScope) {
    return {
      restrict: 'E',
      replace: true,
      template: OPINION_TEMPLATE,
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
          if ($scope.opinion.author_id === $rootScope.globals.user.id) {
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

  $.app.directive('side', function($rootScope, Backend, $parse) {
    return {
      restrict: 'E',
      replace: true,
      template: SIDE_TEMPLATE,
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
            author_id: $rootScope.globals.user.id,
            author: $rootScope.globals.user.name,
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
