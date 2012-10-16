(function(){
  var root, previousBlunderscore, breaker, ArrayProto, ObjProto, FuncProto, push, slice, concat, unshift, toString, hasOwnProperty, nativeForEach, nativeMap, nativeReduce, nativeReduceRight, nativeFilter, nativeEvery, nativeSome, nativeIndexOf, nativeLastIndexOf, nativeIsArray, nativeKeys, nativeBind, blunderscore, _, exports, each, any, lookupIterator, group, flatten, ctor, bind, eq, identity, entityMap, entityRegexes, idCounter, noMatch, escapes, escaper, result, slice$ = [].slice;
  root = this;
  previousBlunderscore = root._;
  breaker = {};
  ArrayProto = Array.prototype;
  ObjProto = Object.prototype;
  FuncProto = Function.prototype;
  push = ArrayProto.push;
  slice = ArrayProto.slice;
  concat = ArrayProto.concat;
  unshift = ArrayProto.unshift;
  toString = ObjProto.toString;
  hasOwnProperty = ObjProto.hasOwnProperty;
  nativeForEach = ArrayProto.forEach;
  nativeMap = ArrayProto.map;
  nativeReduce = ArrayProto.reduce;
  nativeReduceRight = ArrayProto.reduceRight;
  nativeFilter = ArrayProto.filter;
  nativeEvery = ArrayProto.every;
  nativeSome = ArrayProto.some;
  nativeIndexOf = ArrayProto.indexOf;
  nativeLastIndexOf = ArrayProto.lastIndexOf;
  nativeIsArray = Array.isArray;
  nativeKeys = Object.keys;
  nativeBind = FuncProto.bind;
  _ = blunderscore = function(obj){
    if (obj instanceof _) {
      return obj;
    }
    if (!(this instanceof _)) {
      return new _(obj);
    }
    this._wrapped = obj;
  };
  if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root["_"] = _;
  }
  _.VERSION = "1.4.3-alpha";
  each = _.each = _.forEach = function(obj, iterator, context){
    var i, to$, key;
    if (obj == null) {
      return;
    }
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (i = 0, to$ = obj.length; i < to$; ++i) {
        if (iterator.call(context, obj[i], i, obj) === breaker) {
          return;
        }
      }
    } else {
      for (key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) {
            return;
          }
        }
      }
    }
  };
  _.map = _.collect = function(obj, iterator, context){
    var results;
    results = [];
    if (obj == null) {
      return results;
    }
    if (nativeMap && obj.map === nativeMap) {
      return obj.map(iterator, context);
    }
    each(obj, function(value, index, list){
      return results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context){
    var initial;
    initial = arguments.length > 2;
    if (obj == null) {
      obj = [];
    }
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) {
        iterator = _.bind(iterator, context);
      }
      return initial
        ? obj.reduce(iterator, memo)
        : obj.reduce(iterator);
    }
    each(obj, function(value, index, list){
      var memo, initial;
      if (!initial) {
        memo = value;
        return initial = true;
      } else {
        return memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    return memo;
  };
  _.reduceRight = _.foldr = function(obj, iterator, memo, context){
    var initial, length, keys;
    obj == null && (obj = []);
    initial = arguments.length > 2;
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) {
        iterator = _.bind(iterator, context);
      }
      return arguments.length > 2
        ? obj.reduceRight(iterator, memo)
        : obj.reduceRight(iterator);
    }
    length = obj.length;
    if (length !== +length) {
      keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list){
      index = keys
        ? keys[--length]
        : --length;
      if (!initial) {
        memo = obj[index];
        return initial = true;
      } else {
        return memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    return memo;
  };
  _.find = _.detect = function(obj, iterator, context){
    var result;
    result = void 8;
    any(obj, function(value, index, list){
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };
  _.filter = _.select = function(obj, iterator, context){
    var results;
    results = [];
    if (obj == null) {
      return results;
    }
    if (nativeFilter && obj.filter === nativeFilter) {
      return obj.filter(iterator, context);
    }
    each(obj, function(value, index, list){
      if (iterator.call(context, value, index, list)) {
        return results[results.length] = value;
      }
    });
    return results;
  };
  _.reject = function(obj, iterator, context){
    return _.filter(obj, function(value, index, list){
      return !iterator.call(context, value, index, list);
    }, context);
  };
  _.every = _.all = function(obj, iterator, context){
    var result;
    iterator || (iterator = identity);
    result = true;
    if (obj == null) {
      return result;
    }
    if (nativeEvery && obj.every === nativeEvery) {
      return obj.every(iterator, context);
    }
    each(obj, function(value, index, list){
      var result;
      if (!(result = result && iterator.call(context, value, index, list))) {
        return breaker;
      }
    });
    return !!result;
  };
  any = _.some = _.any = function(obj, iterator, context){
    var result;
    iterator || (iterator = identity);
    result = false;
    if (obj == null) {
      return result;
    }
    if (nativeSome && obj.some === nativeSome) {
      return obj.some(iterator, context);
    }
    each(obj, function(value, index, list){
      if (result || (result = iterator.call(context, value, index, list))) {
        return breaker;
      }
    });
    return !!result;
  };
  _.contains = _.include = function(obj, target){
    var found;
    found = false;
    if (obj == null) {
      return found;
    }
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
      return obj.indexOf(target) != -1;
    }
    found = any(obj, function(value){
      return value === target;
    });
    return found;
  };
  _.invoke = function(obj, method){
    var args;
    args = slice.call(arguments, 2);
    return _.map(obj, function(value){
      return (_.isFunction(method)
        ? method
        : value[method]).apply(value, args);
    });
  };
  _.pluck = function(obj, key){
    return _.map(obj, function(value){
      return value[key];
    });
  };
  _.where = function(obj, attrs){
    if (_.isEmpty(attrs)) {
      return [];
    }
    return _.filter(obj, function(value){
      var key;
      for (key in attrs) {
        if (attrs[key] !== value[key]) {
          return false;
        }
      }
      return true;
    });
  };
  _.max = function(obj, iterator, context){
    var result;
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) {
      return -Infinity;
    }
    result = {
      computed: -Infinity
    };
    each(obj, function(value, index, list){
      var computed;
      computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {
        value: value,
        computed: computed
      });
    });
    return result.value;
  };
  _.min = function(obj, iterator, context){
    var result;
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) {
      return Infinity;
    }
    result = {
      computed: Infinity
    };
    each(obj, function(value, index, list){
      var computed;
      computed = iterator ? iterator.call(context, value, index, list) : value;
      return computed < result.computed && (result = {
        value: value,
        computed: computed
      });
    });
    return result.value;
  };
  _.shuffle = function(obj){
    var rand, index, shuffled;
    rand = void 8;
    index = 0;
    shuffled = [];
    each(obj, function(value){
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      return shuffled[rand] = value;
    });
    return shuffled;
  };
  lookupIterator = function(value){
    if (_.isFunction(value)) {
      return value;
    } else {
      return function(obj){
        return obj[value];
      };
    }
  };
  _.sortBy = function(obj, value, context){
    var iterator;
    iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list){
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right){
      var a, b;
      a = left.criteria;
      b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 8) {
          return 1;
        }
        if (a < b || b === void 8) {
          return -1;
        }
      }
      return left.index < right.index ? -1 : 1;
    }), "value");
  };
  group = function(obj, value, context, behavior){
    var result, iterator;
    result = {};
    iterator = lookupIterator(value);
    each(obj, function(value, index){
      var key;
      key = iterator.call(context, value, index, obj);
      return behavior(result, key, value);
    });
    return result;
  };
  _.groupBy = function(obj, value, context){
    return group(obj, value, context, function(result, key, value){
      return (_.has(result, key)
        ? result[key]
        : result[key] = []).push(value);
    });
  };
  _.countBy = function(obj, value, context){
    return group(obj, value, context, function(result, key, value){
      if (!_.has(result, key)) {
        result[key] = 0;
      }
      return result[key]++;
    });
  };
  _.sortedIndex = function(array, obj, iterator, context){
    var value, low, high, mid;
    iterator = iterator == null
      ? identity
      : lookupIterator(iterator);
    value = iterator.call(context, obj);
    low = 0;
    high = array.length;
    while (low < high) {
      mid = low + high >>> 1;
      if (iterator.call(context, array[mid]) < value) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  };
  _.toArray = function(obj){
    if (!obj) {
      return [];
    }
    if (obj.length === +obj.length) {
      return slice.call(obj);
    }
    return _.values(obj);
  };
  _.size = function(obj){
    if (obj == null) {
      return 0;
    }
    if (obj.length === +obj.length) {
      return obj.length;
    } else {
      return _.keys(obj).length;
    }
  };
  _.first = _.head = _.take = function(array, n, guard){
    if (array == null) {
      return void 8;
    }
    return n != null && !guard
      ? slice.call(array, 0, n)
      : array[0];
  };
  _.initial = function(array, n, guard){
    return slice.call(array, 0, array.length - (!(n != null) || guard ? 1 : n));
  };
  _.last = function(array, n, guard){
    if (array == null) {
      return void 8;
    }
    if (n != null && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };
  _.rest = _.tail = _.drop = function(array, n, guard){
    return slice.call(array, !(n != null) || guard ? 1 : n);
  };
  _.compact = function(array){
    return _.filter(array, function(value){
      return !!value;
    });
  };
  flatten = function(input, shallow, output){
    each(input, function(value){
      if (_.isArray(value)) {
        if (shallow) {
          return push.apply(output, value);
        } else {
          return flatten(value, shallow, output);
        }
      } else {
        return output.push(value);
      }
    });
    return output;
  };
  _.flatten = function(array, shallow){
    return flatten(array, shallow, []);
  };
  _.without = function(array){
    return _.difference(array, slice.call(arguments, 1));
  };
  _.uniq = _.unique = function(array, isSorted, iterator, context){
    var initial, results, seen;
    initial = iterator ? _.map(array, iterator, context) : array;
    results = [];
    seen = [];
    each(initial, function(value, index){
      if (isSorted
        ? !index || seen[seen.length - 1] !== value
        : !_.contains(seen, value)) {
        seen.push(value);
        return results.push(array[index]);
      }
    });
    return results;
  };
  _.union = function(){
    return _.uniq(concat.apply(ArrayProto, arguments));
  };
  _.intersection = function(array){
    var rest;
    rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item){
      return _.every(rest, function(other){
        return _.indexOf(other, item) >= 0;
      });
    });
  };
  _.difference = function(array){
    var rest;
    rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };
  _.zip = function(){
    var args, length, results, i;
    args = slice.call(arguments);
    length = _.max(_.pluck(args, "length"));
    results = new Array(length);
    for (i = 0; i < length; ++i) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };
  _.object = function(list, values){
    var result, i, to$;
    if (list == null) {
      return {};
    }
    result = {};
    for (i = 0, to$ = list.length; i < to$; ++i) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };
  _.indexOf = function(array, item, isSorted){
    var i, l;
    if (array == null) {
      return -1;
    }
    i = 0;
    l = array.length;
    if (isSorted) {
      if (typeof isSorted === "number") {
        i = isSorted < 0 ? Math.max(0, l + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item
          ? i
          : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) {
      return array.indexOf(item, isSorted);
    }
    while (i < l) {
      if (array[i] === item) {
        return i;
      }
      i++;
    }
    return -1;
  };
  _.lastIndexOf = function(array, item, from){
    var hasIndex, i;
    if (array == null) {
      return -1;
    }
    hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex
        ? array.lastIndexOf(item, from)
        : array.lastIndexOf(item);
    }
    i = hasIndex
      ? from
      : array.length;
    while (i--) {
      if (array[i] === item) {
        return i;
      }
    }
    return -1;
  };
  _.range = function(start, stop, step){
    var len, idx, range;
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;
    len = Math.max(Math.ceil((stop - start) / step), 0);
    idx = 0;
    range = new Array(len);
    while (idx < len) {
      range[idx++] = start;
      start += step;
    }
    return range;
  };
  ctor = function(){};
  _.bind = bind = function(func, context){
    var args, bound;
    if (func.bind === nativeBind && nativeBind) {
      return nativeBind.apply(func, slice.call(arguments, 1));
    }
    if (!_.isFunction(func)) {
      throw new TypeError;
    }
    args = slice.call(arguments, 2);
    return bound = function(){
      var self, result;
      if (!(this instanceof bound)) {
        return func.apply(context, args.concat(slice.call(arguments)));
      }
      ctor.prototype = func.prototype;
      self = new ctor;
      result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) {
        return result;
      }
      return self;
    };
  };
  _.bindAll = function(obj){
    var funcs;
    funcs = slice$.call(arguments, 1);
    if (funcs.length === 0) {
      funcs = _.functions(obj);
    }
    each(funcs, function(f){
      return obj[f] = _.bind(obj[f], obj);
    });
    return obj;
  };
  _.memoize = function(func, hasher){
    var memo;
    memo = {};
    hasher || (hasher = identity);
    return function(){
      var key;
      key = hasher.apply(this, arguments);
      if (_.has(memo, key)) {
        return memo[key];
      } else {
        return memo[key] = func.apply(this, arguments);
      }
    };
  };
  _.delay = function(func, wait){
    var args;
    args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };
  _.defer = function(func){
    return _.delay.apply(blunderscore, [func, 1].concat(slice.call(arguments, 1)));
  };
  _.throttle = function(func, wait){
    var context, args, timeout, result, previous, later;
    context = void 8;
    args = void 8;
    timeout = void 8;
    result = void 8;
    previous = 0;
    later = function(){
      previous = new Date;
      timeout = null;
      return result = func.apply(context, args);
    };
    return function(){
      var now, remaining;
      now = new Date;
      remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        previous = now;
        result = func.apply(context, args);
      } else {
        if (!timeout) {
          timeout = setTimeout(later, remaining);
        }
      }
      return result;
    };
  };
  _.debounce = function(func, wait, immediate){
    var timeout, result;
    timeout = void 8;
    result = void 8;
    return function(){
      var context, args, later, callNow;
      context = this;
      args = arguments;
      later = function(){
        timeout = null;
        if (!immediate) {
          return result = func.apply(context, args);
        }
      };
      callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
      }
      return result;
    };
  };
  _.once = function(func){
    var ran, memo;
    ran = false;
    memo = void 8;
    return function(){
      if (ran) {
        return memo;
      }
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };
  _.wrap = function(func, wrapper){
    return function(){
      var args;
      args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };
  _.compose = function(){
    var funcs;
    funcs = arguments;
    return function(){
      var args, i;
      args = arguments;
      for (i = funcs.length - 1; i >= 0; --i) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };
  _.after = function(times, func){
    if (times <= 0) {
      return func();
    }
    return function(){
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };
  _.keys = nativeKeys || function(obj){
    var keys, key;
    if (obj !== Object(obj)) {
      throw new TypeError("Invalid object");
    }
    keys = [];
    for (key in obj) {
      if (_.has(obj, key)) {
        keys[keys.length] = key;
      }
    }
    return keys;
  };
  _.values = function(obj){
    var values, key;
    values = [];
    for (key in obj) {
      if (_.has(obj, key)) {
        values.push(obj[key]);
      }
    }
    return values;
  };
  _.pairs = function(obj){
    var pairs, key;
    pairs = [];
    for (key in obj) {
      if (_.has(obj, key)) {
        pairs.push([key, obj[key]]);
      }
    }
    return pairs;
  };
  _.invert = function(obj){
    var result, key;
    result = {};
    for (key in obj) {
      if (_.has(obj, key)) {
        result[obj[key]] = key;
      }
    }
    return result;
  };
  _.functions = _.methods = function(obj){
    var names, key;
    names = [];
    for (key in obj) {
      if (_.isFunction(obj[key])) {
        names.push(key);
      }
    }
    return names.sort();
  };
  _.extend = function(obj){
    each(slice.call(arguments, 1), function(source){
      var prop, results$ = [];
      for (prop in source) {
        results$.push(obj[prop] = source[prop]);
      }
      return results$;
    });
    return obj;
  };
  _.pick = function(obj){
    var copy, keys;
    copy = {};
    keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key){
      if (key in obj) {
        return copy[key] = obj[key];
      }
    });
    return copy;
  };
  _.omit = function(obj){
    var copy, keys, key;
    copy = {};
    keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (key in obj) {
      if (!_.contains(keys, key)) {
        copy[key] = obj[key];
      }
    }
    return copy;
  };
  _.defaults = function(obj){
    each(slice.call(arguments, 1), function(source){
      var prop, results$ = [];
      for (prop in source) {
        if (obj[prop] == null) {
          results$.push(obj[prop] = source[prop]);
        }
      }
      return results$;
    });
    return obj;
  };
  _.clone = function(obj){
    if (!_.isObject(obj)) {
      return obj;
    }
    return _.isArray(obj)
      ? obj.slice()
      : _.extend({}, obj);
  };
  _.tap = function(obj, interceptor){
    interceptor(obj);
    return obj;
  };
  eq = function(a, b, aStack, bStack){
    var className, length, size, result, aCtor, bCtor, key;
    if (a === b) {
      return a !== 0 || 1 / a === 1 / b;
    }
    if (a == null || b == null) {
      return a === b;
    }
    if (a instanceof _) {
      a = a._wrapped;
    }
    if (b instanceof _) {
      b = b._wrapped;
    }
    className = toString.call(a);
    if (className !== toString.call(b)) {
      return false;
    }
    switch (className) {
    case "[object String]":
      return a == String(b);
    case "[object Number]":
      return a != +a
        ? b != +b
        : a == 0
          ? 1 / a == 1 / b
          : a == +b;
    case "[object Date]":
    case "[object Boolean]":
      return +a === +b;
    case "[object RegExp]":
      return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
    }
    if (typeof a !== "object" || typeof b !== "object") {
      return false;
    }
    length = aStack.length;
    while (length--) {
      if (aStack[length] === a) {
        return bStack[length] === b;
      }
    }
    aStack.push(a);
    bStack.push(b);
    size = 0;
    result = true;
    if (className === "[object Array]") {
      size = a.length;
      result = size === b.length;
      if (result) {
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) {
            break;
          }
        }
      }
    } else {
      aCtor = a.constructor;
      bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) {
        return false;
      }
      for (key in a) {
        if (_.has(a, key)) {
          size++;
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) {
            break;
          }
        }
      }
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !size--) {
            break;
          }
        }
        result = !size;
      }
    }
    aStack.pop();
    bStack.pop();
    return result;
  };
  _.isEqual = function(a, b){
    return eq(a, b, [], []);
  };
  _.isEmpty = function(obj){
    var key;
    if (obj == null) {
      return true;
    }
    if (_.isArray(obj) || _.isString(obj)) {
      return obj.length === 0;
    }
    for (key in obj) {
      if (_.has(obj, key)) {
        return false;
      }
    }
    return true;
  };
  _.isElement = function(obj){
    return !!(obj && obj.nodeType === 1);
  };
  _.isArray = nativeIsArray || function(obj){
    return toString.call(obj) === "[object Array]";
  };
  _.isObject = function(obj){
    return obj === Object(obj);
  };
  each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(name){
    return _["is" + name] = function(obj){
      return toString.call(obj) === "[object " + name + "]";
    };
  });
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj){
      return !!(obj && _.has(obj, "callee"));
    };
  }
  if (typeof /./ !== "function") {
    _.isFunction = function(obj){
      return typeof obj === "function";
    };
  }
  _.isFinite = function(obj){
    return _.isNumber(obj) && isFinite(obj);
  };
  _.isNaN = function(obj){
    return _.isNumber(obj) && obj !== +obj;
  };
  _.isBoolean = function(obj){
    return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
  };
  _.isNull = function(obj){
    return obj === null;
  };
  _.isUndefined = function(obj){
    return obj === void 8;
  };
  _.has = function(obj, key){
    return hasOwnProperty.call(obj, key);
  };
  _.noConflict = function(){
    root._ = previousBlunderscore;
    return this;
  };
  _.identity = identity = function(value){
    return value;
  };
  _.times = function(n, iterator, context){
    var i, results$ = [];
    for (i = 0; i < n; ++i) {
      results$.push(iterator.call(context, i));
    }
    return results$;
  };
  _.random = function(min, max){
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + (0 | Math.random() * (max - min + 1));
  };
  entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);
  entityRegexes = {
    escape: new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"),
    unescape: new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")
  };
  _.each(["escape", "unescape"], function(method){
    return _[method] = function(string){
      if (string == null) {
        return "";
      }
      return ("" + string).replace(entityRegexes[method], function(m){
        return entityMap[method][m];
      });
    };
  });
  _.result = function(object, property){
    var value;
    if (object == null) {
      return null;
    }
    value = object[property];
    if (_.isFunction(value)) {
      return value.call(object);
    } else {
      return value;
    }
  };
  _.mixin = function(obj){
    return each(_.functions(obj), function(name){
      var func;
      func = _[name] = obj[name];
      return _.prototype[name] = function(){
        var args;
        args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(blunderscore, args));
      };
    });
  };
  idCounter = 0;
  _.uniqueId = function(prefix){
    var id;
    id = idCounter++;
    return prefix ? prefix + id : id;
  };
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };
  noMatch = /(.)^/;
  escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };
  escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  _.template = function(text, data, settings){
    var matcher, index, source, render, e, template;
    settings = _.defaults({}, settings, _.templateSettings);
    matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join("|") + "|$", "g");
    index = 0;
    source = "__p+='";
    text.replace(matcher, function(m, escape, interpolate, evaluate, offset){
      source += text.slice(index, offset).replace(escaper, function(m){
        return "\\" + escapes[m];
      });
      source += escape
        ? "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"
        : interpolate
          ? "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"
          : evaluate ? "';\n" + evaluate + "\n__p+='" : "";
      return index = offset + m.length;
    });
    source += "';\n";
    if (!settings.variable) {
      source = "with(obj||{}){\n" + source + "}\n";
    }
    source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
    try {
      render = new Function(settings.variable || "obj", "_", source);
    } catch (e$) {
      e = e$;
      e.source = source;
      throw e;
    }
    if (data) {
      return render(data, blunderscore);
    }
    template = function(data){
      return render.call(this, data, blunderscore);
    };
    template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}";
    return template;
  };
  _.chain = function(obj){
    return _(obj).chain();
  };
  result = function(obj){
    return this._chain ? _(obj).chain() : obj;
  };
  _.mixin(blunderscore);
  each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(name){
    var method;
    method = ArrayProto[name];
    return _.prototype[name] = function(){
      var obj;
      obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === "shift" || name === "splice") && obj.length === 0) {
        delete obj[0];
      }
      return result.call(this, obj);
    };
  });
  each(["concat", "join", "slice"], function(name){
    var method;
    method = ArrayProto[name];
    return _.prototype[name] = function(){
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });
  _.extend(_.prototype, {
    chain: function(){
      this._chain = true;
      return this;
    },
    value: function(){
      return this._wrapped;
    }
  });
}).call(this);
