(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
var events = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function (n) {
  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function (type) {
  var er, handler, len, args, i, listeners;

  if (!this._events) this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler)) return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++) {
      listeners[i].apply(this, args);
    }
  }

  return true;
};

EventEmitter.prototype.addListener = function (type, listener) {
  var m;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function (type, listener) {
  if (!isFunction(listener)) throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function (type, listener) {
  var list, position, length, i;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events || !this._events[type]) return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener || isFunction(list.listener) && list.listener === listener) {
    delete this._events[type];
    if (this._events.removeListener) this.emit('removeListener', type, listener);
  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener) this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function (type) {
  var key, listeners;

  if (!this._events) return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length) {
      this.removeListener(type, listeners[listeners.length - 1]);
    }
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function (type) {
  var ret;
  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function (type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function (emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

function sanitiseTypeaheadText(string) {
  var sanitisedQueryReplaceChars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var trimEnd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var sanitisedString = string.toLowerCase().replace(/\s\s+/g, ' ');

  sanitisedString = trimEnd ? sanitisedString.trim() : sanitisedString.trimStart();

  sanitisedQueryReplaceChars.forEach(function (char) {
    sanitisedString = sanitisedString.replace(new RegExp(char, 'g'), '');
  });

  return sanitisedString;
}

var classTypeaheadCombobox = 'js-typeahead-combobox';
var classTypeaheadLabel = 'js-typeahead-label';
var classTypeaheadInput = 'js-typeahead-input';
var classTypeaheadInstructions = 'js-typeahead-instructions';
var classTypeaheadListbox = 'js-typeahead-listbox';
var classTypeaheadAriaStatus = 'js-typeahead-aria-status';

var classTypeaheadOption = 'typeahead__option';
var classTypeaheadOptionFocused = classTypeaheadOption + '--focused';
var classTypeaheadOptionNoResults = classTypeaheadOption + '--no-results';
var classTypeaheadOptionMoreResults = classTypeaheadOption + '--more-results';
var classTypeaheadComboboxFocused = 'typeahead__combobox--focused';
var classTypeaheadHasResults = 'typeahead--has-results';

var KEYCODE = {
  BACK_SPACE: 8,
  RETURN: 13,
  ENTER: 14,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46,
  V: 86
};

var NEW_FIELD_VALUE_EVENT = 'NEW_FIELD_VALUE';
var NEW_ITEM_SELECTED_EVENT = 'NEW_ITEM_SELECTED';
var UNSET_FIELD_VALUE_EVENT = 'UNSET_FIELD_VALUE';

var TypeaheadComponent = function () {
  function TypeaheadComponent(_ref) {
    var context = _ref.context,
        apiUrl = _ref.apiUrl,
        minChars = _ref.minChars,
        resultLimit = _ref.resultLimit,
        _ref$sanitisedQueryRe = _ref.sanitisedQueryReplaceChars,
        sanitisedQueryReplaceChars = _ref$sanitisedQueryRe === undefined ? [] : _ref$sanitisedQueryRe,
        _ref$lang = _ref.lang,
        lang = _ref$lang === undefined ? null : _ref$lang;
    classCallCheck(this, TypeaheadComponent);
    this.emitter = new events();


    // DOM Elements
    this.context = context;
    this.combobox = context.querySelector('.' + classTypeaheadCombobox);
    this.label = context.querySelector('.' + classTypeaheadLabel);
    this.input = context.querySelector('.' + classTypeaheadInput);
    this.listbox = context.querySelector('.' + classTypeaheadListbox);
    this.instructions = context.querySelector('.' + classTypeaheadInstructions);
    this.ariaStatus = context.querySelector('.' + classTypeaheadAriaStatus);

    // Suggestion URL
    this.apiUrl = apiUrl || context.getAttribute('data-api-url');

    // Settings
    this.content = JSON.parse(context.getAttribute('data-content'));
    this.listboxId = this.listbox.getAttribute('id');
    this.minChars = minChars || 2;
    this.resultLimit = resultLimit || null;

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
    this.sanitisedQueryReplaceChars = sanitisedQueryReplaceChars;
    this.lang = lang || document.documentElement.getAttribute('lang').toLowerCase();

    // Modify DOM
    this.label.setAttribute('for', this.input.getAttribute('id'));
    this.input.setAttribute('aria-autocomplete', 'list');
    this.input.setAttribute('aria-controls', this.listbox.getAttribute('id'));
    this.input.setAttribute('aria-describedby', this.instructions.getAttribute('id'));
    this.input.setAttribute('autocomplete', this.input.getAttribute('data-autocomplete'));
    this.context.classList.add('typeahead--initialised');

    // Bind event listeners
    this.bindEventListeners();
  }

  createClass(TypeaheadComponent, [{
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
      this.ctrlKey = (event.ctrlKey || event.metaKey) && event.keyCode !== KEYCODE.V;

      switch (event.keyCode) {
        case KEYCODE.UP:
          {
            event.preventDefault();
            this.navigateResults(-1);
            break;
          }
        case KEYCODE.DOWN:
          {
            event.preventDefault();
            this.navigateResults(1);
            break;
          }
        case KEYCODE.ENTER:
        case KEYCODE.RETURN:
          {
            event.preventDefault();
            break;
          }
      }
    }
  }, {
    key: 'handleKeyup',
    value: function handleKeyup(event) {
      switch (event.keyCode) {
        case KEYCODE.UP:
        case KEYCODE.DOWN:
          {
            event.preventDefault();
            break;
          }
        case KEYCODE.ENTER:
        case KEYCODE.RETURN:
          {
            this.selectResult();
            break;
          }
        case KEYCODE.LEFT:
        case KEYCODE.RIGHT:
          {
            break;
          }
      }

      this.ctrlKey = false;
    }
  }, {
    key: 'handleChange',
    value: function handleChange() {
      if (!this.blurring) {
        this.valueChanged();
      }
    }
  }, {
    key: 'handleFocus',
    value: function handleFocus() {
      clearTimeout(this.blurTimeout);
      this.combobox.classList.add(classTypeaheadComboboxFocused);
    }
  }, {
    key: 'handleBlur',
    value: function handleBlur() {
      var _this = this;

      clearTimeout(this.blurTimeout);
      this.blurring = true;

      this.blurTimeout = setTimeout(function () {
        _this.combobox.classList.remove(classTypeaheadComboboxFocused);
        _this.blurring = false;
      }, 0);
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
      var index = 0;

      if (this.highlightedResultIndex !== null) {
        index = this.highlightedResultIndex + direction;
      }

      if (index < this.numberOfResults) {
        if (index < 0) {
          index = null;
        }

        this.setHighlightedResult(index);
      }
    }
  }, {
    key: 'valueChanged',
    value: function valueChanged(force) {
      if (!this.settingResult) {
        var query = this.input.value;
        var sanitisedQuery = sanitiseTypeaheadText(query, this.sanitisedQueryReplaceChars);

        if (sanitisedQuery !== this.sanitisedQuery || force && !this.resultSelected) {
          this.unsetResults();
          this.setAriaStatus();

          this.query = query;
          this.sanitisedQuery = sanitisedQuery;

          if (this.sanitisedQuery.length >= this.minChars) {
            this.emitter.emit(NEW_FIELD_VALUE_EVENT, sanitisedQuery);
          } else {
            this.clearListbox();
          }
        }
      }
    }
  }, {
    key: 'unsetResults',
    value: function unsetResults() {
      this.results = [];
      this.resultOptions = [];
      this.resultSelected = false;

      this.emitter.emit(UNSET_FIELD_VALUE_EVENT);
    }
  }, {
    key: 'clearListbox',
    value: function clearListbox(preventAriaStatusUpdate) {
      this.listbox.innerHTML = '';
      this.context.classList.remove(classTypeaheadHasResults);
      this.input.removeAttribute('aria-activedescendant');
      this.combobox.removeAttribute('aria-expanded');

      if (!preventAriaStatusUpdate) {
        this.setAriaStatus();
      }
    }
  }, {
    key: 'updateData',
    value: function updateData(dataMap) {
      this.results = dataMap.results;
      this.foundResults = dataMap.totalResults;
      this.numberOfResults = Math.max(this.results.length, 0);

      this.render();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.deleting || this.numberOfResults && this.deleting) {
        if (this.numberOfResults.length === 1 && this.results[0].sanitisedText === this.sanitisedQuery) {
          this.clearListbox(true);
          this.selectResult(0);
        } else {
          this.listbox.innerHTML = '';
          this.resultOptions = this.results.map(function (result, index) {
            var ariaLabel = result[_this2.lang];
            var innerHTML = _this2.emboldenMatch(ariaLabel, _this2.query);

            if (Array.isArray(result.sanitisedAlternatives)) {
              var alternativeMatch = result.sanitisedAlternatives.find(function (alternative) {
                return alternative !== result.sanitisedText && alternative.includes(_this2.sanitisedQuery);
              });

              if (alternativeMatch) {
                var alternativeText = result.alternatives[result.sanitisedAlternatives.indexOf(alternativeMatch)];
                innerHTML += ' <small>(' + _this2.emboldenMatch(alternativeText, _this2.query) + ')</small>';
                ariaLabel += ', (' + alternativeText + ')';
              }
            }

            var listElement = document.createElement('li');
            listElement.className = classTypeaheadOption;
            listElement.setAttribute('id', _this2.listboxId + '__option--' + index);
            listElement.setAttribute('role', 'option');
            listElement.setAttribute('tabindex', '-1');
            listElement.setAttribute('aria-label', ariaLabel);
            listElement.innerHTML = innerHTML;

            listElement.addEventListener('click', function () {
              _this2.selectResult(index);
            });

            return listElement;
          });

          this.resultOptions.forEach(function (listElement) {
            return _this2.listbox.appendChild(listElement);
          });

          if (this.numberOfResults < this.foundResults) {
            var listElement = document.createElement('li');
            listElement.className = classTypeaheadOption + ' ' + classTypeaheadOptionMoreResults + ' u-fs-b';
            listElement.setAttribute('tabindex', '-1');
            listElement.setAttribute('aria-hidden', 'true');
            listElement.innerHTML = this.content.more_results;
            this.listbox.appendChild(listElement);
          }

          this.setHighlightedResult(null);
          this.combobox.setAttribute('aria-expanded', true);
          this.context.classList.add(classTypeaheadHasResults);
        }
      }

      if (this.numberOfResults === 0 && this.content.no_results) {
        this.listbox.innerHTML = '<li class="' + classTypeaheadOption + ' ' + classTypeaheadOptionNoResults + '">' + this.content.no_results + '</li>';
        this.combobox.setAttribute('aria-expanded', true);
        this.context.classList.add(classTypeaheadHasResults);
      }
    }
  }, {
    key: 'setHighlightedResult',
    value: function setHighlightedResult(index) {
      var _this3 = this;

      this.highlightedResultIndex = index;

      if (this.setHighlightedResult === null) {
        this.input.removeAttribute('aria-activedescendant');
      } else if (this.numberOfResults) {
        this.resultOptions.forEach(function (option, optionIndex) {
          if (optionIndex === index) {
            option.classList.add(classTypeaheadOptionFocused);
            option.setAttribute('aria-selected', true);
            _this3.input.setAttribute('aria-activedescendant', option.getAttribute('id'));
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
          content = this.content.aria_min_chars;
        } else if (noResults) {
          content = this.content.aria_no_results + ': "' + this.query + '"';
        } else if (this.numberOfResults === 1) {
          content = this.content.aria_one_result;
        } else {
          content = this.content.aria_n_results.replace('{n}', this.numberOfResults);

          if (this.resultLimit && this.foundResults > this.resultLimit) {
            content += ' ' + this.content.aria_limited_results;
          }
        }
      }

      this.ariaStatus.innerHTML = content;
    }
  }, {
    key: 'selectResult',
    value: function selectResult(index) {
      var _this4 = this;

      if (this.results.length) {
        //this.settingResult = true;

        var result = this.results[index || this.highlightedResultIndex || 0];

        // TODO: This condition should be removed if we go with the internal address lookup API, or made configurable if we use a third party API
        if (result.type !== 'Postcode') {
          this.input.value = result[this.lang];
          this.query = result[this.lang];
        }

        this.resultSelected = true;

        this.emitter.emit(NEW_ITEM_SELECTED_EVENT, result);

        /*this.onSelect(result).then(() => {
          this.settingResult = false;
          // this.input.setAttribute('autocomplete', 'false');
        });*/

        var ariaAlternativeMessage = '';

        if (!result.sanitisedText.includes(this.sanitisedQuery) && result.sanitisedAlternatives) {
          var alternativeMatch = result.sanitisedAlternatives.find(function (alternative) {
            return alternative.includes(_this4.sanitisedQuery);
          });

          if (alternativeMatch) {
            ariaAlternativeMessage = ', ' + this.content.aria_found_by_alternative_name + ': ' + alternativeMatch;
          }
        }

        var ariaMessage = this.content.aria_you_have_selected + ': ' + result[this.lang] + ariaAlternativeMessage + '.';

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

        return before + '<em>' + match + '</em>' + after;
      } else {
        return string;
      }
    }
  }]);
  return TypeaheadComponent;
}();

function formBodyFromObject(object) {
  return Object.keys(object).map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
  }).join('&');
}

var AbortableFetch = function () {
  function AbortableFetch(url, options) {
    classCallCheck(this, AbortableFetch);

    this.url = url;
    this.options = options;
    this.controller = new window.AbortController();
    this.status = 'UNSENT';
  }

  createClass(AbortableFetch, [{
    key: 'send',
    value: function send() {
      var _this = this;

      this.status = 'LOADING';

      return new Promise(function (resolve, reject) {
        abortableFetch(_this.url, _extends({ signal: _this.controller.signal }, _this.options)).then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            _this.status = 'DONE';
            resolve(response);
          } else {
            _this.status = 'DONE';
            reject(response);
          }
        }).catch(function (error) {
          _this.status = 'DONE';
          reject(error);
        });
      });
    }
  }, {
    key: 'abort',
    value: function abort() {
      this.controller.abort();
    }
  }]);
  return AbortableFetch;
}();

function abortableFetch(url, options) {
  return window.fetch(url, options).then(function (response) {
    if (response.ok) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }).catch(function (error) {
    throw error;
  });
}

var TypeaheadService = function () {
  function TypeaheadService(_ref) {
    var apiUrl = _ref.apiUrl,
        lang = _ref.lang;
    classCallCheck(this, TypeaheadService);
    this.requestConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    if (!apiUrl || !lang) {
      throw Error('[TypeaheadService] \'apiUrl\', \'lang\' parameters are required');
    }

    this.apiUrl = apiUrl;
    this.lang = lang;
  }

  createClass(TypeaheadService, [{
    key: 'get',
    value: function get$$1(sanitisedQuery) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var query = {
          query: sanitisedQuery,
          lang: _this.lang
        };

        if (_this.fetch && _this.fetch.status !== 'DONE') {
          _this.fetch.abort();
        }

        _this.requestConfig.body = formBodyFromObject(query);
        _this.fetch = new AbortableFetch(_this.apiUrl, _this.requestConfig);

        _this.fetch.send().then(resolve).catch(reject);
      });
    }
  }]);
  return TypeaheadService;
}();

function typeaheadDataMap(opts, response) {
  var _this = this;

  /**
   * Required parameter validation needed
   */

  return response.json().then(function (data) {
    var results = data.results;

    results.forEach(function (result) {
      result.sanitisedText = sanitiseTypeaheadText(result[opts.lang], opts.sanitisedQueryReplaceChars);

      if (opts.lang !== 'en-gb') {
        var english = result['en-gb'];
        var sanitisedAlternative = sanitiseTypeaheadText(english, _this.sanitisedQueryReplaceChars);

        if (sanitisedAlternative.match(opts.query)) {
          result.alternatives = [english];
          result.sanitisedAlternatives = [sanitisedAlternative];
        }
      } else {
        result.alternatives = [];
        result.sanitisedAlternatives = [];
      }
    });

    return {
      results: results,
      totalResults: data.totalResults
    };
  });
}

var TypeaheadContainer = function TypeaheadContainer(context) {
  var _this = this;

  classCallCheck(this, TypeaheadContainer);

  this.typeahead = new TypeaheadComponent({ context: context });

  this.service = new TypeaheadService({
    apiUrl: this.typeahead.apiUrl,
    lang: document.documentElement.getAttribute('lang').toLowerCase(),
    sanitisedQueryReplaceChars: this.typeahead.sanitisedQueryReplaceChars
  });

  this.typeahead.emitter.on(NEW_FIELD_VALUE_EVENT, function (value) {

    /**
     * Call service, partially apply config for promise callbacks
     */
    _this.service.get(value).then(typeaheadDataMap.bind(null, {
      query: value,
      lang: _this.typeahead.lang,
      sanitisedQueryReplaceChars: _this.typeahead.sanitisedQueryReplaceChars
    })).then(_this.typeahead.updateData.bind(_this.typeahead)).catch(function (error) {
      if (error.name !== 'AbortError') {
        console.log('TypeaheadService error: ', error, 'query: ', value);
      }
    });
  });

  this.code = context.querySelector('.js-typeahead-code');

  this.typeahead.emitter.on(NEW_ITEM_SELECTED_EVENT, function (value) {
    return _this.code.value = value.code;
  });

  this.typeahead.emitter.on(UNSET_FIELD_VALUE_EVENT, function () {
    return _this.code.value = '';
  });
};

function TypeaheadModule() {
  var typeaheads = [].concat(toConsumableArray(document.querySelectorAll('.js-typeahead')));

  typeaheads.forEach(function (typeahead) {
    return new TypeaheadContainer(typeahead);
  });
}

/**
 * Temporary - just for prototype, should belong in main/boot file
 */
document.addEventListener('TYPEAHEAD-READY', function () {
  return new TypeaheadModule();
});

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
  'three-more': 'People who usually live outside the UK who are staying in the UK for 3 months or more',
  'perm-away': 'People who work away from home within the UK if this is their permanent or family home',
  'armed-forces': 'Members of the armed forces if this is their permanent or family home',
  'less-twelve': 'People who are temporarily outside the UK for less than 12 months',
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
      label: 'Other White ethnic group or background'
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
      label: 'Other Asian ethnic group or background'
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
  'one': 'first',
  'two': 'second',
  'three': 'third',
  'four': 'fourth',
  'five': 'fifth',
  'six': 'sixth',
  'seven': 'seventh',
  'eight': 'eighth',
  'nine': 'ninth',
  'ten': 'tenth',
  'eleven': 'eleventh',
  'twelve': 'twelfth',
  'thirteen': 'thirteenth',
  'fourteen': 'fourteenth',
  'fifteen': 'fifteenth',
  'sixteen': 'sixteenth',
  'seventeen': 'seventeenth',
  'eighteen': 'eighteenth',
  'nineteen': 'nineteenth',

  'twenty': 'twentieth',
  'thirty': 'thirtieth',
  'forty': 'fortieth',
  'fifty': 'fiftieth',
  'sixty': 'sixtieth',
  'seventy': 'seventieth',
  'eighty': 'eightieth',
  'ninety': 'ninetieth',
  'hundred': 'hundredth',

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
  return $('<li class="list__item">').addClass('mars').html('<span class="list__item-name">' + member['@person'].fullName + (member['@person'].id === USER_HOUSEHOLD_MEMBER_ID ? ' (You)' : '') + '</span>');
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

  var personId = new URLSearchParams(window.location.search).get('person');

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
  var personId = new URLSearchParams(window.location.search).get('person');

  if (personId) {
    var urlParam = new URLSearchParams(window.location.search),
        _person2 = getHouseholdMemberByPersonId(personId)['@person'],
        pinObj = getPinFor(personId),
        secureLinkTextConfig = secureLinkTextMap[getAnsweringIndividualByProxy() ? 'question-proxy' : pinObj && pinObj.pin ? 'pin-you' : 'question-you'],
        linkHref = secureLinkTextConfig.link + '?person=' + personId + '&returnurl=' + window.location.pathname,
        surveyType = urlParam.get('survey');

    linkHref += surveyType ? '&survey=' + surveyType : '';

    var $secureLink = $('.js-link-secure');
    $secureLink.attr('href', linkHref);

    $secureLink.html(secureLinkTextConfig.linkText);
    $('.js-link-secure-label').html(secureLinkTextConfig.description.replace('$[NAME]', _person2.fullName));

    var personLink = $('.js-link-person');
    personLink.attr('href', personLink.attr('href') + '?person=' + personId + (surveyType ? '&survey=' + surveyType : ''));
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
  return '3 February 2019';
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

  if (memberIsUser) {
    personNameText += ' (You)';
    $editLink.html('Change');
    $removeLink.hide();
    $spacer.hide();
  }

  $nodeEl.attr('id', '');
  $nodeEl.find('.js-person-name').html(personNameText);

  $editLink.attr('href', (memberIsUser ? '../' + altPage + 'what-is-your-name/?edit=true' : '../' + altPage + 'who-else-to-add/?edit=' + member['@person'].id + (isVisitor(member) ? '&journey=visitors' : '')) + redirectTo);

  $removeLink.attr('href', '../remove-household-member/?person=' + member['@person'].id + redirectTo);

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
      personId = urlParams.get('person');

  if (!isContinuing) {
    return false;
  }

  var template = '<div class="panel panel--simple panel--info u-mb-s">\n      <div class="panel__body">\n          <strong>This was the last question\n              you answered in the section</strong>\n          <p>You can review your answers\n              at the <a href="../individual-decision/?person=' + personId + '">start \n              of this section</a>\n          </p>\n      </div>\n  </div>';

  $('.js-heading').closest('.question').prepend(template);
}

