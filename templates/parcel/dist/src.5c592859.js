// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/imba/src/imba/imba.imba":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var Imba = {
  VERSION: '1.4.0'
};

Imba.setTimeout = function (delay, block) {
  return setTimeout(function () {
    block();
    return Imba.commit();
  }, delay);
};

Imba.setInterval = function (interval, block) {
  return setInterval(function () {
    block();
    return Imba.commit();
  }, interval);
};

Imba.clearInterval = function (id) {
  return clearInterval(id);
};

Imba.clearTimeout = function (id) {
  return clearTimeout(id);
};

Imba.subclass = function (obj, sup) {
  for (var k in sup) {
    var v = void 0;
    v = sup[k];

    if (sup.hasOwnProperty(k)) {
      obj[k] = v;
    }

    ;
  }

  ;
  obj.prototype = Object.create(sup.prototype);
  obj.__super__ = obj.prototype.__super__ = sup.prototype;
  obj.prototype.initialize = obj.prototype.constructor = obj;
  return obj;
};

Imba.iterable = function (o) {
  return o ? o.toArray ? o.toArray() : o : [];
};

Imba.await = function (value) {
  if (value instanceof Array) {
    console.warn("await (Array) is deprecated - use await Promise.all(Array)");
    return Promise.all(value);
  } else if (value && value.then) {
    return value;
  } else {
    return Promise.resolve(value);
  }

  ;
};

var dashRegex = /-./g;
var setterCache = {};

Imba.toCamelCase = function (str) {
  if (str.indexOf('-') >= 0) {
    return str.replace(dashRegex, function (m) {
      return m.charAt(1).toUpperCase();
    });
  } else {
    return str;
  }

  ;
};

Imba.toSetter = function (str) {
  return setterCache[str] || (setterCache[str] = Imba.toCamelCase('set-' + str));
};

Imba.indexOf = function (a, b) {
  return b && b.indexOf ? b.indexOf(a) : [].indexOf.call(a, b);
};

Imba.len = function (a) {
  return a && (a.len instanceof Function ? a.len.call(a) : a.length) || 0;
};

Imba.prop = function (scope, name, opts) {
  if (scope.defineProperty) {
    return scope.defineProperty(name, opts);
  }

  ;
  return;
};

Imba.attr = function (scope, name, opts) {
  if (opts === undefined) opts = {};

  if (scope.defineAttribute) {
    return scope.defineAttribute(name, opts);
  }

  ;
  var getName = Imba.toCamelCase(name);
  var setName = Imba.toCamelCase('set-' + name);
  var proto = scope.prototype;

  if (opts.dom) {
    proto[getName] = function () {
      return this.dom()[name];
    };

    proto[setName] = function (value) {
      if (value != this[name]()) {
        this.dom()[name] = value;
      }

      ;
      return this;
    };
  } else {
    proto[getName] = function () {
      return this.getAttribute(name);
    };

    proto[setName] = function (value) {
      this.setAttribute(name, value);
      return this;
    };
  }

  ;
  return;
};

Imba.propDidSet = function (object, property, val, prev) {
  var fn = property.watch;

  if (fn instanceof Function) {
    fn.call(object, val, prev, property);
  } else if ((typeof fn == 'string' || fn instanceof String) && object[fn]) {
    object[fn](val, prev, property);
  }

  ;
  return;
};

var emit__ = function emit__(event, args, node) {
  // var node = cbs[event]
  var prev, cb, ret;

  while ((prev = node) && (node = node.next)) {
    if (cb = node.listener) {
      if (node.path && cb[node.path]) {
        ret = args ? cb[node.path].apply(cb, args) : cb[node.path]();
      } else {
        // check if it is a method?
        ret = args ? cb.apply(node, args) : cb.call(node);
      }

      ;
    }

    ;

    if (node.times && --node.times <= 0) {
      prev.next = node.next;
      node.listener = null;
    }

    ;
  }

  ;
  return;
};

Imba.listen = function (obj, event, listener, path) {
  var cbs, list, tail;
  cbs = obj.__listeners__ || (obj.__listeners__ = {});
  list = cbs[event] || (cbs[event] = {});
  tail = list.tail || (list.tail = list.next = {});
  tail.listener = listener;
  tail.path = path;
  list.tail = tail.next = {};
  return tail;
};

Imba.once = function (obj, event, listener) {
  var tail = Imba.listen(obj, event, listener);
  tail.times = 1;
  return tail;
};

Imba.unlisten = function (obj, event, cb, meth) {
  var node, prev;
  var meta = obj.__listeners__;

  if (!meta) {
    return;
  }

  ;

  if (node = meta[event]) {
    while ((prev = node) && (node = node.next)) {
      if (node == cb || node.listener == cb) {
        prev.next = node.next;
        node.listener = null;
        break;
      }

      ;
    }

    ;
  }

  ;
  return;
};

Imba.emit = function (obj, event, params) {
  var cb;

  if (cb = obj.__listeners__) {
    if (cb[event]) {
      emit__(event, params, cb[event]);
    }

    ;

    if (cb.all) {
      emit__(event, [event, params], cb.all);
    }

    ;
  }

  ;
  return;
};

Imba.observeProperty = function (observer, key, trigger, target, prev) {
  if (prev && _typeof(prev) == 'object') {
    Imba.unlisten(prev, 'all', observer, trigger);
  }

  ;

  if (target && _typeof(target) == 'object') {
    Imba.listen(target, 'all', observer, trigger);
  }

  ;
  return this;
};

