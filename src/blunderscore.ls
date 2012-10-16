#     Blunderscore.ls 1.4.3-alpha
#
#
#     Based on:
#
#     Underscore.js 1.4.2
#     http://underscorejs.org
#     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
#     Underscore may be freely distributed under the MIT license.

root = this
previousBlunderscore = root._
breaker = {}
ArrayProto = Array::
ObjProto = Object::
FuncProto = Function::
push = ArrayProto.push
slice = ArrayProto.slice
concat = ArrayProto.concat
unshift = ArrayProto.unshift
toString = ObjProto.toString
hasOwnProperty = ObjProto.hasOwnProperty
nativeForEach = ArrayProto.forEach
nativeMap = ArrayProto.map
nativeReduce = ArrayProto.reduce
nativeReduceRight = ArrayProto.reduceRight
nativeFilter = ArrayProto.filter
nativeEvery = ArrayProto.every
nativeSome = ArrayProto.some
nativeIndexOf = ArrayProto.indexOf
nativeLastIndexOf = ArrayProto.lastIndexOf
nativeIsArray = Array.isArray
nativeKeys = Object.keys
nativeBind = FuncProto.bind

_ = blunderscore = !(obj) ->
  return obj  if obj instanceof _
  return new _(obj)  unless this instanceof _
  @_wrapped = obj

if typeof exports isnt "undefined"
  exports = module.exports = _  if typeof module isnt "undefined" and module.exports
  exports._ = _
else
  root["_"] = _
_.VERSION = "1.4.3-alpha"
each = _.each = _.forEach = !(obj, iterator, context) ->
  return  unless obj?
  if nativeForEach and obj.forEach is nativeForEach
    obj.forEach iterator, context
  else if obj.length is +obj.length
    for i from 0 til obj.length
      return  if iterator.call(context, obj[i], i, obj) is breaker
  else
    for key of obj
      return  if iterator.call(context, obj[key], key, obj) is breaker  if _.has(obj, key)

_.map = _.collect = (obj, iterator, context) ->
  results = []
  return results  unless obj?
  return obj.map(iterator, context)  if nativeMap and obj.map is nativeMap
  each obj, (value, index, list) ->
    results[results.length] = iterator.call(context, value, index, list)

  results

_.reduce = _.foldl = _.inject = (obj, iterator, memo, context) ->
  initial = arguments.length > 2
  obj = []  unless obj?
  if nativeReduce and obj.reduce is nativeReduce
    iterator = _.bind(iterator, context)  if context
    return (if initial then obj.reduce(iterator, memo) else obj.reduce(iterator))
  each obj, (value, index, list) ->
    unless initial
      memo = value
      initial = true
    else
      memo = iterator.call(context, memo, value, index, list)

  throw new TypeError("Reduce of empty array with no initial value")  unless initial
  memo

_.reduceRight = _.foldr = (obj = [], iterator, memo, context) ->
  initial = arguments.length > 2
  if nativeReduceRight and obj.reduceRight is nativeReduceRight
    iterator = _.bind(iterator, context)  if context
    return (if arguments.length > 2 then obj.reduceRight(iterator, memo) else obj.reduceRight(iterator))
  length = obj.length
  if length isnt +length
    keys = _.keys(obj)
    length = keys.length
  each obj, (value, index, list) ->
    index = (if keys then keys[--length] else --length)
    unless initial
      memo := obj[index]
      initial := true
    else
      memo := iterator.call(context, memo, obj[index], index, list)

  throw new TypeError("Reduce of empty array with no initial value")  unless initial
  memo

_.find = _.detect = (obj, iterator, context) ->
  result = undefined
  any obj, (value, index, list) ->
    if iterator.call(context, value, index, list)
      result := value
      true

  result

_.filter = _.select = (obj, iterator, context) ->
  results = []
  return results  unless obj?
  return obj.filter(iterator, context)  if nativeFilter and obj.filter is nativeFilter
  each obj, (value, index, list) ->
    results[results.length] = value  if iterator.call(context, value, index, list)

  results

_.reject = (obj, iterator, context) ->
  _.filter obj, ((value, index, list) ->
    not iterator.call(context, value, index, list)
  ), context

_.every = _.all = (obj, iterator, context) ->
  iterator or (iterator = identity)
  result = true
  return result  unless obj?
  return obj.every(iterator, context)  if nativeEvery and obj.every is nativeEvery
  each obj, (value, index, list) ->
    breaker  unless result = result and iterator.call(context, value, index, list)

  !!result

