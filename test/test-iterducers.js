var test = require('tape');

var iterducers = require('../');

test('map, filter, compose', function (t) {
  var twice = iterducers.map(function(i) { return i * 2; });
  t.deepEqual(twice.toArray([1, 2, 3]), [2, 4, 6]);

  var addOne = iterducers.map(function(i) { return i + 1; });
  var proc = iterducers.compose(addOne, twice);
  t.deepEqual(proc.toArray([1, 2, 3]), [3, 5, 7]);

  var even = iterducers.filter(function(i) { return i % 2 === 0; });
  t.deepEqual(even.toArray([1, 2, 3]), [2]);

  t.ok(iterducers.compose() === undefined, 'composing nothing is undefined');
  proc = iterducers.compose(twice, even, addOne);
  t.deepEqual(proc.toArray([1, 2, 3]), [4, 8]);
  proc = iterducers.compose(twice);
  t.deepEqual(proc.toArray([1, 2, 3]), twice.toArray([1, 2, 3]));

  var lessThanFive = iterducers.takeWhile(function(i) { return i < 5; });
  t.deepEqual(lessThanFive.toArray([5, 1]), []);
  t.deepEqual(lessThanFive.toArray([1, 2, 5]), [1, 2]);
  t.deepEqual(lessThanFive.toArray([1, 2, 5, 1]), [1, 2]);

  t.end();
});
