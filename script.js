// Desktop (> 860px): one-screen navigation, one section at a time, switched
// with the menu, the arrow buttons, scrolling, or the keyboard (arrows, Page Up/Down).
// Phones and small tablets: all sections stack and you simply scroll; the
// menu jumps to a section and highlights the one you are reading.
(function () {
  "use strict";
  var root = document.documentElement;
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));
  if (!tabs.length || !panels.length) return;

  var ids = panels.map(function (p) { return p.id; });
  var stepper = document.querySelector(".stepper");
  var prev = stepper && stepper.querySelector('[data-step="-1"]');
  var next = stepper && stepper.querySelector('[data-step="1"]');
  var now = document.getElementById("step-now");
  var desktop = window.matchMedia("(min-width: 861px)");
  var spy = null;

  function mark(id) {
    tabs.forEach(function (t) {
      var on = t.getAttribute("aria-controls") === id;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
  }

  /* ---------- Desktop: one panel at a time ---------- */
  function show(id, opts) {
    opts = opts || {};
    var i = ids.indexOf(id);
    if (i < 0) { i = 0; id = ids[0]; }
    panels.forEach(function (p) {
      var on = p.id === id;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
    mark(id);
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === ids.length - 1;
    if (now) now.textContent = ("0" + i).slice(-2);
    if (opts.push !== false && location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
    if (opts.focus) panels[i].focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  function current() { return ids.indexOf((document.querySelector(".panel.is-active") || panels[0]).id); }
  function go(delta) { show(ids[Math.max(0, Math.min(ids.length - 1, current() + delta))]); }

  /* ---------- Mode switching ---------- */
  function enterDesktop() {
    if (spy) { spy.disconnect(); spy = null; }
    root.classList.add("js");
    root.classList.remove("scroll-mode");
    if (stepper) stepper.hidden = false;
    show(location.hash.slice(1) || ids[0], { push: false });
  }
  function enterScroll() {
    root.classList.remove("js");
    root.classList.add("scroll-mode");
    if (stepper) stepper.hidden = true;
    panels.forEach(function (p) { p.hidden = false; p.classList.remove("is-active"); });
    tabs.forEach(function (t) { t.tabIndex = 0; });
    mark(location.hash.slice(1) || ids[0]);
    if ("IntersectionObserver" in window) {
      spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) mark(e.target.id); });
      }, { rootMargin: "-40% 0px -55% 0px" });
      panels.forEach(function (p) { spy.observe(p); });
    }
  }
  function apply() { desktop.matches ? enterDesktop() : enterScroll(); }

  /* ---------- Events ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-tab]");
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute("data-tab");
    if (desktop.matches) {
      var isTab = a.matches('[role="tab"]');
      show(id, { focus: !isTab });
      if (isTab) a.focus();
    } else {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", "#" + id);
      mark(id);
    }
  });
  if (prev) prev.addEventListener("click", function () { go(-1); });
  if (next) next.addEventListener("click", function () { go(1); });

  document.addEventListener("keydown", function (e) {
    if (!desktop.matches || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    var inTabs = e.target.getAttribute && e.target.getAttribute("role") === "tab";
    var d = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") d = 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") d = -1;
    if (!d) return;
    e.preventDefault();
    go(d);
    if (inTabs) tabs[current()].focus();
  });

  // Desktop: mouse wheel / trackpad scroll moves to the next or previous section
  var acc = 0, locked = false, lockedAt = 0, quiet = null;
  window.addEventListener("wheel", function (e) {
    if (!desktop.matches || e.ctrlKey) return;
    e.preventDefault();
    clearTimeout(quiet);
    // stay locked until the gesture (including trackpad momentum) has ended
    quiet = setTimeout(function () { if (Date.now() - lockedAt > 600) { locked = false; acc = 0; } }, 180);
    if (locked) return;
    acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? 0 : e.deltaY;
    if (Math.abs(acc) < 40) return;
    var d = acc > 0 ? 1 : -1;
    acc = 0;
    var i = current();
    if ((d > 0 && i === ids.length - 1) || (d < 0 && i === 0)) return;
    locked = true; lockedAt = Date.now();
    go(d);
  }, { passive: false });

  window.addEventListener("hashchange", function () { if (desktop.matches) show(location.hash.slice(1), { push: false }); });
  if (desktop.addEventListener) desktop.addEventListener("change", apply); else desktop.addListener(apply);
  apply();
  window.addEventListener("load", function () { if (desktop.matches) window.scrollTo(0, 0); });
})();
