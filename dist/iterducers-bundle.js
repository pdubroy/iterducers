!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.iterducers=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var ArrayProto = Array.prototype;
function Transducer(nextFn) {
  this._next = nextFn;
}
Transducer.prototype.from = function(iterable) {
  var iter = iterable[Symbol.iterator]();
  var result = {next: function() {
      return this._next(iter);
    }.bind(this)};
  result[Symbol.iterator] = function() {
    return result;
  };
  return result;
};
Transducer.prototype.into = function(dest, iterable) {
  var i = this.from(iterable);
  for (var $__0 = this.from(iterable)[Symbol.iterator](),
      $__1; !($__1 = $__0.next()).done; ) {
    var x = $__1.value;
    {
      dest.push(x);
    }
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
  return new Transducer(function() {
    var result = getNext(iterable);
    if (result.done || fn(result.value))
      return result;
    return {done: true};
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
  filter: filter
};


},{}]},{},[1])(1)
});