module.exports = Imba;
},{}],"node_modules/imba/src/imba/scheduler.imba":[function(require,module,exports) {
function iter$(a) {
  return a ? a.toArray ? a.toArray() : a : [];
}

;

var Imba = require("./imba");

var requestAnimationFrame;
var cancelAnimationFrame;

if (false) {}

;

if (true) {
  cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitRequestAnimationFrame;
  requestAnimationFrame = window.requestAnimationFrame;
  requestAnimationFrame || (requestAnimationFrame = window.webkitRequestAnimationFrame);
  requestAnimationFrame || (requestAnimationFrame = window.mozRequestAnimationFrame);
  requestAnimationFrame || (requestAnimationFrame = function requestAnimationFrame(blk) {
    return setTimeout(blk, 1000 / 60);
  });
}

;

function Ticker() {
  var self = this;
  self._queue = [];
  self._stage = -1;
  self._scheduled = false;

  self._ticker = function (e) {
    self._scheduled = false;
    return self.tick(e);
  };

  self;
}

;

Ticker.prototype.stage = function (v) {
  return this._stage;
};

Ticker.prototype.setStage = function (v) {
  this._stage = v;
  return this;
};

Ticker.prototype.queue = function (v) {
  return this._queue;
};

Ticker.prototype.setQueue = function (v) {
  this._queue = v;
  return this;
};

Ticker.prototype.add = function (item, force) {
  if (force || this._queue.indexOf(item) == -1) {
    this._queue.push(item);
  }

  ;

  if (!this._scheduled) {
    return this.schedule();
  }

  ;
};

Ticker.prototype.tick = function (timestamp) {
  var items = this._queue;

  if (!this._ts) {
    this._ts = timestamp;
  }

  ;
  this._dt = timestamp - this._ts;
  this._ts = timestamp;
  this._queue = [];
  this._stage = 1;
  this.before();

  if (items.length) {
    for (var i = 0, ary = iter$(items), len = ary.length, item; i < len; i++) {
      item = ary[i];

      if (item instanceof Function) {
        item(this._dt, this);
      } else if (item.tick) {
        item.tick(this._dt, this);
      }

      ;
    }

    ;
  }

  ;
  this._stage = 2;
  this.after();
  this._stage = this._scheduled ? 0 : -1;
  return this;
};

Ticker.prototype.schedule = function () {
  if (!this._scheduled) {
    this._scheduled = true;

    if (this._stage == -1) {
      this._stage = 0;
    }

    ;
    requestAnimationFrame(this._ticker);
  }

  ;
  return this;
};

Ticker.prototype.before = function () {
  return this;
};

Ticker.prototype.after = function () {
  if (Imba.TagManager) {
    Imba.TagManager.refresh();
  }

  ;
  return this;
};

Imba.TICKER = new Ticker();
Imba.SCHEDULERS = [];

Imba.ticker = function () {
  return Imba.TICKER;
};

Imba.requestAnimationFrame = function (callback) {
  return requestAnimationFrame(callback);
};

Imba.cancelAnimationFrame = function (id) {
  return cancelAnimationFrame(id);
};

var commitQueue = 0;

Imba.commit = function (params) {
  commitQueue++;
  Imba.emit(Imba, 'commit', params != undefined ? [params] : undefined);

  if (--commitQueue == 0) {
    Imba.TagManager && Imba.TagManager.refresh();
  }

  ;
  return;
};

Imba.Scheduler = function Scheduler(target) {
  var self = this;
  self._id = counter++;
  self._target = target;
  self._marked = false;
  self._active = false;

  self._marker = function () {
    return self.mark();
  };

  self._ticker = function (e) {
    return self.tick(e);
  };

  self._dt = 0;
  self._frame = {};
  self._scheduled = false;
  self._timestamp = 0;
  self._ticks = 0;
  self._flushes = 0;
  self.onevent = self.onevent.bind(self);
  self;
};

var counter = 0;

Imba.Scheduler.event = function (e) {
  return Imba.emit(Imba, 'event', e);
};

Imba.Scheduler.prototype.__raf = {
  watch: 'rafDidSet',
  name: 'raf'
};

Imba.Scheduler.prototype.raf = function (v) {
  return this._raf;
};

Imba.Scheduler.prototype.setRaf = function (v) {
  var a = this.raf();

  if (v != a) {
    this._raf = v;
  }

  if (v != a) {
    this.rafDidSet && this.rafDidSet(v, a, this.__raf);
  }

  return this;
};

Imba.Scheduler.prototype.__interval = {
  watch: 'intervalDidSet',
  name: 'interval'
};

Imba.Scheduler.prototype.interval = function (v) {
  return this._interval;
};

Imba.Scheduler.prototype.setInterval = function (v) {
  var a = this.interval();

  if (v != a) {
    this._interval = v;
  }

  if (v != a) {
    this.intervalDidSet && this.intervalDidSet(v, a, this.__interval);
  }

  return this;
};

Imba.Scheduler.prototype.__events = {
  watch: 'eventsDidSet',
  name: 'events'
};

Imba.Scheduler.prototype.events = function (v) {
  return this._events;
};

Imba.Scheduler.prototype.setEvents = function (v) {
  var a = this.events();

  if (v != a) {
    this._events = v;
  }

  if (v != a) {
    this.eventsDidSet && this.eventsDidSet(v, a, this.__events);
  }

  return this;
};

Imba.Scheduler.prototype.marked = function (v) {
  return this._marked;
};

Imba.Scheduler.prototype.setMarked = function (v) {
  this._marked = v;
  return this;
};

Imba.Scheduler.prototype.rafDidSet = function (bool) {
  if (bool && this._active) this.requestTick();
  return this;
};

Imba.Scheduler.prototype.intervalDidSet = function (time) {
  clearInterval(this._intervalId);
  this._intervalId = null;

  if (time && this._active) {
    this._intervalId = setInterval(this.oninterval.bind(this), time);
  }

  ;
  return this;
};

Imba.Scheduler.prototype.eventsDidSet = function (new$, prev) {
  if (this._active && new$ && !prev) {
    return Imba.listen(Imba, 'commit', this, 'onevent');
  } else if (!new$ && prev) {
    return Imba.unlisten(Imba, 'commit', this, 'onevent');
  }

  ;
};

Imba.Scheduler.prototype.active = function () {
  return this._active;
};

Imba.Scheduler.prototype.dt = function () {
  return this._dt;
};

Imba.Scheduler.prototype.configure = function (options) {
  var v_;
  if (options === undefined) options = {};

  if (options.raf != undefined) {
    this.setRaf(v_ = options.raf), v_;
  }

  ;

  if (options.interval != undefined) {
    this.setInterval(v_ = options.interval), v_;
  }

  ;

  if (options.events != undefined) {
    this.setEvents(v_ = options.events), v_;
  }

  ;
  return this;
};

Imba.Scheduler.prototype.mark = function () {
  this._marked = true;

  if (!this._scheduled) {
    this.requestTick();
  }

  ;
  return this;
};

Imba.Scheduler.prototype.flush = function () {
  this._flushes++;

  this._target.tick(this);

  this._marked = false;
  return this;
};

Imba.Scheduler.prototype.tick = function (delta, ticker) {
  this._ticks++;
  this._dt = delta;

  if (ticker) {
    this._scheduled = false;
  }

  ;
  this.flush();

  if (this._raf && this._active) {
    this.requestTick();
  }

  ;
  return this;
};

Imba.Scheduler.prototype.requestTick = function () {
  if (!this._scheduled) {
    this._scheduled = true;
    Imba.TICKER.add(this);
  }

  ;
  return this;
};

Imba.Scheduler.prototype.activate = function (immediate) {
  if (immediate === undefined) immediate = true;

  if (!this._active) {
    this._active = true;
    this._commit = this._target.commit;

    this._target.commit = function () {
      return this;
    };

    this._target && this._target.flag && this._target.flag('scheduled_');
    Imba.SCHEDULERS.push(this);

    if (this._events) {
      Imba.listen(Imba, 'commit', this, 'onevent');
    }

    ;

    if (this._interval && !this._intervalId) {
      this._intervalId = setInterval(this.oninterval.bind(this), this._interval);
    }

    ;

    if (immediate) {
      this.tick(0);
    } else if (this._raf) {
      this.requestTick();
    }

    ;
  }

  ;
  return this;
};

Imba.Scheduler.prototype.deactivate = function () {
  if (this._active) {
    this._active = false;
    this._target.commit = this._commit;
    var idx = Imba.SCHEDULERS.indexOf(this);

    if (idx >= 0) {
      Imba.SCHEDULERS.splice(idx, 1);
    }

    ;

    if (this._events) {
      Imba.unlisten(Imba, 'commit', this, 'onevent');
    }

    ;

    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }

    ;
    this._target && this._target.unflag && this._target.unflag('scheduled_');
  }

  ;
  return this;
};

Imba.Scheduler.prototype.track = function () {
  return this._marker;
};

Imba.Scheduler.prototype.oninterval = function () {
  this.tick();
  Imba.TagManager.refresh();
  return this;
};

Imba.Scheduler.prototype.onevent = function (event) {
  if (!this._events || this._marked) {
    return this;
  }

  ;

  if (this._events instanceof Function) {
    if (this._events(event, this)) this.mark();
  } else if (this._events instanceof Array) {
    if (this._events.indexOf(event && event.type || event) >= 0) {
      this.mark();
    }

    ;
  } else {
    this.mark();
  }

  ;
  return this;
};
},{"./imba":"node_modules/imba/src/imba/imba.imba"}],"node_modules/imba/src/imba/dom/manager.imba":[function(require,module,exports) {
function iter$(a) {
  return a ? a.toArray ? a.toArray() : a : [];
}

;

var Imba = require("../imba");

Imba.TagManagerClass = function TagManagerClass() {
  this._inserts = 0;
  this._removes = 0;
  this._mounted = [];
  this._mountables = 0;
  this._unmountables = 0;
  this._unmounting = 0;
  this;
};

Imba.TagManagerClass.prototype.mounted = function () {
  return this._mounted;
};

Imba.TagManagerClass.prototype.insert = function (node, parent) {
  this._inserts++;

  if (node && node.mount) {
    this.regMountable(node);
  }

  ;
  return;
};

Imba.TagManagerClass.prototype.remove = function (node, parent) {
  return this._removes++;
};

Imba.TagManagerClass.prototype.changes = function () {
  return this._inserts + this._removes;
};

Imba.TagManagerClass.prototype.mount = function (node) {
  return;
};

Imba.TagManagerClass.prototype.refresh = function (force) {
  if (force === undefined) force = false;

  if (false) {}

  ;

  if (!force && this.changes() == 0) {
    return;
  }

  ;

  if (this._inserts && this._mountables > this._mounted.length || force) {
    this.tryMount();
  }

  ;

  if ((this._removes || force) && this._mounted.length) {
    this.tryUnmount();
  }

  ;
  this._inserts = 0;
  this._removes = 0;
  return this;
};

Imba.TagManagerClass.prototype.unmount = function (node) {
  return this;
};

Imba.TagManagerClass.prototype.regMountable = function (node) {
  if (!(node.FLAGS & Imba.TAG_MOUNTABLE)) {
    node.FLAGS |= Imba.TAG_MOUNTABLE;
    return this._mountables++;
  }

  ;
};

Imba.TagManagerClass.prototype.tryMount = function () {
  var count = 0;
  var root = document.body;
  var items = root.querySelectorAll('.__mount');

  for (var i = 0, ary = iter$(items), len = ary.length, el; i < len; i++) {
    el = ary[i];

    if (el && el._tag) {
      if (this._mounted.indexOf(el._tag) == -1) {
        this.mountNode(el._tag);
      }

      ;
    }

    ;
  }

  ;
  return this;
};

Imba.TagManagerClass.prototype.mountNode = function (node) {
  if (this._mounted.indexOf(node) == -1) {
    this.regMountable(node);

    this._mounted.push(node);

    node.FLAGS |= Imba.TAG_MOUNTED;

    if (node.mount) {
      node.mount();
    }

    ;
  }

  ;
  return;
};

Imba.TagManagerClass.prototype.tryUnmount = function () {
  this._unmounting++;
  var unmount = [];
  var root = document.body;

  for (var i = 0, items = iter$(this._mounted), len = items.length, item; i < len; i++) {
    item = items[i];

    if (!item) {
      continue;
    }

    ;

    if (!document.documentElement.contains(item._dom)) {
      unmount.push(item);
      this._mounted[i] = null;
    }

    ;
  }

  ;
  this._unmounting--;

  if (unmount.length) {
    this._mounted = this._mounted.filter(function (item) {
      return item && unmount.indexOf(item) == -1;
    });

    for (var _i = 0, _len = unmount.length, _item; _i < _len; _i++) {
      _item = unmount[_i];
      _item.FLAGS = _item.FLAGS & ~Imba.TAG_MOUNTED;

      if (_item.unmount && _item._dom) {
        _item.unmount();
      } else if (_item._scheduler) {
        _item.unschedule();
      }

      ;
    }

    ;
  }

  ;
  return this;
};
},{"../imba":"node_modules/imba/src/imba/imba.imba"}],"node_modules/imba/src/imba/dom/pointer.imba":[function(require,module,exports) {
var Imba = require("../imba");

Imba.Pointer = function Pointer() {
  this._button = -1;
  this._event = {
    x: 0,
    y: 0,
    type: 'uninitialized'
  };
  return this;
};

Imba.Pointer.prototype.button = function () {
  return this._button;
};

Imba.Pointer.prototype.touch = function () {
  return this._touch;
};

Imba.Pointer.prototype.update = function (e) {
  this._event = e;
  this._dirty = true;
  return this;
};

Imba.Pointer.prototype.process = function () {
  var e1 = this._event;

  if (this._dirty) {
    this._prevEvent = e1;
    this._dirty = false;

    if (e1.type == 'mousedown') {
      this._button = e1.button;

      if (this._touch && this._button != 0) {
        return;
      }

      ;

      if (this._touch) {
        this._touch.cancel();
      }

      ;
      this._touch = new Imba.Touch(e1, this);

      this._touch.mousedown(e1, e1);
    } else if (e1.type == 'mousemove') {
      if (this._touch) {
        this._touch.mousemove(e1, e1);
      }

      ;
    } else if (e1.type == 'mouseup') {
      this._button = -1;

      if (this._touch && this._touch.button() == e1.button) {
        this._touch.mouseup(e1, e1);

        this._touch = null;
      }

      ;
    }

    ;
  } else if (this._touch) {
    this._touch.idle();
  }

  ;
  return this;
};

Imba.Pointer.prototype.x = function () {
  return this._event.x;
};

Imba.Pointer.prototype.y = function () {
  return this._event.y;
};
},{"../imba":"node_modules/imba/src/imba/imba.imba"}],"node_modules/imba/src/imba/dom/event-manager.imba":[function(require,module,exports) {
function iter$(a) {
  return a ? a.toArray ? a.toArray() : a : [];
}

;

var Imba = require("../imba");

require("./pointer");

var native$ = ['keydown', 'keyup', 'keypress', 'textInput', 'input', 'change', 'submit', 'focusin', 'focusout', 'focus', 'blur', 'contextmenu', 'selectstart', 'dblclick', 'selectionchange', 'mousewheel', 'wheel', 'scroll', 'beforecopy', 'copy', 'beforepaste', 'paste', 'beforecut', 'cut', 'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'dragexit', 'drop', 'mouseup', 'mousedown', 'mouseenter', 'mouseleave', 'mouseout', 'mouseover', 'mousemove'];

Imba.EventManager = function EventManager(node, pars) {
  var self = this;
  if (!pars || pars.constructor !== Object) pars = {};
  var events = pars.events !== undefined ? pars.events : [];
  self._shimFocusEvents = true && window.netscape && node.onfocusin === undefined;
  self.setRoot(node);
  self.setListeners([]);
  self.setDelegators({});
  self.setDelegator(function (e) {
    self.delegate(e);
    return true;
  });

  for (var i = 0, items = iter$(events), len = items.length; i < len; i++) {
    self.register(items[i]);
  }

  ;
  return self;
};

Imba.EventManager.prototype.root = function (v) {
  return this._root;
};

Imba.EventManager.prototype.setRoot = function (v) {
  this._root = v;
  return this;
};

Imba.EventManager.prototype.count = function (v) {
  return this._count;
};

Imba.EventManager.prototype.setCount = function (v) {
  this._count = v;
  return this;
};

Imba.EventManager.prototype.__enabled = {
  'default': false,
  watch: 'enabledDidSet',
  name: 'enabled'
};

Imba.EventManager.prototype.enabled = function (v) {
  return this._enabled;
};

Imba.EventManager.prototype.setEnabled = function (v) {
  var a = this.enabled();

  if (v != a) {
    this._enabled = v;
  }

  if (v != a) {
    this.enabledDidSet && this.enabledDidSet(v, a, this.__enabled);
  }

  return this;
};

Imba.EventManager.prototype._enabled = false;

Imba.EventManager.prototype.listeners = function (v) {
  return this._listeners;
};

Imba.EventManager.prototype.setListeners = function (v) {
  this._listeners = v;
  return this;
};

Imba.EventManager.prototype.delegators = function (v) {
  return this._delegators;
};

Imba.EventManager.prototype.setDelegators = function (v) {
  this._delegators = v;
  return this;
};

Imba.EventManager.prototype.delegator = function (v) {
  return this._delegator;
};

Imba.EventManager.prototype.setDelegator = function (v) {
  this._delegator = v;
  return this;
};

var initialBind = [];

Imba.EventManager.prototype.enabledDidSet = function (bool) {
  bool ? this.onenable() : this.ondisable();
  return this;
};

Imba.EventManager.bind = function (name) {
  if (Imba.Events) {
    return Imba.Events.autoregister(name);
  } else if (initialBind.indexOf(name) == -1 && native$.indexOf(name) >= 0) {
    return initialBind.push(name);
  }

  ;
};

Imba.EventManager.activate = function () {
  var Imba_;

  if (Imba.Events) {
    return Imba.Events;
  }

  ;
  Imba.Events = new Imba.EventManager(Imba.document(), {
    events: []
  });

  if (!true) {}

  ;
  Imba.POINTER || (Imba.POINTER = new Imba.Pointer());
  var hasTouchEvents = window && window.ontouchstart !== undefined;

  if (hasTouchEvents) {
    Imba.Events.listen('touchstart', function (e) {
      return Imba.Touch.ontouchstart(e);
    });
    Imba.Events.listen('touchmove', function (e) {
      return Imba.Touch.ontouchmove(e);
    });
    Imba.Events.listen('touchend', function (e) {
      return Imba.Touch.ontouchend(e);
    });
    Imba.Events.listen('touchcancel', function (e) {
      return Imba.Touch.ontouchcancel(e);
    });
  }

  ;
  Imba.Events.register('click', function (e) {
    // Only for main mousebutton, no?
    if (e.timeStamp - Imba.Touch.LastTimestamp > Imba.Touch.TapTimeout) {
      e._imbaSimulatedTap = true;
      var tap = new Imba.Event(e);
      tap.setType('tap');
      tap.process();

      if (tap._responder && tap.defaultPrevented) {
        return e.preventDefault();
      }

      ;
    }

    ;
    return Imba.Events.delegate(e);
  });
  Imba.Events.listen('mousedown', function (e) {
    if (e.timeStamp - Imba.Touch.LastTimestamp > Imba.Touch.TapTimeout) {
      if (Imba.POINTER) {
        return Imba.POINTER.update(e).process();
      }

      ;
    }

    ;
  });
  Imba.Events.listen('mouseup', function (e) {
    if (e.timeStamp - Imba.Touch.LastTimestamp > Imba.Touch.TapTimeout) {
      if (Imba.POINTER) {
        return Imba.POINTER.update(e).process();
      }

      ;
    }

    ;
  });
  Imba.Events.register(['mousedown', 'mouseup']);
  Imba.Events.register(initialBind);
  Imba.Events.setEnabled(true);
  return Imba.Events;
};

Imba.EventManager.prototype.register = function (name, handler) {
  if (handler === undefined) handler = true;

  if (name instanceof Array) {
    for (var i = 0, items = iter$(name), len = items.length; i < len; i++) {
      this.register(items[i], handler);
    }

    ;
    return this;
  }

  ;

  if (this.delegators()[name]) {
    return this;
  }

  ;
  var fn = this.delegators()[name] = handler instanceof Function ? handler : this.delegator();

  if (this.enabled()) {
    return this.root().addEventListener(name, fn, true);
  }

  ;
};

Imba.EventManager.prototype.autoregister = function (name) {
  if (native$.indexOf(name) == -1) {
    return this;
  }

  ;
  return this.register(name);
};

Imba.EventManager.prototype.listen = function (name, handler, capture) {
  if (capture === undefined) capture = true;
  this.listeners().push([name, handler, capture]);

  if (this.enabled()) {
    this.root().addEventListener(name, handler, capture);
  }

  ;
  return this;
};

Imba.EventManager.prototype.delegate = function (e) {
  var event = Imba.Event.wrap(e);
  event.process();

  if (this._shimFocusEvents) {
    if (e.type == 'focus') {
      Imba.Event.wrap(e).setType('focusin').process();
    } else if (e.type == 'blur') {
      Imba.Event.wrap(e).setType('focusout').process();
    }

    ;
  }

  ;
  return this;
};

Imba.EventManager.prototype.create = function (type, target, pars) {
  if (!pars || pars.constructor !== Object) pars = {};
  var data = pars.data !== undefined ? pars.data : null;
  var source = pars.source !== undefined ? pars.source : null;
  var event = Imba.Event.wrap({
    type: type,
    target: target
  });

  if (data) {
    event.setData(data), data;
  }

  ;

  if (source) {
    event.setSource(source), source;
  }

  ;
  return event;
};

Imba.EventManager.prototype.trigger = function () {
  return this.create.apply(this, arguments).process();
};

Imba.EventManager.prototype.onenable = function () {
  for (var o = this.delegators(), handler, i = 0, keys = Object.keys(o), l = keys.length, name; i < l; i++) {
    name = keys[i];
    handler = o[name];
    this.root().addEventListener(name, handler, true);
  }

  ;

  for (var _i = 0, items = iter$(this.listeners()), len = items.length, item; _i < len; _i++) {
    item = items[_i];
    this.root().addEventListener(item[0], item[1], item[2]);
  }

  ;

  if (true) {
    window.addEventListener('hashchange', Imba.commit);
    window.addEventListener('popstate', Imba.commit);
  }

  ;
  return this;
};

Imba.EventManager.prototype.ondisable = function () {
  for (var o = this.delegators(), handler, i = 0, keys = Object.keys(o), l = keys.length, name; i < l; i++) {
    name = keys[i];
    handler = o[name];
    this.root().removeEventListener(name, handler, true);
  }

  ;

  for (var _i2 = 0, items = iter$(this.listeners()), len = items.length, item; _i2 < len; _i2++) {
    item = items[_i2];
    this.root().removeEventListener(item[0], item[1], item[2]);
  }

  ;

  if (true) {
    window.removeEventListener('hashchange', Imba.commit);
    window.removeEventListener('popstate', Imba.commit);
  }

  ;
  return this;
};
},{"../imba":"node_modules/imba/src/imba/imba.imba","./pointer":"node_modules/imba/src/imba/dom/pointer.imba"}],"node_modules/imba/src/imba/dom/tag.imba":[function(require,module,exports) {
var _Imba$HTML_PROPS;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function iter$(a) {
  return a ? a.toArray ? a.toArray() : a : [];
}

;

var Imba = require("../imba");

Imba.CSSKeyMap = {};
Imba.TAG_BUILT = 1;
Imba.TAG_SETUP = 2;
Imba.TAG_MOUNTING = 4;
Imba.TAG_MOUNTED = 8;
Imba.TAG_SCHEDULED = 16;
Imba.TAG_AWAKENED = 32;
Imba.TAG_MOUNTABLE = 64;

Imba.document = function () {
  return window.document;
};

Imba.root = function () {
  return Imba.getTagForDom(Imba.document().body);
};

Imba.static = function (items, typ, nr) {
  items._type = typ;
  items.static = nr;
  return items;
};

Imba.mount = function (node, into) {
  into || (into = Imba.document().body);
  into.appendChild(node.dom());
  Imba.TagManager.insert(node, into);
  node.scheduler().configure({
    events: true
  }).activate(false);
  Imba.TagManager.refresh();
  return node;
};

Imba.createTextNode = function (node) {
  if (node && node.nodeType == 3) {
    return node;
  }

  ;
  return Imba.document().createTextNode(node);
};

Imba.Tag = function Tag(dom, ctx) {
  this.setDom(dom);
  this.$ = TagCache.build(this);
  this.$up = this._owner_ = ctx;
  this._tree_ = null;
  this.FLAGS = 0;
  this.build();
  this;
};

Imba.Tag.buildNode = function () {
  var dom = Imba.document().createElement(this._nodeType || 'div');

  if (this._classes) {
    var cls = this._classes.join(" ");

    if (cls) {
      dom.className = cls;
    }

    ;
  }

  ;
  return dom;
};

Imba.Tag.createNode = function () {
  var proto = this._protoDom || (this._protoDom = this.buildNode());
  return proto.cloneNode(false);
};

Imba.Tag.build = function (ctx) {
  return new this(this.createNode(), ctx);
};

Imba.Tag.dom = function () {
  return this._protoDom || (this._protoDom = this.buildNode());
};

Imba.Tag.end = function () {
  return this.commit(0);
};

Imba.Tag.inherit = function (child) {
  child._protoDom = null;

  if (this._nodeType) {
    child._nodeType = this._nodeType;
    child._classes = this._classes.slice();

    if (child._flagName) {
      return child._classes.push(child._flagName);
    }

    ;
  } else {
    child._nodeType = child._name;
    child._flagName = null;
    return child._classes = [];
  }

  ;
};

Imba.Tag.prototype.optimizeTagStructure = function () {
  if (!true) {}

  ;
  var ctor = this.constructor;
  var keys = Object.keys(this);

  if (keys.indexOf('mount') >= 0) {
    if (ctor._classes && ctor._classes.indexOf('__mount') == -1) {
      ctor._classes.push('__mount');
    }

    ;

    if (ctor._protoDom) {
      ctor._protoDom.classList.add('__mount');
    }

    ;
  }

  ;

  for (var i = 0, items = iter$(keys), len = items.length, key; i < len; i++) {
    key = items[i];

    if (/^on/.test(key)) {
      Imba.EventManager.bind(key.slice(2));
    }

    ;
  }

  ;
  return this;
};

Imba.attr(Imba.Tag, 'name');
Imba.attr(Imba.Tag, 'role');
Imba.attr(Imba.Tag, 'tabindex');

Imba.Tag.prototype.title = function (v) {
  return this.getAttribute('title');
};

Imba.Tag.prototype.setTitle = function (v) {
  this.setAttribute('title', v);
  return this;
};

Imba.Tag.prototype.dom = function () {
  return this._dom;
};

Imba.Tag.prototype.setDom = function (dom) {
  dom._tag = this;
  this._dom = this._slot_ = dom;
  return this;
};

Imba.Tag.prototype.ref = function () {
  return this._ref;
};

Imba.Tag.prototype.root = function () {
  return this._owner_ ? this._owner_.root() : this;
};

Imba.Tag.prototype.ref_ = function (ref) {
  this.flag(this._ref = ref);
  return this;
};

Imba.Tag.prototype.setData = function (data) {
  this._data = data;
  return this;
};

Imba.Tag.prototype.data = function () {
  return this._data;
};

Imba.Tag.prototype.bindData = function (target, path, args) {
  return this.setData(args ? target[path].apply(target, args) : target[path]);
};

Imba.Tag.prototype.setHtml = function (html) {
  if (this.html() != html) {
    this._dom.innerHTML = html;
  }

  ;
  return this;
};

Imba.Tag.prototype.html = function () {
  return this._dom.innerHTML;
};

Imba.Tag.prototype.on$ = function (slot, handler, context) {
  var handlers = this._on_ || (this._on_ = []);
  var prev = handlers[slot];

  if (slot < 0) {
    if (prev == undefined) {
      slot = handlers[slot] = handlers.length;
    } else {
      slot = prev;
    }

    ;
    prev = handlers[slot];
  }

  ;
  handlers[slot] = handler;

  if (prev) {
    handler.state = prev.state;
  } else {
    handler.state = {
      context: context
    };

    if (true) {
      Imba.EventManager.bind(handler[0]);
    }

    ;
  }

  ;
  return this;
};

Imba.Tag.prototype.setId = function (id) {
  if (id != null) {
    this.dom().id = id;
  }

  ;
  return this;
};

Imba.Tag.prototype.id = function () {
  return this.dom().id;
};

Imba.Tag.prototype.setAttribute = function (name, value) {
  var old = this.dom().getAttribute(name);

  if (old == value) {
    value;
  } else if (value != null && value !== false) {
    this.dom().setAttribute(name, value);
  } else {
    this.dom().removeAttribute(name);
  }

  ;
  return this;
};

Imba.Tag.prototype.setNestedAttr = function (ns, name, value, modifiers) {
  if (this[ns + 'SetAttribute']) {
    this[ns + 'SetAttribute'](name, value, modifiers);
  } else {
    this.setAttributeNS(ns, name, value);
  }

  ;
  return this;
};

Imba.Tag.prototype.setAttributeNS = function (ns, name, value) {
  var old = this.getAttributeNS(ns, name);

  if (old != value) {
    if (value != null && value !== false) {
      this.dom().setAttributeNS(ns, name, value);
    } else {
      this.dom().removeAttributeNS(ns, name);
    }

    ;
  }

  ;
  return this;
};

Imba.Tag.prototype.removeAttribute = function (name) {
  return this.dom().removeAttribute(name);
};

Imba.Tag.prototype.getAttribute = function (name) {
  return this.dom().getAttribute(name);
};

Imba.Tag.prototype.getAttributeNS = function (ns, name) {
  return this.dom().getAttributeNS(ns, name);
};

Imba.Tag.prototype.set = function (key, value, mods) {
  var setter = Imba.toSetter(key);

  if (this[setter] instanceof Function) {
    this[setter](value, mods);
  } else {
    this._dom.setAttribute(key, value);
  }

  ;
  return this;
};

Imba.Tag.prototype.get = function (key) {
  return this._dom.getAttribute(key);
};

Imba.Tag.prototype.setContent = function (content, type) {
  this.setChildren(content, type);
  return this;
};

Imba.Tag.prototype.setChildren = function (nodes, type) {
  // overridden on client by reconciler
  this._tree_ = nodes;
  return this;
};

Imba.Tag.prototype.setTemplate = function (template) {
  if (!this._template) {
    if (this.render == Imba.Tag.prototype.render) {
      this.render = this.renderTemplate;
    }

    ;
  }

  ;
  this.template = this._template = template;
  return this;
};

Imba.Tag.prototype.template = function () {
  return null;
};

Imba.Tag.prototype.renderTemplate = function () {
  var body = this.template();

  if (body != this) {
    this.setChildren(body);
  }

  ;
  return this;
};

Imba.Tag.prototype.removeChild = function (child) {
  var par = this.dom();
  var el = child._slot_ || child;

  if (el && el.parentNode == par) {
    Imba.TagManager.remove(el._tag || el, this);
    par.removeChild(el);
  }

  ;
  return this;
};

Imba.Tag.prototype.removeAllChildren = function () {
  if (this._dom.firstChild) {
    var el;

    while (el = this._dom.firstChild) {
      true && Imba.TagManager.remove(el._tag || el, this);

      this._dom.removeChild(el);
    }

    ;
  }

  ;
  this._tree_ = this._text_ = null;
  return this;
};

Imba.Tag.prototype.appendChild = function (node) {
  if (typeof node == 'string' || node instanceof String) {
    this.dom().appendChild(Imba.document().createTextNode(node));
  } else if (node) {
    this.dom().appendChild(node._slot_ || node);
    Imba.TagManager.insert(node._tag || node, this);
  }

  ;
  return this;
};

Imba.Tag.prototype.insertBefore = function (node, rel) {
  if (typeof node == 'string' || node instanceof String) {
    node = Imba.document().createTextNode(node);
  }

  ;

  if (node && rel) {
    this.dom().insertBefore(node._slot_ || node, rel._slot_ || rel);
    Imba.TagManager.insert(node._tag || node, this);
  }

  ;
  return this;
};

Imba.Tag.prototype.detachFromParent = function () {
  if (this._slot_ == this._dom) {
    this._slot_ = this._dom._placeholder_ || (this._dom._placeholder_ = Imba.document().createComment("node"));
    this._slot_._tag || (this._slot_._tag = this);

    if (this._dom.parentNode) {
      Imba.TagManager.remove(this, this._dom.parentNode);

      this._dom.parentNode.replaceChild(this._slot_, this._dom);
    }

    ;
  }

  ;
  return this;
};

Imba.Tag.prototype.attachToParent = function () {
  if (this._slot_ != this._dom) {
    var prev = this._slot_;
    this._slot_ = this._dom;

    if (prev && prev.parentNode) {
      Imba.TagManager.insert(this);
      prev.parentNode.replaceChild(this._dom, prev);
    }

    ;
  }

  ;
  return this;
};

Imba.Tag.prototype.orphanize = function () {
  var par;

  if (par = this.parent()) {
    par.removeChild(this);
  }

  ;
  return this;
};

Imba.Tag.prototype.text = function (v) {
  return this._dom.textContent;
};

Imba.Tag.prototype.setText = function (txt) {
  this._tree_ = txt;
  this._dom.textContent = txt == null || this.text() === false ? '' : txt;
  this;
  return this;
};

Imba.Tag.prototype.dataset = function (key, val) {
  if (key instanceof Object) {
    for (var v, i = 0, keys = Object.keys(key), l = keys.length, k; i < l; i++) {
      k = keys[i];
      v = key[k];
      this.dataset(k, v);
    }

    ;
    return this;
  }

  ;

  if (arguments.length == 2) {
    this.setAttribute("data-" + key, val);
    return this;
  }

  ;

  if (key) {
    return this.getAttribute("data-" + key);
  }

  ;
  var dataset = this.dom().dataset;

  if (!dataset) {
    dataset = {};

    for (var _i = 0, items = iter$(this.dom().attributes), len = items.length, atr; _i < len; _i++) {
      atr = items[_i];

      if (atr.name.substr(0, 5) == 'data-') {
        dataset[Imba.toCamelCase(atr.name.slice(5))] = atr.value;
      }

      ;
    }

    ;
  }

  ;
  return dataset;
};

Imba.Tag.prototype.render = function () {
  return this;
};

Imba.Tag.prototype.build = function () {
  return this;
};

Imba.Tag.prototype.setup = function () {
  return this;
};

Imba.Tag.prototype.commit = function () {
  if (this.beforeRender() !== false) this.render();
  return this;
};

Imba.Tag.prototype.beforeRender = function () {
  return this;
};

Imba.Tag.prototype.tick = function () {
  if (this.beforeRender() !== false) this.render();
  return this;
};

Imba.Tag.prototype.end = function () {
  this.setup();
  this.commit(0);
  this.end = Imba.Tag.end;
  return this;
};

Imba.Tag.prototype.$open = function (context) {
  if (context != this._context_) {
    this._tree_ = null;
    this._context_ = context;
  }

  ;
  return this;
};

Imba.Tag.prototype.synced = function () {
  return this;
};

Imba.Tag.prototype.awaken = function () {
  return this;
};

Imba.Tag.prototype.flags = function () {
  return this._dom.classList;
};

Imba.Tag.prototype.flag = function (name, toggler) {
  // it is most natural to treat a second undefined argument as a no-switch
  // so we need to check the arguments-length
  if (arguments.length == 2) {
    if (this._dom.classList.contains(name) != !!toggler) {
      this._dom.classList.toggle(name);
    }

    ;
  } else {
    // firefox will trigger a change if adding existing class
    if (!this._dom.classList.contains(name)) {
      this._dom.classList.add(name);
    }

    ;
  }

  ;
  return this;
};

Imba.Tag.prototype.unflag = function (name) {
  this._dom.classList.remove(name);

  return this;
};

Imba.Tag.prototype.toggleFlag = function (name) {
  this._dom.classList.toggle(name);

  return this;
};

Imba.Tag.prototype.hasFlag = function (name) {
  return this._dom.classList.contains(name);
};

Imba.Tag.prototype.flagIf = function (flag, bool) {
  var f = this._flags_ || (this._flags_ = {});
  var prev = f[flag];

  if (bool && !prev) {
    this._dom.classList.add(flag);

    f[flag] = true;
  } else if (prev && !bool) {
    this._dom.classList.remove(flag);

    f[flag] = false;
  }

  ;
  return this;
};

Imba.Tag.prototype.setFlag = function (name, value) {
  var flags = this._namedFlags_ || (this._namedFlags_ = {});
  var prev = flags[name];

  if (prev != value) {
    if (prev) {
      this.unflag(prev);
    }

    ;

    if (value) {
      this.flag(value);
    }

    ;
    flags[name] = value;
  }

  ;
  return this;
};

Imba.Tag.prototype.scheduler = function () {
  return this._scheduler == null ? this._scheduler = new Imba.Scheduler(this) : this._scheduler;
};

Imba.Tag.prototype.schedule = function (options) {
  if (options === undefined) options = {
    events: true
  };
  this.scheduler().configure(options).activate();
  return this;
};

Imba.Tag.prototype.unschedule = function () {
  if (this._scheduler) {
    this.scheduler().deactivate();
  }

  ;
  return this;
};

Imba.Tag.prototype.parent = function () {
  return Imba.getTagForDom(this.dom().parentNode);
};

Imba.Tag.prototype.children = function (sel) {
  var res = [];

  for (var i = 0, items = iter$(this._dom.children), len = items.length, item; i < len; i++) {
    item = items[i];
    res.push(item._tag || Imba.getTagForDom(item));
  }

  ;
  return res;
};

Imba.Tag.prototype.querySelector = function (q) {
  return Imba.getTagForDom(this._dom.querySelector(q));
};

Imba.Tag.prototype.querySelectorAll = function (q) {
  var items = [];

  for (var i = 0, ary = iter$(this._dom.querySelectorAll(q)), len = ary.length; i < len; i++) {
    items.push(Imba.getTagForDom(ary[i]));
  }

  ;
  return items;
};

Imba.Tag.prototype.matches = function (sel) {
  var fn;

  if (sel instanceof Function) {
    return sel(this);
  }

  ;

  if (sel.query instanceof Function) {
    sel = sel.query();
  }

  ;

  if (fn = this._dom.matches || this._dom.matchesSelector || this._dom.webkitMatchesSelector || this._dom.msMatchesSelector || this._dom.mozMatchesSelector) {
    return fn.call(this._dom, sel);
  }

  ;
};

Imba.Tag.prototype.closest = function (sel) {
  return Imba.getTagForDom(this._dom.closest(sel));
};

Imba.Tag.prototype.contains = function (node) {
  return this.dom().contains(node._dom || node);
};

Imba.Tag.prototype.log = function () {
  var $0 = arguments,
      i = $0.length;
  var args = new Array(i > 0 ? i : 0);

  while (i > 0) {
    args[i - 1] = $0[--i];
  }

  args.unshift(console);
  Function.prototype.call.apply(console.log, args);
  return this;
};

Imba.Tag.prototype.css = function (key, val, mod) {
  if (key instanceof Object) {
    for (var v, i = 0, keys = Object.keys(key), l = keys.length, k; i < l; i++) {
      k = keys[i];
      v = key[k];
      this.css(k, v);
    }

    ;
    return this;
  }

  ;
  var name = Imba.CSSKeyMap[key] || key;

  if (val == null) {
    this.dom().style.removeProperty(name);
  } else if (val == undefined && arguments.length == 1) {
    return this.dom().style[name];
  } else if (name.match(/^--/)) {
    this.dom().style.setProperty(name, val);
  } else {
    if ((typeof val == 'number' || val instanceof Number) && (name.match(/width|height|left|right|top|bottom/) || mod && mod.px)) {
      this.dom().style[name] = val + "px";
    } else {
      this.dom().style[name] = val;
    }

    ;
  }

  ;
  return this;
};

Imba.Tag.prototype.setStyle = function (style) {
  return this.setAttribute('style', style);
};

Imba.Tag.prototype.style = function () {
  return this.getAttribute('style');
};

Imba.Tag.prototype.trigger = function (name, data) {
  if (data === undefined) data = {};
  return true && Imba.Events.trigger(name, this, {
    data: data
  });
};

Imba.Tag.prototype.focus = function () {
  this.dom().focus();
  return this;
};

Imba.Tag.prototype.blur = function () {
  this.dom().blur();
  return this;
};

Imba.Tag.prototype.toString = function () {
  return this.dom().outerHTML;
};

Imba.Tag.prototype.initialize = Imba.Tag;

Imba.SVGTag = function SVGTag() {
  return Imba.Tag.apply(this, arguments);
};

Imba.subclass(Imba.SVGTag, Imba.Tag);

Imba.SVGTag.namespaceURI = function () {
  return "http://www.w3.org/2000/svg";
};

Imba.SVGTag.buildNode = function () {
  var dom = Imba.document().createElementNS(this.namespaceURI(), this._nodeType);

  if (this._classes) {
    var cls = this._classes.join(" ");

    if (cls) {
      dom.className.baseVal = cls;
    }

    ;
  }

  ;
  return dom;
};

Imba.SVGTag.inherit = function (child) {
  child._protoDom = null;

  if (this == Imba.SVGTag) {
    child._nodeType = child._name;
    return child._classes = [];
  } else {
    child._nodeType = this._nodeType;

    var className = "_" + child._name.replace(/_/g, '-');

    return child._classes = (this._classes || []).concat(className);
  }

  ;
};

Imba.HTML_TAGS = "a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr".split(" ");
Imba.HTML_TAGS_UNSAFE = "article aside header section".split(" ");
Imba.HTML_ATTRS = {
  a: "href target hreflang media download rel type ping referrerpolicy",
  audio: "autoplay controls crossorigin loop muted preload src",
  area: "alt coords download href hreflang ping referrerpolicy rel shape target",
  base: "href target",
  video: "autoplay buffered controls crossorigin height loop muted preload poster src width playsinline",
  fieldset: "disabled form name",
  form: "method action enctype autocomplete target",
  button: "autofocus type form formaction formenctype formmethod formnovalidate formtarget value name",
  embed: "height src type width",
  input: "accept disabled form list max maxlength min minlength pattern required size step type",
  label: "accesskey for form",
  img: "alt src srcset crossorigin decoding height importance intrinsicsize ismap referrerpolicy sizes width usemap",
  link: "rel type href media",
  iframe: "allow allowfullscreen allowpaymentrequest height importance name referrerpolicy sandbox src srcdoc width",
  meta: "property content charset desc",
  map: "name",
  optgroup: "label",
  option: "label",
  output: "for form",
  object: "type data width height",
  param: "name type value valuetype",
  progress: "max",
  script: "src type async defer crossorigin integrity nonce language nomodule",
  select: "size form multiple",
  source: "sizes src srcset type media",
  textarea: "rows cols minlength maxlength form wrap",
  track: "default kind label src srclang",
  td: "colspan rowspan headers",
  th: "colspan rowspan"
};
Imba.HTML_PROPS = (_Imba$HTML_PROPS = {
  input: "autofocus autocomplete autocapitalize autocorrect value placeholder required disabled multiple checked readOnly spellcheck",
  textarea: "autofocus autocomplete autocapitalize autocorrect value placeholder required disabled multiple checked readOnly spellcheck",
  form: "novalidate",
  fieldset: "disabled",
  button: "disabled",
  select: "autofocus disabled required readOnly multiple",
  option: "disabled selected value",
  optgroup: "disabled",
  progress: "value"
}, _defineProperty(_Imba$HTML_PROPS, "fieldset", "disabled"), _defineProperty(_Imba$HTML_PROPS, "canvas", "width height"), _Imba$HTML_PROPS);

var extender = function extender(obj, sup) {
  for (var v, i = 0, keys = Object.keys(sup), l = keys.length, k; i < l; i++) {
    k = keys[i];
    v = sup[k];
    obj[k] == null ? obj[k] = v : obj[k];
  }

  ;
  obj.prototype = Object.create(sup.prototype);
  obj.__super__ = obj.prototype.__super__ = sup.prototype;
  obj.prototype.constructor = obj;

  if (sup.inherit) {
    sup.inherit(obj);
  }

  ;
  return obj;
};

function Tag() {
  return function (dom, ctx) {
    this.initialize(dom, ctx);
    return this;
  };
}

;

Imba.Tags = function Tags() {
  this;
};

Imba.Tags.prototype.__clone = function (ns) {
  var clone = Object.create(this);
  clone._parent = this;
  return clone;
};

Imba.Tags.prototype.ns = function (name) {
  return this['_' + name.toUpperCase()] || this.defineNamespace(name);
};

Imba.Tags.prototype.defineNamespace = function (name) {
  var clone = Object.create(this);
  clone._parent = this;
  clone._ns = name;
  this['_' + name.toUpperCase()] = clone;
  return clone;
};

Imba.Tags.prototype.baseType = function (name, ns) {
  return Imba.indexOf(name, Imba.HTML_TAGS) >= 0 ? 'element' : 'div';
};

Imba.Tags.prototype.defineTag = function (fullName, supr, body) {
  if (body == undefined && typeof supr == 'function') body = supr, supr = '';
  if (supr == undefined) supr = '';

  if (body && body._nodeType) {
    supr = body;
    body = null;
  }

  ;

  if (this[fullName]) {
    console.log("tag already exists?", fullName);
  }

  ;
  var ns;
  var name = fullName;
  var nsidx = name.indexOf(':');

  if (nsidx >= 0) {
    ns = fullName.substr(0, nsidx);
    name = fullName.substr(nsidx + 1);

    if (ns == 'svg' && !supr) {
      supr = 'svg:element';
    }

    ;
  }

  ;
  supr || (supr = this.baseType(fullName));
  var supertype = typeof supr == 'string' || supr instanceof String ? this.findTagType(supr) : supr;
  var tagtype = Tag();
  tagtype._name = name;
  tagtype._flagName = null;

  if (name[0] == '#') {
    Imba.SINGLETONS[name.slice(1)] = tagtype;
    this[name] = tagtype;
  } else if (name[0] == name[0].toUpperCase()) {
    tagtype._flagName = name;
  } else {
    tagtype._flagName = "_" + fullName.replace(/[_\:]/g, '-');
    this[fullName] = tagtype;
  }

  ;
  extender(tagtype, supertype);

  if (body) {
    body.call(tagtype, tagtype, tagtype.TAGS || this);

    if (tagtype.defined) {
      tagtype.defined();
    }

    ;
    this.optimizeTag(tagtype);
  }

  ;
  return tagtype;
};

Imba.Tags.prototype.defineSingleton = function (name, supr, body) {
  return this.defineTag(name, supr, body);
};

Imba.Tags.prototype.extendTag = function (name, supr, body) {
  if (body == undefined && typeof supr == 'function') body = supr, supr = '';
  if (supr == undefined) supr = '';
  var klass = typeof name == 'string' || name instanceof String ? this.findTagType(name) : name;

  if (body) {
    body && body.call(klass, klass, klass.prototype);
  }

  ;

  if (klass.extended) {
    klass.extended();
  }

  ;
  this.optimizeTag(klass);
  return klass;
};

Imba.Tags.prototype.optimizeTag = function (tagtype) {
  var prototype_;
  return (prototype_ = tagtype.prototype) && prototype_.optimizeTagStructure && prototype_.optimizeTagStructure();
};

Imba.Tags.prototype.findTagType = function (type) {
  var attrs, props;
  var klass = this[type];

  if (!klass) {
    if (type.substr(0, 4) == 'svg:') {
      klass = this.defineTag(type, 'svg:element');
    } else if (Imba.HTML_TAGS.indexOf(type) >= 0) {
      klass = this.defineTag(type, 'element');

      if (attrs = Imba.HTML_ATTRS[type]) {
        for (var i = 0, items = iter$(attrs.split(" ")), len = items.length; i < len; i++) {
          Imba.attr(klass, items[i]);
        }

        ;
      }

      ;

      if (props = Imba.HTML_PROPS[type]) {
        for (var _i2 = 0, _items = iter$(props.split(" ")), _len = _items.length; _i2 < _len; _i2++) {
          Imba.attr(klass, _items[_i2], {
            dom: true
          });
        }

        ;
      }

      ;
    }

    ;
  }

  ;
  return klass;
};

Imba.createElement = function (name, ctx, ref, pref) {
  var type = name;
  var parent;

  if (name instanceof Function) {
    type = name;
  } else {
    if (null) {}

    ;
    type = Imba.TAGS.findTagType(name);
  }

  ;

  if (ctx instanceof TagMap) {
    parent = ctx.par$;
  } else if (pref instanceof Imba.Tag) {
    parent = pref;
  } else {
    parent = ctx && pref != undefined ? ctx[pref] : ctx && ctx._tag || ctx;
  }

  ;
  var node = type.build(parent);

  if (ctx instanceof TagMap) {
    ctx.i$++;
    node.$key = ref;
  }

  ;

  if (ctx && ref != undefined) {
    ctx[ref] = node;
  }

  ;
  return node;
};

Imba.createTagCache = function (owner) {
  var item = [];
  item._tag = owner;
  return item;
  var par = this.pref() != undefined ? this.ctx()[this.pref()] : this.ctx()._tag;
  var node = new TagMap(this.ctx(), this.ref(), par);
  this.ctx()[this.ref()] = node;
  return node;
};

Imba.createTagMap = function (ctx, ref, pref) {
  var par = pref != undefined ? pref : ctx._tag;
  var node = new TagMap(ctx, ref, par);
  ctx[ref] = node;
  return node;
};

Imba.createTagList = function (ctx, ref, pref) {
  var node = [];
  node._type = 4;
  node._tag = pref != undefined ? pref : ctx._tag;
  ctx[ref] = node;
  return node;
};

Imba.createTagLoopResult = function (ctx, ref, pref) {
  var node = [];
  node._type = 5;
  node.cache = {
    i$: 0
  };
  return node;
};

function TagCache(owner) {
  this._tag = owner;
  this;
}

;

TagCache.build = function (owner) {
  var item = [];
  item._tag = owner;
  return item;
};

function TagMap(cache, ref, par) {
  this.cache$ = cache;
  this.key$ = ref;
  this.par$ = par;
  this.i$ = 0;
}

;

TagMap.prototype.$iter = function () {
  var item = [];
  item._type = 5;
  item.cache = this;
  return item;
};

TagMap.prototype.$prune = function (items) {
  var cache = this.cache$;
  var key = this.key$;
  var clone = new TagMap(cache, key, this.par$);

  for (var i = 0, ary = iter$(items), len = ary.length, item; i < len; i++) {
    item = ary[i];
    clone[item.key$] = item;
  }

  ;
  clone.i$ = items.length;
  return cache[key] = clone;
};

Imba.TagMap = TagMap;
Imba.TagCache = TagCache;
Imba.SINGLETONS = {};
Imba.TAGS = new Imba.Tags();
Imba.TAGS.element = Imba.TAGS.htmlelement = Imba.Tag;
Imba.TAGS['svg:element'] = Imba.SVGTag;

Imba.defineTag = function (name, supr, body) {
  if (body == undefined && typeof supr == 'function') body = supr, supr = '';
  if (supr == undefined) supr = '';
  return Imba.TAGS.defineTag(name, supr, body);
};

Imba.defineSingletonTag = function (id, supr, body) {
  if (body == undefined && typeof supr == 'function') body = supr, supr = 'div';
  if (supr == undefined) supr = 'div';
  return Imba.TAGS.defineTag(this.name(), supr, body);
};

Imba.extendTag = function (name, body) {
  return Imba.TAGS.extendTag(name, body);
};

Imba.getTagSingleton = function (id) {
  var klass;
  var dom, node;

  if (klass = Imba.SINGLETONS[id]) {
    if (klass && klass.Instance) {
      return klass.Instance;
    }

    ;

    if (dom = Imba.document().getElementById(id)) {
      // we have a live instance - when finding it through a selector we should awake it, no?
      // console.log('creating the singleton from existing node in dom?',id,type)
      node = klass.Instance = new klass(dom);
      node.awaken(dom);
      return node;
    }

    ;
    dom = klass.createNode();
    dom.id = id;
    node = klass.Instance = new klass(dom);
    node.end().awaken(dom);
    return node;
  } else if (dom = Imba.document().getElementById(id)) {
    return Imba.getTagForDom(dom);
  }

  ;
};

var svgSupport = typeof SVGElement !== 'undefined';

Imba.getTagForDom = function (dom) {
  if (!dom) {
    return null;
  }

  ;

  if (dom._dom) {
    return dom;
  }

  ;

  if (dom._tag) {
    return dom._tag;
  }

  ;

  if (!dom.nodeName) {
    return null;
  }

  ;
  var name = dom.nodeName.toLowerCase();
  var type = name;
  var ns = Imba.TAGS;

  if (dom.id && Imba.SINGLETONS[dom.id]) {
    return Imba.getTagSingleton(dom.id);
  }

  ;

  if (svgSupport && dom instanceof SVGElement) {
    type = ns.findTagType("svg:" + name);
  } else if (Imba.HTML_TAGS.indexOf(name) >= 0) {
    type = ns.findTagType(name);
  } else {
    type = Imba.Tag;
  }

  ;
  return new type(dom, null).awaken(dom);
};

if (true && false && document) {
  var styles = window.getComputedStyle(document.documentElement, '');

  for (var i = 0, items = iter$(styles), len = items.length, prefixed; i < len; i++) {
    prefixed = items[i];
    var unprefixed = prefixed.replace(/^-(webkit|ms|moz|o|blink)-/, '');
    var camelCase = unprefixed.replace(/-(\w)/g, function (m, a) {
      return a.toUpperCase();
    });

    if (prefixed != unprefixed) {
      if (styles.hasOwnProperty(unprefixed)) {
        continue;
      }

      ;
    }

    ;
    Imba.CSSKeyMap[unprefixed] = Imba.CSSKeyMap[camelCase] = prefixed;
  }

  ;

  if (!document.documentElement.classList) {
    Imba.extendTag('element', function (tag) {
      tag.prototype.hasFlag = function (ref) {
        return new RegExp('(^|\\s)' + ref + '(\\s|$)').test(this._dom.className);
      };

      tag.prototype.addFlag = function (ref) {
        if (this.hasFlag(ref)) {
          return this;
        }

        ;
        this._dom.className += (this._dom.className ? ' ' : '') + ref;
        return this;
      };

      tag.prototype.unflag = function (ref) {
        if (!this.hasFlag(ref)) {
          return this;
        }

        ;
        var regex = new RegExp('(^|\\s)*' + ref + '(\\s|$)*', 'g');
        this._dom.className = this._dom.className.replace(regex, '');
        return this;
      };

      tag.prototype.toggleFlag = function (ref) {
        return this.hasFlag(ref) ? this.unflag(ref) : this.flag(ref);
      };

      tag.prototype.flag = function (ref, bool) {
        if (arguments.length == 2 && !!bool === false) {
          return this.unflag(ref);
        }

        ;
        return this.addFlag(ref);
      };
    });
  }

  ;
}

;
Imba.Tag;
},{"../imba":"node_modules/imba/src/imba/imba.imba"}],"node_modules/imba/src/imba/dom/html.imba":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function iter$(a) {
  return a ? a.toArray ? a.toArray() : a : [];
}

;

var Imba = require("../imba");

Imba.defineTag('fragment', 'element', function (tag) {
  tag.createNode = function () {
    return Imba.document().createDocumentFragment();
  };
});
Imba.extendTag('html', function (tag) {
  tag.prototype.parent = function () {
    return null;
  };
});
Imba.extendTag('canvas', function (tag) {
  tag.prototype.context = function (type) {
    if (type === undefined) type = '2d';
    return this.dom().getContext(type);
  };
});

function DataProxy(node, path, args) {
  this._node = node;
  this._path = path;
  this._args = args;

  if (this._args) {
    this._setter = Imba.toSetter(this._path);
  }

  ;
}

;

DataProxy.bind = function (receiver, data, path, args) {
  var proxy = receiver._data || (receiver._data = new this(receiver, path, args));
  proxy.bind(data, path, args);
  return receiver;
};

DataProxy.prototype.bind = function (data, key, args) {
  if (data != this._data) {
    this._data = data;
  }

  ;
  return this;
};

DataProxy.prototype.getFormValue = function () {
  return this._setter ? this._data[this._path]() : this._data[this._path];
};

DataProxy.prototype.setFormValue = function (value) {
  return this._setter ? this._data[this._setter](value) : this._data[this._path] = value;
};

var isArray = function isArray(val) {
  return val && val.splice && val.sort;
};

var isSimilarArray = function isSimilarArray(a, b) {
  var l = a.length,
      i = 0;

  if (l != b.length) {
    return false;
  }

  ;

  while (i++ < l) {
    if (a[i] != b[i]) {
      return false;
    }

    ;
  }

  ;
  return true;
};

Imba.extendTag('input', function (tag) {
  tag.prototype.lazy = function (v) {
    return this._lazy;
  };

  tag.prototype.setLazy = function (v) {
    this._lazy = v;
    return this;
  };

  tag.prototype.number = function (v) {
    return this._number;
  };

  tag.prototype.setNumber = function (v) {
    this._number = v;
    return this;
  };

  tag.prototype.bindData = function (target, path, args) {
    DataProxy.bind(this, target, path, args);
    return this;
  };

  tag.prototype.checked = function () {
    return this._dom.checked;
  };

  tag.prototype.setChecked = function (value) {
    if (!!value != this._dom.checked) {
      this._dom.checked = !!value;
    }

    ;
    return this;
  };

  tag.prototype.setValue = function (value, source) {
    if (this._localValue == undefined || source == undefined) {
      this.dom().value = this._value = value;
      this._localValue = undefined;
    }

    ;
    return this;
  };

  tag.prototype.setType = function (value) {
    this.dom().type = this._type = value;
    return this;
  };

  tag.prototype.value = function () {
    var val = this._dom.value;
    return this._number && val ? parseFloat(val) : val;
  };

  tag.prototype.oninput = function (e) {
    var val = this._dom.value;
    this._localValue = val;

    if (this._data && !this.lazy() && this.type() != 'radio' && this.type() != 'checkbox') {
      this._data.setFormValue(this.value(), this);
    }

    ;
    return;
  };

  tag.prototype.onchange = function (e) {
    this._modelValue = this._localValue = undefined;

    if (!this.data()) {
      return;
    }

    ;

    if (this.type() == 'radio' || this.type() == 'checkbox') {
      var checked = this.checked();

      var mval = this._data.getFormValue(this);

      var dval = this._value != undefined ? this._value : this.value();

      if (this.type() == 'radio') {
        return this._data.setFormValue(dval, this);
      } else if (this.dom().value == 'on' || this.dom().value == undefined) {
        return this._data.setFormValue(!!checked, this);
      } else if (isArray(mval)) {
        var idx = mval.indexOf(dval);

        if (checked && idx == -1) {
          return mval.push(dval);
        } else if (!checked && idx >= 0) {
          return mval.splice(idx, 1);
        }

        ;
      } else {
        return this._data.setFormValue(dval, this);
      }

      ;
    } else {
      return this._data.setFormValue(this.value());
    }

    ;
  };

  tag.prototype.onblur = function (e) {
    return this._localValue = undefined;
  };

  tag.prototype.end = function () {
    if (this._localValue !== undefined || !this._data) {
      return this;
    }

    ;

    var mval = this._data.getFormValue(this);

    if (mval == this._modelValue) {
      return this;
    }

    ;

    if (!isArray(mval)) {
      this._modelValue = mval;
    }

    ;

    if (this.type() == 'radio' || this.type() == 'checkbox') {
      var dval = this._value;
      var checked = isArray(mval) ? mval.indexOf(dval) >= 0 : this.dom().value == 'on' || this.dom().value == undefined ? !!mval : mval == this._value;
      this.setChecked(checked);
    } else {
      this._dom.value = mval;
    }

    ;
    return this;
  };
});
Imba.extendTag('textarea', function (tag) {
  tag.prototype.lazy = function (v) {
    return this._lazy;
  };

  tag.prototype.setLazy = function (v) {
    this._lazy = v;
    return this;
  };

  tag.prototype.bindData = function (target, path, args) {
    DataProxy.bind(this, target, path, args);
    return this;
  };

  tag.prototype.setValue = function (value, source) {
    if (this._localValue == undefined || source == undefined) {
      this.dom().value = value;
      this._localValue = undefined;
    }

    ;
    return this;
  };

  tag.prototype.oninput = function (e) {
    var val = this._dom.value;
    this._localValue = val;

    if (this._data && !this.lazy()) {
      return this._data.setFormValue(this.value(), this);
    }

    ;
  };

  tag.prototype.onchange = function (e) {
    this._localValue = undefined;

    if (this._data) {
      return this._data.setFormValue(this.value(), this);
    }

    ;
  };

  tag.prototype.onblur = function (e) {
    return this._localValue = undefined;
  };

  tag.prototype.render = function () {
    if (this._localValue != undefined || !this._data) {
      return;
    }

    ;

    if (this._data) {
      var dval = this._data.getFormValue(this);

      this._dom.value = dval != undefined ? dval : '';
    }

    ;
    return this;
  };
});
Imba.extendTag('option', function (tag) {
  tag.prototype.setValue = function (value) {
    if (value != this._value) {
      this.dom().value = this._value = value;
    }

    ;
    return this;
  };

  tag.prototype.value = function () {
    return this._value || this.dom().value;
  };
});
Imba.extendTag('select', function (tag) {
  tag.prototype.bindData = function (target, path, args) {
    DataProxy.bind(this, target, path, args);
    return this;
  };

  tag.prototype.setValue = function (value, syncing) {
    var prev = this._value;
    this._value = value;

    if (!syncing) {
      this.syncValue(value);
    }

    ;
    return this;
  };

  tag.prototype.syncValue = function (value) {
    var prev = this._syncValue;

    if (this.multiple() && value instanceof Array) {
      if (prev instanceof Array && isSimilarArray(prev, value)) {
        return this;
      }

      ;
      value = value.slice();
    }

    ;
    this._syncValue = value;

    if (_typeof(value) == 'object') {
      var mult = this.multiple() && value instanceof Array;

      for (var i = 0, items = iter$(this.dom().options), len = items.length, opt; i < len; i++) {
        opt = items[i];
        var oval = opt._tag ? opt._tag.value() : opt.value;

        if (mult) {
          opt.selected = value.indexOf(oval) >= 0;
        } else if (value == oval) {
          this.dom().selectedIndex = i;
          break;
        }

        ;
      }

      ;
    } else {
      this.dom().value = value;
    }

    ;
    return this;
  };

  tag.prototype.value = function () {
    if (this.multiple()) {
      var res = [];

      for (var i = 0, items = iter$(this.dom().selectedOptions), len = items.length, option; i < len; i++) {
        option = items[i];
        res.push(option._tag ? option._tag.value() : option.value);
      }

      ;
      return res;
    } else {
      var opt = this.dom().selectedOptions[0];
      return opt ? opt._tag ? opt._tag.value() : opt.value : null;
    }

    ;
  };

  tag.prototype.onchange = function (e) {
    if (this._data) {
      return this._data.setFormValue(this.value(), this);
    }

    ;
  };

  tag.prototype.end = function () {
    if (this._data) {
      this.setValue(this._data.getFormValue(this), 1);
    }

    ;

    if (this._value != this._syncValue) {
      this.syncValue(this._value);
    }

    ;
    return this;
  };
});
},{"../imba":"node_modules/imba/src/imba/imba.imba"}],"node_modules/imba/src/imba/dom/touch.imba":[function(require,module,exports) {
function iter$(a) {
  return a ? a.toArray ? a.toArray() : a : [];
}

;

var Imba = require("../imba");

Imba.Touch = function Touch(event, pointer) {
  // @native  = false
  this.setEvent(event);
  this.setData({});
  this.setActive(true);
  this._button = event && event.button || 0;
  this._suppress = false;
  this._captured = false;
  this.setBubble(false);
  pointer = pointer;
  this.setUpdates(0);
  return this;
};

Imba.Touch.LastTimestamp = 0;
Imba.Touch.TapTimeout = 50;
var touches = [];
var count = 0;
var identifiers = {};

Imba.Touch.count = function () {
  return count;
};

Imba.Touch.lookup = function (item) {
  return item && (item.__touch__ || identifiers[item.identifier]);
};

Imba.Touch.release = function (item, touch) {
  var v_, $1;
  v_ = identifiers[item.identifier], delete identifiers[item.identifier], v_;
  $1 = item.__touch__, delete item.__touch__, $1;
  return;
};

Imba.Touch.ontouchstart = function (e) {
  for (var i = 0, items = iter$(e.changedTouches), len = items.length, t; i < len; i++) {
    t = items[i];

    if (this.lookup(t)) {
      continue;
    }

    ;
    var touch = identifiers[t.identifier] = new this(e);
    t.__touch__ = touch;
    touches.push(touch);
    count++;
    touch.touchstart(e, t);
  }

  ;
  return this;
};

Imba.Touch.ontouchmove = function (e) {
  var touch;

  for (var i = 0, items = iter$(e.changedTouches), len = items.length, t; i < len; i++) {
    t = items[i];

    if (touch = this.lookup(t)) {
      touch.touchmove(e, t);
    }

    ;
  }

  ;
  return this;
};

Imba.Touch.ontouchend = function (e) {
  var touch;

  for (var i = 0, items = iter$(e.changedTouches), len = items.length, t; i < len; i++) {
    t = items[i];

    if (touch = this.lookup(t)) {
      touch.touchend(e, t);
      this.release(t, touch);
      count--;
    }

    ;
  }

  ;
  return this;
};

Imba.Touch.ontouchcancel = function (e) {
  var touch;

  for (var i = 0, items = iter$(e.changedTouches), len = items.length, t; i < len; i++) {
    t = items[i];

    if (touch = this.lookup(t)) {
      touch.touchcancel(e, t);
      this.release(t, touch);
      count--;
    }

    ;
  }

  ;
  return this;
};

Imba.Touch.onmousedown = function (e) {
  return this;
};

Imba.Touch.onmousemove = function (e) {
  return this;
};

Imba.Touch.onmouseup = function (e) {
  return this;
};

Imba.Touch.prototype.phase = function (v) {
  return this._phase;
};

Imba.Touch.prototype.setPhase = function (v) {
  this._phase = v;
  return this;
};

Imba.Touch.prototype.active = function (v) {
  return this._active;
};

Imba.Touch.prototype.setActive = function (v) {
  this._active = v;
  return this;
};

Imba.Touch.prototype.event = function (v) {
  return this._event;
};

Imba.Touch.prototype.setEvent = function (v) {
  this._event = v;
  return this;
};

Imba.Touch.prototype.pointer = function (v) {
  return this._pointer;
};

Imba.Touch.prototype.setPointer = function (v) {
  this._pointer = v;
  return this;
};

Imba.Touch.prototype.target = function (v) {
  return this._target;
};

Imba.Touch.prototype.setTarget = function (v) {
  this._target = v;
  return this;
};

Imba.Touch.prototype.handler = function (v) {
  return this._handler;
};

Imba.Touch.prototype.setHandler = function (v) {
  this._handler = v;
  return this;
};

Imba.Touch.prototype.updates = function (v) {
  return this._updates;
};

Imba.Touch.prototype.setUpdates = function (v) {
  this._updates = v;
  return this;
};

Imba.Touch.prototype.suppress = function (v) {
  return this._suppress;
};

Imba.Touch.prototype.setSuppress = function (v) {
  this._suppress = v;
  return this;
};

Imba.Touch.prototype.data = function (v) {
  return this._data;
};

Imba.Touch.prototype.setData = function (v) {
  this._data = v;
  return this;
};

Imba.Touch.prototype.__bubble = {
  chainable: true,
  name: 'bubble'
};

Imba.Touch.prototype.bubble = function (v) {
  return v !== undefined ? (this.setBubble(v), this) : this._bubble;
};

Imba.Touch.prototype.setBubble = function (v) {
  this._bubble = v;
  return this;
};

Imba.Touch.prototype.timestamp = function (v) {
  return this._timestamp;
};

Imba.Touch.prototype.setTimestamp = function (v) {
  this._timestamp = v;
  return this;
};

Imba.Touch.prototype.gestures = function (v) {
  return this._gestures;
};

Imba.Touch.prototype.setGestures = function (v) {
  this._gestures = v;
  return this;
};

Imba.Touch.prototype.capture = function () {
  this._captured = true;
  this._event && this._event.stopPropagation();

  if (!this._selblocker) {
    this._selblocker = function (e) {
      return e.preventDefault();
    };

    Imba.document().addEventListener('selectstart', this._selblocker, true);
  }

  ;
  return this;
};

Imba.Touch.prototype.isCaptured = function () {
  return !!this._captured;
};

Imba.Touch.prototype.extend = function (plugin) {
  // console.log "added gesture!!!"
  this._gestures || (this._gestures = []);

  this._gestures.push(plugin);

  return this;
};

Imba.Touch.prototype.redirect = function (target) {
  this._redirect = target;
  return this;
};

Imba.Touch.prototype.suppress = function () {
  // collision with the suppress property
  this._active = false;
  return this;
};

Imba.Touch.prototype.setSuppress = function (value) {
  console.warn('Imba.Touch#suppress= is deprecated');
  this._supress = value;
  this;
  return this;
};

Imba.Touch.prototype.touchstart = function (e, t) {
  this._event = e;
  this._touch = t;
  this._button = 0;
  this._x = t.clientX;
  this._y = t.clientY;
  this.began();
  this.update();

  if (e && this.isCaptured()) {
    e.preventDefault();
  }

  ;
  return this;
};

Imba.Touch.prototype.touchmove = function (e, t) {
  this._event = e;
  this._x = t.clientX;
  this._y = t.clientY;
  this.update();

  if (e && this.isCaptured()) {
    e.preventDefault();
  }

  ;
  return this;
};

Imba.Touch.prototype.touchend = function (e, t) {
  this._event = e;
  this._x = t.clientX;
  this._y = t.clientY;
  this.ended();
  Imba.Touch.LastTimestamp = e.timeStamp;

  if (this._maxdr < 20) {
    var tap = new Imba.Event(e);
    tap.setType('tap');
    tap.process();
  }

  ;

  if (e && this.isCaptured()) {
    e.preventDefault();
  }

  ;
  return this;
};

Imba.Touch.prototype.touchcancel = function (e, t) {
  return this.cancel();
};

Imba.Touch.prototype.mousedown = function (e, t) {
  var self = this;
  self._event = e;
  self._button = e.button;
  self._x = t.clientX;
  self._y = t.clientY;
  self.began();
  self.update();

  self._mousemove = function (e) {
    return self.mousemove(e, e);
  };

  Imba.document().addEventListener('mousemove', self._mousemove, true);
  return self;
};

Imba.Touch.prototype.mousemove = function (e, t) {
  this._x = t.clientX;
  this._y = t.clientY;
  this._event = e;

  if (this.isCaptured()) {
    e.preventDefault();
  }

  ;
  this.update();
  this.move();
  return this;
};

Imba.Touch.prototype.mouseup = function (e, t) {
  this._x = t.clientX;
  this._y = t.clientY;
  this.ended();
  return this;
};

Imba.Touch.prototype.idle = function () {
  return this.update();
};

Imba.Touch.prototype.began = function () {
  this._timestamp = Date.now();
  this._maxdr = this._dr = 0;
  this._x0 = this._x;
  this._y0 = this._y;
  var dom = this.event().target;
  var node = null;
  this._sourceTarget = dom && Imba.getTagForDom(dom);

  while (dom) {
    node = Imba.getTagForDom(dom);

    if (node && node.ontouchstart) {
      this._bubble = false;
      this.setTarget(node);
      this.target().ontouchstart(this);

      if (!this._bubble) {
        break;
      }

      ;
    }

    ;
    dom = dom.parentNode;
  }

  ;
  this._updates++;
  return this;
};

Imba.Touch.prototype.update = function () {
  var target_;

  if (!this._active || this._cancelled) {
    return this;
  }

  ;
  var dr = Math.sqrt(this.dx() * this.dx() + this.dy() * this.dy());

  if (dr > this._dr) {
    this._maxdr = dr;
  }

  ;
  this._dr = dr;

  if (this._redirect) {
    if (this._target && this._target.ontouchcancel) {
      this._target.ontouchcancel(this);
    }

    ;
    this.setTarget(this._redirect);
    this._redirect = null;

    if (this.target().ontouchstart) {
      this.target().ontouchstart(this);
    }

    ;

    if (this._redirect) {
      return this.update();
    }

    ;
  }

  ;
  this._updates++;

  if (this._gestures) {
    for (var i = 0, items = iter$(this._gestures), len = items.length; i < len; i++) {
      items[i].ontouchupdate(this);
    }

    ;
  }

  ;
  (target_ = this.target()) && target_.ontouchupdate && target_.ontouchupdate(this);
  if (this._redirect) this.update();
  return this;
};

Imba.Touch.prototype.move = function () {
  var target_;

  if (!this._active || this._cancelled) {
    return this;
  }

  ;

  if (this._gestures) {
    for (var i = 0, items = iter$(this._gestures), len = items.length, g; i < len; i++) {
      g = items[i];

      if (g.ontouchmove) {
        g.ontouchmove(this, this._event);
      }

      ;
    }

    ;
  }

  ;
  (target_ = this.target()) && target_.ontouchmove && target_.ontouchmove(this, this._event);
  return this;
};

Imba.Touch.prototype.ended = function () {
  var target_;

  if (!this._active || this._cancelled) {
    return this;
  }

  ;
  this._updates++;

  if (this._gestures) {
    for (var i = 0, items = iter$(this._gestures), len = items.length; i < len; i++) {
      items[i].ontouchend(this);
    }

    ;
  }

  ;
  (target_ = this.target()) && target_.ontouchend && target_.ontouchend(this);
  this.cleanup_();
  return this;
};

Imba.Touch.prototype.cancel = function () {
  if (!this._cancelled) {
    this._cancelled = true;
    this.cancelled();
    this.cleanup_();
  }

  ;
  return this;
};

Imba.Touch.prototype.cancelled = function () {
  var target_;

  if (!this._active) {
    return this;
  }

  ;
  this._cancelled = true;
  this._updates++;

  if (this._gestures) {
    for (var i = 0, items = iter$(this._gestures), len = items.length, g; i < len; i++) {
      g = items[i];

      if (g.ontouchcancel) {
        g.ontouchcancel(this);
      }

      ;
    }

    ;
  }

  ;
  (target_ = this.target()) && target_.ontouchcancel && target_.ontouchcancel(this);
  return this;
};

Imba.Touch.prototype.cleanup_ = function () {
  if (this._mousemove) {
    Imba.document().removeEventListener('mousemove', this._mousemove, true);
    this._mousemove = null;
  }

  ;

  if (this._selblocker) {
    Imba.document().removeEventListener('selectstart', this._selblocker, true);
    this._selblocker = null;
  }

  ;
  return this;
};

Imba.Touch.prototype.dr = function () {
  return this._dr;
};

Imba.Touch.prototype.dx = function () {
  return this._x - this._x0;
};

Imba.Touch.prototype.dy = function () {
  return this._y - this._y0;
};

Imba.Touch.prototype.x0 = function () {
  return this._x0;
};

Imba.Touch.prototype.y0 = function () {
  return this._y0;
};

Imba.Touch.prototype.x = function () {
  return this._x;
};

Imba.Touch.prototype.y = function () {
  return this._y;
};

Imba.Touch.prototype.tx = function () {
  this._targetBox || (this._targetBox = this._target.dom().getBoundingClientRect());
  return this._x - this._targetBox.left;
};

Imba.Touch.prototype.ty = function () {
  this._targetBox || (this._targetBox = this._target.dom().getBoundingClientRect());
  return this._y - this._targetBox.top;
};

Imba.Touch.prototype.button = function () {
  return this._button;
};

Imba.Touch.prototype.sourceTarget = function () {
  return this._sourceTarget;
};

Imba.Touch.prototype.elapsed = function () {
  return Date.now() - this._timestamp;
};

Imba.TouchGesture = function TouchGesture() {};

Imba.TouchGesture.prototype.__active = {
  'default': false,
  name: 'active'
};

Imba.TouchGesture.prototype.active = function (v) {
  return this._active;
};

Imba.TouchGesture.prototype.setActive = function (v) {
  this._active = v;
  return this;
};

Imba.TouchGesture.prototype._active = false;

Imba.TouchGesture.prototype.ontouchstart = function (e) {
  return this;
};

Imba.TouchGesture.prototype.ontouchupdate = function (e) {
  return this;
};

Imba.TouchGesture.prototype.ontouchend = function (e) {
  return this;
};
},{"../imba":"node_modules/imba/src/imba/imba.imba"}],"node_modules/imba/src/imba/dom/event.imba":[function(require,module,exports) {
function iter$(a) {
  return a ? a.toArray ? a.toArray() : a : [];
}

;

var Imba = require("../imba");

var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  down: 40
};
var el = Imba.Tag.prototype;

el.stopModifier = function (e) {
  return e.stop() || true;
};

el.preventModifier = function (e) {
  return e.prevent() || true;
};

el.silenceModifier = function (e) {
  return e.silence() || true;
};

el.bubbleModifier = function (e) {
  return e.bubble(true) || true;
};

el.ctrlModifier = function (e) {
  return e.event().ctrlKey == true;
};

el.altModifier = function (e) {
  return e.event().altKey == true;
};

el.shiftModifier = function (e) {
  return e.event().shiftKey == true;
};

el.metaModifier = function (e) {
  return e.event().metaKey == true;
};

el.keyModifier = function (key, e) {
  return e.keyCode() ? e.keyCode() == key : true;
};

el.delModifier = function (e) {
  return e.keyCode() ? e.keyCode() == 8 || e.keyCode() == 46 : true;
};

el.selfModifier = function (e) {
  return e.event().target == this._dom;
};

el.leftModifier = function (e) {
  return e.button() != undefined ? e.button() === 0 : el.keyModifier(37, e);
};

el.rightModifier = function (e) {
  return e.button() != undefined ? e.button() === 2 : el.keyModifier(39, e);
};

el.middleModifier = function (e) {
  return e.button() != undefined ? e.button() === 1 : true;
};

el.getHandler = function (str, event) {
  if (this[str]) {
    return this;
  }

  ;
};

Imba.Event = function Event(e) {
  this.setEvent(e);
  this._bubble = true;
};

Imba.Event.prototype.event = function (v) {
  return this._event;
};

Imba.Event.prototype.setEvent = function (v) {
  this._event = v;
  return this;
};

Imba.Event.prototype.prefix = function (v) {
  return this._prefix;
};

Imba.Event.prototype.setPrefix = function (v) {
  this._prefix = v;
  return this;
};

Imba.Event.prototype.source = function (v) {
  return this._source;
};

Imba.Event.prototype.setSource = function (v) {
  this._source = v;
  return this;
};

Imba.Event.prototype.data = function (v) {
  return this._data;
};

Imba.Event.prototype.setData = function (v) {
  this._data = v;
  return this;
};

Imba.Event.prototype.responder = function (v) {
  return this._responder;
};

Imba.Event.prototype.setResponder = function (v) {
  this._responder = v;
  return this;
};

Imba.Event.wrap = function (e) {
  return new this(e);
};

Imba.Event.prototype.setType = function (type) {
  this._type = type;
  this;
  return this;
};

Imba.Event.prototype.type = function () {
  return this._type || this.event().type;
};

Imba.Event.prototype.native = function () {
  return this._event;
};

Imba.Event.prototype.name = function () {
  return this._name || (this._name = this.type().toLowerCase().replace(/\:/g, ''));
};

Imba.Event.prototype.bubble = function (v) {
  if (v != undefined) {
    this.setBubble(v);
    return this;
  }

  ;
  return this._bubble;
};

Imba.Event.prototype.setBubble = function (v) {
  this._bubble = v;
  return this;
  return this;
};

Imba.Event.prototype.stop = function () {
  this.setBubble(false);
  return this;
};

Imba.Event.prototype.stopPropagation = function () {
  return this.stop();
};

Imba.Event.prototype.halt = function () {
  return this.stop();
};

Imba.Event.prototype.prevent = function () {
  if (this.event().preventDefault) {
    this.event().preventDefault();
  } else {
    this.event().defaultPrevented = true;
  }

  ;
  this.defaultPrevented = true;
  return this;
};

Imba.Event.prototype.preventDefault = function () {
  console.warn("Event#preventDefault is deprecated - use Event#prevent");
  return this.prevent();
};

Imba.Event.prototype.isPrevented = function () {
  return this.event() && this.event().defaultPrevented;
};

Imba.Event.prototype.cancel = function () {
  console.warn("Event#cancel is deprecated - use Event#prevent");
  return this.prevent();
};

Imba.Event.prototype.silence = function () {
  this._silenced = true;
  return this;
};

Imba.Event.prototype.isSilenced = function () {
  return !!this._silenced;
};

Imba.Event.prototype.target = function () {
  return Imba.getTagForDom(this.event()._target || this.event().target);
};

Imba.Event.prototype.responder = function () {
  return this._responder;
};

Imba.Event.prototype.redirect = function (node) {
  this._redirect = node;
  return this;
};

Imba.Event.prototype.processHandlers = function (node, handlers) {
  var i = 1;
  var l = handlers.length;
  var bubble = this._bubble;
  var state = handlers.state || (handlers.state = {});
  var result;

  if (bubble) {
    this._bubble = 1;
  }

  ;

  while (i < l) {
    var isMod = false;
    var handler = handlers[i++];
    var params = null;
    var context = node;

    if (handler instanceof Array) {
      params = handler.slice(1);
      handler = handler[0];
    }

    ;

    if (typeof handler == 'string') {
      if (keyCodes[handler]) {
        params = [keyCodes[handler]];
        handler = 'key';
      }

      ;
      var mod = handler + 'Modifier';

      if (node[mod]) {
        isMod = true;
        params = (params || []).concat([this, state]);
        handler = node[mod];
      }

      ;
    }

    ;

    if (typeof handler == 'string') {
      var _el = node;
      var fn = null;
      var ctx = state.context;

      if (ctx) {
        if (ctx.getHandler instanceof Function) {
          ctx = ctx.getHandler(handler, this);
        }

        ;

        if (ctx[handler] instanceof Function) {
          handler = fn = ctx[handler];
          context = ctx;
        }

        ;
      }

      ;

      if (!fn) {
        console.warn("event " + this.type() + ": could not find '" + handler + "' in context", ctx);
      }

      ;
    }

    ;

    if (handler instanceof Function) {
      // what if we actually call stop inside function?
      // do we still want to continue the chain?
      var res = handler.apply(context, params || [this]);

      if (!isMod) {
        this._responder || (this._responder = node);
      }

      ;

      if (res == false) {
        // console.log "returned false - breaking"
        break;
      }

      ;

      if (res && !this._silenced && res.then instanceof Function) {
        res.then(Imba.commit);
      }

      ;
    }

    ;
  }

  ;

  if (this._bubble === 1) {
    this._bubble = bubble;
  }

  ;
  return null;
};

Imba.Event.prototype.process = function () {
  var name = this.name();
  var meth = "on" + (this._prefix || '') + name;
  var args = null;
  var domtarget = this.event()._target || this.event().target;
  var domnode = domtarget._responder || domtarget;
  var result;
  var handlers;

  while (domnode) {
    this._redirect = null;
    var node = domnode._dom ? domnode : domnode._tag;

    if (node) {
      if (handlers = node._on_) {
        for (var i = 0, items = iter$(handlers), len = items.length, handler; i < len; i++) {
          handler = items[i];

          if (!handler) {
            continue;
          }

          ;
          var hname = handler[0];

          if (name == handler[0] && this.bubble()) {
            this.processHandlers(node, handler);
          }

          ;
        }

        ;

        if (!this.bubble()) {
          break;
        }

        ;
      }

      ;

      if (this.bubble() && node[meth] instanceof Function) {
        this._responder || (this._responder = node);
        this._silenced = false;
        result = args ? node[meth].apply(node, args) : node[meth](this, this.data());
      }

      ;

      if (node.onevent) {
        node.onevent(this);
      }

      ;
    }

    ;

    if (!(this.bubble() && (domnode = this._redirect || (node ? node.parent() : domnode.parentNode)))) {
      break;
    }

    ;
  }

  ;
  this.processed();

  if (result && result.then instanceof Function) {
    result.then(this.processed.bind(this));
  }

  ;
  return this;
};

Imba.Event.prototype.processed = function () {
  if (!this._silenced && this._responder) {
    Imba.emit(Imba, 'event', [this]);
    Imba.commit(this.event());
  }

  ;
  return this;
};

Imba.Event.prototype.x = function () {
  return this.native().x;
};

Imba.Event.prototype.y = function () {
  return this.native().y;
};

Imba.Event.prototype.button = function () {
  return this.native().button;
};

Imba.Event.prototype.keyCode = function () {
  return this.native().keyCode;
};

Imba.Event.prototype.ctrl = function () {
  return this.native().ctrlKey;
};

Imba.Event.prototype.alt = function () {
  return this.native().altKey;
};

Imba.Event.prototype.shift = function () {
  return this.native().shiftKey;
};

Imba.Event.prototype.meta = function () {
  return this.native().metaKey;
};

Imba.Event.prototype.key = function () {
  return this.native().key;
};

Imba.Event.prototype.which = function () {
  return this.event().which;
};
},{"../imba":"node_modules/imba/src/imba/imba.imba"}],"node_modules/imba/src/imba/dom/reconciler.imba":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function iter$(a) {
  return a ? a.toArray ? a.toArray() : a : [];
}

