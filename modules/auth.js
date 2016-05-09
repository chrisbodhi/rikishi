/* eslint-disable consistent-return */
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }

  // todo: tack on destination query param for redirect after login
  res.redirect('/login');
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  // todo: tack on destination query param for redirect after login
  res.redirect('/login');
}

module.exports = {
  isAdmin: isAdmin,
  isLoggedIn: isLoggedIn
};
