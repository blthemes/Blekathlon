/* MIT https://github.com/kenwheeler/cash */
(function(){
"use strict";

var doc = document,
    win = window,
    array$Prototype = Array.prototype,
    filter = array$Prototype.filter,
    indexOf = array$Prototype.indexOf,
    map = array$Prototype.map,
    push = array$Prototype.push,
    reverse = array$Prototype.reverse,
    slice = array$Prototype.slice,
    splice = array$Prototype.splice;
var idRe = /^#[\w-]*$/,
    classRe = /^\.[\w-]*$/,
    htmlRe = /<.+>/,
    tagRe = /^\w+$/; // @require ./variables.js

function find(selector, context) {
  if (context === void 0) {
    context = doc;
  }

  return classRe.test(selector) ? context.getElementsByClassName(selector.slice(1)) : tagRe.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector);
} // @require ./find.js
// @require ./variables.js


function Cash(selector, context) {
  if (context === void 0) {
    context = doc;
  }

  if (!selector) return;
  if (selector.__cash) return selector;
  var eles = selector;

  if (isString(selector)) {
    if (context.__cash) context = context[0];
    eles = idRe.test(selector) ? context.getElementById(selector.slice(1)) : htmlRe.test(selector) ? parseHTML(selector) : find(selector, context);
    if (!eles) return;
  } else if (isFunction(selector)) {
    return this.ready(selector); //FIXME: `fn.ready` is not included in `core`, but it's actually a core functionality
  }

  if (eles.nodeType || eles === win) eles = [eles];
  this.length = eles.length;

  for (var i = 0, l = this.length; i < l; i++) {
    this[i] = eles[i];
  }
}

function cash(selector, context) {
  return new Cash(selector, context);
}
/* PROTOTYPE */


var fn = cash.fn = cash.prototype = Cash.prototype = {
  constructor: cash,
  __cash: true,
  length: 0,
  splice: splice // Ensures a cash collection gets printed as array-like in Chrome

}; // @require core/cash.js
// @require core/variables.js

fn.get = function (index) {
  if (index === undefined) return slice.call(this);
  return this[index < 0 ? index + this.length : index];
}; // @require core/cash.js
// @require ./get.js


fn.eq = function (index) {
  return cash(this.get(index));
}; // @require core/cash.js
// @require ./eq.js


fn.first = function () {
  return this.eq(0);
}; // @require core/cash.js
// @require ./eq.js


fn.last = function () {
  return this.eq(-1);
}; // @require core/cash.js
// @require core/variables.js


fn.map = function (callback) {
  return cash(map.call(this, function (ele, i) {
    return callback.call(ele, i, ele);
  }));
}; // @require core/cash.js
// @require core/variables.js


fn.slice = function () {
  return cash(slice.apply(this, arguments));
}; // @require ./cash.js


var camelCaseRe = /(?:^\w|[A-Z]|\b\w)/g,
    camelCaseWhitespaceRe = /[\s-_]+/g;

function camelCase(str) {
  return str.replace(camelCaseRe, function (letter, index) {
    return letter[!index ? 'toLowerCase' : 'toUpperCase']();
  }).replace(camelCaseWhitespaceRe, '');
}

;
cash.camelCase = camelCase; // @require ./cash.js

function each(arr, callback) {
  for (var i = 0, l = arr.length; i < l; i++) {
    if (callback.call(arr[i], arr[i], i, arr) === false) break;
  }
}

cash.each = each; // @require core/cash.js
// @require core/each.js

fn.each = function (callback) {
  each(this, function (ele, i) {
    return callback.call(ele, i, ele);
  });
  return this;
}; // @require core/cash.js
// @require collection/each.js


fn.removeProp = function (prop) {
  return this.each(function (i, ele) {
    delete ele[prop];
  });
}; // @require ./cash.js
// @require ./variables.js


win.cash = win.$ = cash; // @require ./cash.js

function extend(target) {
  if (target === void 0) {
    target = this;
  }

  var args = arguments,
      length = args.length;

  for (var i = length < 2 ? 0 : 1; i < length; i++) {
    for (var key in args[i]) {
      target[key] = args[i][key];
    }
  }

  return target;
}

;
cash.extend = fn.extend = extend; // @require ./cash.js

var guid = 1;
cash.guid = guid; // @require ./cash.js

function matches(ele, selector) {
  var matches = ele && (ele.matches || ele.webkitMatchesSelector || ele.mozMatchesSelector || ele.msMatchesSelector || ele.oMatchesSelector);
  return !!matches && matches.call(ele, selector);
}

cash.matches = matches; // @require ./cash.js

function isFunction(x) {
  return typeof x === 'function';
}

cash.isFunction = isFunction;

function isString(x) {
  return typeof x === 'string';
}

cash.isString = isString;

function isNumeric(x) {
  return !isNaN(parseFloat(x)) && isFinite(x);
}

cash.isNumeric = isNumeric;
var isArray = Array.isArray;
cash.isArray = isArray; // @require core/cash.js
// @require core/type_checking.js
// @require collection/each.js

fn.prop = function (prop, value) {
  if (!prop) return;

  if (isString(prop)) {
    if (arguments.length < 2) return this[0] && this[0][prop];
    return this.each(function (i, ele) {
      ele[prop] = value;
    });
  }

  for (var key in prop) {
    this.prop(key, prop[key]);
  }

  return this;
}; // @require ./matches.js
// @require ./type_checking.js


function getCompareFunction(selector) {
  return isString(selector) ? function (i, ele) {
    return matches(ele, selector);
  } : selector.__cash ? function (i, ele) {
    return selector.is(ele);
  } : function (i, ele, selector) {
    return ele === selector;
  };
} // @require core/cash.js
// @require core/get_compare_function.js
// @require core/type_checking.js
// @require core/variables.js
// @require collection/get.js


fn.filter = function (selector) {
  if (!selector) return cash();
  var comparator = isFunction(selector) ? selector : getCompareFunction(selector);
  return cash(filter.call(this, function (ele, i) {
    return comparator.call(ele, i, ele, selector);
  }));
}; // @require ./type_checking.js


var splitValuesRe = /\S+/g;

function getSplitValues(str) {
  return isString(str) ? str.match(splitValuesRe) || [] : [];
} // @require core/cash.js
// @require core/get_split_values.js
// @require collection/each.js


fn.hasClass = function (cls) {
  var classes = getSplitValues(cls);
  var check = false;

  if (classes.length) {
    this.each(function (i, ele) {
      check = ele.classList.contains(classes[0]);
      return !check;
    });
  }

  return check;
}; // @require core/cash.js
// @require core/get_split_values.js
// @require collection/each.js


fn.removeAttr = function (attr) {
  var attrs = getSplitValues(attr);
  if (!attrs.length) return this;
  return this.each(function (i, ele) {
    each(attrs, function (a) {
      ele.removeAttribute(a);
    });
  });
}; // @require core/cash.js
// @require core/type_checking.js
// @require collection/each.js
// @require ./remove_attr.js


fn.attr = function (attr, value) {
  if (!attr) return;

  if (isString(attr)) {
    if (arguments.length < 2) {
      if (!this[0]) return;

      var _value = this[0].getAttribute(attr);

      return _value === null ? undefined : _value;
    }

    if (value === null) return this.removeAttr(attr);
    return this.each(function (i, ele) {
      ele.setAttribute(attr, value);
    });
  }

  for (var key in attr) {
    this.attr(key, attr[key]);
  }

  return this;
}; // @require core/cash.js
// @require core/each.js
// @require core/get_split_values.js
// @require collection/each.js


fn.toggleClass = function (cls, force) {
  var classes = getSplitValues(cls),
      isForce = force !== undefined;
  if (!classes.length) return this;
  return this.each(function (i, ele) {
    each(classes, function (c) {
      if (isForce) {
        force ? ele.classList.add(c) : ele.classList.remove(c);
      } else {
        ele.classList.toggle(c);
      }
    });
  });
}; // @require core/cash.js
// @require ./toggle_class.js


fn.addClass = function (cls) {
  return this.toggleClass(cls, true);
}; // @require core/cash.js
// @require ./attr.js
// @require ./toggle_class.js


fn.removeClass = function (cls) {
  return !arguments.length ? this.attr('class', '') : this.toggleClass(cls, false);
}; // @optional ./add_class.js
// @optional ./attr.js
// @optional ./has_class.js
// @optional ./prop.js
// @optional ./remove_attr.js
// @optional ./remove_class.js
// @optional ./remove_prop.js
// @optional ./toggle_class.js
// @require ./cash.js
// @require ./variables.js
// @require ./type_checking.js


var fragment;

function initFragment() {
  if (fragment) return;
  fragment = doc.implementation.createHTMLDocument('');
  var base = fragment.createElement('base');
  base.href = doc.location.href;
  fragment.head.appendChild(base);
}

function parseHTML(html) {
  //FIXME: `<tr></tr>` can't be parsed with this
  initFragment();
  if (!isString(html)) html = '';
  fragment.body.innerHTML = html;
  return slice.call(fragment.body.childNodes);
}

cash.parseHTML = parseHTML; // @require ./cash.js

function unique(arr) {
  return arr.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

cash.unique = unique; // @require core/cash.js
// @require core/unique.js
// @require ./get.js

fn.add = function (selector, context) {
  return cash(unique(this.get().concat(cash(selector, context).get())));
}; // @optional ./camel_case.js
// @optional ./each.js
// @optional ./export_window.js
// @optional ./extend.js
// @optional ./find.js
// @optional ./get_compare_function.js
// @optional ./get_split_values.js
// @optional ./guid.js
// @optional ./matches.js
// @optional ./parse_html.js
// @optional ./unique.js
// @optional ./variables.js
// @require ./cash.js
// @require ./type_checking.js
// @require core/variables.js


function computeStyle(ele, prop, isVariable) {
  if (ele.nodeType !== 1) return;
  var style = win.getComputedStyle(ele, null);
  return prop ? isVariable ? style.getPropertyValue(prop) : style[prop] : style;
} // @require ./compute_style.js


function computeStyleInt(ele, prop) {
  return parseInt(computeStyle(ele, prop), 10) || 0;
}

var cssVariableRe = /^--/; // @require ./variables.js

function isCSSVariable(prop) {
  return cssVariableRe.test(prop);
} // @require core/camel_case.js
// @require core/cash.js
// @require core/each.js
// @require core/variables.js
// @require ./is_css_variable.js


var prefixedProps = {},
    _doc$createElement = doc.createElement('div'),
    style = _doc$createElement.style,
    vendorsPrefixes = ['webkit', 'moz', 'ms', 'o'];

function getPrefixedProp(prop, isVariable) {
  if (isVariable === void 0) {
    isVariable = isCSSVariable(prop);
  }

  if (isVariable) return prop;

  if (!prefixedProps[prop]) {
    var propCC = camelCase(prop),
        propUC = "" + propCC.charAt(0).toUpperCase() + propCC.slice(1),
        props = (propCC + " " + vendorsPrefixes.join(propUC + " ") + propUC).split(' ');
    each(props, function (p) {
      if (p in style) {
        prefixedProps[prop] = p;
        return false;
      }
    });
  }

  return prefixedProps[prop];
}

;
cash.prefixedProp = getPrefixedProp; // @require core/type_checking.js
// @require ./is_css_variable.js

var numericProps = {
  animationIterationCount: true,
  columnCount: true,
  flexGrow: true,
  flexShrink: true,
  fontWeight: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  widows: true,
  zIndex: true
};

function getSuffixedValue(prop, value, isVariable) {
  if (isVariable === void 0) {
    isVariable = isCSSVariable(prop);
  }

  return !isVariable && !numericProps[prop] && isNumeric(value) ? value + "px" : value;
} // @require core/cash.js
// @require core/type_checking.js
// @require collection/each.js
// @require ./helpers/compute_style.js
// @require ./helpers/get_prefixed_prop.js
// @require ./helpers/get_suffixed_value.js
// @require ./helpers/is_css_variable.js


fn.css = function (prop, value) {
  if (isString(prop)) {
    var isVariable = isCSSVariable(prop);
    prop = getPrefixedProp(prop, isVariable);
    if (arguments.length < 2) return this[0] && computeStyle(this[0], prop, isVariable);
    if (!prop) return this;
    value = getSuffixedValue(prop, value, isVariable);
    return this.each(function (i, ele) {
      if (ele.nodeType !== 1) return;

      if (isVariable) {
        ele.style.setProperty(prop, value);
      } else {
        ele.style[prop] = value;
      }
    });
  }

  for (var key in prop) {
    this.css(key, prop[key]);
  }

  return this;
}; // @optional ./css.js


var dataNamespace = '__cashData',
    dataAttributeRe = /^data-(.*)/; // @require core/cash.js
// @require ./helpers/variables.js

cash.hasData = function (ele) {
  return dataNamespace in ele;
}; // @require ./variables.js


function getDataCache(ele) {
  return ele[dataNamespace] = ele[dataNamespace] || {};
} // @require attributes/attr.js
// @require ./get_data_cache.js


function getData(ele, key) {
  var cache = getDataCache(ele);

  if (key) {
    if (!(key in cache)) {
      var value = ele.dataset ? ele.dataset[key] || ele.dataset[camelCase(key)] : cash(ele).attr("data-" + key);

      if (value !== undefined) {
        try {
          value = JSON.parse(value);
        } catch (e) {}

        cache[key] = value;
      }
    }

    return cache[key];
  }

  return cache;
} // @require ./variables.js
// @require ./get_data_cache.js


function removeData(ele, key) {
  if (key === undefined) {
    delete ele[dataNamespace];
  } else {
    delete getDataCache(ele)[key];
  }
} // @require ./get_data_cache.js


function setData(ele, key, value) {
  getDataCache(ele)[key] = value;
} // @require core/cash.js
// @require core/type_checking.js
// @require collection/each.js
// @require ./helpers/get_data.js
// @require ./helpers/set_data.js
// @require ./helpers/variables.js


fn.data = function (name, value) {
  var _this = this;

  if (!name) {
    if (!this[0]) return;
    each(this[0].attributes, function (attr) {
      var match = attr.name.match(dataAttributeRe);
      if (!match) return;

      _this.data(match[1]);
    });
    return getData(this[0]);
  }

  if (isString(name)) {
    if (value === undefined) return this[0] && getData(this[0], name);
    return this.each(function (i, ele) {
      return setData(ele, name, value);
    });
  }

  for (var key in name) {
    this.data(key, name[key]);
  }

  return this;
}; // @require core/cash.js
// @require collection/each.js
// @require ./helpers/remove_data.js


fn.removeData = function (key) {
  return this.each(function (i, ele) {
    return removeData(ele, key);
  });
}; // @optional ./data.js
// @optional ./remove_data.js
// @require css/helpers/compute_style_int.js


function getExtraSpace(ele, xAxis) {
  return computeStyleInt(ele, "border" + (xAxis ? 'Left' : 'Top') + "Width") + computeStyleInt(ele, "padding" + (xAxis ? 'Left' : 'Top')) + computeStyleInt(ele, "padding" + (xAxis ? 'Right' : 'Bottom')) + computeStyleInt(ele, "border" + (xAxis ? 'Right' : 'Bottom') + "Width");
} // @require core/cash.js
// @require core/each.js
// @require core/variables.js


each(['Width', 'Height'], function (prop) {
  fn["inner" + prop] = function () {
    if (!this[0]) return;
    if (this[0] === win) return win["inner" + prop];
    return this[0]["client" + prop];
  };
}); // @require core/camel_case.js
// @require core/cash.js
// @require core/each.js
// @require core/variables.js
// @require css/helpers/compute_style.js
// @require css/helpers/get_suffixed_value.js
// @require ./helpers/get_extra_space.js

each(['width', 'height'], function (prop, index) {
  fn[prop] = function (value) {
    if (!this[0]) return value === undefined ? undefined : this;

    if (!arguments.length) {
      if (this[0] === win) return this[0][camelCase("outer-" + prop)];
      return this[0].getBoundingClientRect()[prop] - getExtraSpace(this[0], !index);
    }

    value = parseInt(value, 10);
    return this.each(function (i, ele) {
      if (ele.nodeType !== 1) return;
      var boxSizing = computeStyle(ele, 'boxSizing');
      ele.style[prop] = getSuffixedValue(prop, value + (boxSizing === 'border-box' ? getExtraSpace(ele, !index) : 0));
    });
  };
}); // @require core/cash.js
// @require core/each.js
// @require core/variables.js
// @require css/helpers/compute_style_int.js

each(['Width', 'Height'], function (prop, index) {
  fn["outer" + prop] = function (includeMargins) {
    if (!this[0]) return;
    if (this[0] === win) return win["outer" + prop];
    return this[0]["offset" + prop] + (includeMargins ? computeStyleInt(this[0], "margin" + (!index ? 'Left' : 'Top')) + computeStyleInt(this[0], "margin" + (!index ? 'Right' : 'Bottom')) : 0);
  };
}); // @optional ./inner.js
// @optional ./normal.js
// @optional ./outer.js

function hasNamespaces(ns1, ns2) {
  for (var i = 0, l = ns2.length; i < l; i++) {
    if (ns1.indexOf(ns2[i]) < 0) return false;
  }

  return true;
} // @require core/each.js


function removeEventListeners(cache, ele, name) {
  each(cache[name], function (_ref) {
    var namespaces = _ref[0],
        callback = _ref[1];
    ele.removeEventListener(name, callback);
  });
  delete cache[name];
}

var eventsNamespace = '__cashEvents',
    eventsNamespacesSeparator = '.'; // @require ./variables.js

function getEventsCache(ele) {
  return ele[eventsNamespace] = ele[eventsNamespace] || {};
} // @require core/guid.js
// @require events/helpers/get_events_cache.js


function addEvent(ele, name, namespaces, callback) {
  callback.guid = callback.guid || guid++;
  var eventCache = getEventsCache(ele);
  eventCache[name] = eventCache[name] || [];
  eventCache[name].push([namespaces, callback]);
  ele.addEventListener(name, callback);
} // @require ./variables.js


function parseEventName(eventName) {
  var parts = eventName.split(eventsNamespacesSeparator);
  return [parts[0], parts.slice(1).sort()]; // [name, namespaces]
} // @require core/guid.js
// @require ./get_events_cache.js
// @require ./has_namespaces.js
// @require ./parse_event_name.js
// @require ./remove_event_listeners.js


function removeEvent(ele, name, namespaces, callback) {
  var cache = getEventsCache(ele);

  if (!name) {
    if (!namespaces || !namespaces.length) {
      for (name in cache) {
        removeEventListeners(cache, ele, name);
      }
    } else {
      for (name in cache) {
        removeEvent(ele, name, namespaces, callback);
      }
    }
  } else {
    var eventCache = cache[name];
    if (!eventCache) return;
    if (callback) callback.guid = callback.guid || guid++;
    cache[name] = eventCache.filter(function (_ref2) {
      var ns = _ref2[0],
          cb = _ref2[1];
      if (callback && cb.guid !== callback.guid || !hasNamespaces(ns, namespaces)) return true;
      ele.removeEventListener(name, cb);
    });
  }
} // @require core/cash.js
// @require core/each.js
// @require collection/each.js
// @require ./helpers/parse_event_name.js
// @require ./helpers/remove_event.js


fn.off = function (eventFullName, callback) {
  var _this2 = this;

  if (eventFullName === undefined) {
    this.each(function (i, ele) {
      return removeEvent(ele);
    });
  } else {
    each(getSplitValues(eventFullName), function (eventFullName) {
      var _parseEventName = parseEventName(eventFullName),
          name = _parseEventName[0],
          namespaces = _parseEventName[1];

      _this2.each(function (i, ele) {
        return removeEvent(ele, name, namespaces, callback);
      });
    });
  }

  return this;
}; // @require core/cash.js
// @require core/get_split_values.js
// @require core/guid.js
// @require core/matches.js
// @require core/type_checking.js
// @require collection/each.js
// @require ./helpers/variables.js
// @require ./helpers/add_event.js
// @require ./helpers/has_namespaces.js
// @require ./helpers/parse_event_name.js
// @require ./helpers/remove_event.js


fn.on = function (eventFullName, selector, callback, _one) {
  var _this3 = this;

  if (!isString(eventFullName)) {
    for (var key in eventFullName) {
      this.on(key, selector, eventFullName[key]);
    }

    return this;
  }

  if (isFunction(selector)) {
    callback = selector;
    selector = false;
  }

  each(getSplitValues(eventFullName), function (eventFullName) {
    var _parseEventName2 = parseEventName(eventFullName),
        name = _parseEventName2[0],
        namespaces = _parseEventName2[1];

    _this3.each(function (i, ele) {
      var finalCallback = function finalCallback(event) {
        if (event.namespace && !hasNamespaces(namespaces, event.namespace.split(eventsNamespacesSeparator))) return;
        var thisArg = ele;

        if (selector) {
          var target = event.target;

          while (!matches(target, selector)) {
            if (target === ele) return;
            target = target.parentNode;
            if (!target) return;
          }

          thisArg = target;
        }

        event.namespace = event.namespace || '';
        var returnValue = callback.call(thisArg, event, event.data);

        if (_one) {
          removeEvent(ele, name, namespaces, finalCallback);
        }

        if (returnValue === false) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      finalCallback.guid = callback.guid = callback.guid || guid++;
      addEvent(ele, name, namespaces, finalCallback);
    });
  });
  return this;
}; // @require core/cash.js
// @require ./on.js


fn.one = function (eventFullName, delegate, callback) {
  return this.on(eventFullName, delegate, callback, true);
}; // @require core/cash.js
// @require core/variables.js


fn.ready = function (callback) {
  var finalCallback = function finalCallback() {
    return callback(cash);
  };

  if (doc.readyState !== 'loading') {
    setTimeout(finalCallback);
  } else {
    doc.addEventListener('DOMContentLoaded', finalCallback);
  }

  return this;
}; // @require core/cash.js
// @require core/type_checking.js
// @require core/variables.js
// @require collection/each.js
// @require ./helpers/parse_event_name.js
// @require ./helpers/variables.js


fn.trigger = function (eventFullName, data) {
  var evt = eventFullName;

  if (isString(eventFullName)) {
    var _parseEventName3 = parseEventName(eventFullName),
        name = _parseEventName3[0],
        namespaces = _parseEventName3[1];

    evt = doc.createEvent('HTMLEvents');
    evt.initEvent(name, true, true);
    evt.namespace = namespaces.join(eventsNamespacesSeparator);
  }

  evt.data = data;
  return this.each(function (i, ele) {
    ele.dispatchEvent(evt);
  });
}; // @optional ./off.js
// @optional ./on.js
// @optional ./one.js
// @optional ./ready.js
// @optional ./trigger.js
// @require core/each.js


function getValueSelectMultiple(ele) {
  var values = [];
  each(ele.options, function (option) {
    if (option.selected && !option.disabled && !option.parentNode.disabled) {
      values.push(option.value);
    }
  });
  return values;
}

function getValueSelectSingle(ele) {
  return ele.selectedIndex < 0 ? null : ele.options[ele.selectedIndex].value;
} // @require ./get_value_select_single.js
// @require ./get_value_select_multiple.js


var selectOneRe = /select-one/i,
    selectMultipleRe = /select-multiple/i;

function getValue(ele) {
  var type = ele.type;
  if (selectOneRe.test(type)) return getValueSelectSingle(ele);
  if (selectMultipleRe.test(type)) return getValueSelectMultiple(ele);
  return ele.value;
}

var queryEncodeSpaceRe = /%20/g;

function queryEncode(prop, value) {
  return "&" + encodeURIComponent(prop) + "=" + encodeURIComponent(value).replace(queryEncodeSpaceRe, '+');
} // @require core/cash.js
// @require core/each.js
// @require core/type_checking.js
// @require ./helpers/get_value.js
// @require ./helpers/query_encode.js


var skippableRe = /file|reset|submit|button|image/i,
    checkableRe = /radio|checkbox/i;

fn.serialize = function () {
  var query = '';
  this.each(function (i, ele) {
    each(ele.elements || [ele], function (ele) {
      if (ele.disabled || !ele.name || ele.tagName === 'FIELDSET') return;
      if (skippableRe.test(ele.type)) return;
      if (checkableRe.test(ele.type) && !ele.checked) return;
      var value = getValue(ele);
      if (value === undefined) return;
      var values = isArray(value) ? value : [value];
      each(values, function (value) {
        query += queryEncode(ele.name, value);
      });
    });
  });
  return query.substr(1);
}; // @require core/cash.js
// @require core/each.js
// @require core/type_checking.js
// @require collection/each.js
// @require ./helpers/get_value.js


fn.val = function (value) {
  if (value === undefined) return this[0] && getValue(this[0]);
  return this.each(function (i, ele) {
    if (selectMultipleRe.test(ele.type) && isArray(value)) {
      each(ele.options, function (option) {
        option.selected = value.indexOf(option.value) >= 0;
      });
    } else {
      ele.value = value;
    }
  });
}; // @optional ./serialize.js
// @optional ./val.js
// @require core/cash.js
// @require collection/map.js


fn.clone = function () {
  return this.map(function (i, ele) {
    return ele.cloneNode(true);
  });
}; // @require core/cash.js
// @require collection/each.js


fn.detach = function () {
  return this.each(function (i, ele) {
    if (ele.parentNode) {
      ele.parentNode.removeChild(ele);
    }
  });
};

function insertElement(ele, child, prepend) {
  if (prepend) {
    ele.insertBefore(child, ele.childNodes[0]);
  } else {
    ele.appendChild(child);
  }
} // @require core/each.js
// @require core/type_checking.js
// @require ./insert_element.js


function insertContent(parent, child, prepend) {
  var isStr = isString(child);

  if (!isStr && child.length) {
    each(child, function (ele) {
      return insertContent(parent, ele, prepend);
    });
  } else {
    each(parent, isStr ? function (ele) {
      ele.insertAdjacentHTML(prepend ? 'afterbegin' : 'beforeend', child);
    } : function (ele, index) {
      return insertElement(ele, !index ? child : child.cloneNode(true), prepend);
    });
  }
} // @require core/cash.js
// @require core/each.js
// @require ./helpers/insert_content.js


fn.append = function () {
  var _this4 = this;

  each(arguments, function (content) {
    insertContent(_this4, content);
  });
  return this;
}; // @require core/cash.js
// @require ./helpers/insert_content.js


fn.appendTo = function (parent) {
  insertContent(cash(parent), this);
  return this;
}; // @require core/cash.js
// @require collection/each.js


fn.html = function (content) {
  if (content === undefined) return this[0] && this[0].innerHTML;
  var source = content.nodeType ? content[0].outerHTML : content;
  return this.each(function (i, ele) {
    ele.innerHTML = source;
  });
}; // @require core/cash.js
// @require ./html.js


fn.empty = function () {
  return this.html('');
}; // @require core/cash.js
// @require collection/each.js


fn.insertAfter = function (content) {
  var _this5 = this;

  cash(content).each(function (index, ele) {
    var parent = ele.parentNode;

    _this5.each(function (i, e) {
      parent.insertBefore(!index ? e : e.cloneNode(true), ele.nextSibling);
    });
  });
  return this;
}; // @require core/cash.js
// @require core/each.js
// @require core/variables.js
// @require collection/slice.js
// @require ./insert_after.js


fn.after = function () {
  var _this6 = this;

  each(reverse.apply(arguments), function (content) {
    reverse.apply(cash(content).slice()).insertAfter(_this6);
  });
  return this;
}; // @require core/cash.js
// @require collection/each.js


fn.insertBefore = function (selector) {
  var _this7 = this;

  cash(selector).each(function (index, ele) {
    var parent = ele.parentNode;

    _this7.each(function (i, e) {
      parent.insertBefore(!index ? e : e.cloneNode(true), ele);
    });
  });
  return this;
}; // @require core/cash.js
// @require core/each.js
// @require ./insert_before.js


fn.before = function () {
  var _this8 = this;

  each(arguments, function (content) {
    cash(content).insertBefore(_this8);
  });
  return this;
}; // @require core/cash.js
// @require core/each.js
// @require ./helpers/insert_content.js


fn.prepend = function () {
  var _this9 = this;

  each(arguments, function (content) {
    insertContent(_this9, content, true);
  });
  return this;
}; // @require core/cash.js
// @require core/variables.js
// @require collection/slice.js
// @require ./helpers/insert_content.js


fn.prependTo = function (parent) {
  insertContent(cash(parent), reverse.apply(this.slice()), true);
  return this;
}; // @require core/cash.js
// @require events/off.js
// @require ./detach.js


fn.remove = function () {
  return this.detach().off();
}; // @require core/cash.js
// @require collection/each.js
// @require collection/slice.js
// @require ./after.js
// @require ./remove.js


fn.replaceWith = function (content) {
  var _this10 = this;

  return this.each(function (i, ele) {
    var parent = ele.parentNode;
    if (!parent) return;
    var $eles = i ? cash(content).clone() : cash(content);

    if (!$eles[0]) {
      _this10.remove();

      return false;
    }

    parent.replaceChild($eles[0], ele);
    cash($eles[0]).after($eles.slice(1));
  });
}; // @require core/cash.js
// @require ./replace_with.js


fn.replaceAll = function (content) {
  cash(content).replaceWith(this);
  return this;
}; // @require core/cash.js
// @require collection/each.js


fn.text = function (content) {
  if (content === undefined) return this[0] ? this[0].textContent : '';
  return this.each(function (i, ele) {
    ele.textContent = content;
  });
}; // @optional ./after.js
// @optional ./append.js
// @optional ./append_to.js
// @optional ./before.js
// @optional ./clone.js
// @optional ./detach.js
// @optional ./empty.js
// @optional ./html.js
// @optional ./insert_after.js
// @optional ./insert_before.js
// @optional ./prepend.js
// @optional ./prepend_to.js
// @optional ./remove.js
// @optional ./replace_all.js
// @optional ./replace_with.js
// @optional ./text.js
// @require core/cash.js
// @require core/variables.js


var docEle = doc.documentElement;

fn.offset = function () {
  var ele = this[0];
  if (!ele) return;
  var rect = ele.getBoundingClientRect();
  return {
    top: rect.top + win.pageYOffset - docEle.clientTop,
    left: rect.left + win.pageXOffset - docEle.clientLeft
  };
}; // @require core/cash.js


fn.offsetParent = function () {
  return cash(this[0] && this[0].offsetParent);
}; // @require core/cash.js


fn.position = function () {
  var ele = this[0];
  if (!ele) return;
  return {
    left: ele.offsetLeft,
    top: ele.offsetTop
  };
}; // @optional ./offset.js
// @optional ./offset_parent.js
// @optional ./position.js
// @require core/cash.js
// @require core/matches.js
// @require core/unique.js
// @require collection/each.js
// @require collection/filter.js


fn.children = function (selector) {
  var result = [];
  this.each(function (i, ele) {
    push.apply(result, ele.children);
  });
  result = cash(unique(result));
  if (!selector) return result;
  return result.filter(function (i, ele) {
    return matches(ele, selector);
  });
}; // @require core/cash.js
// @require core/unique.js
// @require collection/each.js


fn.contents = function () {
  var result = [];
  this.each(function (i, ele) {
    push.apply(result, ele.tagName === 'IFRAME' ? [ele.contentDocument] : ele.childNodes);
  });
  return cash(result.length && unique(result));
}; // @require core/cash.js
// @require core/unique.js
// @require core/find.js
// @require core/variables.js


fn.find = function (selector) {
  var result = [];

  for (var i = 0, l = this.length; i < l; i++) {
    var found = find(selector, this[i]);

    if (found.length) {
      push.apply(result, found);
    }
  }

  return cash(result.length && unique(result));
}; // @require core/cash.js
// @require core/find.js
// @require core/type_checking.js
// @require collection/filter.js


fn.has = function (selector) {
  var comparator = isString(selector) ? function (i, ele) {
    return !!find(selector, ele).length;
  } : function (i, ele) {
    return ele.contains(selector);
  };
  return this.filter(comparator);
}; // @require core/cash.js
// @require core/get_compare_function.js
// @require collection/each.js


fn.is = function (selector) {
  if (!selector || !this[0]) return false;
  var comparator = getCompareFunction(selector);
  var check = false;
  this.each(function (i, ele) {
    check = comparator(i, ele, selector);
    return !check;
  });
  return check;
}; // @require core/cash.js


fn.next = function () {
  return cash(this[0] && this[0].nextElementSibling);
}; // @require core/cash.js
// @require core/get_compare_function.js
// @require collection/filter.js


fn.not = function (selector) {
  if (!selector || !this[0]) return this;
  var comparator = getCompareFunction(selector);
  return this.filter(function (i, ele) {
    return !comparator(i, ele, selector);
  });
}; // @require core/cash.js
// @require core/unique.js
// @require collection/each.js


fn.parent = function () {
  var result = [];
  this.each(function (i, ele) {
    if (ele && ele.parentNode) {
      result.push(ele.parentNode);
    }
  });
  return cash(unique(result));
}; // @require core/cash.js
// @require core/variables.js
// @require traversal/children.js
// @require traversal/parent.js
// @require ./get.js
//FIXME Ugly file name, is there a better option?


fn.index = function (ele) {
  var child = ele ? cash(ele)[0] : this[0],
      collection = ele ? this : cash(child).parent().children();
  return indexOf.call(collection, child);
}; // @optional ./add.js
// @optional ./each.js
// @optional ./eq.js
// @optional ./filter.js
// @optional ./first.js
// @optional ./get.js
// @optional ./indexFn.js
// @optional ./last.js
// @optional ./map.js
// @optional ./slice.js
// @require core/cash.js
// @require collection/filter.js
// @require ./is.js
// @require ./parent.js


fn.closest = function (selector) {
  if (!selector || !this[0]) return cash();
  if (this.is(selector)) return this.filter(selector);
  return this.parent().closest(selector);
}; // @require core/cash.js
// @require core/matches.js
// @require core/unique.js
// @require core/variables.js
// @require collection/each.js


fn.parents = function (selector) {
  var result = [];
  var last;
  this.each(function (i, ele) {
    last = ele;

    while (last && last.parentNode && last !== doc.body.parentNode) {
      last = last.parentNode;

      if (!selector || selector && matches(last, selector)) {
        result.push(last);
      }
    }
  });
  return cash(unique(result));
}; // @require core/cash.js


fn.prev = function () {
  return cash(this[0] && this[0].previousElementSibling);
}; // @require core/cash.js
// @require collection/filter.js
// @require ./children.js
// @require ./parent.js


fn.siblings = function () {
  var ele = this[0];
  return this.parent().children().filter(function (i, child) {
    return child !== ele;
  });
}; // @optional ./children.js
// @optional ./closest.js
// @optional ./contents.js
// @optional ./find.js
// @optional ./has.js
// @optional ./is.js
// @optional ./next.js
// @optional ./not.js
// @optional ./parent.js
// @optional ./parents.js
// @optional ./prev.js
// @optional ./siblings.js
// @optional attributes/index.js
// @optional collection/index.js
// @optional css/index.js
// @optional data/index.js
// @optional dimensions/index.js
// @optional events/index.js
// @optional forms/index.js
// @optional manipulation/index.js
// @optional offset/index.js
// @optional traversal/index.js
// @require core/index.js
})();
(function(){

/**
 * Convenience function for instantiating a new elasticlunr index and configuring it
 * with the default pipeline functions and the passed config function.
 *
 * When using this convenience function a new index will be created with the
 * following functions already in the pipeline:
 * 
 * 1. elasticlunr.trimmer - trim non-word character
 * 2. elasticlunr.StopWordFilter - filters out any stop words before they enter the
 * index
 * 3. elasticlunr.stemmer - stems the tokens before entering the index.
 *
 *
 * Example:
 *
 *     var idx = elasticlunr(function () {
 *       this.addField('id');
 *       this.addField('title');
 *       this.addField('body');
 *       
 *       //this.setRef('id'); // default ref is 'id'
 *
 *       this.pipeline.add(function () {
 *         // some custom pipeline function
 *       });
 *     });
 * 
 *    idx.addDoc({
 *      id: 1, 
 *      title: 'Oracle released database 12g',
 *      body: 'Yestaday, Oracle has released their latest database, named 12g, more robust. this product will increase Oracle profit.'
 *    });
 * 
 *    idx.addDoc({
 *      id: 2, 
 *      title: 'Oracle released annual profit report',
 *      body: 'Yestaday, Oracle has released their annual profit report of 2015, total profit is 12.5 Billion.'
 *    });
 * 
 *    # simple search
 *    idx.search('oracle database');
 * 
 *    # search with query-time boosting
 *    idx.search('oracle database', {fields: {title: {boost: 2}, body: {boost: 1}}});
 *
 * @param {Function} config A function that will be called with the new instance
 * of the elasticlunr.Index as both its context and first parameter. It can be used to
 * customize the instance of new elasticlunr.Index.
 * @namespace
 * @module
 * @return {elasticlunr.Index}
 *
 */
var elasticlunr = function (config) {
  var idx = new elasticlunr.Index;

  idx.pipeline.add(
    elasticlunr.trimmer,
    elasticlunr.stopWordFilter,
    elasticlunr.stemmer
  );

  if (config) config.call(idx, idx);

  return idx;
};

elasticlunr.version = "0.9.5";

// only used this to make elasticlunr.js compatible with lunr-languages
// this is a trick to define a global alias of elasticlunr
lunr = elasticlunr;

/**
 * A namespace containing utils for the rest of the elasticlunr library
 */
elasticlunr.utils = {};

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf Utils
 */
elasticlunr.utils.warn = (function (global) {
  return function (message) {
    if (global.console && window.console.warn) {
      window.console.warn(message);
    }
  };
})(this);

/**
 * Convert an object to string.
 *
 * In the case of `null` and `undefined` the function returns
 * an empty string, in all other cases the result of calling
 * `toString` on the passed object is returned.
 *
 * @param {object} obj The object to convert to a string.
 * @return {String} string representation of the passed object.
 * @memberOf Utils
 */
elasticlunr.utils.toString = function (obj) {
  if (obj === void 0 || obj === null) {
    return "";
  }

  return obj.toString();
};

/**
 * elasticlunr.EventEmitter is an event emitter for elasticlunr.
 * It manages adding and removing event handlers and triggering events and their handlers.
 *
 * Each event could has multiple corresponding functions,
 * these functions will be called as the sequence that they are added into the event.
 * 
 * @constructor
 */
elasticlunr.EventEmitter = function () {
  this.events = {};
};

/**
 * Binds a handler function to a specific event(s).
 *
 * Can bind a single function to many different events in one call.
 *
 * @param {String} [eventName] The name(s) of events to bind this function to.
 * @param {Function} fn The function to call when an event is fired.
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.addListener = function () {
  var args = Array.prototype.slice.call(arguments),
      fn = args.pop(),
      names = args;

  if (typeof fn !== "function") throw new TypeError ("last argument must be a function");

  names.forEach(function (name) {
    if (!this.hasHandler(name)) this.events[name] = [];
    this.events[name].push(fn);
  }, this);
};

/**
 * Removes a handler function from a specific event.
 *
 * @param {String} eventName The name of the event to remove this function from.
 * @param {Function} fn The function to remove from an event.
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.removeListener = function (name, fn) {
  if (!this.hasHandler(name)) return;

  var fnIndex = this.events[name].indexOf(fn);
  if (fnIndex === -1) return;

  this.events[name].splice(fnIndex, 1);

  if (this.events[name].length == 0) delete this.events[name];
};

/**
 * Call all functions that bounded to the given event.
 *
 * Additional data can be passed to the event handler as arguments to `emit`
 * after the event name.
 *
 * @param {String} eventName The name of the event to emit.
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.emit = function (name) {
  if (!this.hasHandler(name)) return;

  var args = Array.prototype.slice.call(arguments, 1);

  this.events[name].forEach(function (fn) {
    fn.apply(undefined, args);
  }, this);
};

/**
 * Checks whether a handler has ever been stored against an event.
 *
 * @param {String} eventName The name of the event to check.
 * @private
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.hasHandler = function (name) {
  return name in this.events;
};

/**
 * A function for splitting a string into tokens.
 * Currently English is supported as default.
 * Uses `elasticlunr.tokenizer.seperator` to split strings, you could change
 * the value of this property to set how you want strings are split into tokens.
 * IMPORTANT: use elasticlunr.tokenizer.seperator carefully, if you are not familiar with
 * text process, then you'd better not change it.
 *
 * @module
 * @param {String} str The string that you want to tokenize.
 * @see elasticlunr.tokenizer.seperator
 * @return {Array}
 */
elasticlunr.tokenizer = function (str) {
  if (!arguments.length || str === null || str === undefined) return [];
  if (Array.isArray(str)) {
    var arr = str.filter(function(token) {
      if (token === null || token === undefined) {
        return false;
      }

      return true;
    });

    arr = arr.map(function (t) {
      return elasticlunr.utils.toString(t).toLowerCase();
    });

    var out = [];
    arr.forEach(function(item) {
      var tokens = item.split(elasticlunr.tokenizer.seperator);
      out = out.concat(tokens);
    }, this);

    return out;
  }

  return str.toString().trim().toLowerCase().split(elasticlunr.tokenizer.seperator);
};

/**
 * Default string seperator.
 */
elasticlunr.tokenizer.defaultSeperator = /[\s\-]+/;

/**
 * The sperator used to split a string into tokens. Override this property to change the behaviour of
 * `elasticlunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see elasticlunr.tokenizer
 */
elasticlunr.tokenizer.seperator = elasticlunr.tokenizer.defaultSeperator;

/**
 * Set up customized string seperator
 *
 * @param {Object} sep The customized seperator that you want to use to tokenize a string.
 */
elasticlunr.tokenizer.setSeperator = function(sep) {
    if (sep !== null && sep !== undefined && typeof(sep) === 'object') {
        elasticlunr.tokenizer.seperator = sep;
    }
};

/**
 * Reset string seperator
 *
 */
elasticlunr.tokenizer.resetSeperator = function() {
    elasticlunr.tokenizer.seperator = elasticlunr.tokenizer.defaultSeperator;
};

/**
 * Get string seperator
 *
 */
elasticlunr.tokenizer.getSeperator = function() {
    return elasticlunr.tokenizer.seperator;
};

/**
 * elasticlunr.Pipelines maintain an ordered list of functions to be applied to 
 * both documents tokens and query tokens.
 *
 * An instance of elasticlunr.Index will contain a pipeline
 * with a trimmer, a stop word filter, an English stemmer. Extra
 * functions can be added before or after either of these functions or these
 * default functions can be removed.
 *
 * When run the pipeline, it will call each function in turn.
 *
 * The output of the functions in the pipeline will be passed to the next function
 * in the pipeline. To exclude a token from entering the index the function
 * should return undefined, the rest of the pipeline will not be called with
 * this token.
 *
 * For serialisation of pipelines to work, all functions used in an instance of
 * a pipeline should be registered with elasticlunr.Pipeline. Registered functions can
 * then be loaded. If trying to load a serialised pipeline that uses functions
 * that are not registered an error will be thrown.
 *
 * If not planning on serialising the pipeline then registering pipeline functions
 * is not necessary.
 *
 * @constructor
 */
elasticlunr.Pipeline = function () {
  this._queue = [];
};

elasticlunr.Pipeline.registeredFunctions = {};

/**
 * Register a function in the pipeline.
 *
 * Functions that are used in the pipeline should be registered if the pipeline
 * needs to be serialised, or a serialised pipeline needs to be loaded.
 *
 * Registering a function does not add it to a pipeline, functions must still be
 * added to instances of the pipeline for them to be used when running a pipeline.
 *
 * @param {Function} fn The function to register.
 * @param {String} label The label to register this function with
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.registerFunction = function (fn, label) {
  if (label in elasticlunr.Pipeline.registeredFunctions) {
    elasticlunr.utils.warn('Overwriting existing registered function: ' + label);
  }

  fn.label = label;
  elasticlunr.Pipeline.registeredFunctions[label] = fn;
};

/**
 * Get a registered function in the pipeline.
 *
 * @param {String} label The label of registered function.
 * @return {Function}
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.getRegisteredFunction = function (label) {
  if ((label in elasticlunr.Pipeline.registeredFunctions) !== true) {
    return null;
  }

  return elasticlunr.Pipeline.registeredFunctions[label];
};

/**
 * Warns if the function is not registered as a Pipeline function.
 *
 * @param {Function} fn The function to check for.
 * @private
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
  var isRegistered = fn.label && (fn.label in this.registeredFunctions);

  if (!isRegistered) {
    elasticlunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn);
  }
};

/**
 * Loads a previously serialised pipeline.
 *
 * All functions to be loaded must already be registered with elasticlunr.Pipeline.
 * If any function from the serialised data has not been registered then an
 * error will be thrown.
 *
 * @param {Object} serialised The serialised pipeline to load.
 * @return {elasticlunr.Pipeline}
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.load = function (serialised) {
  var pipeline = new elasticlunr.Pipeline;

  serialised.forEach(function (fnName) {
    var fn = elasticlunr.Pipeline.getRegisteredFunction(fnName);

    if (fn) {
      pipeline.add(fn);
    } else {
      throw new Error('Cannot load un-registered function: ' + fnName);
    }
  });

  return pipeline;
};

/**
 * Adds new functions to the end of the pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} functions Any number of functions to add to the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.add = function () {
  var fns = Array.prototype.slice.call(arguments);

  fns.forEach(function (fn) {
    elasticlunr.Pipeline.warnIfFunctionNotRegistered(fn);
    this._queue.push(fn);
  }, this);
};

/**
 * Adds a single function after a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 * If existingFn is not found, throw an Exception.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.after = function (existingFn, newFn) {
  elasticlunr.Pipeline.warnIfFunctionNotRegistered(newFn);

  var pos = this._queue.indexOf(existingFn);
  if (pos === -1) {
    throw new Error('Cannot find existingFn');
  }

  this._queue.splice(pos + 1, 0, newFn);
};

/**
 * Adds a single function before a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 * If existingFn is not found, throw an Exception.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.before = function (existingFn, newFn) {
  elasticlunr.Pipeline.warnIfFunctionNotRegistered(newFn);

  var pos = this._queue.indexOf(existingFn);
  if (pos === -1) {
    throw new Error('Cannot find existingFn');
  }

  this._queue.splice(pos, 0, newFn);
};

/**
 * Removes a function from the pipeline.
 *
 * @param {Function} fn The function to remove from the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.remove = function (fn) {
  var pos = this._queue.indexOf(fn);
  if (pos === -1) {
    return;
  }

  this._queue.splice(pos, 1);
};

/**
 * Runs the current list of functions that registered in the pipeline against the
 * input tokens.
 *
 * @param {Array} tokens The tokens to run through the pipeline.
 * @return {Array}
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.run = function (tokens) {
  var out = [],
      tokenLength = tokens.length,
      pipelineLength = this._queue.length;

  for (var i = 0; i < tokenLength; i++) {
    var token = tokens[i];

    for (var j = 0; j < pipelineLength; j++) {
      token = this._queue[j](token, i, tokens);
      if (token === void 0 || token === null) break;
    };

    if (token !== void 0 && token !== null) out.push(token);
  };

  return out;
};

/**
 * Resets the pipeline by removing any existing processors.
 *
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.reset = function () {
  this._queue = [];
};

 /**
  * Get the pipeline if user want to check the pipeline.
  *
  * @memberOf Pipeline
  */
 elasticlunr.Pipeline.prototype.get = function () {
   return this._queue;
 };

/**
 * Returns a representation of the pipeline ready for serialisation.
 * Only serialize pipeline function's name. Not storing function, so when
 * loading the archived JSON index file, corresponding pipeline function is 
 * added by registered function of elasticlunr.Pipeline.registeredFunctions
 *
 * Logs a warning if the function has not been registered.
 *
 * @return {Array}
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.toJSON = function () {
  return this._queue.map(function (fn) {
    elasticlunr.Pipeline.warnIfFunctionNotRegistered(fn);
    return fn.label;
  });
};

/**
 * elasticlunr.Index is object that manages a search index.  It contains the indexes
 * and stores all the tokens and document lookups.  It also provides the main
 * user facing API for the library.
 *
 * @constructor
 */
elasticlunr.Index = function () {
  this._fields = [];
  this._ref = 'id';
  this.pipeline = new elasticlunr.Pipeline;
  this.documentStore = new elasticlunr.DocumentStore;
  this.index = {};
  this.eventEmitter = new elasticlunr.EventEmitter;
  this._idfCache = {};

  this.on('add', 'remove', 'update', (function () {
    this._idfCache = {};
  }).bind(this));
};

/**
 * Bind a handler to events being emitted by the index.
 *
 * The handler can be bound to many events at the same time.
 *
 * @param {String} [eventName] The name(s) of events to bind the function to.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
elasticlunr.Index.prototype.on = function () {
  var args = Array.prototype.slice.call(arguments);
  return this.eventEmitter.addListener.apply(this.eventEmitter, args);
};

/**
 * Removes a handler from an event being emitted by the index.
 *
 * @param {String} eventName The name of events to remove the function from.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
elasticlunr.Index.prototype.off = function (name, fn) {
  return this.eventEmitter.removeListener(name, fn);
};

/**
 * Loads a previously serialised index.
 *
 * Issues a warning if the index being imported was serialised
 * by a different version of elasticlunr.
 *
 * @param {Object} serialisedData The serialised set to load.
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.load = function (serialisedData) {
  if (serialisedData.version !== elasticlunr.version) {
    elasticlunr.utils.warn('version mismatch: current '
                    + elasticlunr.version + ' importing ' + serialisedData.version);
  }

  var idx = new this;

  idx._fields = serialisedData.fields;
  idx._ref = serialisedData.ref;
  idx.documentStore = elasticlunr.DocumentStore.load(serialisedData.documentStore);
  idx.pipeline = elasticlunr.Pipeline.load(serialisedData.pipeline);
  idx.index = {};
  for (var field in serialisedData.index) {
    idx.index[field] = elasticlunr.InvertedIndex.load(serialisedData.index[field]);
  }

  return idx;
};

/**
 * Adds a field to the list of fields that will be searchable within documents in the index.
 *
 * Remember that inner index is build based on field, which means each field has one inverted index.
 *
 * Fields should be added before any documents are added to the index, fields
 * that are added after documents are added to the index will only apply to new
 * documents added to the index.
 *
 * @param {String} fieldName The name of the field within the document that should be indexed
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.prototype.addField = function (fieldName) {
  this._fields.push(fieldName);
  this.index[fieldName] = new elasticlunr.InvertedIndex;
  return this;
};

/**
 * Sets the property used to uniquely identify documents added to the index,
 * by default this property is 'id'.
 *
 * This should only be changed before adding documents to the index, changing
 * the ref property without resetting the index can lead to unexpected results.
 *
 * @param {String} refName The property to use to uniquely identify the
 * documents in the index.
 * @param {Boolean} emitEvent Whether to emit add events, defaults to true
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.prototype.setRef = function (refName) {
  this._ref = refName;
  return this;
};

/**
 *
 * Set if the JSON format original documents are save into elasticlunr.DocumentStore
 *
 * Defaultly save all the original JSON documents.
 *
 * @param {Boolean} save Whether to save the original JSON documents.
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.prototype.saveDocument = function (save) {
  this.documentStore = new elasticlunr.DocumentStore(save);
  return this;
};

/**
 * Add a JSON format document to the index.
 *
 * This is the way new documents enter the index, this function will run the
 * fields from the document through the index's pipeline and then add it to
 * the index, it will then show up in search results.
 *
 * An 'add' event is emitted with the document that has been added and the index
 * the document has been added to. This event can be silenced by passing false
 * as the second argument to add.
 *
 * @param {Object} doc The JSON format document to add to the index.
 * @param {Boolean} emitEvent Whether or not to emit events, default true.
 * @memberOf Index
 */
elasticlunr.Index.prototype.addDoc = function (doc, emitEvent) {
  if (!doc) return;
  var emitEvent = emitEvent === undefined ? true : emitEvent;

  var docRef = doc[this._ref];

  this.documentStore.addDoc(docRef, doc);
  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(elasticlunr.tokenizer(doc[field]));
    this.documentStore.addFieldLength(docRef, field, fieldTokens.length);

    var tokenCount = {};
    fieldTokens.forEach(function (token) {
      if (token in tokenCount) tokenCount[token] += 1;
      else tokenCount[token] = 1;
    }, this);

    for (var token in tokenCount) {
      var termFrequency = tokenCount[token];
      termFrequency = Math.sqrt(termFrequency);
      this.index[field].addToken(token, { ref: docRef, tf: termFrequency });
    }
  }, this);

  if (emitEvent) this.eventEmitter.emit('add', doc, this);
};

/**
 * Removes a document from the index by doc ref.
 *
 * To make sure documents no longer show up in search results they can be
 * removed from the index using this method.
 *
 * A 'remove' event is emitted with the document that has been removed and the index
 * the document has been removed from. This event can be silenced by passing false
 * as the second argument to remove.
 *
 * If user setting DocumentStore not storing the documents, then remove doc by docRef is not allowed.
 *
 * @param {String|Integer} docRef The document ref to remove from the index.
 * @param {Boolean} emitEvent Whether to emit remove events, defaults to true
 * @memberOf Index
 */
elasticlunr.Index.prototype.removeDocByRef = function (docRef, emitEvent) {
  if (!docRef) return;
  if (this.documentStore.isDocStored() === false) {
    return;
  }

  if (!this.documentStore.hasDoc(docRef)) return;
  var doc = this.documentStore.getDoc(docRef);
  this.removeDoc(doc, false);
};

/**
 * Removes a document from the index.
 * This remove operation could work even the original doc is not store in the DocumentStore.
 *
 * To make sure documents no longer show up in search results they can be
 * removed from the index using this method.
 *
 * A 'remove' event is emitted with the document that has been removed and the index
 * the document has been removed from. This event can be silenced by passing false
 * as the second argument to remove.
 *
 *
 * @param {Object} doc The document ref to remove from the index.
 * @param {Boolean} emitEvent Whether to emit remove events, defaults to true
 * @memberOf Index
 */
elasticlunr.Index.prototype.removeDoc = function (doc, emitEvent) {
  if (!doc) return;

  var emitEvent = emitEvent === undefined ? true : emitEvent;

  var docRef = doc[this._ref];
  if (!this.documentStore.hasDoc(docRef)) return;

  this.documentStore.removeDoc(docRef);

  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(elasticlunr.tokenizer(doc[field]));
    fieldTokens.forEach(function (token) {
      this.index[field].removeToken(token, docRef);
    }, this);
  }, this);

  if (emitEvent) this.eventEmitter.emit('remove', doc, this);
};

