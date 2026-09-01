/*
  BELFAST IS BROKEN — minimal JS (no dependencies)
  This file is deliberately rough, repetitive, and weird.
  It is not a framework. It is a machine for feeling watched.
  The glitches are meant to look human-made, broken, and just a little too specific.
*/
(function () {
  "use strict";

  // If anyone is reading this in a browser console, you are already late.
  // This is not a normal website; it is a nervous system with a static front-end.
  // The clock is real-ish. The counter is fake-ish. The archive is very much alive.
  if (window.console) {
    console.log("%cBELFAST IS BROKEN", "color:#d4af37;font-weight:bold;font-size:18px;letter-spacing:3px;");
    console.log("%c[signal] the city is not matching the record", "color:#ff4d6d;");
    console.log("%c[status] archive warmed; do not trust the timeline; do not trust your memory", "color:#7f5af0;");
    console.log("%c[hint] if the page looks wrong, it probably is", "color:#8be9fd;");
    console.table([
      { layer: "archive", state: "unstable", note: "all timestamps are local and probably wrong" },
      { layer: "memory", state: "drifting", note: "some details do not survive a second look" },
      { layer: "observer", state: "present", note: "you are reading this in a browser, which is not the same as being there" }
    ]);
  }

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
  // The flicker is intentionally chaotic. There is no real reason for it.
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
  // The archive is static. The count is local to the browser. That means nobody can prove it is wrong.
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