;
var self = {}; // externs;

var Imba = require("../imba");

var removeNested = function removeNested(root, node, caret) {
  // if node/nodes isa String
  // 	we need to use the caret to remove elements
  // 	for now we will simply not support this
  if (node instanceof Array) {
    for (var i = 0, items = iter$(node), len = items.length; i < len; i++) {
      removeNested(root, items[i], caret);
    }

    ;
  } else if (node && node._slot_) {
    root.removeChild(node);
  } else if (node != null) {
    // what if this is not null?!?!?
    // take a chance and remove a text-elementng
    var next = caret ? caret.nextSibling : root._dom.firstChild;

    if (next instanceof Text && next.textContent == node) {
      root.removeChild(next);
    } else {
      throw 'cannot remove string';
    }

    ;
  }

  ;
  return caret;
};

var appendNested = function appendNested(root, node) {
  if (node instanceof Array) {
    var i = 0;
    var c = node.taglen;
    var k = c != null ? node.domlen = c : node.length;

    while (i < k) {
      appendNested(root, node[i++]);
    }

    ;
  } else if (node && node._dom) {
    root.appendChild(node);
  } else if (node != null && node !== false) {
    root.appendChild(Imba.createTextNode(node));
  }

  ;
  return;
};

var insertNestedBefore = function insertNestedBefore(root, node, before) {
  if (node instanceof Array) {
    var i = 0;
    var c = node.taglen;
    var k = c != null ? node.domlen = c : node.length;

    while (i < k) {
      insertNestedBefore(root, node[i++], before);
    }

    ;
  } else if (node && node._dom) {
    root.insertBefore(node, before);
  } else if (node != null && node !== false) {
    root.insertBefore(Imba.createTextNode(node), before);
  }

  ;
  return before;
};