/**
 * Updates a document in the index.
 *
 * When a document contained within the index gets updated, fields changed,
 * added or removed, to make sure it correctly matched against search queries,
 * it should be updated in the index.
 *
 * This method is just a wrapper around `remove` and `add`
 *
 * An 'update' event is emitted with the document that has been updated and the index.
 * This event can be silenced by passing false as the second argument to update. Only
 * an update event will be fired, the 'add' and 'remove' events of the underlying calls
 * are silenced.
 *
 * @param {Object} doc The document to update in the index.
 * @param {Boolean} emitEvent Whether to emit update events, defaults to true
 * @see Index.prototype.remove
 * @see Index.prototype.add
 * @memberOf Index
 */
elasticlunr.Index.prototype.updateDoc = function (doc, emitEvent) {
  var emitEvent = emitEvent === undefined ? true : emitEvent;

  this.removeDocByRef(doc[this._ref], false);
  this.addDoc(doc, false);

  if (emitEvent) this.eventEmitter.emit('update', doc, this);
};

/**
 * Calculates the inverse document frequency for a token within the index of a field.
 *
 * @param {String} token The token to calculate the idf of.
 * @param {String} field The field to compute idf.
 * @see Index.prototype.idf
 * @private
 * @memberOf Index
 */
elasticlunr.Index.prototype.idf = function (term, field) {
  var cacheKey = "@" + field + '/' + term;
  if (Object.prototype.hasOwnProperty.call(this._idfCache, cacheKey)) return this._idfCache[cacheKey];

  var df = this.index[field].getDocFreq(term);
  var idf = 1 + Math.log(this.documentStore.length / (df + 1));
  this._idfCache[cacheKey] = idf;

  return idf;
};

