const quizContent = document.querySelector('#quiz-content');
const quizProgressLabel = document.querySelector('#quiz-progress-label');
const quizProgress = document.querySelector('#quiz-progress');
const quizScore = document.querySelector('#quiz-score');
let quizQuestionIndex = 0;
let quizCorrectAnswers = 0;
let quizSubmitted = false;

function updateQuizProgress(label, value) {
  quizProgressLabel.textContent = label;
  quizProgress.value = value;
  quizScore.textContent = `Score: ${quizCorrectAnswers}`;
}

function renderQuizQuestion() {
  const question = window.cQuizQuestions[quizQuestionIndex];
  quizSubmitted = false;
  updateQuizProgress(`Question ${quizQuestionIndex + 1} of ${window.cQuizQuestions.length}`, quizQuestionIndex + 1);

  const heading = document.createElement('h2');
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
  const heading = document.createElement('h2');
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

quizProgress.max = window.cQuizQuestions.length;
renderQuizQuestion();