self.insertNestedAfter = function (root, node, after) {
  var before = after ? after.nextSibling : root._dom.firstChild;

  if (before) {
    insertNestedBefore(root, node, before);
    return before.previousSibling;
  } else {
    appendNested(root, node);
    return root._dom.lastChild;
  }

  ;
};

var reconcileCollectionChanges = function reconcileCollectionChanges(root, new$, old, caret) {
  var newLen = new$.length;
  var lastNew = new$[newLen - 1];
  var newPosition = [];
  var prevChain = [];
  var lengthChain = [];
  var maxChainLength = 0;
  var maxChainEnd = 0;
  var hasTextNodes = false;
  var newPos;

  for (var idx = 0, items = iter$(old), len = items.length, node; idx < len; idx++) {
    // special case for Text nodes
    node = items[idx];

    if (node && node.nodeType == 3) {
      newPos = new$.indexOf(node.textContent);

      if (newPos >= 0) {
        new$[newPos] = node;
      }

      ;
      hasTextNodes = true;
    } else {
      newPos = new$.indexOf(node);
    }

    ;
    newPosition.push(newPos);

    if (newPos == -1) {
      root.removeChild(node);
      prevChain.push(-1);
      lengthChain.push(-1);
      continue;
    }

    ;
    var prevIdx = newPosition.length - 2;

    while (prevIdx >= 0) {
      if (newPosition[prevIdx] == -1) {
        prevIdx--;
      } else if (newPos > newPosition[prevIdx]) {
        // Yay, we're bigger than the previous!
        break;
      } else {
        // Nope, let's walk back the chain
        prevIdx = prevChain[prevIdx];
      }

      ;
    }

    ;
    prevChain.push(prevIdx);
    var currLength = prevIdx == -1 ? 0 : lengthChain[prevIdx] + 1;

    if (currLength > maxChainLength) {
      maxChainLength = currLength;
      maxChainEnd = idx;
    }

    ;
    lengthChain.push(currLength);
  }

  ;
  var stickyNodes = [];
  var cursor = newPosition.length - 1;

  while (cursor >= 0) {
    if (cursor == maxChainEnd && newPosition[cursor] != -1) {
      stickyNodes[newPosition[cursor]] = true;
      maxChainEnd = prevChain[maxChainEnd];
    }

    ;
    cursor -= 1;
  }

  ;

  for (var _idx = 0, _items = iter$(new$), _len = _items.length, _node; _idx < _len; _idx++) {
    _node = _items[_idx];

    if (!stickyNodes[_idx]) {
      // create textnode for string, and update the array
      if (!(_node && _node._dom)) {
        _node = new$[_idx] = Imba.createTextNode(_node);
      }

      ;
      var after = new$[_idx - 1];
      self.insertNestedAfter(root, _node, after && after._slot_ || after || caret);
    }

    ;
    caret = _node._slot_ || caret && caret.nextSibling || root._dom.firstChild;
  }

  ;
  return lastNew && lastNew._slot_ || caret;
};

