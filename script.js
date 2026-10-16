// One-screen navigation: show one section at a time, switch with the menu,
// the arrow buttons, or the keyboard (← / →). Without JS every section stacks.
(function () {
  "use strict";
  var root = document.documentElement;
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));
  if (!tabs.length || !panels.length) return;

  root.classList.add("js");
  var ids = panels.map(function (p) { return p.id; });
  var stepper = document.querySelector(".stepper");
  var prev = stepper && stepper.querySelector('[data-step="-1"]');
  var next = stepper && stepper.querySelector('[data-step="1"]');
  var now = document.getElementById("step-now");
  if (stepper) stepper.hidden = false;

  function show(id, opts) {
    opts = opts || {};
    var i = ids.indexOf(id);
    if (i < 0) { i = 0; id = ids[0]; }
    panels.forEach(function (p) {
      var on = p.id === id;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
    tabs.forEach(function (t) {
      var on = t.getAttribute("aria-controls") === id;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === ids.length - 1;
    if (now) now.textContent = ("0" + i).slice(-2);
    if (opts.push !== false && location.hash !== "#" + id) {
      history.replaceState(null, "", "#" + id);
    }
    if (opts.focus) panels[i].focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function current() { return ids.indexOf((document.querySelector(".panel.is-active") || panels[0]).id); }
  function go(delta) {
    var i = Math.max(0, Math.min(ids.length - 1, current() + delta));
    show(ids[i]);
  }

  // Any link with data-tab (menu, wordmark, "Get in touch") switches panels
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-tab]");
    if (!a) return;
    e.preventDefault();
    var isTab = a.matches('[role="tab"]');
    show(a.getAttribute("data-tab"), { focus: !isTab });
    if (isTab) a.focus();
  });

  if (prev) prev.addEventListener("click", function () { go(-1); });
  if (next) next.addEventListener("click", function () { go(1); });

  // Keyboard: arrows inside the menu move between tabs; ←/→ anywhere else steps
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    var inTabs = e.target.getAttribute && e.target.getAttribute("role") === "tab";
    var d = 0;
    if (e.key === "ArrowRight" || (inTabs && e.key === "ArrowDown")) d = 1;
    if (e.key === "ArrowLeft" || (inTabs && e.key === "ArrowUp")) d = -1;
    if (!d) return;
    e.preventDefault();
    go(d);
    if (inTabs) tabs[current()].focus();
  });

  window.addEventListener("hashchange", function () { show(location.hash.slice(1), { push: false }); });
  show(location.hash.slice(1) || ids[0], { push: false });
  window.addEventListener("load", function () { window.scrollTo(0, 0); });
})();
