const studentProfiles = [
  {
    name: 'Kulavardhini Sarvadha DK',
    photo: 'images/kulavardhini-sarvadha.jpeg',
    skills: ['HTML', 'CSS', 'JavaScript', 'Data Science', 'Python'],
    interests: ['cooking', 'travelling', 'painting', 'planting'],
    bio: 'A first-year Data Science student interested in technology and programming, with a goal of becoming a Data Scientist.',
    profileId: 'kulavardhini-sarvadha-dk'
  },
  {
    name: 'Arsalan War',
    photo: 'images/arsalan-war.jpeg',
    skills: ['C', 'HTML', 'Data'],
    interests: ['coding', 'learning new things'],
    bio: 'A first-year Data Science student learning C programming and web technologies.',
    profileId: 'arsalan-war'
  },
  {
    name: 'Shivaani',
    photo: 'images/SHIVAANI.jpeg',
    skills: ['Python', 'C'],
    interests: ['dancing', 'building things', 'learning by experimenting'],
    bio: 'A BCA student who enjoys turning ideas into little things for the web.',
    profileId: 'shivaani'
  },
  {
    name: 'Khalid Saifullah',
    photo: 'images/khalid.jpg',
    skills: ['C', 'HTML', 'CSS', 'DSA'],
    interests: ['cricket', 'travelling'],
    bio: 'A first-year Data Science student learning programming and hoping to solve real-world problems with technology.',
    profileId: 'khalid-saifullah'
  },
  {
    name: 'DEVI PRASAD H',
    photo: 'images/DEVI PRASAD H.jpeg',
    skills: ['C', 'HTML', 'CSS', 'DSA'],
    interests: ['cooking', 'travelling'],
    bio: 'A first-year Data Science student interested in programming and becoming a Data Scientist.',
    profileId: 'devi-prasad-h'
  },
  {
    name: 'Chinmayee.Bs',
    photo: 'images/chinmayee..png',
    skills: ['C', 'HTML', 'CSS', 'DSA'],
    interests: ['cooking', 'travelling', 'learning new things'],
    bio: 'A first-year Data Science student interested in programming and solving real-world problems.',
    profileId: 'chinmayee-bs'
  },
  {
    name: 'Kirrthana',
    photo: 'images/kirrthana.jpeg',
    skills: ['C', 'HTML', 'CSS', 'DSA'],
    interests: ['cooking', 'travelling', 'listening to music'],
    bio: 'A first-year Data Science student interested in technology and programming.',
    profileId: 'kirrthana'
  },
  {
    name: 'Harshitha B',
    photo: 'images/harshithab.jpeg',
    skills: ['HTML', 'CSS', 'Python', 'C'],
    interests: ['building things', 'collaborating', 'brainstorming ideas'],
    bio: 'Enjoys building solutions that make people’s lives easier and exploring the tech world.',
    profileId: 'harshitha-b'
  },
  {
    name: 'Vishal',
    photo: 'images/vish.jpeg',
    skills: ['HTML', 'vibe-coding', 'video editing'],
    interests: ['reading', 'making things for the web'],
    bio: 'A BCA student turning ideas into little things for the internet.',
    profileId: 'vishal'
  },
  {
    name: 'Pallavi Kumari',
    photo: 'images/Pallavi.jpg',
    skills: ['UI Design', 'CSS', 'Art'],
    interests: ['exploring', 'making the internet more beautiful'],
    bio: 'A BCA student who loves making the internet a little more beautiful, one pixel at a time.',
    profileId: 'pallavi-kumari'
  },
  {
    name: 'Vandhana V',
    photo: 'images/vandhana.jpeg',
    skills: ['C', 'JavaScript'],
    interests: ['listening to music', 'exploring new places', 'learning new technologies'],
    bio: 'A BCA student who enjoys music, exploring new places, and learning new technologies.',
    profileId: 'vandhana-v'
  },
  {
    name: 'Raghavi J Naik',
    photo: 'images/RAGH.jpeg',
    skills: ['Python', 'HTML', 'quick learning', 'research and analysis'],
    interests: ['exploring machine learning', 'collecting campus memories'],
    bio: 'A BCA student exploring machine learning and collecting campus memories.',
    profileId: 'raghavi-j-naik'
  },
  {
    name: 'Yashwanth V',
    photo: 'images/Yashu.jpeg',
    skills: ['Java', 'HTML', 'Python', 'Mathematics'],
    interests: ['robotics', 'Artificial Intelligence', 'Data Science'],
    bio: 'A BCA student passionate about coding, new technologies, and exploring how robots think.',
    profileId: 'yashwanth-v'
  },
  {
    name: 'Umme Fiza',
    photo: 'images/fiza.jpeg',
    skills: ['Python', 'HTML', 'CSS'],
    interests: ['exploring technologies', 'collecting campus memories'],
    bio: 'A BCA student exploring technologies and collecting campus memories.',
    profileId: 'umme-fiza'
  },
  {
    name: 'Prem',
    photo: 'images/Prem.jpeg',
    skills: ['JavaScript', 'React'],
    interests: ['singing', 'making things for the web'],
    bio: 'Enjoys turning coffee into code and ideas into little things for the web.',
    profileId: 'prem'
  },
  {
    name: 'Hemasri S',
    photo: 'images/hemasri.jpeg',
    skills: ['HTML', 'CSS', 'C'],
    interests: ['exploring new ideas', 'creative projects', 'learning by doing'],
    bio: 'Loves exploring new ideas, turning curiosity into creativity, and learning by doing.',
    profileId: 'hemasri-s'
  },
  {
    name: 'Suraj Das',
    photo: 'images/suraj-das.jpg',
    skills: ['JavaScript', 'CSS', 'Art'],
    interests: ['making the internet more beautiful'],
    bio: 'A BCA student who enjoys making the internet a little more beautiful, one pixel at a time.',
    profileId: 'suraj-das'
  },
  {
    name: 'Rakshita N',
    photo: 'images/rakshi.jpeg',
    skills: ['HTML', 'CSS', 'Canva design', 'video and reel editing'],
    interests: ['coding', 'AI', 'creative content'],
    bio: 'A BCA student exploring coding, AI, and creative content who loves experimenting with new ideas.',
    profileId: 'rakshita-n'
  }
];

