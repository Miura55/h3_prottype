var express = require('express');
var router = express.Router();
var moment = require('moment'); // 追加
var user_db = require('../cloudantConnect');

/* GET home page. */
router.get('/', function(req, res, next) {
  user_db.view('library', 'user_info', function(err, rows) {
    if (!err) {
      var values = rows.rows;
      console.log(values);
      res.render('index', {
        title: 'はじめてのNode.js',
        boardList: values
      });
    } else { console.log("app.js returnTable error: " + err); }
  });
});

router.post('/', function(req, res, next) {
  // データベースのIDと登録データを定義
  var _id = moment().unix().toString(10);
  var title = req.body.title;
  var userId = req.session.user_id? req.session.user_id: 0;
  var user_name = req.session.user_name? req.session.user_name: "名無し";
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

  // Add to db
  var body = {
    "user_id": userId,
    "user_name": user_name,
    "title": title,
    "date": createdAt
  };
  user_db.insert(body, _id, (err, data) => {
    if (err) {
        console.log(err);
      } else {
        console.log(data); // { ok: true, id: createdAt, ...
      }
      res.redirect('/');
  });
});

module.exports = router;
