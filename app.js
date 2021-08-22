const express = require('express');
const hbs = require('hbs');
const path = require('path');
const PORT = 3000;
const { connect, disconnect } = require('./src/db/index');
const app = express();
const morgan = require('morgan');
const createError = require('http-errors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const gameRouter = require('./src/routes/game.router');
const authRouter = require('./src/routes/auth.router');

connect();

app.set('view engine', 'hbs');
app.set('cookieName', 'userCookie');
app.set('views', path.join(process.env.PWD, 'src', 'views'));

const secretKey = require('crypto').randomBytes(64).toString('hex');
const sessionParser = session({
  name: app.get('cookieName'),
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/Millionaire',
  }),
  cookie: {
    httpOnly: true,
    maxAge: 100000000,
  },
});

app.use(sessionParser);
app.use(morgan('dev'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

hbs.registerPartials(path.join('views', 'partials'));

app.use((req, res, next) => {
  res.locals.username = req.session.username;
  res.locals.userId = req.session.userId;
  res.locals.questionNumber = 1;
  next();
});

app.use('/', gameRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  const error = createError(404, 'Запрашиваемой страницы не существует на сервере.');
  next(error);
});

app.listen(PORT, () => console.log('server has been started successfuly'));
