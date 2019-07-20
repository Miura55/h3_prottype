var express = require('express');
var router = express.Router();
var moment = require('moment'); // 追加

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');
var cred = require('../cloudant_credentials.json');

var me = cred.username; // Set this to your own account.
var password = cred.password;

// Initialize the library with my account.
var cloudant = Cloudant({ account: me, password: password });
var user_db = cloudant.use('user_info');

/* GET home page. */
router.get('/', function(req, res, next) {
  user_db.view('library', 'user_info', function(err, rows) {
    if (!err) {
      var values = rows.rows;
      res.render('index', {
        title: 'はじめてのNode.js',
        boardList: values
      });
    } else { console.log("app.js returnTable error: " + err); }
  });
});

router.post('/', function(req, res, next) {
  var title = req.body.title;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss'); // 追加
  console.log(title);
  console.log(createdAt); // 追加
  // Add to db
  var body = {
    "title": title,
    "date": createdAt
  };
  user_db.insert(body, createdAt, (err, data) => {
    if (err) {
        console.log(err);
      } else {
        console.log(data); // { ok: true, id: createdAt, ...
      }
      res.redirect('/');
  });
  // res.end();
});

module.exports = router;
