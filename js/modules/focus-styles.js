'use strict';

var _domready = require('./domready');

var _domready2 = _interopRequireDefault(_domready);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var focusableClass = 'js-focusable';
var focusableBoxClass = 'js-focusable-box';
var focusClass = 'has-focus';
var checkedClass = 'is-checked';

var getNextSiblings = function getNextSiblings(e, filter) {
  var siblings = [];
  while (e = e.nextSibling) {
    if (!filter || filter(e)) siblings.push(e);
  }
  return siblings;
};

var getPreviousSiblings = function getPreviousSiblings(e, filter) {
  var siblings = [];
  while (e = e.previousSibling) {
    if (!filter || filter(e)) siblings.push(e);
  }
  return siblings;
};

(0, _domready2.default)(function () {
  // apply classes to existing elements on page load
  var checkedElements = Array.from(document.getElementsByClassName(focusableClass));
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = checkedElements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var checkedElement = _step.value;

      if (checkedElement.checked === true) {
        checkedElement.closest('.' + focusableBoxClass).classList.add(checkedClass);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  function setFocused(e) {
    e.target.closest('.' + focusableBoxClass).classList.add(focusClass);
  }
  function unsetFocused(e) {
    e.target.closest('.' + focusableBoxClass).classList.remove(focusClass);
  }
  function setChanged(e) {
    e.target.closest('.' + focusableBoxClass).classList.toggle(checkedClass);
    if (e.target.getAttribute('type') === 'radio') {
      // uncheck siblings
      var nextSibs = getNextSiblings(e.target.closest('.js-focusable-box'));
      var prevSibs = getPreviousSiblings(e.target.closest('.js-focusable-box'));
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = nextSibs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var nextSib = _step2.value;

          if (nextSib.className && nextSib.className.indexOf(focusableBoxClass) >= 0) {
            nextSib.classList.remove(checkedClass);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = prevSibs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var prevSib = _step3.value;

          if (prevSib.className && prevSib.className.indexOf(focusableBoxClass) >= 0) {
            prevSib.classList.remove(checkedClass);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = checkedElements[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var _checkedElement = _step4.value;

      _checkedElement.addEventListener('focus', setFocused);
      _checkedElement.addEventListener('blur', unsetFocused);
      _checkedElement.addEventListener('change', setChanged);
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }
});