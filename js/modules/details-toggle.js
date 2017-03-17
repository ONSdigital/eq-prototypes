'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attrTabIndex = exports.attrAriaHidden = exports.attrAriaExpanaded = exports.attrHideLbl = exports.attrShowLbl = exports.classExpandedState = exports.classLabel = exports.classBody = exports.classTrigger = exports.classDetails = undefined;

exports.default = function () {
  return detailsToggle();
};

exports.detailsToggle = detailsToggle;
exports.applyDetailsToggle = applyDetailsToggle;
exports.open = open;
exports.close = close;
exports.toggle = toggle;

var _lodash = require('lodash');

var _domready = require('./domready');

var _domready2 = _interopRequireDefault(_domready);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classDetails = exports.classDetails = 'js-details';
var classTrigger = exports.classTrigger = 'js-details-trigger';
var classBody = exports.classBody = 'js-details-body';
var classLabel = exports.classLabel = 'js-details-label';
var classExpandedState = exports.classExpandedState = 'is-expanded';

var attrShowLbl = exports.attrShowLbl = 'data-show-label';
var attrHideLbl = exports.attrHideLbl = 'data-hide-label';
var attrAriaExpanaded = exports.attrAriaExpanaded = 'aria-expanded';
var attrAriaHidden = exports.attrAriaHidden = 'aria-hidden';
var attrTabIndex = exports.attrTabIndex = 'tabindex';

function detailsToggle() {
  var nodeList = document.getElementsByClassName(classDetails);
  (0, _lodash.forEach)(nodeList, applyDetailsToggle);
  return nodeList;
}

function applyDetailsToggle(elDetails) {
  var elTrigger = elDetails.getElementsByClassName(classTrigger)[0];
  var elBody = elDetails.getElementsByClassName(classBody)[0];
  var elLabel = elDetails.getElementsByClassName(classLabel)[0];
  var toggled = false;

  elTrigger.addEventListener('click', function (e) {
    e.preventDefault();
    toggled = toggle(toggled, elDetails, elTrigger, elBody, elLabel);
    return false;
  });

  return { elDetails: elDetails, elTrigger: elTrigger, elBody: elBody };
}

function open(elDetails, elBody, elLabel, elTrigger) {
  elDetails.classList.add(classExpandedState);
  elLabel.innerHTML = elDetails.getAttribute(attrHideLbl);
  elTrigger.setAttribute(attrAriaExpanaded, true);
  elBody.setAttribute(attrAriaHidden, false);
}

function close(elDetails, elBody, elLabel, elTrigger) {
  elDetails.classList.remove(classExpandedState);
  elLabel.innerHTML = elDetails.getAttribute(attrShowLbl);
  elTrigger.setAttribute(attrAriaExpanaded, false);
  elBody.setAttribute(attrAriaHidden, true);
}

function toggle(toggled, elDetails, elTrigger, elBody, elLabel) {
  !toggled ? open(elDetails, elBody, elLabel, elTrigger) : close(elDetails, elBody, elLabel, elTrigger);
  return !toggled;
}

(0, _domready2.default)(detailsToggle);