any = _.some = _.any = (obj, iterator || identity, context) ->
  result = false
  return result  unless obj?
  return obj.some(iterator, context)  if nativeSome and obj.some is nativeSome
  each obj, (value, index, list) ->
    breaker  if result or (result := iterator.call(context, value, index, list))

  !!result

_.contains = _.include = (obj, target) ->
  found = false
  return found  unless obj?
  return obj.indexOf(target) !~= -1  if nativeIndexOf and obj.indexOf is nativeIndexOf
  found = any(obj, (value) ->
    value is target
  )
  found

_.invoke = (obj, method, ...args) ->
  _.map obj, (value) ->
    (if _.isFunction(method) then method else value[method]).apply value, args


_.pluck = (obj, key) ->
  _.map obj, (value) ->
    value[key]


_.where = (obj, attrs) ->
  return []  if _.isEmpty(attrs)
  _.filter obj, (value) ->
    for key of attrs
      return false  if attrs[key] isnt value[key]
    true


_.max = (obj, iterator, context) ->
  return Math.max.apply(Math, obj)  if not iterator and _.isArray(obj) and obj[0] is +obj[0] and obj.length < 65535
  return -Infinity  if not iterator and _.isEmpty(obj)
  result =
    computed: -Infinity
  each obj, !(value, index, list) ->
    computed = (if iterator then iterator.call(context, value, index, list) else value)
    computed >= result.computed and (result :=
      value: value
      computed: computed
    )

  result.value

_.min = (obj, iterator, context) ->
  return Math.min.apply(Math, obj)  if not iterator and _.isArray(obj) and obj[0] is +obj[0] and obj.length < 65535
  return Infinity  if not iterator and _.isEmpty(obj)
  result = computed: Infinity
  each obj, (value, index, list) ->
    computed = (if iterator then iterator.call(context, value, index, list) else value)
    computed < result.computed and (result :=
      value: value
      computed: computed
    )

  result.value

_.shuffle = (obj) ->
  rand = undefined
  index = 0
  shuffled = []
  for key, value of obj
    rand = _.random(index++)
    shuffled[index - 1] = shuffled[rand]
    shuffled[rand] = value

  shuffled

lookupIterator = (value) ->
  if _.isFunction(value) then value else (obj) -> obj[value]

_.sortBy = (obj, value, context) ->
  iterator = lookupIterator(value)
  _.pluck _.map(obj, (value, index, list) ->
    value: value
    index: index
    criteria: iterator.call(context, value, index, list)
  ).sort((left, right) ->
    a = left.criteria
    b = right.criteria
    if a isnt b
      return 1  if a > b or a is undefined
      return -1  if a < b or b is undefined
    return if left.index < right.index then -1 else 1
  ), "value"

group = (obj, value, context, behavior) ->
  result = {}
  iterator = lookupIterator(value)
  for index, value of obj
    key = iterator.call(context, value, index, obj)
    behavior result, key, value

  result

_.groupBy = (obj, value, context) ->
  group obj, value, context, (result, key, value) ->
    (if _.has(result, key) then result[key] else (result[key] = [])).push value


_.countBy = (obj, value, context) ->
  group obj, value, context, (result, key, value) ->
    result[key] = 0  unless _.has(result, key)
    result[key]++


_.sortedIndex = (array, obj, iterator, context) ->
  iterator = (if not iterator? then identity else lookupIterator(iterator))
  value = iterator.call(context, obj)
  low = 0
  high = array.length
  while low < high
    mid = (low + high) .>>>. 1
    (if iterator.call(context, array[mid]) < value then low = mid + 1 else high = mid)
  low

_.toArray = (obj) ->
  return []  unless obj
  return slice.call(obj)  if obj.length is +obj.length
  _.values obj

_.size = (obj) ->
  return 0  unless obj?
  (if (obj.length is +obj.length) then obj.length else _.keys(obj).length)

_.first = _.head = _.take = (array, n, guard) ->
  return undefined  unless array?
  return if (n?) and not guard then slice.call(array, 0, n) else array[0]

_.initial = (array, n, guard) ->
  slice.call array, 0, array.length - ((if (not (n?)) or guard then 1 else n))

_.last = (array, n, guard) ->
  return undefined  unless array?
  if (n?) and not guard
    slice.call array, Math.max(array.length - n, 0)
  else
    array[array.length - 1]

_.rest = _.tail = _.drop = (array, n, guard) ->
  slice.call array, (if (not (n?)) or guard then 1 else n)

_.compact = (array) ->
  _.filter array, (value) ->
    !!value


