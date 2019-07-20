var express = require('express');
var router = express.Router();
var user_db = require('../cloudantConnect');

router.get('/', function(req, res, next) {
  if (req.session.user_id) {
    res.redirect('/');
  } else {
    res.render('login', {
      title: 'ログイン'
    });
  }
});

router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var query = {
    "selector": {
      "email": email,
      "password": password
    },
    "fields": ["_id","email", "password"]
  };

  user_db.find(query, function(err, result) {
    if (err) {
      throw err;
    }

    console.log(result.docs);

    var userId = result.docs.length? result.docs[0]._id: false;

    if (userId){
      req.session.user_id = userId;
      res.redirect('/');
    }else{
      res.render('login', {
        title: 'ログイン',
        noUser: 'メールアドレスとパスワードが一致するユーザーはいません'
      });
    }
  });
});

module.exports = router;
