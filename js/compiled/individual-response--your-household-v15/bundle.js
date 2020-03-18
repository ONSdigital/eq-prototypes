(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};









var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/*
* FileSaver.js
* A saveAs() FileSaver implementation.
*
* By Eli Grey, http://eligrey.com
*
* License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
* source  : http://purl.eligrey.com/github/FileSaver.js
*/

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
var _global = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.window === window ? window : (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self.self === self ? self : (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' && global.global === global ? global : undefined;

function bom(blob, opts) {
  if (typeof opts === 'undefined') opts = { autoBom: false };else if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') {
    console.warn('Deprecated: Expected third argument to be a object');
    opts = { autoBom: !opts };
  }

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
  }
  return blob;
}

function download(url, name, opts) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    saveAs(xhr.response, name, opts);
  };
  xhr.onerror = function () {
    console.error('could not download file');
  };
  xhr.send();
}

function corsEnabled(url) {
  var xhr = new XMLHttpRequest();
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false);
  xhr.send();
  return xhr.status >= 200 && xhr.status <= 299;
}

// `a.click()` doesn't work for all browsers (#465)
function click(node) {
  try {
    node.dispatchEvent(new MouseEvent('click'));
  } catch (e) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    node.dispatchEvent(evt);
  }
}

var saveAs = _global.saveAs || (
// probably in some web worker
(typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || window !== _global ? function saveAs() {} /* noop */


// Use download attribute first if possible (#193 Lumia mobile)
: 'download' in HTMLAnchorElement.prototype ? function saveAs(blob, name, opts) {
  var URL = _global.URL || _global.webkitURL;
  var a = document.createElement('a');
  name = name || blob.name || 'download';

  a.download = name;
  a.rel = 'noopener'; // tabnabbing

  // TODO: detect chrome extensions & packaged apps
  // a.target = '_blank'

  if (typeof blob === 'string') {
    // Support regular links
    a.href = blob;
    if (a.origin !== location.origin) {
      corsEnabled(a.href) ? download(blob, name, opts) : click(a, a.target = '_blank');
    } else {
      click(a);
    }
  } else {
    // Support blobs
    a.href = URL.createObjectURL(blob);
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 4E4); // 40s
    setTimeout(function () {
      click(a);
    }, 0);
  }
}

// Use msSaveOrOpenBlob as a second approach
: 'msSaveOrOpenBlob' in navigator ? function saveAs(blob, name, opts) {
  name = name || blob.name || 'download';

  if (typeof blob === 'string') {
    if (corsEnabled(blob)) {
      download(blob, name, opts);
    } else {
      var a = document.createElement('a');
      a.href = blob;
      a.target = '_blank';
      setTimeout(function () {
        click(a);
      });
    }
  } else {
    navigator.msSaveOrOpenBlob(bom(blob, opts), name);
  }
}

// Fallback to using FileReader and a popup
: function saveAs(blob, name, opts, popup) {
  // Open a popup immediately do go around popup blocker
  // Mostly only available on user interaction and the fileReader is async so...
  popup = popup || open('', '_blank');
  if (popup) {
    popup.document.title = popup.document.body.innerText = 'downloading...';
  }

  if (typeof blob === 'string') return download(blob, name, opts);

  var force = blob.type === 'application/octet-stream';
  var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari;
  var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

  if ((isChromeIOS || force && isSafari) && (typeof FileReader === 'undefined' ? 'undefined' : _typeof(FileReader)) === 'object') {
    // Safari doesn't allow downloading of blob URLs
    var reader = new FileReader();
    reader.onloadend = function () {
      var url = reader.result;
      url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;');
      if (popup) popup.location.href = url;else location = url;
      popup = null; // reverse-tabnabbing #460
    };
    reader.readAsDataURL(blob);
  } else {
    var URL = _global.URL || _global.webkitURL;
    var url = URL.createObjectURL(blob);
    if (popup) popup.location = url;else location.href = url;
    popup = null; // reverse-tabnabbing #460
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 4E4); // 40s
  }
});

_global.saveAs = saveAs.saveAs = saveAs;

if (typeof module !== 'undefined') {
  module.exports = saveAs;
}

if (!Array.from) {
  Array.from = function () {
    var toStr = Object.prototype.toString;
    var isCallable = function isCallable(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function toInteger(value) {
      var number = Number(value);
      if (isNaN(number)) {
        return 0;
      }
      if (number === 0 || !isFinite(number)) {
        return number;
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function toLength(value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike /*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }();
}

/**
 *
 *
 * @author Jerry Bendy <jerry@icewingcc.com>
 * @licence MIT
 *
 */

(function (self) {
  'use strict';

  var nativeURLSearchParams = self.URLSearchParams && self.URLSearchParams.prototype.get ? self.URLSearchParams : null,
      isSupportObjectConstructor = nativeURLSearchParams && new nativeURLSearchParams({ a: 1 }).toString() === 'a=1',

  // There is a bug in safari 10.1 (and earlier) that incorrectly decodes `%2B` as an empty space and not a plus.
  decodesPlusesCorrectly = nativeURLSearchParams && new nativeURLSearchParams('s=%2B').get('s') === '+',
      __URLSearchParams__ = "__URLSearchParams__",

  // Fix bug in Edge which cannot encode ' &' correctly
  encodesAmpersandsCorrectly = nativeURLSearchParams ? function () {
    var ampersandTest = new nativeURLSearchParams();
    ampersandTest.append('s', ' &');
    return ampersandTest.toString() === 's=+%26';
  }() : true,
      prototype = URLSearchParamsPolyfill.prototype,
      iterable = !!(self.Symbol && self.Symbol.iterator);

  if (nativeURLSearchParams && isSupportObjectConstructor && decodesPlusesCorrectly && encodesAmpersandsCorrectly) {
    return;
  }

  /**
   * Make a URLSearchParams instance
   *
   * @param {object|string|URLSearchParams} search
   * @constructor
   */
  function URLSearchParamsPolyfill(search) {
    search = search || "";

    // support construct object with another URLSearchParams instance
    if (search instanceof URLSearchParams || search instanceof URLSearchParamsPolyfill) {
      search = search.toString();
    }
    this[__URLSearchParams__] = parseToDict(search);
  }

  /**
   * Appends a specified key/value pair as a new search parameter.
   *
   * @param {string} name
   * @param {string} value
   */
  prototype.append = function (name, value) {
    appendTo(this[__URLSearchParams__], name, value);
  };

  /**
   * Deletes the given search parameter, and its associated value,
   * from the list of all search parameters.
   *
   * @param {string} name
   */
  prototype['delete'] = function (name) {
    delete this[__URLSearchParams__][name];
  };

  /**
   * Returns the first value associated to the given search parameter.
   *
   * @param {string} name
   * @returns {string|null}
   */
  prototype.get = function (name) {
    var dict = this[__URLSearchParams__];
    return name in dict ? dict[name][0] : null;
  };

  /**
   * Returns all the values association with a given search parameter.
   *
   * @param {string} name
   * @returns {Array}
   */
  prototype.getAll = function (name) {
    var dict = this[__URLSearchParams__];
    return name in dict ? dict[name].slice(0) : [];
  };

  /**
   * Returns a Boolean indicating if such a search parameter exists.
   *
   * @param {string} name
   * @returns {boolean}
   */
  prototype.has = function (name) {
    return name in this[__URLSearchParams__];
  };

  /**
   * Sets the value associated to a given search parameter to
   * the given value. If there were several values, delete the
   * others.
   *
   * @param {string} name
   * @param {string} value
   */
  prototype.set = function set$$1(name, value) {
    this[__URLSearchParams__][name] = ['' + value];
  };

  /**
   * Returns a string containg a query string suitable for use in a URL.
   *
   * @returns {string}
   */
  prototype.toString = function () {
    var dict = this[__URLSearchParams__],
        query = [],
        i,
        key,
        name,
        value;
    for (key in dict) {
      name = encode(key);
      for (i = 0, value = dict[key]; i < value.length; i++) {
        query.push(name + '=' + encode(value[i]));
      }
    }
    return query.join('&');
  };

  // There is a bug in Safari 10.1 and `Proxy`ing it is not enough.
  var forSureUsePolyfill = !decodesPlusesCorrectly;
  var useProxy = !forSureUsePolyfill && nativeURLSearchParams && !isSupportObjectConstructor && self.Proxy;
  /*
   * Apply polifill to global object and append other prototype into it
   */
  Object.defineProperty(self, 'URLSearchParams', {
    value: useProxy ?
    // Safari 10.0 doesn't support Proxy, so it won't extend URLSearchParams on safari 10.0
    new Proxy(nativeURLSearchParams, {
      construct: function construct(target, args) {
        return new target(new URLSearchParamsPolyfill(args[0]).toString());
      }
    }) : URLSearchParamsPolyfill
  });

  var USPProto = self.URLSearchParams.prototype;

  USPProto.polyfill = true;

  /**
   *
   * @param {function} callback
   * @param {object} thisArg
   */
  USPProto.forEach = USPProto.forEach || function (callback, thisArg) {
    var dict = parseToDict(this.toString());
    Object.getOwnPropertyNames(dict).forEach(function (name) {
      dict[name].forEach(function (value) {
        callback.call(thisArg, value, name, this);
      }, this);
    }, this);
  };

  /**
   * Sort all name-value pairs
   */
  USPProto.sort = USPProto.sort || function () {
    var dict = parseToDict(this.toString()),
        keys = [],
        k,
        i,
        j;
    for (k in dict) {
      keys.push(k);
    }
    keys.sort();

    for (i = 0; i < keys.length; i++) {
      this['delete'](keys[i]);
    }
    for (i = 0; i < keys.length; i++) {
      var key = keys[i],
          values = dict[key];
      for (j = 0; j < values.length; j++) {
        this.append(key, values[j]);
      }
    }
  };

  /**
   * Returns an iterator allowing to go through all keys of
   * the key/value pairs contained in this object.
   *
   * @returns {function}
   */
  USPProto.keys = USPProto.keys || function () {
    var items = [];
    this.forEach(function (item, name) {
      items.push(name);
    });
    return makeIterator(items);
  };

  /**
   * Returns an iterator allowing to go through all values of
   * the key/value pairs contained in this object.
   *
   * @returns {function}
   */
  USPProto.values = USPProto.values || function () {
    var items = [];
    this.forEach(function (item) {
      items.push(item);
    });
    return makeIterator(items);
  };

  /**
   * Returns an iterator allowing to go through all key/value
   * pairs contained in this object.
   *
   * @returns {function}
   */
  USPProto.entries = USPProto.entries || function () {
    var items = [];
    this.forEach(function (item, name) {
      items.push([name, item]);
    });
    return makeIterator(items);
  };

  if (iterable) {
    USPProto[self.Symbol.iterator] = USPProto[self.Symbol.iterator] || USPProto.entries;
  }

  function encode(str) {
    var replace = {
      '!': '%21',
      "'": '%27',
      '(': '%28',
      ')': '%29',
      '~': '%7E',
      '%20': '+',
      '%00': '\x00'
    };
    return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function (match) {
      return replace[match];
    });
  }

  function decode(str) {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  }

  function makeIterator(arr) {
    var iterator = {
      next: function next() {
        var value = arr.shift();
        return { done: value === undefined, value: value };
      }
    };

    if (iterable) {
      iterator[self.Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function parseToDict(search) {
    var dict = {};

    if ((typeof search === 'undefined' ? 'undefined' : _typeof(search)) === "object") {
      for (var key in search) {
        if (search.hasOwnProperty(key)) {
          appendTo(dict, key, search[key]);
        }
      }
    } else {
      // remove first '?'
      if (search.indexOf("?") === 0) {
        search = search.slice(1);
      }

      var pairs = search.split("&");
      for (var j = 0; j < pairs.length; j++) {
        var value = pairs[j],
            index = value.indexOf('=');

        if (-1 < index) {
          appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index + 1)));
        } else {
          if (value) {
            appendTo(dict, decode(value), '');
          }
        }
      }
    }

    return dict;
  }

  function appendTo(dict, name, value) {
    var val = typeof value === 'string' ? value : value !== null && value !== undefined && typeof value.toString === 'function' ? value.toString() : JSON.stringify(value);

    if (name in dict) {
      dict[name].push(val);
    } else {
      dict[name] = [val];
    }
  }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : undefined);

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function value(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}

// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {

  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

(function (self) {
  'use strict';

  if (self.fetch) {
    return;
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

    var isDataView = function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj);
    };

    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function next() {
        var value = items.shift();
        return { done: value === undefined, value: value };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ',' + value : value;
  };

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('');
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type');
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }

    this.text = function () {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text');
      } else {
        return Promise.resolve(this._bodyText);
      }
    };

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  Request.prototype.clone = function () {
    return new Request(this, { body: this._bodyInit });
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status: status, headers: { location: url } });
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function (input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : undefined);

(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) : factory();
})(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  var Emitter =
  /*#__PURE__*/
  function () {
    function Emitter() {
      _classCallCheck(this, Emitter);

      Object.defineProperty(this, 'listeners', {
        value: {},
        writable: true,
        configurable: true
      });
    }

    _createClass(Emitter, [{
      key: "addEventListener",
      value: function addEventListener(type, callback) {
        if (!(type in this.listeners)) {
          this.listeners[type] = [];
        }

        this.listeners[type].push(callback);
      }
    }, {
      key: "removeEventListener",
      value: function removeEventListener(type, callback) {
        if (!(type in this.listeners)) {
          return;
        }

        var stack = this.listeners[type];

        for (var i = 0, l = stack.length; i < l; i++) {
          if (stack[i] === callback) {
            stack.splice(i, 1);
            return;
          }
        }
      }
    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        var _this = this;

        if (!(event.type in this.listeners)) {
          return;
        }

        var debounce = function debounce(callback) {
          setTimeout(function () {
            return callback.call(_this, event);
          });
        };

        var stack = this.listeners[event.type];

        for (var i = 0, l = stack.length; i < l; i++) {
          debounce(stack[i]);
        }

        return !event.defaultPrevented;
      }
    }]);

    return Emitter;
  }();

  var AbortSignal =
  /*#__PURE__*/
  function (_Emitter) {
    _inherits(AbortSignal, _Emitter);

    function AbortSignal() {
      var _this2;

      _classCallCheck(this, AbortSignal);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(AbortSignal).call(this)); // Some versions of babel does not transpile super() correctly for IE <= 10, if the parent
      // constructor has failed to run, then "this.listeners" will still be undefined and then we call
      // the parent constructor directly instead as a workaround. For general details, see babel bug:
      // https://github.com/babel/babel/issues/3041
      // This hack was added as a fix for the issue described here:
      // https://github.com/Financial-Times/polyfill-library/pull/59#issuecomment-477558042

      if (!_this2.listeners) {
        Emitter.call(_assertThisInitialized(_this2));
      } // Compared to assignment, Object.defineProperty makes properties non-enumerable by default and
      // we want Object.keys(new AbortController().signal) to be [] for compat with the native impl


      Object.defineProperty(_assertThisInitialized(_this2), 'aborted', {
        value: false,
        writable: true,
        configurable: true
      });
      Object.defineProperty(_assertThisInitialized(_this2), 'onabort', {
        value: null,
        writable: true,
        configurable: true
      });
      return _this2;
    }

    _createClass(AbortSignal, [{
      key: "toString",
      value: function toString() {
        return '[object AbortSignal]';
      }
    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        if (event.type === 'abort') {
          this.aborted = true;

          if (typeof this.onabort === 'function') {
            this.onabort.call(this, event);
          }
        }

        _get(_getPrototypeOf(AbortSignal.prototype), "dispatchEvent", this).call(this, event);
      }
    }]);

    return AbortSignal;
  }(Emitter);
  var AbortController =
  /*#__PURE__*/
  function () {
    function AbortController() {
      _classCallCheck(this, AbortController);

      // Compared to assignment, Object.defineProperty makes properties non-enumerable by default and
      // we want Object.keys(new AbortController()) to be [] for compat with the native impl
      Object.defineProperty(this, 'signal', {
        value: new AbortSignal(),
        writable: true,
        configurable: true
      });
    }

    _createClass(AbortController, [{
      key: "abort",
      value: function abort() {
        var event;

        try {
          event = new Event('abort');
        } catch (e) {
          if (typeof document !== 'undefined') {
            if (!document.createEvent) {
              // For Internet Explorer 8:
              event = document.createEventObject();
              event.type = 'abort';
            } else {
              // For Internet Explorer 11:
              event = document.createEvent('Event');
              event.initEvent('abort', false, false);
            }
          } else {
            // Fallback where document isn't available:
            event = {
              type: 'abort',
              bubbles: false,
              cancelable: false
            };
          }
        }

        this.signal.dispatchEvent(event);
      }
    }, {
      key: "toString",
      value: function toString() {
        return '[object AbortController]';
      }
    }]);

    return AbortController;
  }();

  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    // These are necessary to make sure that we get correct output for:
    // Object.prototype.toString.call(new AbortController())
    AbortController.prototype[Symbol.toStringTag] = 'AbortController';
    AbortSignal.prototype[Symbol.toStringTag] = 'AbortSignal';
  }

  function polyfillNeeded(self) {
    if (self.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL) {
      console.log('__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill');
      return true;
    } // Note that the "unfetch" minimal fetch polyfill defines fetch() without
    // defining window.Request, and this polyfill need to work on top of unfetch
    // so the below feature detection needs the !self.AbortController part.
    // The Request.prototype check is also needed because Safari versions 11.1.2
    // up to and including 12.1.x has a window.AbortController present but still
    // does NOT correctly implement abortable fetch:
    // https://bugs.webkit.org/show_bug.cgi?id=174980#c2


    return typeof self.Request === 'function' && !self.Request.prototype.hasOwnProperty('signal') || !self.AbortController;
  }

  /**
   * Note: the "fetch.Request" default value is available for fetch imported from
   * the "node-fetch" package and not in browsers. This is OK since browsers
   * will be importing umd-polyfill.js from that path "self" is passed the
   * decorator so the default value will not be used (because browsers that define
   * fetch also has Request). One quirky setup where self.fetch exists but
   * self.Request does not is when the "unfetch" minimal fetch polyfill is used
   * on top of IE11; for this case the browser will try to use the fetch.Request
   * default value which in turn will be undefined but then then "if (Request)"
   * will ensure that you get a patched fetch but still no Request (as expected).
   * @param {fetch, Request = fetch.Request}
   * @returns {fetch: abortableFetch, Request: AbortableRequest}
   */

  function abortableFetchDecorator(patchTargets) {
    if ('function' === typeof patchTargets) {
      patchTargets = {
        fetch: patchTargets
      };
    }

    var _patchTargets = patchTargets,
        fetch = _patchTargets.fetch,
        _patchTargets$Request = _patchTargets.Request,
        NativeRequest = _patchTargets$Request === void 0 ? fetch.Request : _patchTargets$Request,
        NativeAbortController = _patchTargets.AbortController,
        _patchTargets$__FORCE = _patchTargets.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL,
        __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL = _patchTargets$__FORCE === void 0 ? false : _patchTargets$__FORCE;

    if (!polyfillNeeded({
      fetch: fetch,
      Request: NativeRequest,
      AbortController: NativeAbortController,
      __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL: __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL
    })) {
      return {
        fetch: fetch,
        Request: Request
      };
    }

    var Request = NativeRequest; // Note that the "unfetch" minimal fetch polyfill defines fetch() without
    // defining window.Request, and this polyfill need to work on top of unfetch
    // hence we only patch it if it's available. Also we don't patch it if signal
    // is already available on the Request prototype because in this case support
    // is present and the patching below can cause a crash since it assigns to
    // request.signal which is technically a read-only property. This latter error
    // happens when you run the main5.js node-fetch example in the repo
    // "abortcontroller-polyfill-examples". The exact error is:
    //   request.signal = init.signal;
    //   ^
    // TypeError: Cannot set property signal of #<Request> which has only a getter

    if (Request && !Request.prototype.hasOwnProperty('signal') || __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL) {
      Request = function Request(input, init) {
        var signal;

        if (init && init.signal) {
          signal = init.signal; // Never pass init.signal to the native Request implementation when the polyfill has
          // been installed because if we're running on top of a browser with a
          // working native AbortController (i.e. the polyfill was installed due to
          // __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL being set), then passing our
          // fake AbortSignal to the native fetch will trigger:
          // TypeError: Failed to construct 'Request': member signal is not of type AbortSignal.

          delete init.signal;
        }

        var request = new NativeRequest(input, init);

        if (signal) {
          Object.defineProperty(request, 'signal', {
            writable: false,
            enumerable: false,
            configurable: true,
            value: signal
          });
        }

        return request;
      };

      Request.prototype = NativeRequest.prototype;
    }

    var realFetch = fetch;

    var abortableFetch = function abortableFetch(input, init) {
      var signal = Request && Request.prototype.isPrototypeOf(input) ? input.signal : init ? init.signal : undefined;

      if (signal) {
        var abortError;

        try {
          abortError = new DOMException('Aborted', 'AbortError');
        } catch (err) {
          // IE 11 does not support calling the DOMException constructor, use a
          // regular error object on it instead.
          abortError = new Error('Aborted');
          abortError.name = 'AbortError';
        } // Return early if already aborted, thus avoiding making an HTTP request


        if (signal.aborted) {
          return Promise.reject(abortError);
        } // Turn an event into a promise, reject it once `abort` is dispatched


        var cancellation = new Promise(function (_, reject) {
          signal.addEventListener('abort', function () {
            return reject(abortError);
          }, {
            once: true
          });
        });

        if (init && init.signal) {
          // Never pass .signal to the native implementation when the polyfill has
          // been installed because if we're running on top of a browser with a
          // working native AbortController (i.e. the polyfill was installed due to
          // __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL being set), then passing our
          // fake AbortSignal to the native fetch will trigger:
          // TypeError: Failed to execute 'fetch' on 'Window': member signal is not of type AbortSignal.
          delete init.signal;
        } // Return the fastest promise (don't need to wait for request to finish)


        return Promise.race([cancellation, realFetch(input, init)]);
      }

      return realFetch(input, init);
    };

    return {
      fetch: abortableFetch,
      Request: Request
    };
  }

  (function (self) {

    if (!polyfillNeeded(self)) {
      return;
    }

    if (!self.fetch) {
      console.warn('fetch() is not available, cannot install abortcontroller-polyfill');
      return;
    }

    var _abortableFetch = abortableFetchDecorator(self),
        fetch = _abortableFetch.fetch,
        Request = _abortableFetch.Request;

    self.fetch = fetch;
    self.Request = Request;
    Object.defineProperty(self, 'AbortController', {
      writable: true,
      enumerable: false,
      configurable: true,
      value: AbortController
    });
    Object.defineProperty(self, 'AbortSignal', {
      writable: true,
      enumerable: false,
      configurable: true,
      value: AbortSignal
    });
  })(typeof self !== 'undefined' ? self : global);
});

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = function (exports) {
    "use strict";

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction ||
      // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    exports.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function (arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
        // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);

      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function (object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function reset(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined;
            }
          }
        }
      },

      stop: function stop() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function dispatchException(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function complete(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;
  }(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  module.exports);

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
});

var dist = createCommonjsModule(function (module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    function sortBy() {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        return function (obj1, obj2) {
            var props = properties.filter(function (prop) {
                return typeof prop === 'string';
            });
            var map = properties.filter(function (prop) {
                return typeof prop === 'function';
            })[0];
            var i = 0;
            var result = 0;
            var numberOfProperties = props.length;
            while (result === 0 && i < numberOfProperties) {
                result = sort(props[i], map)(obj1, obj2);
                i++;
            }
            return result;
        };
    }
    exports.sortBy = sortBy;
    function sort(property, map) {
        var sortOrder = 1;
        if (property[0] === '-') {
            sortOrder = -1;
            property = property.substr(1);
        }
        if (property[property.length - 1] === '^') {
            property = property.substr(0, property.length - 1);
            map = function map(_key, value) {
                return typeof value === 'string' ? value.toLowerCase() : value;
            };
        }
        var apply = map || function (_key, value) {
            return value;
        };
        return function (a, b) {
            var result = 0;
            var mappedA = apply(property, objectPath(a, property));
            var mappedB = apply(property, objectPath(b, property));
            if (mappedA < mappedB) {
                result = -1;
            } else if (mappedA > mappedB) {
                result = 1;
            }
            return result * sortOrder;
        };
    }
    function objectPath(object, path) {
        var pathParts = path.split('.');
        var result = object;
        pathParts.forEach(function (part) {
            result = result[part];
        });
        return result;
    }
});

unwrapExports(dist);
var dist_1 = dist.sortBy;

var Fuse = require('fuse.js');

function queryJson(query, data, searchFields) {
  var options = {
    shouldSort: true,
    threshold: 0.2,
    location: 0,
    distance: 1000,
    keys: [searchFields]
  };
  var fuse = new Fuse(data, options);
  var result = fuse.search(query);
  return result;
}

function sanitiseTypeaheadText(string) {
  var sanitisedQueryRemoveChars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var trimEnd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var sanitisedString = string.toLowerCase();

  sanitisedQueryRemoveChars.forEach(function (char) {
    sanitisedString = sanitisedString.replace(new RegExp(char.toLowerCase(), 'g'), '');
  });

  sanitisedString = sanitisedString.replace(/\s\s+/g, ' ');

  sanitisedString = trimEnd ? sanitisedString.trim() : sanitisedString.trimStart();

  return sanitisedString;
}

var AboratableFetch = function () {
  function AboratableFetch(url, options) {
    var _this = this;

    classCallCheck(this, AboratableFetch);

    this.url = url;
    this.controller = new window.AbortController();
    this.options = _extends({}, options, { signal: this.controller.signal });

    fetch(url, options).then(function (response) {
      if (response.ok) {
        _this.thenCallback(response);
      } else {
        _this.catchCallback(response);
      }
    });
  }

  createClass(AboratableFetch, [{
    key: "then",
    value: function then(callback) {
      this.thenCallback = callback;
      return this;
    }
  }, {
    key: "catch",
    value: function _catch(callback) {
      this.catchCallback = callback;
      return this;
    }
  }, {
    key: "abort",
    value: function abort() {
      this.controller.abort();
    }
  }]);
  return AboratableFetch;
}();

var fetch$1 = (function (url, options) {
  return new AboratableFetch(url, options);
});

var baseClass = 'js-typeahead';

var classTypeaheadOption = 'typeahead-input__option';
var classTypeaheadOptionFocused = classTypeaheadOption + '--focused';
var classTypeaheadOptionNoResults = classTypeaheadOption + '--no-results u-fs-s';
var classTypeaheadOptionMoreResults = classTypeaheadOption + '--more-results u-fs-s';
var classTypeaheadHasResults = 'typeahead-input--has-results';

var TypeaheadUI = function () {
  function TypeaheadUI(_ref) {
    var context = _ref.context,
        typeaheadData = _ref.typeaheadData,
        sanitisedQueryReplaceChars = _ref.sanitisedQueryReplaceChars,
        minChars = _ref.minChars,
        resultLimit = _ref.resultLimit,
        suggestOnBoot = _ref.suggestOnBoot,
        onSelect = _ref.onSelect,
        onError = _ref.onError,
        onUnsetResult = _ref.onUnsetResult,
        suggestionFunction = _ref.suggestionFunction,
        lang = _ref.lang,
        ariaYouHaveSelected = _ref.ariaYouHaveSelected,
        ariaMinChars = _ref.ariaMinChars,
        ariaOneResult = _ref.ariaOneResult,
        ariaNResults = _ref.ariaNResults,
        ariaLimitedResults = _ref.ariaLimitedResults,
        moreResults = _ref.moreResults,
        resultsTitle = _ref.resultsTitle,
        noResults = _ref.noResults;
    classCallCheck(this, TypeaheadUI);

    // DOM Elements
    this.context = context;
    this.input = context.querySelector('.' + baseClass + '-input');
    this.resultsContainer = context.querySelector('.' + baseClass + '-results');
    this.listbox = this.resultsContainer.querySelector('.' + baseClass + '-listbox');
    this.instructions = context.querySelector('.' + baseClass + '-instructions');
    this.ariaStatus = context.querySelector('.' + baseClass + '-aria-status');

    // Settings
    this.typeaheadData = typeaheadData || context.getAttribute('data-typeahead-data');

    this.ariaYouHaveSelected = ariaYouHaveSelected || context.getAttribute('data-aria-you-have-selected');
    this.ariaMinChars = ariaMinChars || context.getAttribute('data-aria-min-chars');
    this.ariaOneResult = ariaOneResult || context.getAttribute('data-aria-one-result');
    this.ariaNResults = ariaNResults || context.getAttribute('data-aria-n-results');
    this.ariaLimitedResults = ariaLimitedResults || context.getAttribute('data-aria-limited-results');
    this.moreResults = moreResults || context.getAttribute('data-more-results');
    this.resultsTitle = resultsTitle || context.getAttribute('data-results-title');
    this.noResults = noResults || context.getAttribute('data-no-results');

    this.listboxId = this.listbox.getAttribute('id');
    this.minChars = minChars || 3;
    this.resultLimit = resultLimit || 10;
    this.suggestOnBoot = suggestOnBoot;
    this.lang = lang || 'en-gb';

    // Callbacks
    this.onSelect = onSelect;
    this.onUnsetResult = onUnsetResult;
    this.onError = onError;

    if (suggestionFunction) {
      this.fetchSuggestions = suggestionFunction;
    }

    // State
    this.ctrlKey = false;
    this.deleting = false;
    this.query = '';
    this.sanitisedQuery = '';
    this.previousQuery = '';
    this.results = [];
    this.resultOptions = [];
    this.foundResults = 0;
    this.numberOfResults = 0;
    this.highlightedResultIndex = 0;
    this.settingResult = false;
    this.resultSelected = false;
    this.blurring = false;
    this.blurTimeout = null;
    this.sanitisedQueryReplaceChars = sanitisedQueryReplaceChars || [];

    // Temporary fix as runner doesn't use full lang code
    if (this.lang === 'en') {
      this.lang = 'en-gb';
    }
    this.fetchData();
    this.initialiseUI();
  }

  createClass(TypeaheadUI, [{
    key: 'initialiseUI',
    value: function initialiseUI() {
      this.input.setAttribute('aria-autocomplete', 'list');
      this.input.setAttribute('aria-controls', this.listbox.getAttribute('id'));
      this.input.setAttribute('aria-describedby', this.instructions.getAttribute('id'));
      this.input.setAttribute('aria-has-popup', true);
      this.input.setAttribute('aria-owns', this.listbox.getAttribute('id'));
      this.input.setAttribute('aria-expanded', false);
      this.input.setAttribute('role', 'combobox');

      this.context.classList.add('typeahead-input--initialised');

      this.bindEventListeners();
    }
  }, {
    key: 'fetchData',
    value: function fetchData() {
      var loadJSON = function () {
        var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(jsonPath) {
          var jsonResponse, jsonData;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return fetch$1(jsonPath);

                case 3:
                  jsonResponse = _context.sent;

                  if (!(jsonResponse.status === 500)) {
                    _context.next = 6;
                    break;
                  }

                  throw new Error('Error fetching json data: ' + jsonResponse.status);

                case 6:
                  _context.next = 8;
                  return jsonResponse.json();

                case 8:
                  jsonData = _context.sent;
                  return _context.abrupt('return', jsonData);

                case 12:
                  _context.prev = 12;
                  _context.t0 = _context['catch'](0);

                  console.log(_context.t0);

                case 15:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this, [[0, 12]]);
        }));

        return function loadJSON(_x) {
          return _ref2.apply(this, arguments);
        };
      }();

      // Call loading of json file


      this.data = loadJSON(this.typeaheadData);
    }
  }, {
    key: 'bindEventListeners',
    value: function bindEventListeners() {
      this.input.addEventListener('keydown', this.handleKeydown.bind(this));
      this.input.addEventListener('keyup', this.handleKeyup.bind(this));
      this.input.addEventListener('input', this.handleChange.bind(this));
      this.input.addEventListener('focus', this.handleFocus.bind(this));
      this.input.addEventListener('blur', this.handleBlur.bind(this));

      this.listbox.addEventListener('mouseover', this.handleMouseover.bind(this));
      this.listbox.addEventListener('mouseout', this.handleMouseout.bind(this));
    }
  }, {
    key: 'handleKeydown',
    value: function handleKeydown(event) {
      this.ctrlKey = (event.ctrlKey || event.metaKey) && event.key !== 'v';

      switch (event.key) {
        case 'ArrowUp':
          {
            event.preventDefault();
            this.navigateResults(-1);
            break;
          }
        case 'ArrowDown':
          {
            event.preventDefault();
            this.navigateResults(1);
            break;
          }
        case 'Enter':
          {
            event.preventDefault();
            break;
          }
      }
    }
  }, {
    key: 'handleKeyup',
    value: function handleKeyup(event) {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          {
            event.preventDefault();
            break;
          }
        case 'Enter':
          {
            if (this.highlightedResultIndex == null) {
              this.clearListbox();
            } else {
              this.selectResult();
            }
            break;
          }
      }

      this.ctrlKey = false;
    }
  }, {
    key: 'handleChange',
    value: function handleChange() {
      if (!this.blurring && this.input.value.trim()) {
        this.getSuggestions();
      } else {
        this.abortFetch();
      }
    }
  }, {
    key: 'handleFocus',
    value: function handleFocus() {
      clearTimeout(this.blurTimeout);
      this.getSuggestions(true);
    }
  }, {
    key: 'handleBlur',
    value: function handleBlur() {
      var _this = this;

      clearTimeout(this.blurTimeout);
      this.blurring = true;

      this.blurTimeout = setTimeout(function () {
        _this.blurring = false;
      }, 300);
    }
  }, {
    key: 'handleMouseover',
    value: function handleMouseover() {
      var focusedItem = this.resultOptions[this.highlightedResultIndex];

      if (focusedItem) {
        focusedItem.classList.remove(classTypeaheadOptionFocused);
      }
    }
  }, {
    key: 'handleMouseout',
    value: function handleMouseout() {
      var focusedItem = this.resultOptions[this.highlightedResultIndex];

      if (focusedItem) {
        focusedItem.classList.add(classTypeaheadOptionFocused);
      }
    }
  }, {
    key: 'navigateResults',
    value: function navigateResults(direction) {
      var index$$1 = 0;

      if (this.highlightedResultIndex !== null) {
        index$$1 = this.highlightedResultIndex + direction;
      }

      if (index$$1 < this.numberOfResults) {
        if (index$$1 < 0) {
          index$$1 = null;
        }

        this.setHighlightedResult(index$$1);
      }
    }
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(force) {
      var _this2 = this;

      if (!this.settingResult) {
        var query = this.input.value;
        var sanitisedQuery = sanitiseTypeaheadText(query, this.sanitisedQueryReplaceChars);
        if (sanitisedQuery !== this.sanitisedQuery || force && !this.resultSelected) {
          this.unsetResults();
          this.setAriaStatus();

          this.query = query;
          this.sanitisedQuery = sanitisedQuery;

          if (this.sanitisedQuery.length >= this.minChars) {
            this.data.then(function (data) {
              _this2.fetchSuggestions(_this2.sanitisedQuery, data).then(_this2.handleResults.bind(_this2)).catch(function (error) {
                if (error.name !== 'AbortError' && _this2.onError) {
                  _this2.onError(error);
                }
              });
            });
          } else {
            this.clearListbox();
          }
        }
      }
    }
  }, {
    key: 'fetchSuggestions',
    value: function () {
      var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(sanitisedQuery, data) {
        var _this3 = this;

        var results;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.abortFetch();
                _context2.next = 3;
                return queryJson(sanitisedQuery, data, this.lang, this.resultLimit);

              case 3:
                results = _context2.sent;

                results.forEach(function (result) {
                  result.sanitisedText = sanitiseTypeaheadText(result[_this3.lang], _this3.sanitisedQueryReplaceChars);
                  if (_this3.lang !== 'en-gb') {
                    var english = result['en-gb'];
                    var sanitisedAlternative = sanitiseTypeaheadText(english, _this3.sanitisedQueryReplaceChars);

                    if (sanitisedAlternative.match(sanitisedQuery)) {
                      result.alternatives = [english];
                      result.sanitisedAlternatives = [sanitisedAlternative];
                    }
                  } else {
                    result.alternatives = [];
                    result.sanitisedAlternatives = [];
                  }
                });
                return _context2.abrupt('return', {
                  results: results,
                  totalResults: results.length
                });

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetchSuggestions(_x2, _x3) {
        return _ref3.apply(this, arguments);
      }

      return fetchSuggestions;
    }()
  }, {
    key: 'abortFetch',
    value: function abortFetch() {
      if (this.fetch && this.fetch.status !== 'DONE') {
        this.fetch.abort();
      }
    }
  }, {
    key: 'unsetResults',
    value: function unsetResults() {
      this.results = [];
      this.resultOptions = [];
      this.resultSelected = false;

      if (this.onUnsetResult) {
        this.onUnsetResult();
      }
    }
  }, {
    key: 'clearListbox',
    value: function clearListbox(preventAriaStatusUpdate) {
      this.listbox.innerHTML = '';
      this.context.classList.remove(classTypeaheadHasResults);
      this.input.removeAttribute('aria-activedescendant');
      this.input.removeAttribute('aria-expanded');

      if (!preventAriaStatusUpdate) {
        this.setAriaStatus();
      }
    }
  }, {
    key: 'handleResults',
    value: function handleResults(result) {
      var _this4 = this;

      this.foundResults = result.totalResults;

      if (result.results.length > 10) {
        result.results = result.results.slice(0, this.resultLimit);
      }

      this.results = result.results;
      this.numberOfResults = Math.max(this.results.length, 0);

      if (!this.deleting || this.numberOfResults && this.deleting) {
        if (this.numberOfResults === 1 && this.results[0].sanitisedText === this.sanitisedQuery) {
          this.clearListbox(true);
          this.selectResult(0);
        } else {
          this.listbox.innerHTML = '';
          this.resultOptions = this.results.map(function (result, index$$1) {
            var ariaLabel = result[_this4.lang];
            var innerHTML = _this4.emboldenMatch(ariaLabel, _this4.query);

            if (Array.isArray(result.sanitisedAlternatives)) {
              var alternativeMatch = result.sanitisedAlternatives.find(function (alternative) {
                return alternative !== result.sanitisedText && alternative.includes(_this4.sanitisedQuery);
              });

              if (alternativeMatch) {
                var alternativeText = result.alternatives[result.sanitisedAlternatives.indexOf(alternativeMatch)];
                innerHTML += ' <small>(' + _this4.emboldenMatch(alternativeText, _this4.query) + ')</small>';
                ariaLabel += ', (' + alternativeText + ')';
              }
            }

            var listElement = document.createElement('li');
            listElement.className = classTypeaheadOption;
            listElement.setAttribute('id', _this4.listboxId + '__option--' + index$$1);
            listElement.setAttribute('role', 'option');
            listElement.setAttribute('aria-label', ariaLabel);
            listElement.innerHTML = innerHTML;

            listElement.addEventListener('click', function () {
              _this4.selectResult(index$$1);
            });

            _this4.listbox.appendChild(listElement);

            return listElement;
          });

          if (this.numberOfResults < this.foundResults) {
            var listElement = document.createElement('li');
            listElement.className = classTypeaheadOption + ' ' + classTypeaheadOptionMoreResults;
            listElement.setAttribute('aria-hidden', 'true');
            listElement.innerHTML = this.moreResults;
            this.listbox.appendChild(listElement);
          }

          this.setHighlightedResult(null);

          this.input.setAttribute('aria-expanded', !!this.numberOfResults);
          this.context.classList[!!this.numberOfResults ? 'add' : 'remove'](classTypeaheadHasResults);
        }
      }
      if (this.numberOfResults === 0 && this.noResults) {
        this.listbox.innerHTML = '<li class="' + classTypeaheadOption + ' ' + classTypeaheadOptionNoResults + '">' + this.noResults + '</li>';
        this.input.setAttribute('aria-expanded', true);
      }
    }
  }, {
    key: 'setHighlightedResult',
    value: function setHighlightedResult(index$$1) {
      var _this5 = this;

      this.highlightedResultIndex = index$$1;

      if (this.highlightedResultIndex === null) {
        this.input.removeAttribute('aria-activedescendant');
      } else if (this.numberOfResults) {
        this.resultOptions.forEach(function (option, optionIndex) {
          if (optionIndex === index$$1) {
            option.classList.add(classTypeaheadOptionFocused);
            option.setAttribute('aria-selected', true);
            _this5.input.setAttribute('aria-activedescendant', option.getAttribute('id'));
          } else {
            option.classList.remove(classTypeaheadOptionFocused);
            option.removeAttribute('aria-selected');
          }
        });

        this.setAriaStatus();
      }
    }
  }, {
    key: 'setAriaStatus',
    value: function setAriaStatus(content) {
      if (!content) {
        var queryTooShort = this.sanitisedQuery.length < this.minChars;
        var noResults = this.numberOfResults === 0;

        if (queryTooShort) {
          content = this.ariaMinChars;
        } else if (noResults) {
          content = this.ariaNoResults + ': "' + this.query + '"';
        } else if (this.numberOfResults === 1) {
          content = this.ariaOneResult;
        } else {
          content = this.ariaNResults.replace('{n}', this.numberOfResults);

          if (this.resultLimit && this.foundResults > this.resultLimit) {
            content += ' ' + this.ariaLimitedResults;
          }
        }
      }

      this.ariaStatus.innerHTML = content;
    }
  }, {
    key: 'selectResult',
    value: function selectResult(index$$1) {
      var _this6 = this;

      if (this.results.length) {
        this.settingResult = true;

        var result = this.results[index$$1 || this.highlightedResultIndex || 0];

        this.resultSelected = true;

        if (result.sanitisedText !== this.sanitisedQuery && result.sanitisedAlternatives && result.sanitisedAlternatives.length) {
          var bestMatchingAlternative = result.sanitisedAlternatives.map(function (alternative, index$$1) {
            return {
              score: dice(_this6.sanitisedQuery, alternative),
              index: index$$1
            };
          }).sort(dist_1('score'))[0];

          var scoredSanitised = dice(this.sanitisedQuery, result.sanitisedText);

          if (bestMatchingAlternative.score >= scoredSanitised) {
            result.displayText = result.alternatives[bestMatchingAlternative.index];
          } else {
            result.displayText = result[this.lang];
          }
        } else {
          result.displayText = result[this.lang];
        }

        this.onSelect(result).then(function () {
          return _this6.settingResult = false;
        });

        var ariaMessage = this.ariaYouHaveSelected + ': ' + result.displayText + '.';

        this.clearListbox();
        this.setAriaStatus(ariaMessage);
      }
    }
  }, {
    key: 'emboldenMatch',
    value: function emboldenMatch(string, query) {
      query = query.toLowerCase().trim();

      if (string.toLowerCase().includes(query)) {
        var queryLength = query.length;
        var matchIndex = string.toLowerCase().indexOf(query);
        var matchEnd = matchIndex + queryLength;
        var before = string.substr(0, matchIndex);
        var match = string.substr(matchIndex, queryLength);
        var after = string.substr(matchEnd, string.length - matchEnd);

        return before + '<strong>' + match + '</strong>' + after;
      } else {
        return string;
      }
    }
  }]);
  return TypeaheadUI;
}();

var Typeahead = function () {
  function Typeahead(context) {
    classCallCheck(this, Typeahead);

    this.context = context;
    this.lang = document.documentElement.getAttribute('lang').toLowerCase();
    this.typeahead = new TypeaheadUI({
      context: context,
      lang: this.lang,
      onSelect: this.onSelect.bind(this),
      onUnsetResult: this.onUnsetResult.bind(this),
      onError: this.onError.bind(this)
    });
  }

  createClass(Typeahead, [{
    key: 'onSelect',
    value: function onSelect(result) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.typeahead.input.value = result.displayText;
        resolve();
      });
    }
  }, {
    key: 'onUnsetResult',
    value: function onUnsetResult() {
      return new Promise(function (resolve) {
        resolve();
      });
    }
  }, {
    key: 'onError',
    value: function onError(error) {
      console.error(error);
    }
  }]);
  return Typeahead;
}();

function typeaheads() {
  var typeaheads = [].concat(toConsumableArray(document.querySelectorAll('.js-typeahead')));

  typeaheads.forEach(function (typeahead) {
    return new Typeahead(typeahead);
  });
}

document.addEventListener('TYPEAHEAD-READY', typeaheads);

var UAC = function () {
  function UAC(context) {
    classCallCheck(this, UAC);

    this.input = context;
    var groupSize = parseInt(context.getAttribute('data-group-size'), 10);
    this.groupingRegex = new RegExp('.{1,' + groupSize + '}', 'g');

    this.bindEventListeners();
  }

  createClass(UAC, [{
    key: 'bindEventListeners',
    value: function bindEventListeners() {
      this.input.addEventListener('input', this.handleInput.bind(this));
    }
  }, {
    key: 'handleInput',
    value: function handleInput() {
      var cursorPosition = this.input.selectionStart;
      var shouldRepositionCursor = cursorPosition !== this.input.value.length;

      this.input.value = (this.input.value.replace(/\s/g, '').match(this.groupingRegex) || []).join(' ');

      if (shouldRepositionCursor) {
        this.input.setSelectionRange(cursorPosition, cursorPosition);
      }
    }
  }]);
  return UAC;
}();

function runUAC() {
  var uacInputs = [].concat(toConsumableArray(document.querySelectorAll('.js-uac')));

  if (uacInputs.length) {
    uacInputs.forEach(function (element) {
      return new UAC(element);
    });
  }
}

document.addEventListener('UAC-READY', runUAC);

var inputClassLimitReached = 'input--limit-reached';
var remainingClassLimitReached = 'input__limit--reached';
var attrCharCheckRef = 'data-char-check-ref';
var attrCharCheckVal = 'data-char-check-num';

var CharCheck = function () {
  function CharCheck(context) {
    classCallCheck(this, CharCheck);

    this.context = context;
    this.input = this.context.querySelector('input');
    this.checkElement = document.getElementById(this.input.getAttribute(attrCharCheckRef));
    this.checkVal = this.input.getAttribute(attrCharCheckVal);

    this.charLimitSingularMessage = this.checkElement.getAttribute('data-charcount-limit-singular');
    this.charLimitPluralMessage = this.checkElement.getAttribute('data-charcount-limit-plural');

    this.updateCheckReadout(null, true);
    this.input.addEventListener('input', this.updateCheckReadout.bind(this));
  }

  createClass(CharCheck, [{
    key: 'updateCheckReadout',
    value: function updateCheckReadout(event, firstRun) {
      var value = this.input.value;
      var remaining = this.checkVal - value.length;
      // Prevent aria live announcement when component initialises
      if (!firstRun && event.inputType) {
        this.checkElement.setAttribute('aria-live', 'polite');
      } else {
        this.checkElement.removeAttribute('aria-live');
      }

      this.checkRemaining(remaining);
      this.setCheckClass(remaining, this.input, inputClassLimitReached);
      this.setCheckClass(remaining, this.checkElement, remainingClassLimitReached);
    }
  }, {
    key: 'checkRemaining',
    value: function checkRemaining(remaining) {
      var message = void 0;
      if (remaining === -1) {
        message = this.charLimitSingularMessage;
        this.checkElement.innerText = message.replace('{x}', Math.abs(remaining));
      } else if (remaining < -1) {
        message = this.charLimitPluralMessage;
        this.checkElement.innerText = message.replace('{x}', Math.abs(remaining));
      }
      this.setShowMessage(remaining);
    }
  }, {
    key: 'setShowMessage',
    value: function setShowMessage(remaining) {
      this.checkElement.classList[remaining < 0 ? 'remove' : 'add']('u-d-no');
    }
  }, {
    key: 'setCheckClass',
    value: function setCheckClass(remaining, element, setClass) {
      element.classList[remaining < 0 ? 'add' : 'remove'](setClass);
    }
  }]);
  return CharCheck;
}();

var checkedWrapper = [].concat(toConsumableArray(document.querySelectorAll('.js-char-check')));
if (checkedWrapper.length) {
  checkedWrapper.forEach(function (input) {
    return new CharCheck(input);
  });
}

function autoIncrementId(collection) {
  var k = collection + '-increment',
      id = parseInt(sessionStorage.getItem(k)) || 0;

  id++;

  sessionStorage.setItem(k, JSON.stringify(id));

  return id;
}

function removeFromList(list, val) {

  function doRemove(item) {
    var foundId = list.indexOf(item);

    /**
     * Guard
     */
    if (foundId === -1) {
      console.log('Attempt to remove from list failed: ', list, val);
      return;
    }

    list.splice(foundId, 1);
  }

  if (_.isArray(val)) {
    $.each(val, function (i, item) {
      doRemove(item);
    });
  } else {
    doRemove(val);
  }
}

function trailingNameS(name) {
  return name[name.length - 1] === 's' ? '\&#x2019;' : '\&#x2019;s';
}

var HOUSEHOLD_MEMBERS_STORAGE_KEY = 'household-members';
var USER_HOUSEHOLD_MEMBER_ID = 'person_me';
var HOUSEHOLD_MEMBER_TYPE = 'household-member';
var VISITOR_TYPE = 'visitor';

/**
 * Types
 */
function person(opts) {
  if (opts.firstName === '' || opts.lastName === '') {
    console.log('Unable to create person with data: ', opts.firstName, !opts.middleName, !opts.lastName);
  }

  var middleName = opts.middleName || '';

  return {
    fullName: opts.firstName + ' ' + middleName + ' ' + opts.lastName,
    firstName: opts.firstName,
    middleName: middleName,
    lastName: opts.lastName
  };
}

/**
 * Storage
 */
function getUserAsHouseholdMember() {
  return getAllHouseholdMembers().find(function (member) {
    return member['@person'].id === USER_HOUSEHOLD_MEMBER_ID;
  });
}

function deleteUserAsHouseholdMember() {
  deleteHouseholdMember(USER_HOUSEHOLD_MEMBER_ID);
}

function deleteHouseholdMember(personId) {
  var members = getAllHouseholdMembers().filter(function (member) {
    return member['@person'].id !== personId;
  });

  sessionStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(members));
}

function updateUserAsHouseholdMember(person, memberData) {
  var userAsHouseholdMember = getUserAsHouseholdMember();

  userAsHouseholdMember ? updateHouseholdMember(_extends({}, userAsHouseholdMember['@person'], person), memberData) : addHouseholdMember(person, memberData, USER_HOUSEHOLD_MEMBER_ID);
}

function updateHouseholdMember(person, memberData) {
  var membersUpdated = getAllHouseholdMembers().map(function (member) {
    return member['@person'].id === person.id ? _extends({}, member, memberData, { '@person': _extends({}, member['@person'], person) }) : member;
  });

  sessionStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(membersUpdated));
}

function addHouseholdMember(person, memberData, id) {
  var people = getAllHouseholdMembers() || [];
  memberData = memberData || {};

  /**
   * User is always first in the household list
   */
  people[id === USER_HOUSEHOLD_MEMBER_ID ? 'unshift' : 'push'](_extends({}, memberData, {
    type: memberData.type || HOUSEHOLD_MEMBER_TYPE,
    '@person': _extends({}, person, {
      id: id || 'person' + autoIncrementId('household-members')
    })
  }));

  sessionStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(people));
}

function getAllHouseholdMembers() {
  return JSON.parse(sessionStorage.getItem(HOUSEHOLD_MEMBERS_STORAGE_KEY)) || [];
}

function getHouseholdMemberByPersonId(id) {
  return getAllHouseholdMembers().find(function (member) {
    return member['@person'].id === id;
  });
}

function getMemberPersonId(member) {
  return member['@person'].id;
}

/**
 * Comparators
 */
function isVisitor(member) {
  return member.type === window.ONS.storage.KEYS.VISITOR_TYPE;
}

function isHouseholdMember(member) {
  return member.type === window.ONS.storage.KEYS.HOUSEHOLD_MEMBER_TYPE;
}

function isOtherHouseholdMember(member) {
  return member.type === window.ONS.storage.KEYS.HOUSEHOLD_MEMBER_TYPE && member['@person'].id !== window.ONS.storage.IDS.USER_HOUSEHOLD_MEMBER_ID;
}

var tempAwayQuestionSentenceMap = {
  'three-more': 'People who usually live outside the UK who are staying in the UK for <strong>3 months or more</strong>',
  'perm-away': 'People who work away from home within the UK if this is their permanent or family home',
  'armed-forces': 'Members of the armed forces if this is their permanent or family home',
  'less-twelve': 'People who are temporarily outside the UK for less than <strong>12 months</strong>',
  'usually-temp': 'People staying temporarily who usually live in the UK but' + ' do not have another UK address for example, relatives, friends',
  'other': 'Other people who usually live here but are temporarily away'
};

var visitorQuestionSentenceMap = {
  'usually-in-uk': 'People who usually live somewhere else in the UK, for example boy/girlfriends, friends or relatives',
  'second-address': 'People staying here because it is their second address, for example, for work. Their permanent or family home is elsewhere',
  'less-three': 'People who usually live outside the UK who are staying in the UK for less than three months',
  'on-holiday': 'People here on holiday'
};

/**
 * Augment Underscore library
 */
var _$1 = window._ || {};

var RELATIONSHIPS_STORAGE_KEY = 'relationships';

var relationshipTypes = {
  'spouse': { id: 'spouse' },
  'child-parent': { id: 'child-parent' },
  'step-child-parent': { id: 'step-child-parent' },
  'grandchild-grandparent': { id: 'grandchild-grandparent' },
  'half-sibling': { id: 'half-sibling' },
  'sibling': { id: 'sibling' },
  'step-brother-sister': { id: 'step-brother-sister' },
  'partner': { id: 'partner' },
  'unrelated': { id: 'unrelated' },
  'other-relation': { id: 'other-relation' }
};

var relationshipDescriptionMap = {
  // covered
  'husband-wife': {
    sentanceLabel: 'husband or wife',
    summaryAdjective: 'husband or wife',
    type: relationshipTypes['spouse']
  },
  // covered
  'mother-father': {
    sentanceLabel: 'mother or father',
    summaryAdjective: 'mother or father',
    type: relationshipTypes['child-parent']
  },
  // covered
  'step-mother-father': {
    sentanceLabel: 'stepmother or stepfather',
    summaryAdjective: 'stepmother or stepfather',
    type: relationshipTypes['step-child-parent']
  },
  // covered
  'son-daughter': {
    sentanceLabel: 'son or daughter',
    summaryAdjective: 'son or daughter',
    type: relationshipTypes['child-parent']
  },
  // covered
  'half-brother-sister': {
    sentanceLabel: 'half-brother or half-sister',
    summaryAdjective: 'half-brother or half-sister',
    type: relationshipTypes['half-sibling']
  },
  // covered
  'step-child': {
    sentanceLabel: 'stepchild',
    summaryAdjective: 'stepchild',
    type: relationshipTypes['step-child-parent']
  },
  // covered
  'grandparent': {
    sentanceLabel: 'grandparent',
    summaryAdjective: 'grandparent',
    type: relationshipTypes['grandchild-grandparent']
  },
  // covered
  'grandchild': {
    sentanceLabel: 'grandchild',
    summaryAdjective: 'grandchild',
    type: relationshipTypes['grandchild-grandparent']
  },
  // covered
  'brother-sister': {
    sentanceLabel: 'brother or sister',
    summaryAdjective: 'brother or sister',
    type: relationshipTypes['sibling']
  },
  // covered
  'step-brother-sister': {
    sentanceLabel: 'stepbrother or stepsister',
    summaryAdjective: 'stepbrother or stepsister',
    type: relationshipTypes['step-brother-sister']
  },
  // covered
  'other-relation': {
    sentanceLabel: 'other relation',
    summaryAdjective: 'related',
    type: relationshipTypes['other-relation']
  },
  // covered
  'partner': {
    sentanceLabel: 'partner',
    summaryAdjective: 'partner',
    type: relationshipTypes['partner']
  },
  'same-sex-partner': {
    sentanceLabel: 'legally registered civil partner',
    summaryAdjective: 'legally registered civil partner',
    type: relationshipTypes['partner']
  },
  // covered
  'unrelated': {
    sentanceLabel: 'unrelated',
    summaryAdjective: 'unrelated',
    type: relationshipTypes['unrelated']
  }
};

function nameElement(name) {
  return '<strong>' + name + '</strong>';
}

function personListStr(peopleArr) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (peopleArr.length < 1) {
    console.log(peopleArr, 'not enough people to create a list string');
    return;
  }

  if (peopleArr.length === 1) {
    return nameElement(peopleArr[0].fullName + formatPersonIfYou(peopleArr[0]));
  }

  var peopleCopy = [].concat(toConsumableArray(peopleArr)),
      lastPerson = peopleCopy.pop();

  return peopleCopy.map(function (person$$1) {
    return '' + nameElement(person$$1.fullName + (opts.isFamily ? trailingNameS(person$$1.fullName) : '') + formatPersonIfYou(person$$1));
  }).join(', ') + ' and ' + nameElement(lastPerson.fullName + (opts.isFamily ? trailingNameS(lastPerson.fullName) : '') + formatPersonIfYou(lastPerson));
}

function formatPersonIfYou(person$$1) {
  return person$$1.id === USER_HOUSEHOLD_MEMBER_ID ? ' (You)' : '';
}

var relationshipSummaryTemplates = {
  'partnership': function partnership(person1, person2, description) {
    return nameElement(person1.fullName + formatPersonIfYou(person1)) + ' is ' + nameElement(person2.fullName + trailingNameS(person2.fullName) + formatPersonIfYou(person2)) + ' ' + description;
  },
  'twoFamilyMembersToMany': function twoFamilyMembersToMany(parent1, parent2, childrenArr, description) {
    return nameElement(parent1.fullName + formatPersonIfYou(parent1)) + ' and ' + nameElement(parent2.fullName + formatPersonIfYou(parent2)) + ' are ' + personListStr(childrenArr, { isFamily: true }) + ' ' + description;
  },
  'oneFamilyMemberToMany': function oneFamilyMemberToMany(parent, childrenArr, description) {
    console.log(parent, childrenArr, description);
    return nameElement(parent.fullName + formatPersonIfYou(parent)) + ' is ' + personListStr(childrenArr, { isFamily: true }) + ' ' + description;
  },
  'manyToMany': function manyToMany(peopleArr1, peopleArr2, description) {
    return personListStr(peopleArr1) + ' ' + (peopleArr1.length > 1 ? 'are' : 'is') + ' ' + description + ' to ' + personListStr(peopleArr2);
  },
  'allMutual': function allMutual(peopleArr, description) {
    return personListStr(peopleArr) + ' are ' + description;
  }
};

/**
 * Types
 */
function relationship(description, personIsId, personToId) {
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return {
    personIsDescription: description,
    personIsId: personIsId,
    personToId: personToId,
    inferred: !!opts.inferred,
    inferredBy: opts.inferredBy
  };
}

/**
 * Storage
 */
function addRelationship(relationshipObj) {
  var householdRelationships = getAllRelationships() || [],
      item = _extends({}, relationshipObj, {
    id: autoIncrementId(RELATIONSHIPS_STORAGE_KEY)
  });

  householdRelationships.push(item);

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));

  return item;
}

function deleteRelationship(relationshipObj) {
  var householdRelationships = (getAllRelationships() || []).filter(function (relationship) {
    return relationship.id !== relationshipObj.id;
  });

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));
}

function editRelationship(relationshipId, valueObject) {
  var householdRelationships = (getAllRelationships() || []).map(function (relationship) {
    return relationship.id + '' === relationshipId + '' ? _extends({}, valueObject, {
      id: relationshipId
    }) : relationship;
  });

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));
}

function getAllRelationships() {
  return JSON.parse(sessionStorage.getItem(RELATIONSHIPS_STORAGE_KEY)) || [];
}

function getAllManualRelationships() {
  return getAllRelationships().filter(function (relationship) {
    return !relationship.inferred;
  });
}

function deleteAllRelationshipsForMember(personId) {
  var householdRelationships = getAllRelationships().filter(function (relationship) {
    return !(personId === relationship.personIsId || personId === relationship.personToId);
  });

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));
}

/**
 * Comparators
 */
function isInRelationship(personId, relationship) {
  return relationship.personToId === personId || relationship.personIsId === personId;
}

function isAChildInRelationship(personId, relationship) {
  /**
   * Guard
   */
  if (!isInRelationship(personId, relationship)) {
    return false;
  }

  return relationship.personIsDescription === 'mother-father' && relationship.personToId === personId || relationship.personIsDescription === 'son-daughter' && relationship.personIsId === personId;
}

function isASiblingInRelationship(personId, relationship) {
  return isInRelationship(personId, relationship) && relationshipDescriptionMap[relationship.personIsDescription].type.id === 'sibling';
}

function isAParentInRelationship(personId, relationship) {
  /**
   * Guard
   */
  if (!isInRelationship(personId, relationship)) {
    return false;
  }

  return relationship.personIsDescription === 'mother-father' && relationship.personIsId === personId || relationship.personIsDescription === 'son-daughter' && relationship.personToId === personId;
}

function areAnyChildrenInRelationshipNotParent(childrenIds, notParentId, relationship) {
  /**
   * Guard
   * If relationship type is not child-parent
   */
  if (relationshipDescriptionMap[relationship.personIsDescription].type.id !== 'child-parent') {

    return false;
  }

  var childIndexAsPersonIs = childrenIds.indexOf(relationship.personIsId),
      childIndexAsPersonTo = childrenIds.indexOf(relationship.personToId);

  /**
   * Find parents with the same children
   *
   * If a personIs-child is not in relationship
   * or 2 children are found in relationship
   */
  if (childIndexAsPersonIs === -1 && childIndexAsPersonTo === -1 || childIndexAsPersonIs !== -1 && childIndexAsPersonTo !== -1) {
    return false;
  }

  /**
   * Child must be in relationship, get child index
   */
  var childIndex = childIndexAsPersonIs !== -1 ? childIndexAsPersonIs : childIndexAsPersonTo;

  /**
   * If personIs is not in relationship
   * and child from previous relationship is a child in this relationship
   */
  return !isInRelationship(notParentId, relationship) && isAChildInRelationship(childrenIds[childIndex], relationship);
}

function isRelationshipType(relationshipType, relationship) {
  var typeOfRelationship = relationshipDescriptionMap[relationship.personIsDescription].type.id;

  /**
   * relationshipType can be an array of types
   */
  return _$1.isArray(relationshipType) ? !!_$1.find(relationshipType, function (rType) {
    return rType === typeOfRelationship;
  }) : typeOfRelationship === relationshipType;
}

function isRelationshipInferred(relationship) {
  return relationship.inferred;
}

/**
 * Retrieve people by role in relationships
 */
function getParentIdFromRelationship(relationship) {
  var parentId = void 0;

  if (relationship.personIsDescription === 'mother-father') {
    parentId = relationship.personIsId;
  }

  if (relationship.personIsDescription === 'son-daughter') {
    parentId = relationship.personToId;
  }

  if (!parentId) {
    console.log('Parent not found in relationship: ', relationship);
    return false;
  }

  return parentId;
}

function getChildIdFromRelationship(relationship) {
  var childId = void 0;

  if (relationship.personIsDescription === 'mother-father') {
    childId = relationship.personToId;
  }

  if (relationship.personIsDescription === 'son-daughter') {
    childId = relationship.personIsId;
  }

  if (!childId) {
    console.log('Child not found in relationship: ', relationship);
    return false;
  }

  return childId;
}

function getSiblingIdFromRelationship(personId, relationship) {
  if (!isInRelationship(personId, relationship)) {
    console.log('Person ' + personId + ' not found in relationship: ', relationship);
    return false;
  }

  return relationship[relationship.personIsId === personId ? 'personToId' : 'personIsId'];
}

function getOtherPersonIdFromRelationship(personId, relationship) {
  return relationship.personIsId === personId ? relationship.personToId : relationship.personIsId;
}

function getAllParentsOf(personId) {
  return getAllRelationships().filter(isAChildInRelationship.bind(null, personId)).map(function (relationship) {
    return getPersonFromMember(getHouseholdMemberByPersonId(getParentIdFromRelationship(relationship)));
  });
}

function getAllChildrenOf(personId) {
  return getAllRelationships().filter(isAParentInRelationship.bind(null, personId)).map(function (relationship) {
    return getHouseholdMemberByPersonId(getChildIdFromRelationship(relationship))['@person'];
  });
}

function getPersonIdFromPerson(person$$1) {
  return person$$1.id;
}

function getPersonFromMember(member) {
  return member['@person'];
}

/**
 * Missing relationship inference
 */
var missingRelationshipInference = {
  siblingsOf: function siblingsOf(subjectMember) {

    var missingRelationships = [],
        allRelationships = getAllRelationships(),
        person$$1 = getPersonFromMember(subjectMember),
        personId = person$$1.id,
        parents = getAllParentsOf(personId),
        siblingIds = allRelationships.filter(isASiblingInRelationship.bind(null, personId)).map(getSiblingIdFromRelationship.bind(null, personId));

    /**
     * If 2 parent relationships of 'person' are found we can attempt to infer
     * sibling relationships
     */
    if (parents.length === 2) {

      getAllHouseholdMembers().filter(isHouseholdMember).forEach(function (member) {

        var memberPersonId = member['@person'].id;

        /**
         * Guard
         * If member is the subject member
         * or member is a parent
         * or member already has a sibling relationship with 'person'
         * skip member
         */
        if (memberPersonId === personId || memberPersonId === parents[0].id || memberPersonId === parents[1].id || siblingIds.indexOf(memberPersonId) > -1) {
          return;
        }

        var memberParents = getAllParentsOf(memberPersonId);

        /**
         * If 2 parents of 'member' are found
         * and they are the same parents of 'person'
         * we have identified a missing inferred relationship
         */
        if (memberParents.length === 2 && _$1.difference(parents.map(getPersonIdFromPerson), memberParents.map(getPersonIdFromPerson)).length === 0) {

          /**
           * Add to missingRelationships
           */
          missingRelationships.push(relationship('brother-sister', personId, memberPersonId, {
            inferred: true,
            inferredBy: [
            /**
             * Must be 4 relationships
             * Could have used member's parents but we can assume they
             * must be the same at this point or the inferrence
             * couldn't happen.
             */
            getRelationshipOf(personId, parents[0].id).id, getRelationshipOf(personId, parents[1].id).id, getRelationshipOf(memberPersonId, parents[0].id).id, getRelationshipOf(memberPersonId, parents[1].id).id]
          }));
        }
      });
    }

    return missingRelationships;
  }
};

function inferRelationships(relationship, personIs, personTo) {
  var missingRelationships = [];

  if (relationship.personIsDescription === 'mother-father') {
    missingRelationships = missingRelationships.concat(missingRelationshipInference.siblingsOf(personTo));
  }

  if (relationship.personIsDescription === 'son-daughter') {
    missingRelationships = missingRelationships.concat(missingRelationshipInference.siblingsOf(personIs));
  }

  $.each(missingRelationships, function (i, relationship) {
    addRelationship(relationship);
  });
}

function findNextMissingRelationship() {
  var householdMembers = getAllHouseholdMembers().filter(isHouseholdMember),
      relationships = getAllRelationships(),
      missingRelationshipMembers = [],
      personIs = null;

  /**
   * Find the next missing relationship
   */
  $.each(householdMembers, function (i, member) {
    var personId = member['@person'].id;

    /**
     * Get all relationships for this member
     */
    var memberRelationships = relationships.filter(function (relationship) {
      return relationship.personIsId === personId || relationship.personToId === personId;
    }),
        memberRelationshipToIds = memberRelationships.map(function (relationship) {
      return relationship.personIsId === personId ? relationship.personToId : relationship.personIsId;
    }) || [];

    /**
     * If total relationships related to this member isn't equal to
     * total household members -1, indicates missing relationship
     */
    if (memberRelationships.length < householdMembers.length - 1) {

      /**
       * All missing relationship members
       */
      missingRelationshipMembers = householdMembers.filter(function (m) {
        return memberRelationshipToIds.indexOf(m['@person'].id) === -1 && m['@person'].id !== personId;
      });

      personIs = member;

      return false;
    }
  });

  return personIs ? {
    personIs: personIs,
    personTo: missingRelationshipMembers[0]
  } : null;
}

function getPeopleIdsMissingRelationshipsWithPerson(personId) {
  var remainingPersonIds = getAllHouseholdMembers().filter(isHouseholdMember).map(function (member) {
    return member['@person'].id;
  });

  /**
   * Remove this person from the list
   */
  removeFromList(remainingPersonIds, personId);

  $.each(getAllRelationships(), function (i, relationship) {
    if (!isInRelationship(personId, relationship)) {
      return;
    }

    /**
     * Remove the other person from the remainingPersonIds list
     */
    removeFromList(remainingPersonIds, getOtherPersonIdFromRelationship(personId, relationship));
  });

  return remainingPersonIds;
}

function getRelationshipType(relationship) {
  return relationshipDescriptionMap[relationship.personIsDescription].type;
}

/**
 * Retrieve from relationship group
 */
function getRelationshipsWithPersonIds(relationships, idArr) {
  return relationships.filter(function (childRelationship) {
    return idArr.indexOf(childRelationship.personIsId) !== -1 || idArr.indexOf(childRelationship.personToId) !== -1;
  });
}

function getRelationshipOf(person1, person2) {
  return getAllRelationships().find(function (relationship) {
    return isInRelationship(person1, relationship) && isInRelationship(person2, relationship);
  });
}

function getNextPersonId(person$$1) {
  if (person$$1 === 'person_me') {
    return 'person1';
  } else {
    var personInt = person$$1.slice(person$$1.length - 1, person$$1.length);
    personInt = ++personInt;
    return 'person' + personInt;
  }
}

var PERSONAL_DETAILS_KEY = 'individual-details';
var PERSONAL_PINS_KEY = 'individual-pins';

var personalDetailsMaritalStatusMap = {
  'never': {
    description: 'Never married and never registered a same-sex civil' + ' partnership'
  },
  'married': {
    description: 'Married'
  },
  'registered': {
    description: 'In a registered same-sex civil partnership'
  },
  'separated-married': {
    description: 'Separated, but still legally married'
  },
  'divorced': {
    description: 'Divorced'
  },
  'former-partnership': {
    description: 'Formerly in a same-sex civil partnership which is now' + ' legally dissolved'
  },
  'widowed': {
    description: 'Widowed'
  },
  'surviving-partner': {
    description: 'Surviving partner from a same-sex civil partnership'
  },
  'separated-partnership': {
    description: 'Separated, but still legally in a same-sex civil partnership'
  }
};

var personalDetailsCountryMap = {
  'england': {
    description: 'England'
  },
  'wales': {
    description: 'Wales'
  },
  'scotland': {
    description: 'Scotland'
  },
  'northern-ireland': {
    description: 'Northern Ireland'
  },
  'republic-ireland': {
    description: 'Republic of Ireland'
  }
};

var personalDetailsOrientationMap = {
  'straight': {
    description: 'Straight or Heterosexual'
  },
  'gay': {
    description: 'Gay or Lesbian'
  },
  'bisexual': {
    description: 'Bisexual'
  },
  'other': {
    description: 'Other'
  },
  'no-say': {
    description: 'Prefer not to say'
  }
};

var personalDetailsGenderMap = {
  'male': {
    description: 'Male'
  },
  'female': {
    description: 'Female'
  }
};

var personalDetailsNationalIdentityMap = {
  'english': {
    description: 'English'
  },
  'welsh': {
    description: 'Welsh'
  },
  'scottish': {
    description: 'Scottish'
  },
  'northern-irish': {
    description: 'Northern Irish'
  },
  'british': {
    description: 'British'
  }
};

var personalDetailsPassportCountriesMap = {
  'united-kingdom': {
    description: 'United Kingdom'
  },
  'ireland': {
    description: 'Ireland'
  },
  'none': {
    description: 'None'
  }
};

var personalDetailsEthnicGroupMap = {
  'white': {
    'question': 'White',
    'options': [{
      val: 'british',
      label: 'English, Welsh, Scottish, Northern Irish or British'
    }, {
      val: 'irish',
      label: 'Irish'
    }, {
      val: 'gypsy',
      label: 'Gypsy or Irish Traveler'
    }, {
      val: 'roma',
      label: 'Roma'
    }, {
      val: 'other',
      label: 'Any other White background',
      description: 'You can enter an ethnic group or background on the next question'
    }]
  },
  'mixed': {
    'question': 'Mixed or Multiple',
    'options': [{
      val: 'white-black-caribbean',
      label: 'White and Black Caribbean'
    }, {
      val: 'white-black-african',
      label: 'White and Black African'
    }, {
      val: 'white-asian',
      label: 'White and Asian'
    }, {
      val: 'other',
      label: 'Any other Mixed or Multiple background'
    }]
  },
  'asian': {
    'question': 'Asian or Asian British',
    'options': [{
      val: 'indian',
      label: 'Indian'
    }, {
      val: 'pakistani',
      label: 'Pakistani'
    }, {
      val: 'bangladeshi',
      label: 'Bangladeshi'
    }, {
      val: 'chinese',
      label: 'Chinese'
    }, {
      val: 'other',
      label: 'Any other Asian ethnic group or background'
    }]
  },
  'black': {
    'question': 'Black, African, Caribbean or Black British',
    'options': [{
      val: 'african',
      label: 'African'
    }, {
      val: 'caribbean',
      label: 'Caribbean'
    }, {
      val: 'other',
      label: 'Any other Black, African or Caribbean background'
    }]
  },
  'other': {
    'question': 'Other',
    'options': [{
      val: 'arab',
      label: 'Arab'
    }, {
      val: 'other',
      label: 'Any other ethnic group'
    }]
  }
};

var personalDetailsApprenticeshipMap = {
  'yes': {
    description: 'Yes'
  },
  'no': {
    description: 'No'
  }
};

var personalDetailsDegreeAboveMap = {
  'yes': {
    description: 'Yes'
  },
  'no': {
    description: 'No'
  }
};

var personalDetailsNVQMap = {
  'nvq-level-1': {
    description: 'NVQ level 1 or equivalent'
  },
  'nvq-level-2': {
    description: 'NVQ level 2 or equivalent'
  },
  'nvq-level-3': {
    description: 'NVQ level 3 or equivalent'
  },
  'none': {
    description: 'None'
  }
};

var personalDetailsALevelMap = {
  'a-level-2': {
    description: '2 or more A levels'
  },
  'a-level-1-btec': {
    description: '1 A level'
  },
  'a-level-1': {
    description: '1 AS level'
  },
  'baccalaureate': {
    description: 'Advanced Welsh Baccalaureate'
  },
  'none': {
    description: 'None'
  }
};

var personalDetailsGCSEMap = {
  'gcse-5': {
    description: '5 or more GCSEs grades A* to C or 9 to 4'
  },
  'other-gcses': {
    description: 'Any other GCSEs'
  },
  'basic-skills': {
    description: 'Basic skills course'
  },
  'national-baccalaureate': {
    description: 'National Welsh Baccalaureate'
  },
  'foundation-baccalaureate': {
    description: 'Foundation Welsh Baccalaureate'
  },
  'none': {
    description: 'None of these apply'
  }
};

var personalDetailsOtherWhere = {
  'in-england-wales': {
    description: 'Yes, in England or Wales'
  },
  'outside-england-wales': {
    description: 'Yes, anywhere outside of England and Wales'
  },
  'none': {
    description: 'No qualifications'
  }
};

var personalDetailsEmploymentStatus = {
  'employee': {
    description: 'Employee'
  },
  'freelance-without-employees': {
    description: 'Self-employed or freelance without employees'
  },
  'freelance-with-employees': {
    description: 'Self-employed with employees'
  },
  'not-employed': {
    description: 'Not employed'
  }
};

function changeDetailsFor(personId, mutation) {
  var details = getPersonalDetailsFor(personId);

  updatePersonalDetails(personId, _extends({}, details, mutation(details || {})));

  return details;
}

function addUpdatePersonalDetailsDOB(personId, day, month, year) {
  return changeDetailsFor(personId, function () {
    return {
      'dob': {
        day: day,
        month: month,
        year: year
      }
    };
  });
}

function addUpdateMaritalStatus(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'maritalStatus': val
    };
  });
}

function addUpdateCountry(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'country': {
        val: val
      }
    };
  });
}

function addUpdateCountryOther(personId, otherText) {
  return changeDetailsFor(personId, function (details) {
    return {
      'country': _extends({}, details['country'] || {}, {
        otherText: otherText
      })
    };
  });
}

function addUpdateNationalIdentity(personId, collection, otherText) {
  return changeDetailsFor(personId, function () {
    return {
      'national-identity': _extends({
        collection: collection
      }, collection.find(function (val) {
        return val === 'other';
      }) ? { otherText: otherText } : {})
    };
  });
}

function addUpdateNationalIdentityOther(personId, otherText) {
  return changeDetailsFor(personId, function (details) {
    return {
      'national-identity': _extends({}, details['national-identity'] || {}, { otherText: otherText })
    };
  });
}

function addUpdateEthnicGroup(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'ethnic-group': {
        val: val
      }
    };
  });
}

function addUpdateEthnicGroupDescription(personId, description) {
  return changeDetailsFor(personId, function (details) {
    return {
      'ethnic-group': _extends({}, details['ethnic-group'] || {}, { description: description })
    };
  });
}

function addUpdateEthnicGroupOther(personId, otherText) {
  return changeDetailsFor(personId, function (details) {
    return {
      'ethnic-group': _extends({}, details['ethnic-group'] || {}, { otherText: otherText })
    };
  });
}

function addUpdatePassportCountry(personId, countries) {
  return changeDetailsFor(personId, function (details) {
    return {
      'passport': _extends({}, details['passport'] || {}, {
        countries: countries
      })
    };
  });
}

function addUpdatePassportCountryOther(personId, otherText) {
  return changeDetailsFor(personId, function (details) {
    return {
      'passport': _extends({}, details['passport'] || {}, {
        otherText: otherText
      })
    };
  });
}

function addUpdateOrientation(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'orientation': val
    };
  });
}

function addUpdateSalary(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'salary': val
    };
  });
}

function addUpdateSex(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'sex': val
    };
  });
}

function addUpdateAddressWhere(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'address-where': val
    };
  });
}

function addUpdateAge(personId, val, _ref) {
  var _ref$isApproximate = _ref.isApproximate,
      isApproximate = _ref$isApproximate === undefined ? false : _ref$isApproximate;

  return changeDetailsFor(personId, function () {
    return {
      'age': {
        val: val,
        isApproximate: isApproximate
      }
    };
  });
}

function addUpdateAgeConfirm(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'age-confirm': {
        val: val
      }
    };
  });
}

function addUpdateAddressOutsideUK(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'address-outside-uk': val
    };
  });
}

function addUpdateAddressIndividual(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'address': val
    };
  });
}

function addUpdateApprenticeship(personId, hasApprenticeship) {
  return changeDetailsFor(personId, function () {
    return {
      'apprenticeship': {
        hasApprenticeship: hasApprenticeship
      }
    };
  });
}

function addUpdateHasQualificationAbove(personId, aboveDegree) {
  return changeDetailsFor(personId, function (details) {
    return {
      'qualifications': _extends({}, details['qualifications'] || {}, {
        aboveDegree: aboveDegree
      })
    };
  });
}

function addUpdateQualificationsNvqEquivalent(personId, nvqEquivalent) {
  return changeDetailsFor(personId, function (details) {
    return {
      'qualifications': _extends({}, details['qualifications'] || {}, {
        nvqEquivalent: nvqEquivalent
      })
    };
  });
}

function addUpdateQualificationsALevel(personId, aLevels) {
  return changeDetailsFor(personId, function (details) {
    return {
      'qualifications': _extends({}, details['qualifications'] || {}, {
        aLevels: aLevels
      })
    };
  });
}

function addUpdateQualificationsGCSEs(personId, gcses) {
  return changeDetailsFor(personId, function (details) {
    return {
      'qualifications': _extends({}, details['qualifications'] || {}, {
        gcses: gcses
      })
    };
  });
}

function addUpdateQualificationsOtherWhere(personId, othersWhere) {
  return changeDetailsFor(personId, function (details) {
    return {
      'qualifications': _extends({}, details['qualifications'] || {}, {
        othersWhere: othersWhere
      })
    };
  });
}

function addUpdateEmploymentStatus(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'employment-status': {
        val: val
      }
    };
  });
}

function addUpdateJobTitle(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'job-title': {
        val: val
      }
    };
  });
}

function addUpdateJobDescribe(personId, val) {
  return changeDetailsFor(personId, function () {
    return {
      'job-describe': {
        val: val
      }
    };
  });
}

function getPins() {
  return JSON.parse(sessionStorage.getItem(PERSONAL_PINS_KEY)) || {};
}

function createPinFor(personId) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var pins = getPins();

  pins[personId] = {
    pin: _.random(10000, 99999),
    exported: !!opts.exported
  };

  sessionStorage.setItem(PERSONAL_PINS_KEY, JSON.stringify(pins));

  return pins[personId];
}

function getPinFor(personId) {
  return getPins()[personId];
}

function unsetPinFor(personId) {
  var pins = getPins();

  delete pins[personId];

  sessionStorage.setItem(PERSONAL_PINS_KEY, JSON.stringify(pins));
}

function updatePersonalDetails(personId, details) {
  sessionStorage.setItem(PERSONAL_DETAILS_KEY, JSON.stringify(_extends({}, getAllPersonalDetails(), defineProperty({}, personId, details))));

  return details;
}

function getAllPersonalDetails() {
  return JSON.parse(sessionStorage.getItem(PERSONAL_DETAILS_KEY)) || {};
}

function getPersonalDetailsFor(personId) {
  var storageObj = getAllPersonalDetails(),
      personObj = storageObj[personId];

  if (!personObj) {
    console.log('Personal details for ' + personId + ' not found');
  }

  return personObj;
}

function removePersonalDetailsFor(personId) {
  var storageObj = getAllPersonalDetails();

  delete storageObj[personId];

  sessionStorage.setItem(PERSONAL_DETAILS_KEY, JSON.stringify(storageObj));
}

function personalBookmark(personId, page) {
  return changeDetailsFor(personId, function () {
    return {
      '_bookmark': {
        page: page
      }
    };
  });
}

function getBookmarkFor(personId) {
  return getPersonalDetailsFor(personId)['_bookmark'].page;
}

function personalQuestionSubmitDecorator(personId, callback, e) {
  var urlParams = new URLSearchParams(window.location.search),
      isEditing = urlParams.get('edit');

  !isEditing ? personalBookmark(personId, window.location.href) : clearPersonalBookmark(personId);

  callback(e);
}

function clearPersonalBookmark(personId) {
  var details = getPersonalDetailsFor(personId);

  delete details._bookmark;

  updatePersonalDetails(personId, _extends({}, details));

  return details;
}

/**
 * Copied from:
 * https://codereview.stackexchange.com/questions/90349/changing-number-to-words-in-javascript
 * ===============
 */
var ONE_TO_NINETEEN = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

var TENS = ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

var SCALES = ['thousand', 'million', 'billion', 'trillion'];

// helper function for use with Array.filter
function isTruthy(item) {
  return !!item;
}

// convert a number into 'chunks' of 0-999
function chunk(number) {
  var thousands = [];

  while (number > 0) {
    thousands.push(number % 1000);
    number = Math.floor(number / 1000);
  }

  return thousands;
}

// translate a number from 1-999 into English
function inEnglish(number) {
  var thousands,
      hundreds,
      tens,
      ones,
      words = [];

  if (number < 20) {
    return ONE_TO_NINETEEN[number - 1]; // may be undefined
  }

  if (number < 100) {
    ones = number % 10;
    tens = number / 10 | 0; // equivalent to Math.floor(number / 10)

    words.push(TENS[tens - 1]);
    words.push(inEnglish(ones));

    return words.filter(isTruthy).join('-');
  }

  hundreds = number / 100 | 0;
  words.push(inEnglish(hundreds));
  words.push('hundred');
  words.push(inEnglish(number % 100));

  return words.filter(isTruthy).join(' ');
}

// append the word for a scale. Made for use with Array.map
function appendScale(chunk, exp) {
  var scale;
  if (!chunk) {
    return null;
  }
  scale = SCALES[exp - 1];
  return [chunk, scale].filter(isTruthy).join(' ');
}

/**
 * ===============
 * End copy
 */

/**
 * Modification - decorator
 */
var NUMBER_TO_POSITION_TEXT_MAP = {
  'one': '1st',
  'two': '2nd',
  'three': '3rd',
  'four': '4th',
  'five': '5th',
  'six': '6th',
  'seven': '7th',
  'eight': '8th',
  'nine': '9th',
  'ten': '10th',
  'eleven': '11th',
  'twelve': '12th',
  'thirteen': '13th',
  'fourteen': '14th',
  'fifteen': '15th',
  'sixteen': '16th',
  'seventeen': '17th',
  'eighteen': '18th',
  'nineteen': '19th',

  'twenty': '20th',
  'thirty': '30th',
  'forty': '40th',
  'fifty': '50th',
  'sixty': '60th',
  'seventy': '70th',
  'eighty': '80th',
  'ninety': '90th',
  'hundred': '100th',

  'thousand': 'thousandth',
  'million': 'millionth',
  'billion': 'billionth',
  'trillion': 'trillionth'
};

function numberToPositionWord(num) {
  var str = chunk(num).map(inEnglish).map(appendScale).filter(isTruthy).reverse().join(' ');

  var sub = str.split(' '),
      lastWordDashSplitArr = sub[sub.length - 1].split('-'),
      lastWord = lastWordDashSplitArr[lastWordDashSplitArr.length - 1],
      newLastWord = (lastWordDashSplitArr.length > 1 ? lastWordDashSplitArr[0] + '-' : '') + NUMBER_TO_POSITION_TEXT_MAP[lastWord];

  /*console.log('str:', str);
  console.log('sub:', sub);
  console.log('lastWordDashSplitArr:', lastWordDashSplitArr);
  console.log('lastWord:', lastWord);
  console.log('newLastWord:', newLastWord);*/

  var subCopy = [].concat(sub);
  subCopy.pop();
  var prefix = subCopy.join(' ');
  var result = (prefix ? prefix + ' ' : '') + newLastWord;

  // console.log('result', (prefix ? prefix + ' ' : '') + newLastWord);
  return result;
}

function precedingOrdinalWord(number) {
  if (number === (8 || 11 || 18)) {
    return 'an';
  } else {
    return 'a';
  }
}

function numberToWordsStyleguide(number) {
  if (number > 9) {
    return number;
  }

  return ONE_TO_NINETEEN[number - 1];
}

function tools() {

  var $listLinks = $('.test-data-links'),
      $clearData = $('<li><a href="#" class=\'mock-data-family\'>' + 'Clear all data</a></li>'),
      $createFamilyHousehold = $('<li><a href="#" class=\'mock-data-family\'>' + 'Create family household</a></li>'),
      $createFamilyRelationships = $('<li><a href="#"' + ' class=\'mock-data-family\'>' + 'Create family with relationships</a></li>'),
      $createFamilyWithRelationshipsAndVisitors = $('<li><a href="#"' + ' class=\'mock-data-family\'>' + 'Create family with relationships and visitors</a></li>'),
      $createFamilyWithRelationshipsPersonalDetailsAndVisitors = $('<li><a' + ' href="#"' + ' class=\'mock-data-family\'>' + 'Create family with relationships, just family individual responses and' + ' visitors</a></li>'),
      $createFamilyWithRelationshipsPersonalDetailsAndVisitorsPersonalDetails = $('<li><a' + ' href="#"' + ' class=\'mock-data-family\'>' + 'Create family with relationships, family individual responses and' + ' visitors individual responses</a></li>'),
      familyHouseholdMembersData = [{
    'type': 'household-member',
    '@person': {
      'fullName': 'Dave  Jones',
      'firstName': 'Dave',
      'middleName': '',
      'lastName': 'Jones',
      'id': 'person_me'
    }
  }, {
    'type': 'household-member',
    '@person': {
      'fullName': 'Sally  Jones',
      'firstName': 'Sally',
      'middleName': '',
      'lastName': 'Jones',
      'id': 'person1'
    }
  }, {
    'type': 'household-member',
    '@person': {
      'fullName': 'Rebecca  Jones',
      'firstName': 'Rebecca',
      'middleName': '',
      'lastName': 'Jones',
      'id': 'person2'
    }
  }, {
    'type': 'household-member',
    '@person': {
      'fullName': 'Amy Jones',
      'firstName': 'Amy',
      'middleName': '',
      'lastName': 'Jones',
      'id': 'person3'
    }
  }],
      visitorsMemberData = [{
    'type': 'visitor',
    '@person': {
      'fullName': 'Gareth Johnson',
      'firstName': 'Gareth',
      'middleName': '',
      'lastName': 'Johnson',
      'id': 'person4'
    }
  }, {
    'type': 'visitor',
    '@person': {
      'fullName': 'John Hamilton',
      'firstName': 'John',
      'middleName': '',
      'lastName': 'Hamilton',
      'id': 'person5'
    }
  }],
      familyHouseholdRelationshipsData = [{
    'personIsDescription': 'husband-wife',
    'personIsId': 'person1',
    'personToId': 'person_me',
    'inferred': false,
    'id': 1
  }, {
    'personIsDescription': 'son-daughter',
    'personIsId': 'person2',
    'personToId': 'person_me',
    'inferred': false,
    'id': 2
  }, {
    'personIsDescription': 'mother-father',
    'personIsId': 'person_me',
    'personToId': 'person3',
    'inferred': false,
    'id': 3
  }, {
    'personIsDescription': 'son-daughter',
    'personIsId': 'person2',
    'personToId': 'person1',
    'inferred': false,
    'id': 4
  }, {
    'personIsDescription': 'mother-father',
    'personIsId': 'person1',
    'personToId': 'person3',
    'inferred': false,
    'id': 5
  }, {
    'personIsDescription': 'brother-sister',
    'personIsId': 'person3',
    'personToId': 'person2',
    'inferred': true,
    'inferredBy': [3, 5, 2, 4],
    'id': 6
  }],
      familyPersonalDetails = {
    'person_me': {
      'dob': {
        'day': '17',
        'month': '4',
        'year': '1967'
      },
      'maritalStatus': 'married',
      'country': 'wales',
      'orientation': 'straight',
      'salary': '40000'
    },
    'person1': {
      'dob': { 'day': '02', 'month': '10', 'year': '1965' },
      'maritalStatus': 'married',
      'country': 'wales',
      'orientation': 'straight',
      'salary': '40000'
    },
    'person2': {
      'dob': { 'day': '20', 'month': '5', 'year': '1981' },
      'maritalStatus': 'never',
      'country': 'wales',
      'orientation': 'straight',
      'salary': '20000'
    },
    'person3': {
      'dob': { 'day': '11', 'month': '7', 'year': '1984' },
      'maritalStatus': 'never',
      'country': 'wales',
      'orientation': 'straight',
      'salary': '20000'
    }
  },
      visitorsPersonalDetails = {
    'person4': {
      'sex': 'male',
      'dob': { 'day': '20', 'month': '7', 'year': '1990' },
      'address-where': 'in-uk',
      'address': {
        'address-line-1': '15',
        'address-line-2': 'Somewhere near',
        'town-city': 'Llandridnod',
        'county': 'Powys',
        'postcode': 'LL34 AN5'
      }
    },
    'person5': {
      'sex': 'male',
      'dob': { 'day': '02', 'month': '5', 'year': '1991' },
      'address-where': 'out-uk',
      'address': {
        'address-line-1': '94',
        'address-line-2': 'Somewhere Far',
        'town-city': 'Springfield',
        'county': 'New York',
        'postcode': 'NY10A'
      }
    }
  },
      userData = {
    'fullName': 'Dave  Jones',
    'firstName': 'Dave',
    'middleName': '',
    'lastName': 'Jones'
  };

  $createFamilyHousehold.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHousehold();
    window.location.href = '../summary';
  });

  $createFamilyRelationships.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHousehold();
    createFamilyRelationships();
    window.location.href = '../hub';
  });

  $createFamilyWithRelationshipsAndVisitors.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHouseholdWithVisitors();
    createFamilyRelationships();
    window.location.href = '../hub';
  });

  $createFamilyWithRelationshipsPersonalDetailsAndVisitors.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHouseholdWithVisitors();
    createFamilyRelationships();
    createFamilyPersonalDetails();
    window.location.href = '../hub';
  });

  $createFamilyWithRelationshipsPersonalDetailsAndVisitorsPersonalDetails.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHouseholdWithVisitors();
    createFamilyRelationships();
    createFamilyVisitorsPersonalDetails();
    window.location.href = '../hub';
  });

  $clearData.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    window.location.href = '../test-address';
  });

  function prerequisites() {
    sessionStorage.setItem('address', '12 Somewhere Close, Newport, CF12 3AB');
    sessionStorage.setItem('address-line-1', '12');
    sessionStorage.setItem('address-line-2', 'Somewhere close');
    sessionStorage.setItem('county', 'Newport');
    sessionStorage.setItem('lives-here', 'yes');
    sessionStorage.setItem('postcode', 'CF12 3AB');
    sessionStorage.setItem('town-city', 'Newport');
  }

  function createFamilyHousehold() {
    sessionStorage.setItem('user-details', JSON.stringify(userData));
    sessionStorage.setItem(window.ONS.storage.KEYS.HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(familyHouseholdMembersData));
    sessionStorage.setItem('household-members-increment', JSON.stringify(4));
  }

  function createFamilyHouseholdWithVisitors() {
    sessionStorage.setItem(window.ONS.storage.KEYS.HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify([].concat(familyHouseholdMembersData, visitorsMemberData)));
  }

  function createFamilyRelationships() {
    sessionStorage.setItem(window.ONS.storage.KEYS.RELATIONSHIPS_STORAGE_KEY, JSON.stringify(familyHouseholdRelationshipsData));
    sessionStorage.setItem('relationships-increment', JSON.stringify(6));
  }

  function createFamilyPersonalDetails() {
    sessionStorage.setItem(window.ONS.storage.KEYS.PERSONAL_DETAILS_KEY, JSON.stringify(familyPersonalDetails));
  }

  function createFamilyVisitorsPersonalDetails() {
    sessionStorage.setItem(window.ONS.storage.KEYS.PERSONAL_DETAILS_KEY, JSON.stringify(_extends({}, familyPersonalDetails, visitorsPersonalDetails)));
  }

  function clearStorage() {
    sessionStorage.clear();
  }

  $listLinks.append($clearData);
}

/**
 * Libraries
 */
/**
 * DOM modules
 */
var USER_STORAGE_KEY = 'user-details';
var INDIVIDUAL_PROXY_STORAGE_KEY = 'proxy-person';

function getAddress() {
  var addressLines = sessionStorage.getItem('address').split(',');

  return {
    addressLine1: addressLines[0],
    addressLine2: addressLines[1],
    addressLine3: addressLines[2],
    addressCounty: addressLines[4],
    addressTownCity: addressLines[3],
    addressPostcode: addressLines[5]
  };
}

/**
 * User
 */
function addUserPerson(person$$1) {
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(person$$1));
}

function getUserPerson() {
  return JSON.parse(sessionStorage.getItem(USER_STORAGE_KEY));
}

/**
 * Helpers
 */
function createNavItem(member) {
  var $nodeEl = $('<li class="js-template-nav-item nav__item pluto">' + '  <a class="js-template-nav-item-label nav__link" href="#"></a>' + '</li>'),
      $linkEl = $nodeEl.find('.js-template-nav-item-label');

  $linkEl.html(member['@person'].fullName);

  if (member['@person'].id === USER_HOUSEHOLD_MEMBER_ID) {
    $linkEl.attr('href', '../what-is-your-name');
  } else {
    $linkEl.attr('href', '../who-else-to-add?edit=' + member['@person'].id);
  }

  return $nodeEl;
}

function updateHouseholdVisitorsNavigationItems() {
  var allHouseholdMembers = window.ONS.storage.getAllHouseholdMembers(),
      householdMembers = allHouseholdMembers.filter(window.ONS.storage.isHouseholdMember),
      visitors = allHouseholdMembers.filter(window.ONS.storage.isVisitor);

  var $navigationHouseholdMembersEl = $('#navigation-household-members'),
      $navigationVisitorsEl = $('#navigation-visitors');

  if (householdMembers.length) {
    $.each(householdMembers, function (i, member) {
      $navigationHouseholdMembersEl.append(createNavItem(member));
    });
  } else {
    $navigationHouseholdMembersEl.parent().hide();
  }

  if (visitors.length) {
    $.each(visitors, function (i, member) {
      $navigationVisitorsEl.append(createNavItem(member));
    });
  } else {
    $navigationVisitorsEl.parent().hide();
  }
}

function createListItemPerson(member) {
  return $('<li class="list__item">').addClass('mars').html('<span class="list__item-name">' + member['@person'].fullName + (member['@person'].id === USER_HOUSEHOLD_MEMBER_ID ? '' : '') + '</span>');
}

function populateList($el, memberType) {
  if (!$el.length) {
    return;
  }

  var members = getAllHouseholdMembers() || [];

  $el.empty().append(members.filter(function (member) {
    return member.type === memberType;
  }).map(createListItemPerson));

  $el.addClass('list list--people-plain');
}

function populateHouseholdList() {
  populateList($('#household-members'), HOUSEHOLD_MEMBER_TYPE);
}

function populateVisitorList() {
  populateList($('#visitors-list'), VISITOR_TYPE);
}

function cleanHTMLPlaceholderStringReplacment(el, val) {
  var $el = $(el),
      $parent = $el.parent();

  $el.before(val);
  $el.remove();

  $parent.html($parent.html().replace(/[\s]+/g, ' ').trim());
}

function updateAddresses() {
  var addressLines = (sessionStorage.getItem('address') || '').split(','),
      addressLine1 = addressLines[0],
      addressLine2 = addressLines[1];

  $('.address-text').each(function (i, el) {
    return cleanHTMLPlaceholderStringReplacment(el, addressLine1 && addressLine2 ? addressLine1 + (addressLine2 ? ', ' + addressLine2 : '') : '<a href="../test-address">Address not found</a>');
  });

  $('.address-text-line1').each(function (i, el) {
    return cleanHTMLPlaceholderStringReplacment(el, addressLine1);
  });

  var personId = new URLSearchParams(window.location.search).get('person_id');

  if (personId) {
    var _person = getHouseholdMemberByPersonId(personId)['@person'],
        $sectionIndividualEl = $('#section-individual'),
        $nameEl = $('.js-person-fullname-from-url-id');

    $sectionIndividualEl.length && cleanHTMLPlaceholderStringReplacment($sectionIndividualEl, _person.fullName);
    $nameEl.length && cleanHTMLPlaceholderStringReplacment($nameEl, _person.fullName);
  }
}

var secureLinkTextMap = {
  'question-you': {
    description: 'Want to keep your answers secure from other people at this' + ' address?',
    linkText: 'Get a separate access code to submit an individual response',
    link: '../individual-decision-secure'
  },
  'pin-you': {
    description: 'You\'ve chosen to keep your answers secure',
    linkText: 'Cancel this and make answers available to the rest of the' + ' household',
    link: '../individual-decision-secure'
  },
  'question-proxy': {
    description: 'Not happy to continue answering for $[NAME]?',
    linkText: 'Request an individual access code to be sent to them',
    link: '../individual-decision-other-secure'
  }
};

function updateAllPreviousLinks() {
  $('.js-previous-link').attr('href', document.referrer);
}

function updatePersonLink() {
  var personId = new URLSearchParams(window.location.search).get('person_id');

  if (personId) {
    var urlParam = new URLSearchParams(window.location.search),
        _person2 = getHouseholdMemberByPersonId(personId)['@person'],
        pinObj = getPinFor(personId),
        secureLinkTextConfig = secureLinkTextMap[getAnsweringIndividualByProxy() ? 'question-proxy' : pinObj && pinObj.pin ? 'pin-you' : 'question-you'],
        linkHref = secureLinkTextConfig.link + '?person_id=' + personId + '&returnurl=' + window.location.pathname,
        surveyType = urlParam.get('survey');

    linkHref += surveyType ? '&survey=' + surveyType : '';

    var $secureLink = $('.js-link-secure');
    $secureLink.attr('href', linkHref);

    $secureLink.html(secureLinkTextConfig.linkText);
    $('.js-link-secure-label').html(secureLinkTextConfig.description.replace('$[NAME]', _person2.fullName));

    var personLink = $('.js-link-person');
    personLink.attr('href', personLink.attr('href') + '?person_id=' + personId + (surveyType ? '&survey=' + surveyType : ''));
  }
}

function updateBySurveyType() {
  var urlParams = new URLSearchParams(window.location.search),
      surveyType = urlParams.get('survey');

  if (surveyType) {
    $('.js-header-title').html(surveyTypeConfig[surveyType].title);
    $('#people-living-here').html(surveyTypeConfig[surveyType].householdSectionTitle);
    $('#people-living-here').attr('href', surveyTypeConfig[surveyType].householdSectionLink);
    $('#relationships-section').attr('href', surveyTypeConfig[surveyType].relationshipsSection);
    $('title').html(surveyTypeConfig[surveyType].title);
  }
}

function setAnsweringIndividualByProxy(bool) {
  sessionStorage.setItem(INDIVIDUAL_PROXY_STORAGE_KEY, JSON.stringify(bool));
}

function getAnsweringIndividualByProxy() {
  return JSON.parse(sessionStorage.getItem(INDIVIDUAL_PROXY_STORAGE_KEY));
}

function unsetAnsweringIndividualByProxy() {
  getAnsweringIndividualByProxy() !== null && sessionStorage.removeItem(INDIVIDUAL_PROXY_STORAGE_KEY);
}

var surveyTypeConfig = {
  lms: {
    title: 'Online Household Study',
    householdSectionTitle: 'About your household',
    householdSectionLink: '../summary/?survey=lms',
    relationshipsSection: '../relationships/?survey=lms'
  }
};

function doILiveHere() {
  return sessionStorage.getItem('lives-here') === 'yes';
}

function getSignificant() {
  return 'Sunday 15 March 2020';
}

function updateSignificantDate() {
  $('.js-significant-date').each(function (i, el) {
    return cleanHTMLPlaceholderStringReplacment(el, getSignificant());
  });
}

function personRecordTemplate() {
  return $('<li id="person-record-template" class="list__item">\n        <span class="list__item-name js-person-name"></span>\n        <div class="list__item-actions u-fr">\n            <span class="list__item-action">\n                <a class="js-record-edit" href="#">Change</a>\n                <span class="js-spacer">|</span>\n                <a class="js-record-remove" href="#">Remove</a>\n            </span>\n        </div>\n    </li>');
}

function createMemberItem(member) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { redirect: null },
      redirect = _ref.redirect;

  var noEdit = arguments[2];

  var $nodeEl = personRecordTemplate(),
      $editLink = $nodeEl.find('.js-record-edit'),
      $removeLink = $nodeEl.find('.js-record-remove'),
      $spacer = $nodeEl.find('.js-spacer'),
      urlParams = new URLSearchParams(window.location.search),
      personNameText = member['@person'].fullName,
      memberIsUser = isMemberUser(member),
      surveyType = urlParams.get('survey'),
      altPage = surveyType && surveyType === 'lms' ? surveyType + '/' : '',
      redirectTo = redirect ? '&redirect=' + encodeURIComponent(window.location.href) : '';

  if (noEdit) {
    $editLink.hide();
    $removeLink.hide();
    $spacer.hide();
  } else if (!noEdit && memberIsUser) {
    $editLink.html('Change');
    $removeLink.hide();
    $spacer.hide();
  }

  $nodeEl.attr('id', '');
  $nodeEl.find('.js-person-name').html(personNameText);

  $editLink.attr('href', (memberIsUser ? '../' + altPage + 'what-is-your-name/?edit=true' : '../' + altPage + 'who-else-to-add/?edit=' + member['@person'].id + (isVisitor(member) ? '&journey=visitors' : '')) + redirectTo);

  $removeLink.attr('href', '../remove-household-member/?person_id=' + member['@person'].id + redirectTo);

  return $nodeEl;
}

function updateHouseholdSummary() {
  var members = getAllHouseholdMembers();

  $('.js-household-members-summary').each(function (i, el) {
    var $el = $(el);

    $.each([].concat(toConsumableArray(members.filter(isMemberUser)), toConsumableArray(members.filter(isOtherHouseholdMember))), function (i, member) {
      $el.append(createMemberItem(member, { redirect: $el.attr('data-redirect') }));
    });
  });
}

function updateVisitorsSummary() {
  var members = getAllHouseholdMembers();

  $('.js-visitors-summary').each(function (i, el) {
    var $el = $(el);

    $.each(members.filter(isVisitor), function (i, member) {
      $el.append(createMemberItem(member, { redirect: $el.attr('data-redirect') }));
    });
  });
}

function updateContinueNotice() {
  var urlParams = new URLSearchParams(window.location.search),
      isContinuing = urlParams.get('continuing'),
      personId = urlParams.get('person_id');

  if (!isContinuing) {
    return false;
  }
  var link = isVisitor(member) ? '../visitor-intro/' : '../individual-intro/';
  var template = '<div class="panel panel--simple panel--info u-mb-s">\n      <div class="panel__body">\n          <strong>This was the last unanswered question\n              in the section</strong>\n          <p>\n              <a href="' + link + '?person_id=' + personId + '">Go to the start \n              of this section</a>\n          </p>\n      </div>\n  </div>';

  $('.js-heading').closest('.question').prepend(template);
}

function updateSaveAndCompleteLater() {
  $('.complete-later').on('click', function (e) {
    e.preventDefault();

    window.location.href = '../post-submission/?redirect=../hub';
  });
}

function updateFoortListCol() {
  $('.js-footer-list-col').append('<li><a href="../test-data"' + ' class="footer__link footer__link--inline ghost-link u-fr">Test' + ' data</a></li>');
}

function isMemberUser(member) {
  return member['@person'].id === window.ONS.storage.IDS.USER_HOUSEHOLD_MEMBER_ID;
}

function sessionBookmark() {
  var pieces = window.location.href.replace(window.location.pathname, '[delimeter]').split('[delimeter]');

  pieces.shift();

  if (window.location.pathname.match(/test-data/g)) {
    console.log('match');
    return;
  }

  sessionStorage.setItem('_session_bookmark', [].concat(window.location.pathname, pieces).join(''));
}

function fieldItemDisplayHack() {
  $('.field__item').after('<br />');
}

function validateInputs(testFails) {
  var inputs = Array.from(document.querySelectorAll('.input'));
  inputs.filter(function (input) {
    return input.required;
  }).forEach(function (input) {
    var errorBox = document.querySelector('.js-error-box'),
        listItem = document.querySelector('.js-' + input.id),
        answer = input.closest('.question__answer'),
        field = input.closest('.field'),
        errorMsg = input.getAttribute('data-error-msg');

    if (input.value === testFails || testFails === true) {
      hasErrors = true;
      if (!listItem.classList.contains('js-visible')) {
        errorBox.classList.remove('u-d-no');
        listItem.classList.remove('u-d-no'), listItem.classList.add('js-visible');

        var inputErrorPanel = document.createElement('DIV'),
            inputErrorBody = document.createElement('DIV'),
            inputErrorP = document.createElement('P'),
            inputErrorStrong = document.createElement('STRONG');

        inputErrorPanel.className = 'panel panel--error panel--simple';
        inputErrorBody.className = 'panel__body';
        inputErrorP.className = 'panel__error';

        inputErrorStrong.innerText = errorMsg;
        inputErrorP.appendChild(inputErrorStrong);
        inputErrorBody.appendChild(inputErrorP);
        inputErrorBody.appendChild(field);
        inputErrorPanel.appendChild(inputErrorBody);
        answer.appendChild(inputErrorPanel);
      }
    } else {
      var errorPanel = input.closest('.panel');
      if (errorPanel) {
        listItem.classList.add('u-d-no'), listItem.classList.remove('js-visible');
        answer.appendChild(field);
        answer.removeChild(errorPanel);
      }
    }
  });

  var errors = Array.from(document.querySelectorAll('.js-visible')).length,
      pipingDestinations = document.querySelectorAll('.js-piping');

  pipingDestinations.forEach(function (pipingDestination) {
    pipingDestination.innerText = pipingDestination.innerText.replace('{x}', errors).replace('{s}', errors > 1 ? 's' : '').replace('2', errors === 1 ? "1" : "2").replace('1', errors > 1 ? "2" : "1").replace('This', errors > 1 ? "These" : "This").replace('These', errors === 1 ? "This" : "These");
  });
}

window.ONS = window.ONS || {};
window.ONS.storage = {
  getAddress: getAddress,
  addHouseholdMember: addHouseholdMember,
  updateHouseholdMember: updateHouseholdMember,
  deleteHouseholdMember: deleteHouseholdMember,
  getAllHouseholdMembers: getAllHouseholdMembers,
  addUserPerson: addUserPerson,
  getUserPerson: getUserPerson,
  getUserAsHouseholdMember: getUserAsHouseholdMember,
  getHouseholdMemberByPersonId: getHouseholdMemberByPersonId,
  getMemberPersonId: getMemberPersonId,
  updateUserAsHouseholdMember: updateUserAsHouseholdMember,
  deleteUserAsHouseholdMember: deleteUserAsHouseholdMember,
  tempAwayQuestionSentenceMap: tempAwayQuestionSentenceMap,
  visitorQuestionSentenceMap: visitorQuestionSentenceMap,

  isVisitor: isVisitor,
  isOtherHouseholdMember: isOtherHouseholdMember,
  isHouseholdMember: isHouseholdMember,

  addRelationship: addRelationship,
  deleteRelationship: deleteRelationship,
  editRelationship: editRelationship,
  getAllRelationships: getAllRelationships,
  getAllManualRelationships: getAllManualRelationships,
  getNextPersonId: getNextPersonId,
  deleteAllRelationshipsForMember: deleteAllRelationshipsForMember,

  getAllParentsOf: getAllParentsOf,
  getAllChildrenOf: getAllChildrenOf,
  getParentIdFromRelationship: getParentIdFromRelationship,
  getChildIdFromRelationship: getChildIdFromRelationship,
  getOtherPersonIdFromRelationship: getOtherPersonIdFromRelationship,
  isAParentInRelationship: isAParentInRelationship,
  isAChildInRelationship: isAChildInRelationship,
  isInRelationship: isInRelationship,
  areAnyChildrenInRelationshipNotParent: areAnyChildrenInRelationshipNotParent,
  isRelationshipType: isRelationshipType,
  isRelationshipInferred: isRelationshipInferred,
  getRelationshipOf: getRelationshipOf,

  relationshipDescriptionMap: relationshipDescriptionMap,
  relationshipSummaryTemplates: relationshipSummaryTemplates,
  missingRelationshipInference: missingRelationshipInference,
  inferRelationships: inferRelationships,
  getRelationshipsWithPersonIds: getRelationshipsWithPersonIds,
  getPeopleIdsMissingRelationshipsWithPerson: getPeopleIdsMissingRelationshipsWithPerson,
  getRelationshipType: getRelationshipType,
  findNextMissingRelationship: findNextMissingRelationship,

  addUpdatePersonalDetailsDOB: addUpdatePersonalDetailsDOB,
  getPersonalDetailsFor: getPersonalDetailsFor,
  removePersonalDetailsFor: removePersonalDetailsFor,
  addUpdateMaritalStatus: addUpdateMaritalStatus,
  addUpdateCountry: addUpdateCountry,
  addUpdateCountryOther: addUpdateCountryOther,
  addUpdateNationalIdentity: addUpdateNationalIdentity,
  addUpdateNationalIdentityOther: addUpdateNationalIdentityOther,
  addUpdateEthnicGroup: addUpdateEthnicGroup,
  addUpdateEthnicGroupDescription: addUpdateEthnicGroupDescription,
  addUpdateEthnicGroupOther: addUpdateEthnicGroupOther,
  addUpdatePassportCountry: addUpdatePassportCountry,
  addUpdatePassportCountryOther: addUpdatePassportCountryOther,
  addUpdateOrientation: addUpdateOrientation,
  addUpdateSalary: addUpdateSalary,
  addUpdateSex: addUpdateSex,
  addUpdateAddressWhere: addUpdateAddressWhere,
  addUpdateAddressIndividual: addUpdateAddressIndividual,
  addUpdateAge: addUpdateAge,
  addUpdateAgeConfirm: addUpdateAgeConfirm,
  addUpdateAddressOutsideUK: addUpdateAddressOutsideUK,
  addUpdateApprenticeship: addUpdateApprenticeship,
  addUpdateHasQualificationAbove: addUpdateHasQualificationAbove,
  addUpdateQualificationsNvqEquivalent: addUpdateQualificationsNvqEquivalent,
  addUpdateQualificationsALevel: addUpdateQualificationsALevel,
  addUpdateQualificationsGCSEs: addUpdateQualificationsGCSEs,
  addUpdateQualificationsOtherWhere: addUpdateQualificationsOtherWhere,
  addUpdateEmploymentStatus: addUpdateEmploymentStatus,
  addUpdateJobTitle: addUpdateJobTitle,
  addUpdateJobDescribe: addUpdateJobDescribe,

  personalDetailsMaritalStatusMap: personalDetailsMaritalStatusMap,
  personalDetailsCountryMap: personalDetailsCountryMap,
  personalDetailsOrientationMap: personalDetailsOrientationMap,
  personalDetailsGenderMap: personalDetailsGenderMap,
  personalDetailsNationalIdentityMap: personalDetailsNationalIdentityMap,
  personalDetailsEthnicGroupMap: personalDetailsEthnicGroupMap,
  personalDetailsPassportCountriesMap: personalDetailsPassportCountriesMap,
  personalDetailsApprenticeshipMap: personalDetailsApprenticeshipMap,
  personalDetailsDegreeAboveMap: personalDetailsDegreeAboveMap,
  personalDetailsNVQMap: personalDetailsNVQMap,
  personalDetailsALevelMap: personalDetailsALevelMap,
  personalDetailsGCSEMap: personalDetailsGCSEMap,
  personalDetailsOtherWhere: personalDetailsOtherWhere,
  personalDetailsEmploymentStatus: personalDetailsEmploymentStatus,

  createPinFor: createPinFor,
  getPinFor: getPinFor,
  unsetPinFor: unsetPinFor,
  personalBookmark: personalBookmark,
  getBookmarkFor: getBookmarkFor,
  clearPersonalBookmark: clearPersonalBookmark,
  personalQuestionSubmitDecorator: personalQuestionSubmitDecorator,

  setAnsweringIndividualByProxy: setAnsweringIndividualByProxy,
  getAnsweringIndividualByProxy: getAnsweringIndividualByProxy,
  unsetAnsweringIndividualByProxy: unsetAnsweringIndividualByProxy,

  doILiveHere: doILiveHere,
  isMemberUser: isMemberUser,

  KEYS: {
    HOUSEHOLD_MEMBERS_STORAGE_KEY: HOUSEHOLD_MEMBERS_STORAGE_KEY,
    USER_STORAGE_KEY: USER_STORAGE_KEY,
    INDIVIDUAL_PROXY_STORAGE_KEY: INDIVIDUAL_PROXY_STORAGE_KEY,
    HOUSEHOLD_MEMBER_TYPE: HOUSEHOLD_MEMBER_TYPE,
    VISITOR_TYPE: VISITOR_TYPE,
    RELATIONSHIPS_STORAGE_KEY: RELATIONSHIPS_STORAGE_KEY,
    PERSONAL_DETAILS_KEY: PERSONAL_DETAILS_KEY
  },

  IDS: {
    USER_HOUSEHOLD_MEMBER_ID: USER_HOUSEHOLD_MEMBER_ID
  },

  TYPES: {
    person: person,
    relationship: relationship
  }
};

window.ONS.helpers = {
  populateHouseholdList: populateHouseholdList,
  populateVisitorList: populateVisitorList
};

window.ONS.utils = {
  removeFromList: removeFromList,
  trailingNameS: trailingNameS,
  numberToPositionWord: numberToPositionWord,
  numberToWordsStyleguide: numberToWordsStyleguide,
  precedingOrdinalWord: precedingOrdinalWord,
  getSignificant: getSignificant,
  cleanHTMLPlaceholderStringReplacment: cleanHTMLPlaceholderStringReplacment,
  validateInputs: validateInputs
};

$(populateHouseholdList);
$(populateVisitorList);
$(updateHouseholdVisitorsNavigationItems);
$(updateAddresses);
$(updatePersonLink);
$(tools);
$(updateAllPreviousLinks);
$(updateBySurveyType);
$(updateSignificantDate);
$(updateHouseholdSummary);
$(updateVisitorsSummary);
$(updateContinueNotice);
$(updateSaveAndCompleteLater);
$(updateFoortListCol);
$(sessionBookmark);
$(fieldItemDisplayHack);

exports.USER_STORAGE_KEY = USER_STORAGE_KEY;
exports.INDIVIDUAL_PROXY_STORAGE_KEY = INDIVIDUAL_PROXY_STORAGE_KEY;
exports.getAddress = getAddress;
exports.addUserPerson = addUserPerson;
exports.getUserPerson = getUserPerson;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"fuse.js":2}],2:[function(require,module,exports){
/*!
 * Fuse.js v3.6.1 - Lightweight fuzzy-search (http://fusejs.io)
 * 
 * Copyright (c) 2012-2017 Kirollos Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Fuse",[],t):"object"==typeof exports?exports.Fuse=t():e.Fuse=t()}(this,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var i=r(1),a=r(7),s=a.get,c=(a.deepValue,a.isArray),h=function(){function e(t,r){var n=r.location,o=void 0===n?0:n,i=r.distance,a=void 0===i?100:i,c=r.threshold,h=void 0===c?.6:c,l=r.maxPatternLength,u=void 0===l?32:l,f=r.caseSensitive,v=void 0!==f&&f,p=r.tokenSeparator,d=void 0===p?/ +/g:p,g=r.findAllMatches,y=void 0!==g&&g,m=r.minMatchCharLength,k=void 0===m?1:m,b=r.id,S=void 0===b?null:b,x=r.keys,M=void 0===x?[]:x,_=r.shouldSort,w=void 0===_||_,L=r.getFn,A=void 0===L?s:L,O=r.sortFn,C=void 0===O?function(e,t){return e.score-t.score}:O,j=r.tokenize,P=void 0!==j&&j,I=r.matchAllTokens,F=void 0!==I&&I,T=r.includeMatches,N=void 0!==T&&T,z=r.includeScore,E=void 0!==z&&z,W=r.verbose,K=void 0!==W&&W;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options={location:o,distance:a,threshold:h,maxPatternLength:u,isCaseSensitive:v,tokenSeparator:d,findAllMatches:y,minMatchCharLength:k,id:S,keys:M,includeMatches:N,includeScore:E,shouldSort:w,getFn:A,sortFn:C,verbose:K,tokenize:P,matchAllTokens:F},this.setCollection(t),this._processKeys(M)}var t,r,a;return t=e,(r=[{key:"setCollection",value:function(e){return this.list=e,e}},{key:"_processKeys",value:function(e){if(this._keyWeights={},this._keyNames=[],e.length&&"string"==typeof e[0])for(var t=0,r=e.length;t<r;t+=1){var n=e[t];this._keyWeights[n]=1,this._keyNames.push(n)}else{for(var o=null,i=null,a=0,s=0,c=e.length;s<c;s+=1){var h=e[s];if(!h.hasOwnProperty("name"))throw new Error('Missing "name" property in key object');var l=h.name;if(this._keyNames.push(l),!h.hasOwnProperty("weight"))throw new Error('Missing "weight" property in key object');var u=h.weight;if(u<0||u>1)throw new Error('"weight" property in key must bein the range of [0, 1)');i=null==i?u:Math.max(i,u),o=null==o?u:Math.min(o,u),this._keyWeights[l]=u,a+=u}if(a>1)throw new Error("Total of weights cannot exceed 1")}}},{key:"search",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{limit:!1};this._log('---------\nSearch pattern: "'.concat(e,'"'));var r=this._prepareSearchers(e),n=r.tokenSearchers,o=r.fullSearcher,i=this._search(n,o);return this._computeScore(i),this.options.shouldSort&&this._sort(i),t.limit&&"number"==typeof t.limit&&(i=i.slice(0,t.limit)),this._format(i)}},{key:"_prepareSearchers",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=[];if(this.options.tokenize)for(var r=e.split(this.options.tokenSeparator),n=0,o=r.length;n<o;n+=1)t.push(new i(r[n],this.options));return{tokenSearchers:t,fullSearcher:new i(e,this.options)}}},{key:"_search",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0,r=this.list,n={},o=[];if("string"==typeof r[0]){for(var i=0,a=r.length;i<a;i+=1)this._analyze({key:"",value:r[i],record:i,index:i},{resultMap:n,results:o,tokenSearchers:e,fullSearcher:t});return o}for(var s=0,c=r.length;s<c;s+=1)for(var h=r[s],l=0,u=this._keyNames.length;l<u;l+=1){var f=this._keyNames[l];this._analyze({key:f,value:this.options.getFn(h,f),record:h,index:s},{resultMap:n,results:o,tokenSearchers:e,fullSearcher:t})}return o}},{key:"_analyze",value:function(e,t){var r=this,n=e.key,o=e.arrayIndex,i=void 0===o?-1:o,a=e.value,s=e.record,h=e.index,l=t.tokenSearchers,u=void 0===l?[]:l,f=t.fullSearcher,v=t.resultMap,p=void 0===v?{}:v,d=t.results,g=void 0===d?[]:d;!function e(t,o,i,a){if(null!=o)if("string"==typeof o){var s=!1,h=-1,l=0;r._log("\nKey: ".concat(""===n?"--":n));var v=f.search(o);if(r._log('Full text: "'.concat(o,'", score: ').concat(v.score)),r.options.tokenize){for(var d=o.split(r.options.tokenSeparator),y=d.length,m=[],k=0,b=u.length;k<b;k+=1){var S=u[k];r._log('\nPattern: "'.concat(S.pattern,'"'));for(var x=!1,M=0;M<y;M+=1){var _=d[M],w=S.search(_),L={};w.isMatch?(L[_]=w.score,s=!0,x=!0,m.push(w.score)):(L[_]=1,r.options.matchAllTokens||m.push(1)),r._log('Token: "'.concat(_,'", score: ').concat(L[_]))}x&&(l+=1)}h=m[0];for(var A=m.length,O=1;O<A;O+=1)h+=m[O];h/=A,r._log("Token score average:",h)}var C=v.score;h>-1&&(C=(C+h)/2),r._log("Score average:",C);var j=!r.options.tokenize||!r.options.matchAllTokens||l>=u.length;if(r._log("\nCheck Matches: ".concat(j)),(s||v.isMatch)&&j){var P={key:n,arrayIndex:t,value:o,score:C};r.options.includeMatches&&(P.matchedIndices=v.matchedIndices);var I=p[a];I?I.output.push(P):(p[a]={item:i,output:[P]},g.push(p[a]))}}else if(c(o))for(var F=0,T=o.length;F<T;F+=1)e(F,o[F],i,a)}(i,a,s,h)}},{key:"_computeScore",value:function(e){this._log("\n\nComputing score:\n");for(var t=this._keyWeights,r=!!Object.keys(t).length,n=0,o=e.length;n<o;n+=1){for(var i=e[n],a=i.output,s=a.length,c=1,h=0;h<s;h+=1){var l=a[h],u=l.key,f=r?t[u]:1,v=0===l.score&&t&&t[u]>0?Number.EPSILON:l.score;c*=Math.pow(v,f)}i.score=c,this._log(i)}}},{key:"_sort",value:function(e){this._log("\n\nSorting...."),e.sort(this.options.sortFn)}},{key:"_format",value:function(e){var t=[];if(this.options.verbose){var r=[];this._log("\n\nOutput:\n\n",JSON.stringify(e,function(e,t){if("object"===n(t)&&null!==t){if(-1!==r.indexOf(t))return;r.push(t)}return t},2)),r=null}var o=[];this.options.includeMatches&&o.push(function(e,t){var r=e.output;t.matches=[];for(var n=0,o=r.length;n<o;n+=1){var i=r[n];if(0!==i.matchedIndices.length){var a={indices:i.matchedIndices,value:i.value};i.key&&(a.key=i.key),i.hasOwnProperty("arrayIndex")&&i.arrayIndex>-1&&(a.arrayIndex=i.arrayIndex),t.matches.push(a)}}}),this.options.includeScore&&o.push(function(e,t){t.score=e.score});for(var i=0,a=e.length;i<a;i+=1){var s=e[i];if(this.options.id&&(s.item=this.options.getFn(s.item,this.options.id)[0]),o.length){for(var c={item:s.item},h=0,l=o.length;h<l;h+=1)o[h](s,c);t.push(c)}else t.push(s.item)}return t}},{key:"_log",value:function(){var e;this.options.verbose&&(e=console).log.apply(e,arguments)}}])&&o(t.prototype,r),a&&o(t,a),e}();e.exports=h},function(e,t,r){function n(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var o=r(2),i=r(3),a=r(6),s=function(){function e(t,r){var n=r.location,o=void 0===n?0:n,i=r.distance,s=void 0===i?100:i,c=r.threshold,h=void 0===c?.6:c,l=r.maxPatternLength,u=void 0===l?32:l,f=r.isCaseSensitive,v=void 0!==f&&f,p=r.tokenSeparator,d=void 0===p?/ +/g:p,g=r.findAllMatches,y=void 0!==g&&g,m=r.minMatchCharLength,k=void 0===m?1:m,b=r.includeMatches,S=void 0!==b&&b;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options={location:o,distance:s,threshold:h,maxPatternLength:u,isCaseSensitive:v,tokenSeparator:d,findAllMatches:y,includeMatches:S,minMatchCharLength:k},this.pattern=v?t:t.toLowerCase(),this.pattern.length<=u&&(this.patternAlphabet=a(this.pattern))}var t,r,s;return t=e,(r=[{key:"search",value:function(e){var t=this.options,r=t.isCaseSensitive,n=t.includeMatches;if(r||(e=e.toLowerCase()),this.pattern===e){var a={isMatch:!0,score:0};return n&&(a.matchedIndices=[[0,e.length-1]]),a}var s=this.options,c=s.maxPatternLength,h=s.tokenSeparator;if(this.pattern.length>c)return o(e,this.pattern,h);var l=this.options,u=l.location,f=l.distance,v=l.threshold,p=l.findAllMatches,d=l.minMatchCharLength;return i(e,this.pattern,this.patternAlphabet,{location:u,distance:f,threshold:v,findAllMatches:p,minMatchCharLength:d,includeMatches:n})}}])&&n(t.prototype,r),s&&n(t,s),e}();e.exports=s},function(e,t){var r=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;e.exports=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:/ +/g,o=new RegExp(t.replace(r,"\\$&").replace(n,"|")),i=e.match(o),a=!!i,s=[];if(a)for(var c=0,h=i.length;c<h;c+=1){var l=i[c];s.push([e.indexOf(l),l.length-1])}return{score:a?.5:1,isMatch:a,matchedIndices:s}}},function(e,t,r){var n=r(4),o=r(5);e.exports=function(e,t,r,i){for(var a=i.location,s=void 0===a?0:a,c=i.distance,h=void 0===c?100:c,l=i.threshold,u=void 0===l?.6:l,f=i.findAllMatches,v=void 0!==f&&f,p=i.minMatchCharLength,d=void 0===p?1:p,g=i.includeMatches,y=void 0!==g&&g,m=s,k=e.length,b=u,S=e.indexOf(t,m),x=t.length,M=[],_=0;_<k;_+=1)M[_]=0;if(-1!==S){var w=n(t,{errors:0,currentLocation:S,expectedLocation:m,distance:h});if(b=Math.min(w,b),-1!==(S=e.lastIndexOf(t,m+x))){var L=n(t,{errors:0,currentLocation:S,expectedLocation:m,distance:h});b=Math.min(L,b)}}S=-1;for(var A=[],O=1,C=x+k,j=1<<(x<=31?x-1:30),P=0;P<x;P+=1){for(var I=0,F=C;I<F;){n(t,{errors:P,currentLocation:m+F,expectedLocation:m,distance:h})<=b?I=F:C=F,F=Math.floor((C-I)/2+I)}C=F;var T=Math.max(1,m-F+1),N=v?k:Math.min(m+F,k)+x,z=Array(N+2);z[N+1]=(1<<P)-1;for(var E=N;E>=T;E-=1){var W=E-1,K=r[e.charAt(W)];if(K&&(M[W]=1),z[E]=(z[E+1]<<1|1)&K,0!==P&&(z[E]|=(A[E+1]|A[E])<<1|1|A[E+1]),z[E]&j&&(O=n(t,{errors:P,currentLocation:W,expectedLocation:m,distance:h}))<=b){if(b=O,(S=W)<=m)break;T=Math.max(1,2*m-S)}}if(n(t,{errors:P+1,currentLocation:m,expectedLocation:m,distance:h})>b)break;A=z}var $={isMatch:S>=0,score:0===O?.001:O};return y&&($.matchedIndices=o(M,d)),$}},function(e,t){e.exports=function(e,t){var r=t.errors,n=void 0===r?0:r,o=t.currentLocation,i=void 0===o?0:o,a=t.expectedLocation,s=void 0===a?0:a,c=t.distance,h=void 0===c?100:c,l=n/e.length,u=Math.abs(s-i);return h?l+u/h:u?1:l}},function(e,t){e.exports=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=[],n=-1,o=-1,i=0,a=e.length;i<a;i+=1){var s=e[i];s&&-1===n?n=i:s||-1===n||((o=i-1)-n+1>=t&&r.push([n,o]),n=-1)}return e[i-1]&&i-n>=t&&r.push([n,i-1]),r}},function(e,t){e.exports=function(e){for(var t={},r=e.length,n=0;n<r;n+=1)t[e.charAt(n)]=0;for(var o=0;o<r;o+=1)t[e.charAt(o)]|=1<<r-o-1;return t}},function(e,t){var r=function(e){return Array.isArray?Array.isArray(e):"[object Array]"===Object.prototype.toString.call(e)},n=function(e){return null==e?"":function(e){if("string"==typeof e)return e;var t=e+"";return"0"==t&&1/e==-1/0?"-0":t}(e)},o=function(e){return"string"==typeof e},i=function(e){return"number"==typeof e};e.exports={get:function(e,t){var a=[];return function e(t,s){if(s){var c=s.indexOf("."),h=s,l=null;-1!==c&&(h=s.slice(0,c),l=s.slice(c+1));var u=t[h];if(null!=u)if(l||!o(u)&&!i(u))if(r(u))for(var f=0,v=u.length;f<v;f+=1)e(u[f],l);else l&&e(u,l);else a.push(n(u))}else a.push(t)}(e,t),a},isArray:r,isString:o,isNum:i,toString:n}}])});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy9pbmRpdmlkdWFsLXJlc3BvbnNlLS15b3VyLWhvdXNlaG9sZC12MTUvYnVuZGxlLmpzIiwibm9kZV9tb2R1bGVzL2Z1c2UuanMvZGlzdC9mdXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4aExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmo7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbn07XG5cblxuXG5cblxuXG5cblxuXG52YXIgYXN5bmNUb0dlbmVyYXRvciA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBnZW4gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBmdW5jdGlvbiBzdGVwKGtleSwgYXJnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHN0ZXAoXCJuZXh0XCIsIHZhbHVlKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBzdGVwKFwidGhyb3dcIiwgZXJyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RlcChcIm5leHRcIik7XG4gICAgfSk7XG4gIH07XG59O1xuXG52YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxudmFyIGNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpO1xuXG5cblxuXG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIHRvQ29uc3VtYWJsZUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFycik7XG4gIH1cbn07XG5cbi8qXG4qIEZpbGVTYXZlci5qc1xuKiBBIHNhdmVBcygpIEZpbGVTYXZlciBpbXBsZW1lbnRhdGlvbi5cbipcbiogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuKlxuKiBMaWNlbnNlIDogaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvRmlsZVNhdmVyLmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWQgKE1JVClcbiogc291cmNlICA6IGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9GaWxlU2F2ZXIuanNcbiovXG5cbi8vIFRoZSBvbmUgYW5kIG9ubHkgd2F5IG9mIGdldHRpbmcgZ2xvYmFsIHNjb3BlIGluIGFsbCBlbnZpcm9ubWVudHNcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcS8zMjc3MTgyLzEwMDg5OTlcbnZhciBfZ2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHdpbmRvdykpID09PSAnb2JqZWN0JyAmJiB3aW5kb3cud2luZG93ID09PSB3aW5kb3cgPyB3aW5kb3cgOiAodHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHNlbGYpKSA9PT0gJ29iamVjdCcgJiYgc2VsZi5zZWxmID09PSBzZWxmID8gc2VsZiA6ICh0eXBlb2YgZ2xvYmFsID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihnbG9iYWwpKSA9PT0gJ29iamVjdCcgJiYgZ2xvYmFsLmdsb2JhbCA9PT0gZ2xvYmFsID8gZ2xvYmFsIDogdW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBib20oYmxvYiwgb3B0cykge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICd1bmRlZmluZWQnKSBvcHRzID0geyBhdXRvQm9tOiBmYWxzZSB9O2Vsc2UgaWYgKCh0eXBlb2Ygb3B0cyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob3B0cykpICE9PSAnb2JqZWN0Jykge1xuICAgIGNvbnNvbGUud2FybignRGVwcmVjYXRlZDogRXhwZWN0ZWQgdGhpcmQgYXJndW1lbnQgdG8gYmUgYSBvYmplY3QnKTtcbiAgICBvcHRzID0geyBhdXRvQm9tOiAhb3B0cyB9O1xuICB9XG5cbiAgLy8gcHJlcGVuZCBCT00gZm9yIFVURi04IFhNTCBhbmQgdGV4dC8qIHR5cGVzIChpbmNsdWRpbmcgSFRNTClcbiAgLy8gbm90ZTogeW91ciBicm93c2VyIHdpbGwgYXV0b21hdGljYWxseSBjb252ZXJ0IFVURi0xNiBVK0ZFRkYgdG8gRUYgQkIgQkZcbiAgaWYgKG9wdHMuYXV0b0JvbSAmJiAvXlxccyooPzp0ZXh0XFwvXFxTKnxhcHBsaWNhdGlvblxcL3htbHxcXFMqXFwvXFxTKlxcK3htbClcXHMqOy4qY2hhcnNldFxccyo9XFxzKnV0Zi04L2kudGVzdChibG9iLnR5cGUpKSB7XG4gICAgcmV0dXJuIG5ldyBCbG9iKFtTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkVGRiksIGJsb2JdLCB7IHR5cGU6IGJsb2IudHlwZSB9KTtcbiAgfVxuICByZXR1cm4gYmxvYjtcbn1cblxuZnVuY3Rpb24gZG93bmxvYWQodXJsLCBuYW1lLCBvcHRzKSB7XG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7XG4gIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2F2ZUFzKHhoci5yZXNwb25zZSwgbmFtZSwgb3B0cyk7XG4gIH07XG4gIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2NvdWxkIG5vdCBkb3dubG9hZCBmaWxlJyk7XG4gIH07XG4gIHhoci5zZW5kKCk7XG59XG5cbmZ1bmN0aW9uIGNvcnNFbmFibGVkKHVybCkge1xuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIC8vIHVzZSBzeW5jIHRvIGF2b2lkIHBvcHVwIGJsb2NrZXJcbiAgeGhyLm9wZW4oJ0hFQUQnLCB1cmwsIGZhbHNlKTtcbiAgeGhyLnNlbmQoKTtcbiAgcmV0dXJuIHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPD0gMjk5O1xufVxuXG4vLyBgYS5jbGljaygpYCBkb2Vzbid0IHdvcmsgZm9yIGFsbCBicm93c2VycyAoIzQ2NSlcbmZ1bmN0aW9uIGNsaWNrKG5vZGUpIHtcbiAgdHJ5IHtcbiAgICBub2RlLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ2NsaWNrJykpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdNb3VzZUV2ZW50cycpO1xuICAgIGV2dC5pbml0TW91c2VFdmVudCgnY2xpY2snLCB0cnVlLCB0cnVlLCB3aW5kb3csIDAsIDAsIDAsIDgwLCAyMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuICAgIG5vZGUuZGlzcGF0Y2hFdmVudChldnQpO1xuICB9XG59XG5cbnZhciBzYXZlQXMgPSBfZ2xvYmFsLnNhdmVBcyB8fCAoXG4vLyBwcm9iYWJseSBpbiBzb21lIHdlYiB3b3JrZXJcbih0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih3aW5kb3cpKSAhPT0gJ29iamVjdCcgfHwgd2luZG93ICE9PSBfZ2xvYmFsID8gZnVuY3Rpb24gc2F2ZUFzKCkge30gLyogbm9vcCAqL1xuXG5cbi8vIFVzZSBkb3dubG9hZCBhdHRyaWJ1dGUgZmlyc3QgaWYgcG9zc2libGUgKCMxOTMgTHVtaWEgbW9iaWxlKVxuOiAnZG93bmxvYWQnIGluIEhUTUxBbmNob3JFbGVtZW50LnByb3RvdHlwZSA/IGZ1bmN0aW9uIHNhdmVBcyhibG9iLCBuYW1lLCBvcHRzKSB7XG4gIHZhciBVUkwgPSBfZ2xvYmFsLlVSTCB8fCBfZ2xvYmFsLndlYmtpdFVSTDtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIG5hbWUgPSBuYW1lIHx8IGJsb2IubmFtZSB8fCAnZG93bmxvYWQnO1xuXG4gIGEuZG93bmxvYWQgPSBuYW1lO1xuICBhLnJlbCA9ICdub29wZW5lcic7IC8vIHRhYm5hYmJpbmdcblxuICAvLyBUT0RPOiBkZXRlY3QgY2hyb21lIGV4dGVuc2lvbnMgJiBwYWNrYWdlZCBhcHBzXG4gIC8vIGEudGFyZ2V0ID0gJ19ibGFuaydcblxuICBpZiAodHlwZW9mIGJsb2IgPT09ICdzdHJpbmcnKSB7XG4gICAgLy8gU3VwcG9ydCByZWd1bGFyIGxpbmtzXG4gICAgYS5ocmVmID0gYmxvYjtcbiAgICBpZiAoYS5vcmlnaW4gIT09IGxvY2F0aW9uLm9yaWdpbikge1xuICAgICAgY29yc0VuYWJsZWQoYS5ocmVmKSA/IGRvd25sb2FkKGJsb2IsIG5hbWUsIG9wdHMpIDogY2xpY2soYSwgYS50YXJnZXQgPSAnX2JsYW5rJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsaWNrKGEpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBTdXBwb3J0IGJsb2JzXG4gICAgYS5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwoYS5ocmVmKTtcbiAgICB9LCA0RTQpOyAvLyA0MHNcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGNsaWNrKGEpO1xuICAgIH0sIDApO1xuICB9XG59XG5cbi8vIFVzZSBtc1NhdmVPck9wZW5CbG9iIGFzIGEgc2Vjb25kIGFwcHJvYWNoXG46ICdtc1NhdmVPck9wZW5CbG9iJyBpbiBuYXZpZ2F0b3IgPyBmdW5jdGlvbiBzYXZlQXMoYmxvYiwgbmFtZSwgb3B0cykge1xuICBuYW1lID0gbmFtZSB8fCBibG9iLm5hbWUgfHwgJ2Rvd25sb2FkJztcblxuICBpZiAodHlwZW9mIGJsb2IgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGNvcnNFbmFibGVkKGJsb2IpKSB7XG4gICAgICBkb3dubG9hZChibG9iLCBuYW1lLCBvcHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICBhLmhyZWYgPSBibG9iO1xuICAgICAgYS50YXJnZXQgPSAnX2JsYW5rJztcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGljayhhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBuYXZpZ2F0b3IubXNTYXZlT3JPcGVuQmxvYihib20oYmxvYiwgb3B0cyksIG5hbWUpO1xuICB9XG59XG5cbi8vIEZhbGxiYWNrIHRvIHVzaW5nIEZpbGVSZWFkZXIgYW5kIGEgcG9wdXBcbjogZnVuY3Rpb24gc2F2ZUFzKGJsb2IsIG5hbWUsIG9wdHMsIHBvcHVwKSB7XG4gIC8vIE9wZW4gYSBwb3B1cCBpbW1lZGlhdGVseSBkbyBnbyBhcm91bmQgcG9wdXAgYmxvY2tlclxuICAvLyBNb3N0bHkgb25seSBhdmFpbGFibGUgb24gdXNlciBpbnRlcmFjdGlvbiBhbmQgdGhlIGZpbGVSZWFkZXIgaXMgYXN5bmMgc28uLi5cbiAgcG9wdXAgPSBwb3B1cCB8fCBvcGVuKCcnLCAnX2JsYW5rJyk7XG4gIGlmIChwb3B1cCkge1xuICAgIHBvcHVwLmRvY3VtZW50LnRpdGxlID0gcG9wdXAuZG9jdW1lbnQuYm9keS5pbm5lclRleHQgPSAnZG93bmxvYWRpbmcuLi4nO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBibG9iID09PSAnc3RyaW5nJykgcmV0dXJuIGRvd25sb2FkKGJsb2IsIG5hbWUsIG9wdHMpO1xuXG4gIHZhciBmb3JjZSA9IGJsb2IudHlwZSA9PT0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIHZhciBpc1NhZmFyaSA9IC9jb25zdHJ1Y3Rvci9pLnRlc3QoX2dsb2JhbC5IVE1MRWxlbWVudCkgfHwgX2dsb2JhbC5zYWZhcmk7XG4gIHZhciBpc0Nocm9tZUlPUyA9IC9DcmlPU1xcL1tcXGRdKy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuICBpZiAoKGlzQ2hyb21lSU9TIHx8IGZvcmNlICYmIGlzU2FmYXJpKSAmJiAodHlwZW9mIEZpbGVSZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKEZpbGVSZWFkZXIpKSA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBTYWZhcmkgZG9lc24ndCBhbGxvdyBkb3dubG9hZGluZyBvZiBibG9iIFVSTHNcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHVybCA9IHJlYWRlci5yZXN1bHQ7XG4gICAgICB1cmwgPSBpc0Nocm9tZUlPUyA/IHVybCA6IHVybC5yZXBsYWNlKC9eZGF0YTpbXjtdKjsvLCAnZGF0YTphdHRhY2htZW50L2ZpbGU7Jyk7XG4gICAgICBpZiAocG9wdXApIHBvcHVwLmxvY2F0aW9uLmhyZWYgPSB1cmw7ZWxzZSBsb2NhdGlvbiA9IHVybDtcbiAgICAgIHBvcHVwID0gbnVsbDsgLy8gcmV2ZXJzZS10YWJuYWJiaW5nICM0NjBcbiAgICB9O1xuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGJsb2IpO1xuICB9IGVsc2Uge1xuICAgIHZhciBVUkwgPSBfZ2xvYmFsLlVSTCB8fCBfZ2xvYmFsLndlYmtpdFVSTDtcbiAgICB2YXIgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBpZiAocG9wdXApIHBvcHVwLmxvY2F0aW9uID0gdXJsO2Vsc2UgbG9jYXRpb24uaHJlZiA9IHVybDtcbiAgICBwb3B1cCA9IG51bGw7IC8vIHJldmVyc2UtdGFibmFiYmluZyAjNDYwXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gICAgfSwgNEU0KTsgLy8gNDBzXG4gIH1cbn0pO1xuXG5fZ2xvYmFsLnNhdmVBcyA9IHNhdmVBcy5zYXZlQXMgPSBzYXZlQXM7XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHNhdmVBcztcbn1cblxuaWYgKCFBcnJheS5mcm9tKSB7XG4gIEFycmF5LmZyb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgICB2YXIgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUoZm4pIHtcbiAgICAgIHJldHVybiB0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgfHwgdG9TdHIuY2FsbChmbikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gICAgfTtcbiAgICB2YXIgdG9JbnRlZ2VyID0gZnVuY3Rpb24gdG9JbnRlZ2VyKHZhbHVlKSB7XG4gICAgICB2YXIgbnVtYmVyID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgIGlmIChpc05hTihudW1iZXIpKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgaWYgKG51bWJlciA9PT0gMCB8fCAhaXNGaW5pdGUobnVtYmVyKSkge1xuICAgICAgICByZXR1cm4gbnVtYmVyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChudW1iZXIgPiAwID8gMSA6IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnMobnVtYmVyKSk7XG4gICAgfTtcbiAgICB2YXIgbWF4U2FmZUludGVnZXIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuICAgIHZhciB0b0xlbmd0aCA9IGZ1bmN0aW9uIHRvTGVuZ3RoKHZhbHVlKSB7XG4gICAgICB2YXIgbGVuID0gdG9JbnRlZ2VyKHZhbHVlKTtcbiAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW4sIDApLCBtYXhTYWZlSW50ZWdlcik7XG4gICAgfTtcblxuICAgIC8vIFRoZSBsZW5ndGggcHJvcGVydHkgb2YgdGhlIGZyb20gbWV0aG9kIGlzIDEuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qLCBtYXBGbiwgdGhpc0FyZyAqLykge1xuICAgICAgLy8gMS4gTGV0IEMgYmUgdGhlIHRoaXMgdmFsdWUuXG4gICAgICB2YXIgQyA9IHRoaXM7XG5cbiAgICAgIC8vIDIuIExldCBpdGVtcyBiZSBUb09iamVjdChhcnJheUxpa2UpLlxuICAgICAgdmFyIGl0ZW1zID0gT2JqZWN0KGFycmF5TGlrZSk7XG5cbiAgICAgIC8vIDMuIFJldHVybklmQWJydXB0KGl0ZW1zKS5cbiAgICAgIGlmIChhcnJheUxpa2UgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5mcm9tIHJlcXVpcmVzIGFuIGFycmF5LWxpa2Ugb2JqZWN0IC0gbm90IG51bGwgb3IgdW5kZWZpbmVkJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIDQuIElmIG1hcGZuIGlzIHVuZGVmaW5lZCwgdGhlbiBsZXQgbWFwcGluZyBiZSBmYWxzZS5cbiAgICAgIHZhciBtYXBGbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdm9pZCB1bmRlZmluZWQ7XG4gICAgICB2YXIgVDtcbiAgICAgIGlmICh0eXBlb2YgbWFwRm4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIDUuIGVsc2VcbiAgICAgICAgLy8gNS4gYSBJZiBJc0NhbGxhYmxlKG1hcGZuKSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAoIWlzQ2FsbGFibGUobWFwRm4pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkuZnJvbTogd2hlbiBwcm92aWRlZCwgdGhlIHNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDUuIGIuIElmIHRoaXNBcmcgd2FzIHN1cHBsaWVkLCBsZXQgVCBiZSB0aGlzQXJnOyBlbHNlIGxldCBUIGJlIHVuZGVmaW5lZC5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgVCA9IGFyZ3VtZW50c1syXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAxMC4gTGV0IGxlblZhbHVlIGJlIEdldChpdGVtcywgXCJsZW5ndGhcIikuXG4gICAgICAvLyAxMS4gTGV0IGxlbiBiZSBUb0xlbmd0aChsZW5WYWx1ZSkuXG4gICAgICB2YXIgbGVuID0gdG9MZW5ndGgoaXRlbXMubGVuZ3RoKTtcblxuICAgICAgLy8gMTMuIElmIElzQ29uc3RydWN0b3IoQykgaXMgdHJ1ZSwgdGhlblxuICAgICAgLy8gMTMuIGEuIExldCBBIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2RcbiAgICAgIC8vIG9mIEMgd2l0aCBhbiBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcgdGhlIHNpbmdsZSBpdGVtIGxlbi5cbiAgICAgIC8vIDE0LiBhLiBFbHNlLCBMZXQgQSBiZSBBcnJheUNyZWF0ZShsZW4pLlxuICAgICAgdmFyIEEgPSBpc0NhbGxhYmxlKEMpID8gT2JqZWN0KG5ldyBDKGxlbikpIDogbmV3IEFycmF5KGxlbik7XG5cbiAgICAgIC8vIDE2LiBMZXQgayBiZSAwLlxuICAgICAgdmFyIGsgPSAwO1xuICAgICAgLy8gMTcuIFJlcGVhdCwgd2hpbGUgayA8IGxlbuKApiAoYWxzbyBzdGVwcyBhIC0gaClcbiAgICAgIHZhciBrVmFsdWU7XG4gICAgICB3aGlsZSAoayA8IGxlbikge1xuICAgICAgICBrVmFsdWUgPSBpdGVtc1trXTtcbiAgICAgICAgaWYgKG1hcEZuKSB7XG4gICAgICAgICAgQVtrXSA9IHR5cGVvZiBUID09PSAndW5kZWZpbmVkJyA/IG1hcEZuKGtWYWx1ZSwgaykgOiBtYXBGbi5jYWxsKFQsIGtWYWx1ZSwgayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgQVtrXSA9IGtWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBrICs9IDE7XG4gICAgICB9XG4gICAgICAvLyAxOC4gTGV0IHB1dFN0YXR1cyBiZSBQdXQoQSwgXCJsZW5ndGhcIiwgbGVuLCB0cnVlKS5cbiAgICAgIEEubGVuZ3RoID0gbGVuO1xuICAgICAgLy8gMjAuIFJldHVybiBBLlxuICAgICAgcmV0dXJuIEE7XG4gICAgfTtcbiAgfSgpO1xufVxuXG4vKipcbiAqXG4gKlxuICogQGF1dGhvciBKZXJyeSBCZW5keSA8amVycnlAaWNld2luZ2NjLmNvbT5cbiAqIEBsaWNlbmNlIE1JVFxuICpcbiAqL1xuXG4oZnVuY3Rpb24gKHNlbGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBuYXRpdmVVUkxTZWFyY2hQYXJhbXMgPSBzZWxmLlVSTFNlYXJjaFBhcmFtcyAmJiBzZWxmLlVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuZ2V0ID8gc2VsZi5VUkxTZWFyY2hQYXJhbXMgOiBudWxsLFxuICAgICAgaXNTdXBwb3J0T2JqZWN0Q29uc3RydWN0b3IgPSBuYXRpdmVVUkxTZWFyY2hQYXJhbXMgJiYgbmV3IG5hdGl2ZVVSTFNlYXJjaFBhcmFtcyh7IGE6IDEgfSkudG9TdHJpbmcoKSA9PT0gJ2E9MScsXG5cbiAgLy8gVGhlcmUgaXMgYSBidWcgaW4gc2FmYXJpIDEwLjEgKGFuZCBlYXJsaWVyKSB0aGF0IGluY29ycmVjdGx5IGRlY29kZXMgYCUyQmAgYXMgYW4gZW1wdHkgc3BhY2UgYW5kIG5vdCBhIHBsdXMuXG4gIGRlY29kZXNQbHVzZXNDb3JyZWN0bHkgPSBuYXRpdmVVUkxTZWFyY2hQYXJhbXMgJiYgbmV3IG5hdGl2ZVVSTFNlYXJjaFBhcmFtcygncz0lMkInKS5nZXQoJ3MnKSA9PT0gJysnLFxuICAgICAgX19VUkxTZWFyY2hQYXJhbXNfXyA9IFwiX19VUkxTZWFyY2hQYXJhbXNfX1wiLFxuXG4gIC8vIEZpeCBidWcgaW4gRWRnZSB3aGljaCBjYW5ub3QgZW5jb2RlICcgJicgY29ycmVjdGx5XG4gIGVuY29kZXNBbXBlcnNhbmRzQ29ycmVjdGx5ID0gbmF0aXZlVVJMU2VhcmNoUGFyYW1zID8gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbXBlcnNhbmRUZXN0ID0gbmV3IG5hdGl2ZVVSTFNlYXJjaFBhcmFtcygpO1xuICAgIGFtcGVyc2FuZFRlc3QuYXBwZW5kKCdzJywgJyAmJyk7XG4gICAgcmV0dXJuIGFtcGVyc2FuZFRlc3QudG9TdHJpbmcoKSA9PT0gJ3M9KyUyNic7XG4gIH0oKSA6IHRydWUsXG4gICAgICBwcm90b3R5cGUgPSBVUkxTZWFyY2hQYXJhbXNQb2x5ZmlsbC5wcm90b3R5cGUsXG4gICAgICBpdGVyYWJsZSA9ICEhKHNlbGYuU3ltYm9sICYmIHNlbGYuU3ltYm9sLml0ZXJhdG9yKTtcblxuICBpZiAobmF0aXZlVVJMU2VhcmNoUGFyYW1zICYmIGlzU3VwcG9ydE9iamVjdENvbnN0cnVjdG9yICYmIGRlY29kZXNQbHVzZXNDb3JyZWN0bHkgJiYgZW5jb2Rlc0FtcGVyc2FuZHNDb3JyZWN0bHkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhIFVSTFNlYXJjaFBhcmFtcyBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8VVJMU2VhcmNoUGFyYW1zfSBzZWFyY2hcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBmdW5jdGlvbiBVUkxTZWFyY2hQYXJhbXNQb2x5ZmlsbChzZWFyY2gpIHtcbiAgICBzZWFyY2ggPSBzZWFyY2ggfHwgXCJcIjtcblxuICAgIC8vIHN1cHBvcnQgY29uc3RydWN0IG9iamVjdCB3aXRoIGFub3RoZXIgVVJMU2VhcmNoUGFyYW1zIGluc3RhbmNlXG4gICAgaWYgKHNlYXJjaCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcyB8fCBzZWFyY2ggaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXNQb2x5ZmlsbCkge1xuICAgICAgc2VhcmNoID0gc2VhcmNoLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHRoaXNbX19VUkxTZWFyY2hQYXJhbXNfX10gPSBwYXJzZVRvRGljdChzZWFyY2gpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSBzcGVjaWZpZWQga2V5L3ZhbHVlIHBhaXIgYXMgYSBuZXcgc2VhcmNoIHBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gICAqL1xuICBwcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgYXBwZW5kVG8odGhpc1tfX1VSTFNlYXJjaFBhcmFtc19fXSwgbmFtZSwgdmFsdWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZWxldGVzIHRoZSBnaXZlbiBzZWFyY2ggcGFyYW1ldGVyLCBhbmQgaXRzIGFzc29jaWF0ZWQgdmFsdWUsXG4gICAqIGZyb20gdGhlIGxpc3Qgb2YgYWxsIHNlYXJjaCBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKi9cbiAgcHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXNbX19VUkxTZWFyY2hQYXJhbXNfX11bbmFtZV07XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZpcnN0IHZhbHVlIGFzc29jaWF0ZWQgdG8gdGhlIGdpdmVuIHNlYXJjaCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEByZXR1cm5zIHtzdHJpbmd8bnVsbH1cbiAgICovXG4gIHByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkaWN0ID0gdGhpc1tfX1VSTFNlYXJjaFBhcmFtc19fXTtcbiAgICByZXR1cm4gbmFtZSBpbiBkaWN0ID8gZGljdFtuYW1lXVswXSA6IG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIHRoZSB2YWx1ZXMgYXNzb2NpYXRpb24gd2l0aCBhIGdpdmVuIHNlYXJjaCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG4gIHByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkaWN0ID0gdGhpc1tfX1VSTFNlYXJjaFBhcmFtc19fXTtcbiAgICByZXR1cm4gbmFtZSBpbiBkaWN0ID8gZGljdFtuYW1lXS5zbGljZSgwKSA6IFtdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgQm9vbGVhbiBpbmRpY2F0aW5nIGlmIHN1Y2ggYSBzZWFyY2ggcGFyYW1ldGVyIGV4aXN0cy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBwcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZSBpbiB0aGlzW19fVVJMU2VhcmNoUGFyYW1zX19dO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHRvIGEgZ2l2ZW4gc2VhcmNoIHBhcmFtZXRlciB0b1xuICAgKiB0aGUgZ2l2ZW4gdmFsdWUuIElmIHRoZXJlIHdlcmUgc2V2ZXJhbCB2YWx1ZXMsIGRlbGV0ZSB0aGVcbiAgICogb3RoZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICovXG4gIHByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQkJDEobmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzW19fVVJMU2VhcmNoUGFyYW1zX19dW25hbWVdID0gWycnICsgdmFsdWVdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5nIGEgcXVlcnkgc3RyaW5nIHN1aXRhYmxlIGZvciB1c2UgaW4gYSBVUkwuXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBwcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRpY3QgPSB0aGlzW19fVVJMU2VhcmNoUGFyYW1zX19dLFxuICAgICAgICBxdWVyeSA9IFtdLFxuICAgICAgICBpLFxuICAgICAgICBrZXksXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHZhbHVlO1xuICAgIGZvciAoa2V5IGluIGRpY3QpIHtcbiAgICAgIG5hbWUgPSBlbmNvZGUoa2V5KTtcbiAgICAgIGZvciAoaSA9IDAsIHZhbHVlID0gZGljdFtrZXldOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcXVlcnkucHVzaChuYW1lICsgJz0nICsgZW5jb2RlKHZhbHVlW2ldKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBxdWVyeS5qb2luKCcmJyk7XG4gIH07XG5cbiAgLy8gVGhlcmUgaXMgYSBidWcgaW4gU2FmYXJpIDEwLjEgYW5kIGBQcm94eWBpbmcgaXQgaXMgbm90IGVub3VnaC5cbiAgdmFyIGZvclN1cmVVc2VQb2x5ZmlsbCA9ICFkZWNvZGVzUGx1c2VzQ29ycmVjdGx5O1xuICB2YXIgdXNlUHJveHkgPSAhZm9yU3VyZVVzZVBvbHlmaWxsICYmIG5hdGl2ZVVSTFNlYXJjaFBhcmFtcyAmJiAhaXNTdXBwb3J0T2JqZWN0Q29uc3RydWN0b3IgJiYgc2VsZi5Qcm94eTtcbiAgLypcbiAgICogQXBwbHkgcG9saWZpbGwgdG8gZ2xvYmFsIG9iamVjdCBhbmQgYXBwZW5kIG90aGVyIHByb3RvdHlwZSBpbnRvIGl0XG4gICAqL1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwgJ1VSTFNlYXJjaFBhcmFtcycsIHtcbiAgICB2YWx1ZTogdXNlUHJveHkgP1xuICAgIC8vIFNhZmFyaSAxMC4wIGRvZXNuJ3Qgc3VwcG9ydCBQcm94eSwgc28gaXQgd29uJ3QgZXh0ZW5kIFVSTFNlYXJjaFBhcmFtcyBvbiBzYWZhcmkgMTAuMFxuICAgIG5ldyBQcm94eShuYXRpdmVVUkxTZWFyY2hQYXJhbXMsIHtcbiAgICAgIGNvbnN0cnVjdDogZnVuY3Rpb24gY29uc3RydWN0KHRhcmdldCwgYXJncykge1xuICAgICAgICByZXR1cm4gbmV3IHRhcmdldChuZXcgVVJMU2VhcmNoUGFyYW1zUG9seWZpbGwoYXJnc1swXSkudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfSkgOiBVUkxTZWFyY2hQYXJhbXNQb2x5ZmlsbFxuICB9KTtcblxuICB2YXIgVVNQUHJvdG8gPSBzZWxmLlVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGU7XG5cbiAgVVNQUHJvdG8ucG9seWZpbGwgPSB0cnVlO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcGFyYW0ge29iamVjdH0gdGhpc0FyZ1xuICAgKi9cbiAgVVNQUHJvdG8uZm9yRWFjaCA9IFVTUFByb3RvLmZvckVhY2ggfHwgZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIGRpY3QgPSBwYXJzZVRvRGljdCh0aGlzLnRvU3RyaW5nKCkpO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGRpY3QpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGRpY3RbbmFtZV0uZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgbmFtZSwgdGhpcyk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuICAvKipcbiAgICogU29ydCBhbGwgbmFtZS12YWx1ZSBwYWlyc1xuICAgKi9cbiAgVVNQUHJvdG8uc29ydCA9IFVTUFByb3RvLnNvcnQgfHwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkaWN0ID0gcGFyc2VUb0RpY3QodGhpcy50b1N0cmluZygpKSxcbiAgICAgICAga2V5cyA9IFtdLFxuICAgICAgICBrLFxuICAgICAgICBpLFxuICAgICAgICBqO1xuICAgIGZvciAoayBpbiBkaWN0KSB7XG4gICAgICBrZXlzLnB1c2goayk7XG4gICAgfVxuICAgIGtleXMuc29ydCgpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXNbJ2RlbGV0ZSddKGtleXNbaV0pO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV0sXG4gICAgICAgICAgdmFsdWVzID0gZGljdFtrZXldO1xuICAgICAgZm9yIChqID0gMDsgaiA8IHZhbHVlcy5sZW5ndGg7IGorKykge1xuICAgICAgICB0aGlzLmFwcGVuZChrZXksIHZhbHVlc1tqXSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGl0ZXJhdG9yIGFsbG93aW5nIHRvIGdvIHRocm91Z2ggYWxsIGtleXMgb2ZcbiAgICogdGhlIGtleS92YWx1ZSBwYWlycyBjb250YWluZWQgaW4gdGhpcyBvYmplY3QuXG4gICAqXG4gICAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAgICovXG4gIFVTUFByb3RvLmtleXMgPSBVU1BQcm90by5rZXlzIHx8IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIG5hbWUpIHtcbiAgICAgIGl0ZW1zLnB1c2gobmFtZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1ha2VJdGVyYXRvcihpdGVtcyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlcmF0b3IgYWxsb3dpbmcgdG8gZ28gdGhyb3VnaCBhbGwgdmFsdWVzIG9mXG4gICAqIHRoZSBrZXkvdmFsdWUgcGFpcnMgY29udGFpbmVkIGluIHRoaXMgb2JqZWN0LlxuICAgKlxuICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gICAqL1xuICBVU1BQcm90by52YWx1ZXMgPSBVU1BQcm90by52YWx1ZXMgfHwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgaXRlbXMucHVzaChpdGVtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWFrZUl0ZXJhdG9yKGl0ZW1zKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpdGVyYXRvciBhbGxvd2luZyB0byBnbyB0aHJvdWdoIGFsbCBrZXkvdmFsdWVcbiAgICogcGFpcnMgY29udGFpbmVkIGluIHRoaXMgb2JqZWN0LlxuICAgKlxuICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gICAqL1xuICBVU1BQcm90by5lbnRyaWVzID0gVVNQUHJvdG8uZW50cmllcyB8fCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBuYW1lKSB7XG4gICAgICBpdGVtcy5wdXNoKFtuYW1lLCBpdGVtXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1ha2VJdGVyYXRvcihpdGVtcyk7XG4gIH07XG5cbiAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgVVNQUHJvdG9bc2VsZi5TeW1ib2wuaXRlcmF0b3JdID0gVVNQUHJvdG9bc2VsZi5TeW1ib2wuaXRlcmF0b3JdIHx8IFVTUFByb3RvLmVudHJpZXM7XG4gIH1cblxuICBmdW5jdGlvbiBlbmNvZGUoc3RyKSB7XG4gICAgdmFyIHJlcGxhY2UgPSB7XG4gICAgICAnISc6ICclMjEnLFxuICAgICAgXCInXCI6ICclMjcnLFxuICAgICAgJygnOiAnJTI4JyxcbiAgICAgICcpJzogJyUyOScsXG4gICAgICAnfic6ICclN0UnLFxuICAgICAgJyUyMCc6ICcrJyxcbiAgICAgICclMDAnOiAnXFx4MDAnXG4gICAgfTtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnXFwoXFwpfl18JTIwfCUwMC9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgIHJldHVybiByZXBsYWNlW21hdGNoXTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlY29kZShzdHIpIHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlSXRlcmF0b3IoYXJyKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyLnNoaWZ0KCk7XG4gICAgICAgIHJldHVybiB7IGRvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZSB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIGl0ZXJhdG9yW3NlbGYuU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlcmF0b3I7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVRvRGljdChzZWFyY2gpIHtcbiAgICB2YXIgZGljdCA9IHt9O1xuXG4gICAgaWYgKCh0eXBlb2Ygc2VhcmNoID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihzZWFyY2gpKSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZm9yICh2YXIga2V5IGluIHNlYXJjaCkge1xuICAgICAgICBpZiAoc2VhcmNoLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBhcHBlbmRUbyhkaWN0LCBrZXksIHNlYXJjaFtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZW1vdmUgZmlyc3QgJz8nXG4gICAgICBpZiAoc2VhcmNoLmluZGV4T2YoXCI/XCIpID09PSAwKSB7XG4gICAgICAgIHNlYXJjaCA9IHNlYXJjaC5zbGljZSgxKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHBhaXJzID0gc2VhcmNoLnNwbGl0KFwiJlwiKTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFpcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFpcnNbal0sXG4gICAgICAgICAgICBpbmRleCA9IHZhbHVlLmluZGV4T2YoJz0nKTtcblxuICAgICAgICBpZiAoLTEgPCBpbmRleCkge1xuICAgICAgICAgIGFwcGVuZFRvKGRpY3QsIGRlY29kZSh2YWx1ZS5zbGljZSgwLCBpbmRleCkpLCBkZWNvZGUodmFsdWUuc2xpY2UoaW5kZXggKyAxKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgYXBwZW5kVG8oZGljdCwgZGVjb2RlKHZhbHVlKSwgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkaWN0O1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwZW5kVG8oZGljdCwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgdmFsID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgPT09ICdmdW5jdGlvbicgPyB2YWx1ZS50b1N0cmluZygpIDogSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXG4gICAgaWYgKG5hbWUgaW4gZGljdCkge1xuICAgICAgZGljdFtuYW1lXS5wdXNoKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpY3RbbmFtZV0gPSBbdmFsXTtcbiAgICB9XG4gIH1cbn0pKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQpO1xuXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmluZFxuaWYgKCFBcnJheS5wcm90b3R5cGUuZmluZCkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCAnZmluZCcsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUocHJlZGljYXRlKSB7XG4gICAgICAvLyAxLiBMZXQgTyBiZSA/IFRvT2JqZWN0KHRoaXMgdmFsdWUpLlxuICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInRoaXNcIiBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBvID0gT2JqZWN0KHRoaXMpO1xuXG4gICAgICAvLyAyLiBMZXQgbGVuIGJlID8gVG9MZW5ndGgoPyBHZXQoTywgXCJsZW5ndGhcIikpLlxuICAgICAgdmFyIGxlbiA9IG8ubGVuZ3RoID4+PiAwO1xuXG4gICAgICAvLyAzLiBJZiBJc0NhbGxhYmxlKHByZWRpY2F0ZSkgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgIGlmICh0eXBlb2YgcHJlZGljYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ByZWRpY2F0ZSBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgIH1cblxuICAgICAgLy8gNC4gSWYgdGhpc0FyZyB3YXMgc3VwcGxpZWQsIGxldCBUIGJlIHRoaXNBcmc7IGVsc2UgbGV0IFQgYmUgdW5kZWZpbmVkLlxuICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgIC8vIDUuIExldCBrIGJlIDAuXG4gICAgICB2YXIgayA9IDA7XG5cbiAgICAgIC8vIDYuIFJlcGVhdCwgd2hpbGUgayA8IGxlblxuICAgICAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICAgICAgLy8gYS4gTGV0IFBrIGJlICEgVG9TdHJpbmcoaykuXG4gICAgICAgIC8vIGIuIExldCBrVmFsdWUgYmUgPyBHZXQoTywgUGspLlxuICAgICAgICAvLyBjLiBMZXQgdGVzdFJlc3VsdCBiZSBUb0Jvb2xlYW4oPyBDYWxsKHByZWRpY2F0ZSwgVCwgwqsga1ZhbHVlLCBrLCBPIMK7KSkuXG4gICAgICAgIC8vIGQuIElmIHRlc3RSZXN1bHQgaXMgdHJ1ZSwgcmV0dXJuIGtWYWx1ZS5cbiAgICAgICAgdmFyIGtWYWx1ZSA9IG9ba107XG4gICAgICAgIGlmIChwcmVkaWNhdGUuY2FsbCh0aGlzQXJnLCBrVmFsdWUsIGssIG8pKSB7XG4gICAgICAgICAgcmV0dXJuIGtWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlLiBJbmNyZWFzZSBrIGJ5IDEuXG4gICAgICAgIGsrKztcbiAgICAgIH1cblxuICAgICAgLy8gNy4gUmV0dXJuIHVuZGVmaW5lZC5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DdXN0b21FdmVudC9DdXN0b21FdmVudFxuKGZ1bmN0aW9uICgpIHtcblxuICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7IGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiBudWxsIH07XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgcmV0dXJuIGV2dDtcbiAgfVxuXG4gIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG5cbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG59KSgpO1xuXG4oZnVuY3Rpb24gKHNlbGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGlmIChzZWxmLmZldGNoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHN1cHBvcnQgPSB7XG4gICAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICAgIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICAgIGJsb2I6ICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmICdCbG9iJyBpbiBzZWxmICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSgpLFxuICAgIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gICAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxuICB9O1xuXG4gIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gICAgdmFyIHZpZXdDbGFzc2VzID0gWydbb2JqZWN0IEludDhBcnJheV0nLCAnW29iamVjdCBVaW50OEFycmF5XScsICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsICdbb2JqZWN0IEludDE2QXJyYXldJywgJ1tvYmplY3QgVWludDE2QXJyYXldJywgJ1tvYmplY3QgSW50MzJBcnJheV0nLCAnW29iamVjdCBVaW50MzJBcnJheV0nLCAnW29iamVjdCBGbG9hdDMyQXJyYXldJywgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSddO1xuXG4gICAgdmFyIGlzRGF0YVZpZXcgPSBmdW5jdGlvbiBpc0RhdGFWaWV3KG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopO1xuICAgIH07XG5cbiAgICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPSBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICAgIH1cbiAgICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5cXF5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJyk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKTtcbiAgICAgICAgcmV0dXJuIHsgZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3I7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBpdGVyYXRvcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMubWFwID0ge307XG5cbiAgICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcikge1xuICAgICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKTtcbiAgICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcbiAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXTtcbiAgICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUgKyAnLCcgKyB2YWx1ZSA6IHZhbHVlO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSk7XG4gICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSkge1xuICAgICAgaXRlbXMucHVzaChuYW1lKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpdGVtcy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSkge1xuICAgICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpO1xuICB9O1xuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXM7XG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSk7XG4gICAgfVxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcik7XG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcik7XG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYik7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpO1xuICAgIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gICAgaWYgKGJ1Zi5zbGljZSkge1xuICAgICAgcmV0dXJuIGJ1Zi5zbGljZSgwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aCk7XG4gICAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKTtcbiAgICAgIHJldHVybiB2aWV3LmJ1ZmZlcjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBCb2R5KCkge1xuICAgIHRoaXMuYm9keVVzZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24gKGJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keTtcbiAgICAgIGlmICghYm9keSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5O1xuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHk7XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keTtcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpO1xuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKTtcbiAgICAgICAgLy8gSUUgMTAtMTEgY2FuJ3QgaGFuZGxlIGEgRGF0YVZpZXcgYm9keS5cbiAgICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSk7XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcyk7XG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3RlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcyk7XG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5qc29uID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSk7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG4gIHZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddO1xuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpO1xuICAgIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Q7XG4gIH1cblxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHk7XG5cbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJyk7XG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybDtcbiAgICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFscztcbiAgICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpO1xuICAgICAgfVxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2Q7XG4gICAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlO1xuICAgICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXQ7XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpO1xuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ29taXQnO1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKTtcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpO1xuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbDtcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbDtcblxuICAgIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJyk7XG4gICAgfVxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHkpO1xuICB9XG5cbiAgUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHsgYm9keTogdGhpcy5fYm9keUluaXQgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGJvZHkudHJpbSgpLnNwbGl0KCcmJykuZm9yRWFjaChmdW5jdGlvbiAoYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpO1xuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJyk7XG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKTtcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm9ybTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICAgIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpO1xuICAgIHByZVByb2Nlc3NlZEhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6Jyk7XG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKCk7XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKCk7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBoZWFkZXJzO1xuICB9XG5cbiAgQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKTtcblxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMudHlwZSA9ICdkZWZhdWx0JztcbiAgICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzID09PSB1bmRlZmluZWQgPyAyMDAgOiBvcHRpb25zLnN0YXR1cztcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwO1xuICAgIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJztcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpO1xuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJyc7XG4gICAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpO1xuICB9XG5cbiAgQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSk7XG5cbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgICAgdXJsOiB0aGlzLnVybFxuICAgIH0pO1xuICB9O1xuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7IHN0YXR1czogMCwgc3RhdHVzVGV4dDogJycgfSk7XG4gICAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcic7XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9O1xuXG4gIHZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XTtcblxuICBSZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uICh1cmwsIHN0YXR1cykge1xuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7IHN0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7IGxvY2F0aW9uOiB1cmwgfSB9KTtcbiAgfTtcblxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzO1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0O1xuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2U7XG5cbiAgc2VsZi5mZXRjaCA9IGZ1bmN0aW9uIChpbnB1dCwgaW5pdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KTtcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJyk7XG4gICAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKTtcbiAgICAgIH07XG5cbiAgICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSk7XG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7XG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSkge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSk7XG4gICAgICB9KTtcblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdCk7XG4gICAgfSk7XG4gIH07XG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHVuZGVmaW5lZCk7XG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOiBmYWN0b3J5KCk7XG59KShmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9XG5cbiAgZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cblxuICAgIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7XG4gIH1cblxuICBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICAgIF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgICByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pO1xuICAgIH07XG4gICAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgICBvLl9fcHJvdG9fXyA9IHA7XG4gICAgICByZXR1cm4gbztcbiAgICB9O1xuXG4gICAgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikge1xuICAgIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHtcbiAgICBpZiAoY2FsbCAmJiAoKHR5cGVvZiBjYWxsID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihjYWxsKSkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHtcbiAgICAgIHJldHVybiBjYWxsO1xuICAgIH1cblxuICAgIHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3N1cGVyUHJvcEJhc2Uob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIHdoaWxlICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgICBvYmplY3QgPSBfZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICAgIGlmIChvYmplY3QgPT09IG51bGwpIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICBmdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIFJlZmxlY3QuZ2V0KSB7XG4gICAgICBfZ2V0ID0gUmVmbGVjdC5nZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9nZXQgPSBmdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gICAgICAgIHZhciBiYXNlID0gX3N1cGVyUHJvcEJhc2UodGFyZ2V0LCBwcm9wZXJ0eSk7XG5cbiAgICAgICAgaWYgKCFiYXNlKSByZXR1cm47XG4gICAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBwcm9wZXJ0eSk7XG5cbiAgICAgICAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuIGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyIHx8IHRhcmdldCk7XG4gIH1cblxuICB2YXIgRW1pdHRlciA9XG4gIC8qI19fUFVSRV9fKi9cbiAgZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEVtaXR0ZXIoKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRW1pdHRlcik7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbGlzdGVuZXJzJywge1xuICAgICAgICB2YWx1ZToge30sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhFbWl0dGVyLCBbe1xuICAgICAga2V5OiBcImFkZEV2ZW50TGlzdGVuZXJcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghKHR5cGUgaW4gdGhpcy5saXN0ZW5lcnMpKSB7XG4gICAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdLnB1c2goY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJyZW1vdmVFdmVudExpc3RlbmVyXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoISh0eXBlIGluIHRoaXMubGlzdGVuZXJzKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdGFjayA9IHRoaXMubGlzdGVuZXJzW3R5cGVdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gc3RhY2subGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHN0YWNrW2ldID09PSBjYWxsYmFjaykge1xuICAgICAgICAgICAgc3RhY2suc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJkaXNwYXRjaEV2ZW50XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmICghKGV2ZW50LnR5cGUgaW4gdGhpcy5saXN0ZW5lcnMpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlYm91bmNlID0gZnVuY3Rpb24gZGVib3VuY2UoY2FsbGJhY2spIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKF90aGlzLCBldmVudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHN0YWNrID0gdGhpcy5saXN0ZW5lcnNbZXZlbnQudHlwZV07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdGFjay5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBkZWJvdW5jZShzdGFja1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQ7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEVtaXR0ZXI7XG4gIH0oKTtcblxuICB2YXIgQWJvcnRTaWduYWwgPVxuICAvKiNfX1BVUkVfXyovXG4gIGZ1bmN0aW9uIChfRW1pdHRlcikge1xuICAgIF9pbmhlcml0cyhBYm9ydFNpZ25hbCwgX0VtaXR0ZXIpO1xuXG4gICAgZnVuY3Rpb24gQWJvcnRTaWduYWwoKSB7XG4gICAgICB2YXIgX3RoaXMyO1xuXG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQWJvcnRTaWduYWwpO1xuXG4gICAgICBfdGhpczIgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoQWJvcnRTaWduYWwpLmNhbGwodGhpcykpOyAvLyBTb21lIHZlcnNpb25zIG9mIGJhYmVsIGRvZXMgbm90IHRyYW5zcGlsZSBzdXBlcigpIGNvcnJlY3RseSBmb3IgSUUgPD0gMTAsIGlmIHRoZSBwYXJlbnRcbiAgICAgIC8vIGNvbnN0cnVjdG9yIGhhcyBmYWlsZWQgdG8gcnVuLCB0aGVuIFwidGhpcy5saXN0ZW5lcnNcIiB3aWxsIHN0aWxsIGJlIHVuZGVmaW5lZCBhbmQgdGhlbiB3ZSBjYWxsXG4gICAgICAvLyB0aGUgcGFyZW50IGNvbnN0cnVjdG9yIGRpcmVjdGx5IGluc3RlYWQgYXMgYSB3b3JrYXJvdW5kLiBGb3IgZ2VuZXJhbCBkZXRhaWxzLCBzZWUgYmFiZWwgYnVnOlxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL2lzc3Vlcy8zMDQxXG4gICAgICAvLyBUaGlzIGhhY2sgd2FzIGFkZGVkIGFzIGEgZml4IGZvciB0aGUgaXNzdWUgZGVzY3JpYmVkIGhlcmU6XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLWxpYnJhcnkvcHVsbC81OSNpc3N1ZWNvbW1lbnQtNDc3NTU4MDQyXG5cbiAgICAgIGlmICghX3RoaXMyLmxpc3RlbmVycykge1xuICAgICAgICBFbWl0dGVyLmNhbGwoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpczIpKTtcbiAgICAgIH0gLy8gQ29tcGFyZWQgdG8gYXNzaWdubWVudCwgT2JqZWN0LmRlZmluZVByb3BlcnR5IG1ha2VzIHByb3BlcnRpZXMgbm9uLWVudW1lcmFibGUgYnkgZGVmYXVsdCBhbmRcbiAgICAgIC8vIHdlIHdhbnQgT2JqZWN0LmtleXMobmV3IEFib3J0Q29udHJvbGxlcigpLnNpZ25hbCkgdG8gYmUgW10gZm9yIGNvbXBhdCB3aXRoIHRoZSBuYXRpdmUgaW1wbFxuXG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzMiksICdhYm9ydGVkJywge1xuICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMyKSwgJ29uYWJvcnQnLCB7XG4gICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfdGhpczI7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEFib3J0U2lnbmFsLCBbe1xuICAgICAga2V5OiBcInRvU3RyaW5nXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiAnW29iamVjdCBBYm9ydFNpZ25hbF0nO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJkaXNwYXRjaEV2ZW50XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2Fib3J0Jykge1xuICAgICAgICAgIHRoaXMuYWJvcnRlZCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25hYm9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5vbmFib3J0LmNhbGwodGhpcywgZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9nZXQoX2dldFByb3RvdHlwZU9mKEFib3J0U2lnbmFsLnByb3RvdHlwZSksIFwiZGlzcGF0Y2hFdmVudFwiLCB0aGlzKS5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gQWJvcnRTaWduYWw7XG4gIH0oRW1pdHRlcik7XG4gIHZhciBBYm9ydENvbnRyb2xsZXIgPVxuICAvKiNfX1BVUkVfXyovXG4gIGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBYm9ydENvbnRyb2xsZXIoKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQWJvcnRDb250cm9sbGVyKTtcblxuICAgICAgLy8gQ29tcGFyZWQgdG8gYXNzaWdubWVudCwgT2JqZWN0LmRlZmluZVByb3BlcnR5IG1ha2VzIHByb3BlcnRpZXMgbm9uLWVudW1lcmFibGUgYnkgZGVmYXVsdCBhbmRcbiAgICAgIC8vIHdlIHdhbnQgT2JqZWN0LmtleXMobmV3IEFib3J0Q29udHJvbGxlcigpKSB0byBiZSBbXSBmb3IgY29tcGF0IHdpdGggdGhlIG5hdGl2ZSBpbXBsXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3NpZ25hbCcsIHtcbiAgICAgICAgdmFsdWU6IG5ldyBBYm9ydFNpZ25hbCgpLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoQWJvcnRDb250cm9sbGVyLCBbe1xuICAgICAga2V5OiBcImFib3J0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWJvcnQoKSB7XG4gICAgICAgIHZhciBldmVudDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGV2ZW50ID0gbmV3IEV2ZW50KCdhYm9ydCcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmICghZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcbiAgICAgICAgICAgICAgLy8gRm9yIEludGVybmV0IEV4cGxvcmVyIDg6XG4gICAgICAgICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICAgICAgICAgICAgZXZlbnQudHlwZSA9ICdhYm9ydCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBGb3IgSW50ZXJuZXQgRXhwbG9yZXIgMTE6XG4gICAgICAgICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgIGV2ZW50LmluaXRFdmVudCgnYWJvcnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGYWxsYmFjayB3aGVyZSBkb2N1bWVudCBpc24ndCBhdmFpbGFibGU6XG4gICAgICAgICAgICBldmVudCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2Fib3J0JyxcbiAgICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgICAgICAgIGNhbmNlbGFibGU6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2lnbmFsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJ0b1N0cmluZ1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gJ1tvYmplY3QgQWJvcnRDb250cm9sbGVyXSc7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEFib3J0Q29udHJvbGxlcjtcbiAgfSgpO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiAgICAvLyBUaGVzZSBhcmUgbmVjZXNzYXJ5IHRvIG1ha2Ugc3VyZSB0aGF0IHdlIGdldCBjb3JyZWN0IG91dHB1dCBmb3I6XG4gICAgLy8gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG5ldyBBYm9ydENvbnRyb2xsZXIoKSlcbiAgICBBYm9ydENvbnRyb2xsZXIucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnQWJvcnRDb250cm9sbGVyJztcbiAgICBBYm9ydFNpZ25hbC5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdBYm9ydFNpZ25hbCc7XG4gIH1cblxuICBmdW5jdGlvbiBwb2x5ZmlsbE5lZWRlZChzZWxmKSB7XG4gICAgaWYgKHNlbGYuX19GT1JDRV9JTlNUQUxMX0FCT1JUQ09OVFJPTExFUl9QT0xZRklMTCkge1xuICAgICAgY29uc29sZS5sb2coJ19fRk9SQ0VfSU5TVEFMTF9BQk9SVENPTlRST0xMRVJfUE9MWUZJTEw9dHJ1ZSBpcyBzZXQsIHdpbGwgZm9yY2UgaW5zdGFsbCBwb2x5ZmlsbCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSAvLyBOb3RlIHRoYXQgdGhlIFwidW5mZXRjaFwiIG1pbmltYWwgZmV0Y2ggcG9seWZpbGwgZGVmaW5lcyBmZXRjaCgpIHdpdGhvdXRcbiAgICAvLyBkZWZpbmluZyB3aW5kb3cuUmVxdWVzdCwgYW5kIHRoaXMgcG9seWZpbGwgbmVlZCB0byB3b3JrIG9uIHRvcCBvZiB1bmZldGNoXG4gICAgLy8gc28gdGhlIGJlbG93IGZlYXR1cmUgZGV0ZWN0aW9uIG5lZWRzIHRoZSAhc2VsZi5BYm9ydENvbnRyb2xsZXIgcGFydC5cbiAgICAvLyBUaGUgUmVxdWVzdC5wcm90b3R5cGUgY2hlY2sgaXMgYWxzbyBuZWVkZWQgYmVjYXVzZSBTYWZhcmkgdmVyc2lvbnMgMTEuMS4yXG4gICAgLy8gdXAgdG8gYW5kIGluY2x1ZGluZyAxMi4xLnggaGFzIGEgd2luZG93LkFib3J0Q29udHJvbGxlciBwcmVzZW50IGJ1dCBzdGlsbFxuICAgIC8vIGRvZXMgTk9UIGNvcnJlY3RseSBpbXBsZW1lbnQgYWJvcnRhYmxlIGZldGNoOlxuICAgIC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNzQ5ODAjYzJcblxuXG4gICAgcmV0dXJuIHR5cGVvZiBzZWxmLlJlcXVlc3QgPT09ICdmdW5jdGlvbicgJiYgIXNlbGYuUmVxdWVzdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoJ3NpZ25hbCcpIHx8ICFzZWxmLkFib3J0Q29udHJvbGxlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RlOiB0aGUgXCJmZXRjaC5SZXF1ZXN0XCIgZGVmYXVsdCB2YWx1ZSBpcyBhdmFpbGFibGUgZm9yIGZldGNoIGltcG9ydGVkIGZyb21cbiAgICogdGhlIFwibm9kZS1mZXRjaFwiIHBhY2thZ2UgYW5kIG5vdCBpbiBicm93c2Vycy4gVGhpcyBpcyBPSyBzaW5jZSBicm93c2Vyc1xuICAgKiB3aWxsIGJlIGltcG9ydGluZyB1bWQtcG9seWZpbGwuanMgZnJvbSB0aGF0IHBhdGggXCJzZWxmXCIgaXMgcGFzc2VkIHRoZVxuICAgKiBkZWNvcmF0b3Igc28gdGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBub3QgYmUgdXNlZCAoYmVjYXVzZSBicm93c2VycyB0aGF0IGRlZmluZVxuICAgKiBmZXRjaCBhbHNvIGhhcyBSZXF1ZXN0KS4gT25lIHF1aXJreSBzZXR1cCB3aGVyZSBzZWxmLmZldGNoIGV4aXN0cyBidXRcbiAgICogc2VsZi5SZXF1ZXN0IGRvZXMgbm90IGlzIHdoZW4gdGhlIFwidW5mZXRjaFwiIG1pbmltYWwgZmV0Y2ggcG9seWZpbGwgaXMgdXNlZFxuICAgKiBvbiB0b3Agb2YgSUUxMTsgZm9yIHRoaXMgY2FzZSB0aGUgYnJvd3NlciB3aWxsIHRyeSB0byB1c2UgdGhlIGZldGNoLlJlcXVlc3RcbiAgICogZGVmYXVsdCB2YWx1ZSB3aGljaCBpbiB0dXJuIHdpbGwgYmUgdW5kZWZpbmVkIGJ1dCB0aGVuIHRoZW4gXCJpZiAoUmVxdWVzdClcIlxuICAgKiB3aWxsIGVuc3VyZSB0aGF0IHlvdSBnZXQgYSBwYXRjaGVkIGZldGNoIGJ1dCBzdGlsbCBubyBSZXF1ZXN0IChhcyBleHBlY3RlZCkuXG4gICAqIEBwYXJhbSB7ZmV0Y2gsIFJlcXVlc3QgPSBmZXRjaC5SZXF1ZXN0fVxuICAgKiBAcmV0dXJucyB7ZmV0Y2g6IGFib3J0YWJsZUZldGNoLCBSZXF1ZXN0OiBBYm9ydGFibGVSZXF1ZXN0fVxuICAgKi9cblxuICBmdW5jdGlvbiBhYm9ydGFibGVGZXRjaERlY29yYXRvcihwYXRjaFRhcmdldHMpIHtcbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHBhdGNoVGFyZ2V0cykge1xuICAgICAgcGF0Y2hUYXJnZXRzID0ge1xuICAgICAgICBmZXRjaDogcGF0Y2hUYXJnZXRzXG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBfcGF0Y2hUYXJnZXRzID0gcGF0Y2hUYXJnZXRzLFxuICAgICAgICBmZXRjaCA9IF9wYXRjaFRhcmdldHMuZmV0Y2gsXG4gICAgICAgIF9wYXRjaFRhcmdldHMkUmVxdWVzdCA9IF9wYXRjaFRhcmdldHMuUmVxdWVzdCxcbiAgICAgICAgTmF0aXZlUmVxdWVzdCA9IF9wYXRjaFRhcmdldHMkUmVxdWVzdCA9PT0gdm9pZCAwID8gZmV0Y2guUmVxdWVzdCA6IF9wYXRjaFRhcmdldHMkUmVxdWVzdCxcbiAgICAgICAgTmF0aXZlQWJvcnRDb250cm9sbGVyID0gX3BhdGNoVGFyZ2V0cy5BYm9ydENvbnRyb2xsZXIsXG4gICAgICAgIF9wYXRjaFRhcmdldHMkX19GT1JDRSA9IF9wYXRjaFRhcmdldHMuX19GT1JDRV9JTlNUQUxMX0FCT1JUQ09OVFJPTExFUl9QT0xZRklMTCxcbiAgICAgICAgX19GT1JDRV9JTlNUQUxMX0FCT1JUQ09OVFJPTExFUl9QT0xZRklMTCA9IF9wYXRjaFRhcmdldHMkX19GT1JDRSA9PT0gdm9pZCAwID8gZmFsc2UgOiBfcGF0Y2hUYXJnZXRzJF9fRk9SQ0U7XG5cbiAgICBpZiAoIXBvbHlmaWxsTmVlZGVkKHtcbiAgICAgIGZldGNoOiBmZXRjaCxcbiAgICAgIFJlcXVlc3Q6IE5hdGl2ZVJlcXVlc3QsXG4gICAgICBBYm9ydENvbnRyb2xsZXI6IE5hdGl2ZUFib3J0Q29udHJvbGxlcixcbiAgICAgIF9fRk9SQ0VfSU5TVEFMTF9BQk9SVENPTlRST0xMRVJfUE9MWUZJTEw6IF9fRk9SQ0VfSU5TVEFMTF9BQk9SVENPTlRST0xMRVJfUE9MWUZJTExcbiAgICB9KSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZmV0Y2g6IGZldGNoLFxuICAgICAgICBSZXF1ZXN0OiBSZXF1ZXN0XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBSZXF1ZXN0ID0gTmF0aXZlUmVxdWVzdDsgLy8gTm90ZSB0aGF0IHRoZSBcInVuZmV0Y2hcIiBtaW5pbWFsIGZldGNoIHBvbHlmaWxsIGRlZmluZXMgZmV0Y2goKSB3aXRob3V0XG4gICAgLy8gZGVmaW5pbmcgd2luZG93LlJlcXVlc3QsIGFuZCB0aGlzIHBvbHlmaWxsIG5lZWQgdG8gd29yayBvbiB0b3Agb2YgdW5mZXRjaFxuICAgIC8vIGhlbmNlIHdlIG9ubHkgcGF0Y2ggaXQgaWYgaXQncyBhdmFpbGFibGUuIEFsc28gd2UgZG9uJ3QgcGF0Y2ggaXQgaWYgc2lnbmFsXG4gICAgLy8gaXMgYWxyZWFkeSBhdmFpbGFibGUgb24gdGhlIFJlcXVlc3QgcHJvdG90eXBlIGJlY2F1c2UgaW4gdGhpcyBjYXNlIHN1cHBvcnRcbiAgICAvLyBpcyBwcmVzZW50IGFuZCB0aGUgcGF0Y2hpbmcgYmVsb3cgY2FuIGNhdXNlIGEgY3Jhc2ggc2luY2UgaXQgYXNzaWducyB0b1xuICAgIC8vIHJlcXVlc3Quc2lnbmFsIHdoaWNoIGlzIHRlY2huaWNhbGx5IGEgcmVhZC1vbmx5IHByb3BlcnR5LiBUaGlzIGxhdHRlciBlcnJvclxuICAgIC8vIGhhcHBlbnMgd2hlbiB5b3UgcnVuIHRoZSBtYWluNS5qcyBub2RlLWZldGNoIGV4YW1wbGUgaW4gdGhlIHJlcG9cbiAgICAvLyBcImFib3J0Y29udHJvbGxlci1wb2x5ZmlsbC1leGFtcGxlc1wiLiBUaGUgZXhhY3QgZXJyb3IgaXM6XG4gICAgLy8gICByZXF1ZXN0LnNpZ25hbCA9IGluaXQuc2lnbmFsO1xuICAgIC8vICAgXlxuICAgIC8vIFR5cGVFcnJvcjogQ2Fubm90IHNldCBwcm9wZXJ0eSBzaWduYWwgb2YgIzxSZXF1ZXN0PiB3aGljaCBoYXMgb25seSBhIGdldHRlclxuXG4gICAgaWYgKFJlcXVlc3QgJiYgIVJlcXVlc3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdzaWduYWwnKSB8fCBfX0ZPUkNFX0lOU1RBTExfQUJPUlRDT05UUk9MTEVSX1BPTFlGSUxMKSB7XG4gICAgICBSZXF1ZXN0ID0gZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgaW5pdCkge1xuICAgICAgICB2YXIgc2lnbmFsO1xuXG4gICAgICAgIGlmIChpbml0ICYmIGluaXQuc2lnbmFsKSB7XG4gICAgICAgICAgc2lnbmFsID0gaW5pdC5zaWduYWw7IC8vIE5ldmVyIHBhc3MgaW5pdC5zaWduYWwgdG8gdGhlIG5hdGl2ZSBSZXF1ZXN0IGltcGxlbWVudGF0aW9uIHdoZW4gdGhlIHBvbHlmaWxsIGhhc1xuICAgICAgICAgIC8vIGJlZW4gaW5zdGFsbGVkIGJlY2F1c2UgaWYgd2UncmUgcnVubmluZyBvbiB0b3Agb2YgYSBicm93c2VyIHdpdGggYVxuICAgICAgICAgIC8vIHdvcmtpbmcgbmF0aXZlIEFib3J0Q29udHJvbGxlciAoaS5lLiB0aGUgcG9seWZpbGwgd2FzIGluc3RhbGxlZCBkdWUgdG9cbiAgICAgICAgICAvLyBfX0ZPUkNFX0lOU1RBTExfQUJPUlRDT05UUk9MTEVSX1BPTFlGSUxMIGJlaW5nIHNldCksIHRoZW4gcGFzc2luZyBvdXJcbiAgICAgICAgICAvLyBmYWtlIEFib3J0U2lnbmFsIHRvIHRoZSBuYXRpdmUgZmV0Y2ggd2lsbCB0cmlnZ2VyOlxuICAgICAgICAgIC8vIFR5cGVFcnJvcjogRmFpbGVkIHRvIGNvbnN0cnVjdCAnUmVxdWVzdCc6IG1lbWJlciBzaWduYWwgaXMgbm90IG9mIHR5cGUgQWJvcnRTaWduYWwuXG5cbiAgICAgICAgICBkZWxldGUgaW5pdC5zaWduYWw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBOYXRpdmVSZXF1ZXN0KGlucHV0LCBpbml0KTtcblxuICAgICAgICBpZiAoc2lnbmFsKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVlc3QsICdzaWduYWwnLCB7XG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiBzaWduYWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXF1ZXN0O1xuICAgICAgfTtcblxuICAgICAgUmVxdWVzdC5wcm90b3R5cGUgPSBOYXRpdmVSZXF1ZXN0LnByb3RvdHlwZTtcbiAgICB9XG5cbiAgICB2YXIgcmVhbEZldGNoID0gZmV0Y2g7XG5cbiAgICB2YXIgYWJvcnRhYmxlRmV0Y2ggPSBmdW5jdGlvbiBhYm9ydGFibGVGZXRjaChpbnB1dCwgaW5pdCkge1xuICAgICAgdmFyIHNpZ25hbCA9IFJlcXVlc3QgJiYgUmVxdWVzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihpbnB1dCkgPyBpbnB1dC5zaWduYWwgOiBpbml0ID8gaW5pdC5zaWduYWwgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChzaWduYWwpIHtcbiAgICAgICAgdmFyIGFib3J0RXJyb3I7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhYm9ydEVycm9yID0gbmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIC8vIElFIDExIGRvZXMgbm90IHN1cHBvcnQgY2FsbGluZyB0aGUgRE9NRXhjZXB0aW9uIGNvbnN0cnVjdG9yLCB1c2UgYVxuICAgICAgICAgIC8vIHJlZ3VsYXIgZXJyb3Igb2JqZWN0IG9uIGl0IGluc3RlYWQuXG4gICAgICAgICAgYWJvcnRFcnJvciA9IG5ldyBFcnJvcignQWJvcnRlZCcpO1xuICAgICAgICAgIGFib3J0RXJyb3IubmFtZSA9ICdBYm9ydEVycm9yJztcbiAgICAgICAgfSAvLyBSZXR1cm4gZWFybHkgaWYgYWxyZWFkeSBhYm9ydGVkLCB0aHVzIGF2b2lkaW5nIG1ha2luZyBhbiBIVFRQIHJlcXVlc3RcblxuXG4gICAgICAgIGlmIChzaWduYWwuYWJvcnRlZCkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcbiAgICAgICAgfSAvLyBUdXJuIGFuIGV2ZW50IGludG8gYSBwcm9taXNlLCByZWplY3QgaXQgb25jZSBgYWJvcnRgIGlzIGRpc3BhdGNoZWRcblxuXG4gICAgICAgIHZhciBjYW5jZWxsYXRpb24gPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAoXywgcmVqZWN0KSB7XG4gICAgICAgICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChhYm9ydEVycm9yKTtcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBvbmNlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChpbml0ICYmIGluaXQuc2lnbmFsKSB7XG4gICAgICAgICAgLy8gTmV2ZXIgcGFzcyAuc2lnbmFsIHRvIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24gd2hlbiB0aGUgcG9seWZpbGwgaGFzXG4gICAgICAgICAgLy8gYmVlbiBpbnN0YWxsZWQgYmVjYXVzZSBpZiB3ZSdyZSBydW5uaW5nIG9uIHRvcCBvZiBhIGJyb3dzZXIgd2l0aCBhXG4gICAgICAgICAgLy8gd29ya2luZyBuYXRpdmUgQWJvcnRDb250cm9sbGVyIChpLmUuIHRoZSBwb2x5ZmlsbCB3YXMgaW5zdGFsbGVkIGR1ZSB0b1xuICAgICAgICAgIC8vIF9fRk9SQ0VfSU5TVEFMTF9BQk9SVENPTlRST0xMRVJfUE9MWUZJTEwgYmVpbmcgc2V0KSwgdGhlbiBwYXNzaW5nIG91clxuICAgICAgICAgIC8vIGZha2UgQWJvcnRTaWduYWwgdG8gdGhlIG5hdGl2ZSBmZXRjaCB3aWxsIHRyaWdnZXI6XG4gICAgICAgICAgLy8gVHlwZUVycm9yOiBGYWlsZWQgdG8gZXhlY3V0ZSAnZmV0Y2gnIG9uICdXaW5kb3cnOiBtZW1iZXIgc2lnbmFsIGlzIG5vdCBvZiB0eXBlIEFib3J0U2lnbmFsLlxuICAgICAgICAgIGRlbGV0ZSBpbml0LnNpZ25hbDtcbiAgICAgICAgfSAvLyBSZXR1cm4gdGhlIGZhc3Rlc3QgcHJvbWlzZSAoZG9uJ3QgbmVlZCB0byB3YWl0IGZvciByZXF1ZXN0IHRvIGZpbmlzaClcblxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJhY2UoW2NhbmNlbGxhdGlvbiwgcmVhbEZldGNoKGlucHV0LCBpbml0KV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhbEZldGNoKGlucHV0LCBpbml0KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZldGNoOiBhYm9ydGFibGVGZXRjaCxcbiAgICAgIFJlcXVlc3Q6IFJlcXVlc3RcbiAgICB9O1xuICB9XG5cbiAgKGZ1bmN0aW9uIChzZWxmKSB7XG5cbiAgICBpZiAoIXBvbHlmaWxsTmVlZGVkKHNlbGYpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFzZWxmLmZldGNoKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ2ZldGNoKCkgaXMgbm90IGF2YWlsYWJsZSwgY2Fubm90IGluc3RhbGwgYWJvcnRjb250cm9sbGVyLXBvbHlmaWxsJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIF9hYm9ydGFibGVGZXRjaCA9IGFib3J0YWJsZUZldGNoRGVjb3JhdG9yKHNlbGYpLFxuICAgICAgICBmZXRjaCA9IF9hYm9ydGFibGVGZXRjaC5mZXRjaCxcbiAgICAgICAgUmVxdWVzdCA9IF9hYm9ydGFibGVGZXRjaC5SZXF1ZXN0O1xuXG4gICAgc2VsZi5mZXRjaCA9IGZldGNoO1xuICAgIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3Q7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYsICdBYm9ydENvbnRyb2xsZXInLCB7XG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IEFib3J0Q29udHJvbGxlclxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCAnQWJvcnRTaWduYWwnLCB7XG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IEFib3J0U2lnbmFsXG4gICAgfSk7XG4gIH0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiBnbG9iYWwpO1xufSk7XG5cbmZ1bmN0aW9uIHVud3JhcEV4cG9ydHMgKHgpIHtcblx0cmV0dXJuIHggJiYgeC5fX2VzTW9kdWxlICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnZGVmYXVsdCcpID8geFsnZGVmYXVsdCddIDogeDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tbW9uanNNb2R1bGUoZm4sIG1vZHVsZSkge1xuXHRyZXR1cm4gbW9kdWxlID0geyBleHBvcnRzOiB7fSB9LCBmbihtb2R1bGUsIG1vZHVsZS5leHBvcnRzKSwgbW9kdWxlLmV4cG9ydHM7XG59XG5cbnZhciBydW50aW1lXzEgPSBjcmVhdGVDb21tb25qc01vZHVsZShmdW5jdGlvbiAobW9kdWxlKSB7XG4gIC8qKlxuICAgKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAgICpcbiAgICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gICAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAgICovXG5cbiAgdmFyIHJ1bnRpbWUgPSBmdW5jdGlvbiAoZXhwb3J0cykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gICAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gICAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICAgIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gICAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICAgIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgICB9XG4gICAgZXhwb3J0cy53cmFwID0gd3JhcDtcblxuICAgIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAgIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAgIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAgIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gICAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAgIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gICAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gICAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAgIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gICAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gICAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gICAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAgIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gICAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gICAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gICAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICAgIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gICAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICAgIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAgIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICAgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gICAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICAgIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJiBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiYgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gICAgfVxuXG4gICAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID0gR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICAgIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAgIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gICAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24gKGdlbkZ1bikge1xuICAgICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgICAgcmV0dXJuIGN0b3IgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiIDogZmFsc2U7XG4gICAgfTtcblxuICAgIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uIChnZW5GdW4pIHtcbiAgICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgICAgcmV0dXJuIGdlbkZ1bjtcbiAgICB9O1xuXG4gICAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gICAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gICAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24gKGFyZykge1xuICAgICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yLCBQcm9taXNlSW1wbCkge1xuICAgICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICBpZiAodmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKHZhbHVlKSkgPT09IFwib2JqZWN0XCIgJiYgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24gKHVud3JhcHBlZCkge1xuICAgICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAvLyBJZiBhIHJlamVjdGVkIFByb21pc2Ugd2FzIHlpZWxkZWQsIHRocm93IHRoZSByZWplY3Rpb24gYmFja1xuICAgICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlSW1wbChmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gICAgfVxuXG4gICAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAgIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24gKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcih3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSwgUHJvbWlzZUltcGwpO1xuXG4gICAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lID8gR2VuU3RhdGVDb21wbGV0ZWQgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAgIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgICAgaWYgKCFpbmZvKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gICAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICAgIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAgIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gICAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgICB0aGlzLnJlc2V0KHRydWUpO1xuICAgIH1cblxuICAgIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICAgIHZhciBrZXlzID0gW107XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgfVxuICAgICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICAgIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICAgIH1cbiAgICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICAgIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gICAgfVxuXG4gICAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KHNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiYgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiYgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgc3RvcDogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgICB9LFxuXG4gICAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24gZGlzcGF0Y2hFeGNlcHRpb24oZXhjZXB0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuICEhY2F1Z2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGFicnVwdDogZnVuY3Rpb24gYWJydXB0KHR5cGUsIGFyZykge1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiYgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJiAodHlwZSA9PT0gXCJicmVha1wiIHx8IHR5cGUgPT09IFwiY29udGludWVcIikgJiYgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiYgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgICB9LFxuXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fCByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9LFxuXG4gICAgICBmaW5pc2g6IGZ1bmN0aW9uIGZpbmlzaChmaW5hbGx5TG9jKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24gX2NhdGNoKHRyeUxvYykge1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICAgIH0sXG5cbiAgICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uIGRlbGVnYXRlWWllbGQoaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAgIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAgIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAgIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gICAgcmV0dXJuIGV4cG9ydHM7XG4gIH0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgbW9kdWxlLmV4cG9ydHMpO1xuXG4gIHRyeSB7XG4gICAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbiAgfSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAgIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAgIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAgIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAgIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAgIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gICAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xuICB9XG59KTtcblxudmFyIGRpc3QgPSBjcmVhdGVDb21tb25qc01vZHVsZShmdW5jdGlvbiAobW9kdWxlLCBleHBvcnRzKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4gICAgZnVuY3Rpb24gc29ydEJ5KCkge1xuICAgICAgICB2YXIgcHJvcGVydGllcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgcHJvcGVydGllc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqMSwgb2JqMikge1xuICAgICAgICAgICAgdmFyIHByb3BzID0gcHJvcGVydGllcy5maWx0ZXIoZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIHByb3AgPT09ICdzdHJpbmcnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgbWFwID0gcHJvcGVydGllcy5maWx0ZXIoZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbic7XG4gICAgICAgICAgICB9KVswXTtcbiAgICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAwO1xuICAgICAgICAgICAgdmFyIG51bWJlck9mUHJvcGVydGllcyA9IHByb3BzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChyZXN1bHQgPT09IDAgJiYgaSA8IG51bWJlck9mUHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNvcnQocHJvcHNbaV0sIG1hcCkob2JqMSwgb2JqMik7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZXhwb3J0cy5zb3J0QnkgPSBzb3J0Qnk7XG4gICAgZnVuY3Rpb24gc29ydChwcm9wZXJ0eSwgbWFwKSB7XG4gICAgICAgIHZhciBzb3J0T3JkZXIgPSAxO1xuICAgICAgICBpZiAocHJvcGVydHlbMF0gPT09ICctJykge1xuICAgICAgICAgICAgc29ydE9yZGVyID0gLTE7XG4gICAgICAgICAgICBwcm9wZXJ0eSA9IHByb3BlcnR5LnN1YnN0cigxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcGVydHlbcHJvcGVydHkubGVuZ3RoIC0gMV0gPT09ICdeJykge1xuICAgICAgICAgICAgcHJvcGVydHkgPSBwcm9wZXJ0eS5zdWJzdHIoMCwgcHJvcGVydHkubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICBtYXAgPSBmdW5jdGlvbiBtYXAoX2tleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlLnRvTG93ZXJDYXNlKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFwcGx5ID0gbWFwIHx8IGZ1bmN0aW9uIChfa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAwO1xuICAgICAgICAgICAgdmFyIG1hcHBlZEEgPSBhcHBseShwcm9wZXJ0eSwgb2JqZWN0UGF0aChhLCBwcm9wZXJ0eSkpO1xuICAgICAgICAgICAgdmFyIG1hcHBlZEIgPSBhcHBseShwcm9wZXJ0eSwgb2JqZWN0UGF0aChiLCBwcm9wZXJ0eSkpO1xuICAgICAgICAgICAgaWYgKG1hcHBlZEEgPCBtYXBwZWRCKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gLTE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hcHBlZEEgPiBtYXBwZWRCKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQgKiBzb3J0T3JkZXI7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9iamVjdFBhdGgob2JqZWN0LCBwYXRoKSB7XG4gICAgICAgIHZhciBwYXRoUGFydHMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgICAgIHZhciByZXN1bHQgPSBvYmplY3Q7XG4gICAgICAgIHBhdGhQYXJ0cy5mb3JFYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHRbcGFydF07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn0pO1xuXG51bndyYXBFeHBvcnRzKGRpc3QpO1xudmFyIGRpc3RfMSA9IGRpc3Quc29ydEJ5O1xuXG52YXIgRnVzZSA9IHJlcXVpcmUoJ2Z1c2UuanMnKTtcblxuZnVuY3Rpb24gcXVlcnlKc29uKHF1ZXJ5LCBkYXRhLCBzZWFyY2hGaWVsZHMpIHtcbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgc2hvdWxkU29ydDogdHJ1ZSxcbiAgICB0aHJlc2hvbGQ6IDAuMixcbiAgICBsb2NhdGlvbjogMCxcbiAgICBkaXN0YW5jZTogMTAwMCxcbiAgICBrZXlzOiBbc2VhcmNoRmllbGRzXVxuICB9O1xuICB2YXIgZnVzZSA9IG5ldyBGdXNlKGRhdGEsIG9wdGlvbnMpO1xuICB2YXIgcmVzdWx0ID0gZnVzZS5zZWFyY2gocXVlcnkpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzYW5pdGlzZVR5cGVhaGVhZFRleHQoc3RyaW5nKSB7XG4gIHZhciBzYW5pdGlzZWRRdWVyeVJlbW92ZUNoYXJzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBbXTtcbiAgdmFyIHRyaW1FbmQgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHRydWU7XG5cbiAgdmFyIHNhbml0aXNlZFN0cmluZyA9IHN0cmluZy50b0xvd2VyQ2FzZSgpO1xuXG4gIHNhbml0aXNlZFF1ZXJ5UmVtb3ZlQ2hhcnMuZm9yRWFjaChmdW5jdGlvbiAoY2hhcikge1xuICAgIHNhbml0aXNlZFN0cmluZyA9IHNhbml0aXNlZFN0cmluZy5yZXBsYWNlKG5ldyBSZWdFeHAoY2hhci50b0xvd2VyQ2FzZSgpLCAnZycpLCAnJyk7XG4gIH0pO1xuXG4gIHNhbml0aXNlZFN0cmluZyA9IHNhbml0aXNlZFN0cmluZy5yZXBsYWNlKC9cXHNcXHMrL2csICcgJyk7XG5cbiAgc2FuaXRpc2VkU3RyaW5nID0gdHJpbUVuZCA/IHNhbml0aXNlZFN0cmluZy50cmltKCkgOiBzYW5pdGlzZWRTdHJpbmcudHJpbVN0YXJ0KCk7XG5cbiAgcmV0dXJuIHNhbml0aXNlZFN0cmluZztcbn1cblxudmFyIEFib3JhdGFibGVGZXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQWJvcmF0YWJsZUZldGNoKHVybCwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBBYm9yYXRhYmxlRmV0Y2gpO1xuXG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IHdpbmRvdy5BYm9ydENvbnRyb2xsZXIoKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgb3B0aW9ucywgeyBzaWduYWw6IHRoaXMuY29udHJvbGxlci5zaWduYWwgfSk7XG5cbiAgICBmZXRjaCh1cmwsIG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgX3RoaXMudGhlbkNhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLmNhdGNoQ2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoQWJvcmF0YWJsZUZldGNoLCBbe1xuICAgIGtleTogXCJ0aGVuXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRoZW4oY2FsbGJhY2spIHtcbiAgICAgIHRoaXMudGhlbkNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2F0Y2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2NhdGNoKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmNhdGNoQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhYm9ydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhYm9ydCgpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlci5hYm9ydCgpO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gQWJvcmF0YWJsZUZldGNoO1xufSgpO1xuXG52YXIgZmV0Y2gkMSA9IChmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgQWJvcmF0YWJsZUZldGNoKHVybCwgb3B0aW9ucyk7XG59KTtcblxudmFyIGJhc2VDbGFzcyA9ICdqcy10eXBlYWhlYWQnO1xuXG52YXIgY2xhc3NUeXBlYWhlYWRPcHRpb24gPSAndHlwZWFoZWFkLWlucHV0X19vcHRpb24nO1xudmFyIGNsYXNzVHlwZWFoZWFkT3B0aW9uRm9jdXNlZCA9IGNsYXNzVHlwZWFoZWFkT3B0aW9uICsgJy0tZm9jdXNlZCc7XG52YXIgY2xhc3NUeXBlYWhlYWRPcHRpb25Ob1Jlc3VsdHMgPSBjbGFzc1R5cGVhaGVhZE9wdGlvbiArICctLW5vLXJlc3VsdHMgdS1mcy1zJztcbnZhciBjbGFzc1R5cGVhaGVhZE9wdGlvbk1vcmVSZXN1bHRzID0gY2xhc3NUeXBlYWhlYWRPcHRpb24gKyAnLS1tb3JlLXJlc3VsdHMgdS1mcy1zJztcbnZhciBjbGFzc1R5cGVhaGVhZEhhc1Jlc3VsdHMgPSAndHlwZWFoZWFkLWlucHV0LS1oYXMtcmVzdWx0cyc7XG5cbnZhciBUeXBlYWhlYWRVSSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gVHlwZWFoZWFkVUkoX3JlZikge1xuICAgIHZhciBjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuICAgICAgICB0eXBlYWhlYWREYXRhID0gX3JlZi50eXBlYWhlYWREYXRhLFxuICAgICAgICBzYW5pdGlzZWRRdWVyeVJlcGxhY2VDaGFycyA9IF9yZWYuc2FuaXRpc2VkUXVlcnlSZXBsYWNlQ2hhcnMsXG4gICAgICAgIG1pbkNoYXJzID0gX3JlZi5taW5DaGFycyxcbiAgICAgICAgcmVzdWx0TGltaXQgPSBfcmVmLnJlc3VsdExpbWl0LFxuICAgICAgICBzdWdnZXN0T25Cb290ID0gX3JlZi5zdWdnZXN0T25Cb290LFxuICAgICAgICBvblNlbGVjdCA9IF9yZWYub25TZWxlY3QsXG4gICAgICAgIG9uRXJyb3IgPSBfcmVmLm9uRXJyb3IsXG4gICAgICAgIG9uVW5zZXRSZXN1bHQgPSBfcmVmLm9uVW5zZXRSZXN1bHQsXG4gICAgICAgIHN1Z2dlc3Rpb25GdW5jdGlvbiA9IF9yZWYuc3VnZ2VzdGlvbkZ1bmN0aW9uLFxuICAgICAgICBsYW5nID0gX3JlZi5sYW5nLFxuICAgICAgICBhcmlhWW91SGF2ZVNlbGVjdGVkID0gX3JlZi5hcmlhWW91SGF2ZVNlbGVjdGVkLFxuICAgICAgICBhcmlhTWluQ2hhcnMgPSBfcmVmLmFyaWFNaW5DaGFycyxcbiAgICAgICAgYXJpYU9uZVJlc3VsdCA9IF9yZWYuYXJpYU9uZVJlc3VsdCxcbiAgICAgICAgYXJpYU5SZXN1bHRzID0gX3JlZi5hcmlhTlJlc3VsdHMsXG4gICAgICAgIGFyaWFMaW1pdGVkUmVzdWx0cyA9IF9yZWYuYXJpYUxpbWl0ZWRSZXN1bHRzLFxuICAgICAgICBtb3JlUmVzdWx0cyA9IF9yZWYubW9yZVJlc3VsdHMsXG4gICAgICAgIHJlc3VsdHNUaXRsZSA9IF9yZWYucmVzdWx0c1RpdGxlLFxuICAgICAgICBub1Jlc3VsdHMgPSBfcmVmLm5vUmVzdWx0cztcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBUeXBlYWhlYWRVSSk7XG5cbiAgICAvLyBET00gRWxlbWVudHNcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuaW5wdXQgPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoJy4nICsgYmFzZUNsYXNzICsgJy1pbnB1dCcpO1xuICAgIHRoaXMucmVzdWx0c0NvbnRhaW5lciA9IGNvbnRleHQucXVlcnlTZWxlY3RvcignLicgKyBiYXNlQ2xhc3MgKyAnLXJlc3VsdHMnKTtcbiAgICB0aGlzLmxpc3Rib3ggPSB0aGlzLnJlc3VsdHNDb250YWluZXIucXVlcnlTZWxlY3RvcignLicgKyBiYXNlQ2xhc3MgKyAnLWxpc3Rib3gnKTtcbiAgICB0aGlzLmluc3RydWN0aW9ucyA9IGNvbnRleHQucXVlcnlTZWxlY3RvcignLicgKyBiYXNlQ2xhc3MgKyAnLWluc3RydWN0aW9ucycpO1xuICAgIHRoaXMuYXJpYVN0YXR1cyA9IGNvbnRleHQucXVlcnlTZWxlY3RvcignLicgKyBiYXNlQ2xhc3MgKyAnLWFyaWEtc3RhdHVzJyk7XG5cbiAgICAvLyBTZXR0aW5nc1xuICAgIHRoaXMudHlwZWFoZWFkRGF0YSA9IHR5cGVhaGVhZERhdGEgfHwgY29udGV4dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZWFoZWFkLWRhdGEnKTtcblxuICAgIHRoaXMuYXJpYVlvdUhhdmVTZWxlY3RlZCA9IGFyaWFZb3VIYXZlU2VsZWN0ZWQgfHwgY29udGV4dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS15b3UtaGF2ZS1zZWxlY3RlZCcpO1xuICAgIHRoaXMuYXJpYU1pbkNoYXJzID0gYXJpYU1pbkNoYXJzIHx8IGNvbnRleHQuZ2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtbWluLWNoYXJzJyk7XG4gICAgdGhpcy5hcmlhT25lUmVzdWx0ID0gYXJpYU9uZVJlc3VsdCB8fCBjb250ZXh0LmdldEF0dHJpYnV0ZSgnZGF0YS1hcmlhLW9uZS1yZXN1bHQnKTtcbiAgICB0aGlzLmFyaWFOUmVzdWx0cyA9IGFyaWFOUmVzdWx0cyB8fCBjb250ZXh0LmdldEF0dHJpYnV0ZSgnZGF0YS1hcmlhLW4tcmVzdWx0cycpO1xuICAgIHRoaXMuYXJpYUxpbWl0ZWRSZXN1bHRzID0gYXJpYUxpbWl0ZWRSZXN1bHRzIHx8IGNvbnRleHQuZ2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtbGltaXRlZC1yZXN1bHRzJyk7XG4gICAgdGhpcy5tb3JlUmVzdWx0cyA9IG1vcmVSZXN1bHRzIHx8IGNvbnRleHQuZ2V0QXR0cmlidXRlKCdkYXRhLW1vcmUtcmVzdWx0cycpO1xuICAgIHRoaXMucmVzdWx0c1RpdGxlID0gcmVzdWx0c1RpdGxlIHx8IGNvbnRleHQuZ2V0QXR0cmlidXRlKCdkYXRhLXJlc3VsdHMtdGl0bGUnKTtcbiAgICB0aGlzLm5vUmVzdWx0cyA9IG5vUmVzdWx0cyB8fCBjb250ZXh0LmdldEF0dHJpYnV0ZSgnZGF0YS1uby1yZXN1bHRzJyk7XG5cbiAgICB0aGlzLmxpc3Rib3hJZCA9IHRoaXMubGlzdGJveC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgdGhpcy5taW5DaGFycyA9IG1pbkNoYXJzIHx8IDM7XG4gICAgdGhpcy5yZXN1bHRMaW1pdCA9IHJlc3VsdExpbWl0IHx8IDEwO1xuICAgIHRoaXMuc3VnZ2VzdE9uQm9vdCA9IHN1Z2dlc3RPbkJvb3Q7XG4gICAgdGhpcy5sYW5nID0gbGFuZyB8fCAnZW4tZ2InO1xuXG4gICAgLy8gQ2FsbGJhY2tzXG4gICAgdGhpcy5vblNlbGVjdCA9IG9uU2VsZWN0O1xuICAgIHRoaXMub25VbnNldFJlc3VsdCA9IG9uVW5zZXRSZXN1bHQ7XG4gICAgdGhpcy5vbkVycm9yID0gb25FcnJvcjtcblxuICAgIGlmIChzdWdnZXN0aW9uRnVuY3Rpb24pIHtcbiAgICAgIHRoaXMuZmV0Y2hTdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25GdW5jdGlvbjtcbiAgICB9XG5cbiAgICAvLyBTdGF0ZVxuICAgIHRoaXMuY3RybEtleSA9IGZhbHNlO1xuICAgIHRoaXMuZGVsZXRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnF1ZXJ5ID0gJyc7XG4gICAgdGhpcy5zYW5pdGlzZWRRdWVyeSA9ICcnO1xuICAgIHRoaXMucHJldmlvdXNRdWVyeSA9ICcnO1xuICAgIHRoaXMucmVzdWx0cyA9IFtdO1xuICAgIHRoaXMucmVzdWx0T3B0aW9ucyA9IFtdO1xuICAgIHRoaXMuZm91bmRSZXN1bHRzID0gMDtcbiAgICB0aGlzLm51bWJlck9mUmVzdWx0cyA9IDA7XG4gICAgdGhpcy5oaWdobGlnaHRlZFJlc3VsdEluZGV4ID0gMDtcbiAgICB0aGlzLnNldHRpbmdSZXN1bHQgPSBmYWxzZTtcbiAgICB0aGlzLnJlc3VsdFNlbGVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5ibHVycmluZyA9IGZhbHNlO1xuICAgIHRoaXMuYmx1clRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuc2FuaXRpc2VkUXVlcnlSZXBsYWNlQ2hhcnMgPSBzYW5pdGlzZWRRdWVyeVJlcGxhY2VDaGFycyB8fCBbXTtcblxuICAgIC8vIFRlbXBvcmFyeSBmaXggYXMgcnVubmVyIGRvZXNuJ3QgdXNlIGZ1bGwgbGFuZyBjb2RlXG4gICAgaWYgKHRoaXMubGFuZyA9PT0gJ2VuJykge1xuICAgICAgdGhpcy5sYW5nID0gJ2VuLWdiJztcbiAgICB9XG4gICAgdGhpcy5mZXRjaERhdGEoKTtcbiAgICB0aGlzLmluaXRpYWxpc2VVSSgpO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoVHlwZWFoZWFkVUksIFt7XG4gICAga2V5OiAnaW5pdGlhbGlzZVVJJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdGlhbGlzZVVJKCkge1xuICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtYXV0b2NvbXBsZXRlJywgJ2xpc3QnKTtcbiAgICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgdGhpcy5saXN0Ym94LmdldEF0dHJpYnV0ZSgnaWQnKSk7XG4gICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIHRoaXMuaW5zdHJ1Y3Rpb25zLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG4gICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1oYXMtcG9wdXAnLCB0cnVlKTtcbiAgICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLW93bnMnLCB0aGlzLmxpc3Rib3guZ2V0QXR0cmlidXRlKCdpZCcpKTtcbiAgICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnY29tYm9ib3gnKTtcblxuICAgICAgdGhpcy5jb250ZXh0LmNsYXNzTGlzdC5hZGQoJ3R5cGVhaGVhZC1pbnB1dC0taW5pdGlhbGlzZWQnKTtcblxuICAgICAgdGhpcy5iaW5kRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdmZXRjaERhdGEnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmZXRjaERhdGEoKSB7XG4gICAgICB2YXIgbG9hZEpTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfcmVmMiA9IGFzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvclJ1bnRpbWUubWFyayhmdW5jdGlvbiBfY2FsbGVlKGpzb25QYXRoKSB7XG4gICAgICAgICAgdmFyIGpzb25SZXNwb25zZSwganNvbkRhdGE7XG4gICAgICAgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIF9jYWxsZWUkKF9jb250ZXh0KSB7XG4gICAgICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0LnByZXYgPSBfY29udGV4dC5uZXh0KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgX2NvbnRleHQucHJldiA9IDA7XG4gICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMztcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmZXRjaCQxKGpzb25QYXRoKTtcblxuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgIGpzb25SZXNwb25zZSA9IF9jb250ZXh0LnNlbnQ7XG5cbiAgICAgICAgICAgICAgICAgIGlmICghKGpzb25SZXNwb25zZS5zdGF0dXMgPT09IDUwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDY7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGZldGNoaW5nIGpzb24gZGF0YTogJyArIGpzb25SZXNwb25zZS5zdGF0dXMpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDg7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ganNvblJlc3BvbnNlLmpzb24oKTtcblxuICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgIGpzb25EYXRhID0gX2NvbnRleHQuc2VudDtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dC5hYnJ1cHQoJ3JldHVybicsIGpzb25EYXRhKTtcblxuICAgICAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICAgICBfY29udGV4dC5wcmV2ID0gMTI7XG4gICAgICAgICAgICAgICAgICBfY29udGV4dC50MCA9IF9jb250ZXh0WydjYXRjaCddKDApO1xuXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhfY29udGV4dC50MCk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDE1OlxuICAgICAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQuc3RvcCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgX2NhbGxlZSwgdGhpcywgW1swLCAxMl1dKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBsb2FkSlNPTihfeCkge1xuICAgICAgICAgIHJldHVybiBfcmVmMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfSgpO1xuXG4gICAgICAvLyBDYWxsIGxvYWRpbmcgb2YganNvbiBmaWxlXG5cblxuICAgICAgdGhpcy5kYXRhID0gbG9hZEpTT04odGhpcy50eXBlYWhlYWREYXRhKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdiaW5kRXZlbnRMaXN0ZW5lcnMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBiaW5kRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24uYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXl1cC5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLmhhbmRsZUZvY3VzLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5oYW5kbGVCbHVyLmJpbmQodGhpcykpO1xuXG4gICAgICB0aGlzLmxpc3Rib3guYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5oYW5kbGVNb3VzZW92ZXIuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmxpc3Rib3guYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLmhhbmRsZU1vdXNlb3V0LmJpbmQodGhpcykpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2hhbmRsZUtleWRvd24nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVLZXlkb3duKGV2ZW50KSB7XG4gICAgICB0aGlzLmN0cmxLZXkgPSAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSAmJiBldmVudC5rZXkgIT09ICd2JztcblxuICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGVSZXN1bHRzKC0xKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVJlc3VsdHMoMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIGNhc2UgJ0VudGVyJzpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2hhbmRsZUtleXVwJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlS2V5dXAoZXZlbnQpIHtcbiAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIGNhc2UgJ0VudGVyJzpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRlZFJlc3VsdEluZGV4ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhpcy5jbGVhckxpc3Rib3goKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0UmVzdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3RybEtleSA9IGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2hhbmRsZUNoYW5nZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZUNoYW5nZSgpIHtcbiAgICAgIGlmICghdGhpcy5ibHVycmluZyAmJiB0aGlzLmlucHV0LnZhbHVlLnRyaW0oKSkge1xuICAgICAgICB0aGlzLmdldFN1Z2dlc3Rpb25zKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFib3J0RmV0Y2goKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoYW5kbGVGb2N1cycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZUZvY3VzKCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuYmx1clRpbWVvdXQpO1xuICAgICAgdGhpcy5nZXRTdWdnZXN0aW9ucyh0cnVlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoYW5kbGVCbHVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlQmx1cigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmJsdXJUaW1lb3V0KTtcbiAgICAgIHRoaXMuYmx1cnJpbmcgPSB0cnVlO1xuXG4gICAgICB0aGlzLmJsdXJUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLmJsdXJyaW5nID0gZmFsc2U7XG4gICAgICB9LCAzMDApO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2hhbmRsZU1vdXNlb3ZlcicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZU1vdXNlb3ZlcigpIHtcbiAgICAgIHZhciBmb2N1c2VkSXRlbSA9IHRoaXMucmVzdWx0T3B0aW9uc1t0aGlzLmhpZ2hsaWdodGVkUmVzdWx0SW5kZXhdO1xuXG4gICAgICBpZiAoZm9jdXNlZEl0ZW0pIHtcbiAgICAgICAgZm9jdXNlZEl0ZW0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc1R5cGVhaGVhZE9wdGlvbkZvY3VzZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2hhbmRsZU1vdXNlb3V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlTW91c2VvdXQoKSB7XG4gICAgICB2YXIgZm9jdXNlZEl0ZW0gPSB0aGlzLnJlc3VsdE9wdGlvbnNbdGhpcy5oaWdobGlnaHRlZFJlc3VsdEluZGV4XTtcblxuICAgICAgaWYgKGZvY3VzZWRJdGVtKSB7XG4gICAgICAgIGZvY3VzZWRJdGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NUeXBlYWhlYWRPcHRpb25Gb2N1c2VkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICduYXZpZ2F0ZVJlc3VsdHMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBuYXZpZ2F0ZVJlc3VsdHMoZGlyZWN0aW9uKSB7XG4gICAgICB2YXIgaW5kZXgkJDEgPSAwO1xuXG4gICAgICBpZiAodGhpcy5oaWdobGlnaHRlZFJlc3VsdEluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgIGluZGV4JCQxID0gdGhpcy5oaWdobGlnaHRlZFJlc3VsdEluZGV4ICsgZGlyZWN0aW9uO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5kZXgkJDEgPCB0aGlzLm51bWJlck9mUmVzdWx0cykge1xuICAgICAgICBpZiAoaW5kZXgkJDEgPCAwKSB7XG4gICAgICAgICAgaW5kZXgkJDEgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRIaWdobGlnaHRlZFJlc3VsdChpbmRleCQkMSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0U3VnZ2VzdGlvbnMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTdWdnZXN0aW9ucyhmb3JjZSkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIGlmICghdGhpcy5zZXR0aW5nUmVzdWx0KSB7XG4gICAgICAgIHZhciBxdWVyeSA9IHRoaXMuaW5wdXQudmFsdWU7XG4gICAgICAgIHZhciBzYW5pdGlzZWRRdWVyeSA9IHNhbml0aXNlVHlwZWFoZWFkVGV4dChxdWVyeSwgdGhpcy5zYW5pdGlzZWRRdWVyeVJlcGxhY2VDaGFycyk7XG4gICAgICAgIGlmIChzYW5pdGlzZWRRdWVyeSAhPT0gdGhpcy5zYW5pdGlzZWRRdWVyeSB8fCBmb3JjZSAmJiAhdGhpcy5yZXN1bHRTZWxlY3RlZCkge1xuICAgICAgICAgIHRoaXMudW5zZXRSZXN1bHRzKCk7XG4gICAgICAgICAgdGhpcy5zZXRBcmlhU3RhdHVzKCk7XG5cbiAgICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4gICAgICAgICAgdGhpcy5zYW5pdGlzZWRRdWVyeSA9IHNhbml0aXNlZFF1ZXJ5O1xuXG4gICAgICAgICAgaWYgKHRoaXMuc2FuaXRpc2VkUXVlcnkubGVuZ3RoID49IHRoaXMubWluQ2hhcnMpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIF90aGlzMi5mZXRjaFN1Z2dlc3Rpb25zKF90aGlzMi5zYW5pdGlzZWRRdWVyeSwgZGF0YSkudGhlbihfdGhpczIuaGFuZGxlUmVzdWx0cy5iaW5kKF90aGlzMikpLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChlcnJvci5uYW1lICE9PSAnQWJvcnRFcnJvcicgJiYgX3RoaXMyLm9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIF90aGlzMi5vbkVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJMaXN0Ym94KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZmV0Y2hTdWdnZXN0aW9ucycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfcmVmMyA9IGFzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvclJ1bnRpbWUubWFyayhmdW5jdGlvbiBfY2FsbGVlMihzYW5pdGlzZWRRdWVyeSwgZGF0YSkge1xuICAgICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgICB2YXIgcmVzdWx0cztcbiAgICAgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIF9jYWxsZWUyJChfY29udGV4dDIpIHtcbiAgICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dDIucHJldiA9IF9jb250ZXh0Mi5uZXh0KSB7XG4gICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICB0aGlzLmFib3J0RmV0Y2goKTtcbiAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5SnNvbihzYW5pdGlzZWRRdWVyeSwgZGF0YSwgdGhpcy5sYW5nLCB0aGlzLnJlc3VsdExpbWl0KTtcblxuICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgcmVzdWx0cyA9IF9jb250ZXh0Mi5zZW50O1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5zYW5pdGlzZWRUZXh0ID0gc2FuaXRpc2VUeXBlYWhlYWRUZXh0KHJlc3VsdFtfdGhpczMubGFuZ10sIF90aGlzMy5zYW5pdGlzZWRRdWVyeVJlcGxhY2VDaGFycyk7XG4gICAgICAgICAgICAgICAgICBpZiAoX3RoaXMzLmxhbmcgIT09ICdlbi1nYicpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVuZ2xpc2ggPSByZXN1bHRbJ2VuLWdiJ107XG4gICAgICAgICAgICAgICAgICAgIHZhciBzYW5pdGlzZWRBbHRlcm5hdGl2ZSA9IHNhbml0aXNlVHlwZWFoZWFkVGV4dChlbmdsaXNoLCBfdGhpczMuc2FuaXRpc2VkUXVlcnlSZXBsYWNlQ2hhcnMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzYW5pdGlzZWRBbHRlcm5hdGl2ZS5tYXRjaChzYW5pdGlzZWRRdWVyeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWx0ZXJuYXRpdmVzID0gW2VuZ2xpc2hdO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zYW5pdGlzZWRBbHRlcm5hdGl2ZXMgPSBbc2FuaXRpc2VkQWx0ZXJuYXRpdmVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWx0ZXJuYXRpdmVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zYW5pdGlzZWRBbHRlcm5hdGl2ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQyLmFicnVwdCgncmV0dXJuJywge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0czogcmVzdWx0cyxcbiAgICAgICAgICAgICAgICAgIHRvdGFsUmVzdWx0czogcmVzdWx0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Mi5zdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlMiwgdGhpcyk7XG4gICAgICB9KSk7XG5cbiAgICAgIGZ1bmN0aW9uIGZldGNoU3VnZ2VzdGlvbnMoX3gyLCBfeDMpIHtcbiAgICAgICAgcmV0dXJuIF9yZWYzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmZXRjaFN1Z2dlc3Rpb25zO1xuICAgIH0oKVxuICB9LCB7XG4gICAga2V5OiAnYWJvcnRGZXRjaCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFib3J0RmV0Y2goKSB7XG4gICAgICBpZiAodGhpcy5mZXRjaCAmJiB0aGlzLmZldGNoLnN0YXR1cyAhPT0gJ0RPTkUnKSB7XG4gICAgICAgIHRoaXMuZmV0Y2guYWJvcnQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd1bnNldFJlc3VsdHMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1bnNldFJlc3VsdHMoKSB7XG4gICAgICB0aGlzLnJlc3VsdHMgPSBbXTtcbiAgICAgIHRoaXMucmVzdWx0T3B0aW9ucyA9IFtdO1xuICAgICAgdGhpcy5yZXN1bHRTZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy5vblVuc2V0UmVzdWx0KSB7XG4gICAgICAgIHRoaXMub25VbnNldFJlc3VsdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2NsZWFyTGlzdGJveCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyTGlzdGJveChwcmV2ZW50QXJpYVN0YXR1c1VwZGF0ZSkge1xuICAgICAgdGhpcy5saXN0Ym94LmlubmVySFRNTCA9ICcnO1xuICAgICAgdGhpcy5jb250ZXh0LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NUeXBlYWhlYWRIYXNSZXN1bHRzKTtcbiAgICAgIHRoaXMuaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKTtcbiAgICAgIHRoaXMuaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJyk7XG5cbiAgICAgIGlmICghcHJldmVudEFyaWFTdGF0dXNVcGRhdGUpIHtcbiAgICAgICAgdGhpcy5zZXRBcmlhU3RhdHVzKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaGFuZGxlUmVzdWx0cycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZVJlc3VsdHMocmVzdWx0KSB7XG4gICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgdGhpcy5mb3VuZFJlc3VsdHMgPSByZXN1bHQudG90YWxSZXN1bHRzO1xuXG4gICAgICBpZiAocmVzdWx0LnJlc3VsdHMubGVuZ3RoID4gMTApIHtcbiAgICAgICAgcmVzdWx0LnJlc3VsdHMgPSByZXN1bHQucmVzdWx0cy5zbGljZSgwLCB0aGlzLnJlc3VsdExpbWl0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXN1bHRzID0gcmVzdWx0LnJlc3VsdHM7XG4gICAgICB0aGlzLm51bWJlck9mUmVzdWx0cyA9IE1hdGgubWF4KHRoaXMucmVzdWx0cy5sZW5ndGgsIDApO1xuXG4gICAgICBpZiAoIXRoaXMuZGVsZXRpbmcgfHwgdGhpcy5udW1iZXJPZlJlc3VsdHMgJiYgdGhpcy5kZWxldGluZykge1xuICAgICAgICBpZiAodGhpcy5udW1iZXJPZlJlc3VsdHMgPT09IDEgJiYgdGhpcy5yZXN1bHRzWzBdLnNhbml0aXNlZFRleHQgPT09IHRoaXMuc2FuaXRpc2VkUXVlcnkpIHtcbiAgICAgICAgICB0aGlzLmNsZWFyTGlzdGJveCh0cnVlKTtcbiAgICAgICAgICB0aGlzLnNlbGVjdFJlc3VsdCgwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxpc3Rib3guaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgdGhpcy5yZXN1bHRPcHRpb25zID0gdGhpcy5yZXN1bHRzLm1hcChmdW5jdGlvbiAocmVzdWx0LCBpbmRleCQkMSkge1xuICAgICAgICAgICAgdmFyIGFyaWFMYWJlbCA9IHJlc3VsdFtfdGhpczQubGFuZ107XG4gICAgICAgICAgICB2YXIgaW5uZXJIVE1MID0gX3RoaXM0LmVtYm9sZGVuTWF0Y2goYXJpYUxhYmVsLCBfdGhpczQucXVlcnkpO1xuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQuc2FuaXRpc2VkQWx0ZXJuYXRpdmVzKSkge1xuICAgICAgICAgICAgICB2YXIgYWx0ZXJuYXRpdmVNYXRjaCA9IHJlc3VsdC5zYW5pdGlzZWRBbHRlcm5hdGl2ZXMuZmluZChmdW5jdGlvbiAoYWx0ZXJuYXRpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWx0ZXJuYXRpdmUgIT09IHJlc3VsdC5zYW5pdGlzZWRUZXh0ICYmIGFsdGVybmF0aXZlLmluY2x1ZGVzKF90aGlzNC5zYW5pdGlzZWRRdWVyeSk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGlmIChhbHRlcm5hdGl2ZU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFsdGVybmF0aXZlVGV4dCA9IHJlc3VsdC5hbHRlcm5hdGl2ZXNbcmVzdWx0LnNhbml0aXNlZEFsdGVybmF0aXZlcy5pbmRleE9mKGFsdGVybmF0aXZlTWF0Y2gpXTtcbiAgICAgICAgICAgICAgICBpbm5lckhUTUwgKz0gJyA8c21hbGw+KCcgKyBfdGhpczQuZW1ib2xkZW5NYXRjaChhbHRlcm5hdGl2ZVRleHQsIF90aGlzNC5xdWVyeSkgKyAnKTwvc21hbGw+JztcbiAgICAgICAgICAgICAgICBhcmlhTGFiZWwgKz0gJywgKCcgKyBhbHRlcm5hdGl2ZVRleHQgKyAnKSc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGxpc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICAgIGxpc3RFbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzVHlwZWFoZWFkT3B0aW9uO1xuICAgICAgICAgICAgbGlzdEVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIF90aGlzNC5saXN0Ym94SWQgKyAnX19vcHRpb24tLScgKyBpbmRleCQkMSk7XG4gICAgICAgICAgICBsaXN0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnb3B0aW9uJyk7XG4gICAgICAgICAgICBsaXN0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBhcmlhTGFiZWwpO1xuICAgICAgICAgICAgbGlzdEVsZW1lbnQuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuXG4gICAgICAgICAgICBsaXN0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgX3RoaXM0LnNlbGVjdFJlc3VsdChpbmRleCQkMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXM0Lmxpc3Rib3guYXBwZW5kQ2hpbGQobGlzdEVsZW1lbnQpO1xuXG4gICAgICAgICAgICByZXR1cm4gbGlzdEVsZW1lbnQ7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAodGhpcy5udW1iZXJPZlJlc3VsdHMgPCB0aGlzLmZvdW5kUmVzdWx0cykge1xuICAgICAgICAgICAgdmFyIGxpc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICAgIGxpc3RFbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzVHlwZWFoZWFkT3B0aW9uICsgJyAnICsgY2xhc3NUeXBlYWhlYWRPcHRpb25Nb3JlUmVzdWx0cztcbiAgICAgICAgICAgIGxpc3RFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgICAgbGlzdEVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5tb3JlUmVzdWx0cztcbiAgICAgICAgICAgIHRoaXMubGlzdGJveC5hcHBlbmRDaGlsZChsaXN0RWxlbWVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zZXRIaWdobGlnaHRlZFJlc3VsdChudWxsKTtcblxuICAgICAgICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgISF0aGlzLm51bWJlck9mUmVzdWx0cyk7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmNsYXNzTGlzdFshIXRoaXMubnVtYmVyT2ZSZXN1bHRzID8gJ2FkZCcgOiAncmVtb3ZlJ10oY2xhc3NUeXBlYWhlYWRIYXNSZXN1bHRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMubnVtYmVyT2ZSZXN1bHRzID09PSAwICYmIHRoaXMubm9SZXN1bHRzKSB7XG4gICAgICAgIHRoaXMubGlzdGJveC5pbm5lckhUTUwgPSAnPGxpIGNsYXNzPVwiJyArIGNsYXNzVHlwZWFoZWFkT3B0aW9uICsgJyAnICsgY2xhc3NUeXBlYWhlYWRPcHRpb25Ob1Jlc3VsdHMgKyAnXCI+JyArIHRoaXMubm9SZXN1bHRzICsgJzwvbGk+JztcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzZXRIaWdobGlnaHRlZFJlc3VsdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldEhpZ2hsaWdodGVkUmVzdWx0KGluZGV4JCQxKSB7XG4gICAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgICAgdGhpcy5oaWdobGlnaHRlZFJlc3VsdEluZGV4ID0gaW5kZXgkJDE7XG5cbiAgICAgIGlmICh0aGlzLmhpZ2hsaWdodGVkUmVzdWx0SW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5pbnB1dC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm51bWJlck9mUmVzdWx0cykge1xuICAgICAgICB0aGlzLnJlc3VsdE9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAob3B0aW9uLCBvcHRpb25JbmRleCkge1xuICAgICAgICAgIGlmIChvcHRpb25JbmRleCA9PT0gaW5kZXgkJDEpIHtcbiAgICAgICAgICAgIG9wdGlvbi5jbGFzc0xpc3QuYWRkKGNsYXNzVHlwZWFoZWFkT3B0aW9uRm9jdXNlZCk7XG4gICAgICAgICAgICBvcHRpb24uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICBfdGhpczUuaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCBvcHRpb24uZ2V0QXR0cmlidXRlKCdpZCcpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3B0aW9uLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NUeXBlYWhlYWRPcHRpb25Gb2N1c2VkKTtcbiAgICAgICAgICAgIG9wdGlvbi5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2V0QXJpYVN0YXR1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NldEFyaWFTdGF0dXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRBcmlhU3RhdHVzKGNvbnRlbnQpIHtcbiAgICAgIGlmICghY29udGVudCkge1xuICAgICAgICB2YXIgcXVlcnlUb29TaG9ydCA9IHRoaXMuc2FuaXRpc2VkUXVlcnkubGVuZ3RoIDwgdGhpcy5taW5DaGFycztcbiAgICAgICAgdmFyIG5vUmVzdWx0cyA9IHRoaXMubnVtYmVyT2ZSZXN1bHRzID09PSAwO1xuXG4gICAgICAgIGlmIChxdWVyeVRvb1Nob3J0KSB7XG4gICAgICAgICAgY29udGVudCA9IHRoaXMuYXJpYU1pbkNoYXJzO1xuICAgICAgICB9IGVsc2UgaWYgKG5vUmVzdWx0cykge1xuICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmFyaWFOb1Jlc3VsdHMgKyAnOiBcIicgKyB0aGlzLnF1ZXJ5ICsgJ1wiJztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm51bWJlck9mUmVzdWx0cyA9PT0gMSkge1xuICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmFyaWFPbmVSZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGVudCA9IHRoaXMuYXJpYU5SZXN1bHRzLnJlcGxhY2UoJ3tufScsIHRoaXMubnVtYmVyT2ZSZXN1bHRzKTtcblxuICAgICAgICAgIGlmICh0aGlzLnJlc3VsdExpbWl0ICYmIHRoaXMuZm91bmRSZXN1bHRzID4gdGhpcy5yZXN1bHRMaW1pdCkge1xuICAgICAgICAgICAgY29udGVudCArPSAnICcgKyB0aGlzLmFyaWFMaW1pdGVkUmVzdWx0cztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hcmlhU3RhdHVzLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2VsZWN0UmVzdWx0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2VsZWN0UmVzdWx0KGluZGV4JCQxKSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgICAgaWYgKHRoaXMucmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nUmVzdWx0ID0gdHJ1ZTtcblxuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5yZXN1bHRzW2luZGV4JCQxIHx8IHRoaXMuaGlnaGxpZ2h0ZWRSZXN1bHRJbmRleCB8fCAwXTtcblxuICAgICAgICB0aGlzLnJlc3VsdFNlbGVjdGVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAocmVzdWx0LnNhbml0aXNlZFRleHQgIT09IHRoaXMuc2FuaXRpc2VkUXVlcnkgJiYgcmVzdWx0LnNhbml0aXNlZEFsdGVybmF0aXZlcyAmJiByZXN1bHQuc2FuaXRpc2VkQWx0ZXJuYXRpdmVzLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBiZXN0TWF0Y2hpbmdBbHRlcm5hdGl2ZSA9IHJlc3VsdC5zYW5pdGlzZWRBbHRlcm5hdGl2ZXMubWFwKGZ1bmN0aW9uIChhbHRlcm5hdGl2ZSwgaW5kZXgkJDEpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNjb3JlOiBkaWNlKF90aGlzNi5zYW5pdGlzZWRRdWVyeSwgYWx0ZXJuYXRpdmUpLFxuICAgICAgICAgICAgICBpbmRleDogaW5kZXgkJDFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkuc29ydChkaXN0XzEoJ3Njb3JlJykpWzBdO1xuXG4gICAgICAgICAgdmFyIHNjb3JlZFNhbml0aXNlZCA9IGRpY2UodGhpcy5zYW5pdGlzZWRRdWVyeSwgcmVzdWx0LnNhbml0aXNlZFRleHQpO1xuXG4gICAgICAgICAgaWYgKGJlc3RNYXRjaGluZ0FsdGVybmF0aXZlLnNjb3JlID49IHNjb3JlZFNhbml0aXNlZCkge1xuICAgICAgICAgICAgcmVzdWx0LmRpc3BsYXlUZXh0ID0gcmVzdWx0LmFsdGVybmF0aXZlc1tiZXN0TWF0Y2hpbmdBbHRlcm5hdGl2ZS5pbmRleF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5kaXNwbGF5VGV4dCA9IHJlc3VsdFt0aGlzLmxhbmddO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQuZGlzcGxheVRleHQgPSByZXN1bHRbdGhpcy5sYW5nXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25TZWxlY3QocmVzdWx0KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM2LnNldHRpbmdSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGFyaWFNZXNzYWdlID0gdGhpcy5hcmlhWW91SGF2ZVNlbGVjdGVkICsgJzogJyArIHJlc3VsdC5kaXNwbGF5VGV4dCArICcuJztcblxuICAgICAgICB0aGlzLmNsZWFyTGlzdGJveCgpO1xuICAgICAgICB0aGlzLnNldEFyaWFTdGF0dXMoYXJpYU1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2VtYm9sZGVuTWF0Y2gnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbWJvbGRlbk1hdGNoKHN0cmluZywgcXVlcnkpIHtcbiAgICAgIHF1ZXJ5ID0gcXVlcnkudG9Mb3dlckNhc2UoKS50cmltKCk7XG5cbiAgICAgIGlmIChzdHJpbmcudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeSkpIHtcbiAgICAgICAgdmFyIHF1ZXJ5TGVuZ3RoID0gcXVlcnkubGVuZ3RoO1xuICAgICAgICB2YXIgbWF0Y2hJbmRleCA9IHN0cmluZy50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkpO1xuICAgICAgICB2YXIgbWF0Y2hFbmQgPSBtYXRjaEluZGV4ICsgcXVlcnlMZW5ndGg7XG4gICAgICAgIHZhciBiZWZvcmUgPSBzdHJpbmcuc3Vic3RyKDAsIG1hdGNoSW5kZXgpO1xuICAgICAgICB2YXIgbWF0Y2ggPSBzdHJpbmcuc3Vic3RyKG1hdGNoSW5kZXgsIHF1ZXJ5TGVuZ3RoKTtcbiAgICAgICAgdmFyIGFmdGVyID0gc3RyaW5nLnN1YnN0cihtYXRjaEVuZCwgc3RyaW5nLmxlbmd0aCAtIG1hdGNoRW5kKTtcblxuICAgICAgICByZXR1cm4gYmVmb3JlICsgJzxzdHJvbmc+JyArIG1hdGNoICsgJzwvc3Ryb25nPicgKyBhZnRlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBUeXBlYWhlYWRVSTtcbn0oKTtcblxudmFyIFR5cGVhaGVhZCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gVHlwZWFoZWFkKGNvbnRleHQpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBUeXBlYWhlYWQpO1xuXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLmxhbmcgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdsYW5nJykudG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLnR5cGVhaGVhZCA9IG5ldyBUeXBlYWhlYWRVSSh7XG4gICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgbGFuZzogdGhpcy5sYW5nLFxuICAgICAgb25TZWxlY3Q6IHRoaXMub25TZWxlY3QuYmluZCh0aGlzKSxcbiAgICAgIG9uVW5zZXRSZXN1bHQ6IHRoaXMub25VbnNldFJlc3VsdC5iaW5kKHRoaXMpLFxuICAgICAgb25FcnJvcjogdGhpcy5vbkVycm9yLmJpbmQodGhpcylcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFR5cGVhaGVhZCwgW3tcbiAgICBrZXk6ICdvblNlbGVjdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uU2VsZWN0KHJlc3VsdCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIF90aGlzLnR5cGVhaGVhZC5pbnB1dC52YWx1ZSA9IHJlc3VsdC5kaXNwbGF5VGV4dDtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb25VbnNldFJlc3VsdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uVW5zZXRSZXN1bHQoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb25FcnJvcicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uRXJyb3IoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gVHlwZWFoZWFkO1xufSgpO1xuXG5mdW5jdGlvbiB0eXBlYWhlYWRzKCkge1xuICB2YXIgdHlwZWFoZWFkcyA9IFtdLmNvbmNhdCh0b0NvbnN1bWFibGVBcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdHlwZWFoZWFkJykpKTtcblxuICB0eXBlYWhlYWRzLmZvckVhY2goZnVuY3Rpb24gKHR5cGVhaGVhZCkge1xuICAgIHJldHVybiBuZXcgVHlwZWFoZWFkKHR5cGVhaGVhZCk7XG4gIH0pO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdUWVBFQUhFQUQtUkVBRFknLCB0eXBlYWhlYWRzKTtcblxudmFyIFVBQyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gVUFDKGNvbnRleHQpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBVQUMpO1xuXG4gICAgdGhpcy5pbnB1dCA9IGNvbnRleHQ7XG4gICAgdmFyIGdyb3VwU2l6ZSA9IHBhcnNlSW50KGNvbnRleHQuZ2V0QXR0cmlidXRlKCdkYXRhLWdyb3VwLXNpemUnKSwgMTApO1xuICAgIHRoaXMuZ3JvdXBpbmdSZWdleCA9IG5ldyBSZWdFeHAoJy57MSwnICsgZ3JvdXBTaXplICsgJ30nLCAnZycpO1xuXG4gICAgdGhpcy5iaW5kRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFVBQywgW3tcbiAgICBrZXk6ICdiaW5kRXZlbnRMaXN0ZW5lcnMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBiaW5kRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5oYW5kbGVJbnB1dC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoYW5kbGVJbnB1dCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZUlucHV0KCkge1xuICAgICAgdmFyIGN1cnNvclBvc2l0aW9uID0gdGhpcy5pbnB1dC5zZWxlY3Rpb25TdGFydDtcbiAgICAgIHZhciBzaG91bGRSZXBvc2l0aW9uQ3Vyc29yID0gY3Vyc29yUG9zaXRpb24gIT09IHRoaXMuaW5wdXQudmFsdWUubGVuZ3RoO1xuXG4gICAgICB0aGlzLmlucHV0LnZhbHVlID0gKHRoaXMuaW5wdXQudmFsdWUucmVwbGFjZSgvXFxzL2csICcnKS5tYXRjaCh0aGlzLmdyb3VwaW5nUmVnZXgpIHx8IFtdKS5qb2luKCcgJyk7XG5cbiAgICAgIGlmIChzaG91bGRSZXBvc2l0aW9uQ3Vyc29yKSB7XG4gICAgICAgIHRoaXMuaW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UoY3Vyc29yUG9zaXRpb24sIGN1cnNvclBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFVBQztcbn0oKTtcblxuZnVuY3Rpb24gcnVuVUFDKCkge1xuICB2YXIgdWFjSW5wdXRzID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy11YWMnKSkpO1xuXG4gIGlmICh1YWNJbnB1dHMubGVuZ3RoKSB7XG4gICAgdWFjSW5wdXRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBuZXcgVUFDKGVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ1VBQy1SRUFEWScsIHJ1blVBQyk7XG5cbnZhciBpbnB1dENsYXNzTGltaXRSZWFjaGVkID0gJ2lucHV0LS1saW1pdC1yZWFjaGVkJztcbnZhciByZW1haW5pbmdDbGFzc0xpbWl0UmVhY2hlZCA9ICdpbnB1dF9fbGltaXQtLXJlYWNoZWQnO1xudmFyIGF0dHJDaGFyQ2hlY2tSZWYgPSAnZGF0YS1jaGFyLWNoZWNrLXJlZic7XG52YXIgYXR0ckNoYXJDaGVja1ZhbCA9ICdkYXRhLWNoYXItY2hlY2stbnVtJztcblxudmFyIENoYXJDaGVjayA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ2hhckNoZWNrKGNvbnRleHQpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBDaGFyQ2hlY2spO1xuXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLmlucHV0ID0gdGhpcy5jb250ZXh0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG4gICAgdGhpcy5jaGVja0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlucHV0LmdldEF0dHJpYnV0ZShhdHRyQ2hhckNoZWNrUmVmKSk7XG4gICAgdGhpcy5jaGVja1ZhbCA9IHRoaXMuaW5wdXQuZ2V0QXR0cmlidXRlKGF0dHJDaGFyQ2hlY2tWYWwpO1xuXG4gICAgdGhpcy5jaGFyTGltaXRTaW5ndWxhck1lc3NhZ2UgPSB0aGlzLmNoZWNrRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2hhcmNvdW50LWxpbWl0LXNpbmd1bGFyJyk7XG4gICAgdGhpcy5jaGFyTGltaXRQbHVyYWxNZXNzYWdlID0gdGhpcy5jaGVja0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWNoYXJjb3VudC1saW1pdC1wbHVyYWwnKTtcblxuICAgIHRoaXMudXBkYXRlQ2hlY2tSZWFkb3V0KG51bGwsIHRydWUpO1xuICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLnVwZGF0ZUNoZWNrUmVhZG91dC5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKENoYXJDaGVjaywgW3tcbiAgICBrZXk6ICd1cGRhdGVDaGVja1JlYWRvdXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVDaGVja1JlYWRvdXQoZXZlbnQsIGZpcnN0UnVuKSB7XG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmlucHV0LnZhbHVlO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHRoaXMuY2hlY2tWYWwgLSB2YWx1ZS5sZW5ndGg7XG4gICAgICAvLyBQcmV2ZW50IGFyaWEgbGl2ZSBhbm5vdW5jZW1lbnQgd2hlbiBjb21wb25lbnQgaW5pdGlhbGlzZXNcbiAgICAgIGlmICghZmlyc3RSdW4gJiYgZXZlbnQuaW5wdXRUeXBlKSB7XG4gICAgICAgIHRoaXMuY2hlY2tFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jaGVja0VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxpdmUnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jaGVja1JlbWFpbmluZyhyZW1haW5pbmcpO1xuICAgICAgdGhpcy5zZXRDaGVja0NsYXNzKHJlbWFpbmluZywgdGhpcy5pbnB1dCwgaW5wdXRDbGFzc0xpbWl0UmVhY2hlZCk7XG4gICAgICB0aGlzLnNldENoZWNrQ2xhc3MocmVtYWluaW5nLCB0aGlzLmNoZWNrRWxlbWVudCwgcmVtYWluaW5nQ2xhc3NMaW1pdFJlYWNoZWQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2NoZWNrUmVtYWluaW5nJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2hlY2tSZW1haW5pbmcocmVtYWluaW5nKSB7XG4gICAgICB2YXIgbWVzc2FnZSA9IHZvaWQgMDtcbiAgICAgIGlmIChyZW1haW5pbmcgPT09IC0xKSB7XG4gICAgICAgIG1lc3NhZ2UgPSB0aGlzLmNoYXJMaW1pdFNpbmd1bGFyTWVzc2FnZTtcbiAgICAgICAgdGhpcy5jaGVja0VsZW1lbnQuaW5uZXJUZXh0ID0gbWVzc2FnZS5yZXBsYWNlKCd7eH0nLCBNYXRoLmFicyhyZW1haW5pbmcpKTtcbiAgICAgIH0gZWxzZSBpZiAocmVtYWluaW5nIDwgLTEpIHtcbiAgICAgICAgbWVzc2FnZSA9IHRoaXMuY2hhckxpbWl0UGx1cmFsTWVzc2FnZTtcbiAgICAgICAgdGhpcy5jaGVja0VsZW1lbnQuaW5uZXJUZXh0ID0gbWVzc2FnZS5yZXBsYWNlKCd7eH0nLCBNYXRoLmFicyhyZW1haW5pbmcpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U2hvd01lc3NhZ2UocmVtYWluaW5nKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzZXRTaG93TWVzc2FnZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFNob3dNZXNzYWdlKHJlbWFpbmluZykge1xuICAgICAgdGhpcy5jaGVja0VsZW1lbnQuY2xhc3NMaXN0W3JlbWFpbmluZyA8IDAgPyAncmVtb3ZlJyA6ICdhZGQnXSgndS1kLW5vJyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2V0Q2hlY2tDbGFzcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldENoZWNrQ2xhc3MocmVtYWluaW5nLCBlbGVtZW50LCBzZXRDbGFzcykge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3RbcmVtYWluaW5nIDwgMCA/ICdhZGQnIDogJ3JlbW92ZSddKHNldENsYXNzKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIENoYXJDaGVjaztcbn0oKTtcblxudmFyIGNoZWNrZWRXcmFwcGVyID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1jaGFyLWNoZWNrJykpKTtcbmlmIChjaGVja2VkV3JhcHBlci5sZW5ndGgpIHtcbiAgY2hlY2tlZFdyYXBwZXIuZm9yRWFjaChmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICByZXR1cm4gbmV3IENoYXJDaGVjayhpbnB1dCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhdXRvSW5jcmVtZW50SWQoY29sbGVjdGlvbikge1xuICB2YXIgayA9IGNvbGxlY3Rpb24gKyAnLWluY3JlbWVudCcsXG4gICAgICBpZCA9IHBhcnNlSW50KHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oaykpIHx8IDA7XG5cbiAgaWQrKztcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGssIEpTT04uc3RyaW5naWZ5KGlkKSk7XG5cbiAgcmV0dXJuIGlkO1xufVxuXG5mdW5jdGlvbiByZW1vdmVGcm9tTGlzdChsaXN0LCB2YWwpIHtcblxuICBmdW5jdGlvbiBkb1JlbW92ZShpdGVtKSB7XG4gICAgdmFyIGZvdW5kSWQgPSBsaXN0LmluZGV4T2YoaXRlbSk7XG5cbiAgICAvKipcbiAgICAgKiBHdWFyZFxuICAgICAqL1xuICAgIGlmIChmb3VuZElkID09PSAtMSkge1xuICAgICAgY29uc29sZS5sb2coJ0F0dGVtcHQgdG8gcmVtb3ZlIGZyb20gbGlzdCBmYWlsZWQ6ICcsIGxpc3QsIHZhbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGlzdC5zcGxpY2UoZm91bmRJZCwgMSk7XG4gIH1cblxuICBpZiAoXy5pc0FycmF5KHZhbCkpIHtcbiAgICAkLmVhY2godmFsLCBmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgZG9SZW1vdmUoaXRlbSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZG9SZW1vdmUodmFsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFpbGluZ05hbWVTKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWVbbmFtZS5sZW5ndGggLSAxXSA9PT0gJ3MnID8gJ1xcJiN4MjAxOTsnIDogJ1xcJiN4MjAxOTtzJztcbn1cblxudmFyIEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZID0gJ2hvdXNlaG9sZC1tZW1iZXJzJztcbnZhciBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPSAncGVyc29uX21lJztcbnZhciBIT1VTRUhPTERfTUVNQkVSX1RZUEUgPSAnaG91c2Vob2xkLW1lbWJlcic7XG52YXIgVklTSVRPUl9UWVBFID0gJ3Zpc2l0b3InO1xuXG4vKipcbiAqIFR5cGVzXG4gKi9cbmZ1bmN0aW9uIHBlcnNvbihvcHRzKSB7XG4gIGlmIChvcHRzLmZpcnN0TmFtZSA9PT0gJycgfHwgb3B0cy5sYXN0TmFtZSA9PT0gJycpIHtcbiAgICBjb25zb2xlLmxvZygnVW5hYmxlIHRvIGNyZWF0ZSBwZXJzb24gd2l0aCBkYXRhOiAnLCBvcHRzLmZpcnN0TmFtZSwgIW9wdHMubWlkZGxlTmFtZSwgIW9wdHMubGFzdE5hbWUpO1xuICB9XG5cbiAgdmFyIG1pZGRsZU5hbWUgPSBvcHRzLm1pZGRsZU5hbWUgfHwgJyc7XG5cbiAgcmV0dXJuIHtcbiAgICBmdWxsTmFtZTogb3B0cy5maXJzdE5hbWUgKyAnICcgKyBtaWRkbGVOYW1lICsgJyAnICsgb3B0cy5sYXN0TmFtZSxcbiAgICBmaXJzdE5hbWU6IG9wdHMuZmlyc3ROYW1lLFxuICAgIG1pZGRsZU5hbWU6IG1pZGRsZU5hbWUsXG4gICAgbGFzdE5hbWU6IG9wdHMubGFzdE5hbWVcbiAgfTtcbn1cblxuLyoqXG4gKiBTdG9yYWdlXG4gKi9cbmZ1bmN0aW9uIGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcigpIHtcbiAgcmV0dXJuIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maW5kKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgPT09IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcigpIHtcbiAgZGVsZXRlSG91c2Vob2xkTWVtYmVyKFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcihwZXJzb25JZCkge1xuICB2YXIgbWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCAhPT0gcGVyc29uSWQ7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KG1lbWJlcnMpKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVXNlckFzSG91c2Vob2xkTWVtYmVyKHBlcnNvbiwgbWVtYmVyRGF0YSkge1xuICB2YXIgdXNlckFzSG91c2Vob2xkTWVtYmVyID0gZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyKCk7XG5cbiAgdXNlckFzSG91c2Vob2xkTWVtYmVyID8gdXBkYXRlSG91c2Vob2xkTWVtYmVyKF9leHRlbmRzKHt9LCB1c2VyQXNIb3VzZWhvbGRNZW1iZXJbJ0BwZXJzb24nXSwgcGVyc29uKSwgbWVtYmVyRGF0YSkgOiBhZGRIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhLCBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhKSB7XG4gIHZhciBtZW1iZXJzVXBkYXRlZCA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5tYXAoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gcGVyc29uLmlkID8gX2V4dGVuZHMoe30sIG1lbWJlciwgbWVtYmVyRGF0YSwgeyAnQHBlcnNvbic6IF9leHRlbmRzKHt9LCBtZW1iZXJbJ0BwZXJzb24nXSwgcGVyc29uKSB9KSA6IG1lbWJlcjtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkobWVtYmVyc1VwZGF0ZWQpKTtcbn1cblxuZnVuY3Rpb24gYWRkSG91c2Vob2xkTWVtYmVyKHBlcnNvbiwgbWVtYmVyRGF0YSwgaWQpIHtcbiAgdmFyIHBlb3BsZSA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSB8fCBbXTtcbiAgbWVtYmVyRGF0YSA9IG1lbWJlckRhdGEgfHwge307XG5cbiAgLyoqXG4gICAqIFVzZXIgaXMgYWx3YXlzIGZpcnN0IGluIHRoZSBob3VzZWhvbGQgbGlzdFxuICAgKi9cbiAgcGVvcGxlW2lkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPyAndW5zaGlmdCcgOiAncHVzaCddKF9leHRlbmRzKHt9LCBtZW1iZXJEYXRhLCB7XG4gICAgdHlwZTogbWVtYmVyRGF0YS50eXBlIHx8IEhPVVNFSE9MRF9NRU1CRVJfVFlQRSxcbiAgICAnQHBlcnNvbic6IF9leHRlbmRzKHt9LCBwZXJzb24sIHtcbiAgICAgIGlkOiBpZCB8fCAncGVyc29uJyArIGF1dG9JbmNyZW1lbnRJZCgnaG91c2Vob2xkLW1lbWJlcnMnKVxuICAgIH0pXG4gIH0pKTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShwZW9wbGUpKTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSkpIHx8IFtdO1xufVxuXG5mdW5jdGlvbiBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKGlkKSB7XG4gIHJldHVybiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmluZChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBpZDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldE1lbWJlclBlcnNvbklkKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvcnNcbiAqL1xuZnVuY3Rpb24gaXNWaXNpdG9yKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlZJU0lUT1JfVFlQRTtcbn1cblxuZnVuY3Rpb24gaXNIb3VzZWhvbGRNZW1iZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUl9UWVBFO1xufVxuXG5mdW5jdGlvbiBpc090aGVySG91c2Vob2xkTWVtYmVyKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLkhPVVNFSE9MRF9NRU1CRVJfVFlQRSAmJiBtZW1iZXJbJ0BwZXJzb24nXS5pZCAhPT0gd2luZG93Lk9OUy5zdG9yYWdlLklEUy5VU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ7XG59XG5cbnZhciB0ZW1wQXdheVF1ZXN0aW9uU2VudGVuY2VNYXAgPSB7XG4gICd0aHJlZS1tb3JlJzogJ1Blb3BsZSB3aG8gdXN1YWxseSBsaXZlIG91dHNpZGUgdGhlIFVLIHdobyBhcmUgc3RheWluZyBpbiB0aGUgVUsgZm9yIDxzdHJvbmc+MyBtb250aHMgb3IgbW9yZTwvc3Ryb25nPicsXG4gICdwZXJtLWF3YXknOiAnUGVvcGxlIHdobyB3b3JrIGF3YXkgZnJvbSBob21lIHdpdGhpbiB0aGUgVUsgaWYgdGhpcyBpcyB0aGVpciBwZXJtYW5lbnQgb3IgZmFtaWx5IGhvbWUnLFxuICAnYXJtZWQtZm9yY2VzJzogJ01lbWJlcnMgb2YgdGhlIGFybWVkIGZvcmNlcyBpZiB0aGlzIGlzIHRoZWlyIHBlcm1hbmVudCBvciBmYW1pbHkgaG9tZScsXG4gICdsZXNzLXR3ZWx2ZSc6ICdQZW9wbGUgd2hvIGFyZSB0ZW1wb3JhcmlseSBvdXRzaWRlIHRoZSBVSyBmb3IgbGVzcyB0aGFuIDxzdHJvbmc+MTIgbW9udGhzPC9zdHJvbmc+JyxcbiAgJ3VzdWFsbHktdGVtcCc6ICdQZW9wbGUgc3RheWluZyB0ZW1wb3JhcmlseSB3aG8gdXN1YWxseSBsaXZlIGluIHRoZSBVSyBidXQnICsgJyBkbyBub3QgaGF2ZSBhbm90aGVyIFVLIGFkZHJlc3MgZm9yIGV4YW1wbGUsIHJlbGF0aXZlcywgZnJpZW5kcycsXG4gICdvdGhlcic6ICdPdGhlciBwZW9wbGUgd2hvIHVzdWFsbHkgbGl2ZSBoZXJlIGJ1dCBhcmUgdGVtcG9yYXJpbHkgYXdheSdcbn07XG5cbnZhciB2aXNpdG9yUXVlc3Rpb25TZW50ZW5jZU1hcCA9IHtcbiAgJ3VzdWFsbHktaW4tdWsnOiAnUGVvcGxlIHdobyB1c3VhbGx5IGxpdmUgc29tZXdoZXJlIGVsc2UgaW4gdGhlIFVLLCBmb3IgZXhhbXBsZSBib3kvZ2lybGZyaWVuZHMsIGZyaWVuZHMgb3IgcmVsYXRpdmVzJyxcbiAgJ3NlY29uZC1hZGRyZXNzJzogJ1Blb3BsZSBzdGF5aW5nIGhlcmUgYmVjYXVzZSBpdCBpcyB0aGVpciBzZWNvbmQgYWRkcmVzcywgZm9yIGV4YW1wbGUsIGZvciB3b3JrLiBUaGVpciBwZXJtYW5lbnQgb3IgZmFtaWx5IGhvbWUgaXMgZWxzZXdoZXJlJyxcbiAgJ2xlc3MtdGhyZWUnOiAnUGVvcGxlIHdobyB1c3VhbGx5IGxpdmUgb3V0c2lkZSB0aGUgVUsgd2hvIGFyZSBzdGF5aW5nIGluIHRoZSBVSyBmb3IgbGVzcyB0aGFuIHRocmVlIG1vbnRocycsXG4gICdvbi1ob2xpZGF5JzogJ1Blb3BsZSBoZXJlIG9uIGhvbGlkYXknXG59O1xuXG4vKipcbiAqIEF1Z21lbnQgVW5kZXJzY29yZSBsaWJyYXJ5XG4gKi9cbnZhciBfJDEgPSB3aW5kb3cuXyB8fCB7fTtcblxudmFyIFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVkgPSAncmVsYXRpb25zaGlwcyc7XG5cbnZhciByZWxhdGlvbnNoaXBUeXBlcyA9IHtcbiAgJ3Nwb3VzZSc6IHsgaWQ6ICdzcG91c2UnIH0sXG4gICdjaGlsZC1wYXJlbnQnOiB7IGlkOiAnY2hpbGQtcGFyZW50JyB9LFxuICAnc3RlcC1jaGlsZC1wYXJlbnQnOiB7IGlkOiAnc3RlcC1jaGlsZC1wYXJlbnQnIH0sXG4gICdncmFuZGNoaWxkLWdyYW5kcGFyZW50JzogeyBpZDogJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnIH0sXG4gICdoYWxmLXNpYmxpbmcnOiB7IGlkOiAnaGFsZi1zaWJsaW5nJyB9LFxuICAnc2libGluZyc6IHsgaWQ6ICdzaWJsaW5nJyB9LFxuICAnc3RlcC1icm90aGVyLXNpc3Rlcic6IHsgaWQ6ICdzdGVwLWJyb3RoZXItc2lzdGVyJyB9LFxuICAncGFydG5lcic6IHsgaWQ6ICdwYXJ0bmVyJyB9LFxuICAndW5yZWxhdGVkJzogeyBpZDogJ3VucmVsYXRlZCcgfSxcbiAgJ290aGVyLXJlbGF0aW9uJzogeyBpZDogJ290aGVyLXJlbGF0aW9uJyB9XG59O1xuXG52YXIgcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXAgPSB7XG4gIC8vIGNvdmVyZWRcbiAgJ2h1c2JhbmQtd2lmZSc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnaHVzYmFuZCBvciB3aWZlJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnaHVzYmFuZCBvciB3aWZlJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3BvdXNlJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnbW90aGVyLWZhdGhlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnbW90aGVyIG9yIGZhdGhlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ21vdGhlciBvciBmYXRoZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydjaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzdGVwLW1vdGhlci1mYXRoZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3N0ZXBtb3RoZXIgb3Igc3RlcGZhdGhlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3N0ZXBtb3RoZXIgb3Igc3RlcGZhdGhlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3N0ZXAtY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnc29uLWRhdWdodGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzb24gb3IgZGF1Z2h0ZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdzb24gb3IgZGF1Z2h0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydjaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdoYWxmLWJyb3RoZXItc2lzdGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdoYWxmLWJyb3RoZXIgb3IgaGFsZi1zaXN0ZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdoYWxmLWJyb3RoZXIgb3IgaGFsZi1zaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydoYWxmLXNpYmxpbmcnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzdGVwLWNoaWxkJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzdGVwY2hpbGQnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdzdGVwY2hpbGQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzdGVwLWNoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ2dyYW5kcGFyZW50Jzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdncmFuZHBhcmVudCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2dyYW5kcGFyZW50JyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snZ3JhbmRjaGlsZC1ncmFuZHBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ2dyYW5kY2hpbGQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2dyYW5kY2hpbGQnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdncmFuZGNoaWxkJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snZ3JhbmRjaGlsZC1ncmFuZHBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ2Jyb3RoZXItc2lzdGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdicm90aGVyIG9yIHNpc3RlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2Jyb3RoZXIgb3Igc2lzdGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc2libGluZyddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3N0ZXAtYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3N0ZXBicm90aGVyIG9yIHN0ZXBzaXN0ZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdzdGVwYnJvdGhlciBvciBzdGVwc2lzdGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3RlcC1icm90aGVyLXNpc3RlciddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ290aGVyLXJlbGF0aW9uJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdvdGhlciByZWxhdGlvbicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3JlbGF0ZWQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydvdGhlci1yZWxhdGlvbiddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3BhcnRuZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3BhcnRuZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdwYXJ0bmVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1sncGFydG5lciddXG4gIH0sXG4gICdzYW1lLXNleC1wYXJ0bmVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdsZWdhbGx5IHJlZ2lzdGVyZWQgY2l2aWwgcGFydG5lcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2xlZ2FsbHkgcmVnaXN0ZXJlZCBjaXZpbCBwYXJ0bmVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1sncGFydG5lciddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3VucmVsYXRlZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAndW5yZWxhdGVkJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAndW5yZWxhdGVkJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1sndW5yZWxhdGVkJ11cbiAgfVxufTtcblxuZnVuY3Rpb24gbmFtZUVsZW1lbnQobmFtZSkge1xuICByZXR1cm4gJzxzdHJvbmc+JyArIG5hbWUgKyAnPC9zdHJvbmc+Jztcbn1cblxuZnVuY3Rpb24gcGVyc29uTGlzdFN0cihwZW9wbGVBcnIpIHtcbiAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gIGlmIChwZW9wbGVBcnIubGVuZ3RoIDwgMSkge1xuICAgIGNvbnNvbGUubG9nKHBlb3BsZUFyciwgJ25vdCBlbm91Z2ggcGVvcGxlIHRvIGNyZWF0ZSBhIGxpc3Qgc3RyaW5nJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHBlb3BsZUFyci5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGVvcGxlQXJyWzBdLmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGVvcGxlQXJyWzBdKSk7XG4gIH1cblxuICB2YXIgcGVvcGxlQ29weSA9IFtdLmNvbmNhdCh0b0NvbnN1bWFibGVBcnJheShwZW9wbGVBcnIpKSxcbiAgICAgIGxhc3RQZXJzb24gPSBwZW9wbGVDb3B5LnBvcCgpO1xuXG4gIHJldHVybiBwZW9wbGVDb3B5Lm1hcChmdW5jdGlvbiAocGVyc29uJCQxKSB7XG4gICAgcmV0dXJuICcnICsgbmFtZUVsZW1lbnQocGVyc29uJCQxLmZ1bGxOYW1lICsgKG9wdHMuaXNGYW1pbHkgPyB0cmFpbGluZ05hbWVTKHBlcnNvbiQkMS5mdWxsTmFtZSkgOiAnJykgKyBmb3JtYXRQZXJzb25JZllvdShwZXJzb24kJDEpKTtcbiAgfSkuam9pbignLCAnKSArICcgYW5kICcgKyBuYW1lRWxlbWVudChsYXN0UGVyc29uLmZ1bGxOYW1lICsgKG9wdHMuaXNGYW1pbHkgPyB0cmFpbGluZ05hbWVTKGxhc3RQZXJzb24uZnVsbE5hbWUpIDogJycpICsgZm9ybWF0UGVyc29uSWZZb3UobGFzdFBlcnNvbikpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRQZXJzb25JZllvdShwZXJzb24kJDEpIHtcbiAgcmV0dXJuIHBlcnNvbiQkMS5pZCA9PT0gVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEID8gJyAoWW91KScgOiAnJztcbn1cblxudmFyIHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXMgPSB7XG4gICdwYXJ0bmVyc2hpcCc6IGZ1bmN0aW9uIHBhcnRuZXJzaGlwKHBlcnNvbjEsIHBlcnNvbjIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIG5hbWVFbGVtZW50KHBlcnNvbjEuZnVsbE5hbWUgKyBmb3JtYXRQZXJzb25JZllvdShwZXJzb24xKSkgKyAnIGlzICcgKyBuYW1lRWxlbWVudChwZXJzb24yLmZ1bGxOYW1lICsgdHJhaWxpbmdOYW1lUyhwZXJzb24yLmZ1bGxOYW1lKSArIGZvcm1hdFBlcnNvbklmWW91KHBlcnNvbjIpKSArICcgJyArIGRlc2NyaXB0aW9uO1xuICB9LFxuICAndHdvRmFtaWx5TWVtYmVyc1RvTWFueSc6IGZ1bmN0aW9uIHR3b0ZhbWlseU1lbWJlcnNUb01hbnkocGFyZW50MSwgcGFyZW50MiwgY2hpbGRyZW5BcnIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIG5hbWVFbGVtZW50KHBhcmVudDEuZnVsbE5hbWUgKyBmb3JtYXRQZXJzb25JZllvdShwYXJlbnQxKSkgKyAnIGFuZCAnICsgbmFtZUVsZW1lbnQocGFyZW50Mi5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBhcmVudDIpKSArICcgYXJlICcgKyBwZXJzb25MaXN0U3RyKGNoaWxkcmVuQXJyLCB7IGlzRmFtaWx5OiB0cnVlIH0pICsgJyAnICsgZGVzY3JpcHRpb247XG4gIH0sXG4gICdvbmVGYW1pbHlNZW1iZXJUb01hbnknOiBmdW5jdGlvbiBvbmVGYW1pbHlNZW1iZXJUb01hbnkocGFyZW50LCBjaGlsZHJlbkFyciwgZGVzY3JpcHRpb24pIHtcbiAgICBjb25zb2xlLmxvZyhwYXJlbnQsIGNoaWxkcmVuQXJyLCBkZXNjcmlwdGlvbik7XG4gICAgcmV0dXJuIG5hbWVFbGVtZW50KHBhcmVudC5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBhcmVudCkpICsgJyBpcyAnICsgcGVyc29uTGlzdFN0cihjaGlsZHJlbkFyciwgeyBpc0ZhbWlseTogdHJ1ZSB9KSArICcgJyArIGRlc2NyaXB0aW9uO1xuICB9LFxuICAnbWFueVRvTWFueSc6IGZ1bmN0aW9uIG1hbnlUb01hbnkocGVvcGxlQXJyMSwgcGVvcGxlQXJyMiwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gcGVyc29uTGlzdFN0cihwZW9wbGVBcnIxKSArICcgJyArIChwZW9wbGVBcnIxLmxlbmd0aCA+IDEgPyAnYXJlJyA6ICdpcycpICsgJyAnICsgZGVzY3JpcHRpb24gKyAnIHRvICcgKyBwZXJzb25MaXN0U3RyKHBlb3BsZUFycjIpO1xuICB9LFxuICAnYWxsTXV0dWFsJzogZnVuY3Rpb24gYWxsTXV0dWFsKHBlb3BsZUFyciwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gcGVyc29uTGlzdFN0cihwZW9wbGVBcnIpICsgJyBhcmUgJyArIGRlc2NyaXB0aW9uO1xuICB9XG59O1xuXG4vKipcbiAqIFR5cGVzXG4gKi9cbmZ1bmN0aW9uIHJlbGF0aW9uc2hpcChkZXNjcmlwdGlvbiwgcGVyc29uSXNJZCwgcGVyc29uVG9JZCkge1xuICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDoge307XG5cbiAgcmV0dXJuIHtcbiAgICBwZXJzb25Jc0Rlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcbiAgICBwZXJzb25Jc0lkOiBwZXJzb25Jc0lkLFxuICAgIHBlcnNvblRvSWQ6IHBlcnNvblRvSWQsXG4gICAgaW5mZXJyZWQ6ICEhb3B0cy5pbmZlcnJlZCxcbiAgICBpbmZlcnJlZEJ5OiBvcHRzLmluZmVycmVkQnlcbiAgfTtcbn1cblxuLyoqXG4gKiBTdG9yYWdlXG4gKi9cbmZ1bmN0aW9uIGFkZFJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXBPYmopIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzKCkgfHwgW10sXG4gICAgICBpdGVtID0gX2V4dGVuZHMoe30sIHJlbGF0aW9uc2hpcE9iaiwge1xuICAgIGlkOiBhdXRvSW5jcmVtZW50SWQoUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSlcbiAgfSk7XG5cbiAgaG91c2Vob2xkUmVsYXRpb25zaGlwcy5wdXNoKGl0ZW0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xuXG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBkZWxldGVSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwT2JqKSB7XG4gIHZhciBob3VzZWhvbGRSZWxhdGlvbnNoaXBzID0gKGdldEFsbFJlbGF0aW9uc2hpcHMoKSB8fCBbXSkuZmlsdGVyKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gcmVsYXRpb25zaGlwLmlkICE9PSByZWxhdGlvbnNoaXBPYmouaWQ7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xufVxuXG5mdW5jdGlvbiBlZGl0UmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcElkLCB2YWx1ZU9iamVjdCkge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IChnZXRBbGxSZWxhdGlvbnNoaXBzKCkgfHwgW10pLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIHJlbGF0aW9uc2hpcC5pZCArICcnID09PSByZWxhdGlvbnNoaXBJZCArICcnID8gX2V4dGVuZHMoe30sIHZhbHVlT2JqZWN0LCB7XG4gICAgICBpZDogcmVsYXRpb25zaGlwSWRcbiAgICB9KSA6IHJlbGF0aW9uc2hpcDtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG59XG5cbmZ1bmN0aW9uIGdldEFsbFJlbGF0aW9uc2hpcHMoKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSkpIHx8IFtdO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxNYW51YWxSZWxhdGlvbnNoaXBzKCkge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuICFyZWxhdGlvbnNoaXAuaW5mZXJyZWQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyKHBlcnNvbklkKSB7XG4gIHZhciBob3VzZWhvbGRSZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuICEocGVyc29uSWQgPT09IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkIHx8IHBlcnNvbklkID09PSByZWxhdGlvbnNoaXAucGVyc29uVG9JZCk7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xufVxuXG4vKipcbiAqIENvbXBhcmF0b3JzXG4gKi9cbmZ1bmN0aW9uIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZDtcbn1cblxuZnVuY3Rpb24gaXNBQ2hpbGRJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIC8qKlxuICAgKiBHdWFyZFxuICAgKi9cbiAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQ7XG59XG5cbmZ1bmN0aW9uIGlzQVNpYmxpbmdJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApICYmIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlLmlkID09PSAnc2libGluZyc7XG59XG5cbmZ1bmN0aW9uIGlzQVBhcmVudEluUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgLyoqXG4gICAqIEd1YXJkXG4gICAqL1xuICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZDtcbn1cblxuZnVuY3Rpb24gYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudChjaGlsZHJlbklkcywgbm90UGFyZW50SWQsIHJlbGF0aW9uc2hpcCkge1xuICAvKipcbiAgICogR3VhcmRcbiAgICogSWYgcmVsYXRpb25zaGlwIHR5cGUgaXMgbm90IGNoaWxkLXBhcmVudFxuICAgKi9cbiAgaWYgKHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlLmlkICE9PSAnY2hpbGQtcGFyZW50Jykge1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGNoaWxkSW5kZXhBc1BlcnNvbklzID0gY2hpbGRyZW5JZHMuaW5kZXhPZihyZWxhdGlvbnNoaXAucGVyc29uSXNJZCksXG4gICAgICBjaGlsZEluZGV4QXNQZXJzb25UbyA9IGNoaWxkcmVuSWRzLmluZGV4T2YocmVsYXRpb25zaGlwLnBlcnNvblRvSWQpO1xuXG4gIC8qKlxuICAgKiBGaW5kIHBhcmVudHMgd2l0aCB0aGUgc2FtZSBjaGlsZHJlblxuICAgKlxuICAgKiBJZiBhIHBlcnNvbklzLWNoaWxkIGlzIG5vdCBpbiByZWxhdGlvbnNoaXBcbiAgICogb3IgMiBjaGlsZHJlbiBhcmUgZm91bmQgaW4gcmVsYXRpb25zaGlwXG4gICAqL1xuICBpZiAoY2hpbGRJbmRleEFzUGVyc29uSXMgPT09IC0xICYmIGNoaWxkSW5kZXhBc1BlcnNvblRvID09PSAtMSB8fCBjaGlsZEluZGV4QXNQZXJzb25JcyAhPT0gLTEgJiYgY2hpbGRJbmRleEFzUGVyc29uVG8gIT09IC0xKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoaWxkIG11c3QgYmUgaW4gcmVsYXRpb25zaGlwLCBnZXQgY2hpbGQgaW5kZXhcbiAgICovXG4gIHZhciBjaGlsZEluZGV4ID0gY2hpbGRJbmRleEFzUGVyc29uSXMgIT09IC0xID8gY2hpbGRJbmRleEFzUGVyc29uSXMgOiBjaGlsZEluZGV4QXNQZXJzb25UbztcblxuICAvKipcbiAgICogSWYgcGVyc29uSXMgaXMgbm90IGluIHJlbGF0aW9uc2hpcFxuICAgKiBhbmQgY2hpbGQgZnJvbSBwcmV2aW91cyByZWxhdGlvbnNoaXAgaXMgYSBjaGlsZCBpbiB0aGlzIHJlbGF0aW9uc2hpcFxuICAgKi9cbiAgcmV0dXJuICFpc0luUmVsYXRpb25zaGlwKG5vdFBhcmVudElkLCByZWxhdGlvbnNoaXApICYmIGlzQUNoaWxkSW5SZWxhdGlvbnNoaXAoY2hpbGRyZW5JZHNbY2hpbGRJbmRleF0sIHJlbGF0aW9uc2hpcCk7XG59XG5cbmZ1bmN0aW9uIGlzUmVsYXRpb25zaGlwVHlwZShyZWxhdGlvbnNoaXBUeXBlLCByZWxhdGlvbnNoaXApIHtcbiAgdmFyIHR5cGVPZlJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlLmlkO1xuXG4gIC8qKlxuICAgKiByZWxhdGlvbnNoaXBUeXBlIGNhbiBiZSBhbiBhcnJheSBvZiB0eXBlc1xuICAgKi9cbiAgcmV0dXJuIF8kMS5pc0FycmF5KHJlbGF0aW9uc2hpcFR5cGUpID8gISFfJDEuZmluZChyZWxhdGlvbnNoaXBUeXBlLCBmdW5jdGlvbiAoclR5cGUpIHtcbiAgICByZXR1cm4gclR5cGUgPT09IHR5cGVPZlJlbGF0aW9uc2hpcDtcbiAgfSkgOiB0eXBlT2ZSZWxhdGlvbnNoaXAgPT09IHJlbGF0aW9uc2hpcFR5cGU7XG59XG5cbmZ1bmN0aW9uIGlzUmVsYXRpb25zaGlwSW5mZXJyZWQocmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXAuaW5mZXJyZWQ7XG59XG5cbi8qKlxuICogUmV0cmlldmUgcGVvcGxlIGJ5IHJvbGUgaW4gcmVsYXRpb25zaGlwc1xuICovXG5mdW5jdGlvbiBnZXRQYXJlbnRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSB7XG4gIHZhciBwYXJlbnRJZCA9IHZvaWQgMDtcblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJykge1xuICAgIHBhcmVudElkID0gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQ7XG4gIH1cblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInKSB7XG4gICAgcGFyZW50SWQgPSByZWxhdGlvbnNoaXAucGVyc29uVG9JZDtcbiAgfVxuXG4gIGlmICghcGFyZW50SWQpIHtcbiAgICBjb25zb2xlLmxvZygnUGFyZW50IG5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXA6ICcsIHJlbGF0aW9uc2hpcCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudElkO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApIHtcbiAgdmFyIGNoaWxkSWQgPSB2b2lkIDA7XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicpIHtcbiAgICBjaGlsZElkID0gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQ7XG4gIH1cblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInKSB7XG4gICAgY2hpbGRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xuICB9XG5cbiAgaWYgKCFjaGlsZElkKSB7XG4gICAgY29uc29sZS5sb2coJ0NoaWxkIG5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXA6ICcsIHJlbGF0aW9uc2hpcCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkSWQ7XG59XG5cbmZ1bmN0aW9uIGdldFNpYmxpbmdJZEZyb21SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICBjb25zb2xlLmxvZygnUGVyc29uICcgKyBwZXJzb25JZCArICcgbm90IGZvdW5kIGluIHJlbGF0aW9uc2hpcDogJywgcmVsYXRpb25zaGlwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcmVsYXRpb25zaGlwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCA/ICdwZXJzb25Ub0lkJyA6ICdwZXJzb25Jc0lkJ107XG59XG5cbmZ1bmN0aW9uIGdldE90aGVyUGVyc29uSWRGcm9tUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCA/IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkIDogcmVsYXRpb25zaGlwLnBlcnNvbklzSWQ7XG59XG5cbmZ1bmN0aW9uIGdldEFsbFBhcmVudHNPZihwZXJzb25JZCkge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihpc0FDaGlsZEluUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKS5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBnZXRQZXJzb25Gcm9tTWVtYmVyKGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQoZ2V0UGFyZW50SWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkpKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEFsbENoaWxkcmVuT2YocGVyc29uSWQpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoaXNBUGFyZW50SW5SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQoZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSlbJ0BwZXJzb24nXTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFBlcnNvbklkRnJvbVBlcnNvbihwZXJzb24kJDEpIHtcbiAgcmV0dXJuIHBlcnNvbiQkMS5pZDtcbn1cblxuZnVuY3Rpb24gZ2V0UGVyc29uRnJvbU1lbWJlcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddO1xufVxuXG4vKipcbiAqIE1pc3NpbmcgcmVsYXRpb25zaGlwIGluZmVyZW5jZVxuICovXG52YXIgbWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZSA9IHtcbiAgc2libGluZ3NPZjogZnVuY3Rpb24gc2libGluZ3NPZihzdWJqZWN0TWVtYmVyKSB7XG5cbiAgICB2YXIgbWlzc2luZ1JlbGF0aW9uc2hpcHMgPSBbXSxcbiAgICAgICAgYWxsUmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKSxcbiAgICAgICAgcGVyc29uJCQxID0gZ2V0UGVyc29uRnJvbU1lbWJlcihzdWJqZWN0TWVtYmVyKSxcbiAgICAgICAgcGVyc29uSWQgPSBwZXJzb24kJDEuaWQsXG4gICAgICAgIHBhcmVudHMgPSBnZXRBbGxQYXJlbnRzT2YocGVyc29uSWQpLFxuICAgICAgICBzaWJsaW5nSWRzID0gYWxsUmVsYXRpb25zaGlwcy5maWx0ZXIoaXNBU2libGluZ0luUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKS5tYXAoZ2V0U2libGluZ0lkRnJvbVJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSk7XG5cbiAgICAvKipcbiAgICAgKiBJZiAyIHBhcmVudCByZWxhdGlvbnNoaXBzIG9mICdwZXJzb24nIGFyZSBmb3VuZCB3ZSBjYW4gYXR0ZW1wdCB0byBpbmZlclxuICAgICAqIHNpYmxpbmcgcmVsYXRpb25zaGlwc1xuICAgICAqL1xuICAgIGlmIChwYXJlbnRzLmxlbmd0aCA9PT0gMikge1xuXG4gICAgICBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmlsdGVyKGlzSG91c2Vob2xkTWVtYmVyKS5mb3JFYWNoKGZ1bmN0aW9uIChtZW1iZXIpIHtcblxuICAgICAgICB2YXIgbWVtYmVyUGVyc29uSWQgPSBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR3VhcmRcbiAgICAgICAgICogSWYgbWVtYmVyIGlzIHRoZSBzdWJqZWN0IG1lbWJlclxuICAgICAgICAgKiBvciBtZW1iZXIgaXMgYSBwYXJlbnRcbiAgICAgICAgICogb3IgbWVtYmVyIGFscmVhZHkgaGFzIGEgc2libGluZyByZWxhdGlvbnNoaXAgd2l0aCAncGVyc29uJ1xuICAgICAgICAgKiBza2lwIG1lbWJlclxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG1lbWJlclBlcnNvbklkID09PSBwZXJzb25JZCB8fCBtZW1iZXJQZXJzb25JZCA9PT0gcGFyZW50c1swXS5pZCB8fCBtZW1iZXJQZXJzb25JZCA9PT0gcGFyZW50c1sxXS5pZCB8fCBzaWJsaW5nSWRzLmluZGV4T2YobWVtYmVyUGVyc29uSWQpID4gLTEpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWVtYmVyUGFyZW50cyA9IGdldEFsbFBhcmVudHNPZihtZW1iZXJQZXJzb25JZCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIDIgcGFyZW50cyBvZiAnbWVtYmVyJyBhcmUgZm91bmRcbiAgICAgICAgICogYW5kIHRoZXkgYXJlIHRoZSBzYW1lIHBhcmVudHMgb2YgJ3BlcnNvbidcbiAgICAgICAgICogd2UgaGF2ZSBpZGVudGlmaWVkIGEgbWlzc2luZyBpbmZlcnJlZCByZWxhdGlvbnNoaXBcbiAgICAgICAgICovXG4gICAgICAgIGlmIChtZW1iZXJQYXJlbnRzLmxlbmd0aCA9PT0gMiAmJiBfJDEuZGlmZmVyZW5jZShwYXJlbnRzLm1hcChnZXRQZXJzb25JZEZyb21QZXJzb24pLCBtZW1iZXJQYXJlbnRzLm1hcChnZXRQZXJzb25JZEZyb21QZXJzb24pKS5sZW5ndGggPT09IDApIHtcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEFkZCB0byBtaXNzaW5nUmVsYXRpb25zaGlwc1xuICAgICAgICAgICAqL1xuICAgICAgICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBzLnB1c2gocmVsYXRpb25zaGlwKCdicm90aGVyLXNpc3RlcicsIHBlcnNvbklkLCBtZW1iZXJQZXJzb25JZCwge1xuICAgICAgICAgICAgaW5mZXJyZWQ6IHRydWUsXG4gICAgICAgICAgICBpbmZlcnJlZEJ5OiBbXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE11c3QgYmUgNCByZWxhdGlvbnNoaXBzXG4gICAgICAgICAgICAgKiBDb3VsZCBoYXZlIHVzZWQgbWVtYmVyJ3MgcGFyZW50cyBidXQgd2UgY2FuIGFzc3VtZSB0aGV5XG4gICAgICAgICAgICAgKiBtdXN0IGJlIHRoZSBzYW1lIGF0IHRoaXMgcG9pbnQgb3IgdGhlIGluZmVycmVuY2VcbiAgICAgICAgICAgICAqIGNvdWxkbid0IGhhcHBlbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0UmVsYXRpb25zaGlwT2YocGVyc29uSWQsIHBhcmVudHNbMF0uaWQpLmlkLCBnZXRSZWxhdGlvbnNoaXBPZihwZXJzb25JZCwgcGFyZW50c1sxXS5pZCkuaWQsIGdldFJlbGF0aW9uc2hpcE9mKG1lbWJlclBlcnNvbklkLCBwYXJlbnRzWzBdLmlkKS5pZCwgZ2V0UmVsYXRpb25zaGlwT2YobWVtYmVyUGVyc29uSWQsIHBhcmVudHNbMV0uaWQpLmlkXVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1pc3NpbmdSZWxhdGlvbnNoaXBzO1xuICB9XG59O1xuXG5mdW5jdGlvbiBpbmZlclJlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwLCBwZXJzb25JcywgcGVyc29uVG8pIHtcbiAgdmFyIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gW107XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicpIHtcbiAgICBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IG1pc3NpbmdSZWxhdGlvbnNoaXBzLmNvbmNhdChtaXNzaW5nUmVsYXRpb25zaGlwSW5mZXJlbmNlLnNpYmxpbmdzT2YocGVyc29uVG8pKTtcbiAgfVxuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicpIHtcbiAgICBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IG1pc3NpbmdSZWxhdGlvbnNoaXBzLmNvbmNhdChtaXNzaW5nUmVsYXRpb25zaGlwSW5mZXJlbmNlLnNpYmxpbmdzT2YocGVyc29uSXMpKTtcbiAgfVxuXG4gICQuZWFjaChtaXNzaW5nUmVsYXRpb25zaGlwcywgZnVuY3Rpb24gKGksIHJlbGF0aW9uc2hpcCkge1xuICAgIGFkZFJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZmluZE5leHRNaXNzaW5nUmVsYXRpb25zaGlwKCkge1xuICB2YXIgaG91c2Vob2xkTWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoaXNIb3VzZWhvbGRNZW1iZXIpLFxuICAgICAgcmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKSxcbiAgICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBNZW1iZXJzID0gW10sXG4gICAgICBwZXJzb25JcyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG5leHQgbWlzc2luZyByZWxhdGlvbnNoaXBcbiAgICovXG4gICQuZWFjaChob3VzZWhvbGRNZW1iZXJzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgdmFyIHBlcnNvbklkID0gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYWxsIHJlbGF0aW9uc2hpcHMgZm9yIHRoaXMgbWVtYmVyXG4gICAgICovXG4gICAgdmFyIG1lbWJlclJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZDtcbiAgICB9KSxcbiAgICAgICAgbWVtYmVyUmVsYXRpb25zaGlwVG9JZHMgPSBtZW1iZXJSZWxhdGlvbnNoaXBzLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkID8gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgOiByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbiAgICB9KSB8fCBbXTtcblxuICAgIC8qKlxuICAgICAqIElmIHRvdGFsIHJlbGF0aW9uc2hpcHMgcmVsYXRlZCB0byB0aGlzIG1lbWJlciBpc24ndCBlcXVhbCB0b1xuICAgICAqIHRvdGFsIGhvdXNlaG9sZCBtZW1iZXJzIC0xLCBpbmRpY2F0ZXMgbWlzc2luZyByZWxhdGlvbnNoaXBcbiAgICAgKi9cbiAgICBpZiAobWVtYmVyUmVsYXRpb25zaGlwcy5sZW5ndGggPCBob3VzZWhvbGRNZW1iZXJzLmxlbmd0aCAtIDEpIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBBbGwgbWlzc2luZyByZWxhdGlvbnNoaXAgbWVtYmVyc1xuICAgICAgICovXG4gICAgICBtaXNzaW5nUmVsYXRpb25zaGlwTWVtYmVycyA9IGhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHJldHVybiBtZW1iZXJSZWxhdGlvbnNoaXBUb0lkcy5pbmRleE9mKG1bJ0BwZXJzb24nXS5pZCkgPT09IC0xICYmIG1bJ0BwZXJzb24nXS5pZCAhPT0gcGVyc29uSWQ7XG4gICAgICB9KTtcblxuICAgICAgcGVyc29uSXMgPSBtZW1iZXI7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwZXJzb25JcyA/IHtcbiAgICBwZXJzb25JczogcGVyc29uSXMsXG4gICAgcGVyc29uVG86IG1pc3NpbmdSZWxhdGlvbnNoaXBNZW1iZXJzWzBdXG4gIH0gOiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRQZW9wbGVJZHNNaXNzaW5nUmVsYXRpb25zaGlwc1dpdGhQZXJzb24ocGVyc29uSWQpIHtcbiAgdmFyIHJlbWFpbmluZ1BlcnNvbklkcyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoaXNIb3VzZWhvbGRNZW1iZXIpLm1hcChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkO1xuICB9KTtcblxuICAvKipcbiAgICogUmVtb3ZlIHRoaXMgcGVyc29uIGZyb20gdGhlIGxpc3RcbiAgICovXG4gIHJlbW92ZUZyb21MaXN0KHJlbWFpbmluZ1BlcnNvbklkcywgcGVyc29uSWQpO1xuXG4gICQuZWFjaChnZXRBbGxSZWxhdGlvbnNoaXBzKCksIGZ1bmN0aW9uIChpLCByZWxhdGlvbnNoaXApIHtcbiAgICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIG90aGVyIHBlcnNvbiBmcm9tIHRoZSByZW1haW5pbmdQZXJzb25JZHMgbGlzdFxuICAgICAqL1xuICAgIHJlbW92ZUZyb21MaXN0KHJlbWFpbmluZ1BlcnNvbklkcywgZ2V0T3RoZXJQZXJzb25JZEZyb21SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpO1xuICB9KTtcblxuICByZXR1cm4gcmVtYWluaW5nUGVyc29uSWRzO1xufVxuXG5mdW5jdGlvbiBnZXRSZWxhdGlvbnNoaXBUeXBlKHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGU7XG59XG5cbi8qKlxuICogUmV0cmlldmUgZnJvbSByZWxhdGlvbnNoaXAgZ3JvdXBcbiAqL1xuZnVuY3Rpb24gZ2V0UmVsYXRpb25zaGlwc1dpdGhQZXJzb25JZHMocmVsYXRpb25zaGlwcywgaWRBcnIpIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcHMuZmlsdGVyKGZ1bmN0aW9uIChjaGlsZFJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBpZEFyci5pbmRleE9mKGNoaWxkUmVsYXRpb25zaGlwLnBlcnNvbklzSWQpICE9PSAtMSB8fCBpZEFyci5pbmRleE9mKGNoaWxkUmVsYXRpb25zaGlwLnBlcnNvblRvSWQpICE9PSAtMTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFJlbGF0aW9uc2hpcE9mKHBlcnNvbjEsIHBlcnNvbjIpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maW5kKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gaXNJblJlbGF0aW9uc2hpcChwZXJzb24xLCByZWxhdGlvbnNoaXApICYmIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uMiwgcmVsYXRpb25zaGlwKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldE5leHRQZXJzb25JZChwZXJzb24kJDEpIHtcbiAgaWYgKHBlcnNvbiQkMSA9PT0gJ3BlcnNvbl9tZScpIHtcbiAgICByZXR1cm4gJ3BlcnNvbjEnO1xuICB9IGVsc2Uge1xuICAgIHZhciBwZXJzb25JbnQgPSBwZXJzb24kJDEuc2xpY2UocGVyc29uJCQxLmxlbmd0aCAtIDEsIHBlcnNvbiQkMS5sZW5ndGgpO1xuICAgIHBlcnNvbkludCA9ICsrcGVyc29uSW50O1xuICAgIHJldHVybiAncGVyc29uJyArIHBlcnNvbkludDtcbiAgfVxufVxuXG52YXIgUEVSU09OQUxfREVUQUlMU19LRVkgPSAnaW5kaXZpZHVhbC1kZXRhaWxzJztcbnZhciBQRVJTT05BTF9QSU5TX0tFWSA9ICdpbmRpdmlkdWFsLXBpbnMnO1xuXG52YXIgcGVyc29uYWxEZXRhaWxzTWFyaXRhbFN0YXR1c01hcCA9IHtcbiAgJ25ldmVyJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTmV2ZXIgbWFycmllZCBhbmQgbmV2ZXIgcmVnaXN0ZXJlZCBhIHNhbWUtc2V4IGNpdmlsJyArICcgcGFydG5lcnNoaXAnXG4gIH0sXG4gICdtYXJyaWVkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTWFycmllZCdcbiAgfSxcbiAgJ3JlZ2lzdGVyZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdJbiBhIHJlZ2lzdGVyZWQgc2FtZS1zZXggY2l2aWwgcGFydG5lcnNoaXAnXG4gIH0sXG4gICdzZXBhcmF0ZWQtbWFycmllZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1NlcGFyYXRlZCwgYnV0IHN0aWxsIGxlZ2FsbHkgbWFycmllZCdcbiAgfSxcbiAgJ2Rpdm9yY2VkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRGl2b3JjZWQnXG4gIH0sXG4gICdmb3JtZXItcGFydG5lcnNoaXAnOiB7XG4gICAgZGVzY3JpcHRpb246ICdGb3JtZXJseSBpbiBhIHNhbWUtc2V4IGNpdmlsIHBhcnRuZXJzaGlwIHdoaWNoIGlzIG5vdycgKyAnIGxlZ2FsbHkgZGlzc29sdmVkJ1xuICB9LFxuICAnd2lkb3dlZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1dpZG93ZWQnXG4gIH0sXG4gICdzdXJ2aXZpbmctcGFydG5lcic6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1N1cnZpdmluZyBwYXJ0bmVyIGZyb20gYSBzYW1lLXNleCBjaXZpbCBwYXJ0bmVyc2hpcCdcbiAgfSxcbiAgJ3NlcGFyYXRlZC1wYXJ0bmVyc2hpcCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1NlcGFyYXRlZCwgYnV0IHN0aWxsIGxlZ2FsbHkgaW4gYSBzYW1lLXNleCBjaXZpbCBwYXJ0bmVyc2hpcCdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc0NvdW50cnlNYXAgPSB7XG4gICdlbmdsYW5kJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRW5nbGFuZCdcbiAgfSxcbiAgJ3dhbGVzJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnV2FsZXMnXG4gIH0sXG4gICdzY290bGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1Njb3RsYW5kJ1xuICB9LFxuICAnbm9ydGhlcm4taXJlbGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05vcnRoZXJuIElyZWxhbmQnXG4gIH0sXG4gICdyZXB1YmxpYy1pcmVsYW5kJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnUmVwdWJsaWMgb2YgSXJlbGFuZCdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc09yaWVudGF0aW9uTWFwID0ge1xuICAnc3RyYWlnaHQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTdHJhaWdodCBvciBIZXRlcm9zZXh1YWwnXG4gIH0sXG4gICdnYXknOiB7XG4gICAgZGVzY3JpcHRpb246ICdHYXkgb3IgTGVzYmlhbidcbiAgfSxcbiAgJ2Jpc2V4dWFsJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnQmlzZXh1YWwnXG4gIH0sXG4gICdvdGhlcic6IHtcbiAgICBkZXNjcmlwdGlvbjogJ090aGVyJ1xuICB9LFxuICAnbm8tc2F5Jzoge1xuICAgIGRlc2NyaXB0aW9uOiAnUHJlZmVyIG5vdCB0byBzYXknXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNHZW5kZXJNYXAgPSB7XG4gICdtYWxlJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTWFsZSdcbiAgfSxcbiAgJ2ZlbWFsZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0ZlbWFsZSdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc05hdGlvbmFsSWRlbnRpdHlNYXAgPSB7XG4gICdlbmdsaXNoJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRW5nbGlzaCdcbiAgfSxcbiAgJ3dlbHNoJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnV2Vsc2gnXG4gIH0sXG4gICdzY290dGlzaCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1Njb3R0aXNoJ1xuICB9LFxuICAnbm9ydGhlcm4taXJpc2gnOiB7XG4gICAgZGVzY3JpcHRpb246ICdOb3J0aGVybiBJcmlzaCdcbiAgfSxcbiAgJ2JyaXRpc2gnOiB7XG4gICAgZGVzY3JpcHRpb246ICdCcml0aXNoJ1xuICB9XG59O1xuXG52YXIgcGVyc29uYWxEZXRhaWxzUGFzc3BvcnRDb3VudHJpZXNNYXAgPSB7XG4gICd1bml0ZWQta2luZ2RvbSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1VuaXRlZCBLaW5nZG9tJ1xuICB9LFxuICAnaXJlbGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0lyZWxhbmQnXG4gIH0sXG4gICdub25lJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTm9uZSdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc0V0aG5pY0dyb3VwTWFwID0ge1xuICAnd2hpdGUnOiB7XG4gICAgJ3F1ZXN0aW9uJzogJ1doaXRlJyxcbiAgICAnb3B0aW9ucyc6IFt7XG4gICAgICB2YWw6ICdicml0aXNoJyxcbiAgICAgIGxhYmVsOiAnRW5nbGlzaCwgV2Vsc2gsIFNjb3R0aXNoLCBOb3J0aGVybiBJcmlzaCBvciBCcml0aXNoJ1xuICAgIH0sIHtcbiAgICAgIHZhbDogJ2lyaXNoJyxcbiAgICAgIGxhYmVsOiAnSXJpc2gnXG4gICAgfSwge1xuICAgICAgdmFsOiAnZ3lwc3knLFxuICAgICAgbGFiZWw6ICdHeXBzeSBvciBJcmlzaCBUcmF2ZWxlcidcbiAgICB9LCB7XG4gICAgICB2YWw6ICdyb21hJyxcbiAgICAgIGxhYmVsOiAnUm9tYSdcbiAgICB9LCB7XG4gICAgICB2YWw6ICdvdGhlcicsXG4gICAgICBsYWJlbDogJ0FueSBvdGhlciBXaGl0ZSBiYWNrZ3JvdW5kJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnWW91IGNhbiBlbnRlciBhbiBldGhuaWMgZ3JvdXAgb3IgYmFja2dyb3VuZCBvbiB0aGUgbmV4dCBxdWVzdGlvbidcbiAgICB9XVxuICB9LFxuICAnbWl4ZWQnOiB7XG4gICAgJ3F1ZXN0aW9uJzogJ01peGVkIG9yIE11bHRpcGxlJyxcbiAgICAnb3B0aW9ucyc6IFt7XG4gICAgICB2YWw6ICd3aGl0ZS1ibGFjay1jYXJpYmJlYW4nLFxuICAgICAgbGFiZWw6ICdXaGl0ZSBhbmQgQmxhY2sgQ2FyaWJiZWFuJ1xuICAgIH0sIHtcbiAgICAgIHZhbDogJ3doaXRlLWJsYWNrLWFmcmljYW4nLFxuICAgICAgbGFiZWw6ICdXaGl0ZSBhbmQgQmxhY2sgQWZyaWNhbidcbiAgICB9LCB7XG4gICAgICB2YWw6ICd3aGl0ZS1hc2lhbicsXG4gICAgICBsYWJlbDogJ1doaXRlIGFuZCBBc2lhbidcbiAgICB9LCB7XG4gICAgICB2YWw6ICdvdGhlcicsXG4gICAgICBsYWJlbDogJ0FueSBvdGhlciBNaXhlZCBvciBNdWx0aXBsZSBiYWNrZ3JvdW5kJ1xuICAgIH1dXG4gIH0sXG4gICdhc2lhbic6IHtcbiAgICAncXVlc3Rpb24nOiAnQXNpYW4gb3IgQXNpYW4gQnJpdGlzaCcsXG4gICAgJ29wdGlvbnMnOiBbe1xuICAgICAgdmFsOiAnaW5kaWFuJyxcbiAgICAgIGxhYmVsOiAnSW5kaWFuJ1xuICAgIH0sIHtcbiAgICAgIHZhbDogJ3Bha2lzdGFuaScsXG4gICAgICBsYWJlbDogJ1Bha2lzdGFuaSdcbiAgICB9LCB7XG4gICAgICB2YWw6ICdiYW5nbGFkZXNoaScsXG4gICAgICBsYWJlbDogJ0JhbmdsYWRlc2hpJ1xuICAgIH0sIHtcbiAgICAgIHZhbDogJ2NoaW5lc2UnLFxuICAgICAgbGFiZWw6ICdDaGluZXNlJ1xuICAgIH0sIHtcbiAgICAgIHZhbDogJ290aGVyJyxcbiAgICAgIGxhYmVsOiAnQW55IG90aGVyIEFzaWFuIGV0aG5pYyBncm91cCBvciBiYWNrZ3JvdW5kJ1xuICAgIH1dXG4gIH0sXG4gICdibGFjayc6IHtcbiAgICAncXVlc3Rpb24nOiAnQmxhY2ssIEFmcmljYW4sIENhcmliYmVhbiBvciBCbGFjayBCcml0aXNoJyxcbiAgICAnb3B0aW9ucyc6IFt7XG4gICAgICB2YWw6ICdhZnJpY2FuJyxcbiAgICAgIGxhYmVsOiAnQWZyaWNhbidcbiAgICB9LCB7XG4gICAgICB2YWw6ICdjYXJpYmJlYW4nLFxuICAgICAgbGFiZWw6ICdDYXJpYmJlYW4nXG4gICAgfSwge1xuICAgICAgdmFsOiAnb3RoZXInLFxuICAgICAgbGFiZWw6ICdBbnkgb3RoZXIgQmxhY2ssIEFmcmljYW4gb3IgQ2FyaWJiZWFuIGJhY2tncm91bmQnXG4gICAgfV1cbiAgfSxcbiAgJ290aGVyJzoge1xuICAgICdxdWVzdGlvbic6ICdPdGhlcicsXG4gICAgJ29wdGlvbnMnOiBbe1xuICAgICAgdmFsOiAnYXJhYicsXG4gICAgICBsYWJlbDogJ0FyYWInXG4gICAgfSwge1xuICAgICAgdmFsOiAnb3RoZXInLFxuICAgICAgbGFiZWw6ICdBbnkgb3RoZXIgZXRobmljIGdyb3VwJ1xuICAgIH1dXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNBcHByZW50aWNlc2hpcE1hcCA9IHtcbiAgJ3llcyc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1llcydcbiAgfSxcbiAgJ25vJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTm8nXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNEZWdyZWVBYm92ZU1hcCA9IHtcbiAgJ3llcyc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1llcydcbiAgfSxcbiAgJ25vJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTm8nXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNOVlFNYXAgPSB7XG4gICdudnEtbGV2ZWwtMSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05WUSBsZXZlbCAxIG9yIGVxdWl2YWxlbnQnXG4gIH0sXG4gICdudnEtbGV2ZWwtMic6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05WUSBsZXZlbCAyIG9yIGVxdWl2YWxlbnQnXG4gIH0sXG4gICdudnEtbGV2ZWwtMyc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05WUSBsZXZlbCAzIG9yIGVxdWl2YWxlbnQnXG4gIH0sXG4gICdub25lJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTm9uZSdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc0FMZXZlbE1hcCA9IHtcbiAgJ2EtbGV2ZWwtMic6IHtcbiAgICBkZXNjcmlwdGlvbjogJzIgb3IgbW9yZSBBIGxldmVscydcbiAgfSxcbiAgJ2EtbGV2ZWwtMS1idGVjJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnMSBBIGxldmVsJ1xuICB9LFxuICAnYS1sZXZlbC0xJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnMSBBUyBsZXZlbCdcbiAgfSxcbiAgJ2JhY2NhbGF1cmVhdGUnOiB7XG4gICAgZGVzY3JpcHRpb246ICdBZHZhbmNlZCBXZWxzaCBCYWNjYWxhdXJlYXRlJ1xuICB9LFxuICAnbm9uZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05vbmUnXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNHQ1NFTWFwID0ge1xuICAnZ2NzZS01Jzoge1xuICAgIGRlc2NyaXB0aW9uOiAnNSBvciBtb3JlIEdDU0VzIGdyYWRlcyBBKiB0byBDIG9yIDkgdG8gNCdcbiAgfSxcbiAgJ290aGVyLWdjc2VzJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnQW55IG90aGVyIEdDU0VzJ1xuICB9LFxuICAnYmFzaWMtc2tpbGxzJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnQmFzaWMgc2tpbGxzIGNvdXJzZSdcbiAgfSxcbiAgJ25hdGlvbmFsLWJhY2NhbGF1cmVhdGUnOiB7XG4gICAgZGVzY3JpcHRpb246ICdOYXRpb25hbCBXZWxzaCBCYWNjYWxhdXJlYXRlJ1xuICB9LFxuICAnZm91bmRhdGlvbi1iYWNjYWxhdXJlYXRlJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRm91bmRhdGlvbiBXZWxzaCBCYWNjYWxhdXJlYXRlJ1xuICB9LFxuICAnbm9uZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05vbmUgb2YgdGhlc2UgYXBwbHknXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNPdGhlcldoZXJlID0ge1xuICAnaW4tZW5nbGFuZC13YWxlcyc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1llcywgaW4gRW5nbGFuZCBvciBXYWxlcydcbiAgfSxcbiAgJ291dHNpZGUtZW5nbGFuZC13YWxlcyc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1llcywgYW55d2hlcmUgb3V0c2lkZSBvZiBFbmdsYW5kIGFuZCBXYWxlcydcbiAgfSxcbiAgJ25vbmUnOiB7XG4gICAgZGVzY3JpcHRpb246ICdObyBxdWFsaWZpY2F0aW9ucydcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc0VtcGxveW1lbnRTdGF0dXMgPSB7XG4gICdlbXBsb3llZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0VtcGxveWVlJ1xuICB9LFxuICAnZnJlZWxhbmNlLXdpdGhvdXQtZW1wbG95ZWVzJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnU2VsZi1lbXBsb3llZCBvciBmcmVlbGFuY2Ugd2l0aG91dCBlbXBsb3llZXMnXG4gIH0sXG4gICdmcmVlbGFuY2Utd2l0aC1lbXBsb3llZXMnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTZWxmLWVtcGxveWVkIHdpdGggZW1wbG95ZWVzJ1xuICB9LFxuICAnbm90LWVtcGxveWVkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTm90IGVtcGxveWVkJ1xuICB9XG59O1xuXG5mdW5jdGlvbiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBtdXRhdGlvbikge1xuICB2YXIgZGV0YWlscyA9IGdldFBlcnNvbmFsRGV0YWlsc0ZvcihwZXJzb25JZCk7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBfZXh0ZW5kcyh7fSwgZGV0YWlscywgbXV0YXRpb24oZGV0YWlscyB8fCB7fSkpKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlUGVyc29uYWxEZXRhaWxzRE9CKHBlcnNvbklkLCBkYXksIG1vbnRoLCB5ZWFyKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdkb2InOiB7XG4gICAgICAgIGRheTogZGF5LFxuICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgIHllYXI6IHllYXJcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlTWFyaXRhbFN0YXR1cyhwZXJzb25JZCwgdmFsKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdtYXJpdGFsU3RhdHVzJzogdmFsXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUNvdW50cnkocGVyc29uSWQsIHZhbCkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAnY291bnRyeSc6IHtcbiAgICAgICAgdmFsOiB2YWxcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlQ291bnRyeU90aGVyKHBlcnNvbklkLCBvdGhlclRleHQpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdjb3VudHJ5JzogX2V4dGVuZHMoe30sIGRldGFpbHNbJ2NvdW50cnknXSB8fCB7fSwge1xuICAgICAgICBvdGhlclRleHQ6IG90aGVyVGV4dFxuICAgICAgfSlcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlTmF0aW9uYWxJZGVudGl0eShwZXJzb25JZCwgY29sbGVjdGlvbiwgb3RoZXJUZXh0KSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICduYXRpb25hbC1pZGVudGl0eSc6IF9leHRlbmRzKHtcbiAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvblxuICAgICAgfSwgY29sbGVjdGlvbi5maW5kKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgcmV0dXJuIHZhbCA9PT0gJ290aGVyJztcbiAgICAgIH0pID8geyBvdGhlclRleHQ6IG90aGVyVGV4dCB9IDoge30pXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZU5hdGlvbmFsSWRlbnRpdHlPdGhlcihwZXJzb25JZCwgb3RoZXJUZXh0KSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoZGV0YWlscykge1xuICAgIHJldHVybiB7XG4gICAgICAnbmF0aW9uYWwtaWRlbnRpdHknOiBfZXh0ZW5kcyh7fSwgZGV0YWlsc1snbmF0aW9uYWwtaWRlbnRpdHknXSB8fCB7fSwgeyBvdGhlclRleHQ6IG90aGVyVGV4dCB9KVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVFdGhuaWNHcm91cChwZXJzb25JZCwgdmFsKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdldGhuaWMtZ3JvdXAnOiB7XG4gICAgICAgIHZhbDogdmFsXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUV0aG5pY0dyb3VwRGVzY3JpcHRpb24ocGVyc29uSWQsIGRlc2NyaXB0aW9uKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoZGV0YWlscykge1xuICAgIHJldHVybiB7XG4gICAgICAnZXRobmljLWdyb3VwJzogX2V4dGVuZHMoe30sIGRldGFpbHNbJ2V0aG5pYy1ncm91cCddIHx8IHt9LCB7IGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbiB9KVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVFdGhuaWNHcm91cE90aGVyKHBlcnNvbklkLCBvdGhlclRleHQpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdldGhuaWMtZ3JvdXAnOiBfZXh0ZW5kcyh7fSwgZGV0YWlsc1snZXRobmljLWdyb3VwJ10gfHwge30sIHsgb3RoZXJUZXh0OiBvdGhlclRleHQgfSlcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlUGFzc3BvcnRDb3VudHJ5KHBlcnNvbklkLCBjb3VudHJpZXMpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdwYXNzcG9ydCc6IF9leHRlbmRzKHt9LCBkZXRhaWxzWydwYXNzcG9ydCddIHx8IHt9LCB7XG4gICAgICAgIGNvdW50cmllczogY291bnRyaWVzXG4gICAgICB9KVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVQYXNzcG9ydENvdW50cnlPdGhlcihwZXJzb25JZCwgb3RoZXJUZXh0KSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoZGV0YWlscykge1xuICAgIHJldHVybiB7XG4gICAgICAncGFzc3BvcnQnOiBfZXh0ZW5kcyh7fSwgZGV0YWlsc1sncGFzc3BvcnQnXSB8fCB7fSwge1xuICAgICAgICBvdGhlclRleHQ6IG90aGVyVGV4dFxuICAgICAgfSlcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlT3JpZW50YXRpb24ocGVyc29uSWQsIHZhbCkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAnb3JpZW50YXRpb24nOiB2YWxcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlU2FsYXJ5KHBlcnNvbklkLCB2YWwpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3NhbGFyeSc6IHZhbFxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVTZXgocGVyc29uSWQsIHZhbCkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAnc2V4JzogdmFsXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUFkZHJlc3NXaGVyZShwZXJzb25JZCwgdmFsKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdhZGRyZXNzLXdoZXJlJzogdmFsXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUFnZShwZXJzb25JZCwgdmFsLCBfcmVmKSB7XG4gIHZhciBfcmVmJGlzQXBwcm94aW1hdGUgPSBfcmVmLmlzQXBwcm94aW1hdGUsXG4gICAgICBpc0FwcHJveGltYXRlID0gX3JlZiRpc0FwcHJveGltYXRlID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkaXNBcHByb3hpbWF0ZTtcblxuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAnYWdlJzoge1xuICAgICAgICB2YWw6IHZhbCxcbiAgICAgICAgaXNBcHByb3hpbWF0ZTogaXNBcHByb3hpbWF0ZVxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVBZ2VDb25maXJtKHBlcnNvbklkLCB2YWwpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2FnZS1jb25maXJtJzoge1xuICAgICAgICB2YWw6IHZhbFxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVBZGRyZXNzT3V0c2lkZVVLKHBlcnNvbklkLCB2YWwpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2FkZHJlc3Mtb3V0c2lkZS11ayc6IHZhbFxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVBZGRyZXNzSW5kaXZpZHVhbChwZXJzb25JZCwgdmFsKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdhZGRyZXNzJzogdmFsXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUFwcHJlbnRpY2VzaGlwKHBlcnNvbklkLCBoYXNBcHByZW50aWNlc2hpcCkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAnYXBwcmVudGljZXNoaXAnOiB7XG4gICAgICAgIGhhc0FwcHJlbnRpY2VzaGlwOiBoYXNBcHByZW50aWNlc2hpcFxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVIYXNRdWFsaWZpY2F0aW9uQWJvdmUocGVyc29uSWQsIGFib3ZlRGVncmVlKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoZGV0YWlscykge1xuICAgIHJldHVybiB7XG4gICAgICAncXVhbGlmaWNhdGlvbnMnOiBfZXh0ZW5kcyh7fSwgZGV0YWlsc1sncXVhbGlmaWNhdGlvbnMnXSB8fCB7fSwge1xuICAgICAgICBhYm92ZURlZ3JlZTogYWJvdmVEZWdyZWVcbiAgICAgIH0pXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZVF1YWxpZmljYXRpb25zTnZxRXF1aXZhbGVudChwZXJzb25JZCwgbnZxRXF1aXZhbGVudCkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKGRldGFpbHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3F1YWxpZmljYXRpb25zJzogX2V4dGVuZHMoe30sIGRldGFpbHNbJ3F1YWxpZmljYXRpb25zJ10gfHwge30sIHtcbiAgICAgICAgbnZxRXF1aXZhbGVudDogbnZxRXF1aXZhbGVudFxuICAgICAgfSlcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlUXVhbGlmaWNhdGlvbnNBTGV2ZWwocGVyc29uSWQsIGFMZXZlbHMpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdxdWFsaWZpY2F0aW9ucyc6IF9leHRlbmRzKHt9LCBkZXRhaWxzWydxdWFsaWZpY2F0aW9ucyddIHx8IHt9LCB7XG4gICAgICAgIGFMZXZlbHM6IGFMZXZlbHNcbiAgICAgIH0pXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZVF1YWxpZmljYXRpb25zR0NTRXMocGVyc29uSWQsIGdjc2VzKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoZGV0YWlscykge1xuICAgIHJldHVybiB7XG4gICAgICAncXVhbGlmaWNhdGlvbnMnOiBfZXh0ZW5kcyh7fSwgZGV0YWlsc1sncXVhbGlmaWNhdGlvbnMnXSB8fCB7fSwge1xuICAgICAgICBnY3NlczogZ2NzZXNcbiAgICAgIH0pXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZVF1YWxpZmljYXRpb25zT3RoZXJXaGVyZShwZXJzb25JZCwgb3RoZXJzV2hlcmUpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdxdWFsaWZpY2F0aW9ucyc6IF9leHRlbmRzKHt9LCBkZXRhaWxzWydxdWFsaWZpY2F0aW9ucyddIHx8IHt9LCB7XG4gICAgICAgIG90aGVyc1doZXJlOiBvdGhlcnNXaGVyZVxuICAgICAgfSlcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlRW1wbG95bWVudFN0YXR1cyhwZXJzb25JZCwgdmFsKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdlbXBsb3ltZW50LXN0YXR1cyc6IHtcbiAgICAgICAgdmFsOiB2YWxcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlSm9iVGl0bGUocGVyc29uSWQsIHZhbCkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAnam9iLXRpdGxlJzoge1xuICAgICAgICB2YWw6IHZhbFxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVKb2JEZXNjcmliZShwZXJzb25JZCwgdmFsKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdqb2ItZGVzY3JpYmUnOiB7XG4gICAgICAgIHZhbDogdmFsXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFBpbnMoKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEVSU09OQUxfUElOU19LRVkpKSB8fCB7fTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGluRm9yKHBlcnNvbklkKSB7XG4gIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICB2YXIgcGlucyA9IGdldFBpbnMoKTtcblxuICBwaW5zW3BlcnNvbklkXSA9IHtcbiAgICBwaW46IF8ucmFuZG9tKDEwMDAwLCA5OTk5OSksXG4gICAgZXhwb3J0ZWQ6ICEhb3B0cy5leHBvcnRlZFxuICB9O1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEVSU09OQUxfUElOU19LRVksIEpTT04uc3RyaW5naWZ5KHBpbnMpKTtcblxuICByZXR1cm4gcGluc1twZXJzb25JZF07XG59XG5cbmZ1bmN0aW9uIGdldFBpbkZvcihwZXJzb25JZCkge1xuICByZXR1cm4gZ2V0UGlucygpW3BlcnNvbklkXTtcbn1cblxuZnVuY3Rpb24gdW5zZXRQaW5Gb3IocGVyc29uSWQpIHtcbiAgdmFyIHBpbnMgPSBnZXRQaW5zKCk7XG5cbiAgZGVsZXRlIHBpbnNbcGVyc29uSWRdO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEVSU09OQUxfUElOU19LRVksIEpTT04uc3RyaW5naWZ5KHBpbnMpKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKSB7XG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEVSU09OQUxfREVUQUlMU19LRVksIEpTT04uc3RyaW5naWZ5KF9leHRlbmRzKHt9LCBnZXRBbGxQZXJzb25hbERldGFpbHMoKSwgZGVmaW5lUHJvcGVydHkoe30sIHBlcnNvbklkLCBkZXRhaWxzKSkpKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBFUlNPTkFMX0RFVEFJTFNfS0VZKSkgfHwge307XG59XG5cbmZ1bmN0aW9uIGdldFBlcnNvbmFsRGV0YWlsc0ZvcihwZXJzb25JZCkge1xuICB2YXIgc3RvcmFnZU9iaiA9IGdldEFsbFBlcnNvbmFsRGV0YWlscygpLFxuICAgICAgcGVyc29uT2JqID0gc3RvcmFnZU9ialtwZXJzb25JZF07XG5cbiAgaWYgKCFwZXJzb25PYmopIHtcbiAgICBjb25zb2xlLmxvZygnUGVyc29uYWwgZGV0YWlscyBmb3IgJyArIHBlcnNvbklkICsgJyBub3QgZm91bmQnKTtcbiAgfVxuXG4gIHJldHVybiBwZXJzb25PYmo7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVBlcnNvbmFsRGV0YWlsc0ZvcihwZXJzb25JZCkge1xuICB2YXIgc3RvcmFnZU9iaiA9IGdldEFsbFBlcnNvbmFsRGV0YWlscygpO1xuXG4gIGRlbGV0ZSBzdG9yYWdlT2JqW3BlcnNvbklkXTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX0RFVEFJTFNfS0VZLCBKU09OLnN0cmluZ2lmeShzdG9yYWdlT2JqKSk7XG59XG5cbmZ1bmN0aW9uIHBlcnNvbmFsQm9va21hcmsocGVyc29uSWQsIHBhZ2UpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ19ib29rbWFyayc6IHtcbiAgICAgICAgcGFnZTogcGFnZVxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRCb29rbWFya0ZvcihwZXJzb25JZCkge1xuICByZXR1cm4gZ2V0UGVyc29uYWxEZXRhaWxzRm9yKHBlcnNvbklkKVsnX2Jvb2ttYXJrJ10ucGFnZTtcbn1cblxuZnVuY3Rpb24gcGVyc29uYWxRdWVzdGlvblN1Ym1pdERlY29yYXRvcihwZXJzb25JZCwgY2FsbGJhY2ssIGUpIHtcbiAgdmFyIHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCksXG4gICAgICBpc0VkaXRpbmcgPSB1cmxQYXJhbXMuZ2V0KCdlZGl0Jyk7XG5cbiAgIWlzRWRpdGluZyA/IHBlcnNvbmFsQm9va21hcmsocGVyc29uSWQsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKSA6IGNsZWFyUGVyc29uYWxCb29rbWFyayhwZXJzb25JZCk7XG5cbiAgY2FsbGJhY2soZSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyUGVyc29uYWxCb29rbWFyayhwZXJzb25JZCkge1xuICB2YXIgZGV0YWlscyA9IGdldFBlcnNvbmFsRGV0YWlsc0ZvcihwZXJzb25JZCk7XG5cbiAgZGVsZXRlIGRldGFpbHMuX2Jvb2ttYXJrO1xuXG4gIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgX2V4dGVuZHMoe30sIGRldGFpbHMpKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuLyoqXG4gKiBDb3BpZWQgZnJvbTpcbiAqIGh0dHBzOi8vY29kZXJldmlldy5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvOTAzNDkvY2hhbmdpbmctbnVtYmVyLXRvLXdvcmRzLWluLWphdmFzY3JpcHRcbiAqID09PT09PT09PT09PT09PVxuICovXG52YXIgT05FX1RPX05JTkVURUVOID0gWydvbmUnLCAndHdvJywgJ3RocmVlJywgJ2ZvdXInLCAnZml2ZScsICdzaXgnLCAnc2V2ZW4nLCAnZWlnaHQnLCAnbmluZScsICd0ZW4nLCAnZWxldmVuJywgJ3R3ZWx2ZScsICd0aGlydGVlbicsICdmb3VydGVlbicsICdmaWZ0ZWVuJywgJ3NpeHRlZW4nLCAnc2V2ZW50ZWVuJywgJ2VpZ2h0ZWVuJywgJ25pbmV0ZWVuJ107XG5cbnZhciBURU5TID0gWyd0ZW4nLCAndHdlbnR5JywgJ3RoaXJ0eScsICdmb3J0eScsICdmaWZ0eScsICdzaXh0eScsICdzZXZlbnR5JywgJ2VpZ2h0eScsICduaW5ldHknXTtcblxudmFyIFNDQUxFUyA9IFsndGhvdXNhbmQnLCAnbWlsbGlvbicsICdiaWxsaW9uJywgJ3RyaWxsaW9uJ107XG5cbi8vIGhlbHBlciBmdW5jdGlvbiBmb3IgdXNlIHdpdGggQXJyYXkuZmlsdGVyXG5mdW5jdGlvbiBpc1RydXRoeShpdGVtKSB7XG4gIHJldHVybiAhIWl0ZW07XG59XG5cbi8vIGNvbnZlcnQgYSBudW1iZXIgaW50byAnY2h1bmtzJyBvZiAwLTk5OVxuZnVuY3Rpb24gY2h1bmsobnVtYmVyKSB7XG4gIHZhciB0aG91c2FuZHMgPSBbXTtcblxuICB3aGlsZSAobnVtYmVyID4gMCkge1xuICAgIHRob3VzYW5kcy5wdXNoKG51bWJlciAlIDEwMDApO1xuICAgIG51bWJlciA9IE1hdGguZmxvb3IobnVtYmVyIC8gMTAwMCk7XG4gIH1cblxuICByZXR1cm4gdGhvdXNhbmRzO1xufVxuXG4vLyB0cmFuc2xhdGUgYSBudW1iZXIgZnJvbSAxLTk5OSBpbnRvIEVuZ2xpc2hcbmZ1bmN0aW9uIGluRW5nbGlzaChudW1iZXIpIHtcbiAgdmFyIHRob3VzYW5kcyxcbiAgICAgIGh1bmRyZWRzLFxuICAgICAgdGVucyxcbiAgICAgIG9uZXMsXG4gICAgICB3b3JkcyA9IFtdO1xuXG4gIGlmIChudW1iZXIgPCAyMCkge1xuICAgIHJldHVybiBPTkVfVE9fTklORVRFRU5bbnVtYmVyIC0gMV07IC8vIG1heSBiZSB1bmRlZmluZWRcbiAgfVxuXG4gIGlmIChudW1iZXIgPCAxMDApIHtcbiAgICBvbmVzID0gbnVtYmVyICUgMTA7XG4gICAgdGVucyA9IG51bWJlciAvIDEwIHwgMDsgLy8gZXF1aXZhbGVudCB0byBNYXRoLmZsb29yKG51bWJlciAvIDEwKVxuXG4gICAgd29yZHMucHVzaChURU5TW3RlbnMgLSAxXSk7XG4gICAgd29yZHMucHVzaChpbkVuZ2xpc2gob25lcykpO1xuXG4gICAgcmV0dXJuIHdvcmRzLmZpbHRlcihpc1RydXRoeSkuam9pbignLScpO1xuICB9XG5cbiAgaHVuZHJlZHMgPSBudW1iZXIgLyAxMDAgfCAwO1xuICB3b3Jkcy5wdXNoKGluRW5nbGlzaChodW5kcmVkcykpO1xuICB3b3Jkcy5wdXNoKCdodW5kcmVkJyk7XG4gIHdvcmRzLnB1c2goaW5FbmdsaXNoKG51bWJlciAlIDEwMCkpO1xuXG4gIHJldHVybiB3b3Jkcy5maWx0ZXIoaXNUcnV0aHkpLmpvaW4oJyAnKTtcbn1cblxuLy8gYXBwZW5kIHRoZSB3b3JkIGZvciBhIHNjYWxlLiBNYWRlIGZvciB1c2Ugd2l0aCBBcnJheS5tYXBcbmZ1bmN0aW9uIGFwcGVuZFNjYWxlKGNodW5rLCBleHApIHtcbiAgdmFyIHNjYWxlO1xuICBpZiAoIWNodW5rKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgc2NhbGUgPSBTQ0FMRVNbZXhwIC0gMV07XG4gIHJldHVybiBbY2h1bmssIHNjYWxlXS5maWx0ZXIoaXNUcnV0aHkpLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiA9PT09PT09PT09PT09PT1cbiAqIEVuZCBjb3B5XG4gKi9cblxuLyoqXG4gKiBNb2RpZmljYXRpb24gLSBkZWNvcmF0b3JcbiAqL1xudmFyIE5VTUJFUl9UT19QT1NJVElPTl9URVhUX01BUCA9IHtcbiAgJ29uZSc6ICcxc3QnLFxuICAndHdvJzogJzJuZCcsXG4gICd0aHJlZSc6ICczcmQnLFxuICAnZm91cic6ICc0dGgnLFxuICAnZml2ZSc6ICc1dGgnLFxuICAnc2l4JzogJzZ0aCcsXG4gICdzZXZlbic6ICc3dGgnLFxuICAnZWlnaHQnOiAnOHRoJyxcbiAgJ25pbmUnOiAnOXRoJyxcbiAgJ3Rlbic6ICcxMHRoJyxcbiAgJ2VsZXZlbic6ICcxMXRoJyxcbiAgJ3R3ZWx2ZSc6ICcxMnRoJyxcbiAgJ3RoaXJ0ZWVuJzogJzEzdGgnLFxuICAnZm91cnRlZW4nOiAnMTR0aCcsXG4gICdmaWZ0ZWVuJzogJzE1dGgnLFxuICAnc2l4dGVlbic6ICcxNnRoJyxcbiAgJ3NldmVudGVlbic6ICcxN3RoJyxcbiAgJ2VpZ2h0ZWVuJzogJzE4dGgnLFxuICAnbmluZXRlZW4nOiAnMTl0aCcsXG5cbiAgJ3R3ZW50eSc6ICcyMHRoJyxcbiAgJ3RoaXJ0eSc6ICczMHRoJyxcbiAgJ2ZvcnR5JzogJzQwdGgnLFxuICAnZmlmdHknOiAnNTB0aCcsXG4gICdzaXh0eSc6ICc2MHRoJyxcbiAgJ3NldmVudHknOiAnNzB0aCcsXG4gICdlaWdodHknOiAnODB0aCcsXG4gICduaW5ldHknOiAnOTB0aCcsXG4gICdodW5kcmVkJzogJzEwMHRoJyxcblxuICAndGhvdXNhbmQnOiAndGhvdXNhbmR0aCcsXG4gICdtaWxsaW9uJzogJ21pbGxpb250aCcsXG4gICdiaWxsaW9uJzogJ2JpbGxpb250aCcsXG4gICd0cmlsbGlvbic6ICd0cmlsbGlvbnRoJ1xufTtcblxuZnVuY3Rpb24gbnVtYmVyVG9Qb3NpdGlvbldvcmQobnVtKSB7XG4gIHZhciBzdHIgPSBjaHVuayhudW0pLm1hcChpbkVuZ2xpc2gpLm1hcChhcHBlbmRTY2FsZSkuZmlsdGVyKGlzVHJ1dGh5KS5yZXZlcnNlKCkuam9pbignICcpO1xuXG4gIHZhciBzdWIgPSBzdHIuc3BsaXQoJyAnKSxcbiAgICAgIGxhc3RXb3JkRGFzaFNwbGl0QXJyID0gc3ViW3N1Yi5sZW5ndGggLSAxXS5zcGxpdCgnLScpLFxuICAgICAgbGFzdFdvcmQgPSBsYXN0V29yZERhc2hTcGxpdEFycltsYXN0V29yZERhc2hTcGxpdEFyci5sZW5ndGggLSAxXSxcbiAgICAgIG5ld0xhc3RXb3JkID0gKGxhc3RXb3JkRGFzaFNwbGl0QXJyLmxlbmd0aCA+IDEgPyBsYXN0V29yZERhc2hTcGxpdEFyclswXSArICctJyA6ICcnKSArIE5VTUJFUl9UT19QT1NJVElPTl9URVhUX01BUFtsYXN0V29yZF07XG5cbiAgLypjb25zb2xlLmxvZygnc3RyOicsIHN0cik7XG4gIGNvbnNvbGUubG9nKCdzdWI6Jywgc3ViKTtcbiAgY29uc29sZS5sb2coJ2xhc3RXb3JkRGFzaFNwbGl0QXJyOicsIGxhc3RXb3JkRGFzaFNwbGl0QXJyKTtcbiAgY29uc29sZS5sb2coJ2xhc3RXb3JkOicsIGxhc3RXb3JkKTtcbiAgY29uc29sZS5sb2coJ25ld0xhc3RXb3JkOicsIG5ld0xhc3RXb3JkKTsqL1xuXG4gIHZhciBzdWJDb3B5ID0gW10uY29uY2F0KHN1Yik7XG4gIHN1YkNvcHkucG9wKCk7XG4gIHZhciBwcmVmaXggPSBzdWJDb3B5LmpvaW4oJyAnKTtcbiAgdmFyIHJlc3VsdCA9IChwcmVmaXggPyBwcmVmaXggKyAnICcgOiAnJykgKyBuZXdMYXN0V29yZDtcblxuICAvLyBjb25zb2xlLmxvZygncmVzdWx0JywgKHByZWZpeCA/IHByZWZpeCArICcgJyA6ICcnKSArIG5ld0xhc3RXb3JkKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcHJlY2VkaW5nT3JkaW5hbFdvcmQobnVtYmVyKSB7XG4gIGlmIChudW1iZXIgPT09ICg4IHx8IDExIHx8IDE4KSkge1xuICAgIHJldHVybiAnYW4nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnYSc7XG4gIH1cbn1cblxuZnVuY3Rpb24gbnVtYmVyVG9Xb3Jkc1N0eWxlZ3VpZGUobnVtYmVyKSB7XG4gIGlmIChudW1iZXIgPiA5KSB7XG4gICAgcmV0dXJuIG51bWJlcjtcbiAgfVxuXG4gIHJldHVybiBPTkVfVE9fTklORVRFRU5bbnVtYmVyIC0gMV07XG59XG5cbmZ1bmN0aW9uIHRvb2xzKCkge1xuXG4gIHZhciAkbGlzdExpbmtzID0gJCgnLnRlc3QtZGF0YS1saW5rcycpLFxuICAgICAgJGNsZWFyRGF0YSA9ICQoJzxsaT48YSBocmVmPVwiI1wiIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDbGVhciBhbGwgZGF0YTwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseUhvdXNlaG9sZCA9ICQoJzxsaT48YSBocmVmPVwiI1wiIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDcmVhdGUgZmFtaWx5IGhvdXNlaG9sZDwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseVJlbGF0aW9uc2hpcHMgPSAkKCc8bGk+PGEgaHJlZj1cIiNcIicgKyAnIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDcmVhdGUgZmFtaWx5IHdpdGggcmVsYXRpb25zaGlwczwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzQW5kVmlzaXRvcnMgPSAkKCc8bGk+PGEgaHJlZj1cIiNcIicgKyAnIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDcmVhdGUgZmFtaWx5IHdpdGggcmVsYXRpb25zaGlwcyBhbmQgdmlzaXRvcnM8L2E+PC9saT4nKSxcbiAgICAgICRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc1BlcnNvbmFsRGV0YWlsc0FuZFZpc2l0b3JzID0gJCgnPGxpPjxhJyArICcgaHJlZj1cIiNcIicgKyAnIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDcmVhdGUgZmFtaWx5IHdpdGggcmVsYXRpb25zaGlwcywganVzdCBmYW1pbHkgaW5kaXZpZHVhbCByZXNwb25zZXMgYW5kJyArICcgdmlzaXRvcnM8L2E+PC9saT4nKSxcbiAgICAgICRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc1BlcnNvbmFsRGV0YWlsc0FuZFZpc2l0b3JzUGVyc29uYWxEZXRhaWxzID0gJCgnPGxpPjxhJyArICcgaHJlZj1cIiNcIicgKyAnIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDcmVhdGUgZmFtaWx5IHdpdGggcmVsYXRpb25zaGlwcywgZmFtaWx5IGluZGl2aWR1YWwgcmVzcG9uc2VzIGFuZCcgKyAnIHZpc2l0b3JzIGluZGl2aWR1YWwgcmVzcG9uc2VzPC9hPjwvbGk+JyksXG4gICAgICBmYW1pbHlIb3VzZWhvbGRNZW1iZXJzRGF0YSA9IFt7XG4gICAgJ3R5cGUnOiAnaG91c2Vob2xkLW1lbWJlcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnRGF2ZSAgSm9uZXMnLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdEYXZlJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbl9tZSdcbiAgICB9XG4gIH0sIHtcbiAgICAndHlwZSc6ICdob3VzZWhvbGQtbWVtYmVyJyxcbiAgICAnQHBlcnNvbic6IHtcbiAgICAgICdmdWxsTmFtZSc6ICdTYWxseSAgSm9uZXMnLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdTYWxseScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24xJ1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ2hvdXNlaG9sZC1tZW1iZXInLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ1JlYmVjY2EgIEpvbmVzJyxcbiAgICAgICdmaXJzdE5hbWUnOiAnUmViZWNjYScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24yJ1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ2hvdXNlaG9sZC1tZW1iZXInLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ0FteSBKb25lcycsXG4gICAgICAnZmlyc3ROYW1lJzogJ0FteScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24zJ1xuICAgIH1cbiAgfV0sXG4gICAgICB2aXNpdG9yc01lbWJlckRhdGEgPSBbe1xuICAgICd0eXBlJzogJ3Zpc2l0b3InLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ0dhcmV0aCBKb2huc29uJyxcbiAgICAgICdmaXJzdE5hbWUnOiAnR2FyZXRoJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9obnNvbicsXG4gICAgICAnaWQnOiAncGVyc29uNCdcbiAgICB9XG4gIH0sIHtcbiAgICAndHlwZSc6ICd2aXNpdG9yJyxcbiAgICAnQHBlcnNvbic6IHtcbiAgICAgICdmdWxsTmFtZSc6ICdKb2huIEhhbWlsdG9uJyxcbiAgICAgICdmaXJzdE5hbWUnOiAnSm9obicsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0hhbWlsdG9uJyxcbiAgICAgICdpZCc6ICdwZXJzb241J1xuICAgIH1cbiAgfV0sXG4gICAgICBmYW1pbHlIb3VzZWhvbGRSZWxhdGlvbnNoaXBzRGF0YSA9IFt7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnaHVzYmFuZC13aWZlJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24xJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb25fbWUnLFxuICAgICdpbmZlcnJlZCc6IGZhbHNlLFxuICAgICdpZCc6IDFcbiAgfSwge1xuICAgICdwZXJzb25Jc0Rlc2NyaXB0aW9uJzogJ3Nvbi1kYXVnaHRlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMicsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uX21lJyxcbiAgICAnaW5mZXJyZWQnOiBmYWxzZSxcbiAgICAnaWQnOiAyXG4gIH0sIHtcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdtb3RoZXItZmF0aGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb25fbWUnLFxuICAgICdwZXJzb25Ub0lkJzogJ3BlcnNvbjMnLFxuICAgICdpbmZlcnJlZCc6IGZhbHNlLFxuICAgICdpZCc6IDNcbiAgfSwge1xuICAgICdwZXJzb25Jc0Rlc2NyaXB0aW9uJzogJ3Nvbi1kYXVnaHRlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMicsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMScsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogNFxuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnbW90aGVyLWZhdGhlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMScsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMycsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogNVxuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnYnJvdGhlci1zaXN0ZXInLFxuICAgICdwZXJzb25Jc0lkJzogJ3BlcnNvbjMnLFxuICAgICdwZXJzb25Ub0lkJzogJ3BlcnNvbjInLFxuICAgICdpbmZlcnJlZCc6IHRydWUsXG4gICAgJ2luZmVycmVkQnknOiBbMywgNSwgMiwgNF0sXG4gICAgJ2lkJzogNlxuICB9XSxcbiAgICAgIGZhbWlseVBlcnNvbmFsRGV0YWlscyA9IHtcbiAgICAncGVyc29uX21lJzoge1xuICAgICAgJ2RvYic6IHtcbiAgICAgICAgJ2RheSc6ICcxNycsXG4gICAgICAgICdtb250aCc6ICc0JyxcbiAgICAgICAgJ3llYXInOiAnMTk2NydcbiAgICAgIH0sXG4gICAgICAnbWFyaXRhbFN0YXR1cyc6ICdtYXJyaWVkJyxcbiAgICAgICdjb3VudHJ5JzogJ3dhbGVzJyxcbiAgICAgICdvcmllbnRhdGlvbic6ICdzdHJhaWdodCcsXG4gICAgICAnc2FsYXJ5JzogJzQwMDAwJ1xuICAgIH0sXG4gICAgJ3BlcnNvbjEnOiB7XG4gICAgICAnZG9iJzogeyAnZGF5JzogJzAyJywgJ21vbnRoJzogJzEwJywgJ3llYXInOiAnMTk2NScgfSxcbiAgICAgICdtYXJpdGFsU3RhdHVzJzogJ21hcnJpZWQnLFxuICAgICAgJ2NvdW50cnknOiAnd2FsZXMnLFxuICAgICAgJ29yaWVudGF0aW9uJzogJ3N0cmFpZ2h0JyxcbiAgICAgICdzYWxhcnknOiAnNDAwMDAnXG4gICAgfSxcbiAgICAncGVyc29uMic6IHtcbiAgICAgICdkb2InOiB7ICdkYXknOiAnMjAnLCAnbW9udGgnOiAnNScsICd5ZWFyJzogJzE5ODEnIH0sXG4gICAgICAnbWFyaXRhbFN0YXR1cyc6ICduZXZlcicsXG4gICAgICAnY291bnRyeSc6ICd3YWxlcycsXG4gICAgICAnb3JpZW50YXRpb24nOiAnc3RyYWlnaHQnLFxuICAgICAgJ3NhbGFyeSc6ICcyMDAwMCdcbiAgICB9LFxuICAgICdwZXJzb24zJzoge1xuICAgICAgJ2RvYic6IHsgJ2RheSc6ICcxMScsICdtb250aCc6ICc3JywgJ3llYXInOiAnMTk4NCcgfSxcbiAgICAgICdtYXJpdGFsU3RhdHVzJzogJ25ldmVyJyxcbiAgICAgICdjb3VudHJ5JzogJ3dhbGVzJyxcbiAgICAgICdvcmllbnRhdGlvbic6ICdzdHJhaWdodCcsXG4gICAgICAnc2FsYXJ5JzogJzIwMDAwJ1xuICAgIH1cbiAgfSxcbiAgICAgIHZpc2l0b3JzUGVyc29uYWxEZXRhaWxzID0ge1xuICAgICdwZXJzb240Jzoge1xuICAgICAgJ3NleCc6ICdtYWxlJyxcbiAgICAgICdkb2InOiB7ICdkYXknOiAnMjAnLCAnbW9udGgnOiAnNycsICd5ZWFyJzogJzE5OTAnIH0sXG4gICAgICAnYWRkcmVzcy13aGVyZSc6ICdpbi11aycsXG4gICAgICAnYWRkcmVzcyc6IHtcbiAgICAgICAgJ2FkZHJlc3MtbGluZS0xJzogJzE1JyxcbiAgICAgICAgJ2FkZHJlc3MtbGluZS0yJzogJ1NvbWV3aGVyZSBuZWFyJyxcbiAgICAgICAgJ3Rvd24tY2l0eSc6ICdMbGFuZHJpZG5vZCcsXG4gICAgICAgICdjb3VudHknOiAnUG93eXMnLFxuICAgICAgICAncG9zdGNvZGUnOiAnTEwzNCBBTjUnXG4gICAgICB9XG4gICAgfSxcbiAgICAncGVyc29uNSc6IHtcbiAgICAgICdzZXgnOiAnbWFsZScsXG4gICAgICAnZG9iJzogeyAnZGF5JzogJzAyJywgJ21vbnRoJzogJzUnLCAneWVhcic6ICcxOTkxJyB9LFxuICAgICAgJ2FkZHJlc3Mtd2hlcmUnOiAnb3V0LXVrJyxcbiAgICAgICdhZGRyZXNzJzoge1xuICAgICAgICAnYWRkcmVzcy1saW5lLTEnOiAnOTQnLFxuICAgICAgICAnYWRkcmVzcy1saW5lLTInOiAnU29tZXdoZXJlIEZhcicsXG4gICAgICAgICd0b3duLWNpdHknOiAnU3ByaW5nZmllbGQnLFxuICAgICAgICAnY291bnR5JzogJ05ldyBZb3JrJyxcbiAgICAgICAgJ3Bvc3Rjb2RlJzogJ05ZMTBBJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgICAgIHVzZXJEYXRhID0ge1xuICAgICdmdWxsTmFtZSc6ICdEYXZlICBKb25lcycsXG4gICAgJ2ZpcnN0TmFtZSc6ICdEYXZlJyxcbiAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICdsYXN0TmFtZSc6ICdKb25lcydcbiAgfTtcblxuICAkY3JlYXRlRmFtaWx5SG91c2Vob2xkLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsZWFyU3RvcmFnZSgpO1xuICAgIHByZXJlcXVpc2l0ZXMoKTtcbiAgICBjcmVhdGVGYW1pbHlIb3VzZWhvbGQoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi9zdW1tYXJ5JztcbiAgfSk7XG5cbiAgJGNyZWF0ZUZhbWlseVJlbGF0aW9uc2hpcHMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xlYXJTdG9yYWdlKCk7XG4gICAgcHJlcmVxdWlzaXRlcygpO1xuICAgIGNyZWF0ZUZhbWlseUhvdXNlaG9sZCgpO1xuICAgIGNyZWF0ZUZhbWlseVJlbGF0aW9uc2hpcHMoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi9odWInO1xuICB9KTtcblxuICAkY3JlYXRlRmFtaWx5V2l0aFJlbGF0aW9uc2hpcHNBbmRWaXNpdG9ycy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICBwcmVyZXF1aXNpdGVzKCk7XG4gICAgY3JlYXRlRmFtaWx5SG91c2Vob2xkV2l0aFZpc2l0b3JzKCk7XG4gICAgY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL2h1Yic7XG4gIH0pO1xuXG4gICRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc1BlcnNvbmFsRGV0YWlsc0FuZFZpc2l0b3JzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsZWFyU3RvcmFnZSgpO1xuICAgIHByZXJlcXVpc2l0ZXMoKTtcbiAgICBjcmVhdGVGYW1pbHlIb3VzZWhvbGRXaXRoVmlzaXRvcnMoKTtcbiAgICBjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKCk7XG4gICAgY3JlYXRlRmFtaWx5UGVyc29uYWxEZXRhaWxzKCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vaHViJztcbiAgfSk7XG5cbiAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzUGVyc29uYWxEZXRhaWxzQW5kVmlzaXRvcnNQZXJzb25hbERldGFpbHMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xlYXJTdG9yYWdlKCk7XG4gICAgcHJlcmVxdWlzaXRlcygpO1xuICAgIGNyZWF0ZUZhbWlseUhvdXNlaG9sZFdpdGhWaXNpdG9ycygpO1xuICAgIGNyZWF0ZUZhbWlseVJlbGF0aW9uc2hpcHMoKTtcbiAgICBjcmVhdGVGYW1pbHlWaXNpdG9yc1BlcnNvbmFsRGV0YWlscygpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL2h1Yic7XG4gIH0pO1xuXG4gICRjbGVhckRhdGEub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xlYXJTdG9yYWdlKCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vdGVzdC1hZGRyZXNzJztcbiAgfSk7XG5cbiAgZnVuY3Rpb24gcHJlcmVxdWlzaXRlcygpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhZGRyZXNzJywgJzEyIFNvbWV3aGVyZSBDbG9zZSwgTmV3cG9ydCwgQ0YxMiAzQUInKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhZGRyZXNzLWxpbmUtMScsICcxMicpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2FkZHJlc3MtbGluZS0yJywgJ1NvbWV3aGVyZSBjbG9zZScpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2NvdW50eScsICdOZXdwb3J0Jyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnbGl2ZXMtaGVyZScsICd5ZXMnKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdwb3N0Y29kZScsICdDRjEyIDNBQicpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3Rvd24tY2l0eScsICdOZXdwb3J0Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGYW1pbHlIb3VzZWhvbGQoKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgndXNlci1kZXRhaWxzJywgSlNPTi5zdHJpbmdpZnkodXNlckRhdGEpKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLkhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShmYW1pbHlIb3VzZWhvbGRNZW1iZXJzRGF0YSkpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2hvdXNlaG9sZC1tZW1iZXJzLWluY3JlbWVudCcsIEpTT04uc3RyaW5naWZ5KDQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUZhbWlseUhvdXNlaG9sZFdpdGhWaXNpdG9ycygpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLkhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShbXS5jb25jYXQoZmFtaWx5SG91c2Vob2xkTWVtYmVyc0RhdGEsIHZpc2l0b3JzTWVtYmVyRGF0YSkpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUZhbWlseVJlbGF0aW9uc2hpcHMoKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5SRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShmYW1pbHlIb3VzZWhvbGRSZWxhdGlvbnNoaXBzRGF0YSkpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3JlbGF0aW9uc2hpcHMtaW5jcmVtZW50JywgSlNPTi5zdHJpbmdpZnkoNikpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5UGVyc29uYWxEZXRhaWxzKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0od2luZG93Lk9OUy5zdG9yYWdlLktFWVMuUEVSU09OQUxfREVUQUlMU19LRVksIEpTT04uc3RyaW5naWZ5KGZhbWlseVBlcnNvbmFsRGV0YWlscykpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5VmlzaXRvcnNQZXJzb25hbERldGFpbHMoKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5QRVJTT05BTF9ERVRBSUxTX0tFWSwgSlNPTi5zdHJpbmdpZnkoX2V4dGVuZHMoe30sIGZhbWlseVBlcnNvbmFsRGV0YWlscywgdmlzaXRvcnNQZXJzb25hbERldGFpbHMpKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhclN0b3JhZ2UoKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2UuY2xlYXIoKTtcbiAgfVxuXG4gICRsaXN0TGlua3MuYXBwZW5kKCRjbGVhckRhdGEpO1xufVxuXG4vKipcbiAqIExpYnJhcmllc1xuICovXG4vKipcbiAqIERPTSBtb2R1bGVzXG4gKi9cbnZhciBVU0VSX1NUT1JBR0VfS0VZID0gJ3VzZXItZGV0YWlscyc7XG52YXIgSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSA9ICdwcm94eS1wZXJzb24nO1xuXG5mdW5jdGlvbiBnZXRBZGRyZXNzKCkge1xuICB2YXIgYWRkcmVzc0xpbmVzID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYWRkcmVzcycpLnNwbGl0KCcsJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRyZXNzTGluZTE6IGFkZHJlc3NMaW5lc1swXSxcbiAgICBhZGRyZXNzTGluZTI6IGFkZHJlc3NMaW5lc1sxXSxcbiAgICBhZGRyZXNzTGluZTM6IGFkZHJlc3NMaW5lc1syXSxcbiAgICBhZGRyZXNzQ291bnR5OiBhZGRyZXNzTGluZXNbNF0sXG4gICAgYWRkcmVzc1Rvd25DaXR5OiBhZGRyZXNzTGluZXNbM10sXG4gICAgYWRkcmVzc1Bvc3Rjb2RlOiBhZGRyZXNzTGluZXNbNV1cbiAgfTtcbn1cblxuLyoqXG4gKiBVc2VyXG4gKi9cbmZ1bmN0aW9uIGFkZFVzZXJQZXJzb24ocGVyc29uJCQxKSB7XG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oVVNFUl9TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkocGVyc29uJCQxKSk7XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJQZXJzb24oKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oVVNFUl9TVE9SQUdFX0tFWSkpO1xufVxuXG4vKipcbiAqIEhlbHBlcnNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlTmF2SXRlbShtZW1iZXIpIHtcbiAgdmFyICRub2RlRWwgPSAkKCc8bGkgY2xhc3M9XCJqcy10ZW1wbGF0ZS1uYXYtaXRlbSBuYXZfX2l0ZW0gcGx1dG9cIj4nICsgJyAgPGEgY2xhc3M9XCJqcy10ZW1wbGF0ZS1uYXYtaXRlbS1sYWJlbCBuYXZfX2xpbmtcIiBocmVmPVwiI1wiPjwvYT4nICsgJzwvbGk+JyksXG4gICAgICAkbGlua0VsID0gJG5vZGVFbC5maW5kKCcuanMtdGVtcGxhdGUtbmF2LWl0ZW0tbGFiZWwnKTtcblxuICAkbGlua0VsLmh0bWwobWVtYmVyWydAcGVyc29uJ10uZnVsbE5hbWUpO1xuXG4gIGlmIChtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEKSB7XG4gICAgJGxpbmtFbC5hdHRyKCdocmVmJywgJy4uL3doYXQtaXMteW91ci1uYW1lJyk7XG4gIH0gZWxzZSB7XG4gICAgJGxpbmtFbC5hdHRyKCdocmVmJywgJy4uL3doby1lbHNlLXRvLWFkZD9lZGl0PScgKyBtZW1iZXJbJ0BwZXJzb24nXS5pZCk7XG4gIH1cblxuICByZXR1cm4gJG5vZGVFbDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSG91c2Vob2xkVmlzaXRvcnNOYXZpZ2F0aW9uSXRlbXMoKSB7XG4gIHZhciBhbGxIb3VzZWhvbGRNZW1iZXJzID0gd2luZG93Lk9OUy5zdG9yYWdlLmdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSxcbiAgICAgIGhvdXNlaG9sZE1lbWJlcnMgPSBhbGxIb3VzZWhvbGRNZW1iZXJzLmZpbHRlcih3aW5kb3cuT05TLnN0b3JhZ2UuaXNIb3VzZWhvbGRNZW1iZXIpLFxuICAgICAgdmlzaXRvcnMgPSBhbGxIb3VzZWhvbGRNZW1iZXJzLmZpbHRlcih3aW5kb3cuT05TLnN0b3JhZ2UuaXNWaXNpdG9yKTtcblxuICB2YXIgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwgPSAkKCcjbmF2aWdhdGlvbi1ob3VzZWhvbGQtbWVtYmVycycpLFxuICAgICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsID0gJCgnI25hdmlnYXRpb24tdmlzaXRvcnMnKTtcblxuICBpZiAoaG91c2Vob2xkTWVtYmVycy5sZW5ndGgpIHtcbiAgICAkLmVhY2goaG91c2Vob2xkTWVtYmVycywgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwuYXBwZW5kKGNyZWF0ZU5hdkl0ZW0obWVtYmVyKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwucGFyZW50KCkuaGlkZSgpO1xuICB9XG5cbiAgaWYgKHZpc2l0b3JzLmxlbmd0aCkge1xuICAgICQuZWFjaCh2aXNpdG9ycywgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsLmFwcGVuZChjcmVhdGVOYXZJdGVtKG1lbWJlcikpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgICRuYXZpZ2F0aW9uVmlzaXRvcnNFbC5wYXJlbnQoKS5oaWRlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlzdEl0ZW1QZXJzb24obWVtYmVyKSB7XG4gIHJldHVybiAkKCc8bGkgY2xhc3M9XCJsaXN0X19pdGVtXCI+JykuYWRkQ2xhc3MoJ21hcnMnKS5odG1sKCc8c3BhbiBjbGFzcz1cImxpc3RfX2l0ZW0tbmFtZVwiPicgKyBtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSArIChtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEID8gJycgOiAnJykgKyAnPC9zcGFuPicpO1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZUxpc3QoJGVsLCBtZW1iZXJUeXBlKSB7XG4gIGlmICghJGVsLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBtZW1iZXJzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHx8IFtdO1xuXG4gICRlbC5lbXB0eSgpLmFwcGVuZChtZW1iZXJzLmZpbHRlcihmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlci50eXBlID09PSBtZW1iZXJUeXBlO1xuICB9KS5tYXAoY3JlYXRlTGlzdEl0ZW1QZXJzb24pKTtcblxuICAkZWwuYWRkQ2xhc3MoJ2xpc3QgbGlzdC0tcGVvcGxlLXBsYWluJyk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlSG91c2Vob2xkTGlzdCgpIHtcbiAgcG9wdWxhdGVMaXN0KCQoJyNob3VzZWhvbGQtbWVtYmVycycpLCBIT1VTRUhPTERfTUVNQkVSX1RZUEUpO1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZVZpc2l0b3JMaXN0KCkge1xuICBwb3B1bGF0ZUxpc3QoJCgnI3Zpc2l0b3JzLWxpc3QnKSwgVklTSVRPUl9UWVBFKTtcbn1cblxuZnVuY3Rpb24gY2xlYW5IVE1MUGxhY2Vob2xkZXJTdHJpbmdSZXBsYWNtZW50KGVsLCB2YWwpIHtcbiAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgJHBhcmVudCA9ICRlbC5wYXJlbnQoKTtcblxuICAkZWwuYmVmb3JlKHZhbCk7XG4gICRlbC5yZW1vdmUoKTtcblxuICAkcGFyZW50Lmh0bWwoJHBhcmVudC5odG1sKCkucmVwbGFjZSgvW1xcc10rL2csICcgJykudHJpbSgpKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQWRkcmVzc2VzKCkge1xuICB2YXIgYWRkcmVzc0xpbmVzID0gKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2FkZHJlc3MnKSB8fCAnJykuc3BsaXQoJywnKSxcbiAgICAgIGFkZHJlc3NMaW5lMSA9IGFkZHJlc3NMaW5lc1swXSxcbiAgICAgIGFkZHJlc3NMaW5lMiA9IGFkZHJlc3NMaW5lc1sxXTtcblxuICAkKCcuYWRkcmVzcy10ZXh0JykuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICByZXR1cm4gY2xlYW5IVE1MUGxhY2Vob2xkZXJTdHJpbmdSZXBsYWNtZW50KGVsLCBhZGRyZXNzTGluZTEgJiYgYWRkcmVzc0xpbmUyID8gYWRkcmVzc0xpbmUxICsgKGFkZHJlc3NMaW5lMiA/ICcsICcgKyBhZGRyZXNzTGluZTIgOiAnJykgOiAnPGEgaHJlZj1cIi4uL3Rlc3QtYWRkcmVzc1wiPkFkZHJlc3Mgbm90IGZvdW5kPC9hPicpO1xuICB9KTtcblxuICAkKCcuYWRkcmVzcy10ZXh0LWxpbmUxJykuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICByZXR1cm4gY2xlYW5IVE1MUGxhY2Vob2xkZXJTdHJpbmdSZXBsYWNtZW50KGVsLCBhZGRyZXNzTGluZTEpO1xuICB9KTtcblxuICB2YXIgcGVyc29uSWQgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldCgncGVyc29uX2lkJyk7XG5cbiAgaWYgKHBlcnNvbklkKSB7XG4gICAgdmFyIF9wZXJzb24gPSBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKHBlcnNvbklkKVsnQHBlcnNvbiddLFxuICAgICAgICAkc2VjdGlvbkluZGl2aWR1YWxFbCA9ICQoJyNzZWN0aW9uLWluZGl2aWR1YWwnKSxcbiAgICAgICAgJG5hbWVFbCA9ICQoJy5qcy1wZXJzb24tZnVsbG5hbWUtZnJvbS11cmwtaWQnKTtcblxuICAgICRzZWN0aW9uSW5kaXZpZHVhbEVsLmxlbmd0aCAmJiBjbGVhbkhUTUxQbGFjZWhvbGRlclN0cmluZ1JlcGxhY21lbnQoJHNlY3Rpb25JbmRpdmlkdWFsRWwsIF9wZXJzb24uZnVsbE5hbWUpO1xuICAgICRuYW1lRWwubGVuZ3RoICYmIGNsZWFuSFRNTFBsYWNlaG9sZGVyU3RyaW5nUmVwbGFjbWVudCgkbmFtZUVsLCBfcGVyc29uLmZ1bGxOYW1lKTtcbiAgfVxufVxuXG52YXIgc2VjdXJlTGlua1RleHRNYXAgPSB7XG4gICdxdWVzdGlvbi15b3UnOiB7XG4gICAgZGVzY3JpcHRpb246ICdXYW50IHRvIGtlZXAgeW91ciBhbnN3ZXJzIHNlY3VyZSBmcm9tIG90aGVyIHBlb3BsZSBhdCB0aGlzJyArICcgYWRkcmVzcz8nLFxuICAgIGxpbmtUZXh0OiAnR2V0IGEgc2VwYXJhdGUgYWNjZXNzIGNvZGUgdG8gc3VibWl0IGFuIGluZGl2aWR1YWwgcmVzcG9uc2UnLFxuICAgIGxpbms6ICcuLi9pbmRpdmlkdWFsLWRlY2lzaW9uLXNlY3VyZSdcbiAgfSxcbiAgJ3Bpbi15b3UnOiB7XG4gICAgZGVzY3JpcHRpb246ICdZb3VcXCd2ZSBjaG9zZW4gdG8ga2VlcCB5b3VyIGFuc3dlcnMgc2VjdXJlJyxcbiAgICBsaW5rVGV4dDogJ0NhbmNlbCB0aGlzIGFuZCBtYWtlIGFuc3dlcnMgYXZhaWxhYmxlIHRvIHRoZSByZXN0IG9mIHRoZScgKyAnIGhvdXNlaG9sZCcsXG4gICAgbGluazogJy4uL2luZGl2aWR1YWwtZGVjaXNpb24tc2VjdXJlJ1xuICB9LFxuICAncXVlc3Rpb24tcHJveHknOiB7XG4gICAgZGVzY3JpcHRpb246ICdOb3QgaGFwcHkgdG8gY29udGludWUgYW5zd2VyaW5nIGZvciAkW05BTUVdPycsXG4gICAgbGlua1RleHQ6ICdSZXF1ZXN0IGFuIGluZGl2aWR1YWwgYWNjZXNzIGNvZGUgdG8gYmUgc2VudCB0byB0aGVtJyxcbiAgICBsaW5rOiAnLi4vaW5kaXZpZHVhbC1kZWNpc2lvbi1vdGhlci1zZWN1cmUnXG4gIH1cbn07XG5cbmZ1bmN0aW9uIHVwZGF0ZUFsbFByZXZpb3VzTGlua3MoKSB7XG4gICQoJy5qcy1wcmV2aW91cy1saW5rJykuYXR0cignaHJlZicsIGRvY3VtZW50LnJlZmVycmVyKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGVyc29uTGluaygpIHtcbiAgdmFyIHBlcnNvbklkID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKS5nZXQoJ3BlcnNvbl9pZCcpO1xuXG4gIGlmIChwZXJzb25JZCkge1xuICAgIHZhciB1cmxQYXJhbSA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCksXG4gICAgICAgIF9wZXJzb24yID0gZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZChwZXJzb25JZClbJ0BwZXJzb24nXSxcbiAgICAgICAgcGluT2JqID0gZ2V0UGluRm9yKHBlcnNvbklkKSxcbiAgICAgICAgc2VjdXJlTGlua1RleHRDb25maWcgPSBzZWN1cmVMaW5rVGV4dE1hcFtnZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eSgpID8gJ3F1ZXN0aW9uLXByb3h5JyA6IHBpbk9iaiAmJiBwaW5PYmoucGluID8gJ3Bpbi15b3UnIDogJ3F1ZXN0aW9uLXlvdSddLFxuICAgICAgICBsaW5rSHJlZiA9IHNlY3VyZUxpbmtUZXh0Q29uZmlnLmxpbmsgKyAnP3BlcnNvbl9pZD0nICsgcGVyc29uSWQgKyAnJnJldHVybnVybD0nICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgICBzdXJ2ZXlUeXBlID0gdXJsUGFyYW0uZ2V0KCdzdXJ2ZXknKTtcblxuICAgIGxpbmtIcmVmICs9IHN1cnZleVR5cGUgPyAnJnN1cnZleT0nICsgc3VydmV5VHlwZSA6ICcnO1xuXG4gICAgdmFyICRzZWN1cmVMaW5rID0gJCgnLmpzLWxpbmstc2VjdXJlJyk7XG4gICAgJHNlY3VyZUxpbmsuYXR0cignaHJlZicsIGxpbmtIcmVmKTtcblxuICAgICRzZWN1cmVMaW5rLmh0bWwoc2VjdXJlTGlua1RleHRDb25maWcubGlua1RleHQpO1xuICAgICQoJy5qcy1saW5rLXNlY3VyZS1sYWJlbCcpLmh0bWwoc2VjdXJlTGlua1RleHRDb25maWcuZGVzY3JpcHRpb24ucmVwbGFjZSgnJFtOQU1FXScsIF9wZXJzb24yLmZ1bGxOYW1lKSk7XG5cbiAgICB2YXIgcGVyc29uTGluayA9ICQoJy5qcy1saW5rLXBlcnNvbicpO1xuICAgIHBlcnNvbkxpbmsuYXR0cignaHJlZicsIHBlcnNvbkxpbmsuYXR0cignaHJlZicpICsgJz9wZXJzb25faWQ9JyArIHBlcnNvbklkICsgKHN1cnZleVR5cGUgPyAnJnN1cnZleT0nICsgc3VydmV5VHlwZSA6ICcnKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQnlTdXJ2ZXlUeXBlKCkge1xuICB2YXIgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSxcbiAgICAgIHN1cnZleVR5cGUgPSB1cmxQYXJhbXMuZ2V0KCdzdXJ2ZXknKTtcblxuICBpZiAoc3VydmV5VHlwZSkge1xuICAgICQoJy5qcy1oZWFkZXItdGl0bGUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0udGl0bGUpO1xuICAgICQoJyNwZW9wbGUtbGl2aW5nLWhlcmUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0uaG91c2Vob2xkU2VjdGlvblRpdGxlKTtcbiAgICAkKCcjcGVvcGxlLWxpdmluZy1oZXJlJykuYXR0cignaHJlZicsIHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0uaG91c2Vob2xkU2VjdGlvbkxpbmspO1xuICAgICQoJyNyZWxhdGlvbnNoaXBzLXNlY3Rpb24nKS5hdHRyKCdocmVmJywgc3VydmV5VHlwZUNvbmZpZ1tzdXJ2ZXlUeXBlXS5yZWxhdGlvbnNoaXBzU2VjdGlvbik7XG4gICAgJCgndGl0bGUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0udGl0bGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KGJvb2wpIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShib29sKSk7XG59XG5cbmZ1bmN0aW9uIGdldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKElORElWSURVQUxfUFJPWFlfU1RPUkFHRV9LRVkpKTtcbn1cblxuZnVuY3Rpb24gdW5zZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eSgpIHtcbiAgZ2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHkoKSAhPT0gbnVsbCAmJiBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKElORElWSURVQUxfUFJPWFlfU1RPUkFHRV9LRVkpO1xufVxuXG52YXIgc3VydmV5VHlwZUNvbmZpZyA9IHtcbiAgbG1zOiB7XG4gICAgdGl0bGU6ICdPbmxpbmUgSG91c2Vob2xkIFN0dWR5JyxcbiAgICBob3VzZWhvbGRTZWN0aW9uVGl0bGU6ICdBYm91dCB5b3VyIGhvdXNlaG9sZCcsXG4gICAgaG91c2Vob2xkU2VjdGlvbkxpbms6ICcuLi9zdW1tYXJ5Lz9zdXJ2ZXk9bG1zJyxcbiAgICByZWxhdGlvbnNoaXBzU2VjdGlvbjogJy4uL3JlbGF0aW9uc2hpcHMvP3N1cnZleT1sbXMnXG4gIH1cbn07XG5cbmZ1bmN0aW9uIGRvSUxpdmVIZXJlKCkge1xuICByZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnbGl2ZXMtaGVyZScpID09PSAneWVzJztcbn1cblxuZnVuY3Rpb24gZ2V0U2lnbmlmaWNhbnQoKSB7XG4gIHJldHVybiAnU3VuZGF5IDE1IE1hcmNoIDIwMjAnO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTaWduaWZpY2FudERhdGUoKSB7XG4gICQoJy5qcy1zaWduaWZpY2FudC1kYXRlJykuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICByZXR1cm4gY2xlYW5IVE1MUGxhY2Vob2xkZXJTdHJpbmdSZXBsYWNtZW50KGVsLCBnZXRTaWduaWZpY2FudCgpKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBlcnNvblJlY29yZFRlbXBsYXRlKCkge1xuICByZXR1cm4gJCgnPGxpIGlkPVwicGVyc29uLXJlY29yZC10ZW1wbGF0ZVwiIGNsYXNzPVwibGlzdF9faXRlbVwiPlxcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJsaXN0X19pdGVtLW5hbWUganMtcGVyc29uLW5hbWVcIj48L3NwYW4+XFxuICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdF9faXRlbS1hY3Rpb25zIHUtZnJcIj5cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImxpc3RfX2l0ZW0tYWN0aW9uXCI+XFxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtcmVjb3JkLWVkaXRcIiBocmVmPVwiI1wiPkNoYW5nZTwvYT5cXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJqcy1zcGFjZXJcIj58PC9zcGFuPlxcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLXJlY29yZC1yZW1vdmVcIiBocmVmPVwiI1wiPlJlbW92ZTwvYT5cXG4gICAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9saT4nKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWVtYmVySXRlbShtZW1iZXIpIHtcbiAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHsgcmVkaXJlY3Q6IG51bGwgfSxcbiAgICAgIHJlZGlyZWN0ID0gX3JlZi5yZWRpcmVjdDtcblxuICB2YXIgbm9FZGl0ID0gYXJndW1lbnRzWzJdO1xuXG4gIHZhciAkbm9kZUVsID0gcGVyc29uUmVjb3JkVGVtcGxhdGUoKSxcbiAgICAgICRlZGl0TGluayA9ICRub2RlRWwuZmluZCgnLmpzLXJlY29yZC1lZGl0JyksXG4gICAgICAkcmVtb3ZlTGluayA9ICRub2RlRWwuZmluZCgnLmpzLXJlY29yZC1yZW1vdmUnKSxcbiAgICAgICRzcGFjZXIgPSAkbm9kZUVsLmZpbmQoJy5qcy1zcGFjZXInKSxcbiAgICAgIHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCksXG4gICAgICBwZXJzb25OYW1lVGV4dCA9IG1lbWJlclsnQHBlcnNvbiddLmZ1bGxOYW1lLFxuICAgICAgbWVtYmVySXNVc2VyID0gaXNNZW1iZXJVc2VyKG1lbWJlciksXG4gICAgICBzdXJ2ZXlUeXBlID0gdXJsUGFyYW1zLmdldCgnc3VydmV5JyksXG4gICAgICBhbHRQYWdlID0gc3VydmV5VHlwZSAmJiBzdXJ2ZXlUeXBlID09PSAnbG1zJyA/IHN1cnZleVR5cGUgKyAnLycgOiAnJyxcbiAgICAgIHJlZGlyZWN0VG8gPSByZWRpcmVjdCA/ICcmcmVkaXJlY3Q9JyArIGVuY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaHJlZikgOiAnJztcblxuICBpZiAobm9FZGl0KSB7XG4gICAgJGVkaXRMaW5rLmhpZGUoKTtcbiAgICAkcmVtb3ZlTGluay5oaWRlKCk7XG4gICAgJHNwYWNlci5oaWRlKCk7XG4gIH0gZWxzZSBpZiAoIW5vRWRpdCAmJiBtZW1iZXJJc1VzZXIpIHtcbiAgICAkZWRpdExpbmsuaHRtbCgnQ2hhbmdlJyk7XG4gICAgJHJlbW92ZUxpbmsuaGlkZSgpO1xuICAgICRzcGFjZXIuaGlkZSgpO1xuICB9XG5cbiAgJG5vZGVFbC5hdHRyKCdpZCcsICcnKTtcbiAgJG5vZGVFbC5maW5kKCcuanMtcGVyc29uLW5hbWUnKS5odG1sKHBlcnNvbk5hbWVUZXh0KTtcblxuICAkZWRpdExpbmsuYXR0cignaHJlZicsIChtZW1iZXJJc1VzZXIgPyAnLi4vJyArIGFsdFBhZ2UgKyAnd2hhdC1pcy15b3VyLW5hbWUvP2VkaXQ9dHJ1ZScgOiAnLi4vJyArIGFsdFBhZ2UgKyAnd2hvLWVsc2UtdG8tYWRkLz9lZGl0PScgKyBtZW1iZXJbJ0BwZXJzb24nXS5pZCArIChpc1Zpc2l0b3IobWVtYmVyKSA/ICcmam91cm5leT12aXNpdG9ycycgOiAnJykpICsgcmVkaXJlY3RUbyk7XG5cbiAgJHJlbW92ZUxpbmsuYXR0cignaHJlZicsICcuLi9yZW1vdmUtaG91c2Vob2xkLW1lbWJlci8/cGVyc29uX2lkPScgKyBtZW1iZXJbJ0BwZXJzb24nXS5pZCArIHJlZGlyZWN0VG8pO1xuXG4gIHJldHVybiAkbm9kZUVsO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRTdW1tYXJ5KCkge1xuICB2YXIgbWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKTtcblxuICAkKCcuanMtaG91c2Vob2xkLW1lbWJlcnMtc3VtbWFyeScpLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgdmFyICRlbCA9ICQoZWwpO1xuXG4gICAgJC5lYWNoKFtdLmNvbmNhdCh0b0NvbnN1bWFibGVBcnJheShtZW1iZXJzLmZpbHRlcihpc01lbWJlclVzZXIpKSwgdG9Db25zdW1hYmxlQXJyYXkobWVtYmVycy5maWx0ZXIoaXNPdGhlckhvdXNlaG9sZE1lbWJlcikpKSwgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJGVsLmFwcGVuZChjcmVhdGVNZW1iZXJJdGVtKG1lbWJlciwgeyByZWRpcmVjdDogJGVsLmF0dHIoJ2RhdGEtcmVkaXJlY3QnKSB9KSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVWaXNpdG9yc1N1bW1hcnkoKSB7XG4gIHZhciBtZW1iZXJzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpO1xuXG4gICQoJy5qcy12aXNpdG9ycy1zdW1tYXJ5JykuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICB2YXIgJGVsID0gJChlbCk7XG5cbiAgICAkLmVhY2gobWVtYmVycy5maWx0ZXIoaXNWaXNpdG9yKSwgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJGVsLmFwcGVuZChjcmVhdGVNZW1iZXJJdGVtKG1lbWJlciwgeyByZWRpcmVjdDogJGVsLmF0dHIoJ2RhdGEtcmVkaXJlY3QnKSB9KSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDb250aW51ZU5vdGljZSgpIHtcbiAgdmFyIHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCksXG4gICAgICBpc0NvbnRpbnVpbmcgPSB1cmxQYXJhbXMuZ2V0KCdjb250aW51aW5nJyksXG4gICAgICBwZXJzb25JZCA9IHVybFBhcmFtcy5nZXQoJ3BlcnNvbl9pZCcpO1xuXG4gIGlmICghaXNDb250aW51aW5nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsaW5rID0gaXNWaXNpdG9yKG1lbWJlcikgPyAnLi4vdmlzaXRvci1pbnRyby8nIDogJy4uL2luZGl2aWR1YWwtaW50cm8vJztcbiAgdmFyIHRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC0tc2ltcGxlIHBhbmVsLS1pbmZvIHUtbWItc1wiPlxcbiAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbF9fYm9keVwiPlxcbiAgICAgICAgICA8c3Ryb25nPlRoaXMgd2FzIHRoZSBsYXN0IHVuYW5zd2VyZWQgcXVlc3Rpb25cXG4gICAgICAgICAgICAgIGluIHRoZSBzZWN0aW9uPC9zdHJvbmc+XFxuICAgICAgICAgIDxwPlxcbiAgICAgICAgICAgICAgPGEgaHJlZj1cIicgKyBsaW5rICsgJz9wZXJzb25faWQ9JyArIHBlcnNvbklkICsgJ1wiPkdvIHRvIHRoZSBzdGFydCBcXG4gICAgICAgICAgICAgIG9mIHRoaXMgc2VjdGlvbjwvYT5cXG4gICAgICAgICAgPC9wPlxcbiAgICAgIDwvZGl2PlxcbiAgPC9kaXY+JztcblxuICAkKCcuanMtaGVhZGluZycpLmNsb3Nlc3QoJy5xdWVzdGlvbicpLnByZXBlbmQodGVtcGxhdGUpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTYXZlQW5kQ29tcGxldGVMYXRlcigpIHtcbiAgJCgnLmNvbXBsZXRlLWxhdGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi9wb3N0LXN1Ym1pc3Npb24vP3JlZGlyZWN0PS4uL2h1Yic7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVGb29ydExpc3RDb2woKSB7XG4gICQoJy5qcy1mb290ZXItbGlzdC1jb2wnKS5hcHBlbmQoJzxsaT48YSBocmVmPVwiLi4vdGVzdC1kYXRhXCInICsgJyBjbGFzcz1cImZvb3Rlcl9fbGluayBmb290ZXJfX2xpbmstLWlubGluZSBnaG9zdC1saW5rIHUtZnJcIj5UZXN0JyArICcgZGF0YTwvYT48L2xpPicpO1xufVxuXG5mdW5jdGlvbiBpc01lbWJlclVzZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLklEUy5VU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ7XG59XG5cbmZ1bmN0aW9uIHNlc3Npb25Cb29rbWFyaygpIHtcbiAgdmFyIHBpZWNlcyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2Uod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCAnW2RlbGltZXRlcl0nKS5zcGxpdCgnW2RlbGltZXRlcl0nKTtcblxuICBwaWVjZXMuc2hpZnQoKTtcblxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC90ZXN0LWRhdGEvZykpIHtcbiAgICBjb25zb2xlLmxvZygnbWF0Y2gnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdfc2Vzc2lvbl9ib29rbWFyaycsIFtdLmNvbmNhdCh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsIHBpZWNlcykuam9pbignJykpO1xufVxuXG5mdW5jdGlvbiBmaWVsZEl0ZW1EaXNwbGF5SGFjaygpIHtcbiAgJCgnLmZpZWxkX19pdGVtJykuYWZ0ZXIoJzxiciAvPicpO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUlucHV0cyh0ZXN0RmFpbHMpIHtcbiAgdmFyIGlucHV0cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmlucHV0JykpO1xuICBpbnB1dHMuZmlsdGVyKGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dC5yZXF1aXJlZDtcbiAgfSkuZm9yRWFjaChmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICB2YXIgZXJyb3JCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtZXJyb3ItYm94JyksXG4gICAgICAgIGxpc3RJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLScgKyBpbnB1dC5pZCksXG4gICAgICAgIGFuc3dlciA9IGlucHV0LmNsb3Nlc3QoJy5xdWVzdGlvbl9fYW5zd2VyJyksXG4gICAgICAgIGZpZWxkID0gaW5wdXQuY2xvc2VzdCgnLmZpZWxkJyksXG4gICAgICAgIGVycm9yTXNnID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLWVycm9yLW1zZycpO1xuXG4gICAgaWYgKGlucHV0LnZhbHVlID09PSB0ZXN0RmFpbHMgfHwgdGVzdEZhaWxzID09PSB0cnVlKSB7XG4gICAgICBoYXNFcnJvcnMgPSB0cnVlO1xuICAgICAgaWYgKCFsaXN0SXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLXZpc2libGUnKSkge1xuICAgICAgICBlcnJvckJveC5jbGFzc0xpc3QucmVtb3ZlKCd1LWQtbm8nKTtcbiAgICAgICAgbGlzdEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgndS1kLW5vJyksIGxpc3RJdGVtLmNsYXNzTGlzdC5hZGQoJ2pzLXZpc2libGUnKTtcblxuICAgICAgICB2YXIgaW5wdXRFcnJvclBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyksXG4gICAgICAgICAgICBpbnB1dEVycm9yQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpLFxuICAgICAgICAgICAgaW5wdXRFcnJvclAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdQJyksXG4gICAgICAgICAgICBpbnB1dEVycm9yU3Ryb25nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnU1RST05HJyk7XG5cbiAgICAgICAgaW5wdXRFcnJvclBhbmVsLmNsYXNzTmFtZSA9ICdwYW5lbCBwYW5lbC0tZXJyb3IgcGFuZWwtLXNpbXBsZSc7XG4gICAgICAgIGlucHV0RXJyb3JCb2R5LmNsYXNzTmFtZSA9ICdwYW5lbF9fYm9keSc7XG4gICAgICAgIGlucHV0RXJyb3JQLmNsYXNzTmFtZSA9ICdwYW5lbF9fZXJyb3InO1xuXG4gICAgICAgIGlucHV0RXJyb3JTdHJvbmcuaW5uZXJUZXh0ID0gZXJyb3JNc2c7XG4gICAgICAgIGlucHV0RXJyb3JQLmFwcGVuZENoaWxkKGlucHV0RXJyb3JTdHJvbmcpO1xuICAgICAgICBpbnB1dEVycm9yQm9keS5hcHBlbmRDaGlsZChpbnB1dEVycm9yUCk7XG4gICAgICAgIGlucHV0RXJyb3JCb2R5LmFwcGVuZENoaWxkKGZpZWxkKTtcbiAgICAgICAgaW5wdXRFcnJvclBhbmVsLmFwcGVuZENoaWxkKGlucHV0RXJyb3JCb2R5KTtcbiAgICAgICAgYW5zd2VyLmFwcGVuZENoaWxkKGlucHV0RXJyb3JQYW5lbCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBlcnJvclBhbmVsID0gaW5wdXQuY2xvc2VzdCgnLnBhbmVsJyk7XG4gICAgICBpZiAoZXJyb3JQYW5lbCkge1xuICAgICAgICBsaXN0SXRlbS5jbGFzc0xpc3QuYWRkKCd1LWQtbm8nKSwgbGlzdEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnanMtdmlzaWJsZScpO1xuICAgICAgICBhbnN3ZXIuYXBwZW5kQ2hpbGQoZmllbGQpO1xuICAgICAgICBhbnN3ZXIucmVtb3ZlQ2hpbGQoZXJyb3JQYW5lbCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB2YXIgZXJyb3JzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdmlzaWJsZScpKS5sZW5ndGgsXG4gICAgICBwaXBpbmdEZXN0aW5hdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtcGlwaW5nJyk7XG5cbiAgcGlwaW5nRGVzdGluYXRpb25zLmZvckVhY2goZnVuY3Rpb24gKHBpcGluZ0Rlc3RpbmF0aW9uKSB7XG4gICAgcGlwaW5nRGVzdGluYXRpb24uaW5uZXJUZXh0ID0gcGlwaW5nRGVzdGluYXRpb24uaW5uZXJUZXh0LnJlcGxhY2UoJ3t4fScsIGVycm9ycykucmVwbGFjZSgne3N9JywgZXJyb3JzID4gMSA/ICdzJyA6ICcnKS5yZXBsYWNlKCcyJywgZXJyb3JzID09PSAxID8gXCIxXCIgOiBcIjJcIikucmVwbGFjZSgnMScsIGVycm9ycyA+IDEgPyBcIjJcIiA6IFwiMVwiKS5yZXBsYWNlKCdUaGlzJywgZXJyb3JzID4gMSA/IFwiVGhlc2VcIiA6IFwiVGhpc1wiKS5yZXBsYWNlKCdUaGVzZScsIGVycm9ycyA9PT0gMSA/IFwiVGhpc1wiIDogXCJUaGVzZVwiKTtcbiAgfSk7XG59XG5cbndpbmRvdy5PTlMgPSB3aW5kb3cuT05TIHx8IHt9O1xud2luZG93Lk9OUy5zdG9yYWdlID0ge1xuICBnZXRBZGRyZXNzOiBnZXRBZGRyZXNzLFxuICBhZGRIb3VzZWhvbGRNZW1iZXI6IGFkZEhvdXNlaG9sZE1lbWJlcixcbiAgdXBkYXRlSG91c2Vob2xkTWVtYmVyOiB1cGRhdGVIb3VzZWhvbGRNZW1iZXIsXG4gIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcjogZGVsZXRlSG91c2Vob2xkTWVtYmVyLFxuICBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzOiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzLFxuICBhZGRVc2VyUGVyc29uOiBhZGRVc2VyUGVyc29uLFxuICBnZXRVc2VyUGVyc29uOiBnZXRVc2VyUGVyc29uLFxuICBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZDogZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZCxcbiAgZ2V0TWVtYmVyUGVyc29uSWQ6IGdldE1lbWJlclBlcnNvbklkLFxuICB1cGRhdGVVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZGVsZXRlVXNlckFzSG91c2Vob2xkTWVtYmVyOiBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIsXG4gIHRlbXBBd2F5UXVlc3Rpb25TZW50ZW5jZU1hcDogdGVtcEF3YXlRdWVzdGlvblNlbnRlbmNlTWFwLFxuICB2aXNpdG9yUXVlc3Rpb25TZW50ZW5jZU1hcDogdmlzaXRvclF1ZXN0aW9uU2VudGVuY2VNYXAsXG5cbiAgaXNWaXNpdG9yOiBpc1Zpc2l0b3IsXG4gIGlzT3RoZXJIb3VzZWhvbGRNZW1iZXI6IGlzT3RoZXJIb3VzZWhvbGRNZW1iZXIsXG4gIGlzSG91c2Vob2xkTWVtYmVyOiBpc0hvdXNlaG9sZE1lbWJlcixcblxuICBhZGRSZWxhdGlvbnNoaXA6IGFkZFJlbGF0aW9uc2hpcCxcbiAgZGVsZXRlUmVsYXRpb25zaGlwOiBkZWxldGVSZWxhdGlvbnNoaXAsXG4gIGVkaXRSZWxhdGlvbnNoaXA6IGVkaXRSZWxhdGlvbnNoaXAsXG4gIGdldEFsbFJlbGF0aW9uc2hpcHM6IGdldEFsbFJlbGF0aW9uc2hpcHMsXG4gIGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHM6IGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHMsXG4gIGdldE5leHRQZXJzb25JZDogZ2V0TmV4dFBlcnNvbklkLFxuICBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyOiBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyLFxuXG4gIGdldEFsbFBhcmVudHNPZjogZ2V0QWxsUGFyZW50c09mLFxuICBnZXRBbGxDaGlsZHJlbk9mOiBnZXRBbGxDaGlsZHJlbk9mLFxuICBnZXRQYXJlbnRJZEZyb21SZWxhdGlvbnNoaXA6IGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcCxcbiAgZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXA6IGdldENoaWxkSWRGcm9tUmVsYXRpb25zaGlwLFxuICBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcDogZ2V0T3RoZXJQZXJzb25JZEZyb21SZWxhdGlvbnNoaXAsXG4gIGlzQVBhcmVudEluUmVsYXRpb25zaGlwOiBpc0FQYXJlbnRJblJlbGF0aW9uc2hpcCxcbiAgaXNBQ2hpbGRJblJlbGF0aW9uc2hpcDogaXNBQ2hpbGRJblJlbGF0aW9uc2hpcCxcbiAgaXNJblJlbGF0aW9uc2hpcDogaXNJblJlbGF0aW9uc2hpcCxcbiAgYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudDogYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudCxcbiAgaXNSZWxhdGlvbnNoaXBUeXBlOiBpc1JlbGF0aW9uc2hpcFR5cGUsXG4gIGlzUmVsYXRpb25zaGlwSW5mZXJyZWQ6IGlzUmVsYXRpb25zaGlwSW5mZXJyZWQsXG4gIGdldFJlbGF0aW9uc2hpcE9mOiBnZXRSZWxhdGlvbnNoaXBPZixcblxuICByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcDogcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXAsXG4gIHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXM6IHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXMsXG4gIG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2U6IG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2UsXG4gIGluZmVyUmVsYXRpb25zaGlwczogaW5mZXJSZWxhdGlvbnNoaXBzLFxuICBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkczogZ2V0UmVsYXRpb25zaGlwc1dpdGhQZXJzb25JZHMsXG4gIGdldFBlb3BsZUlkc01pc3NpbmdSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbjogZ2V0UGVvcGxlSWRzTWlzc2luZ1JlbGF0aW9uc2hpcHNXaXRoUGVyc29uLFxuICBnZXRSZWxhdGlvbnNoaXBUeXBlOiBnZXRSZWxhdGlvbnNoaXBUeXBlLFxuICBmaW5kTmV4dE1pc3NpbmdSZWxhdGlvbnNoaXA6IGZpbmROZXh0TWlzc2luZ1JlbGF0aW9uc2hpcCxcblxuICBhZGRVcGRhdGVQZXJzb25hbERldGFpbHNET0I6IGFkZFVwZGF0ZVBlcnNvbmFsRGV0YWlsc0RPQixcbiAgZ2V0UGVyc29uYWxEZXRhaWxzRm9yOiBnZXRQZXJzb25hbERldGFpbHNGb3IsXG4gIHJlbW92ZVBlcnNvbmFsRGV0YWlsc0ZvcjogcmVtb3ZlUGVyc29uYWxEZXRhaWxzRm9yLFxuICBhZGRVcGRhdGVNYXJpdGFsU3RhdHVzOiBhZGRVcGRhdGVNYXJpdGFsU3RhdHVzLFxuICBhZGRVcGRhdGVDb3VudHJ5OiBhZGRVcGRhdGVDb3VudHJ5LFxuICBhZGRVcGRhdGVDb3VudHJ5T3RoZXI6IGFkZFVwZGF0ZUNvdW50cnlPdGhlcixcbiAgYWRkVXBkYXRlTmF0aW9uYWxJZGVudGl0eTogYWRkVXBkYXRlTmF0aW9uYWxJZGVudGl0eSxcbiAgYWRkVXBkYXRlTmF0aW9uYWxJZGVudGl0eU90aGVyOiBhZGRVcGRhdGVOYXRpb25hbElkZW50aXR5T3RoZXIsXG4gIGFkZFVwZGF0ZUV0aG5pY0dyb3VwOiBhZGRVcGRhdGVFdGhuaWNHcm91cCxcbiAgYWRkVXBkYXRlRXRobmljR3JvdXBEZXNjcmlwdGlvbjogYWRkVXBkYXRlRXRobmljR3JvdXBEZXNjcmlwdGlvbixcbiAgYWRkVXBkYXRlRXRobmljR3JvdXBPdGhlcjogYWRkVXBkYXRlRXRobmljR3JvdXBPdGhlcixcbiAgYWRkVXBkYXRlUGFzc3BvcnRDb3VudHJ5OiBhZGRVcGRhdGVQYXNzcG9ydENvdW50cnksXG4gIGFkZFVwZGF0ZVBhc3Nwb3J0Q291bnRyeU90aGVyOiBhZGRVcGRhdGVQYXNzcG9ydENvdW50cnlPdGhlcixcbiAgYWRkVXBkYXRlT3JpZW50YXRpb246IGFkZFVwZGF0ZU9yaWVudGF0aW9uLFxuICBhZGRVcGRhdGVTYWxhcnk6IGFkZFVwZGF0ZVNhbGFyeSxcbiAgYWRkVXBkYXRlU2V4OiBhZGRVcGRhdGVTZXgsXG4gIGFkZFVwZGF0ZUFkZHJlc3NXaGVyZTogYWRkVXBkYXRlQWRkcmVzc1doZXJlLFxuICBhZGRVcGRhdGVBZGRyZXNzSW5kaXZpZHVhbDogYWRkVXBkYXRlQWRkcmVzc0luZGl2aWR1YWwsXG4gIGFkZFVwZGF0ZUFnZTogYWRkVXBkYXRlQWdlLFxuICBhZGRVcGRhdGVBZ2VDb25maXJtOiBhZGRVcGRhdGVBZ2VDb25maXJtLFxuICBhZGRVcGRhdGVBZGRyZXNzT3V0c2lkZVVLOiBhZGRVcGRhdGVBZGRyZXNzT3V0c2lkZVVLLFxuICBhZGRVcGRhdGVBcHByZW50aWNlc2hpcDogYWRkVXBkYXRlQXBwcmVudGljZXNoaXAsXG4gIGFkZFVwZGF0ZUhhc1F1YWxpZmljYXRpb25BYm92ZTogYWRkVXBkYXRlSGFzUXVhbGlmaWNhdGlvbkFib3ZlLFxuICBhZGRVcGRhdGVRdWFsaWZpY2F0aW9uc052cUVxdWl2YWxlbnQ6IGFkZFVwZGF0ZVF1YWxpZmljYXRpb25zTnZxRXF1aXZhbGVudCxcbiAgYWRkVXBkYXRlUXVhbGlmaWNhdGlvbnNBTGV2ZWw6IGFkZFVwZGF0ZVF1YWxpZmljYXRpb25zQUxldmVsLFxuICBhZGRVcGRhdGVRdWFsaWZpY2F0aW9uc0dDU0VzOiBhZGRVcGRhdGVRdWFsaWZpY2F0aW9uc0dDU0VzLFxuICBhZGRVcGRhdGVRdWFsaWZpY2F0aW9uc090aGVyV2hlcmU6IGFkZFVwZGF0ZVF1YWxpZmljYXRpb25zT3RoZXJXaGVyZSxcbiAgYWRkVXBkYXRlRW1wbG95bWVudFN0YXR1czogYWRkVXBkYXRlRW1wbG95bWVudFN0YXR1cyxcbiAgYWRkVXBkYXRlSm9iVGl0bGU6IGFkZFVwZGF0ZUpvYlRpdGxlLFxuICBhZGRVcGRhdGVKb2JEZXNjcmliZTogYWRkVXBkYXRlSm9iRGVzY3JpYmUsXG5cbiAgcGVyc29uYWxEZXRhaWxzTWFyaXRhbFN0YXR1c01hcDogcGVyc29uYWxEZXRhaWxzTWFyaXRhbFN0YXR1c01hcCxcbiAgcGVyc29uYWxEZXRhaWxzQ291bnRyeU1hcDogcGVyc29uYWxEZXRhaWxzQ291bnRyeU1hcCxcbiAgcGVyc29uYWxEZXRhaWxzT3JpZW50YXRpb25NYXA6IHBlcnNvbmFsRGV0YWlsc09yaWVudGF0aW9uTWFwLFxuICBwZXJzb25hbERldGFpbHNHZW5kZXJNYXA6IHBlcnNvbmFsRGV0YWlsc0dlbmRlck1hcCxcbiAgcGVyc29uYWxEZXRhaWxzTmF0aW9uYWxJZGVudGl0eU1hcDogcGVyc29uYWxEZXRhaWxzTmF0aW9uYWxJZGVudGl0eU1hcCxcbiAgcGVyc29uYWxEZXRhaWxzRXRobmljR3JvdXBNYXA6IHBlcnNvbmFsRGV0YWlsc0V0aG5pY0dyb3VwTWFwLFxuICBwZXJzb25hbERldGFpbHNQYXNzcG9ydENvdW50cmllc01hcDogcGVyc29uYWxEZXRhaWxzUGFzc3BvcnRDb3VudHJpZXNNYXAsXG4gIHBlcnNvbmFsRGV0YWlsc0FwcHJlbnRpY2VzaGlwTWFwOiBwZXJzb25hbERldGFpbHNBcHByZW50aWNlc2hpcE1hcCxcbiAgcGVyc29uYWxEZXRhaWxzRGVncmVlQWJvdmVNYXA6IHBlcnNvbmFsRGV0YWlsc0RlZ3JlZUFib3ZlTWFwLFxuICBwZXJzb25hbERldGFpbHNOVlFNYXA6IHBlcnNvbmFsRGV0YWlsc05WUU1hcCxcbiAgcGVyc29uYWxEZXRhaWxzQUxldmVsTWFwOiBwZXJzb25hbERldGFpbHNBTGV2ZWxNYXAsXG4gIHBlcnNvbmFsRGV0YWlsc0dDU0VNYXA6IHBlcnNvbmFsRGV0YWlsc0dDU0VNYXAsXG4gIHBlcnNvbmFsRGV0YWlsc090aGVyV2hlcmU6IHBlcnNvbmFsRGV0YWlsc090aGVyV2hlcmUsXG4gIHBlcnNvbmFsRGV0YWlsc0VtcGxveW1lbnRTdGF0dXM6IHBlcnNvbmFsRGV0YWlsc0VtcGxveW1lbnRTdGF0dXMsXG5cbiAgY3JlYXRlUGluRm9yOiBjcmVhdGVQaW5Gb3IsXG4gIGdldFBpbkZvcjogZ2V0UGluRm9yLFxuICB1bnNldFBpbkZvcjogdW5zZXRQaW5Gb3IsXG4gIHBlcnNvbmFsQm9va21hcms6IHBlcnNvbmFsQm9va21hcmssXG4gIGdldEJvb2ttYXJrRm9yOiBnZXRCb29rbWFya0ZvcixcbiAgY2xlYXJQZXJzb25hbEJvb2ttYXJrOiBjbGVhclBlcnNvbmFsQm9va21hcmssXG4gIHBlcnNvbmFsUXVlc3Rpb25TdWJtaXREZWNvcmF0b3I6IHBlcnNvbmFsUXVlc3Rpb25TdWJtaXREZWNvcmF0b3IsXG5cbiAgc2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHk6IHNldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5LFxuICBnZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eTogZ2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHksXG4gIHVuc2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHk6IHVuc2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHksXG5cbiAgZG9JTGl2ZUhlcmU6IGRvSUxpdmVIZXJlLFxuICBpc01lbWJlclVzZXI6IGlzTWVtYmVyVXNlcixcblxuICBLRVlTOiB7XG4gICAgSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVk6IEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLFxuICAgIFVTRVJfU1RPUkFHRV9LRVk6IFVTRVJfU1RPUkFHRV9LRVksXG4gICAgSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWTogSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSxcbiAgICBIT1VTRUhPTERfTUVNQkVSX1RZUEU6IEhPVVNFSE9MRF9NRU1CRVJfVFlQRSxcbiAgICBWSVNJVE9SX1RZUEU6IFZJU0lUT1JfVFlQRSxcbiAgICBSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZOiBSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLFxuICAgIFBFUlNPTkFMX0RFVEFJTFNfS0VZOiBQRVJTT05BTF9ERVRBSUxTX0tFWVxuICB9LFxuXG4gIElEUzoge1xuICAgIFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDogVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEXG4gIH0sXG5cbiAgVFlQRVM6IHtcbiAgICBwZXJzb246IHBlcnNvbixcbiAgICByZWxhdGlvbnNoaXA6IHJlbGF0aW9uc2hpcFxuICB9XG59O1xuXG53aW5kb3cuT05TLmhlbHBlcnMgPSB7XG4gIHBvcHVsYXRlSG91c2Vob2xkTGlzdDogcG9wdWxhdGVIb3VzZWhvbGRMaXN0LFxuICBwb3B1bGF0ZVZpc2l0b3JMaXN0OiBwb3B1bGF0ZVZpc2l0b3JMaXN0XG59O1xuXG53aW5kb3cuT05TLnV0aWxzID0ge1xuICByZW1vdmVGcm9tTGlzdDogcmVtb3ZlRnJvbUxpc3QsXG4gIHRyYWlsaW5nTmFtZVM6IHRyYWlsaW5nTmFtZVMsXG4gIG51bWJlclRvUG9zaXRpb25Xb3JkOiBudW1iZXJUb1Bvc2l0aW9uV29yZCxcbiAgbnVtYmVyVG9Xb3Jkc1N0eWxlZ3VpZGU6IG51bWJlclRvV29yZHNTdHlsZWd1aWRlLFxuICBwcmVjZWRpbmdPcmRpbmFsV29yZDogcHJlY2VkaW5nT3JkaW5hbFdvcmQsXG4gIGdldFNpZ25pZmljYW50OiBnZXRTaWduaWZpY2FudCxcbiAgY2xlYW5IVE1MUGxhY2Vob2xkZXJTdHJpbmdSZXBsYWNtZW50OiBjbGVhbkhUTUxQbGFjZWhvbGRlclN0cmluZ1JlcGxhY21lbnQsXG4gIHZhbGlkYXRlSW5wdXRzOiB2YWxpZGF0ZUlucHV0c1xufTtcblxuJChwb3B1bGF0ZUhvdXNlaG9sZExpc3QpO1xuJChwb3B1bGF0ZVZpc2l0b3JMaXN0KTtcbiQodXBkYXRlSG91c2Vob2xkVmlzaXRvcnNOYXZpZ2F0aW9uSXRlbXMpO1xuJCh1cGRhdGVBZGRyZXNzZXMpO1xuJCh1cGRhdGVQZXJzb25MaW5rKTtcbiQodG9vbHMpO1xuJCh1cGRhdGVBbGxQcmV2aW91c0xpbmtzKTtcbiQodXBkYXRlQnlTdXJ2ZXlUeXBlKTtcbiQodXBkYXRlU2lnbmlmaWNhbnREYXRlKTtcbiQodXBkYXRlSG91c2Vob2xkU3VtbWFyeSk7XG4kKHVwZGF0ZVZpc2l0b3JzU3VtbWFyeSk7XG4kKHVwZGF0ZUNvbnRpbnVlTm90aWNlKTtcbiQodXBkYXRlU2F2ZUFuZENvbXBsZXRlTGF0ZXIpO1xuJCh1cGRhdGVGb29ydExpc3RDb2wpO1xuJChzZXNzaW9uQm9va21hcmspO1xuJChmaWVsZEl0ZW1EaXNwbGF5SGFjayk7XG5cbmV4cG9ydHMuVVNFUl9TVE9SQUdFX0tFWSA9IFVTRVJfU1RPUkFHRV9LRVk7XG5leHBvcnRzLklORElWSURVQUxfUFJPWFlfU1RPUkFHRV9LRVkgPSBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZO1xuZXhwb3J0cy5nZXRBZGRyZXNzID0gZ2V0QWRkcmVzcztcbmV4cG9ydHMuYWRkVXNlclBlcnNvbiA9IGFkZFVzZXJQZXJzb247XG5leHBvcnRzLmdldFVzZXJQZXJzb24gPSBnZXRVc2VyUGVyc29uO1xuIiwiLyohXG4gKiBGdXNlLmpzIHYzLjYuMSAtIExpZ2h0d2VpZ2h0IGZ1enp5LXNlYXJjaCAoaHR0cDovL2Z1c2Vqcy5pbylcbiAqIFxuICogQ29weXJpZ2h0IChjKSAyMDEyLTIwMTcgS2lyb2xsb3MgUmlzayAoaHR0cDovL2tpcm8ubWUpXG4gKiBBbGwgUmlnaHRzIFJlc2VydmVkLiBBcGFjaGUgU29mdHdhcmUgTGljZW5zZSAyLjBcbiAqIFxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiRnVzZVwiLFtdLHQpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMuRnVzZT10KCk6ZS5GdXNlPXQoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgdD17fTtmdW5jdGlvbiByKG4pe2lmKHRbbl0pcmV0dXJuIHRbbl0uZXhwb3J0czt2YXIgbz10W25dPXtpOm4sbDohMSxleHBvcnRzOnt9fTtyZXR1cm4gZVtuXS5jYWxsKG8uZXhwb3J0cyxvLG8uZXhwb3J0cyxyKSxvLmw9ITAsby5leHBvcnRzfXJldHVybiByLm09ZSxyLmM9dCxyLmQ9ZnVuY3Rpb24oZSx0LG4pe3IubyhlLHQpfHxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpufSl9LHIucj1mdW5jdGlvbihlKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wudG9TdHJpbmdUYWcmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6XCJNb2R1bGVcIn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSxyLnQ9ZnVuY3Rpb24oZSx0KXtpZigxJnQmJihlPXIoZSkpLDgmdClyZXR1cm4gZTtpZig0JnQmJlwib2JqZWN0XCI9PXR5cGVvZiBlJiZlJiZlLl9fZXNNb2R1bGUpcmV0dXJuIGU7dmFyIG49T2JqZWN0LmNyZWF0ZShudWxsKTtpZihyLnIobiksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJkZWZhdWx0XCIse2VudW1lcmFibGU6ITAsdmFsdWU6ZX0pLDImdCYmXCJzdHJpbmdcIiE9dHlwZW9mIGUpZm9yKHZhciBvIGluIGUpci5kKG4sbyxmdW5jdGlvbih0KXtyZXR1cm4gZVt0XX0uYmluZChudWxsLG8pKTtyZXR1cm4gbn0sci5uPWZ1bmN0aW9uKGUpe3ZhciB0PWUmJmUuX19lc01vZHVsZT9mdW5jdGlvbigpe3JldHVybiBlLmRlZmF1bHR9OmZ1bmN0aW9uKCl7cmV0dXJuIGV9O3JldHVybiByLmQodCxcImFcIix0KSx0fSxyLm89ZnVuY3Rpb24oZSx0KXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGUsdCl9LHIucD1cIlwiLHIoci5zPTApfShbZnVuY3Rpb24oZSx0LHIpe2Z1bmN0aW9uIG4oZSl7cmV0dXJuKG49XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX0pKGUpfWZ1bmN0aW9uIG8oZSx0KXtmb3IodmFyIHI9MDtyPHQubGVuZ3RoO3IrKyl7dmFyIG49dFtyXTtuLmVudW1lcmFibGU9bi5lbnVtZXJhYmxlfHwhMSxuLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBuJiYobi53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsbi5rZXksbil9fXZhciBpPXIoMSksYT1yKDcpLHM9YS5nZXQsYz0oYS5kZWVwVmFsdWUsYS5pc0FycmF5KSxoPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LHIpe3ZhciBuPXIubG9jYXRpb24sbz12b2lkIDA9PT1uPzA6bixpPXIuZGlzdGFuY2UsYT12b2lkIDA9PT1pPzEwMDppLGM9ci50aHJlc2hvbGQsaD12b2lkIDA9PT1jPy42OmMsbD1yLm1heFBhdHRlcm5MZW5ndGgsdT12b2lkIDA9PT1sPzMyOmwsZj1yLmNhc2VTZW5zaXRpdmUsdj12b2lkIDAhPT1mJiZmLHA9ci50b2tlblNlcGFyYXRvcixkPXZvaWQgMD09PXA/LyArL2c6cCxnPXIuZmluZEFsbE1hdGNoZXMseT12b2lkIDAhPT1nJiZnLG09ci5taW5NYXRjaENoYXJMZW5ndGgsaz12b2lkIDA9PT1tPzE6bSxiPXIuaWQsUz12b2lkIDA9PT1iP251bGw6Yix4PXIua2V5cyxNPXZvaWQgMD09PXg/W106eCxfPXIuc2hvdWxkU29ydCx3PXZvaWQgMD09PV98fF8sTD1yLmdldEZuLEE9dm9pZCAwPT09TD9zOkwsTz1yLnNvcnRGbixDPXZvaWQgMD09PU8/ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5zY29yZS10LnNjb3JlfTpPLGo9ci50b2tlbml6ZSxQPXZvaWQgMCE9PWomJmosST1yLm1hdGNoQWxsVG9rZW5zLEY9dm9pZCAwIT09SSYmSSxUPXIuaW5jbHVkZU1hdGNoZXMsTj12b2lkIDAhPT1UJiZULHo9ci5pbmNsdWRlU2NvcmUsRT12b2lkIDAhPT16JiZ6LFc9ci52ZXJib3NlLEs9dm9pZCAwIT09VyYmVzshZnVuY3Rpb24oZSx0KXtpZighKGUgaW5zdGFuY2VvZiB0KSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfSh0aGlzLGUpLHRoaXMub3B0aW9ucz17bG9jYXRpb246byxkaXN0YW5jZTphLHRocmVzaG9sZDpoLG1heFBhdHRlcm5MZW5ndGg6dSxpc0Nhc2VTZW5zaXRpdmU6dix0b2tlblNlcGFyYXRvcjpkLGZpbmRBbGxNYXRjaGVzOnksbWluTWF0Y2hDaGFyTGVuZ3RoOmssaWQ6UyxrZXlzOk0saW5jbHVkZU1hdGNoZXM6TixpbmNsdWRlU2NvcmU6RSxzaG91bGRTb3J0OncsZ2V0Rm46QSxzb3J0Rm46Qyx2ZXJib3NlOkssdG9rZW5pemU6UCxtYXRjaEFsbFRva2VuczpGfSx0aGlzLnNldENvbGxlY3Rpb24odCksdGhpcy5fcHJvY2Vzc0tleXMoTSl9dmFyIHQscixhO3JldHVybiB0PWUsKHI9W3trZXk6XCJzZXRDb2xsZWN0aW9uXCIsdmFsdWU6ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMubGlzdD1lLGV9fSx7a2V5OlwiX3Byb2Nlc3NLZXlzXCIsdmFsdWU6ZnVuY3Rpb24oZSl7aWYodGhpcy5fa2V5V2VpZ2h0cz17fSx0aGlzLl9rZXlOYW1lcz1bXSxlLmxlbmd0aCYmXCJzdHJpbmdcIj09dHlwZW9mIGVbMF0pZm9yKHZhciB0PTAscj1lLmxlbmd0aDt0PHI7dCs9MSl7dmFyIG49ZVt0XTt0aGlzLl9rZXlXZWlnaHRzW25dPTEsdGhpcy5fa2V5TmFtZXMucHVzaChuKX1lbHNle2Zvcih2YXIgbz1udWxsLGk9bnVsbCxhPTAscz0wLGM9ZS5sZW5ndGg7czxjO3MrPTEpe3ZhciBoPWVbc107aWYoIWguaGFzT3duUHJvcGVydHkoXCJuYW1lXCIpKXRocm93IG5ldyBFcnJvcignTWlzc2luZyBcIm5hbWVcIiBwcm9wZXJ0eSBpbiBrZXkgb2JqZWN0Jyk7dmFyIGw9aC5uYW1lO2lmKHRoaXMuX2tleU5hbWVzLnB1c2gobCksIWguaGFzT3duUHJvcGVydHkoXCJ3ZWlnaHRcIikpdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIFwid2VpZ2h0XCIgcHJvcGVydHkgaW4ga2V5IG9iamVjdCcpO3ZhciB1PWgud2VpZ2h0O2lmKHU8MHx8dT4xKXRocm93IG5ldyBFcnJvcignXCJ3ZWlnaHRcIiBwcm9wZXJ0eSBpbiBrZXkgbXVzdCBiZWluIHRoZSByYW5nZSBvZiBbMCwgMSknKTtpPW51bGw9PWk/dTpNYXRoLm1heChpLHUpLG89bnVsbD09bz91Ok1hdGgubWluKG8sdSksdGhpcy5fa2V5V2VpZ2h0c1tsXT11LGErPXV9aWYoYT4xKXRocm93IG5ldyBFcnJvcihcIlRvdGFsIG9mIHdlaWdodHMgY2Fubm90IGV4Y2VlZCAxXCIpfX19LHtrZXk6XCJzZWFyY2hcIix2YWx1ZTpmdW5jdGlvbihlKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06e2xpbWl0OiExfTt0aGlzLl9sb2coJy0tLS0tLS0tLVxcblNlYXJjaCBwYXR0ZXJuOiBcIicuY29uY2F0KGUsJ1wiJykpO3ZhciByPXRoaXMuX3ByZXBhcmVTZWFyY2hlcnMoZSksbj1yLnRva2VuU2VhcmNoZXJzLG89ci5mdWxsU2VhcmNoZXIsaT10aGlzLl9zZWFyY2gobixvKTtyZXR1cm4gdGhpcy5fY29tcHV0ZVNjb3JlKGkpLHRoaXMub3B0aW9ucy5zaG91bGRTb3J0JiZ0aGlzLl9zb3J0KGkpLHQubGltaXQmJlwibnVtYmVyXCI9PXR5cGVvZiB0LmxpbWl0JiYoaT1pLnNsaWNlKDAsdC5saW1pdCkpLHRoaXMuX2Zvcm1hdChpKX19LHtrZXk6XCJfcHJlcGFyZVNlYXJjaGVyc1wiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOlwiXCIsdD1bXTtpZih0aGlzLm9wdGlvbnMudG9rZW5pemUpZm9yKHZhciByPWUuc3BsaXQodGhpcy5vcHRpb25zLnRva2VuU2VwYXJhdG9yKSxuPTAsbz1yLmxlbmd0aDtuPG87bis9MSl0LnB1c2gobmV3IGkocltuXSx0aGlzLm9wdGlvbnMpKTtyZXR1cm57dG9rZW5TZWFyY2hlcnM6dCxmdWxsU2VhcmNoZXI6bmV3IGkoZSx0aGlzLm9wdGlvbnMpfX19LHtrZXk6XCJfc2VhcmNoXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06W10sdD1hcmd1bWVudHMubGVuZ3RoPjE/YXJndW1lbnRzWzFdOnZvaWQgMCxyPXRoaXMubGlzdCxuPXt9LG89W107aWYoXCJzdHJpbmdcIj09dHlwZW9mIHJbMF0pe2Zvcih2YXIgaT0wLGE9ci5sZW5ndGg7aTxhO2krPTEpdGhpcy5fYW5hbHl6ZSh7a2V5OlwiXCIsdmFsdWU6cltpXSxyZWNvcmQ6aSxpbmRleDppfSx7cmVzdWx0TWFwOm4scmVzdWx0czpvLHRva2VuU2VhcmNoZXJzOmUsZnVsbFNlYXJjaGVyOnR9KTtyZXR1cm4gb31mb3IodmFyIHM9MCxjPXIubGVuZ3RoO3M8YztzKz0xKWZvcih2YXIgaD1yW3NdLGw9MCx1PXRoaXMuX2tleU5hbWVzLmxlbmd0aDtsPHU7bCs9MSl7dmFyIGY9dGhpcy5fa2V5TmFtZXNbbF07dGhpcy5fYW5hbHl6ZSh7a2V5OmYsdmFsdWU6dGhpcy5vcHRpb25zLmdldEZuKGgsZikscmVjb3JkOmgsaW5kZXg6c30se3Jlc3VsdE1hcDpuLHJlc3VsdHM6byx0b2tlblNlYXJjaGVyczplLGZ1bGxTZWFyY2hlcjp0fSl9cmV0dXJuIG99fSx7a2V5OlwiX2FuYWx5emVcIix2YWx1ZTpmdW5jdGlvbihlLHQpe3ZhciByPXRoaXMsbj1lLmtleSxvPWUuYXJyYXlJbmRleCxpPXZvaWQgMD09PW8/LTE6byxhPWUudmFsdWUscz1lLnJlY29yZCxoPWUuaW5kZXgsbD10LnRva2VuU2VhcmNoZXJzLHU9dm9pZCAwPT09bD9bXTpsLGY9dC5mdWxsU2VhcmNoZXIsdj10LnJlc3VsdE1hcCxwPXZvaWQgMD09PXY/e306dixkPXQucmVzdWx0cyxnPXZvaWQgMD09PWQ/W106ZDshZnVuY3Rpb24gZSh0LG8saSxhKXtpZihudWxsIT1vKWlmKFwic3RyaW5nXCI9PXR5cGVvZiBvKXt2YXIgcz0hMSxoPS0xLGw9MDtyLl9sb2coXCJcXG5LZXk6IFwiLmNvbmNhdChcIlwiPT09bj9cIi0tXCI6bikpO3ZhciB2PWYuc2VhcmNoKG8pO2lmKHIuX2xvZygnRnVsbCB0ZXh0OiBcIicuY29uY2F0KG8sJ1wiLCBzY29yZTogJykuY29uY2F0KHYuc2NvcmUpKSxyLm9wdGlvbnMudG9rZW5pemUpe2Zvcih2YXIgZD1vLnNwbGl0KHIub3B0aW9ucy50b2tlblNlcGFyYXRvcikseT1kLmxlbmd0aCxtPVtdLGs9MCxiPXUubGVuZ3RoO2s8YjtrKz0xKXt2YXIgUz11W2tdO3IuX2xvZygnXFxuUGF0dGVybjogXCInLmNvbmNhdChTLnBhdHRlcm4sJ1wiJykpO2Zvcih2YXIgeD0hMSxNPTA7TTx5O00rPTEpe3ZhciBfPWRbTV0sdz1TLnNlYXJjaChfKSxMPXt9O3cuaXNNYXRjaD8oTFtfXT13LnNjb3JlLHM9ITAseD0hMCxtLnB1c2gody5zY29yZSkpOihMW19dPTEsci5vcHRpb25zLm1hdGNoQWxsVG9rZW5zfHxtLnB1c2goMSkpLHIuX2xvZygnVG9rZW46IFwiJy5jb25jYXQoXywnXCIsIHNjb3JlOiAnKS5jb25jYXQoTFtfXSkpfXgmJihsKz0xKX1oPW1bMF07Zm9yKHZhciBBPW0ubGVuZ3RoLE89MTtPPEE7Tys9MSloKz1tW09dO2gvPUEsci5fbG9nKFwiVG9rZW4gc2NvcmUgYXZlcmFnZTpcIixoKX12YXIgQz12LnNjb3JlO2g+LTEmJihDPShDK2gpLzIpLHIuX2xvZyhcIlNjb3JlIGF2ZXJhZ2U6XCIsQyk7dmFyIGo9IXIub3B0aW9ucy50b2tlbml6ZXx8IXIub3B0aW9ucy5tYXRjaEFsbFRva2Vuc3x8bD49dS5sZW5ndGg7aWYoci5fbG9nKFwiXFxuQ2hlY2sgTWF0Y2hlczogXCIuY29uY2F0KGopKSwoc3x8di5pc01hdGNoKSYmail7dmFyIFA9e2tleTpuLGFycmF5SW5kZXg6dCx2YWx1ZTpvLHNjb3JlOkN9O3Iub3B0aW9ucy5pbmNsdWRlTWF0Y2hlcyYmKFAubWF0Y2hlZEluZGljZXM9di5tYXRjaGVkSW5kaWNlcyk7dmFyIEk9cFthXTtJP0kub3V0cHV0LnB1c2goUCk6KHBbYV09e2l0ZW06aSxvdXRwdXQ6W1BdfSxnLnB1c2gocFthXSkpfX1lbHNlIGlmKGMobykpZm9yKHZhciBGPTAsVD1vLmxlbmd0aDtGPFQ7Ris9MSllKEYsb1tGXSxpLGEpfShpLGEscyxoKX19LHtrZXk6XCJfY29tcHV0ZVNjb3JlXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy5fbG9nKFwiXFxuXFxuQ29tcHV0aW5nIHNjb3JlOlxcblwiKTtmb3IodmFyIHQ9dGhpcy5fa2V5V2VpZ2h0cyxyPSEhT2JqZWN0LmtleXModCkubGVuZ3RoLG49MCxvPWUubGVuZ3RoO248bztuKz0xKXtmb3IodmFyIGk9ZVtuXSxhPWkub3V0cHV0LHM9YS5sZW5ndGgsYz0xLGg9MDtoPHM7aCs9MSl7dmFyIGw9YVtoXSx1PWwua2V5LGY9cj90W3VdOjEsdj0wPT09bC5zY29yZSYmdCYmdFt1XT4wP051bWJlci5FUFNJTE9OOmwuc2NvcmU7Yyo9TWF0aC5wb3codixmKX1pLnNjb3JlPWMsdGhpcy5fbG9nKGkpfX19LHtrZXk6XCJfc29ydFwiLHZhbHVlOmZ1bmN0aW9uKGUpe3RoaXMuX2xvZyhcIlxcblxcblNvcnRpbmcuLi4uXCIpLGUuc29ydCh0aGlzLm9wdGlvbnMuc29ydEZuKX19LHtrZXk6XCJfZm9ybWF0XCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9W107aWYodGhpcy5vcHRpb25zLnZlcmJvc2Upe3ZhciByPVtdO3RoaXMuX2xvZyhcIlxcblxcbk91dHB1dDpcXG5cXG5cIixKU09OLnN0cmluZ2lmeShlLGZ1bmN0aW9uKGUsdCl7aWYoXCJvYmplY3RcIj09PW4odCkmJm51bGwhPT10KXtpZigtMSE9PXIuaW5kZXhPZih0KSlyZXR1cm47ci5wdXNoKHQpfXJldHVybiB0fSwyKSkscj1udWxsfXZhciBvPVtdO3RoaXMub3B0aW9ucy5pbmNsdWRlTWF0Y2hlcyYmby5wdXNoKGZ1bmN0aW9uKGUsdCl7dmFyIHI9ZS5vdXRwdXQ7dC5tYXRjaGVzPVtdO2Zvcih2YXIgbj0wLG89ci5sZW5ndGg7bjxvO24rPTEpe3ZhciBpPXJbbl07aWYoMCE9PWkubWF0Y2hlZEluZGljZXMubGVuZ3RoKXt2YXIgYT17aW5kaWNlczppLm1hdGNoZWRJbmRpY2VzLHZhbHVlOmkudmFsdWV9O2kua2V5JiYoYS5rZXk9aS5rZXkpLGkuaGFzT3duUHJvcGVydHkoXCJhcnJheUluZGV4XCIpJiZpLmFycmF5SW5kZXg+LTEmJihhLmFycmF5SW5kZXg9aS5hcnJheUluZGV4KSx0Lm1hdGNoZXMucHVzaChhKX19fSksdGhpcy5vcHRpb25zLmluY2x1ZGVTY29yZSYmby5wdXNoKGZ1bmN0aW9uKGUsdCl7dC5zY29yZT1lLnNjb3JlfSk7Zm9yKHZhciBpPTAsYT1lLmxlbmd0aDtpPGE7aSs9MSl7dmFyIHM9ZVtpXTtpZih0aGlzLm9wdGlvbnMuaWQmJihzLml0ZW09dGhpcy5vcHRpb25zLmdldEZuKHMuaXRlbSx0aGlzLm9wdGlvbnMuaWQpWzBdKSxvLmxlbmd0aCl7Zm9yKHZhciBjPXtpdGVtOnMuaXRlbX0saD0wLGw9by5sZW5ndGg7aDxsO2grPTEpb1toXShzLGMpO3QucHVzaChjKX1lbHNlIHQucHVzaChzLml0ZW0pfXJldHVybiB0fX0se2tleTpcIl9sb2dcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlO3RoaXMub3B0aW9ucy52ZXJib3NlJiYoZT1jb25zb2xlKS5sb2cuYXBwbHkoZSxhcmd1bWVudHMpfX1dKSYmbyh0LnByb3RvdHlwZSxyKSxhJiZvKHQsYSksZX0oKTtlLmV4cG9ydHM9aH0sZnVuY3Rpb24oZSx0LHIpe2Z1bmN0aW9uIG4oZSx0KXtmb3IodmFyIHI9MDtyPHQubGVuZ3RoO3IrKyl7dmFyIG49dFtyXTtuLmVudW1lcmFibGU9bi5lbnVtZXJhYmxlfHwhMSxuLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBuJiYobi53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsbi5rZXksbil9fXZhciBvPXIoMiksaT1yKDMpLGE9cig2KSxzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LHIpe3ZhciBuPXIubG9jYXRpb24sbz12b2lkIDA9PT1uPzA6bixpPXIuZGlzdGFuY2Uscz12b2lkIDA9PT1pPzEwMDppLGM9ci50aHJlc2hvbGQsaD12b2lkIDA9PT1jPy42OmMsbD1yLm1heFBhdHRlcm5MZW5ndGgsdT12b2lkIDA9PT1sPzMyOmwsZj1yLmlzQ2FzZVNlbnNpdGl2ZSx2PXZvaWQgMCE9PWYmJmYscD1yLnRva2VuU2VwYXJhdG9yLGQ9dm9pZCAwPT09cD8vICsvZzpwLGc9ci5maW5kQWxsTWF0Y2hlcyx5PXZvaWQgMCE9PWcmJmcsbT1yLm1pbk1hdGNoQ2hhckxlbmd0aCxrPXZvaWQgMD09PW0/MTptLGI9ci5pbmNsdWRlTWF0Y2hlcyxTPXZvaWQgMCE9PWImJmI7IWZ1bmN0aW9uKGUsdCl7aWYoIShlIGluc3RhbmNlb2YgdCkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX0odGhpcyxlKSx0aGlzLm9wdGlvbnM9e2xvY2F0aW9uOm8sZGlzdGFuY2U6cyx0aHJlc2hvbGQ6aCxtYXhQYXR0ZXJuTGVuZ3RoOnUsaXNDYXNlU2Vuc2l0aXZlOnYsdG9rZW5TZXBhcmF0b3I6ZCxmaW5kQWxsTWF0Y2hlczp5LGluY2x1ZGVNYXRjaGVzOlMsbWluTWF0Y2hDaGFyTGVuZ3RoOmt9LHRoaXMucGF0dGVybj12P3Q6dC50b0xvd2VyQ2FzZSgpLHRoaXMucGF0dGVybi5sZW5ndGg8PXUmJih0aGlzLnBhdHRlcm5BbHBoYWJldD1hKHRoaXMucGF0dGVybikpfXZhciB0LHIscztyZXR1cm4gdD1lLChyPVt7a2V5Olwic2VhcmNoXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5vcHRpb25zLHI9dC5pc0Nhc2VTZW5zaXRpdmUsbj10LmluY2x1ZGVNYXRjaGVzO2lmKHJ8fChlPWUudG9Mb3dlckNhc2UoKSksdGhpcy5wYXR0ZXJuPT09ZSl7dmFyIGE9e2lzTWF0Y2g6ITAsc2NvcmU6MH07cmV0dXJuIG4mJihhLm1hdGNoZWRJbmRpY2VzPVtbMCxlLmxlbmd0aC0xXV0pLGF9dmFyIHM9dGhpcy5vcHRpb25zLGM9cy5tYXhQYXR0ZXJuTGVuZ3RoLGg9cy50b2tlblNlcGFyYXRvcjtpZih0aGlzLnBhdHRlcm4ubGVuZ3RoPmMpcmV0dXJuIG8oZSx0aGlzLnBhdHRlcm4saCk7dmFyIGw9dGhpcy5vcHRpb25zLHU9bC5sb2NhdGlvbixmPWwuZGlzdGFuY2Usdj1sLnRocmVzaG9sZCxwPWwuZmluZEFsbE1hdGNoZXMsZD1sLm1pbk1hdGNoQ2hhckxlbmd0aDtyZXR1cm4gaShlLHRoaXMucGF0dGVybix0aGlzLnBhdHRlcm5BbHBoYWJldCx7bG9jYXRpb246dSxkaXN0YW5jZTpmLHRocmVzaG9sZDp2LGZpbmRBbGxNYXRjaGVzOnAsbWluTWF0Y2hDaGFyTGVuZ3RoOmQsaW5jbHVkZU1hdGNoZXM6bn0pfX1dKSYmbih0LnByb3RvdHlwZSxyKSxzJiZuKHQscyksZX0oKTtlLmV4cG9ydHM9c30sZnVuY3Rpb24oZSx0KXt2YXIgcj0vW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2c7ZS5leHBvcnRzPWZ1bmN0aW9uKGUsdCl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOi8gKy9nLG89bmV3IFJlZ0V4cCh0LnJlcGxhY2UocixcIlxcXFwkJlwiKS5yZXBsYWNlKG4sXCJ8XCIpKSxpPWUubWF0Y2gobyksYT0hIWkscz1bXTtpZihhKWZvcih2YXIgYz0wLGg9aS5sZW5ndGg7YzxoO2MrPTEpe3ZhciBsPWlbY107cy5wdXNoKFtlLmluZGV4T2YobCksbC5sZW5ndGgtMV0pfXJldHVybntzY29yZTphPy41OjEsaXNNYXRjaDphLG1hdGNoZWRJbmRpY2VzOnN9fX0sZnVuY3Rpb24oZSx0LHIpe3ZhciBuPXIoNCksbz1yKDUpO2UuZXhwb3J0cz1mdW5jdGlvbihlLHQscixpKXtmb3IodmFyIGE9aS5sb2NhdGlvbixzPXZvaWQgMD09PWE/MDphLGM9aS5kaXN0YW5jZSxoPXZvaWQgMD09PWM/MTAwOmMsbD1pLnRocmVzaG9sZCx1PXZvaWQgMD09PWw/LjY6bCxmPWkuZmluZEFsbE1hdGNoZXMsdj12b2lkIDAhPT1mJiZmLHA9aS5taW5NYXRjaENoYXJMZW5ndGgsZD12b2lkIDA9PT1wPzE6cCxnPWkuaW5jbHVkZU1hdGNoZXMseT12b2lkIDAhPT1nJiZnLG09cyxrPWUubGVuZ3RoLGI9dSxTPWUuaW5kZXhPZih0LG0pLHg9dC5sZW5ndGgsTT1bXSxfPTA7XzxrO18rPTEpTVtfXT0wO2lmKC0xIT09Uyl7dmFyIHc9bih0LHtlcnJvcnM6MCxjdXJyZW50TG9jYXRpb246UyxleHBlY3RlZExvY2F0aW9uOm0sZGlzdGFuY2U6aH0pO2lmKGI9TWF0aC5taW4odyxiKSwtMSE9PShTPWUubGFzdEluZGV4T2YodCxtK3gpKSl7dmFyIEw9bih0LHtlcnJvcnM6MCxjdXJyZW50TG9jYXRpb246UyxleHBlY3RlZExvY2F0aW9uOm0sZGlzdGFuY2U6aH0pO2I9TWF0aC5taW4oTCxiKX19Uz0tMTtmb3IodmFyIEE9W10sTz0xLEM9eCtrLGo9MTw8KHg8PTMxP3gtMTozMCksUD0wO1A8eDtQKz0xKXtmb3IodmFyIEk9MCxGPUM7STxGOyl7bih0LHtlcnJvcnM6UCxjdXJyZW50TG9jYXRpb246bStGLGV4cGVjdGVkTG9jYXRpb246bSxkaXN0YW5jZTpofSk8PWI/ST1GOkM9RixGPU1hdGguZmxvb3IoKEMtSSkvMitJKX1DPUY7dmFyIFQ9TWF0aC5tYXgoMSxtLUYrMSksTj12P2s6TWF0aC5taW4obStGLGspK3gsej1BcnJheShOKzIpO3pbTisxXT0oMTw8UCktMTtmb3IodmFyIEU9TjtFPj1UO0UtPTEpe3ZhciBXPUUtMSxLPXJbZS5jaGFyQXQoVyldO2lmKEsmJihNW1ddPTEpLHpbRV09KHpbRSsxXTw8MXwxKSZLLDAhPT1QJiYoeltFXXw9KEFbRSsxXXxBW0VdKTw8MXwxfEFbRSsxXSkseltFXSZqJiYoTz1uKHQse2Vycm9yczpQLGN1cnJlbnRMb2NhdGlvbjpXLGV4cGVjdGVkTG9jYXRpb246bSxkaXN0YW5jZTpofSkpPD1iKXtpZihiPU8sKFM9Vyk8PW0pYnJlYWs7VD1NYXRoLm1heCgxLDIqbS1TKX19aWYobih0LHtlcnJvcnM6UCsxLGN1cnJlbnRMb2NhdGlvbjptLGV4cGVjdGVkTG9jYXRpb246bSxkaXN0YW5jZTpofSk+YilicmVhaztBPXp9dmFyICQ9e2lzTWF0Y2g6Uz49MCxzY29yZTowPT09Tz8uMDAxOk99O3JldHVybiB5JiYoJC5tYXRjaGVkSW5kaWNlcz1vKE0sZCkpLCR9fSxmdW5jdGlvbihlLHQpe2UuZXhwb3J0cz1mdW5jdGlvbihlLHQpe3ZhciByPXQuZXJyb3JzLG49dm9pZCAwPT09cj8wOnIsbz10LmN1cnJlbnRMb2NhdGlvbixpPXZvaWQgMD09PW8/MDpvLGE9dC5leHBlY3RlZExvY2F0aW9uLHM9dm9pZCAwPT09YT8wOmEsYz10LmRpc3RhbmNlLGg9dm9pZCAwPT09Yz8xMDA6YyxsPW4vZS5sZW5ndGgsdT1NYXRoLmFicyhzLWkpO3JldHVybiBoP2wrdS9oOnU/MTpsfX0sZnVuY3Rpb24oZSx0KXtlLmV4cG9ydHM9ZnVuY3Rpb24oKXtmb3IodmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOltdLHQ9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOjEscj1bXSxuPS0xLG89LTEsaT0wLGE9ZS5sZW5ndGg7aTxhO2krPTEpe3ZhciBzPWVbaV07cyYmLTE9PT1uP249aTpzfHwtMT09PW58fCgobz1pLTEpLW4rMT49dCYmci5wdXNoKFtuLG9dKSxuPS0xKX1yZXR1cm4gZVtpLTFdJiZpLW4+PXQmJnIucHVzaChbbixpLTFdKSxyfX0sZnVuY3Rpb24oZSx0KXtlLmV4cG9ydHM9ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PXt9LHI9ZS5sZW5ndGgsbj0wO248cjtuKz0xKXRbZS5jaGFyQXQobildPTA7Zm9yKHZhciBvPTA7bzxyO28rPTEpdFtlLmNoYXJBdChvKV18PTE8PHItby0xO3JldHVybiB0fX0sZnVuY3Rpb24oZSx0KXt2YXIgcj1mdW5jdGlvbihlKXtyZXR1cm4gQXJyYXkuaXNBcnJheT9BcnJheS5pc0FycmF5KGUpOlwiW29iamVjdCBBcnJheV1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKX0sbj1mdW5jdGlvbihlKXtyZXR1cm4gbnVsbD09ZT9cIlwiOmZ1bmN0aW9uKGUpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXJldHVybiBlO3ZhciB0PWUrXCJcIjtyZXR1cm5cIjBcIj09dCYmMS9lPT0tMS8wP1wiLTBcIjp0fShlKX0sbz1mdW5jdGlvbihlKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZX0saT1mdW5jdGlvbihlKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgZX07ZS5leHBvcnRzPXtnZXQ6ZnVuY3Rpb24oZSx0KXt2YXIgYT1bXTtyZXR1cm4gZnVuY3Rpb24gZSh0LHMpe2lmKHMpe3ZhciBjPXMuaW5kZXhPZihcIi5cIiksaD1zLGw9bnVsbDstMSE9PWMmJihoPXMuc2xpY2UoMCxjKSxsPXMuc2xpY2UoYysxKSk7dmFyIHU9dFtoXTtpZihudWxsIT11KWlmKGx8fCFvKHUpJiYhaSh1KSlpZihyKHUpKWZvcih2YXIgZj0wLHY9dS5sZW5ndGg7Zjx2O2YrPTEpZSh1W2ZdLGwpO2Vsc2UgbCYmZSh1LGwpO2Vsc2UgYS5wdXNoKG4odSkpfWVsc2UgYS5wdXNoKHQpfShlLHQpLGF9LGlzQXJyYXk6cixpc1N0cmluZzpvLGlzTnVtOmksdG9TdHJpbmc6bn19XSl9KTsiXX0=
