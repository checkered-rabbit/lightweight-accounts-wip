// based on https://github.com/passport/express-4.x-local-example/blob/master/db/users.js

const fs = require('fs');

const userFile = '.data/users.json';

var records;
var lastId;

function nod(fn, ...args) {
  return new Promise(function (resolve, reject) {
    fn.call({}, ...args,
      (err, data) => { if (err) reject(err); else resolve(data); }
    )
  });
}

exports.load = async () => {
  exports.load = async () => { throw "load only once!" };
  try {
    const json = await nod(fs.readFile, userFile, 'utf8');
    const obj = JSON.parse(json);
    ({ lastId, records } = obj);
    //console.log([lastId, records]);
    //throw "test no file";
  } catch (e) {
    console.log(e, '---handled');
    records = [];
    lastId = 0;
  }
  const user = await defaultByUsername('admin', {
    displayName: 'Admin',
    emails: [{ value: 'admin@example.com' }],
    data: { admin: true }
  });
  // invisible 'SECRET=  ' could be pass='  ', but by experiment does not log in.
  // can only manage '', seems trimmed by shell.
  // passport dropps empty password. by experiment.
  //console.log(`?${process.env.SECRET}?`);
  Object.assign(user, { password: process.env.SECRET });
  const data = user.data;
  data.defaults = (data.defaults || 0) + 1;
  console.log(user);
  await exports.save();
};

const defaultByUsername = async (name, defaults) => {
  const user = await nod(exports.findByUsername, name);
  if (!user) {
    const user = { ...{ id: ++lastId, username: name }, ...defaults };
    records.push(user);
    await exports.save();
    return user;
  }
  return user;
}

// TODO investigate race condition: can older write win?
// hmm https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
// it is unsafe to use fs.writeFile() multiple times on the same file without waiting for the callback. 

exports.save = async () => {
  const json = JSON.stringify({ lastId, records }, null, 1);
  //console.log(json);
  await nod(fs.writeFile, userFile, json, 'utf8');
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