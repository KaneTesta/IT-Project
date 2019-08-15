var express = require('express');
var userController = require("../controllers/userController");

var router = express.Router();


/**
 * Get the user that is currently logged in, or null if no user it logged in
 */
function getUser(req, callback) {
    if (req.session && req.session.passport && req.session.passport.user) {
        userController.findUser(req.session.passport.user, (msg) => {
            if (!msg.error && msg.result.length > 0) {
                callback(msg.result[0]);
            } else {
                callback(null);
            }
        });
    } else {
        callback(null);
    }
}

/* GET home page. */
router.get('/', function (req, res, next) {
    getUser(req, function (user) {
        res.render('index', { title: 'IT Project', user: user });
    });
});

module.exports = router;
