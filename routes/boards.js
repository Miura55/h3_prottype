var express = require('express');
var router = express.Router();
var user_db = require('../cloudantConnect');

router.get('/:board_id', function(req, res, next) {
  var boardId = req.params.board_id;
  console.log(req.params);
  var query = {
    "selector": {
      _id: boardId,
    },
    "fields": ["_id", "date", "title"]
  };

  user_db.find(query, function(err, result) {
    if (err) {
      throw err;
    }
    console.log('Found %d documents', result.docs.length);
    console.log(result.docs);
    res.render('board', {
      title: result.docs[0].title,
      board: result.docs[0]
    });
  });
});


module.exports = router;
