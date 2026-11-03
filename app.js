const grid = document.querySelector('#grid');
const projectGrid = document.querySelector('#project-grid');
const modal = document.querySelector('#modal');
const content = document.querySelector('#modal-content');
const search = document.querySelector('#search');
const cards = [...grid.querySelectorAll('.card')];
const quoteButton = document.querySelector('#quote-button');
const quoteOutput = document.querySelector('#coding-quote');
const shareStatus = document.querySelector('#share-status');
const quizContent = document.querySelector('#quiz-content');
const quizProgressLabel = document.querySelector('#quiz-progress-label');
const quizProgress = document.querySelector('#quiz-progress');
const quizScore = document.querySelector('#quiz-score');
const codingQuotes = [
  'It works on my machine is not a deployment strategy.',
  'Every expert was once a beginner who refused to give up.',
  'A bug is just an unexpected feature with excellent timing.',
  'Keep calm and check the console.',
  'The best code is the code you understand tomorrow.',
  'First, solve the problem. Then, write the code.',
  'Programming: turning coffee into errors, then into solutions.',
  'Small commits can lead to big ideas.',
  'There are 10 kinds of people: those who understand binary and those who do not.',
  'You do not have to be perfect. You just have to keep debugging.'
];
let previousQuoteIndex = -1;
let filter = 'All';
let shareStatusTimer;
let quizQuestionIndex = 0;
let quizCorrectAnswers = 0;
let quizSubmitted = false;

function renderProjects() {
  for (const project of projectIdeas) {
    const card = document.createElement('article');
    card.className = 'project-card';

    const status = document.createElement('span');
    status.className = `project-status ${project.status === 'Completed' ? 'completed' : ''}`;
    status.textContent = project.status;

    const heading = document.createElement('h3');
    heading.textContent = project.title;

    const description = document.createElement('p');
    description.textContent = project.description;

    const creator = document.createElement('p');
    creator.className = 'project-creator';
    creator.textContent = `Creator: ${project.creator}`;

    const welcome = document.createElement('span');
    welcome.className = 'beginner-tag';
    welcome.textContent = 'Beginners welcome';

    const skillsLabel = document.createElement('h4');
    skillsLabel.textContent = 'Skills to practise';

    const skills = document.createElement('div');
    skills.className = 'project-skills';
    for (const skill of project.skills) {
      const tag = document.createElement('span');
      tag.textContent = skill;
      skills.append(tag);
    }

    card.append(status, heading, description, creator, welcome, skillsLabel, skills);

    if (project.status === 'Completed' && project.teamCredits && project.projectUrl) {
      const credits = document.createElement('p');
      credits.className = 'project-credits';
      credits.textContent = `Team credits: ${project.teamCredits.join(', ')}`;

      const projectLink = document.createElement('a');
      projectLink.className = 'project-link';
      projectLink.href = project.projectUrl;
      projectLink.target = '_blank';
      projectLink.rel = 'noopener noreferrer';
      projectLink.textContent = `${project.projectUrlLabel || 'View project'} ↗`;

      card.append(credits, projectLink);
    }

    const discussionLink = document.createElement('a');
    discussionLink.className = 'project-link';
    discussionLink.href = project.discussionUrl;
    discussionLink.target = '_blank';
    discussionLink.rel = 'noopener noreferrer';
    discussionLink.textContent = 'Express interest on GitHub Discussions ↗';
    card.append(discussionLink);

    projectGrid.append(card);
  }
}

function updateQuizProgress(label, value) {
  quizProgressLabel.textContent = label;
  quizProgress.value = value;
  quizScore.textContent = `Score: ${quizCorrectAnswers}`;
}

