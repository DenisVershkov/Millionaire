const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    reqired: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
});

answerSchema.statics.random = async function (questionId) {
  const count = await this.count();
  const rand = Math.floor(Math.random() * count);
  const randomDoc = await this.find({ question: questionId, isCorrect: false }).limit(2);
  return randomDoc;
};

answerSchema.statics.chooseRandom = async function (questionId) {
  const rand = Math.round(1 - 0.5 + Math.random() * (3 - 1 + 1));
  const randomDoc = await this.findOne({ question: questionId }).skip(rand);
  return randomDoc;
};

module.exports = mongoose.model('Answer', answerSchema);
