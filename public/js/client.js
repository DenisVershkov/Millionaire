const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const navbar = document.getElementById('navbar');
const formLogin = document.getElementById('formLogin');

const gameContainer = document.querySelector('.game-wrapper');

gameContainer?.addEventListener('click', async (e) => {
  e.preventDefault();
  const questionContainer = document.querySelector('.questions');
  const questionId = questionContainer.id;
  if (
    e.target.dataset.name === 'answer1' ||
    e.target.dataset.name === 'answer2' ||
    e.target.dataset.name === 'answer3' ||
    e.target.dataset.name === 'answer4'
  ) {
    e.target.className = 'quest-and-ans answer answer-pending';
    const container = e.target;
    await makeAction(e, container);
  }
  if (e.target.className === 'quest-and-ans answer-text') {
    const child = e.target;
    const parent = child.closest('[data-name]');
    parent.className = 'quest-and-ans answer answer-pending';
    await makeAction(e, parent);
  }
  if (
    e.target.className === 'game-header-row split' ||
    e.target.className === 'game-header-row call' ||
    e.target.className === 'game-header-row audience'
  ) {
    help(e, questionId);
  }
});

async function makeAction(e, container) {
  const questionContainer = document.querySelector('.questions');
  const questionId = questionContainer.id;
  const gameId = gameContainer.id;
  const answerId = container.id;
  const response = await fetch(`/${questionId}/answer/${answerId}`, {
    method: 'PATCH',
  });
  const data = await response.json();
  if (data?.answer?.isCorrect) {
    const scoreTable = document.querySelector('.game-score');
    setTimeout(() => (container.className = 'quest-and-ans answer answer-resolved'), 1000);

    setTimeout(() => {
      const money = data.currentQuestion.money;
      const questionNumberEl = document.getElementById(`question-${money}`);
      const scoreEl = document.getElementById(`money-${money}`);
      questionNumberEl.className = 'color';
      scoreEl.className = 'color';
      scoreTable.className = 'game-score show-score';
    }, 1500);

    setTimeout(() => {
      scoreTable.className = 'game-score';
      const nextAnswersList = data.nextAnswersList;
      const nextQuestion = data.nextQuestion;
      const question = data.nextQuestion;
      const qestAndAnsContainer = document.querySelector('.quest-and-ans-col');
      const qestAndAnsParent = qestAndAnsContainer.closest('.quest-and-ans');
      renderNextPage(
        qestAndAnsParent,
        qestAndAnsContainer,
        nextAnswersList,
        nextQuestion,
        gameContainer
      );
    }, 2500);
  } else if (!data.isCorrect) {
    const scoreTable = document.querySelector('.game-score');
    const gameOverContainer = document.querySelector('.game-over');
    await setTimeout(() => {
      const qestAndAnsParent = e.target.closest('[data-atr="answer"]');
      console.log(qestAndAnsParent);
      qestAndAnsParent.className = 'quest-and-ans answer answer-error';
      const correctAnswerId = data.correctAnswer._id;
      const correctAnswerContainer = document.getElementById(correctAnswerId);
      correctAnswerContainer.className = 'quest-and-ans answer answer-resolved';
    }, 1000);
    await setTimeout(() => {
      const money = data.currentQuestion.money;
      const questionNumberEl = document.getElementById(`question-${money}`);
      const scoreEl = document.getElementById(`money-${money}`);
      questionNumberEl.className = 'color';
      scoreEl.className = 'color';
      scoreTable.className = 'game-score show-score';
    }, 1500);
    setTimeout(() => {
      gameOverContainer.className = 'show';
    }, 2500);
  }
}

