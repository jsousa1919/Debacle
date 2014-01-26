$.app.factory('Backend', ($http, $q) ->
  return {
    vote: (opinion, val) ->
# TODO $http.post '/vote', {opinion: opinion, vote: val}
      tmp = $q.defer()
      tmp.resolve(
        success: true
        score: 3
      )
      return tmp.promise
    opine: (opinion) ->
# TODO return $http.post '/opine', opinion
      tmp = $q.defer()
      tmp.resolve(
        success: true
        date: '01/01/2014'
        text: opinion.new_text
      )
      return tmp.promise
    delete: (opinion) ->
# TODO return $http.post '/delete', opinion
      tmp = $q.defer()
      tmp.resolve(
        success: false
        msg: 'Just an example of something not working'
      )
      return tmp.promise
  }
)

