const mongoose = require('mongoose');
const { dbConnectionURL, options } = require('./config');

function connect() {
  mongoose
    .connect(dbConnectionURL, options)
    .then(() => console.log('Connect to DB'))
    .catch(() => console.log('Error with DB'));
}

function disconnect() {
  mongoose.disconnect();
}

module.exports = { connect, disconnect };