var reconcileCollection = function reconcileCollection(root, new$, old, caret) {
  var k = new$.length;
  var i = k;
  var last = new$[k - 1];

  if (k == old.length && new$[0] === old[0]) {
    // running through to compare
    while (i--) {
      if (new$[i] !== old[i]) {
        break;
      }

      ;
    }

    ;
  }

  ;

  if (i == -1) {
    return last && last._slot_ || last || caret;
  } else {
    return reconcileCollectionChanges(root, new$, old, caret);
  }

  ;
};

var reconcileLoop = function reconcileLoop(root, new$, old, caret) {
  var nl = new$.length;
  var ol = old.length;
  var cl = new$.cache.i$;
  var i = 0,
      d = nl - ol;

  while (i < ol && i < nl && new$[i] === old[i]) {
    i++;
  }

  ;

  if (cl > 1000 && cl - nl > 500) {
    new$.cache.$prune(new$);
  }

  ;

  if (d > 0 && i == ol) {
    // added at end
    while (i < nl) {
      root.appendChild(new$[i++]);
    }

    ;
    return;
  } else if (d > 0) {
    var i1 = nl;

    while (i1 > i && new$[i1 - 1] === old[i1 - 1 - d]) {
      i1--;
    }

    ;

    if (d == i1 - i) {
      var before = old[i]._slot_;

      while (i < i1) {
        root.insertBefore(new$[i++], before);
      }

      ;
      return;
    }

    ;
  } else if (d < 0 && i == nl) {
    // removed at end
    while (i < ol) {
      root.removeChild(old[i++]);
    }

    ;
    return;
  } else if (d < 0) {
    var _i = ol;

    while (_i > i && new$[_i - 1 + d] === old[_i - 1]) {
      _i--;
    }

    ;

    if (d == i - _i) {
      while (i < _i) {
        root.removeChild(old[i++]);
      }

      ;
      return;
    }

    ;
  } else if (i == nl) {
    return;
  }

  ;
  return reconcileCollectionChanges(root, new$, old, caret);
};

