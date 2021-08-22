const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({});

gameSchema.statics.random = async function (cb) {
  const count = await this.count();
  const rand = Math.floor(Math.random() * count);
  const randomDoc = await this.findOne().skip(rand);
  return randomDoc;
};

module.exports = mongoose.model('Game', gameSchema);
