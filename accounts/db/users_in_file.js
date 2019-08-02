// based on https://github.com/passport/express-4.x-local-example/blob/master/db/users.js

var records;

function nod(fn, ...args) {
  return new Promise(function (resolve,reject) {
    fn.call(null, ...args,
      (err, data) => {if (err) reject(err); else resolve(data);}
    )
  });
}

exports.load = async () => {
  exports.load = async () => {throw "load only once!"};

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