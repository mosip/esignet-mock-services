(function () {
  var script = document.createElement("script");
  script.src = window._env_.SIGN_IN_BUTTON_PLUGIN_URL;
  document.head.replaceChild(script, document.getElementById("sign-in-plugin-placeholder"));
})();