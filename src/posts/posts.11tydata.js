// Shared front matter for every post in this folder.
export default {
  layout: "post.njk",
  tags: ["posts"],
};

// URL + numbering convention
// -----------------------------------------------------------------------------
// Name each post folder (or file) with a zero-padded id prefix, and set the
// matching `id` in its front matter:
//
//   src/posts/001-hello-world/index.md   with   id: 1
//
// The folder name becomes the URL (/posts/001-hello-world/), so the id is
// always in the link and two posts may share a slug (001-hello, 007-hello).
// Co-located images keep working because the image folder and the page share
// the same path. The front-matter `id` is what renders as the index number.
//
// Lock a single post's comments by adding `comments: false` to its front
// matter. Comments otherwise follow the global switch in _data/site.js.