/**
 * get fields of current index instance
 *
 * @return {Array}
 */
elasticlunr.Index.prototype.getFields = function () {
  return this._fields.slice();
};

/**
 * Searches the index using the passed query.
 * Queries should be a string, multiple words are allowed.
 *
 * If config is null, will search all fields defaultly, and lead to OR based query.
 * If config is specified, will search specified with query time boosting.
 *
 * All query tokens are passed through the same pipeline that document tokens
 * are passed through, so any language processing involved will be run on every
 * query term.
 *
 * Each query term is expanded, so that the term 'he' might be expanded to
 * 'hello' and 'help' if those terms were already included in the index.
 *
 * Matching documents are returned as an array of objects, each object contains
 * the matching document ref, as set for this index, and the similarity score
 * for this document against the query.
 *
 * @param {String} query The query to search the index with.
 * @param {JSON} userConfig The user query config, JSON format.
 * @return {Object}
 * @see Index.prototype.idf
 * @see Index.prototype.documentVector
 * @memberOf Index
 */
elasticlunr.Index.prototype.search = function (query, userConfig) {
  if (!query) return [];
  if (typeof query === 'string') {
    query = {any: query};
  } else {
    query = JSON.parse(JSON.stringify(query));
  }

  var configStr = null;
  if (userConfig != null) {
    configStr = JSON.stringify(userConfig);
  }

  var config = new elasticlunr.Configuration(configStr, this.getFields()).get();

  var queryTokens = {};
  var queryFields = Object.keys(query);

  for (var i = 0; i < queryFields.length; i++) {
    var key = queryFields[i];

    queryTokens[key] = this.pipeline.run(elasticlunr.tokenizer(query[key]));
  }

  var queryResults = {};

  for (var field in config) {
    var tokens = queryTokens[field] || queryTokens.any;
    if (!tokens) {
      continue;
    }

    var fieldSearchResults = this.fieldSearch(tokens, field, config);
    var fieldBoost = config[field].boost;

    for (var docRef in fieldSearchResults) {
      fieldSearchResults[docRef] = fieldSearchResults[docRef] * fieldBoost;
    }

    for (var docRef in fieldSearchResults) {
      if (docRef in queryResults) {
        queryResults[docRef] += fieldSearchResults[docRef];
      } else {
        queryResults[docRef] = fieldSearchResults[docRef];
      }
    }
  }

  var results = [];
  var result;
  for (var docRef in queryResults) {
    result = {ref: docRef, score: queryResults[docRef]};
    if (this.documentStore.hasDoc(docRef)) {
      result.doc = this.documentStore.getDoc(docRef);
    }
    results.push(result);
  }

  results.sort(function (a, b) { return b.score - a.score; });
  return results;
};

