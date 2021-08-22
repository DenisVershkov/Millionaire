const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/sign-up', async (req, res) => {
  const { username } = req.body;
  try {
    const newUser = await User.create(req.body);
    req.session.username = newUser.username;
    req.session.userId = newUser._id;
    return res.redirect('/');
  } catch (err) {
    return res.status(418).redirect('/auth/sign-up');
  }
});

router.post('/login', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    req.session.username = user.username;
    req.session.userId = user._id;
    return res.redirect('/');
  }
  res.json({ err: 'Не удалось найти аккаунт. Введите корректные данные' });
});

module.exports = router;