const totalRounds = 5;
const gameContent = document.querySelector('#game-content');
const roundLabel = document.querySelector('#round-label');
const roundProgress = document.querySelector('#round-progress');
const gameScore = document.querySelector('#game-score');
let rounds = [];
let roundIndex = 0;
let score = 0;
let streak = 0;
let answerSubmitted = false;

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function startGame() {
  const eligibleProfiles = studentProfiles.filter(profile =>
    profile.name && profile.photo && profile.skills.length + profile.interests.length > 0
  );
  const distinctProfiles = [...new Map(eligibleProfiles.map(profile => [profile.profileId, profile])).values()];

  if (distinctProfiles.length < totalRounds || new Set(distinctProfiles.map(profile => profile.name)).size < 4) {
    roundLabel.textContent = 'Game unavailable';
    roundProgress.value = 0;
    gameContent.replaceChildren();
    const message = document.createElement('p');
    message.className = 'game-unavailable';
    message.textContent = 'We need at least five complete student profiles to make a five-round game. Please check back after more classmates add their profiles.';
    gameContent.append(message);
    return;
  }

  rounds = shuffle(distinctProfiles).slice(0, totalRounds);
  roundIndex = 0;
  score = 0;
  streak = 0;
  renderRound();
}

function renderRound() {
  answerSubmitted = false;
  const student = rounds[roundIndex];
  roundLabel.textContent = `Round ${roundIndex + 1} of ${totalRounds}`;
  roundProgress.value = roundIndex + 1;
  gameScore.textContent = `Score: ${score}|Streak: ${streak}`;

  const heading = document.createElement('h2');
  heading.className = 'game-question';
  heading.textContent = 'Who might this classmate be?';

  const clueList = document.createElement('dl');
  clueList.className = 'student-clues';
  const clues = [
    ['A little about me', student.bio],
    ['Skills', student.skills.join(' · ')],
    ['Interests', student.interests.join(' · ')]
  ];
  for (const [label, value] of clues) {
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    description.textContent = value;
    clueList.append(term, description);
  }

  const form = document.createElement('form');
  form.className = 'game-form';
  const options = document.createElement('fieldset');
  options.className = 'game-options';
  const legend = document.createElement('legend');
  legend.textContent = 'Choose one of these classmates';
  options.append(legend);

  const choices = shuffle([
    student,
    ...shuffle(rounds.filter(profile => profile.profileId !== student.profileId)).slice(0, 3)
  ]);
  choices.forEach((profile, index) => {
    const label = document.createElement('label');
    label.className = 'game-option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'student';
    input.value = profile.profileId;
    input.required = true;
    const optionText = document.createElement('span');
    optionText.textContent = profile.name;
    label.append(input, optionText);
    options.append(label);
  });

  const submit = document.createElement('button');
  submit.className = 'game-button';
  submit.type = 'submit';
  submit.textContent = 'Lock in my guess';
  submit.disabled = true;
  form.append(options, submit);
  gameContent.replaceChildren(heading, clueList, form);
}

