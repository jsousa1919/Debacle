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
    });
  });

  $.app.factory('DebateList', function($resource) {
    return $resource('/api/debates', {
      sort: 'date'
    });
  });

  $.app.factory('Opinion', function($resource) {
    return $resource('/api/opinion/:id.json', {
      id: '@id'
    }, {
      vote: {
        method: 'POST',
        params: {
          vote: true
        }
      },
      comments: {
        method: 'GET',
        params: {
          comments: true
        }
      }
    });
  });

  $.app.factory('Comment', function($resource) {
    return $resource('/api/comment/:id.json', {
      id: '@id'
    }, {});
  });

}).call(this);
