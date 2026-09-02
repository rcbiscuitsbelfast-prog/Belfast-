(function () {
  "use strict";

  var palettes = [
    { bg: "#000000", fg: "#e8e8e8", accent: "#d4af37", secondary: "#9b6dff", warning: "#ff4d6d" },
    { bg: "#071114", fg: "#d9ffff", accent: "#5ee7d3", secondary: "#62a8ff", warning: "#ffb86c" },
    { bg: "#120606", fg: "#ffe8df", accent: "#ff8a65", secondary: "#f06292", warning: "#ffd166" },
    { bg: "#101006", fg: "#f4f1c9", accent: "#d8d35f", secondary: "#8bc34a", warning: "#ff7043" },
    { bg: "#090b16", fg: "#e5e9ff", accent: "#82aaff", secondary: "#c792ea", warning: "#f07178" },
    { bg: "#07120a", fg: "#e5ffe9", accent: "#70d6a5", secondary: "#b8e986", warning: "#ff6b6b" },
    { bg: "#140c14", fg: "#ffe9ff", accent: "#ff9de2", secondary: "#a78bfa", warning: "#fb7185" },
    { bg: "#101010", fg: "#f7f7f7", accent: "#f97316", secondary: "#22d3ee", warning: "#ef4444" },
    { bg: "#0c1014", fg: "#edf6ff", accent: "#38bdf8", secondary: "#facc15", warning: "#fb7185" },
    { bg: "#160f08", fg: "#fff4e6", accent: "#f59e0b", secondary: "#84cc16", warning: "#e11d48" }
  ];

  var messages = [
    "THE RECORD HAS A DIFFERENT COLOUR TODAY",
    "YOU WERE HERE BEFORE THIS PAGE LOADED",
    "BELFAST IS NOT THE SAME IN EVERY TAB",
    "COMPARE THIS VERSION WITH SOMEONE ELSE'S",
    "A SEARCH RESULT IS STILL A WITNESS",
    "THE ARCHIVE REMEMBERS YOUR REFRESH",
    "THIS SIGNAL WAS NOT IN THE ORIGINAL COPY",
    "MANDELA EFFECT // LOCAL WEATHER // SAME FEELING",
    "SOMEONE ELSE IS SEEING A DIFFERENT ACCENT",
    "DO NOT TRUST THE FIRST VERSION YOU SEE"
  ];

  var palette = palettes[Math.floor(Math.random() * palettes.length)];
  var message = messages[Math.floor(Math.random() * messages.length)];
  var root = document.documentElement;

  root.style.setProperty("--bg", palette.bg);
  root.style.setProperty("--fg", palette.fg);
  root.style.setProperty("--gold", palette.accent);
  root.style.setProperty("--violet", palette.secondary);
  root.style.setProperty("--blood", palette.warning);
  root.dataset.shareVariant = String(palettes.indexOf(palette) * messages.length + messages.indexOf(message) + 1);

  var marquee = document.querySelector(".marquee span");
  if (marquee) {
    marquee.textContent = "*** " + message + " *** " + message + " ***";
  }
})();