function submitAnswer(form) {
  if (answerSubmitted) return;
  const selected = new FormData(form).get('student');
  if (selected === null) return;

  answerSubmitted = true;
  const student = rounds[roundIndex];
  const correct = selected === student.profileId;
  if (correct){score++;streak++;}else{streak=0;}
  gameScore.textContent = `Score: ${score}|Streak: ${streak}`;

  for (const option of gameContent.querySelectorAll('.game-option')) {
    const input = option.querySelector('input');
    input.disabled = true;
    if (input.value === student.profileId) option.classList.add('correct');
    if (input.checked && !correct) option.classList.add('incorrect');
  }
  form.querySelector('button[type="submit"]').disabled = true;

  const feedback = document.createElement('div');
  feedback.className = `game-feedback ${correct ? 'correct' : 'incorrect'}`;
  feedback.setAttribute('role', 'status');
  const status = document.createElement('strong');
  status.textContent = correct ? 'That’s right! Nice one.' : 'Good guess! Here’s who it is.';
  const reveal = document.createElement('div');
  reveal.className = 'student-reveal';
  const photo = document.createElement('img');
  photo.src = student.photo;
  photo.alt = `${student.name}`;
  photo.width = 88;
  photo.height = 88;
  const details = document.createElement('div');
  const name = document.createElement('h3');
  name.textContent = student.name;
  const diary = document.createElement('a');
  diary.className = 'diary-link';
  diary.href = `index.html?profile=${encodeURIComponent(student.profileId)}`;
  diary.textContent = 'Get to know them — read their diary ↗';
  details.append(name, diary);
  reveal.append(photo, details);
  feedback.append(status, reveal);

  const next = document.createElement('button');
  next.className = 'game-button';
  next.type = 'button';
  next.textContent = roundIndex === totalRounds - 1 ? 'See my score' : 'Next classmate';
  next.addEventListener('click', () => {
    roundIndex++;
    if (roundIndex === totalRounds) showResults();
    else renderRound();
  });
  gameContent.append(feedback, next);
  next.focus();
}

function showResults() {
  roundLabel.textContent = 'Game complete';
  roundProgress.value = totalRounds;
  gameScore.textContent = `Score: ${score}`;

  const result = document.createElement('div');
  result.className = 'game-result';
  const heading = document.createElement('h2');
  heading.textContent = `You got ${score} out of ${totalRounds}!`;
  const message = document.createElement('p');
  message.textContent = score === totalRounds
    ? 'Perfect score! You really know your classmates.'
    : score >= 3
      ? 'Lovely work — you’re getting to know your community.'
      : 'Every new face is a chance to connect. Play again and discover more classmates!';
  const playAgain = document.createElement('button');
  playAgain.className = 'game-button';
  playAgain.type = 'button';
  playAgain.textContent = 'Play Again';
  playAgain.addEventListener('click', startGame);
  result.append(heading, message, playAgain);
  gameContent.replaceChildren(result);
  playAgain.focus();
}

gameContent.addEventListener('change', event => {
  if (event.target.matches('input[name="student"]')) {
    gameContent.querySelector('button[type="submit"]').disabled = false;
  }
});

gameContent.addEventListener('submit', event => {
  if (!event.target.matches('.game-form')) return;
  event.preventDefault();
  submitAnswer(event.target);
});

startGame();