/**
 * search queryTokens in specified field.
 *
 * @param {Array} queryTokens The query tokens to query in this field.
 * @param {String} field Field to query in.
 * @param {elasticlunr.Configuration} config The user query config, JSON format.
 * @return {Object}
 */
elasticlunr.Index.prototype.fieldSearch = function (queryTokens, fieldName, config) {
  var booleanType = config[fieldName].bool;
  var expand = config[fieldName].expand;
  var boost = config[fieldName].boost;
  var scores = null;
  var docTokens = {};

  // Do nothing if the boost is 0
  if (boost === 0) {
    return;
  }

  queryTokens.forEach(function (token) {
    var tokens = [token];
    if (expand == true) {
      tokens = this.index[fieldName].expandToken(token);
    }
    // Consider every query token in turn. If expanded, each query token
    // corresponds to a set of tokens, which is all tokens in the
    // index matching the pattern queryToken* .
    // For the set of tokens corresponding to a query token, find and score
    // all matching documents. Store those scores in queryTokenScores,
    // keyed by docRef.
    // Then, depending on the value of booleanType, combine the scores
    // for this query token with previous scores.  If booleanType is OR,
    // then merge the scores by summing into the accumulated total, adding
    // new document scores are required (effectively a union operator).
    // If booleanType is AND, accumulate scores only if the document
    // has previously been scored by another query token (an intersection
    // operation0.
    // Furthermore, since when booleanType is AND, additional
    // query tokens can't add new documents to the result set, use the
    // current document set to limit the processing of each new query
    // token for efficiency (i.e., incremental intersection).

    var queryTokenScores = {};
    tokens.forEach(function (key) {
      var docs = this.index[fieldName].getDocs(key);
      var idf = this.idf(key, fieldName);

      if (scores && booleanType == 'AND') {
          // special case, we can rule out documents that have been
          // already been filtered out because they weren't scored
          // by previous query token passes.
          var filteredDocs = {};
          for (var docRef in scores) {
              if (docRef in docs) {
                  filteredDocs[docRef] = docs[docRef];
              }
          }
          docs = filteredDocs;
      }
      // only record appeared token for retrieved documents for the
      // original token, not for expaned token.
      // beause for doing coordNorm for a retrieved document, coordNorm only care how many
      // query token appear in that document.
      // so expanded token should not be added into docTokens, if added, this will pollute the
      // coordNorm
      if (key == token) {
        this.fieldSearchStats(docTokens, key, docs);
      }

      for (var docRef in docs) {
        var tf = this.index[fieldName].getTermFrequency(key, docRef);
        var fieldLength = this.documentStore.getFieldLength(docRef, fieldName);
        var fieldLengthNorm = 1;
        if (fieldLength != 0) {
          fieldLengthNorm = 1 / Math.sqrt(fieldLength);
        }

        var penality = 1;
        if (key != token) {
          // currently I'm not sure if this penality is enough,
          // need to do verification
          penality = (1 - (key.length - token.length) / key.length) * 0.15;
        }

        var score = tf * idf * fieldLengthNorm * penality;

        if (docRef in queryTokenScores) {
          queryTokenScores[docRef] += score;
        } else {
          queryTokenScores[docRef] = score;
        }
      }
    }, this);

    scores = this.mergeScores(scores, queryTokenScores, booleanType);
  }, this);

  scores = this.coordNorm(scores, docTokens, queryTokens.length);
  return scores;
};

