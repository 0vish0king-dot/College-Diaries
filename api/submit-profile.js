"use strict";

/*
 * Vercel serverless function: POST /api/submit-profile
 *
 * Takes the profile form data + photo and opens a pull request that
 *   1) adds the photo to images/
 *   2) adds the profile card inside <div id="grid" class="grid"> in index.html
 *
 * Environment variables (set in Vercel -> Project -> Settings -> Environment Variables):
 *   GITHUB_TOKEN        fine-grained token: Contents (read/write) + Pull requests (read/write)
 *   GITHUB_OWNER        repository owner, e.g. "my-org"
 *   GITHUB_REPO         repository name
 *   GITHUB_BASE_BRANCH  optional, defaults to "main"
 */

const COURSES = ["MCA", "BCA", "BSc Data Science"];
const YEARS = ["1st year", "2nd year", "3rd year", "4th year"];
const MAX_PHOTO_BYTES = 1024 * 1024; // 1 MB (the form sends a ~400x400 JPEG, far smaller)

// Best-effort rate limit (memory is per serverless instance, so this only slows down abuse)
const hits = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function slugify(name) {
  return (name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "profile";
}

// Returns "" (empty), a normalised URL, or null (invalid)
function githubProfileUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "github.com" ||
        url.username || url.password || url.port || url.search || url.hash ||
        !/^\/[A-Za-z0-9-]+\/?$/.test(url.pathname)) {
      return null;
    }
    return "https://github.com" + url.pathname.replace(/\/$/, "");
  } catch {
    return null;
  }
}

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max + 1) : "";
}

// Never trust the browser: re-check everything here
function validate(body) {
  const name = text(body.name, 80);
  const course = text(body.course, 40);
  const year = text(body.year, 20);
  const introduction = text(body.introduction, 300);
  const skillsRaw = text(body.skills, 200);
  const githubRaw = text(body.github, 200);
  const story = text(body.story, 1200);
  const photo = typeof body.photo === "string" ? body.photo : "";

  if (!name || name.length > 80) return { error: "Please enter a valid name." };
  if (!COURSES.includes(course)) return { error: "Please choose a valid course." };
  if (!YEARS.includes(year)) return { error: "Please choose a valid year." };
  if (!introduction || introduction.length > 300) return { error: "Please enter an introduction (max 300 characters)." };
  if (!story || story.length > 1200) return { error: "Please enter your diary story (max 1200 characters)." };

  const skills = skillsRaw.split(",").map(s => s.trim()).filter(Boolean);
  if (!skills.length || skills.length > 12 || skills.some(s => s.length > 30)) {
    return { error: "Please enter 1 to 12 skills, separated by commas." };
  }

  const github = githubProfileUrl(githubRaw);
  if (github === null) return { error: "Please enter a valid GitHub profile URL." };

  const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(photo);
  if (!match) return { error: "Please add a valid photo." };
  const photoBuffer = Buffer.from(match[1], "base64");
  if (photoBuffer.length === 0 || photoBuffer.length > MAX_PHOTO_BYTES) {
    return { error: "The photo is too large." };
  }
  // JPEG files start with FF D8 FF
  if (!(photoBuffer[0] === 0xff && photoBuffer[1] === 0xd8 && photoBuffer[2] === 0xff)) {
    return { error: "The photo must be a JPEG image." };
  }

  return { profile: { name, course, year, introduction, skills, github, story }, photoBuffer };
}

function buildCardHtml(p, photoPath) {
  const skills = p.skills.map(s => `      <span>${escapeHtml(s)}</span>`).join("\n");
  const githubMarkup = p.github
    ? `\n    <a class="github" href="${escapeHtml(p.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`
    : "";

  return `<article class="card" data-course="${escapeHtml(p.course)}">
  <div class="portrait" style="--tint: #e1e8d9">
    <img src="${escapeHtml(photoPath)}" alt="${escapeHtml(p.name)} profile image">
    <span class="course">${escapeHtml(p.course)}</span>
  </div>
  <div class="card-body">
    <h3>${escapeHtml(p.name)}</h3>
    <span class="year">${escapeHtml(p.year)}</span>
    <p>${escapeHtml(p.introduction)}</p>
    <div class="tags">
${skills}
    </div>${githubMarkup}
    <p class="story" hidden>${escapeHtml(p.story)}</p>
    <div class="card-bottom"><span>A story in progress</span><button class="view" type="button">View diary ↗</button></div>
  </div>
</article>`;
}