function updateSaveAndCompleteLater() {
  $('.complete-later').on('click', function (e) {
    e.preventDefault();

    window.location.href = '../index/?redirect=../hub';
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
  getSignificant: getSignificant,
  cleanHTMLPlaceholderStringReplacment: cleanHTMLPlaceholderStringReplacment
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy95b3VyLWhvdXNlaG9sZC12MTIvYnVuZGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iajtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxudmFyIGNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpO1xuXG5cblxuXG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIHRvQ29uc3VtYWJsZUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFycik7XG4gIH1cbn07XG5cbi8qXG4qIEZpbGVTYXZlci5qc1xuKiBBIHNhdmVBcygpIEZpbGVTYXZlciBpbXBsZW1lbnRhdGlvbi5cbipcbiogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuKlxuKiBMaWNlbnNlIDogaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvRmlsZVNhdmVyLmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWQgKE1JVClcbiogc291cmNlICA6IGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9GaWxlU2F2ZXIuanNcbiovXG5cbi8vIFRoZSBvbmUgYW5kIG9ubHkgd2F5IG9mIGdldHRpbmcgZ2xvYmFsIHNjb3BlIGluIGFsbCBlbnZpcm9ubWVudHNcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcS8zMjc3MTgyLzEwMDg5OTlcbnZhciBfZ2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHdpbmRvdykpID09PSAnb2JqZWN0JyAmJiB3aW5kb3cud2luZG93ID09PSB3aW5kb3cgPyB3aW5kb3cgOiAodHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHNlbGYpKSA9PT0gJ29iamVjdCcgJiYgc2VsZi5zZWxmID09PSBzZWxmID8gc2VsZiA6ICh0eXBlb2YgZ2xvYmFsID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihnbG9iYWwpKSA9PT0gJ29iamVjdCcgJiYgZ2xvYmFsLmdsb2JhbCA9PT0gZ2xvYmFsID8gZ2xvYmFsIDogdW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBib20oYmxvYiwgb3B0cykge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICd1bmRlZmluZWQnKSBvcHRzID0geyBhdXRvQm9tOiBmYWxzZSB9O2Vsc2UgaWYgKCh0eXBlb2Ygb3B0cyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob3B0cykpICE9PSAnb2JqZWN0Jykge1xuICAgIGNvbnNvbGUud2FybignRGVwcmVjYXRlZDogRXhwZWN0ZWQgdGhpcmQgYXJndW1lbnQgdG8gYmUgYSBvYmplY3QnKTtcbiAgICBvcHRzID0geyBhdXRvQm9tOiAhb3B0cyB9O1xuICB9XG5cbiAgLy8gcHJlcGVuZCBCT00gZm9yIFVURi04IFhNTCBhbmQgdGV4dC8qIHR5cGVzIChpbmNsdWRpbmcgSFRNTClcbiAgLy8gbm90ZTogeW91ciBicm93c2VyIHdpbGwgYXV0b21hdGljYWxseSBjb252ZXJ0IFVURi0xNiBVK0ZFRkYgdG8gRUYgQkIgQkZcbiAgaWYgKG9wdHMuYXV0b0JvbSAmJiAvXlxccyooPzp0ZXh0XFwvXFxTKnxhcHBsaWNhdGlvblxcL3htbHxcXFMqXFwvXFxTKlxcK3htbClcXHMqOy4qY2hhcnNldFxccyo9XFxzKnV0Zi04L2kudGVzdChibG9iLnR5cGUpKSB7XG4gICAgcmV0dXJuIG5ldyBCbG9iKFtTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkVGRiksIGJsb2JdLCB7IHR5cGU6IGJsb2IudHlwZSB9KTtcbiAgfVxuICByZXR1cm4gYmxvYjtcbn1cblxuZnVuY3Rpb24gZG93bmxvYWQodXJsLCBuYW1lLCBvcHRzKSB7XG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7XG4gIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2F2ZUFzKHhoci5yZXNwb25zZSwgbmFtZSwgb3B0cyk7XG4gIH07XG4gIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2NvdWxkIG5vdCBkb3dubG9hZCBmaWxlJyk7XG4gIH07XG4gIHhoci5zZW5kKCk7XG59XG5cbmZ1bmN0aW9uIGNvcnNFbmFibGVkKHVybCkge1xuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIC8vIHVzZSBzeW5jIHRvIGF2b2lkIHBvcHVwIGJsb2NrZXJcbiAgeGhyLm9wZW4oJ0hFQUQnLCB1cmwsIGZhbHNlKTtcbiAgeGhyLnNlbmQoKTtcbiAgcmV0dXJuIHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPD0gMjk5O1xufVxuXG4vLyBgYS5jbGljaygpYCBkb2Vzbid0IHdvcmsgZm9yIGFsbCBicm93c2VycyAoIzQ2NSlcbmZ1bmN0aW9uIGNsaWNrKG5vZGUpIHtcbiAgdHJ5IHtcbiAgICBub2RlLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ2NsaWNrJykpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdNb3VzZUV2ZW50cycpO1xuICAgIGV2dC5pbml0TW91c2VFdmVudCgnY2xpY2snLCB0cnVlLCB0cnVlLCB3aW5kb3csIDAsIDAsIDAsIDgwLCAyMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuICAgIG5vZGUuZGlzcGF0Y2hFdmVudChldnQpO1xuICB9XG59XG5cbnZhciBzYXZlQXMgPSBfZ2xvYmFsLnNhdmVBcyB8fCAoXG4vLyBwcm9iYWJseSBpbiBzb21lIHdlYiB3b3JrZXJcbih0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih3aW5kb3cpKSAhPT0gJ29iamVjdCcgfHwgd2luZG93ICE9PSBfZ2xvYmFsID8gZnVuY3Rpb24gc2F2ZUFzKCkge30gLyogbm9vcCAqL1xuXG5cbi8vIFVzZSBkb3dubG9hZCBhdHRyaWJ1dGUgZmlyc3QgaWYgcG9zc2libGUgKCMxOTMgTHVtaWEgbW9iaWxlKVxuOiAnZG93bmxvYWQnIGluIEhUTUxBbmNob3JFbGVtZW50LnByb3RvdHlwZSA/IGZ1bmN0aW9uIHNhdmVBcyhibG9iLCBuYW1lLCBvcHRzKSB7XG4gIHZhciBVUkwgPSBfZ2xvYmFsLlVSTCB8fCBfZ2xvYmFsLndlYmtpdFVSTDtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIG5hbWUgPSBuYW1lIHx8IGJsb2IubmFtZSB8fCAnZG93bmxvYWQnO1xuXG4gIGEuZG93bmxvYWQgPSBuYW1lO1xuICBhLnJlbCA9ICdub29wZW5lcic7IC8vIHRhYm5hYmJpbmdcblxuICAvLyBUT0RPOiBkZXRlY3QgY2hyb21lIGV4dGVuc2lvbnMgJiBwYWNrYWdlZCBhcHBzXG4gIC8vIGEudGFyZ2V0ID0gJ19ibGFuaydcblxuICBpZiAodHlwZW9mIGJsb2IgPT09ICdzdHJpbmcnKSB7XG4gICAgLy8gU3VwcG9ydCByZWd1bGFyIGxpbmtzXG4gICAgYS5ocmVmID0gYmxvYjtcbiAgICBpZiAoYS5vcmlnaW4gIT09IGxvY2F0aW9uLm9yaWdpbikge1xuICAgICAgY29yc0VuYWJsZWQoYS5ocmVmKSA/IGRvd25sb2FkKGJsb2IsIG5hbWUsIG9wdHMpIDogY2xpY2soYSwgYS50YXJnZXQgPSAnX2JsYW5rJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsaWNrKGEpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBTdXBwb3J0IGJsb2JzXG4gICAgYS5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwoYS5ocmVmKTtcbiAgICB9LCA0RTQpOyAvLyA0MHNcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGNsaWNrKGEpO1xuICAgIH0sIDApO1xuICB9XG59XG5cbi8vIFVzZSBtc1NhdmVPck9wZW5CbG9iIGFzIGEgc2Vjb25kIGFwcHJvYWNoXG46ICdtc1NhdmVPck9wZW5CbG9iJyBpbiBuYXZpZ2F0b3IgPyBmdW5jdGlvbiBzYXZlQXMoYmxvYiwgbmFtZSwgb3B0cykge1xuICBuYW1lID0gbmFtZSB8fCBibG9iLm5hbWUgfHwgJ2Rvd25sb2FkJztcblxuICBpZiAodHlwZW9mIGJsb2IgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGNvcnNFbmFibGVkKGJsb2IpKSB7XG4gICAgICBkb3dubG9hZChibG9iLCBuYW1lLCBvcHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICBhLmhyZWYgPSBibG9iO1xuICAgICAgYS50YXJnZXQgPSAnX2JsYW5rJztcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGljayhhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBuYXZpZ2F0b3IubXNTYXZlT3JPcGVuQmxvYihib20oYmxvYiwgb3B0cyksIG5hbWUpO1xuICB9XG59XG5cbi8vIEZhbGxiYWNrIHRvIHVzaW5nIEZpbGVSZWFkZXIgYW5kIGEgcG9wdXBcbjogZnVuY3Rpb24gc2F2ZUFzKGJsb2IsIG5hbWUsIG9wdHMsIHBvcHVwKSB7XG4gIC8vIE9wZW4gYSBwb3B1cCBpbW1lZGlhdGVseSBkbyBnbyBhcm91bmQgcG9wdXAgYmxvY2tlclxuICAvLyBNb3N0bHkgb25seSBhdmFpbGFibGUgb24gdXNlciBpbnRlcmFjdGlvbiBhbmQgdGhlIGZpbGVSZWFkZXIgaXMgYXN5bmMgc28uLi5cbiAgcG9wdXAgPSBwb3B1cCB8fCBvcGVuKCcnLCAnX2JsYW5rJyk7XG4gIGlmIChwb3B1cCkge1xuICAgIHBvcHVwLmRvY3VtZW50LnRpdGxlID0gcG9wdXAuZG9jdW1lbnQuYm9keS5pbm5lclRleHQgPSAnZG93bmxvYWRpbmcuLi4nO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBibG9iID09PSAnc3RyaW5nJykgcmV0dXJuIGRvd25sb2FkKGJsb2IsIG5hbWUsIG9wdHMpO1xuXG4gIHZhciBmb3JjZSA9IGJsb2IudHlwZSA9PT0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIHZhciBpc1NhZmFyaSA9IC9jb25zdHJ1Y3Rvci9pLnRlc3QoX2dsb2JhbC5IVE1MRWxlbWVudCkgfHwgX2dsb2JhbC5zYWZhcmk7XG4gIHZhciBpc0Nocm9tZUlPUyA9IC9DcmlPU1xcL1tcXGRdKy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuICBpZiAoKGlzQ2hyb21lSU9TIHx8IGZvcmNlICYmIGlzU2FmYXJpKSAmJiAodHlwZW9mIEZpbGVSZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKEZpbGVSZWFkZXIpKSA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBTYWZhcmkgZG9lc24ndCBhbGxvdyBkb3dubG9hZGluZyBvZiBibG9iIFVSTHNcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHVybCA9IHJlYWRlci5yZXN1bHQ7XG4gICAgICB1cmwgPSBpc0Nocm9tZUlPUyA/IHVybCA6IHVybC5yZXBsYWNlKC9eZGF0YTpbXjtdKjsvLCAnZGF0YTphdHRhY2htZW50L2ZpbGU7Jyk7XG4gICAgICBpZiAocG9wdXApIHBvcHVwLmxvY2F0aW9uLmhyZWYgPSB1cmw7ZWxzZSBsb2NhdGlvbiA9IHVybDtcbiAgICAgIHBvcHVwID0gbnVsbDsgLy8gcmV2ZXJzZS10YWJuYWJiaW5nICM0NjBcbiAgICB9O1xuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGJsb2IpO1xuICB9IGVsc2Uge1xuICAgIHZhciBVUkwgPSBfZ2xvYmFsLlVSTCB8fCBfZ2xvYmFsLndlYmtpdFVSTDtcbiAgICB2YXIgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBpZiAocG9wdXApIHBvcHVwLmxvY2F0aW9uID0gdXJsO2Vsc2UgbG9jYXRpb24uaHJlZiA9IHVybDtcbiAgICBwb3B1cCA9IG51bGw7IC8vIHJldmVyc2UtdGFibmFiYmluZyAjNDYwXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gICAgfSwgNEU0KTsgLy8gNDBzXG4gIH1cbn0pO1xuXG5fZ2xvYmFsLnNhdmVBcyA9IHNhdmVBcy5zYXZlQXMgPSBzYXZlQXM7XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHNhdmVBcztcbn1cblxuaWYgKCFBcnJheS5mcm9tKSB7XG4gIEFycmF5LmZyb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgICB2YXIgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUoZm4pIHtcbiAgICAgIHJldHVybiB0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgfHwgdG9TdHIuY2FsbChmbikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gICAgfTtcbiAgICB2YXIgdG9JbnRlZ2VyID0gZnVuY3Rpb24gdG9JbnRlZ2VyKHZhbHVlKSB7XG4gICAgICB2YXIgbnVtYmVyID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgIGlmIChpc05hTihudW1iZXIpKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgaWYgKG51bWJlciA9PT0gMCB8fCAhaXNGaW5pdGUobnVtYmVyKSkge1xuICAgICAgICByZXR1cm4gbnVtYmVyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChudW1iZXIgPiAwID8gMSA6IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnMobnVtYmVyKSk7XG4gICAgfTtcbiAgICB2YXIgbWF4U2FmZUludGVnZXIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuICAgIHZhciB0b0xlbmd0aCA9IGZ1bmN0aW9uIHRvTGVuZ3RoKHZhbHVlKSB7XG4gICAgICB2YXIgbGVuID0gdG9JbnRlZ2VyKHZhbHVlKTtcbiAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW4sIDApLCBtYXhTYWZlSW50ZWdlcik7XG4gICAgfTtcblxuICAgIC8vIFRoZSBsZW5ndGggcHJvcGVydHkgb2YgdGhlIGZyb20gbWV0aG9kIGlzIDEuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qLCBtYXBGbiwgdGhpc0FyZyAqLykge1xuICAgICAgLy8gMS4gTGV0IEMgYmUgdGhlIHRoaXMgdmFsdWUuXG4gICAgICB2YXIgQyA9IHRoaXM7XG5cbiAgICAgIC8vIDIuIExldCBpdGVtcyBiZSBUb09iamVjdChhcnJheUxpa2UpLlxuICAgICAgdmFyIGl0ZW1zID0gT2JqZWN0KGFycmF5TGlrZSk7XG5cbiAgICAgIC8vIDMuIFJldHVybklmQWJydXB0KGl0ZW1zKS5cbiAgICAgIGlmIChhcnJheUxpa2UgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5mcm9tIHJlcXVpcmVzIGFuIGFycmF5LWxpa2Ugb2JqZWN0IC0gbm90IG51bGwgb3IgdW5kZWZpbmVkJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIDQuIElmIG1hcGZuIGlzIHVuZGVmaW5lZCwgdGhlbiBsZXQgbWFwcGluZyBiZSBmYWxzZS5cbiAgICAgIHZhciBtYXBGbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdm9pZCB1bmRlZmluZWQ7XG4gICAgICB2YXIgVDtcbiAgICAgIGlmICh0eXBlb2YgbWFwRm4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIDUuIGVsc2VcbiAgICAgICAgLy8gNS4gYSBJZiBJc0NhbGxhYmxlKG1hcGZuKSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAoIWlzQ2FsbGFibGUobWFwRm4pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkuZnJvbTogd2hlbiBwcm92aWRlZCwgdGhlIHNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDUuIGIuIElmIHRoaXNBcmcgd2FzIHN1cHBsaWVkLCBsZXQgVCBiZSB0aGlzQXJnOyBlbHNlIGxldCBUIGJlIHVuZGVmaW5lZC5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgVCA9IGFyZ3VtZW50c1syXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAxMC4gTGV0IGxlblZhbHVlIGJlIEdldChpdGVtcywgXCJsZW5ndGhcIikuXG4gICAgICAvLyAxMS4gTGV0IGxlbiBiZSBUb0xlbmd0aChsZW5WYWx1ZSkuXG4gICAgICB2YXIgbGVuID0gdG9MZW5ndGgoaXRlbXMubGVuZ3RoKTtcblxuICAgICAgLy8gMTMuIElmIElzQ29uc3RydWN0b3IoQykgaXMgdHJ1ZSwgdGhlblxuICAgICAgLy8gMTMuIGEuIExldCBBIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2RcbiAgICAgIC8vIG9mIEMgd2l0aCBhbiBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcgdGhlIHNpbmdsZSBpdGVtIGxlbi5cbiAgICAgIC8vIDE0LiBhLiBFbHNlLCBMZXQgQSBiZSBBcnJheUNyZWF0ZShsZW4pLlxuICAgICAgdmFyIEEgPSBpc0NhbGxhYmxlKEMpID8gT2JqZWN0KG5ldyBDKGxlbikpIDogbmV3IEFycmF5KGxlbik7XG5cbiAgICAgIC8vIDE2LiBMZXQgayBiZSAwLlxuICAgICAgdmFyIGsgPSAwO1xuICAgICAgLy8gMTcuIFJlcGVhdCwgd2hpbGUgayA8IGxlbuKApiAoYWxzbyBzdGVwcyBhIC0gaClcbiAgICAgIHZhciBrVmFsdWU7XG4gICAgICB3aGlsZSAoayA8IGxlbikge1xuICAgICAgICBrVmFsdWUgPSBpdGVtc1trXTtcbiAgICAgICAgaWYgKG1hcEZuKSB7XG4gICAgICAgICAgQVtrXSA9IHR5cGVvZiBUID09PSAndW5kZWZpbmVkJyA/IG1hcEZuKGtWYWx1ZSwgaykgOiBtYXBGbi5jYWxsKFQsIGtWYWx1ZSwgayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgQVtrXSA9IGtWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBrICs9IDE7XG4gICAgICB9XG4gICAgICAvLyAxOC4gTGV0IHB1dFN0YXR1cyBiZSBQdXQoQSwgXCJsZW5ndGhcIiwgbGVuLCB0cnVlKS5cbiAgICAgIEEubGVuZ3RoID0gbGVuO1xuICAgICAgLy8gMjAuIFJldHVybiBBLlxuICAgICAgcmV0dXJuIEE7XG4gICAgfTtcbiAgfSgpO1xufVxuXG4vKipcbiAqXG4gKlxuICogQGF1dGhvciBKZXJyeSBCZW5keSA8amVycnlAaWNld2luZ2NjLmNvbT5cbiAqIEBsaWNlbmNlIE1JVFxuICpcbiAqL1xuXG4oZnVuY3Rpb24gKHNlbGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBuYXRpdmVVUkxTZWFyY2hQYXJhbXMgPSBzZWxmLlVSTFNlYXJjaFBhcmFtcyAmJiBzZWxmLlVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuZ2V0ID8gc2VsZi5VUkxTZWFyY2hQYXJhbXMgOiBudWxsLFxuICAgICAgaXNTdXBwb3J0T2JqZWN0Q29uc3RydWN0b3IgPSBuYXRpdmVVUkxTZWFyY2hQYXJhbXMgJiYgbmV3IG5hdGl2ZVVSTFNlYXJjaFBhcmFtcyh7IGE6IDEgfSkudG9TdHJpbmcoKSA9PT0gJ2E9MScsXG5cbiAgLy8gVGhlcmUgaXMgYSBidWcgaW4gc2FmYXJpIDEwLjEgKGFuZCBlYXJsaWVyKSB0aGF0IGluY29ycmVjdGx5IGRlY29kZXMgYCUyQmAgYXMgYW4gZW1wdHkgc3BhY2UgYW5kIG5vdCBhIHBsdXMuXG4gIGRlY29kZXNQbHVzZXNDb3JyZWN0bHkgPSBuYXRpdmVVUkxTZWFyY2hQYXJhbXMgJiYgbmV3IG5hdGl2ZVVSTFNlYXJjaFBhcmFtcygncz0lMkInKS5nZXQoJ3MnKSA9PT0gJysnLFxuICAgICAgX19VUkxTZWFyY2hQYXJhbXNfXyA9IFwiX19VUkxTZWFyY2hQYXJhbXNfX1wiLFxuXG4gIC8vIEZpeCBidWcgaW4gRWRnZSB3aGljaCBjYW5ub3QgZW5jb2RlICcgJicgY29ycmVjdGx5XG4gIGVuY29kZXNBbXBlcnNhbmRzQ29ycmVjdGx5ID0gbmF0aXZlVVJMU2VhcmNoUGFyYW1zID8gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbXBlcnNhbmRUZXN0ID0gbmV3IG5hdGl2ZVVSTFNlYXJjaFBhcmFtcygpO1xuICAgIGFtcGVyc2FuZFRlc3QuYXBwZW5kKCdzJywgJyAmJyk7XG4gICAgcmV0dXJuIGFtcGVyc2FuZFRlc3QudG9TdHJpbmcoKSA9PT0gJ3M9KyUyNic7XG4gIH0oKSA6IHRydWUsXG4gICAgICBwcm90b3R5cGUgPSBVUkxTZWFyY2hQYXJhbXNQb2x5ZmlsbC5wcm90b3R5cGUsXG4gICAgICBpdGVyYWJsZSA9ICEhKHNlbGYuU3ltYm9sICYmIHNlbGYuU3ltYm9sLml0ZXJhdG9yKTtcblxuICBpZiAobmF0aXZlVVJMU2VhcmNoUGFyYW1zICYmIGlzU3VwcG9ydE9iamVjdENvbnN0cnVjdG9yICYmIGRlY29kZXNQbHVzZXNDb3JyZWN0bHkgJiYgZW5jb2Rlc0FtcGVyc2FuZHNDb3JyZWN0bHkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhIFVSTFNlYXJjaFBhcmFtcyBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8VVJMU2VhcmNoUGFyYW1zfSBzZWFyY2hcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBmdW5jdGlvbiBVUkxTZWFyY2hQYXJhbXNQb2x5ZmlsbChzZWFyY2gpIHtcbiAgICBzZWFyY2ggPSBzZWFyY2ggfHwgXCJcIjtcblxuICAgIC8vIHN1cHBvcnQgY29uc3RydWN0IG9iamVjdCB3aXRoIGFub3RoZXIgVVJMU2VhcmNoUGFyYW1zIGluc3RhbmNlXG4gICAgaWYgKHNlYXJjaCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcyB8fCBzZWFyY2ggaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXNQb2x5ZmlsbCkge1xuICAgICAgc2VhcmNoID0gc2VhcmNoLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHRoaXNbX19VUkxTZWFyY2hQYXJhbXNfX10gPSBwYXJzZVRvRGljdChzZWFyY2gpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSBzcGVjaWZpZWQga2V5L3ZhbHVlIHBhaXIgYXMgYSBuZXcgc2VhcmNoIHBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gICAqL1xuICBwcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgYXBwZW5kVG8odGhpc1tfX1VSTFNlYXJjaFBhcmFtc19fXSwgbmFtZSwgdmFsdWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZWxldGVzIHRoZSBnaXZlbiBzZWFyY2ggcGFyYW1ldGVyLCBhbmQgaXRzIGFzc29jaWF0ZWQgdmFsdWUsXG4gICAqIGZyb20gdGhlIGxpc3Qgb2YgYWxsIHNlYXJjaCBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKi9cbiAgcHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXNbX19VUkxTZWFyY2hQYXJhbXNfX11bbmFtZV07XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZpcnN0IHZhbHVlIGFzc29jaWF0ZWQgdG8gdGhlIGdpdmVuIHNlYXJjaCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEByZXR1cm5zIHtzdHJpbmd8bnVsbH1cbiAgICovXG4gIHByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkaWN0ID0gdGhpc1tfX1VSTFNlYXJjaFBhcmFtc19fXTtcbiAgICByZXR1cm4gbmFtZSBpbiBkaWN0ID8gZGljdFtuYW1lXVswXSA6IG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIHRoZSB2YWx1ZXMgYXNzb2NpYXRpb24gd2l0aCBhIGdpdmVuIHNlYXJjaCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG4gIHByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkaWN0ID0gdGhpc1tfX1VSTFNlYXJjaFBhcmFtc19fXTtcbiAgICByZXR1cm4gbmFtZSBpbiBkaWN0ID8gZGljdFtuYW1lXS5zbGljZSgwKSA6IFtdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgQm9vbGVhbiBpbmRpY2F0aW5nIGlmIHN1Y2ggYSBzZWFyY2ggcGFyYW1ldGVyIGV4aXN0cy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBwcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZSBpbiB0aGlzW19fVVJMU2VhcmNoUGFyYW1zX19dO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHRvIGEgZ2l2ZW4gc2VhcmNoIHBhcmFtZXRlciB0b1xuICAgKiB0aGUgZ2l2ZW4gdmFsdWUuIElmIHRoZXJlIHdlcmUgc2V2ZXJhbCB2YWx1ZXMsIGRlbGV0ZSB0aGVcbiAgICogb3RoZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICovXG4gIHByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQkJDEobmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzW19fVVJMU2VhcmNoUGFyYW1zX19dW25hbWVdID0gWycnICsgdmFsdWVdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5nIGEgcXVlcnkgc3RyaW5nIHN1aXRhYmxlIGZvciB1c2UgaW4gYSBVUkwuXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBwcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRpY3QgPSB0aGlzW19fVVJMU2VhcmNoUGFyYW1zX19dLFxuICAgICAgICBxdWVyeSA9IFtdLFxuICAgICAgICBpLFxuICAgICAgICBrZXksXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHZhbHVlO1xuICAgIGZvciAoa2V5IGluIGRpY3QpIHtcbiAgICAgIG5hbWUgPSBlbmNvZGUoa2V5KTtcbiAgICAgIGZvciAoaSA9IDAsIHZhbHVlID0gZGljdFtrZXldOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcXVlcnkucHVzaChuYW1lICsgJz0nICsgZW5jb2RlKHZhbHVlW2ldKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBxdWVyeS5qb2luKCcmJyk7XG4gIH07XG5cbiAgLy8gVGhlcmUgaXMgYSBidWcgaW4gU2FmYXJpIDEwLjEgYW5kIGBQcm94eWBpbmcgaXQgaXMgbm90IGVub3VnaC5cbiAgdmFyIGZvclN1cmVVc2VQb2x5ZmlsbCA9ICFkZWNvZGVzUGx1c2VzQ29ycmVjdGx5O1xuICB2YXIgdXNlUHJveHkgPSAhZm9yU3VyZVVzZVBvbHlmaWxsICYmIG5hdGl2ZVVSTFNlYXJjaFBhcmFtcyAmJiAhaXNTdXBwb3J0T2JqZWN0Q29uc3RydWN0b3IgJiYgc2VsZi5Qcm94eTtcbiAgLypcbiAgICogQXBwbHkgcG9saWZpbGwgdG8gZ2xvYmFsIG9iamVjdCBhbmQgYXBwZW5kIG90aGVyIHByb3RvdHlwZSBpbnRvIGl0XG4gICAqL1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwgJ1VSTFNlYXJjaFBhcmFtcycsIHtcbiAgICB2YWx1ZTogdXNlUHJveHkgP1xuICAgIC8vIFNhZmFyaSAxMC4wIGRvZXNuJ3Qgc3VwcG9ydCBQcm94eSwgc28gaXQgd29uJ3QgZXh0ZW5kIFVSTFNlYXJjaFBhcmFtcyBvbiBzYWZhcmkgMTAuMFxuICAgIG5ldyBQcm94eShuYXRpdmVVUkxTZWFyY2hQYXJhbXMsIHtcbiAgICAgIGNvbnN0cnVjdDogZnVuY3Rpb24gY29uc3RydWN0KHRhcmdldCwgYXJncykge1xuICAgICAgICByZXR1cm4gbmV3IHRhcmdldChuZXcgVVJMU2VhcmNoUGFyYW1zUG9seWZpbGwoYXJnc1swXSkudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfSkgOiBVUkxTZWFyY2hQYXJhbXNQb2x5ZmlsbFxuICB9KTtcblxuICB2YXIgVVNQUHJvdG8gPSBzZWxmLlVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGU7XG5cbiAgVVNQUHJvdG8ucG9seWZpbGwgPSB0cnVlO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcGFyYW0ge29iamVjdH0gdGhpc0FyZ1xuICAgKi9cbiAgVVNQUHJvdG8uZm9yRWFjaCA9IFVTUFByb3RvLmZvckVhY2ggfHwgZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIGRpY3QgPSBwYXJzZVRvRGljdCh0aGlzLnRvU3RyaW5nKCkpO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGRpY3QpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGRpY3RbbmFtZV0uZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgbmFtZSwgdGhpcyk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuICAvKipcbiAgICogU29ydCBhbGwgbmFtZS12YWx1ZSBwYWlyc1xuICAgKi9cbiAgVVNQUHJvdG8uc29ydCA9IFVTUFByb3RvLnNvcnQgfHwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkaWN0ID0gcGFyc2VUb0RpY3QodGhpcy50b1N0cmluZygpKSxcbiAgICAgICAga2V5cyA9IFtdLFxuICAgICAgICBrLFxuICAgICAgICBpLFxuICAgICAgICBqO1xuICAgIGZvciAoayBpbiBkaWN0KSB7XG4gICAgICBrZXlzLnB1c2goayk7XG4gICAgfVxuICAgIGtleXMuc29ydCgpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXNbJ2RlbGV0ZSddKGtleXNbaV0pO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV0sXG4gICAgICAgICAgdmFsdWVzID0gZGljdFtrZXldO1xuICAgICAgZm9yIChqID0gMDsgaiA8IHZhbHVlcy5sZW5ndGg7IGorKykge1xuICAgICAgICB0aGlzLmFwcGVuZChrZXksIHZhbHVlc1tqXSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGl0ZXJhdG9yIGFsbG93aW5nIHRvIGdvIHRocm91Z2ggYWxsIGtleXMgb2ZcbiAgICogdGhlIGtleS92YWx1ZSBwYWlycyBjb250YWluZWQgaW4gdGhpcyBvYmplY3QuXG4gICAqXG4gICAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAgICovXG4gIFVTUFByb3RvLmtleXMgPSBVU1BQcm90by5rZXlzIHx8IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIG5hbWUpIHtcbiAgICAgIGl0ZW1zLnB1c2gobmFtZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1ha2VJdGVyYXRvcihpdGVtcyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlcmF0b3IgYWxsb3dpbmcgdG8gZ28gdGhyb3VnaCBhbGwgdmFsdWVzIG9mXG4gICAqIHRoZSBrZXkvdmFsdWUgcGFpcnMgY29udGFpbmVkIGluIHRoaXMgb2JqZWN0LlxuICAgKlxuICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gICAqL1xuICBVU1BQcm90by52YWx1ZXMgPSBVU1BQcm90by52YWx1ZXMgfHwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgaXRlbXMucHVzaChpdGVtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWFrZUl0ZXJhdG9yKGl0ZW1zKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpdGVyYXRvciBhbGxvd2luZyB0byBnbyB0aHJvdWdoIGFsbCBrZXkvdmFsdWVcbiAgICogcGFpcnMgY29udGFpbmVkIGluIHRoaXMgb2JqZWN0LlxuICAgKlxuICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gICAqL1xuICBVU1BQcm90by5lbnRyaWVzID0gVVNQUHJvdG8uZW50cmllcyB8fCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBuYW1lKSB7XG4gICAgICBpdGVtcy5wdXNoKFtuYW1lLCBpdGVtXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1ha2VJdGVyYXRvcihpdGVtcyk7XG4gIH07XG5cbiAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgVVNQUHJvdG9bc2VsZi5TeW1ib2wuaXRlcmF0b3JdID0gVVNQUHJvdG9bc2VsZi5TeW1ib2wuaXRlcmF0b3JdIHx8IFVTUFByb3RvLmVudHJpZXM7XG4gIH1cblxuICBmdW5jdGlvbiBlbmNvZGUoc3RyKSB7XG4gICAgdmFyIHJlcGxhY2UgPSB7XG4gICAgICAnISc6ICclMjEnLFxuICAgICAgXCInXCI6ICclMjcnLFxuICAgICAgJygnOiAnJTI4JyxcbiAgICAgICcpJzogJyUyOScsXG4gICAgICAnfic6ICclN0UnLFxuICAgICAgJyUyMCc6ICcrJyxcbiAgICAgICclMDAnOiAnXFx4MDAnXG4gICAgfTtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnXFwoXFwpfl18JTIwfCUwMC9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgIHJldHVybiByZXBsYWNlW21hdGNoXTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlY29kZShzdHIpIHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlSXRlcmF0b3IoYXJyKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyLnNoaWZ0KCk7XG4gICAgICAgIHJldHVybiB7IGRvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZSB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIGl0ZXJhdG9yW3NlbGYuU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlcmF0b3I7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVRvRGljdChzZWFyY2gpIHtcbiAgICB2YXIgZGljdCA9IHt9O1xuXG4gICAgaWYgKCh0eXBlb2Ygc2VhcmNoID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihzZWFyY2gpKSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZm9yICh2YXIga2V5IGluIHNlYXJjaCkge1xuICAgICAgICBpZiAoc2VhcmNoLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBhcHBlbmRUbyhkaWN0LCBrZXksIHNlYXJjaFtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZW1vdmUgZmlyc3QgJz8nXG4gICAgICBpZiAoc2VhcmNoLmluZGV4T2YoXCI/XCIpID09PSAwKSB7XG4gICAgICAgIHNlYXJjaCA9IHNlYXJjaC5zbGljZSgxKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHBhaXJzID0gc2VhcmNoLnNwbGl0KFwiJlwiKTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFpcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFpcnNbal0sXG4gICAgICAgICAgICBpbmRleCA9IHZhbHVlLmluZGV4T2YoJz0nKTtcblxuICAgICAgICBpZiAoLTEgPCBpbmRleCkge1xuICAgICAgICAgIGFwcGVuZFRvKGRpY3QsIGRlY29kZSh2YWx1ZS5zbGljZSgwLCBpbmRleCkpLCBkZWNvZGUodmFsdWUuc2xpY2UoaW5kZXggKyAxKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgYXBwZW5kVG8oZGljdCwgZGVjb2RlKHZhbHVlKSwgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkaWN0O1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwZW5kVG8oZGljdCwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgdmFsID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgPT09ICdmdW5jdGlvbicgPyB2YWx1ZS50b1N0cmluZygpIDogSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXG4gICAgaWYgKG5hbWUgaW4gZGljdCkge1xuICAgICAgZGljdFtuYW1lXS5wdXNoKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpY3RbbmFtZV0gPSBbdmFsXTtcbiAgICB9XG4gIH1cbn0pKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQpO1xuXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmluZFxuaWYgKCFBcnJheS5wcm90b3R5cGUuZmluZCkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCAnZmluZCcsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUocHJlZGljYXRlKSB7XG4gICAgICAvLyAxLiBMZXQgTyBiZSA/IFRvT2JqZWN0KHRoaXMgdmFsdWUpLlxuICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInRoaXNcIiBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBvID0gT2JqZWN0KHRoaXMpO1xuXG4gICAgICAvLyAyLiBMZXQgbGVuIGJlID8gVG9MZW5ndGgoPyBHZXQoTywgXCJsZW5ndGhcIikpLlxuICAgICAgdmFyIGxlbiA9IG8ubGVuZ3RoID4+PiAwO1xuXG4gICAgICAvLyAzLiBJZiBJc0NhbGxhYmxlKHByZWRpY2F0ZSkgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgIGlmICh0eXBlb2YgcHJlZGljYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ByZWRpY2F0ZSBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgIH1cblxuICAgICAgLy8gNC4gSWYgdGhpc0FyZyB3YXMgc3VwcGxpZWQsIGxldCBUIGJlIHRoaXNBcmc7IGVsc2UgbGV0IFQgYmUgdW5kZWZpbmVkLlxuICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgIC8vIDUuIExldCBrIGJlIDAuXG4gICAgICB2YXIgayA9IDA7XG5cbiAgICAgIC8vIDYuIFJlcGVhdCwgd2hpbGUgayA8IGxlblxuICAgICAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICAgICAgLy8gYS4gTGV0IFBrIGJlICEgVG9TdHJpbmcoaykuXG4gICAgICAgIC8vIGIuIExldCBrVmFsdWUgYmUgPyBHZXQoTywgUGspLlxuICAgICAgICAvLyBjLiBMZXQgdGVzdFJlc3VsdCBiZSBUb0Jvb2xlYW4oPyBDYWxsKHByZWRpY2F0ZSwgVCwgwqsga1ZhbHVlLCBrLCBPIMK7KSkuXG4gICAgICAgIC8vIGQuIElmIHRlc3RSZXN1bHQgaXMgdHJ1ZSwgcmV0dXJuIGtWYWx1ZS5cbiAgICAgICAgdmFyIGtWYWx1ZSA9IG9ba107XG4gICAgICAgIGlmIChwcmVkaWNhdGUuY2FsbCh0aGlzQXJnLCBrVmFsdWUsIGssIG8pKSB7XG4gICAgICAgICAgcmV0dXJuIGtWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlLiBJbmNyZWFzZSBrIGJ5IDEuXG4gICAgICAgIGsrKztcbiAgICAgIH1cblxuICAgICAgLy8gNy4gUmV0dXJuIHVuZGVmaW5lZC5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DdXN0b21FdmVudC9DdXN0b21FdmVudFxuKGZ1bmN0aW9uICgpIHtcblxuICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7IGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiBudWxsIH07XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgcmV0dXJuIGV2dDtcbiAgfVxuXG4gIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG5cbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG59KSgpO1xuXG4oZnVuY3Rpb24gKHNlbGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGlmIChzZWxmLmZldGNoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHN1cHBvcnQgPSB7XG4gICAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICAgIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICAgIGJsb2I6ICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmICdCbG9iJyBpbiBzZWxmICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSgpLFxuICAgIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gICAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxuICB9O1xuXG4gIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gICAgdmFyIHZpZXdDbGFzc2VzID0gWydbb2JqZWN0IEludDhBcnJheV0nLCAnW29iamVjdCBVaW50OEFycmF5XScsICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsICdbb2JqZWN0IEludDE2QXJyYXldJywgJ1tvYmplY3QgVWludDE2QXJyYXldJywgJ1tvYmplY3QgSW50MzJBcnJheV0nLCAnW29iamVjdCBVaW50MzJBcnJheV0nLCAnW29iamVjdCBGbG9hdDMyQXJyYXldJywgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSddO1xuXG4gICAgdmFyIGlzRGF0YVZpZXcgPSBmdW5jdGlvbiBpc0RhdGFWaWV3KG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopO1xuICAgIH07XG5cbiAgICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPSBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICAgIH1cbiAgICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5cXF5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJyk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKTtcbiAgICAgICAgcmV0dXJuIHsgZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3I7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBpdGVyYXRvcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMubWFwID0ge307XG5cbiAgICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcikge1xuICAgICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKTtcbiAgICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcbiAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXTtcbiAgICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUgKyAnLCcgKyB2YWx1ZSA6IHZhbHVlO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSk7XG4gICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSkge1xuICAgICAgaXRlbXMucHVzaChuYW1lKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpdGVtcy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSkge1xuICAgICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpO1xuICB9O1xuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXM7XG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSk7XG4gICAgfVxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcik7XG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcik7XG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYik7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpO1xuICAgIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gICAgaWYgKGJ1Zi5zbGljZSkge1xuICAgICAgcmV0dXJuIGJ1Zi5zbGljZSgwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aCk7XG4gICAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKTtcbiAgICAgIHJldHVybiB2aWV3LmJ1ZmZlcjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBCb2R5KCkge1xuICAgIHRoaXMuYm9keVVzZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24gKGJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keTtcbiAgICAgIGlmICghYm9keSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5O1xuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHk7XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keTtcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpO1xuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKTtcbiAgICAgICAgLy8gSUUgMTAtMTEgY2FuJ3QgaGFuZGxlIGEgRGF0YVZpZXcgYm9keS5cbiAgICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSk7XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcyk7XG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3RlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcyk7XG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5qc29uID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSk7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG4gIHZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddO1xuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpO1xuICAgIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Q7XG4gIH1cblxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHk7XG5cbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJyk7XG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybDtcbiAgICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFscztcbiAgICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpO1xuICAgICAgfVxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2Q7XG4gICAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlO1xuICAgICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXQ7XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpO1xuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ29taXQnO1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKTtcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpO1xuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbDtcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbDtcblxuICAgIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJyk7XG4gICAgfVxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHkpO1xuICB9XG5cbiAgUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHsgYm9keTogdGhpcy5fYm9keUluaXQgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGJvZHkudHJpbSgpLnNwbGl0KCcmJykuZm9yRWFjaChmdW5jdGlvbiAoYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpO1xuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJyk7XG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKTtcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm9ybTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICAgIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpO1xuICAgIHByZVByb2Nlc3NlZEhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6Jyk7XG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKCk7XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKCk7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBoZWFkZXJzO1xuICB9XG5cbiAgQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKTtcblxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMudHlwZSA9ICdkZWZhdWx0JztcbiAgICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzID09PSB1bmRlZmluZWQgPyAyMDAgOiBvcHRpb25zLnN0YXR1cztcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwO1xuICAgIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJztcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpO1xuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJyc7XG4gICAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpO1xuICB9XG5cbiAgQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSk7XG5cbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgICAgdXJsOiB0aGlzLnVybFxuICAgIH0pO1xuICB9O1xuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7IHN0YXR1czogMCwgc3RhdHVzVGV4dDogJycgfSk7XG4gICAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcic7XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9O1xuXG4gIHZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XTtcblxuICBSZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uICh1cmwsIHN0YXR1cykge1xuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7IHN0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7IGxvY2F0aW9uOiB1cmwgfSB9KTtcbiAgfTtcblxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzO1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0O1xuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2U7XG5cbiAgc2VsZi5mZXRjaCA9IGZ1bmN0aW9uIChpbnB1dCwgaW5pdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KTtcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJyk7XG4gICAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKTtcbiAgICAgIH07XG5cbiAgICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSk7XG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7XG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSkge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSk7XG4gICAgICB9KTtcblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdCk7XG4gICAgfSk7XG4gIH07XG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHVuZGVmaW5lZCk7XG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOiBmYWN0b3J5KCk7XG59KShmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9XG5cbiAgZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cblxuICAgIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7XG4gIH1cblxuICBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICAgIF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgICByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pO1xuICAgIH07XG4gICAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgICBvLl9fcHJvdG9fXyA9IHA7XG4gICAgICByZXR1cm4gbztcbiAgICB9O1xuXG4gICAgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikge1xuICAgIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHtcbiAgICBpZiAoY2FsbCAmJiAoKHR5cGVvZiBjYWxsID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihjYWxsKSkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHtcbiAgICAgIHJldHVybiBjYWxsO1xuICAgIH1cblxuICAgIHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3N1cGVyUHJvcEJhc2Uob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIHdoaWxlICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgICBvYmplY3QgPSBfZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICAgIGlmIChvYmplY3QgPT09IG51bGwpIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICBmdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIFJlZmxlY3QuZ2V0KSB7XG4gICAgICBfZ2V0ID0gUmVmbGVjdC5nZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9nZXQgPSBmdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gICAgICAgIHZhciBiYXNlID0gX3N1cGVyUHJvcEJhc2UodGFyZ2V0LCBwcm9wZXJ0eSk7XG5cbiAgICAgICAgaWYgKCFiYXNlKSByZXR1cm47XG4gICAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBwcm9wZXJ0eSk7XG5cbiAgICAgICAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuIGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyIHx8IHRhcmdldCk7XG4gIH1cblxuICB2YXIgRW1pdHRlciA9XG4gIC8qI19fUFVSRV9fKi9cbiAgZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEVtaXR0ZXIoKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRW1pdHRlcik7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbGlzdGVuZXJzJywge1xuICAgICAgICB2YWx1ZToge30sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhFbWl0dGVyLCBbe1xuICAgICAga2V5OiBcImFkZEV2ZW50TGlzdGVuZXJcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghKHR5cGUgaW4gdGhpcy5saXN0ZW5lcnMpKSB7XG4gICAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdLnB1c2goY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJyZW1vdmVFdmVudExpc3RlbmVyXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoISh0eXBlIGluIHRoaXMubGlzdGVuZXJzKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdGFjayA9IHRoaXMubGlzdGVuZXJzW3R5cGVdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gc3RhY2subGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHN0YWNrW2ldID09PSBjYWxsYmFjaykge1xuICAgICAgICAgICAgc3RhY2suc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJkaXNwYXRjaEV2ZW50XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmICghKGV2ZW50LnR5cGUgaW4gdGhpcy5saXN0ZW5lcnMpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlYm91bmNlID0gZnVuY3Rpb24gZGVib3VuY2UoY2FsbGJhY2spIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKF90aGlzLCBldmVudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHN0YWNrID0gdGhpcy5saXN0ZW5lcnNbZXZlbnQudHlwZV07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdGFjay5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBkZWJvdW5jZShzdGFja1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQ7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEVtaXR0ZXI7XG4gIH0oKTtcblxuICB2YXIgQWJvcnRTaWduYWwgPVxuICAvKiNfX1BVUkVfXyovXG4gIGZ1bmN0aW9uIChfRW1pdHRlcikge1xuICAgIF9pbmhlcml0cyhBYm9ydFNpZ25hbCwgX0VtaXR0ZXIpO1xuXG4gICAgZnVuY3Rpb24gQWJvcnRTaWduYWwoKSB7XG4gICAgICB2YXIgX3RoaXMyO1xuXG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQWJvcnRTaWduYWwpO1xuXG4gICAgICBfdGhpczIgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoQWJvcnRTaWduYWwpLmNhbGwodGhpcykpOyAvLyBTb21lIHZlcnNpb25zIG9mIGJhYmVsIGRvZXMgbm90IHRyYW5zcGlsZSBzdXBlcigpIGNvcnJlY3RseSBmb3IgSUUgPD0gMTAsIGlmIHRoZSBwYXJlbnRcbiAgICAgIC8vIGNvbnN0cnVjdG9yIGhhcyBmYWlsZWQgdG8gcnVuLCB0aGVuIFwidGhpcy5saXN0ZW5lcnNcIiB3aWxsIHN0aWxsIGJlIHVuZGVmaW5lZCBhbmQgdGhlbiB3ZSBjYWxsXG4gICAgICAvLyB0aGUgcGFyZW50IGNvbnN0cnVjdG9yIGRpcmVjdGx5IGluc3RlYWQgYXMgYSB3b3JrYXJvdW5kLiBGb3IgZ2VuZXJhbCBkZXRhaWxzLCBzZWUgYmFiZWwgYnVnOlxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL2lzc3Vlcy8zMDQxXG4gICAgICAvLyBUaGlzIGhhY2sgd2FzIGFkZGVkIGFzIGEgZml4IGZvciB0aGUgaXNzdWUgZGVzY3JpYmVkIGhlcmU6XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLWxpYnJhcnkvcHVsbC81OSNpc3N1ZWNvbW1lbnQtNDc3NTU4MDQyXG5cbiAgICAgIGlmICghX3RoaXMyLmxpc3RlbmVycykge1xuICAgICAgICBFbWl0dGVyLmNhbGwoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpczIpKTtcbiAgICAgIH0gLy8gQ29tcGFyZWQgdG8gYXNzaWdubWVudCwgT2JqZWN0LmRlZmluZVByb3BlcnR5IG1ha2VzIHByb3BlcnRpZXMgbm9uLWVudW1lcmFibGUgYnkgZGVmYXVsdCBhbmRcbiAgICAgIC8vIHdlIHdhbnQgT2JqZWN0LmtleXMobmV3IEFib3J0Q29udHJvbGxlcigpLnNpZ25hbCkgdG8gYmUgW10gZm9yIGNvbXBhdCB3aXRoIHRoZSBuYXRpdmUgaW1wbFxuXG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzMiksICdhYm9ydGVkJywge1xuICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMyKSwgJ29uYWJvcnQnLCB7XG4gICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfdGhpczI7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEFib3J0U2lnbmFsLCBbe1xuICAgICAga2V5OiBcInRvU3RyaW5nXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiAnW29iamVjdCBBYm9ydFNpZ25hbF0nO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJkaXNwYXRjaEV2ZW50XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2Fib3J0Jykge1xuICAgICAgICAgIHRoaXMuYWJvcnRlZCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25hYm9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5vbmFib3J0LmNhbGwodGhpcywgZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9nZXQoX2dldFByb3RvdHlwZU9mKEFib3J0U2lnbmFsLnByb3RvdHlwZSksIFwiZGlzcGF0Y2hFdmVudFwiLCB0aGlzKS5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gQWJvcnRTaWduYWw7XG4gIH0oRW1pdHRlcik7XG4gIHZhciBBYm9ydENvbnRyb2xsZXIgPVxuICAvKiNfX1BVUkVfXyovXG4gIGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBYm9ydENvbnRyb2xsZXIoKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQWJvcnRDb250cm9sbGVyKTtcblxuICAgICAgLy8gQ29tcGFyZWQgdG8gYXNzaWdubWVudCwgT2JqZWN0LmRlZmluZVByb3BlcnR5IG1ha2VzIHByb3BlcnRpZXMgbm9uLWVudW1lcmFibGUgYnkgZGVmYXVsdCBhbmRcbiAgICAgIC8vIHdlIHdhbnQgT2JqZWN0LmtleXMobmV3IEFib3J0Q29udHJvbGxlcigpKSB0byBiZSBbXSBmb3IgY29tcGF0IHdpdGggdGhlIG5hdGl2ZSBpbXBsXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3NpZ25hbCcsIHtcbiAgICAgICAgdmFsdWU6IG5ldyBBYm9ydFNpZ25hbCgpLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoQWJvcnRDb250cm9sbGVyLCBbe1xuICAgICAga2V5OiBcImFib3J0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWJvcnQoKSB7XG4gICAgICAgIHZhciBldmVudDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGV2ZW50ID0gbmV3IEV2ZW50KCdhYm9ydCcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmICghZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcbiAgICAgICAgICAgICAgLy8gRm9yIEludGVybmV0IEV4cGxvcmVyIDg6XG4gICAgICAgICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICAgICAgICAgICAgZXZlbnQudHlwZSA9ICdhYm9ydCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBGb3IgSW50ZXJuZXQgRXhwbG9yZXIgMTE6XG4gICAgICAgICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgIGV2ZW50LmluaXRFdmVudCgnYWJvcnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGYWxsYmFjayB3aGVyZSBkb2N1bWVudCBpc24ndCBhdmFpbGFibGU6XG4gICAgICAgICAgICBldmVudCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2Fib3J0JyxcbiAgICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgICAgICAgIGNhbmNlbGFibGU6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2lnbmFsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJ0b1N0cmluZ1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gJ1tvYmplY3QgQWJvcnRDb250cm9sbGVyXSc7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEFib3J0Q29udHJvbGxlcjtcbiAgfSgpO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiAgICAvLyBUaGVzZSBhcmUgbmVjZXNzYXJ5IHRvIG1ha2Ugc3VyZSB0aGF0IHdlIGdldCBjb3JyZWN0IG91dHB1dCBmb3I6XG4gICAgLy8gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG5ldyBBYm9ydENvbnRyb2xsZXIoKSlcbiAgICBBYm9ydENvbnRyb2xsZXIucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnQWJvcnRDb250cm9sbGVyJztcbiAgICBBYm9ydFNpZ25hbC5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdBYm9ydFNpZ25hbCc7XG4gIH1cblxuICBmdW5jdGlvbiBwb2x5ZmlsbE5lZWRlZChzZWxmKSB7XG4gICAgaWYgKHNlbGYuX19GT1JDRV9JTlNUQUxMX0FCT1JUQ09OVFJPTExFUl9QT0xZRklMTCkge1xuICAgICAgY29uc29sZS5sb2coJ19fRk9SQ0VfSU5TVEFMTF9BQk9SVENPTlRST0xMRVJfUE9MWUZJTEw9dHJ1ZSBpcyBzZXQsIHdpbGwgZm9yY2UgaW5zdGFsbCBwb2x5ZmlsbCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSAvLyBOb3RlIHRoYXQgdGhlIFwidW5mZXRjaFwiIG1pbmltYWwgZmV0Y2ggcG9seWZpbGwgZGVmaW5lcyBmZXRjaCgpIHdpdGhvdXRcbiAgICAvLyBkZWZpbmluZyB3aW5kb3cuUmVxdWVzdCwgYW5kIHRoaXMgcG9seWZpbGwgbmVlZCB0byB3b3JrIG9uIHRvcCBvZiB1bmZldGNoXG4gICAgLy8gc28gdGhlIGJlbG93IGZlYXR1cmUgZGV0ZWN0aW9uIG5lZWRzIHRoZSAhc2VsZi5BYm9ydENvbnRyb2xsZXIgcGFydC5cbiAgICAvLyBUaGUgUmVxdWVzdC5wcm90b3R5cGUgY2hlY2sgaXMgYWxzbyBuZWVkZWQgYmVjYXVzZSBTYWZhcmkgdmVyc2lvbnMgMTEuMS4yXG4gICAgLy8gdXAgdG8gYW5kIGluY2x1ZGluZyAxMi4xLnggaGFzIGEgd2luZG93LkFib3J0Q29udHJvbGxlciBwcmVzZW50IGJ1dCBzdGlsbFxuICAgIC8vIGRvZXMgTk9UIGNvcnJlY3RseSBpbXBsZW1lbnQgYWJvcnRhYmxlIGZldGNoOlxuICAgIC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNzQ5ODAjYzJcblxuXG4gICAgcmV0dXJuIHR5cGVvZiBzZWxmLlJlcXVlc3QgPT09ICdmdW5jdGlvbicgJiYgIXNlbGYuUmVxdWVzdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoJ3NpZ25hbCcpIHx8ICFzZWxmLkFib3J0Q29udHJvbGxlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RlOiB0aGUgXCJmZXRjaC5SZXF1ZXN0XCIgZGVmYXVsdCB2YWx1ZSBpcyBhdmFpbGFibGUgZm9yIGZldGNoIGltcG9ydGVkIGZyb21cbiAgICogdGhlIFwibm9kZS1mZXRjaFwiIHBhY2thZ2UgYW5kIG5vdCBpbiBicm93c2Vycy4gVGhpcyBpcyBPSyBzaW5jZSBicm93c2Vyc1xuICAgKiB3aWxsIGJlIGltcG9ydGluZyB1bWQtcG9seWZpbGwuanMgZnJvbSB0aGF0IHBhdGggXCJzZWxmXCIgaXMgcGFzc2VkIHRoZVxuICAgKiBkZWNvcmF0b3Igc28gdGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBub3QgYmUgdXNlZCAoYmVjYXVzZSBicm93c2VycyB0aGF0IGRlZmluZVxuICAgKiBmZXRjaCBhbHNvIGhhcyBSZXF1ZXN0KS4gT25lIHF1aXJreSBzZXR1cCB3aGVyZSBzZWxmLmZldGNoIGV4aXN0cyBidXRcbiAgICogc2VsZi5SZXF1ZXN0IGRvZXMgbm90IGlzIHdoZW4gdGhlIFwidW5mZXRjaFwiIG1pbmltYWwgZmV0Y2ggcG9seWZpbGwgaXMgdXNlZFxuICAgKiBvbiB0b3Agb2YgSUUxMTsgZm9yIHRoaXMgY2FzZSB0aGUgYnJvd3NlciB3aWxsIHRyeSB0byB1c2UgdGhlIGZldGNoLlJlcXVlc3RcbiAgICogZGVmYXVsdCB2YWx1ZSB3aGljaCBpbiB0dXJuIHdpbGwgYmUgdW5kZWZpbmVkIGJ1dCB0aGVuIHRoZW4gXCJpZiAoUmVxdWVzdClcIlxuICAgKiB3aWxsIGVuc3VyZSB0aGF0IHlvdSBnZXQgYSBwYXRjaGVkIGZldGNoIGJ1dCBzdGlsbCBubyBSZXF1ZXN0IChhcyBleHBlY3RlZCkuXG4gICAqIEBwYXJhbSB7ZmV0Y2gsIFJlcXVlc3QgPSBmZXRjaC5SZXF1ZXN0fVxuICAgKiBAcmV0dXJucyB7ZmV0Y2g6IGFib3J0YWJsZUZldGNoLCBSZXF1ZXN0OiBBYm9ydGFibGVSZXF1ZXN0fVxuICAgKi9cblxuICBmdW5jdGlvbiBhYm9ydGFibGVGZXRjaERlY29yYXRvcihwYXRjaFRhcmdldHMpIHtcbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHBhdGNoVGFyZ2V0cykge1xuICAgICAgcGF0Y2hUYXJnZXRzID0ge1xuICAgICAgICBmZXRjaDogcGF0Y2hUYXJnZXRzXG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBfcGF0Y2hUYXJnZXRzID0gcGF0Y2hUYXJnZXRzLFxuICAgICAgICBmZXRjaCA9IF9wYXRjaFRhcmdldHMuZmV0Y2gsXG4gICAgICAgIF9wYXRjaFRhcmdldHMkUmVxdWVzdCA9IF9wYXRjaFRhcmdldHMuUmVxdWVzdCxcbiAgICAgICAgTmF0aXZlUmVxdWVzdCA9IF9wYXRjaFRhcmdldHMkUmVxdWVzdCA9PT0gdm9pZCAwID8gZmV0Y2guUmVxdWVzdCA6IF9wYXRjaFRhcmdldHMkUmVxdWVzdCxcbiAgICAgICAgTmF0aXZlQWJvcnRDb250cm9sbGVyID0gX3BhdGNoVGFyZ2V0cy5BYm9ydENvbnRyb2xsZXIsXG4gICAgICAgIF9wYXRjaFRhcmdldHMkX19GT1JDRSA9IF9wYXRjaFRhcmdldHMuX19GT1JDRV9JTlNUQUxMX0FCT1JUQ09OVFJPTExFUl9QT0xZRklMTCxcbiAgICAgICAgX19GT1JDRV9JTlNUQUxMX0FCT1JUQ09OVFJPTExFUl9QT0xZRklMTCA9IF9wYXRjaFRhcmdldHMkX19GT1JDRSA9PT0gdm9pZCAwID8gZmFsc2UgOiBfcGF0Y2hUYXJnZXRzJF9fRk9SQ0U7XG5cbiAgICBpZiAoIXBvbHlmaWxsTmVlZGVkKHtcbiAgICAgIGZldGNoOiBmZXRjaCxcbiAgICAgIFJlcXVlc3Q6IE5hdGl2ZVJlcXVlc3QsXG4gICAgICBBYm9ydENvbnRyb2xsZXI6IE5hdGl2ZUFib3J0Q29udHJvbGxlcixcbiAgICAgIF9fRk9SQ0VfSU5TVEFMTF9BQk9SVENPTlRST0xMRVJfUE9MWUZJTEw6IF9fRk9SQ0VfSU5TVEFMTF9BQk9SVENPTlRST0xMRVJfUE9MWUZJTExcbiAgICB9KSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZmV0Y2g6IGZldGNoLFxuICAgICAgICBSZXF1ZXN0OiBSZXF1ZXN0XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBSZXF1ZXN0ID0gTmF0aXZlUmVxdWVzdDsgLy8gTm90ZSB0aGF0IHRoZSBcInVuZmV0Y2hcIiBtaW5pbWFsIGZldGNoIHBvbHlmaWxsIGRlZmluZXMgZmV0Y2goKSB3aXRob3V0XG4gICAgLy8gZGVmaW5pbmcgd2luZG93LlJlcXVlc3QsIGFuZCB0aGlzIHBvbHlmaWxsIG5lZWQgdG8gd29yayBvbiB0b3Agb2YgdW5mZXRjaFxuICAgIC8vIGhlbmNlIHdlIG9ubHkgcGF0Y2ggaXQgaWYgaXQncyBhdmFpbGFibGUuIEFsc28gd2UgZG9uJ3QgcGF0Y2ggaXQgaWYgc2lnbmFsXG4gICAgLy8gaXMgYWxyZWFkeSBhdmFpbGFibGUgb24gdGhlIFJlcXVlc3QgcHJvdG90eXBlIGJlY2F1c2UgaW4gdGhpcyBjYXNlIHN1cHBvcnRcbiAgICAvLyBpcyBwcmVzZW50IGFuZCB0aGUgcGF0Y2hpbmcgYmVsb3cgY2FuIGNhdXNlIGEgY3Jhc2ggc2luY2UgaXQgYXNzaWducyB0b1xuICAgIC8vIHJlcXVlc3Quc2lnbmFsIHdoaWNoIGlzIHRlY2huaWNhbGx5IGEgcmVhZC1vbmx5IHByb3BlcnR5LiBUaGlzIGxhdHRlciBlcnJvclxuICAgIC8vIGhhcHBlbnMgd2hlbiB5b3UgcnVuIHRoZSBtYWluNS5qcyBub2RlLWZldGNoIGV4YW1wbGUgaW4gdGhlIHJlcG9cbiAgICAvLyBcImFib3J0Y29udHJvbGxlci1wb2x5ZmlsbC1leGFtcGxlc1wiLiBUaGUgZXhhY3QgZXJyb3IgaXM6XG4gICAgLy8gICByZXF1ZXN0LnNpZ25hbCA9IGluaXQuc2lnbmFsO1xuICAgIC8vICAgXlxuICAgIC8vIFR5cGVFcnJvcjogQ2Fubm90IHNldCBwcm9wZXJ0eSBzaWduYWwgb2YgIzxSZXF1ZXN0PiB3aGljaCBoYXMgb25seSBhIGdldHRlclxuXG4gICAgaWYgKFJlcXVlc3QgJiYgIVJlcXVlc3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdzaWduYWwnKSB8fCBfX0ZPUkNFX0lOU1RBTExfQUJPUlRDT05UUk9MTEVSX1BPTFlGSUxMKSB7XG4gICAgICBSZXF1ZXN0ID0gZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgaW5pdCkge1xuICAgICAgICB2YXIgc2lnbmFsO1xuXG4gICAgICAgIGlmIChpbml0ICYmIGluaXQuc2lnbmFsKSB7XG4gICAgICAgICAgc2lnbmFsID0gaW5pdC5zaWduYWw7IC8vIE5ldmVyIHBhc3MgaW5pdC5zaWduYWwgdG8gdGhlIG5hdGl2ZSBSZXF1ZXN0IGltcGxlbWVudGF0aW9uIHdoZW4gdGhlIHBvbHlmaWxsIGhhc1xuICAgICAgICAgIC8vIGJlZW4gaW5zdGFsbGVkIGJlY2F1c2UgaWYgd2UncmUgcnVubmluZyBvbiB0b3Agb2YgYSBicm93c2VyIHdpdGggYVxuICAgICAgICAgIC8vIHdvcmtpbmcgbmF0aXZlIEFib3J0Q29udHJvbGxlciAoaS5lLiB0aGUgcG9seWZpbGwgd2FzIGluc3RhbGxlZCBkdWUgdG9cbiAgICAgICAgICAvLyBfX0ZPUkNFX0lOU1RBTExfQUJPUlRDT05UUk9MTEVSX1BPTFlGSUxMIGJlaW5nIHNldCksIHRoZW4gcGFzc2luZyBvdXJcbiAgICAgICAgICAvLyBmYWtlIEFib3J0U2lnbmFsIHRvIHRoZSBuYXRpdmUgZmV0Y2ggd2lsbCB0cmlnZ2VyOlxuICAgICAgICAgIC8vIFR5cGVFcnJvcjogRmFpbGVkIHRvIGNvbnN0cnVjdCAnUmVxdWVzdCc6IG1lbWJlciBzaWduYWwgaXMgbm90IG9mIHR5cGUgQWJvcnRTaWduYWwuXG5cbiAgICAgICAgICBkZWxldGUgaW5pdC5zaWduYWw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBOYXRpdmVSZXF1ZXN0KGlucHV0LCBpbml0KTtcblxuICAgICAgICBpZiAoc2lnbmFsKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVlc3QsICdzaWduYWwnLCB7XG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiBzaWduYWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXF1ZXN0O1xuICAgICAgfTtcblxuICAgICAgUmVxdWVzdC5wcm90b3R5cGUgPSBOYXRpdmVSZXF1ZXN0LnByb3RvdHlwZTtcbiAgICB9XG5cbiAgICB2YXIgcmVhbEZldGNoID0gZmV0Y2g7XG5cbiAgICB2YXIgYWJvcnRhYmxlRmV0Y2ggPSBmdW5jdGlvbiBhYm9ydGFibGVGZXRjaChpbnB1dCwgaW5pdCkge1xuICAgICAgdmFyIHNpZ25hbCA9IFJlcXVlc3QgJiYgUmVxdWVzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihpbnB1dCkgPyBpbnB1dC5zaWduYWwgOiBpbml0ID8gaW5pdC5zaWduYWwgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChzaWduYWwpIHtcbiAgICAgICAgdmFyIGFib3J0RXJyb3I7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhYm9ydEVycm9yID0gbmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIC8vIElFIDExIGRvZXMgbm90IHN1cHBvcnQgY2FsbGluZyB0aGUgRE9NRXhjZXB0aW9uIGNvbnN0cnVjdG9yLCB1c2UgYVxuICAgICAgICAgIC8vIHJlZ3VsYXIgZXJyb3Igb2JqZWN0IG9uIGl0IGluc3RlYWQuXG4gICAgICAgICAgYWJvcnRFcnJvciA9IG5ldyBFcnJvcignQWJvcnRlZCcpO1xuICAgICAgICAgIGFib3J0RXJyb3IubmFtZSA9ICdBYm9ydEVycm9yJztcbiAgICAgICAgfSAvLyBSZXR1cm4gZWFybHkgaWYgYWxyZWFkeSBhYm9ydGVkLCB0aHVzIGF2b2lkaW5nIG1ha2luZyBhbiBIVFRQIHJlcXVlc3RcblxuXG4gICAgICAgIGlmIChzaWduYWwuYWJvcnRlZCkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcbiAgICAgICAgfSAvLyBUdXJuIGFuIGV2ZW50IGludG8gYSBwcm9taXNlLCByZWplY3QgaXQgb25jZSBgYWJvcnRgIGlzIGRpc3BhdGNoZWRcblxuXG4gICAgICAgIHZhciBjYW5jZWxsYXRpb24gPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAoXywgcmVqZWN0KSB7XG4gICAgICAgICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChhYm9ydEVycm9yKTtcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBvbmNlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChpbml0ICYmIGluaXQuc2lnbmFsKSB7XG4gICAgICAgICAgLy8gTmV2ZXIgcGFzcyAuc2lnbmFsIHRvIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24gd2hlbiB0aGUgcG9seWZpbGwgaGFzXG4gICAgICAgICAgLy8gYmVlbiBpbnN0YWxsZWQgYmVjYXVzZSBpZiB3ZSdyZSBydW5uaW5nIG9uIHRvcCBvZiBhIGJyb3dzZXIgd2l0aCBhXG4gICAgICAgICAgLy8gd29ya2luZyBuYXRpdmUgQWJvcnRDb250cm9sbGVyIChpLmUuIHRoZSBwb2x5ZmlsbCB3YXMgaW5zdGFsbGVkIGR1ZSB0b1xuICAgICAgICAgIC8vIF9fRk9SQ0VfSU5TVEFMTF9BQk9SVENPTlRST0xMRVJfUE9MWUZJTEwgYmVpbmcgc2V0KSwgdGhlbiBwYXNzaW5nIG91clxuICAgICAgICAgIC8vIGZha2UgQWJvcnRTaWduYWwgdG8gdGhlIG5hdGl2ZSBmZXRjaCB3aWxsIHRyaWdnZXI6XG4gICAgICAgICAgLy8gVHlwZUVycm9yOiBGYWlsZWQgdG8gZXhlY3V0ZSAnZmV0Y2gnIG9uICdXaW5kb3cnOiBtZW1iZXIgc2lnbmFsIGlzIG5vdCBvZiB0eXBlIEFib3J0U2lnbmFsLlxuICAgICAgICAgIGRlbGV0ZSBpbml0LnNpZ25hbDtcbiAgICAgICAgfSAvLyBSZXR1cm4gdGhlIGZhc3Rlc3QgcHJvbWlzZSAoZG9uJ3QgbmVlZCB0byB3YWl0IGZvciByZXF1ZXN0IHRvIGZpbmlzaClcblxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJhY2UoW2NhbmNlbGxhdGlvbiwgcmVhbEZldGNoKGlucHV0LCBpbml0KV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhbEZldGNoKGlucHV0LCBpbml0KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZldGNoOiBhYm9ydGFibGVGZXRjaCxcbiAgICAgIFJlcXVlc3Q6IFJlcXVlc3RcbiAgICB9O1xuICB9XG5cbiAgKGZ1bmN0aW9uIChzZWxmKSB7XG5cbiAgICBpZiAoIXBvbHlmaWxsTmVlZGVkKHNlbGYpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFzZWxmLmZldGNoKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ2ZldGNoKCkgaXMgbm90IGF2YWlsYWJsZSwgY2Fubm90IGluc3RhbGwgYWJvcnRjb250cm9sbGVyLXBvbHlmaWxsJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIF9hYm9ydGFibGVGZXRjaCA9IGFib3J0YWJsZUZldGNoRGVjb3JhdG9yKHNlbGYpLFxuICAgICAgICBmZXRjaCA9IF9hYm9ydGFibGVGZXRjaC5mZXRjaCxcbiAgICAgICAgUmVxdWVzdCA9IF9hYm9ydGFibGVGZXRjaC5SZXF1ZXN0O1xuXG4gICAgc2VsZi5mZXRjaCA9IGZldGNoO1xuICAgIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3Q7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYsICdBYm9ydENvbnRyb2xsZXInLCB7XG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IEFib3J0Q29udHJvbGxlclxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCAnQWJvcnRTaWduYWwnLCB7XG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IEFib3J0U2lnbmFsXG4gICAgfSk7XG4gIH0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiBnbG9iYWwpO1xufSk7XG5cbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbnZhciBldmVudHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiAobikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKSB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fCBpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcikgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID8gbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7ZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO2Vsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICsgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLCB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSkgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8IGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHwgbGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbiAodHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgdGhpcy5fZXZlbnRzID0ge307ZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKSBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICAgIH1cbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiAodHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKSByZXQgPSBbXTtlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO2Vsc2UgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbiAodHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSkgcmV0dXJuIDE7ZWxzZSBpZiAoZXZsaXN0ZW5lcikgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbiAoZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gKHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGFyZykpID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5cbmZ1bmN0aW9uIHNhbml0aXNlVHlwZWFoZWFkVGV4dChzdHJpbmcpIHtcbiAgdmFyIHNhbml0aXNlZFF1ZXJ5UmVwbGFjZUNoYXJzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBbXTtcbiAgdmFyIHRyaW1FbmQgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHRydWU7XG5cbiAgdmFyIHNhbml0aXNlZFN0cmluZyA9IHN0cmluZy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xcc1xccysvZywgJyAnKTtcblxuICBzYW5pdGlzZWRTdHJpbmcgPSB0cmltRW5kID8gc2FuaXRpc2VkU3RyaW5nLnRyaW0oKSA6IHNhbml0aXNlZFN0cmluZy50cmltU3RhcnQoKTtcblxuICBzYW5pdGlzZWRRdWVyeVJlcGxhY2VDaGFycy5mb3JFYWNoKGZ1bmN0aW9uIChjaGFyKSB7XG4gICAgc2FuaXRpc2VkU3RyaW5nID0gc2FuaXRpc2VkU3RyaW5nLnJlcGxhY2UobmV3IFJlZ0V4cChjaGFyLCAnZycpLCAnJyk7XG4gIH0pO1xuXG4gIHJldHVybiBzYW5pdGlzZWRTdHJpbmc7XG59XG5cbnZhciBjbGFzc1R5cGVhaGVhZENvbWJvYm94ID0gJ2pzLXR5cGVhaGVhZC1jb21ib2JveCc7XG52YXIgY2xhc3NUeXBlYWhlYWRMYWJlbCA9ICdqcy10eXBlYWhlYWQtbGFiZWwnO1xudmFyIGNsYXNzVHlwZWFoZWFkSW5wdXQgPSAnanMtdHlwZWFoZWFkLWlucHV0JztcbnZhciBjbGFzc1R5cGVhaGVhZEluc3RydWN0aW9ucyA9ICdqcy10eXBlYWhlYWQtaW5zdHJ1Y3Rpb25zJztcbnZhciBjbGFzc1R5cGVhaGVhZExpc3Rib3ggPSAnanMtdHlwZWFoZWFkLWxpc3Rib3gnO1xudmFyIGNsYXNzVHlwZWFoZWFkQXJpYVN0YXR1cyA9ICdqcy10eXBlYWhlYWQtYXJpYS1zdGF0dXMnO1xuXG52YXIgY2xhc3NUeXBlYWhlYWRPcHRpb24gPSAndHlwZWFoZWFkX19vcHRpb24nO1xudmFyIGNsYXNzVHlwZWFoZWFkT3B0aW9uRm9jdXNlZCA9IGNsYXNzVHlwZWFoZWFkT3B0aW9uICsgJy0tZm9jdXNlZCc7XG52YXIgY2xhc3NUeXBlYWhlYWRPcHRpb25Ob1Jlc3VsdHMgPSBjbGFzc1R5cGVhaGVhZE9wdGlvbiArICctLW5vLXJlc3VsdHMnO1xudmFyIGNsYXNzVHlwZWFoZWFkT3B0aW9uTW9yZVJlc3VsdHMgPSBjbGFzc1R5cGVhaGVhZE9wdGlvbiArICctLW1vcmUtcmVzdWx0cyc7XG52YXIgY2xhc3NUeXBlYWhlYWRDb21ib2JveEZvY3VzZWQgPSAndHlwZWFoZWFkX19jb21ib2JveC0tZm9jdXNlZCc7XG52YXIgY2xhc3NUeXBlYWhlYWRIYXNSZXN1bHRzID0gJ3R5cGVhaGVhZC0taGFzLXJlc3VsdHMnO1xuXG52YXIgS0VZQ09ERSA9IHtcbiAgQkFDS19TUEFDRTogOCxcbiAgUkVUVVJOOiAxMyxcbiAgRU5URVI6IDE0LFxuICBMRUZUOiAzNyxcbiAgVVA6IDM4LFxuICBSSUdIVDogMzksXG4gIERPV046IDQwLFxuICBERUxFVEU6IDQ2LFxuICBWOiA4NlxufTtcblxudmFyIE5FV19GSUVMRF9WQUxVRV9FVkVOVCA9ICdORVdfRklFTERfVkFMVUUnO1xudmFyIE5FV19JVEVNX1NFTEVDVEVEX0VWRU5UID0gJ05FV19JVEVNX1NFTEVDVEVEJztcbnZhciBVTlNFVF9GSUVMRF9WQUxVRV9FVkVOVCA9ICdVTlNFVF9GSUVMRF9WQUxVRSc7XG5cbnZhciBUeXBlYWhlYWRDb21wb25lbnQgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFR5cGVhaGVhZENvbXBvbmVudChfcmVmKSB7XG4gICAgdmFyIGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG4gICAgICAgIGFwaVVybCA9IF9yZWYuYXBpVXJsLFxuICAgICAgICBtaW5DaGFycyA9IF9yZWYubWluQ2hhcnMsXG4gICAgICAgIHJlc3VsdExpbWl0ID0gX3JlZi5yZXN1bHRMaW1pdCxcbiAgICAgICAgX3JlZiRzYW5pdGlzZWRRdWVyeVJlID0gX3JlZi5zYW5pdGlzZWRRdWVyeVJlcGxhY2VDaGFycyxcbiAgICAgICAgc2FuaXRpc2VkUXVlcnlSZXBsYWNlQ2hhcnMgPSBfcmVmJHNhbml0aXNlZFF1ZXJ5UmUgPT09IHVuZGVmaW5lZCA/IFtdIDogX3JlZiRzYW5pdGlzZWRRdWVyeVJlLFxuICAgICAgICBfcmVmJGxhbmcgPSBfcmVmLmxhbmcsXG4gICAgICAgIGxhbmcgPSBfcmVmJGxhbmcgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBfcmVmJGxhbmc7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgVHlwZWFoZWFkQ29tcG9uZW50KTtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgZXZlbnRzKCk7XG5cblxuICAgIC8vIERPTSBFbGVtZW50c1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5jb21ib2JveCA9IGNvbnRleHQucXVlcnlTZWxlY3RvcignLicgKyBjbGFzc1R5cGVhaGVhZENvbWJvYm94KTtcbiAgICB0aGlzLmxhYmVsID0gY29udGV4dC5xdWVyeVNlbGVjdG9yKCcuJyArIGNsYXNzVHlwZWFoZWFkTGFiZWwpO1xuICAgIHRoaXMuaW5wdXQgPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoJy4nICsgY2xhc3NUeXBlYWhlYWRJbnB1dCk7XG4gICAgdGhpcy5saXN0Ym94ID0gY29udGV4dC5xdWVyeVNlbGVjdG9yKCcuJyArIGNsYXNzVHlwZWFoZWFkTGlzdGJveCk7XG4gICAgdGhpcy5pbnN0cnVjdGlvbnMgPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoJy4nICsgY2xhc3NUeXBlYWhlYWRJbnN0cnVjdGlvbnMpO1xuICAgIHRoaXMuYXJpYVN0YXR1cyA9IGNvbnRleHQucXVlcnlTZWxlY3RvcignLicgKyBjbGFzc1R5cGVhaGVhZEFyaWFTdGF0dXMpO1xuXG4gICAgLy8gU3VnZ2VzdGlvbiBVUkxcbiAgICB0aGlzLmFwaVVybCA9IGFwaVVybCB8fCBjb250ZXh0LmdldEF0dHJpYnV0ZSgnZGF0YS1hcGktdXJsJyk7XG5cbiAgICAvLyBTZXR0aW5nc1xuICAgIHRoaXMuY29udGVudCA9IEpTT04ucGFyc2UoY29udGV4dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29udGVudCcpKTtcbiAgICB0aGlzLmxpc3Rib3hJZCA9IHRoaXMubGlzdGJveC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgdGhpcy5taW5DaGFycyA9IG1pbkNoYXJzIHx8IDI7XG4gICAgdGhpcy5yZXN1bHRMaW1pdCA9IHJlc3VsdExpbWl0IHx8IG51bGw7XG5cbiAgICAvLyBTdGF0ZVxuICAgIHRoaXMuY3RybEtleSA9IGZhbHNlO1xuICAgIHRoaXMuZGVsZXRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnF1ZXJ5ID0gJyc7XG4gICAgdGhpcy5zYW5pdGlzZWRRdWVyeSA9ICcnO1xuICAgIHRoaXMucHJldmlvdXNRdWVyeSA9ICcnO1xuICAgIHRoaXMucmVzdWx0cyA9IFtdO1xuICAgIHRoaXMucmVzdWx0T3B0aW9ucyA9IFtdO1xuICAgIHRoaXMuZm91bmRSZXN1bHRzID0gMDtcbiAgICB0aGlzLm51bWJlck9mUmVzdWx0cyA9IDA7XG4gICAgdGhpcy5oaWdobGlnaHRlZFJlc3VsdEluZGV4ID0gMDtcbiAgICB0aGlzLnNldHRpbmdSZXN1bHQgPSBmYWxzZTtcbiAgICB0aGlzLnJlc3VsdFNlbGVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5ibHVycmluZyA9IGZhbHNlO1xuICAgIHRoaXMuYmx1clRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuc2FuaXRpc2VkUXVlcnlSZXBsYWNlQ2hhcnMgPSBzYW5pdGlzZWRRdWVyeVJlcGxhY2VDaGFycztcbiAgICB0aGlzLmxhbmcgPSBsYW5nIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2xhbmcnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gTW9kaWZ5IERPTVxuICAgIHRoaXMubGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCB0aGlzLmlucHV0LmdldEF0dHJpYnV0ZSgnaWQnKSk7XG4gICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtYXV0b2NvbXBsZXRlJywgJ2xpc3QnKTtcbiAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIHRoaXMubGlzdGJveC5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgdGhpcy5pbnN0cnVjdGlvbnMuZ2V0QXR0cmlidXRlKCdpZCcpKTtcbiAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgdGhpcy5pbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0b2NvbXBsZXRlJykpO1xuICAgIHRoaXMuY29udGV4dC5jbGFzc0xpc3QuYWRkKCd0eXBlYWhlYWQtLWluaXRpYWxpc2VkJyk7XG5cbiAgICAvLyBCaW5kIGV2ZW50IGxpc3RlbmVyc1xuICAgIHRoaXMuYmluZEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhUeXBlYWhlYWRDb21wb25lbnQsIFt7XG4gICAga2V5OiAnYmluZEV2ZW50TGlzdGVuZXJzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gYmluZEV2ZW50TGlzdGVuZXJzKCkge1xuICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlkb3duLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5dXAuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5oYW5kbGVGb2N1cy5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuaGFuZGxlQmx1ci5iaW5kKHRoaXMpKTtcblxuICAgICAgdGhpcy5saXN0Ym94LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMuaGFuZGxlTW91c2VvdmVyLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5saXN0Ym94LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5oYW5kbGVNb3VzZW91dC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoYW5kbGVLZXlkb3duJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlS2V5ZG93bihldmVudCkge1xuICAgICAgdGhpcy5jdHJsS2V5ID0gKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkgJiYgZXZlbnQua2V5Q29kZSAhPT0gS0VZQ09ERS5WO1xuXG4gICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSBLRVlDT0RFLlVQOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRlUmVzdWx0cygtMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIGNhc2UgS0VZQ09ERS5ET1dOOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRlUmVzdWx0cygxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgY2FzZSBLRVlDT0RFLkVOVEVSOlxuICAgICAgICBjYXNlIEtFWUNPREUuUkVUVVJOOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaGFuZGxlS2V5dXAnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVLZXl1cChldmVudCkge1xuICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2UgS0VZQ09ERS5VUDpcbiAgICAgICAgY2FzZSBLRVlDT0RFLkRPV046XG4gICAgICAgICAge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgY2FzZSBLRVlDT0RFLkVOVEVSOlxuICAgICAgICBjYXNlIEtFWUNPREUuUkVUVVJOOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0UmVzdWx0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIGNhc2UgS0VZQ09ERS5MRUZUOlxuICAgICAgICBjYXNlIEtFWUNPREUuUklHSFQ6XG4gICAgICAgICAge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmN0cmxLZXkgPSBmYWxzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoYW5kbGVDaGFuZ2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoKSB7XG4gICAgICBpZiAoIXRoaXMuYmx1cnJpbmcpIHtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZWQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoYW5kbGVGb2N1cycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZUZvY3VzKCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuYmx1clRpbWVvdXQpO1xuICAgICAgdGhpcy5jb21ib2JveC5jbGFzc0xpc3QuYWRkKGNsYXNzVHlwZWFoZWFkQ29tYm9ib3hGb2N1c2VkKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoYW5kbGVCbHVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlQmx1cigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmJsdXJUaW1lb3V0KTtcbiAgICAgIHRoaXMuYmx1cnJpbmcgPSB0cnVlO1xuXG4gICAgICB0aGlzLmJsdXJUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLmNvbWJvYm94LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NUeXBlYWhlYWRDb21ib2JveEZvY3VzZWQpO1xuICAgICAgICBfdGhpcy5ibHVycmluZyA9IGZhbHNlO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaGFuZGxlTW91c2VvdmVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlTW91c2VvdmVyKCkge1xuICAgICAgdmFyIGZvY3VzZWRJdGVtID0gdGhpcy5yZXN1bHRPcHRpb25zW3RoaXMuaGlnaGxpZ2h0ZWRSZXN1bHRJbmRleF07XG5cbiAgICAgIGlmIChmb2N1c2VkSXRlbSkge1xuICAgICAgICBmb2N1c2VkSXRlbS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzVHlwZWFoZWFkT3B0aW9uRm9jdXNlZCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaGFuZGxlTW91c2VvdXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVNb3VzZW91dCgpIHtcbiAgICAgIHZhciBmb2N1c2VkSXRlbSA9IHRoaXMucmVzdWx0T3B0aW9uc1t0aGlzLmhpZ2hsaWdodGVkUmVzdWx0SW5kZXhdO1xuXG4gICAgICBpZiAoZm9jdXNlZEl0ZW0pIHtcbiAgICAgICAgZm9jdXNlZEl0ZW0uY2xhc3NMaXN0LmFkZChjbGFzc1R5cGVhaGVhZE9wdGlvbkZvY3VzZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ25hdmlnYXRlUmVzdWx0cycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5hdmlnYXRlUmVzdWx0cyhkaXJlY3Rpb24pIHtcbiAgICAgIHZhciBpbmRleCA9IDA7XG5cbiAgICAgIGlmICh0aGlzLmhpZ2hsaWdodGVkUmVzdWx0SW5kZXggIT09IG51bGwpIHtcbiAgICAgICAgaW5kZXggPSB0aGlzLmhpZ2hsaWdodGVkUmVzdWx0SW5kZXggKyBkaXJlY3Rpb247XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmRleCA8IHRoaXMubnVtYmVyT2ZSZXN1bHRzKSB7XG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICBpbmRleCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEhpZ2hsaWdodGVkUmVzdWx0KGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd2YWx1ZUNoYW5nZWQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZUNoYW5nZWQoZm9yY2UpIHtcbiAgICAgIGlmICghdGhpcy5zZXR0aW5nUmVzdWx0KSB7XG4gICAgICAgIHZhciBxdWVyeSA9IHRoaXMuaW5wdXQudmFsdWU7XG4gICAgICAgIHZhciBzYW5pdGlzZWRRdWVyeSA9IHNhbml0aXNlVHlwZWFoZWFkVGV4dChxdWVyeSwgdGhpcy5zYW5pdGlzZWRRdWVyeVJlcGxhY2VDaGFycyk7XG5cbiAgICAgICAgaWYgKHNhbml0aXNlZFF1ZXJ5ICE9PSB0aGlzLnNhbml0aXNlZFF1ZXJ5IHx8IGZvcmNlICYmICF0aGlzLnJlc3VsdFNlbGVjdGVkKSB7XG4gICAgICAgICAgdGhpcy51bnNldFJlc3VsdHMoKTtcbiAgICAgICAgICB0aGlzLnNldEFyaWFTdGF0dXMoKTtcblxuICAgICAgICAgIHRoaXMucXVlcnkgPSBxdWVyeTtcbiAgICAgICAgICB0aGlzLnNhbml0aXNlZFF1ZXJ5ID0gc2FuaXRpc2VkUXVlcnk7XG5cbiAgICAgICAgICBpZiAodGhpcy5zYW5pdGlzZWRRdWVyeS5sZW5ndGggPj0gdGhpcy5taW5DaGFycykge1xuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoTkVXX0ZJRUxEX1ZBTFVFX0VWRU5ULCBzYW5pdGlzZWRRdWVyeSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJMaXN0Ym94KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAndW5zZXRSZXN1bHRzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdW5zZXRSZXN1bHRzKCkge1xuICAgICAgdGhpcy5yZXN1bHRzID0gW107XG4gICAgICB0aGlzLnJlc3VsdE9wdGlvbnMgPSBbXTtcbiAgICAgIHRoaXMucmVzdWx0U2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoVU5TRVRfRklFTERfVkFMVUVfRVZFTlQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2NsZWFyTGlzdGJveCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyTGlzdGJveChwcmV2ZW50QXJpYVN0YXR1c1VwZGF0ZSkge1xuICAgICAgdGhpcy5saXN0Ym94LmlubmVySFRNTCA9ICcnO1xuICAgICAgdGhpcy5jb250ZXh0LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NUeXBlYWhlYWRIYXNSZXN1bHRzKTtcbiAgICAgIHRoaXMuaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKTtcbiAgICAgIHRoaXMuY29tYm9ib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJyk7XG5cbiAgICAgIGlmICghcHJldmVudEFyaWFTdGF0dXNVcGRhdGUpIHtcbiAgICAgICAgdGhpcy5zZXRBcmlhU3RhdHVzKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAndXBkYXRlRGF0YScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZURhdGEoZGF0YU1hcCkge1xuICAgICAgdGhpcy5yZXN1bHRzID0gZGF0YU1hcC5yZXN1bHRzO1xuICAgICAgdGhpcy5mb3VuZFJlc3VsdHMgPSBkYXRhTWFwLnRvdGFsUmVzdWx0cztcbiAgICAgIHRoaXMubnVtYmVyT2ZSZXN1bHRzID0gTWF0aC5tYXgodGhpcy5yZXN1bHRzLmxlbmd0aCwgMCk7XG5cbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVuZGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIGlmICghdGhpcy5kZWxldGluZyB8fCB0aGlzLm51bWJlck9mUmVzdWx0cyAmJiB0aGlzLmRlbGV0aW5nKSB7XG4gICAgICAgIGlmICh0aGlzLm51bWJlck9mUmVzdWx0cy5sZW5ndGggPT09IDEgJiYgdGhpcy5yZXN1bHRzWzBdLnNhbml0aXNlZFRleHQgPT09IHRoaXMuc2FuaXRpc2VkUXVlcnkpIHtcbiAgICAgICAgICB0aGlzLmNsZWFyTGlzdGJveCh0cnVlKTtcbiAgICAgICAgICB0aGlzLnNlbGVjdFJlc3VsdCgwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxpc3Rib3guaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgdGhpcy5yZXN1bHRPcHRpb25zID0gdGhpcy5yZXN1bHRzLm1hcChmdW5jdGlvbiAocmVzdWx0LCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIGFyaWFMYWJlbCA9IHJlc3VsdFtfdGhpczIubGFuZ107XG4gICAgICAgICAgICB2YXIgaW5uZXJIVE1MID0gX3RoaXMyLmVtYm9sZGVuTWF0Y2goYXJpYUxhYmVsLCBfdGhpczIucXVlcnkpO1xuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQuc2FuaXRpc2VkQWx0ZXJuYXRpdmVzKSkge1xuICAgICAgICAgICAgICB2YXIgYWx0ZXJuYXRpdmVNYXRjaCA9IHJlc3VsdC5zYW5pdGlzZWRBbHRlcm5hdGl2ZXMuZmluZChmdW5jdGlvbiAoYWx0ZXJuYXRpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWx0ZXJuYXRpdmUgIT09IHJlc3VsdC5zYW5pdGlzZWRUZXh0ICYmIGFsdGVybmF0aXZlLmluY2x1ZGVzKF90aGlzMi5zYW5pdGlzZWRRdWVyeSk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGlmIChhbHRlcm5hdGl2ZU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFsdGVybmF0aXZlVGV4dCA9IHJlc3VsdC5hbHRlcm5hdGl2ZXNbcmVzdWx0LnNhbml0aXNlZEFsdGVybmF0aXZlcy5pbmRleE9mKGFsdGVybmF0aXZlTWF0Y2gpXTtcbiAgICAgICAgICAgICAgICBpbm5lckhUTUwgKz0gJyA8c21hbGw+KCcgKyBfdGhpczIuZW1ib2xkZW5NYXRjaChhbHRlcm5hdGl2ZVRleHQsIF90aGlzMi5xdWVyeSkgKyAnKTwvc21hbGw+JztcbiAgICAgICAgICAgICAgICBhcmlhTGFiZWwgKz0gJywgKCcgKyBhbHRlcm5hdGl2ZVRleHQgKyAnKSc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGxpc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICAgIGxpc3RFbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzVHlwZWFoZWFkT3B0aW9uO1xuICAgICAgICAgICAgbGlzdEVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIF90aGlzMi5saXN0Ym94SWQgKyAnX19vcHRpb24tLScgKyBpbmRleCk7XG4gICAgICAgICAgICBsaXN0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnb3B0aW9uJyk7XG4gICAgICAgICAgICBsaXN0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICBsaXN0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBhcmlhTGFiZWwpO1xuICAgICAgICAgICAgbGlzdEVsZW1lbnQuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuXG4gICAgICAgICAgICBsaXN0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgX3RoaXMyLnNlbGVjdFJlc3VsdChpbmRleCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpc3RFbGVtZW50O1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5yZXN1bHRPcHRpb25zLmZvckVhY2goZnVuY3Rpb24gKGxpc3RFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMyLmxpc3Rib3guYXBwZW5kQ2hpbGQobGlzdEVsZW1lbnQpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHRoaXMubnVtYmVyT2ZSZXN1bHRzIDwgdGhpcy5mb3VuZFJlc3VsdHMpIHtcbiAgICAgICAgICAgIHZhciBsaXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgICBsaXN0RWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc1R5cGVhaGVhZE9wdGlvbiArICcgJyArIGNsYXNzVHlwZWFoZWFkT3B0aW9uTW9yZVJlc3VsdHMgKyAnIHUtZnMtYic7XG4gICAgICAgICAgICBsaXN0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICBsaXN0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIGxpc3RFbGVtZW50LmlubmVySFRNTCA9IHRoaXMuY29udGVudC5tb3JlX3Jlc3VsdHM7XG4gICAgICAgICAgICB0aGlzLmxpc3Rib3guYXBwZW5kQ2hpbGQobGlzdEVsZW1lbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2V0SGlnaGxpZ2h0ZWRSZXN1bHQobnVsbCk7XG4gICAgICAgICAgdGhpcy5jb21ib2JveC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLmNvbnRleHQuY2xhc3NMaXN0LmFkZChjbGFzc1R5cGVhaGVhZEhhc1Jlc3VsdHMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm51bWJlck9mUmVzdWx0cyA9PT0gMCAmJiB0aGlzLmNvbnRlbnQubm9fcmVzdWx0cykge1xuICAgICAgICB0aGlzLmxpc3Rib3guaW5uZXJIVE1MID0gJzxsaSBjbGFzcz1cIicgKyBjbGFzc1R5cGVhaGVhZE9wdGlvbiArICcgJyArIGNsYXNzVHlwZWFoZWFkT3B0aW9uTm9SZXN1bHRzICsgJ1wiPicgKyB0aGlzLmNvbnRlbnQubm9fcmVzdWx0cyArICc8L2xpPic7XG4gICAgICAgIHRoaXMuY29tYm9ib3guc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5jbGFzc0xpc3QuYWRkKGNsYXNzVHlwZWFoZWFkSGFzUmVzdWx0cyk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2V0SGlnaGxpZ2h0ZWRSZXN1bHQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRIaWdobGlnaHRlZFJlc3VsdChpbmRleCkge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRSZXN1bHRJbmRleCA9IGluZGV4O1xuXG4gICAgICBpZiAodGhpcy5zZXRIaWdobGlnaHRlZFJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1hY3RpdmVkZXNjZW5kYW50Jyk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubnVtYmVyT2ZSZXN1bHRzKSB7XG4gICAgICAgIHRoaXMucmVzdWx0T3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChvcHRpb24sIG9wdGlvbkluZGV4KSB7XG4gICAgICAgICAgaWYgKG9wdGlvbkluZGV4ID09PSBpbmRleCkge1xuICAgICAgICAgICAgb3B0aW9uLmNsYXNzTGlzdC5hZGQoY2xhc3NUeXBlYWhlYWRPcHRpb25Gb2N1c2VkKTtcbiAgICAgICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIF90aGlzMy5pbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsIG9wdGlvbi5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcHRpb24uY2xhc3NMaXN0LnJlbW92ZShjbGFzc1R5cGVhaGVhZE9wdGlvbkZvY3VzZWQpO1xuICAgICAgICAgICAgb3B0aW9uLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zZXRBcmlhU3RhdHVzKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2V0QXJpYVN0YXR1cycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldEFyaWFTdGF0dXMoY29udGVudCkge1xuICAgICAgaWYgKCFjb250ZW50KSB7XG4gICAgICAgIHZhciBxdWVyeVRvb1Nob3J0ID0gdGhpcy5zYW5pdGlzZWRRdWVyeS5sZW5ndGggPCB0aGlzLm1pbkNoYXJzO1xuICAgICAgICB2YXIgbm9SZXN1bHRzID0gdGhpcy5udW1iZXJPZlJlc3VsdHMgPT09IDA7XG5cbiAgICAgICAgaWYgKHF1ZXJ5VG9vU2hvcnQpIHtcbiAgICAgICAgICBjb250ZW50ID0gdGhpcy5jb250ZW50LmFyaWFfbWluX2NoYXJzO1xuICAgICAgICB9IGVsc2UgaWYgKG5vUmVzdWx0cykge1xuICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQuYXJpYV9ub19yZXN1bHRzICsgJzogXCInICsgdGhpcy5xdWVyeSArICdcIic7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5udW1iZXJPZlJlc3VsdHMgPT09IDEpIHtcbiAgICAgICAgICBjb250ZW50ID0gdGhpcy5jb250ZW50LmFyaWFfb25lX3Jlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250ZW50ID0gdGhpcy5jb250ZW50LmFyaWFfbl9yZXN1bHRzLnJlcGxhY2UoJ3tufScsIHRoaXMubnVtYmVyT2ZSZXN1bHRzKTtcblxuICAgICAgICAgIGlmICh0aGlzLnJlc3VsdExpbWl0ICYmIHRoaXMuZm91bmRSZXN1bHRzID4gdGhpcy5yZXN1bHRMaW1pdCkge1xuICAgICAgICAgICAgY29udGVudCArPSAnICcgKyB0aGlzLmNvbnRlbnQuYXJpYV9saW1pdGVkX3Jlc3VsdHM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXJpYVN0YXR1cy5pbm5lckhUTUwgPSBjb250ZW50O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NlbGVjdFJlc3VsdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlbGVjdFJlc3VsdChpbmRleCkge1xuICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLnJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgIC8vdGhpcy5zZXR0aW5nUmVzdWx0ID0gdHJ1ZTtcblxuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5yZXN1bHRzW2luZGV4IHx8IHRoaXMuaGlnaGxpZ2h0ZWRSZXN1bHRJbmRleCB8fCAwXTtcblxuICAgICAgICAvLyBUT0RPOiBUaGlzIGNvbmRpdGlvbiBzaG91bGQgYmUgcmVtb3ZlZCBpZiB3ZSBnbyB3aXRoIHRoZSBpbnRlcm5hbCBhZGRyZXNzIGxvb2t1cCBBUEksIG9yIG1hZGUgY29uZmlndXJhYmxlIGlmIHdlIHVzZSBhIHRoaXJkIHBhcnR5IEFQSVxuICAgICAgICBpZiAocmVzdWx0LnR5cGUgIT09ICdQb3N0Y29kZScpIHtcbiAgICAgICAgICB0aGlzLmlucHV0LnZhbHVlID0gcmVzdWx0W3RoaXMubGFuZ107XG4gICAgICAgICAgdGhpcy5xdWVyeSA9IHJlc3VsdFt0aGlzLmxhbmddO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXN1bHRTZWxlY3RlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoTkVXX0lURU1fU0VMRUNURURfRVZFTlQsIHJlc3VsdCk7XG5cbiAgICAgICAgLyp0aGlzLm9uU2VsZWN0KHJlc3VsdCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5nUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgLy8gdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb21wbGV0ZScsICdmYWxzZScpO1xuICAgICAgICB9KTsqL1xuXG4gICAgICAgIHZhciBhcmlhQWx0ZXJuYXRpdmVNZXNzYWdlID0gJyc7XG5cbiAgICAgICAgaWYgKCFyZXN1bHQuc2FuaXRpc2VkVGV4dC5pbmNsdWRlcyh0aGlzLnNhbml0aXNlZFF1ZXJ5KSAmJiByZXN1bHQuc2FuaXRpc2VkQWx0ZXJuYXRpdmVzKSB7XG4gICAgICAgICAgdmFyIGFsdGVybmF0aXZlTWF0Y2ggPSByZXN1bHQuc2FuaXRpc2VkQWx0ZXJuYXRpdmVzLmZpbmQoZnVuY3Rpb24gKGFsdGVybmF0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gYWx0ZXJuYXRpdmUuaW5jbHVkZXMoX3RoaXM0LnNhbml0aXNlZFF1ZXJ5KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChhbHRlcm5hdGl2ZU1hdGNoKSB7XG4gICAgICAgICAgICBhcmlhQWx0ZXJuYXRpdmVNZXNzYWdlID0gJywgJyArIHRoaXMuY29udGVudC5hcmlhX2ZvdW5kX2J5X2FsdGVybmF0aXZlX25hbWUgKyAnOiAnICsgYWx0ZXJuYXRpdmVNYXRjaDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXJpYU1lc3NhZ2UgPSB0aGlzLmNvbnRlbnQuYXJpYV95b3VfaGF2ZV9zZWxlY3RlZCArICc6ICcgKyByZXN1bHRbdGhpcy5sYW5nXSArIGFyaWFBbHRlcm5hdGl2ZU1lc3NhZ2UgKyAnLic7XG5cbiAgICAgICAgdGhpcy5jbGVhckxpc3Rib3goKTtcbiAgICAgICAgdGhpcy5zZXRBcmlhU3RhdHVzKGFyaWFNZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdlbWJvbGRlbk1hdGNoJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW1ib2xkZW5NYXRjaChzdHJpbmcsIHF1ZXJ5KSB7XG4gICAgICBxdWVyeSA9IHF1ZXJ5LnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuXG4gICAgICBpZiAoc3RyaW5nLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkpKSB7XG4gICAgICAgIHZhciBxdWVyeUxlbmd0aCA9IHF1ZXJ5Lmxlbmd0aDtcbiAgICAgICAgdmFyIG1hdGNoSW5kZXggPSBzdHJpbmcudG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5KTtcbiAgICAgICAgdmFyIG1hdGNoRW5kID0gbWF0Y2hJbmRleCArIHF1ZXJ5TGVuZ3RoO1xuICAgICAgICB2YXIgYmVmb3JlID0gc3RyaW5nLnN1YnN0cigwLCBtYXRjaEluZGV4KTtcbiAgICAgICAgdmFyIG1hdGNoID0gc3RyaW5nLnN1YnN0cihtYXRjaEluZGV4LCBxdWVyeUxlbmd0aCk7XG4gICAgICAgIHZhciBhZnRlciA9IHN0cmluZy5zdWJzdHIobWF0Y2hFbmQsIHN0cmluZy5sZW5ndGggLSBtYXRjaEVuZCk7XG5cbiAgICAgICAgcmV0dXJuIGJlZm9yZSArICc8ZW0+JyArIG1hdGNoICsgJzwvZW0+JyArIGFmdGVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFR5cGVhaGVhZENvbXBvbmVudDtcbn0oKTtcblxuZnVuY3Rpb24gZm9ybUJvZHlGcm9tT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChvYmplY3Rba2V5XSk7XG4gIH0pLmpvaW4oJyYnKTtcbn1cblxudmFyIEFib3J0YWJsZUZldGNoID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBBYm9ydGFibGVGZXRjaCh1cmwsIG9wdGlvbnMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBBYm9ydGFibGVGZXRjaCk7XG5cbiAgICB0aGlzLnVybCA9IHVybDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyB3aW5kb3cuQWJvcnRDb250cm9sbGVyKCk7XG4gICAgdGhpcy5zdGF0dXMgPSAnVU5TRU5UJztcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKEFib3J0YWJsZUZldGNoLCBbe1xuICAgIGtleTogJ3NlbmQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdGhpcy5zdGF0dXMgPSAnTE9BRElORyc7XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGFib3J0YWJsZUZldGNoKF90aGlzLnVybCwgX2V4dGVuZHMoeyBzaWduYWw6IF90aGlzLmNvbnRyb2xsZXIuc2lnbmFsIH0sIF90aGlzLm9wdGlvbnMpKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgX3RoaXMuc3RhdHVzID0gJ0RPTkUnO1xuICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzLnN0YXR1cyA9ICdET05FJztcbiAgICAgICAgICAgIHJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICBfdGhpcy5zdGF0dXMgPSAnRE9ORSc7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdhYm9ydCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFib3J0KCkge1xuICAgICAgdGhpcy5jb250cm9sbGVyLmFib3J0KCk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBBYm9ydGFibGVGZXRjaDtcbn0oKTtcblxuZnVuY3Rpb24gYWJvcnRhYmxlRmV0Y2godXJsLCBvcHRpb25zKSB7XG4gIHJldHVybiB3aW5kb3cuZmV0Y2godXJsLCBvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfSk7XG59XG5cbnZhciBUeXBlYWhlYWRTZXJ2aWNlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBUeXBlYWhlYWRTZXJ2aWNlKF9yZWYpIHtcbiAgICB2YXIgYXBpVXJsID0gX3JlZi5hcGlVcmwsXG4gICAgICAgIGxhbmcgPSBfcmVmLmxhbmc7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgVHlwZWFoZWFkU2VydmljZSk7XG4gICAgdGhpcy5yZXF1ZXN0Q29uZmlnID0ge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIWFwaVVybCB8fCAhbGFuZykge1xuICAgICAgdGhyb3cgRXJyb3IoJ1tUeXBlYWhlYWRTZXJ2aWNlXSBcXCdhcGlVcmxcXCcsIFxcJ2xhbmdcXCcgcGFyYW1ldGVycyBhcmUgcmVxdWlyZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaVVybCA9IGFwaVVybDtcbiAgICB0aGlzLmxhbmcgPSBsYW5nO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoVHlwZWFoZWFkU2VydmljZSwgW3tcbiAgICBrZXk6ICdnZXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQkJDEoc2FuaXRpc2VkUXVlcnkpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHZhciBxdWVyeSA9IHtcbiAgICAgICAgICBxdWVyeTogc2FuaXRpc2VkUXVlcnksXG4gICAgICAgICAgbGFuZzogX3RoaXMubGFuZ1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChfdGhpcy5mZXRjaCAmJiBfdGhpcy5mZXRjaC5zdGF0dXMgIT09ICdET05FJykge1xuICAgICAgICAgIF90aGlzLmZldGNoLmFib3J0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpcy5yZXF1ZXN0Q29uZmlnLmJvZHkgPSBmb3JtQm9keUZyb21PYmplY3QocXVlcnkpO1xuICAgICAgICBfdGhpcy5mZXRjaCA9IG5ldyBBYm9ydGFibGVGZXRjaChfdGhpcy5hcGlVcmwsIF90aGlzLnJlcXVlc3RDb25maWcpO1xuXG4gICAgICAgIF90aGlzLmZldGNoLnNlbmQoKS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFR5cGVhaGVhZFNlcnZpY2U7XG59KCk7XG5cbmZ1bmN0aW9uIHR5cGVhaGVhZERhdGFNYXAob3B0cywgcmVzcG9uc2UpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICAvKipcbiAgICogUmVxdWlyZWQgcGFyYW1ldGVyIHZhbGlkYXRpb24gbmVlZGVkXG4gICAqL1xuXG4gIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciByZXN1bHRzID0gZGF0YS5yZXN1bHRzO1xuXG4gICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIHJlc3VsdC5zYW5pdGlzZWRUZXh0ID0gc2FuaXRpc2VUeXBlYWhlYWRUZXh0KHJlc3VsdFtvcHRzLmxhbmddLCBvcHRzLnNhbml0aXNlZFF1ZXJ5UmVwbGFjZUNoYXJzKTtcblxuICAgICAgaWYgKG9wdHMubGFuZyAhPT0gJ2VuLWdiJykge1xuICAgICAgICB2YXIgZW5nbGlzaCA9IHJlc3VsdFsnZW4tZ2InXTtcbiAgICAgICAgdmFyIHNhbml0aXNlZEFsdGVybmF0aXZlID0gc2FuaXRpc2VUeXBlYWhlYWRUZXh0KGVuZ2xpc2gsIF90aGlzLnNhbml0aXNlZFF1ZXJ5UmVwbGFjZUNoYXJzKTtcblxuICAgICAgICBpZiAoc2FuaXRpc2VkQWx0ZXJuYXRpdmUubWF0Y2gob3B0cy5xdWVyeSkpIHtcbiAgICAgICAgICByZXN1bHQuYWx0ZXJuYXRpdmVzID0gW2VuZ2xpc2hdO1xuICAgICAgICAgIHJlc3VsdC5zYW5pdGlzZWRBbHRlcm5hdGl2ZXMgPSBbc2FuaXRpc2VkQWx0ZXJuYXRpdmVdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQuYWx0ZXJuYXRpdmVzID0gW107XG4gICAgICAgIHJlc3VsdC5zYW5pdGlzZWRBbHRlcm5hdGl2ZXMgPSBbXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICByZXN1bHRzOiByZXN1bHRzLFxuICAgICAgdG90YWxSZXN1bHRzOiBkYXRhLnRvdGFsUmVzdWx0c1xuICAgIH07XG4gIH0pO1xufVxuXG52YXIgVHlwZWFoZWFkQ29udGFpbmVyID0gZnVuY3Rpb24gVHlwZWFoZWFkQ29udGFpbmVyKGNvbnRleHQpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICBjbGFzc0NhbGxDaGVjayh0aGlzLCBUeXBlYWhlYWRDb250YWluZXIpO1xuXG4gIHRoaXMudHlwZWFoZWFkID0gbmV3IFR5cGVhaGVhZENvbXBvbmVudCh7IGNvbnRleHQ6IGNvbnRleHQgfSk7XG5cbiAgdGhpcy5zZXJ2aWNlID0gbmV3IFR5cGVhaGVhZFNlcnZpY2Uoe1xuICAgIGFwaVVybDogdGhpcy50eXBlYWhlYWQuYXBpVXJsLFxuICAgIGxhbmc6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2xhbmcnKS50b0xvd2VyQ2FzZSgpLFxuICAgIHNhbml0aXNlZFF1ZXJ5UmVwbGFjZUNoYXJzOiB0aGlzLnR5cGVhaGVhZC5zYW5pdGlzZWRRdWVyeVJlcGxhY2VDaGFyc1xuICB9KTtcblxuICB0aGlzLnR5cGVhaGVhZC5lbWl0dGVyLm9uKE5FV19GSUVMRF9WQUxVRV9FVkVOVCwgZnVuY3Rpb24gKHZhbHVlKSB7XG5cbiAgICAvKipcbiAgICAgKiBDYWxsIHNlcnZpY2UsIHBhcnRpYWxseSBhcHBseSBjb25maWcgZm9yIHByb21pc2UgY2FsbGJhY2tzXG4gICAgICovXG4gICAgX3RoaXMuc2VydmljZS5nZXQodmFsdWUpLnRoZW4odHlwZWFoZWFkRGF0YU1hcC5iaW5kKG51bGwsIHtcbiAgICAgIHF1ZXJ5OiB2YWx1ZSxcbiAgICAgIGxhbmc6IF90aGlzLnR5cGVhaGVhZC5sYW5nLFxuICAgICAgc2FuaXRpc2VkUXVlcnlSZXBsYWNlQ2hhcnM6IF90aGlzLnR5cGVhaGVhZC5zYW5pdGlzZWRRdWVyeVJlcGxhY2VDaGFyc1xuICAgIH0pKS50aGVuKF90aGlzLnR5cGVhaGVhZC51cGRhdGVEYXRhLmJpbmQoX3RoaXMudHlwZWFoZWFkKSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IubmFtZSAhPT0gJ0Fib3J0RXJyb3InKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdUeXBlYWhlYWRTZXJ2aWNlIGVycm9yOiAnLCBlcnJvciwgJ3F1ZXJ5OiAnLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRoaXMuY29kZSA9IGNvbnRleHQucXVlcnlTZWxlY3RvcignLmpzLXR5cGVhaGVhZC1jb2RlJyk7XG5cbiAgdGhpcy50eXBlYWhlYWQuZW1pdHRlci5vbihORVdfSVRFTV9TRUxFQ1RFRF9FVkVOVCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIF90aGlzLmNvZGUudmFsdWUgPSB2YWx1ZS5jb2RlO1xuICB9KTtcblxuICB0aGlzLnR5cGVhaGVhZC5lbWl0dGVyLm9uKFVOU0VUX0ZJRUxEX1ZBTFVFX0VWRU5ULCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF90aGlzLmNvZGUudmFsdWUgPSAnJztcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBUeXBlYWhlYWRNb2R1bGUoKSB7XG4gIHZhciB0eXBlYWhlYWRzID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy10eXBlYWhlYWQnKSkpO1xuXG4gIHR5cGVhaGVhZHMuZm9yRWFjaChmdW5jdGlvbiAodHlwZWFoZWFkKSB7XG4gICAgcmV0dXJuIG5ldyBUeXBlYWhlYWRDb250YWluZXIodHlwZWFoZWFkKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGVtcG9yYXJ5IC0ganVzdCBmb3IgcHJvdG90eXBlLCBzaG91bGQgYmVsb25nIGluIG1haW4vYm9vdCBmaWxlXG4gKi9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ1RZUEVBSEVBRC1SRUFEWScsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG5ldyBUeXBlYWhlYWRNb2R1bGUoKTtcbn0pO1xuXG5mdW5jdGlvbiBhdXRvSW5jcmVtZW50SWQoY29sbGVjdGlvbikge1xuICB2YXIgayA9IGNvbGxlY3Rpb24gKyAnLWluY3JlbWVudCcsXG4gICAgICBpZCA9IHBhcnNlSW50KHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oaykpIHx8IDA7XG5cbiAgaWQrKztcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGssIEpTT04uc3RyaW5naWZ5KGlkKSk7XG5cbiAgcmV0dXJuIGlkO1xufVxuXG5mdW5jdGlvbiByZW1vdmVGcm9tTGlzdChsaXN0LCB2YWwpIHtcblxuICBmdW5jdGlvbiBkb1JlbW92ZShpdGVtKSB7XG4gICAgdmFyIGZvdW5kSWQgPSBsaXN0LmluZGV4T2YoaXRlbSk7XG5cbiAgICAvKipcbiAgICAgKiBHdWFyZFxuICAgICAqL1xuICAgIGlmIChmb3VuZElkID09PSAtMSkge1xuICAgICAgY29uc29sZS5sb2coJ0F0dGVtcHQgdG8gcmVtb3ZlIGZyb20gbGlzdCBmYWlsZWQ6ICcsIGxpc3QsIHZhbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGlzdC5zcGxpY2UoZm91bmRJZCwgMSk7XG4gIH1cblxuICBpZiAoXy5pc0FycmF5KHZhbCkpIHtcbiAgICAkLmVhY2godmFsLCBmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgZG9SZW1vdmUoaXRlbSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZG9SZW1vdmUodmFsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFpbGluZ05hbWVTKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWVbbmFtZS5sZW5ndGggLSAxXSA9PT0gJ3MnID8gJ1xcJiN4MjAxOTsnIDogJ1xcJiN4MjAxOTtzJztcbn1cblxudmFyIEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZID0gJ2hvdXNlaG9sZC1tZW1iZXJzJztcbnZhciBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPSAncGVyc29uX21lJztcbnZhciBIT1VTRUhPTERfTUVNQkVSX1RZUEUgPSAnaG91c2Vob2xkLW1lbWJlcic7XG52YXIgVklTSVRPUl9UWVBFID0gJ3Zpc2l0b3InO1xuXG4vKipcbiAqIFR5cGVzXG4gKi9cbmZ1bmN0aW9uIHBlcnNvbihvcHRzKSB7XG4gIGlmIChvcHRzLmZpcnN0TmFtZSA9PT0gJycgfHwgb3B0cy5sYXN0TmFtZSA9PT0gJycpIHtcbiAgICBjb25zb2xlLmxvZygnVW5hYmxlIHRvIGNyZWF0ZSBwZXJzb24gd2l0aCBkYXRhOiAnLCBvcHRzLmZpcnN0TmFtZSwgIW9wdHMubWlkZGxlTmFtZSwgIW9wdHMubGFzdE5hbWUpO1xuICB9XG5cbiAgdmFyIG1pZGRsZU5hbWUgPSBvcHRzLm1pZGRsZU5hbWUgfHwgJyc7XG5cbiAgcmV0dXJuIHtcbiAgICBmdWxsTmFtZTogb3B0cy5maXJzdE5hbWUgKyAnICcgKyBtaWRkbGVOYW1lICsgJyAnICsgb3B0cy5sYXN0TmFtZSxcbiAgICBmaXJzdE5hbWU6IG9wdHMuZmlyc3ROYW1lLFxuICAgIG1pZGRsZU5hbWU6IG1pZGRsZU5hbWUsXG4gICAgbGFzdE5hbWU6IG9wdHMubGFzdE5hbWVcbiAgfTtcbn1cblxuLyoqXG4gKiBTdG9yYWdlXG4gKi9cbmZ1bmN0aW9uIGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcigpIHtcbiAgcmV0dXJuIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maW5kKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgPT09IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcigpIHtcbiAgZGVsZXRlSG91c2Vob2xkTWVtYmVyKFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcihwZXJzb25JZCkge1xuICB2YXIgbWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCAhPT0gcGVyc29uSWQ7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KG1lbWJlcnMpKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVXNlckFzSG91c2Vob2xkTWVtYmVyKHBlcnNvbiwgbWVtYmVyRGF0YSkge1xuICB2YXIgdXNlckFzSG91c2Vob2xkTWVtYmVyID0gZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyKCk7XG5cbiAgdXNlckFzSG91c2Vob2xkTWVtYmVyID8gdXBkYXRlSG91c2Vob2xkTWVtYmVyKF9leHRlbmRzKHt9LCB1c2VyQXNIb3VzZWhvbGRNZW1iZXJbJ0BwZXJzb24nXSwgcGVyc29uKSwgbWVtYmVyRGF0YSkgOiBhZGRIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhLCBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhKSB7XG4gIHZhciBtZW1iZXJzVXBkYXRlZCA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5tYXAoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gcGVyc29uLmlkID8gX2V4dGVuZHMoe30sIG1lbWJlciwgbWVtYmVyRGF0YSwgeyAnQHBlcnNvbic6IF9leHRlbmRzKHt9LCBtZW1iZXJbJ0BwZXJzb24nXSwgcGVyc29uKSB9KSA6IG1lbWJlcjtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkobWVtYmVyc1VwZGF0ZWQpKTtcbn1cblxuZnVuY3Rpb24gYWRkSG91c2Vob2xkTWVtYmVyKHBlcnNvbiwgbWVtYmVyRGF0YSwgaWQpIHtcbiAgdmFyIHBlb3BsZSA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSB8fCBbXTtcbiAgbWVtYmVyRGF0YSA9IG1lbWJlckRhdGEgfHwge307XG5cbiAgLyoqXG4gICAqIFVzZXIgaXMgYWx3YXlzIGZpcnN0IGluIHRoZSBob3VzZWhvbGQgbGlzdFxuICAgKi9cbiAgcGVvcGxlW2lkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPyAndW5zaGlmdCcgOiAncHVzaCddKF9leHRlbmRzKHt9LCBtZW1iZXJEYXRhLCB7XG4gICAgdHlwZTogbWVtYmVyRGF0YS50eXBlIHx8IEhPVVNFSE9MRF9NRU1CRVJfVFlQRSxcbiAgICAnQHBlcnNvbic6IF9leHRlbmRzKHt9LCBwZXJzb24sIHtcbiAgICAgIGlkOiBpZCB8fCAncGVyc29uJyArIGF1dG9JbmNyZW1lbnRJZCgnaG91c2Vob2xkLW1lbWJlcnMnKVxuICAgIH0pXG4gIH0pKTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShwZW9wbGUpKTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSkpIHx8IFtdO1xufVxuXG5mdW5jdGlvbiBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKGlkKSB7XG4gIHJldHVybiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmluZChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBpZDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldE1lbWJlclBlcnNvbklkKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvcnNcbiAqL1xuZnVuY3Rpb24gaXNWaXNpdG9yKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlZJU0lUT1JfVFlQRTtcbn1cblxuZnVuY3Rpb24gaXNIb3VzZWhvbGRNZW1iZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUl9UWVBFO1xufVxuXG5mdW5jdGlvbiBpc090aGVySG91c2Vob2xkTWVtYmVyKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLkhPVVNFSE9MRF9NRU1CRVJfVFlQRSAmJiBtZW1iZXJbJ0BwZXJzb24nXS5pZCAhPT0gd2luZG93Lk9OUy5zdG9yYWdlLklEUy5VU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ7XG59XG5cbnZhciB0ZW1wQXdheVF1ZXN0aW9uU2VudGVuY2VNYXAgPSB7XG4gICd0aHJlZS1tb3JlJzogJ1Blb3BsZSB3aG8gdXN1YWxseSBsaXZlIG91dHNpZGUgdGhlIFVLIHdobyBhcmUgc3RheWluZyBpbiB0aGUgVUsgZm9yIDMgbW9udGhzIG9yIG1vcmUnLFxuICAncGVybS1hd2F5JzogJ1Blb3BsZSB3aG8gd29yayBhd2F5IGZyb20gaG9tZSB3aXRoaW4gdGhlIFVLIGlmIHRoaXMgaXMgdGhlaXIgcGVybWFuZW50IG9yIGZhbWlseSBob21lJyxcbiAgJ2FybWVkLWZvcmNlcyc6ICdNZW1iZXJzIG9mIHRoZSBhcm1lZCBmb3JjZXMgaWYgdGhpcyBpcyB0aGVpciBwZXJtYW5lbnQgb3IgZmFtaWx5IGhvbWUnLFxuICAnbGVzcy10d2VsdmUnOiAnUGVvcGxlIHdobyBhcmUgdGVtcG9yYXJpbHkgb3V0c2lkZSB0aGUgVUsgZm9yIGxlc3MgdGhhbiAxMiBtb250aHMnLFxuICAndXN1YWxseS10ZW1wJzogJ1Blb3BsZSBzdGF5aW5nIHRlbXBvcmFyaWx5IHdobyB1c3VhbGx5IGxpdmUgaW4gdGhlIFVLIGJ1dCcgKyAnIGRvIG5vdCBoYXZlIGFub3RoZXIgVUsgYWRkcmVzcyBmb3IgZXhhbXBsZSwgcmVsYXRpdmVzLCBmcmllbmRzJyxcbiAgJ290aGVyJzogJ090aGVyIHBlb3BsZSB3aG8gdXN1YWxseSBsaXZlIGhlcmUgYnV0IGFyZSB0ZW1wb3JhcmlseSBhd2F5J1xufTtcblxudmFyIHZpc2l0b3JRdWVzdGlvblNlbnRlbmNlTWFwID0ge1xuICAndXN1YWxseS1pbi11ayc6ICdQZW9wbGUgd2hvIHVzdWFsbHkgbGl2ZSBzb21ld2hlcmUgZWxzZSBpbiB0aGUgVUssIGZvciBleGFtcGxlIGJveS9naXJsZnJpZW5kcywgZnJpZW5kcyBvciByZWxhdGl2ZXMnLFxuICAnc2Vjb25kLWFkZHJlc3MnOiAnUGVvcGxlIHN0YXlpbmcgaGVyZSBiZWNhdXNlIGl0IGlzIHRoZWlyIHNlY29uZCBhZGRyZXNzLCBmb3IgZXhhbXBsZSwgZm9yIHdvcmsuIFRoZWlyIHBlcm1hbmVudCBvciBmYW1pbHkgaG9tZSBpcyBlbHNld2hlcmUnLFxuICAnbGVzcy10aHJlZSc6ICdQZW9wbGUgd2hvIHVzdWFsbHkgbGl2ZSBvdXRzaWRlIHRoZSBVSyB3aG8gYXJlIHN0YXlpbmcgaW4gdGhlIFVLIGZvciBsZXNzIHRoYW4gdGhyZWUgbW9udGhzJyxcbiAgJ29uLWhvbGlkYXknOiAnUGVvcGxlIGhlcmUgb24gaG9saWRheSdcbn07XG5cbi8qKlxuICogQXVnbWVudCBVbmRlcnNjb3JlIGxpYnJhcnlcbiAqL1xudmFyIF8kMSA9IHdpbmRvdy5fIHx8IHt9O1xuXG52YXIgUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSA9ICdyZWxhdGlvbnNoaXBzJztcblxudmFyIHJlbGF0aW9uc2hpcFR5cGVzID0ge1xuICAnc3BvdXNlJzogeyBpZDogJ3Nwb3VzZScgfSxcbiAgJ2NoaWxkLXBhcmVudCc6IHsgaWQ6ICdjaGlsZC1wYXJlbnQnIH0sXG4gICdzdGVwLWNoaWxkLXBhcmVudCc6IHsgaWQ6ICdzdGVwLWNoaWxkLXBhcmVudCcgfSxcbiAgJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnOiB7IGlkOiAnZ3JhbmRjaGlsZC1ncmFuZHBhcmVudCcgfSxcbiAgJ2hhbGYtc2libGluZyc6IHsgaWQ6ICdoYWxmLXNpYmxpbmcnIH0sXG4gICdzaWJsaW5nJzogeyBpZDogJ3NpYmxpbmcnIH0sXG4gICdzdGVwLWJyb3RoZXItc2lzdGVyJzogeyBpZDogJ3N0ZXAtYnJvdGhlci1zaXN0ZXInIH0sXG4gICdwYXJ0bmVyJzogeyBpZDogJ3BhcnRuZXInIH0sXG4gICd1bnJlbGF0ZWQnOiB7IGlkOiAndW5yZWxhdGVkJyB9LFxuICAnb3RoZXItcmVsYXRpb24nOiB7IGlkOiAnb3RoZXItcmVsYXRpb24nIH1cbn07XG5cbnZhciByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcCA9IHtcbiAgLy8gY292ZXJlZFxuICAnaHVzYmFuZC13aWZlJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdodXNiYW5kIG9yIHdpZmUnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdodXNiYW5kIG9yIHdpZmUnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzcG91c2UnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdtb3RoZXItZmF0aGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdtb3RoZXIgb3IgZmF0aGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnbW90aGVyIG9yIGZhdGhlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2NoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3N0ZXAtbW90aGVyLWZhdGhlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcG1vdGhlciBvciBzdGVwZmF0aGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc3RlcG1vdGhlciBvciBzdGVwZmF0aGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3RlcC1jaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzb24tZGF1Z2h0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3NvbiBvciBkYXVnaHRlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3NvbiBvciBkYXVnaHRlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2NoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ2hhbGYtYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2hhbGYtYnJvdGhlciBvciBoYWxmLXNpc3RlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2hhbGYtYnJvdGhlciBvciBoYWxmLXNpc3RlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2hhbGYtc2libGluZyddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3N0ZXAtY2hpbGQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3N0ZXBjaGlsZCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3N0ZXBjaGlsZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3N0ZXAtY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnZ3JhbmRwYXJlbnQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2dyYW5kcGFyZW50JyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnZ3JhbmRwYXJlbnQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydncmFuZGNoaWxkLWdyYW5kcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnZ3JhbmRjaGlsZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnZ3JhbmRjaGlsZCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2dyYW5kY2hpbGQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydncmFuZGNoaWxkLWdyYW5kcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2Jyb3RoZXIgb3Igc2lzdGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnYnJvdGhlciBvciBzaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzaWJsaW5nJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnc3RlcC1icm90aGVyLXNpc3Rlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcGJyb3RoZXIgb3Igc3RlcHNpc3RlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3N0ZXBicm90aGVyIG9yIHN0ZXBzaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzdGVwLWJyb3RoZXItc2lzdGVyJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnb3RoZXItcmVsYXRpb24nOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ290aGVyIHJlbGF0aW9uJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAncmVsYXRlZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ290aGVyLXJlbGF0aW9uJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAncGFydG5lcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAncGFydG5lcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3BhcnRuZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydwYXJ0bmVyJ11cbiAgfSxcbiAgJ3NhbWUtc2V4LXBhcnRuZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2xlZ2FsbHkgcmVnaXN0ZXJlZCBjaXZpbCBwYXJ0bmVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnbGVnYWxseSByZWdpc3RlcmVkIGNpdmlsIHBhcnRuZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydwYXJ0bmVyJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAndW5yZWxhdGVkJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICd1bnJlbGF0ZWQnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICd1bnJlbGF0ZWQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWyd1bnJlbGF0ZWQnXVxuICB9XG59O1xuXG5mdW5jdGlvbiBuYW1lRWxlbWVudChuYW1lKSB7XG4gIHJldHVybiAnPHN0cm9uZz4nICsgbmFtZSArICc8L3N0cm9uZz4nO1xufVxuXG5mdW5jdGlvbiBwZXJzb25MaXN0U3RyKHBlb3BsZUFycikge1xuICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgaWYgKHBlb3BsZUFyci5sZW5ndGggPCAxKSB7XG4gICAgY29uc29sZS5sb2cocGVvcGxlQXJyLCAnbm90IGVub3VnaCBwZW9wbGUgdG8gY3JlYXRlIGEgbGlzdCBzdHJpbmcnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocGVvcGxlQXJyLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBuYW1lRWxlbWVudChwZW9wbGVBcnJbMF0uZnVsbE5hbWUgKyBmb3JtYXRQZXJzb25JZllvdShwZW9wbGVBcnJbMF0pKTtcbiAgfVxuXG4gIHZhciBwZW9wbGVDb3B5ID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KHBlb3BsZUFycikpLFxuICAgICAgbGFzdFBlcnNvbiA9IHBlb3BsZUNvcHkucG9wKCk7XG5cbiAgcmV0dXJuIHBlb3BsZUNvcHkubWFwKGZ1bmN0aW9uIChwZXJzb24kJDEpIHtcbiAgICByZXR1cm4gJycgKyBuYW1lRWxlbWVudChwZXJzb24kJDEuZnVsbE5hbWUgKyAob3B0cy5pc0ZhbWlseSA/IHRyYWlsaW5nTmFtZVMocGVyc29uJCQxLmZ1bGxOYW1lKSA6ICcnKSArIGZvcm1hdFBlcnNvbklmWW91KHBlcnNvbiQkMSkpO1xuICB9KS5qb2luKCcsICcpICsgJyBhbmQgJyArIG5hbWVFbGVtZW50KGxhc3RQZXJzb24uZnVsbE5hbWUgKyAob3B0cy5pc0ZhbWlseSA/IHRyYWlsaW5nTmFtZVMobGFzdFBlcnNvbi5mdWxsTmFtZSkgOiAnJykgKyBmb3JtYXRQZXJzb25JZllvdShsYXN0UGVyc29uKSk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFBlcnNvbklmWW91KHBlcnNvbiQkMSkge1xuICByZXR1cm4gcGVyc29uJCQxLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPyAnIChZb3UpJyA6ICcnO1xufVxuXG52YXIgcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlcyA9IHtcbiAgJ3BhcnRuZXJzaGlwJzogZnVuY3Rpb24gcGFydG5lcnNoaXAocGVyc29uMSwgcGVyc29uMiwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGVyc29uMS5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBlcnNvbjEpKSArICcgaXMgJyArIG5hbWVFbGVtZW50KHBlcnNvbjIuZnVsbE5hbWUgKyB0cmFpbGluZ05hbWVTKHBlcnNvbjIuZnVsbE5hbWUpICsgZm9ybWF0UGVyc29uSWZZb3UocGVyc29uMikpICsgJyAnICsgZGVzY3JpcHRpb247XG4gIH0sXG4gICd0d29GYW1pbHlNZW1iZXJzVG9NYW55JzogZnVuY3Rpb24gdHdvRmFtaWx5TWVtYmVyc1RvTWFueShwYXJlbnQxLCBwYXJlbnQyLCBjaGlsZHJlbkFyciwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGFyZW50MS5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBhcmVudDEpKSArICcgYW5kICcgKyBuYW1lRWxlbWVudChwYXJlbnQyLmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGFyZW50MikpICsgJyBhcmUgJyArIHBlcnNvbkxpc3RTdHIoY2hpbGRyZW5BcnIsIHsgaXNGYW1pbHk6IHRydWUgfSkgKyAnICcgKyBkZXNjcmlwdGlvbjtcbiAgfSxcbiAgJ29uZUZhbWlseU1lbWJlclRvTWFueSc6IGZ1bmN0aW9uIG9uZUZhbWlseU1lbWJlclRvTWFueShwYXJlbnQsIGNoaWxkcmVuQXJyLCBkZXNjcmlwdGlvbikge1xuICAgIGNvbnNvbGUubG9nKHBhcmVudCwgY2hpbGRyZW5BcnIsIGRlc2NyaXB0aW9uKTtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGFyZW50LmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGFyZW50KSkgKyAnIGlzICcgKyBwZXJzb25MaXN0U3RyKGNoaWxkcmVuQXJyLCB7IGlzRmFtaWx5OiB0cnVlIH0pICsgJyAnICsgZGVzY3JpcHRpb247XG4gIH0sXG4gICdtYW55VG9NYW55JzogZnVuY3Rpb24gbWFueVRvTWFueShwZW9wbGVBcnIxLCBwZW9wbGVBcnIyLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBwZXJzb25MaXN0U3RyKHBlb3BsZUFycjEpICsgJyAnICsgKHBlb3BsZUFycjEubGVuZ3RoID4gMSA/ICdhcmUnIDogJ2lzJykgKyAnICcgKyBkZXNjcmlwdGlvbiArICcgdG8gJyArIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyMik7XG4gIH0sXG4gICdhbGxNdXR1YWwnOiBmdW5jdGlvbiBhbGxNdXR1YWwocGVvcGxlQXJyLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBwZXJzb25MaXN0U3RyKHBlb3BsZUFycikgKyAnIGFyZSAnICsgZGVzY3JpcHRpb247XG4gIH1cbn07XG5cbi8qKlxuICogVHlwZXNcbiAqL1xuZnVuY3Rpb24gcmVsYXRpb25zaGlwKGRlc2NyaXB0aW9uLCBwZXJzb25Jc0lkLCBwZXJzb25Ub0lkKSB7XG4gIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiB7fTtcblxuICByZXR1cm4ge1xuICAgIHBlcnNvbklzRGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgIHBlcnNvbklzSWQ6IHBlcnNvbklzSWQsXG4gICAgcGVyc29uVG9JZDogcGVyc29uVG9JZCxcbiAgICBpbmZlcnJlZDogISFvcHRzLmluZmVycmVkLFxuICAgIGluZmVycmVkQnk6IG9wdHMuaW5mZXJyZWRCeVxuICB9O1xufVxuXG4vKipcbiAqIFN0b3JhZ2VcbiAqL1xuZnVuY3Rpb24gYWRkUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcE9iaikge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKSB8fCBbXSxcbiAgICAgIGl0ZW0gPSBfZXh0ZW5kcyh7fSwgcmVsYXRpb25zaGlwT2JqLCB7XG4gICAgaWQ6IGF1dG9JbmNyZW1lbnRJZChSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZKVxuICB9KTtcblxuICBob3VzZWhvbGRSZWxhdGlvbnNoaXBzLnB1c2goaXRlbSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG5cbiAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXBPYmopIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSAoZ2V0QWxsUmVsYXRpb25zaGlwcygpIHx8IFtdKS5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiByZWxhdGlvbnNoaXAuaWQgIT09IHJlbGF0aW9uc2hpcE9iai5pZDtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG59XG5cbmZ1bmN0aW9uIGVkaXRSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwSWQsIHZhbHVlT2JqZWN0KSB7XG4gIHZhciBob3VzZWhvbGRSZWxhdGlvbnNoaXBzID0gKGdldEFsbFJlbGF0aW9uc2hpcHMoKSB8fCBbXSkubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gcmVsYXRpb25zaGlwLmlkICsgJycgPT09IHJlbGF0aW9uc2hpcElkICsgJycgPyBfZXh0ZW5kcyh7fSwgdmFsdWVPYmplY3QsIHtcbiAgICAgIGlkOiByZWxhdGlvbnNoaXBJZFxuICAgIH0pIDogcmVsYXRpb25zaGlwO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsUmVsYXRpb25zaGlwcygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZKSkgfHwgW107XG59XG5cbmZ1bmN0aW9uIGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHMoKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gIXJlbGF0aW9uc2hpcC5pbmZlcnJlZDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUFsbFJlbGF0aW9uc2hpcHNGb3JNZW1iZXIocGVyc29uSWQpIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gIShwZXJzb25JZCA9PT0gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgfHwgcGVyc29uSWQgPT09IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkKTtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvcnNcbiAqL1xuZnVuY3Rpb24gaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkO1xufVxuXG5mdW5jdGlvbiBpc0FDaGlsZEluUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgLyoqXG4gICAqIEd1YXJkXG4gICAqL1xuICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZDtcbn1cblxuZnVuY3Rpb24gaXNBU2libGluZ0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkgJiYgcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGUuaWQgPT09ICdzaWJsaW5nJztcbn1cblxuZnVuY3Rpb24gaXNBUGFyZW50SW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICAvKipcbiAgICogR3VhcmRcbiAgICovXG4gIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCB8fCByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkO1xufVxuXG5mdW5jdGlvbiBhcmVBbnlDaGlsZHJlbkluUmVsYXRpb25zaGlwTm90UGFyZW50KGNoaWxkcmVuSWRzLCBub3RQYXJlbnRJZCwgcmVsYXRpb25zaGlwKSB7XG4gIC8qKlxuICAgKiBHdWFyZFxuICAgKiBJZiByZWxhdGlvbnNoaXAgdHlwZSBpcyBub3QgY2hpbGQtcGFyZW50XG4gICAqL1xuICBpZiAocmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGUuaWQgIT09ICdjaGlsZC1wYXJlbnQnKSB7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgY2hpbGRJbmRleEFzUGVyc29uSXMgPSBjaGlsZHJlbklkcy5pbmRleE9mKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkKSxcbiAgICAgIGNoaWxkSW5kZXhBc1BlcnNvblRvID0gY2hpbGRyZW5JZHMuaW5kZXhPZihyZWxhdGlvbnNoaXAucGVyc29uVG9JZCk7XG5cbiAgLyoqXG4gICAqIEZpbmQgcGFyZW50cyB3aXRoIHRoZSBzYW1lIGNoaWxkcmVuXG4gICAqXG4gICAqIElmIGEgcGVyc29uSXMtY2hpbGQgaXMgbm90IGluIHJlbGF0aW9uc2hpcFxuICAgKiBvciAyIGNoaWxkcmVuIGFyZSBmb3VuZCBpbiByZWxhdGlvbnNoaXBcbiAgICovXG4gIGlmIChjaGlsZEluZGV4QXNQZXJzb25JcyA9PT0gLTEgJiYgY2hpbGRJbmRleEFzUGVyc29uVG8gPT09IC0xIHx8IGNoaWxkSW5kZXhBc1BlcnNvbklzICE9PSAtMSAmJiBjaGlsZEluZGV4QXNQZXJzb25UbyAhPT0gLTEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ2hpbGQgbXVzdCBiZSBpbiByZWxhdGlvbnNoaXAsIGdldCBjaGlsZCBpbmRleFxuICAgKi9cbiAgdmFyIGNoaWxkSW5kZXggPSBjaGlsZEluZGV4QXNQZXJzb25JcyAhPT0gLTEgPyBjaGlsZEluZGV4QXNQZXJzb25JcyA6IGNoaWxkSW5kZXhBc1BlcnNvblRvO1xuXG4gIC8qKlxuICAgKiBJZiBwZXJzb25JcyBpcyBub3QgaW4gcmVsYXRpb25zaGlwXG4gICAqIGFuZCBjaGlsZCBmcm9tIHByZXZpb3VzIHJlbGF0aW9uc2hpcCBpcyBhIGNoaWxkIGluIHRoaXMgcmVsYXRpb25zaGlwXG4gICAqL1xuICByZXR1cm4gIWlzSW5SZWxhdGlvbnNoaXAobm90UGFyZW50SWQsIHJlbGF0aW9uc2hpcCkgJiYgaXNBQ2hpbGRJblJlbGF0aW9uc2hpcChjaGlsZHJlbklkc1tjaGlsZEluZGV4XSwgcmVsYXRpb25zaGlwKTtcbn1cblxuZnVuY3Rpb24gaXNSZWxhdGlvbnNoaXBUeXBlKHJlbGF0aW9uc2hpcFR5cGUsIHJlbGF0aW9uc2hpcCkge1xuICB2YXIgdHlwZU9mUmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGUuaWQ7XG5cbiAgLyoqXG4gICAqIHJlbGF0aW9uc2hpcFR5cGUgY2FuIGJlIGFuIGFycmF5IG9mIHR5cGVzXG4gICAqL1xuICByZXR1cm4gXyQxLmlzQXJyYXkocmVsYXRpb25zaGlwVHlwZSkgPyAhIV8kMS5maW5kKHJlbGF0aW9uc2hpcFR5cGUsIGZ1bmN0aW9uIChyVHlwZSkge1xuICAgIHJldHVybiByVHlwZSA9PT0gdHlwZU9mUmVsYXRpb25zaGlwO1xuICB9KSA6IHR5cGVPZlJlbGF0aW9uc2hpcCA9PT0gcmVsYXRpb25zaGlwVHlwZTtcbn1cblxuZnVuY3Rpb24gaXNSZWxhdGlvbnNoaXBJbmZlcnJlZChyZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5pbmZlcnJlZDtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBwZW9wbGUgYnkgcm9sZSBpbiByZWxhdGlvbnNoaXBzXG4gKi9cbmZ1bmN0aW9uIGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApIHtcbiAgdmFyIHBhcmVudElkID0gdm9pZCAwO1xuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInKSB7XG4gICAgcGFyZW50SWQgPSByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbiAgfVxuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicpIHtcbiAgICBwYXJlbnRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkO1xuICB9XG5cbiAgaWYgKCFwYXJlbnRJZCkge1xuICAgIGNvbnNvbGUubG9nKCdQYXJlbnQgbm90IGZvdW5kIGluIHJlbGF0aW9uc2hpcDogJywgcmVsYXRpb25zaGlwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcGFyZW50SWQ7XG59XG5cbmZ1bmN0aW9uIGdldENoaWxkSWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkge1xuICB2YXIgY2hpbGRJZCA9IHZvaWQgMDtcblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJykge1xuICAgIGNoaWxkSWQgPSByZWxhdGlvbnNoaXAucGVyc29uVG9JZDtcbiAgfVxuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicpIHtcbiAgICBjaGlsZElkID0gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQ7XG4gIH1cblxuICBpZiAoIWNoaWxkSWQpIHtcbiAgICBjb25zb2xlLmxvZygnQ2hpbGQgbm90IGZvdW5kIGluIHJlbGF0aW9uc2hpcDogJywgcmVsYXRpb25zaGlwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gY2hpbGRJZDtcbn1cblxuZnVuY3Rpb24gZ2V0U2libGluZ0lkRnJvbVJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgIGNvbnNvbGUubG9nKCdQZXJzb24gJyArIHBlcnNvbklkICsgJyBub3QgZm91bmQgaW4gcmVsYXRpb25zaGlwOiAnLCByZWxhdGlvbnNoaXApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiByZWxhdGlvbnNoaXBbcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkID8gJ3BlcnNvblRvSWQnIDogJ3BlcnNvbklzSWQnXTtcbn1cblxuZnVuY3Rpb24gZ2V0T3RoZXJQZXJzb25JZEZyb21SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkID8gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgOiByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsUGFyZW50c09mKHBlcnNvbklkKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGlzQUNoaWxkSW5SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGdldFBlcnNvbkZyb21NZW1iZXIoZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZChnZXRQYXJlbnRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSkpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsQ2hpbGRyZW5PZihwZXJzb25JZCkge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihpc0FQYXJlbnRJblJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSkubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZChnZXRDaGlsZElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApKVsnQHBlcnNvbiddO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UGVyc29uSWRGcm9tUGVyc29uKHBlcnNvbiQkMSkge1xuICByZXR1cm4gcGVyc29uJCQxLmlkO1xufVxuXG5mdW5jdGlvbiBnZXRQZXJzb25Gcm9tTWVtYmVyKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ107XG59XG5cbi8qKlxuICogTWlzc2luZyByZWxhdGlvbnNoaXAgaW5mZXJlbmNlXG4gKi9cbnZhciBtaXNzaW5nUmVsYXRpb25zaGlwSW5mZXJlbmNlID0ge1xuICBzaWJsaW5nc09mOiBmdW5jdGlvbiBzaWJsaW5nc09mKHN1YmplY3RNZW1iZXIpIHtcblxuICAgIHZhciBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IFtdLFxuICAgICAgICBhbGxSZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpLFxuICAgICAgICBwZXJzb24kJDEgPSBnZXRQZXJzb25Gcm9tTWVtYmVyKHN1YmplY3RNZW1iZXIpLFxuICAgICAgICBwZXJzb25JZCA9IHBlcnNvbiQkMS5pZCxcbiAgICAgICAgcGFyZW50cyA9IGdldEFsbFBhcmVudHNPZihwZXJzb25JZCksXG4gICAgICAgIHNpYmxpbmdJZHMgPSBhbGxSZWxhdGlvbnNoaXBzLmZpbHRlcihpc0FTaWJsaW5nSW5SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpLm1hcChnZXRTaWJsaW5nSWRGcm9tUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKTtcblxuICAgIC8qKlxuICAgICAqIElmIDIgcGFyZW50IHJlbGF0aW9uc2hpcHMgb2YgJ3BlcnNvbicgYXJlIGZvdW5kIHdlIGNhbiBhdHRlbXB0IHRvIGluZmVyXG4gICAgICogc2libGluZyByZWxhdGlvbnNoaXBzXG4gICAgICovXG4gICAgaWYgKHBhcmVudHMubGVuZ3RoID09PSAyKSB7XG5cbiAgICAgIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoaXNIb3VzZWhvbGRNZW1iZXIpLmZvckVhY2goZnVuY3Rpb24gKG1lbWJlcikge1xuXG4gICAgICAgIHZhciBtZW1iZXJQZXJzb25JZCA9IG1lbWJlclsnQHBlcnNvbiddLmlkO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHdWFyZFxuICAgICAgICAgKiBJZiBtZW1iZXIgaXMgdGhlIHN1YmplY3QgbWVtYmVyXG4gICAgICAgICAqIG9yIG1lbWJlciBpcyBhIHBhcmVudFxuICAgICAgICAgKiBvciBtZW1iZXIgYWxyZWFkeSBoYXMgYSBzaWJsaW5nIHJlbGF0aW9uc2hpcCB3aXRoICdwZXJzb24nXG4gICAgICAgICAqIHNraXAgbWVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWVtYmVyUGVyc29uSWQgPT09IHBlcnNvbklkIHx8IG1lbWJlclBlcnNvbklkID09PSBwYXJlbnRzWzBdLmlkIHx8IG1lbWJlclBlcnNvbklkID09PSBwYXJlbnRzWzFdLmlkIHx8IHNpYmxpbmdJZHMuaW5kZXhPZihtZW1iZXJQZXJzb25JZCkgPiAtMSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtZW1iZXJQYXJlbnRzID0gZ2V0QWxsUGFyZW50c09mKG1lbWJlclBlcnNvbklkKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgMiBwYXJlbnRzIG9mICdtZW1iZXInIGFyZSBmb3VuZFxuICAgICAgICAgKiBhbmQgdGhleSBhcmUgdGhlIHNhbWUgcGFyZW50cyBvZiAncGVyc29uJ1xuICAgICAgICAgKiB3ZSBoYXZlIGlkZW50aWZpZWQgYSBtaXNzaW5nIGluZmVycmVkIHJlbGF0aW9uc2hpcFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG1lbWJlclBhcmVudHMubGVuZ3RoID09PSAyICYmIF8kMS5kaWZmZXJlbmNlKHBhcmVudHMubWFwKGdldFBlcnNvbklkRnJvbVBlcnNvbiksIG1lbWJlclBhcmVudHMubWFwKGdldFBlcnNvbklkRnJvbVBlcnNvbikpLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQWRkIHRvIG1pc3NpbmdSZWxhdGlvbnNoaXBzXG4gICAgICAgICAgICovXG4gICAgICAgICAgbWlzc2luZ1JlbGF0aW9uc2hpcHMucHVzaChyZWxhdGlvbnNoaXAoJ2Jyb3RoZXItc2lzdGVyJywgcGVyc29uSWQsIG1lbWJlclBlcnNvbklkLCB7XG4gICAgICAgICAgICBpbmZlcnJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGluZmVycmVkQnk6IFtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTXVzdCBiZSA0IHJlbGF0aW9uc2hpcHNcbiAgICAgICAgICAgICAqIENvdWxkIGhhdmUgdXNlZCBtZW1iZXIncyBwYXJlbnRzIGJ1dCB3ZSBjYW4gYXNzdW1lIHRoZXlcbiAgICAgICAgICAgICAqIG11c3QgYmUgdGhlIHNhbWUgYXQgdGhpcyBwb2ludCBvciB0aGUgaW5mZXJyZW5jZVxuICAgICAgICAgICAgICogY291bGRuJ3QgaGFwcGVuLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRSZWxhdGlvbnNoaXBPZihwZXJzb25JZCwgcGFyZW50c1swXS5pZCkuaWQsIGdldFJlbGF0aW9uc2hpcE9mKHBlcnNvbklkLCBwYXJlbnRzWzFdLmlkKS5pZCwgZ2V0UmVsYXRpb25zaGlwT2YobWVtYmVyUGVyc29uSWQsIHBhcmVudHNbMF0uaWQpLmlkLCBnZXRSZWxhdGlvbnNoaXBPZihtZW1iZXJQZXJzb25JZCwgcGFyZW50c1sxXS5pZCkuaWRdXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWlzc2luZ1JlbGF0aW9uc2hpcHM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGluZmVyUmVsYXRpb25zaGlwcyhyZWxhdGlvbnNoaXAsIHBlcnNvbklzLCBwZXJzb25Ubykge1xuICB2YXIgbWlzc2luZ1JlbGF0aW9uc2hpcHMgPSBbXTtcblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJykge1xuICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gbWlzc2luZ1JlbGF0aW9uc2hpcHMuY29uY2F0KG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2Uuc2libGluZ3NPZihwZXJzb25UbykpO1xuICB9XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJykge1xuICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gbWlzc2luZ1JlbGF0aW9uc2hpcHMuY29uY2F0KG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2Uuc2libGluZ3NPZihwZXJzb25JcykpO1xuICB9XG5cbiAgJC5lYWNoKG1pc3NpbmdSZWxhdGlvbnNoaXBzLCBmdW5jdGlvbiAoaSwgcmVsYXRpb25zaGlwKSB7XG4gICAgYWRkUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBmaW5kTmV4dE1pc3NpbmdSZWxhdGlvbnNoaXAoKSB7XG4gIHZhciBob3VzZWhvbGRNZW1iZXJzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbHRlcihpc0hvdXNlaG9sZE1lbWJlciksXG4gICAgICByZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpLFxuICAgICAgbWlzc2luZ1JlbGF0aW9uc2hpcE1lbWJlcnMgPSBbXSxcbiAgICAgIHBlcnNvbklzID0gbnVsbDtcblxuICAvKipcbiAgICogRmluZCB0aGUgbmV4dCBtaXNzaW5nIHJlbGF0aW9uc2hpcFxuICAgKi9cbiAgJC5lYWNoKGhvdXNlaG9sZE1lbWJlcnMsIGZ1bmN0aW9uIChpLCBtZW1iZXIpIHtcbiAgICB2YXIgcGVyc29uSWQgPSBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcblxuICAgIC8qKlxuICAgICAqIEdldCBhbGwgcmVsYXRpb25zaGlwcyBmb3IgdGhpcyBtZW1iZXJcbiAgICAgKi9cbiAgICB2YXIgbWVtYmVyUmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHMuZmlsdGVyKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICAgIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkO1xuICAgIH0pLFxuICAgICAgICBtZW1iZXJSZWxhdGlvbnNoaXBUb0lkcyA9IG1lbWJlclJlbGF0aW9uc2hpcHMubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICAgIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgPyByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA6IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xuICAgIH0pIHx8IFtdO1xuXG4gICAgLyoqXG4gICAgICogSWYgdG90YWwgcmVsYXRpb25zaGlwcyByZWxhdGVkIHRvIHRoaXMgbWVtYmVyIGlzbid0IGVxdWFsIHRvXG4gICAgICogdG90YWwgaG91c2Vob2xkIG1lbWJlcnMgLTEsIGluZGljYXRlcyBtaXNzaW5nIHJlbGF0aW9uc2hpcFxuICAgICAqL1xuICAgIGlmIChtZW1iZXJSZWxhdGlvbnNoaXBzLmxlbmd0aCA8IGhvdXNlaG9sZE1lbWJlcnMubGVuZ3RoIC0gMSkge1xuXG4gICAgICAvKipcbiAgICAgICAqIEFsbCBtaXNzaW5nIHJlbGF0aW9uc2hpcCBtZW1iZXJzXG4gICAgICAgKi9cbiAgICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBNZW1iZXJzID0gaG91c2Vob2xkTWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuIG1lbWJlclJlbGF0aW9uc2hpcFRvSWRzLmluZGV4T2YobVsnQHBlcnNvbiddLmlkKSA9PT0gLTEgJiYgbVsnQHBlcnNvbiddLmlkICE9PSBwZXJzb25JZDtcbiAgICAgIH0pO1xuXG4gICAgICBwZXJzb25JcyA9IG1lbWJlcjtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBlcnNvbklzID8ge1xuICAgIHBlcnNvbklzOiBwZXJzb25JcyxcbiAgICBwZXJzb25UbzogbWlzc2luZ1JlbGF0aW9uc2hpcE1lbWJlcnNbMF1cbiAgfSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFBlb3BsZUlkc01pc3NpbmdSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbihwZXJzb25JZCkge1xuICB2YXIgcmVtYWluaW5nUGVyc29uSWRzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbHRlcihpc0hvdXNlaG9sZE1lbWJlcikubWFwKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhpcyBwZXJzb24gZnJvbSB0aGUgbGlzdFxuICAgKi9cbiAgcmVtb3ZlRnJvbUxpc3QocmVtYWluaW5nUGVyc29uSWRzLCBwZXJzb25JZCk7XG5cbiAgJC5lYWNoKGdldEFsbFJlbGF0aW9uc2hpcHMoKSwgZnVuY3Rpb24gKGksIHJlbGF0aW9uc2hpcCkge1xuICAgIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgb3RoZXIgcGVyc29uIGZyb20gdGhlIHJlbWFpbmluZ1BlcnNvbklkcyBsaXN0XG4gICAgICovXG4gICAgcmVtb3ZlRnJvbUxpc3QocmVtYWluaW5nUGVyc29uSWRzLCBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSk7XG4gIH0pO1xuXG4gIHJldHVybiByZW1haW5pbmdQZXJzb25JZHM7XG59XG5cbmZ1bmN0aW9uIGdldFJlbGF0aW9uc2hpcFR5cGUocmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBmcm9tIHJlbGF0aW9uc2hpcCBncm91cFxuICovXG5mdW5jdGlvbiBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkcyhyZWxhdGlvbnNoaXBzLCBpZEFycikge1xuICByZXR1cm4gcmVsYXRpb25zaGlwcy5maWx0ZXIoZnVuY3Rpb24gKGNoaWxkUmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGlkQXJyLmluZGV4T2YoY2hpbGRSZWxhdGlvbnNoaXAucGVyc29uSXNJZCkgIT09IC0xIHx8IGlkQXJyLmluZGV4T2YoY2hpbGRSZWxhdGlvbnNoaXAucGVyc29uVG9JZCkgIT09IC0xO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVsYXRpb25zaGlwT2YocGVyc29uMSwgcGVyc29uMikge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbmQoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbjEsIHJlbGF0aW9uc2hpcCkgJiYgaXNJblJlbGF0aW9uc2hpcChwZXJzb24yLCByZWxhdGlvbnNoaXApO1xuICB9KTtcbn1cblxudmFyIFBFUlNPTkFMX0RFVEFJTFNfS0VZID0gJ2luZGl2aWR1YWwtZGV0YWlscyc7XG52YXIgUEVSU09OQUxfUElOU19LRVkgPSAnaW5kaXZpZHVhbC1waW5zJztcblxudmFyIHBlcnNvbmFsRGV0YWlsc01hcml0YWxTdGF0dXNNYXAgPSB7XG4gICduZXZlcic6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05ldmVyIG1hcnJpZWQgYW5kIG5ldmVyIHJlZ2lzdGVyZWQgYSBzYW1lLXNleCBjaXZpbCcgKyAnIHBhcnRuZXJzaGlwJ1xuICB9LFxuICAnbWFycmllZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ01hcnJpZWQnXG4gIH0sXG4gICdyZWdpc3RlcmVkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnSW4gYSByZWdpc3RlcmVkIHNhbWUtc2V4IGNpdmlsIHBhcnRuZXJzaGlwJ1xuICB9LFxuICAnc2VwYXJhdGVkLW1hcnJpZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTZXBhcmF0ZWQsIGJ1dCBzdGlsbCBsZWdhbGx5IG1hcnJpZWQnXG4gIH0sXG4gICdkaXZvcmNlZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0Rpdm9yY2VkJ1xuICB9LFxuICAnZm9ybWVyLXBhcnRuZXJzaGlwJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRm9ybWVybHkgaW4gYSBzYW1lLXNleCBjaXZpbCBwYXJ0bmVyc2hpcCB3aGljaCBpcyBub3cnICsgJyBsZWdhbGx5IGRpc3NvbHZlZCdcbiAgfSxcbiAgJ3dpZG93ZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdXaWRvd2VkJ1xuICB9LFxuICAnc3Vydml2aW5nLXBhcnRuZXInOiB7XG4gICAgZGVzY3JpcHRpb246ICdTdXJ2aXZpbmcgcGFydG5lciBmcm9tIGEgc2FtZS1zZXggY2l2aWwgcGFydG5lcnNoaXAnXG4gIH0sXG4gICdzZXBhcmF0ZWQtcGFydG5lcnNoaXAnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTZXBhcmF0ZWQsIGJ1dCBzdGlsbCBsZWdhbGx5IGluIGEgc2FtZS1zZXggY2l2aWwgcGFydG5lcnNoaXAnXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNDb3VudHJ5TWFwID0ge1xuICAnZW5nbGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0VuZ2xhbmQnXG4gIH0sXG4gICd3YWxlcyc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1dhbGVzJ1xuICB9LFxuICAnc2NvdGxhbmQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTY290bGFuZCdcbiAgfSxcbiAgJ25vcnRoZXJuLWlyZWxhbmQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdOb3J0aGVybiBJcmVsYW5kJ1xuICB9LFxuICAncmVwdWJsaWMtaXJlbGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1JlcHVibGljIG9mIElyZWxhbmQnXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNPcmllbnRhdGlvbk1hcCA9IHtcbiAgJ3N0cmFpZ2h0Jzoge1xuICAgIGRlc2NyaXB0aW9uOiAnU3RyYWlnaHQgb3IgSGV0ZXJvc2V4dWFsJ1xuICB9LFxuICAnZ2F5Jzoge1xuICAgIGRlc2NyaXB0aW9uOiAnR2F5IG9yIExlc2JpYW4nXG4gIH0sXG4gICdiaXNleHVhbCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0Jpc2V4dWFsJ1xuICB9LFxuICAnb3RoZXInOiB7XG4gICAgZGVzY3JpcHRpb246ICdPdGhlcidcbiAgfSxcbiAgJ25vLXNheSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1ByZWZlciBub3QgdG8gc2F5J1xuICB9XG59O1xuXG52YXIgcGVyc29uYWxEZXRhaWxzR2VuZGVyTWFwID0ge1xuICAnbWFsZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ01hbGUnXG4gIH0sXG4gICdmZW1hbGUnOiB7XG4gICAgZGVzY3JpcHRpb246ICdGZW1hbGUnXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNOYXRpb25hbElkZW50aXR5TWFwID0ge1xuICAnZW5nbGlzaCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0VuZ2xpc2gnXG4gIH0sXG4gICd3ZWxzaCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1dlbHNoJ1xuICB9LFxuICAnc2NvdHRpc2gnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTY290dGlzaCdcbiAgfSxcbiAgJ25vcnRoZXJuLWlyaXNoJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTm9ydGhlcm4gSXJpc2gnXG4gIH0sXG4gICdicml0aXNoJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnQnJpdGlzaCdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc1Bhc3Nwb3J0Q291bnRyaWVzTWFwID0ge1xuICAndW5pdGVkLWtpbmdkb20nOiB7XG4gICAgZGVzY3JpcHRpb246ICdVbml0ZWQgS2luZ2RvbSdcbiAgfSxcbiAgJ2lyZWxhbmQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdJcmVsYW5kJ1xuICB9LFxuICAnbm9uZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05vbmUnXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNFdGhuaWNHcm91cE1hcCA9IHtcbiAgJ3doaXRlJzoge1xuICAgICdxdWVzdGlvbic6ICdXaGl0ZScsXG4gICAgJ29wdGlvbnMnOiBbe1xuICAgICAgdmFsOiAnYnJpdGlzaCcsXG4gICAgICBsYWJlbDogJ0VuZ2xpc2gsIFdlbHNoLCBTY290dGlzaCwgTm9ydGhlcm4gSXJpc2ggb3IgQnJpdGlzaCdcbiAgICB9LCB7XG4gICAgICB2YWw6ICdpcmlzaCcsXG4gICAgICBsYWJlbDogJ0lyaXNoJ1xuICAgIH0sIHtcbiAgICAgIHZhbDogJ2d5cHN5JyxcbiAgICAgIGxhYmVsOiAnR3lwc3kgb3IgSXJpc2ggVHJhdmVsZXInXG4gICAgfSwge1xuICAgICAgdmFsOiAncm9tYScsXG4gICAgICBsYWJlbDogJ1JvbWEnXG4gICAgfSwge1xuICAgICAgdmFsOiAnb3RoZXInLFxuICAgICAgbGFiZWw6ICdPdGhlciBXaGl0ZSBldGhuaWMgZ3JvdXAgb3IgYmFja2dyb3VuZCdcbiAgICB9XVxuICB9LFxuICAnbWl4ZWQnOiB7XG4gICAgJ3F1ZXN0aW9uJzogJ01peGVkIG9yIE11bHRpcGxlJyxcbiAgICAnb3B0aW9ucyc6IFt7XG4gICAgICB2YWw6ICd3aGl0ZS1ibGFjay1jYXJpYmJlYW4nLFxuICAgICAgbGFiZWw6ICdXaGl0ZSBhbmQgQmxhY2sgQ2FyaWJiZWFuJ1xuICAgIH0sIHtcbiAgICAgIHZhbDogJ3doaXRlLWJsYWNrLWFmcmljYW4nLFxuICAgICAgbGFiZWw6ICdXaGl0ZSBhbmQgQmxhY2sgQWZyaWNhbidcbiAgICB9LCB7XG4gICAgICB2YWw6ICd3aGl0ZS1hc2lhbicsXG4gICAgICBsYWJlbDogJ1doaXRlIGFuZCBBc2lhbidcbiAgICB9LCB7XG4gICAgICB2YWw6ICdvdGhlcicsXG4gICAgICBsYWJlbDogJ0FueSBvdGhlciBNaXhlZCBvciBNdWx0aXBsZSBiYWNrZ3JvdW5kJ1xuICAgIH1dXG4gIH0sXG4gICdhc2lhbic6IHtcbiAgICAncXVlc3Rpb24nOiAnQXNpYW4gb3IgQXNpYW4gQnJpdGlzaCcsXG4gICAgJ29wdGlvbnMnOiBbe1xuICAgICAgdmFsOiAnaW5kaWFuJyxcbiAgICAgIGxhYmVsOiAnSW5kaWFuJ1xuICAgIH0sIHtcbiAgICAgIHZhbDogJ3Bha2lzdGFuaScsXG4gICAgICBsYWJlbDogJ1Bha2lzdGFuaSdcbiAgICB9LCB7XG4gICAgICB2YWw6ICdiYW5nbGFkZXNoaScsXG4gICAgICBsYWJlbDogJ0JhbmdsYWRlc2hpJ1xuICAgIH0sIHtcbiAgICAgIHZhbDogJ2NoaW5lc2UnLFxuICAgICAgbGFiZWw6ICdDaGluZXNlJ1xuICAgIH0sIHtcbiAgICAgIHZhbDogJ290aGVyJyxcbiAgICAgIGxhYmVsOiAnT3RoZXIgQXNpYW4gZXRobmljIGdyb3VwIG9yIGJhY2tncm91bmQnXG4gICAgfV1cbiAgfSxcbiAgJ2JsYWNrJzoge1xuICAgICdxdWVzdGlvbic6ICdCbGFjaywgQWZyaWNhbiwgQ2FyaWJiZWFuIG9yIEJsYWNrIEJyaXRpc2gnLFxuICAgICdvcHRpb25zJzogW3tcbiAgICAgIHZhbDogJ2FmcmljYW4nLFxuICAgICAgbGFiZWw6ICdBZnJpY2FuJ1xuICAgIH0sIHtcbiAgICAgIHZhbDogJ2NhcmliYmVhbicsXG4gICAgICBsYWJlbDogJ0NhcmliYmVhbidcbiAgICB9LCB7XG4gICAgICB2YWw6ICdvdGhlcicsXG4gICAgICBsYWJlbDogJ0FueSBvdGhlciBCbGFjaywgQWZyaWNhbiBvciBDYXJpYmJlYW4gYmFja2dyb3VuZCdcbiAgICB9XVxuICB9LFxuICAnb3RoZXInOiB7XG4gICAgJ3F1ZXN0aW9uJzogJ090aGVyJyxcbiAgICAnb3B0aW9ucyc6IFt7XG4gICAgICB2YWw6ICdhcmFiJyxcbiAgICAgIGxhYmVsOiAnQXJhYidcbiAgICB9LCB7XG4gICAgICB2YWw6ICdvdGhlcicsXG4gICAgICBsYWJlbDogJ0FueSBvdGhlciBldGhuaWMgZ3JvdXAnXG4gICAgfV1cbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc0FwcHJlbnRpY2VzaGlwTWFwID0ge1xuICAneWVzJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnWWVzJ1xuICB9LFxuICAnbm8nOiB7XG4gICAgZGVzY3JpcHRpb246ICdObydcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc0RlZ3JlZUFib3ZlTWFwID0ge1xuICAneWVzJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnWWVzJ1xuICB9LFxuICAnbm8nOiB7XG4gICAgZGVzY3JpcHRpb246ICdObydcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc05WUU1hcCA9IHtcbiAgJ252cS1sZXZlbC0xJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTlZRIGxldmVsIDEgb3IgZXF1aXZhbGVudCdcbiAgfSxcbiAgJ252cS1sZXZlbC0yJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTlZRIGxldmVsIDIgb3IgZXF1aXZhbGVudCdcbiAgfSxcbiAgJ252cS1sZXZlbC0zJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTlZRIGxldmVsIDMgb3IgZXF1aXZhbGVudCdcbiAgfSxcbiAgJ25vbmUnOiB7XG4gICAgZGVzY3JpcHRpb246ICdOb25lJ1xuICB9XG59O1xuXG52YXIgcGVyc29uYWxEZXRhaWxzQUxldmVsTWFwID0ge1xuICAnYS1sZXZlbC0yJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnMiBvciBtb3JlIEEgbGV2ZWxzJ1xuICB9LFxuICAnYS1sZXZlbC0xLWJ0ZWMnOiB7XG4gICAgZGVzY3JpcHRpb246ICcxIEEgbGV2ZWwnXG4gIH0sXG4gICdhLWxldmVsLTEnOiB7XG4gICAgZGVzY3JpcHRpb246ICcxIEFTIGxldmVsJ1xuICB9LFxuICAnYmFjY2FsYXVyZWF0ZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0FkdmFuY2VkIFdlbHNoIEJhY2NhbGF1cmVhdGUnXG4gIH0sXG4gICdub25lJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTm9uZSdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc0dDU0VNYXAgPSB7XG4gICdnY3NlLTUnOiB7XG4gICAgZGVzY3JpcHRpb246ICc1IG9yIG1vcmUgR0NTRXMgZ3JhZGVzIEEqIHRvIEMgb3IgOSB0byA0J1xuICB9LFxuICAnb3RoZXItZ2NzZXMnOiB7XG4gICAgZGVzY3JpcHRpb246ICdBbnkgb3RoZXIgR0NTRXMnXG4gIH0sXG4gICdiYXNpYy1za2lsbHMnOiB7XG4gICAgZGVzY3JpcHRpb246ICdCYXNpYyBza2lsbHMgY291cnNlJ1xuICB9LFxuICAnbmF0aW9uYWwtYmFjY2FsYXVyZWF0ZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05hdGlvbmFsIFdlbHNoIEJhY2NhbGF1cmVhdGUnXG4gIH0sXG4gICdmb3VuZGF0aW9uLWJhY2NhbGF1cmVhdGUnOiB7XG4gICAgZGVzY3JpcHRpb246ICdGb3VuZGF0aW9uIFdlbHNoIEJhY2NhbGF1cmVhdGUnXG4gIH0sXG4gICdub25lJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTm9uZSBvZiB0aGVzZSBhcHBseSdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc090aGVyV2hlcmUgPSB7XG4gICdpbi1lbmdsYW5kLXdhbGVzJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnWWVzLCBpbiBFbmdsYW5kIG9yIFdhbGVzJ1xuICB9LFxuICAnb3V0c2lkZS1lbmdsYW5kLXdhbGVzJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnWWVzLCBhbnl3aGVyZSBvdXRzaWRlIG9mIEVuZ2xhbmQgYW5kIFdhbGVzJ1xuICB9LFxuICAnbm9uZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05vIHF1YWxpZmljYXRpb25zJ1xuICB9XG59O1xuXG52YXIgcGVyc29uYWxEZXRhaWxzRW1wbG95bWVudFN0YXR1cyA9IHtcbiAgJ2VtcGxveWVlJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRW1wbG95ZWUnXG4gIH0sXG4gICdmcmVlbGFuY2Utd2l0aG91dC1lbXBsb3llZXMnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTZWxmLWVtcGxveWVkIG9yIGZyZWVsYW5jZSB3aXRob3V0IGVtcGxveWVlcydcbiAgfSxcbiAgJ2ZyZWVsYW5jZS13aXRoLWVtcGxveWVlcyc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1NlbGYtZW1wbG95ZWQgd2l0aCBlbXBsb3llZXMnXG4gIH0sXG4gICdub3QtZW1wbG95ZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdOb3QgZW1wbG95ZWQnXG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIG11dGF0aW9uKSB7XG4gIHZhciBkZXRhaWxzID0gZ2V0UGVyc29uYWxEZXRhaWxzRm9yKHBlcnNvbklkKTtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIF9leHRlbmRzKHt9LCBkZXRhaWxzLCBtdXRhdGlvbihkZXRhaWxzIHx8IHt9KSkpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVQZXJzb25hbERldGFpbHNET0IocGVyc29uSWQsIGRheSwgbW9udGgsIHllYXIpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2RvYic6IHtcbiAgICAgICAgZGF5OiBkYXksXG4gICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgeWVhcjogeWVhclxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVNYXJpdGFsU3RhdHVzKHBlcnNvbklkLCB2YWwpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ21hcml0YWxTdGF0dXMnOiB2YWxcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlQ291bnRyeShwZXJzb25JZCwgdmFsKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdjb3VudHJ5Jzoge1xuICAgICAgICB2YWw6IHZhbFxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVDb3VudHJ5T3RoZXIocGVyc29uSWQsIG90aGVyVGV4dCkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKGRldGFpbHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2NvdW50cnknOiBfZXh0ZW5kcyh7fSwgZGV0YWlsc1snY291bnRyeSddIHx8IHt9LCB7XG4gICAgICAgIG90aGVyVGV4dDogb3RoZXJUZXh0XG4gICAgICB9KVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVOYXRpb25hbElkZW50aXR5KHBlcnNvbklkLCBjb2xsZWN0aW9uLCBvdGhlclRleHQpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ25hdGlvbmFsLWlkZW50aXR5JzogX2V4dGVuZHMoe1xuICAgICAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uXG4gICAgICB9LCBjb2xsZWN0aW9uLmZpbmQoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICByZXR1cm4gdmFsID09PSAnb3RoZXInO1xuICAgICAgfSkgPyB7IG90aGVyVGV4dDogb3RoZXJUZXh0IH0gOiB7fSlcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlTmF0aW9uYWxJZGVudGl0eU90aGVyKHBlcnNvbklkLCBvdGhlclRleHQpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICduYXRpb25hbC1pZGVudGl0eSc6IF9leHRlbmRzKHt9LCBkZXRhaWxzWyduYXRpb25hbC1pZGVudGl0eSddIHx8IHt9LCB7IG90aGVyVGV4dDogb3RoZXJUZXh0IH0pXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUV0aG5pY0dyb3VwKHBlcnNvbklkLCB2YWwpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2V0aG5pYy1ncm91cCc6IHtcbiAgICAgICAgdmFsOiB2YWxcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlRXRobmljR3JvdXBEZXNjcmlwdGlvbihwZXJzb25JZCwgZGVzY3JpcHRpb24pIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdldGhuaWMtZ3JvdXAnOiBfZXh0ZW5kcyh7fSwgZGV0YWlsc1snZXRobmljLWdyb3VwJ10gfHwge30sIHsgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uIH0pXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUV0aG5pY0dyb3VwT3RoZXIocGVyc29uSWQsIG90aGVyVGV4dCkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKGRldGFpbHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2V0aG5pYy1ncm91cCc6IF9leHRlbmRzKHt9LCBkZXRhaWxzWydldGhuaWMtZ3JvdXAnXSB8fCB7fSwgeyBvdGhlclRleHQ6IG90aGVyVGV4dCB9KVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVQYXNzcG9ydENvdW50cnkocGVyc29uSWQsIGNvdW50cmllcykge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKGRldGFpbHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3Bhc3Nwb3J0JzogX2V4dGVuZHMoe30sIGRldGFpbHNbJ3Bhc3Nwb3J0J10gfHwge30sIHtcbiAgICAgICAgY291bnRyaWVzOiBjb3VudHJpZXNcbiAgICAgIH0pXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZVBhc3Nwb3J0Q291bnRyeU90aGVyKHBlcnNvbklkLCBvdGhlclRleHQpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdwYXNzcG9ydCc6IF9leHRlbmRzKHt9LCBkZXRhaWxzWydwYXNzcG9ydCddIHx8IHt9LCB7XG4gICAgICAgIG90aGVyVGV4dDogb3RoZXJUZXh0XG4gICAgICB9KVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVPcmllbnRhdGlvbihwZXJzb25JZCwgdmFsKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdvcmllbnRhdGlvbic6IHZhbFxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVTYWxhcnkocGVyc29uSWQsIHZhbCkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAnc2FsYXJ5JzogdmFsXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZVNleChwZXJzb25JZCwgdmFsKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdzZXgnOiB2YWxcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlQWRkcmVzc1doZXJlKHBlcnNvbklkLCB2YWwpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2FkZHJlc3Mtd2hlcmUnOiB2YWxcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlQWdlKHBlcnNvbklkLCB2YWwsIF9yZWYpIHtcbiAgdmFyIF9yZWYkaXNBcHByb3hpbWF0ZSA9IF9yZWYuaXNBcHByb3hpbWF0ZSxcbiAgICAgIGlzQXBwcm94aW1hdGUgPSBfcmVmJGlzQXBwcm94aW1hdGUgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRpc0FwcHJveGltYXRlO1xuXG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdhZ2UnOiB7XG4gICAgICAgIHZhbDogdmFsLFxuICAgICAgICBpc0FwcHJveGltYXRlOiBpc0FwcHJveGltYXRlXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUFnZUNvbmZpcm0ocGVyc29uSWQsIHZhbCkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAnYWdlLWNvbmZpcm0nOiB7XG4gICAgICAgIHZhbDogdmFsXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUFkZHJlc3NPdXRzaWRlVUsocGVyc29uSWQsIHZhbCkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAnYWRkcmVzcy1vdXRzaWRlLXVrJzogdmFsXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUFkZHJlc3NJbmRpdmlkdWFsKHBlcnNvbklkLCB2YWwpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2FkZHJlc3MnOiB2YWxcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlQXBwcmVudGljZXNoaXAocGVyc29uSWQsIGhhc0FwcHJlbnRpY2VzaGlwKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdhcHByZW50aWNlc2hpcCc6IHtcbiAgICAgICAgaGFzQXBwcmVudGljZXNoaXA6IGhhc0FwcHJlbnRpY2VzaGlwXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUhhc1F1YWxpZmljYXRpb25BYm92ZShwZXJzb25JZCwgYWJvdmVEZWdyZWUpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdxdWFsaWZpY2F0aW9ucyc6IF9leHRlbmRzKHt9LCBkZXRhaWxzWydxdWFsaWZpY2F0aW9ucyddIHx8IHt9LCB7XG4gICAgICAgIGFib3ZlRGVncmVlOiBhYm92ZURlZ3JlZVxuICAgICAgfSlcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlUXVhbGlmaWNhdGlvbnNOdnFFcXVpdmFsZW50KHBlcnNvbklkLCBudnFFcXVpdmFsZW50KSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoZGV0YWlscykge1xuICAgIHJldHVybiB7XG4gICAgICAncXVhbGlmaWNhdGlvbnMnOiBfZXh0ZW5kcyh7fSwgZGV0YWlsc1sncXVhbGlmaWNhdGlvbnMnXSB8fCB7fSwge1xuICAgICAgICBudnFFcXVpdmFsZW50OiBudnFFcXVpdmFsZW50XG4gICAgICB9KVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVRdWFsaWZpY2F0aW9uc0FMZXZlbChwZXJzb25JZCwgYUxldmVscykge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKGRldGFpbHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3F1YWxpZmljYXRpb25zJzogX2V4dGVuZHMoe30sIGRldGFpbHNbJ3F1YWxpZmljYXRpb25zJ10gfHwge30sIHtcbiAgICAgICAgYUxldmVsczogYUxldmVsc1xuICAgICAgfSlcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlUXVhbGlmaWNhdGlvbnNHQ1NFcyhwZXJzb25JZCwgZ2NzZXMpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdxdWFsaWZpY2F0aW9ucyc6IF9leHRlbmRzKHt9LCBkZXRhaWxzWydxdWFsaWZpY2F0aW9ucyddIHx8IHt9LCB7XG4gICAgICAgIGdjc2VzOiBnY3Nlc1xuICAgICAgfSlcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlUXVhbGlmaWNhdGlvbnNPdGhlcldoZXJlKHBlcnNvbklkLCBvdGhlcnNXaGVyZSkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKGRldGFpbHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3F1YWxpZmljYXRpb25zJzogX2V4dGVuZHMoe30sIGRldGFpbHNbJ3F1YWxpZmljYXRpb25zJ10gfHwge30sIHtcbiAgICAgICAgb3RoZXJzV2hlcmU6IG90aGVyc1doZXJlXG4gICAgICB9KVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVFbXBsb3ltZW50U3RhdHVzKHBlcnNvbklkLCB2YWwpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2VtcGxveW1lbnQtc3RhdHVzJzoge1xuICAgICAgICB2YWw6IHZhbFxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVKb2JUaXRsZShwZXJzb25JZCwgdmFsKSB7XG4gIHJldHVybiBjaGFuZ2VEZXRhaWxzRm9yKHBlcnNvbklkLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdqb2ItdGl0bGUnOiB7XG4gICAgICAgIHZhbDogdmFsXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUpvYkRlc2NyaWJlKHBlcnNvbklkLCB2YWwpIHtcbiAgcmV0dXJuIGNoYW5nZURldGFpbHNGb3IocGVyc29uSWQsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2pvYi1kZXNjcmliZSc6IHtcbiAgICAgICAgdmFsOiB2YWxcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UGlucygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQRVJTT05BTF9QSU5TX0tFWSkpIHx8IHt9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQaW5Gb3IocGVyc29uSWQpIHtcbiAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gIHZhciBwaW5zID0gZ2V0UGlucygpO1xuXG4gIHBpbnNbcGVyc29uSWRdID0ge1xuICAgIHBpbjogXy5yYW5kb20oMTAwMDAsIDk5OTk5KSxcbiAgICBleHBvcnRlZDogISFvcHRzLmV4cG9ydGVkXG4gIH07XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQRVJTT05BTF9QSU5TX0tFWSwgSlNPTi5zdHJpbmdpZnkocGlucykpO1xuXG4gIHJldHVybiBwaW5zW3BlcnNvbklkXTtcbn1cblxuZnVuY3Rpb24gZ2V0UGluRm9yKHBlcnNvbklkKSB7XG4gIHJldHVybiBnZXRQaW5zKClbcGVyc29uSWRdO1xufVxuXG5mdW5jdGlvbiB1bnNldFBpbkZvcihwZXJzb25JZCkge1xuICB2YXIgcGlucyA9IGdldFBpbnMoKTtcblxuICBkZWxldGUgcGluc1twZXJzb25JZF07XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQRVJTT05BTF9QSU5TX0tFWSwgSlNPTi5zdHJpbmdpZnkocGlucykpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQRVJTT05BTF9ERVRBSUxTX0tFWSwgSlNPTi5zdHJpbmdpZnkoX2V4dGVuZHMoe30sIGdldEFsbFBlcnNvbmFsRGV0YWlscygpLCBkZWZpbmVQcm9wZXJ0eSh7fSwgcGVyc29uSWQsIGRldGFpbHMpKSkpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxQZXJzb25hbERldGFpbHMoKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEVSU09OQUxfREVUQUlMU19LRVkpKSB8fCB7fTtcbn1cblxuZnVuY3Rpb24gZ2V0UGVyc29uYWxEZXRhaWxzRm9yKHBlcnNvbklkKSB7XG4gIHZhciBzdG9yYWdlT2JqID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBwZXJzb25PYmogPSBzdG9yYWdlT2JqW3BlcnNvbklkXTtcblxuICBpZiAoIXBlcnNvbk9iaikge1xuICAgIGNvbnNvbGUubG9nKCdQZXJzb25hbCBkZXRhaWxzIGZvciAnICsgcGVyc29uSWQgKyAnIG5vdCBmb3VuZCcpO1xuICB9XG5cbiAgcmV0dXJuIHBlcnNvbk9iajtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUGVyc29uYWxEZXRhaWxzRm9yKHBlcnNvbklkKSB7XG4gIHZhciBzdG9yYWdlT2JqID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCk7XG5cbiAgZGVsZXRlIHN0b3JhZ2VPYmpbcGVyc29uSWRdO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEVSU09OQUxfREVUQUlMU19LRVksIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2VPYmopKTtcbn1cblxuZnVuY3Rpb24gcGVyc29uYWxCb29rbWFyayhwZXJzb25JZCwgcGFnZSkge1xuICByZXR1cm4gY2hhbmdlRGV0YWlsc0ZvcihwZXJzb25JZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAnX2Jvb2ttYXJrJzoge1xuICAgICAgICBwYWdlOiBwYWdlXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEJvb2ttYXJrRm9yKHBlcnNvbklkKSB7XG4gIHJldHVybiBnZXRQZXJzb25hbERldGFpbHNGb3IocGVyc29uSWQpWydfYm9va21hcmsnXS5wYWdlO1xufVxuXG5mdW5jdGlvbiBwZXJzb25hbFF1ZXN0aW9uU3VibWl0RGVjb3JhdG9yKHBlcnNvbklkLCBjYWxsYmFjaywgZSkge1xuICB2YXIgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSxcbiAgICAgIGlzRWRpdGluZyA9IHVybFBhcmFtcy5nZXQoJ2VkaXQnKTtcblxuICAhaXNFZGl0aW5nID8gcGVyc29uYWxCb29rbWFyayhwZXJzb25JZCwgd2luZG93LmxvY2F0aW9uLmhyZWYpIDogY2xlYXJQZXJzb25hbEJvb2ttYXJrKHBlcnNvbklkKTtcblxuICBjYWxsYmFjayhlKTtcbn1cblxuZnVuY3Rpb24gY2xlYXJQZXJzb25hbEJvb2ttYXJrKHBlcnNvbklkKSB7XG4gIHZhciBkZXRhaWxzID0gZ2V0UGVyc29uYWxEZXRhaWxzRm9yKHBlcnNvbklkKTtcblxuICBkZWxldGUgZGV0YWlscy5fYm9va21hcms7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBfZXh0ZW5kcyh7fSwgZGV0YWlscykpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG4vKipcbiAqIENvcGllZCBmcm9tOlxuICogaHR0cHM6Ly9jb2RlcmV2aWV3LnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy85MDM0OS9jaGFuZ2luZy1udW1iZXItdG8td29yZHMtaW4tamF2YXNjcmlwdFxuICogPT09PT09PT09PT09PT09XG4gKi9cbnZhciBPTkVfVE9fTklORVRFRU4gPSBbJ29uZScsICd0d28nLCAndGhyZWUnLCAnZm91cicsICdmaXZlJywgJ3NpeCcsICdzZXZlbicsICdlaWdodCcsICduaW5lJywgJ3RlbicsICdlbGV2ZW4nLCAndHdlbHZlJywgJ3RoaXJ0ZWVuJywgJ2ZvdXJ0ZWVuJywgJ2ZpZnRlZW4nLCAnc2l4dGVlbicsICdzZXZlbnRlZW4nLCAnZWlnaHRlZW4nLCAnbmluZXRlZW4nXTtcblxudmFyIFRFTlMgPSBbJ3RlbicsICd0d2VudHknLCAndGhpcnR5JywgJ2ZvcnR5JywgJ2ZpZnR5JywgJ3NpeHR5JywgJ3NldmVudHknLCAnZWlnaHR5JywgJ25pbmV0eSddO1xuXG52YXIgU0NBTEVTID0gWyd0aG91c2FuZCcsICdtaWxsaW9uJywgJ2JpbGxpb24nLCAndHJpbGxpb24nXTtcblxuLy8gaGVscGVyIGZ1bmN0aW9uIGZvciB1c2Ugd2l0aCBBcnJheS5maWx0ZXJcbmZ1bmN0aW9uIGlzVHJ1dGh5KGl0ZW0pIHtcbiAgcmV0dXJuICEhaXRlbTtcbn1cblxuLy8gY29udmVydCBhIG51bWJlciBpbnRvICdjaHVua3MnIG9mIDAtOTk5XG5mdW5jdGlvbiBjaHVuayhudW1iZXIpIHtcbiAgdmFyIHRob3VzYW5kcyA9IFtdO1xuXG4gIHdoaWxlIChudW1iZXIgPiAwKSB7XG4gICAgdGhvdXNhbmRzLnB1c2gobnVtYmVyICUgMTAwMCk7XG4gICAgbnVtYmVyID0gTWF0aC5mbG9vcihudW1iZXIgLyAxMDAwKTtcbiAgfVxuXG4gIHJldHVybiB0aG91c2FuZHM7XG59XG5cbi8vIHRyYW5zbGF0ZSBhIG51bWJlciBmcm9tIDEtOTk5IGludG8gRW5nbGlzaFxuZnVuY3Rpb24gaW5FbmdsaXNoKG51bWJlcikge1xuICB2YXIgdGhvdXNhbmRzLFxuICAgICAgaHVuZHJlZHMsXG4gICAgICB0ZW5zLFxuICAgICAgb25lcyxcbiAgICAgIHdvcmRzID0gW107XG5cbiAgaWYgKG51bWJlciA8IDIwKSB7XG4gICAgcmV0dXJuIE9ORV9UT19OSU5FVEVFTltudW1iZXIgLSAxXTsgLy8gbWF5IGJlIHVuZGVmaW5lZFxuICB9XG5cbiAgaWYgKG51bWJlciA8IDEwMCkge1xuICAgIG9uZXMgPSBudW1iZXIgJSAxMDtcbiAgICB0ZW5zID0gbnVtYmVyIC8gMTAgfCAwOyAvLyBlcXVpdmFsZW50IHRvIE1hdGguZmxvb3IobnVtYmVyIC8gMTApXG5cbiAgICB3b3Jkcy5wdXNoKFRFTlNbdGVucyAtIDFdKTtcbiAgICB3b3Jkcy5wdXNoKGluRW5nbGlzaChvbmVzKSk7XG5cbiAgICByZXR1cm4gd29yZHMuZmlsdGVyKGlzVHJ1dGh5KS5qb2luKCctJyk7XG4gIH1cblxuICBodW5kcmVkcyA9IG51bWJlciAvIDEwMCB8IDA7XG4gIHdvcmRzLnB1c2goaW5FbmdsaXNoKGh1bmRyZWRzKSk7XG4gIHdvcmRzLnB1c2goJ2h1bmRyZWQnKTtcbiAgd29yZHMucHVzaChpbkVuZ2xpc2gobnVtYmVyICUgMTAwKSk7XG5cbiAgcmV0dXJuIHdvcmRzLmZpbHRlcihpc1RydXRoeSkuam9pbignICcpO1xufVxuXG4vLyBhcHBlbmQgdGhlIHdvcmQgZm9yIGEgc2NhbGUuIE1hZGUgZm9yIHVzZSB3aXRoIEFycmF5Lm1hcFxuZnVuY3Rpb24gYXBwZW5kU2NhbGUoY2h1bmssIGV4cCkge1xuICB2YXIgc2NhbGU7XG4gIGlmICghY2h1bmspIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBzY2FsZSA9IFNDQUxFU1tleHAgLSAxXTtcbiAgcmV0dXJuIFtjaHVuaywgc2NhbGVdLmZpbHRlcihpc1RydXRoeSkuam9pbignICcpO1xufVxuXG4vKipcbiAqID09PT09PT09PT09PT09PVxuICogRW5kIGNvcHlcbiAqL1xuXG4vKipcbiAqIE1vZGlmaWNhdGlvbiAtIGRlY29yYXRvclxuICovXG52YXIgTlVNQkVSX1RPX1BPU0lUSU9OX1RFWFRfTUFQID0ge1xuICAnb25lJzogJ2ZpcnN0JyxcbiAgJ3R3byc6ICdzZWNvbmQnLFxuICAndGhyZWUnOiAndGhpcmQnLFxuICAnZm91cic6ICdmb3VydGgnLFxuICAnZml2ZSc6ICdmaWZ0aCcsXG4gICdzaXgnOiAnc2l4dGgnLFxuICAnc2V2ZW4nOiAnc2V2ZW50aCcsXG4gICdlaWdodCc6ICdlaWdodGgnLFxuICAnbmluZSc6ICduaW50aCcsXG4gICd0ZW4nOiAndGVudGgnLFxuICAnZWxldmVuJzogJ2VsZXZlbnRoJyxcbiAgJ3R3ZWx2ZSc6ICd0d2VsZnRoJyxcbiAgJ3RoaXJ0ZWVuJzogJ3RoaXJ0ZWVudGgnLFxuICAnZm91cnRlZW4nOiAnZm91cnRlZW50aCcsXG4gICdmaWZ0ZWVuJzogJ2ZpZnRlZW50aCcsXG4gICdzaXh0ZWVuJzogJ3NpeHRlZW50aCcsXG4gICdzZXZlbnRlZW4nOiAnc2V2ZW50ZWVudGgnLFxuICAnZWlnaHRlZW4nOiAnZWlnaHRlZW50aCcsXG4gICduaW5ldGVlbic6ICduaW5ldGVlbnRoJyxcblxuICAndHdlbnR5JzogJ3R3ZW50aWV0aCcsXG4gICd0aGlydHknOiAndGhpcnRpZXRoJyxcbiAgJ2ZvcnR5JzogJ2ZvcnRpZXRoJyxcbiAgJ2ZpZnR5JzogJ2ZpZnRpZXRoJyxcbiAgJ3NpeHR5JzogJ3NpeHRpZXRoJyxcbiAgJ3NldmVudHknOiAnc2V2ZW50aWV0aCcsXG4gICdlaWdodHknOiAnZWlnaHRpZXRoJyxcbiAgJ25pbmV0eSc6ICduaW5ldGlldGgnLFxuICAnaHVuZHJlZCc6ICdodW5kcmVkdGgnLFxuXG4gICd0aG91c2FuZCc6ICd0aG91c2FuZHRoJyxcbiAgJ21pbGxpb24nOiAnbWlsbGlvbnRoJyxcbiAgJ2JpbGxpb24nOiAnYmlsbGlvbnRoJyxcbiAgJ3RyaWxsaW9uJzogJ3RyaWxsaW9udGgnXG59O1xuXG5mdW5jdGlvbiBudW1iZXJUb1Bvc2l0aW9uV29yZChudW0pIHtcbiAgdmFyIHN0ciA9IGNodW5rKG51bSkubWFwKGluRW5nbGlzaCkubWFwKGFwcGVuZFNjYWxlKS5maWx0ZXIoaXNUcnV0aHkpLnJldmVyc2UoKS5qb2luKCcgJyk7XG5cbiAgdmFyIHN1YiA9IHN0ci5zcGxpdCgnICcpLFxuICAgICAgbGFzdFdvcmREYXNoU3BsaXRBcnIgPSBzdWJbc3ViLmxlbmd0aCAtIDFdLnNwbGl0KCctJyksXG4gICAgICBsYXN0V29yZCA9IGxhc3RXb3JkRGFzaFNwbGl0QXJyW2xhc3RXb3JkRGFzaFNwbGl0QXJyLmxlbmd0aCAtIDFdLFxuICAgICAgbmV3TGFzdFdvcmQgPSAobGFzdFdvcmREYXNoU3BsaXRBcnIubGVuZ3RoID4gMSA/IGxhc3RXb3JkRGFzaFNwbGl0QXJyWzBdICsgJy0nIDogJycpICsgTlVNQkVSX1RPX1BPU0lUSU9OX1RFWFRfTUFQW2xhc3RXb3JkXTtcblxuICAvKmNvbnNvbGUubG9nKCdzdHI6Jywgc3RyKTtcbiAgY29uc29sZS5sb2coJ3N1YjonLCBzdWIpO1xuICBjb25zb2xlLmxvZygnbGFzdFdvcmREYXNoU3BsaXRBcnI6JywgbGFzdFdvcmREYXNoU3BsaXRBcnIpO1xuICBjb25zb2xlLmxvZygnbGFzdFdvcmQ6JywgbGFzdFdvcmQpO1xuICBjb25zb2xlLmxvZygnbmV3TGFzdFdvcmQ6JywgbmV3TGFzdFdvcmQpOyovXG5cbiAgdmFyIHN1YkNvcHkgPSBbXS5jb25jYXQoc3ViKTtcbiAgc3ViQ29weS5wb3AoKTtcbiAgdmFyIHByZWZpeCA9IHN1YkNvcHkuam9pbignICcpO1xuICB2YXIgcmVzdWx0ID0gKHByZWZpeCA/IHByZWZpeCArICcgJyA6ICcnKSArIG5ld0xhc3RXb3JkO1xuXG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCAocHJlZml4ID8gcHJlZml4ICsgJyAnIDogJycpICsgbmV3TGFzdFdvcmQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBudW1iZXJUb1dvcmRzU3R5bGVndWlkZShudW1iZXIpIHtcbiAgaWYgKG51bWJlciA+IDkpIHtcbiAgICByZXR1cm4gbnVtYmVyO1xuICB9XG5cbiAgcmV0dXJuIE9ORV9UT19OSU5FVEVFTltudW1iZXIgLSAxXTtcbn1cblxuZnVuY3Rpb24gdG9vbHMoKSB7XG5cbiAgdmFyICRsaXN0TGlua3MgPSAkKCcudGVzdC1kYXRhLWxpbmtzJyksXG4gICAgICAkY2xlYXJEYXRhID0gJCgnPGxpPjxhIGhyZWY9XCIjXCIgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NsZWFyIGFsbCBkYXRhPC9hPjwvbGk+JyksXG4gICAgICAkY3JlYXRlRmFtaWx5SG91c2Vob2xkID0gJCgnPGxpPjxhIGhyZWY9XCIjXCIgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgaG91c2Vob2xkPC9hPjwvbGk+JyksXG4gICAgICAkY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcyA9ICQoJzxsaT48YSBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzPC9hPjwvbGk+JyksXG4gICAgICAkY3JlYXRlRmFtaWx5V2l0aFJlbGF0aW9uc2hpcHNBbmRWaXNpdG9ycyA9ICQoJzxsaT48YSBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzIGFuZCB2aXNpdG9yczwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzUGVyc29uYWxEZXRhaWxzQW5kVmlzaXRvcnMgPSAkKCc8bGk+PGEnICsgJyBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzLCBqdXN0IGZhbWlseSBpbmRpdmlkdWFsIHJlc3BvbnNlcyBhbmQnICsgJyB2aXNpdG9yczwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzUGVyc29uYWxEZXRhaWxzQW5kVmlzaXRvcnNQZXJzb25hbERldGFpbHMgPSAkKCc8bGk+PGEnICsgJyBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzLCBmYW1pbHkgaW5kaXZpZHVhbCByZXNwb25zZXMgYW5kJyArICcgdmlzaXRvcnMgaW5kaXZpZHVhbCByZXNwb25zZXM8L2E+PC9saT4nKSxcbiAgICAgIGZhbWlseUhvdXNlaG9sZE1lbWJlcnNEYXRhID0gW3tcbiAgICAndHlwZSc6ICdob3VzZWhvbGQtbWVtYmVyJyxcbiAgICAnQHBlcnNvbic6IHtcbiAgICAgICdmdWxsTmFtZSc6ICdEYXZlICBKb25lcycsXG4gICAgICAnZmlyc3ROYW1lJzogJ0RhdmUnLFxuICAgICAgJ21pZGRsZU5hbWUnOiAnJyxcbiAgICAgICdsYXN0TmFtZSc6ICdKb25lcycsXG4gICAgICAnaWQnOiAncGVyc29uX21lJ1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ2hvdXNlaG9sZC1tZW1iZXInLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ1NhbGx5ICBKb25lcycsXG4gICAgICAnZmlyc3ROYW1lJzogJ1NhbGx5JyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbjEnXG4gICAgfVxuICB9LCB7XG4gICAgJ3R5cGUnOiAnaG91c2Vob2xkLW1lbWJlcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnUmViZWNjYSAgSm9uZXMnLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdSZWJlY2NhJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbjInXG4gICAgfVxuICB9LCB7XG4gICAgJ3R5cGUnOiAnaG91c2Vob2xkLW1lbWJlcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnQW15IEpvbmVzJyxcbiAgICAgICdmaXJzdE5hbWUnOiAnQW15JyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbjMnXG4gICAgfVxuICB9XSxcbiAgICAgIHZpc2l0b3JzTWVtYmVyRGF0YSA9IFt7XG4gICAgJ3R5cGUnOiAndmlzaXRvcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnR2FyZXRoIEpvaG5zb24nLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdHYXJldGgnLFxuICAgICAgJ21pZGRsZU5hbWUnOiAnJyxcbiAgICAgICdsYXN0TmFtZSc6ICdKb2huc29uJyxcbiAgICAgICdpZCc6ICdwZXJzb240J1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ3Zpc2l0b3InLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ0pvaG4gSGFtaWx0b24nLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdKb2huJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSGFtaWx0b24nLFxuICAgICAgJ2lkJzogJ3BlcnNvbjUnXG4gICAgfVxuICB9XSxcbiAgICAgIGZhbWlseUhvdXNlaG9sZFJlbGF0aW9uc2hpcHNEYXRhID0gW3tcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdodXNiYW5kLXdpZmUnLFxuICAgICdwZXJzb25Jc0lkJzogJ3BlcnNvbjEnLFxuICAgICdwZXJzb25Ub0lkJzogJ3BlcnNvbl9tZScsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogMVxuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnc29uLWRhdWdodGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24yJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb25fbWUnLFxuICAgICdpbmZlcnJlZCc6IGZhbHNlLFxuICAgICdpZCc6IDJcbiAgfSwge1xuICAgICdwZXJzb25Jc0Rlc2NyaXB0aW9uJzogJ21vdGhlci1mYXRoZXInLFxuICAgICdwZXJzb25Jc0lkJzogJ3BlcnNvbl9tZScsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMycsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogM1xuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnc29uLWRhdWdodGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24yJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb24xJyxcbiAgICAnaW5mZXJyZWQnOiBmYWxzZSxcbiAgICAnaWQnOiA0XG4gIH0sIHtcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdtb3RoZXItZmF0aGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24xJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb24zJyxcbiAgICAnaW5mZXJyZWQnOiBmYWxzZSxcbiAgICAnaWQnOiA1XG4gIH0sIHtcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdicm90aGVyLXNpc3RlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMycsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMicsXG4gICAgJ2luZmVycmVkJzogdHJ1ZSxcbiAgICAnaW5mZXJyZWRCeSc6IFszLCA1LCAyLCA0XSxcbiAgICAnaWQnOiA2XG4gIH1dLFxuICAgICAgZmFtaWx5UGVyc29uYWxEZXRhaWxzID0ge1xuICAgICdwZXJzb25fbWUnOiB7XG4gICAgICAnZG9iJzoge1xuICAgICAgICAnZGF5JzogJzE3JyxcbiAgICAgICAgJ21vbnRoJzogJzQnLFxuICAgICAgICAneWVhcic6ICcxOTY3J1xuICAgICAgfSxcbiAgICAgICdtYXJpdGFsU3RhdHVzJzogJ21hcnJpZWQnLFxuICAgICAgJ2NvdW50cnknOiAnd2FsZXMnLFxuICAgICAgJ29yaWVudGF0aW9uJzogJ3N0cmFpZ2h0JyxcbiAgICAgICdzYWxhcnknOiAnNDAwMDAnXG4gICAgfSxcbiAgICAncGVyc29uMSc6IHtcbiAgICAgICdkb2InOiB7ICdkYXknOiAnMDInLCAnbW9udGgnOiAnMTAnLCAneWVhcic6ICcxOTY1JyB9LFxuICAgICAgJ21hcml0YWxTdGF0dXMnOiAnbWFycmllZCcsXG4gICAgICAnY291bnRyeSc6ICd3YWxlcycsXG4gICAgICAnb3JpZW50YXRpb24nOiAnc3RyYWlnaHQnLFxuICAgICAgJ3NhbGFyeSc6ICc0MDAwMCdcbiAgICB9LFxuICAgICdwZXJzb24yJzoge1xuICAgICAgJ2RvYic6IHsgJ2RheSc6ICcyMCcsICdtb250aCc6ICc1JywgJ3llYXInOiAnMTk4MScgfSxcbiAgICAgICdtYXJpdGFsU3RhdHVzJzogJ25ldmVyJyxcbiAgICAgICdjb3VudHJ5JzogJ3dhbGVzJyxcbiAgICAgICdvcmllbnRhdGlvbic6ICdzdHJhaWdodCcsXG4gICAgICAnc2FsYXJ5JzogJzIwMDAwJ1xuICAgIH0sXG4gICAgJ3BlcnNvbjMnOiB7XG4gICAgICAnZG9iJzogeyAnZGF5JzogJzExJywgJ21vbnRoJzogJzcnLCAneWVhcic6ICcxOTg0JyB9LFxuICAgICAgJ21hcml0YWxTdGF0dXMnOiAnbmV2ZXInLFxuICAgICAgJ2NvdW50cnknOiAnd2FsZXMnLFxuICAgICAgJ29yaWVudGF0aW9uJzogJ3N0cmFpZ2h0JyxcbiAgICAgICdzYWxhcnknOiAnMjAwMDAnXG4gICAgfVxuICB9LFxuICAgICAgdmlzaXRvcnNQZXJzb25hbERldGFpbHMgPSB7XG4gICAgJ3BlcnNvbjQnOiB7XG4gICAgICAnc2V4JzogJ21hbGUnLFxuICAgICAgJ2RvYic6IHsgJ2RheSc6ICcyMCcsICdtb250aCc6ICc3JywgJ3llYXInOiAnMTk5MCcgfSxcbiAgICAgICdhZGRyZXNzLXdoZXJlJzogJ2luLXVrJyxcbiAgICAgICdhZGRyZXNzJzoge1xuICAgICAgICAnYWRkcmVzcy1saW5lLTEnOiAnMTUnLFxuICAgICAgICAnYWRkcmVzcy1saW5lLTInOiAnU29tZXdoZXJlIG5lYXInLFxuICAgICAgICAndG93bi1jaXR5JzogJ0xsYW5kcmlkbm9kJyxcbiAgICAgICAgJ2NvdW50eSc6ICdQb3d5cycsXG4gICAgICAgICdwb3N0Y29kZSc6ICdMTDM0IEFONSdcbiAgICAgIH1cbiAgICB9LFxuICAgICdwZXJzb241Jzoge1xuICAgICAgJ3NleCc6ICdtYWxlJyxcbiAgICAgICdkb2InOiB7ICdkYXknOiAnMDInLCAnbW9udGgnOiAnNScsICd5ZWFyJzogJzE5OTEnIH0sXG4gICAgICAnYWRkcmVzcy13aGVyZSc6ICdvdXQtdWsnLFxuICAgICAgJ2FkZHJlc3MnOiB7XG4gICAgICAgICdhZGRyZXNzLWxpbmUtMSc6ICc5NCcsXG4gICAgICAgICdhZGRyZXNzLWxpbmUtMic6ICdTb21ld2hlcmUgRmFyJyxcbiAgICAgICAgJ3Rvd24tY2l0eSc6ICdTcHJpbmdmaWVsZCcsXG4gICAgICAgICdjb3VudHknOiAnTmV3IFlvcmsnLFxuICAgICAgICAncG9zdGNvZGUnOiAnTlkxMEEnXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAgICAgdXNlckRhdGEgPSB7XG4gICAgJ2Z1bGxOYW1lJzogJ0RhdmUgIEpvbmVzJyxcbiAgICAnZmlyc3ROYW1lJzogJ0RhdmUnLFxuICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgJ2xhc3ROYW1lJzogJ0pvbmVzJ1xuICB9O1xuXG4gICRjcmVhdGVGYW1pbHlIb3VzZWhvbGQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xlYXJTdG9yYWdlKCk7XG4gICAgcHJlcmVxdWlzaXRlcygpO1xuICAgIGNyZWF0ZUZhbWlseUhvdXNlaG9sZCgpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL3N1bW1hcnknO1xuICB9KTtcblxuICAkY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICBwcmVyZXF1aXNpdGVzKCk7XG4gICAgY3JlYXRlRmFtaWx5SG91c2Vob2xkKCk7XG4gICAgY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL2h1Yic7XG4gIH0pO1xuXG4gICRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc0FuZFZpc2l0b3JzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsZWFyU3RvcmFnZSgpO1xuICAgIHByZXJlcXVpc2l0ZXMoKTtcbiAgICBjcmVhdGVGYW1pbHlIb3VzZWhvbGRXaXRoVmlzaXRvcnMoKTtcbiAgICBjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vaHViJztcbiAgfSk7XG5cbiAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzUGVyc29uYWxEZXRhaWxzQW5kVmlzaXRvcnMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xlYXJTdG9yYWdlKCk7XG4gICAgcHJlcmVxdWlzaXRlcygpO1xuICAgIGNyZWF0ZUZhbWlseUhvdXNlaG9sZFdpdGhWaXNpdG9ycygpO1xuICAgIGNyZWF0ZUZhbWlseVJlbGF0aW9uc2hpcHMoKTtcbiAgICBjcmVhdGVGYW1pbHlQZXJzb25hbERldGFpbHMoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi9odWInO1xuICB9KTtcblxuICAkY3JlYXRlRmFtaWx5V2l0aFJlbGF0aW9uc2hpcHNQZXJzb25hbERldGFpbHNBbmRWaXNpdG9yc1BlcnNvbmFsRGV0YWlscy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICBwcmVyZXF1aXNpdGVzKCk7XG4gICAgY3JlYXRlRmFtaWx5SG91c2Vob2xkV2l0aFZpc2l0b3JzKCk7XG4gICAgY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpO1xuICAgIGNyZWF0ZUZhbWlseVZpc2l0b3JzUGVyc29uYWxEZXRhaWxzKCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vaHViJztcbiAgfSk7XG5cbiAgJGNsZWFyRGF0YS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi90ZXN0LWFkZHJlc3MnO1xuICB9KTtcblxuICBmdW5jdGlvbiBwcmVyZXF1aXNpdGVzKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2FkZHJlc3MnLCAnMTIgU29tZXdoZXJlIENsb3NlLCBOZXdwb3J0LCBDRjEyIDNBQicpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2FkZHJlc3MtbGluZS0xJywgJzEyJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYWRkcmVzcy1saW5lLTInLCAnU29tZXdoZXJlIGNsb3NlJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY291bnR5JywgJ05ld3BvcnQnKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdsaXZlcy1oZXJlJywgJ3llcycpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3Bvc3Rjb2RlJywgJ0NGMTIgM0FCJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgndG93bi1jaXR5JywgJ05ld3BvcnQnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUZhbWlseUhvdXNlaG9sZCgpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCd1c2VyLWRldGFpbHMnLCBKU09OLnN0cmluZ2lmeSh1c2VyRGF0YSkpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0od2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGZhbWlseUhvdXNlaG9sZE1lbWJlcnNEYXRhKSk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnaG91c2Vob2xkLW1lbWJlcnMtaW5jcmVtZW50JywgSlNPTi5zdHJpbmdpZnkoNCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5SG91c2Vob2xkV2l0aFZpc2l0b3JzKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0od2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KFtdLmNvbmNhdChmYW1pbHlIb3VzZWhvbGRNZW1iZXJzRGF0YSwgdmlzaXRvcnNNZW1iZXJEYXRhKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGZhbWlseUhvdXNlaG9sZFJlbGF0aW9uc2hpcHNEYXRhKSk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgncmVsYXRpb25zaGlwcy1pbmNyZW1lbnQnLCBKU09OLnN0cmluZ2lmeSg2KSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGYW1pbHlQZXJzb25hbERldGFpbHMoKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5QRVJTT05BTF9ERVRBSUxTX0tFWSwgSlNPTi5zdHJpbmdpZnkoZmFtaWx5UGVyc29uYWxEZXRhaWxzKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGYW1pbHlWaXNpdG9yc1BlcnNvbmFsRGV0YWlscygpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlBFUlNPTkFMX0RFVEFJTFNfS0VZLCBKU09OLnN0cmluZ2lmeShfZXh0ZW5kcyh7fSwgZmFtaWx5UGVyc29uYWxEZXRhaWxzLCB2aXNpdG9yc1BlcnNvbmFsRGV0YWlscykpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyU3RvcmFnZSgpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5jbGVhcigpO1xuICB9XG5cbiAgJGxpc3RMaW5rcy5hcHBlbmQoJGNsZWFyRGF0YSk7XG59XG5cbi8qKlxuICogTGlicmFyaWVzXG4gKi9cbi8qKlxuICogRE9NIG1vZHVsZXNcbiAqL1xudmFyIFVTRVJfU1RPUkFHRV9LRVkgPSAndXNlci1kZXRhaWxzJztcbnZhciBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZID0gJ3Byb3h5LXBlcnNvbic7XG5cbmZ1bmN0aW9uIGdldEFkZHJlc3MoKSB7XG4gIHZhciBhZGRyZXNzTGluZXMgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhZGRyZXNzJykuc3BsaXQoJywnKTtcblxuICByZXR1cm4ge1xuICAgIGFkZHJlc3NMaW5lMTogYWRkcmVzc0xpbmVzWzBdLFxuICAgIGFkZHJlc3NMaW5lMjogYWRkcmVzc0xpbmVzWzFdLFxuICAgIGFkZHJlc3NMaW5lMzogYWRkcmVzc0xpbmVzWzJdLFxuICAgIGFkZHJlc3NDb3VudHk6IGFkZHJlc3NMaW5lc1s0XSxcbiAgICBhZGRyZXNzVG93bkNpdHk6IGFkZHJlc3NMaW5lc1szXSxcbiAgICBhZGRyZXNzUG9zdGNvZGU6IGFkZHJlc3NMaW5lc1s1XVxuICB9O1xufVxuXG4vKipcbiAqIFVzZXJcbiAqL1xuZnVuY3Rpb24gYWRkVXNlclBlcnNvbihwZXJzb24kJDEpIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShwZXJzb24kJDEpKTtcbn1cblxuZnVuY3Rpb24gZ2V0VXNlclBlcnNvbigpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZKSk7XG59XG5cbi8qKlxuICogSGVscGVyc1xuICovXG5mdW5jdGlvbiBjcmVhdGVOYXZJdGVtKG1lbWJlcikge1xuICB2YXIgJG5vZGVFbCA9ICQoJzxsaSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtIG5hdl9faXRlbSBwbHV0b1wiPicgKyAnICA8YSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtLWxhYmVsIG5hdl9fbGlua1wiIGhyZWY9XCIjXCI+PC9hPicgKyAnPC9saT4nKSxcbiAgICAgICRsaW5rRWwgPSAkbm9kZUVsLmZpbmQoJy5qcy10ZW1wbGF0ZS1uYXYtaXRlbS1sYWJlbCcpO1xuXG4gICRsaW5rRWwuaHRtbChtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSk7XG5cbiAgaWYgKG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hhdC1pcy15b3VyLW5hbWUnKTtcbiAgfSBlbHNlIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hvLWVsc2UtdG8tYWRkP2VkaXQ9JyArIG1lbWJlclsnQHBlcnNvbiddLmlkKTtcbiAgfVxuXG4gIHJldHVybiAkbm9kZUVsO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRWaXNpdG9yc05hdmlnYXRpb25JdGVtcygpIHtcbiAgdmFyIGFsbEhvdXNlaG9sZE1lbWJlcnMgPSB3aW5kb3cuT05TLnN0b3JhZ2UuZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLFxuICAgICAgaG91c2Vob2xkTWVtYmVycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc0hvdXNlaG9sZE1lbWJlciksXG4gICAgICB2aXNpdG9ycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc1Zpc2l0b3IpO1xuXG4gIHZhciAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbCA9ICQoJyNuYXZpZ2F0aW9uLWhvdXNlaG9sZC1tZW1iZXJzJyksXG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwgPSAkKCcjbmF2aWdhdGlvbi12aXNpdG9ycycpO1xuXG4gIGlmIChob3VzZWhvbGRNZW1iZXJzLmxlbmd0aCkge1xuICAgICQuZWFjaChob3VzZWhvbGRNZW1iZXJzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5hcHBlbmQoY3JlYXRlTmF2SXRlbShtZW1iZXIpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5wYXJlbnQoKS5oaWRlKCk7XG4gIH1cblxuICBpZiAodmlzaXRvcnMubGVuZ3RoKSB7XG4gICAgJC5lYWNoKHZpc2l0b3JzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwuYXBwZW5kKGNyZWF0ZU5hdkl0ZW0obWVtYmVyKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsLnBhcmVudCgpLmhpZGUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVMaXN0SXRlbVBlcnNvbihtZW1iZXIpIHtcbiAgcmV0dXJuICQoJzxsaSBjbGFzcz1cImxpc3RfX2l0ZW1cIj4nKS5hZGRDbGFzcygnbWFycycpLmh0bWwoJzxzcGFuIGNsYXNzPVwibGlzdF9faXRlbS1uYW1lXCI+JyArIG1lbWJlclsnQHBlcnNvbiddLmZ1bGxOYW1lICsgKG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPyAnIChZb3UpJyA6ICcnKSArICc8L3NwYW4+Jyk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlTGlzdCgkZWwsIG1lbWJlclR5cGUpIHtcbiAgaWYgKCEkZWwubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkgfHwgW107XG5cbiAgJGVsLmVtcHR5KCkuYXBwZW5kKG1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IG1lbWJlclR5cGU7XG4gIH0pLm1hcChjcmVhdGVMaXN0SXRlbVBlcnNvbikpO1xuXG4gICRlbC5hZGRDbGFzcygnbGlzdCBsaXN0LS1wZW9wbGUtcGxhaW4nKTtcbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVIb3VzZWhvbGRMaXN0KCkge1xuICBwb3B1bGF0ZUxpc3QoJCgnI2hvdXNlaG9sZC1tZW1iZXJzJyksIEhPVVNFSE9MRF9NRU1CRVJfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlVmlzaXRvckxpc3QoKSB7XG4gIHBvcHVsYXRlTGlzdCgkKCcjdmlzaXRvcnMtbGlzdCcpLCBWSVNJVE9SX1RZUEUpO1xufVxuXG5mdW5jdGlvbiBjbGVhbkhUTUxQbGFjZWhvbGRlclN0cmluZ1JlcGxhY21lbnQoZWwsIHZhbCkge1xuICB2YXIgJGVsID0gJChlbCksXG4gICAgICAkcGFyZW50ID0gJGVsLnBhcmVudCgpO1xuXG4gICRlbC5iZWZvcmUodmFsKTtcbiAgJGVsLnJlbW92ZSgpO1xuXG4gICRwYXJlbnQuaHRtbCgkcGFyZW50Lmh0bWwoKS5yZXBsYWNlKC9bXFxzXSsvZywgJyAnKS50cmltKCkpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBZGRyZXNzZXMoKSB7XG4gIHZhciBhZGRyZXNzTGluZXMgPSAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYWRkcmVzcycpIHx8ICcnKS5zcGxpdCgnLCcpLFxuICAgICAgYWRkcmVzc0xpbmUxID0gYWRkcmVzc0xpbmVzWzBdLFxuICAgICAgYWRkcmVzc0xpbmUyID0gYWRkcmVzc0xpbmVzWzFdO1xuXG4gICQoJy5hZGRyZXNzLXRleHQnKS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgIHJldHVybiBjbGVhbkhUTUxQbGFjZWhvbGRlclN0cmluZ1JlcGxhY21lbnQoZWwsIGFkZHJlc3NMaW5lMSAmJiBhZGRyZXNzTGluZTIgPyBhZGRyZXNzTGluZTEgKyAoYWRkcmVzc0xpbmUyID8gJywgJyArIGFkZHJlc3NMaW5lMiA6ICcnKSA6ICc8YSBocmVmPVwiLi4vdGVzdC1hZGRyZXNzXCI+QWRkcmVzcyBub3QgZm91bmQ8L2E+Jyk7XG4gIH0pO1xuXG4gICQoJy5hZGRyZXNzLXRleHQtbGluZTEnKS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgIHJldHVybiBjbGVhbkhUTUxQbGFjZWhvbGRlclN0cmluZ1JlcGxhY21lbnQoZWwsIGFkZHJlc3NMaW5lMSk7XG4gIH0pO1xuXG4gIHZhciBwZXJzb25JZCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCkuZ2V0KCdwZXJzb24nKTtcblxuICBpZiAocGVyc29uSWQpIHtcbiAgICB2YXIgX3BlcnNvbiA9IGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQocGVyc29uSWQpWydAcGVyc29uJ10sXG4gICAgICAgICRzZWN0aW9uSW5kaXZpZHVhbEVsID0gJCgnI3NlY3Rpb24taW5kaXZpZHVhbCcpLFxuICAgICAgICAkbmFtZUVsID0gJCgnLmpzLXBlcnNvbi1mdWxsbmFtZS1mcm9tLXVybC1pZCcpO1xuXG4gICAgJHNlY3Rpb25JbmRpdmlkdWFsRWwubGVuZ3RoICYmIGNsZWFuSFRNTFBsYWNlaG9sZGVyU3RyaW5nUmVwbGFjbWVudCgkc2VjdGlvbkluZGl2aWR1YWxFbCwgX3BlcnNvbi5mdWxsTmFtZSk7XG4gICAgJG5hbWVFbC5sZW5ndGggJiYgY2xlYW5IVE1MUGxhY2Vob2xkZXJTdHJpbmdSZXBsYWNtZW50KCRuYW1lRWwsIF9wZXJzb24uZnVsbE5hbWUpO1xuICB9XG59XG5cbnZhciBzZWN1cmVMaW5rVGV4dE1hcCA9IHtcbiAgJ3F1ZXN0aW9uLXlvdSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1dhbnQgdG8ga2VlcCB5b3VyIGFuc3dlcnMgc2VjdXJlIGZyb20gb3RoZXIgcGVvcGxlIGF0IHRoaXMnICsgJyBhZGRyZXNzPycsXG4gICAgbGlua1RleHQ6ICdHZXQgYSBzZXBhcmF0ZSBhY2Nlc3MgY29kZSB0byBzdWJtaXQgYW4gaW5kaXZpZHVhbCByZXNwb25zZScsXG4gICAgbGluazogJy4uL2luZGl2aWR1YWwtZGVjaXNpb24tc2VjdXJlJ1xuICB9LFxuICAncGluLXlvdSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1lvdVxcJ3ZlIGNob3NlbiB0byBrZWVwIHlvdXIgYW5zd2VycyBzZWN1cmUnLFxuICAgIGxpbmtUZXh0OiAnQ2FuY2VsIHRoaXMgYW5kIG1ha2UgYW5zd2VycyBhdmFpbGFibGUgdG8gdGhlIHJlc3Qgb2YgdGhlJyArICcgaG91c2Vob2xkJyxcbiAgICBsaW5rOiAnLi4vaW5kaXZpZHVhbC1kZWNpc2lvbi1zZWN1cmUnXG4gIH0sXG4gICdxdWVzdGlvbi1wcm94eSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05vdCBoYXBweSB0byBjb250aW51ZSBhbnN3ZXJpbmcgZm9yICRbTkFNRV0/JyxcbiAgICBsaW5rVGV4dDogJ1JlcXVlc3QgYW4gaW5kaXZpZHVhbCBhY2Nlc3MgY29kZSB0byBiZSBzZW50IHRvIHRoZW0nLFxuICAgIGxpbms6ICcuLi9pbmRpdmlkdWFsLWRlY2lzaW9uLW90aGVyLXNlY3VyZSdcbiAgfVxufTtcblxuZnVuY3Rpb24gdXBkYXRlQWxsUHJldmlvdXNMaW5rcygpIHtcbiAgJCgnLmpzLXByZXZpb3VzLWxpbmsnKS5hdHRyKCdocmVmJywgZG9jdW1lbnQucmVmZXJyZXIpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQZXJzb25MaW5rKCkge1xuICB2YXIgcGVyc29uSWQgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldCgncGVyc29uJyk7XG5cbiAgaWYgKHBlcnNvbklkKSB7XG4gICAgdmFyIHVybFBhcmFtID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSxcbiAgICAgICAgX3BlcnNvbjIgPSBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKHBlcnNvbklkKVsnQHBlcnNvbiddLFxuICAgICAgICBwaW5PYmogPSBnZXRQaW5Gb3IocGVyc29uSWQpLFxuICAgICAgICBzZWN1cmVMaW5rVGV4dENvbmZpZyA9IHNlY3VyZUxpbmtUZXh0TWFwW2dldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KCkgPyAncXVlc3Rpb24tcHJveHknIDogcGluT2JqICYmIHBpbk9iai5waW4gPyAncGluLXlvdScgOiAncXVlc3Rpb24teW91J10sXG4gICAgICAgIGxpbmtIcmVmID0gc2VjdXJlTGlua1RleHRDb25maWcubGluayArICc/cGVyc29uPScgKyBwZXJzb25JZCArICcmcmV0dXJudXJsPScgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICAgIHN1cnZleVR5cGUgPSB1cmxQYXJhbS5nZXQoJ3N1cnZleScpO1xuXG4gICAgbGlua0hyZWYgKz0gc3VydmV5VHlwZSA/ICcmc3VydmV5PScgKyBzdXJ2ZXlUeXBlIDogJyc7XG5cbiAgICB2YXIgJHNlY3VyZUxpbmsgPSAkKCcuanMtbGluay1zZWN1cmUnKTtcbiAgICAkc2VjdXJlTGluay5hdHRyKCdocmVmJywgbGlua0hyZWYpO1xuXG4gICAgJHNlY3VyZUxpbmsuaHRtbChzZWN1cmVMaW5rVGV4dENvbmZpZy5saW5rVGV4dCk7XG4gICAgJCgnLmpzLWxpbmstc2VjdXJlLWxhYmVsJykuaHRtbChzZWN1cmVMaW5rVGV4dENvbmZpZy5kZXNjcmlwdGlvbi5yZXBsYWNlKCckW05BTUVdJywgX3BlcnNvbjIuZnVsbE5hbWUpKTtcblxuICAgIHZhciBwZXJzb25MaW5rID0gJCgnLmpzLWxpbmstcGVyc29uJyk7XG4gICAgcGVyc29uTGluay5hdHRyKCdocmVmJywgcGVyc29uTGluay5hdHRyKCdocmVmJykgKyAnP3BlcnNvbj0nICsgcGVyc29uSWQgKyAoc3VydmV5VHlwZSA/ICcmc3VydmV5PScgKyBzdXJ2ZXlUeXBlIDogJycpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVCeVN1cnZleVR5cGUoKSB7XG4gIHZhciB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLFxuICAgICAgc3VydmV5VHlwZSA9IHVybFBhcmFtcy5nZXQoJ3N1cnZleScpO1xuXG4gIGlmIChzdXJ2ZXlUeXBlKSB7XG4gICAgJCgnLmpzLWhlYWRlci10aXRsZScpLmh0bWwoc3VydmV5VHlwZUNvbmZpZ1tzdXJ2ZXlUeXBlXS50aXRsZSk7XG4gICAgJCgnI3Blb3BsZS1saXZpbmctaGVyZScpLmh0bWwoc3VydmV5VHlwZUNvbmZpZ1tzdXJ2ZXlUeXBlXS5ob3VzZWhvbGRTZWN0aW9uVGl0bGUpO1xuICAgICQoJyNwZW9wbGUtbGl2aW5nLWhlcmUnKS5hdHRyKCdocmVmJywgc3VydmV5VHlwZUNvbmZpZ1tzdXJ2ZXlUeXBlXS5ob3VzZWhvbGRTZWN0aW9uTGluayk7XG4gICAgJCgnI3JlbGF0aW9uc2hpcHMtc2VjdGlvbicpLmF0dHIoJ2hyZWYnLCBzdXJ2ZXlUeXBlQ29uZmlnW3N1cnZleVR5cGVdLnJlbGF0aW9uc2hpcHNTZWN0aW9uKTtcbiAgICAkKCd0aXRsZScpLmh0bWwoc3VydmV5VHlwZUNvbmZpZ1tzdXJ2ZXlUeXBlXS50aXRsZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHkoYm9vbCkge1xuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKElORElWSURVQUxfUFJPWFlfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGJvb2wpKTtcbn1cblxuZnVuY3Rpb24gZ2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHkoKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSkpO1xufVxuXG5mdW5jdGlvbiB1bnNldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KCkge1xuICBnZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eSgpICE9PSBudWxsICYmIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSk7XG59XG5cbnZhciBzdXJ2ZXlUeXBlQ29uZmlnID0ge1xuICBsbXM6IHtcbiAgICB0aXRsZTogJ09ubGluZSBIb3VzZWhvbGQgU3R1ZHknLFxuICAgIGhvdXNlaG9sZFNlY3Rpb25UaXRsZTogJ0Fib3V0IHlvdXIgaG91c2Vob2xkJyxcbiAgICBob3VzZWhvbGRTZWN0aW9uTGluazogJy4uL3N1bW1hcnkvP3N1cnZleT1sbXMnLFxuICAgIHJlbGF0aW9uc2hpcHNTZWN0aW9uOiAnLi4vcmVsYXRpb25zaGlwcy8/c3VydmV5PWxtcydcbiAgfVxufTtcblxuZnVuY3Rpb24gZG9JTGl2ZUhlcmUoKSB7XG4gIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdsaXZlcy1oZXJlJykgPT09ICd5ZXMnO1xufVxuXG5mdW5jdGlvbiBnZXRTaWduaWZpY2FudCgpIHtcbiAgcmV0dXJuICczIEZlYnJ1YXJ5IDIwMTknO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTaWduaWZpY2FudERhdGUoKSB7XG4gICQoJy5qcy1zaWduaWZpY2FudC1kYXRlJykuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICByZXR1cm4gY2xlYW5IVE1MUGxhY2Vob2xkZXJTdHJpbmdSZXBsYWNtZW50KGVsLCBnZXRTaWduaWZpY2FudCgpKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBlcnNvblJlY29yZFRlbXBsYXRlKCkge1xuICByZXR1cm4gJCgnPGxpIGlkPVwicGVyc29uLXJlY29yZC10ZW1wbGF0ZVwiIGNsYXNzPVwibGlzdF9faXRlbVwiPlxcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJsaXN0X19pdGVtLW5hbWUganMtcGVyc29uLW5hbWVcIj48L3NwYW4+XFxuICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdF9faXRlbS1hY3Rpb25zIHUtZnJcIj5cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImxpc3RfX2l0ZW0tYWN0aW9uXCI+XFxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtcmVjb3JkLWVkaXRcIiBocmVmPVwiI1wiPkNoYW5nZTwvYT5cXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJqcy1zcGFjZXJcIj58PC9zcGFuPlxcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLXJlY29yZC1yZW1vdmVcIiBocmVmPVwiI1wiPlJlbW92ZTwvYT5cXG4gICAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9saT4nKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWVtYmVySXRlbShtZW1iZXIpIHtcbiAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHsgcmVkaXJlY3Q6IG51bGwgfSxcbiAgICAgIHJlZGlyZWN0ID0gX3JlZi5yZWRpcmVjdDtcblxuICB2YXIgJG5vZGVFbCA9IHBlcnNvblJlY29yZFRlbXBsYXRlKCksXG4gICAgICAkZWRpdExpbmsgPSAkbm9kZUVsLmZpbmQoJy5qcy1yZWNvcmQtZWRpdCcpLFxuICAgICAgJHJlbW92ZUxpbmsgPSAkbm9kZUVsLmZpbmQoJy5qcy1yZWNvcmQtcmVtb3ZlJyksXG4gICAgICAkc3BhY2VyID0gJG5vZGVFbC5maW5kKCcuanMtc3BhY2VyJyksXG4gICAgICB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLFxuICAgICAgcGVyc29uTmFtZVRleHQgPSBtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSxcbiAgICAgIG1lbWJlcklzVXNlciA9IGlzTWVtYmVyVXNlcihtZW1iZXIpLFxuICAgICAgc3VydmV5VHlwZSA9IHVybFBhcmFtcy5nZXQoJ3N1cnZleScpLFxuICAgICAgYWx0UGFnZSA9IHN1cnZleVR5cGUgJiYgc3VydmV5VHlwZSA9PT0gJ2xtcycgPyBzdXJ2ZXlUeXBlICsgJy8nIDogJycsXG4gICAgICByZWRpcmVjdFRvID0gcmVkaXJlY3QgPyAnJnJlZGlyZWN0PScgKyBlbmNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLmhyZWYpIDogJyc7XG5cbiAgaWYgKG1lbWJlcklzVXNlcikge1xuICAgIHBlcnNvbk5hbWVUZXh0ICs9ICcgKFlvdSknO1xuICAgICRlZGl0TGluay5odG1sKCdDaGFuZ2UnKTtcbiAgICAkcmVtb3ZlTGluay5oaWRlKCk7XG4gICAgJHNwYWNlci5oaWRlKCk7XG4gIH1cblxuICAkbm9kZUVsLmF0dHIoJ2lkJywgJycpO1xuICAkbm9kZUVsLmZpbmQoJy5qcy1wZXJzb24tbmFtZScpLmh0bWwocGVyc29uTmFtZVRleHQpO1xuXG4gICRlZGl0TGluay5hdHRyKCdocmVmJywgKG1lbWJlcklzVXNlciA/ICcuLi8nICsgYWx0UGFnZSArICd3aGF0LWlzLXlvdXItbmFtZS8/ZWRpdD10cnVlJyA6ICcuLi8nICsgYWx0UGFnZSArICd3aG8tZWxzZS10by1hZGQvP2VkaXQ9JyArIG1lbWJlclsnQHBlcnNvbiddLmlkICsgKGlzVmlzaXRvcihtZW1iZXIpID8gJyZqb3VybmV5PXZpc2l0b3JzJyA6ICcnKSkgKyByZWRpcmVjdFRvKTtcblxuICAkcmVtb3ZlTGluay5hdHRyKCdocmVmJywgJy4uL3JlbW92ZS1ob3VzZWhvbGQtbWVtYmVyLz9wZXJzb249JyArIG1lbWJlclsnQHBlcnNvbiddLmlkICsgcmVkaXJlY3RUbyk7XG5cbiAgcmV0dXJuICRub2RlRWw7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhvdXNlaG9sZFN1bW1hcnkoKSB7XG4gIHZhciBtZW1iZXJzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpO1xuXG4gICQoJy5qcy1ob3VzZWhvbGQtbWVtYmVycy1zdW1tYXJ5JykuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICB2YXIgJGVsID0gJChlbCk7XG5cbiAgICAkLmVhY2goW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KG1lbWJlcnMuZmlsdGVyKGlzTWVtYmVyVXNlcikpLCB0b0NvbnN1bWFibGVBcnJheShtZW1iZXJzLmZpbHRlcihpc090aGVySG91c2Vob2xkTWVtYmVyKSkpLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkZWwuYXBwZW5kKGNyZWF0ZU1lbWJlckl0ZW0obWVtYmVyLCB7IHJlZGlyZWN0OiAkZWwuYXR0cignZGF0YS1yZWRpcmVjdCcpIH0pKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVZpc2l0b3JzU3VtbWFyeSgpIHtcbiAgdmFyIG1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCk7XG5cbiAgJCgnLmpzLXZpc2l0b3JzLXN1bW1hcnknKS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgIHZhciAkZWwgPSAkKGVsKTtcblxuICAgICQuZWFjaChtZW1iZXJzLmZpbHRlcihpc1Zpc2l0b3IpLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkZWwuYXBwZW5kKGNyZWF0ZU1lbWJlckl0ZW0obWVtYmVyLCB7IHJlZGlyZWN0OiAkZWwuYXR0cignZGF0YS1yZWRpcmVjdCcpIH0pKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNvbnRpbnVlTm90aWNlKCkge1xuICB2YXIgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSxcbiAgICAgIGlzQ29udGludWluZyA9IHVybFBhcmFtcy5nZXQoJ2NvbnRpbnVpbmcnKSxcbiAgICAgIHBlcnNvbklkID0gdXJsUGFyYW1zLmdldCgncGVyc29uJyk7XG5cbiAgaWYgKCFpc0NvbnRpbnVpbmcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgdGVtcGxhdGUgPSAnPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLS1zaW1wbGUgcGFuZWwtLWluZm8gdS1tYi1zXCI+XFxuICAgICAgPGRpdiBjbGFzcz1cInBhbmVsX19ib2R5XCI+XFxuICAgICAgICAgIDxzdHJvbmc+VGhpcyB3YXMgdGhlIGxhc3QgcXVlc3Rpb25cXG4gICAgICAgICAgICAgIHlvdSBhbnN3ZXJlZCBpbiB0aGUgc2VjdGlvbjwvc3Ryb25nPlxcbiAgICAgICAgICA8cD5Zb3UgY2FuIHJldmlldyB5b3VyIGFuc3dlcnNcXG4gICAgICAgICAgICAgIGF0IHRoZSA8YSBocmVmPVwiLi4vaW5kaXZpZHVhbC1kZWNpc2lvbi8/cGVyc29uPScgKyBwZXJzb25JZCArICdcIj5zdGFydCBcXG4gICAgICAgICAgICAgIG9mIHRoaXMgc2VjdGlvbjwvYT5cXG4gICAgICAgICAgPC9wPlxcbiAgICAgIDwvZGl2PlxcbiAgPC9kaXY+JztcblxuICAkKCcuanMtaGVhZGluZycpLmNsb3Nlc3QoJy5xdWVzdGlvbicpLnByZXBlbmQodGVtcGxhdGUpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTYXZlQW5kQ29tcGxldGVMYXRlcigpIHtcbiAgJCgnLmNvbXBsZXRlLWxhdGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi9pbmRleC8/cmVkaXJlY3Q9Li4vaHViJztcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUZvb3J0TGlzdENvbCgpIHtcbiAgJCgnLmpzLWZvb3Rlci1saXN0LWNvbCcpLmFwcGVuZCgnPGxpPjxhIGhyZWY9XCIuLi90ZXN0LWRhdGFcIicgKyAnIGNsYXNzPVwiZm9vdGVyX19saW5rIGZvb3Rlcl9fbGluay0taW5saW5lIGdob3N0LWxpbmsgdS1mclwiPlRlc3QnICsgJyBkYXRhPC9hPjwvbGk+Jyk7XG59XG5cbmZ1bmN0aW9uIGlzTWVtYmVyVXNlcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSB3aW5kb3cuT05TLnN0b3JhZ2UuSURTLlVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDtcbn1cblxuZnVuY3Rpb24gc2Vzc2lvbkJvb2ttYXJrKCkge1xuICB2YXIgcGllY2VzID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsICdbZGVsaW1ldGVyXScpLnNwbGl0KCdbZGVsaW1ldGVyXScpO1xuXG4gIHBpZWNlcy5zaGlmdCgpO1xuXG4gIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL3Rlc3QtZGF0YS9nKSkge1xuICAgIGNvbnNvbGUubG9nKCdtYXRjaCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ19zZXNzaW9uX2Jvb2ttYXJrJywgW10uY29uY2F0KHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwgcGllY2VzKS5qb2luKCcnKSk7XG59XG5cbmZ1bmN0aW9uIGZpZWxkSXRlbURpc3BsYXlIYWNrKCkge1xuICAkKCcuZmllbGRfX2l0ZW0nKS5hZnRlcignPGJyIC8+Jyk7XG59XG5cbndpbmRvdy5PTlMgPSB3aW5kb3cuT05TIHx8IHt9O1xud2luZG93Lk9OUy5zdG9yYWdlID0ge1xuICBnZXRBZGRyZXNzOiBnZXRBZGRyZXNzLFxuICBhZGRIb3VzZWhvbGRNZW1iZXI6IGFkZEhvdXNlaG9sZE1lbWJlcixcbiAgdXBkYXRlSG91c2Vob2xkTWVtYmVyOiB1cGRhdGVIb3VzZWhvbGRNZW1iZXIsXG4gIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcjogZGVsZXRlSG91c2Vob2xkTWVtYmVyLFxuICBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzOiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzLFxuICBhZGRVc2VyUGVyc29uOiBhZGRVc2VyUGVyc29uLFxuICBnZXRVc2VyUGVyc29uOiBnZXRVc2VyUGVyc29uLFxuICBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZDogZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZCxcbiAgZ2V0TWVtYmVyUGVyc29uSWQ6IGdldE1lbWJlclBlcnNvbklkLFxuICB1cGRhdGVVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZGVsZXRlVXNlckFzSG91c2Vob2xkTWVtYmVyOiBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIsXG4gIHRlbXBBd2F5UXVlc3Rpb25TZW50ZW5jZU1hcDogdGVtcEF3YXlRdWVzdGlvblNlbnRlbmNlTWFwLFxuICB2aXNpdG9yUXVlc3Rpb25TZW50ZW5jZU1hcDogdmlzaXRvclF1ZXN0aW9uU2VudGVuY2VNYXAsXG5cbiAgaXNWaXNpdG9yOiBpc1Zpc2l0b3IsXG4gIGlzT3RoZXJIb3VzZWhvbGRNZW1iZXI6IGlzT3RoZXJIb3VzZWhvbGRNZW1iZXIsXG4gIGlzSG91c2Vob2xkTWVtYmVyOiBpc0hvdXNlaG9sZE1lbWJlcixcblxuICBhZGRSZWxhdGlvbnNoaXA6IGFkZFJlbGF0aW9uc2hpcCxcbiAgZGVsZXRlUmVsYXRpb25zaGlwOiBkZWxldGVSZWxhdGlvbnNoaXAsXG4gIGVkaXRSZWxhdGlvbnNoaXA6IGVkaXRSZWxhdGlvbnNoaXAsXG4gIGdldEFsbFJlbGF0aW9uc2hpcHM6IGdldEFsbFJlbGF0aW9uc2hpcHMsXG4gIGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHM6IGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHMsXG4gIGRlbGV0ZUFsbFJlbGF0aW9uc2hpcHNGb3JNZW1iZXI6IGRlbGV0ZUFsbFJlbGF0aW9uc2hpcHNGb3JNZW1iZXIsXG5cbiAgZ2V0QWxsUGFyZW50c09mOiBnZXRBbGxQYXJlbnRzT2YsXG4gIGdldEFsbENoaWxkcmVuT2Y6IGdldEFsbENoaWxkcmVuT2YsXG4gIGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcDogZ2V0UGFyZW50SWRGcm9tUmVsYXRpb25zaGlwLFxuICBnZXRDaGlsZElkRnJvbVJlbGF0aW9uc2hpcDogZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXAsXG4gIGdldE90aGVyUGVyc29uSWRGcm9tUmVsYXRpb25zaGlwOiBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcCxcbiAgaXNBUGFyZW50SW5SZWxhdGlvbnNoaXA6IGlzQVBhcmVudEluUmVsYXRpb25zaGlwLFxuICBpc0FDaGlsZEluUmVsYXRpb25zaGlwOiBpc0FDaGlsZEluUmVsYXRpb25zaGlwLFxuICBpc0luUmVsYXRpb25zaGlwOiBpc0luUmVsYXRpb25zaGlwLFxuICBhcmVBbnlDaGlsZHJlbkluUmVsYXRpb25zaGlwTm90UGFyZW50OiBhcmVBbnlDaGlsZHJlbkluUmVsYXRpb25zaGlwTm90UGFyZW50LFxuICBpc1JlbGF0aW9uc2hpcFR5cGU6IGlzUmVsYXRpb25zaGlwVHlwZSxcbiAgaXNSZWxhdGlvbnNoaXBJbmZlcnJlZDogaXNSZWxhdGlvbnNoaXBJbmZlcnJlZCxcbiAgZ2V0UmVsYXRpb25zaGlwT2Y6IGdldFJlbGF0aW9uc2hpcE9mLFxuXG4gIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwOiByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcCxcbiAgcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlczogcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlcyxcbiAgbWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZTogbWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZSxcbiAgaW5mZXJSZWxhdGlvbnNoaXBzOiBpbmZlclJlbGF0aW9uc2hpcHMsXG4gIGdldFJlbGF0aW9uc2hpcHNXaXRoUGVyc29uSWRzOiBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkcyxcbiAgZ2V0UGVvcGxlSWRzTWlzc2luZ1JlbGF0aW9uc2hpcHNXaXRoUGVyc29uOiBnZXRQZW9wbGVJZHNNaXNzaW5nUmVsYXRpb25zaGlwc1dpdGhQZXJzb24sXG4gIGdldFJlbGF0aW9uc2hpcFR5cGU6IGdldFJlbGF0aW9uc2hpcFR5cGUsXG4gIGZpbmROZXh0TWlzc2luZ1JlbGF0aW9uc2hpcDogZmluZE5leHRNaXNzaW5nUmVsYXRpb25zaGlwLFxuXG4gIGFkZFVwZGF0ZVBlcnNvbmFsRGV0YWlsc0RPQjogYWRkVXBkYXRlUGVyc29uYWxEZXRhaWxzRE9CLFxuICBnZXRQZXJzb25hbERldGFpbHNGb3I6IGdldFBlcnNvbmFsRGV0YWlsc0ZvcixcbiAgcmVtb3ZlUGVyc29uYWxEZXRhaWxzRm9yOiByZW1vdmVQZXJzb25hbERldGFpbHNGb3IsXG4gIGFkZFVwZGF0ZU1hcml0YWxTdGF0dXM6IGFkZFVwZGF0ZU1hcml0YWxTdGF0dXMsXG4gIGFkZFVwZGF0ZUNvdW50cnk6IGFkZFVwZGF0ZUNvdW50cnksXG4gIGFkZFVwZGF0ZUNvdW50cnlPdGhlcjogYWRkVXBkYXRlQ291bnRyeU90aGVyLFxuICBhZGRVcGRhdGVOYXRpb25hbElkZW50aXR5OiBhZGRVcGRhdGVOYXRpb25hbElkZW50aXR5LFxuICBhZGRVcGRhdGVOYXRpb25hbElkZW50aXR5T3RoZXI6IGFkZFVwZGF0ZU5hdGlvbmFsSWRlbnRpdHlPdGhlcixcbiAgYWRkVXBkYXRlRXRobmljR3JvdXA6IGFkZFVwZGF0ZUV0aG5pY0dyb3VwLFxuICBhZGRVcGRhdGVFdGhuaWNHcm91cERlc2NyaXB0aW9uOiBhZGRVcGRhdGVFdGhuaWNHcm91cERlc2NyaXB0aW9uLFxuICBhZGRVcGRhdGVFdGhuaWNHcm91cE90aGVyOiBhZGRVcGRhdGVFdGhuaWNHcm91cE90aGVyLFxuICBhZGRVcGRhdGVQYXNzcG9ydENvdW50cnk6IGFkZFVwZGF0ZVBhc3Nwb3J0Q291bnRyeSxcbiAgYWRkVXBkYXRlUGFzc3BvcnRDb3VudHJ5T3RoZXI6IGFkZFVwZGF0ZVBhc3Nwb3J0Q291bnRyeU90aGVyLFxuICBhZGRVcGRhdGVPcmllbnRhdGlvbjogYWRkVXBkYXRlT3JpZW50YXRpb24sXG4gIGFkZFVwZGF0ZVNhbGFyeTogYWRkVXBkYXRlU2FsYXJ5LFxuICBhZGRVcGRhdGVTZXg6IGFkZFVwZGF0ZVNleCxcbiAgYWRkVXBkYXRlQWRkcmVzc1doZXJlOiBhZGRVcGRhdGVBZGRyZXNzV2hlcmUsXG4gIGFkZFVwZGF0ZUFkZHJlc3NJbmRpdmlkdWFsOiBhZGRVcGRhdGVBZGRyZXNzSW5kaXZpZHVhbCxcbiAgYWRkVXBkYXRlQWdlOiBhZGRVcGRhdGVBZ2UsXG4gIGFkZFVwZGF0ZUFnZUNvbmZpcm06IGFkZFVwZGF0ZUFnZUNvbmZpcm0sXG4gIGFkZFVwZGF0ZUFkZHJlc3NPdXRzaWRlVUs6IGFkZFVwZGF0ZUFkZHJlc3NPdXRzaWRlVUssXG4gIGFkZFVwZGF0ZUFwcHJlbnRpY2VzaGlwOiBhZGRVcGRhdGVBcHByZW50aWNlc2hpcCxcbiAgYWRkVXBkYXRlSGFzUXVhbGlmaWNhdGlvbkFib3ZlOiBhZGRVcGRhdGVIYXNRdWFsaWZpY2F0aW9uQWJvdmUsXG4gIGFkZFVwZGF0ZVF1YWxpZmljYXRpb25zTnZxRXF1aXZhbGVudDogYWRkVXBkYXRlUXVhbGlmaWNhdGlvbnNOdnFFcXVpdmFsZW50LFxuICBhZGRVcGRhdGVRdWFsaWZpY2F0aW9uc0FMZXZlbDogYWRkVXBkYXRlUXVhbGlmaWNhdGlvbnNBTGV2ZWwsXG4gIGFkZFVwZGF0ZVF1YWxpZmljYXRpb25zR0NTRXM6IGFkZFVwZGF0ZVF1YWxpZmljYXRpb25zR0NTRXMsXG4gIGFkZFVwZGF0ZVF1YWxpZmljYXRpb25zT3RoZXJXaGVyZTogYWRkVXBkYXRlUXVhbGlmaWNhdGlvbnNPdGhlcldoZXJlLFxuICBhZGRVcGRhdGVFbXBsb3ltZW50U3RhdHVzOiBhZGRVcGRhdGVFbXBsb3ltZW50U3RhdHVzLFxuICBhZGRVcGRhdGVKb2JUaXRsZTogYWRkVXBkYXRlSm9iVGl0bGUsXG4gIGFkZFVwZGF0ZUpvYkRlc2NyaWJlOiBhZGRVcGRhdGVKb2JEZXNjcmliZSxcblxuICBwZXJzb25hbERldGFpbHNNYXJpdGFsU3RhdHVzTWFwOiBwZXJzb25hbERldGFpbHNNYXJpdGFsU3RhdHVzTWFwLFxuICBwZXJzb25hbERldGFpbHNDb3VudHJ5TWFwOiBwZXJzb25hbERldGFpbHNDb3VudHJ5TWFwLFxuICBwZXJzb25hbERldGFpbHNPcmllbnRhdGlvbk1hcDogcGVyc29uYWxEZXRhaWxzT3JpZW50YXRpb25NYXAsXG4gIHBlcnNvbmFsRGV0YWlsc0dlbmRlck1hcDogcGVyc29uYWxEZXRhaWxzR2VuZGVyTWFwLFxuICBwZXJzb25hbERldGFpbHNOYXRpb25hbElkZW50aXR5TWFwOiBwZXJzb25hbERldGFpbHNOYXRpb25hbElkZW50aXR5TWFwLFxuICBwZXJzb25hbERldGFpbHNFdGhuaWNHcm91cE1hcDogcGVyc29uYWxEZXRhaWxzRXRobmljR3JvdXBNYXAsXG4gIHBlcnNvbmFsRGV0YWlsc1Bhc3Nwb3J0Q291bnRyaWVzTWFwOiBwZXJzb25hbERldGFpbHNQYXNzcG9ydENvdW50cmllc01hcCxcbiAgcGVyc29uYWxEZXRhaWxzQXBwcmVudGljZXNoaXBNYXA6IHBlcnNvbmFsRGV0YWlsc0FwcHJlbnRpY2VzaGlwTWFwLFxuICBwZXJzb25hbERldGFpbHNEZWdyZWVBYm92ZU1hcDogcGVyc29uYWxEZXRhaWxzRGVncmVlQWJvdmVNYXAsXG4gIHBlcnNvbmFsRGV0YWlsc05WUU1hcDogcGVyc29uYWxEZXRhaWxzTlZRTWFwLFxuICBwZXJzb25hbERldGFpbHNBTGV2ZWxNYXA6IHBlcnNvbmFsRGV0YWlsc0FMZXZlbE1hcCxcbiAgcGVyc29uYWxEZXRhaWxzR0NTRU1hcDogcGVyc29uYWxEZXRhaWxzR0NTRU1hcCxcbiAgcGVyc29uYWxEZXRhaWxzT3RoZXJXaGVyZTogcGVyc29uYWxEZXRhaWxzT3RoZXJXaGVyZSxcbiAgcGVyc29uYWxEZXRhaWxzRW1wbG95bWVudFN0YXR1czogcGVyc29uYWxEZXRhaWxzRW1wbG95bWVudFN0YXR1cyxcblxuICBjcmVhdGVQaW5Gb3I6IGNyZWF0ZVBpbkZvcixcbiAgZ2V0UGluRm9yOiBnZXRQaW5Gb3IsXG4gIHVuc2V0UGluRm9yOiB1bnNldFBpbkZvcixcbiAgcGVyc29uYWxCb29rbWFyazogcGVyc29uYWxCb29rbWFyayxcbiAgZ2V0Qm9va21hcmtGb3I6IGdldEJvb2ttYXJrRm9yLFxuICBjbGVhclBlcnNvbmFsQm9va21hcms6IGNsZWFyUGVyc29uYWxCb29rbWFyayxcbiAgcGVyc29uYWxRdWVzdGlvblN1Ym1pdERlY29yYXRvcjogcGVyc29uYWxRdWVzdGlvblN1Ym1pdERlY29yYXRvcixcblxuICBzZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eTogc2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHksXG4gIGdldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5OiBnZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eSxcbiAgdW5zZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eTogdW5zZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eSxcblxuICBkb0lMaXZlSGVyZTogZG9JTGl2ZUhlcmUsXG4gIGlzTWVtYmVyVXNlcjogaXNNZW1iZXJVc2VyLFxuXG4gIEtFWVM6IHtcbiAgICBIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWTogSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksXG4gICAgVVNFUl9TVE9SQUdFX0tFWTogVVNFUl9TVE9SQUdFX0tFWSxcbiAgICBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZOiBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZLFxuICAgIEhPVVNFSE9MRF9NRU1CRVJfVFlQRTogSE9VU0VIT0xEX01FTUJFUl9UWVBFLFxuICAgIFZJU0lUT1JfVFlQRTogVklTSVRPUl9UWVBFLFxuICAgIFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVk6IFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksXG4gICAgUEVSU09OQUxfREVUQUlMU19LRVk6IFBFUlNPTkFMX0RFVEFJTFNfS0VZXG4gIH0sXG5cbiAgSURTOiB7XG4gICAgVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEOiBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSURcbiAgfSxcblxuICBUWVBFUzoge1xuICAgIHBlcnNvbjogcGVyc29uLFxuICAgIHJlbGF0aW9uc2hpcDogcmVsYXRpb25zaGlwXG4gIH1cbn07XG5cbndpbmRvdy5PTlMuaGVscGVycyA9IHtcbiAgcG9wdWxhdGVIb3VzZWhvbGRMaXN0OiBwb3B1bGF0ZUhvdXNlaG9sZExpc3QsXG4gIHBvcHVsYXRlVmlzaXRvckxpc3Q6IHBvcHVsYXRlVmlzaXRvckxpc3Rcbn07XG5cbndpbmRvdy5PTlMudXRpbHMgPSB7XG4gIHJlbW92ZUZyb21MaXN0OiByZW1vdmVGcm9tTGlzdCxcbiAgdHJhaWxpbmdOYW1lUzogdHJhaWxpbmdOYW1lUyxcbiAgbnVtYmVyVG9Qb3NpdGlvbldvcmQ6IG51bWJlclRvUG9zaXRpb25Xb3JkLFxuICBudW1iZXJUb1dvcmRzU3R5bGVndWlkZTogbnVtYmVyVG9Xb3Jkc1N0eWxlZ3VpZGUsXG4gIGdldFNpZ25pZmljYW50OiBnZXRTaWduaWZpY2FudCxcbiAgY2xlYW5IVE1MUGxhY2Vob2xkZXJTdHJpbmdSZXBsYWNtZW50OiBjbGVhbkhUTUxQbGFjZWhvbGRlclN0cmluZ1JlcGxhY21lbnRcbn07XG5cbiQocG9wdWxhdGVIb3VzZWhvbGRMaXN0KTtcbiQocG9wdWxhdGVWaXNpdG9yTGlzdCk7XG4kKHVwZGF0ZUhvdXNlaG9sZFZpc2l0b3JzTmF2aWdhdGlvbkl0ZW1zKTtcbiQodXBkYXRlQWRkcmVzc2VzKTtcbiQodXBkYXRlUGVyc29uTGluayk7XG4kKHRvb2xzKTtcbiQodXBkYXRlQWxsUHJldmlvdXNMaW5rcyk7XG4kKHVwZGF0ZUJ5U3VydmV5VHlwZSk7XG4kKHVwZGF0ZVNpZ25pZmljYW50RGF0ZSk7XG4kKHVwZGF0ZUhvdXNlaG9sZFN1bW1hcnkpO1xuJCh1cGRhdGVWaXNpdG9yc1N1bW1hcnkpO1xuJCh1cGRhdGVDb250aW51ZU5vdGljZSk7XG4kKHVwZGF0ZVNhdmVBbmRDb21wbGV0ZUxhdGVyKTtcbiQodXBkYXRlRm9vcnRMaXN0Q29sKTtcbiQoc2Vzc2lvbkJvb2ttYXJrKTtcbiQoZmllbGRJdGVtRGlzcGxheUhhY2spO1xuXG5leHBvcnRzLlVTRVJfU1RPUkFHRV9LRVkgPSBVU0VSX1NUT1JBR0VfS0VZO1xuZXhwb3J0cy5JTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZID0gSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWTtcbmV4cG9ydHMuZ2V0QWRkcmVzcyA9IGdldEFkZHJlc3M7XG5leHBvcnRzLmFkZFVzZXJQZXJzb24gPSBhZGRVc2VyUGVyc29uO1xuZXhwb3J0cy5nZXRVc2VyUGVyc29uID0gZ2V0VXNlclBlcnNvbjtcbiJdfQ==
