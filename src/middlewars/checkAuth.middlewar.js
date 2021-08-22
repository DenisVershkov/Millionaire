function checkAuth(req, res, next) {
  if (username) {
    next();
  } else {
    res.redirect('/user/register');
  }
}

module.exports = checkAuth;
