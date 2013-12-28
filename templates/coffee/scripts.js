(function () {
  var Debacle = angular.module('Debacle', []);
  Debacle.controller('Headers', function ($scope, $rootScope) {
    // TODO variable declarations from backend
    $rootScope.user = {
      email: 'jsousa1919@gmail.com',
      username: '0PointE',
      first_name: 'Justin'
    };
  });
})();