/**
 * Merge the scores from one set of tokens into an accumulated score table.
 * Exact operation depends on the op parameter. If op is 'AND', then only the
 * intersection of the two score lists is retained. Otherwise, the union of
 * the two score lists is returned. For internal use only.
 *
 * @param {Object} bool accumulated scores. Should be null on first call.
 * @param {String} scores new scores to merge into accumScores.
 * @param {Object} op merge operation (should be 'AND' or 'OR').
 *
 */

elasticlunr.Index.prototype.mergeScores = function (accumScores, scores, op) {
    if (!accumScores) {
        return scores;
    }
    if (op == 'AND') {
        var intersection = {};
        for (var docRef in scores) {
            if (docRef in accumScores) {
                intersection[docRef] = accumScores[docRef] + scores[docRef];
            }
        }
        return intersection;
    } else {
        for (var docRef in scores) {
            if (docRef in accumScores) {
                accumScores[docRef] += scores[docRef];
            } else {
                accumScores[docRef] = scores[docRef];
            }
        }
        return accumScores;
    }
};


/**
 * Record the occuring query token of retrieved doc specified by doc field.
 * Only for inner user.
 *
 * @param {Object} docTokens a data structure stores which token appears in the retrieved doc.
 * @param {String} token query token
 * @param {Object} docs the retrieved documents of the query token
 *
 */
elasticlunr.Index.prototype.fieldSearchStats = function (docTokens, token, docs) {
  for (var doc in docs) {
    if (doc in docTokens) {
      docTokens[doc].push(token);
    } else {
      docTokens[doc] = [token];
    }
  }
};

/**
 * coord norm the score of a doc.
 * if a doc contain more query tokens, then the score will larger than the doc
 * contains less query tokens.
 *
 * only for inner use.
 *
 * @param {Object} results first results
 * @param {Object} docs field search results of a token
 * @param {Integer} n query token number
 * @return {Object}
 */
elasticlunr.Index.prototype.coordNorm = function (scores, docTokens, n) {
  for (var doc in scores) {
    if (!(doc in docTokens)) continue;
    var tokens = docTokens[doc].length;
    scores[doc] = scores[doc] * tokens / n;
  }

  return scores;
};

/**
 * Returns a representation of the index ready for serialisation.
 *
 * @return {Object}
 * @memberOf Index
 */
elasticlunr.Index.prototype.toJSON = function () {
  var indexJson = {};
  this._fields.forEach(function (field) {
    indexJson[field] = this.index[field].toJSON();
  }, this);

  return {
    version: elasticlunr.version,
    fields: this._fields,
    ref: this._ref,
    documentStore: this.documentStore.toJSON(),
    index: indexJson,
    pipeline: this.pipeline.toJSON()
  };
};

/**
 * Applies a plugin to the current index.
 *
 * A plugin is a function that is called with the index as its context.
 * Plugins can be used to customise or extend the behaviour the index
 * in some way. A plugin is just a function, that encapsulated the custom
 * behaviour that should be applied to the index.
 *
 * The plugin function will be called with the index as its argument, additional
 * arguments can also be passed when calling use. The function will be called
 * with the index as its context.
 *
 * Example:
 *
 *     var myPlugin = function (idx, arg1, arg2) {
 *       // `this` is the index to be extended
 *       // apply any extensions etc here.
 *     }
 *
 *     var idx = elasticlunr(function () {
 *       this.use(myPlugin, 'arg1', 'arg2')
 *     })
 *
 * @param {Function} plugin The plugin to apply.
 * @memberOf Index
 */
elasticlunr.Index.prototype.use = function (plugin) {
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift(this);
  plugin.apply(this, args);
};

/**
 * elasticlunr.DocumentStore is a simple key-value document store used for storing sets of tokens for
 * documents stored in index.
 *
 * elasticlunr.DocumentStore store original JSON format documents that you could build search snippet by this original JSON document.
 *
 * user could choose whether original JSON format document should be store, if no configuration then document will be stored defaultly.
 * If user care more about the index size, user could select not store JSON documents, then this will has some defects, such as user
 * could not use JSON document to generate snippets of search results.
 *
 * @param {Boolean} save If the original JSON document should be stored.
 * @constructor
 * @module
 */
elasticlunr.DocumentStore = function (save) {
  if (save === null || save === undefined) {
    this._save = true;
  } else {
    this._save = save;
  }

  this.docs = {};
  this.docInfo = {};
  this.length = 0;
};

/**
 * Loads a previously serialised document store
 *
 * @param {Object} serialisedData The serialised document store to load.
 * @return {elasticlunr.DocumentStore}
 */
elasticlunr.DocumentStore.load = function (serialisedData) {
  var store = new this;

  store.length = serialisedData.length;
  store.docs = serialisedData.docs;
  store.docInfo = serialisedData.docInfo;
  store._save = serialisedData.save;

  return store;
};

/**
 * check if current instance store the original doc
 *
 * @return {Boolean}
 */
elasticlunr.DocumentStore.prototype.isDocStored = function () {
  return this._save;
};

/**
 * Stores the given doc in the document store against the given id.
 * If docRef already exist, then update doc.
 *
 * Document is store by original JSON format, then you could use original document to generate search snippets.
 *
 * @param {Integer|String} docRef The key used to store the JSON format doc.
 * @param {Object} doc The JSON format doc.
 */
elasticlunr.DocumentStore.prototype.addDoc = function (docRef, doc) {
  if (!this.hasDoc(docRef)) this.length++;

  if (this._save === true) {
    this.docs[docRef] = clone(doc);
  } else {
    this.docs[docRef] = null;
  }
};

/**
 * Retrieves the JSON doc from the document store for a given key.
 *
 * If docRef not found, return null.
 * If user set not storing the documents, return null.
 *
 * @param {Integer|String} docRef The key to lookup and retrieve from the document store.
 * @return {Object}
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.getDoc = function (docRef) {
  if (this.hasDoc(docRef) === false) return null;
  return this.docs[docRef];
};

/**
 * Checks whether the document store contains a key (docRef).
 *
 * @param {Integer|String} docRef The id to look up in the document store.
 * @return {Boolean}
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.hasDoc = function (docRef) {
  return docRef in this.docs;
};

/**
 * Removes the value for a key in the document store.
 *
 * @param {Integer|String} docRef The id to remove from the document store.
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.removeDoc = function (docRef) {
  if (!this.hasDoc(docRef)) return;

  delete this.docs[docRef];
  delete this.docInfo[docRef];
  this.length--;
};

/**
 * Add field length of a document's field tokens from pipeline results.
 * The field length of a document is used to do field length normalization even without the original JSON document stored.
 *
 * @param {Integer|String} docRef document's id or reference
 * @param {String} fieldName field name
 * @param {Integer} length field length
 */
elasticlunr.DocumentStore.prototype.addFieldLength = function (docRef, fieldName, length) {
  if (docRef === null || docRef === undefined) return;
  if (this.hasDoc(docRef) == false) return;

  if (!this.docInfo[docRef]) this.docInfo[docRef] = {};
  this.docInfo[docRef][fieldName] = length;
};

/**
 * Update field length of a document's field tokens from pipeline results.
 * The field length of a document is used to do field length normalization even without the original JSON document stored.
 *
 * @param {Integer|String} docRef document's id or reference
 * @param {String} fieldName field name
 * @param {Integer} length field length
 */
elasticlunr.DocumentStore.prototype.updateFieldLength = function (docRef, fieldName, length) {
  if (docRef === null || docRef === undefined) return;
  if (this.hasDoc(docRef) == false) return;

  this.addFieldLength(docRef, fieldName, length);
};

/**
 * get field length of a document by docRef
 *
 * @param {Integer|String} docRef document id or reference
 * @param {String} fieldName field name
 * @return {Integer} field length
 */
elasticlunr.DocumentStore.prototype.getFieldLength = function (docRef, fieldName) {
  if (docRef === null || docRef === undefined) return 0;

  if (!(docRef in this.docs)) return 0;
  if (!(fieldName in this.docInfo[docRef])) return 0;
  return this.docInfo[docRef][fieldName];
};

/**
 * Returns a JSON representation of the document store used for serialisation.
 *
 * @return {Object} JSON format
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.toJSON = function () {
  return {
    docs: this.docs,
    docInfo: this.docInfo,
    length: this.length,
    save: this._save
  };
};

/**
 * Cloning object
 *
 * @param {Object} object in JSON format
 * @return {Object} copied object
 */
function clone(obj) {
  if (null === obj || "object" !== typeof obj) return obj;

  var copy = obj.constructor();

  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }

  return copy;
}

/**
 * elasticlunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
 *
 * @module
 * @param {String} str The string to stem
 * @return {String}
 * @see elasticlunr.Pipeline
 */
elasticlunr.stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  var re_mgr0 = new RegExp(mgr0);
  var re_mgr1 = new RegExp(mgr1);
  var re_meq1 = new RegExp(meq1);
  var re_s_v = new RegExp(s_v);

  var re_1a = /^(.+?)(ss|i)es$/;
  var re2_1a = /^(.+?)([^s])s$/;
  var re_1b = /^(.+?)eed$/;
  var re2_1b = /^(.+?)(ed|ing)$/;
  var re_1b_2 = /.$/;
  var re2_1b_2 = /(at|bl|iz)$/;
  var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
  var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var re_1c = /^(.+?[^aeiou])y$/;
  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;

  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;

  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  var re2_4 = /^(.+?)(s|t)(ion)$/;

  var re_5 = /^(.+?)e$/;
  var re_5_1 = /ll$/;
  var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var porterStemmer = function porterStemmer(w) {
    var   stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = re_1a;
      re2 = re2_1a;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = re_1b;
    re2 = re2_1b;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = re_mgr0;
      if (re.test(fp[1])) {
        re = re_1b_2;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = re_s_v;
      if (re2.test(stem)) {
        w = stem;
        re2 = re2_1b_2;
        re3 = re3_1b_2;
        re4 = re4_1b_2;
        if (re2.test(w)) {  w = w + "e"; }
        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
    re = re_1c;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
    }

    // Step 2
    re = re_2;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = re_3;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = re_4;
    re2 = re2_4;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = re_mgr1;
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = re_5;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      re2 = re_meq1;
      re3 = re3_5;
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = re_5_1;
    re2 = re_mgr1;
    if (re.test(w) && re2.test(w)) {
      re = re_1b_2;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  };

  return porterStemmer;
})();

elasticlunr.Pipeline.registerFunction(elasticlunr.stemmer, 'stemmer');

/**
 * elasticlunr.stopWordFilter is an English language stop words filter, any words
 * contained in the stop word list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 * Currently this StopwordFilter using dictionary to do O(1) time complexity stop word filtering.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @return {String}
 * @see elasticlunr.Pipeline
 */
elasticlunr.stopWordFilter = function (token) {
  if (token && elasticlunr.stopWordFilter.stopWords[token] !== true) {
    return token;
  }
};

/**
 * Remove predefined stop words
 * if user want to use customized stop words, user could use this function to delete
 * all predefined stopwords.
 *
 * @return {null}
 */
elasticlunr.clearStopWords = function () {
  elasticlunr.stopWordFilter.stopWords = {};
};

/**
 * Add customized stop words
 * user could use this function to add customized stop words
 * 
 * @params {Array} words customized stop words
 * @return {null}
 */
elasticlunr.addStopWords = function (words) {
  if (words == null || Array.isArray(words) === false) return;

  words.forEach(function (word) {
    elasticlunr.stopWordFilter.stopWords[word] = true;
  }, this);
};

/**
 * Reset to default stop words
 * user could use this function to restore default stop words
 *
 * @return {null}
 */
elasticlunr.resetStopWords = function () {
  elasticlunr.stopWordFilter.stopWords = elasticlunr.defaultStopWords;
};

elasticlunr.defaultStopWords = {
  "": true,
  "a": true,
  "able": true,
  "about": true,
  "across": true,
  "after": true,
  "all": true,
  "almost": true,
  "also": true,
  "am": true,
  "among": true,
  "an": true,
  "and": true,
  "any": true,
  "are": true,
  "as": true,
  "at": true,
  "be": true,
  "because": true,
  "been": true,
  "but": true,
  "by": true,
  "can": true,
  "cannot": true,
  "could": true,
  "dear": true,
  "did": true,
  "do": true,
  "does": true,
  "either": true,
  "else": true,
  "ever": true,
  "every": true,
  "for": true,
  "from": true,
  "get": true,
  "got": true,
  "had": true,
  "has": true,
  "have": true,
  "he": true,
  "her": true,
  "hers": true,
  "him": true,
  "his": true,
  "how": true,
  "however": true,
  "i": true,
  "if": true,
  "in": true,
  "into": true,
  "is": true,
  "it": true,
  "its": true,
  "just": true,
  "least": true,
  "let": true,
  "like": true,
  "likely": true,
  "may": true,
  "me": true,
  "might": true,
  "most": true,
  "must": true,
  "my": true,
  "neither": true,
  "no": true,
  "nor": true,
  "not": true,
  "of": true,
  "off": true,
  "often": true,
  "on": true,
  "only": true,
  "or": true,
  "other": true,
  "our": true,
  "own": true,
  "rather": true,
  "said": true,
  "say": true,
  "says": true,
  "she": true,
  "should": true,
  "since": true,
  "so": true,
  "some": true,
  "than": true,
  "that": true,
  "the": true,
  "their": true,
  "them": true,
  "then": true,
  "there": true,
  "these": true,
  "they": true,
  "this": true,
  "tis": true,
  "to": true,
  "too": true,
  "twas": true,
  "us": true,
  "wants": true,
  "was": true,
  "we": true,
  "were": true,
  "what": true,
  "when": true,
  "where": true,
  "which": true,
  "while": true,
  "who": true,
  "whom": true,
  "why": true,
  "will": true,
  "with": true,
  "would": true,
  "yet": true,
  "you": true,
  "your": true
};