function renderQuizQuestion() {
  const question = window.cQuizQuestions[quizQuestionIndex];
  quizSubmitted = false;
  updateQuizProgress(`Question ${quizQuestionIndex + 1} of ${window.cQuizQuestions.length}`, quizQuestionIndex + 1);

  const heading = document.createElement('h3');
  heading.className = 'quiz-question';
  heading.textContent = question.question;

  const code = document.createElement('pre');
  code.className = 'quiz-code';
  const codeText = document.createElement('code');
  codeText.textContent = question.code;
  code.append(codeText);

  const form = document.createElement('form');
  form.className = 'quiz-form';
  const options = document.createElement('fieldset');
  options.className = 'quiz-options';
  const legend = document.createElement('legend');
  legend.textContent = 'Choose one answer';
  options.append(legend);

  question.options.forEach((option, index) => {
    const label = document.createElement('label');
    label.className = 'quiz-option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.value = String(index);
    input.required = true;
    const optionText = document.createElement('span');
    optionText.textContent = option;
    label.append(input, optionText);
    options.append(label);
  });

  const submit = document.createElement('button');
  submit.className = 'quiz-submit';
  submit.type = 'submit';
  submit.textContent = 'Submit answer';
  submit.disabled = true;
  form.append(options, submit);
  quizContent.replaceChildren(heading, code, form);
}

function showQuizResults() {
  const total = window.cQuizQuestions.length;
  const message = quizCorrectAnswers === total
    ? 'Perfect score! You have the basics down—keep it up!'
    : quizCorrectAnswers >= Math.ceil(total * 0.6)
      ? 'Great work! Keep practising and you will get even more confident.'
      : 'Nice start! Every question is a chance to learn. Try again to improve your score.';

  updateQuizProgress('Quiz complete', total);
  const result = document.createElement('div');
  result.className = 'quiz-result';
  const heading = document.createElement('h3');
  heading.textContent = `You scored ${quizCorrectAnswers} out of ${total}`;
  const encouragement = document.createElement('p');
  encouragement.textContent = message;
  const retry = document.createElement('button');
  retry.className = 'quiz-submit';
  retry.type = 'button';
  retry.textContent = 'Try Again';
  retry.addEventListener('click', () => {
    quizQuestionIndex = 0;
    quizCorrectAnswers = 0;
    renderQuizQuestion();
  });
  result.append(heading, encouragement, retry);
  quizContent.replaceChildren(result);
}

quizContent.addEventListener('change', event => {
  if (event.target.matches('input[name="answer"]')) {
    quizContent.querySelector('button[type="submit"]').disabled = false;
  }
});

quizContent.addEventListener('submit', event => {
  if (!event.target.matches('.quiz-form')) return;
  event.preventDefault();
  if (quizSubmitted) return;

  const question = window.cQuizQuestions[quizQuestionIndex];
  const selectedValue = new FormData(event.target).get('answer');
  if (selectedValue === null) return;
  const selectedAnswer = Number(selectedValue);
  if (!Number.isInteger(selectedAnswer)) return;
  quizSubmitted = true;
  event.target.querySelector('button[type="submit"]').disabled = true;
  const isCorrect = selectedAnswer === question.correctAnswer;
  if (isCorrect) quizCorrectAnswers++;
  quizScore.textContent = `Score: ${quizCorrectAnswers}`;

  for (const option of quizContent.querySelectorAll('.quiz-option')) {
    const input = option.querySelector('input');
    input.disabled = true;
    if (Number(input.value) === question.correctAnswer) option.classList.add('correct');
    if (input.checked && !isCorrect) option.classList.add('incorrect');
  }

  const feedback = document.createElement('div');
  feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  feedback.setAttribute('role', 'status');
  const answerStatus = document.createElement('strong');
  answerStatus.textContent = isCorrect ? 'Correct!' : 'Not quite.';
  const answerDetails = document.createElement('p');
  answerDetails.textContent = `Correct answer: ${question.options[question.correctAnswer]}. ${question.explanation}`;
  feedback.append(answerStatus, answerDetails);

  const next = document.createElement('button');
  next.className = 'quiz-submit';
  next.type = 'button';
  next.textContent = quizQuestionIndex === window.cQuizQuestions.length - 1 ? 'See my results' : 'Next question';
  next.addEventListener('click', () => {
    quizQuestionIndex++;
    if (quizQuestionIndex === window.cQuizQuestions.length) showQuizResults();
    else renderQuizQuestion();
  });
  quizContent.append(feedback, next);
});

