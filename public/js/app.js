var app = angular.module('Debacle', []);
app.factory('DataService', function () {
  return {
    debate: {
      description: 'Some stuff about how the two differ, popular questions, etc...',
      sides: [
        {
          name: 'Python',
          opinions: [
            {
              id: 1,
              author: 'Justin',
              date: '12/29/13',
              text: 'It\'s cool and stuff'
            },
            {
              id: 2,
              author: 'Einstein',
              date: '12/29/13',
              text: 'It\'s cool and stuff'
            }
          ]
        },
        {
          name: 'Ruby',
          opinions: [
            {
              id: 3,
              author: 'Tom',
              date: '12/29/13',
              text: 'It\'s cool and stuff'
            },
            {
              id: 4,
              author: 'DaVinci',
              date: '12/29/13',
              text: 'It\'s cool and stuff'
            },
            {
              id: 5,
              author: 'Tesla',
              date: '12/29/13',
              text: 'It\'s cool and stuff'
            }
          ]
        }
      ]
    },
    user: {
      id: 1,
      first_name: 'Justin'
    }
  };
});

app.controller('Main', function ($scope, DataService) {
  $scope.user = DataService.user;
});

app.controller('Headers', function ($scope, DataService) {
});

app.controller('Debate', function ($scope, DataService) {
  $scope.debate = DataService.debate;
});
