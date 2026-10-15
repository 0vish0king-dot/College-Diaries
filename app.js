const grid = document.querySelector('#grid');
const modal = document.querySelector('#modal');
const content = document.querySelector('#modal-content');
const search = document.querySelector('#search');
const cards = [...grid.querySelectorAll('.card')];
let filter = 'All';

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
  content.append(heading, details, diary);
  modal.showModal();
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