var reconcileIndexedArray = function reconcileIndexedArray(root, array, old, caret) {
  var newLen = array.taglen;
  var prevLen = array.domlen || 0;
  var last = newLen ? array[newLen - 1] : null;

  if (prevLen > newLen) {
    while (prevLen > newLen) {
      var item = array[--prevLen];
      root.removeChild(item._slot_);
    }

    ;
  } else if (newLen > prevLen) {
    // find the item to insert before
    var prevLast = prevLen ? array[prevLen - 1]._slot_ : caret;
    var before = prevLast ? prevLast.nextSibling : root._dom.firstChild;

    while (prevLen < newLen) {
      var node = array[prevLen++];
      before ? root.insertBefore(node._slot_, before) : root.appendChild(node._slot_);
    }

    ;
  }

  ;
  array.domlen = newLen;
  return last ? last._slot_ : caret;
};

var reconcileNested = function reconcileNested(root, new$, old, caret) {
  // var skipnew = new == null or new === false or new === true
  var newIsNull = new$ == null || new$ === false;
  var oldIsNull = old == null || old === false;

  if (new$ === old) {
    // remember that the caret must be an actual dom element
    // we should instead move the actual caret? - trust
    if (newIsNull) {
      return caret;
    } else if (new$._slot_) {
      return new$._slot_;
    } else if (new$ instanceof Array && new$.taglen != null) {
      return reconcileIndexedArray(root, new$, old, caret);
    } else {
      return caret ? caret.nextSibling : root._dom.firstChild;
    }

    ;
  } else if (new$ instanceof Array) {
    if (old instanceof Array) {
      // look for slot instead?
      var typ = new$.static;

      if (typ || old.static) {
        // if the static is not nested - we could get a hint from compiler
        // and just skip it
        if (typ == old.static) {
          // should also include a reference?
          for (var i = 0, items = iter$(new$), len = items.length; i < len; i++) {
            // this is where we could do the triple equal directly
            caret = reconcileNested(root, items[i], old[i], caret);
          }

          ;
          return caret;
        } else {
          removeNested(root, old, caret);
        }

        ;
      } else {
        // Could use optimized loop if we know that it only consists of nodes
        return reconcileCollection(root, new$, old, caret);
      }

      ;
    } else if (!oldIsNull) {
      if (old._slot_) {
        root.removeChild(old);
      } else {
        // old was a string-like object?
        root.removeChild(caret ? caret.nextSibling : root._dom.firstChild);
      }

      ;
    }

    ;
    return self.insertNestedAfter(root, new$, caret);
  } else if (!newIsNull && new$._slot_) {
    if (!oldIsNull) {
      removeNested(root, old, caret);
    }

    ;
    return self.insertNestedAfter(root, new$, caret);
  } else if (newIsNull) {
    if (!oldIsNull) {
      removeNested(root, old, caret);
    }

    ;
    return caret;
  } else {
    // if old did not exist we need to add a new directly
    var nextNode;

    if (old instanceof Array) {
      removeNested(root, old, caret);
    } else if (old && old._slot_) {
      root.removeChild(old);
    } else if (!oldIsNull) {
      // ...
      nextNode = caret ? caret.nextSibling : root._dom.firstChild;

      if (nextNode instanceof Text && nextNode.textContent != new$) {
        nextNode.textContent = new$;
        return nextNode;
      }

      ;
    }

    ;
    return self.insertNestedAfter(root, new$, caret);
  }

  ;
};

