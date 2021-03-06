var express = require('express');
var router = express.Router();
var moment = require('moment');
var user_db = require('../cloudantConnect');

router.get('/', function(req, res, next) {
  res.render('register', {
    title: '新規会員登録'
  });
});

router.post('/', function(req, res, next) {
  var _id = moment().unix().toString(10);
  var userName = req.body.user_name;
  var email = req.body.email;
  var password = req.body.password;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

  // 登録するためのquery
  var body = {
    "user_name": userName,
    "email": email,
    "password": password,
    "created_at": createdAt,
  };

  // メールアドレスがあるかどうかを確認するためのquery
  var query = {
    "selector": {
      "email": email,
    },
    "fields": ["_id","email"]
  };

  user_db.find(query, function(err, result) {
    if (err) {
      throw err;
    }
    console.log('Found %d documents', result.docs.length);
    console.log(result.docs);
    if (result.docs[0]){
      res.render('register', {
          title: '新規会員登録',
          emailExists: '既に登録されているメールアドレスです'
      });
    }else{
      user_db.insert(body, _id, (err, data) => {
        if (err) {
            console.log(err);
          } else {
            console.log(data); // { ok: true, id: _id, ...
          }
          res.redirect("/login");
      });
    }
  });
});

module.exports = router;
