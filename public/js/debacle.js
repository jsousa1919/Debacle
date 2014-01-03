(function() {
  var app;

  window.app = app = angular.module("Debacle", ["ngSanitize"]);

  app.factory("DataService", function() {
    return {
      debate: {
        description: "Some stuff about how the two \      differ, popular questions, etc...",
        sides: [
          {
            name: "Python",
            opinions: [
              {
                id: 1,
                author: "Justin",
                date: "12/29/13",
                text: "It's cool and stuff<br/>I'm really cool<br/>because I'm longer"
              }, {
                id: 2,
                author: "Einstein",
                date: "12/29/13",
                text: "It's cool and stuff"
              }
            ]
          }, {
            name: "Ruby",
            opinions: [
              {
                id: 3,
                author: "Tom",
                date: "12/29/13",
                text: "It's cool and stuff"
              }, {
                id: 4,
                author: "DaVinci",
                date: "12/29/13",
                text: "It's cool and stuff"
              }, {
                id: 5,
                author: "Tesla",
                date: "12/29/13",
                text: "It's cool and stuff"
              }
            ]
          }
        ]
      },
      user: {
        id: 1,
        first_name: "Justin"
      }
    };
  });

}).call(this);