elasticlunr.stopWordFilter.stopWords = elasticlunr.defaultStopWords;

elasticlunr.Pipeline.registerFunction(elasticlunr.stopWordFilter, 'stopWordFilter');

/**
 * elasticlunr.trimmer is a pipeline function for trimming non word
 * characters from the begining and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @return {String}
 * @see elasticlunr.Pipeline
 */
elasticlunr.trimmer = function (token) {
  if (token === null || token === undefined) {
    throw new Error('token should not be undefined');
  }

  return token
    .replace(/^\W+/, '')
    .replace(/\W+$/, '');
};

elasticlunr.Pipeline.registerFunction(elasticlunr.trimmer, 'trimmer');


/**
 * elasticlunr.InvertedIndex is used for efficiently storing and
 * lookup of documents that contain a given token.
 *
 * @constructor
 */
elasticlunr.InvertedIndex = function () {
  this.root = { docs: {}, df: 0 };
};

/**
 * Loads a previously serialised inverted index.
 *
 * @param {Object} serialisedData The serialised inverted index to load.
 * @return {elasticlunr.InvertedIndex}
 */
elasticlunr.InvertedIndex.load = function (serialisedData) {
  var idx = new this;
  idx.root = serialisedData.root;

  return idx;
};

/**
 * Adds a {token: tokenInfo} pair to the inverted index.
 * If the token already exist, then update the tokenInfo.
 *
 * tokenInfo format: { ref: 1, tf: 2}
 * tokenInfor should contains the document's ref and the tf(token frequency) of that token in
 * the document.
 *
 * By default this function starts at the root of the current inverted index, however
 * it can start at any node of the inverted index if required.
 *
 * @param {String} token 
 * @param {Object} tokenInfo format: { ref: 1, tf: 2}
 * @param {Object} root An optional node at which to start looking for the
 * correct place to enter the doc, by default the root of this elasticlunr.InvertedIndex
 * is used.
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.addToken = function (token, tokenInfo, root) {
  var root = root || this.root,
      idx = 0;

  while (idx <= token.length - 1) {
    var key = token[idx];

    if (!(key in root)) root[key] = {docs: {}, df: 0};
    idx += 1;
    root = root[key];
  }

  var docRef = tokenInfo.ref;
  if (!root.docs[docRef]) {
    // if this doc not exist, then add this doc
    root.docs[docRef] = {tf: tokenInfo.tf};
    root.df += 1;
  } else {
    // if this doc already exist, then update tokenInfo
    root.docs[docRef] = {tf: tokenInfo.tf};
  }
};

/**
 * Checks whether a token is in this elasticlunr.InvertedIndex.
 * 
 *
 * @param {String} token The token to be checked
 * @return {Boolean}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.hasToken = function (token) {
  if (!token) return false;

  var node = this.root;

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return false;
    node = node[token[i]];
  }

  return true;
};

/**
 * Retrieve a node from the inverted index for a given token.
 * If token not found in this InvertedIndex, return null.
 * 
 *
 * @param {String} token The token to get the node for.
 * @return {Object}
 * @see InvertedIndex.prototype.get
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getNode = function (token) {
  if (!token) return null;

  var node = this.root;

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return null;
    node = node[token[i]];
  }

  return node;
};

/**
 * Retrieve the documents of a given token.
 * If token not found, return {}.
 *
 *
 * @param {String} token The token to get the documents for.
 * @return {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getDocs = function (token) {
  var node = this.getNode(token);
  if (node == null) {
    return {};
  }

  return node.docs;
};

/**
 * Retrieve term frequency of given token in given docRef.
 * If token or docRef not found, return 0.
 *
 *
 * @param {String} token The token to get the documents for.
 * @param {String|Integer} docRef
 * @return {Integer}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getTermFrequency = function (token, docRef) {
  var node = this.getNode(token);

  if (node == null) {
    return 0;
  }

  if (!(docRef in node.docs)) {
    return 0;
  }

  return node.docs[docRef].tf;
};

/**
 * Retrieve the document frequency of given token.
 * If token not found, return 0.
 *
 *
 * @param {String} token The token to get the documents for.
 * @return {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getDocFreq = function (token) {
  var node = this.getNode(token);

  if (node == null) {
    return 0;
  }

  return node.df;
};

/**
 * Remove the document identified by document's ref from the token in the inverted index.
 *
 *
 * @param {String} token Remove the document from which token.
 * @param {String} ref The ref of the document to remove from given token.
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.removeToken = function (token, ref) {
  if (!token) return;
  var node = this.getNode(token);

  if (node == null) return;

  if (ref in node.docs) {
    delete node.docs[ref];
    node.df -= 1;
  }
};

/**
 * Find all the possible suffixes of given token using tokens currently in the inverted index.
 * If token not found, return empty Array.
 *
 * @param {String} token The token to expand.
 * @return {Array}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.expandToken = function (token, memo, root) {
  if (token == null || token == '') return [];
  var memo = memo || [];

  if (root == void 0) {
    root = this.getNode(token);
    if (root == null) return memo;
  }

  if (root.df > 0) memo.push(token);

  for (var key in root) {
    if (key === 'docs') continue;
    if (key === 'df') continue;
    this.expandToken(token + key, memo, root[key]);
  }

  return memo;
};

/**
 * Returns a representation of the inverted index ready for serialisation.
 *
 * @return {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.toJSON = function () {
  return {
    root: this.root
  };
};

 
 /** 
  * elasticlunr.Configuration is used to analyze the user search configuration.
  * 
  * By elasticlunr.Configuration user could set query-time boosting, boolean model in each field.
  * 
  * Currently configuration supports:
  * 1. query-time boosting, user could set how to boost each field.
  * 2. boolean model chosing, user could choose which boolean model to use for each field.
  * 3. token expandation, user could set token expand to True to improve Recall. Default is False.
  * 
  * Query time boosting must be configured by field category, "boolean" model could be configured 
  * by both field category or globally as the following example. Field configuration for "boolean"
  * will overwrite global configuration.
  * Token expand could be configured both by field category or golbally. Local field configuration will
  * overwrite global configuration.
  * 
  * configuration example:
  * {
  *   fields:{ 
  *     title: {boost: 2},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  * 
  * "bool" field configuation overwrite global configuation example:
  * {
  *   fields:{ 
  *     title: {boost: 2, bool: "AND"},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  * 
  * "expand" example:
  * {
  *   fields:{ 
  *     title: {boost: 2, bool: "AND"},
  *     body: {boost: 1}
  *   },
  *   bool: "OR",
  *   expand: true
  * }
  * 
  * "expand" example for field category:
  * {
  *   fields:{ 
  *     title: {boost: 2, bool: "AND", expand: true},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  * 
  * setting the boost to 0 ignores the field (this will only search the title):
  * {
  *   fields:{
  *     title: {boost: 1},
  *     body: {boost: 0}
  *   }
  * }
  *
  * then, user could search with configuration to do query-time boosting.
  * idx.search('oracle database', {fields: {title: {boost: 2}, body: {boost: 1}}});
  * 
  * 
  * @constructor
  * 
  * @param {String} config user configuration
  * @param {Array} fields fields of index instance
  * @module
  */
elasticlunr.Configuration = function (config, fields) {
  var config = config || '';

  if (fields == undefined || fields == null) {
    throw new Error('fields should not be null');
  }

  this.config = {};

  var userConfig;
  try {
    userConfig = JSON.parse(config);
    this.buildUserConfig(userConfig, fields);
  } catch (error) {
    elasticlunr.utils.warn('user configuration parse failed, will use default configuration');
    this.buildDefaultConfig(fields);
  }
};

/**
 * Build default search configuration.
 * 
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.buildDefaultConfig = function (fields) {
  this.reset();
  fields.forEach(function (field) {
    this.config[field] = {
      boost: 1,
      bool: "OR",
      expand: false
    };
  }, this);
};

/**
 * Build user configuration.
 * 
 * @param {JSON} config User JSON configuratoin
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.buildUserConfig = function (config, fields) {
  var global_bool = "OR";
  var global_expand = false;

  this.reset();
  if ('bool' in config) {
    global_bool = config['bool'] || global_bool;
  }

  if ('expand' in config) {
    global_expand = config['expand'] || global_expand;
  }

  if ('fields' in config) {
    for (var field in config['fields']) {
      if (fields.indexOf(field) > -1) {
        var field_config = config['fields'][field];
        var field_expand = global_expand;
        if (field_config.expand != undefined) {
          field_expand = field_config.expand;
        }

        this.config[field] = {
          boost: (field_config.boost || field_config.boost === 0) ? field_config.boost : 1,
          bool: field_config.bool || global_bool,
          expand: field_expand
        };
      } else {
        elasticlunr.utils.warn('field name in user configuration not found in index instance fields');
      }
    }
  } else {
    this.addAllFields2UserConfig(global_bool, global_expand, fields);
  }
};

/**
 * Add all fields to user search configuration.
 * 
 * @param {String} bool Boolean model
 * @param {String} expand Expand model
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.addAllFields2UserConfig = function (bool, expand, fields) {
  fields.forEach(function (field) {
    this.config[field] = {
      boost: 1,
      bool: bool,
      expand: expand
    };
  }, this);
};

/**
 * get current user configuration
 */
elasticlunr.Configuration.prototype.get = function () {
  return this.config;
};

/**
 * reset user search configuration.
 */
elasticlunr.Configuration.prototype.reset = function () {
  this.config = {};
};
/**
 * sorted_set.js is added only to make elasticlunr.js compatible with lunr-languages.
 * if elasticlunr.js support different languages by default, this will make elasticlunr.js
 * much bigger that not good for browser usage.
 *
 */


/**
 * lunr.SortedSets are used to maintain an array of uniq values in a sorted
 * order.
 *
 * @constructor
 */
lunr.SortedSet = function () {
  this.length = 0;
    this.elements = [];
};

/**
 * Loads a previously serialised sorted set.
 *
 * @param {Array} serialisedData The serialised set to load.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.load = function (serialisedData) {
  var set = new this;

    set.elements = serialisedData;
    set.length = serialisedData.length;

    return set;
};

/**
 * Inserts new items into the set in the correct position to maintain the
 * order.
 *
 * @param {Object} The objects to add to this set.
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.add = function () {
  var i, element;

    for (i = 0; i < arguments.length; i++) {
    element = arguments[i];
        if (~this.indexOf(element)) continue;
        this.elements.splice(this.locationFor(element), 0, element);
    }

  this.length = this.elements.length;
};

/**
 * Converts this sorted set into an array.
 *
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.toArray = function () {
  return this.elements.slice();
};

/**
 * Creates a new array with the results of calling a provided function on every
 * element in this sorted set.
 *
 * Delegates to Array.prototype.map and has the same signature.
 *
 * @param {Function} fn The function that is called on each element of the
 * set.
 * @param {Object} ctx An optional object that can be used as the context
 * for the function fn.
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.map = function (fn, ctx) {
  return this.elements.map(fn, ctx);
};

/**
 * Executes a provided function once per sorted set element.
 *
 * Delegates to Array.prototype.forEach and has the same signature.
 *
 * @param {Function} fn The function that is called on each element of the
 * set.
 * @param {Object} ctx An optional object that can be used as the context
 * @memberOf SortedSet
 * for the function fn.
 */
lunr.SortedSet.prototype.forEach = function (fn, ctx) {
  return this.elements.forEach(fn, ctx);
};

/**
 * Returns the index at which a given element can be found in the
 * sorted set, or -1 if it is not present.
 *
 * @param {Object} elem The object to locate in the sorted set.
 * @returns {Number}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.indexOf = function (elem) {
  var start = 0,
      end = this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot];

    while (sectionLength > 1) {
    if (pivotElem === elem) return pivot;

        if (pivotElem < elem) start = pivot;
        if (pivotElem > elem) end = pivot;

        sectionLength = end - start;
        pivot = start + Math.floor(sectionLength / 2);
        pivotElem = this.elements[pivot];
    }

  if (pivotElem === elem) return pivot;

    return -1;
};

/**
 * Returns the position within the sorted set that an element should be
 * inserted at to maintain the current order of the set.
 *
 * This function assumes that the element to search for does not already exist
 * in the sorted set.
 *
 * @param {Object} elem The elem to find the position for in the set
 * @returns {Number}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.locationFor = function (elem) {
  var start = 0,
      end = this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot];

    while (sectionLength > 1) {
    if (pivotElem < elem) start = pivot;
        if (pivotElem > elem) end = pivot;

        sectionLength = end - start;
        pivot = start + Math.floor(sectionLength / 2);
        pivotElem = this.elements[pivot];
    }

  if (pivotElem > elem) return pivot;
    if (pivotElem < elem) return pivot + 1;
};

/**
 * Creates a new lunr.SortedSet that contains the elements in the intersection
 * of this set and the passed set.
 *
 * @param {lunr.SortedSet} otherSet The set to intersect with this set.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.intersect = function (otherSet) {
  var intersectSet = new lunr.SortedSet,
      i = 0, j = 0,
      a_len = this.length, b_len = otherSet.length,
      a = this.elements, b = otherSet.elements;

    while (true) {
    if (i > a_len - 1 || j > b_len - 1) break;

        if (a[i] === b[j]) {
      intersectSet.add(a[i]);
            i++, j++;
            continue;
        }

    if (a[i] < b[j]) {
      i++;
        continue;
    }

    if (a[i] > b[j]) {
      j++;
        continue;
    }
  };

  return intersectSet;
};

/**
 * Makes a copy of this set
 *
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.clone = function () {
  var clone = new lunr.SortedSet;

    clone.elements = this.toArray();
    clone.length = clone.elements.length;

    return clone;
};

/**
 * Creates a new lunr.SortedSet that contains the elements in the union
 * of this set and the passed set.
 *
 * @param {lunr.SortedSet} otherSet The set to union with this set.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.union = function (otherSet) {
  var longSet, shortSet, unionSet;

    if (this.length >= otherSet.length) {
    longSet = this, shortSet = otherSet;
    } else {
    longSet = otherSet, shortSet = this;
    }

  unionSet = longSet.clone();

    for(var i = 0, shortSetElements = shortSet.toArray(); i < shortSetElements.length; i++){
    unionSet.add(shortSetElements[i]);
    }

  return unionSet;
};

/**
 * Returns a representation of the sorted set ready for serialisation.
 *
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.toJSON = function () {
  return this.toArray();
    }
  /**
   * export the module via AMD, CommonJS or as a browser global
   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
   */
  ;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory);
    } else if (typeof exports === 'object') {
      /**
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like enviroments that support module.exports,
       * like Node.
       */
      module.exports = factory();
    } else {
      // Browser globals (root is window)
      root.elasticlunr = factory();
    }
  }(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return elasticlunr;
    }));
})();

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
}

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = finallyConstructor;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/** @suppress {undefinedVars} */
var globalNS = (function() {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('unable to locate global object');
})();

