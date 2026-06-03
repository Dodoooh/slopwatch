// Pure logic: turn a "slop sighting" issue into a Markdown post.
// Kept dependency-free and side-effect-free so it can be unit-tested and
// required from the publish-from-issues workflow (actions/github-script).

const CATEGORY_MAP = {
  "Slop (machine-written)": "slop",
  "Hype (a human posting about AI)": "hype",
  Guide: "guides",
  Tell: "tells",
  Meta: "meta",
};

function slugify(s) {
  return (
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "untitled"
  );
}

// Extract one section of a GitHub issue-form body ("### Label\n\n<value>").
function section(body, label) {
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = (body || "").match(
    new RegExp("###\\s+" + esc + "\\s*\\n+([\\s\\S]*?)(?=\\n###\\s|$)")
  );
  let v = m ? m[1].trim() : "";
  if (v === "_No response_") v = "";
  return v;
}

function yamlStr(s) {
  return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function deriveDescription(text, fallback) {
  const line =
    (text || "")
      .split("\n")
      .map((l) => l.trim())
      .find(
        (l) => l && !l.startsWith("![") && !l.startsWith("<") && !l.startsWith("|")
      ) ||
    fallback ||
    "";
  return line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .trim()
    .slice(0, 150);
}

// issue: { title, body, user: {login, html_url} }
// returns { slug, dir, filename, content, tag }
function buildPost({ issue, id, approved, up, date }) {
  const title = (issue.title || "").replace(/^\[sighting\]\s*/i, "").trim() || "untitled";
  const body = issue.body || "";
  const sighting = section(body, "The sighting") || body || "(no description provided)";
  const tag = CATEGORY_MAP[section(body, "Category")] || "sightings";
  const pad = String(id).padStart(3, "0");
  const slug = pad + "-" + slugify(title);
  const desc = deriveDescription(sighting, title);
  const user = issue.user || {};
  const credit =
    "*Suggested by [@" +
    (user.login || "anon") +
    "](" +
    (user.html_url || "#") +
    ")" +
    (approved
      ? " · approved by the editor.*"
      : " · published by community vote (" + up + " 👍).*");
  const content =
    "---\n" +
    "id: " + id + "\n" +
    "title: " + yamlStr(title) + "\n" +
    "date: " + date + "\n" +
    "description: " + yamlStr(desc) + "\n" +
    "tags:\n  - " + tag + "\n" +
    "---\n\n" +
    sighting.trim() +
    "\n\n---\n\n" +
    credit +
    "\n";
  return { slug, dir: "src/posts/" + slug, filename: "src/posts/" + slug + "/index.md", content, tag };
}

module.exports = { CATEGORY_MAP, slugify, section, deriveDescription, buildPost };
