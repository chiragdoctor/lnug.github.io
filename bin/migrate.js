// old archive format to new.

var fs = require('fs');

var old = require('../archive3.json');

var out = {};

old.reduce(function(ret, talk) {
  ret[talk.id] = talk;
  return out;
}, out);


fs.writeFile('../archive4.json', JSON.stringify(out, null, 4));
console.log(out);
