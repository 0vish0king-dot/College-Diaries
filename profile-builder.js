(function () {
  "use strict";

  const form = document.querySelector("#profile-form");
  const preview = document.querySelector("#profile-preview");
  const githubInput = form.elements.github;
  const githubError = document.querySelector("#github-error");
  const status = document.querySelector("#copy-status");
  const output = document.querySelector("#generated-html");
  const photoPath = "images/your-name.jpg";

  function getProfile() {
    return {
      name: form.elements.name.value.trim(),
      course: form.elements.course.value,
      year: form.elements.year.value,
      introduction: form.elements.introduction.value.trim(),
      skills: form.elements.skills.value.split(",").map(skill => skill.trim()).filter(Boolean),
      github: githubInput.value.trim(),
      story: form.elements.story.value.trim()
    };
  }

  function githubProfileUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" || url.hostname !== "github.com" ||
          url.username || url.password || url.port || url.search || url.hash ||
          !/^\/[A-Za-z0-9-]+\/?$/.test(url.pathname)) {
        return null;
      }
      return `https://github.com${url.pathname.replace(/\/$/, "")}`;
    } catch {
      return null;
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function updateGithubValidity() {
    const url = githubProfileUrl(githubInput.value.trim());
    const invalid = githubInput.value.trim() !== "" && url === null;
    githubInput.setCustomValidity(invalid ? "Enter a valid GitHub profile URL." : "");
    githubError.hidden = !invalid;
    return !invalid;
  }

  function updateRequiredValidity() {
    form.elements.name.setCustomValidity(form.elements.name.value.trim() ? "" : "Enter your name.");
    form.elements.introduction.setCustomValidity(
      form.elements.introduction.value.trim() ? "" : "Enter an introduction."
    );
    form.elements.skills.setCustomValidity(
      form.elements.skills.value.split(",").some(skill => skill.trim()) ? "" : "Enter at least one skill."
    );
    form.elements.story.setCustomValidity(form.elements.story.value.trim() ? "" : "Enter your diary story.");
  }

  function appendText(parent, tagName, className, value) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = value;
    parent.append(element);
    return element;
  }

  function buildPreview(profile) {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.course = profile.course;

    const portrait = document.createElement("div");
    portrait.className = "portrait";
    portrait.style.setProperty("--tint", "#e1e8d9");
    const image = document.createElement("img");
    image.src = photoPath;
    image.alt = profile.name ? `${profile.name} profile image` : "Profile photo preview";
    image.addEventListener("error", () => {
      image.hidden = true;
      portrait.classList.add("photo-missing");
    }, { once: true });
    portrait.append(image);
    appendText(portrait, "span", "course", profile.course || "Course");

    const body = document.createElement("div");
    body.className = "card-body";
    appendText(body, "h3", "", profile.name || "Your name");
    appendText(body, "span", "year", profile.year || "Year");
    appendText(body, "p", "", profile.introduction || "Your introduction will appear here.");
    const tags = document.createElement("div");
    tags.className = "tags";
    for (const skill of profile.skills.length ? profile.skills : ["Your skills"]) {
      appendText(tags, "span", "", skill);
    }
    body.append(tags);

    if (profile.github && githubProfileUrl(profile.github)) {
      const link = document.createElement("a");
      link.className = "github";
      link.href = githubProfileUrl(profile.github);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "GitHub";
      body.append(link);
    }

    const story = appendText(body, "p", "story", profile.story || "Your diary story will appear here.");
    story.hidden = true;

    const bottom = document.createElement("div");
    bottom.className = "card-bottom";
    appendText(bottom, "span", "", "A story in progress");
    const viewButton = appendText(bottom, "button", "view", "View diary ↗");
    viewButton.type = "button";
    body.append(bottom);

    card.append(portrait, body);
    preview.replaceChildren(card);
  }

  function createCardHtml(profile) {
    const skills = profile.skills
      .map(skill => `      <span>${escapeHtml(skill)}</span>`)
      .join("\n");
    const github = githubProfileUrl(profile.github);
    const githubMarkup = github
      ? `\n    <a class="github" href="${escapeHtml(github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`
      : "";

    return `<article class="card" data-course="${escapeHtml(profile.course)}">
  <div class="portrait" style="--tint: #e1e8d9">
    <img src="${photoPath}" alt="${escapeHtml(profile.name)} profile image">
    <span class="course">${escapeHtml(profile.course)}</span>
  </div>
  <div class="card-body">
    <h3>${escapeHtml(profile.name)}</h3>
    <span class="year">${escapeHtml(profile.year)}</span>
    <p>${escapeHtml(profile.introduction)}</p>
    <div class="tags">
${skills}
    </div>${githubMarkup}
    <p class="story" hidden>${escapeHtml(profile.story)}</p>
    <div class="card-bottom"><span>A story in progress</span><button class="view" type="button">View diary ↗</button></div>
  </div>
</article>`;
  }

  function updatePreview() {
    buildPreview(getProfile());
    updateGithubValidity();
    updateRequiredValidity();
  }

  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);

  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.textContent = "";
    updateGithubValidity();
    updateRequiredValidity();

    if (!form.reportValidity()) {
      status.textContent = "Please complete the required fields and correct any errors.";
      return;
    }

    const html = createCardHtml(getProfile());
    output.value = html;
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(html);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      output.focus();
      output.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
    }

    status.textContent = copied
      ? "Profile HTML copied. Paste it inside the #grid element in index.html."
      : "Your HTML is ready below. Select it and copy it to your clipboard.";
  });

  updatePreview();
})();
