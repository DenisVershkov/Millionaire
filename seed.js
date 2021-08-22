/* eslint-disable no-trailing-spaces */
const { connect, disconnect } = require('./src/db/index');
const fs = require('fs').promises;
const Question = require('./src/models/question.model');
const Game = require('./src/models/game.model');
const Answer = require('./src/models/answer.model');
const Helper = require('./src/models/helper.model');
const questionsList = './Q&A/questions.json';
const answersList = './Q&A/answers.json';
const helpersList = './Q&A/helpers.json';

const mongoose = require('mongoose');

seed().then(() => disconnect());

async function seed() {
  connect();
  const questionsJson = await getInfo(questionsList);
  const parsedQuestions = JSON.parse(questionsJson);
  const answersJson = await getInfo(answersList);
  const parsedAnswers = JSON.parse(answersJson);
  const helpersJson = await getInfo(helpersList);
  const parsedHelpers = JSON.parse(helpersJson);

  const gamesId = await seedGames(parsedQuestions);

  const questionsId = await seedQuestions(gamesId, parsedQuestions);

  await seedAnswers(questionsId, parsedAnswers);

  await Promise.all(parsedHelpers.map((item) => Helper.create(item)));
}

async function getInfo(filePath) {
  const info = await fs.readFile(filePath, 'utf-8');
  return info;
}

async function seedGames(questions) {
  const arrayToCreateGames = [];
  for (let i = 0; i <= questions.length; i += 16) {
    arrayToCreateGames.push(1);
  }
  const allGamesId = [];
  for (let item of arrayToCreateGames) {
    const gameId = mongoose.Types.ObjectId();
    await Game.create({ _id: gameId });
    allGamesId.push(gameId);
  }
  return allGamesId;
}

async function seedQuestions(gamesId, parsedQuestions) {
  let indexOfGamesId = 0;
  let indexOfQuestion = 0;
  const allQuestionId = [];

  for (const item of parsedQuestions) {
    const questionId = mongoose.Types.ObjectId();
    await Question.create({ ...item, _id: questionId, game: gamesId[indexOfGamesId] });
    indexOfQuestion += 1;
    allQuestionId.push(questionId);
    if ((indexOfQuestion + 1) % 16 === 0) indexOfGamesId += 1;
  }
  return allQuestionId;
}

async function seedAnswers(questionsId, parsedAnswers) {
  let indexOfQusetionId = 0;
  let indexOfAnswer = 0;

  for (const item of parsedAnswers) {
    await Answer.create({ ...item, question: questionsId[indexOfQusetionId] });
    if ((indexOfAnswer + 1) % 4 === 0) indexOfQusetionId += 1;
    indexOfAnswer += 1;
  }
}
