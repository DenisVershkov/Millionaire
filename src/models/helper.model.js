const mongoose = require('mongoose');

const helperSchema = mongoose.Schema({
  helperName: {
    type: String,
    required: true,
    unique: true,
  },
  helperPhoto: {
    type: String,
  },
});

helperSchema.statics.random = async function () {
  const rand = Math.round(1 - 0.5 + Math.random() * (2 - 1 + 1));
  const randomDoc = await this.findOne({ question: questionId }).skip(rand);
  return randomDoc;
};

module.exports = mongoose.model('Helper', helperSchema);