Imba.extendTag('element', function (tag) {
  // 1 - static shape - unknown content
  // 2 - static shape and static children
  // 3 - single item
  // 4 - optimized array - only length will change
  // 5 - optimized collection
  // 6 - text only
  tag.prototype.setChildren = function (new$, typ) {
    // if typeof new == 'string'
    // 	return self.text = new
    var old = this._tree_;

    if (new$ === old && (!new$ || new$.taglen == undefined)) {
      return this;
    }

    ;

    if (!old && typ != 3) {
      this.removeAllChildren();
      appendNested(this, new$);
    } else if (typ == 1) {
      var caret = null;

      for (var i = 0, items = iter$(new$), len = items.length; i < len; i++) {
        caret = reconcileNested(this, items[i], old[i], caret);
      }

      ;
    } else if (typ == 2) {
      return this;
    } else if (typ == 3) {
      var ntyp = _typeof(new$);

      if (ntyp != 'object') {
        return this.setText(new$);
      }

      ;

      if (new$ && new$._dom) {
        this.removeAllChildren();
        this.appendChild(new$);
      } else if (new$ instanceof Array) {
        if (new$._type == 5 && old && old._type == 5) {
          reconcileLoop(this, new$, old, null);
        } else if (old instanceof Array) {
          reconcileNested(this, new$, old, null);
        } else {
          this.removeAllChildren();
          appendNested(this, new$);
        }

        ;
      } else {
        return this.setText(new$);
      }

      ;
    } else if (typ == 4) {
      reconcileIndexedArray(this, new$, old, null);
    } else if (typ == 5) {
      reconcileLoop(this, new$, old, null);
    } else if (new$ instanceof Array && old instanceof Array) {
      reconcileNested(this, new$, old, null);
    } else {
      // what if text?
      this.removeAllChildren();
      appendNested(this, new$);
    }

    ;
    this._tree_ = new$;
    return this;
  };

  tag.prototype.content = function () {
    return this._content || this.children().toArray();
  };

  tag.prototype.setText = function (text) {
    if (text != this._tree_) {
      var val = text === null || text === false ? '' : text;
      (this._text_ || this._dom).textContent = val;
      this._text_ || (this._text_ = this._dom.firstChild);
      this._tree_ = text;
    }

    ;
    return this;
  };
});
var proto = Imba.Tag.prototype;
proto.setContent = proto.setChildren;
var apple = typeof navigator != 'undefined' && (navigator.vendor || '').indexOf('Apple') == 0;