if (!('Promise' in globalNS)) {
  globalNS['Promise'] = Promise;
} else if (!globalNS.Promise.prototype['finally']) {
  globalNS.Promise.prototype['finally'] = finallyConstructor;
}

})));

/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function () {
    var i, len, focusableElements, firstFocusableElement, lastFocusableElement;

    var container = $('#site-navigation')[0];
    if (!container) {
        return;
    }

    var button = $('#menu-toggle')[0];
    if ('undefined' === typeof button) {
        return;
    }

    // Set vars.
    var html = $('html')[0], body=$('body')[0];
  
    var menu = container.getElementsByTagName('ul')[0];
    var menuWrapper = window.document.getElementById('main-navigation-wrapper');

    // Hide menu toggle button if menu is empty and return early.
    if ('undefined' === typeof menu) {
        button.style.display = 'none';
        return;
    }

    menu.setAttribute('aria-expanded', 'false');
    if (-1 === menu.className.indexOf('nav-menu')) {
        menu.className += ' nav-menu';
    }

    button.onclick = function () {
        if (-1 !== container.className.indexOf('toggled')) {
            closeMenu(); // Close menu.
        } else {
            html.className += ' disable-scroll';
            body.className += ' main-navigation-open';
            container.className += ' toggled';
            button.className += ' toggled';
            button.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-expanded', 'true');

            // Set focusable elements inside main navigation.
            focusableElements = container.querySelectorAll([
                'a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])',
                'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]',
                '[tabindex]:not([tabindex^="-"])'
            ]);
            firstFocusableElement = focusableElements[0];
            if (firstFocusableElement) {
                lastFocusableElement = focusableElements[focusableElements.length - 1];

                // Redirect last Tab to first focusable element.
                lastFocusableElement.addEventListener('keydown',
                    function(e) {
                        if ((e.keyCode === 9 && !e.shiftKey)) {
                            e.preventDefault();
                            button.focus(); // Set focus on first element - that's actually close menu button.
                        }
                    });

                // Redirect first Shift+Tab to toggle button element.
                firstFocusableElement.addEventListener('keydown',
                    function(e) {
                        if ((e.keyCode === 9 && e.shiftKey)) {
                            e.preventDefault();
                            button.focus(); // Set focus on last element.
                        }
                    });
            }
            // Redirect Shift+Tab from the toggle button to last focusable element.
            button.addEventListener('keydown',
                function (e) {
                    if ((e.keyCode === 9 && e.shiftKey)) {
                        e.preventDefault();
                        lastFocusableElement.focus(); // Set focus on last element.
                    }
                });
        }
    };

    // Close menu using Esc key.
    window.document.addEventListener('keyup',
        function (event) {

            if (event.keyCode == 27) {
                if (-1 !== container.className.indexOf('toggled')) {
                    closeMenu(); // Close menu.
                }
            }

        });

    // Close menu clicking menu wrapper area.
    menuWrapper.onclick = function (e) {
        if (e.target === menuWrapper && -1 !== container.className.indexOf('toggled')) {
            closeMenu(); // Close menu.
        }
    };

    // Close menu function.
    function closeMenu() {
        html.className = html.className.replace(' disable-scroll', '');
        body.className = body.className.replace(' main-navigation-open', '');
        container.className = container.className.replace(' toggled', '');
        button.className = button.className.replace(' toggled', '');
        button.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-expanded', 'false');
        button.focus();
    }

    // Get all the link elements within the menu.
    var links = menu.getElementsByTagName('a');
    var subMenus = menu.getElementsByTagName('ul');

    // Each time a menu link is focused or blurred, toggle focus.
    for (i = 0, len = links.length; i < len; i++) {
        links[i].addEventListener('focus', toggleFocus, true);
        links[i].addEventListener('blur', toggleFocus, true);
    }

    /**
     * Sets or removes .focus class on an element.
     */
    function toggleFocus() {
        var self = this;

        // Move up through the ancestors of the current link until we hit .nav-menu.
        while (-1 === self.className.indexOf('nav-menu')) {

            // On li elements toggle the class .focus.
            if ('li' === self.tagName.toLowerCase()) {
                if (-1 !== self.className.indexOf('focus')) {
                    self.className = self.className.replace(' focus', '');
                } else {
                    self.className += ' focus';
                }
            }

            self = self.parentElement;
        }
    }

    /**
     * Toggles `focus` class to allow submenu access on tablets.
     */
    (function (container) {
        var touchStartFn,
            i,
            parentLink = container.querySelectorAll('.menu-item-has-children > a, .page_item_has_children > a');

        if ('ontouchstart' in window) {
            touchStartFn = function (e) {
                var menuItem = this.parentNode, i;

                if (!menuItem.classList.contains('focus')) {
                    e.preventDefault();
                    for (i = 0; i < menuItem.parentNode.children.length; ++i) {
                        if (menuItem === menuItem.parentNode.children[i]) {
                            continue;
                        }
                        menuItem.parentNode.children[i].classList.remove('focus');
                    }
                    menuItem.classList.add('focus');
                } else {
                    menuItem.classList.remove('focus');
                }
            };

            for (i = 0; i < parentLink.length; ++i) {
                parentLink[i].addEventListener('touchstart', touchStartFn, false);
            }
        }
    }(container));

})();

