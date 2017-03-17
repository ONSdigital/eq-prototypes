'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ready;
var eventReady = 'DOMContentLoaded';

var callbacks = [];
var isReady = false;

var onReady = function onReady() {
  isReady = true;
  callbacks.forEach(function (fn) {
    return fn.call();
  });
  document.removeEventListener(eventReady, onReady);
};

function ready(fn) {
  if (isReady) {
    fn.call();
  } else {
    callbacks.push(fn);
  }
}

if (document.readyState === 'interactive') {
  onReady.call();
} else {
  document.addEventListener(eventReady, onReady);
}