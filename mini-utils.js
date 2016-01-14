'use strict';

(function(globalScope, cb) {
  if (typeof require !== 'undefined' && typeof define === 'undefined') {
    cb(module.exports, true);
  } else {
    globalScope.__ = {};
    cb(globalScope.__, false);
  }
})(this, function(exports, isNode) {
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

  /* isElectron */
  exports.isElectron = function() {
    return (exports.isNode() && exports.isBrowser());
  }
  /* End isElectron */

  /* inherits */
  exports.inherits = function(obj, parent) {
    obj.super_ = parent;
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

  /* guid(), courtesy of http://stackoverflow.com/a/105074/5119920 */
  exports.guid = function() {
    function S4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  }
  /* End guid() */

  /* clone, courtesy of http://stackoverflow.com/a/728694/5119920 */
  exports.clone = function(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    var copy = obj.constructor();
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) copy[i] = obj[i];
    }
    return copy;
  }
  /* End clone */

  /* nextTick */
  exports.nextTick = function(cb) {
    if (exports.isNode() && !exports.isBrowser() && !exports.isWebWorker()) {
      if (process.nextTick) {
        return process.nextTick(cb);
      }
      if (setImmediate) {
        return setImmediate(cb);
      }
    } else if (!exports.isNode() && exports.isBrowser() && !exports.isWebWorker()) {
      if (window.setImmediate) {
        return window.setImmediate(cb);
      }
      var reqAnimFrame = window.requestAnimationFrame;
      var prefixes = ['ms', 'moz', 'webkit', 'o'];
      for (var i = 0; i < prefixes.length && !reqAnimFrame; i++) {
        reqAnimFrame = window[prefixes[i] + 'RequestAnimationFrame'];
      }
      if (reqAnimFrame) {
        return reqAnimFrame.call(window, cb);
      }
    }
    return setTimeout(cb, 0);
  }
  /* End nextTick */

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
    this.emit('newListener', e, cb);
    this._events[e].listeners.push({
      func: cb,
      once: false
    });
    if (this._events[e].listeners.length > this.getMaxListeners()) {
      console.log('(miniUtils) warning: possible EventEmitter memory leak detected. ' + this._events[e].listeners.length + ' ' + e + ' listeners added. Use emitter.setMaxListeners() to increase limit.');
      console.trace();
    }
    return this;
  }

  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.prototype._max = 10;

  EventEmitter.prototype._maxModified = false;

  EventEmitter.prototype.setMaxListeners = function(n) {
    this._max = n;
    this._maxModified = true;
    return this;
  }

  EventEmitter.prototype.getMaxListeners = function() {
    if (this._maxModified) {
      return this._max;
    } else {
      return EventEmitter.defaultMaxListeners;
    }
  }

  EventEmitter.prototype.listenerCount = function(ev) {
    if (!this._events[ev]) {
      this._events[ev] = {
        listeners: []
      }
    }

    return this._events[ev].listeners.length;
  }

  EventEmitter.listenerCount = function(emitter, ev) {
    if (!emitter._events[ev]) {
      emitter._events[ev] = {
        listeners: []
      }
    }

    return emitter._events[ev].listeners.length;
  }

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.removeListener = function(e, cb) {
    if (!this._events[e]) {
      this._events[e] = {
        listeners: []
      }
    }
    for (var i = 0; i < this._events[e].listeners.length; i++) {
      if (this._events[e].listeners[i].func === cb) {
        var listener = this._events[e].listeners.splice(i, 1);
        this.emit('removeListener', e, listener.func);
        break;
      }
    }
    return this;
  }

  EventEmitter.prototype.removeAllListeners = function(e) {
    if (!this._events[e]) {
      this._events[e] = {
        listeners: []
      }
    }
    var listenLength = this._events[e].listeners.length;
    for (var i = 0; i < listenLength; i++) {
      var listener = this._events[e].listeners.splice(0, 1);
      this.emit('removeListener', e, listener.func);
    }
    return this;
  }

  EventEmitter.prototype.listeners = function(e) {
    if (!this._events[e]) {
      this._events[e] = {
        listeners: []
      }
    }

    var arr = [];

    for (var i = 0; i < this._events[e].listeners.length; i++) {
      arr.push(this._events[e].listeners[i].func);
    }

    return arr;
  }

  EventEmitter.prototype.once = function(e, cb) {
    if (!this._events[e]) {
      this._events[e] = {
        listeners: []
      }
    }
    this.emit('newListener', e, cb);
    this._events[e].listeners.push({
      func: cb,
      once: true
    });
    if (this._events[e].listeners.length > this.getMaxListeners()) {
      console.log('(miniUtils) warning: possible EventEmitter memory leak detected. ' + this._events[e].listeners.length + ' ' + e + ' listeners added. Use emitter.setMaxListeners() to increase limit.');
      console.trace();
    }
    return this;
  }

  EventEmitter.prototype.emit = function() {
    var e = arguments[0];
    var data = [];
    for (var i = 1; i < arguments.length; i++) {
      data.push(arguments[i]);
    }
    if (!this._events[e]) {
      this._events[e] = {
        listeners: []
      }
    }
    for (var i = 0; i < this._events[e].listeners.length; i++) {
      this._events[e].listeners[i].func.apply(this._events[e].listeners[i].func, data);
      if (this._events[e].listeners[i] && this._events[e].listeners[i].once) {
        this._events[e].listeners.splice(i, 1);
      }
    }
    if (this._events[e].listeners.length === 0) {
      return false;
    }
    return true;
  }

  exports.EventEmitter = EventEmitter;
  /* End EventEmitter */

  if (!exports.isBrowser() && !exports.isNode() && exports.isWebWorker()) {
    /* WebWorker self extensions */
    self._events = {};
    self.addEventListener('message', function(message) {
      var data = message.data;
      var jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch(e) {
        return;
      }

      if (jsonData.isMiniUtilsEvent && jsonData.ev && jsonData.data) {
        if (!self._events[jsonData.ev]) {
          self._events[jsonData.ev] = {
            listeners: []
          }
        }
        for (var i = 0; i < self._events[jsonData.ev].listeners.length; i++) {
          self._events[jsonData.ev].listeners[i].func.apply(self._events[jsonData.ev].listeners[i].func, jsonData.data);
          if (self._events[jsonData.ev].listeners[i] && self._events[jsonData.ev].listeners[i].once) {
            self._events[jsonData.ev].listeners.splice(i, 1);
          }
        }
      }
    });
    self.on = function(ev, cb) {
      if (ev === 'message') {
        self.addEventListener('message', cb);
        return this;
      }

      if (!self._events[ev]) {
        self._events[ev] = {
          listeners: []
        }
      }
      self.emit('newListener', ev, cb);
      self._events[ev].listeners.push({
        func: cb,
        once: false
      });
      return this;
    }
    self.once = function(ev, cb) {
      function listener() {
        cb();
        self.removeEventListener('message', listener);
      }
      if (ev === 'message') {
        self.addEventListener('message', listener);
        return this;
      }

      if (!self._events[ev]) {
        self._events[ev] = {
          listeners: []
        }
      }
      self.emit('newListener', ev, cb);
      self._events[ev].listeners.push({
        func: cb,
        once: true
      });
      return this;
    }
    self.removeListener = function(e, cb) {
      if (!self._events[e]) {
        self._events[e] = {
          listeners: []
        }
      }
      for (var i = 0; i < self._events[e].listeners.length; i++) {
        if (self._events[e].listeners[i].func === cb) {
          var listener = self._events[e].listeners.splice(i, 1);
          self.emit('removeListener', e, listener.func);
          break;
        }
      }
      return this;
    }

    self.removeAllListeners = function(e) {
      if (!self._events[e]) {
        self._events[e] = {
          listeners: []
        }
      }
      for (var i = 0; i < self._events[e].listener.length; i++) {
        var listener = self._events[e].listeners.splice(i, 1);
        self.emit('removeListener', e, listener.func);
      }
      return this;
    }
    self.emit = function() {
      var e = arguments[0];
      if (typeof e !== 'string') {
        self.postMessage(e);
      } else {
        var data = [];
        for (var i = 1; i < arguments.length; i++) {
          data.push(arguments[i]);
        }
        self.postMessage(JSON.stringify({
          isMiniUtilsEvent: true,
          ev: e,
          data: data
        }));
      }

      return this;
    }
    /* End WebWorker self extensions */
  }

  if ((!exports.isWebWorker() && !exports.isNode() && exports.isBrowser()) || exports.isElectron()) {
    /* Worker (WebWorker) prototype extensions */
    Worker.prototype.appendEmitter = function() {
      var worker = this;
      this.addEventListener('message', function(message) {
        var data = message.data;
        var jsonData;
        try {
          jsonData = JSON.parse(data);
        } catch(e) {
          return;
        }

        if (jsonData.isMiniUtilsEvent && jsonData.ev && jsonData.data) {
          if (!worker._events[jsonData.ev]) {
            worker._events[jsonData.ev] = {
              listeners: []
            }
          }
          for (var i = 0; i < worker._events[jsonData.ev].listeners.length; i++) {
            worker._events[jsonData.ev].listeners[i].func.apply(worker._events[jsonData.ev].listeners[i].func, jsonData.data);
            if (worker._events[jsonData.ev].listeners[i] && worker._events[jsonData.ev].listeners[i].once) {
              worker._events[jsonData.ev].listeners.splice(i, 1);
            }
          }
        }
      });
      this._emitterAppended = true;
    }
    Worker.prototype._events = {};
    Worker.prototype.on = function(ev, cb) {
      if (!this._emitterAppended) {
        this.appendEmitter();
      }

      if (ev === 'message') {
        this.addEventListener('message', cb);
        return this;
      }

      if (!this._events[ev]) {
        this._events[ev] = {
          listeners: []
        }
      }
      this.emit('newListener', ev, cb);
      this._events[ev].listeners.push({
        func: cb,
        once: false
      });
      return this;
    }
    Worker.prototype.once = function(ev, cb) {
      if (!this._emitterAppended) {
        this.appendEmitter();
      }

      var self = this;
      function listener() {
        cb();
        self.removeEventListener('message', listener);
      }
      if (ev === 'message') {
        this.addEventListener('message', listener);
        return this;
      }

      if (!this._events[ev]) {
        this._events[ev] = {
          listeners: []
        }
      }
      this.emit('newListener', ev, cb);
      this._events[ev].listeners.push({
        func: cb,
        once: true
      });
      return this;
    }
    Worker.prototype.removeListener = function(e, cb) {
      if (!this._emitterAppended) {
        this.appendEmitter();
      }

      if (!this._events[e]) {
        this._events[e] = {
          listeners: []
        }
      }
      for (var i = 0; i < this._events[e].listeners.length; i++) {
        if (this._events[e].listeners[i].func === cb) {
          var listener = this._events[e].listeners.splice(i, 1);
          this.emit('removeListener', e, listener.func);
          break;
        }
      }
      return this;
    }

    Worker.prototype.removeAllListeners = function(e) {
      if (!this._emitterAppended) {
        this.appendEmitter();
      }

      if (!this._events[e]) {
        this._events[e] = {
          listeners: []
        }
      }
      for (var i = 0; i < this._events[e].listeners.length; i++) {
        var listener = this._events[e].listeners.splice(i, 1);
        this.emit('removeListener', e, listener.func);
      }
      return this;
    }
    Worker.prototype.emit = function() {
      if (!this._emitterAppended) {
        appendEmitter(this);
      }

      var e = arguments[0];

      if (typeof e !== 'string') {
        this.postMessage(e);
      } else {
        var data = [];
        for (var i = 1; i < arguments.length; i++) {
          data.push(arguments[i]);
        }
        this.postMessage(JSON.stringify({
          isMiniUtilsEvent: true,
          ev: e,
          data: data
        }));
      }

      return this;
    }
    /* End Worker prototype extensions */

    /* EventTarget extensions */
    EventTarget.prototype.on = function(ev, cb) {
      this.addEventListener(ev, cb);
      return this;
    }
    EventTarget.prototype.once = function(ev, cb) {
      var self = this;
      function listener() {
        cb();
        self.removeEventListener(ev, listener);
      }
      this.addEventListener(ev, listener);
      return this;
    }
    EventTarget.prototype.emit = function(ev) {
      if (!ev) throw new Error('EventTarget.emit requires an event (Event or string)!');
      if (!(ev instanceof Event)) ev = new Event(ev);
      this.dispatchEvent(ev);
    }
    EventTarget.prototype.removeListener = function(e, cb) {
      this.removeEventListener(e, cb);
    }
    /* End EventTarget extensions */

    /* Document prototype extensions */
    var doc = HTMLDocument || Document;
    doc.prototype.on = function(ev, cb) {
      this.addEventListener(ev, cb);
      return this;
    }
    doc.prototype.once = function(ev, cb) {
      var self = this;
      function listener() {
        cb();
        self.removeEventListener(ev, listener);
      }
      this.addEventListener(ev, listener);
      return this;
    }
    doc.prototype.ready = function(cb) {
      this.addEventListener('DOMContentLoaded', cb);
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
    var elm = HTMLElement || Element;
    elm.prototype.on = function(ev, cb) {
      this.addEventListener(ev, cb);
      return this;
    }

    elm.prototype.once = function(ev, cb) {
      var self = this;
      function listener() {
        cb();
        self.removeEventListener(ev, listener);
      }
      this.addEventListener(ev, listener);
      return this;
    }

    elm.prototype.remove = function() {
      this.parentElement.removeChild(this);
      return this;
    }

    elm.prototype.text = function(val) {
      if (!val) return this.textContent;
      this.textContent = val;
      return this;
    }

    elm.prototype.html = function(val) {
      if (!val) return this.innerHTML;
      this.innerHTML = val;
      return this;
    }

    elm.prototype.css = function(props, val) {
      if (typeof props === 'string') {
        if (!val) return this.style[props];
        this.style[props] = val;
        return this;
      } else if (props instanceof Array) {
        if (!val) {
          var ret = [];
          for (var i = 0; i < props.length; i++) {
            ret.push(this.style[props[i]]);
          }
          return ret;
        }
        if (props.length > val.length) throw new Error('element.css(): not enough values in value array argument.');
        for (var i = 0; i < props.length; i++) {
          this.style[props[i]] = val[i];
        }
        return this;
      } else if (typeof props === 'object') {
        for (var prop in props) {
          this.style[prop] = props[prop];
        }
        return this;
      } else {
        throw new Error('element.css(): unknown arguments.');
      }
    }

    elm.prototype.hasMultipleOfClass = function(classToSearch) {
      var arr = this.className.split(' ');
      var times_found = 0;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === classToSearch) {
          times_found++;
        }
      }
      return (times_found > 1) ? true : false;
    }

    elm.prototype.hasClass = function(classToSearch) {
      var arr = this.className.split(' ');
      var found = false;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === classToSearch) {
          found = true;
          break;
        }
      }
      return found;
    }

    elm.prototype.addClass = function(classToAdd) {
      var spaceOrNot = ' ';
      if (this.className === '') spaceOrNot = '';
      this.className += spaceOrNot + classToAdd;
      return this;
    }

    elm.prototype.removeClass = function(classToRemove) {
      var arr = this.className.split(' ');
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === classToRemove) {
          arr.splice(i, 1);
        }
      }
      this.className = arr.join(' ');
      return this;
    }

    elm.prototype.hide = function() {
      this.style.display = 'none';
      return this;
    }

    elm.prototype.show = function() {
      this.style.display = '';
      return this;
    }

    elm.prototype.toggle = function() {
      if (this.style.display === 'none') {
        this.style.display = '';
      } else {
        this.style.display = 'none';
      }
      return this;
    }
    /* End HTMLElement prototype extensions */
  }

  if ((exports.isBrowser || exports.isWebWorker() && !exports.isNode()) || exports.isElectron()) {
    /* import */
    exports.import = function(url, cb) {
      if (!cb) {
        throw new Error('Must provide callback.');
      }
      if (!url) {
        cb(new Error('Must provide URL.'), null);
      }
      var req = new XMLHttpRequest();
      req.open('GET', url + '.js');
      req.send();
      var module = {
        exports: {}
      };
      req.addEventListener('readystatechange', function() {
        if (req.readyState === 4) {
          if (req.status !== 200) return cb(new Error(req.statusText), null);
          var func = new Function('exports', '__', 'module', '__filename', '__dirname', req.responseText);
          func(module.exports, exports, module, url + '.js', url.substr(0, url.lastIndexOf('/')));
          cb(null, module.exports);
        }
      });
    }
    /* End import */

    /* importSync */
    exports.importSync = function(url) {
      if (!url) {
        throw new Error('Must provide URL.');
      }
      var req = new XMLHttpRequest();
      req.open('GET', url + '.js', false);
      req.send();
      if (req.status !== 200) throw new Error(req.statusText);
      var module = {
        exports: {}
      };
      var func = new Function('exports', '__', 'module', '__filename', '__dirname', req.responseText);
      func(module.exports, exports, module, url + '.js', url.substr(0, url.lastIndexOf('/')));
      return module.exports;
    }
    /* End importSync */

    /* easyRequest */
    exports.easyRequest = function(url, cb) {
      if (!url) {
        if (cb) {
          return cb(new Error('Must provide url.'), null);
        } else {
          throw new Error('Must provide url.');
        }
      }
      var req = new XMLHttpRequest();
      req.addEventListener('readystatechange', function() {
        if (req.readyState === 4) {
          if (cb) {
            cb(null, req.response);
          }
        }
      });
      if (cb) {
        req.open('GET', url);
      } else {
        req.open('GET', url, false);
      }
      req.send();
      if (!cb) {
        return req.response;
      }
    }
    /* End easyRequest */

    /* easyPost */
    exports.easyPost = function(url, data, cb) {
      if (!data) data = null;
      if (!url) {
        if (cb) {
          return cb(new Error('Must provide url.'), null);
        } else {
          throw new Error('Must provide url.');
        }
      }
      var req = new XMLHttpRequest();
      req.addEventListener('readystatechange', function() {
        if (req.readyState === 4) {
          if (cb) {
            cb(null, req.response);
          }
        }
      });
      if (cb) {
        req.open('POST', url);
      } else {
        req.open('POST', url, false);
      }
      req.send(data);
      if (!cb) {
        return req.response;
      }
    }
    /* End easyPost */
  }
});
