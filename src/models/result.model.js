const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  totalWin: {
    type: Number,
    default: 0,
  },
  gameStartedAt: {
    type: Date,
  },
  gameFinishedAt: {
    type: Date,
  },
  isUsedAudienceHelp: {
    type: Boolean,
    default: false,
  },
  isUsedFiftyFifty: {
    type: Boolean,
    default: false,
  },
  helper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Helper',
  },
});

module.exports = mongoose.model('Result', resultSchema);