renderProjects();
renderQuizQuestion();

const profileCounts = new Map();
cards.forEach((card, index) => {
  const name = card.querySelector('h3').textContent.trim();
  const baseId = name.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    || `student-${index + 1}`;
  const count = profileCounts.get(baseId) || 0;
  profileCounts.set(baseId, count + 1);
  card.dataset.profileId = count ? `${baseId}-${count + 1}` : baseId;
});


function render() {
  const query = search.value.toLowerCase().trim();
  let visibleCount = 0;

  for (const card of cards) {
    const matchesCourse = filter === 'All' || card.dataset.course === filter;
    const matchesSearch = card.textContent.toLowerCase().includes(query);
    card.hidden = !matchesCourse || !matchesSearch;
    if (!card.hidden) visibleCount++;
  }

  document.querySelector('#empty').hidden = visibleCount > 0;
}

function showProfile(card) {
  const image = card.querySelector('.portrait img').cloneNode();
  const name = card.querySelector('h3').textContent;
  const course = card.dataset.course;
  const year = card.querySelector('.year').textContent;
  const story = card.querySelector('.story').textContent;

  content.replaceChildren(image);
  const heading = document.createElement('h2');
  heading.textContent = name;
  const details = document.createElement('p');
  details.textContent = `${course} · ${year}`;
  const diary = document.createElement('p');
  diary.textContent = story;
  const actions = document.createElement('div');
  actions.className = 'profile-actions';

  const shareButton = document.createElement('button');
  shareButton.type = 'button';
  shareButton.className = 'profile-action share-native';
  shareButton.textContent = 'Share profile';
  shareButton.addEventListener('click', () => shareProfile(card));
  actions.append(shareButton);

  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.className = 'profile-action copy-profile-link';
  copyButton.textContent = 'Copy link';
  copyButton.addEventListener('click', () => copyProfileLink(profileUrl(card)));
  actions.append(copyButton);

  content.append(heading, details, diary, actions);
  modal.showModal();
}

function profileUrl(card) {
  const url = new URL(window.location.href);
  url.searchParams.set('profile', card.dataset.profileId);
  url.hash = '';
  return url.href;
}

function showShareStatus(message) {
  shareStatus.textContent = message;
  shareStatus.classList.add('visible');
  window.clearTimeout(shareStatusTimer);
  shareStatusTimer = window.setTimeout(() => {
    shareStatus.classList.remove('visible');
  }, 4000);
}

function legacyCopy(text) {
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.left = '-9999px';
  document.body.append(input);
  input.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  } finally {
    input.remove();
  }
  return copied;
}

function showManualCopyLink(url) {
  let input = content.querySelector('.copy-fallback input');
  if (!input) {
    const label = document.createElement('label');
    label.className = 'copy-fallback';
    label.textContent = 'Profile link';
    input = document.createElement('input');
    input.type = 'url';
    input.readOnly = true;
    input.setAttribute('aria-label', 'Profile link to copy');
    label.append(input);
    content.append(label);
  }
  input.value = url;
  input.focus();
  input.select();
}

async function copyProfileLink(url) {
  let copied = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch {
      copied = legacyCopy(url);
    }
  } else {
    copied = legacyCopy(url);
  }

  if (copied) {
    showShareStatus('Profile link copied to clipboard.');
  } else {
    showManualCopyLink(url);
    showShareStatus('Copy was blocked. Select and copy the profile link shown in the diary.');
  }
}

async function shareProfile(card) {
  const name = card.querySelector('h3').textContent.trim();
  const url = profileUrl(card);
  if (typeof navigator.share !== 'function') {
    await copyProfileLink(url);
    return;
  }

  try {
    await navigator.share({
      title: `${name} | College Diaries`,
      text: `Read ${name}'s diary on College Diaries.`,
      url
    });
  } catch (error) {
    if (error && error.name === 'AbortError') return;
    await copyProfileLink(url);
  }
}