async function help(e, questionId) {
  const helperName = e.target.dataset.name;
  const resultId = gameContainer.dataset.resulid;
  const response = await fetch(`/${resultId}/help/${helperName}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questionId }),
  });
  const data = await response.json();
  if (data.msg === 'Обновлено') {
    const tmpClassName = e.target.className;
    e.target.className = `${tmpClassName} hide`;
    switch (helperName) {
      case 'isUsedFiftyFifty':
        const answerId1 = data.answersToSplit[0]._id;
        const answerId2 = data.answersToSplit[1]._id;
        document.getElementById(`${answerId1}`).className = `quest-and-ans answer hide`;
        document.getElementById(`${answerId2}`).className = `quest-and-ans answer hide`;
        break;
      case 'helper':
        break;
      case 'isUsedAudienceHelp':
        console.log(data.chosenByAudience);
        break;
    }
  }
}

function renderNextPage(
  qestAndAnsParent,
  qestAndAnsContainer,
  nextAnswersList,
  nextQuestion,
  gameContainer
) {
  const newHtml = `
  <div class="quest-and-ans-col">
  <div class="quest-and-ans questions-container">
    <div id="${nextQuestion._id}" class="quest-and-ans questions">
    <p class="quest-and-ans question-text">${nextQuestion.text}</p>
  </div>
  </div>
  <div class="quest-and-ans answers-container">
    <div class="quest-and-ans answers-row">
      <div id="${nextAnswersList[0]._id}" data-name="answer1" data-atr="answer" class="quest-and-ans answer">
        <span data-id="${nextAnswersList[0]._id}}" class="quest-and-ans answer-text">A: ${nextAnswersList[0].text}</span>
      </div>
      <div id="${nextAnswersList[1]._id}" data-name="answer2" data-atr="answer" class="quest-and-ans answer">
        <span data-id="${nextAnswersList[1]._id}" class="quest-and-ans answer-text">B: ${nextAnswersList[1].text}</span>
      </div>
    </div>
    <div class="quest-and-ans answers-row">
      <div id="${nextAnswersList[2]._id}" data-name="answer3" data-atr="answer" class="quest-and-ans answer">
        <span data-id="${nextAnswersList[2]._id}" class="quest-and-ans answer-text">C: ${nextAnswersList[2].text}</span>
      </div>
      <div  id="${nextAnswersList[3]._id}" data-name="answer4" data-atr="answer" class="quest-and-ans answer">
        <span data-id="${nextAnswersList[3]._id}" class="quest-and-ans answer-text">D: ${nextAnswersList[3].text}</span>
      </div>
    </div>
  </div>
</div>
  `;
  qestAndAnsContainer.remove();
  qestAndAnsParent.insertAdjacentHTML('afterbegin', newHtml);
}

// регистрация
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  checkInputs();
  if (form.querySelectorAll('.error').length === 0) {
    const formData = Object.fromEntries(new FormData(e.target));
    const response = await fetch('/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (response.redirected) {
      window.location = response.url;
    }
  }
});

formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (formLogin.querySelectorAll('.error').length === 0) {
    const formData = Object.fromEntries(new FormData(e.target));
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (response.redirected) {
      window.location = response.url;
    } else {
      const dataFromServer = await response.json();
      createErrorMessage(dataFromServer);
    }
  }
});

function createErrorMessage(data) {
  if (document.querySelector('.err')) {
    const a = document.querySelector('.err');
    a.className = 'login success';
  }
  const container = document.querySelector('.login');
  container.innerText = data.err;
  container.className = 'login err';
}
function checkInputs() {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();
  if (usernameValue === '') {
    setErrorFor(username, 'Username cannot be blank');
  } else {
    setSuccessFor(username);
  }
  if (emailValue === '') {
    setErrorFor(email, 'Email cannot be blank');
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, 'Not a valid email');
  } else {
    setSuccessFor(email);
  }
  if (passwordValue === '') {
    setErrorFor(password, 'Password cannot be blank');
  } else {
    setSuccessFor(password);
  }
  if (password2Value === '') {
    setErrorFor(password2, 'Password2 cannot be blank');
  } else if (passwordValue !== password2Value) {
    setErrorFor(password2, 'Passwords does not match');
  } else {
    setSuccessFor(password2);
  }
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector('small');
  formControl.className = 'form-control error';
  small.innerText = message;
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = 'form-control success';
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}