flatten = (input, shallow, output) ->
  for key, value of input
    if _.isArray(value)
      (if shallow then push.apply(output, value) else flatten(value, shallow, output))
    else
      output.push value

  output

_.flatten = (array, shallow) ->
  flatten array, shallow, []

_.without = (array, ...args) ->
  _.difference array, args

_.uniq = _.unique = (array, isSorted, iterator, context) ->
  initial = (if iterator then _.map(array, iterator, context) else array)
  results = []
  seen = []
  for index, value of initial
    if (if isSorted then (not index or seen[seen.length - 1] isnt value) else not _.contains(seen, value))
      seen.push value
      results.push array[index]

  results

_.union = ->
  _.uniq concat.apply(ArrayProto, arguments)

_.intersection = (array, ...rest) ->
  _.filter _.uniq(array), (item) ->
    _.every rest, (other) ->
      _.indexOf(other, item) >= 0



_.difference = (array) ->
  rest = concat.apply(ArrayProto, slice.call(arguments, 1))
  _.filter array, (value) ->
    not _.contains(rest, value)


_.zip = (...args) ->
  length = _.max(_.pluck(args, "length"))
  results = new Array(length)
  for i from 0 til length
    results[i] = _.pluck(args, "" + i)

  results

_.object = (list, values) ->
  return {}  unless list?
  result = {}
  for i from 0 til list.length
    if values
      result[list[i]] = values[i]
    else
      result[list[i][0]] = list[i][1]

  result

_.indexOf = (array, item, isSorted) ->
  return -1  unless array?
  i = 0
  l = array.length
  if isSorted
    if typeof isSorted is "number"
      i = ((if isSorted < 0 then Math.max(0, l + isSorted) else isSorted))
    else
      i = _.sortedIndex(array, item)
      return (if array[i] is item then i else -1)
  return array.indexOf(item, isSorted)  if nativeIndexOf and array.indexOf is nativeIndexOf
  while i < l
    return i  if array[i] is item
    i++
  -1

_.lastIndexOf = (array, item, from) ->
  return -1  unless array?
  hasIndex = from?
  return (if hasIndex then array.lastIndexOf(item, from) else array.lastIndexOf(item))  if nativeLastIndexOf and array.lastIndexOf is nativeLastIndexOf
  i = ((if hasIndex then from else array.length))
  while i--
    return i  if array[i] is item
  -1

_.range = (start, stop, step) ->
  if arguments.length <= 1
    stop = start or 0
    start = 0
  step = arguments[2] or 1
  len = Math.max(Math.ceil((stop - start) / step), 0)
  idx = 0
  range = new Array(len)
  while idx < len
    range[idx++] = start
    start += step
  range

ctor = ->

_.bind = bind = (func, context) ->
  return nativeBind.apply(func, slice.call(arguments, 1))  if func.bind is nativeBind and nativeBind
  throw new TypeError  unless _.isFunction(func)
  args = slice.call(arguments, 2)
  bound = (...args)->
    return func.apply(context, args.concat(args))  unless this instanceof bound
    ctor:: = func::
    self = new ctor
    result = func.apply(self, args.concat(args))
    return result  if Object(result) is result
    self

_.bindAll = (obj, ...funcs) ->
  funcs = _.functions(obj)  if funcs.length is 0
  for f in funcs
    obj[f] = _.bind(obj[f], obj)

  obj

_.memoize = (func, hasher) ->
  memo = {}
  hasher or (hasher = identity)
  ->
    key = hasher.apply(this, arguments)
    if _.has(memo, key) then memo[key] else (memo[key] = func.apply(this, arguments))

_.delay = (func, wait, ...args) ->
  setTimeout (->
    func.apply null, args
  ), wait

_.defer = (func, ...args) ->
  _.delay.apply blunderscore, [func, 1, ...args]

_.throttle = (func, wait) ->
  context = undefined
  args = undefined
  timeout = undefined
  result = undefined
  previous = 0
  later = ->
    previous := new Date
    timeout := null
    result := func.apply(context, args)

  ->
    now = new Date
    remaining = wait - (now - previous)
    context := this
    args := arguments
    if remaining <= 0
      clearTimeout timeout
      previous := now
      result := func.apply(context, args)
    else timeout := setTimeout(later, remaining)  unless timeout
    result

_.debounce = (func, wait, immediate) ->
  timeout = undefined
  result = undefined
  ->
    context = this
    args = arguments
    later = ->
      timeout := null
      result := func.apply(context, args)  unless immediate

    callNow = immediate and not timeout
    clearTimeout timeout
    timeout := setTimeout(later, wait)
    result := func.apply(context, args)  if callNow
    result

