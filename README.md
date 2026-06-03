# Slopwatch

A small, nerdy, statically generated blog for blaming AI slop.
Markdown posts, co-located images, RSS, zero tracking. Built with
[Eleventy](https://www.11ty.dev/) and deployed on GitHub Pages.

## Run it locally

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm start
```

Open http://localhost:8080. The dev server live-reloads on save.

Build the production site into `public/`:

```bash
npm run build
```

## Project layout

```
.github/workflows/pages.yml  # CI: build + deploy to GitHub Pages
src/
  _data/site.js        # title, url, author, comments config  <- EDIT THIS
  _includes/           # layouts (base.njk, post.njk, comments.njk)
  css/style.css        # all styling (incl. syntax colors under .token.*)
  static/              # files copied to the site root
    favicon.svg
    og.png             # 1200x630 Open Graph image
    og.svg             # source for og.png
  index.njk            # homepage (auto-lists posts)
  about.md             # about page
  feed.njk             # /feed.xml (RSS)
  posts/
    posts.json         # shared front matter for every post
    *.md               # one post per file
    a-post/            # ...or a folder per post, with images alongside
      index.md
      images/pic.jpg
```

Fonts: **system fonts only** — no Google Fonts, no webfont requests, no
third-party calls. That's why the footer "No trackers, no slop" is literally
true. Nothing to configure.

## Writing a post

Two equally valid options.

**A) Quick post, no images.** Drop a Markdown file in `src/posts/`:

```markdown
---
title: Something Is Slop Again
date: 2026-02-01
description: One line that shows up in the list and the RSS feed.
tags:
  - sightings
---

Your text here.
```

It will be published at `/posts/something-is-slop-again/` and appear in the
list automatically (newest first). `tags` are optional.

**B) Post with images.** Make a folder, put an `index.md` inside, and keep
the images next to it:

```
src/posts/the-sighting/
  index.md
  images/screenshot.png
```

Reference images with a **relative** path from inside `index.md`:

```markdown
![what it is](images/screenshot.png)
```

That is the whole system. No image pipeline, no config to touch.

### Code blocks

Fenced code blocks get build-time syntax highlighting via the
[`@11ty/eleventy-plugin-syntaxhighlight`](https://github.com/11ty/eleventy-plugin-syntaxhighlight)
plugin (Prism — runs at build time, no client-side JS). Just use a normal
fenced block with a language:

````markdown
```js
const slop = detect(input);
```
````

Colors live in `src/css/style.css` under the `.token.*` rules.

## Submit posts via issues (community voting)

Anyone can suggest a post by opening an issue (the **Slop sighting** form). The
community votes with 👍 / 👎, and a scheduled workflow turns the winners into
posts automatically.

A submission gets published when **either**:

- it reaches **`VOTE_THRESHOLD` 👍** (default 10) with more 👍 than 👎, or
- you (the editor) add the **`approved`** label.

Add the **`rejected`** label to close a submission without publishing. Published
issues are commented with the post link, labelled `published`, and closed.

**One-time setup:** create these repo labels (Issues → Labels):
`submission`, `approved`, `rejected`. The form applies `submission`
automatically; `published` is created on the fly.

How it works: `.github/ISSUE_TEMPLATE/slop-sighting.yml` (the form) →
`.github/workflows/publish-from-issues.yml` (runs every 6h, on manual dispatch,
and when you label an issue) → `tools/issue-to-post.cjs` (issue → Markdown). The
threshold lives in the workflow's `VOTE_THRESHOLD` env. Submitted screenshots are
hosted on GitHub's CDN (referenced by URL, not co-located).

## Configure the site

Edit `src/_data/site.js`:

- `title`, `tagline`, `description`, `author.name`
- `url`: the bare origin `https://dodoooh.github.io` — **no trailing slash,
  no subpath**. It is used for RSS, the sitemap, and the absolute OG image
  URL. The `/slopwatch/` subpath is handled separately (see below), so don't
  add it here.

## Social / OG image

There is a site-wide Open Graph image at `src/static/og.png` (1200×630),
referenced by the `<head>` meta in `src/_includes/base.njk`. To rebrand it,
edit `src/static/og.svg` and re-render to `og.png`. (The committed one was
rendered with macOS `qlmanage` + `sips`, but any SVG→PNG tool works — just
target 1200×630.)

## Hosting (GitHub Pages)

The site deploys to GitHub Pages from
`git@github.com:Dodoooh/slopwatch.git`.

1. Push to the `main` branch.
2. The GitHub Actions workflow at `.github/workflows/pages.yml` builds the
   site and deploys it.

**One-time setup:** in the GitHub repo, go to **Settings → Pages** and set
**Source = "GitHub Actions"**. After that, every push to `main` rebuilds and
republishes.

Live URL: **https://dodoooh.github.io/slopwatch/**

### The subpath gotcha

Because this is a GitHub *project page*, the site lives under `/slopwatch/`.
The Actions workflow already sets `PATH_PREFIX=/slopwatch/` (an env var on
the build step), and `eleventy.config.js` reads `process.env.PATH_PREFIX`.
Internal links and CSS use the `url` filter so they resolve correctly;
co-located post images are relative and work regardless.

You don't need to touch any of this unless you rename the repo or move to a
custom domain — then set `PATH_PREFIX` to the new repo name, or unset it (it
defaults to `/`) for a user page / custom domain.

## Comments (optional, off by default)

Comments use [giscus](https://giscus.app/), which stores them in **GitHub
Discussions** (free, no server, spam-resistant because commenters sign in
with GitHub). They stay off until you fill in the ids — until then nothing
renders.

To enable:

1. Make `Dodoooh/slopwatch` public, enable the **Discussions** feature, and
   install the [giscus app](https://github.com/apps/giscus) on it.
2. Go to https://giscus.app/, enter `Dodoooh/slopwatch`, and copy the
   `repoId` and `categoryId` it gives you.
3. Paste those into the `comments` block in `src/_data/site.js` and set
   `enabled: true`.

Done. Comments now render at the bottom of every post.

## License

Your content is yours. Do what you like with the template.
