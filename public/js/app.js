(function() {

  $.app.controller('Main', function($scope, DataService) {
    return $scope.user = DataService.user;
  });

  $.app.controller('Headers', function($scope, DataService) {});

  $.app.controller('Debate', function($scope, DataService) {
    $scope.debate = DataService.debate;
    $scope.active_sides = DataService.active_sides;
    return $scope.$on('choose', function(event, side) {
      return $scope.debate.chosen = side.id;
    });
  });

  $.app.factory('Backend', function($http) {
    return {
      vote: function(val) {
        return $http.post('/vote', {
          val: val
        });
      }
    };
  });

  $.app.directive('opinion', function(Backend) {
    return {
      restrict: 'E',
      replace: true,
      template: "<div class=\"row box padded2 {{classes}}\">\n  <div class=\"padded1\">\n    <b class=\"black\">{{ opinion.author }}</b>\n    -\n    <i class=\"faded\">posted {{ opinion.date }}</i>\n  </div>\n  <div ng-bind-html=\"opinion.text\"></div>\n</div>",
      scope: {
        opinion: '=object',
        classes: '@'
      },
      link: function($scope, element, attrs) {
        return $scope.vote = function(val) {
          return Backend.vote(val).then(function(res) {
            return opinion.vote = res;
          }, function(err) {
            return console.log('Vote failed: ' + err);
          });
        };
      }
    };
  });

  $.app.directive('side', function(Backend) {
    return {
      restrict: 'E',
      replace: true,
      template: "<div class=\"col-md-5\">\n  <div class=\"row box text-center clickable {{ classes }} {{ (side.id === $parent.debate.chosen) && 'selected' || '' }}\" ng-click=\"select()\">\n    <h3>{{ side.name }}</h3>\n  </div>\n  <opinion ng-repeat=\"opinion in side.opinions\" object=\"opinion\" classes=\"{{ classes }}\"></opinion>\n</div>",
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
          return alert("Ohhhh I'm opininnnng");
        };
        return $scope.choose = function() {
          alert("All your current opinions will be EXTERMINATED");
          $scope.$emit('choose', $scope.side);
          return $scope.opine();
        };
      }
    };
  });

}).call(this);
