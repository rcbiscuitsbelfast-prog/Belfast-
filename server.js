/* Tiny zero-dependency static file server.
   ONLY for local preview / development. GitHub Pages does not use this —
   it serves the files in this folder directly. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  let filePath = path.join(ROOT, urlPath);
  // prevent path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stat) => {
    if (err || stat.isDirectory()) {
      const fallback = path.join(filePath, "index.html");
      return fs.readFile(fallback, (e2, data) => {
        if (e2) {
          res.writeHead(404, { "Content-Type": "text/html" });
          return res.end("<h1 style='font-family:monospace;color:#d4af37;background:#000'>404 // SIGNAL LOST</h1>");
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
      });
    }
    const ext = path.extname(filePath).toLowerCase();
    fs.readFile(filePath, (e3, data) => {
      if (e3) {
        res.writeHead(500);
        return res.end("Server error");
      }
      res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log("[v0] Belfast Is Broken serving on http://localhost:" + PORT);
});