if (apple) {
  proto.setText = function (text) {
    if (text != this._tree_) {
      this._dom.textContent = text === null || text === false ? '' : text;
      this._tree_ = text;
    }

    ;
    return this;
  };
}

;
},{"../imba":"node_modules/imba/src/imba/imba.imba"}],"node_modules/imba/src/imba/dom/index.imba":[function(require,module,exports) {
var Imba = require("../imba");

require('./manager');

require('./event-manager');

Imba.TagManager = new Imba.TagManagerClass();

require('./tag');

require('./html');

require('./pointer');

require('./touch');

require('./event');

if (true) {
  require('./reconciler');
}

;

if (false) {}

;
},{"../imba":"node_modules/imba/src/imba/imba.imba","./manager":"node_modules/imba/src/imba/dom/manager.imba","./event-manager":"node_modules/imba/src/imba/dom/event-manager.imba","./tag":"node_modules/imba/src/imba/dom/tag.imba","./html":"node_modules/imba/src/imba/dom/html.imba","./pointer":"node_modules/imba/src/imba/dom/pointer.imba","./touch":"node_modules/imba/src/imba/dom/touch.imba","./event":"node_modules/imba/src/imba/dom/event.imba","./reconciler":"node_modules/imba/src/imba/dom/reconciler.imba"}],"node_modules/imba/src/imba/index.imba":[function(require,module,exports) {
var global = arguments[3];
var Imba = require("./imba");

var activate = false;
var ns = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : null;

if (ns && ns.Imba) {
  console.warn("Imba v" + ns.Imba.VERSION + " is already loaded.");
  Imba = ns.Imba;
} else if (ns) {
  ns.Imba = Imba;
  activate = true;

  if (ns.define && ns.define.amd) {
    ns.define("imba", [], function () {
      return Imba;
    });
  }

  ;
}

;
module.exports = Imba;

if (!false) {
  require('./scheduler');

  require('./dom/index');
}

;

if (activate) {
  Imba.EventManager.activate();
}

;

if (false) {}

;
},{"./imba":"node_modules/imba/src/imba/imba.imba","./scheduler":"node_modules/imba/src/imba/scheduler.imba","./dom/index":"node_modules/imba/src/imba/dom/index.imba"}],"node_modules/imba/imba.imba":[function(require,module,exports) {
module.exports = require("./src/imba/index.imba");
},{"./src/imba/index.imba":"node_modules/imba/src/imba/index.imba"}],"src/components/App.imba":[function(require,module,exports) {
var Imba = require('imba'),
    _1 = Imba.createElement;

var App = Imba.defineTag('App', function (tag) {
  tag.prototype.render = function () {
    var $ = this.$;
    return this.$open(0).setChildren($.$ = $.$ || [_1('div', $, 0, this).flag('header').setContent([_1('img', $, 1, 0).setSrc("./imba-logo.png").setWidth(200), _1('h1', $, 2, 0).flag('title').setText("START NOW")], 2), _1('div', $, 3, this).flag('content').setContent([_1('p', $, 4, 3).flag('title').setText("How to start"), _1('p', $, 5, 3).flag('desc').setContent(["Go to ", $[6] || _1('code', $, 6, 5).setText("./src/client.imba"), " and open it in your code editor."], 2), _1('p', $, 7, 3).flag('desc2').setText("Now, start make something fast.")], 2)], 2).synced(($[1].end(), true));
  };
});
exports.App = App;
},{"imba":"node_modules/imba/imba.imba"}],"C:/Users/Amatarazatas/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"C:/Users/Amatarazatas/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"C:/Users/Amatarazatas/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/styles/index.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"C:/Users/Amatarazatas/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/index.imba":[function(require,module,exports) {
var Imba = require('imba'),
    _1 = Imba.createElement;

if (module.hot) {
  module.hot.dispose(function () {
    return document.body.innerHTML = '';
  });
}

;

var App = require('./components/App').App;

require('./styles/index.scss');

Imba.mount(_1(App).end());
},{"imba":"node_modules/imba/imba.imba","./components/App":"src/components/App.imba","./styles/index.scss":"src/styles/index.scss"}],"C:/Users/Amatarazatas/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "5441" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["C:/Users/Amatarazatas/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.imba"], null)
//# sourceMappingURL=/src.5c592859.map