// based on https://github.com/passport/express-4.x-local-example/blob/master/db/users.js

const fs = require('fs');

var records;
var lastId;

function nod(fn, ...args) {
  return new Promise(function (resolve, reject) {
    fn.call(null, ...args,
      (err, data) => { if (err) reject(err); else resolve(data); }
    )
  });
}

exports.load = async () => {
  exports.load = async () => { throw "load only once!" };
  try {
    var json = await nod(fs.readFile, '.data/users.json', 'utf8');
  } catch (e) {
    console.log(e, '---handled');
    records = [];
    lastId = 0;
  }
  const user = defaultByUsername('admin', {
    displayName: 'Admin',
    emails: [{ value: 'admin@example.com' }],
    data: { admin: true }
  });
  // invisible 'SECRET=  ' could be pass='  ', but by experiment does not log in. 
  // TODO investigate more.
  Object.assign(user, { password: process.env.SECRET });
  await exports.save();
};

const defaultByUsername = async (name, defaults) => {
  const user = await nod(exports.findByUsername, name);
  if (!user) {
    const user = { ...{ id: ++lastId, username: name }, ...defaults };
    await exports.save();
  }
}

exports.save = async () => {
  console.log('TODO implement')
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