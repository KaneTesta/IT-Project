var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/delete', function (req, res) {
  if (req.session && req.session.passport && req.session.passport.user) {
    let user_id = req.session.passport.user;
    userController.deleteUser(user_id, function (msg) { sendResponse(msg, res); });
  } else {
    res.status(500).send("User not logged in");
  }
});

router.post('/logout', function (req, res) {
  req.logout();
  req.session.destroy(function (err) {
    console.log(err);
    if (err) {
      res.status(500).send("Error logging out");
    } else {
      res.send("Logged out");
    }
  });
});

/* GET error with user login */
router.get('/loginerror', function (req, res, next) {
  console.log(JSON.stringify(req));
  res.render('user/loginerror');
});

module.exports = router;