async function gh(path, options) {
  const res = await fetch("https://api.github.com" + path, {
    ...options,
    headers: {
      Authorization: "Bearer " + process.env.GITHUB_TOKEN,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "college-diaries-profile-bot",
      "Content-Type": "application/json"
    }
  });
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = null; }
  return { status: res.status, ok: res.ok, data };
}

async function mustGh(path, options, what) {
  const r = await gh(path, options);
  if (!r.ok) {
    console.error(`GitHub error while ${what}:`, r.status, JSON.stringify(r.data));
    throw new Error(what);
  }
  return r.data;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    console.error("Missing GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO");
    return res.status(500).json({ error: "The server is not set up yet." });
  }
  const base = process.env.GITHUB_BASE_BRANCH || "main";

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request." });
  }

  // Honeypot: real users never fill this hidden field, bots often do
  if (body.website) return res.status(200).json({ ok: true });

  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "Too many submissions. Please try again later." });
  }

  const { error, profile, photoBuffer } = validate(body);
  if (error) return res.status(400).json({ error });

  const repo = `/repos/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(GITHUB_REPO)}`;

  try {
    // 1. Pick a photo file name that does not exist yet
    let slug = slugify(profile.name);
    const exists = await gh(`${repo}/contents/images/${slug}.jpg?ref=${encodeURIComponent(base)}`, { method: "GET" });
    if (exists.status === 200) slug += "-" + Date.now().toString(36).slice(-4);
    const photoPath = `images/${slug}.jpg`;

    // 2. New branch from the latest base commit
    const baseRef = await mustGh(`${repo}/git/ref/heads/${encodeURIComponent(base)}`, { method: "GET" }, "reading the base branch");
    const branch = `profile/${slug}-${Date.now().toString(36)}`;
    await mustGh(`${repo}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseRef.object.sha })
    }, "creating the branch");

    // 3. Add the photo
    await mustGh(`${repo}/contents/${photoPath}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Add profile photo for ${profile.name.replace(/[\r\n]+/g, " ")}`,
        content: photoBuffer.toString("base64"),
        branch
      })
    }, "uploading the photo");

    // 4. Insert the card into index.html
    const file = await mustGh(`${repo}/contents/index.html?ref=${encodeURIComponent(branch)}`, { method: "GET" }, "reading index.html");
    if (!file.content) throw new Error("index.html is empty or too large");
    const html = Buffer.from(file.content, "base64").toString("utf8");

    const marker = /<div\b[^>]*\bid="grid"[^>]*>/;
    const found = marker.exec(html);
    if (!found) {
      console.error('Could not find <div id="grid"> in index.html');
      throw new Error("finding the grid");
    }
    const lineStart = html.lastIndexOf("\n", found.index) + 1;
    const indent = /^[ \t]*/.exec(html.slice(lineStart, found.index))[0] + "  ";
    const card = buildCardHtml(profile, photoPath)
      .split("\n").map(line => indent + line).join("\n");
    const insertAt = found.index + found[0].length;
    const updated = html.slice(0, insertAt) + "\n" + card + html.slice(insertAt);

    await mustGh(`${repo}/contents/index.html`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Add profile card for ${profile.name.replace(/[\r\n]+/g, " ")}`,
        content: Buffer.from(updated, "utf8").toString("base64"),
        sha: file.sha,
        branch
      })
    }, "updating index.html");

    // 5. Open the pull request (only allow-listed text goes into the description)
    const safeName = profile.name.replace(/[\r\n`@]+/g, " ").trim();
    const pr = await mustGh(`${repo}/pulls`, {
      method: "POST",
      body: JSON.stringify({
        title: `Add profile: ${safeName}`,
        head: branch,
        base,
        body: [
          "Submitted through the profile builder form.",
          "",
          `- **Name:** \`${safeName}\``,
          `- **Course:** ${profile.course}`,
          `- **Year:** ${profile.year}`,
          "",
          "Please review the card text and photo before merging."
        ].join("\n")
      })
    }, "opening the pull request");

    return res.status(200).json({ ok: true, url: pr.html_url });
  } catch (err) {
    console.error("submit-profile failed:", err && err.message);
    return res.status(500).json({ error: "Could not submit your profile right now. Please try again later." });
  }
};
