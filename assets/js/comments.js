/* BELFAST IS BROKEN — client-side comments
   GitHub Pages is static, so comments persist in the visitor's
   browser via localStorage. Each post block is identified by its
   data-post-id. See README.md for how to swap in a real backend. */
(function () {
  "use strict";

  function key(id) { return "bib_comments_" + id; }

  function load(id) {
    try { return JSON.parse(localStorage.getItem(key(id)) || "[]"); }
    catch (e) { return []; }
  }
  function save(id, list) {
    try { localStorage.setItem(key(id), JSON.stringify(list)); } catch (e) {}
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmt(ts) {
    var d = new Date(ts);
    var p = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) +
      " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  // seed comments (only used the very first time a visitor loads a post)
  var SEED = {
    "spire-flicker": [
      { name: "anon_docker", ts: Date.now() - 86400000 * 2, body: "i saw it too from the yard. thought it was my eyes." },
      { name: "M.", ts: Date.now() - 3600000 * 5, body: "the colour is wrong. it used to be white." }
    ],
    "the-video": [
      { name: "greyhat", ts: Date.now() - 3600000 * 9, body: "send it to me. i can pull the metadata." }
    ],
    "fairy-liquid": [
      { name: "susan_ni", ts: Date.now() - 3600000 * 30, body: "GREEN. it was always green. now the old bottle in my cupboard is white?? i'm not mad." }
    ],
    "ravens-docks": [
      { name: "anon", ts: Date.now() - 3600000 * 2, body: "counted 40+ on tuesday. they don't make noise." }
    ]
  };

  function render(box, id) {
    var listEl = box.querySelector(".comment-list");
    var list = load(id);
    if (list.length === 0 && SEED[id]) { list = SEED[id].slice(); save(id, list); }

    if (list.length === 0) {
      listEl.innerHTML = '<div class="comment"><span class="c-body" style="color:#555">no comments logged. be the first witness.</span></div>';
    } else {
      listEl.innerHTML = list.map(function (c) {
        return '<div class="comment">' +
          '<div class="c-head">' + esc(c.name || "anonymous") + ' &middot; ' + fmt(c.ts) + '</div>' +
          '<div class="c-body">' + esc(c.body) + '</div>' +
        '</div>';
      }).join("");
    }
    var count = box.querySelector("[data-count]");
    if (count) count.textContent = list.length;
  }

  function init(box) {
    var id = box.getAttribute("data-post-id");
    if (!id) return;
    render(box, id);

    var form = box.querySelector(".comment-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]').value.trim();
      var body = form.querySelector('[name="body"]').value.trim();
      if (!body) return;
      var list = load(id);
      list.push({ name: name || "anonymous", ts: Date.now(), body: body });
      save(id, list);
      render(box, id);
      form.reset();
      // paranoid confirmation
      var ok = box.querySelector(".c-ok");
      if (ok) {
        ok.textContent = ">> logged. they may already know you posted this.";
        setTimeout(function () { ok.textContent = ""; }, 4000);
      }
    });
  }

  document.querySelectorAll("[data-post-id]").forEach(init);
})();
