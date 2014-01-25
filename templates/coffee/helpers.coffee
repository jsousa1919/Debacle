window.cssPath = (name) ->
  "/css/" + name

window.jsPath = (name) ->
  "/js/" + name

window.imgPath = (name) ->
  "/images/" + name

window.snippetPath = (name) ->
  "/snippets/" + name

window.fail = (msg) ->
  alert(msg)

$.app.filter('newlines', () ->
  return (text) ->
    return text.replace(/\n/g, '<br/>')
)

$.app.filter('nohtml', () ->
  return (text) ->
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
)

