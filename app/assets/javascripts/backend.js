(function() {
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
      },
      load_debate_list: function() {
        return $http.get('/api/debates');
      }
    };
  });

  $.app.factory('Debate', function($resource) {
    return $resource('/api/debates/:id.json', {
      id: '@id'
    }, {});
  });

  $.app.factory('Side', function($resource) {
    return $resource('/api/debates/:debate_id/sides/:id.json', {
      id: '@id',
      debate_id: '@debate_id'
    }, {});
  });

  $.app.factory('Comment', function($resource) {
    return $resource('/api/comments/:type/:id.json', {
      id: '@id',
      type: '@type'
    }, {
      vote: {
        method: 'POST',
        params: {
          vote: true
        }
      },
      children: {
        method: 'GET',
        params: {
          children: true
        }
      },
      parent: {
        method: 'GET',
        params: {
          parent: true
        }
      }
    });
  });

  $.app.factory("DataService", function() {
    return {
      globals: {
        active_debate: 1,
        user: {
          id: 1,
          name: "Justin"
        },
        date: "01/01/2015"
      },
      debates: {
        1: {
          id: 1,
          description: "Some stuff about how the two \        differ, popular questions, etc...",
          chosen: 0,
          sides: [
            {
              id: 5,
              name: "Python",
              supporters: 103,
              opinions: [
                {
                  id: 1,
                  author_id: 1,
                  author: "Justin",
                  date: "12/29/13",
                  score: 3,
                  text: "It's cool and stuff\nI'm really cool\nbecause I'm longer"
                }, {
                  id: 2,
                  author_id: 3,
                  author: "Einstein",
                  date: "12/29/13",
                  score: 9,
                  text: "It's cool and stuff"
                }
              ]
            },
            {
              id: 6,
              name: "Ruby",
              supporters: 124,
              opinions: [
                {
                  id: 3,
                  author_id: 2,
                  author: "Tom",
                  date: "12/29/13",
                  score: 1,
                  text: "It's cool and stuff"
                }, {
                  id: 4,
                  author_id: 4,
                  author: "DaVinci",
                  date: "12/29/13",
                  score: 1,
                  text: "It's cool and stuff"
                }, {
                  id: 5,
                  author_id: 5,
                  author: "Tesla",
                  date: "12/29/13",
                  score: 6,
                  text: "It's cool and stuff"
                }
              ]
            }
          ]
        },
        3: {
          id: 3,
          description: "Lalalala who wears the coolest hat?",
          sides: [
            {
              id: 23,
              name: "John Wayne",
              supporters: 5
            },
            {
              id: 107,
              name: "Matt Smith",
              supporters: 323
            }
          ]
        }
      }
    };
  });

}).call(this);
