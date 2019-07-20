// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');
var cred = require('./cloudant_credentials.json');

var me = cred.username; // Set this to your own account.
var password = cred.password;

// Initialize the library with my account.
var cloudant = Cloudant({ account: me, password: password });
var user_db = cloudant.use('user_info');

var index_set = function(doc) {
  if (doc.author && doc.title) {
    index('title', doc.title);
    index('date', doc.date);
  }
}
var ddoc = {
  _id: '_design/library',
  indexes: {
    user_info: {
      analyzer: {name: 'standard'},
      index   : index_set
    }
  }
};

user_db.insert(ddoc, function (err, result) {
  if (err) {
    throw err;
  }

  console.log('Created design document with books index');
});