_.once = (func) ->
  ran = false
  memo = undefined
  ->
    return memo  if ran
    ran := true
    memo := func.apply(this, arguments)
    func := null
    memo

_.wrap = (func, wrapper) ->
  ->
    args = [func]
    push.apply args, arguments
    wrapper.apply this, args

_.compose = ->
  funcs = arguments
  ->
    args = arguments
    for i from funcs.length - 1 to 0 by -1
      args = [funcs[i].apply(this, args)]
    args[0]

_.after = (times, func) ->
  return func()  if times <= 0
  ->
    func.apply this, arguments  if --times < 1

_.keys = nativeKeys or (obj) ->
  throw new TypeError("Invalid object")  if obj isnt Object(obj)
  keys = []
  for key of obj
    keys[keys.length] = key  if _.has(obj, key)
  keys

_.values = (obj) ->
  values = []
  for key of obj
    values.push obj[key]  if _.has(obj, key)
  values

_.pairs = (obj) ->
  pairs = []
  for key of obj
    pairs.push [key, obj[key]]  if _.has(obj, key)
  pairs

_.invert = (obj) ->
  result = {}
  for key of obj
    result[obj[key]] = key  if _.has(obj, key)
  result

_.functions = _.methods = (obj) ->
  names = []
  for key of obj
    names.push key  if _.isFunction(obj[key])
  names.sort()

_.extend = (obj, ...extensions) ->
  for source in extensions
    for prop of source
      obj[prop] = source[prop]

  obj

_.pick = (obj, ...args) ->
  copy = {}
  keys = concat.apply(ArrayProto, args)
  for key in keys
    copy[key] = obj[key]  if key of obj

  copy

_.omit = (obj, ...args) ->
  copy = {}
  keys = concat.apply(ArrayProto, args)
  for key of obj
    copy[key] = obj[key]  unless _.contains(keys, key)
  copy

_.defaults = (obj, ...objects) ->
  for source in objects
    for prop of source
      obj[prop] = source[prop]  unless obj[prop]?

  obj

_.clone = (obj) ->
  return obj  unless _.isObject(obj)
  return if _.isArray(obj) then obj.slice() else _.extend({}, obj)

_.tap = (obj, interceptor) ->
  interceptor obj
  obj

eq = (a, b, aStack, bStack) ->
  return a isnt 0 or 1 / a is 1 / b  if a is b
  return a is b  if not a? or not b?
  a = a._wrapped  if a instanceof _
  b = b._wrapped  if b instanceof _
  className = toString.call(a)
  return false  unless className is toString.call(b)
  switch className
    when "[object String]"
      return a ~= String(b)
    when "[object Number]"
      return (if a !~= +a then b !~= +b else ((if a ~= 0 then 1 / a ~= 1 / b else a ~= +b)))
    when "[object Date]", "[object Boolean]"
      return +a is +b
    when "[object RegExp]"
      return a.source ~= b.source and a.global ~= b.global and a.multiline ~= b.multiline and a.ignoreCase ~= b.ignoreCase
  return false  if typeof a isnt "object" or typeof b isnt "object"
  length = aStack.length
  while length--
    return bStack[length] is b  if aStack[length] is a
  aStack.push a
  bStack.push b
  size = 0
  result = true
  if className is "[object Array]"
    size = a.length
    result = size is b.length
    if result
      while size--
        break  unless result = eq(a[size], b[size], aStack, bStack)
  else
    aCtor = a.constructor
    bCtor = b.constructor
    return false  if aCtor isnt bCtor and not (_.isFunction(aCtor) and (aCtor instanceof aCtor) and _.isFunction(bCtor) and (bCtor instanceof bCtor))
    for key of a
      if _.has(a, key)
        size++
        break  unless result = _.has(b, key) and eq(a[key], b[key], aStack, bStack)
    if result
      for key of b
        break  if _.has(b, key) and not (size--)
      result = not size
  aStack.pop()
  bStack.pop()
  result

_.isEqual = (a, b) ->
  eq a, b, [], []

_.isEmpty = (obj) ->
  return true  unless obj?
  return obj.length is 0  if _.isArray(obj) or _.isString(obj)
  for key of obj
    return false  if _.has(obj, key)
  true

_.isElement = (obj) ->
  !!(obj and obj.nodeType is 1)

_.isArray = nativeIsArray or (obj) ->
  toString.call(obj) is "[object Array]"