function showGuide() {
  content.innerHTML = `<div class="eyebrow">CONTRIBUTION GUIDE</div>
    <h2>Add your own diary.</h2>
    <p>Add one HTML card to the students section. No JSON or JavaScript edits are needed.</p>
    <ol>
      <li>Fork and clone the class GitHub repository.</li>
      <li>Create a branch: <code>git switch -c profile/your-name</code></li>
      <li>Open <code>index.html</code> and copy a student card inside the <code>id="grid"</code> section. Change the name, course, year, introduction, skills and diary story.</li>
      <li>Add your photo at <code>images/your-name.jpg</code> and update the card's image path.</li>
      <li>Run the website locally and check your profile.</li>
      <li>Commit and push your changes, then open a pull request to your teacher's repository. Include a screenshot.</li>
    </ol>
    <pre>git add index.html images/your-name.jpg
git commit -m "Add my student profile"
git push -u origin profile/your-name</pre>
    <p>The teacher reviews and merges each contribution.</p>`;
  modal.showModal();
}

search.addEventListener('input', render);
quoteButton.addEventListener('click', () => {
  const availableQuotes = codingQuotes
    .map((quote, index) => ({ quote, index }))
    .filter(({ index }) => index !== previousQuoteIndex);
  const nextQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  previousQuoteIndex = nextQuote.index;
  quoteOutput.textContent = nextQuote.quote;
});
document.querySelector('#filters').addEventListener('click', event => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  filter = button.dataset.filter;
  document.querySelectorAll('#filters button').forEach(item => {
    item.classList.toggle('active', item === button);
  });
  render();
});
grid.addEventListener('click', event => {
  const button = event.target.closest('.view');
  if (button) showProfile(button.closest('.card'));
});
document.querySelector('#guide').addEventListener('click', showGuide);
document.querySelector('#guide2').addEventListener('click', showGuide);
document.querySelector('.close').addEventListener('click', () => modal.close());

const requestedProfile = new URLSearchParams(window.location.search).get('profile');
if (requestedProfile) {
  const requestedCard = cards.find(card => card.dataset.profileId === requestedProfile);
  if (requestedCard) showProfile(requestedCard);
}

/* College Diaries - dark mode toggle (upgraded)
   Add just before </body>:  <script src="theme-toggle.js"></script>

   What it does:
   - Starts in the visitor's saved choice, else their device setting
   - Toggles the class "dark-mode" on <html>
   - Updates the button label + aria-pressed
   - Remembers the choice between visits
   - Follows device changes until the visitor picks manually
   - Syncs across open tabs
*/
(function () {
  "use strict";

  var root = document.documentElement;
  var KEY = "theme";
  var CLASS = "dark-mode";
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function getSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) {}
  }

  function initialTheme() {
    return getSaved() || (media && media.matches ? "dark" : "light");
  }

  var button = document.getElementById("theme-toggle");

  // No button in the HTML? Create a floating one.
  if (!button) {
    button = document.createElement("button");
    button.id = "theme-toggle";
    button.type = "button";
    button.className = "floating";
    document.body.appendChild(button);
  }

  function apply(theme) {
    var isDark = theme === "dark";
    root.classList.toggle(CLASS, isDark);

    // Label shows what clicking will do
    button.textContent = isDark ? "\u2600\uFE0F Light mode" : "\uD83C\uDF19 Dark mode";
    button.setAttribute("aria-pressed", String(isDark));

    // Mobile browser bar color (optional nicety)
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = isDark ? "#121212" : "#ffffff";
  }

  apply(initialTheme());

  button.addEventListener("click", function () {
    var next = root.classList.contains(CLASS) ? "light" : "dark";
    apply(next);
    save(next);
  });

  // Follow the device only while the visitor hasn't chosen manually
  if (media) {
    var onSystemChange = function (e) {
      if (!getSaved()) apply(e.matches ? "dark" : "light");
    };
    if (media.addEventListener) media.addEventListener("change", onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange); // older Safari
  }

  // Keep other open tabs of the site in sync
  window.addEventListener("storage", function (e) {
    if (e.key === KEY && e.newValue) apply(e.newValue);
  });

  // Turn on transitions after first paint so the page doesn't animate on load
  requestAnimationFrame(function () { root.classList.add("theme-ready"); });
})();