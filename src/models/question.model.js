const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
  },
});

module.exports = mongoose.model('Question', questionSchema);
