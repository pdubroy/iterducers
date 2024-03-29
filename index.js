var ArrayProto = Array.prototype;

function Transducer(nextFn) {
  this._next = nextFn;
}

// Returns an iterator whose values are the result of applying the
// to transducer to `iterable`.
Transducer.prototype.from = function(iterable) {
  var iter = iterable[Symbol.iterator]();
  var result = {
    next: function() {
      return this._next(iter);
    }.bind(this)
  };
  result[Symbol.iterator] = function() { return result; }
  return result;
};

Transducer.prototype.into = function(dest, iterable) {
  var i = this.from(iterable);
  for (var x of this.from(iterable)) {
    dest.push(x);
  }
  return dest;
};

Transducer.prototype.toArray = function(iterable) {
  return this.into([], iterable);
};

function map(fn) {
  return new Transducer(function(iter) {
    var result = iter.next();
    if (!result.done)
      result.value = fn(result.value);
    return result;
  });
}

function filter(fn) {
  return new Transducer(function(iter) {
    while (true) {
      var result = iter.next();
      if (result.done || fn(result.value))
        return result;
    }
  });
}

function takeWhile(fn) {
  return new Transducer(function(iter) {
    var result = iter.next();
    if (result.done || fn(result.value))
      return result;
    return { done: true };
  });
}

function compose() {
  if (arguments.length > 1) {
    var pair = ArrayProto.slice.call(arguments, -2);
    var recurseArgs = ArrayProto.slice.call(arguments, 0, -2);
    recurseArgs.push(new Transducer(function(iter) {
      return pair[0]._next(pair[1].from(iter));
    }));
    return compose.apply(this, recurseArgs);
  }
  return arguments[0];
}

module.exports = {
  compose: compose,
  map: map,
  filter: filter,
  takeWhile: takeWhile
};
