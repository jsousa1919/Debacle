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

}).call(this);
