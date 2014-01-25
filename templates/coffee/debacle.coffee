$.app = angular.module("Debacle", ["ngSanitize"])
$.app.factory "DataService", ->
  globals:
    active_sides: [5, 6]
    user:
      id: 1
      name: "Justin"
    date: "01/01/2015"

  list:
    debates:
      1:
        id: 1
        description: "Some stuff about how the two \
          differ, popular questions, etc..."
        chosen: 5
        sides: {
          5:
            id: 5
            name: "Python"
            supporters: 103
          6:
            id: 6
            name: "Ruby"
            supporters: 124
        }
      3:
        id: 3
        description: "Lalalala who wears the coolest hat?"
        sides: {
          23:
            id: 23
            name: "John Wayne"
            supporters: 5
          107:
            id: 107
            name: "Matt Smith"
            supporters: 323
        }

# Common structure between list and debates data is by design
# less data to be loaded when going from list to debate page

  debate:
    description: "Some stuff about how the two \
      differ, popular questions, etc..."
    chosen: 5
    sides: {
      5:
        id: 5
        name: "Python"
        opinions: [
            id: 1
            author_id: 1
            author: "Justin"
            date: "12/29/13"
            score: 3
            text: "It's cool and stuff\nI'm really cool\nbecause I'm longer"
          ,
            id: 2
            author_id: 3
            author: "Einstein"
            date: "12/29/13"
            score: 9
            text: "It's cool and stuff"
        ]
      ,
      6:
        id: 6
        name: "Ruby"
        opinions: [
            id: 3
            author_id: 2
            author: "Tom"
            date: "12/29/13"
            score: 1
            text: "It's cool and stuff"
          ,
            id: 4
            author_id: 4
            author: "DaVinci"
            date: "12/29/13"
            score: 1
            text: "It's cool and stuff"
          ,
            id: 5
            author_id: 5
            author: "Tesla"
            date: "12/29/13"
            score: 6
            text: "It's cool and stuff"
        ]
    }

