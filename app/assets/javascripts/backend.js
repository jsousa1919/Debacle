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
      }
    };
  });

}).call(this);