_.isObject = (obj) ->
  obj is Object(obj)

each ["Arguments", "Function", "String", "Number", "Date", "RegExp"], (name) ->
  _["is" + name] = (obj) ->
    toString.call(obj) is "[object " + name + "]"

unless _.isArguments(arguments)
  _.isArguments = (obj) ->
    !!(obj and _.has(obj, "callee"))
if typeof (/./) isnt "function"
  _.isFunction = (obj) ->
    typeof obj is "function"
_.isFinite = (obj) ->
  _.isNumber(obj) and isFinite(obj)

_.isNaN = (obj) ->
  _.isNumber(obj) and obj isnt +obj

_.isBoolean = (obj) ->
  obj is true or obj is false or toString.call(obj) is "[object Boolean]"

_.isNull = (obj) ->
  obj is null

_.isUndefined = (obj) ->
  obj is undefined

_.has = (obj, key) ->
  hasOwnProperty.call obj, key

_.noConflict = ->
  root._ = previousBlunderscore
  this

_.identity = identity = (value) -> value

_.times = (n, iterator, context) ->
  for i from 0 til n
    iterator.call context, i

_.random = (min, max) ->
  unless max?
    max = min
    min = 0
  min + (0 .|. Math.random() * (max - min + 1))

entityMap =
  escape:
    '&': '&amp;'
    '<': '&lt;'
    '>': '&gt;'
    '"': '&quot;'
    "'": '&#x27;'
    '/': '&#x2F;'

entityMap.unescape = _.invert(entityMap.escape)
entityRegexes =
  escape: new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g")
  unescape: new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")

_.each ["escape", "unescape"], (method) ->
  _[method] = (string) ->
    return ""  unless string?
    ("" + string).replace entityRegexes[method], (m) ->
        entityMap[method][m]


_.result = (object, property) ->
  return null  unless object?
  value = object[property]
  (if _.isFunction(value) then value.call(object) else value)

_.mixin = (obj) ->
  each _.functions(obj), (name) ->
    func = _[name] = obj[name]
    _::[name] = ->
      args = [@_wrapped]
      push.apply args, arguments
      result.call this, func.apply(blunderscore, args)


idCounter = 0
_.uniqueId = (prefix) ->
  id = idCounter++
  return if prefix then prefix + id else id

_.templateSettings =
  evaluate: /<%([\s\S]+?)%>/g
  interpolate: /<%=([\s\S]+?)%>/g
  escape: /<%-([\s\S]+?)%>/g

noMatch = /(.)^/

escapes =
  "'": "'"
  '\\': '\\'
  '\r': 'r'
  '\n': 'n'
  '\t': 't'
  '\u2028': 'u2028'
  '\u2029': 'u2029'

escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g

_.template = (text, data, settings) ->
  settings = _.defaults({}, settings, _.templateSettings)

  matcher = new RegExp([
    (settings.escape or noMatch).source,
    (settings.interpolate or noMatch).source,
    (settings.evaluate or noMatch).source
  ].join("|") + "|$", "g")

  index = 0
  source = "__p+='"
  text.replace matcher, (m, escape, interpolate, evaluate, offset) ->
    source += text.slice(index, offset).replace(escaper, (m) ->
      "\\" + escapes[m]
    )
    source += (if escape then "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" else (if interpolate then "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" else (if evaluate then "';\n" + evaluate + "\n__p+='" else "")))
    index := offset + m.length

  source += "';\n"
  source = "with(obj||{}){\n" + source + "}\n"  unless settings.variable
  source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n"
  try
    render = new Function(settings.variable or "obj", "_", source)
  catch e
    e.source = source
    throw e
  return render(data, blunderscore)  if data
  template = (data) ->
    render.call this, data, blunderscore

  template.source = "function(" + (settings.variable or "obj") + "){\n" + source + "}"
  template

_.chain = (obj) ->
  _(obj).chain()

result = (obj) ->
  return if @_chain then _(obj).chain() else obj

_.mixin blunderscore
each ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], (name) ->
  method = ArrayProto[name]
  _::[name] = ->
    obj = @_wrapped
    method.apply obj, arguments
    delete obj[0]  if (name is "shift" or name is "splice") and obj.length is 0
    result.call this, obj

each ["concat", "join", "slice"], (name) ->
  method = ArrayProto[name]
  _::[name] = ->
    result.call this, method.apply(@_wrapped, arguments)

_.extend _::,
  chain: ->
    @_chain = true
    this

  value: ->
    @_wrapped
