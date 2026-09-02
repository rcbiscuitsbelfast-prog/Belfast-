# BELFAST IS BROKEN

> "Something is happening in this city. I'm documenting everything before it disappears."

An early-2000s style **conspiracy / ARG website** — amateur, paranoid, glitchy.
Pure **HTML + CSS + minimal JavaScript**, no build step, no framework.
Designed to be dropped straight onto **GitHub Pages**.

---

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home — masthead, video + photo exhibits, live timestamp, footer |
| `anomalies.html` | Belfast Anomalies — scrolling investigator's notebook feed |
| `worldwide.html` | Worldwide Anomalies — Mandela-effect cross-reference feed |
| `blog.html` | The Log — paranoid timestamped posts + **working comments** + sidebar |
| `contact.html` | Contact / Tips — mailto form and a small glyph icon |

## Folder structure

```
/
├── index.html
├── anomalies.html
├── worldwide.html
├── blog.html
├── contact.html
├── README.md
├── .nojekyll                # tells GitHub Pages to serve files as-is
├── assets/
│   ├── css/style.css        # the whole theme + glitch animations
│   ├── js/main.js           # live clock, glitch flicker, visitor counter
│   ├── js/comments.js       # legacy local comments script (not used by the blog)
│   ├── images/              # low-res / pixelated art + static overlay
│   └── videos/              # drop your .mp4 clips here (see README.txt)
├── posts/                   # markdown source for blog posts
└── anomalies/               # markdown source for anomaly entries
```

> `server.js` and `package.json` exist **only for local preview**. GitHub Pages
> ignores them and serves the HTML directly.

---

## Run it locally

Any static server works. With Node installed:

```bash
npm run dev          # → http://localhost:3000
```

Or with Python:

```bash
python3 -m http.server 3000
```

Or just double-click `index.html`.

---

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `belfast-is-broken`).
2. Push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "belfast is broken"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/belfast-is-broken.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select branch **`main`** and folder **`/ (root)`**, then **Save**.
6. Wait ~1 minute. Your site goes live at:
   `https://YOUR-USERNAME.github.io/belfast-is-broken/`

The included `.nojekyll` file prevents GitHub's Jekyll processor from touching
your assets, so everything is served exactly as written.

---

## How to add a new blog post

1. Open `blog.html`.
2. Copy an existing `<article class="post"> ... </article>` block.
3. Change the `<h2>` title, the `.post-meta` date/author, and the paragraph.
4. **Important:** give the comments block a unique id:
   ```html
   <div class="comments" data-post-id="my-new-post-id">
   ```
   The `data-post-id` is how comments are stored and kept separate per post.
5. (Optional) Add a matching markdown file in `/posts/` for your own records —
   keep the `id:` in its front-matter equal to the `data-post-id`.

## How to add a new anomaly entry

1. Open `anomalies.html` (Belfast) or `worldwide.html` (global).
2. Copy an `<article class="entry"> ... </article>` block.
3. Update the title, the `.meta` timestamp, the `.tag`, and the description.
4. Point the `<img>` at a file in `/assets/images/`, or keep the dashed
   `.vid-ph` box as a "missing footage" placeholder.
5. `/anomalies/*.md` holds a plain-text index of every entry if you prefer to
   draft there first.

## How to add a video

Drop an `.mp4` into `/assets/videos/` and replace a placeholder with:

```html
<video controls width="100%" poster="assets/images/video-still.png">
  <source src="assets/videos/clip_0043.mp4" type="video/mp4" />
</video>
```

---

## Comments

The four blog posts use [Utterances](https://utteranc.es), so comments are
shared publicly through GitHub Issues rather than stored only in one visitor's
browser. Before publishing, install and authorise the Utterances GitHub App for
`rcbiscuitsbelfast-prog/Belfast-`, and enable Issues in the repository settings.
Each post has its own issue thread selected by its unique `issue-term`.

## Contact form

`contact.html` uses a `mailto:` form that opens the visitor's mail client — no
backend required. To collect submissions on a page instead, point the form's
`action` at a free endpoint like [Formspree](https://formspree.io) or a Netlify
form.

---

## Credits / notes

- Fonts: system monospace (`Courier New`) for the authentic amateur-2003 feel.
- All imagery is intentionally low-res / pixelated (`image-rendering: pixelated`).
- Glitch, jitter, scanline and static effects are pure CSS in `style.css`.
- No trackers, no cookies, no analytics. Keep watching.
