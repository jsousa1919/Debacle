$.app.factory('Backend', ($http, $q) ->
  return {
    vote: (opinion, val) ->
# TODO $http.post('/vote', {opinion: opinion, vote: val})
      tmp = $q.defer()
      tmp.resolve(
        success: true
        score: 3
      )
      return tmp.promise
    opine: (opinion) ->
# TODO return $http.post('/opine', opinion)
      tmp = $q.defer()
      tmp.resolve(
        success: true
        date: '01/01/2014'
        text: opinion.new_text
      )
      return tmp.promise
    delete: (opinion) ->
# TODO return $http.post('/delete', opinion)
      tmp = $q.defer()
      tmp.resolve(
        success: false
        msg: 'Just an example of something not working'
      )
      return tmp.promise
    load_debate_list: () ->
# TODO add in some filtering/ordering/pagination, eventually this WILL be too much to handle in browser
      return $http.get('/api/debates')
  }
)

$.app.factory('Debate', ($resource) ->
  return $resource(
    '/api/debates/:id.json',
    {id: '@id'},
    {}
  )
)

$.app.factory('Comment', ($resource) ->
  # Comment base, which covers both opinions and their subcomments
  # opinions will have 'opinion' as 'type' and point to a 'side'
  # comments will have 'comment' as 'type' and point to 'parent' opinion/comment
  return $resource(
    '/api/comments/:type/:id.json',
    {
      id: '@id',
      type: '@type'
    },
    {
      vote: {
        method: 'POST',
        params: {
          vote: true
        }
      },
      children: {
        method: 'GET',
        params: {
          children: true # TODO sorting and such?
        }
      }
      parent: {
        method: 'GET',
        params: {
          parent: true
        }
      }
    }
  )
)
