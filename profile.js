const fields = ['name', 'course', 'year', 'intro', 'skills', 'github', 'story'];
const el = id => document.getElementById(id);

// Makes special characters safe so they cannot break the HTML
function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'yourname';
}

function isValidGithubUrl(url) {
  return /^https:\/\/github\.com\/[A-Za-z0-9-]+(?:\/[A-Za-z0-9._-]+)?\/?$/.test(url);
}

function getValues() {
  const v = {};
  fields.forEach(f => v[f] = el(f).value.trim());
  return v;
}

function getPhotoData() {
  return (window.profilePhoto && window.profilePhoto.dataUrl) || '';
}

// forPreview = true  -> uses the captured photo so it shows on screen
// forPreview = false -> uses images/name.jpeg, which is what gets copied
function buildCard(v, forPreview) {
  const name = escapeHTML(v.name || 'Your Name');
  const course = escapeHTML(v.course || 'Your Course');
  const year = escapeHTML(v.year || 'Year');
  const intro = escapeHTML(v.intro || 'Your introduction appears here.');
  const story = escapeHTML(v.story || 'Your diary story appears here.');
  const github = escapeHTML(v.github || '#');
  const filePath = 'images/' + slugify(v.name) + '.jpeg';
  const photo = (forPreview && getPhotoData()) || filePath;
  const tags = v.skills
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => '<span>' + escapeHTML(s) + '</span>')
    .join('');

  return '<article class="card" data-course="' + course + '">\n' +
    '  <div class="portrait" style="--tint: #eadfd4">\n' +
    '    <img src="' + photo + '" alt="' + name + ' profile image" loading="lazy">\n' +
    '    <span class="course">' + course + '</span>\n' +
    '  </div>\n' +
    '  <div class="card-body">\n' +
    '    <h3 class="devi-name">' + name + '</h3>\n' +
    '    <span class="year">' + year + '</span>\n' +
    '    <p>' + intro + '</p>\n' +
    '    <div class="tags">' + (tags || '<span>Skill</span>') + '</div>\n' +
    '    <p class="story" hidden>\n' + story + '\n    </p>\n' +
    '    <div class="github"><a href="' + github + '">Github</a></div>\n' +
    '    <div class="card-bottom"><span>A story in progress</span><button class="view">View diary &#8594;</button></div>\n' +
    '  </div>\n' +
    '</article>';
}

function renderPreview() {
  const v = getValues();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = buildCard(v, true);
  const card = wrapper.firstElementChild;
  // The story is hidden on real cards, so show it in the preview
  const story = card.querySelector('.story');
  if (story) story.hidden = false;
  el('preview').replaceChildren(card);
}

function validate() {
  const v = getValues();
  let ok = true;
  const messages = {
    name: 'Please enter your name.',
    course: 'Please enter your course.',
    year: 'Please select your year.',
    intro: 'Please write a short introduction.',
    skills: 'Please add at least one skill.',
    story: 'Please write your diary story.'
  };
  Object.keys(messages).forEach(f => {
    const bad = !v[f];
    el(f + 'Error').textContent = bad ? messages[f] : '';
    if (bad) ok = false;
  });
  const gh = v.github;
  let ghMsg = '';
  if (!gh) ghMsg = 'Please enter your GitHub URL.';
  else if (!isValidGithubUrl(gh)) ghMsg = 'Use a link like https://github.com/username';
  el('githubError').textContent = ghMsg;
  if (ghMsg) ok = false;

  if (!getPhotoData()) {
    el('photoError').textContent = 'Please take or upload a photo.';
    ok = false;
  } else {
    el('photoError').textContent = '';
  }
  return ok;
}

async function copyHTML() {
  const status = el('copyStatus');
  if (!validate()) {
    status.textContent = 'Please fix the errors above first.';
    return;
  }
  const html = buildCard(getValues(), false);
  try {
    await navigator.clipboard.writeText(html);
    status.textContent = 'Copied! Now paste it into index.html.';
  } catch (e) {
    const temp = document.createElement('textarea');
    temp.value = html;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
    status.textContent = 'Copied! Now paste it into index.html.';
  }
}

fields.forEach(f => {
  el(f).addEventListener('input', renderPreview);
  el(f).addEventListener('change', renderPreview);
});
document.addEventListener('photochange', renderPreview);
el('copyBtn').addEventListener('click', copyHTML);
renderPreview();
