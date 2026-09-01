/* BELFAST IS BROKEN — minimal JS (no dependencies) */
(function () {
  "use strict";

  // ---- live "documented at" timestamp ----
  function pad(n) { return String(n).padStart(2, "0"); }
  function stamp() {
    var d = new Date();
    return (
      d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
      " // " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds())
    );
  }
  function tickClock() {
    var el = document.querySelector("[data-clock]");
    if (!el) return;
    el.textContent = stamp();
    setTimeout(tickClock, 1000);
  }
  tickClock();

  // ---- occasional whole-page glitch flicker ----
  function randomGlitch() {
    var next = 6000 + Math.random() * 9000;
    setTimeout(function () {
      document.body.style.filter = "invert(0.04) hue-rotate(8deg)";
      setTimeout(function () { document.body.style.filter = ""; }, 90);
      randomGlitch();
    }, next);
  }
  randomGlitch();

  // ---- fake visitor counter (odometer-ish, deterministic-ish) ----
  var vc = document.querySelector("[data-visitors]");
  if (vc) {
    var base = 000000;
    try {
      base = parseInt(localStorage.getItem("bib_visits") || "13707", 10);
      base += 1;
      localStorage.setItem("bib_visits", String(base));
    } catch (e) { base = 13707; }
    vc.textContent = String(base).padStart(6, "0");
  }
})();
