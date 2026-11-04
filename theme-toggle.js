(function () {
  "use strict";

  var root = document.documentElement;
  var key = "theme";
  var className = "dark-mode";
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function getSaved() {
    try { return localStorage.getItem(key); } catch (error) { return null; }
  }

  function save(theme) {
    try { localStorage.setItem(key, theme); } catch (error) {}
  }

  function initialTheme() {
    return getSaved() || (media && media.matches ? "dark" : "light");
  }

  var button = document.getElementById("theme-toggle");
  if (!button) {
    button = document.createElement("button");
    button.id = "theme-toggle";
    button.type = "button";
    button.className = "floating";
    document.body.appendChild(button);
  }

  function apply(theme) {
    var isDark = theme === "dark";
    root.classList.toggle(className, isDark);
    button.textContent = isDark ? "\u2600\uFE0F Light mode" : "\uD83C\uDF19 Dark mode";
    button.setAttribute("aria-pressed", String(isDark));

    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = isDark ? "#121212" : "#ffffff";
  }

  apply(initialTheme());

  button.addEventListener("click", function () {
    var next = root.classList.contains(className) ? "light" : "dark";
    apply(next);
    save(next);
  });

  if (media) {
    var onSystemChange = function (event) {
      if (!getSaved()) apply(event.matches ? "dark" : "light");
    };
    if (media.addEventListener) media.addEventListener("change", onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange);
  }

  window.addEventListener("storage", function (event) {
    if (event.key === key && event.newValue) apply(event.newValue);
  });

  requestAnimationFrame(function () { root.classList.add("theme-ready"); });
})();
