(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

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

ready(function () {
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

// import './modules/details-toggle';

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy9jaGVja2JveGVzLW11dHVhbGx5LWV4Y2x1c2l2ZS9xdWFsaWZ5aW5nLXF1ZXN0aW9uL2J1bmRsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV2ZW50UmVhZHkgPSAnRE9NQ29udGVudExvYWRlZCc7XG5cbnZhciBjYWxsYmFja3MgPSBbXTtcbnZhciBpc1JlYWR5ID0gZmFsc2U7XG5cbnZhciBvblJlYWR5ID0gZnVuY3Rpb24gb25SZWFkeSgpIHtcbiAgaXNSZWFkeSA9IHRydWU7XG4gIGNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgIHJldHVybiBmbi5jYWxsKCk7XG4gIH0pO1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50UmVhZHksIG9uUmVhZHkpO1xufTtcblxuZnVuY3Rpb24gcmVhZHkoZm4pIHtcbiAgaWYgKGlzUmVhZHkpIHtcbiAgICBmbi5jYWxsKCk7XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2tzLnB1c2goZm4pO1xuICB9XG59XG5cbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnaW50ZXJhY3RpdmUnKSB7XG4gIG9uUmVhZHkuY2FsbCgpO1xufSBlbHNlIHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFJlYWR5LCBvblJlYWR5KTtcbn1cblxudmFyIGZvY3VzYWJsZUNsYXNzID0gJ2pzLWZvY3VzYWJsZSc7XG52YXIgZm9jdXNhYmxlQm94Q2xhc3MgPSAnanMtZm9jdXNhYmxlLWJveCc7XG52YXIgZm9jdXNDbGFzcyA9ICdoYXMtZm9jdXMnO1xudmFyIGNoZWNrZWRDbGFzcyA9ICdpcy1jaGVja2VkJztcblxudmFyIGdldE5leHRTaWJsaW5ncyA9IGZ1bmN0aW9uIGdldE5leHRTaWJsaW5ncyhlLCBmaWx0ZXIpIHtcbiAgdmFyIHNpYmxpbmdzID0gW107XG4gIHdoaWxlIChlID0gZS5uZXh0U2libGluZykge1xuICAgIGlmICghZmlsdGVyIHx8IGZpbHRlcihlKSkgc2libGluZ3MucHVzaChlKTtcbiAgfVxuICByZXR1cm4gc2libGluZ3M7XG59O1xuXG52YXIgZ2V0UHJldmlvdXNTaWJsaW5ncyA9IGZ1bmN0aW9uIGdldFByZXZpb3VzU2libGluZ3MoZSwgZmlsdGVyKSB7XG4gIHZhciBzaWJsaW5ncyA9IFtdO1xuICB3aGlsZSAoZSA9IGUucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgaWYgKCFmaWx0ZXIgfHwgZmlsdGVyKGUpKSBzaWJsaW5ncy5wdXNoKGUpO1xuICB9XG4gIHJldHVybiBzaWJsaW5ncztcbn07XG5cbnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgLy8gYXBwbHkgY2xhc3NlcyB0byBleGlzdGluZyBlbGVtZW50cyBvbiBwYWdlIGxvYWRcbiAgdmFyIGNoZWNrZWRFbGVtZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShmb2N1c2FibGVDbGFzcykpO1xuICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBjaGVja2VkRWxlbWVudHNbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICB2YXIgY2hlY2tlZEVsZW1lbnQgPSBfc3RlcC52YWx1ZTtcblxuICAgICAgaWYgKGNoZWNrZWRFbGVtZW50LmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgICAgY2hlY2tlZEVsZW1lbnQuY2xvc2VzdCgnLicgKyBmb2N1c2FibGVCb3hDbGFzcykuY2xhc3NMaXN0LmFkZChjaGVja2VkQ2xhc3MpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRGb2N1c2VkKGUpIHtcbiAgICBlLnRhcmdldC5jbG9zZXN0KCcuJyArIGZvY3VzYWJsZUJveENsYXNzKS5jbGFzc0xpc3QuYWRkKGZvY3VzQ2xhc3MpO1xuICB9XG4gIGZ1bmN0aW9uIHVuc2V0Rm9jdXNlZChlKSB7XG4gICAgZS50YXJnZXQuY2xvc2VzdCgnLicgKyBmb2N1c2FibGVCb3hDbGFzcykuY2xhc3NMaXN0LnJlbW92ZShmb2N1c0NsYXNzKTtcbiAgfVxuICBmdW5jdGlvbiBzZXRDaGFuZ2VkKGUpIHtcbiAgICBlLnRhcmdldC5jbG9zZXN0KCcuJyArIGZvY3VzYWJsZUJveENsYXNzKS5jbGFzc0xpc3QudG9nZ2xlKGNoZWNrZWRDbGFzcyk7XG4gICAgaWYgKGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAncmFkaW8nKSB7XG4gICAgICAvLyB1bmNoZWNrIHNpYmxpbmdzXG4gICAgICB2YXIgbmV4dFNpYnMgPSBnZXROZXh0U2libGluZ3MoZS50YXJnZXQuY2xvc2VzdCgnLmpzLWZvY3VzYWJsZS1ib3gnKSk7XG4gICAgICB2YXIgcHJldlNpYnMgPSBnZXRQcmV2aW91c1NpYmxpbmdzKGUudGFyZ2V0LmNsb3Nlc3QoJy5qcy1mb2N1c2FibGUtYm94JykpO1xuICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yID0gdHJ1ZTtcbiAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjIgPSBmYWxzZTtcbiAgICAgIHZhciBfaXRlcmF0b3JFcnJvcjIgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIgPSBuZXh0U2lic1tTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwMjsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMiA9IChfc3RlcDIgPSBfaXRlcmF0b3IyLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yID0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBuZXh0U2liID0gX3N0ZXAyLnZhbHVlO1xuXG4gICAgICAgICAgaWYgKG5leHRTaWIuY2xhc3NOYW1lICYmIG5leHRTaWIuY2xhc3NOYW1lLmluZGV4T2YoZm9jdXNhYmxlQm94Q2xhc3MpID49IDApIHtcbiAgICAgICAgICAgIG5leHRTaWIuY2xhc3NMaXN0LnJlbW92ZShjaGVja2VkQ2xhc3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9kaWRJdGVyYXRvckVycm9yMiA9IHRydWU7XG4gICAgICAgIF9pdGVyYXRvckVycm9yMiA9IGVycjtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMiAmJiBfaXRlcmF0b3IyLnJldHVybikge1xuICAgICAgICAgICAgX2l0ZXJhdG9yMi5yZXR1cm4oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yMikge1xuICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3IyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjMgPSB0cnVlO1xuICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yMyA9IGZhbHNlO1xuICAgICAgdmFyIF9pdGVyYXRvckVycm9yMyA9IHVuZGVmaW5lZDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMyA9IHByZXZTaWJzW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXAzOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24zID0gKF9zdGVwMyA9IF9pdGVyYXRvcjMubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjMgPSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHByZXZTaWIgPSBfc3RlcDMudmFsdWU7XG5cbiAgICAgICAgICBpZiAocHJldlNpYi5jbGFzc05hbWUgJiYgcHJldlNpYi5jbGFzc05hbWUuaW5kZXhPZihmb2N1c2FibGVCb3hDbGFzcykgPj0gMCkge1xuICAgICAgICAgICAgcHJldlNpYi5jbGFzc0xpc3QucmVtb3ZlKGNoZWNrZWRDbGFzcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IzID0gdHJ1ZTtcbiAgICAgICAgX2l0ZXJhdG9yRXJyb3IzID0gZXJyO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24zICYmIF9pdGVyYXRvcjMucmV0dXJuKSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IzLnJldHVybigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IzKSB7XG4gICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uNCA9IHRydWU7XG4gIHZhciBfZGlkSXRlcmF0b3JFcnJvcjQgPSBmYWxzZTtcbiAgdmFyIF9pdGVyYXRvckVycm9yNCA9IHVuZGVmaW5lZDtcblxuICB0cnkge1xuICAgIGZvciAodmFyIF9pdGVyYXRvcjQgPSBjaGVja2VkRWxlbWVudHNbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDQ7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjQgPSAoX3N0ZXA0ID0gX2l0ZXJhdG9yNC5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uNCA9IHRydWUpIHtcbiAgICAgIHZhciBfY2hlY2tlZEVsZW1lbnQgPSBfc3RlcDQudmFsdWU7XG5cbiAgICAgIF9jaGVja2VkRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHNldEZvY3VzZWQpO1xuICAgICAgX2NoZWNrZWRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB1bnNldEZvY3VzZWQpO1xuICAgICAgX2NoZWNrZWRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNldENoYW5nZWQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2RpZEl0ZXJhdG9yRXJyb3I0ID0gdHJ1ZTtcbiAgICBfaXRlcmF0b3JFcnJvcjQgPSBlcnI7XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjQgJiYgX2l0ZXJhdG9yNC5yZXR1cm4pIHtcbiAgICAgICAgX2l0ZXJhdG9yNC5yZXR1cm4oKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yNCkge1xuICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjQ7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuLy8gaW1wb3J0ICcuL21vZHVsZXMvZGV0YWlscy10b2dnbGUnO1xuIl19
