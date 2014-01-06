(function() {

  $.app.controller('Main', function($scope, DataService) {
    return $scope.user = DataService.user;
  });

  $.app.controller('Headers', function($scope, DataService) {});

  $.app.controller('Debate', function($scope, DataService) {
    return $scope.debate = DataService.debate;
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
      template: '\
<div class="row box padded2 {{classes}}">\
  <div class="padded1">\
    <b class="black">{{ opinion.author }}</b>\
    -\
    <i class="faded">posted {{ opinion.date }}</i>\
  </div>\
  <div ng-bind-html="opinion.text"></div>\
</div>\
    ',
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

}).call(this);
