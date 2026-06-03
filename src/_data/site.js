// Site-wide settings. Edit these.
export default {
  title: "Slopwatch",
  tagline: "AI slop and AI hype — screenshotted, labeled, and blamed.",
  description:
    "Slopwatch logs two species of AI cringe: the low-effort content machines extrude and nobody reads, and the wide-awake humans posting that AI is sentient, about to make them rich, and the only thing that matters now. We screenshot it and assign blame.",

  // Origin only (no trailing slash, no subpath). This is a GitHub project
  // page, so the site is served under /slopwatch/ via PATH_PREFIX (set in CI),
  // not here. Used for RSS + sitemap + absolute OG image url.
  url: "https://dodoooh.github.io",

  author: {
    name: "The Slop Desk",
    email: "",
  },

  // Comments via giscus (GitHub Discussions). To finish turning them on:
  //   1. make the repo public, enable Discussions, install the giscus app
  //   2. go to https://giscus.app/, enter Dodoooh/slopwatch, copy the ids
  //   3. paste repoId + categoryId below and set enabled: true
  // Until the ids are filled in, keep enabled:false so nothing renders broken.
  comments: {
    enabled: true,
    repo: "Dodoooh/slopwatch",
    repoId: "R_kgDOSvUrZA",
    category: "Announcements",
    categoryId: "DIC_kwDOSvUrZM4C-YOQ",
  },
};
