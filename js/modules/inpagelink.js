'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.classTrigger = undefined;

exports.default = function () {
  return inPageLink();
};

exports.inPageLink = inPageLink;
exports.applyInPageLink = applyInPageLink;

var _lodash = require('lodash');

var _domready = require('./domready');

var _domready2 = _interopRequireDefault(_domready);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classTrigger = exports.classTrigger = 'js-inpagelink';

function inPageLink() {
  var nodeList = document.getElementsByClassName(classTrigger);
  (0, _lodash.forEach)(nodeList, applyInPageLink);
  return nodeList;
}

function applyInPageLink(elTrigger) {
  var elId = elTrigger.getAttribute('href').replace('#', '');
  elTrigger.addEventListener('click', function (e) {
    e.preventDefault();
    focusOnInput(elId);
  });

  return { elTrigger: elTrigger, elId: elId };
}

function focusOnInput(elId) {
  var elIdInput = document.getElementById(elId).querySelectorAll('.input')[0];
  elIdInput.focus();
  return elId;
}

(0, _domready2.default)(inPageLink);