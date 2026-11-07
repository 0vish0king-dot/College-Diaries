(function () {
  "use strict";

  const ENDPOINT = "/api/submit-profile";

  const form = document.getElementById("profile-form");
  const btn = document.getElementById("submitProfileBtn");
  const statusEl = document.getElementById("submit-status");
  const photoError = document.getElementById("photoError");
  if (!form || !btn || !statusEl) return;

  function setStatus(message, isError) {
    statusEl.replaceChildren(document.createTextNode(message));
    statusEl.classList.toggle("is-error", Boolean(isError));
  }

  btn.addEventListener("click", async () => {
    setStatus("");

    // Make profile-builder.js refresh its validation messages
    form.dispatchEvent(new Event("input", { bubbles: true }));

    if (!window.profilePhoto || !window.profilePhoto.dataUrl) {
      photoError.textContent = "Please take or upload a photo.";
      return;
    }
    if (!form.reportValidity()) {
      setStatus("Please complete the required fields and correct any errors.", true);
      return;
    }

    const f = form.elements;
    const payload = {
      name: f.name.value.trim(),
      course: f.course.value,
      year: f.year.value,
      introduction: f.introduction.value.trim(),
      skills: f.skills.value.trim(),
      github: f.github.value.trim(),
      story: f.story.value.trim(),
      photo: window.profilePhoto.dataUrl,
      website: f.website ? f.website.value : "" // hidden honeypot field
    };

    btn.disabled = true;
    setStatus("Submitting your profile…");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");

      statusEl.classList.remove("is-error");
      statusEl.replaceChildren(document.createTextNode("Submitted! A maintainer will review your profile. "));
      if (data.url && data.url.indexOf("https://github.com/") === 0) {
        const link = document.createElement("a");
        link.href = data.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View your pull request";
        statusEl.append(link);
      }
      // keep the button disabled so the same profile is not submitted twice
    } catch (err) {
      setStatus(err.message || "Network error. Please try again.", true);
      btn.disabled = false;
    }
  });
})();