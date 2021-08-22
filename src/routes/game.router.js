const express = require('express');
const Game = require('../models/game.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');
const Result = require('../models/result.model');

const router = express.Router();

router.get('/', async (req, res) => {
  const game = await Game.random();
  const gameId = game._id;
  const result = await Result.create({ gameStartedAt: Date.now() });
  const resultId = result._id;
  const question = await Question.findOne({
    $and: [{ game: gameId }, { money: 500 }],
  });
  const questionText = question.text;
  const questionId = question.id;
  const answers = await Answer.find({ question: questionId });
  const answer1 = answers[0].text;
  const answer2 = answers[1].text;
  const answer3 = answers[2].text;
  const answer4 = answers[3].text;
  const answerId1 = answers[0]._id;
  const answerId2 = answers[1]._id;
  const answerId3 = answers[2]._id;
  const answerId4 = answers[3]._id;
  res.render('pages/game-page', {
    gameId,
    questionText,
    questionId,
    answer1,
    answer2,
    answer3,
    answer4,
    answerId1,
    answerId2,
    answerId3,
    answerId4,
    resultId,
  });
});

router.patch('/:resultId/help/:helperName', async (req, res) => {
  const resultId = req.params.resultId;
  const questionId = req.body.questionId;
  const helperName = req.params.helperName;
  const currentResult = await Result.findById(resultId);
  const currentHelper = currentResult.helperName;
  if (currentHelper) {
    return res.json({ msg: 'Подсказка уже использована' });
  } else {
    let helper;
    let answersToSplit;
    let chosenByAudience;
    switch (helperName) {
      case 'isUsedFiftyFifty':
        helper = await Result.findByIdAndUpdate(
          resultId,
          { isUsedFiftyFifty: true },
          { new: true }
        );
        answersToSplit = await Answer.random(questionId);
        break;
      case 'helper':
        break;
      case 'isUsedAudienceHelp':
        helper = await Result.findByIdAndUpdate(
          resultId,
          { isUsedAudienceHelpisUsedAudienceHelp: true },
          { new: true }
        );
        chosenByAudience = await Answer.chooseRandom(questionId);
        break;
    }
    return res.json({ msg: 'Обновлено', helper, answersToSplit, chosenByAudience });
  }
});

router.patch('/:questionId/answer/:answerId', async (req, res) => {
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;
  const currentQuestion = await Question.findById(questionId);
  const money = currentQuestion.money;
  const answer = await Answer.findById(answerId);
  const questions = await Question.find();
  const nextQuestionsList = questions.reduce((acc, el) => {
    if (el.money > money) {
      acc.push(el);
      return acc;
    }
    return acc;
  }, []);
  const nextQuestion = nextQuestionsList[0];
  const nextQuestionId = nextQuestionsList[0]._id;

  const nextAnswersList = await Answer.find({ question: nextQuestionId });

  if (answer.isCorrect)
    return res.json({
      answer: answer,
      currentQuestion: currentQuestion,
      nextAnswersList: nextAnswersList,
      nextQuestion: nextQuestion,
    });
  else {
    const correctAnswer = await Answer.findOne({
      $and: [{ question: questionId }, { isCorrect: true }],
    });
    return res.json({ correctAnswer: correctAnswer, currentQuestion: currentQuestion });
  }
});
module.exports = router;
