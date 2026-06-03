// Eleventy configuration. Kept deliberately small.
// Docs: https://www.11ty.dev/docs/

import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownItFootnote from "markdown-it-footnote";
import markdownItTaskLists from "markdown-it-task-lists";

export default function (eleventyConfig) {
  // --- Plugins ------------------------------------------------------------
  // Build-time syntax highlighting (Prism). Emits token <span>s, no client JS.
  // Colors live in css/style.css under ".token.*".
  eleventyConfig.addPlugin(syntaxHighlight);

  // --- Static files -------------------------------------------------------
  // Co-located post images: drop images next to a post and reference them
  // with a RELATIVE path, e.g.  ![alt](images/foo.jpg)
  eleventyConfig.addPassthroughCopy(
    "src/posts/**/*.{jpg,jpeg,png,gif,webp,svg,avif}"
  );
  // Anything in src/static/ is copied to the site root (favicon, etc.)
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });
  // Stylesheet: src/css/style.css -> public/css/style.css
  eleventyConfig.addPassthroughCopy("src/css");

  // --- Markdown -----------------------------------------------------------
  // Tweak the built-in markdown-it instance. Tables and strikethrough ship
  // with markdown-it's default preset; footnotes and task lists are plugins.
  // typographer:false  -> markdown NEVER auto-converts -- or ... into dashes.
  eleventyConfig.amendLibrary("md", (md) => {
    md.set({ html: true, linkify: true, typographer: false });
    md.use(markdownItFootnote);
    md.use(markdownItTaskLists, { enabled: true, label: true });
  });

  // --- Filters ------------------------------------------------------------
  eleventyConfig.addFilter("readableDate", (dateObj) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(dateObj))
  );

  eleventyConfig.addFilter("htmlDateString", (dateObj) =>
    new Date(dateObj).toISOString().slice(0, 10)
  );

  // RFC-822-ish date for RSS pubDate
  eleventyConfig.addFilter("rssDate", (dateObj) =>
    new Date(dateObj).toUTCString()
  );

  // Zero-pad the post index: 1 -> "001"
  eleventyConfig.addFilter("pad", (n) => String(n).padStart(3, "0"));

  // --- Shortcodes ---------------------------------------------------------
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // --- Collections --------------------------------------------------------
  // All tags actually used by posts, minus the internal "posts" tag. Drives
  // the filter bar and the per-tag pages (/tags/<tag>/).
  eleventyConfig.addCollection("tagList", (collection) => {
    const tags = new Set();
    collection.getAll().forEach((item) => {
      (item.data.tags || []).forEach((t) => {
        if (t !== "posts") tags.add(t);
      });
    });
    return [...tags].sort();
  });

  // --- Config -------------------------------------------------------------
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      // GitHub Pages serves whatever ends up in "public/"
      output: "public",
    },
    // GitHub PROJECT page (https://user.github.io/reponame/) lives under a
    // subpath, so CI sets PATH_PREFIX="/reponame/". For a user page or a
    // custom domain at the root, leave it unset (defaults to "/").
    pathPrefix: process.env.PATH_PREFIX || "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
