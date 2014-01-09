(function() {
  var OPINION_TEMPLATE, SIDE_TEMPLATE;

  SIDE_TEMPLATE = "<div class=\"col-md-5\">\n  <div class=\"row box text-center clickable {{ classes }} {{ (side.id === $parent.debate.chosen) && 'selected' || '' }}\" ng-click=\"select()\">\n    <h3>{{ side.name }}</h3>\n  </div>\n  <opinion ng-repeat=\"opinion in side.opinions | orderBy:opinion_order\" object=\"opinion\" classes=\"{{ classes }}\"></opinion>\n</div>";

  OPINION_TEMPLATE = "<div class=\"row box padded1 {{classes}}\" style=\"height: 100%\">\n  <div class=\"padded1\">\n    <b class=\"black\">{{ opinion.author }}</b>\n    -\n    <i class=\"faded\" ng-show=\"opinion.date\">posted {{ opinion.date }}</i>\n  </div>\n  <div ng-hide=\"opinion.editing\" ng-bind-html=\"opinion.text\"></div>\n  <div ng-show=\"opinion.editing\">\n    <textarea ng-model=\"opinion.text\" class=\"col-md-12\"></textarea>\n    <button ng-click=\"post()\">Post</button>\n  </div>\n</div>";

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

  $.app.factory('Backend', function($http, $q) {
    return {
      vote: function(val) {
        var tmp;
        tmp = $q.defer();
        tmp.resolve(3);
        return tmp.promise;
      },
      opine: function(opinion) {
        var tmp;
        tmp = $q.defer();
        tmp.resolve('01/01/2014');
        return tmp.promise;
      }
    };
  });

  $.app.directive('opinion', function(Backend) {
    return {
      restrict: 'E',
      replace: true,
      template: OPINION_TEMPLATE,
      scope: {
        opinion: '=object',
        classes: '@'
      },
      link: function($scope, element, attrs) {
        if ($scope.opinion.editing) {
          $(element).hide();
          $(element).slideDown('slow');
          return $(element).find('textarea').focus();
        }
      },
      controller: function($scope) {
        $scope.vote = function(val) {
          return Backend.vote(val).then(function(res) {
            return $scope.opinion.vote = res;
          }, function(err) {
            return console.log('Vote failed: ' + err);
          });
        };
        return $scope.post = function(val) {
          return Backend.opine($scope.opinion).then(function(res) {
            $scope.opinion.editing = void 0;
            return $scope.opinion.date = res;
          }, function(err) {
            return console.log("We don't want your stinking opinion crybaby" + err);
          });
        };
      }
    };
  });

  $.app.directive('side', function($rootScope, Backend) {
    return {
      restrict: 'E',
      replace: true,
      template: SIDE_TEMPLATE,
      scope: {
        side: '=object',
        classes: '@'
      },
      link: function($scope, element, attrs) {
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
              if (o.editing) {
                _results.push(o);
              }
            }
            return _results;
          })()).length) {
            return;
          }
          $scope.side.opinions.push({
            id: 0,
            author: $rootScope.globals.user.name,
            editing: true
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
        return $scope.opinion_order = ['editing', '-score'];
      }
    };
  });

}).call(this);
