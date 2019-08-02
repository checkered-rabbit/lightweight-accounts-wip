// based on https://github.com/passport/express-4.x-local-example/blob/master/db/users.js

var records = [
  { id: 1, username: 'a', password: 'a', displayName: 'A', emails: [{ value: 'a@example.com' }], data: {} },
  { id: 2, username: 'aa', password: 'aa', displayName: 'Aa', emails: [{ value: 'aa@example.com' }], data: {} },
  {
    id: 3, username: 'admin',
    //do not allow empty or with spaces from env-vars, but that happens automatically
    password: process.env.SECRET,
    displayName: 'Admin',
    emails: [{ value: 'admin@example.com' }],
    data: { admin: true }
  },
];

exports.load = async () => {

}

exports.save = async () => {

}

exports.findById = function (id, cb) {
  process.nextTick(function () {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function (username, cb) {
  process.nextTick(function () {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}