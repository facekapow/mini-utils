'use strict';

(function(cb) {
  if (typeof require !== 'undefined' && typeof define === 'undefined') {
    cb(module.exports, true);
  } else {
    window.miniUtils = {};
    cb(window.miniUtils, false);
  }
})(function(exports, isNode) {
  /* isNode */
  exports.isNode = function() {
    return isNode;
  }
  /* End isNode */

  /* isBrowser */
  exports.isBrowser = function() {
    return (typeof window !== 'undefined');
  }
  /* End isBrowser */

  /* isWebWorker */
  exports.isWebWorker = function() {
    if (typeof onmessage !== 'undefined' && typeof postMessage !== 'undefined' && typeof self !== 'undefined' && typeof window === 'undefined') {
      return true;
    } else {
      return false;
    }
  }
  /* End isWebWorker */

  /* inherits */
  exports.inherits = function(obj, parent) {
    obj._super = parent;
    obj.prototype = Object.create(parent.prototype, {
      constructor: {
        value: obj,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }
  /* End inherits */

  /* guid(), courtesy of http://stackoverflow.com/a/105074 */
  exports.guid = function() {
    function S4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  }
  /* End guid() */

  /* EventEmitter */
  function EventEmitter() {
    // nothing
  }

  EventEmitter.prototype._events = {};

  EventEmitter.prototype.on = function(e, cb) {
    if (!this._events[e]) {
      this._events[e] = {
        listeners: []
      }
    }
    this._events[e].listeners.push(cb);
    return this;
  }

  EventEmitter.prototype.emit = function() {
    var e = arguments[0];
    var data = [];
    for (var i = 0; i < arguments.length; i++) {
      data.push(arguments[i]);
    }
    if (!this._events[e]) {
      this._events[e] = {
        listeners: []
      }
    }
    for (var i = 0; i < this._events[e].listeners.length; i++) {
      this._events[e].listeners[i].apply(this._events[e].listeners[i], data);
    }
    return this;
  }

  exports.EventEmitter = EventEmitter;
  /* End EventEmitter */

  if (!exports.isWebWorker() && !exports.isNode()) {
    /* Document prototype extensions */
    var doc = HTMLDocument || Document;
    doc.prototype.on = function(ev, cb) {
      this.addEventListener(ev, cb);
      return this;
    }
    doc.prototype.get = function(str) {
      if (str.substr(0, 1) === '#') {
        return this.getElementById(str.substr(1));
      }
      if (str.substr(0, 1) === '.') {
        return this.getElementsByClassName(str.substr(1));
      }
      return this.getElementsByTagName(str);
    }
    doc.prototype.create = function(opt, obj) {
      if (typeof opt === 'string' && typeof obj === 'undefined') {
        return this.createElement(opt);
      }
      if (typeof opt === 'string' && typeof obj === 'object') {
        var elm = this.createElement(opt);
        if (typeof obj.css !== 'undefined') {
          for (var i in obj.css) {
            elm.style[i] = obj.css[i];
          }
        }
        if (typeof obj.style !== 'undefined') {
          for (var i in obj.style) {
            elm.style[i] = obj.style[i];
          }
        }
        for (var i in obj) {
          if (i === 'style') continue;
          elm[i] = obj[i];
        }
        return elm;
      }
    }
    /* End Document prototype extensions */

    /* HTMLElement prototype extensions */
    HTMLElement.prototype.on = function(ev, cb) {
      this.addEventListener(ev, cb);
      return this;
    }

    HTMLElement.prototype.remove = function() {
      this.parentElement.removeChild(this);
      return this;
    }

    HTMLElement.prototype.text = function(val) {
      if (!val) return this.textContent;
      this.textContent = val;
      return this;
    }

    HTMLElement.prototype.css = function(props, val) {
      if (typeof props === 'string') {
        if (!val) return this.style[props];
        this.style[props] = val;
        return this;
      } else if (typeof props === 'object') {
        for (var prop in props) {
          this.style[prop] = props[prop];
        }
        return this;
      } else if (typeof props === 'array') {
        if (!val) {
          var ret = [];
          for (var i = 0; i < props.length; i++) {
            ret.push(this.style[props[i]]);
          }
          return ret;
        }
        if (props.length > val.length) throw new Error('element.css(): not enough values in value array argument.');
        for (var i = 0; i < props.length; i++) {
          this.style[props[i]] = this.style[val[i]];
        }
        return this;
      } else {
        throw new Error('element.css(): unknown arguments.');
      }
    }

    HTMLElement.prototype.hasMultipleOfClass = function(classToSearch) {
      var arr = this.className.split(' ');
      var times_found = 0;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === classToSearch) {
          times_found++;
        }
      }
      return (times_found > 1) ? true : false;
    }

    HTMLElement.prototype.hasClass = function(classToSearch) {
      var arr = this.className.split(' ');
      var found = false;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === classToSearch) {
          found = true;
        }
      }
      return found;
    }

    HTMLElement.prototype.addClass = function(classToAdd) {
      this.className += ' ' + classToAdd;
      return this;
    }

    HTMLElement.prototype.removeClass = function(classToRemove) {
      var arr = this.className.split(' ');
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === classToRemove) {
          arr.splice(i, 1);
        }
      }
      this.className = arr.join(' ');
      return this;
    }
    /* End HTMLElement prototype extensions */
  }
});