/**
 * Skip link focus fix.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
(function () {
    var isIe = /(trident|msie)/i.test(window.navigator.userAgent);

    if (isIe && window.document.getElementById && window.addEventListener) {
        window.addEventListener('hashchange',
            function () {
                var id = window.location.hash.substring(1),
                    element;

                if (!(/^[A-z0-9_-]+$/.test(id))) {
                    return;
                }

                element = window.document.getElementById(id);

                if (element) {
                    if (!(/^(?:a|select|input|button|textarea)$/i.test(element.tagName))) {
                        element.tabIndex = -1;
                    }

                    element.focus();
                }
            },
            false);
    }
})();


cash.fn.highlight = function (pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType === 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
            if (pos >= 0) {
                var emnode = window.document.createElement('em');
                var middlebit = node.splitText(pos);
                middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                emnode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(emnode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }
    return this.length && pat && pat.length ? this.each(function () {
        innerHighlight(this, pat.toUpperCase());
    }) : this;
};


$(function () {
    var index = elasticlunr(function () {
        this.addField('title');
        this.addField('description');
        this.setRef('slug');
    });
    var showSearchResults = function (results, needle) {
        if (results) {
            $('.search-result-list').empty();
            for (var key in results) {
                if (results.hasOwnProperty(key)) {
                    var item = results[key].doc;
                    var resultItem = '<li>';
                    resultItem += '<a href="./' + item.slug + '" >';
                    resultItem += '<h2>' + item.title + '</h2>';
                    resultItem += '<p>' + item.description + '</p>';
                    resultItem += '</a>';
                    resultItem += '</li>';
                    $('.search-result-list').append(resultItem);
                }
            }
            var split = needle.split(' ');
            
            split.forEach(function(el) {
                $('.search-result-list').highlight(el);
            });
           
        }
    };

    var searchChange = function () {
        var inputText = $('.search-input')[0].value;
        if (inputText.length > 3) {
            $('.search-result-meta').empty();
            if (index.documentStore.length === 0) {
                fetch(window.uploadsFolder+'search.json')
                    .then(function (response) {
                        return response.json();
                    }).then(function (json) {
                        for (var key in json) {
                            if (json.hasOwnProperty(key)) {
                                index.addDoc(json[key]);
                            }
                        }
                        var res = index.search(inputText,
                            {
                                fields: {
                                    title: { boost: 2 },
                                    description: { boost: 1 }
                                }
                            });
                        showSearchResults(res, inputText);


                    });
            } else {
                var res = index.search(inputText,
                    {
                        fields: {
                            title: { boost: 2 },
                            description: { boost: 1 }
                        }
                    });
                showSearchResults(res, inputText);
            }
        } else {
            $('.search-result-meta').html('Type to start searching');
            $('.search-result-list').empty();
        }
    }

    var resetSearch = function () {
        $('.search-input')[0].value = '';
        $('.search-result-meta').html('Type to start searching');
        $('.search-result-list').empty();
    }

    $('.search-input')[0].addEventListener('keyup', searchChange);
    $('.search-input')[0].addEventListener('input', searchChange);
    $('.reset-search')[0].addEventListener('click', resetSearch);


});
WebFontConfig = {
    google: { families: [ 'Roboto:400,400italic,700,700italic', 'Lora:400,400italic,700,700italic' ] }
};
/* Web Font Loader v1.6.26 - (c) Adobe Systems, Google. License: Apache 2.0 */
(function() {
    function aa(a, b, c) { return a.call.apply(a.bind, arguments) }

    function ba(a, b, c) {
        if (!a) throw Error();
        if (2 < arguments.length) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function() {
                var c = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(c, d);
                return a.apply(b, c);
            };
        }
        return function() { return a.apply(b, arguments) };
    }

    function p(a, b, c) {
        p = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? aa : ba;
        return p.apply(null, arguments);
    }

    var q = Date.now || function() { return+new Date };

    function ca(a, b) {
        this.a = a;
        this.m = b || a;
        this.c = this.m.document;
    }

    var da = !!window.FontFace;

    function t(a, b, c, d) {
        b = a.c.createElement(b);
        if (c)
            for (var e in c) c.hasOwnProperty(e) && ("style" == e ? b.style.cssText = c[e] : b.setAttribute(e, c[e]));
        d && b.appendChild(a.c.createTextNode(d));
        return b;
    }

    function u(a, b, c) {
        a = a.c.getElementsByTagName(b)[0];
        a || (a = document.documentElement);
        a.insertBefore(c, a.lastChild);
    }

    function v(a) { a.parentNode && a.parentNode.removeChild(a) }

    function w(a, b, c) {
        b = b || [];
        c = c || [];
        for (var d = a.className.split(/\s+/), e = 0; e < b.length; e += 1) {
            for (var f = !1, g = 0; g < d.length; g += 1)
                if (b[e] === d[g]) {
                    f = !0;
                    break;
                }
            f || d.push(b[e]);
        }
        b = [];
        for (e = 0; e < d.length; e += 1) {
            f = !1;
            for (g = 0; g < c.length; g += 1)
                if (d[e] === c[g]) {
                    f = !0;
                    break;
                }
            f || b.push(d[e]);
        }
        a.className = b.join(" ").replace(/\s+/g, " ").replace(/^\s+|\s+$/, "");
    }

    function y(a, b) {
        for (var c = a.className.split(/\s+/), d = 0, e = c.length; d < e; d++) if (c[d] == b) return!0;
        return!1;
    }

    function z(a) {
        if ("string" === typeof a.f) return a.f;
        var b = a.m.location.protocol;
        "about:" == b && (b = a.a.location.protocol);
        return"https:" == b ? "https:" : "http:";
    }

    function ea(a) { return a.m.location.hostname || a.a.location.hostname }

    function A(a, b, c) {
        function d() { k && e && f && (k(g), k = null) }

        b = t(a, "link", { rel: "stylesheet", href: b, media: "all" });
        var e = !1, f = !0, g = null, k = c || null;
        da
            ? (b.onload = function() {
                e = !0;
                d();
            }, b.onerror = function() {
                e = !0;
                g = Error("Stylesheet failed to load");
                d();
            })
            : setTimeout(function() {
                    e = !0;
                    d();
                },
                0);
        u(a, "head", b);
    }

    function B(a, b, c, d) {
        var e = a.c.getElementsByTagName("head")[0];
        if (e) {
            var f = t(a, "script", { src: b }), g = !1;
            f.onload = f.onreadystatechange = function() {
                g ||
                    this.readyState && "loaded" != this.readyState && "complete" != this.readyState ||
                    (g = !0, c && c(null), f.onload = f.onreadystatechange =
                        null, "HEAD" == f.parentNode.tagName && e.removeChild(f));
            };
            e.appendChild(f);
            setTimeout(function() { g || (g = !0, c && c(Error("Script load timeout"))) }, d || 5E3);
            return f;
        }
        return null;
    };

    function C() {
        this.a = 0;
        this.c = null;
    }

    function D(a) {
        a.a++;
        return function() {
            a.a--;
            E(a);
        };
    }

    function F(a, b) {
        a.c = b;
        E(a);
    }

    function E(a) { 0 == a.a && a.c && (a.c(), a.c = null) };

    function G(a) { this.a = a || "-" }

    G.prototype.c = function(a) {
        for (var b = [], c = 0; c < arguments.length; c++) b.push(arguments[c].replace(/[\W_]+/g, "").toLowerCase());
        return b.join(this.a);
    };

    function H(a, b) {
        this.c = a;
        this.f = 4;
        this.a = "n";
        var c = (b || "n4").match(/^([nio])([1-9])$/i);
        c && (this.a = c[1], this.f = parseInt(c[2], 10));
    }

    function fa(a) { return I(a) + " " + (a.f + "00") + " 300px " + J(a.c) }

    function J(a) {
        var b = [];
        a = a.split(/,\s*/);
        for (var c = 0; c < a.length; c++) {
            var d = a[c].replace(/['"]/g, "");
            -1 != d.indexOf(" ") || /^\d/.test(d) ? b.push("'" + d + "'") : b.push(d);
        }
        return b.join(",");
    }

    function K(a) { return a.a + a.f }

    function I(a) {
        var b = "normal";
        "o" === a.a ? b = "oblique" : "i" === a.a && (b = "italic");
        return b;
    }

    function ga(a) {
        var b = 4, c = "n", d = null;
        a &&
        ((d = a.match(/(normal|oblique|italic)/i)) && d[1] && (c = d[1].substr(0, 1).toLowerCase()), (d =
                a.match(/([1-9]00|normal|bold)/i)) &&
            d[1] &&
            (/bold/i.test(d[1]) ? b = 7 : /[1-9]00/.test(d[1]) && (b = parseInt(d[1].substr(0, 1), 10))));
        return c + b;
    };

    function ha(a, b) {
        this.c = a;
        this.f = a.m.document.documentElement;
        this.h = b;
        this.a = new G("-");
        this.j = !1 !== b.events;
        this.g = !1 !== b.classes;
    }

    function ia(a) {
        a.g && w(a.f, [a.a.c("wf", "loading")]);
        L(a, "loading");
    }

    function M(a) {
        if (a.g) {
            var b = y(a.f, a.a.c("wf", "active")), c = [], d = [a.a.c("wf", "loading")];
            b || c.push(a.a.c("wf", "inactive"));
            w(a.f, c, d);
        }
        L(a, "inactive");
    }

    function L(a, b, c) {
        if (a.j && a.h[b])
            if (c) a.h[b](c.c, K(c));
            else a.h[b]();
    };

    function ja() { this.c = {} }

    function ka(a, b, c) {
        var d = [], e;
        for (e in b)
            if (b.hasOwnProperty(e)) {
                var f = a.c[e];
                f && d.push(f(b[e], c));
            }
        return d;
    };

    function N(a, b) {
        this.c = a;
        this.f = b;
        this.a = t(this.c, "span", { "aria-hidden": "true" }, this.f);
    }

    function O(a) { u(a.c, "body", a.a) }

    function P(a) {
        return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:" +
            J(a.c) +
            ";" +
            ("font-style:" + I(a) + ";font-weight:" + (a.f + "00") + ";");
    };

    function Q(a, b, c, d, e, f) {
        this.g = a;
        this.j = b;
        this.a = d;
        this.c = c;
        this.f = e || 3E3;
        this.h = f || void 0;
    }

    Q.prototype.start = function() {
        var a = this.c.m.document,
            b = this,
            c = q(),
            d = new Promise(function(d, e) {
                function k() {
                    q() - c >= b.f
                        ? e()
                        : a.fonts.load(fa(b.a), b.h).then(function(a) { 1 <= a.length ? d() : setTimeout(k, 25) },
                            function() { e() });
                }

                k();
            }),
            e = new Promise(function(a, d) { setTimeout(d, b.f) });
        Promise.race([e, d]).then(function() { b.g(b.a) }, function() { b.j(b.a) });
    };

    function R(a, b, c, d, e, f, g) {
        this.v = a;
        this.B = b;
        this.c = c;
        this.a = d;
        this.s = g || "BESbswy";
        this.f = {};
        this.w = e || 3E3;
        this.u = f || null;
        this.o = this.j = this.h = this.g = null;
        this.g = new N(this.c, this.s);
        this.h = new N(this.c, this.s);
        this.j = new N(this.c, this.s);
        this.o = new N(this.c, this.s);
        a = new H(this.a.c + ",serif", K(this.a));
        a = P(a);
        this.g.a.style.cssText = a;
        a = new H(this.a.c + ",sans-serif", K(this.a));
        a = P(a);
        this.h.a.style.cssText = a;
        a = new H("serif", K(this.a));
        a = P(a);
        this.j.a.style.cssText = a;
        a = new H("sans-serif", K(this.a));
        a =
            P(a);
        this.o.a.style.cssText = a;
        O(this.g);
        O(this.h);
        O(this.j);
        O(this.o);
    }

    var S = { D: "serif", C: "sans-serif" }, T = null;

    function U() {
        if (null === T) {
            var a = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);
            T = !!a && (536 > parseInt(a[1], 10) || 536 === parseInt(a[1], 10) && 11 >= parseInt(a[2], 10));
        }
        return T;
    }

    R.prototype.start = function() {
        this.f.serif = this.j.a.offsetWidth;
        this.f["sans-serif"] = this.o.a.offsetWidth;
        this.A = q();
        la(this);
    };

    function ma(a, b, c) {
        for (var d in S) if (S.hasOwnProperty(d) && b === a.f[S[d]] && c === a.f[S[d]]) return!0;
        return!1;
    }

    function la(a) {
        var b = a.g.a.offsetWidth, c = a.h.a.offsetWidth, d;
        (d = b === a.f.serif && c === a.f["sans-serif"]) || (d = U() && ma(a, b, c));
        d
            ? q() - a.A >= a.w
            ? U() && ma(a, b, c) && (null === a.u || a.u.hasOwnProperty(a.a.c))
            ? V(a, a.v)
            : V(a, a.B)
            : na(a)
            : V(a, a.v);
    }

    function na(a) { setTimeout(p(function() { la(this) }, a), 50) }

    function V(a, b) {
        setTimeout(p(function() {
                    v(this.g.a);
                    v(this.h.a);
                    v(this.j.a);
                    v(this.o.a);
                    b(this.a);
                },
                a),
            0);
    };

    function W(a, b, c) {
        this.c = a;
        this.a = b;
        this.f = 0;
        this.o = this.j = !1;
        this.s = c;
    }

    var X = null;
    W.prototype.g = function(a) {
        var b = this.a;
        b.g &&
            w(b.f,
                [b.a.c("wf", a.c, K(a).toString(), "active")],
                [b.a.c("wf", a.c, K(a).toString(), "loading"), b.a.c("wf", a.c, K(a).toString(), "inactive")]);
        L(b, "fontactive", a);
        this.o = !0;
        oa(this);
    };
    W.prototype.h = function(a) {
        var b = this.a;
        if (b.g) {
            var c = y(b.f, b.a.c("wf", a.c, K(a).toString(), "active")),
                d = [],
                e = [b.a.c("wf", a.c, K(a).toString(), "loading")];
            c || d.push(b.a.c("wf", a.c, K(a).toString(), "inactive"));
            w(b.f, d, e);
        }
        L(b, "fontinactive", a);
        oa(this);
    };

    function oa(a) {
        0 == --a.f &&
            a.j &&
            (a.o
                ? (a =
                    a.a, a.g && w(a.f, [a.a.c("wf", "active")], [a.a.c("wf", "loading"), a.a.c("wf", "inactive")]), L(a,
                    "active"))
                : M(a.a));
    };

    function pa(a) {
        this.j = a;
        this.a = new ja;
        this.h = 0;
        this.f = this.g = !0;
    }

    pa.prototype.load = function(a) {
        this.c = new ca(this.j, a.context || this.j);
        this.g = !1 !== a.events;
        this.f = !1 !== a.classes;
        qa(this, new ha(this.c, a), a);
    };

    function ra(a, b, c, d, e) {
        var f = 0 == --a.h;
        (a.f || a.g) &&
            setTimeout(function() {
                    var a = e || null, k = d || null || {};
                    if (0 === c.length && f) M(b.a);
                    else {
                        b.f += c.length;
                        f && (b.j = f);
                        var h, m = [];
                        for (h = 0; h < c.length; h++) {
                            var l = c[h], n = k[l.c], r = b.a, x = l;
                            r.g && w(r.f, [r.a.c("wf", x.c, K(x).toString(), "loading")]);
                            L(r, "fontloading", x);
                            r = null;
                            null === X &&
                            (X = window.FontFace
                                ? (x = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent))
                                ? 42 < parseInt(x[1], 10)
                                : !0
                                : !1);
                            X
                                ? r = new Q(p(b.g, b), p(b.h, b), b.c, l, b.s, n)
                                : r = new R(p(b.g, b),
                                    p(b.h, b),
                                    b.c,
                                    l,
                                    b.s,
                                    a,
                                    n);
                            m.push(r);
                        }
                        for (h = 0; h < m.length; h++) m[h].start();
                    }
                },
                0);
    }

    function qa(a, b, c) {
        var d = [], e = c.timeout;
        ia(b);
        var d = ka(a.a, c, a.c), f = new W(a.c, b, e);
        a.h = d.length;
        b = 0;
        for (c = d.length; b < c; b++) d[b].load(function(b, d, c) { ra(a, f, b, d, c) });
    };

    function sa(a, b) {
        this.c = a;
        this.a = b;
    }

    function ta(a, b, c) {
        var d = z(a.c);
        a = (a.a.api || "fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/, "");
        return d + "//" + a + "/" + b + ".js" + (c ? "?v=" + c : "");
    }

    sa.prototype.load = function(a) {
        function b() {
            if (f["__mti_fntLst" + d]) {
                var c = f["__mti_fntLst" + d](), e = [], h;
                if (c)
                    for (var m = 0; m < c.length; m++) {
                        var l = c[m].fontfamily;
                        void 0 != c[m].fontStyle && void 0 != c[m].fontWeight
                            ? (h = c[m].fontStyle + c[m].fontWeight, e.push(new H(l, h)))
                            : e.push(new H(l));
                    }
                a(e);
            } else setTimeout(function() { b() }, 50);
        }

        var c = this, d = c.a.projectId, e = c.a.version;
        if (d) {
            var f = c.c.m;
            B(this.c,
                    ta(c, d, e),
                    function(e) { e ? a([]) : (f["__MonotypeConfiguration__" + d] = function() { return c.a }, b()) })
                .id = "__MonotypeAPIScript__" +
                d;
        } else a([]);
    };

    function ua(a, b) {
        this.c = a;
        this.a = b;
    }

    ua.prototype.load = function(a) {
        var b, c, d = this.a.urls || [], e = this.a.families || [], f = this.a.testStrings || {}, g = new C;
        b = 0;
        for (c = d.length; b < c; b++) A(this.c, d[b], D(g));
        var k = [];
        b = 0;
        for (c = e.length; b < c; b++)
            if (d = e[b].split(":"), d[1])
                for (var h = d[1].split(","), m = 0; m < h.length; m += 1) k.push(new H(d[0], h[m]));
            else k.push(new H(d[0]));
        F(g, function() { a(k, f) });
    };

    function va(a, b, c) {
        a ? this.c = a : this.c = b + wa;
        this.a = [];
        this.f = [];
        this.g = c || "";
    }

    var wa = "//fonts.googleapis.com/css";

    function xa(a, b) {
        for (var c = b.length, d = 0; d < c; d++) {
            var e = b[d].split(":");
            3 == e.length && a.f.push(e.pop());
            var f = "";
            2 == e.length && "" != e[1] && (f = ":");
            a.a.push(e.join(f));
        }
    }

    function ya(a) {
        if (0 == a.a.length) throw Error("No fonts to load!");
        if (-1 != a.c.indexOf("kit=")) return a.c;
        for (var b = a.a.length, c = [], d = 0; d < b; d++) c.push(a.a[d].replace(/ /g, "+"));
        b = a.c + "?family=" + c.join("%7C");
        0 < a.f.length && (b += "&subset=" + a.f.join(","));
        0 < a.g.length && (b += "&text=" + encodeURIComponent(a.g));
        return b;
    };

    function za(a) {
        this.f = a;
        this.a = [];
        this.c = {};
    }

    var Aa =
        {
            latin: "BESbswy",
            "latin-ext": "\u00e7\u00f6\u00fc\u011f\u015f",
            cyrillic: "\u0439\u044f\u0416",
            greek: "\u03b1\u03b2\u03a3",
            khmer: "\u1780\u1781\u1782",
            Hanuman: "\u1780\u1781\u1782"
        },
        Ba = {
            thin: "1",
            extralight: "2",
            "extra-light": "2",
            ultralight: "2",
            "ultra-light": "2",
            light: "3",
            regular: "4",
            book: "4",
            medium: "5",
            "semi-bold": "6",
            semibold: "6",
            "demi-bold": "6",
            demibold: "6",
            bold: "7",
            "extra-bold": "8",
            extrabold: "8",
            "ultra-bold": "8",
            ultrabold: "8",
            black: "9",
            heavy: "9",
            l: "3",
            r: "4",
            b: "7"
        },
        Ca = { i: "i", italic: "i", n: "n", normal: "n" },
        Da =
            /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;

    function Ea(a) {
        for (var b = a.f.length, c = 0; c < b; c++) {
            var d = a.f[c].split(":"), e = d[0].replace(/\+/g, " "), f = ["n4"];
            if (2 <= d.length) {
                var g;
                var k = d[1];
                g = [];
                if (k)
                    for (var k = k.split(","), h = k.length, m = 0; m < h; m++) {
                        var l;
                        l = k[m];
                        if (l.match(/^[\w-]+$/)) {
                            var n = Da.exec(l.toLowerCase());
                            if (null == n) l = "";
                            else {
                                l = n[2];
                                l = null == l || "" == l ? "n" : Ca[l];
                                n = n[1];
                                if (null == n || "" == n) n = "4";
                                else var r = Ba[n], n = r ? r : isNaN(n) ? "4" : n.substr(0, 1);
                                l = [l, n].join("");
                            }
                        } else l = "";
                        l && g.push(l);
                    }
                0 < g.length && (f = g);
                3 == d.length &&
                    (d = d[2], g = [], d = d ? d.split(",") : g, 0 < d.length && (d = Aa[d[0]]) && (a.c[e] = d));
            }
            a.c[e] || (d = Aa[e]) && (a.c[e] = d);
            for (d = 0; d < f.length; d += 1) a.a.push(new H(e, f[d]));
        }
    };

    function Fa(a, b) {
        this.c = a;
        this.a = b;
    }

    var Ga = { Arimo: !0, Cousine: !0, Tinos: !0 };
    Fa.prototype.load = function(a) {
        var b = new C, c = this.c, d = new va(this.a.api, z(c), this.a.text), e = this.a.families;
        xa(d, e);
        var f = new za(e);
        Ea(f);
        A(c, ya(d), D(b));
        F(b, function() { a(f.a, f.c, Ga) });
    };

    function Ha(a, b) {
        this.c = a;
        this.a = b;
    }

    Ha.prototype.load = function(a) {
        var b = this.a.id, c = this.c.m;
        b
            ? B(this.c,
                (this.a.api || "https://use.typekit.net") + "/" + b + ".js",
                function(b) {
                    if (b) a([]);
                    else if (c.Typekit && c.Typekit.config && c.Typekit.config.fn) {
                        b = c.Typekit.config.fn;
                        for (var e = [], f = 0; f < b.length; f += 2)
                            for (var g = b[f], k = b[f + 1], h = 0; h < k.length; h++) e.push(new H(g, k[h]));
                        try {
                            c.Typekit.load({ events: !1, classes: !1, async: !0 });
                        } catch (m) {
                        }
                        a(e);
                    }
                },
                2E3)
            : a([]);
    };

    function Ia(a, b) {
        this.c = a;
        this.f = b;
        this.a = [];
    }

    Ia.prototype.load = function(a) {
        var b = this.f.id, c = this.c.m, d = this;
        b
            ? (c.__webfontfontdeckmodule__ || (c.__webfontfontdeckmodule__ = {}), c.__webfontfontdeckmodule__[b] =
                function(b, c) {
                    for (var g = 0, k = c.fonts.length; g < k; ++g) {
                        var h = c.fonts[g];
                        d.a.push(new H(h.name, ga("font-weight:" + h.weight + ";font-style:" + h.style)));
                    }
                    a(d.a);
                }, B(this.c,
                z(this.c) + (this.f.api || "//f.fontdeck.com/s/css/js/") + ea(this.c) + "/" + b + ".js",
                function(b) { b && a([]) }))
            : a([]);
    };
    var Y = new pa(window);
    Y.a.c.custom = function(a, b) { return new ua(b, a) };
    Y.a.c.fontdeck = function(a, b) { return new Ia(b, a) };
    Y.a.c.monotype = function(a, b) { return new sa(b, a) };
    Y.a.c.typekit = function(a, b) { return new Ha(b, a) };
    Y.a.c.google = function(a, b) { return new Fa(b, a) };
    var Z = { load: p(Y.load, Y) };
    "function" === typeof define && define.amd
        ? define(function() { return Z })
        : "undefined" !== typeof module && module.exports
        ? module.exports = Z
        : (window.WebFont = Z, window.WebFontConfig && Y.load(window.WebFontConfig));
}());