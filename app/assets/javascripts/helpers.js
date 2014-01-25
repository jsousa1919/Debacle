(function() {
  window.cssPath = function(name) {
    return "/css/" + name;
  };

  window.jsPath = function(name) {
    return "/js/" + name;
  };

  window.imgPath = function(name) {
    return "/images/" + name;
  };

  window.snippetPath = function(name) {
    return "/snippets/" + name;
  };

  window.fail = function(msg) {
    return alert(msg);
  };

  $.app.filter('newlines', function() {
    return function(text) {
      return text.replace(/\n/g, '<br/>');
    };
  });

  $.app.filter('nohtml', function() {
    return function(text) {
      return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
  });

}).call(this);
