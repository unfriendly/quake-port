// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return ioq3ded || {} } catch(e) { return {} } })()');

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  if (!Module['printErr']) Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };

  var nodeFS = require('fs');
  var nodePath = require('path');

  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };

  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };

  Module['load'] = function load(f) {
    globalEval(read(f));
  };

  Module['arguments'] = process['argv'].slice(2);

  module['exports'] = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }

  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  this['ioq3ded'] = Module;

  eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (ENVIRONMENT_IS_WEB) {
    this['ioq3ded'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}



// === Auto-generated preamble library stuff ===

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (vararg) return 8;
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_ && type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [null],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    code = Pointer_stringify(code);
    if (code[0] === '"') {
      // tolerate EM_ASM("..code..") even though EM_ASM(..code..) is correct
      if (code.indexOf('"', 1) === code.length-1) {
        code = code.substr(1, code.length-2);
      } else {
        // something invalid happened, e.g. EM_ASM("..code($0)..", input)
        abort('invalid EM_ASM input |' + code + '|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)');
      }
    }
    return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + code + ' })'); // new Function does not allow upvars in node
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;

      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }

      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }

      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*(+4294967296))) : ((+((low>>>0)))+((+((high|0)))*(+4294967296)))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}


Module['Runtime'] = Runtime;

function jsCall() {
  var args = Array.prototype.slice.call(arguments);
  return Runtime.functionPointers[args[0]].apply(null, args.slice(1));
}








//========================================
// Runtime essentials
//========================================

var __THREW__ = 0; // Used in checking for thrown exceptions.

var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}

// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}

// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;

// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;

// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
Module['allocate'] = allocate;

function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }

  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
}
Module['stringToUTF16'] = stringToUTF16;

// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;

function demangle(func) {
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    var i = 3;
    // params, etc.
    var basicTypes = {
      'v': 'void',
      'b': 'bool',
      'c': 'char',
      's': 'short',
      'i': 'int',
      'l': 'long',
      'f': 'float',
      'd': 'double',
      'w': 'wchar_t',
      'a': 'signed char',
      'h': 'unsigned char',
      't': 'unsigned short',
      'j': 'unsigned int',
      'm': 'unsigned long',
      'x': 'long long',
      'y': 'unsigned long long',
      'z': '...'
    };
    function dump(x) {
      //return;
      if (x) Module.print(x);
      Module.print(func);
      var pre = '';
      for (var a = 0; a < i; a++) pre += ' ';
      Module.print (pre + '^');
    }
    var subs = [];
    function parseNested() {
      i++;
      if (func[i] === 'K') i++; // ignore const
      var parts = [];
      while (func[i] !== 'E') {
        if (func[i] === 'S') { // substitution
          i++;
          var next = func.indexOf('_', i);
          var num = func.substring(i, next) || 0;
          parts.push(subs[num] || '?');
          i = next+1;
          continue;
        }
        if (func[i] === 'C') { // constructor
          parts.push(parts[parts.length-1]);
          i += 2;
          continue;
        }
        var size = parseInt(func.substr(i));
        var pre = size.toString().length;
        if (!size || !pre) { i--; break; } // counter i++ below us
        var curr = func.substr(i + pre, size);
        parts.push(curr);
        subs.push(curr);
        i += pre + size;
      }
      i++; // skip E
      return parts;
    }
    var first = true;
    function parse(rawList, limit, allowVoid) { // main parser
      limit = limit || Infinity;
      var ret = '', list = [];
      function flushList() {
        return '(' + list.join(', ') + ')';
      }
      var name;
      if (func[i] === 'N') {
        // namespaced N-E
        name = parseNested().join('::');
        limit--;
        if (limit === 0) return rawList ? [name] : name;
      } else {
        // not namespaced
        if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
        var size = parseInt(func.substr(i));
        if (size) {
          var pre = size.toString().length;
          name = func.substr(i + pre, size);
          i += pre + size;
        }
      }
      first = false;
      if (func[i] === 'I') {
        i++;
        var iList = parse(true);
        var iRet = parse(true, 1, true);
        ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
      } else {
        ret = name;
      }
      paramLoop: while (i < func.length && limit-- > 0) {
        //dump('paramLoop');
        var c = func[i++];
        if (c in basicTypes) {
          list.push(basicTypes[c]);
        } else {
          switch (c) {
            case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
            case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
            case 'L': { // literal
              i++; // skip basic type
              var end = func.indexOf('E', i);
              var size = end - i;
              list.push(func.substr(i, size));
              i += size + 2; // size + 'EE'
              break;
            }
            case 'A': { // array
              var size = parseInt(func.substr(i));
              i += size.toString().length;
              if (func[i] !== '_') throw '?';
              i++; // skip _
              list.push(parse(true, 1, true)[0] + ' [' + size + ']');
              break;
            }
            case 'E': break paramLoop;
            default: ret += '?' + c; break paramLoop;
          }
        }
      }
      if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
      return rawList ? list : ret + flushList();
    }
    return parse();
  } catch(e) {
    return func;
  }
}

function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}

function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}

// Memory management

var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}

var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk

function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', or (2) set Module.TOTAL_MEMORY before the program runs.');
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 234881024;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;

var totalMemory = 4096;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2*TOTAL_STACK) {
  if (totalMemory < 16*1024*1024) {
    totalMemory *= 2;
  } else {
    totalMemory += 16*1024*1024
  }
}
if (totalMemory !== TOTAL_MEMORY) {
  Module.printErr('increasing TOTAL_MEMORY to ' + totalMemory + ' to be more reasonable');
  TOTAL_MEMORY = totalMemory;
}

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');

var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);

// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');

Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;

function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}

function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;

// Tools

// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;

// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr;
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];


var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


var memoryInitializer = null;

// === Body ===



STATIC_BASE = 8;

STATICTOP = STATIC_BASE + 2645600;


/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });











var _stdout;
var _stdout=_stdout=allocate(1, "i32*", ALLOC_STATIC);


var _stderr;
var _stderr=_stderr=allocate(1, "i32*", ALLOC_STATIC);










































var _in6addr_any;
var _in6addr_any=_in6addr_any=allocate([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































/* memory initializer */ allocate([40,2,0,0,16,0,0,0,232,146,0,0,4,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,177,0,0,8,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,120,145,0,0,168,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,174,0,0,88,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,208,143,0,0,172,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,171,0,0,176,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,142,0,0,180,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,138,0,0,4,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,136,0,0,8,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,134,0,0,12,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,200,132,0,0,16,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,130,0,0,20,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,128,0,0,24,1,0,0,3,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,126,0,0,36,1,0,0,3,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,124,0,0,48,1,0,0,3,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,123,0,0,60,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,121,0,0,64,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,118,0,0,68,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,184,116,0,0,72,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,176,115,0,0,76,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,114,0,0,80,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,184,112,0,0,84,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,87,0,0,8,0,0,0,64,86,0,0,108,0,0,0,80,85,0,0,50,0,0,0,192,83,0,0,62,0,0,0,184,82,0,0,90,0,0,0,48,109,0,0,72,0,0,0,248,81,0,0,78,0,0,0,96,81,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,208,0,0,0,16,3,0,0,104,177,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,174,0,0,80,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,171,0,0,160,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,169,0,0,164,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,166,0,0,168,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,164,0,0,172,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,162,0,0,176,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,160,0,0,180,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,157,0,0,184,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,155,0,0,188,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,192,153,0,0,192,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,151,0,0,196,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,149,0,0,200,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,148,0,0,204,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,95,0,0,0,0,0,0,32,0,0,0,176,158,0,0,20,0,0,0,0,0,0,0,32,156,0,0,24,0,0,0,0,0,0,0,56,94,0,0,8,0,0,0,8,0,0,0,32,93,0,0,32,0,0,0,0,0,0,0,24,92,0,0,36,0,0,0,0,0,0,0,96,91,0,0,156,0,0,0,0,0,0,0,240,88,0,0,152,0,0,0,0,0,0,0,232,86,0,0,44,0,0,0,240,255,255,255,112,154,0,0,28,0,0,0,0,0,0,0,40,86,0,0,40,0,0,0,0,0,0,0,56,85,0,0,72,0,0,0,8,0,0,0,168,83,0,0,16,0,0,0,240,255,255,255,136,82,0,0,108,0,0,0,16,0,0,0,240,192,0,0,84,0,0,0,8,0,0,0,200,81,0,0,88,0,0,0,4,0,0,0,48,81,0,0,112,0,0,0,8,0,0,0,16,185,0,0,76,0,0,0,8,0,0,0,0,80,0,0,116,0,0,0,8,0,0,0,32,79,0,0,12,0,0,0,16,0,0,0,216,180,0,0,68,0,0,0,10,0,0,0,248,76,0,0,148,0,0,0,4,0,0,0,64,175,0,0,104,0,0,0,16,0,0,0,48,75,0,0,128,0,0,0,10,0,0,0,64,74,0,0,48,0,0,0,16,0,0,0,80,73,0,0,52,0,0,0,16,0,0,0,176,72,0,0,60,0,0,0,16,0,0,0,16,72,0,0,132,0,0,0,8,0,0,0,152,71,0,0,164,0,0,0,248,255,255,255,56,71,0,0,168,0,0,0,8,0,0,0,160,70,0,0,172,0,0,0,8,0,0,0,48,70,0,0,176,0,0,0,8,0,0,0,168,68,0,0,180,0,0,0,8,0,0,0,216,144,0,0,184,1,0,0,8,0,0,0,144,67,0,0,4,0,0,0,8,0,0,0,32,67,0,0,56,0,0,0,16,0,0,0,200,66,0,0,64,0,0,0,16,0,0,0,40,66,0,0,80,0,0,0,12,0,0,0,136,65,0,0,120,0,0,0,8,0,0,0,24,65,0,0,124,0,0,0,8,0,0,0,192,167,0,0,140,0,0,0,8,0,0,0,48,170,0,0,144,0,0,0,5,0,0,0,144,64,0,0,160,0,0,0,0,0,0,0,248,237,0,0,92,0,0,0,0,0,0,0,128,237,0,0,96,0,0,0,0,0,0,0,160,235,0,0,100,0,0,0,0,0,0,0,72,234,0,0,192,1,0,0,10,0,0,0,88,146,0,0,188,1,0,0,16,0,0,0,24,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,17,74,29,0,48,0,0,0,24,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,17,74,29,0,49,0,0,0,24,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,17,74,29,0,50,0,0,0,24,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,17,74,29,0,51,0,0,0,24,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,17,74,29,0,52,0,0,0,24,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,17,74,29,0,53,0,0,0,24,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,17,74,29,0,54,0,0,0,24,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,17,74,29,0,55,0,0,0,24,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,17,74,29,0,56,0,0,0,24,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,17,74,29,0,57,0,0,0,1,0,0,0,0,0,0,0,184,202,0,0,8,199,0,0,255,255,255,255,0,0,0,0,203,209,3,0,233,160,0,0,148,24,0,0,194,27,0,0,146,14,0,0,166,14,0,0,222,23,0,0,243,90,0,0,37,130,0,0,38,27,0,0,158,30,0,0,242,37,0,0,41,36,0,0,107,67,0,0,109,15,0,0,242,6,0,0,96,32,0,0,68,6,0,0,54,6,0,0,127,6,0,0,76,4,0,0,189,4,0,0,214,4,0,0,110,4,0,0,213,6,0,0,35,4,0,0,222,4,0,0,125,4,0,0,249,4,0,0,134,17,0,0,245,10,0,0,144,13,0,0,59,85,0,0,135,4,0,0,134,6,0,0,42,4,0,0,19,4,0,0,244,3,0,0,29,4,0,0,46,4,0,0,190,6,0,0,120,3,0,0,156,4,0,0,82,3,0,0,192,3,0,0,12,3,0,0,216,6,0,0,224,12,0,0,134,41,0,0,162,17,0,0,249,22,0,0,125,10,0,0,42,18,0,0,253,14,0,0,45,8,0,0,75,7,0,0,24,10,0,0,157,7,0,0,180,7,0,0,172,3,0,0,110,4,0,0,252,6,0,0,134,6,0,0,182,4,0,0,87,22,0,0,240,23,0,0,54,28,0,0,254,25,0,0,126,14,0,0,211,14,0,0,212,5,0,0,244,5,0,0,167,8,0,0,116,4,0,0,75,5,0,0,203,3,0,0,132,8,0,0,224,4,0,0,48,5,0,0,171,4,0,0,234,6,0,0,54,4,0,0,240,4,0,0,242,4,0,0,144,4,0,0,197,3,0,0,131,4,0,0,162,4,0,0,67,5,0,0,204,4,0,0,249,5,0,0,64,6,0,0,57,10,0,0,0,8,0,0,242,9,0,0,203,12,0,0,106,9,0,0,1,14,0,0,200,9,0,0,240,10,0,0,115,10,0,0,2,24,0,0,79,14,0,0,24,11,0,0,173,55,0,0,92,12,0,0,173,8,0,0,151,6,0,0,136,12,0,0,179,10,0,0,184,13,0,0,188,18,0,0,251,15,0,0,187,13,0,0,168,20,0,0,176,15,0,0,1,31,0,0,143,23,0,0,240,20,0,0,84,15,0,0,28,19,0,0,159,14,0,0,214,17,0,0,199,18,0,0,220,22,0,0,0,25,0,0,81,24,0,0,99,32,0,0,203,90,0,0,158,30,0,0,161,27,0,0,231,34,0,0,61,21,0,0,131,17,0,0,57,14,0,0,136,20,0,0,192,20,0,0,208,20,0,0,250,20,0,0,164,13,0,0,154,9,0,0,158,6,0,0,29,7,0,0,73,8,0,0,124,7,0,0,125,4,0,0,236,5,0,0,87,5,0,0,212,4,0,0,5,4,0,0,234,4,0,0,80,4,0,0,221,4,0,0,238,3,0,0,125,4,0,0,1,4,0,0,217,4,0,0,184,3,0,0,7,5,0,0,229,3,0,0,177,6,0,0,241,3,0,0,163,4,0,0,111,3,0,0,75,4,0,0,161,3,0,0,54,4,0,0,183,3,0,0,120,6,0,0,162,3,0,0,129,4,0,0,6,4,0,0,238,4,0,0,38,4,0,0,190,4,0,0,36,4,0,0,85,6,0,0,162,3,0,0,82,4,0,0,144,3,0,0,10,4,0,0,124,3,0,0,134,4,0,0,222,3,0,0,151,4,0,0,82,3,0,0,97,4,0,0,135,3,0,0,63,4,0,0,152,3,0,0,120,4,0,0,32,4,0,0,134,13,0,0,192,8,0,0,45,17,0,0,104,47,0,0,78,30,0,0,65,5,0,0,27,5,0,0,206,12,0,0,158,7,0,0,118,3,0,0,255,3,0,0,88,4,0,0,53,4,0,0,18,4,0,0,37,4,0,0,47,4,0,0,204,5,0,0,233,3,0,0,72,4,0,0,147,3,0,0,28,4,0,0,227,3,0,0,46,4,0,0,108,3,0,0,87,4,0,0,83,3,0,0,35,4,0,0,37,3,0,0,88,4,0,0,155,3,0,0,79,4,0,0,49,3,0,0,107,7,0,0,80,7,0,0,208,3,0,0,73,3,0,0,103,4,0,0,188,3,0,0,135,4,0,0,182,3,0,0,111,30,0,0,186,3,0,0,9,5,0,0,165,3,0,0,103,4,0,0,135,12,0,0,252,3,0,0,159,3,0,0,75,5,0,0,0,3,0,0,16,4,0,0,233,2,0,0,184,3,0,0,37,3,0,0,49,4,0,0,228,2,0,0,245,3,0,0,37,3,0,0,240,3,0,0,28,3,0,0,228,3,0,0,33,4,0,0,193,44,0,0,192,52,0,0,0,0,0,0,0,0,0,0,1,0,0,0,3,0,0,0,7,0,0,0,15,0,0,0,31,0,0,0,63,0,0,0,127,0,0,0,255,0,0,0,255,1,0,0,255,3,0,0,255,7,0,0,255,15,0,0,255,31,0,0,255,63,0,0,255,127,0,0,255,255,0,0,255,255,1,0,255,255,3,0,255,255,7,0,255,255,15,0,255,255,31,0,255,255,63,0,255,255,127,0,255,255,255,0,255,255,255,1,255,255,255,3,255,255,255,7,255,255,255,15,255,255,255,31,255,255,255,63,255,255,255,127,255,255,255,255,236,0,0,0,144,12,0,0,184,187,0,0,32,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,224,0,0,112,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,240,184,0,0,192,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,158,0,0,196,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,139,0,0,200,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,119,0,0,204,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,102,0,0,208,0,0,0,3,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,88,0,0,220,0,0,0,3,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,16,0,16,0,16,0,16,0,16,0,16,0,16,0,16,0,17,0,17,0,17,0,17,0,18,0,18,0,18,0,18,0,19,0,19,0,19,0,19,0,20,0,20,0,20,0,20,0,21,0,21,0,21,0,21,0,16,0,201,0,196,0,0,0,3,0,4,0,5,0,6,0,7,0,8,0,9,0,10,0,11,0,13,0,15,0,17,0,19,0,23,0,27,0,31,0,35,0,43,0,51,0,59,0,67,0,83,0,99,0,115,0,131,0,163,0,195,0,227,0,2,1,0,0,0,0,0,0,16,0,16,0,16,0,16,0,17,0,17,0,18,0,18,0,19,0,19,0,20,0,20,0,21,0,21,0,22,0,22,0,23,0,23,0,24,0,24,0,25,0,25,0,26,0,26,0,27,0,27,0,28,0,28,0,29,0,29,0,64,0,64,0,1,0,2,0,3,0,4,0,5,0,7,0,9,0,13,0,17,0,25,0,33,0,49,0,65,0,97,0,129,0,193,0,1,1,129,1,1,2,1,3,1,4,1,6,1,8,1,12,1,16,1,24,1,32,1,48,1,64,1,96,0,0,0,0,16,0,17,0,18,0,0,0,8,0,7,0,9,0,6,0,10,0,5,0,11,0,4,0,12,0,3,0,13,0,2,0,14,0,1,0,15,0,0,0,255,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,7,0,0,0,8,80,0,0,8,16,0,20,8,115,0,18,7,31,0,0,8,112,0,0,8,48,0,0,9,192,0,16,7,10,0,0,8,96,0,0,8,32,0,0,9,160,0,0,8,0,0,0,8,128,0,0,8,64,0,0,9,224,0,16,7,6,0,0,8,88,0,0,8,24,0,0,9,144,0,19,7,59,0,0,8,120,0,0,8,56,0,0,9,208,0,17,7,17,0,0,8,104,0,0,8,40,0,0,9,176,0,0,8,8,0,0,8,136,0,0,8,72,0,0,9,240,0,16,7,4,0,0,8,84,0,0,8,20,0,21,8,227,0,19,7,43,0,0,8,116,0,0,8,52,0,0,9,200,0,17,7,13,0,0,8,100,0,0,8,36,0,0,9,168,0,0,8,4,0,0,8,132,0,0,8,68,0,0,9,232,0,16,7,8,0,0,8,92,0,0,8,28,0,0,9,152,0,20,7,83,0,0,8,124,0,0,8,60,0,0,9,216,0,18,7,23,0,0,8,108,0,0,8,44,0,0,9,184,0,0,8,12,0,0,8,140,0,0,8,76,0,0,9,248,0,16,7,3,0,0,8,82,0,0,8,18,0,21,8,163,0,19,7,35,0,0,8,114,0,0,8,50,0,0,9,196,0,17,7,11,0,0,8,98,0,0,8,34,0,0,9,164,0,0,8,2,0,0,8,130,0,0,8,66,0,0,9,228,0,16,7,7,0,0,8,90,0,0,8,26,0,0,9,148,0,20,7,67,0,0,8,122,0,0,8,58,0,0,9,212,0,18,7,19,0,0,8,106,0,0,8,42,0,0,9,180,0,0,8,10,0,0,8,138,0,0,8,74,0,0,9,244,0,16,7,5,0,0,8,86,0,0,8,22,0,64,8,0,0,19,7,51,0,0,8,118,0,0,8,54,0,0,9,204,0,17,7,15,0,0,8,102,0,0,8,38,0,0,9,172,0,0,8,6,0,0,8,134,0,0,8,70,0,0,9,236,0,16,7,9,0,0,8,94,0,0,8,30,0,0,9,156,0,20,7,99,0,0,8,126,0,0,8,62,0,0,9,220,0,18,7,27,0,0,8,110,0,0,8,46,0,0,9,188,0,0,8,14,0,0,8,142,0,0,8,78,0,0,9,252,0,96,7,0,0,0,8,81,0,0,8,17,0,21,8,131,0,18,7,31,0,0,8,113,0,0,8,49,0,0,9,194,0,16,7,10,0,0,8,97,0,0,8,33,0,0,9,162,0,0,8,1,0,0,8,129,0,0,8,65,0,0,9,226,0,16,7,6,0,0,8,89,0,0,8,25,0,0,9,146,0,19,7,59,0,0,8,121,0,0,8,57,0,0,9,210,0,17,7,17,0,0,8,105,0,0,8,41,0,0,9,178,0,0,8,9,0,0,8,137,0,0,8,73,0,0,9,242,0,16,7,4,0,0,8,85,0,0,8,21,0,16,8,2,1,19,7,43,0,0,8,117,0,0,8,53,0,0,9,202,0,17,7,13,0,0,8,101,0,0,8,37,0,0,9,170,0,0,8,5,0,0,8,133,0,0,8,69,0,0,9,234,0,16,7,8,0,0,8,93,0,0,8,29,0,0,9,154,0,20,7,83,0,0,8,125,0,0,8,61,0,0,9,218,0,18,7,23,0,0,8,109,0,0,8,45,0,0,9,186,0,0,8,13,0,0,8,141,0,0,8,77,0,0,9,250,0,16,7,3,0,0,8,83,0,0,8,19,0,21,8,195,0,19,7,35,0,0,8,115,0,0,8,51,0,0,9,198,0,17,7,11,0,0,8,99,0,0,8,35,0,0,9,166,0,0,8,3,0,0,8,131,0,0,8,67,0,0,9,230,0,16,7,7,0,0,8,91,0,0,8,27,0,0,9,150,0,20,7,67,0,0,8,123,0,0,8,59,0,0,9,214,0,18,7,19,0,0,8,107,0,0,8,43,0,0,9,182,0,0,8,11,0,0,8,139,0,0,8,75,0,0,9,246,0,16,7,5,0,0,8,87,0,0,8,23,0,64,8,0,0,19,7,51,0,0,8,119,0,0,8,55,0,0,9,206,0,17,7,15,0,0,8,103,0,0,8,39,0,0,9,174,0,0,8,7,0,0,8,135,0,0,8,71,0,0,9,238,0,16,7,9,0,0,8,95,0,0,8,31,0,0,9,158,0,20,7,99,0,0,8,127,0,0,8,63,0,0,9,222,0,18,7,27,0,0,8,111,0,0,8,47,0,0,9,190,0,0,8,15,0,0,8,143,0,0,8,79,0,0,9,254,0,96,7,0,0,0,8,80,0,0,8,16,0,20,8,115,0,18,7,31,0,0,8,112,0,0,8,48,0,0,9,193,0,16,7,10,0,0,8,96,0,0,8,32,0,0,9,161,0,0,8,0,0,0,8,128,0,0,8,64,0,0,9,225,0,16,7,6,0,0,8,88,0,0,8,24,0,0,9,145,0,19,7,59,0,0,8,120,0,0,8,56,0,0,9,209,0,17,7,17,0,0,8,104,0,0,8,40,0,0,9,177,0,0,8,8,0,0,8,136,0,0,8,72,0,0,9,241,0,16,7,4,0,0,8,84,0,0,8,20,0,21,8,227,0,19,7,43,0,0,8,116,0,0,8,52,0,0,9,201,0,17,7,13,0,0,8,100,0,0,8,36,0,0,9,169,0,0,8,4,0,0,8,132,0,0,8,68,0,0,9,233,0,16,7,8,0,0,8,92,0,0,8,28,0,0,9,153,0,20,7,83,0,0,8,124,0,0,8,60,0,0,9,217,0,18,7,23,0,0,8,108,0,0,8,44,0,0,9,185,0,0,8,12,0,0,8,140,0,0,8,76,0,0,9,249,0,16,7,3,0,0,8,82,0,0,8,18,0,21,8,163,0,19,7,35,0,0,8,114,0,0,8,50,0,0,9,197,0,17,7,11,0,0,8,98,0,0,8,34,0,0,9,165,0,0,8,2,0,0,8,130,0,0,8,66,0,0,9,229,0,16,7,7,0,0,8,90,0,0,8,26,0,0,9,149,0,20,7,67,0,0,8,122,0,0,8,58,0,0,9,213,0,18,7,19,0,0,8,106,0,0,8,42,0,0,9,181,0,0,8,10,0,0,8,138,0,0,8,74,0,0,9,245,0,16,7,5,0,0,8,86,0,0,8,22,0,64,8,0,0,19,7,51,0,0,8,118,0,0,8,54,0,0,9,205,0,17,7,15,0,0,8,102,0,0,8,38,0,0,9,173,0,0,8,6,0,0,8,134,0,0,8,70,0,0,9,237,0,16,7,9,0,0,8,94,0,0,8,30,0,0,9,157,0,20,7,99,0,0,8,126,0,0,8,62,0,0,9,221,0,18,7,27,0,0,8,110,0,0,8,46,0,0,9,189,0,0,8,14,0,0,8,142,0,0,8,78,0,0,9,253,0,96,7,0,0,0,8,81,0,0,8,17,0,21,8,131,0,18,7,31,0,0,8,113,0,0,8,49,0,0,9,195,0,16,7,10,0,0,8,97,0,0,8,33,0,0,9,163,0,0,8,1,0,0,8,129,0,0,8,65,0,0,9,227,0,16,7,6,0,0,8,89,0,0,8,25,0,0,9,147,0,19,7,59,0,0,8,121,0,0,8,57,0,0,9,211,0,17,7,17,0,0,8,105,0,0,8,41,0,0,9,179,0,0,8,9,0,0,8,137,0,0,8,73,0,0,9,243,0,16,7,4,0,0,8,85,0,0,8,21,0,16,8,2,1,19,7,43,0,0,8,117,0,0,8,53,0,0,9,203,0,17,7,13,0,0,8,101,0,0,8,37,0,0,9,171,0,0,8,5,0,0,8,133,0,0,8,69,0,0,9,235,0,16,7,8,0,0,8,93,0,0,8,29,0,0,9,155,0,20,7,83,0,0,8,125,0,0,8,61,0,0,9,219,0,18,7,23,0,0,8,109,0,0,8,45,0,0,9,187,0,0,8,13,0,0,8,141,0,0,8,77,0,0,9,251,0,16,7,3,0,0,8,83,0,0,8,19,0,21,8,195,0,19,7,35,0,0,8,115,0,0,8,51,0,0,9,199,0,17,7,11,0,0,8,99,0,0,8,35,0,0,9,167,0,0,8,3,0,0,8,131,0,0,8,67,0,0,9,231,0,16,7,7,0,0,8,91,0,0,8,27,0,0,9,151,0,20,7,67,0,0,8,123,0,0,8,59,0,0,9,215,0,18,7,19,0,0,8,107,0,0,8,43,0,0,9,183,0,0,8,11,0,0,8,139,0,0,8,75,0,0,9,247,0,16,7,5,0,0,8,87,0,0,8,23,0,64,8,0,0,19,7,51,0,0,8,119,0,0,8,55,0,0,9,207,0,17,7,15,0,0,8,103,0,0,8,39,0,0,9,175,0,0,8,7,0,0,8,135,0,0,8,71,0,0,9,239,0,16,7,9,0,0,8,95,0,0,8,31,0,0,9,159,0,20,7,99,0,0,8,127,0,0,8,63,0,0,9,223,0,18,7,27,0,0,8,111,0,0,8,47,0,0,9,191,0,0,8,15,0,0,8,143,0,0,8,79,0,0,9,255,0,16,5,1,0,23,5,1,1,19,5,17,0,27,5,1,16,17,5,5,0,25,5,1,4,21,5,65,0,29,5,1,64,16,5,3,0,24,5,1,2,20,5,33,0,28,5,1,32,18,5,9,0,26,5,1,8,22,5,129,0,64,5,0,0,16,5,2,0,23,5,129,1,19,5,25,0,27,5,1,24,17,5,7,0,25,5,1,6,21,5,97,0,29,5,1,96,16,5,4,0,24,5,1,3,20,5,49,0,28,5,1,48,18,5,13,0,26,5,1,12,22,5,193,0,64,5,0,0,248,78,0,0,16,0,0,0,32,0,0,0,32,70,0,0,24,0,0,0,0,0,0,0,112,237,0,0,28,0,0,0,0,0,0,0,120,231,0,0,36,0,0,0,0,0,0,0,88,224,0,0,40,0,0,0,0,0,0,0,168,218,0,0,32,0,0,0,0,0,0,0,208,214,0,0,64,0,0,0,0,0,0,0,16,211,0,0,44,0,0,0,0,0,0,0,120,206,0,0,60,0,0,0,0,0,0,0,192,202,0,0,180,0,0,0,10,0,0,0,16,199,0,0,132,0,0,0,0,0,0,0,8,196,0,0,4,0,0,0,8,0,0,0,240,192,0,0,200,0,0,0,8,0,0,0,16,190,0,0,184,0,0,0,8,0,0,0,16,185,0,0,196,0,0,0,8,0,0,0,216,180,0,0,148,0,0,0,10,0,0,0,216,178,0,0,12,0,0,0,8,0,0,0,64,175,0,0,8,0,0,0,19,0,0,0,168,172,0,0,140,0,0,0,10,0,0,0,48,170,0,0,192,0,0,0,8,0,0,0,192,167,0,0,168,0,0,0,8,0,0,0,136,165,0,0,120,0,0,0,0,0,0,0,152,163,0,0,20,0,0,0,32,0,0,0,208,161,0,0,48,0,0,0,8,0,0,0,176,158,0,0,92,0,0,0,0,0,0,0,32,156,0,0,96,0,0,0,0,0,0,0,112,154,0,0,100,0,0,0,0,0,0,0,168,152,0,0,176,0,0,0,24,0,0,0,176,150,0,0,188,0,0,0,16,0,0,0,32,149,0,0,160,0,0,0,8,0,0,0,176,147,0,0,144,0,0,0,10,0,0,0,88,146,0,0,156,0,0,0,8,0,0,0,216,144,0,0,204,0,0,0,8,0,0,0,248,142,0,0,112,0,0,0,0,0,0,0,160,139,0,0,104,0,0,0,0,0,0,0,64,137,0,0,108,0,0,0,0,0,0,0,80,135,0,0,164,0,0,0,8,0,0,0,168,133,0,0,116,0,0,0,0,0,0,0,120,131,0,0,84,0,0,0,32,0,0,0,152,128,0,0,52,0,0,0,32,0,0,0,160,126,0,0,56,0,0,0,32,0,0,0,240,124,0,0,68,0,0,0,0,0,0,0,160,123,0,0,72,0,0,0,0,0,0,0,64,122,0,0,76,0,0,0,0,0,0,0,96,119,0,0,80,0,0,0,0,0,0,0,64,117,0,0,88,0,0,0,32,0,0,0,8,116,0,0,124,0,0,0,0,0,0,0,216,114,0,0,128,0,0,0,0,0,0,0,40,113,0,0,136,0,0,0,0,0,0,0,232,111,0,0,152,0,0,0,32,0,0,0,144,110,0,0,172,0,0,0,16,0,0,0,0,0,0,0,24,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,17,74,29,0,0,0,0,0,48,235,0,0,66,0,0,0,0,65,0,0,70,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,73,0,0,64,0,0,0,120,72,0,0,14,0,0,0,248,71,0,0,44,0,0,0,120,71,0,0,18,0,0,0,16,71,0,0,46,0,0,0,128,70,0,0,48,0,0,0,8,70,0,0,30,0,0,0,64,68,0,0,20,0,0,0,120,67,0,0,68,0,0,0,16,67,0,0,8,0,0,0,184,66,0,0,38,0,0,0,24,66,0,0,56,0,0,0,120,65,0,0,32,0,0,0,0,65,0,0,54,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,66,0,0,0,0,0,0,0,0,0,0,0,8,173,0,0,1,0,0,0,0,0,0,0,232,219,0,0,2,0,0,0,0,0,0,0,56,182,0,0,3,0,0,0,0,0,0,0,216,156,0,0,4,0,0,0,0,0,0,0,32,138,0,0,5,0,0,0,0,0,0,0,216,117,0,0,6,0,0,0,0,0,0,0,40,101,0,0,7,0,0,0,0,0,0,0,184,87,0,0,8,0,0,0,0,0,0,0,208,75,0,0,9,0,0,0,0,0,0,0,248,67,0,0,10,0,0,0,0,0,0,0,240,234,0,0,11,0,0,0,0,0,0,0,240,228,0,0,12,0,0,0,0,0,0,0,216,221,0,0,13,0,0,0,0,0,0,0,176,216,0,0,14,0,0,0,0,0,0,0,0,213,0,0,15,0,0,0,0,0,0,0,240,208,0,0,16,0,0,0,0,0,0,0,200,204,0,0,17,0,0,0,0,0,0,0,216,200,0,0,18,0,0,0,0,0,0,0,88,197,0,0,19,0,0,0,0,0,0,0,88,194,0,0,20,0,0,0,0,0,0,0,80,191,0,0,21,0,0,0,0,0,0,0,48,188,0,0,22,0,0,0,0,0,0,0,80,183,0,0,23,0,0,0,0,0,0,0,144,179,0,0,24,0,0,0,0,0,0,0,8,177,0,0,25,0,0,0,0,0,0,0,216,173,0,0,26,0,0,0,0,0,0,0,56,171,0,0,27,0,0,0,0,0,0,0,192,168,0,0,28,0,0,0,0,0,0,0,120,166,0,0,29,0,0,0,0,0,0,0,56,164,0,0,30,0,0,0,0,0,0,0,112,162,0,0,31,0,0,0,0,0,0,0,208,160,0,0,32,0,0,0,0,0,0,0,72,157,0,0,33,0,0,0,0,0,0,0,240,154,0,0,34,0,0,0,0,0,0,0,144,153,0,0,35,0,0,0,0,0,0,0,104,151,0,0,36,0,0,0,0,0,0,0,176,149,0,0,37,0,0,0,0,0,0,0,48,148,0,0,38,0,0,0,0,0,0,0,184,146,0,0,39,0,0,0,0,0,0,0,72,145,0,0,40,0,0,0,0,0,0,0,152,143,0,0,41,0,0,0,0,0,0,0,16,142,0,0,42,0,0,0,0,0,0,0,104,138,0,0,43,0,0,0,0,0,0,0,40,136,0,0,44,0,0,0,0,0,0,0,184,134,0,0,45,0,0,0,0,0,0,0,152,132,0,0,46,0,0,0,0,0,0,0,104,130,0,0,47,0,0,0,0,0,0,0,8,128,0,0,48,0,0,0,0,0,0,0,8,126,0,0,49,0,0,0,0,0,0,0,72,124,0,0,50,0,0,0,0,0,0,0,24,123,0,0,51,0,0,0,0,0,0,0,136,121,0,0,52,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,95,112,137,0,255,9,47,15,10,0,0,0,100,0,0,0,232,3,0,0,16,39,0,0,160,134,1,0,64,66,15,0,128,150,152,0,0,225,245,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33,16,66,32,99,48,132,64,165,80,198,96,231,112,8,129,41,145,74,161,107,177,140,193,173,209,206,225,239,241,49,18,16,2,115,50,82,34,181,82,148,66,247,114,214,98,57,147,24,131,123,179,90,163,189,211,156,195,255,243,222,227,98,36,67,52,32,4,1,20,230,100,199,116,164,68,133,84,106,165,75,181,40,133,9,149,238,229,207,245,172,197,141,213,83,54,114,38,17,22,48,6,215,118,246,102,149,86,180,70,91,183,122,167,25,151,56,135,223,247,254,231,157,215,188,199,196,72,229,88,134,104,167,120,64,8,97,24,2,40,35,56,204,201,237,217,142,233,175,249,72,137,105,153,10,169,43,185,245,90,212,74,183,122,150,106,113,26,80,10,51,58,18,42,253,219,220,203,191,251,158,235,121,155,88,139,59,187,26,171,166,108,135,124,228,76,197,92,34,44,3,60,96,12,65,28,174,237,143,253,236,205,205,221,42,173,11,189,104,141,73,157,151,126,182,110,213,94,244,78,19,62,50,46,81,30,112,14,159,255,190,239,221,223,252,207,27,191,58,175,89,159,120,143,136,145,169,129,202,177,235,161,12,209,45,193,78,241,111,225,128,16,161,0,194,48,227,32,4,80,37,64,70,112,103,96,185,131,152,147,251,163,218,179,61,195,28,211,127,227,94,243,177,2,144,18,243,34,210,50,53,66,20,82,119,98,86,114,234,181,203,165,168,149,137,133,110,245,79,229,44,213,13,197,226,52,195,36,160,20,129,4,102,116,71,100,36,84,5,68,219,167,250,183,153,135,184,151,95,231,126,247,29,199,60,215,211,38,242,54,145,6,176,22,87,102,118,118,21,70,52,86,76,217,109,201,14,249,47,233,200,153,233,137,138,185,171,169,68,88,101,72,6,120,39,104,192,24,225,8,130,56,163,40,125,203,92,219,63,235,30,251,249,139,216,155,187,171,154,187,117,74,84,90,55,106,22,122,241,10,208,26,179,42,146,58,46,253,15,237,108,221,77,205,170,189,139,173,232,157,201,141,38,124,7,108,100,92,69,76,162,60,131,44,224,28,193,12,31,239,62,255,93,207,124,223,155,175,186,191,217,143,248,159,23,110,54,126,85,78,116,94,147,46,178,62,209,14,240,30,0,0,0,0,0,0,0,0,0,0,0,0,150,48,7,119,44,97,14,238,186,81,9,153,25,196,109,7,143,244,106,112,53,165,99,233,163,149,100,158,50,136,219,14,164,184,220,121,30,233,213,224,136,217,210,151,43,76,182,9,189,124,177,126,7,45,184,231,145,29,191,144,100,16,183,29,242,32,176,106,72,113,185,243,222,65,190,132,125,212,218,26,235,228,221,109,81,181,212,244,199,133,211,131,86,152,108,19,192,168,107,100,122,249,98,253,236,201,101,138,79,92,1,20,217,108,6,99,99,61,15,250,245,13,8,141,200,32,110,59,94,16,105,76,228,65,96,213,114,113,103,162,209,228,3,60,71,212,4,75,253,133,13,210,107,181,10,165,250,168,181,53,108,152,178,66,214,201,187,219,64,249,188,172,227,108,216,50,117,92,223,69,207,13,214,220,89,61,209,171,172,48,217,38,58,0,222,81,128,81,215,200,22,97,208,191,181,244,180,33,35,196,179,86,153,149,186,207,15,165,189,184,158,184,2,40,8,136,5,95,178,217,12,198,36,233,11,177,135,124,111,47,17,76,104,88,171,29,97,193,61,45,102,182,144,65,220,118,6,113,219,1,188,32,210,152,42,16,213,239,137,133,177,113,31,181,182,6,165,228,191,159,51,212,184,232,162,201,7,120,52,249,0,15,142,168,9,150,24,152,14,225,187,13,106,127,45,61,109,8,151,108,100,145,1,92,99,230,244,81,107,107,98,97,108,28,216,48,101,133,78,0,98,242,237,149,6,108,123,165,1,27,193,244,8,130,87,196,15,245,198,217,176,101,80,233,183,18,234,184,190,139,124,136,185,252,223,29,221,98,73,45,218,21,243,124,211,140,101,76,212,251,88,97,178,77,206,81,181,58,116,0,188,163,226,48,187,212,65,165,223,74,215,149,216,61,109,196,209,164,251,244,214,211,106,233,105,67,252,217,110,52,70,136,103,173,208,184,96,218,115,45,4,68,229,29,3,51,95,76,10,170,201,124,13,221,60,113,5,80,170,65,2,39,16,16,11,190,134,32,12,201,37,181,104,87,179,133,111,32,9,212,102,185,159,228,97,206,14,249,222,94,152,201,217,41,34,152,208,176,180,168,215,199,23,61,179,89,129,13,180,46,59,92,189,183,173,108,186,192,32,131,184,237,182,179,191,154,12,226,182,3,154,210,177,116,57,71,213,234,175,119,210,157,21,38,219,4,131,22,220,115,18,11,99,227,132,59,100,148,62,106,109,13,168,90,106,122,11,207,14,228,157,255,9,147,39,174,0,10,177,158,7,125,68,147,15,240,210,163,8,135,104,242,1,30,254,194,6,105,93,87,98,247,203,103,101,128,113,54,108,25,231,6,107,110,118,27,212,254,224,43,211,137,90,122,218,16,204,74,221,103,111,223,185,249,249,239,190,142,67,190,183,23,213,142,176,96,232,163,214,214,126,147,209,161,196,194,216,56,82,242,223,79,241,103,187,209,103,87,188,166,221,6,181,63,75,54,178,72,218,43,13,216,76,27,10,175,246,74,3,54,96,122,4,65,195,239,96,223,85,223,103,168,239,142,110,49,121,190,105,70,140,179,97,203,26,131,102,188,160,210,111,37,54,226,104,82,149,119,12,204,3,71,11,187,185,22,2,34,47,38,5,85,190,59,186,197,40,11,189,178,146,90,180,43,4,106,179,92,167,255,215,194,49,207,208,181,139,158,217,44,29,174,222,91,176,194,100,155,38,242,99,236,156,163,106,117,10,147,109,2,169,6,9,156,63,54,14,235,133,103,7,114,19,87,0,5,130,74,191,149,20,122,184,226,174,43,177,123,56,27,182,12,155,142,210,146,13,190,213,229,183,239,220,124,33,223,219,11,212,210,211,134,66,226,212,241,248,179,221,104,110,131,218,31,205,22,190,129,91,38,185,246,225,119,176,111,119,71,183,24,230,90,8,136,112,106,15,255,202,59,6,102,92,11,1,17,255,158,101,143,105,174,98,248,211,255,107,97,69,207,108,22,120,226,10,160,238,210,13,215,84,131,4,78,194,179,3,57,97,38,103,167,247,22,96,208,77,71,105,73,219,119,110,62,74,106,209,174,220,90,214,217,102,11,223,64,240,59,216,55,83,174,188,169,197,158,187,222,127,207,178,71,233,255,181,48,28,242,189,189,138,194,186,202,48,147,179,83,166,163,180,36,5,54,208,186,147,6,215,205,41,87,222,84,191,103,217,35,46,122,102,179,184,74,97,196,2,27,104,93,148,43,111,42,55,190,11,180,161,142,12,195,27,223,5,90,141,239,2,45,0,0,0,0,65,49,27,25,130,98,54,50,195,83,45,43,4,197,108,100,69,244,119,125,134,167,90,86,199,150,65,79,8,138,217,200,73,187,194,209,138,232,239,250,203,217,244,227,12,79,181,172,77,126,174,181,142,45,131,158,207,28,152,135,81,18,194,74,16,35,217,83,211,112,244,120,146,65,239,97,85,215,174,46,20,230,181,55,215,181,152,28,150,132,131,5,89,152,27,130,24,169,0,155,219,250,45,176,154,203,54,169,93,93,119,230,28,108,108,255,223,63,65,212,158,14,90,205,162,36,132,149,227,21,159,140,32,70,178,167,97,119,169,190,166,225,232,241,231,208,243,232,36,131,222,195,101,178,197,218,170,174,93,93,235,159,70,68,40,204,107,111,105,253,112,118,174,107,49,57,239,90,42,32,44,9,7,11,109,56,28,18,243,54,70,223,178,7,93,198,113,84,112,237,48,101,107,244,247,243,42,187,182,194,49,162,117,145,28,137,52,160,7,144,251,188,159,23,186,141,132,14,121,222,169,37,56,239,178,60,255,121,243,115,190,72,232,106,125,27,197,65,60,42,222,88,5,79,121,240,68,126,98,233,135,45,79,194,198,28,84,219,1,138,21,148,64,187,14,141,131,232,35,166,194,217,56,191,13,197,160,56,76,244,187,33,143,167,150,10,206,150,141,19,9,0,204,92,72,49,215,69,139,98,250,110,202,83,225,119,84,93,187,186,21,108,160,163,214,63,141,136,151,14,150,145,80,152,215,222,17,169,204,199,210,250,225,236,147,203,250,245,92,215,98,114,29,230,121,107,222,181,84,64,159,132,79,89,88,18,14,22,25,35,21,15,218,112,56,36,155,65,35,61,167,107,253,101,230,90,230,124,37,9,203,87,100,56,208,78,163,174,145,1,226,159,138,24,33,204,167,51,96,253,188,42,175,225,36,173,238,208,63,180,45,131,18,159,108,178,9,134,171,36,72,201,234,21,83,208,41,70,126,251,104,119,101,226,246,121,63,47,183,72,36,54,116,27,9,29,53,42,18,4,242,188,83,75,179,141,72,82,112,222,101,121,49,239,126,96,254,243,230,231,191,194,253,254,124,145,208,213,61,160,203,204,250,54,138,131,187,7,145,154,120,84,188,177,57,101,167,168,75,152,131,59,10,169,152,34,201,250,181,9,136,203,174,16,79,93,239,95,14,108,244,70,205,63,217,109,140,14,194,116,67,18,90,243,2,35,65,234,193,112,108,193,128,65,119,216,71,215,54,151,6,230,45,142,197,181,0,165,132,132,27,188,26,138,65,113,91,187,90,104,152,232,119,67,217,217,108,90,30,79,45,21,95,126,54,12,156,45,27,39,221,28,0,62,18,0,152,185,83,49,131,160,144,98,174,139,209,83,181,146,22,197,244,221,87,244,239,196,148,167,194,239,213,150,217,246,233,188,7,174,168,141,28,183,107,222,49,156,42,239,42,133,237,121,107,202,172,72,112,211,111,27,93,248,46,42,70,225,225,54,222,102,160,7,197,127,99,84,232,84,34,101,243,77,229,243,178,2,164,194,169,27,103,145,132,48,38,160,159,41,184,174,197,228,249,159,222,253,58,204,243,214,123,253,232,207,188,107,169,128,253,90,178,153,62,9,159,178,127,56,132,171,176,36,28,44,241,21,7,53,50,70,42,30,115,119,49,7,180,225,112,72,245,208,107,81,54,131,70,122,119,178,93,99,78,215,250,203,15,230,225,210,204,181,204,249,141,132,215,224,74,18,150,175,11,35,141,182,200,112,160,157,137,65,187,132,70,93,35,3,7,108,56,26,196,63,21,49,133,14,14,40,66,152,79,103,3,169,84,126,192,250,121,85,129,203,98,76,31,197,56,129,94,244,35,152,157,167,14,179,220,150,21,170,27,0,84,229,90,49,79,252,153,98,98,215,216,83,121,206,23,79,225,73,86,126,250,80,149,45,215,123,212,28,204,98,19,138,141,45,82,187,150,52,145,232,187,31,208,217,160,6,236,243,126,94,173,194,101,71,110,145,72,108,47,160,83,117,232,54,18,58,169,7,9,35,106,84,36,8,43,101,63,17,228,121,167,150,165,72,188,143,102,27,145,164,39,42,138,189,224,188,203,242,161,141,208,235,98,222,253,192,35,239,230,217], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
/* memory initializer */ allocate([189,225,188,20,252,208,167,13,63,131,138,38,126,178,145,63,185,36,208,112,248,21,203,105,59,70,230,66,122,119,253,91,181,107,101,220,244,90,126,197,55,9,83,238,118,56,72,247,177,174,9,184,240,159,18,161,51,204,63,138,114,253,36,147,0,0,0,0,55,106,194,1,110,212,132,3,89,190,70,2,220,168,9,7,235,194,203,6,178,124,141,4,133,22,79,5,184,81,19,14,143,59,209,15,214,133,151,13,225,239,85,12,100,249,26,9,83,147,216,8,10,45,158,10,61,71,92,11,112,163,38,28,71,201,228,29,30,119,162,31,41,29,96,30,172,11,47,27,155,97,237,26,194,223,171,24,245,181,105,25,200,242,53,18,255,152,247,19,166,38,177,17,145,76,115,16,20,90,60,21,35,48,254,20,122,142,184,22,77,228,122,23,224,70,77,56,215,44,143,57,142,146,201,59,185,248,11,58,60,238,68,63,11,132,134,62,82,58,192,60,101,80,2,61,88,23,94,54,111,125,156,55,54,195,218,53,1,169,24,52,132,191,87,49,179,213,149,48,234,107,211,50,221,1,17,51,144,229,107,36,167,143,169,37,254,49,239,39,201,91,45,38,76,77,98,35,123,39,160,34,34,153,230,32,21,243,36,33,40,180,120,42,31,222,186,43,70,96,252,41,113,10,62,40,244,28,113,45,195,118,179,44,154,200,245,46,173,162,55,47,192,141,154,112,247,231,88,113,174,89,30,115,153,51,220,114,28,37,147,119,43,79,81,118,114,241,23,116,69,155,213,117,120,220,137,126,79,182,75,127,22,8,13,125,33,98,207,124,164,116,128,121,147,30,66,120,202,160,4,122,253,202,198,123,176,46,188,108,135,68,126,109,222,250,56,111,233,144,250,110,108,134,181,107,91,236,119,106,2,82,49,104,53,56,243,105,8,127,175,98,63,21,109,99,102,171,43,97,81,193,233,96,212,215,166,101,227,189,100,100,186,3,34,102,141,105,224,103,32,203,215,72,23,161,21,73,78,31,83,75,121,117,145,74,252,99,222,79,203,9,28,78,146,183,90,76,165,221,152,77,152,154,196,70,175,240,6,71,246,78,64,69,193,36,130,68,68,50,205,65,115,88,15,64,42,230,73,66,29,140,139,67,80,104,241,84,103,2,51,85,62,188,117,87,9,214,183,86,140,192,248,83,187,170,58,82,226,20,124,80,213,126,190,81,232,57,226,90,223,83,32,91,134,237,102,89,177,135,164,88,52,145,235,93,3,251,41,92,90,69,111,94,109,47,173,95,128,27,53,225,183,113,247,224,238,207,177,226,217,165,115,227,92,179,60,230,107,217,254,231,50,103,184,229,5,13,122,228,56,74,38,239,15,32,228,238,86,158,162,236,97,244,96,237,228,226,47,232,211,136,237,233,138,54,171,235,189,92,105,234,240,184,19,253,199,210,209,252,158,108,151,254,169,6,85,255,44,16,26,250,27,122,216,251,66,196,158,249,117,174,92,248,72,233,0,243,127,131,194,242,38,61,132,240,17,87,70,241,148,65,9,244,163,43,203,245,250,149,141,247,205,255,79,246,96,93,120,217,87,55,186,216,14,137,252,218,57,227,62,219,188,245,113,222,139,159,179,223,210,33,245,221,229,75,55,220,216,12,107,215,239,102,169,214,182,216,239,212,129,178,45,213,4,164,98,208,51,206,160,209,106,112,230,211,93,26,36,210,16,254,94,197,39,148,156,196,126,42,218,198,73,64,24,199,204,86,87,194,251,60,149,195,162,130,211,193,149,232,17,192,168,175,77,203,159,197,143,202,198,123,201,200,241,17,11,201,116,7,68,204,67,109,134,205,26,211,192,207,45,185,2,206,64,150,175,145,119,252,109,144,46,66,43,146,25,40,233,147,156,62,166,150,171,84,100,151,242,234,34,149,197,128,224,148,248,199,188,159,207,173,126,158,150,19,56,156,161,121,250,157,36,111,181,152,19,5,119,153,74,187,49,155,125,209,243,154,48,53,137,141,7,95,75,140,94,225,13,142,105,139,207,143,236,157,128,138,219,247,66,139,130,73,4,137,181,35,198,136,136,100,154,131,191,14,88,130,230,176,30,128,209,218,220,129,84,204,147,132,99,166,81,133,58,24,23,135,13,114,213,134,160,208,226,169,151,186,32,168,206,4,102,170,249,110,164,171,124,120,235,174,75,18,41,175,18,172,111,173,37,198,173,172,24,129,241,167,47,235,51,166,118,85,117,164,65,63,183,165,196,41,248,160,243,67,58,161,170,253,124,163,157,151,190,162,208,115,196,181,231,25,6,180,190,167,64,182,137,205,130,183,12,219,205,178,59,177,15,179,98,15,73,177,85,101,139,176,104,34,215,187,95,72,21,186,6,246,83,184,49,156,145,185,180,138,222,188,131,224,28,189,218,94,90,191,237,52,152,190,0,0,0,0,101,103,188,184,139,200,9,170,238,175,181,18,87,151,98,143,50,240,222,55,220,95,107,37,185,56,215,157,239,40,180,197,138,79,8,125,100,224,189,111,1,135,1,215,184,191,214,74,221,216,106,242,51,119,223,224,86,16,99,88,159,87,25,80,250,48,165,232,20,159,16,250,113,248,172,66,200,192,123,223,173,167,199,103,67,8,114,117,38,111,206,205,112,127,173,149,21,24,17,45,251,183,164,63,158,208,24,135,39,232,207,26,66,143,115,162,172,32,198,176,201,71,122,8,62,175,50,160,91,200,142,24,181,103,59,10,208,0,135,178,105,56,80,47,12,95,236,151,226,240,89,133,135,151,229,61,209,135,134,101,180,224,58,221,90,79,143,207,63,40,51,119,134,16,228,234,227,119,88,82,13,216,237,64,104,191,81,248,161,248,43,240,196,159,151,72,42,48,34,90,79,87,158,226,246,111,73,127,147,8,245,199,125,167,64,213,24,192,252,109,78,208,159,53,43,183,35,141,197,24,150,159,160,127,42,39,25,71,253,186,124,32,65,2,146,143,244,16,247,232,72,168,61,88,20,155,88,63,168,35,182,144,29,49,211,247,161,137,106,207,118,20,15,168,202,172,225,7,127,190,132,96,195,6,210,112,160,94,183,23,28,230,89,184,169,244,60,223,21,76,133,231,194,209,224,128,126,105,14,47,203,123,107,72,119,195,162,15,13,203,199,104,177,115,41,199,4,97,76,160,184,217,245,152,111,68,144,255,211,252,126,80,102,238,27,55,218,86,77,39,185,14,40,64,5,182,198,239,176,164,163,136,12,28,26,176,219,129,127,215,103,57,145,120,210,43,244,31,110,147,3,247,38,59,102,144,154,131,136,63,47,145,237,88,147,41,84,96,68,180,49,7,248,12,223,168,77,30,186,207,241,166,236,223,146,254,137,184,46,70,103,23,155,84,2,112,39,236,187,72,240,113,222,47,76,201,48,128,249,219,85,231,69,99,156,160,63,107,249,199,131,211,23,104,54,193,114,15,138,121,203,55,93,228,174,80,225,92,64,255,84,78,37,152,232,246,115,136,139,174,22,239,55,22,248,64,130,4,157,39,62,188,36,31,233,33,65,120,85,153,175,215,224,139,202,176,92,51,59,182,89,237,94,209,229,85,176,126,80,71,213,25,236,255,108,33,59,98,9,70,135,218,231,233,50,200,130,142,142,112,212,158,237,40,177,249,81,144,95,86,228,130,58,49,88,58,131,9,143,167,230,110,51,31,8,193,134,13,109,166,58,181,164,225,64,189,193,134,252,5,47,41,73,23,74,78,245,175,243,118,34,50,150,17,158,138,120,190,43,152,29,217,151,32,75,201,244,120,46,174,72,192,192,1,253,210,165,102,65,106,28,94,150,247,121,57,42,79,151,150,159,93,242,241,35,229,5,25,107,77,96,126,215,245,142,209,98,231,235,182,222,95,82,142,9,194,55,233,181,122,217,70,0,104,188,33,188,208,234,49,223,136,143,86,99,48,97,249,214,34,4,158,106,154,189,166,189,7,216,193,1,191,54,110,180,173,83,9,8,21,154,78,114,29,255,41,206,165,17,134,123,183,116,225,199,15,205,217,16,146,168,190,172,42,70,17,25,56,35,118,165,128,117,102,198,216,16,1,122,96,254,174,207,114,155,201,115,202,34,241,164,87,71,150,24,239,169,57,173,253,204,94,17,69,6,238,77,118,99,137,241,206,141,38,68,220,232,65,248,100,81,121,47,249,52,30,147,65,218,177,38,83,191,214,154,235,233,198,249,179,140,161,69,11,98,14,240,25,7,105,76,161,190,81,155,60,219,54,39,132,53,153,146,150,80,254,46,46,153,185,84,38,252,222,232,158,18,113,93,140,119,22,225,52,206,46,54,169,171,73,138,17,69,230,63,3,32,129,131,187,118,145,224,227,19,246,92,91,253,89,233,73,152,62,85,241,33,6,130,108,68,97,62,212,170,206,139,198,207,169,55,126,56,65,127,214,93,38,195,110,179,137,118,124,214,238,202,196,111,214,29,89,10,177,161,225,228,30,20,243,129,121,168,75,215,105,203,19,178,14,119,171,92,161,194,185,57,198,126,1,128,254,169,156,229,153,21,36,11,54,160,54,110,81,28,142,167,22,102,134,194,113,218,62,44,222,111,44,73,185,211,148,240,129,4,9,149,230,184,177,123,73,13,163,30,46,177,27,72,62,210,67,45,89,110,251,195,246,219,233,166,145,103,81,31,169,176,204,122,206,12,116,148,97,185,102,241,6,5,222,0,0,0,0,119,7,48,150,238,14,97,44,153,9,81,186,7,109,196,25,112,106,244,143,233,99,165,53,158,100,149,163,14,219,136,50,121,220,184,164,224,213,233,30,151,210,217,136,9,182,76,43,126,177,124,189,231,184,45,7,144,191,29,145,29,183,16,100,106,176,32,242,243,185,113,72,132,190,65,222,26,218,212,125,109,221,228,235,244,212,181,81,131,211,133,199,19,108,152,86,100,107,168,192,253,98,249,122,138,101,201,236,20,1,92,79,99,6,108,217,250,15,61,99,141,8,13,245,59,110,32,200,76,105,16,94,213,96,65,228,162,103,113,114,60,3,228,209,75,4,212,71,210,13,133,253,165,10,181,107,53,181,168,250,66,178,152,108,219,187,201,214,172,188,249,64,50,216,108,227,69,223,92,117,220,214,13,207,171,209,61,89,38,217,48,172,81,222,0,58,200,215,81,128,191,208,97,22,33,180,244,181,86,179,196,35,207,186,149,153,184,189,165,15,40,2,184,158,95,5,136,8,198,12,217,178,177,11,233,36,47,111,124,135,88,104,76,17,193,97,29,171,182,102,45,61,118,220,65,144,1,219,113,6,152,210,32,188,239,213,16,42,113,177,133,137,6,182,181,31,159,191,228,165,232,184,212,51,120,7,201,162,15,0,249,52,150,9,168,142,225,14,152,24,127,106,13,187,8,109,61,45,145,100,108,151,230,99,92,1,107,107,81,244,28,108,97,98,133,101,48,216,242,98,0,78,108,6,149,237,27,1,165,123,130,8,244,193,245,15,196,87,101,176,217,198,18,183,233,80,139,190,184,234,252,185,136,124,98,221,29,223,21,218,45,73,140,211,124,243,251,212,76,101,77,178,97,88,58,181,81,206,163,188,0,116,212,187,48,226,74,223,165,65,61,216,149,215,164,209,196,109,211,214,244,251,67,105,233,106,52,110,217,252,173,103,136,70,218,96,184,208,68,4,45,115,51,3,29,229,170,10,76,95,221,13,124,201,80,5,113,60,39,2,65,170,190,11,16,16,201,12,32,134,87,104,181,37,32,111,133,179,185,102,212,9,206,97,228,159,94,222,249,14,41,217,201,152,176,208,152,34,199,215,168,180,89,179,61,23,46,180,13,129,183,189,92,59,192,186,108,173,237,184,131,32,154,191,179,182,3,182,226,12,116,177,210,154,234,213,71,57,157,210,119,175,4,219,38,21,115,220,22,131,227,99,11,18,148,100,59,132,13,109,106,62,122,106,90,168,228,14,207,11,147,9,255,157,10,0,174,39,125,7,158,177,240,15,147,68,135,8,163,210,30,1,242,104,105,6,194,254,247,98,87,93,128,101,103,203,25,108,54,113,110,107,6,231,254,212,27,118,137,211,43,224,16,218,122,90,103,221,74,204,249,185,223,111,142,190,239,249,23,183,190,67,96,176,142,213,214,214,163,232,161,209,147,126,56,216,194,196,79,223,242,82,209,187,103,241,166,188,87,103,63,181,6,221,72,178,54,75,216,13,43,218,175,10,27,76,54,3,74,246,65,4,122,96,223,96,239,195,168,103,223,85,49,110,142,239,70,105,190,121,203,97,179,140,188,102,131,26,37,111,210,160,82,104,226,54,204,12,119,149,187,11,71,3,34,2,22,185,85,5,38,47,197,186,59,190,178,189,11,40,43,180,90,146,92,179,106,4,194,215,255,167,181,208,207,49,44,217,158,139,91,222,174,29,155,100,194,176,236,99,242,38,117,106,163,156,2,109,147,10,156,9,6,169,235,14,54,63,114,7,103,133,5,0,87,19,149,191,74,130,226,184,122,20,123,177,43,174,12,182,27,56,146,210,142,155,229,213,190,13,124,220,239,183,11,219,223,33,134,211,210,212,241,212,226,66,104,221,179,248,31,218,131,110,129,190,22,205,246,185,38,91,111,176,119,225,24,183,71,119,136,8,90,230,255,15,106,112,102,6,59,202,17,1,11,92,143,101,158,255,248,98,174,105,97,107,255,211,22,108,207,69,160,10,226,120,215,13,210,238,78,4,131,84,57,3,179,194,167,103,38,97,208,96,22,247,73,105,71,77,62,110,119,219,174,209,106,74,217,214,90,220,64,223,11,102,55,216,59,240,169,188,174,83,222,187,158,197,71,178,207,127,48,181,255,233,189,189,242,28,202,186,194,138,83,179,147,48,36,180,163,166,186,208,54,5,205,215,6,147,84,222,87,41,35,217,103,191,179,102,122,46,196,97,74,184,93,104,27,2,42,111,43,148,180,11,190,55,195,12,142,161,90,5,223,27,45,2,239,141,0,0,0,0,25,27,49,65,50,54,98,130,43,45,83,195,100,108,197,4,125,119,244,69,86,90,167,134,79,65,150,199,200,217,138,8,209,194,187,73,250,239,232,138,227,244,217,203,172,181,79,12,181,174,126,77,158,131,45,142,135,152,28,207,74,194,18,81,83,217,35,16,120,244,112,211,97,239,65,146,46,174,215,85,55,181,230,20,28,152,181,215,5,131,132,150,130,27,152,89,155,0,169,24,176,45,250,219,169,54,203,154,230,119,93,93,255,108,108,28,212,65,63,223,205,90,14,158,149,132,36,162,140,159,21,227,167,178,70,32,190,169,119,97,241,232,225,166,232,243,208,231,195,222,131,36,218,197,178,101,93,93,174,170,68,70,159,235,111,107,204,40,118,112,253,105,57,49,107,174,32,42,90,239,11,7,9,44,18,28,56,109,223,70,54,243,198,93,7,178,237,112,84,113,244,107,101,48,187,42,243,247,162,49,194,182,137,28,145,117,144,7,160,52,23,159,188,251,14,132,141,186,37,169,222,121,60,178,239,56,115,243,121,255,106,232,72,190,65,197,27,125,88,222,42,60,240,121,79,5,233,98,126,68,194,79,45,135,219,84,28,198,148,21,138,1,141,14,187,64,166,35,232,131,191,56,217,194,56,160,197,13,33,187,244,76,10,150,167,143,19,141,150,206,92,204,0,9,69,215,49,72,110,250,98,139,119,225,83,202,186,187,93,84,163,160,108,21,136,141,63,214,145,150,14,151,222,215,152,80,199,204,169,17,236,225,250,210,245,250,203,147,114,98,215,92,107,121,230,29,64,84,181,222,89,79,132,159,22,14,18,88,15,21,35,25,36,56,112,218,61,35,65,155,101,253,107,167,124,230,90,230,87,203,9,37,78,208,56,100,1,145,174,163,24,138,159,226,51,167,204,33,42,188,253,96,173,36,225,175,180,63,208,238,159,18,131,45,134,9,178,108,201,72,36,171,208,83,21,234,251,126,70,41,226,101,119,104,47,63,121,246,54,36,72,183,29,9,27,116,4,18,42,53,75,83,188,242,82,72,141,179,121,101,222,112,96,126,239,49,231,230,243,254,254,253,194,191,213,208,145,124,204,203,160,61,131,138,54,250,154,145,7,187,177,188,84,120,168,167,101,57,59,131,152,75,34,152,169,10,9,181,250,201,16,174,203,136,95,239,93,79,70,244,108,14,109,217,63,205,116,194,14,140,243,90,18,67,234,65,35,2,193,108,112,193,216,119,65,128,151,54,215,71,142,45,230,6,165,0,181,197,188,27,132,132,113,65,138,26,104,90,187,91,67,119,232,152,90,108,217,217,21,45,79,30,12,54,126,95,39,27,45,156,62,0,28,221,185,152,0,18,160,131,49,83,139,174,98,144,146,181,83,209,221,244,197,22,196,239,244,87,239,194,167,148,246,217,150,213,174,7,188,233,183,28,141,168,156,49,222,107,133,42,239,42,202,107,121,237,211,112,72,172,248,93,27,111,225,70,42,46,102,222,54,225,127,197,7,160,84,232,84,99,77,243,101,34,2,178,243,229,27,169,194,164,48,132,145,103,41,159,160,38,228,197,174,184,253,222,159,249,214,243,204,58,207,232,253,123,128,169,107,188,153,178,90,253,178,159,9,62,171,132,56,127,44,28,36,176,53,7,21,241,30,42,70,50,7,49,119,115,72,112,225,180,81,107,208,245,122,70,131,54,99,93,178,119,203,250,215,78,210,225,230,15,249,204,181,204,224,215,132,141,175,150,18,74,182,141,35,11,157,160,112,200,132,187,65,137,3,35,93,70,26,56,108,7,49,21,63,196,40,14,14,133,103,79,152,66,126,84,169,3,85,121,250,192,76,98,203,129,129,56,197,31,152,35,244,94,179,14,167,157,170,21,150,220,229,84,0,27,252,79,49,90,215,98,98,153,206,121,83,216,73,225,79,23,80,250,126,86,123,215,45,149,98,204,28,212,45,141,138,19,52,150,187,82,31,187,232,145,6,160,217,208,94,126,243,236,71,101,194,173,108,72,145,110,117,83,160,47,58,18,54,232,35,9,7,169,8,36,84,106,17,63,101,43,150,167,121,228,143,188,72,165,164,145,27,102,189,138,42,39,242,203,188,224,235,208,141,161,192,253,222,98,217,230,239,35,20,188,225,189,13,167,208,252,38,138,131,63,63,145,178,126,112,208,36,185,105,203,21,248,66,230,70,59,91,253,119,122,220,101,107,181,197,126,90,244,238,83,9,55,247,72,56,118,184,9,174,177,161,18,159,240,138,63,204,51,147,36,253,114,0,0,0,0,1,194,106,55,3,132,212,110,2,70,190,89,7,9,168,220,6,203,194,235,4,141,124,178,5,79,22,133,14,19,81,184,15,209,59,143,13,151,133,214,12,85,239,225,9,26,249,100,8,216,147,83,10,158,45,10,11,92,71,61,28,38,163,112,29,228,201,71,31,162,119,30,30,96,29,41,27,47,11,172,26,237,97,155,24,171,223,194,25,105,181,245,18,53,242,200,19,247,152,255,17,177,38,166,16,115,76,145,21,60,90,20,20,254,48,35,22,184,142,122,23,122,228,77,56,77,70,224,57,143,44,215,59,201,146,142,58,11,248,185,63,68,238,60,62,134,132,11,60,192,58,82,61,2,80,101,54,94,23,88,55,156,125,111,53,218,195,54,52,24,169,1,49,87,191,132,48,149,213,179,50,211,107,234,51,17,1,221,36,107,229,144,37,169,143,167,39,239,49,254,38,45,91,201,35,98,77,76,34,160,39,123,32,230,153,34,33,36,243,21,42,120,180,40,43,186,222,31,41,252,96,70,40,62,10,113,45,113,28,244,44,179,118,195,46,245,200,154,47,55,162,173,112,154,141,192,113,88,231,247,115,30,89,174,114,220,51,153,119,147,37,28,118,81,79,43,116,23,241,114,117,213,155,69,126,137,220,120,127,75,182,79,125,13,8,22,124,207,98,33,121,128,116,164,120,66,30,147,122,4,160,202,123,198,202,253,108,188,46,176,109,126,68,135,111,56,250,222,110,250,144,233,107,181,134,108,106,119,236,91,104,49,82,2,105,243,56,53,98,175,127,8,99,109,21,63,97,43,171,102,96,233,193,81,101,166,215,212,100,100,189,227,102,34,3,186,103,224,105,141,72,215,203,32,73,21,161,23,75,83,31,78,74,145,117,121,79,222,99,252,78,28,9,203,76,90,183,146,77,152,221,165,70,196,154,152,71,6,240,175,69,64,78,246,68,130,36,193,65,205,50,68,64,15,88,115,66,73,230,42,67,139,140,29,84,241,104,80,85,51,2,103,87,117,188,62,86,183,214,9,83,248,192,140,82,58,170,187,80,124,20,226,81,190,126,213,90,226,57,232,91,32,83,223,89,102,237,134,88,164,135,177,93,235,145,52,92,41,251,3,94,111,69,90,95,173,47,109,225,53,27,128,224,247,113,183,226,177,207,238,227,115,165,217,230,60,179,92,231,254,217,107,229,184,103,50,228,122,13,5,239,38,74,56,238,228,32,15,236,162,158,86,237,96,244,97,232,47,226,228,233,237,136,211,235,171,54,138,234,105,92,189,253,19,184,240,252,209,210,199,254,151,108,158,255,85,6,169,250,26,16,44,251,216,122,27,249,158,196,66,248,92,174,117,243,0,233,72,242,194,131,127,240,132,61,38,241,70,87,17,244,9,65,148,245,203,43,163,247,141,149,250,246,79,255,205,217,120,93,96,216,186,55,87,218,252,137,14,219,62,227,57,222,113,245,188,223,179,159,139,221,245,33,210,220,55,75,229,215,107,12,216,214,169,102,239,212,239,216,182,213,45,178,129,208,98,164,4,209,160,206,51,211,230,112,106,210,36,26,93,197,94,254,16,196,156,148,39,198,218,42,126,199,24,64,73,194,87,86,204,195,149,60,251,193,211,130,162,192,17,232,149,203,77,175,168,202,143,197,159,200,201,123,198,201,11,17,241,204,68,7,116,205,134,109,67,207,192,211,26,206,2,185,45,145,175,150,64,144,109,252,119,146,43,66,46,147,233,40,25,150,166,62,156,151,100,84,171,149,34,234,242,148,224,128,197,159,188,199,248,158,126,173,207,156,56,19,150,157,250,121,161,152,181,111,36,153,119,5,19,155,49,187,74,154,243,209,125,141,137,53,48,140,75,95,7,142,13,225,94,143,207,139,105,138,128,157,236,139,66,247,219,137,4,73,130,136,198,35,181,131,154,100,136,130,88,14,191,128,30,176,230,129,220,218,209,132,147,204,84,133,81,166,99,135,23,24,58,134,213,114,13,169,226,208,160,168,32,186,151,170,102,4,206,171,164,110,249,174,235,120,124,175,41,18,75,173,111,172,18,172,173,198,37,167,241,129,24,166,51,235,47,164,117,85,118,165,183,63,65,160,248,41,196,161,58,67,243,163,124,253,170,162,190,151,157,181,196,115,208,180,6,25,231,182,64,167,190,183,130,205,137,178,205,219,12,179,15,177,59,177,73,15,98,176,139,101,85,187,215,34,104,186,21,72,95,184,83,246,6,185,145,156,49,188,222,138,180,189,28,224,131,191,90,94,218,190,152,52,237,0,0,0,0,184,188,103,101,170,9,200,139,18,181,175,238,143,98,151,87,55,222,240,50,37,107,95,220,157,215,56,185,197,180,40,239,125,8,79,138,111,189,224,100,215,1,135,1,74,214,191,184,242,106,216,221,224,223,119,51,88,99,16,86,80,25,87,159,232,165,48,250,250,16,159,20,66,172,248,113,223,123,192,200,103,199,167,173,117,114,8,67,205,206,111,38,149,173,127,112,45,17,24,21,63,164,183,251,135,24,208,158,26,207,232,39,162,115,143,66,176,198,32,172,8,122,71,201,160,50,175,62,24,142,200,91,10,59,103,181,178,135,0,208,47,80,56,105,151,236,95,12,133,89,240,226,61,229,151,135,101,134,135,209,221,58,224,180,207,143,79,90,119,51,40,63,234,228,16,134,82,88,119,227,64,237,216,13,248,81,191,104,240,43,248,161,72,151,159,196,90,34,48,42,226,158,87,79,127,73,111,246,199,245,8,147,213,64,167,125,109,252,192,24,53,159,208,78,141,35,183,43,159,150,24,197,39,42,127,160,186,253,71,25,2,65,32,124,16,244,143,146,168,72,232,247,155,20,88,61,35,168,63,88,49,29,144,182,137,161,247,211,20,118,207,106,172,202,168,15,190,127,7,225,6,195,96,132,94,160,112,210,230,28,23,183,244,169,184,89,76,21,223,60,209,194,231,133,105,126,128,224,123,203,47,14,195,119,72,107,203,13,15,162,115,177,104,199,97,4,199,41,217,184,160,76,68,111,152,245,252,211,255,144,238,102,80,126,86,218,55,27,14,185,39,77,182,5,64,40,164,176,239,198,28,12,136,163,129,219,176,26,57,103,215,127,43,210,120,145,147,110,31,244,59,38,247,3,131,154,144,102,145,47,63,136,41,147,88,237,180,68,96,84,12,248,7,49,30,77,168,223,166,241,207,186,254,146,223,236,70,46,184,137,84,155,23,103,236,39,112,2,113,240,72,187,201,76,47,222,219,249,128,48,99,69,231,85,107,63,160,156,211,131,199,249,193,54,104,23,121,138,15,114,228,93,55,203,92,225,80,174,78,84,255,64,246,232,152,37,174,139,136,115,22,55,239,22,4,130,64,248,188,62,39,157,33,233,31,36,153,85,120,65,139,224,215,175,51,92,176,202,237,89,182,59,85,229,209,94,71,80,126,176,255,236,25,213,98,59,33,108,218,135,70,9,200,50,233,231,112,142,142,130,40,237,158,212,144,81,249,177,130,228,86,95,58,88,49,58,167,143,9,131,31,51,110,230,13,134,193,8,181,58,166,109,189,64,225,164,5,252,134,193,23,73,41,47,175,245,78,74,50,34,118,243,138,158,17,150,152,43,190,120,32,151,217,29,120,244,201,75,192,72,174,46,210,253,1,192,106,65,102,165,247,150,94,28,79,42,57,121,93,159,150,151,229,35,241,242,77,107,25,5,245,215,126,96,231,98,209,142,95,222,182,235,194,9,142,82,122,181,233,55,104,0,70,217,208,188,33,188,136,223,49,234,48,99,86,143,34,214,249,97,154,106,158,4,7,189,166,189,191,1,193,216,173,180,110,54,21,8,9,83,29,114,78,154,165,206,41,255,183,123,134,17,15,199,225,116,146,16,217,205,42,172,190,168,56,25,17,70,128,165,118,35,216,198,102,117,96,122,1,16,114,207,174,254,202,115,201,155,87,164,241,34,239,24,150,71,253,173,57,169,69,17,94,204,118,77,238,6,206,241,137,99,220,68,38,141,100,248,65,232,249,47,121,81,65,147,30,52,83,38,177,218,235,154,214,191,179,249,198,233,11,69,161,140,25,240,14,98,161,76,105,7,60,155,81,190,132,39,54,219,150,146,153,53,46,46,254,80,38,84,185,153,158,232,222,252,140,93,113,18,52,225,22,119,169,54,46,206,17,138,73,171,3,63,230,69,187,131,129,32,227,224,145,118,91,92,246,19,73,233,89,253,241,85,62,152,108,130,6,33,212,62,97,68,198,139,206,170,126,55,169,207,214,127,65,56,110,195,38,93,124,118,137,179,196,202,238,214,89,29,214,111,225,161,177,10,243,20,30,228,75,168,121,129,19,203,105,215,171,119,14,178,185,194,161,92,1,126,198,57,156,169,254,128,36,21,153,229,54,160,54,11,142,28,81,110,134,102,22,167,62,218,113,194,44,111,222,44,148,211,185,73,9,4,129,240,177,184,230,149,163,13,73,123,27,177,46,30,67,210,62,72,251,110,89,45,233,219,246,195,81,103,145,166,204,176,169,31,116,12,206,122,102,185,97,148,222,5,6,241,114,98,0,0,0,0,0,0,37,115,61,37,115,10,0,0,102,111,117,110,100,32,35,32,119,105,116,104,111,117,116,32,110,97,109,101,0,0,0,0,109,97,116,99,104,102,105,108,101,0,0,0,0,0,0,0,119,97,115,32,107,105,99,107,101,100,0,0,0,0,0,0,118,105,101,119,97,110,103,108,101,115,91,50,93,0,0,0,67,111,110,110,101,99,116,101,100,32,116,111,32,97,32,112,117,114,101,32,115,101,114,118,101,114,46,10,0,0,0,0,104,101,97,114,116,98,101,97,116,0,0,0,0,0,0,0,67,111,109,95,69,118,101,110,116,76,111,111,112,58,32,98,97,100,32,101,118,101,110,116,32,116,121,112,101,32,37,105,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,101,118,97,108,102,108,111,97,116,0,0,0,0,0,0,0,114,110,100,46,99,0,0,0,101,118,101,110,116,80,97,114,109,115,91,49,93,0,0,0,32,0,0,0,0,0,0,0,67,97,110,110,111,116,32,107,105,99,107,32,104,111,115,116,32,112,108,97,121,101,114,10,0,0,0,0,0,0,0,0,37,115,47,37,115,0,0,0,83,86,95,80,97,99,107,101,116,69,118,101,110,116,32,116,105,109,101,58,32,37,105,10,0,0,0,0,0,0,0,0,101,118,97,108,0,0,0,0,114,110,100,102,105,108,101,0,101,118,101,110,116,80,97,114,109,115,91,48,93,0,0,0,37,105,32,0,0,0,0,0,85,115,97,103,101,58,32,37,115,32,60,99,108,105,101,110,116,32,110,117,109,98,101,114,62,10,0,0,0,0,0,0,83,101,114,118,101,114,32,100,105,115,99,111,110,110,101,99,116,101,100,0,0,0,0,0,87,65,82,78,73,78,71,58,32,67,111,109,95,80,117,115,104,69,118,101,110,116,32,111,118,101,114,102,108,111,119,10,0,0,0,0,0,0,0,0,32,119,105,116,104,111,117,116,32,110,111,116,105,102,105,99,97,116,105,111,110,0,0,0,112,114,97,103,109,97,0,0,115,121,110,46,99,0,0,0,116,111,114,115,111,84,105,109,101,114,0,0,0,0,0,0,119,104,105,99,104,0,0,0,10,0,0,0,0,0,0,0,69,114,114,111,114,32,119,114,105,116,105,110,103,32,116,111,32,106,111,117,114,110,97,108,32,102,105,108,101,0,0,0,112,114,105,110,116,10,83,101,114,118,101,114,32,117,115,101,115,32,112,114,111,116,111,99,111,108,32,118,101,114,115,105,111,110,32,37,105,32,40,121,111,117,114,115,32,105,115,32,37,105,41,46,10,0,0,0,77,97,112,32,119,105,116,104,32,110,111,32,112,108,97,110,101,115,0,0,0,0,0,0,101,114,114,111,114,0,0,0,115,121,110,102,105,108,101,0,100,101,108,116,97,95,97,110,103,108,101,115,91,50,93,0,116,111,117,99,104,70,105,108,101,0,0,0,0,0,0,0,32,37,53,105,0,0,0,0,69,114,114,111,114,32,114,101,97,100,105,110,103,32,102,114,111,109,32,106,111,117,114,110,97,108,32,102,105,108,101,0,108,105,110,101,0,0,0,0,115,97,121,32,37,115,0,0,100,101,108,116,97,95,97,110,103,108,101,115,91,48,93,0,102,100,105,114,0,0,0,0,37,53,105,0,0,0,0,0,67,111,109,95,81,117,101,117,101,69,118,101,110,116,58,32,111,118,101,114,102,108,111,119,10,0,0,0,0,0,0,0,37,115,32,114,101,115,111,108,118,101,100,32,116,111,32,37,115,10,0,0,0,0,0,0,117,110,100,101,102,0,0,0,116,101,108,108,32,37,100,32,37,115,0,0,0,0,0,0,112,109,95,116,121,112,101,0,100,105,114,0,0,0,0,0,37,55,105,32,0,0,0,0,105,110,118,97,108,105,100,32,108,105,116,101,114,97,108,47,108,101,110,103,116,104,115,32,115,101,116,0,0,0,0,0,67,111,117,108,100,110,39,116,32,111,112,101,110,32,106,111,117,114,110,97,108,32,102,105,108,101,115,10,0,0,0,0,27,91,37,100,109,0,0,0,125,0,0,0,0,0,0,0,33,61,0,0,0,0,0,0,100,101,102,105,110,101,32,37,115,32,105,110,99,111,109,112,108,101,116,101,0,0,0,0,98,111,116,108,105,98,46,108,111,103,0,0,0,0,0,0,98,111,116,95,114,101,108,111,97,100,99,104,97,114,97,99,116,101,114,115,0,0,0,0,100,101,102,105,110,101,0,0,83,101,114,118,101,114,58,32,37,115,10,0,0,0,0,0,99,111,117,110,108,100,110,39,116,32,108,111,97,100,32,37,115,10,0,0,0,0,0,0,115,97,121,95,116,101,97,109,32,37,115,0,0,0,0,0,102,117,110,99,95,115,116,97,116,105,99,0,0,0,0,0,105,110,118,97,108,105,100,32,103,111,97,108,32,115,116,97,116,101,32,37,100,10,0,0,100,97,109,97,103,101,67,111,117,110,116,0,0,0,0,0,112,97,116,104,0,0,0,0,98,111,116,102,105,108,101,115,0,0,0,0,0,0,0,0,49,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,98,111,116,95,114,101,108,111,97,100,99,104,97,114,97,99,116,101,114,115,0,0,0,0,65,65,83,95,76,105,110,107,69,110,116,105,116,121,58,32,97,97,115,32,110,111,116,32,108,111,97,100,101,100,10,0,119,114,105,116,116,101,110,32,37,100,32,98,121,116,101,115,32,111,102,32,114,111,117,116,105,110,103,32,99,97,99,104,101,10,0,0,0,0,0,0,48,0,0,0,0,0,0,0,99,111,109,95,106,111,117,114,110,97,108,0,0,0,0,0,52,48,48,0,0,0,0,0,109,101,109,111,114,121,100,117,109,112,0,0,0,0,0,0,101,114,114,111,114,32,111,112,101,110,105,110,103,32,37,115,10,0,0,0,0,0,0,0,13,37,54,100,32,112,111,115,115,105,98,108,101,32,112,111,114,116,97,108,32,97,114,101,97,115,10,0,0,0,0,0,67,111,117,108,100,110,39,116,32,108,111,97,100,32,115,121,109,98,111,108,32,102,105,108,101,58,32,37,115,10,0,0,81,95,115,116,114,110,99,112,121,122,58,32,100,101,115,116,115,105,122,101,32,60,32,49,0,0,0,0,0,0,0,0,73,80,58,32,37,115,10,0,37,115,32,114,101,99,118,32,37,52,105,32,58,32,115,61,37,105,10,0,0,0,0,0,105,110,99,108,117,100,101,0,98,111,116,95,116,101,115,116,114,99,104,97,116,0,0,0,112,111,115,46,116,114,66,97,115,101,91,48,93,0,0,0,100,97,109,97,103,101,80,105,116,99,104,0,0,0,0,0,100,117,109,112,117,115,101,114,0,0,0,0,0,0,0,0,94,55,0,0,0,0,0,0,82,101,112,108,97,121,105,110,103,32,106,111,117,114,110,97,108,101,100,32,101,118,101,110,116,115,10,0,0,0,0,0,37,115,0,0,0,0,0,0,101,110,100,105,102,0,0,0,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,10,0,0,0,0,100,97,109,97,103,101,89,97,119,0,0,0,0,0,0,0,37,115,0,0,0,0,0,0,98,111,116,95,101,110,97,98,108,101,0,0,0,0,0,0,70,83,95,67,114,101,97,116,101,80,97,116,104,58,32,102,97,105,108,101,100,32,116,111,32,99,114,101,97,116,101,32,112,97,116,104,32,34,37,115,34,0,0,0,0,0,0,0,106,111,117,114,110,97,108,100,97,116,97,46,100,97,116,0,37,115,47,37,115,0,0,0,101,108,115,101,0,0,0,0,37,115,32,104,97,115,32,37,100,32,99,104,97,116,32,108,105,110,101,115,10,0,0,0,37,52,105,32,0,0,0,0,100,97,109,97,103,101,69,118,101,110,116,0,0,0,0,0,100,105,115,99,111,110,110,101,99,116,101,100,0,0,0,0,106,111,117,114,110,97,108,46,100,97,116,0,0,0,0,0,32,100,101,102,97,117,108,116,58,34,37,115,94,55,34,0,101,108,105,102,0,0,0,0,98,111,116,95,116,101,115,116,105,99,104,97,116,0,0,0,90,77,66,73,32,0,0,0,118,105,101,119,104,101,105,103,104,116,0,0,0,0,0,0,85,110,112,117,114,101,32,99,108,105,101,110,116,32,100,101,116,101,99,116,101,100,46,32,73,110,118,97,108,105,100,32,46,80,75,51,32,102,105,108,101,115,32,114,101,102,101,114,101,110,99,101,100,33,0,0,74,111,117,114,110,97,108,105,110,103,32,101,118,101,110,116,115,10,0,0,0,0,0,0,105,102,110,100,101,102,0,0,37,115,10,0,0,0,0,0,67,78,67,84,32,0,0,0,101,120,116,101,114,110,97,108,69,118,101,110,116,80,97,114,109,0,0,0,0,0,0,0,105,103,110,111,114,105,110,103,32,111,117,116,100,97,116,101,100,32,99,112,32,99,111,109,109,97,110,100,32,102,114,111,109,32,99,108,105,101,110,116,32,37,115,10,0,0,0,0,99,111,109,95,101,114,114,111,114,77,101,115,115,97,103,101,0,0,0,0,0,0,0,0,48,0,0,0,0,0,0,0,105,102,100,101,102,0,0,0,116,111,111,32,109,97,110,121,32,101,120,112,97,110,115,105,111,110,115,32,105,110,32,99,104,97,116,32,109,101,115,115,97,103,101,10,0,0,0,0,37,53,105,32,0,0,0,0,100,101,108,116,97,95,97,110,103,108,101,115,91,49,93,0,118,109,47,117,105,46,113,118,109,0,0,0,0,0,0,0,106,111,117,114,110,97,108,0,49,0,0,0,0,0,0,0,112,114,111,116,111,99,111,108,0,0,0,0,0,0,0,0,77,97,112,32,119,105,116,104,32,110,111,32,108,101,97,102,115,0,0,0,0,0,0,0,105,102,0,0,0,0,0,0,66,111,116,67,111,110,115,116,114,117,99,116,67,104,97,116,58,32,109,101,115,115,97,103,101,32,34,37,115,34,32,105,110,118,97,108,105,100,32,101,115,99,97,112,101,32,99,104,97,114,10,0,0,0,0,0,37,51,105,32,0,0,0,0,115,112,101,101,100,0,0,0,118,109,47,99,103,97,109,101,46,113,118,109,0,0,0,0,72,117,110,107,95,70,114,101,101,84,101,109,112,77,101,109,111,114,121,58,32,110,111,116,32,116,104,101,32,102,105,110,97,108,32,98,108,111,99,107,10,0,0,0,0,0,0,0,66,85,71,58,32,119,114,111,110,103,32,112,117,110,99,116,117,97,116,105,111,110,32,115,117,98,116,121,112,101,0,0,37,49,46,50,102,0,0,0,66,111,116,67,111,110,115,116,114,117,99,116,67,104,97,116,58,32,109,101,115,115,97,103,101,32,34,37,115,34,32,116,111,111,32,108,111,110,103,10,0,0,0,0,0,0,0,0,45,45,45,32,45,45,45,45,45,32,45,45,45,45,32,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,32,45,45,45,45,45,45,45,32,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,32,45,45,45,45,45,32,45,45,45,45,45,10,0,0,0,0,0,0,0,103,114,97,118,105,116,121,0,37,115,47,112,97,107,37,100,0,0,0,0,0,0,0,0,98,114,111,107,101,110,32,100,111,119,110,108,111,97,100,0,72,117,110,107,95,70,114,101,101,84,101,109,112,77,101,109,111,114,121,58,32,98,97,100,32,109,97,103,105,99,0,0,82,101,115,111,108,118,105,110,103,32,37,115,32,40,73,80,118,52,41,10,0,0,0,0,32,105,110,116,101,103,101,114,0,0,0,0,0,0,0,0,66,111,116,67,111,110,115,116,114,117,99,116,67,104,97,116,58,32,117,110,107,110,111,119,110,32,114,97,110,100,111,109,32,115,116,114,105,110,103,32,37,115,10,0,0,0,0,0,110,117,109,32,115,99,111,114,101,32,112,105,110,103,32,110,97,109,101,32,32,32,32,32,32,32,32,32,32,32,32,108,97,115,116,109,115,103,32,97,100,100,114,101,115,115,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,113,112,111,114,116,32,114,97,116,101,10,0,0,0,0,0,0,0,0,101,120,116,101,114,110,97,108,69,118,101,110,116,0,0,0,46,112,107,51,100,105,114,0,99,108,105,101,110,116,68,111,119,110,108,111,97,100,58,32,37,100,32,58,32,102,105,108,101,32,34,37,115,34,32,99,111,109,112,108,101,116,101,100,10,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,98,105,116,32,108,101,110,103,116,104,32,114,101,112,101,97,116,0,0,0,0,0,0,0,27,91,48,109,10,0,0,0,72,117,110,107,95,65,108,108,111,99,97,116,101,84,101,109,112,77,101,109,111,114,121,58,32,102,97,105,108,101,100,32,111,110,32,37,105,0,0,0,123,0,0,0,0,0,0,0,61,61,0,0,0,0,0,0,100,101,102,105,110,101,32,37,115,32,104,97,115,32,116,111,111,32,109,97,110,121,32,112,97,114,109,115,0,0,0,0,67,108,111,115,101,100,32,108,111,103,32,37,115,10,0,0,37,115,37,99,98,97,115,101,113,51,37,99,98,111,116,108,105,98,46,108,111,103,0,0,59,0,0,0,0,0,0,0,32,102,108,111,97,116,0,0,35,112,114,97,103,109,97,32,100,105,114,101,99,116,105,118,101,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,98,111,116,102,105,108,101,115,0,0,0,0,0,0,0,0,45,45,45,45,45,45,32,83,101,114,118,101,114,32,73,110,105,116,105,97,108,105,122,97,116,105,111,110,32,45,45,45,45,45,45,10,0,0,0,0,66,111,116,67,111,110,115,116,114,117,99,116,67,104,97,116,58,32,109,101,115,115,97,103,101,32,37,115,32,116,111,111,32,108,111,110,103,10,0,0,102,117,110,99,95,100,111,111,114,0,0,0,0,0,0,0,109,97,112,58,32,37,115,10,0,0,0,0,0,0,0,0,103,111,97,108,32,115,116,97,116,101,32,104,97,110,100,108,101,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,0,0,119,101,97,112,111,110,115,116,97,116,101,0,0,0,0,0,47,0,0,0,0,0,0,0,98,111,116,95,101,110,97,98,108,101,0,0,0,0,0,0,99,108,105,101,110,116,68,111,119,110,108,111,97,100,58,32,37,100,32,58,32,99,108,105,101,110,116,32,97,99,107,110,111,119,108,101,100,103,101,32,111,102,32,98,108,111,99,107,32,37,100,10,0,0,0,0,125,10,0,0,0,0,0,0,65,65,83,95,84,114,97,99,101,65,114,101,97,115,58,32,115,116,97,99,107,32,111,118,101,114,102,108,111,119,10,0,10,114,111,117,116,101,32,99,97,99,104,101,32,119,114,105,116,116,101,110,32,116,111,32,37,115,10,0,0,0,0,0,98,111,116,95,118,105,115,117,97,108,105,122,101,106,117,109,112,112,97,100,115,0,0,0,112,104,121,115,95,119,97,116,101,114,103,114,97,118,105,116,121,0,0,0,0,0,0,0,72,117,110,107,95,65,108,108,111,99,32,102,97,105,108,101,100,32,111,110,32,37,105,0,115,104,111,119,109,101,109,111,114,121,117,115,97,103,101,0,119,114,105,116,105,110,103,32,37,115,10,0,0,0,0,0,112,111,115,115,105,98,108,101,32,112,111,114,116,97,108,58,32,37,100,13,10,0,0,0,118,109,47,37,115,46,109,97,112,0,0,0,0,0,0,0,81,95,115,116,114,110,99,112,121,122,58,32,78,85,76,76,32,115,114,99,0,0,0,0,83,121,115,95,83,101,110,100,80,97,99,107,101,116,58,32,37,115,10,0,0,0,0,0,37,115,32,114,101,99,118,32,37,52,105,32,58,32,115,61,37,105,32,102,114,97,103,109,101,110,116,61,37,105,44,37,105,10,0,0,0,0,0,0,99,115,32,37,105,32,34,37,115,34,10,0,0,0,0,0,32,117,110,115,105,103,110,101,100,0,0,0,0,0,0,0,35,101,114,114,111,114,32,100,105,114,101,99,116,105,118,101,58,32,37,115,0,0,0,0,66,111,116,67,111,110,115,116,114,117,99,116,67,104,97,116,58,32,109,101,115,115,97,103,101,32,37,115,32,118,97,114,105,97,98,108,101,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,112,111,115,46,116,114,84,105,109,101,0,0,0,0,0,0,83,101,114,118,101,114,32,105,110,102,111,32,115,101,116,116,105,110,103,115,58,10,0,0,112,109,95,102,108,97,103,115,0,0,0,0,0,0,0,0,70,105,108,101,32,110,111,116,32,102,111,117,110,100,58,32,34,37,115,34,10,0,0,0,115,121,115,116,101,109,105,110,102,111,0,0,0,0,0,0,99,108,105,101,110,116,68,111,119,110,108,111,97,100,58,32,37,100,32,58,32,102,105,108,101,32,34,37,115,34,32,97,98,111,114,116,101,100,10,0,72,117,110,107,95,65,108,108,111,99,58,32,72,117,110,107,32,109,101,109,111,114,121,32,115,121,115,116,101,109,32,110,111,116,32,105,110,105,116,105,97,108,105,122,101,100,0,0,37,115,32,37,105,32,34,37,115,34,10,0,0,0,0,0,32,108,111,110,103,0,0,0,99,111,117,108,100,110,39,116,32,108,111,97,100,32,99,104,97,116,32,37,115,32,102,114,111,109,32,37,115,10,0,0,83,121,115,116,101,109,32,105,110,102,111,32,115,101,116,116,105,110,103,115,58,10,0,0,101,118,101,110,116,115,91,49], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+10240);
/* memory initializer */ allocate([93,0,0,0,0,0,0,0,85,115,97,103,101,58,32,119,104,105,99,104,32,60,102,105,108,101,62,10,0,0,0,0,99,108,105,101,110,116,68,111,119,110,108,111,97,100,58,32,37,115,32,68,111,110,101,10,0,0,0,0,0,0,0,0,98,97,115,101,103,97,109,101,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,114,101,102,117,115,105,110,103,32,116,111,32,99,114,101,97,116,101,32,114,101,108,97,116,105,118,101,32,112,97,116,104,32,34,37,115,34,10,0,72,117,110,107,95,67,108,101,97,114,58,32,114,101,115,101,116,32,116,104,101,32,104,117,110,107,32,111,107,10,0,0,98,99,115,49,0,0,0,0,98,105,110,97,114,121,0,0,35,108,105,110,101,32,100,105,114,101,99,116,105,118,101,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,0,0,105,99,104,97,116,100,97,116,97,32,116,97,98,108,101,32,102,117,108,108,59,32,99,111,117,108,100,110,39,116,32,108,111,97,100,32,99,104,97,116,32,37,115,32,102,114,111,109,32,37,115,10,0,0,0,0,80,108,97,121,101,114,32,37,115,32,105,115,32,110,111,116,32,111,110,32,116,104,101,32,115,101,114,118,101,114,10,0,101,118,101,110,116,115,91,48,93,0,0,0,0,0,0,0,70,105,108,101,32,34,37,115,34,32,102,111,117,110,100,32,97,116,32,34,37,115,34,10,0,0,0,0,0,0,0,0,100,111,110,101,100,108,0,0,109,101,109,105,110,102,111,0,44,32,116,104,101,32,100,101,102,97,117,108,116,0,0,0,98,99,115,50,0,0,0,0,111,99,116,97,108,0,0,0,109,105,115,112,108,97,99,101,100,32,35,101,108,105,102,0,98,111,116,95,114,101,108,111,97,100,99,104,97,114,97,99,116,101,114,115,0,0,0,0,45,45,45,45,45,45,45,45,10,0,0,0,0,0,0,0,109,111,118,101,109,101,110,116,68,105,114,0,0,0,0,0,70,105,108,101,32,34,37,115,34,32,102,111,117,110,100,32,105,110,32,34,37,115,34,10,0,0,0,0,0,0,0,0,115,116,111,112,100,108,0,0,72,117,110,107,32,100,97,116,97,32,102,97,105,108,101,100,32,116,111,32,97,108,108,111,99,97,116,101,32,37,105,32,109,101,103,115,0,0,0,0,115,116,97,116,117,115,82,101,115,112,111,110,115,101,10,37,115,10,37,115,0,0,0,0,98,99,115,48,0,0,0,0,110,111,116,104,105,110,103,32,116,111,32,101,118,97,108,117,97,116,101,0,0,0,0,0,108,111,97,100,101,100,32,37,115,32,102,114,111,109,32,37,115,10,0,0,0,0,0,0,117,115,101,114,105,110,102,111,10,0,0,0,0,0,0,0,101,118,101,110,116,83,101,113,117,101,110,99,101,0,0,0,85,115,97,103,101,58,32,116,111,117,99,104,70,105,108,101,32,60,102,105,108,101,62,10,0,0,0,0,0,0,0,0,100,111,119,110,108,111,97,100,0,0,0,0,0,0,0,0,37,105,0,0,0,0,0,0,77,105,110,105,109,117,109,32,99,111,109,95,104,117,110,107,77,101,103,115,32,105,115,32,37,105,44,32,97,108,108,111,99,97,116,105,110,103,32,37,105,32,109,101,103,115,46,10,0,0,0,0,0,0,0,0,37,105,32,37,105,32,34,37,115,34,10,0,0,0,0,0,113,0,0,0,0,0,0,0,83,86,95,83,116,97,114,116,117,112,58,32,115,118,115,46,105,110,105,116,105,97,108,105,122,101,100,0,0,0,0,0,110,111,32,108,101,97,100,105,110,103,32,40,32,97,102,116,101,114,32,36,101,118,97,108,105,110,116,47,36,101,118,97,108,102,108,111,97,116,0,0,99,111,117,108,100,110,39,116,32,102,105,110,100,32,99,104,97,116,32,37,115,32,105,110,32,37,115,10,0,0,0,0,85,115,97,103,101,58,32,100,117,109,112,117,115,101,114,32,60,117,115,101,114,105,100,62,10,0,0,0,0,0,0,0,112,109,95,116,105,109,101,0,104,97,110,100,108,101,32,37,105,58,32,37,115,10,0,0,118,100,114,0,0,0,0,0,77,105,110,105,109,117,109,32,99,111,109,95,104,117,110,107,77,101,103,115,32,102,111,114,32,97,32,100,101,100,105,99,97,116,101,100,32,115,101,114,118,101,114,32,105,115,32,37,105,44,32,97,108,108,111,99,97,116,105,110,103,32,37,105,32,109,101,103,115,46,10,0,114,95,100,101,98,117,103,83,117,114,102,97,99,101,85,112,100,97,116,101,0,0,0,0,112,114,105,110,116,10,89,111,117,32,97,114,101,32,98,97,110,110,101,100,32,102,114,111,109,32,116,104,105,115,32,115,101,114,118,101,114,46,10,0,83,86,67,95,83,116,97,116,117,115,58,32,114,97,116,101,32,108,105,109,105,116,32,101,120,99,101,101,100,101,100,44,32,100,114,111,112,112,105,110,103,32,114,101,113,117,101,115,116,10,0,0,0,0,0,0,99,103,97,109,101,0,0,0,101,120,112,101,99,116,101,100,32,97,32,37,115,44,32,102,111,117,110,100,32,37,115,0,99,97,110,39,116,32,101,118,97,108,117,97,116,101,32,37,115,0,0,0,0,0,0,0,67,77,111,100,95,76,111,97,100,66,114,117,115,104,101,115,58,32,98,97,100,32,115,104,97,100,101,114,78,117,109,58,32,37,105,0,0,0,0,0,117,110,107,110,111,119,110,32,100,101,102,105,110,105,116,105,111,110,32,37,115,0,0,0,83,86,95,77,97,112,82,101,115,116,97,114,116,95,102,40,37,100,41,58,32,100,114,111,112,112,101,100,32,99,108,105,101,110,116,32,37,105,32,45,32,100,101,110,105,101,100,33,10,0,0,0,0,0,0,0,108,101,103,115,84,105,109,101,114,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,99,112,0,0,0,0,0,0,83,86,70,95,67,76,73,69,78,84,77,65,83,75,58,32,99,108,105,101,110,116,78,117,109,32,62,61,32,51,50,0,49,50,56,0,0,0,0,0,83,86,67,95,83,116,97,116,117,115,58,32,114,97,116,101,32,108,105,109,105,116,32,102,114,111,109,32,37,115,32,101,120,99,101,101,100,101,100,44,32,100,114,111,112,112,105,110,103,32,114,101,113,117,101,115,116,10,0,0,0,0,0,0,118,109,47,37,115,46,113,118,109,0,0,0,0,0,0,0,112,117,110,99,116,117,97,116,105,111,110,0,0,0,0,0,99,97,110,39,116,32,101,118,97,108,117,97,116,101,32,37,115,44,32,110,111,116,32,100,101,102,105,110,101,100,0,0,101,120,112,101,99,116,101,100,32,116,121,112,101,32,102,111,117,110,100,32,37,115,0,0,109,97,112,95,114,101,115,116,97,114,116,10,0,0,0,0,118,101,108,111,99,105,116,121,91,50,93,0,0,0,0,0,37,115,37,99,37,115,10,0,100,105,115,99,111,110,110,101,99,116,0,0,0,0,0,0,99,111,109,95,104,117,110,107,77,101,103,115,0,0,0,0,112,114,105,110,116,10,37,115,0,0,0,0,0,0,0,0,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,10,0,0,0,0,81,117,97,107,101,65,114,101,110,97,45,49,0,0,0,0,110,97,109,101,0,0,0,0,110,111,32,118,97,108,117,101,32,97,102,116,101,114,32,35,105,102,47,35,101,108,105,102,0,0,0,0,0,0,0,0,116,121,112,101,0,0,0,0,115,118,95,115,101,114,118,101,114,105,100,0,0,0,0,0,119,101,97,112,111,110,84,105,109,101,0,0,0,0,0,0,32,32,32,32,110,111,116,32,105,110,32,116,104,101,32,109,97,110,105,102,101,115,116,10,0,0,0,0,0,0,0,0,117,115,101,114,105,110,102,111,0,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,99,111,100,101,32,108,101,110,103,116,104,115,32,115,101,116,0,0,0,0,0,0,0,0,117,115,101,114,110,97,109,101,0,0,0,0,0,0,0,0,72,117,110,107,32,105,110,105,116,105,97,108,105,122,97,116,105,111,110,32,102,97,105,108,101,100,46,32,70,105,108,101,32,115,121,115,116,101,109,32,108,111,97,100,32,115,116,97,99,107,32,110,111,116,32,122,101,114,111,0,0,0,0,0,118,97,108,117,101,32,37,108,100,32,111,117,116,32,111,102,32,114,97,110,103,101,32,91,37,102,44,32,37,102,93,0,60,61,0,0,0,0,0,0,100,101,102,105,110,101,32,37,115,32,119,105,116,104,32,116,111,111,32,109,97,110,121,32,112,97,114,109,115,0,0,0,66,97,100,32,114,99,111,110,112,97,115,115,119,111,114,100,46,10,0,0,0,0,0,0,99,97,110,39,116,32,99,108,111,115,101,32,108,111,103,32,102,105,108,101,32,37,115,10,0,0,0,0,0,0,0,0,37,115,37,99,37,115,37,99,98,111,116,108,105,98,46,108,111,103,0,0,0,0,0,0,41,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,115,118,95,112,117,114,101,32,115,101,116,32,98,117,116,32,110,111,32,80,75,51,32,102,105,108,101,115,32,108,111,97,100,101,100,10,0,0,0,110,117,109,98,101,114,0,0,63,32,97,102,116,101,114,32,63,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,109,97,120,95,112,114,111,106,101,99,116,105,108,101,105,110,102,111,32,61,32,37,100,10,0,0,0,0,0,0,0,0,83,86,95,71,101,116,85,115,101,114,105,110,102,111,58,32,98,97,100,32,105,110,100,101,120,32,37,105,0,0,0,0,99,104,97,116,0,0,0,0,102,117,110,99,95,112,108,97,116,0,0,0,0,0,0,0,109,97,112,110,97,109,101,0,109,97,120,115,0,0,0,0,118,105,101,119,97,110,103,108,101,115,91,48,93,0,0,0,32,32,32,32,105,110,32,116,104,101,32,109,97,110,105,102,101,115,116,10,0,0,0,0,86,77,95,82,101,115,116,97,114,116,32,111,110,32,103,97,109,101,32,102,97,105,108,101,100,0,0,0,0,0,0,0,71,111,105,110,103,32,102,114,111,109,32,67,83,95,67,79,78,78,69,67,84,69,68,32,116,111,32,67,83,95,80,82,73,77,69,68,32,102,111,114,32,37,115,10,0,0,0,0,32,37,52,100,32,37,115,10,0,0,0,0,0,0,0,0,65,65,83,95,84,114,97,99,101,66,111,117,110,100,105,110,103,66,111,120,58,32,115,116,97,99,107,32,111,118,101,114,102,108,111,119,10,0,0,0,85,110,97,98,108,101,32,116,111,32,111,112,101,110,32,102,105,108,101,58,32,37,115,10,0,0,0,0,0,0,0,0,116,114,105,103,103,101,114,95,112,117,115,104,32,119,105,116,104,111,117,116,32,116,105,109,101,10,0,0,0,0,0,0,49,0,0,0,0,0,0,0,115,104,111,119,99,97,99,104,101,117,112,100,97,116,101,115,0,0,0,0,0,0,0,0,97,97,115,32,102,105,108,101,32,37,115,32,105,115,32,111,117,116,32,111,102,32,100,97,116,101,10,0,0,0,0,0,77,65,88,95,80,79,82,84,65,76,65,82,69,65,83,10,0,0,0,0,0,0,0,0,109,105,115,115,105,110,103,32,125,0,0,0,0,0,0,0,73,110,116,101,114,112,114,101,116,101,114,32,101,114,114,111,114,58,32,111,112,83,116,97,99,107,91,48,93,32,61,32,37,88,44,32,111,112,83,116,97,99,107,79,102,115,32,61,32,37,100,0,0,0,0,0,81,95,115,116,114,110,99,112,121,122,58,32,78,85,76,76,32,100,101,115,116,0,0,0,78,111,32,114,99,111,110,112,97,115,115,119,111,114,100,32,115,101,116,32,111,110,32,116,104,101,32,115,101,114,118,101,114,46,10,0,0,0,0,0,83,121,115,95,83,101,110,100,80,97,99,107,101,116,58,32,98,97,100,32,97,100,100,114,101,115,115,32,116,121,112,101,0,0,0,0,0,0,0,0,37,115,32,115,101,110,100,32,37,52,105,32,58,32,115,61,37,105,32,97,99,107,61,37,105,10,0,0,0,0,0,0,37,105,0,0,0,0,0,0,58,32,119,105,116,104,111,117,116,32,63,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,0,0,0,0,0,0,37,100,32,117,115,101,100,32,37,100,10,0,0,0,0,0,118,97,114,105,97,98,108,101,32,99,104,97,110,103,101,32,45,45,32,114,101,115,116,97,114,116,105,110,103,46,10,0,118,105,101,119,97,110,103,108,101,115,91,49,93,0,0,0,32,32,32,32,111,110,32,116,104,101,32,112,117,114,101,32,108,105,115,116,10,0,0,0,115,101,114,118,101,114,105,110,102,111,0,0,0,0,0,0,83,86,95,83,101,110,100,67,108,105,101,110,116,71,97,109,101,83,116,97,116,101,40,41,32,102,111,114,32,37,115,10,0,0,0,0,0,0,0,0,82,99,111,110,32,102,114,111,109,32,37,115,58,32,37,115,10,0,0,0,0,0,0,0,109,97,112,115,47,37,115,46,98,115,112,0,0,0,0,0,115,116,114,105,110,103,0,0,100,105,118,105,100,101,32,98,121,32,122,101,114,111,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,0,0,0,37,105,0,0,0,0,0,0,118,101,108,111,99,105,116,121,91,49,93,0,0,0,0,0,32,32,32,32,110,111,116,32,111,110,32,116,104,101,32,112,117,114,101,32,108,105,115,116,10,0,0,0,0,0,0,0,76,111,115,116,32,114,101,108,105,97,98,108,101,32,99,111,109,109,97,110,100,115,0,0,94,49,69,114,114,111,114,58,32,83,86,95,66,111,116,76,105,98,83,101,116,117,112,32,119,105,116,104,111,117,116,32,83,86,95,66,111,116,73,110,105,116,66,111,116,76,105,98,10,0,0,0,0,0,0,0,58,58,0,0,0,0,0,0,66,97,100,32,114,99,111,110,32,102,114,111,109,32,37,115,58,32,37,115,10,0,0,0,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,10,0,0,0,0,99,111,117,108,100,110,39,116,32,114,101,97,100,32,101,120,112,101,99,116,101,100,32,116,111,107,101,110,0,0,0,0,109,105,115,105,110,103,32,118,97,108,117,101,115,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,0,0,0,0,49,0,0,0,0,0,0,0,118,101,108,111,99,105,116,121,91,48,93,0,0,0,0,0,37,115,32,40,37,105,32,102,105,108,101,115,41,10,0,0,67,108,105,101,110,116,32,37,115,32,108,111,115,116,32,37,105,32,99,108,105,101,110,116,67,111,109,109,97,110,100,115,10,0,0,0,0,0,0,0,44,32,115,101,116,116,105,110,103,32,116,111,32,37,102,10,0,0,0,0,0,0,0,0,113,99,111,110,115,111,108,101,46,108,111,103,0,0,0,0,34,37,115,34,32,105,115,58,34,37,115,94,55,34,0,0,83,86,67,95,82,101,109,111,116,101,67,111,109,109,97,110,100,58,32,114,97,116,101,32,108,105,109,105,116,32,101,120,99,101,101,100,101,100,44,32,100,114,111,112,112,105,110,103,32,114,101,113,117,101,115,116,10,0,0,0,0,0,0,0,117,105,95,115,105,110,103,108,101,80,108,97,121,101,114,65,99,116,105,118,101,0,0,0,101,120,112,101,99,116,101,100,32,37,115,44,32,102,111,117,110,100,32,37,115,0,0,0,116,111,111,32,109,97,110,121,32,40,32,105,110,32,35,105,102,47,35,101,108,105,102,0,115,118,95,99,104,101,97,116,115,0,0,0,0,0,0,0,98,111,98,67,121,99,108,101,0,0,0,0,0,0,0,0,67,117,114,114,101,110,116,32,115,101,97,114,99,104,32,112,97,116,104,58,10,0,0,0,99,108,105,101,110,116,67,111,109,109,97,110,100,58,32,37,115,32,58,32,37,105,32,58,32,37,115,10,0,0,0,0,44,32,115,101,116,116,105,110,103,32,116,111,32,37,100,10,0,0,0,0,0,0,0,0,90,111,110,101,32,100,97,116,97,32,102,97,105,108,101,100,32,116,111,32,97,108,108,111,99,97,116,101,32,37,105,32,109,101,103,115,0,0,0,0,83,86,67,95,82,101,109,111,116,101,67,111,109,109,97,110,100,58,32,114,97,116,101,32,108,105,109,105,116,32,102,114,111,109,32,37,115,32,101,120,99,101,101,100,101,100,44,32,100,114,111,112,112,105,110,103,32,114,101,113,117,101,115,116,10,0,0,0,0,0,0,0,45,45,45,45,45,32,83,101,114,118,101,114,32,83,104,117,116,100,111,119,110,32,40,37,115,41,32,45,45,45,45,45,10,0,0,0,0,0,0,0,116,114,97,105,108,105,110,103,32,111,112,101,114,97,116,111,114,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,56,0,0,0,0,0,0,0,99,111,109,109,97,110,100,84,105,109,101,0,0,0,0,0,37,100,32,102,105,108,101,115,32,108,105,115,116,101,100,10,0,0,0,0,0,0,0,0,67,97,110,110,111,116,32,118,97,108,105,100,97,116,101,32,112,117,114,101,32,99,108,105,101,110,116,33,0,0,0,0,99,111,109,95,101,114,114,111,114,67,111,100,101,0,0,0,32,111,117,116,32,111,102,32,114,97,110,103,101,32,40,109,97,120,32,37,102,41,0,0,50,52,0,0,0,0,0,0,98,97,100,32,99,111,110,110,101,99,116,105,111,110,108,101,115,115,32,112,97,99,107,101,116,32,102,114,111,109,32,37,115,58,10,37,115,10,0,0,101,120,101,99,37,115,32,60,102,105,108,101,110,97,109,101,62,32,58,32,101,120,101,99,117,116,101,32,97,32,115,99,114,105,112,116,32,102,105,108,101,37,115,10,0,0,0,0,100,105,115,99,111,110,110,101,99,116,32,34,37,115,34,0,99,97,110,39,116,32,114,101,97,100,32,116,111,107,101,110,0,0,0,0,0,0,0,0,117,110,107,110,111,119,110,32,37,115,32,105,110,32,35,105,102,47,35,101,108,105,102,0,110,111,32,114,99,104,97,116,115,10,0,0,0,0,0,0,115,118,95,109,97,120,99,108,105,101,110,116,115,0,0,0,83,121,115,95,83,116,114,105,110,103,84,111,83,111,99,107,97,100,100,114,58,32,69,114,114,111,114,32,114,101,115,111,108,118,105,110,103,32,37,115,58,32,37,115,10,0,0,0,101,120,97,109,112,108,101,58,32,102,100,105,114,32,42,113,51,100,109,42,46,98,115,112,10,0,0,0,0,0,0,0,37,115,58,32,100,105,100,110,39,116,32,103,101,116,32,99,112,32,99,111,109,109,97,110,100,44,32,114,101,115,101,110,100,105,110,103,32,103,97,109,101,115,116,97,116,101,10,0,32,111,117,116,32,111,102,32,114,97,110,103,101,32,40,109,97,120,32,37,100,41,0,0,99,111,109,95,122,111,110,101,77,101,103,115,0,0,0,0,67,77,95,71,101,110,101,114,97,116,101,80,97,116,99,104,70,97,99,101,116,115,58,32,115,111,117,114,99,101,32,105,115,32,62,32,77,65,88,95,71,82,73,68,95,83,73,90,69,0,0,0,0,0,0,0,100,105,115,99,111,110,110,101,99,116,0,0,0,0,0,0,83,86,67,95,68,105,114,101,99,116,67,111,110,110,101,99,116,32,40,41,10,0,0,0,112,114,105,110,116,32,34,37,115,10,34,10,0,0,0,0,112,114,105,109,105,116,105,118,101,32,116,111,107,101,110,32,108,111,110,103,101,114,32,116,104,97,110,32,77,65,88,95,84,79,75,69,78,32,61,32,37,100,0,0,0,0,0,0,111,117,116,32,111,102,32,111,112,101,114,97,116,111,114,32,115,112,97,99,101,0,0,0,77,97,112,32,104,97,115,32,110,111,32,110,111,100,101,115,0,0,0,0,0,0,0,0,62,0,0,0,0,0,0,0,103,95,100,111,87,97,114,109,117,112,0,0,0,0,0,0,83,121,115,95,83,116,114,105,110,103,84,111,83,111,99,107,97,100,100,114,58,32,69,114,114,111,114,32,114,101,115,111,108,118,105,110,103,32,37,115,58,32,78,111,32,97,100,100,114,101,115,115,32,111,102,32,114,101,113,117,105,114,101,100,32,116,121,112,101,32,102,111,117,110,100,46,10,0,0,0,117,115,97,103,101,58,32,102,100,105,114,32,60,102,105,108,116,101,114,62,10,0,0,0,99,109,100,67,111,117,110,116,32,62,32,77,65,88,95,80,65,67,75,69,84,95,85,83,69,82,67,77,68,83,10,0,32,111,117,116,32,111,102,32,114,97,110,103,101,32,40,109,105,110,32,37,102,41,0,0,70,73,88,73,78,71,32,69,78,84,45,62,83,46,78,85,77,66,69,82,33,33,33,10,0,0,0,0,0,0,0,0,83,109,97,108,108,32,122,111,110,101,32,100,97,116,97,32,102,97,105,108,101,100,32,116,111,32,97,108,108,111,99,97,116,101,32,37,49,46,49,102,32,109,101,103,115,0,0,0,114,99,111,110,0,0,0,0,114,101,104,97,115,104,98,97,110,115,10,0,0,0,0,0,105,110,118,97,108,105,100,32,111,112,101,114,97,116,111,114,32,37,115,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,0,0,0,0,0,0,115,112,0,0,0,0,0,0,72,111,115,116,110,97,109,101,58,32,37,115,10,0,0,0,37,115,10,0,0,0,0,0,99,109,100,67,111,117,110,116,32,60,32,49,10,0,0,0,32,111,117,116,32,111,102,32,114,97,110,103,101,32,40,109,105,110,32,37,100,41,0,0,103,101,116,99,104,97,108,108,101,110,103,101,0,0,0,0,115,101,114,118,101,114,98,97,110,115,46,100,97,116,0,0,81,117,97,107,101,51,65,114,101,110,97,0,0,0,0,0,111,112,101,114,97,116,111,114,32,37,115,32,97,102,116,101,114,32,111,112,101,114,97,116,111,114,32,105,110,32,35,105,102,47,35,101,108,105,102,0,60,0,0,0,0,0,0,0,103,114,97,112,112,108,101,114,101,97,99,104,0,0,0,0,48,0,0,0,0,0,0,0,110,101,116,95,100,114,111,112,115,105,109,0,0,0,0,0,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,10,0,0,0,0,0,0,0,0,67,98,117,102,95,65,100,100,84,101,120,116,58,32,111,118,101,114,102,108,111,119,10,0,87,65,82,78,73,78,71,58,32,98,97,100,32,99,111,109,109,97,110,100,32,98,121,116,101,32,102,111,114,32,99,108,105,101,110,116,32,37,105,10,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,99,118,97,114,32,39,37,115,39,0,0,0,0,0,0,105,110,102,105,110,105,116,121,0,0,0,0,0,0,0,0,116,111,111,32,109,97,110,121,32,108,101,110,103,116,104,32,111,114,32,100,105,115,116,97,110,99,101,32,115,121,109,98,111,108,115,0,0,0,0,0,101,109,115,99,114,105,112,116,101,110,32,0,0,0,0,0,32,32,32,32,32,32,32,32,37,56,105,32,98,121,116,101,115,32,105,110,32,115,109,97,108,108,32,90,111,110,101,32,109,101,109,111,114,121,10,0,118,97,108,117,101,32,37,108,100,32,111,117,116,32,111,102,32,114,97,110,103,101,32,91,37,108,100,44,32,37,108,100,93,0,0,0,0,0,0,0,62,61,0,0,0,0,0,0,40,0,0,0,0,0,0,0,103,101,116,105,110,102,111,0,79,112,101,110,101,100,32,108,111,103,32,37,115,10,0,0,98,97,115,101,103,97,109,101,0,0,0,0,0,0,0,0,44,0,0,0,0,0,0,0,115,118,95,98,97,110,70,105,108,101,0,0,0,0,0,0,110,117,109,98,101,114,32,108,111,110,103,101,114,32,116,104,97,110,32,77,65,88,95,84,79,75,69,78,32,61,32,37,100,0,0,0,0,0,0,0,43,43,32,111,114,32,45,45,32,117,115,101,100,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,0,0,0,0,109,97,120,95,112,114,111,106,101,99,116,105,108,101,105,110,102,111,0,0,0,0,0,0,83,86,95,71,101,116,85,115,101,114,105,110,102,111,58,32,98,117,102,102,101,114,83,105,122,101,32,61,61,32,37,105,0,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,91,44,32,102,111,117,110,100,32,37,115,0,0,0,0,102,117,110,99,95,98,111,98,98,105,110,103,0,0,0,0,102,111,114,99,101,114,101,97,99,104,97,98,105,108,105,116,121,0,0,0,0,0,0,0,103,95,103,97,109,101,116,121,112,101,0,0,0,0,0,0,110,101,116,95,115,111,99,107,115,80,97,115,115,119,111,114,100,0,0,0,0,0,0,0,109,105,110,115,0,0,0,0,68,105,114,101,99,116,111,114,121,32,111,102,32,37,115,32,37,115,10,0,0,0,0,0,66,97,100,32,103,97,109,101,32,115,121,115,116,101,109,32,116,114,97,112,58,32,37,108,100,0,0,0,0,0,0,0,37,115,32,97,99,107,110,111,119,108,101,100,103,101,100,32,103,97,109,101,115,116,97,116,101,10,0,0,0,0,0,0,32,37,52,100,32,37,102,10,0,0,0,0,0,0,0,0,65,65,83,95,65,114,101,97,80,114,101,115,101,110,99,101,84,121,112,101,58,32,105,110,118,97,108,105,100,32,97,114,101,97,32,110,117,109,98,101,114,10,0,0,0,0,0,0,32,97,110,100,32,105,115,0,109,97,112,115,47,37,115,46,114,99,100,0,0,0,0,0,111,114,105,103,105,110,0,0,112,104,121,115,95,119,97,116,101,114,102,114,105,99,116,105,111,110,0,0,0,0,0,0,32,32,32,32,32,32,32,32,37,56,105,32,98,121,116,101,115,32,105,110,32,100,121,110,97,109,105,99,32,111,116,104,101,114,10,0,0,0,0,0,99,111,117,108,100,110,39,116,32,119,114,105,116,101,32,37,115,10,0,0,0,0,0,0,115,118,95,109,97,112,67,104,101,99,107,115,117,109,0,0,65,65,83,95,69,110,116,105,116,121,77,111,100,101,108,78,117,109,58,32,101,110,116,110,117,109,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,0,65,65,83,95,77,65,88,95,80,79,82,84,65,76,83,10,0,0,0,0,0,0,0,0,125,0,0,0,0,0,0,0,86,77,32,112,114,111,103,114,97,109,32,99,111,117,110,116,101,114,32,111,117,116,32,111,102,32,114,97,110,103,101,32,105,110,32,79,80,95,74,85,77,80,0,0,0,0,0,0,103,101,116,115,116,97,116,117,115,0,0,0,0,0,0,0,79,118,101,114,115,105,122,101,32,112,97,99,107,101,116,32,102,114,111,109,32,37,115,10,0,0,0,0,0,0,0,0,78,101,116,99,104,97,110,95,84,114,97,110,115,109,105,116,58,32,108,101,110,103,116,104,32,61,32,37,105,0,0,0,115,118,95,108,97,110,70,111,114,99,101,82,97,116,101,0,98,105,110,97,114,121,32,110,117,109,98,101,114,32,108,111,110,103,101,114,32,116,104,97,110,32,77,65,88,95,84,79,75,69,78,32,61,32,37,100,0,0,0,0,0,0,0,0,33,32,111,114,32,126,32,97,102,116,101,114,32,118,97,108,117,101,32,105,110,32,35,105,102,47,35,101,108,105,102,0,118,97,114,105,97,98,108,101,115,32,102,114,111,109,32,116,104,101,32,109,97,116,99,104,32,116,101,109,112,108,97,116,101,40,115,41,32,99,111,117,108,100,32,98,101,32,105,110,118,97,108,105,100,32,119,104,101,110,32,111,117,116,112,117,116,116,105,110,103,32,111,110,101,32,111,102,32,116,104,101,32,99,104,97,116,32,109,101,115,115,97,103,101,115,0,0,99,97,108,99,117,108,97,116,105,110,103,32,99,108,117,115,116,101,114,115,46,46,46,10,0,0,0,0,0,0,0,0,77,83,71,95,87,114,105,116,101,83,116,114,105,110,103,58,32,66,73,71,95,73,78,70,79,95,83,84,82,73,78,71,0,0,0,0,0,0,0,0,67,97,110,39,116,32,102,105,110,100,32,109,97,112,32,37,115,10,0,0,0,0,0,0,110,101,116,95,115,111,99,107,115,85,115,101,114,110,97,109,101,0,0,0,0,0,0,0,117,115,97,103,101,58,32,100,105,114,32,60,100,105,114,101,99,116,111,114,121,62,32,91,101,120,116,101,110,115,105,111,110,93,10,0,0,0,0,0,115,116,97,116,117,115,0,0,37,115,32,58,32,100,114,111,112,112,101,100,32,103,97,109,101,115,116,97,116,101,44,32,114,101,115,101,110,100,105,110,103,10,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,99,118,97,114,32,39,37,115,39,32,109,117,115,116,32,98,101,32,110,117,109,101,114,105,99,0,0,0,0,0,0,32,32,32,32,32,32,32,32,37,56,105,32,98,121,116,101,115,32,105,110,32,100,121,110,97,109,105,99,32,114,101,110,100,101,114,101,114,10,0,0,83,86,32,112,97,99,107,101,116,32,37,115,32,58,32,37,115,10,0,0,0,0,0,0,70,108,111,111,100,65,114,101,97,95,114,58,32,114,101,102,108,111,111,100,101,100,0,0,115,118,95,109,97,112,67,104,101,99,107,115,117,109,0,0,104,101,120,97,100,101,99,105,109,97,108,32,110,117,109,98,101,114,32,108,111,110,103,101,114,32,116,104,97,110,32,77,65,88,95,84,79,75,69,78,32,61,32,37,100,0,0,0,105,108,108,105,103,97,108,32,111,112,101,114,97,116,111,114,32,37,115,32,111,110,32,102,108,111,97,116,105,110,103,32,112,111,105,110,116,32,111,112,101,114,97,110,100,115,0,0,49,48,48,48,0,0,0,0,97,108,108,32,107,101,121,115,32,104,97,118,101,32,97,32,38,32,111,114,32,33,32,112,114,101,102,105,120,0,0,0,10,112,108,101,97,115,101,32,119,97,105,116,32,119,104,105,108,101,32,115,116,111,114,105,110,103,32,114,101,97,99,104,97,98,105,108,105,116,121,46,46,46,10,0,0,0,0,0,102,115,95,99,111,109,112,108,101,116,101,77,97,110,105,102,101,115,116,0,0,0,0,0,49,48,56,48,0,0,0,0,47,100,101,115,99,114,105,112,116,105,111,110,46,116,120,116,0,0,0,0,0,0,0,0,37,115,32,58,32,105,103,110,111,114,105,110,103,32,112,114,101,32,109,97,112,95,114,101,115,116,97,114,116,32,47,32,111,117,116,100,97,116,101,100,32,99,108,105,101,110,116,32,109,101,115,115,97,103,101,10,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,99,118,97,114,32,39,37,115,39,32,109,117,115,116,32,98,101,32,105,110,116,101,103,114,97,108,0,0,0,0,0,46,46,0,0,0,0,0,0,32,32,32,32,32,32,32,32,37,56,105,32,98,121,116,101,115,32,105,110,32,100,121,110,97,109,105,99,32,98,111,116,108,105,98,10,0,0,0,0,99,111,110,110,101,99,116,0,115,118,95,107,105,108,108,115,101,114,118,101,114,0,0,0,110,97,109,101,32,108,111,110,103,101,114,32,116,104,97,110,32,77,65,88,95,84,79,75,69,78,32,61,32,37,100,0,116,111,111,32,109,97,110,121,32,41,32,105,110,32,35,105,102,47,35,101,108,115,105,102,0,0,0,0,0,0,0,0,100,114,111,112,112,101,100,119,101,105,103,104,116,0,0,0,116,104,101,32,107,101,121,32,37,115,32,119,105,116,104,32,112,114,101,102,105,120,32,33,32,105,115,32,105,110,115,105,100,101,32,116,104,101,32,109,97,116,99,104,32,116,101,109,112,108,97,116,101,32,115,116,114,105,110,103,32,37,115,0,13,37,54,46,49,102,37,37,0,0,0,0,0,0,0,0,80,114,101,100,105,99,116,77,111,118,101,109,101,110,116,58,32,115,116,97,114,116,32,115,111,108,105,100,10,0,0,0,37,115,46,112,107,51,0,0,110,101,116,95,115,111,99,107,115,80,111,114,116,0,0,0,77,83,71,95,87,114,105,116,101,68,101,108,116,97,69,110,116,105,116,121,58,32,66,97,100,32,101,110,116,105,116,121,32,110,117,109,98,101,114,58,32,37,105,0,0,0,0,0,46,0,0,0,0,0,0,0,110,101,120,116,100,108,0,0,99,118,97,114,95,114,101,115,116,97,114,116,0,0,0,0,37,56,105,32,98,121,116,101,115,32,105,110,32,37,105,32,122,111,110,101,32,98,108,111,99,107,115,10,0,0,0,0,69,114,114,111,114,58,32,84,111,111,32,109,97,110,121,32,99,118,97,114,115,44,32,99,97,110,110,111,116,32,99,114,101,97,116,101,32,97,32,110,101,119,32,111,110,101,33,0,49,0,0,0,0,0,0,0,115,118,95,112,97,100,80,97,99,107,101,116,115,0,0,0,110,101,119,108,105,110,101,32,105,110,115,105,100,101,32,115,116,114,105,110,103,32,37,115,0,0,0,0,0,0,0,0,109,105,115,112,108,97,99,101,100,32,109,105,110,117,115,32,115,105,103,110,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,0,0,0,0,0,99,111,117,108,100,110,39,116,32,108,111,97,100,32,105,116,101,109,32,99,111,110,102,105,103,10,0,0,0,0,0,0,116,104,101,32,107,101,121,32,37,115,32,119,105,116,104,32,112,114,101,102,105,120,32,33,32,105,115,32,105,110,115,105,100,101,32,116,104,101,32,107,101,121,32,37,115,0,0,0,99,97,108,99,117,108,97,116,105,110,103,32,114,101,97,99,104,97,98,105,108,105,116,121,46,46,46,10,0,0,0,0,52,53,48,0,0,0,0,0,109,97,112,115,47,37,115,46,98,115,112,0,0,0,0,0,110,101,116,95,115,111,99,107,115,83,101,114,118,101,114,0,102,114,97,109,101,0,0,0,36,109,111,100,108,105,115,116,0,0,0,0,0,0,0,0,99,108,105,101,110,116,32,116,101,120,116,32,105,103,110,111,114,101,100,32,102,111,114,32,37,115,58,32,37,115,10,0,99,118,97,114,108,105,115,116,0,0,0,0,0,0,0,0,37,56,105,32,117,110,117,115,101,100,32,104,105,103,104,119,97,116,101,114,10,0,0,0,115,118,95,112,97,117,115,101,100,0,0,0,0,0,0,0,115,118,95,115,104,111,119,108,111,115,115,0,0,0,0,0,109,105,115,115,105,110,103,32,116,114,97,105,108,105,110,103,32,113,117,111,116,101,0,0,100,101,102,105,110,101,100,32,119,105,116,104,111,117,116,32,41,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,105,116,101,109,115,46,99,0,111,110,101,32,111,102,32,116,104,101,32,109,97,116,99,104,32,116,101,109,112,108,97,116,101,115,32,100,111,101,115,32,110,111,116,32,108,101,97,118,101,32,115,112,97,99,101,32,102,111,114,32,116,104,101,32,107,101,121,32,37,115,32,119,105,116,104,32,116,104,101,32,38,32,112,114,101,102,105,120,0,0,0,0,0,0,0,0,37,100,32,119,101,97,112,111,110,32,106,117,109,112,32,97,114,101,97,115,10,0,0,0,114,115,95,109,97,120,106,117,109,112,102,97,108,108,104,101,105,103,104,116,0,0,0,0,98,115,112,0,0,0,0,0,48,0,0,0,0,0,0,0,99,111,110,115,116,97,110,116,76,105,103,104,116,0,0,0,117,115,101,114,105,110,102,111,32,115,116,114,105,110,103,32,108,101,110,103,116,104,32,101,120,99,101,101,100,101,100,0,114,101,99,117,114,115,105,118,101,32,101,114,114,111,114,32,97,102,116,101,114,58,32,37,115,0,0,0,0,0,0,0,117,110,115,101,116,0,0,0,37,56,105,32,116,111,116,97,108,32,104,117,110,107,32,105,110,32,117,115,101,10,0,0,116,105,109,101,100,32,111,117,116,0,0,0,0,0,0,0,101,120,101,99,113,0,0,0,51,0,0,0,0,0,0,0,115,116,114,105,110,103,32,108,111,110,103,101,114,32,116,104,97,110,32,77,65,88,95,84,79,75,69,78,32,61,32,37,100,0,0,0,0,0,0,0,111,117,116,32,111,102,32,118,97,108,117,101,32,115,112,97,99,101,0,0,0,0,0,0,115,112,105,110,100,111,119,110,0,0,0,0,0,0,0,0,105,116,101,109,99,111,110,102,105,103,0,0,0,0,0,0,37,115,32,105,110,32,115,111,108,105,100,32,97,116,32,40,37,49,46,49,102,32,37,49,46,49,102,32,37,49,46,49,102,41,10,0,0,0,0,0,48,0,0,0,0,0,0,0,109,97,112,115,0,0,0,0,110,101,116,95,115,111,99,107,115,69,110,97,98,108,101,100,0,0,0,0,0,0,0,0,97,110,103,108,101,115,50,91,50,93,0,0,0,0,0,0,77,65,88,95,80,65,84,67,72,95,80,76,65,78,69,83,0,0,0,0,0,0,0,0,115,110,97,112,115,0,0,0,114,101,115,101,116,0,0,0,37,56,105,32,104,105,103,104,32,116,101,109,112,72,105,103,104,119,97,116,101,114,10,0,67,77,95,71,101,110,101,114,97,116,101,80,97,116,99,104,70,97,99,101,116,115,58,32,101,118,101,110,32,115,105,122,101,115,32,97,114,101,32,105,110,118,97,108,105,100,32,102,111,114,32,113,117,97,100,114,97,116,105,99,32,109,101,115,104,101,115,0,0,0,0,0,71,111,105,110,103,32,102,114,111,109,32,67,83,95,90,79,77,66,73,69,32,116,111,32,67,83,95,70,82,69,69,32,102,111,114,32,99,108,105,101,110,116,32,37,100,10,0,0,99,104,97,108,108,101,110,103,101,82,101,115,112,111,110,115,101,32,37,100,32,37,100,32,37,100,0,0,0,0,0,0,115,118,95,114,101,99,111,110,110,101,99,116,108,105,109,105,116,0,0,0,0,0,0,0,117,110,107,110,111,119,110,32,101,115,99,97,112,101,32,99,104,97,114,0,0,0,0,0,100,101,102,105,110,101,100,32,119,105,116,104,111,117,116,32,110,97,109,101,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,0,0,0,0,0,77,79,68,95,76,111,97,100,66,109,111,100,101,108,58,32,102,117,110,110,121,32,108,117,109,112,32,115,105,122,101,0,115,112,105,110,117,112,0,0,48,0,0,0,0,0,0,0,105,116,101,109,95,105,110,118,117,108,110,101,114,97,98,105,108,105,116,121,0,0,0,0,114,115,95,109,97,120,102,97,108,108,104,101,105,103,104,116,0,0,0,0,0,0,0,0,99,111,110,115,111,108,101,58,32,0,0,0,0,0,0,0,97,110,103,108,101,115,50,91,48,93,0,0,0,0,0,0,70,83,95,70,114,101,101,70,105,108,101,40,32,78,85,76,76,32,41,0,0,0,0,0,49,48,48,0,0,0,0,0,115,101,116,97,0,0,0,0,83,86,95,81,115,111,114,116,69,110,116,105,116,121,83,116,97,116,101,115,58,32,100,117,112,108,105,99,97,116,101,100,32,101,110,116,105,116,121,0,37,56,105,32,104,105,103,104,32,116,101,109,112,10,0,0,115,118,95,109,105,110,82,97,116,101,0,0,0,0,0,0,115,118,95,109,97,115,116,101,114,37,100,0,0,0,0,0,116,111,111,32,108,97,114,103,101,32,118,97,108,117,101,32,105,110,32,101,115,99,97,112,101,32,99,104,97,114,97,99,116,101,114,0,0,0,0,0,117,110,100,101,102,105,110,101,100,32,110,97,109,101,32,37,115,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,114,101,108,111,97,100,0,0,103,95,103,97,109,101,116,121,112,101,0,0,0,0,0,0,105,116,101,109,95,114,101,103,101,110,0,0,0,0,0,0,114,115,95,102,97,108,108,100,97,109,97,103,101,49,48,0,99,104,97,116,32,34,37,115,34,0,0,0,0,0,0,0,110,101,116,95,109,99,97,115,116,54,105,102,97,99,101,0,97,110,103,108,101,115,91,50,93,0,0,0,0,0,0,0,87,114,105,116,105,110,103,32,37,115,32,116,111,32,106,111,117,114,110,97,108,32,102,105,108,101,46,10,0,0,0,0,104,97,110,100,105,99,97,112,0,0,0,0,0,0,0,0,115,101,116,117,0,0,0,0,37,56,105,32,104,105,103,104,32,112,101,114,109,97,110,101,110,116,10,0,0,0,0,0,49,48,48,48,0,0,0,0,109,97,115,116,101,114,46,113,117,97,107,101,106,115,46,99,111,109,0,0,0,0,0,0,102,105,108,101,32,37,115,44,32,108,105,110,101,32,37,100,58,32,37,115,10,0,0,0,110,101,116,95,101,110,97,98,108,101,100,0,0,0,0,0,100,101,102,105,110,101,100,0,97,99,116,105,118,97,116,101,0,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,103,111,97,108,32,115,116,97,116,101,32,104,97,110,100,108,101,32,37,100,10,0,0,0,105,116,0,0,0,0,0,0,105,116,101,109,95,113,117,97,100,0,0,0,0,0,0,0,114,115,95,102,97,108,108,100,97,109,97,103,101,53,0,0,99,111,110,115,111,108,101,95,116,101,108,108,58,32,0,0,102,102,48,52,58,58,54,57,54,102,58,55,49,55,53,58,54,49,54,98,58,54,53,51,51,0,0,0,0,0,0,0,116,105,109,101,50,0,0,0,87,114,105,116,105,110,103,32,108,101,110,32,102,111,114,32,37,115,32,116,111,32,106,111,117,114,110,97,108,32,102,105,108,101,46,10,0,0,0,0,114,97,116,101,0,0,0,0,115,101,116,115,0,0,0,0,105,110,118,97,108,105,100,32,115,116,111,114,101,100,32,98,108,111,99,107,32,108,101,110,103,116,104,115,0,0,0,0,97,114,99,104,0,0,0,0,37,56,105,32,104,105,103,104,32,109,97,114,107,10,0,0,102,108,111,97,116,32,111,117,116,32,111,102,32,114,97,110,103,101,32,91,37,102,44,32,37,102,93,0,0,0,0,0,124,124,0,0,0,0,0,0,100,101,102,105,110,101,32,119,105,116,104,32,109,111,114,101,32,116,104,97,110,32,37,100,32,112,97,114,97,109,101,116,101,114,115,0,0,0,0,0,99,97,110,39,116,32,111,112,101,110,32,116,104,101,32,108,111,103,32,102,105,108,101,32,37,115,10,0,0,0,0,0,115,118,95,77,97,120,82,97,116,101,0,0,0,0,0,0,103,97,109,101,100,105,114,0,40,0,0,0,0,0,0,0,115,118,95,109,97,115,116,101,114,49,0,0,0,0,0,0,115,121,110,116,97,120,32,101,114,114,111,114,32,105,110,32,35,105,102,47,35,101,108,105,102,0,0,0,0,0,0,0,109,97,120,95,119,101,97,112,111,110,105,110,102,111,32,61,32,37,100,10,0,0,0,0,97,109,109,111,105,110,100,101,120,0,0,0,0,0,0,0,99,111,117,108,100,110,39,116,32,108,111,97,100,32,119,101,105,103,104,116,115,10,0,0,109,97,108,101,0,0,0,0,110,97,109,101,0,0,0,0,101,110,116,105,116,121,32,37,115,32,109,111,100,101,108,32,110,117,109,98,101,114,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,119,101,97,112,111,110,95,98,102,103,0,0,0,0,0,0,114,115,95,115,116,97,114,116,101,108,101,118,97,116,111,114,0,0,0,0,0,0,0,0,85,115,97,103,101,58,32,116,101,108,108,32,60,99,108,105,101,110,116,32,110,117,109,98,101,114,62,32,60,116,101,120,116,62,10,0,0,0,0,0,110,101,116,95,109,99,97,115,116,54,97,100,100,114,0,0,114,101,115,112,97,119,110,116,105,109,101,0,0,0,0,0,97,112,111,115,46,116,114,68,101,108,116,97,91,50,93,0,87,114,105,116,105,110,103,32,122,101,114,111,32,102,111,114,32,37,115,32,116,111,32,106,111,117,114,110,97,108,32,102,105,108,101,46,10,0,0,0,110,97,109,101,0,0,0,0,32,37,52,100,32,37,100,10,0,0,0,0,0,0,0,0,83,86,95,71,101,116,85,115,101,114,99,109,100,58,32,98,97,100,32,99,108,105,101,110,116,78,117,109,58,37,105,0,115,101,116,0,0,0,0,0,116,114,105,103,103,101,114,95,112,117,115,104,32,119,105,116,104,111,117,116,32,116,97,114,103,101,116,32,101,110,116,105,116,121,32,37,115,10,0,0,67,77,111,100,95,76,111,97], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+20480);
/* memory initializer */ allocate([100,83,104,97,100,101,114,115,58,32,102,117,110,110,121,32,108,117,109,112,32,115,105,122,101,0,0,0,0,0,0,0,56,48,48,0,0,0,0,0,37,115,32,119,114,105,116,116,101,110,32,115,117,99,99,101,115,115,102,117,108,108,121,10,0,0,0,0,0,0,0,0,37,56,105,32,108,111,119,32,116,101,109,112,72,105,103,104,119,97,116,101,114,10,0,0,97,97,115,32,102,105,108,101,32,37,115,32,105,115,32,118,101,114,115,105,111,110,32,37,105,44,32,110,111,116,32,37,105,10,0,0,0,0,0,0,65,65,83,95,69,110,116,105,116,121,84,121,112,101,58,32,101,110,116,110,117,109,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,65,65,83,95,77,65,88,95,67,76,85,83,84,69,82,83,10,0,0,0,0,0,0,0,116,111,111,32,109,97,110,121,32,101,110,116,105,116,105,101,115,32,105,110,32,66,83,80,32,102,105,108,101,10,0,0,86,77,32,112,114,111,103,114,97,109,32,99,111,117,110,116,101,114,32,111,117,116,32,111,102,32,114,97,110,103,101,32,105,110,32,79,80,95,76,69,65,86,69,0,0,0,0,0,118,109,105,110,102,111,0,0,109,97,112,95,114,101,115,116,97,114,116,32,48,10,0,0,78,69,84,95,71,101,116,80,97,99,107,101,116,58,32,37,115,10,0,0,0,0,0,0,37,115,32,115,101,110,100,32,37,52,105,32,58,32,115,61,37,105,32,102,114,97,103,109,101,110,116,61,37,105,44,37,105,10,0,0,0,0,0,0,115,118,95,100,108,85,82,76,0,0,0,0,0,0,0,0,36,0,0,0,0,0,0,0,109,105,115,112,108,97,99,101,100,32,35,101,110,100,105,102,0,0,0,0,0,0,0,0,97,109,109,111,97,109,111,117,110,116,0,0,0,0,0,0,103,111,97,108,32,104,101,97,112,32,111,118,101,114,102,108,111,119,10,0,0,0,0,0,102,101,109,97,108,101,0,0,119,101,97,112,111,110,95,114,97,105,108,103,117,110,0,0,114,115,95,102,117,110,99,98,111,98,0,0,0,0,0,0,77,83,71,95,87,114,105,116,101,83,116,114,105,110,103,58,32,77,65,88,95,83,84,82,73,78,71,95,67,72,65,82,83,0,0,0,0,0,0,0,69,120,99,101,112,116,32,35,37,100,58,32,37,115,47,37,100,10,0,0,0,0,0,0,37,105,0,0,0,0,0,0,97,112,111,115,46,116,114,68,101,108,116,97,91,49,93,0,82,101,97,100,32,102,114,111,109,32,106,111,117,114,110,97,108,68,97,116,97,70,105,108,101,32,102,97,105,108,101,100,0,0,0,0,0,0,0,0,99,108,105,101,110,116,107,105,99,107,0,0,0,0,0,0,99,108,105,101,110,116,68,111,119,110,108,111,97,100,58,32,37,100,32,58,32,119,114,105,116,105,110,103,32,98,108,111,99,107,32,37,100,10,0,0,116,111,103,103,108,101,0,0,37,56,105,32,108,111,119,32,116,101,109,112,10,0,0,0,82,101,115,116,97,114,116,105,110,103,32,115,101,114,118,101,114,32,100,117,101,32,116,111,32,110,117,109,83,110,97,112,115,104,111,116,69,110,116,105,116,105,101,115,32,119,114,97,112,112,105,110,103,0,0,0,115,118,95,97,108,108,111,119,68,111,119,110,108,111,97,100,0,0,0,0,0,0,0,0,35,0,0,0,0,0,0,0,35,101,108,115,101,32,97,102,116,101,114,32,35,101,108,115,101,0,0,0,0,0,0,0,101,120,116,114,97,122,118,101,108,111,99,105,116,121,0,0,37,100,58,32,37,115,0,0,110,97,109,101,0,0,0,0,119,101,97,112,111,110,95,112,108,97,115,109,97,103,117,110,0,0,0,0,0,0,0,0,114,115,95,97,105,114,99,111,110,116,114,111,108,108,101,100,106,117,109,112,112,97,100,0,66,97,110,32,35,37,100,58,32,37,115,47,37,100,10,0,58,58,0,0,0,0,0,0,97,112,111,115,46,116,114,68,101,108,116,97,91,48,93,0,76,111,97,100,105,110,103,32,37,115,32,102,114,111,109,32,106,111,117,114,110,97,108,32,102,105,108,101,46,10,0,0,99,108,105,101,110,116,68,111,119,110,108,111,97,100,58,32,37,100,32,58,32,98,101,103,105,110,110,105,110,103,32,34,37,115,34,10,0,0,0,0,49,0,0,0,0,0,0,0,112,114,105,110,116,0,0,0,37,115,37,115,0,0,0,0,37,56,105,32,108,111,119,32,112,101,114,109,97,110,101,110,116,10,0,0,0,0,0,0,115,101,99,116,111,114,32,37,105,58,32,37,105,32,101,110,116,105,116,105,101,115,10,0,109,97,112,32,37,115,10,0,92,0,0,0,0,0,0,0,50,0,0,0,0,0,0,0,109,105,115,112,108,97,99,101,100,32,35,101,108,115,101,0,97,110,103,108,101,111,102,102,115,101,116,0,0,0,0,0,97,118,111,105,100,32,103,111,97,108,32,37,115,44,32,110,117,109,98,101,114,32,37,100,32,102,111,114,32,37,102,32,115,101,99,111,110,100,115,0,33,0,0,0,0,0,0,0,119,101,97,112,111,110,95,108,105,103,104,116,110,105,110,103,0,0,0,0,0,0,0,0,50,53,48,0,0,0,0,0,67,108,105,101,110,116,32,37,105,32,105,115,32,110,111,116,32,97,99,116,105,118,101,10,0,0,0,0,0,0,0,0,110,101,116,95,105,112,54,0,97,112,111,115,46,116,114,66,97,115,101,91,50,93,0,0,70,83,95,82,101,97,100,70,105,108,101,32,119,105,116,104,32,101,109,112,116,121,32,110,97,109,101,0,0,0,0,0,70,105,108,101,32,34,37,115,34,32,110,111,116,32,102,111,117,110,100,32,111,110,32,115,101,114,118,101,114,32,102,111,114,32,97,117,116,111,100,111,119,110,108,111,97,100,105,110,103,46,10,0,0,0,0,0,99,108,105,101,110,116,68,111,119,110,108,111,97,100,58,32,37,100,32,58,32,34,37,115,34,32,102,105,108,101,32,110,111,116,32,102,111,117,110,100,32,111,110,32,115,101,114,118,101,114,10,0,0,0,0,0,49,0,0,0,0,0,0,0,37,56,105,32,108,111,119,32,109,97,114,107,10,0,0,0,87,97,114,110,105,110,103,58,32,99,118,97,114,32,34,37,115,34,32,103,105,118,101,110,32,105,110,105,116,105,97,108,32,118,97,108,117,101,115,58,32,34,37,115,34,32,97,110,100,32,34,37,115,34,10,0,82,101,115,116,97,114,116,105,110,103,32,115,101,114,118,101,114,32,100,117,101,32,116,111,32,116,105,109,101,32,119,114,97,112,112,105,110,103,0,0,93,0,0,0,0,0,0,0,115,118,95,122,111,109,98,105,101,116,105,109,101,0,0,0,101,120,112,101,99,116,101,100,32,110,97,109,101,32,97,102,116,101,114,32,35,105,102,100,101,102,44,32,102,111,117,110,100,32,37,115,0,0,0,0,111,102,102,115,101,116,0,0,38,0,0,0,0,0,0,0,119,101,97,112,111,110,95,114,111,99,107,101,116,108,97,117,110,99,104,101,114,0,0,0,114,115,95,106,117,109,112,112,97,100,0,0,0,0,0,0,66,97,100,32,99,108,105,101,110,116,32,115,108,111,116,58,32,37,105,10,0,0,0,0,48,46,48,46,48,46,48,0,97,112,111,115,46,116,114,68,117,114,97,116,105,111,110,0,66,97,100,32,111,114,105,103,105,110,32,105,110,32,70,83,95,83,101,101,107,0,0,0,103,95,103,97,109,101,116,121,112,101,0,0,0,0,0,0,67,111,117,108,100,32,110,111,116,32,100,111,119,110,108,111,97,100,32,34,37,115,34,32,98,101,99,97,117,115,101,32,97,117,116,111,100,111,119,110,108,111,97,100,105,110,103,32,105,115,32,100,105,115,97,98,108,101,100,32,111,110,32,116,104,101,32,115,101,114,118,101,114,46,10,10,84,104,101,32,115,101,114,118,101,114,32,121,111,117,32,97,114,101,32,99,111,110,110,101,99,116,105,110,103,32,116,111,32,105,115,32,110,111,116,32,97,32,112,117,114,101,32,115,101,114,118,101,114,44,32,115,101,116,32,97,117,116,111,100,111,119,110,108,111,97,100,32,116,111,32,78,111,32,105,110,32,121,111,117,114,32,115,101,116,116,105,110,103,115,32,97,110,100,32,121,111,117,32,109,105,103,104,116,32,98,101,32,97,98,108,101,32,116,111,32,106,111,105,110,32,116,104,101,32,103,97,109,101,32,97,110,121,119,97,121,46,10,0,0,0,0,0,0,115,118,95,99,104,101,97,116,115,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,109,115,103,32,111,118,101,114,102,108,111,119,101,100,32,102,111,114,32,37,115,10,0,37,56,105,32,98,121,116,101,115,32,116,111,116,97,108,32,122,111,110,101,10,0,0,0,37,102,0,0,0,0,0,0,91,0,0,0,0,0,0,0,50,48,48,0,0,0,0,0,35,105,102,100,101,102,32,119,105,116,104,111,117,116,32,110,97,109,101,0,0,0,0,0,114,101,99,111,105,108,0,0,102,111,117,110,100,32,37,100,32,108,101,118,101,108,32,105,116,101,109,115,10,0,0,0,119,101,97,112,111,110,95,103,114,101,110,97,100,101,108,97,117,110,99,104,101,114,0,0,114,115,95,98,102,103,106,117,109,112,0,0,0,0,0,0,66,97,100,32,115,108,111,116,32,110,117,109,98,101,114,58,32,37,115,10,0,0,0,0,110,101,116,95,105,112,0,0,97,112,111,115,46,116,114,84,105,109,101,0,0,0,0,0,70,83,95,87,114,105,116,101,58,32,45,49,32,98,121,116,101,115,32,119,114,105,116,116,101,110,10,0,0,0,0,0,117,110,107,110,111,119,110,32,112,114,105,110,116,32,116,121,112,101,10,0,0,0,0,0,67,111,117,108,100,32,110,111,116,32,100,111,119,110,108,111,97,100,32,34,37,115,34,32,98,101,99,97,117,115,101,32,97,117,116,111,100,111,119,110,108,111,97,100,105,110,103,32,105,115,32,100,105,115,97,98,108,101,100,32,111,110,32,116,104,101,32,115,101,114,118,101,114,46,10,10,89,111,117,32,119,105,108,108,32,110,101,101,100,32,116,111,32,103,101,116,32,116,104,105,115,32,102,105,108,101,32,101,108,115,101,119,104,101,114,101,32,98,101,102,111,114,101,32,121,111,117,32,99,97,110,32,99,111,110,110,101,99,116,32,116,111,32,116,104,105,115,32,112,117,114,101,32,115,101,114,118,101,114,46,10,0,0,0,0,0,0,0,37,115,0,0,0,0,0,0,67,118,97,114,95,85,112,100,97,116,101,58,32,115,114,99,32,37,115,32,108,101,110,103,116,104,32,37,117,32,101,120,99,101,101,100,115,32,77,65,88,95,67,86,65,82,95,86,65,76,85,69,95,83,84,82,73,78,71,0,0,0,0,0,37,56,105,32,98,121,116,101,115,32,116,111,116,97,108,32,104,117,110,107,10,0,0,0,35,52,54,50,32,78,101,116,99,104,97,110,95,84,114,97,110,115,109,105,116,78,101,120,116,70,114,97,103,109,101,110,116,58,32,112,111,112,112,105,110,103,32,97,32,113,117,101,117,101,100,32,109,101,115,115,97,103,101,32,102,111,114,32,116,114,97,110,115,109,105,116,10,0,0,0,0,0,0,0,116,105,109,101,115,99,97,108,101,0,0,0,0,0,0,0,67,98,117,102,95,69,120,101,99,117,116,101,84,101,120,116,58,32,98,97,100,32,101,120,101,99,95,119,104,101,110,0,125,0,0,0,0,0,0,0,115,118,95,116,105,109,101,111,117,116,0,0,0,0,0,0,42,101,120,116,101,114,110,0,97,99,99,101,108,101,114,97,116,105,111,110,0,0,0,0,37,115,32,110,111,116,32,114,101,97,99,104,97,98,108,101,32,102,111,114,32,98,111,116,115,32,97,116,32,40,37,49,46,49,102,32,37,49,46,49,102,32,37,49,46,49,102,41,10,0,0,0,0,0,0,0,66,111,116,67,104,101,99,107,67,104,97,116,77,101,115,115,97,103,101,73,110,116,101,103,114,101,116,121,58,32,109,101,115,115,97,103,101,32,34,37,115,34,32,105,110,118,97,108,105,100,32,101,115,99,97,112,101,32,99,104,97,114,10,0,105,116,101,109,95,104,101,97,108,116,104,95,109,101,103,97,0,0,0,0,0,0,0,0,114,115,95,114,111,99,107,101,116,106,117,109,112,0,0,0,79,80,95,66,76,79,67,75,95,67,79,80,89,32,111,117,116,32,111,102,32,114,97,110,103,101,33,0,0,0,0,0,78,111,32,112,108,97,121,101,114,32,115,112,101,99,105,102,105,101,100,46,10,0,0,0,49,0,0,0,0,0,0,0,116,105,109,101,0,0,0,0,70,83,95,87,114,105,116,101,58,32,48,32,98,121,116,101,115,32,119,114,105,116,116,101,110,10,0,0,0,0,0,0,94,49,69,120,105,116,58,32,37,115,0,0,0,0,0,0,99,108,105,101,110,116,68,111,119,110,108,111,97,100,58,32,37,100,32,58,32,34,37,115,34,32,100,111,119,110,108,111,97,100,32,100,105,115,97,98,108,101,100,10,0,0,0,0,67,118,97,114,95,85,112,100,97,116,101,58,32,104,97,110,100,108,101,32,111,117,116,32,111,102,32,114,97,110,103,101,0,0,0,0,0,0,0,0,67,108,105,112,87,105,110,100,105,110,103,58,32,77,65,88,95,80,79,73,78,84,83,95,79,78,95,87,73,78,68,73,78,71,0,0,0,0,0,0,69,82,82,79,82,58,32,116,119,111,32,99,111,110,115,101,99,117,116,105,118,101,32,102,114,101,101,32,98,108,111,99,107,115,10,0,0,0,0,0,67,77,95,71,101,110,101,114,97,116,101,80,97,116,99,104,70,97,99,101,116,115,58,32,98,97,100,32,112,97,114,97,109,101,116,101,114,115,58,32,40,37,105,44,32,37,105,44,32,37,112,41,0,0,0,0,49,48,0,0,0,0,0,0,123,0,0,0,0,0,0,0,115,118,95,102,112,115,0,0,100,101,102,105,110,101,32,119,105,116,104,32,109,105,115,112,108,97,99,101,100,32,35,35,0,0,0,0,0,0,0,0,115,112,101,101,100,0,0,0,77,65,88,95,83,85,66,77,79,68,69,76,83,32,101,120,99,101,101,100,101,100,0,0,37,115,32,105,110,32,115,111,108,105,100,32,97,116,32,40,37,49,46,49,102,32,37,49,46,49,102,32,37,49,46,49,102,41,10,0,0,0,0,0,37,115,32,61,32,123,34,37,115,34,125,32,47,47,77,73,83,83,73,78,71,32,82,65,78,68,79,77,13,10,0,0,112,114,105,110,116,10,71,97,109,101,32,109,105,115,109,97,116,99,104,58,32,84,104,105,115,32,105,115,32,97,32,37,115,32,115,101,114,118,101,114,10,0,0,0,0,0,0,0,105,116,101,109,95,97,114,109,111,114,95,99,111,109,98,97,116,0,0,0,0,0,0,0,114,115,95,115,116,97,114,116,106,117,109,112,0,0,0,0,98,97,110,32,101,120,99,101,112,116,105,111,110,0,0,0,110,101,116,95,101,110,97,98,108,101,100,0,0,0,0,0,97,110,103,108,101,115,91,48,93,0,0,0,0,0,0,0,70,83,95,82,101,97,100,58,32,45,49,32,98,121,116,101,115,32,114,101,97,100,0,0,94,49,70,97,116,97,108,58,32,37,115,0,0,0,0,0,67,97,110,110,111,116,32,97,117,116,111,100,111,119,110,108,111,97,100,32,105,100,32,112,107,51,32,102,105,108,101,32,34,37,115,34,0,0,0,0,94,51,87,65,82,78,73,78,71,58,32,85,110,115,101,116,116,105,110,103,32,67,86,65,82,95,82,79,77,32,99,118,97,114,32,39,37,115,39,44,32,115,105,110,99,101,32,105,116,32,105,115,32,97,108,115,111,32,67,86,65,82,95,65,82,67,72,73,86,69,10,0,115,118,115,46,110,101,120,116,83,110,97,112,115,104,111,116,69,110,116,105,116,105,101,115,32,119,114,97,112,112,101,100,0,0,0,0,0,0,0,0,69,82,82,79,82,58,32,110,101,120,116,32,98,108,111,99,107,32,100,111,101,115,110,39,116,32,104,97,118,101,32,112,114,111,112,101,114,32,98,97,99,107,32,108,105,110,107,10,0,0,0,0,0,0,0,0,115,118,95,102,112,115,0,0,41,0,0,0,0,0,0,0,115,118,95,112,114,105,118,97,116,101,80,97,115,115,119,111,114,100,0,0,0,0,0,0,35,35,0,0,0,0,0,0,118,115,112,114,101,97,100,0,105,116,101,109,95,98,111,116,114,111,97,109,0,0,0,0,105,116,101,109,95,97,114,109,111,114,95,98,111,100,121,0,55,48,0,0,0,0,0,0,65,100,100,101,100,32,37,115,58,32,37,115,47,37,100,10,0,0,0,0,0,0,0,0,87,97,114,110,105,110,103,58,32,115,101,108,101,99,116,40,41,32,115,121,115,99,97,108,108,32,102,97,105,108,101,100,58,32,37,115,10,0,0,0,109,111,100,101,108,105,110,100,101,120,50,0,0,0,0,0,118,109,47,37,115,46,113,118,109,0,0,0,0,0,0,0,94,49,69,114,114,111,114,58,32,37,115,0,0,0,0,0,99,108,105,101,110,116,68,111,119,110,108,111,97,100,58,32,37,100,32,58,32,34,37,115,34,32,99,97,110,110,111,116,32,100,111,119,110,108,111,97,100,32,105,100,32,112,107,51,32,102,105,108,101,115,10,0,69,114,114,111,114,58,32,37,115,58,32,86,97,114,105,97,98,108,101,32,37,115,32,105,115,32,110,111,116,32,117,115,101,114,32,99,114,101,97,116,101,100,46,10,0,0,0,0,69,82,82,79,82,58,32,98,108,111,99,107,32,115,105,122,101,32,100,111,101,115,32,110,111,116,32,116,111,117,99,104,32,116,104,101,32,110,101,120,116,32,98,108,111,99,107,10,0,0,0,0,0,0,0,0,48,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,114,99,111,110,80,97,115,115,119,111,114,100,0,0,0,0,114,101,99,117,114,115,105,118,101,32,100,101,102,105,110,101,32,40,114,101,109,111,118,101,100,32,114,101,99,117,114,115,105,111,110,41,0,0,0,0,104,115,112,114,101,97,100,0,110,111,116,98,111,116,0,0,98,114,111,97,100,99,97,115,116,58,32,37,115,10,0,0,66,111,116,77,97,116,99,104,86,97,114,105,97,98,108,101,58,32,118,97,114,105,97,98,108,101,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,0,0,0,0,97,114,101,97,32,37,100,32,99,101,110,116,101,114,32,37,102,32,37,102,32,37,102,32,105,110,32,115,111,108,105,100,63,13,10,0,0,0,0,0,114,115,95,115,116,97,114,116,119,97,108,107,111,102,102,108,101,100,103,101,0,0,0,0,69,114,114,111,114,58,32,37,115,32,37,115,47,37,100,32,115,117,112,101,114,115,101,100,101,115,32,97,108,114,101,97,100,121,32,101,120,105,115,116,105,110,103,32,37,115,32,37,115,47,37,100,10,0,0,0,110,101,116,95,114,101,115,116,97,114,116,0,0,0,0,0,111,114,105,103,105,110,50,91,49,93,0,0,0,0,0,0,37,115,46,106,115,0,0,0,94,51,87,97,114,110,105,110,103,58,32,37,115,0,0,0,85,115,97,103,101,58,32,37,115,32,60,118,97,114,110,97,109,101,62,10,0,0,0,0,70,105,108,101,32,34,37,115,34,32,105,115,32,110,111,116,32,114,101,102,101,114,101,110,99,101,100,32,97,110,100,32,99,97,110,110,111,116,32,98,101,32,100,111,119,110,108,111,97,100,101,100,46,0,0,0,105,110,118,97,108,105,100,32,98,108,111,99,107,32,116,121,112,101,0,0,0,0,0,0,105,110,95,114,101,115,116,97,114,116,0,0,0,0,0,0,98,108,111,99,107,58,37,112,32,32,32,32,115,105,122,101,58,37,55,105,32,32,32,32,116,97,103,58,37,51,105,10,0,0,0,0,0,0,0,0,117,110,101,120,112,101,99,116,101,100,32,102,108,111,97,116,0,0,0,0,0,0,0,0,38,38,0,0,0,0,0,0,100,101,102,105,110,101,32,37,115,32,109,105,115,115,105,110,103,32,112,97,114,109,115,0,119,98,0,0,0,0,0,0,115,118,95,107,105,108,108,115,101,114,118,101,114,0,0,0,104,111,109,101,100,105,114,0,98,97,108,97,110,99,101,0,63,0,0,0,0,0,0,0,115,118,95,114,101,102,101,114,101,110,99,101,100,80,97,107,78,97,109,101,115,0,0,0,100,101,102,105,110,101,32,110,111,116,32,116,101,114,109,105,110,97,116,101,100,0,0,0,51,50,0,0,0,0,0,0,110,117,109,112,114,111,106,101,99,116,105,108,101,115,0,0,110,111,116,115,105,110,103,108,101,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,105,110,116,101,103,101,114,44,32,102,111,117,110,100,32,37,115,0,0,0,0,0,0,109,111,100,101,108,0,0,0,83,86,95,83,101,116,85,115,101,114,105,110,102,111,58,32,98,97,100,32,105,110,100,101,120,32,37,105,0,0,0,0,102,111,117,110,100,32,97,32,116,114,105,103,103,101,114,95,112,117,115,104,32,119,105,116,104,32,118,101,108,111,99,105,116,121,32,37,102,32,37,102,32,37,102,10,0,0,0,0,53,48,48,0,0,0,0,0,32,32,32,32,100,97,116,97,32,108,101,110,103,116,104,32,58,32,37,55,105,10,0,0,66,97,110,0,0,0,0,0,87,65,82,78,73,78,71,58,32,67,111,117,108,100,110,39,116,32,98,105,110,100,32,116,111,32,97,32,118,52,32,105,112,32,97,100,100,114,101,115,115,46,10,0,0,0,0,0,105,110,100,101,120,0,0,0,111,114,105,103,105,110,50,91,48,93,0,0,0,0,0,0,70,83,95,70,79,112,101,110,70,105,108,101,82,101,97,100,58,32,37,115,32,40,102,111,117,110,100,32,105,110,32,39,37,115,37,99,37,115,39,41,10,0,0,0,0,0,0,0,101,109,112,116,121,32,99,111,110,115,111,108,101,32,109,101,115,115,97,103,101,32,104,101,97,112,10,0,0,0,0,0,37,115,0,0,0,0,0,0,123,10,0,0,0,0,0,0,83,86,95,71,101,116,83,101,114,118,101,114,105,110,102,111,58,32,98,117,102,102,101,114,83,105,122,101,32,61,61,32,37,105,0,0,0,0,0,0,65,65,83,95,80,111,105,110,116,65,114,101,97,78,117,109,58,32,97,97,115,32,110,111,116,32,108,111,97,100,101,100,10,0,0,0,0,0,0,0,97,114,101,97,32,37,100,32,104,97,115,32,109,111,114,101,32,116,104,97,110,32,49,50,56,32,114,101,97,99,104,97,98,105,108,105,116,105,101,115,10,0,0,0,0,0,0,0,37,105,32,99,118,97,114,32,105,110,100,101,120,101,115,10,0,0,0,0,0,0,0,0,99,108,105,101,110,116,68,111,119,110,108,111,97,100,58,32,37,100,32,58,32,34,37,115,34,32,105,115,32,110,111,116,32,114,101,102,101,114,101,110,99,101,100,32,97,110,100,32,99,97,110,110,111,116,32,98,101,32,100,111,119,110,108,111,97,100,101,100,46,10,0,0,116,97,114,103,101,116,110,97,109,101,0,0,0,0,0,0,112,104,121,115,95,103,114,97,118,105,116,121,0,0,0,0,48,0,0,0,0,0,0,0,37,115,32,105,115,32,110,111,116,32,97,110,32,65,65,83,32,102,105,108,101,10,0,0,65,65,83,95,69,110,116,105,116,121,77,111,100,101,108,105,110,100,101,120,58,32,101,110,116,110,117,109,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,99,108,117,115,116,101,114,32,37,100,32,116,111,117,99,104,101,100,32,99,108,117,115,116,101,114,32,37,100,32,97,116,32,97,114,101,97,32,37,100,10,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,37,115,0,0,0,0,0,0,86,77,32,112,114,111,103,114,97,109,32,99,111,117,110,116,101,114,32,111,117,116,32,111,102,32,114,97,110,103,101,32,105,110,32,79,80,95,67,65,76,76,0,0,0,0,0,0,118,109,112,114,111,102,105,108,101,0,0,0,0,0,0,0,83,101,114,118,101,114,32,119,97,115,32,107,105,108,108,101,100,0,0,0,0,0,0,0,91,37,115,93,58,37,104,117,0,0,0,0,0,0,0,0,37,105,0,0,0,0,0,0,58,0,0,0,0,0,0,0,115,118,95,114,101,102,101,114,101,110,99,101,100,80,97,107,115,0,0,0,0,0,0,0,100,101,102,105,110,101,32,112,97,114,97,109,101,116,101,114,115,32,110,111,116,32,116,101,114,109,105,110,97,116,101,100,0,0,0,0,0,0,0,0,112,114,111,106,101,99,116,105,108,101,0,0,0,0,0,0,110,111,116,116,101,97,109,0,105,110,118,97,108,105,100,32,116,111,107,101,110,32,37,115,0,0,0,0,0,0,0,0,102,117,110,99,98,111,98,32,114,101,97,99,104,32,102,114,111,109,32,97,114,101,97,32,37,100,32,116,111,32,37,100,10,0,0,0,0,0,0,0,114,115,95,115,116,97,114,116,103,114,97,112,112,108,101,0,32,32,32,32,116,97,98,108,101,32,108,101,110,103,116,104,58,32,37,55,105,10,0,0,110,101,116,95,112,111,114,116,0,0,0,0,0,0,0,0,69,120,99,101,112,116,105,111,110,0,0,0,0,0,0,0,111,114,105,103,105,110,50,91,50,93,0,0,0,0,0,0,46,100,97,116,0,0,0,0,107,105,99,107,110,117,109,0,83,86,95,66,111,116,95,72,117,110,107,65,108,108,111,99,58,32,65,108,108,111,99,32,119,105,116,104,32,109,97,114,107,115,32,97,108,114,101,97,100,121,32,115,101,116,0,0,10,37,105,32,116,111,116,97,108,32,99,118,97,114,115,10,0,0,0,0,0,0,0,0,98,97,115,101,113,51,0,0,83,86,95,80,97,99,107,101,116,69,118,101,110,116,58,32,102,105,120,105,110,103,32,117,112,32,97,32,116,114,97,110,115,108,97,116,101,100,32,112,111,114,116,10,0,0,0,0,59,0,0,0,0,0,0,0,115,118,95,112,97,107,78,97,109,101,115,0,0,0,0,0,116,119,111,32,116,104,101,32,115,97,109,101,32,100,101,102,105,110,101,32,112,97,114,97,109,101,116,101,114,115,0,0,119,101,97,112,111,110,105,110,100,101,120,0,0,0,0,0,110,111,116,102,114,101,101,0,110,111,116,32,97,108,108,111,119,101,100,32,116,111,32,104,97,118,101,32,97,100,106,97,99,101,110,116,32,118,97,114,105,97,98,108,101,115,0,0,102,117,110,99,98,111,98,32,109,111,100,101,108,32,37,100,44,32,115,116,97,114,116,32,61,32,123,37,49,46,49,102,44,32,37,49,46,49,102,44,32,37,49,46,49,102,125,32,101,110,100,32,61,32,123,37,49,46,49,102,44,32,37,49,46,49,102,44,32,37,49,46,49,102,125,10,0,0,0,0,51,48,48,0,0,0,0,0,32,32,32,32,99,111,100,101,32,108,101,110,103,116,104,32,58,32,37,55,105,10,0,0,87,65,82,78,73,78,71,58,32,67,111,117,108,100,110,39,116,32,98,105,110,100,32,116,111,32,97,32,118,54,32,105,112,32,97,100,100,114,101,115,115,46,10,0,0,0,0,0,69,114,114,111,114,58,32,37,115,32,37,115,47,37,100,32,115,117,112,101,114,115,101,100,101,115,32,37,115,32,37,115,47,37,100,10,0,0,0,0,103,101,110,101,114,105,99,49,0,0,0,0,0,0,0,0,46,103,97,109,101,0,0,0,98,111,116,95,105,110,116,101,114,98,114,101,101,100,119,114,105,116,101,0,0,0,0,0,98,111,116,95,103,114,111,117,110,100,111,110,108,121,0,0,32,37,115,32,34,37,115,34,10,0,0,0,0,0,0,0,112,107,51,0,0,0,0,0,47,37,115,47,37,115,0,0,105,110,102,111,82,101,115,112,111,110,115,101,10,37,115,0,44,0,0,0,0,0,0,0,115,118,95,112,97,107,115,0,105,110,118,97,108,105,100,32,100,101,102,105,110,101,32,112,97,114,97,109,101,116,101,114,0,0,0,0,0,0,0,0,108,101,118,101,108,0,0,0,105,116,101,109,32,37,115,32,114,101,97,99,104,97,98,108,101,32,102,114,111,109,32,106,117,109,112,112,97,100,32,97,114,101,97,32,37,100,13,10,0,0,0,0,0,0,0,0,99,97,110,39,116,32,104,97,118,101,32,109,111,114,101,32,116,104,97,110,32,37,100,32,109,97,116,99,104,32,118,97,114,105,97,98,108,101,115,0,115,112,97,119,110,102,108,97,103,115,0,0,0,0,0,0,114,115,95,115,116,97,114,116,99,114,111,117,99,104,0,0,105,110,116,101,114,112,114,101,116,101,100,10,0,0,0,0,110,101,116,95,112,111,114,116,54,0,0,0,0,0,0,0,69,114,114,111,114,58,32,67,97,110,32,98,97,110,32,112,108,97,121,101,114,115,32,99,111,110,110,101,99,116,101,100,32,118,105,97,32,116,104,101,32,105,110,116,101,114,110,101,116,32,111,110,108,121,46,10,0,0,0,0,0,0,0,0,108,111,111,112,83,111,117,110,100,0,0,0,0,0,0,0,70,83,95,70,79,112,101,110,70,105,108,101,82,101,97,100,58,32,37,115,32,40,102,111,117,110,100,32,105,110,32,39,37,115,39,41,10,0,0,0,50,48,0,0,0,0,0,0,63,0,0,0,0,0,0,0,37,115,0,0,0,0,0,0,66,65,68,78,65,77,69,0,103,97,109,101,0,0,0,0,46,0,0,0,0,0,0,0,115,118,95,112,117,114,101,0,101,120,112,101,99,116,101,100,32,100,101,102,105,110,101,32,112,97,114,97,109,101,116,101,114,0,0,0,0,0,0,0,110,117,109,98,101,114,0,0,105,116,101,109,32,37,115,32,119,105,116,104,111,117,116,32,111,114,105,103,105,110,10,0,102,117,110,99,95,98,111,98,98,105,110,103,32,119,105,116,104,32,105,110,118,97,108,105,100,32,109,111,100,101,108,32,110,117,109,98,101,114,10,0,114,115,95,98,97,114,114,105,101,114,106,117,109,112,0,0,99,111,109,112,105,108,101,100,32,111,110,32,108,111,97,100,10,0,0,0,0,0,0,0,78,69,84,95,79,112,101,110,83,111,99,107,115,58,32,114,101,108,97,121,32,97,100,100,114,101,115,115,32,105,115,32,110,111,116,32,73,80,86,52,58,32,37,105,10,0,0,0,69,114,114,111,114,58,32,80,108,97,121,101,114,110,117,109,32,37,115,32,100,111,101,115,32,110,111,116,32,101,120,105,115,116,46,10,0,0,0,0,111,116,104,101,114,69,110,116,105,116,121,78,117,109,50,0,67,111,117,108,100,110,39,116,32,111,112,101,110,32,37,115,0,0,0,0,0,0,0,0,98,111,116,95,105,110,116,101,114,98,114,101,101,100,99,121,99,108,101,0,0,0,0,0,67,0,0,0,0,0,0,0,71,111,105,110,103,32,102,114,111,109,32,67,83,95,80,82,73,77,69,68,32,116,111,32,67,83,95,65,67,84,73,86,69,32,102,111,114,32,37,115,10,0,0,0,0,0,0,0,102,115,95,103,97,109,101,0,60,0,0,0,0,0,0,0,115,118,95,115,101,114,118,101,114,105,100,0,0,0,0,0,114,101,100,101,102,105,110,105,116,105,111,110,32,111,102,32,37,115,0,0,0,0,0,0,98,111,117,110,99,101,115,116,111,112,0,0,0,0,0,0,101,110,116,105,116,121,32,37,115,32,117,110,107,110,111,119,110,32,105,116,101,109,13,10,0,0,0,0,0,0,0,0,102,117,110,99,95,98,111,98,98,105,110,103,32,119,105,116,104,111,117,116,32,109,111,100,101,108,10,0,0,0,0,0,53,48,0,0,0,0,0,0,110,97,116,105,118,101,10,0,78,69,84,95,79,112,101,110,83,111,99,107,115,58,32,114,101,113,117,101,115,116,32,100,101,110,105,101,100,58,32,37,105,10,0,0,0,0,0,0,69,114,114,111,114,58,32,77,97,120,105,109,117,109,32,110,117,109,98,101,114,32,111,102,32,98,97,110,115,47,101,120,99,101,112,116,105,111,110,115,32,101,120,99,101,101,100,101,100,46,10,0,0,0,0,0,109,111,100,101,108,105,110,100,101,120,0,0,0,0,0,0,117,105,46,113,118,109,0,0,49,48,0,0,0,0,0,0,108,111,103,102,105,108,101,0,76,0,0,0,0,0,0,0,71,111,105,110,103,32,116,111,32,67,83,95,90,79,77,66,73,69,32,102,111,114,32,37,115,10,0,0,0,0,0,0,109,97,120,80,105,110,103,0,67,98,117,102,95,69,120,101,99,117,116,101,84,101,120,116,58,32,69,88,69,67,95,78,79,87,32,99,97,108,108,101,100,32,97,110,32,97,115,121,110,99,32,104,97,110,100,108,101,114,0,0,0,0,0,0,62,0,0,0,0,0,0,0,115,118,95,99,104,101,97,116,115,0,0,0,0,0,0,0,99,97,110,39,116,32,114,101,100,101,102,105,110,101,32,37,115,0,0,0,0,0,0,0,98,111,117,110,99,101,102,114,105,99,0,0,0,0,0,0,115,112,97,119,110,102,108,97,103,115,0,0,0,0,0,0,124,0,0,0,0,0,0,0,99,104,97,114,97,99,116,101,114,105,115,116,105,99,32,37,100,32,105,115,32,110,111,116,32,97,32,115,116,114,105,110,103,10,0,0,0,0,0,0,102,117,110,99,95,98,111,98,98,105,110,103,0,0,0,0,114,115,95,116,101,108,101,112,111,114,116,0,0,0,0,0,37,115,32,58,32,0,0,0,78,69,84,95,79,112,101,110,83,111,99,107,115,58,32,97,117,116,104,101,110,116,105,99,97,116,105,111,110,32,102,97,105,108,101,100,10,0,0,0,85,115,97,103,101,58,32,37,115,32,40,105,112,91,47,115,117,98,110,101,116,93,32,124,32,99,108,105,101,110,116,110,117,109,32,91,115,117,98,110,101,116,93,41,10,0,0,0,112,111,119,101,114,117,112,115,0,0,0,0,0,0,0,0,99,103,97,109,101,46,113,118,109,0,0,0,0,0,0,0,97,114,101,97,32,62,61,32,99,109,46,110,117,109,65,114,101,97,115,0,0,0,0,0,98,111,116,95,105,110,116,101,114,98,114,101,101,100,98,111,116,115,0,0,0,0,0,0,65,0,0,0,0,0,0,0,67,108,105,112,87,105,110,100,105,110,103,58,32,112,111,105,110,116,115,32,101,120,99,101,101,100,101,100,32,101,115,116,105,109,97,116,101,0,0,0,87,65,82,78,73,78,71,58,32,67,77,95,65,100,100,70,97,99,101,116,66,101,118,101,108,115,46,46,46,32,105,110,118,97,108,105,100,32,98,101,118,101,108,10,0,0,0,0,109,105,110,80,105,110,103,0,33,0,0,0,0,0,0,0,49,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,110,97,109,101,32,97,102,116,101,114,32,35,100,101,102,105,110,101,44,32,102,111,117,110,100,32,37,115,0,0,0,98,111,117,110,99,101,0,0,103,114,97,112,112,108,101,111,102,102,0,0,0,0,0,0,105,116,101,109,32,37,115,32,104,97,115,32,109,111,100,101,108,105,110,100,101,120,32,48,0,0,0,0,0,0,0,0,77,97,112,32,119,105,116,104,32,110,111,32,109,111,100,101,108,115,0,0,0,0,0,0,99,97,110,110,111,116,32,98,111,117,110,100,32,99,104,97,114,97,99,116,101,114,105,115,116,105,99,32,37,100,32,98,101,116,119,101,101,110,32,37,100,32,97,110,100,32,37,100,10,0,0,0,0,0,0,0,104,101,105,103,104,116,0,0,114,115,95,119,97,116,101,114,106,117,109,112,0,0,0,0,82,101,103,105,115,116,101,114,101,100,32,118,105,114,116,117,97,108,32,109,97,99,104,105,110,101,115,58,10,0,0,0,78,69,84,95,79,112,101,110,83,111,99,107,115,58,32,114,101,113,117,101,115,116,32,100,101,110,105,101,100,10,0,0,69,114,114,111,114,58,32,73,110,118,97,108,105,100,32,98,97,110,32,110,117,109,98,101,114,32,103,105,118,101,110,10,0,0,0,0,0,0,0,0,115,111,108,105,100,0,0,0,108,101,118,101,108,115,104,111,116,115,0,0,0,0,0,0,83,86,95,71,101,116,67,104,97,108,108,101,110,103,101,58,32,114,97,116,101,32,108,105,109,105,116,32,101,120,99,101,101,100,101,100,44,32,100,114,111,112,112,105,110,103,32,114,101,113,117,101,115,116,10,0,83,86,95,65,114,101,97,69,110,116,105,116,105,101,115,58,32,77,65,88,67,79,85,78,84,10,0,0,0,0,0,0,73,0,0,0,0,0,0,0,83,86,95,83,118,69,110,116,105,116,121,70,111,114,71,101,110,116,105,116,121,58,32,98,97,100,32,103,69,110,116,0,100,105,115,99,111,110,110,101,99,116,32,34,37,115,34,0,35,52,54,50,32,83,86,95,78,101,116,99,104,97,110,95,84,114,97,110,115,109,105,116,58,32,117,110,115,101,110,116,32,102,114,97,103,109,101,110,116,115,44,32,115,116,97,99,107,101,100,10,0,0,0,0,37,100,0,0,0,0,0,0,126,0,0,0,0,0,0,0,115,118,95,102,108,111,111,100,80,114,111,116,101,99,116,0,35,100,101,102,105,110,101,32,119,105,116,104,111,117,116,32,110,97,109,101,0,0,0,0,100,101,116,111,110,97,116,105,111,110,0,0,0,0,0,0,99,109,100,95,103,114,97,112,112,108,101,111,102,102,0,0,37,100,32,99,97,109,112,32,115,112,111,116,115,10,0,0,61,0,0,0,0,0,0,0,99,104,97,114,97,99,116,101,114,105,115,116,105,99,32,37,100,32,105,115,32,110,111,116,32,97,110,32,105,110,116,101,103,101,114,10,0,0,0,0,108,105,112,0,0,0,0,0,54,48,0,0,0,0,0,0,32,32,32,32,37,57,46,48,102,32,116,111,116,97,108,10,0,0,0,0,0,0,0,0,78,69,84,95,79,112,101,110,83,111,99,107,115,58,32,98,97,100,32,114,101,115,112,111,110,115,101,10,0,0,0,0,98,97,110,0,0,0,0,0,111,114,105,103,105,110,91,50,93,0,0,0,0,0,0,0,118,109,47,113,97,103,97,109,101,46,113,118,109,0,0,0,98,111,116,95,105,110,116,101,114,98,114,101,101,100,99,104,97,114,0,0,0,0,0,0,82,0,0,0,0,0,0,0,112,114,105,110,116,32,34,37,115,94,55,32,37,115,10,34,0,0,0,0,0,0,0,0,109,97,105,110,0,0,0,0,103,95,110,101,101,100,112,97,115,115,0,0,0,0,0,0,105,111,113,51,95,115,101,114,118,101,114,46,112,105,100,0,94,0,0,0,0,0,0,0,115,118,95,109,97,120,80,105,110,103,0,0,0,0,0,0,99,97,110,39,116,32,117,110,100,101,102,32,37,115,0,0,112,117,115,104,0,0,0,0,103,114,97,112,112,108,101,111,110,0,0,0,0,0,0,0,37,100,32,109,97,112,32,108,111,99,97,116,105,111,110,115,10,0,0,0,0,0,0,0,117,110,107,110,111,119,110,32,114,97,110,100,111,109,32,37,115,0,0,0,0,0,0,0,99,97,110,110,111,116,32,98,111,117,110,100,32,99,104,97,114,97,99,116,101,114,105,115,116,105,99,32,37,100,32,98,101,116,119,101,101,110,32,37,102,32,97,110,100,32,37,102,10,0,0,0,0,0,0,0,112,114,105,110,116,0,0,0,102,117,110,99,95,112,108,97,116,32,119,105,116,104,32,105,110,118,97,108,105,100,32,109,111,100,101,108,32,110,117,109,98,101,114,10,0,0,0,0,112,104,121,115,95,102,97,108,108,100,101,108,116,97,49,48,0,0,0,0,0,0,0,0,37,50,105,37,37,32,37,57,105,32,37,115,10,0,0,0,78,69,84,95,79,112,101,110,83,111,99,107,115,58,32,114,101,99,118,58,32,37,115,10,0,0,0,0,0,0,0,0,101,120,99,101,112,116,105,111,110,0,0,0,0,0,0,0,111,114,105,103,105,110,91,49,93,0,0,0,0,0,0,0,46,109,101,110,117,0,0,0,98,111,116,95,109,105,110,112,108,97,121,101,114,115,0,0,85,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,119,105,110,100,111,119,32,115,105,122,101,0,0,0,0,0,71,111,105,110,103,32,102,114,111,109,32,67,83,95,70,82,69,69,32,116,111,32,67,83,95,67,79,78,78,69,67,84,69,68,32,102,111,114,32,37,115,10,0,0,0,0,0,0,94,51,67,111,117,108,100,110,39,116,32,119,114,105,116,101,32,37,115,46,10,0,0,0,115,109,97,108,108,0,0,0,101,120,112,101,99,116,101,100,32,110,117,109,98,101,114,44,32,102,111,117,110,100,32,37,115,0,0,0,0,0,0,0,35,35,0,0,0,0,0,0,109,105,115,115,105,110,103,32,35,101,110,100,105,102,0,0,108,111,103,32,102,105,108,101,32,37,115,32,105,115,32,97,108,114,101,97,100,121,32,111,112,101,110,101,100,10,0,0,112,117,114,101,0,0,0,0,98,111,116,95,100,101,118,101,108,111,112,101,114,0,0,0,105,110,118,97,108,105,100,32,114,101,116,117,114,110,32,118,97,108,117,101,32,37,115,0,37,115,47,37,115,0,0,0,124,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,110,97,109,101,44,32,102,111,117,110,100,32,37,115,0,115,118,95,109,105,110,80,105,110,103,0,0,0,0,0,0,109,97,120,95,119,101,97,112,111,110,105,110,102,111,0,0,104,101,97,108,116,104,105,110,99,0,0,0,0,0,0,0,99,109,100,95,103,114,97,112,112,108,101,111,110,0,0,0,99,97,109,112,32,115,112,111,116,32,97,116,32,37,49,46,49,102,32,37,49,46,49,102,32,37,49,46,49,102,32,105,110,32,115,111,108,105,100,10,0,0,0,0,0,0,0,0,99,104,97,114,97,99,116,101,114,105,115,116,105,99,32,37,100,32,105,115,32,110,111,116,32,97,32,102,108,111,97,116,10,0,0,0,0,0,0,0,99,108,97,115,115,110,97,109,101,0,0,0,0,0,0,0,102,117,110,99,95,112,108,97,116,32,119,105,116,104,111,117,116,32,109,111,100,101,108,10,0,0,0,0,0,0,0,0,83,86,95,71,101,116,67,111,110,102,105,103,115,116,114,105,110,103,58,32,98,97,100,32,105,110,100,101,120,32,37,105,0,0,0,0,0,0,0,0,52,48,0,0,0,0,0,0,86,77,95,67,97,108,108,40,32,37,100,32,41,10,0,0,78,69,84,95,79,112,101,110,83,111,99,107,115,58,32,115,101,110,100,58,32,37,115,10,0,0,0,0,0,0,0,0,116,121,112,101,0,0,0,0,68,101,108,101,116,105,110,103,32,37,115,32,37,115,47,37,100,10,0,0,0,0,0,0,111,114,105,103,105,110,91,48,93,0,0,0,0,0,0,0,46,97,114,101,110,97,0,0,49,48,50,52,0,0,0,0,98,111,116,95,99,104,97,108,108,101,110,103,101,0,0,0,115,107,105,108,108,32,37,46,49,102,10,0,0,0,0,0,83,86,95,83,101,116,66,114,117,115,104,77,111,100,101,108,58,32,37,115,32,105,115,110,39,116,32,97,32,98,114,117,115,104,32,109,111,100,101,108,0,0,0,0,0,0,0,0,101,109,112,116,121,32,97,97,115,32,108,105,110,107,32,104,101,97,112,10,0,0,0,0,65,65,83,95,69,110,97,98,108,101,82,111,117,116,105,110,103,65,114,101,97,58,32,97,114,101,97,110,117,109,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,115,0,0,0,0,0,0,0,116,97,114,103,101,116,0,0,99,111,110,110,101,99,116,82,101,115,112,111,110,115,101,32,37,100,0,0,0,0,0,0,49,48,48,0,0,0,0,0,97,97,115,111,112,116,105,109,105,122,101,0,0,0,0,0,99,97,110,39,116,32,111,112,101,110,32,37,115,10,0,0,90,95,77,97,108,108,111,99,58,32,102,97,105,108,101,100,32,111,110,32,97,108,108,111,99,97,116,105,111,110,32,111,102,32,37,105,32,98,121,116,101,115,32,102,114,111,109,32,116,104,101,32,37,115,32,122,111,110,101,0,0,0,0,0,61,61,61,61,61,32,112,101,110,100,105,110,103,32,115,101], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+30720);
/* memory initializer */ allocate([114,118,101,114,32,99,111,109,109,97,110,100,115,32,61,61,61,61,61,10,0,0,0,0,65,65,83,95,70,108,111,111,100,67,108,117,115,116,101,114,65,114,101,97,115,95,114,58,32,97,114,101,97,110,117,109,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,123,0,0,0,0,0,0,0,86,77,95,80,114,101,112,97,114,101,73,110,116,101,114,112,114,101,116,101,114,58,32,74,117,109,112,32,116,111,32,105,110,118,97,108,105,100,32,105,110,115,116,114,117,99,116,105,111,110,32,110,117,109,98,101,114,0,0,0,0,0,0,0,118,109,95,117,105,0,0,0,37,115,58,37,104,117,0,0,103,97,109,101,116,121,112,101,0,0,0,0,0,0,0,0,110,101,116,95,113,112,111,114,116,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,38,0,0,0,0,0,0,0,117,110,100,101,102,32,119,105,116,104,111,117,116,32,110,97,109,101,0,0,0,0,0,0,49,48,48,0,0,0,0,0,100,97,109,97,103,101,116,121,112,101,0,0,0,0,0,0,48,0,0,0,0,0,0,0,114,97,110,100,111,109,0,0,99,104,97,114,97,99,116,101,114,105,115,116,105,99,32,37,100,32,105,115,32,110,111,116,32,105,110,105,116,105,97,108,105,122,101,100,10,0,0,0,102,117,110,99,95,112,108,97,116,0,0,0,0,0,0,0,112,104,121,115,95,102,97,108,108,100,101,108,116,97,53,0,99,97,110,39,116,32,114,101,97,100,32,37,100,32,98,105,116,115,0,0,0,0,0,0,86,77,95,67,97,108,108,32,119,105,116,104,32,78,85,76,76,32,118,109,0,0,0,0,78,69,84,95,79,112,101,110,83,111,99,107,115,58,32,99,111,110,110,101,99,116,58,32,37,115,10,0,0,0,0,0,69,114,114,111,114,58,32,73,110,118,97,108,105,100,32,97,100,100,114,101,115,115,32,37,115,10,0,0,0,0,0,0,97,112,111,115,46,116,114,84,121,112,101,0,0,0,0,0,46,98,111,116,0,0,0,0,107,105,99,107,97,108,108,0,98,111,116,95,114,111,99,107,101,116,106,117,109,112,0,0,32,0,0,0,0,0,0,0,71,97,109,101,32,114,101,106,101,99,116,101,100,32,97,32,99,111,110,110,101,99,116,105,111,110,58,32,37,115,46,10,0,0,0,0,0,0,0,0,90,95,84,97,103,77,97,108,108,111,99,58,32,116,114,105,101,100,32,116,111,32,117,115,101,32,97,32,48,32,116,97,103,0,0,0,0,0,0,0,115,118,95,109,97,120,99,108,105,101,110,116,115,0,0,0,34,0,0,0,0,0,0,0,61,0,0,0,0,0,0,0,92,0,0,0,0,0,0,0,115,118,95,100,108,82,97,116,101,0,0,0,0,0,0,0,118,105,115,100,97,109,97,103,101,0,0,0,0,0,0,0,111,102,102,104,97,110,100,103,114,97,112,112,108,101,0,0,119,97,105,116,0,0,0,0,99,104,97,114,97,99,116,101,114,105,115,116,105,99,32,37,100,32,100,111,101,115,32,110,111,116,32,101,120,105,115,116,10,0,0,0,0,0,0,0,116,114,105,103,103,101,114,95,109,117,108,116,105,112,108,101,32,110,111,116,32,105,110,32,97,110,121,32,97,114,101,97,10,0,0,0,0,0,0,0,50,55,48,0,0,0,0,0,102,111,114,99,101,102,117,108,108,121,32,117,110,108,111,97,100,105,110,103,32,37,115,32,118,109,10,0,0,0,0,0,87,65,82,78,73,78,71,58,32,78,69,84,95,79,112,101,110,83,111,99,107,115,58,32,103,101,116,104,111,115,116,98,121,110,97,109,101,58,32,97,100,100,114,101,115,115,32,116,121,112,101,32,119,97,115,32,110,111,116,32,65,70,95,73,78,69,84,10,0,0,0,0,85,115,97,103,101,58,32,37,115,32,40,105,112,91,47,115,117,98,110,101,116,93,32,124,32,110,117,109,41,10,0,0,112,111,115,46,116,114,68,117,114,97,116,105,111,110,0,0,46,99,111,110,102,105,103,0,98,111,116,95,103,114,97,112,112,108,101,0,0,0,0,0,98,111,116,95,114,101,97,99,104,97,98,105,108,105,116,121,0,0,0,0,0,0,0,0,83,0,0,0,0,0,0,0,46,112,107,51,0,0,0,0,112,114,105,110,116,10,37,115,10,0,0,0,0,0,0,0,90,95,70,114,101,101,58,32,109,101,109,111,114,121,32,98,108,111,99,107,32,119,114,111,116,101,32,112,97,115,116,32,101,110,100,0,0,0,0,0,103,95,104,117,109,97,110,112,108,97,121,101,114,115,0,0,47,98,97,115,101,0,0,0,45,0,0,0,0,0,0,0,102,105,108,101,32,37,115,32,110,111,116,32,102,111,117,110,100,0,0,0,0,0,0,0,115,118,95,109,97,120,82,97,116,101,0,0,0,0,0,0,99,97,110,110,111,116,32,105,110,116,101,114,98,114,101,101,100,32,119,101,105,103,104,116,32,99,111,110,102,105,103,115,44,32,117,110,101,113,117,97,108,32,110,117,109,119,101,105,103,104,116,115,10,0,0,0,114,97,100,105,117,115,0,0,51,0,0,0,0,0,0,0,119,101,105,103,104,116,0,0,59,0,0,0,0,0,0,0,99,111,117,108,100,110,39,116,32,108,111,97,100,32,97,110,121,32,115,107,105,108,108,32,102,114,111,109,32,37,115,10,0,0,0,0,0,0,0,0,116,101,108,101,112,111,114,116,101,100,32,105,110,116,111,32,115,108,105,109,101,32,111,114,32,108,97,118,97,32,97,116,32,100,101,115,116,32,37,115,10,0,0,0,0,0,0,0,112,104,121,115,95,106,117,109,112,118,101,108,0,0,0,0,86,77,95,70,114,101,101,40,37,115,41,32,111,110,32,114,117,110,110,105,110,103,32,118,109,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,78,69,84,95,79,112,101,110,83,111,99,107,115,58,32,103,101,116,104,111,115,116,98,121,110,97,109,101,58,32,37,115,10,0,0,0,0,0,0,37,100,32,37,115,32,37,100,10,0,0,0,0,0,0,0,97,110,103,108,101,115,91,49,93,0,0,0,0,0,0,0,46,99,102,103,0,0,0,0,98,111,116,95,114,101,112,111,114,116,0,0,0,0,0,0,115,101,116,97,32,37,115,32,34,37,115,34,10,0,0,0,82,101,106,101,99,116,101,100,32,97,32,99,111,110,110,101,99,116,105,111,110,46,10,0,90,95,70,114,101,101,58,32,102,114,101,101,100,32,97,32,102,114,101,101,100,32,112,111,105,110,116,101,114,0,0,0,116,116,121,32,99,111,110,115,111,108,101,32,109,111,100,101,32,100,105,115,97,98,108,101,100,10,0,0,0,0,0,0,105,110,118,97,108,105,100,32,99,118,97,114,32,110,97,109,101,32,115,116,114,105,110,103,58,32,37,115,10,0,0,0,99,108,105,101,110,116,115,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,32,116,111,111,32,102,97,114,32,98,97,99,107,0,0,0,82,101,99,101,105,118,101,100,32,115,105,103,110,97,108,32,37,100,0,0,0,0,0,0,43,0,0,0,0,0,0,0,35,105,110,99,108,117,100,101,32,119,105,116,104,111,117,116,32,102,105,108,101,32,110,97,109,101,32,98,101,116,119,101,101,110,32,60,32,62,0,0,115,118,95,109,105,110,82,97,116,101,0,0,0,0,0,0,99,97,110,110,111,116,32,105,110,116,101,114,98,114,101,101,100,32,119,101,105,103,104,116,32,99,111,110,102,105,103,115,44,32,117,110,101,113,117,97,108,32,110,101,120,116,10,0,100,97,109,97,103,101,0,0,101,110,116,105,116,121,116,121,112,101,109,105,115,115,105,108,101,0,0,0,0,0,0,0,114,97,110,103,101,0,0,0,117,110,107,110,111,119,110,32,109,101,115,115,97,103,101,32,99,111,109,112,111,110,101,110,116,32,37,115,0,0,0,0,108,111,97,100,101,100,32,100,101,102,97,117,108,116,32,115,107,105,108,108,32,37,102,32,102,114,111,109,32,37,115,10,0,0,0,0,0,0,0,0,97,110,103,108,101,0,0,0,51,51,0,0,0,0,0,0,37,115,32,108,111,97,100,101,100,32,105,110,32,37,100,32,98,121,116,101,115,32,111,110,32,116,104,101,32,104,117,110,107,10,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,78,69,84,95,79,112,101,110,83,111,99,107,115,58,32,115,111,99,107,101,116,58,32,37,115,10,0,0,0,0,0,37,115,47,37,115,0,0,0,99,108,105,101,110,116,78,117,109,0,0,0,0,0,0,0,46,116,120,116,0,0,0,0,98,111,116,95,112,97,117,115,101,0,0,0,0,0,0,0,94,51,87,65,82,78,73,78,71,58,32,118,97,108,117,101,32,111,102,32,118,97,114,105,97,98,108,101,32,34,37,115,34,32,116,111,111,32,108,111,110,103,32,116,111,32,119,114,105,116,101,32,116,111,32,102,105,108,101,10,0,0,0,0,112,114,105,110,116,10,83,101,114,118,101,114,32,105,115,32,102,117,108,108,46,10,0,0,114,0,0,0,0,0,0,0,90,95,70,114,101,101,58,32,102,114,101,101,100,32,97,32,112,111,105,110,116,101,114,32,119,105,116,104,111,117,116,32,90,79,78,69,73,68,0,0,109,97,112,110,97,109,101,0,99,108,95,115,104,111,119,110,101,116,0,0,0,0,0,0,68,79,85,66,76,69,32,83,73,71,78,65,76,32,70,65,85,76,84,58,32,82,101,99,101,105,118,101,100,32,115,105,103,110,97,108,32,37,100,44,32,101,120,105,116,105,110,103,46,46,46,10,0,0,0,0,37,0,0,0,0,0,0,0,35,105,110,99,108,117,100,101,32,109,105,115,115,105,110,103,32,116,114,97,105,108,105,110,103,32,62,0,0,0,0,0,56,0,0,0,0,0,0,0,99,97,110,110,111,116,32,105,110,116,101,114,98,114,101,101,100,32,119,101,105,103,104,116,32,99,111,110,102,105,103,115,44,32,117,110,101,113,117,97,108,32,98,97,108,97,110,99,101,10,0,0,0,0,0,0,103,114,97,118,105,116,121,0,49,48,0,0,0,0,0,0,105,110,102,111,95,99,97,109,112,0,0,0,0,0,0,0,37,99,114,37,115,37,99,0,108,111,97,100,101,100,32,99,97,99,104,101,100,32,100,101,102,97,117,108,116,32,115,107,105,108,108,32,37,102,32,102,114,111,109,32,37,115,10,0,116,101,108,101,112,111,114,116,101,114,32,100,101,115,116,105,110,97,116,105,111,110,32,40,37,115,41,32,105,110,32,115,111,108,105,100,10,0,0,0,112,104,121,115,95,109,97,120,98,97,114,114,105,101,114,0,70,97,105,108,101,100,32,108,111,97,100,105,110,103,32,100,108,108,44,32,116,114,121,105,110,103,32,110,101,120,116,10,0,0,0,0,0,0,0,0,79,112,101,110,105,110,103,32,99,111,110,110,101,99,116,105,111,110,32,116,111,32,83,79,67,75,83,32,115,101,114,118,101,114,46,10,0,0,0,0,65,108,108,32,98,97,110,115,32,97,110,100,32,101,120,99,101,112,116,105,111,110,115,32,104,97,118,101,32,98,101,101,110,32,100,101,108,101,116,101,100,46,10,0,0,0,0,0,119,101,97,112,111,110,0,0,46,115,104,97,100,101,114,0,101,120,112,101,99,116,101,100,32,117,110,115,105,103,110,101,100,32,118,97,108,117,101,44,32,102,111,117,110,100,32,37,115,0,0,0,0,0,0,0,98,111,116,95,110,111,99,104,97,116,0,0,0,0,0,0,79,112,101,110,105,110,103,32,113,99,111,110,115,111,108,101,46,108,111,103,32,102,97,105,108,101,100,33,10,0,0,0,99,108,95,99,100,107,101,121,0,0,0,0,0,0,0,0,115,101,114,118,101,114,32,105,115,32,102,117,108,108,32,111,110,32,108,111,99,97,108,32,99,111,110,110,101,99,116,0,90,95,70,114,101,101,58,32,78,85,76,76,32,112,111,105,110,116,101,114,0,0,0,0,104,111,115,116,110,97,109,101,0,0,0,0,0,0,0,0,94,51,69,88,69,67,95,78,79,87,32,37,115,10,0,0,105,111,113,51,32,49,46,51,54,95,71,73,84,95,52,102,55,100,55,98,102,45,50,48,49,52,45,48,50,45,48,49,32,100,101,100,105,99,97,116,101,100,32,115,101,114,118,101,114,32,40,37,115,41,10,0,47,0,0,0,0,0,0,0,35,105,110,99,108,117,100,101,32,119,105,116,104,111,117,116,32,102,105,108,101,32,110,97,109,101,0,0,0,0,0,0,115,118,95,109,97,120,99,108,105,101,110,116,115,0,0,0,99,97,110,110,111,116,32,105,110,116,101,114,98,114,101,101,100,32,119,101,105,103,104,116,32,99,111,110,102,105,103,115,44,32,117,110,101,113,117,97,108,32,99,104,105,108,100,10,0,0,0,0,0,0,0,0,102,108,97,103,115,0,0,0,119,101,97,112,105,110,100,101,120,95,103,114,97,112,112,108,101,0,0,0,0,0,0,0,109,101,115,115,97,103,101,0,37,99,118,37,108,100,37,99,0,0,0,0,0,0,0,0,108,111,97,100,101,100,32,115,107,105,108,108,32,37,102,32,102,114,111,109,32,37,115,10,0,0,0,0,0,0,0,0,116,101,108,101,112,111,114,116,101,114,32,100,101,115,116,105,110,97,116,105,111,110,32,40,37,115,41,32,119,105,116,104,111,117,116,32,111,114,105,103,105,110,10,0,0,0,0,0,49,56,0,0,0,0,0,0,84,114,121,32,108,111,97,100,105,110,103,32,100,108,108,32,102,105,108,101,32,37,115,10,0,0,0,0,0,0,0,0,78,69,84,95,74,111,105,110,77,117,108,116,105,99,97,115,116,54,58,32,67,111,117,108,100,110,39,116,32,106,111,105,110,32,109,117,108,116,105,99,97,115,116,32,103,114,111,117,112,58,32,37,115,10,0,0,83,101,114,118,101,114,32,105,115,32,110,111,116,32,114,117,110,110,105,110,103,46,10,0,111,116,104,101,114,69,110,116,105,116,121,78,117,109,0,0,113,51,107,101,121,0,0,0,67,77,95,65,100,106,117,115,116,65,114,101,97,80,111,114,116,97,108,83,116,97,116,101,58,32,110,101,103,97,116,105,118,101,32,114,101,102,101,114,101,110,99,101,32,99,111,117,110,116,0,0,0,0,0,0,98,111,116,95,102,97,115,116,99,104,97,116,0,0,0,0,62,62,61,0,0,0,0,0,117,115,97,103,101,58,32,114,101,115,101,116,32,60,118,97,114,105,97,98,108,101,62,10,0,0,0,0,0,0,0,0,66,97,115,101,87,105,110,100,105,110,103,70,111,114,80,108,97,110,101,58,32,110,111,32,97,120,105,115,32,102,111,117,110,100,0,0,0,0,0,0,111,110,108,121,32,98,111,116,115,32,111,110,32,115,101,114,118,101,114,0,0,0,0,0,37,115,10,0,0,0,0,0,119,97,105,116,0,0,0,0,87,65,82,78,73,78,71,58,32,98,101,118,101,108,32,112,108,97,110,101,32,97,108,114,101,97,100,121,32,117,115,101,100,10,0,0,0,0,0,0,67,77,95,76,101,97,102,65,114,101,97,58,32,98,97,100,32,110,117,109,98,101,114,0,37,105,0,0,0,0,0,0,70,101,98,32,50,51,32,50,48,49,52,0,0,0,0,0,42,0,0,0,0,0,0,0,99,97,110,39,116,32,109,101,114,103,101,32,37,115,32,119,105,116,104,32,37,115,0,0,110,111,110,97,109,101,0,0,108,111,97,100,101,100,32,37,115,10,0,0,0,0,0,0,109,111,100,101,108,0,0,0,57,0,0,0,0,0,0,0,111,114,105,103,105,110,0,0,99,104,97,116,32,109,101,115,115,97,103,101,32,116,111,111,32,108,111,110,103,0,0,0,108,111,97,100,101,100,32,100,101,102,97,117,108,116,32,115,107,105,108,108,32,37,100,32,102,114,111,109,32,37,115,10,0,0,0,0,0,0,0,0,67,77,111,100,95,76,111,97,100,83,117,98,109,111,100,101,108,115,58,32,102,117,110,110,121,32,108,117,109,112,32,115,105,122,101,0,0,0,0,0,116,101,108,101,112,111,114,116,101,114,32,119,105,116,104,111,117,116,32,109,105,115,99,95,116,101,108,101,112,111,114,116,101,114,95,100,101,115,116,32,40,37,115,41,10,0,0,0,112,104,121,115,95,109,97,120,119,97,116,101,114,106,117,109,112,0,0,0,0,0,0,0,86,77,95,67,114,101,97,116,101,58,32,110,111,32,102,114,101,101,32,118,109,95,116,0,78,69,84,95,74,111,105,110,77,117,108,116,105,99,97,115,116,54,58,32,67,111,117,108,100,110,39,116,32,115,101,116,32,115,99,111,112,101,32,111,110,32,109,117,108,116,105,99,97,115,116,32,115,111,99,107,101,116,58,32,37,115,10,0,102,108,117,115,104,98,97,110,115,0,0,0,0,0,0,0,101,70,108,97,103,115,0,0,70,83,95,70,79,112,101,110,70,105,108,101,82,101,97,100,58,32,78,85,76,76,32,39,102,105,108,101,110,97,109,101,39,32,112,97,114,97,109,101,116,101,114,32,112,97,115,115,101,100,0,0,0,0,0,0,83,86,95,71,101,116,67,104,97,108,108,101,110,103,101,58,32,114,97,116,101,32,108,105,109,105,116,32,102,114,111,109,32,37,115,32,101,120,99,101,101,100,101,100,44,32,100,114,111,112,112,105,110,103,32,114,101,113,117,101,115,116,10,0,98,111,116,95,116,101,115,116,99,108,117,115,116,101,114,115,0,0,0,0,0,0,0,0,79,98,106,101,99,116,32,37,105,32,116,111,117,99,104,105,110,103,32,51,32,97,114,101,97,115,32,97,116,32,37,102,32,37,102,32,37,102,10,0,117,115,97,103,101,58,32,37,115,32,60,118,97,114,105,97,98,108,101,62,32,60,118,97,108,117,101,62,10,0,0,0,37,115,58,32,68,101,108,116,97,32,114,101,113,117,101,115,116,32,102,114,111,109,32,111,117,116,32,111,102,32,100,97,116,101,32,101,110,116,105,116,105,101,115,46,10,0,0,0,112,97,115,115,119,111,114,100,0,0,0,0,0,0,0,0,77,73,83,83,73,78,71,32,86,65,76,85,69,10,0,0,35,52,54,50,32,78,101,116,99,104,97,110,95,84,114,97,110,115,109,105,116,78,101,120,116,70,114,97,103,109,101,110,116,58,32,114,101,109,97,105,110,105,110,103,32,113,117,101,117,101,100,32,109,101,115,115,97,103,101,10,0,0,0,0,101,99,104,111,0,0,0,0,67,77,95,76,101,97,102,67,108,117,115,116,101,114,58,32,98,97,100,32,110,117,109,98,101,114,0,0,0,0,0,0,102,105,108,101,32,37,115,44,32,108,105,110,101,32,37,100,58,32,37,115,10,0,0,0,112,114,111,116,111,99,111,108,0,0,0,0,0,0,0,0,45,118,0,0,0,0,0,0,46,42,0,0,0,0,0,0,115,116,114,105,110,103,105,122,105,110,103,32,111,112,101,114,97,116,111,114,32,119,105,116,104,111,117,116,32,100,101,102,105,110,101,32,112,97,114,97,109,101,116,101,114,0,0,0,115,118,95,104,111,115,116,110,97,109,101,0,0,0,0,0,116,111,111,32,109,97,110,121,32,102,117,122,122,121,32,119,101,105,103,104,116,115,0,0,110,97,109,101,0,0,0,0,119,101,97,112,105,110,100,101,120,95,98,102,103,49,48,107,0,0,0,0,0,0,0,0,116,97,114,103,101,116,95,108,111,99,97,116,105,111,110,0,108,111,97,100,101,100,32,37,115,10,0,0,0,0,0,0,108,111,97,100,101,100,32,99,97,99,104,101,100,32,100,101,102,97,117,108,116,32,115,107,105,108,108,32,37,100,32,102,114,111,109,32,37,115,10,0,116,114,105,103,103,101,114,95,116,101,108,101,112,111,114,116,32,97,116,32,37,49,46,48,102,32,37,49,46,48,102,32,37,49,46,48,102,32,119,105,116,104,111,117,116,32,116,97,114,103,101,116,10,0,0,0,48,46,55,0,0,0,0,0,37,54,105,32,65,65,83,32,109,101,109,111,114,121,47,67,80,85,32,117,115,97,103,101,32,40,116,104,101,32,108,111,119,101,114,32,116,104,101,32,98,101,116,116,101,114,41,10,0,0,0,0,0,0,0,0,86,77,95,67,114,101,97,116,101,58,32,98,97,100,32,112,97,114,109,115,0,0,0,0,87,65,82,78,73,78,71,58,32,78,69,84,95,74,111,105,110,77,117,108,116,105,99,97,115,116,54,58,32,73,110,99,111,114,114,101,99,116,32,109,117,108,116,105,99,97,115,116,32,97,100,100,114,101,115,115,32,103,105,118,101,110,44,32,112,108,101,97,115,101,32,115,101,116,32,99,118,97,114,32,37,115,32,116,111,32,97,32,115,97,110,101,32,118,97,108,117,101,46,10,0,0,0,0,101,120,99,101,112,116,100,101,108,0,0,0,0,0,0,0,112,111,115,46,116,114,84,121,112,101,0,0,0,0,0,0,100,109,95,0,0,0,0,0,108,111,103,0,0,0,0,0,98,111,116,95,116,101,115,116,115,111,108,105,100,0,0,0,116,111,103,103,108,101,58,32,110,111,116,104,105,110,103,32,116,111,32,116,111,103,103,108,101,32,116,111,10,0,0,0,37,115,32,0,0,0,0,0,37,115,58,114,101,99,111,110,110,101,99,116,10,0,0,0,118,115,116,114,0,0,0,0,67,77,95,73,110,108,105,110,101,77,111,100,101,108,58,32,98,97,100,32,110,117,109,98,101,114,0,0,0,0,0,0,103,97,109,101,110,97,109,101,0,0,0,0,0,0,0,0,115,97,121,32,37,115,0,0,45,45,118,101,114,115,105,111,110,0,0,0,0,0,0,0,58,58,0,0,0,0,0,0,115,118,95,112,114,105,118,97,116,101,67,108,105,101,110,116,115,0,0,0,0,0,0,0,119,101,105,103,104,116,0,0,99,111,117,108,100,110,39,116,32,108,111,97,100,32,116,104,101,32,119,101,97,112,111,110,32,99,111,110,102,105,103,10,0,0,0,0,0,0,0,0,53,0,0,0,0,0,0,0,99,108,97,115,115,110,97,109,101,0,0,0,0,0,0,0,109,105,115,115,105,110,103,32,125,0,0,0,0,0,0,0,98,111,116,115,47,100,101,102,97,117,108,116,95,99,46,99,0,0,0,0,0,0,0,0,83,101,114,118,101,114,32,99,111,109,109,97,110,100,32,111,118,101,114,102,108,111,119,0,116,114,105,103,103,101,114,95,116,101,108,101,112,111,114,116,32,109,111,100,101,108,32,61,32,34,37,115,34,10,0,0,112,104,121,115,95,109,97,120,115,116,101,101,112,110,101,115,115,0,0,0,0,0,0,0,37,54,105,32,116,111,116,97,108,32,114,101,97,99,104,97,98,105,108,105,116,121,32,97,114,101,97,115,10,0,0,0,86,77,95,82,101,115,116,97,114,116,32,102,97,105,108,101,100,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,78,69,84,95,73,80,54,83,111,99,107,101,116,58,32,98,105,110,100,58,32,37,115,10,0,0,0,0,0,0,0,98,97,110,100,101,108,0,0,103,114,111,117,110,100,69,110,116,105,116,121,78,117,109,0,94,51,87,65,82,78,73,78,71,58,32,67,111,117,108,100,32,110,111,116,32,99,114,101,97,116,101,32,110,101,119,32,99,111,109,95,112,105,112,101,102,105,108,101,32,97,116,32,37,115,46,32,99,111,109,95,112,105,112,101,102,105,108,101,32,119,105,108,108,32,110,111,116,32,98,101,32,117,115,101,100,46,10,0,0,0,0,0,98,111,116,95,116,101,115,116,114,99,104,97,116,0,0,0,37,100,0,0,0,0,0,0,100,114,111,112,105,110,103,32,73,83,67,84,76,32,115,101,113,117,101,110,99,101,58,32,37,100,44,32,84,84,89,95,101,114,97,115,101,58,32,37,100,10,0,0,0,0,0,0,45,0,0,0,0,0,0,0,117,110,107,110,111,119,110,32,99,111,109,112,114,101,115,115,105,111,110,32,109,101,116,104,111,100,0,0,0,0,0,0,105,110,118,97,108,105,100,32,108,105,116,101,114,97,108,47,108,101,110,103,116,104,32,99,111,100,101,0,0,0,0,0,37,100,0,0,0,0,0,0,10,0,0,0,0,0,0,0,117,110,101,120,112,101,99,116,101,100,32,112,117,110,99,116,117,97,116,105,111,110,32,37,115,0,0,0,0,0,0,0,67,108,105,101,110,116,32,37,105,32,99,111,110,110,101,99,116,105,110,103,32,119,105,116,104,32,37,105,32,99,104,97,108,108,101,110,103,101,32,112,105,110,103,10,0,0,0,0,101,120,101,99,0,0,0,0,46,46,46,0,0,0,0,0,67,77,95,67,108,105,112,72,97,110,100,108,101,84,111,77,111,100,101,108,58,32,98,97,100,32,104,97,110,100,108,101,32,37,105,32,60,32,37,105,32,60,32,37,105,0,0,0,111,117,116,32,111,102,32,116,111,107,101,110,32,115,112,97,99,101,0,0,0,0,0,0,111,112,101,110,108,111,103,32,60,102,105,108,101,110,97,109,101,62,10,0,0,0,0,0,37,115,58,32,98,111,116,32,108,105,98,114,97,114,121,32,117,115,101,100,32,98,101,102,111,114,101,32,98,101,105,110,103,32,115,101,116,117,112,10,0,0,0,0,0,0,0,0,99,104,97,108,108,101,110,103,101,0,0,0,0,0,0,0,77,105,115,115,105,110,103,32,114,101,116,117,114,110,32,118,97,108,117,101,0,0,0,0,83,121,115,95,76,111,97,100,71,97,109,101,68,108,108,40,37,115,41,32,102,111,117,110,100,32,118,109,77,97,105,110,32,102,117,110,99,116,105,111,110,32,97,116,32,37,112,10,0,0,0,0,0,0,0,0,119,101,97,112,111,110,32,110,117,109,98,101,114,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,0,45,62,0,0,0,0,0,0,37,100,0,0,0,0,0,0,110,111,109,97,112,0,0,0,99,111,117,110,108,100,110,39,116,32,108,111,97,100,32,37,115,10,0,0,0,0,0,0,105,110,118,97,108,105,100,32,119,101,97,112,111,110,32,115,116,97,116,101,32,37,100,10,0,0,0,0,0,0,0,0,119,101,97,112,111,110,115,46,99,0,0,0,0,0,0,0,119,101,97,112,105,110,100,101,120,95,114,111,99,107,101,116,108,97,117,110,99,104,101,114,0,0,0,0,0,0,0,0,111,117,116,32,111,102,32,108,101,118,101,108,32,105,116,101,109,115,10,0,0,0,0,0,117,110,101,120,112,101,99,116,101,100,32,37,115,0,0,0,99,111,117,108,100,110,39,116,32,102,105,110,100,32,115,107,105,108,108,32,37,100,32,105,110,32,37,115,10,0,0,0,110,111,32,101,110,116,105,116,121,32,119,105,116,104,32,109,111,100,101,108,32,37,100,10,0,0,0,0,0,0,0,0,116,114,105,103,103,101,114,95,116,101,108,101,112,111,114,116,0,0,0,0,0,0,0,0,49,57,0,0,0,0,0,0,99,108,117,115,116,101,114,32,37,100,32,104,97,115,32,37,100,32,114,101,97,99,104,97,98,105,108,105,116,121,32,97,114,101,97,115,10,0,0,0,83,86,95,71,101,116,67,111,110,102,105,103,115,116,114,105,110,103,58,32,98,117,102,102,101,114,83,105,122,101,32,61,61,32,37,105,0,0,0,0,86,77,95,82,101,115,116,97,114,116,40,41,10,0,0,0,87,65,82,78,73,78,71,58,32,78,69,84,95,73,80,54,83,111,99,107,101,116,58,32,115,101,116,115,111,99,107,111,112,116,32,73,80,86,54,95,86,54,79,78,76,89,58,32,37,115,10,0,0,0,0,0,109,111,100,101,108,105,110,100,101,120,0,0,0,0,0,0,101,120,99,101,112,116,97,100,100,114,0,0,0,0,0,0,108,101,103,115,65,110,105,109,0,0,0,0,0,0,0,0,70,83,95,70,67,114,101,97,116,101,79,112,101,110,80,105,112,101,70,105,108,101,58,32,37,115,10,0,0,0,0,0,109,97,120,95,109,101,115,115,97,103,101,115,0,0,0,0,98,111,116,95,116,101,115,116,105,99,104,97,116,0,0,0,37,115,10,0,0,0,0,0,54,49,52,52,0,0,0,0,83,86,95,83,101,116,66,114,117,115,104,77,111,100,101,108,58,32,78,85,76,76,0,0,37,100,32,98,121,116,101,115,32,114,111,117,116,105,110,103,32,99,97,99,104,101,10,0,109,111,118,101,32,115,116,97,116,101,32,104,97,110,100,108,101,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,0,0,117,115,97,103,101,58,32,116,111,103,103,108,101,32,60,118,97,114,105,97,98,108,101,62,32,91,118,97,108,117,101,49,44,32,118,97,108,117,101,50,44,32,46,46,46,93,10,0,116,114,105,103,103,101,114,95,112,117,115,104,32,115,116,97,114,116,32,115,111,108,105,100,10,0,0,0,0,0,0,0,112,104,121,115,95,115,116,111,112,115,112,101,101,100,0,0,102,111,114,99,101,119,114,105,116,101,0,0,0,0,0,0,116,114,121,105,110,103,32,116,111,32,108,111,97,100,32,37,115,10,0,0,0,0,0,0,65,65,83,95,69,110,116,105,116,121,73,110,102,111,58,32,101,110,116,110,117,109,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,115,101,116,0,0,0,0,0,65,65,83,95,77,65,88,95,80,79,82,84,65,76,73,78,68,69,88,83,73,90,69,10,0,0,0,0,0,0,0,0,67,108,105,101,110,116,32,37,105,32,114,101,106,101,99,116,101,100,32,111,110,32,97,32,116,111,111,32,104,105,103,104,32,112,105,110,103,10,0,0,101,110,116,100,97,116,97,0,86,77,95,80,114,101,112,97,114,101,73,110,116,101,114,112,114,101,116,101,114,58,32,112,99,32,62,32,104,101,97,100,101,114,45,62,99,111,100,101,76,101,110,103,116,104,0,0,99,109,100,108,105,115,116,0,118,109,95,103,97,109,101,0,119,98,0,0,0,0,0,0,67,77,95,67,108,105,112,72,97,110,100,108,101,84,111,77,111,100,101,108,58,32,98,97,100,32,104,97,110,100,108,101,32,37,105,0,0,0,0,0,83,86,95,83,101,116,67,111,110,102,105,103,115,116,114,105,110,103,58,32,98,97,100,32,105,110,100,101,120,32,37,105,0,0,0,0,0,0,0,0,98,111,116,0,0,0,0,0,83,86,67,95,73,110,102,111,58,32,114,97,116,101,32,108,105,109,105,116,32,101,120,99,101,101,100,101,100,44,32,100,114,111,112,112,105,110,103,32,114,101,113,117,101,115,116,10,0,0,0,0,0,0,0,0,115,104,111,119,100,114,111,112,0,0,0,0,0,0,0,0,110,97,109,101,0,0,0,0,83,121,115,95,76,111,97,100,71,97,109,101,68,108,108,40,37,115,41,32,102,97,105,108,101,100,32,116,111,32,102,105,110,100,32,118,109,77,97,105,110,32,102,117,110,99,116,105,111,110,58,10,34,37,115,34,32,33,10,0,0,0,0,0,71,101,110,101,116,105,99,80,97,114,101,110,116,115,65,110,100,67,104,105,108,100,83,101,108,101,99,116,105,111,110,58,32,116,111,111,32,109,97,110,121,32,98,111,116,115,10,0,60,60,0,0,0,0,0,0,77,105,115,109,97,116,99,104,101,100,32,66,79,84,76,73,66,95,65,80,73,95,86,69,82,83,73,79,78,58,32,101,120,112,101,99,116,101,100,32,37,105,44,32,103,111,116,32,37,105,10,0,0,0,0,0,115,118,95,107,101,121,119,111,114,100,115,0,0,0,0,0,98,111,116,102,105,108,101,115,0,0,0,0,0,0,0,0,119,101,97,112,111,110,99,111,110,102,105,103,0,0,0,0,56,48,48,0,0,0,0,0,109,97,120,95,108,101,118,101,108,105,116,101,109,115,0,0,115,121,110,111,110,121,109,32,109,117,115,116,32,104,97,118,101,32,97,116,32,108,101,97,115,116,32,116,119,111,32,101,110,116,114,105,101,115,0,0,108,111,97,100,101,100,32,115,107,105,108,108,32,37,100,32,102,114,111,109,32,37,115,10,0,0,0,0,0,0,0,0,116,97,114,103,101,116,95,116,101,108,101,112,111,114,116,101,114,32,119,105,116,104,111,117,116,32,116,97,114,103,101,116,10,0,0,0,0,0,0,0,112,104,121,115,95,109,97,120,115,116,101,112,0,0,0,0,99,97,110,39,116,32,119,114,105,116,101,32,37,100,32,98,105,116,115,0,0,0,0,0,37,54,100,32,99,108,117,115,116,101,114,115,32,99,114,101,97,116,101,100,10,0,0,0,94,51,87,97,114,110,105,110,103,58,32,74,117,109,112,32,116,97,98,108,101,32,115,105,122,101,32,111,102,32,37,115,32,110,111,116,32,109,97,116,99,104,105,110,103,32,97,102,116,101,114,32,86,77,95,82,101,115,116,97,114,116,40,41,10,0,0,0,0,0,0,0,66,73,71,32,73,110,102,111,32,115,116,114,105,110,103,32,108,101,110,103,116,104,32,101,120,99,101,101,100,101,100,10,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,78,69,84,95,73,80,54,83,111,99,107,101,116,58,32,105,111,99,116,108,32,70,73,79,78,66,73,79,58,32,37,115,10,0,0,0,0,0,0,98,97,110,97,100,100,114,0,101,118,101,110,116,80,97,114,109,0,0,0,0,0,0,0,97,98,0,0,0,0,0,0,107,105,99,107,98,111,116,115,0,0,0,0,0,0,0,0,98,111,116,95,114,101,108,111,97,100,99,104,97,114,97,99,116,101,114,115,0,0,0,0,70,83,95,70,79,112,101,110,70,105,108,101,65,112,112,101,110,100,58,32,37,115,10,0,67,118,97,114,32,37,115,32,100,111,101,115,32,110,111,116,32,101,120,105,115,116,46,10,0,0,0,0,0,0,0,0,99,118,97,114,95,114,101,115,116,97,114,116,0,0,0,0,112,114,105,110,116,10,83,101,114,118,101,114,32,105,115,32,102,111,114,32,108,111,119,32,112,105,110,103,115,32,111,110,108,121,10,0,0,0,0,0,99,102,103,0,0,0,0,0,67,77,95,76,111,97,100,77,97,112,58,32,37,115,32,104,97,115,32,119,114,111,110,103,32,118,101,114,115,105,111,110,32,110,117,109,98,101,114,32,40,37,105,32,115,104,111,117,108,100,32,98,101,32,37,105,41,0,0,0,0,0,0,0,83,86,67,95,73,110,102,111,58,32,114,97,116,101,32,108,105,109,105,116,32,102,114,111,109,32,37,115,32,101,120,99,101,101,100,101,100,44,32,100,114,111,112,112,105,110,103,32,114,101,113,117,101,115,116,10,0,0,0,0,0,0,0,0,118,109,77,97,105,110,0,0,62,62,0,0,0,0,0,0,99,104,97,116,32,115,116,97,116,101,32,104,97,110,100,108,101,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,0,0,66,111,116,85,112,100,97,116,101,69,110,116,105,116,121,0,103,95,103,97,109,101,116,121,112,101,0,0,0,0,0,0,119,101,105,103,104,116,70,105,108,101,76,105,115,116,32,119,97,115,32,102,117,108,108,32,116,114,121,105,110,103,32,116,111,32,108,111,97,100,32,37,115,10,0,0,0,0,0,0,99,111,117,108,100,110,39,116,32,108,111,97,100,32,119,101,97,112,111,110,32,99,111,110,102,105,103,32,37,115,10,0,115,118,95,103,114,97,118,105,116,121,0,0,0,0,0,0,105,116,101,109,32,105,110,102,111,32,37,100,32,34,37,115,34,32,104,97,115,32,110,111,32,102,117,122,122,121,32,119,101,105,103,104,116,13,10,0,93,0,0,0,0,0,0,0,108,111,97,100,101,100,32,99,97,99,104,101,100,32,115,107,105,108,108,32,37,102,32,102,114,111,109,32,37,115,10,0,116,97,114,103,101,116,95,116,101,108,101,112,111,114,116,101,114,0,0,0,0,0,0,0,52,0,0,0,0,0,0,0,37,54,100,32,112,111,114,116,97,108,115,32,99,114,101,97,116,101,100,10,0,0,0,0,76,111,97,100,105,110,103,32,37,100,32,106,117,109,112,32,116,97,98,108,101,32,116,97,114,103,101,116,115,10,0,0,73,110,102,111,32,115,116,114,105,110,103,32,108,101,110,103,116,104,32,101,120,99,101,101,100,101,100,10,0,0,0,0,87,65,82,78,73,78,71,58,32,78,69,84,95,73,80,54,83,111,99,107,101,116,58,32,115,111,99,107,101,116,58,32,37,115,10,0,0,0,0,0,116,111,114,115,111,65,110,105,109,0,0,0,0,0,0,0,108,105,115,116,98,97,110,115,0,0,0,0,0,0,0,0,49,48,48,0,0,0,0,0,48,0,0,0,0,0,0,0,70,83,95,70,79,112,101,110,70,105,108,101,87,114,105,116,101,58,32,37,115,10,0,0,117,115,97,103,101,58,32,112,114,105,110,116,32,60,118,97,114,105,97,98,108,101,62,10,0,0,0,0,0,0,0,0,99,104,97,114,97,99,116,101,114,32,104,97,110,100,108,101,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,0,0,0,98,97,115,101,113,51,0,0,115,97,102,101,0,0,0,0,67,108,105,101,110,116,32,37,105,32,114,101,106,101,99,116,101,100,32,111,110,32,97,32,116,111,111,32,108,111,119,32,112,105,110,103,10,0,0,0,37,105,32,99,111,109,109,97,110,100,115,10,0,0,0,0,67,111,117,108,100,110,39,116,32,108,111,97,100,32,37,115,0,0,0,0,0,0,0,0,65,65,83,95,80,114,101,115,101,110,99,101,84,121,112,101,66,111,117,110,100,105,110,103,66,111,120,58,32,117,110,107,110,111,119,110,32,112,114,101,115,101,110,99,101,32,116,121,112,101,10,0,0,0,0,0,37,100,32,109,105,100,114,97,110,103,101,32,97,114,101,97,32,37,100,0,0,0,0,0,117,105,95,115,105,110,103,108,101,80,108,97,121,101,114,65,99,116,105,118,101,0,0,0,100,108,108,69,110,116,114,121,0,0,0,0,0,0,0,0,94,61,0,0,0,0,0,0,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,10,0,0,116,105,109,101,108,105,109,105,116,0,0,0,0,0,0,0,115,119,105,116,99,104,32,119,105,116,104,111,117,116,32,100,101,102,97,117,108,116,0,0,108,111,97,100,101,100,32,37,115,10,0,0,0,0,0,0,51,50,0,0,0,0,0,0,108,111,97,100,101,100,32,37,115,10,0,0,0,0,0,0,41,0,0,0,0,0,0,0,117,110,107,110,111,119,110,32,100,101,102,105,110,105,116,105,111,110,32,37,115,0,0,0,83,86,95,83,118,69,110,116,105,116,121,70,111,114,71,101,110,116,105,116,121,58,32,98,97,100,32,103,69,110,116,0,116,114,105,103,103,101,114,95,109,117,108,116,105,112,108,101,32,97,116,32,37,49,46,48,102,32,37,49,46,48,102,32,37,49,46,48,102,32,119,105,116,104,111,117,116,32,116,97,114,103,101,116,10,0,0,0,112,104,121,115,95,115,119,105,109,97,99,99,101,108,101,114,97,116,101,0,0,0,0,0,112,111,114,116,97,108,32,37,100,58,32,97,114,101,97,32,37,100,13,10,0,0,0,0,94,51,87,97,114,110,105,110,103,58,32,68,97,116,97,32,114,101,103,105,111,110,32,115,105,122,101,32,111,102,32,37,115,32,110,111,116,32,109,97,116,99,104,105,110,103,32,97,102,116,101,114,32,86,77,95,82,101,115,116,97,114,116,40,41,10,0,0,0,0,0,0,92,37,115,92,37,115,0,0,79,112,101,110,105,110,103,32,73,80,54,32,115,111,99,107,101,116,58,32,91,58,58,93,58,37,105,10,0,0,0,0,37,100,32,97,114,101,97,32,99,97,99,104,101,32,117,112,100,97,116,101,115,10,0,0,101,84,121,112,101,0,0,0,114,101,104,97,115,104,98,97,110,115,0,0,0,0,0,0,98,111,116,95,116,104,105,110,107,116,105,109,101,0,0,0,37,102,0,0,0,0,0,0,67,108,105,101,110,116,32,113,117,105,116,0,0,0,0,0,112,114,105,110,116,10,83,101,114,118,101,114,32,105,115,32,102,111,114,32,104,105,103,104,32,112,105,110,103,115,32,111,110,108,121,10,0,0,0,0,67,118,97,114,95,71,101,116,58,32,78,85,76,76,32,112,97,114,97,109,101,116,101,114,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,67,77,95,71,114,105,100,80,108,97,110,101,32,117,110,114,101,115,111,108,118,97,98,108,101,10,0,0,0,0,0,67,77,95,76,111,97,100,77,97,112,40,32,37,115,44,32,37,105,32,41,10,0,0,0,115,112,101,101,100,0,0,0,84,101,115,116,105,110,103,32,102,97,116,97,108,32,101,114,114,111,114,0,0,0,0,0,65,65,83,32,100,97,116,97,32,111,112,116,105,109,105,122,101,100,46,10,0,0,0,0,103,95,103,97,109,101,116,121,112,101,0,0,0,0,0,0,84,101,115,116,105,110,103,32,100,114,111,112,32,101,114,114,111,114,0,0,0,0,0,0,83,121,115,95,76,111,97,100,71,97,109,101,68,108,108,40,37,115,41,32,102,97,105,108,101,100,58,10,34,37,115,34,10,0,0,0,0,0,0,0,124,61,0,0,0,0,0,0,45,45,45,45,45,45,45,45,45,45,45,45,32,77,97,112,32,76,111,97,100,105,110,103,32,45,45,45,45,45,45,45,45,45,45,45,45,10,0,0,50,48,0,0,0,0,0,0,125,0,0,0,0,0,0,0,110,111,32,119,101,97,112,111,110,32,105,110,102,111,32,108,111,97,100,101,100,10,0,0,115,118,95,109,97,120,98,97,114,114,105,101,114,0,0,0,110,111,32,105,116,101,109,32,105,110,102,111,32,108,111,97,100,101,100,10,0,0,0,0,44,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,105,110,116,101,103,101,114,44,32,102,108,111,97,116,32,111,114,32,115,116,114,105,110,103,44,32,102,111,117,110,100,32,37,115,0,0,0,0,0,102,114,101,101,122,101,32,60,115,101,99,111,110,100,115,62,10,0,0,0,0,0,0,0,116,114,105,103,103,101,114,95,109,117,108,116,105,112,108,101,32,109,111,100,101,108,32,61,32,34,37,115,34,10,0,0,112,104,121,115,95,97,105,114,97,99,99,101,108,101,114,97,116,101,0,0,0,0,0,0,10,0,0,0,0,0,0,0,94,51,87,97,114,110,105,110,103,58,32,37,115,32,100,111,101,115,32,110,111,116,32,104,97,118,101,32,97,32,114,101,99,111,103,110,105,115,97,98,108,101,32,109,97,103,105,99,32,110,117,109,98,101,114,32,105,110,32,105,116,115,32,104,101,97,100,101,114,10,0,0,94,51,67,97,110,39,116,32,117,115,101,32,107,101,121,115,32,111,114,32,118,97,108,117,101,115,32,119,105,116,104,32,97,32,39,37,99,39,58,32,37,115,32,61,32,37,115,10,0,0,0,0,0,0,0,0,79,112,101,110,105,110,103,32,73,80,54,32,115,111,99,107,101,116,58,32,37,115,58,37,105,10,0,0,0,0,0,0,115,101,114,118,101,114,0,0,97,110,103,108,101,115,50,91,49,93,0,0,0,0,0,0,116,101,108,108,0,0,0,0,45,45,45,32,67,111,109,109,111,110,32,73,110,105,116,105,97,108,105,122,97,116,105,111,110,32,67,111,109,112,108,101,116,101,32,45,45,45,10,0,99,111,109,95,112,105,112,101,102,105,108,101,0,0,0,0,98,111,116,95,115,97,118,101,114,111,117,116,105,110,103,99,97,99,104,101,0,0,0,0,117,105,95,115,105,110,103,108,101,80,108,97,121,101,114,65,99,116,105,118,101,0,0,0,37,105,0,0,0,0,0,0,114,95,117,105,70,117,108,108,83,99,114,101,101,110,0,0,83,101,114,118,101,114,32,113,117,105,116,0,0,0,0,0,99,105,110,101,109,97,116,105,99,32,105,110,116,114,111,46,82,111,81,0,0,0,0,0,112,104,121,115,95,102,114,105,99,116,105,111,110,0,0,0,112,114,105,110,116,10,78,111,32,111,114,32,98,97,100,32,99,104,97,108,108,101,110,103,101,32,102,111,114,32,121,111,117,114,32,97,100,100,114,101], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+40960);
/* memory initializer */ allocate([115,115,46,10,0,0,0,0,67,109,100,95,65,100,100,67,111,109,109,97,110,100,58,32,37,115,32,97,108,114,101,97,100,121,32,100,101,102,105,110,101,100,10,0,0,0,0,0,110,101,120,116,109,97,112,0,49,0,0,0,0,0,0,0,99,105,110,101,109,97,116,105,99,32,105,100,108,111,103,111,46,82,111,81,10,0,0,0,37,115,0,0,0,0,0,0,112,114,111,116,111,99,111,108,0,0,0,0,0,0,0,0,68,97,114,107,80,108,97,99,101,115,0,0,0,0,0,0,65,65,83,32,102,105,108,101,32,110,111,116,32,115,101,113,117,101,110,116,105,97,108,108,121,32,114,101,97,100,10,0,99,111,109,95,112,114,111,116,111,99,111,108,0,0,0,0,110,97,110,0,0,0,0,0,76,111,97,100,105,110,103,32,68,76,76,32,102,105,108,101,58,32,37,115,10,0,0,0,38,61,0,0,0,0,0,0,66,111,116,76,111,97,100,77,97,112,0,0,0,0,0,0,102,114,97,103,108,105,109,105,116,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,110,97,109,101,32,37,115,0,65,65,83,95,85,112,100,97,116,101,69,110,116,105,116,121,58,32,110,111,116,32,108,111,97,100,101,100,10,0,0,0,119,101,97,112,111,110,32,37,115,32,117,115,101,115,32,117,110,100,101,102,105,110,101,100,32,112,114,111,106,101,99,116,105,108,101,32,105,110,32,37,115,10,0,0,0,0,0,0,49,56,0,0,0,0,0,0,117,110,107,110,111,119,110,32,100,101,102,105,110,105,116,105,111,110,32,37,115,0,0,0,101,109,112,116,121,32,115,116,114,105,110,103,0,0,0,0,99,104,97,114,97,99,116,101,114,105,115,116,105,99,32,37,100,32,97,108,114,101,97,100,121,32,105,110,105,116,105,97,108,105,122,101,100,0,0,0,81,117,97,107,101,51,65,114,101,110,97,0,0,0,0,0,65,65,83,95,78,101,120,116,65,114,101,97,82,101,97,99,104,97,98,105,108,105,116,121,58,32,114,101,97,99,104,110,117,109,32,60,32,115,101,116,116,105,110,103,115,45,62,102,105,114,115,116,114,101,97,99,104,97,98,108,101,97,114,97,0,0,0,0,0,0,0,0,116,114,105,103,103,101,114,95,109,117,108,116,105,112,108,101,0,0,0,0,0,0,0,0,49,48,0,0,0,0,0,0,65,65,83,32,115,104,117,116,100,111,119,110,46,10,0,0,13,37,54,100,0,0,0,0,94,51,87,97,114,110,105,110,103,58,32,37,115,32,104,97,115,32,98,97,100,32,104,101,97,100,101,114,10,0,0,0,73,110,102,111,95,83,101,116,86,97,108,117,101,70,111,114,75,101,121,58,32,111,118,101,114,115,105,122,101,32,105,110,102,111,115,116,114,105,110,103,0,0,0,0,0,0,0,0,79,112,101,110,105,110,103,32,73,80,54,32,115,111,99,107,101,116,58,32,91,37,115,93,58,37,105,10,0,0,0,0,99,108,105,101,110,116,0,0,101,118,101,110,116,0,0,0,115,97,121,0,0,0,0,0,99,111,109,95,103,97,109,101,110,97,109,101,0,0,0,0,118,101,114,115,105,111,110,0,98,111,116,95,97,97,115,111,112,116,105,109,105,122,101,0,70,83,95,83,86,95,70,79,112,101,110,70,105,108,101,82,101,97,100,32,40,102,115,95,98,97,115,101,112,97,116,104,41,58,32,37,115,10,0,0,110,111,32,112,111,114,116,97,108,32,111,102,32,97,114,101,97,32,37,100,10,0,0,0,37,115,32,37,115,32,37,115,0,0,0,0,0,0,0,0,108,111,103,102,105,108,101,32,111,112,101,110,101,100,32,111,110,32,37,115,10,0,0,0,82,101,115,116,114,105,99,116,101,100,32,115,111,117,114,99,101,32,116,114,105,101,100,32,116,111,32,109,111,100,105,102,121,32,34,37,115,34,0,0,98,115,112,32,101,110,116,105,116,121,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,0,0,0,0,99,111,109,95,105,110,116,114,111,112,108,97,121,101,100,0,83,101,114,118,101,114,32,102,97,116,97,108,32,99,114,97,115,104,101,100,58,32,37,115,0,0,0,0,0,0,0,0,99,111,109,95,98,117,115,121,87,97,105,116,0,0,0,0,10,13,59,0,0,0,0,0,105,112,0,0,0,0,0,0,99,111,109,95,97,98,110,111,114,109,97,108,69,120,105,116,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,67,77,95,83,101,116,66,111,114,100,101,114,73,110,119,97,114,100,58,32,109,105,120,101,100,32,112,108,97,110,101,32,115,105,100,101,115,10,0,99,109,95,112,108,97,121,101,114,67,117,114,118,101,67,108,105,112,0,0,0,0,0,0,99,111,109,95,109,97,120,102,112,115,77,105,110,105,109,105,122,101,100,0,0,0,0,0,99,111,109,95,109,105,110,105,109,105,122,101,100,0,0,0,104,101,97,114,116,98,101,97,116,32,37,115,10,0,0,0,67,98,117,102,95,73,110,115,101,114,116,84,101,120,116,32,111,118,101,114,102,108,111,119,101,100,10,0,0,0,0,0,99,111,109,95,109,97,120,102,112,115,85,110,102,111,99,117,115,101,100,0,0,0,0,0,45,45,0,0,0,0,0,0,66,111,116,83,116,97,114,116,70,114,97,109,101,0,0,0,100,109,102,108,97,103,115,0,115,119,105,116,99,104,0,0,119,101,97,112,111,110,32,37,115,32,104,97,115,32,110,111,32,112,114,111,106,101,99,116,105,108,101,32,105,110,32,37,115,10,0,0,0,0,0,0,115,118,95,115,116,101,112,0,109,111,114,101,32,116,104,97,110,32,37,100,32,105,116,101,109,32,105,110,102,111,32,100,101,102,105,110,101,100,0,0,40,0,0,0,0,0,0,0,99,104,97,114,97,99,116,101,114,105,115,116,105,99,32,105,110,100,101,120,32,111,117,116,32,111,102,32,114,97,110,103,101,32,91,48,44,32,37,100,93,0,0,0,0,0,0,0,99,111,109,95,117,110,102,111,99,117,115,101,100,0,0,0,65,65,83,95,78,101,120,116,65,114,101,97,82,101,97,99,104,97,98,105,108,105,116,121,58,32,97,114,101,97,110,117,109,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,0,0,98,111,116,95,110,111,116,116,101,97,109,0,0,0,0,0,112,104,121,115,95,119,97,108,107,97,99,99,101,108,101,114,97,116,101,0,0,0,0,0,49,48,50,52,0,0,0,0,13,37,54,100,32,114,101,109,111,118,101,100,32,112,111,114,116,97,108,32,97,114,101,97,115,0,0,0,0,0,0,0,46,46,46,119,104,105,99,104,32,104,97,115,32,118,109,77,97,103,105,99,32,86,77,95,77,65,71,73,67,95,86,69,82,50,10,0,0,0,0,0,92,59,34,0,0,0,0,0,87,65,82,78,73,78,71,58,32,78,69,84,95,73,80,83,111,99,107,101,116,58,32,98,105,110,100,58,32,37,115,10,0,0,0,0,0,0,0,0,108,111,99,97,108,104,111,115,116,0,0,0,0,0,0,0,97,112,111,115,46,116,114,66,97,115,101,91,48,93,0,0,107,105,108,108,115,101,114,118,101,114,0,0,0,0,0,0,99,111,109,95,97,110,115,105,67,111,108,111,114,0,0,0,67,77,95,67,104,97,110,103,101,65,114,101,97,80,111,114,116,97,108,83,116,97,116,101,58,32,98,97,100,32,97,114,101,97,32,110,117,109,98,101,114,0,0,0,0,0,0,0,118,109,95,99,103,97,109,101,0,0,0,0,0,0,0,0,99,111,109,95,98,117,105,108,100,83,99,114,105,112,116,0,98,111,116,95,102,111,114,99,101,119,114,105,116,101,0,0,70,83,95,83,86,95,70,79,112,101,110,70,105,108,101,82,101,97,100,32,40,102,115,95,104,111,109,101,112,97,116,104,41,58,32,37,115,10,0,0,114,98,0,0,0,0,0,0,99,108,95,114,117,110,110,105,110,103,0,0,0,0,0,0,82,101,115,116,114,105,99,116,101,100,32,115,111,117,114,99,101,32,116,114,105,101,100,32,116,111,32,115,101,116,32,34,37,115,34,32,116,111,32,34,37,115,34,0,0,0,0,0,70,114,101,101,87,105,110,100,105,110,103,58,32,102,114,101,101,100,32,97,32,102,114,101,101,100,32,119,105,110,100,105,110,103,0,0,0,0,0,0,115,118,95,114,117,110,110,105,110,103,0,0,0,0,0,0,49,46,50,46,51,0,0,0,67,108,105,101,110,116,32,102,97,116,97,108,32,99,114,97,115,104,101,100,58,32,37,115,0,0,0,0,0,0,0,0,115,118,95,112,97,99,107,101,116,100,101,108,97,121,0,0,112,114,105,110,116,10,85,115,101,114,105,110,102,111,32,115,116,114,105,110,103,32,108,101,110,103,116,104,32,101,120,99,101,101,100,101,100,46,32,32,84,114,121,32,114,101,109,111,118,105,110,103,32,115,101,116,117,32,99,118,97,114,115,32,102,114,111,109,32,121,111,117,114,32,99,111,110,102,105,103,46,10,0,0,0,0,0,0,69,82,82,79,82,58,32,116,111,111,32,109,97,110,121,32,98,101,118,101,108,115,10,0,99,108,95,112,97,99,107,101,116,100,101,108,97,121,0,0,67,77,95,83,101,116,66,111,114,100,101,114,73,110,119,97,114,100,58,32,98,97,100,32,112,97,114,97,109,101,116,101,114,0,0,0,0,0,0,0,99,109,95,110,111,67,117,114,118,101,115,0,0,0,0,0,115,118,95,112,97,117,115,101,100,0,0,0,0,0,0,0,99,108,95,112,97,117,115,101,100,0,0,0,0,0,0,0,83,101,110,100,105,110,103,32,104,101,97,114,116,98,101,97,116,32,116,111,32,37,115,10,0,0,0,0,0,0,0,0,99,111,109,95,99,97,109,101,114,97,77,111,100,101,0,0,43,43,0,0,0,0,0,0,66,111,116,76,105,98,83,104,117,116,100,111,119,110,0,0,109,97,112,110,97,109,101,0,114,101,116,117,114,110,0,0,119,101,97,112,111,110,32,37,100,32,104,97,115,32,110,111,32,110,97,109,101,32,105,110,32,37,115,10,0,0,0,0,40,108,97,115,116,41,32,116,114,97,118,101,108,32,116,121,112,101,32,37,100,32,110,111,116,32,105,109,112,108,101,109,101,110,116,101,100,32,121,101,116,10,0,0,0,0,0,0,105,116,101,109,105,110,102,111,0,0,0,0,0,0,0,0,91,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,105,110,116,101,103,101,114,32,105,110,100,101,120,44,32,102,111,117,110,100,32,37,115,0,0,0,0,0,0,0,0,116,105,109,101,100,101,109,111,0,0,0,0,0,0,0,0,65,65,83,95,65,114,101,97,84,114,97,118,101,108,84,105,109,101,84,111,71,111,97,108,65,114,101,97,58,32,103,111,97,108,97,114,101,97,110,117,109,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,0,0,77,97,112,32,119,105,116,104,32,110,111,32,115,104,97,100,101,114,115,0,0,0,0,0,65,65,83,95,65,114,101,97,82,101,97,99,104,97,98,105,108,105,116,121,58,32,97,114,101,97,110,117,109,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,49,53,48,0,0,0,0,0,109,97,120,101,110,116,105,116,105,101,115,0,0,0,0,0,102,111,114,99,101,114,101,97,99,104,97,98,105,108,105,116,121,0,0,0,0,0,0,0,94,51,87,97,114,110,105,110,103,58,32,67,111,117,108,100,110,39,116,32,111,112,101,110,32,86,77,32,102,105,108,101,32,37,115,10,0,0,0,0,73,110,102,111,95,82,101,109,111,118,101,75,101,121,95,66,105,103,58,32,111,118,101,114,115,105,122,101,32,105,110,102,111,115,116,114,105,110,103,0,87,65,82,78,73,78,71,58,32,78,69,84,95,73,80,83,111,99,107,101,116,58,32,115,101,116,115,111,99,107,111,112,116,32,83,79,95,66,82,79,65,68,67,65,83,84,58,32,37,115,10,0,0,0,0,0,115,101,110,100,32,112,97,99,107,101,116,32,37,52,105,10,0,0,0,0,0,0,0,0,112,111,115,46,116,114,68,101,108,116,97,91,50,93,0,0,115,112,100,101,118,109,97,112,0,0,0,0,0,0,0,0,99,111,109,95,115,112,101,101,100,115,0,0,0,0,0,0,99,111,109,95,115,104,111,119,116,114,97,99,101,0,0,0,98,111,116,95,102,111,114,99,101,114,101,97,99,104,97,98,105,108,105,116,121,0,0,0,119,98,0,0,0,0,0,0,102,105,120,101,100,116,105,109,101,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,83,86,95,85,110,108,105,110,107,69,110,116,105,116,121,58,32,110,111,116,32,102,111,117,110,100,32,105,110,32,119,111,114,108,100,83,101,99,116,111,114,10,0,0,0,0,0,117,105,95,115,105,110,103,108,101,80,108,97,121,101,114,65,99,116,105,118,101,0,0,0,37,115,32,105,115,32,99,104,101,97,116,32,112,114,111,116,101,99,116,101,100,46,10,0,37,115,58,32,68,101,108,116,97,32,114,101,113,117,101,115,116,32,102,114,111,109,32,111,117,116,32,111,102,32,100,97,116,101,32,112,97,99,107,101,116,46,10,0,0,0,0,0,116,105,109,101,115,99,97,108,101,0,0,0,0,0,0,0,83,101,114,118,101,114,32,100,105,100,110,39,116,32,104,97,118,101,32,67,68,10,0,0,99,111,109,95,98,108,111,111,100,0,0,0,0,0,0,0,35,52,54,50,32,78,101,116,99,104,97,110,95,84,114,97,110,115,109,105,116,78,101,120,116,70,114,97,103,109,101,110,116,58,32,101,109,112,116,105,101,100,32,113,117,101,117,101,10,0,0,0,0,0,0,0,37,115,10,0,0,0,0,0,108,111,99,97,108,104,111,115,116,0,0,0,0,0,0,0,56,53,0,0,0,0,0,0,77,65,88,95,70,65,67,69,84,83,0,0,0,0,0,0,48,0,0,0,0,0,0,0,99,111,109,95,109,97,120,102,112,115,0,0,0,0,0,0,49,0,0,0,0,0,0,0,103,97,109,101,95,114,101,115,116,97,114,116,0,0,0,0,105,110,99,111,114,114,101,99,116,32,100,97,116,97,32,99,104,101,99,107,0,0,0,0,45,61,0,0,0,0,0,0,34,0,0,0,0,0,0,0,49,48,50,52,0,0,0,0,58,0,0,0,0,0,0,0,48,0,0,0,0,0,0,0,117,110,107,110,111,119,110,32,100,101,102,105,110,105,116,105,111,110,32,37,115,32,105,110,32,37,115,10,0,0,0,0,99,108,105,101,110,116,32,37,100,32,100,105,100,110,39,116,32,102,105,110,100,32,106,117,109,112,112,97,100,32,114,101,97,99,104,97,98,105,108,105,116,121,10,0,0,0,0,0,99,111,117,110,108,100,110,39,116,32,108,111,97,100,32,37,115,10,0,0,0,0,0,0,116,111,111,32,109,97,110,121,32,125,0,0,0,0,0,0,125,0,0,0,0,0,0,0,119,114,105,116,101,99,111,110,102,105,103,0,0,0,0,0,65,65,83,95,65,114,101,97,84,114,97,118,101,108,84,105,109,101,84,111,71,111,97,108,65,114,101,97,58,32,97,114,101,97,110,117,109,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,65,65,83,95,77,65,88,95,82,69,65,67,72,65,66,73,76,73,84,89,83,73,90,69,10,0,0,0,0,0,0,0,112,104,121,115,95,109,97,120,115,119,105,109,118,101,108,111,99,105,116,121,0,0,0,0,49,50,56,0,0,0,0,0,102,111,114,99,101,99,108,117,115,116,101,114,105,110,103,0,70,97,105,108,101,100,46,10,0,0,0,0,0,0,0,0,73,110,102,111,95,82,101,109,111,118,101,75,101,121,58,32,111,118,101,114,115,105,122,101,32,105,110,102,111,115,116,114,105,110,103,0,0,0,0,0,87,65,82,78,73,78,71,58,32,78,69,84,95,73,80,83,111,99,107,101,116,58,32,105,111,99,116,108,32,70,73,79,78,66,73,79,58,32,37,115,10,0,0,0,0,0,0,0,37,115,58,102,114,97,103,109,101,110,116,76,101,110,103,116,104,32,37,105,32,62,32,109,115,103,45,62,109,97,120,115,105,122,101,10,0,0,0,0,97,112,111,115,46,116,114,66,97,115,101,91,49,93,0,0,115,112,109,97,112,0,0,0,99,104,97,110,103,101,86,101,99,116,111,114,115,0,0,0,113,117,105,116,0,0,0,0,98,111,116,95,102,111,114,99,101,99,108,117,115,116,101,114,105,110,103,0,0,0,0,0,119,114,105,116,105,110,103,32,116,111,58,32,37,115,10,0,102,114,101,101,122,101,0,0,37,115,32,119,105,108,108,32,98,101,32,99,104,97,110,103,101,100,32,117,112,111,110,32,114,101,115,116,97,114,116,105,110,103,46,10,0,0,0,0,99,114,97,115,104,0,0,0,83,101,114,118,101,114,32,100,105,100,110,39,116,32,104,97,118,101,32,67,68,0,0,0,101,114,114,111,114,0,0,0,78,69,84,95,67,111,109,112,97,114,101,66,97,115,101,65,100,114,58,32,98,97,100,32,97,100,100,114,101,115,115,32,116,121,112,101,10,0,0,0,118,115,116,114,32,60,118,97,114,105,97,98,108,101,110,97,109,101,62,32,58,32,101,120,101,99,117,116,101,32,97,32,118,97,114,105,97,98,108,101,32,99,111,109,109,97,110,100,10,0,0,0,0,0,0,0,37,115,58,114,101,99,111,110,110,101,99,116,32,114,101,106,101,99,116,101,100,32,58,32,116,111,111,32,115,111,111,110,10,0,0,0,0,0,0,0,115,101,116,101,110,118,0,0,99,109,95,110,111,65,114,101,97,115,0,0,0,0,0,0,99,111,109,95,97,108,116,105,118,101,99,0,0,0,0,0,93,37,115,10,0,0,0,0,67,111,117,108,100,110,39,116,32,114,101,115,111,108,118,101,32,97,100,100,114,101,115,115,58,32,37,115,10,0,0,0,115,104,111,119,112,97,99,107,101,116,115,0,0,0,0,0,32,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,32,116,111,111,32,102,97,114,32,98,97,99,107,0,0,0,101,120,112,101,99,116,101,100,32,97,32,99,111,109,109,97,44,32,102,111,117,110,100,32,37,115,0,0,0,0,0,0,43,61,0,0,0,0,0,0,116,111,111,32,102,101,119,32,100,101,102,105,110,101,32,112,97,114,109,115,0,0,0,0,109,97,120,101,110,116,105,116,105,101,115,0,0,0,0,0,115,119,105,116,99,104,32,97,108,114,101,97,100,121,32,104,97,115,32,97,32,100,101,102,97,117,108,116,0,0,0,0,99,108,95,112,97,117,115,101,100,0,0,0,0,0,0,0,109,111,114,101,32,116,104,97,110,32,37,100,32,112,114,111,106,101,99,116,105,108,101,115,32,100,101,102,105,110,101,100,32,105,110,32,37,115,10,0,99,108,105,101,110,116,32,37,100,58,32,111,110,32,102,117,110,99,95,98,111,98,98,105,110,103,32,119,105,116,104,111,117,116,32,114,101,97,99,104,97,98,105,108,105,116,121,10,0,0,0,0,0,0,0,0,98,111,116,102,105,108,101,115,0,0,0,0,0,0,0,0,125,0,0,0,0,0,0,0,123,0,0,0,0,0,0,0,32,32,32,32,37,115,10,0,52,48,57,54,0,0,0,0,65,65,83,95,66,101,115,116,82,101,97,99,104,97,98,108,101,65,114,101,97,58,32,97,97,115,32,110,111,116,32,108,111,97,100,101,100,10,0,0,99,109,100,32,37,53,100,58,32,37,115,10,0,0,0,0,112,104,121,115,95,109,97,120,99,114,111,117,99,104,118,101,108,111,99,105,116,121,0,0,109,97,120,99,108,105,101,110,116,115,0,0,0,0,0,0,37,54,100,32,102,111,114,99,101,100,32,112,111,114,116,97,108,32,97,114,101,97,115,10,0,0,0,0,0,0,0,0,76,111,97,100,105,110,103,32,118,109,32,102,105,108,101,32,37,115,46,46,46,10,0,0,73,110,102,111,95,86,97,108,117,101,70,111,114,75,101,121,58,32,111,118,101,114,115,105,122,101,32,105,110,102,111,115,116,114,105,110,103,0,0,0,87,65,82,78,73,78,71,58,32,78,69,84,95,73,80,83,111,99,107,101,116,58,32,115,111,99,107,101,116,58,32,37,115,10,0,0,0,0,0,0,37,115,58,105,108,108,101,103,97,108,32,102,114,97,103,109,101,110,116,32,108,101,110,103,116,104,10,0,0,0,0,0,112,111,115,46,116,114,66,97,115,101,91,50,93,0,0,0,100,101,118,109,97,112,0,0,32,32,32,32,37,115,32,61,32,34,37,115,34,10,0,0,102,115,95,109,97,110,105,102,101,115,116,0,0,0,0,0,98,111,116,95,118,105,115,117,97,108,105,122,101,106,117,109,112,112,97,100,115,0,0,0,70,83,95,83,86,95,70,79,112,101,110,70,105,108,101,87,114,105,116,101,58,32,37,115,10,0,0,0,0,0,0,0,102,115,95,99,100,110,0,0,37,115,32,105,115,32,119,114,105,116,101,32,112,114,111,116,101,99,116,101,100,46,10,0,93,0,0,0,0,0,0,0,105,110,99,111,114,114,101,99,116,32,104,101,97,100,101,114,32,99,104,101,99,107,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,32,99,111,100,101,0,0,0,67,111,109,95,82,97,110,100,111,109,66,121,116,101,115,58,32,117,115,105,110,103,32,119,101,97,107,32,114,97,110,100,111,109,105,122,97,116,105,111,110,10,0,0,0,0,0,0,119,0,0,0,0,0,0,0,48,0,0,0,0,0,0,0,45,0,0,0,0,0,0,0,83,101,114,118,101,114,32,99,114,97,115,104,101,100,58,32,37,115,0,0,0,0,0,0,32,34,0,0,0,0,0,0,101,120,101,99,105,110,103,32,37,115,10,0,0,0,0,0,60,60,61,0,0,0,0,0,113,112,111,114,116,0,0,0,37,52,105,32,116,114,97,99,101,115,32,32,40,37,105,98,32,37,105,112,41,32,37,52,105,32,112,111,105,110,116,115,10,0,0,0,0,0,0,0,67,77,95,76,111,97,100,77,97,112,58,32,78,85,76,76,32,110,97,109,101,0,0,0,102,105,108,101,32,37,115,32,115,116,105,108,108,32,111,112,101,110,32,105,110,32,112,114,101,99,111,109,112,105,108,101,114,10,0,0,0,0,0,0,102,114,97,109,101,58,37,105,32,97,108,108,58,37,51,105,32,115,118,58,37,51,105,32,101,118,58,37,51,105,32,99,108,58,37,51,105,32,103,109,58,37,51,105,32,114,102,58,37,51,105,32,98,107,58,37,51,105,10,0,0,0,0,0,37,115,32,114,101,99,117,114,115,105,118,101,108,121,32,105,110,99,108,117,100,101,100,0,70,83,95,70,105,108,101,70,111,114,72,97,110,100,108,101,58,32,78,85,76,76,0,0,48,0,0,0,0,0,0,0,100,101,100,105,99,97,116,101,100,32,115,101,116,32,116,111,32,48,0,0,0,0,0,0,37,115,58,32,105,110,118,97,108,105,100,32,101,110,116,105,116,121,32,110,117,109,98,101,114,32,37,100,44,32,91,48,44,32,37,100,93,10,0,0,37,115,32,104,97,115,32,110,111,32,73,80,118,54,32,97,100,100,114,101,115,115,46,10,0,0,0,0,0,0,0,0,115,97,121,95,116,101,97,109,32,37,115,0,0,0,0,0,102,111,117,110,100,32,37,115,0,0,0,0,0,0,0,0,70,83,95,70,105,108,101,70,111,114,72,97,110,100,108,101,58,32,99,97,110,39,116,32,103,101,116,32,70,73,76,69,32,111,110,32,122,105,112,32,102,105,108,101,0,0,0,0,100,101,100,105,99,97,116,101,100,0,0,0,0,0,0,0,110,101,103,97,116,105,118,101,32,118,97,108,117,101,32,115,101,116,32,116,111,32,122,101,114,111,0,0,0,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,32,99,111,100,101,0,0,0,44,0,0,0,0,0,0,0,37,61,0,0,0,0,0,0,41,0,0,0,0,0,0,0,49,50,56,0,0,0,0,0,99,97,115,101,0,0,0,0,119,101,97,112,111,110,32,115,116,97,116,101,32,104,97,110,100,108,101,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,0,0,109,97,112,95,114,101,115,116,97,114,116,32,48,0,0,0,32,105,110,116,101,103,101,114,0,0,0,0,0,0,0,0,112,114,111,106,101,99,116,105,108,101,105,110,102,111,0,0,99,108,105,101,110,116,32,37,100,58,32,111,110,32,102,117,110,99,95,112,108,97,116,32,119,105,116,104,111,117,116,32,114,101,97,99,104,97,98,105,108,105,116,121,10,0,0,0,109,97,120,95,105,116,101,109,105,110,102,111,32,61,32,37,100,10,0,0,0,0,0,0,70,83,95,70,105,108,101,70,111,114,72,97,110,100,108,101,58,32,111,117,116,32,111,102,32,114,97,110,103,101,0,0,86,77,95,67,114,101,97,116,101,32,111,110,32,103,97,109,101,32,102,97,105,108,101,100,0,0,0,0,0,0,0,0,123,0,0,0,0,0,0,0,72,105,116,99,104,32,119,97,114,110,105,110,103,58,32,37,105,32,109,115,101,99,32,102,114,97,109,101,32,116,105,109,101,10,0,0,0,0,0,0,115,107,105,108,108,0,0,0,109,97,120,95,114,111,117,116,105,110,103,99,97,99,104,101,0,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,109,111,118,101,32,115,116,97,116,101,32,37,100,10,0,0,116,114,105,103,103,101,114,95,112,117,115,104,32,110,111,116,32,105,110,32,97,110,121,32,106,117,109,112,32,112,97,100,32,97,114,101,97,10,0,0,112,104,121,115,95,109,97,120,119,97,108,107,118,101,108,111,99,105,116,121,0,0,0,0,108,111,97,100,101,100,32,37,115,10,0,0,0,0,0,0,97,114,101,97,32,37,100,32,105,115,32,97,32,102,111,114,99,101,100,32,112,111,114,116,97,108,32,97,114,101,97,13,10,0,0,0,0,0,0,0,118,109,47,37,115,46,113,118,109,0,0,0,0,0,0,0,32,46,46,46,32,0,0,0,79,112,101,110,105,110,103,32,73,80,32,115,111,99,107,101,116,58,32,48,46,48,46,48,46,48,58,37,105,10,0,0,37,115,58,68,114,111,112,112,101,100,32,97,32,109,101,115,115,97,103,101,32,102,114,97,103,109,101,110,116,10,0,0,109,111,100,101,108,0,0,0,71,101,110,101,116,105,99,80,97,114,101,110,116,115,65,110,100,67,104,105,108,100,83,101,108,101,99,116,105,111,110,58,32,116,111,111,32,102,101,119,32,118,97,108,105,100,32,98,111,116,115,10,0,0,0,0,32,102,108,111,97,116,0,0,112,111,115,46,116,114,68,101,108,116,97,91,49,93,0,0,37,115,58,32,78,111,116,32,97,108,108,111,119,101,100,32,116,111,32,109,97,110,105,112,117,108,97,116,101,32,39,37,115,39,32,100,117,101,32,116,111,32,37,115,32,101,120,116,101,110,115,105,111,110,0,0,109,97,112,0,0,0,0,0,87,114,105,116,105,110,103,32,37,115,46,10,0,0,0,0,32,117,110,115,105,103,110,101,100,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,99,104,97,116,32,115,116,97,116,101,32,37,100,10,0,0,46,113,118,109,0,0,0,0,46,99,102,103,0,0,0,0,50,0,0,0,0,0,0,0,70,105,108,101,115,121,115,116,101,109,32,99,97,108,108,32,109,97,100,101,32,119,105,116,104,111,117,116,32,105,110,105,116,105,97,108,105,122,97,116,105,111,110,0,0,0,0,0,105,110,118,97,108,105,100,32,99,104,97,114,97,99,116,101,114,32,37,100,10,0,0,0,109,97,120,95,97,97,115,108,105,110,107,115,0,0,0,0,37,115,0,0,0,0,0,0,32,108,111,110,103,0,0,0,37,100,32,112,111,114,116,97,108,32,99,97,99,104,101,32,117,112,100,97,116,101,115,10,0,0,0,0,0,0,0,0,46,106,115,0,0,0,0,0,85,115,97,103,101,58,32,119,114,105,116,101,99,111,110,102,105,103,32,60,102,105,108,101,110,97,109,101,62,10,0,0,37,115,32,105,115,32,114,101,97,100,32,111,110,108,121,46,10,0,0,0,0,0,0,0,109,111,100,101,108,0,0,0,98,105,110,97,114,121,0,0,70,83,95,72,97,110,100,108,101,70,111,114,70,105,108,101,58,32,110,111,110,101,32,102,114,101,101,0,0,0,0,0,113,51,99,111,110,102,105,103,95,115,101,114,118,101,114,46,99,102,103,0,0,0,0,0,54,0,0,0,0,0,0,0,77,83,71,95,67,111,112,121,58,32,99,97,110,39,116,32,99,111,112,121,32,105,110,116,111,32,97,32,115,109,97,108,108,101,114,32,109,115,103,95,116,32,98,117,102,102,101,114,0,0,0,0,0,0,0,0,65,65,83,32,105,110,105,116,105,97,108,105,122,101,100,46,10,0,0,0,0,0,0,0,99,97,110,39,116,32,115,101,101,107,32,116,111,32,97,97,115,32,108,117,109,112,10,0,111,99,116,97,108,0,0,0,65,65,83,95,69,110,116,105,116,121,73,110,102,111,58,32,97,97,115,119,111,114,108,100,32,110,111,116,32,105,110,105,116,105,97,108,105,122,101,100,10,0,0,0,0,0,0,0,37,100,32,102,105,108,101,115,32,105,110,32,112,107,51,32,102,105,108,101,115,10,0,0,47,47,32,103,101,110,101,114,97,116,101,100,32,98,121,32,113,117,97,107,101,44,32,100,111,32,110,111,116,32,109,111,100,105,102,121,10,0,0,0,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,10,69,82,82,79,82,58,32,37,115,10,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,10,0,0,0,0,112,111,114,116,97,108,32,97,114,101,97,32,37,100,32,105,115,32,115,101,112,101,114,97,116,105,110,103,32,109,111,114,101,32,116,104,97,110,32,116,119,111,32,99,108,117,115,116,101,114,115,13,10,0,0,0,37,108,102,32,37,108,102,32,37,108,102,0,0,0,0,0,99,111,117,108,100,110,39,116,32,101,120,101,99,32,37,115,10,0,0,0,0,0,0,0,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,10,0,50,0,0,0,0,0,0,0,67,111,117,108,100,110,39,116,32,119,114,105,116,101,32,37,115,46,10,0,0,0,0,0,114,43,98,0,0,0,0,0,99,104,97,108,108,101,110,103,101,0,0,0,0,0,0,0,80,97,114,115,101,77,101,115,104,58,32,77,65,88,95,80,65,84,67,72,95,86,69,82,84,83,0,0,0,0,0,0,102,115,95,98,97,115,101,103,97,109,101,0,0,0,0,0,99,111,109,95,104,111,109,101,112,97,116,104,0,0,0,0,101,120,112,101,99,116,101,100,32,97,32,37,115,44,32,102,111,117,110,100,32,37,115,0,102,115,95,99,111,109,112,108,101,116,101,77,97,110,105,102,101,115,116,0,0,0,0,0,98,97,115,101,113,51,0,0,108,111,111,112,98,97,99,107,0,0,0,0,0,0,0,0,82,101,115,111,108,118,105,110,103,32,37,115,32,40,73,80,118,54,41,10,0,0,0,0,48,0,0,0,0,0,0,0,112,117,110,99,116,117,97,116,105,111,110,0,0,0,0,0,102,115,95,109,97,110,105,102,101,115,116,0,0,0,0,0,99,111,109,95,98,97,115,101,103,97,109,101,0,0,0,0,105,110,118,97,108,105,100,32,108,105,116,101,114,97,108,47,108,101,110,103,116,104,32,99,111,100,101,0,0,0,0,0,66,85,71,58,32,110,111,32,115,117,98,32,115,116,114,117,99,116,117,114,101,32,100,101,102,105,110,101,100,0,0,0,47,61,0,0,0,0,0,0,116,111,111,32,109,97,110,121,32,99,111,109,109,97,39,115,0,0,0,0,0,0,0,0,109,97,120,99,108,105,101,110,116,115,0,0,0,0,0,0,100,101,102,97,117,108,116,0,110,101,120,116,109,97,112,0,110,97,109,101,0,0,0,0,119,101,97,112,111,110,32,105,110,102,111,32,110,117,109,98,101,114,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,32,105,110,32,37,115,10,0,0,0,0,0,0,0,116,114,97,118,101,108,32,116,121,112,101,32,37,100,32,110,111,116,32,105,109,112,108,101,109,101,110,116,101,100,32,121,101,116,10,0,0,0,0,0,50,53,54,0,0,0,0,0,99,111,110,116,101,110,116,46,113,117,97,107,101,106,115,46,99,111,109,0,0,0,0,0,118,109,95,103,97,109,101,0,109,111,114,101,32,116,104,97,110,32,51,50,32,99,111,110,116,101,120,116,32,108,101,118,101,108,115,0,0,0,0,0,99,111,109,95,115,116,97,110,100,97,108,111,110,101,0,0,99,111,117,110,108,100,110,39,116,32,108,111,97,100,32,37,115,10,0,0,0,0,0,0,65,65,83,95,65,114,101,97,73,110,102,111,58,32,97,114,101,97,110,117,109,32,37,100,32,111,117,116,32,111,102,32,114,97,110,103,101,10,0,0,114,111,117,116,101,32,99,97,99,104,101,32,100,117,109,112,32,104,97,115,32,119,114,111,110,103,32,118,101,114,115,105,111,110,32,37,100,44,32,115,104,111,117,108,100,32,98,101,32,37,100,10,0,0,0,0,116,114,105,103,103,101,114,95,112,117,115,104,0,0,0,0,51,50,48,0,0,0,0,0,77,83,71,95,87,114,105,116,101,66,105,116,115,58,32,98,97,100,32,98,105,116,115,32,37,105,0,0,0,0,0,0,109,97,112,115,47,37,115,46,97,97,115,0,0,0,0,0,112,111,114,116,97,108,32,97,114,101,97,32,37,100,32,104,97,115,32,110,111,32,98,97,99,107,32,99,108,117,115,116,101,114,13,10,0,0,0,0,37,105,32,115,121,109,98,111,108,115,32,112,97,114,115,101,100,32,102,114,111,109,32,37,115,10,0,0,0,0,0,0,67,111,109,95,115,112,114,105,110,116,102,58,32,79,117,116,112,117,116,32,108,101,110,103,116,104,32,37,100,32,116,111,111,32,115,104,111,114,116,44,32,114,101,113,117,105,114,101,32,37,100,32,98,121,116,101,115,46,10,0,0,0,0,0,79,112,101,110,105,110,103,32,73,80,32,115,111,99,107,101,116,58,32,37,115,58,37,105,10,0,0,0,0,0,0,0,37,115,58,68,114,111,112,112,101,100,32,37,105,32,112,97,99,107,101,116,115,32,97,116,32,37,105,10,0,0,0,0,110,117,109,98,101,114,0,0,112,111,115,46,116,114,68,101,108,116,97,91,48,93,0,0,102,115,95,99,100,110,0,0,115,101,99,116,111,114,108,105,115,116,0,0,0,0,0,0,100,101,118,101,108,111,112,101,114,0,0,0,0,0,0,0,48,0,0,0,0,0,0,0,107,105,99,107,0,0,0,0,69,114,114,111,114,32,100,117,114,105,110,103,32,105,110,105,116,105,97,108,105,122,97,116,105,111,110,0,0,0,0,0,98,111,116,95,109,97,120,100,101,98,117,103,112,111,108,121,115,0,0,0,0,0,0,0,115,116,114,105,110,103,0,0,102,115,95,100,101,98,117,103,0,0,0,0,0,0,0,0,70,101,98,32,50,51,32,50,48,49,52,0,0,0,0,0,108,97,116,99,104,101,100,58,32,34,37,115,34,10,0,0,99,111,117,108,100,110,39,116,32,114,101,97,100,32,101,120,112,101,99,116,101,100,32,116,111,107,101,110,0,0,0,0,45,45,45,45,45,32,70,83,95,83,116,97,114,116,117,112,32,45,45,45,45,45,10,0,101,109,115,99,114,105,112,116,101,110,45,0,0,0,0,0,101,120,112,101,99,116,101,100,32,37,115,44,32,102,111,117,110,100,32,37,115,0,0,0,73,110,118,97,108,105,100,32,103,97,109,101,32,102,111,108,100,101,114,0,0,0,0,0,105,111,113,51,32,49,46,51,54,95,71,73,84,95,52,102,55,100,55,98,102,45,50,48,49,52,45,48,50,45,48,49,0,0,0,0,0,0,0,0,46,99,102,103,0,0,0,0,99,111,117,108,100,110,39,116,32,102,105,110,100,32,101,120,112,101,99,116,101,100,32,37,115,0,0,0,0,0,0,0,101,120,101,99,32,113,51,99,111,110,102,105,103,95,115,101,114,118,101,114,46,99,102,103,10,0,0,0,0,0,0,0,37,115,32,37,115,32,37,115,10,0,0,0,0,0,0,0,32,32,32,32,114,101,106,101,99,116,101,100,32,99,111,110,110,101,99,116,32,102,114,111,109,32,118,101,114,115,105,111,110,32,37,105,10,0,0,0,67,77,111,100,95,76,111,97,100,66,114,117,115,104,83,105,100,101,115,58,32,98,97,100,32,115,104,97,100,101,114,78,117,109,58,32,37,105,0,0,115,116,114,105,110,103,32,108,111,110,103,101,114,32,116,104,97,110,32,77,65,88,95,84,79,75,69,78,32,37,100,0,70,83,95,70,79,112,101,110,70,105,108,101,66,121,77,111,100,101,58,32,98,97,100,32,109,111,100,101,0,0,0,0,102,115,95,103,97,109,101,0,102,111,117,110,100,32,36,32,97,116,32,101,110,100,32,111,102,32,108,105,110,101,0,0,114,99,104,97,116,46,99,0,102,115,95,103,97,109,101,0,71,97,109,101,32,100,105,114,101,99,116,111,114,121,32,99,104,97,110,103,101,100,0,0,37,115,32,104,97,115,32,110,111,32,73,80,118,52,32,97,100,100,114,101,115,115,46,10,0,0,0,0,0,0,0,0,102,111,117,110,100,32,36,32,119,105,116,104,111,117,116,32,110,97,109,101,0,0,0,0,114,99,104,97,116,102,105,108,101,0,0,0,0,0,0,0,106,117,109,112,112,97,100,95,101,110,116,0,0,0,0,0,102,115,95,104,111,109,101,112,97,116,104,0,0,0,0,0,101,120,101,99,32,97,117,116,111,101,120,101,99,46,99,102,103,10,0,0,0,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,115,32,115,101,116,0,0,0,101,120,101,99,32,113,51,99,111,110,102,105,103,95,115,101,114,118,101,114,46,99,102,103,10,0,0,0,0,0,0,0,83,121,115,95,85,110,108,111,97,100,68,108,108,40,78,85,76,76,41,10,0,0,0,0,117,110,107,110,111,119,110,32,115,116,114,117,99,116,117,114,101,32,102,105,101,108,100,32,37,115,0,0,0,0,0,0,42,61,0,0,0,0,0,0,44,0,0,0,0,0,0,0,45,45,45,45,45,45,45,32,66,111,116,76,105,98,32,73,110,105,116,105,97,108,105,122,97,116,105,111,110,32,45,45,45,45,45,45,45,10,0,0,123,0,0,0,0,0,0,0,101,118,97,108,105,110,116,0,115,118,95,114,117,110,110,105,110,103,0,0,0,0,0,0,119,101,97,112,111,110,105,110,102,111,0,0,0,0,0,0,48,0,0,0,0,0,0,0,66,111,116,70,117,110,99,66,111,98,83,116,97,114,116,69,110,100,58,32,110,111,32,101,110,116,105,116,121,32,119,105,116,104,32,109,111,100,101,108,32,37,100,10,0,0,0,0,109,97,120,95,105,116,101,109,105,110,102,111,0,0,0,0,103,114,97,112,112,108,101,80,111,105,110,116,91,50,93,0,102,115,95,98,97,115,101,112,97,116,104,0,0,0,0,0,113,97,103,97,109,101,0,0,99,111,117,110,108,100,110,39,116,32,108,111,97,100,32,37,115,10,0,0,0,0,0,0,97,108,108,98,111,116,115,0,98,111,116,102,105,108,101,115,0,0,0,0,0,0,0,0,65,65,83,95,76,105,110,107,69,110,116,105,116,121,58,32,115,116,97,99,107,32,111,118,101,114,102,108,111,119,10,0,37,115,32,105,115,32,110,111,116,32,97,32,114,111,117,116,101,32,99,97,99,104,101,32,100,117,109,112,10,0,0,0,99,108,97,115,115,110,97,109,101,0,0,0,0,0,0,0,101,120,101,99,32,100,101,102,97,117,108,116,46,99,102,103,10,0,0,0,0,0,0,0,112,104,121,115,95,109,97,120,118,101,108,111,99,105,116,121,0,0,0,0,0,0,0,0,115,97,118,101,114,111,117,116,105,110,103,99,97,99,104,101,0,0,0,0,0,0,0,0,112,111,114,116,97,108,32,97,114,101,97,32,37,100,32,104,97,115,32,110,111,32,102,114,111,110,116,32,99,108,117,115,116,101,114,13,10,0,0,0,87,65,82,78,73,78,71,58,32,105,110,99,111,109,112,108,101,116,101,32,108,105,110,101,32,97,116,32,101,110,100,32,111,102,32,102,105,108,101,10,0,0,0,0,0,0,0,0,81,95,115,116,114,99,97,116,58,32,97,108,114,101,97,100,121,32,111,118,101,114,102,108,111,119,101,100,0,0,0,0,73,80,54,58,32,37,115,10,0,0,0,0,0,0,0,0,37,115,58,79,117,116,32,111,102,32,111,114,100,101,114,32,112,97,99,107,101,116,32,37,105,32,97,116,32,37,105,10,0,0,0,0,0,0,0,0,117,110,107,110,111,119,110,32,112,114,101,99,111,109,112,105,108,101,114,32,100,105,114,101,99,116,105,118,101,32,37,115,0,0,0,0,0,0,0,0,110,111,99,104,97,116,0,0,112,111,115,46,116,114,66,97,115,101,91,49,93,0,0,0,103,114,97,112,112,108,101,80,111,105,110,116,91,49,93,0,67,111,117,108,100,110,39,116,32,108,111,97,100,32,100,101,102,97,117,108,116,46,99,102,103,0,0,0,0,0,0,0,109,97,112,95,114,101,115,116,97,114,116,0,0,0,0,0,97,108,108,0,0,0,0,0,37,115,32,117,110,100,101,102,105,110,101,100,10,0,0,0,102,111,117,110,100,32,35,32,97,116,32,101,110,100,32,111,102,32,108,105,110,101,0,0,109,97,116,99,104,46,99,0,103,114,97,112,112,108,101,80,111,105,110,116,91,48,93,0,100,101,102,97,117,108,116,46,99,102,103,0,0,0,0,0,85,115,97,103,101,58,32,107,105,99,107,32,60,112,108,97,121,101,114,32,110,97,109,101,62,10,107,105,99,107,32,97,108,108,32,61,32,107,105,99,107,32,101,118,101,114,121,111,110,101,10,107,105,99,107,32,97,108,108,98,111,116,115,32,61,32,107,105,99,107,32,97,108,108,32,98,111,116,115,10,0,0,0,0,0,0,0,0,98,111,116,95,100,101,118,101,108,111,112,101,114,0,0,0,98,111,116,95,100,101,98,117,103,0,0,0,0,0,0,0,83,86,95,66,111,116,70,114,101,101,67,108,105,101,110,116,58,32,98,97,100,32,99,108,105,101,110,116,78,117,109,58,32,37,105,0,0,0,0,0,70,83,95,83,86,95,70,79,112,101,110,70,105,108,101,87,114,105,116,101,0,0,0,0,70,83,95,72,111,109,101,82,101,109,111,118,101,0,0,0,70,83,95,70,79,112,101,110,70,105,108,101,87,114,105,116,101,0,0,0,0,0,0,0,70,83,95,70,79,112,101,110,70,105,108,101,65,112,112,101,110,100,0,0,0,0,0,0,70,83,95,70,67,114,101,97,116,101,79,112,101,110,80,105,112,101,70,105,108,101,0,0,0,0,0,0,0,0,0,0,30,0,0,0,31,0,0,0,32,0,0,0,33,0,0,0,34,0,0,0,36,0,0,0,35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,193,0,0,128,193,0,0,0,193,0,0,0,0,0,0,128,65,0,0,128,65,0,0,0,65,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,193,0,0,112,193,0,0,112,193,0,0,0,0,0,0,112,65,0,0,112,65,0,0,112,65,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+51200);



var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}


  
  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    } 
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;

  function _llvm_lifetime_start() {}

  function _llvm_lifetime_end() {}

  var _llvm_va_start=undefined;

  
  
  
   
  Module["_strlen"] = _strlen;
  
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
  
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
  
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
  
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          }
          if (precision === -1) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
  
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
  
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
  
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
  
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
  
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
  
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
  
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
  
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
  
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
  
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
  
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
  
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, Math.max(n - 1, 0));
      if (s < 0) {
        s = -s;
        var buf = _malloc(limit+1);
        HEAP32[((s)>>2)]=buf;
        s = buf;
      }
      for (var i = 0; i < limit; i++) {
        HEAP8[(((s)+(i))|0)]=result[i];
      }
      if (limit < n || (n === undefined)) HEAP8[(((s)+(i))|0)]=0;
      return result.length;
    }function _vsnprintf(s, n, format, va_arg) {
      return _snprintf(s, n, format, HEAP32[((va_arg)>>2)]);
    }

  function _llvm_va_end() {}

  
  
  
  function _isspace(chr) {
      return (chr == 32) || (chr >= 9 && chr <= 13);
    }
  
  
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value;
      return value;
    }
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};function __parseInt(str, endptr, base, min, max, bits, unsign) {
      // Skip space.
      while (_isspace(HEAP8[(str)])) str++;
  
      // Check for a plus/minus sign.
      var multiplier = 1;
      if (HEAP8[(str)] == 45) {
        multiplier = -1;
        str++;
      } else if (HEAP8[(str)] == 43) {
        str++;
      }
  
      // Find base.
      var finalBase = base;
      if (!finalBase) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            finalBase = 16;
            str += 2;
          } else {
            finalBase = 8;
            str++;
          }
        }
      } else if (finalBase==16) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            str += 2;
          }
        }
      }
      if (!finalBase) finalBase = 10;
  
      // Get digits.
      var chr;
      var ret = 0;
      while ((chr = HEAP8[(str)]) != 0) {
        var digit = parseInt(String.fromCharCode(chr), finalBase);
        if (isNaN(digit)) {
          break;
        } else {
          ret = ret * finalBase + digit;
          str++;
        }
      }
  
      // Apply sign.
      ret *= multiplier;
  
      // Set end pointer.
      if (endptr) {
        HEAP32[((endptr)>>2)]=str;
      }
  
      // Unsign if needed.
      if (unsign) {
        if (Math.abs(ret) > max) {
          ret = max;
          ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          ret = unSign(ret, bits);
        }
      }
  
      // Validate range.
      if (ret > max || ret < min) {
        ret = ret > max ? max : min;
        ___setErrNo(ERRNO_CODES.ERANGE);
      }
  
      if (bits == 64) {
        return ((asm["setTempRet0"]((tempDouble=ret,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)),ret>>>0)|0);
      }
  
      return ret;
    }function _strtol(str, endptr, base) {
      return __parseInt(str, endptr, base, -2147483648, 2147483647, 32);  // LONG_MIN, LONG_MAX.
    }function _atoi(ptr) {
      return _strtol(ptr, null, 10);
    }

  
   
  Module["_rand_r"] = _rand_r;
  
  var ___rand_seed=allocate([0x0273459b, 0, 0, 0], "i32", ALLOC_STATIC); 
  Module["_rand"] = _rand;


  
   
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i32=_memset;

  function _strrchr(ptr, chr) {
      var ptr2 = ptr + _strlen(ptr);
      do {
        if (HEAP8[(ptr2)] == chr) return ptr2;
        ptr2--;
      } while (ptr2 >= ptr);
      return 0;
    }

  function _strstr(ptr1, ptr2) {
      var check = 0, start;
      do {
        if (!check) {
          start = ptr1;
          check = ptr2;
        }
        var curr1 = HEAP8[((ptr1++)|0)];
        var curr2 = HEAP8[((check++)|0)];
        if (curr2 == 0) return start;
        if (curr2 != curr1) {
          // rewind to one character after start, to find ez in eeez
          ptr1 = start + 1;
          check = 0;
        }
      } while (curr1);
      return 0;
    }

  var _llvm_memset_p0i8_i64=_memset;

  function _strchr(ptr, chr) {
      ptr--;
      do {
        ptr++;
        var val = HEAP8[(ptr)];
        if (val == chr) return ptr;
      } while (val);
      return 0;
    }

  
   
  Module["_memmove"] = _memmove;var _llvm_memmove_p0i8_p0i8_i32=_memmove;

   
  Module["_strcat"] = _strcat;

  
  
  
  
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 0777, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 0777 | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          fileStore.createIndex('timestamp', 'timestamp', { unique: false });
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function() {
          callback(this.error);
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { timestamp: stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function() { callback(this.error); };
  
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          var index = store.index('timestamp');
  
          index.openKeyCursor().onsuccess = function(event) {
            var cursor = event.target.result;
  
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, entries: entries });
            }
  
            entries[cursor.primaryKey] = { timestamp: cursor.key };
  
            cursor.continue();
          };
        });
      },loadLocalEntry:function (path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode });
        } else if (FS.isFile(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function (path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function() { callback(this.error); };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        transaction.onerror = function() { done(this.error); };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          stream.position = position;
          return position;
        }}};
  
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        if (stream.__proto__) {
          // reuse the object
          stream.__proto__ = FS.FSStream.prototype;
        } else {
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
        }
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },getStreamFromPtr:function (ptr) {
        return FS.streams[ptr - 1];
      },getPtrForStream:function (stream) {
        return stream ? stream.fd + 1 : 0;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            callback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 0666;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 0777;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 0666;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 0666 : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=FS.getPtrForStream(stdin);
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=FS.getPtrForStream(stdout);
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=FS.getPtrForStream(stderr);
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
  
              if (!hasByteServing) chunkSize = datalength;
  
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
  
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
  
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
  
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};var Browser={mainLoop:{scheduler:null,method:"",shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
        // Canvas event setup
  
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
  
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
  
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
  
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
  
  
            var errorInfo = '?';
            function onContextCreationError(event) {
              errorInfo = event.statusMessage || errorInfo;
            }
            canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
            try {
              ['experimental-webgl', 'webgl'].some(function(webglId) {
                return ctx = canvas.getContext(webglId, contextAttributes);
              });
            } finally {
              canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            }
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
  
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          GLctx = Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
  
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
  
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function (event) {
        return Math.max(-1, Math.min(1, event.type === 'DOMMouseScroll' ? event.detail : -event.wheelDelta));
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (scrollX + rect.left);
              y = t.pageY - (scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (scrollX + rect.left);
            y = event.pageY - (scrollY + rect.top);
          }
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
  
  
  var CRC32={TABLE:[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918000,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],Start:function () {
  			return -1;
  		},Update:function (crc, buffer, offset, len) {
  			for (var i = offset, l = offset + len; i < l; i++) {
  				crc = CRC32.TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  			}
  			return crc;
  		},Finish:function (crc) {
  			return (crc ^ -1) >>> 0;
  		}};var SYSC={cb_context_t:{__size__:8,data:0,cb:4},startup_data_t:{__size__:4100,gameName:0,after:4096},download_progress_data_t:{__size__:8,loaded:0,total:4},download_complete_data_t:{__size__:4,progress:0},eula:"LIMITED USE SOFTWARE LICENSE AGREEMENT\n\n \n\nThis Limited Use Software License Agreement (the \"Agreement\") is a legal agreement between you, the end-user, and Id Software, Inc. (\"ID\").  BY CONTINUING THE INSTALLATION OF THIS GAME DEMO PROGRAM ENTITLED QUAKE III: ARENA (THE \"SOFTWARE\"), BY LOADING OR RUNNING THE SOFTWARE, OR BY PLACING OR COPYING THE SOFTWARE ONTO YOUR COMPUTER HARD DRIVE, COMPUTER RAM OR OTHER STORAGE, YOU ARE AGREEING TO BE BOUND BY THE TERMS OF THIS AGREEMENT.\n\n\n\n1.         Grant of License.  Subject to the terms and provisions of this Agreement, ID grants to you the non-exclusive and limited right to use the Software only in executable or object code form. The term \"Software\" includes all elements of the Software, including, without limitation, data files and screen displays.  You are not receiving any ownership or proprietary right, title or interest in or to the Software or the copyright, trademarks, or other rights related thereto.  For purposes of this section, \"use\" means loading the Software into RAM and/or onto computer hard drive, as well as installation of the Software on a hard disk or other storage device and means the uses permitted in section 3. hereinbelow.  You agree that the Software will not be shipped, transferred or exported into any country in violation of the U.S. Export Administration Act (or any other law governing such matters) by you or anyone at your direction and that you will not utilize and will not authorize anyone to utilize, in any other manner, the Software in violation of any applicable law.  The Software may not be downloaded or otherwise exported or exported into (or to a national or resident of) any country to which the U.S. has embargoed goods or to anyone or into any country who/which are prohibited, by applicable law, from receiving such property.\n\n\n\n2.         Prohibitions. You, either directly or indirectly, shall not do any of the following acts:\n\n\n\na.         rent the Software;\n\n\n\nb.         sell the Software;\n\n\n\nc.         lease or lend the Software;\n\n\n\nd.         offer the Software on a \"pay-per-play\" basis;\n\n\n\ne.         distribute the Software (except as permitted by section 3. hereinbelow);\n\n\n\nf.         in any other manner and through any medium whatsoever commercially exploit the Software or use the Software for any commercial purpose;\n\n\n\ng.         disassemble, reverse engineer, decompile, modify or alter the Software including, without limitation, creating or developing extra or add-on levels for the Software;\n\n\n\nh.         translate the Software;\n\n\n\ni.         reproduce or copy the Software (except as permitted by section 3. hereinbelow);\n\n\n\nj.         publicly display the Software;\n\n\n\nk.         prepare or develop derivative works based upon the Software; or\n\n\n\nl.         remove or alter any legal notices or other markings or legends, such as trademark and copyright notices, affixed on or within the Software.\n\n\n\n3.         Permitted Distribution and Copying.  So long as this Agreement accompanies each copy you make of  the Software, and so long as you fully comply, at all times, with this Agreement, ID grants to you the non-exclusive and limited right to copy the Software and to distribute such copies of the Software free of charge for non-commercial purposes which shall include the free of charge distribution of copies of the Software as mounted on the covers of magazines; provided, however, you shall not copy or distribute the Software in any infringing manner or in any manner which violates any law or  third party right and you shall not distribute the Software together with any material which is  infringing, libelous, defamatory, obscene, false, misleading, or  otherwise illegal or unlawful. You agree to label conspicuously as \"SHAREWARE\" or \"DEMO\" each CD or other non-electronic copy of the Software that you make and distribute.  ID reserves all rights not granted in this Agreement. You shall not commercially distribute the Software  unless you first  enter into a separate contract with ID, a copy of which you may request, but which ID may decline to execute. For more information visit www.quake3arena.com.\n\n\n\n4.         Intellectual Property Rights.  The Software and all copyrights, trademarks and all other conceivable intellectual property rights related to the Software are owned by ID and are protected by United States copyright laws, international treaty provisions and all applicable law, such as the Lanham Act.  You must treat the Software like any other copyrighted material, as required by 17 U.S.C., §101 et seq. and other applicable law. You agree to use your best efforts to see that any user of the Software licensed hereunder complies with this Agreement.  You agree that you are receiving a copy of the Software by license only and not by sale and that the \"first sale\" doctrine of 17 U.S.C. §109 does not apply to your receipt or use of the Software.\n\n\n\n5.         NO WARRANTIES.  ID DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE WITH RESPECT TO THE SOFTWARE.  ID DOES NOT WARRANT THAT THE OPERATION OF THE SOFTWARE WILL BE UNINTERRUPTED OR ERROR FREE OR THAT THE SOFTWARE WILL MEET YOUR SPECIFIC REQUIREMENTS.  ADDITIONAL STATEMENTS SUCH AS PRESENTATIONS, WHETHER ORAL OR WRITTEN, DO NOT CONSTITUTE WARRANTIES BY ID AND SHOULD NOT BE RELIED UPON. THIS SECTION 5. SHALL SURVIVE CANCELLATION OR TERMINATION OF THIS AGREEMENT.\n\n\n\n6.         Governing Law, Venue, Indemnity and Liability Limitation.  This Agreement shall be construed in accordance with and governed by the applicable laws of the State of Texas and applicable United States federal law.  Copyright and other proprietary matters will be governed by United States laws and international treaties.  Exclusive venue for all litigation regarding this Agreement shall be in Dallas County, Texas and you agree to submit to the jurisdiction of the courts in Dallas, Texas for any such litigation. You agree to indemnify, defend and hold harmless ID and ID's officers, employees, directors, agents, licensees (excluding you), successors and assigns from and against all losses, lawsuits, damages, causes of action and claims relating to and/or arising from your breach of this Agreement.  You agree that your unauthorized use of the Software, or any part thereof, may immediately and irreparably damage ID such that ID could not be adequately compensated solely by a monetary award and that at ID's option ID shall be entitled to an injunctive order, in addition to all other available remedies including a monetary award, appropriately restraining and/or prohibiting such unauthorized use without the necessity of ID posting bond or other security. IN ANY CASE, ID AND ID'S OFFICERS, EMPLOYEES, DIRECTORS, AGENTS, LICENSEES, SUBLICENSEES, SUCCESSORS AND ASSIGNS SHALL NOT BE LIABLE FOR LOSS OF DATA, LOSS OF PROFITS, LOST SAVINGS, SPECIAL, INCIDENTAL, CONSEQUENTIAL, INDIRECT, PUNITIVE OR OTHER SIMILAR DAMAGES ARISING FROM ANY ALLEGED CLAIM FOR BREACH OF WARRANTY, BREACH OF CONTRACT, NEGLIGENCE, STRICT PRODUCT LIABILITY, OR OTHER LEGAL THEORY EVEN IF ID OR ITS AGENT HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES OR EVEN IF SUCH DAMAGES ARE FORESEEABLE, OR LIABLE FOR ANY CLAIM BY ANY OTHER PARTY.  Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitation or exclusion may not apply to you. This Section 6. shall survive cancellation or termination of this Agreement.\n\n\n\n7.         U.S. Government Restricted Rights. To the extent applicable, the United States Government shall only have those rights to use the Software as expressly stated and expressly limited and restricted in this Agreement, as provided in 48 C.F.R. §§ 227.7201 through 227.7204, inclusive.\n\n\n\n8.         General Provisions.  Neither this Agreement nor any part or portion hereof shall be assigned or sublicensed by you.  ID may assign its rights under this Agreement in ID's sole discretion.  Should any provision of this Agreement be held to be void, invalid, unenforceable or illegal by a court of competent jurisdiction, the validity and enforceability of the other provisions shall not be affected thereby.  If any provision is determined to be unenforceable by a court of competent jurisdiction, you agree to a modification of such provision to provide for enforcement of the provision's intent, to the extent permitted by applicable law. Failure of ID to enforce any provision of this Agreement shall not constitute or be construed as a waiver of such provision or of the right to enforce such provision.  Immediately upon your failure to comply with or breach of any term or provision of this Agreement, THIS AGREEMENT AND YOUR LICENSE SHALL AUTOMATICALLY TERMINATE, WITHOUT NOTICE, AND ID MAY PURSUE ALL RELIEF AND REMEDIES AGAINST YOU WHICH ARE AVAILABLE UNDER APPLICABLE LAW AND/OR THIS AGREEMENT.   In the event this Agreement is terminated, you shall have no right to use the Software, in any manner, and you shall immediately destroy all copies of the Software in your possession, custody or control.\n\n\n\nYOU ACKNOWLEDGE THAT YOU HAVE READ THIS AGREEMENT, YOU UNDERSTAND THIS AGREEMENT, AND UNDERSTAND THAT BY CONTINUING THE INSTALLATION OF THE SOFTWARE, BY LOADING OR RUNNING THE SOFTWARE, OR BY PLACING OR COPYING THE SOFTWARE ONTO YOUR COMPUTER HARD DRIVE OR RAM, YOU AGREE TO BE BOUND BY THE TERMS AND CONDITIONS OF THIS AGREEMENT.  YOU FURTHER AGREE THAT, EXCEPT FOR WRITTEN SEPARATE AGREEMENTS BETWEEN ID AND YOU, THIS AGREEMENT IS A COMPLETE AND EXCLUSIVE STATEMENT OF THE RIGHTS AND LIABILITIES OF THE PARTIES HERETO.  THIS AGREEMENT SUPERSEDES ALL PRIOR ORAL AGREEMENTS, PROPOSALS OR UNDERSTANDINGS, AND ANY OTHER COMMUNICATIONS BETWEEN ID AND YOU RELATING TO THE SUBJECT MATTER OF THIS AGREEMENT.",installers:[{name:"linuxq3ademo-1.11-6.x86.gz.sh",offset:5468,paks:[{src:"demoq3/pak0.pk3",dest:"baseq3/pak0.pk3",checksum:2483777038}]},{name:"linuxq3apoint-1.32b-3.x86.run",offset:8251,paks:[{src:"baseq3/pak1.pk3",dest:"baseq3/pak1.pk3",checksum:1635885364},{src:"baseq3/pak2.pk3",dest:"baseq3/pak2.pk3",checksum:2142044321},{src:"baseq3/pak3.pk3",dest:"baseq3/pak3.pk3",checksum:682311620},{src:"baseq3/pak4.pk3",dest:"baseq3/pak4.pk3",checksum:4113726565},{src:"baseq3/pak5.pk3",dest:"baseq3/pak5.pk3",checksum:590466266},{src:"baseq3/pak6.pk3",dest:"baseq3/pak6.pk3",checksum:231612509},{src:"baseq3/pak7.pk3",dest:"baseq3/pak7.pk3",checksum:3663817674},{src:"baseq3/pak8.pk3",dest:"baseq3/pak8.pk3",checksum:136401958}]}],manifest:null,Print:function (str) {
  			str = allocate(intArrayFromString(str + '\n'), 'i8', ALLOC_STACK);
  
  			_Com_Printf(str);
  		},Error:function (level, err) {
  			if (level === 'fatal') {
  				level = 0;
  			} else if (level === 'drop') {
  				level = 1;
  			} else if (level === 'serverdisconnect') {
  				level = 2;
  			} else if (level === 'disconnect') {
  				level = 3;
  			} else if (level === 'need_cd') {
  				level = 4;
  			} else {
  				level = 0;
  			}
  
  			err = allocate(intArrayFromString(err + '\n'), 'i8', ALLOC_STACK);
  
  			_Com_Error(level, err);
  		},ProxyCallback:function (context) {
  			try {
  				_Com_ProxyCallback(context);
  			} catch (e) {
  				if (e instanceof ExitStatus) {
  					return;
  				}
  				// TODO should we try and call back in using __Error?
  				throw e;
  			}
  		},CRC32File:function (path) {
  			var stack = Runtime.stackSave();
  			var chunkSize = 1024*1024;
  			var bufp = allocate(chunkSize, 'i8', ALLOC_STACK);
  			var crc = CRC32.Start();
  
  			var start = Date.now();
  
  			try {
  				var slab = HEAP8;
  				var n = 0;
  				var pos = 0;
  				var stream = FS.open(path, 'r', 0666);
  				do {
  					n = FS.read(stream, slab, bufp, chunkSize, pos);
  					crc = CRC32.Update(crc, slab, bufp, n);
  					pos += n;
  				} while (n);
  				FS.close(stream);
  			} catch (e) {
  				Runtime.stackRestore(stack);
  				return null;
  			}
  
  			SYSC.Print('generated crc32 for ' + path + ' in ' + ((Date.now() - start) / 1000).toFixed(2) + ' seconds');
  
  			Runtime.stackRestore(stack);
  			return CRC32.Finish(crc);
  		},GetCDN:function () {
  			return Pointer_stringify(_Com_GetCDN());
  		},GetManifest:function () {
  			var manifest = Pointer_stringify(_Com_GetManifest());
  
  			if (!manifest) {
  				return [];
  			}
  
  			return manifest.split(' ').map(function (entry) {
  				var split = entry.split('@');
  
  				return {
  					name: split[0],
  					checksum: parseInt(split[1], 10),
  					compressed: parseInt(split[2], 10)
  				};
  			});
  		},DownloadAsset:function (asset, onprogress, onload) {
  			var root = SYSC.GetCDN();
  			var name = asset.name.replace(/(.+\/|)(.+?)$/, '$1' + asset.checksum + '-$2');
  			var url = 'http://' + root + '/assets/' + name;
  
  			SYS.DoXHR(url, {
  				dataType: 'arraybuffer',
  				onprogress: onprogress,
  				onload: onload
  			});
  		},DownloadAssets:function (assets, onstartasset, onprogress, onendasset, callback) {
  			var progress = [];
  
  			function downloadedBytes() {
  				return progress.reduce(function (a, b) { return a + b; });
  			}
  
  			function totalBytes() {
  				return assets.reduce(function (a, b) { return a + b.compressed; }, 0);
  			}
  
  			function nextDownload() {
  				nextDownload.pos = nextDownload.pos == undefined ? 0 : nextDownload.pos + 1;
  
  				if (nextDownload.pos >= assets.length) {
  					return callback();
  				}
  
  				var asset = assets[nextDownload.pos];
  
  				onstartasset(asset);
  
  				SYSC.DownloadAsset(asset, function (loaded, total) {
  					progress[nextDownload.pos] = loaded;
  
  					onprogress(downloadedBytes(), totalBytes());
  				}, function (err, data) {
  					if (err) return callback(err);
  
  					onendasset(asset, data, function (err) {
  						if (err) return callback(err);
  
  						setTimeout(nextDownload);
  					});
  				});
  			}
  
  			nextDownload();
  		},UpdateManifest:function (callback) {
  			var fs_cdn = Pointer_stringify(_Cvar_VariableString(allocate(intArrayFromString('fs_cdn'), 'i8', ALLOC_STACK)));
  			var fs_game = Pointer_stringify(_Cvar_VariableString(allocate(intArrayFromString('fs_game'), 'i8', ALLOC_STACK)));
  			var com_basegame = Pointer_stringify(_Cvar_VariableString(allocate(intArrayFromString('com_basegame'), 'i8', ALLOC_STACK)));
  			var mapname = Pointer_stringify(_Cvar_VariableString(allocate(intArrayFromString('mapname'), 'i8', ALLOC_STACK)));
  			var url = 'http://' + fs_cdn + '/assets/manifest.json';
  
  			function isInstaller(name) {
  				return SYSC.installers.some(function (installer) {
  					return installer.name === name;
  				});
  			}
  
  			function isCommon(name) {
  				var basepakRx = RegExp('(' + com_basegame + (fs_game ? '|' + fs_game : '') + ')\/pak.+\.pk3$');
  				return name.match(basepakRx);
  			}
  
  			function isMapPak(name) {
  				return PATH.basename(name) === (mapname + '.pk3');
  			}
  
  			function activePaks(entry) {
  				return isInstaller(entry.name) || isCommon(entry.name) || isMapPak(entry.name);
  			}
  
  			function formatManifestString(manifest) {
  				return manifest.map(function (entry) {
  					return entry.name + '@' + entry.checksum + '@' + entry.compressed;
  				}).join(' ');
  			}
  
  			SYS.DoXHR(url, {
  				dataType: 'json',
  				onload: function (err, manifest) {
  					if (err) return callback(new Error('Failed to download and parse manifest, ' + err.message));
  
  					var fs_manifestName = allocate(intArrayFromString('fs_manifest'), 'i8', ALLOC_STACK);
  					var fs_manifest = allocate(intArrayFromString(formatManifestString(manifest.filter(activePaks))), 'i8', ALLOC_STACK);
  					_Cvar_Set(fs_manifestName, fs_manifest);
  
  					var fs_completeManifestName = allocate(intArrayFromString('fs_completeManifest'), 'i8', ALLOC_STACK);
  					var fs_completeManifest = allocate(intArrayFromString(formatManifestString(manifest)), 'i8', ALLOC_STACK);
  					_Cvar_Set(fs_completeManifestName, fs_completeManifest);
  
  					return callback();
  				}
  			});
  		},SavePak:function (name, buffer, callback) {
  			var fs_homepath = Pointer_stringify(_Cvar_VariableString(allocate(intArrayFromString('fs_homepath'), 'i8', ALLOC_STACK)));
  			var localPath = PATH.join(fs_homepath, name);
  
  			try {
  				FS.mkdir(PATH.dirname(localPath), 0777);
  			} catch (e) {
  				if (e.errno !== ERRNO_CODES.EEXIST) {
  					return callback(e);
  				}
  			}
  
  			FS.writeFile(localPath, new Uint8Array(buffer), { encoding: 'binary', flags: 'w', canOwn: true });
  
  			FS.syncfs(callback);
  		},ValidateInstaller:function (installer) {
  			var fs_homepath = Pointer_stringify(_Cvar_VariableString(allocate(intArrayFromString('fs_homepath'), 'i8', ALLOC_STACK)));
  
  			for (var i = 0; i < installer.paks.length; i++) {
  				var pak = installer.paks[i];
  				var localPath = PATH.join(fs_homepath, pak.dest);
  				var crc = SYSC.CRC32File(localPath);
  
  				if (crc !== pak.checksum) {
  					return false;
  				}
  			}
  
  			return true;
  		},DirtyInstallers:function () {
  			var installers = [];
  			var assets = SYSC.GetManifest();
  
  			for (var i = 0; i < SYSC.installers.length; i++) {
  				var installer = SYSC.installers[i];
  
  				var asset;
  				for (var j = 0; j < assets.length; j++) {
  					if (assets[j].name === installer.name) {
  						asset = assets[j];
  						break;
  					}
  				}
  
  				if (!asset) {
  					return callback(new Error('Failed to find "' + installer.name + '" in manifest'));
  				}
  
  				if (!SYSC.ValidateInstaller(installer)) {
  					// append the installer info to the asset
  					asset.installer = installer;
  
  					installers.push(asset);
  				}
  			}
  
  			return installers;
  		},ExtractInstaller:function (data, paks, callback) {
  			var gunzip = new Zlib.Gunzip(data);
  			var buffer = gunzip.decompress();
  			var tar = new Tar(buffer);
  
  			function nextEntry() {
  				nextEntry.pos = nextEntry.pos == undefined ? 0 : nextEntry.pos + 1;
  
  				if (nextEntry.pos >= paks.length) {
  					return callback();
  				}
  
  				var entry = paks[nextEntry.pos];
  
  				var pakPath = entry.src;
  				var buffer = tar.getContent(pakPath);
  
  				// TODO validate buffer checksum
  
  				SYSC.SavePak(entry.dest, buffer, function (err) {
  					if (err) return callback(err);
  
  					nextEntry();
  				});
  			}
  
  			nextEntry();
  		},SyncInstallers:function (callback) {
  			var downloads = SYSC.DirtyInstallers();
  
  			if (!downloads.length) {
  				return callback();
  			}
  
  			SYS.PromptEULA(function (err) {
  				if (err) return callback(err);
  
  				SYSC.DownloadAssets(downloads, function (asset) {
  					SYS.LoadingDescription('loading ' + asset.name);
  				}, function (loaded, total) {
  					SYS.LoadingProgress(loaded / total);
  				}, function (asset, data, next) {
  					SYSC.ExtractInstaller(new Uint8Array(data, asset.installer.offset), asset.installer.paks, next);
  				}, function (err) {
  					SYS.LoadingDescription(null);
  
  					setTimeout(function () {
  						callback(err);
  					});
  				});
  			});
  		},ValidatePak:function (asset) {
  			var fs_homepath = Pointer_stringify(_Cvar_VariableString(allocate(intArrayFromString('fs_homepath'), 'i8', ALLOC_STACK)));
  			var localPath = PATH.join(fs_homepath, asset.name);
  			var crc = SYSC.CRC32File(localPath);
  
  			return crc === asset.checksum;
  		},DirtyPaks:function () {
  			return SYSC.GetManifest().filter(function (asset) {
  				return asset.name.indexOf('.pk3') !== -1 && !SYSC.ValidatePak(asset);
  			});
  		},SyncPaks:function (callback) {
  			var downloads = SYSC.DirtyPaks();
  
  			SYSC.DownloadAssets(downloads, function (asset) {
  				SYS.LoadingDescription('loading ' + asset.name);
  			}, function (loaded, total) {
  				SYS.LoadingProgress(loaded / total);
  			}, function (asset, data, next) {
  				SYSC.SavePak(asset.name, data, next);
  			}, function (err) {
  				SYS.LoadingDescription(null);
  
  				setTimeout(function () {
  					callback(err);
  				});
  			});
  		},FS_Startup:function (callback) {
  			SYSC.UpdateManifest(function (err) {
  				if (err) return callback(err);
  
  				SYSC.SyncInstallers(function (err) {
  					if (err) return callback(err);
  
  					SYSC.SyncPaks(Browser.safeCallback(callback));
  				});
  			});
  		},FS_Shutdown:function (callback) {
  			callback(null);
  		}};var SYS={timeBase:null,DoXHR:function (url, opts) {
  			if (!url) {
  				return opts.onload(new Error('Must provide a URL'));
  			}
  
  			var http = require('http');
  
  			http.get(url, function (res) {
  				var buf = [];
  
  				res.on('data', function (data) {
  					buf.push(data);
  				});
  
  				res.on('end', function () {
  					var err = null;
  					var data;
  
  					if (!(res.statusCode >= 200 && res.statusCode < 300)) {
  						err = new Error('Couldn\'t load ' + url + '. Status: ' + res.statusCode);
  					} else {
  						var buffer = Buffer.concat(buf);
  
  						// Manually parse out a request expecting a JSON response.
  						if (opts.dataType === 'json') {
  							var str = buffer.toString();
  							try {
  								data = JSON.parse(str);
  							} catch (e) {
  								err = e;
  							}
  						} else {
  							// Convert from node Buffer -> ArrayBuffer.
  							data = (new Uint8Array(buffer)).buffer;
  						}
  					}
  
  					if (opts.onload) {
  						opts.onload(err, data);
  					}
  				});
  			});
  		},LoadingDescription:function (desc) {
  			if (desc) {
  				console.log(desc);
  			}
  		},LoadingProgress:function (frac) {
  			console.log('loaded ' + (frac*100).toFixed(2) + '%');
  		},PromptEULA:function (callback) {
  			var readline = require('readline');
  			var lines = SYSC.eula.split('\n');
  
  			console.log('In order to continue, the official Quake3 demo will need to be installed.');
  			console.log('Please read through the demo\'s EULA and type \'y\' if you agree to it and would like to continue.\n');
  
  			console.log(lines.pop());
  
  			var rl = readline.createInterface(process.stdin, process.stdout);
  			rl.prompt();
  
  			rl.on('line', function (line) {
  				line = line.trim();
  
  				if (lines.length) {
  					console.log(lines.pop());
  					return;
  				}
  
  				if (!line) {
  					rl.setPrompt('Agree? (y/n): ');
  					rl.prompt();
  					return;
  				}
  
  				rl.close();
  
  				if (line !== 'y' && line !== 'yes') {
  					return callback(new Error('You must agree to the EULA to continue'));
  				}
  
  				return callback();
  			});
  		}};function _Sys_Milliseconds() {
  		var time = process.hrtime();
  
  		if (!SYS.timeBase) {
  			SYS.timeBase = time[0] * 1000 + parseInt(time[1] / 1000000, 10);
  		}
  
  		return (time[0] * 1000 + parseInt(time[1] / 1000000, 10)) - SYS.timeBase;
  	}

   
  Module["_strncpy"] = _strncpy;

  var _sin=Math_sin;

  var _cos=Math_cos;

  var _atan2=Math_atan2;

  var _ceilf=Math_ceil;

  var _floorf=Math_floor;

  var _sqrtf=Math_sqrt;

  
  function _round(x) {
      return (x < 0) ? -Math.round(-x) : Math.round(x);
    }var _roundf=_round;

  function _Sys_Sleep() {
  	}

   
  Module["_strcpy"] = _strcpy;

  var _llvm_memcpy_p0i8_p0i8_i64=_memcpy;

  function _qsort(base, num, size, cmp) {
      if (num == 0 || size == 0) return;
      // forward calls to the JavaScript sort method
      // first, sort the items logically
      var keys = [];
      for (var i = 0; i < num; i++) keys.push(i);
      keys.sort(function(a, b) {
        return Module['dynCall_iii'](cmp, base+a*size, base+b*size);
      });
      // apply the sort
      var temp = _malloc(num*size);
      _memcpy(temp, base, num*size);
      for (var i = 0; i < num; i++) {
        if (keys[i] == i) continue; // already in place
        _memcpy(base+i*size, temp+keys[i]*size, size);
      }
      _free(temp);
    }

  var _fabsf=Math_abs;

  function _strpbrk(ptr1, ptr2) {
      var curr;
      var searchSet = {};
      while (1) {
        var curr = HEAP8[((ptr2++)|0)];
        if (!curr) break;
        searchSet[curr] = 1;
      }
      while (1) {
        curr = HEAP8[(ptr1)];
        if (!curr) break;
        if (curr in searchSet) return ptr1;
        ptr1++;
      }
      return 0;
    }

  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }

  
  var ___tm_current=allocate(44, "i8", ALLOC_STATIC);
  
  
  var ___tm_timezone=allocate(intArrayFromString("GMT"), "i8", ALLOC_STATIC);
  
  
  var _tzname=allocate(8, "i32*", ALLOC_STATIC);
  
  var _daylight=allocate(1, "i32*", ALLOC_STATIC);
  
  var _timezone=allocate(1, "i32*", ALLOC_STATIC);function _tzset() {
      // TODO: Use (malleable) environment variables instead of system settings.
      if (_tzset.called) return;
      _tzset.called = true;
  
      HEAP32[((_timezone)>>2)]=-(new Date()).getTimezoneOffset() * 60;
  
      var winter = new Date(2000, 0, 1);
      var summer = new Date(2000, 6, 1);
      HEAP32[((_daylight)>>2)]=Number(winter.getTimezoneOffset() != summer.getTimezoneOffset());
  
      var winterName = 'GMT'; // XXX do not rely on browser timezone info, it is very unpredictable | winter.toString().match(/\(([A-Z]+)\)/)[1];
      var summerName = 'GMT'; // XXX do not rely on browser timezone info, it is very unpredictable | summer.toString().match(/\(([A-Z]+)\)/)[1];
      var winterNamePtr = allocate(intArrayFromString(winterName), 'i8', ALLOC_NORMAL);
      var summerNamePtr = allocate(intArrayFromString(summerName), 'i8', ALLOC_NORMAL);
      HEAP32[((_tzname)>>2)]=winterNamePtr;
      HEAP32[(((_tzname)+(4))>>2)]=summerNamePtr;
    }function _localtime_r(time, tmPtr) {
      _tzset();
      var date = new Date(HEAP32[((time)>>2)]*1000);
      HEAP32[((tmPtr)>>2)]=date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)]=date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)]=date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)]=date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)]=date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)]=date.getFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)]=date.getDay();
  
      var start = new Date(date.getFullYear(), 0, 1);
      var yday = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      HEAP32[(((tmPtr)+(28))>>2)]=yday;
      HEAP32[(((tmPtr)+(36))>>2)]=start.getTimezoneOffset() * 60;
  
      var dst = Number(start.getTimezoneOffset() != date.getTimezoneOffset());
      HEAP32[(((tmPtr)+(32))>>2)]=dst;
  
      HEAP32[(((tmPtr)+(40))>>2)]=___tm_timezone;
  
      return tmPtr;
    }function _localtime(time) {
      return _localtime_r(time, ___tm_current);
    }

  
  var ___tm_formatted=allocate(44, "i8", ALLOC_STATIC);
  
  
  function _mktime(tmPtr) {
      _tzset();
      var year = HEAP32[(((tmPtr)+(20))>>2)];
      var timestamp = new Date(year >= 1900 ? year : year + 1900,
                               HEAP32[(((tmPtr)+(16))>>2)],
                               HEAP32[(((tmPtr)+(12))>>2)],
                               HEAP32[(((tmPtr)+(8))>>2)],
                               HEAP32[(((tmPtr)+(4))>>2)],
                               HEAP32[((tmPtr)>>2)],
                               0).getTime() / 1000;
      HEAP32[(((tmPtr)+(24))>>2)]=new Date(timestamp).getDay();
      var yday = Math.round((timestamp - (new Date(year, 0, 1)).getTime()) / (1000 * 60 * 60 * 24));
      HEAP32[(((tmPtr)+(28))>>2)]=yday;
      return timestamp;
    }function _asctime_r(tmPtr, buf) {
      var date = new Date(_mktime(tmPtr)*1000);
      var formatted = date.toString();
      var datePart = formatted.replace(/\d{4}.*/, '').replace(/ 0/, '  ');
      var timePart = formatted.match(/\d{2}:\d{2}:\d{2}/)[0];
      formatted = datePart + timePart + ' ' + date.getFullYear() + '\n';
      formatted.split('').forEach(function(chr, index) {
        HEAP8[(((buf)+(index))|0)]=chr.charCodeAt(0);
      });
      HEAP8[(((buf)+(25))|0)]=0;
      return buf;
    }function _asctime(tmPtr) {
      return _asctime_r(tmPtr, ___tm_formatted);
    }

  
  
  
  
  
  
  
  function _mkport() { throw 'TODO' }var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 0777, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
  
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
  
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
  
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
  
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
  
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
  
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
  
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {headers: {'websocket-protocol': ['binary']}} : ['binary'];
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
  
  
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
  
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
  
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
  
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
  
          function handleOpen() {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          }
  
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
  
  
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
  
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          }
  
          function handleClose() {
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
  
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', handleClose);
            peer.socket.on('close', handleClose);
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
            peer.socket.onerror = handleClose;
            peer.socket.onclose = handleClose;
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
  
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
  
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
  
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
  
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
  
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
  
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
  
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
  
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
  
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
  
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
  
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
  
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
  
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
  
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
  
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
  
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
  
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
  
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
  
  
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
  
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _fileno(stream) {
      // int fileno(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fileno.html
      return FS.getStreamFromPtr(stream).fd;
    }function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr;
      var fd = _fileno(stream);
      var ret = _write(fd, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _putchar(c) {
      // int putchar(int c);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/putchar.html
      return _fputc(c, HEAP32[((_stdout)>>2)]);
    } 
  Module["_saveSetjmp"] = _saveSetjmp;
  
   
  Module["_testSetjmp"] = _testSetjmp;function _longjmp(env, value) {
      asm['setThrew'](env, value || 1);
      throw 'longjmp';
    }

  var _setjmp=undefined;

  function _toupper(chr) {
      if (chr >= 97 && chr <= 122) {
        return chr - 97 + 65;
      } else {
        return chr;
      }
    }

  function _Sys_SetEnv(name, value) {
  		name = Pointer_stringify(name);
  		value = Pointer_stringify(value);
  	}

  
  
  
  
  var _environ=allocate(1, "i32*", ALLOC_STATIC);var ___environ=_environ;function ___buildEnvironment(env) {
      // WARNING: Arbitrary limit!
      var MAX_ENV_VALUES = 64;
      var TOTAL_ENV_SIZE = 1024;
  
      // Statically allocate memory for the environment.
      var poolPtr;
      var envPtr;
      if (!___buildEnvironment.called) {
        ___buildEnvironment.called = true;
        // Set default values. Use string keys for Closure Compiler compatibility.
        ENV['USER'] = 'root';
        ENV['PATH'] = '/';
        ENV['PWD'] = '/';
        ENV['HOME'] = '/home/emscripten';
        ENV['LANG'] = 'en_US.UTF-8';
        ENV['_'] = './this.program';
        // Allocate memory.
        poolPtr = allocate(TOTAL_ENV_SIZE, 'i8', ALLOC_STATIC);
        envPtr = allocate(MAX_ENV_VALUES * 4,
                          'i8*', ALLOC_STATIC);
        HEAP32[((envPtr)>>2)]=poolPtr;
        HEAP32[((_environ)>>2)]=envPtr;
      } else {
        envPtr = HEAP32[((_environ)>>2)];
        poolPtr = HEAP32[((envPtr)>>2)];
      }
  
      // Collect key=value lines.
      var strings = [];
      var totalSize = 0;
      for (var key in env) {
        if (typeof env[key] === 'string') {
          var line = key + '=' + env[key];
          strings.push(line);
          totalSize += line.length;
        }
      }
      if (totalSize > TOTAL_ENV_SIZE) {
        throw new Error('Environment size exceeded TOTAL_ENV_SIZE!');
      }
  
      // Make new.
      var ptrSize = 4;
      for (var i = 0; i < strings.length; i++) {
        var line = strings[i];
        writeAsciiToMemory(line, poolPtr);
        HEAP32[(((envPtr)+(i * ptrSize))>>2)]=poolPtr;
        poolPtr += line.length + 1;
      }
      HEAP32[(((envPtr)+(strings.length * ptrSize))>>2)]=0;
    }var ENV={};function _getenv(name) {
      // char *getenv(const char *name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/getenv.html
      if (name === 0) return 0;
      name = Pointer_stringify(name);
      if (!ENV.hasOwnProperty(name)) return 0;
  
      if (_getenv.ret) _free(_getenv.ret);
      _getenv.ret = allocate(intArrayFromString(ENV[name]), 'i8', ALLOC_NORMAL);
      return _getenv.ret;
    }

  function _Sys_RandomBytes(string, len) {
  		return false;
  	}

   
  Module["_tolower"] = _tolower;

  function _srand(seed) {
      HEAP32[((___rand_seed)>>2)]=seed
    }

  function _setvbuf(stream, buf, type, size) {
      // int setvbuf(FILE *restrict stream, char *restrict buf, int type, size_t size);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/setvbuf.html
      // TODO: Implement custom buffering.
      return 0;
    }

  function _ftell(stream) {
      // long ftell(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ftell.html
      stream = FS.getStreamFromPtr(stream);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (FS.isChrdev(stream.node.mode)) {
        ___setErrNo(ERRNO_CODES.ESPIPE);
        return -1;
      } else {
        return stream.position;
      }
    }

  
  function _lseek(fildes, offset, whence) {
      // off_t lseek(int fildes, off_t offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/lseek.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        return FS.llseek(stream, offset, whence);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fseek(stream, offset, whence) {
      // int fseek(FILE *stream, long offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fseek.html
      var fd = _fileno(stream);
      var ret = _lseek(fd, offset, whence);
      if (ret == -1) {
        return -1;
      }
      stream = FS.getStreamFromPtr(stream);
      stream.eof = false;
      return 0;
    }

  function _Sys_Mkdir(directory) {
  		directory = Pointer_stringify(directory);
  		try {
  			FS.mkdir(directory, 0777);
  		} catch (e) {
  			if (!(e instanceof FS.ErrnoError)) {
  				SYSC.Error('drop', e.message);
  			}
  			return e.errno === ERRNO_CODES.EEXIST;
  		}
  		return true;
  	}

  
  function _unlink(path) {
      // int unlink(const char *path);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/unlink.html
      path = Pointer_stringify(path);
      try {
        FS.unlink(path);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _rmdir(path) {
      // int rmdir(const char *path);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/rmdir.html
      path = Pointer_stringify(path);
      try {
        FS.rmdir(path);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _remove(path) {
      // int remove(const char *path);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/remove.html
      var ret = _unlink(path);
      if (ret == -1) ret = _rmdir(path);
      return ret;
    }

  function _Sys_FOpen(ospath, mode) {
  		return _fopen(ospath, mode);
  	}

  
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        FS.close(stream);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      var stream = FS.getStream(fildes);
      if (stream) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      var fd = _fileno(stream);
      _fsync(fd);
      return _close(fd);
    }

  function _Sys_Mkfifo(path) {
  		return 0;
  	}

  
  
  function _recv(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _read(fd, buf, len);
    }
  
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStreamFromPtr(stream);
      if (!streamObj) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return 0;
      }
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)|0)]=streamObj.ungotten.pop();
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(streamObj.fd, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return Math.floor(bytesRead / size);
    }

  function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var fd = _fileno(stream);
      var bytesWritten = _write(fd, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }


  function _Sys_ListFiles(directory, ext, filter, numfiles, dironly) {
  		directory = Pointer_stringify(directory);
  		ext = Pointer_stringify(ext);
  		if (ext === '/') {
  			ext = null;
  			dironly = true;
  		}
  
  		// TODO support filter
  		
  		var contents;
  		try {
  			contents = FS.readdir(directory);
  		} catch (e) {
  			HEAP32[((numfiles)>>2)]=0;
  			return null;
  		}
  
  		var matches = [];
  		for (var i = 0; i < contents.length; i++) {
  			var name = contents[i];
  			var stat = FS.stat(PATH.join(directory, name));
  
  			if (dironly && !FS.isDir(stat.mode)) {
  				continue;
  			}
  
  			if ((!ext || name.lastIndexOf(ext) === (name.length - ext.length))) {
  				matches.push(name);
  			}
  		}
  
  		HEAP32[((numfiles)>>2)]=matches.length;
  
  		if (!matches.length) {
  			return null;
  		}
  
  		// return a copy of the match list
  		var list = _Z_Malloc((matches.length + 1) * 4);
  
  		var i;
  		for (i = 0; i < matches.length; i++) {
  			var filename = _S_Malloc(matches[i].length + 1);
  
  			writeStringToMemory(matches[i], filename);
  
  			// write the string's pointer back to the main array
  			HEAP32[(((list)+(i*4))>>2)]=filename;
  		}
  
  		// add a NULL terminator to the list
  		HEAP32[(((list)+(i*4))>>2)]=0;
  
  		return list;
  	}

  function _Sys_FreeFileList(list) {
  		if (!list) {
  			return;
  		}
  
  		var ptr;
  
  		for (var i = 0; (ptr = HEAP32[(((list)+(i*4))>>2)]); i++) {
  			_Z_Free(ptr);
  		}
  
  		_Z_Free(list);
  	}

  function _Sys_FS_Shutdown(context) {
  		var name = allocate(intArrayFromString('fs_homepath'), 'i8', ALLOC_STACK);
  		var fs_homepath = Pointer_stringify(_Cvar_VariableString(name));
  
  		SYSC.FS_Shutdown(Browser.safeCallback(function (err) {
  			if (err) {
  				// FIXME cb_free_context(context)
  				SYSC.Error('fatal', err);
  				return;
  			}
  
  			SYSC.ProxyCallback(context);
  		}));
  	}

  function _Sys_DefaultHomePath() {
  		return 0;
  	}

  function _Sys_FS_Startup(context) {
  		// mount a persistable fs into base if not already mounted
  		var name = allocate(intArrayFromString('fs_homepath'), 'i8', ALLOC_STACK);
  		var fs_homepath = Pointer_stringify(_Cvar_VariableString(name));
  		var localPath = PATH.join('.', fs_homepath);
  
  		// make sure the local path exists
  		var mkdirp = function (p) {
  			try {
  				fs.mkdirSync(p);
  			} catch (e) {
  				// make the subdirectory and then retry
  				if (e.code === 'ENOENT') {
  					mkdirp(PATH.dirname(p));
  					mkdirp(p);
  					return;
  				}
  
  				// if we got any other error, let's see if the directory already exists
  				var stat;
  				try {
  					stat = fs.statSync(p);
  				}
  				catch (e) {
  					SYSC.Error('fatal', e.message);
  					return;
  				}
  
  				if (!stat.isDirectory()) {
  					SYSC.Error('fatal', e.message);
  				}
  			}
  		};
  		mkdirp(localPath);
  
  		// mount up the local filesystem in emscripten
  		var dir;
  		try {
  			dir = FS.mkdir(fs_homepath, 0777);
  		} catch (e) {
  			if (!(e instanceof FS.ErrnoError) || e.errno !== ERRNO_CODES.EEXIST) {
  				SYSC.Error('fatal', e.message);
  			}
  		}
  
  		try {
  			FS.mount(NODEFS, { root: localPath }, fs_homepath);
  		} catch (e) {
  			if (!(e instanceof FS.ErrnoError) || e.errno !== ERRNO_CODES.EBUSY) {
  				SYSC.Error('fatal', e.message);
  			}
  		}
  
  		SYSC.FS_Startup(Browser.safeCallback(function (err) {
  			if (err) {
  				// FIXME cb_free_context(context)
  				SYSC.Error('fatal', err);
  				return;
  			}
  
  			SYSC.ProxyCallback(context);
  		}));
  	}

  
  function _strerror_r(errnum, strerrbuf, buflen) {
      if (errnum in ERRNO_MESSAGES) {
        if (ERRNO_MESSAGES[errnum].length > buflen - 1) {
          return ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          var msg = ERRNO_MESSAGES[errnum];
          writeAsciiToMemory(msg, strerrbuf);
          return 0;
        }
      } else {
        return ___setErrNo(ERRNO_CODES.EINVAL);
      }
    }function _strerror(errnum) {
      if (!_strerror.buffer) _strerror.buffer = _malloc(256);
      _strerror_r(errnum, _strerror.buffer, 256);
      return _strerror.buffer;
    }

  function ___errno_location() {
      return ___errno_state;
    }

  
  function _htons(value) {
      return ((value & 0xff) << 8) + ((value & 0xff00) >> 8);
    }var _ntohs=_htons;

  
  
  function __inet_pton4_raw(str) {
      var b = str.split('.');
      for (var i = 0; i < 4; i++) {
        var tmp = Number(b[i]);
        if (isNaN(tmp)) return null;
        b[i] = tmp;
      }
      return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0;
    }
  
  function __inet_pton6_raw(str) {
      var words;
      var w, offset, z, i;
      /* http://home.deds.nl/~aeron/regex/ */
      var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i
      var parts = [];
      if (!valid6regx.test(str)) {
        return null;
      }
      if (str === "::") {
        return [0, 0, 0, 0, 0, 0, 0, 0];
      }
      // Z placeholder to keep track of zeros when splitting the string on ":"
      if (str.indexOf("::") === 0) {
        str = str.replace("::", "Z:"); // leading zeros case
      } else {
        str = str.replace("::", ":Z:");
      }
  
      if (str.indexOf(".") > 0) {
        // parse IPv4 embedded stress
        str = str.replace(new RegExp('[.]', 'g'), ":");
        words = str.split(":");
        words[words.length-4] = parseInt(words[words.length-4]) + parseInt(words[words.length-3])*256;
        words[words.length-3] = parseInt(words[words.length-2]) + parseInt(words[words.length-1])*256;
        words = words.slice(0, words.length-2);
      } else {
        words = str.split(":");
      }
  
      offset = 0; z = 0;
      for (w=0; w < words.length; w++) {
        if (typeof words[w] === 'string') {
          if (words[w] === 'Z') {
            // compressed zeros - write appropriate number of zero words
            for (z = 0; z < (8 - words.length+1); z++) {
              parts[w+z] = 0;
            }
            offset = z-1;
          } else {
            // parse hex to field to 16-bit value and write it in network byte-order
            parts[w+offset] = _htons(parseInt(words[w],16));
          }
        } else {
          // parsed IPv4 words
          parts[w+offset] = words[w];
        }
      }
      return [
        (parts[1] << 16) | parts[0],
        (parts[3] << 16) | parts[2],
        (parts[5] << 16) | parts[4],
        (parts[7] << 16) | parts[6]
      ];
    }var DNS={address_map:{id:1,addrs:{},names:{}},lookup_name:function (name) {
        // If the name is already a valid ipv4 / ipv6 address, don't generate a fake one.
        var res = __inet_pton4_raw(name);
        if (res) {
          return name;
        }
        res = __inet_pton6_raw(name);
        if (res) {
          return name;
        }
  
        // See if this name is already mapped.
        var addr;
  
        if (DNS.address_map.addrs[name]) {
          addr = DNS.address_map.addrs[name];
        } else {
          var id = DNS.address_map.id++;
          assert(id < 65535, 'exceeded max address mappings of 65535');
  
          addr = '172.29.' + (id & 0xff) + '.' + (id & 0xff00);
  
          DNS.address_map.names[addr] = name;
          DNS.address_map.addrs[name] = addr;
        }
  
        return addr;
      },lookup_addr:function (addr) {
        if (DNS.address_map.names[addr]) {
          return DNS.address_map.names[addr];
        }
  
        return null;
      }};
  
  
  var Sockets={BUFFER_SIZE:10240,MAX_BUFFER_SIZE:10485760,nextFd:1,fds:{},nextport:1,maxport:65535,peer:null,connections:{},portmap:{},localAddr:4261412874,addrPool:[33554442,50331658,67108874,83886090,100663306,117440522,134217738,150994954,167772170,184549386,201326602,218103818,234881034]};function __write_sockaddr(sa, family, addr, port) {
      switch (family) {
        case 2:
          addr = __inet_pton4_raw(addr);
          HEAP16[((sa)>>1)]=family;
          HEAP32[(((sa)+(4))>>2)]=addr;
          HEAP16[(((sa)+(2))>>1)]=_htons(port);
          break;
        case 10:
          addr = __inet_pton6_raw(addr);
          HEAP32[((sa)>>2)]=family;
          HEAP32[(((sa)+(8))>>2)]=addr[0];
          HEAP32[(((sa)+(12))>>2)]=addr[1];
          HEAP32[(((sa)+(16))>>2)]=addr[2];
          HEAP32[(((sa)+(20))>>2)]=addr[3];
          HEAP16[(((sa)+(2))>>1)]=_htons(port);
          break;
        default:
          return { errno: ERRNO_CODES.EAFNOSUPPORT };
      }
      // kind of lame, but let's match _read_sockaddr's interface
      return {};
    }function _recvfrom(fd, buf, len, flags, addr, addrlen) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
      // read from the socket
      var msg;
      try {
        msg = sock.sock_ops.recvmsg(sock, len);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
  
      if (!msg) {
        // socket is closed
        return 0;
      }
  
      // write the source address out
      if (addr) {
        var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port);
        assert(!res.errno);
      }
      // write the buffer out
      HEAPU8.set(msg.buffer, buf);
  
      return msg.buffer.byteLength;
    }

  
  
  function __inet_ntop4_raw(addr) {
      return (addr & 0xff) + '.' + ((addr >> 8) & 0xff) + '.' + ((addr >> 16) & 0xff) + '.' + ((addr >> 24) & 0xff)
    }
  
  function __inet_ntop6_raw(ints) {
      //  ref:  http://www.ietf.org/rfc/rfc2373.txt - section 2.5.4
      //  Format for IPv4 compatible and mapped  128-bit IPv6 Addresses
      //  128-bits are split into eight 16-bit words
      //  stored in network byte order (big-endian)
      //  |                80 bits               | 16 |      32 bits        |
      //  +-----------------------------------------------------------------+
      //  |               10 bytes               |  2 |      4 bytes        |
      //  +--------------------------------------+--------------------------+
      //  +               5 words                |  1 |      2 words        |
      //  +--------------------------------------+--------------------------+
      //  |0000..............................0000|0000|    IPv4 ADDRESS     | (compatible)
      //  +--------------------------------------+----+---------------------+
      //  |0000..............................0000|FFFF|    IPv4 ADDRESS     | (mapped)
      //  +--------------------------------------+----+---------------------+
      var str = "";
      var word = 0;
      var longest = 0;
      var lastzero = 0;
      var zstart = 0;
      var len = 0;
      var i = 0;
      var parts = [
        ints[0] & 0xffff,
        (ints[0] >> 16),
        ints[1] & 0xffff,
        (ints[1] >> 16),
        ints[2] & 0xffff,
        (ints[2] >> 16),
        ints[3] & 0xffff,
        (ints[3] >> 16)
      ];
  
      // Handle IPv4-compatible, IPv4-mapped, loopback and any/unspecified addresses
  
      var hasipv4 = true;
      var v4part = "";
      // check if the 10 high-order bytes are all zeros (first 5 words)
      for (i = 0; i < 5; i++) {
        if (parts[i] !== 0) { hasipv4 = false; break; }
      }
  
      if (hasipv4) {
        // low-order 32-bits store an IPv4 address (bytes 13 to 16) (last 2 words)
        v4part = __inet_ntop4_raw(parts[6] | (parts[7] << 16));
        // IPv4-mapped IPv6 address if 16-bit value (bytes 11 and 12) == 0xFFFF (6th word)
        if (parts[5] === -1) {
          str = "::ffff:";
          str += v4part;
          return str;
        }
        // IPv4-compatible IPv6 address if 16-bit value (bytes 11 and 12) == 0x0000 (6th word)
        if (parts[5] === 0) {
          str = "::";
          //special case IPv6 addresses
          if(v4part === "0.0.0.0") v4part = ""; // any/unspecified address
          if(v4part === "0.0.0.1") v4part = "1";// loopback address
          str += v4part;
          return str;
        }
      }
  
      // Handle all other IPv6 addresses
  
      // first run to find the longest contiguous zero words
      for (word = 0; word < 8; word++) {
        if (parts[word] === 0) {
          if (word - lastzero > 1) {
            len = 0;
          }
          lastzero = word;
          len++;
        }
        if (len > longest) {
          longest = len;
          zstart = word - longest + 1;
        }
      }
  
      for (word = 0; word < 8; word++) {
        if (longest > 1) {
          // compress contiguous zeros - to produce "::"
          if (parts[word] === 0 && word >= zstart && word < (zstart + longest) ) {
            if (word === zstart) {
              str += ":";
              if (zstart === 0) str += ":"; //leading zeros case
            }
            continue;
          }
        }
        // converts 16-bit words from big-endian to little-endian before converting to hex string
        str += Number(_ntohs(parts[word] & 0xffff)).toString(16);
        str += word < 7 ? ":" : "";
      }
      return str;
    }function __read_sockaddr(sa, salen) {
      // family / port offsets are common to both sockaddr_in and sockaddr_in6
      var family = HEAP16[((sa)>>1)];
      var port = _ntohs(HEAP16[(((sa)+(2))>>1)]);
      var addr;
  
      switch (family) {
        case 2:
          if (salen !== 16) {
            return { errno: ERRNO_CODES.EINVAL };
          }
          addr = HEAP32[(((sa)+(4))>>2)];
          addr = __inet_ntop4_raw(addr);
          break;
        case 10:
          if (salen !== 28) {
            return { errno: ERRNO_CODES.EINVAL };
          }
          addr = [
            HEAP32[(((sa)+(8))>>2)],
            HEAP32[(((sa)+(12))>>2)],
            HEAP32[(((sa)+(16))>>2)],
            HEAP32[(((sa)+(20))>>2)]
          ];
          addr = __inet_ntop6_raw(addr);
          break;
        default:
          return { errno: ERRNO_CODES.EAFNOSUPPORT };
      }
  
      return { family: family, addr: addr, port: port };
    }function _sendto(fd, message, length, flags, dest_addr, dest_len) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
      // read the address and port to send to
      var info = __read_sockaddr(dest_addr, dest_len);
      if (info.errno) {
        ___setErrNo(info.errno);
        return -1;
      }
      var port = info.port;
      var addr = DNS.lookup_addr(info.addr) || info.addr;
  
      // send the message
      try {
        var slab = HEAP8;
        return sock.sock_ops.sendmsg(sock, slab, message, length, addr, port);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }

  function _socket(family, type, protocol) {
      var sock = SOCKFS.createSocket(family, type, protocol);
      assert(sock.stream.fd < 64); // select() assumes socket fd values are in 0..63
      return sock.stream.fd;
    }

  function _ioctl(fd, request, varargs) {
      var stream = FS.getStream(fd);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      var arg = HEAP32[((varargs)>>2)];
  
      try {
        return FS.ioctl(stream, request, arg);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }


  function _setsockopt(fd, level, optname, optval, optlen) {
      console.log('ignoring setsockopt command');
      return 0;
    }


  function _bind(fd, addrp, addrlen) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
      var info = __read_sockaddr(addrp, addrlen);
      if (info.errno) {
        ___setErrNo(info.errno);
        return -1;
      }
      var port = info.port;
      var addr = DNS.lookup_addr(info.addr) || info.addr;
  
      try {
        sock.sock_ops.bind(sock, addr, port);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }

  function _if_nametoindex(a) {
      return 0;
    }

  function _gethostbyname(name) {
      name = Pointer_stringify(name);
  
      // generate hostent
      var ret = _malloc(20); // XXX possibly leaked, as are others here
      var nameBuf = _malloc(name.length+1);
      writeStringToMemory(name, nameBuf);
      HEAP32[((ret)>>2)]=nameBuf;
      var aliasesBuf = _malloc(4);
      HEAP32[((aliasesBuf)>>2)]=0;
      HEAP32[(((ret)+(4))>>2)]=aliasesBuf;
      var afinet = 2;
      HEAP32[(((ret)+(8))>>2)]=afinet;
      HEAP32[(((ret)+(12))>>2)]=4;
      var addrListBuf = _malloc(12);
      HEAP32[((addrListBuf)>>2)]=addrListBuf+8;
      HEAP32[(((addrListBuf)+(4))>>2)]=0;
      HEAP32[(((addrListBuf)+(8))>>2)]=__inet_pton4_raw(DNS.lookup_name(name));
      HEAP32[(((ret)+(16))>>2)]=addrListBuf;
      return ret;
    }

  function _connect(fd, addrp, addrlen) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
      var info = __read_sockaddr(addrp, addrlen);
      if (info.errno) {
        ___setErrNo(info.errno);
        return -1;
      }
      var port = info.port;
      var addr = DNS.lookup_addr(info.addr) || info.addr;
  
      try {
        sock.sock_ops.connect(sock, addr, port);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }



  
  var ___DEFAULT_POLLMASK=5;function _select(nfds, readfds, writefds, exceptfds, timeout) {
      // readfds are supported,
      // writefds checks socket open status
      // exceptfds not supported
      // timeout is always 0 - fully async
      assert(nfds <= 64, 'nfds must be less than or equal to 64');  // fd sets have 64 bits
      assert(!exceptfds, 'exceptfds not supported');
  
      var total = 0;
      
      var srcReadLow = (readfds ? HEAP32[((readfds)>>2)] : 0),
          srcReadHigh = (readfds ? HEAP32[(((readfds)+(4))>>2)] : 0);
      var srcWriteLow = (writefds ? HEAP32[((writefds)>>2)] : 0),
          srcWriteHigh = (writefds ? HEAP32[(((writefds)+(4))>>2)] : 0);
      var srcExceptLow = (exceptfds ? HEAP32[((exceptfds)>>2)] : 0),
          srcExceptHigh = (exceptfds ? HEAP32[(((exceptfds)+(4))>>2)] : 0);
  
      var dstReadLow = 0,
          dstReadHigh = 0;
      var dstWriteLow = 0,
          dstWriteHigh = 0;
      var dstExceptLow = 0,
          dstExceptHigh = 0;
  
      var allLow = (readfds ? HEAP32[((readfds)>>2)] : 0) |
                   (writefds ? HEAP32[((writefds)>>2)] : 0) |
                   (exceptfds ? HEAP32[((exceptfds)>>2)] : 0);
      var allHigh = (readfds ? HEAP32[(((readfds)+(4))>>2)] : 0) |
                    (writefds ? HEAP32[(((writefds)+(4))>>2)] : 0) |
                    (exceptfds ? HEAP32[(((exceptfds)+(4))>>2)] : 0);
  
      function get(fd, low, high, val) {
        return (fd < 32 ? (low & val) : (high & val));
      }
  
      for (var fd = 0; fd < nfds; fd++) {
        var mask = 1 << (fd % 32);
        if (!(get(fd, allLow, allHigh, mask))) {
          continue;  // index isn't in the set
        }
  
        var stream = FS.getStream(fd);
        if (!stream) {
          ___setErrNo(ERRNO_CODES.EBADF);
          return -1;
        }
  
        var flags = ___DEFAULT_POLLMASK;
  
        if (stream.stream_ops.poll) {
          flags = stream.stream_ops.poll(stream);
        }
  
        if ((flags & 1) && get(fd, srcReadLow, srcReadHigh, mask)) {
          fd < 32 ? (dstReadLow = dstReadLow | mask) : (dstReadHigh = dstReadHigh | mask);
          total++;
        }
        if ((flags & 4) && get(fd, srcWriteLow, srcWriteHigh, mask)) {
          fd < 32 ? (dstWriteLow = dstWriteLow | mask) : (dstWriteHigh = dstWriteHigh | mask);
          total++;
        }
        if ((flags & 2) && get(fd, srcExceptLow, srcExceptHigh, mask)) {
          fd < 32 ? (dstExceptLow = dstExceptLow | mask) : (dstExceptHigh = dstExceptHigh | mask);
          total++;
        }
      }
  
      if (readfds) {
        HEAP32[((readfds)>>2)]=dstReadLow;
        HEAP32[(((readfds)+(4))>>2)]=dstReadHigh;
      }
      if (writefds) {
        HEAP32[((writefds)>>2)]=dstWriteLow;
        HEAP32[(((writefds)+(4))>>2)]=dstWriteHigh;
      }
      if (exceptfds) {
        HEAP32[((exceptfds)>>2)]=dstExceptLow;
        HEAP32[(((exceptfds)+(4))>>2)]=dstExceptHigh;
      }
      
      return total;
    }

  function _gethostname(name, namelen) {
      // int gethostname(char *name, size_t namelen);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/gethostname.html
      var host = 'emscripten';
      if (typeof window !== 'undefined' && window.location.host) {
        host = window.location.host;
      }
      var length = Math.min(namelen, host.length);
      for (var i = 0; i < length; i++) {
        HEAP8[(((name)+(i))|0)]=host.charCodeAt(i);
      }
      if (namelen > length) {
        HEAP8[(((name)+(i))|0)]=0;
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.ENAMETOOLONG);
        return -1;
      }
    }

  
  function _htonl(value) {
      return ((value & 0xff) << 24) + ((value & 0xff00) << 8) +
             ((value & 0xff0000) >>> 8) + ((value & 0xff000000) >>> 24);
    }function _getaddrinfo(node, service, hint, out) {
      // Note getaddrinfo currently only returns a single addrinfo with ai_next defaulting to NULL. When NULL
      // hints are specified or ai_family set to AF_UNSPEC or ai_socktype or ai_protocol set to 0 then we
      // really should provide a linked list of suitable addrinfo values.
      var addrs = [];
      var canon = null;
      var addr = 0;
      var port = 0;
      var flags = 0;
      var family = 0;
      var type = 0;
      var proto = 0;
      var ai, last;
  
      function allocaddrinfo(family, type, proto, canon, addr, port) {
        var sa, salen, ai;
        var res;
  
        salen = family === 10 ?
          28 :
          16;
        addr = family === 10 ?
          __inet_ntop6_raw(addr) :
          __inet_ntop4_raw(addr);
        sa = _malloc(salen);
        res = __write_sockaddr(sa, family, addr, port);
        assert(!res.errno);
  
        ai = _malloc(32);
        HEAP32[(((ai)+(4))>>2)]=family;
        HEAP32[(((ai)+(8))>>2)]=type;
        HEAP32[(((ai)+(12))>>2)]=proto;
        if (canon) {
          HEAP32[(((ai)+(24))>>2)]=canon;
        }
        HEAP32[(((ai)+(20))>>2)]=sa;
        if (family === 10) {
          HEAP32[(((ai)+(16))>>2)]=28;
        } else {
          HEAP32[(((ai)+(16))>>2)]=16;
        }
        HEAP32[(((ai)+(28))>>2)]=0;
  
        return ai;
      }
  
      if (hint) {
        flags = HEAP32[((hint)>>2)];
        family = HEAP32[(((hint)+(4))>>2)];
        type = HEAP32[(((hint)+(8))>>2)];
        proto = HEAP32[(((hint)+(12))>>2)];
      }
      if (type && !proto) {
        proto = type === 2 ? 17 : 6;
      }
      if (!type && proto) {
        type = proto === 17 ? 2 : 1;
      }
  
      // If type or proto are set to zero in hints we should really be returning multiple addrinfo values, but for
      // now default to a TCP STREAM socket so we can at least return a sensible addrinfo given NULL hints.
      if (proto === 0) {
        proto = 6;
      }
      if (type === 0) {
        type = 1;
      }
  
      if (!node && !service) {
        return -2;
      }
      if (flags & ~(1|2|4|
          1024|8|16|32)) {
        return -1;
      }
      if (hint !== 0 && (HEAP32[((hint)>>2)] & 2) && !node) {
        return -1;
      }
      if (flags & 32) {
        // TODO
        return -2;
      }
      if (type !== 0 && type !== 1 && type !== 2) {
        return -7;
      }
      if (family !== 0 && family !== 2 && family !== 10) {
        return -6;
      }
  
      if (service) {
        service = Pointer_stringify(service);
        port = parseInt(service, 10);
  
        if (isNaN(port)) {
          if (flags & 1024) {
            return -2;
          }
          // TODO support resolving well-known service names from:
          // http://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.txt
          return -8;
        }
      }
  
      if (!node) {
        if (family === 0) {
          family = 2;
        }
        if ((flags & 1) === 0) {
          if (family === 2) {
            addr = _htonl(2130706433);
          } else {
            addr = [0, 0, 0, 1];
          }
        }
        ai = allocaddrinfo(family, type, proto, null, addr, port);
        HEAP32[((out)>>2)]=ai;
        return 0;
      }
  
      //
      // try as a numeric address
      //
      node = Pointer_stringify(node);
      addr = __inet_pton4_raw(node);
      if (addr !== null) {
        // incoming node is a valid ipv4 address
        if (family === 0 || family === 2) {
          family = 2;
        }
        else if (family === 10 && (flags & 8)) {
          addr = [0, 0, _htonl(0xffff), addr];
          family = 10;
        } else {
          return -2;
        }
      } else {
        addr = __inet_pton6_raw(node);
        if (addr !== null) {
          // incoming node is a valid ipv6 address
          if (family === 0 || family === 10) {
            family = 10;
          } else {
            return -2;
          }
        }
      }
      if (addr != null) {
        ai = allocaddrinfo(family, type, proto, node, addr, port);
        HEAP32[((out)>>2)]=ai;
        return 0;
      }
      if (flags & 4) {
        return -2;
      }
  
      //
      // try as a hostname
      //
      // resolve the hostname to a temporary fake address
      node = DNS.lookup_name(node);
      addr = __inet_pton4_raw(node);
      if (family === 0) {
        family = 2;
      } else if (family === 10) {
        addr = [0, 0, _htonl(0xffff), addr];
      }
      ai = allocaddrinfo(family, type, proto, null, addr, port);
      HEAP32[((out)>>2)]=ai;
      return 0;
    }

  function _freeaddrinfo(ai) {
      var sa = HEAP32[(((ai)+(20))>>2)];
      _free(sa);
      _free(ai);
    }

  function _getnameinfo(sa, salen, node, nodelen, serv, servlen, flags) {
      var info = __read_sockaddr(sa, salen);
      if (info.errno) {
        return -6;
      }
      var port = info.port;
      var addr = info.addr;
  
      if (node && nodelen) {
        var lookup;
        if ((flags & 1) || !(lookup = DNS.lookup_addr(addr))) {
          if (flags & 8) {
            return -2;
          }
        } else {
          addr = lookup;
        }
        if (addr.length >= nodelen) {
          return -12;
        }
        writeStringToMemory(addr, node);
      }
  
      if (serv && servlen) {
        port = '' + port;
        if (port.length > servlen) {
          return -12;
        }
        writeStringToMemory(port, serv);
      }
  
      return 0;
    }

  
  var GAI_ERRNO_MESSAGES={};function _gai_strerror(val) {
      var buflen = 256;
  
      // On first call to gai_strerror we initialise the buffer and populate the error messages.
      if (!_gai_strerror.buffer) {
          _gai_strerror.buffer = _malloc(buflen);
  
          GAI_ERRNO_MESSAGES['0'] = 'Success';
          GAI_ERRNO_MESSAGES['' + -1] = 'Invalid value for \'ai_flags\' field';
          GAI_ERRNO_MESSAGES['' + -2] = 'NAME or SERVICE is unknown';
          GAI_ERRNO_MESSAGES['' + -3] = 'Temporary failure in name resolution';
          GAI_ERRNO_MESSAGES['' + -4] = 'Non-recoverable failure in name res';
          GAI_ERRNO_MESSAGES['' + -6] = '\'ai_family\' not supported';
          GAI_ERRNO_MESSAGES['' + -7] = '\'ai_socktype\' not supported';
          GAI_ERRNO_MESSAGES['' + -8] = 'SERVICE not supported for \'ai_socktype\'';
          GAI_ERRNO_MESSAGES['' + -10] = 'Memory allocation failure';
          GAI_ERRNO_MESSAGES['' + -11] = 'System error returned in \'errno\'';
          GAI_ERRNO_MESSAGES['' + -12] = 'Argument buffer overflow';
      }
  
      var msg = 'Unknown error';
  
      if (val in GAI_ERRNO_MESSAGES) {
        if (GAI_ERRNO_MESSAGES[val].length > buflen - 1) {
          msg = 'Message too long'; // EMSGSIZE message. This should never occur given the GAI_ERRNO_MESSAGES above. 
        } else {
          msg = GAI_ERRNO_MESSAGES[val];
        }
      }
  
      writeAsciiToMemory(msg, _gai_strerror.buffer);
      return _gai_strerror.buffer;
    }

  function _isalnum(chr) {
      return (chr >= 48 && chr <= 57) ||
             (chr >= 97 && chr <= 122) ||
             (chr >= 65 && chr <= 90);
    }

  function _llvm_bswap_i16(x) {
      return ((x&0xff)<<8) | ((x>>8)&0xff);
    }

  function _llvm_bswap_i32(x) {
      return ((x&0xff)<<24) | (((x>>8)&0xff)<<16) | (((x>>16)&0xff)<<8) | (x>>>24);
    }

  
  function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 512;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 1024;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var fd = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return fd === -1 ? 0 : FS.getPtrForStream(FS.getStream(fd));
    }

  function _ferror(stream) {
      // int ferror(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ferror.html
      stream = FS.getStreamFromPtr(stream);
      return Number(stream && stream.error);
    }

  
  var VM={vmHeader_t:{__size__:36,vmMagic:0,instructionCount:4,codeOffset:8,codeLength:12,dataOffset:16,dataLength:20,litLength:24,bssLength:28,jtrgLength:32},vm_t:{__size__:156,programStack:0,systemCall:4,name:8,searchPath:72,dllHandle:76,entryPoint:80,destroy:84,currentlyInterpreting:88,compiled:92,codeBase:96,entryOfs:100,codeLength:104,instructionPointers:108,instructionCount:112,dataBase:116,dataMask:120,stackBottom:124,numSymbols:128,symbols:132,callLevel:136,breakFunction:140,breakCount:144,jumpTableTargets:148,numJumpTableTargets:152},vms:[],SUSPENDED:3735928559,MAX_VMMAIN_ARGS:13,ENTRY_FRAME_SIZE:60,OPSTACK_SIZE:1024,TYPE:{F4:1,I4:2,U4:3},Constant4:function (state) {
  			var v = (HEAP8[(((state.codeBase)+(state.pc))|0)] & 0xff) |
  				((HEAP8[(((state.codeBase)+(state.pc+1))|0)] & 0xff) << 8) |
  				((HEAP8[(((state.codeBase)+(state.pc+2))|0)] & 0xff) << 16) |
  				((HEAP8[(((state.codeBase)+(state.pc+3))|0)] & 0xff) << 24 );
  			state.pc += 4;
  			return v;
  		},Constant1:function (state) {
  			var v = HEAP8[(((state.codeBase)+(state.pc))|0)];
  			state.pc += 1;
  			return v;
  		},FindLabels:function (state) {
  			var labels = {};
  
  			var op, lastop;
  			for (state.instr = 0, state.pc = 0; state.instr < state.instructionCount; state.instr++) {
  				op = HEAP8[(((state.codeBase)+(state.pc))|0)];
  
  				state.pc++;
  
  				// create a label after each unconditional branching operator
  				// FIXME this is a bit excessive
  				if (lastop === 5 /* OP_CALL */ || lastop === 10 /* OP_JUMP */ || lastop === 7 /* OP_POP */ || lastop === 6 /* OP_PUSH */) {
  					labels[state.instr] = true;
  				}
  
  				switch (op) {
  					case 3 /* OP_ENTER */:
  					case 4 /* OP_LEAVE */:
  					case 9 /* OP_LOCAL */:
  					case 34 /* OP_BLOCK_COPY */:
  						VM.Constant4(state);
  					break;
  
  					case 8 /* OP_CONST */:
  						var value = VM.Constant4(state);
  						var nextop = HEAP8[(((state.codeBase)+(state.pc))|0)];
  						if (nextop === 10 /* OP_JUMP */) {
  							labels[value] = true;
  						}
  						break;
  
  					case 33 /* OP_ARG */:
  						VM.Constant1(state);
  					break;
  
  					case 11 /* OP_EQ */:
  					case 12 /* OP_NE */:
  					case 13 /* OP_LTI */:
  					case 14 /* OP_LEI */:
  					case 15 /* OP_GTI */:
  					case 16 /* OP_GEI */:
  					case 17 /* OP_LTU */:
  					case 18 /* OP_LEU */:
  					case 19 /* OP_GTU */:
  					case 20 /* OP_GEU */:
  					case 21 /* OP_EQF */:
  					case 22 /* OP_NEF */:
  					case 23 /* OP_LTF */:
  					case 24 /* OP_LEF */:
  					case 25 /* OP_GTF */:
  					case 26 /* OP_GEF */:
  						// create labels for any explicit branch destination
  						labels[VM.Constant4(state)] = true;
  					break;
  
  					default:
  					break;
  				}
  
  				lastop = op;
  			}
  
  			return labels;
  		},CompileModule:function (name, instructionCount, codeBase, dataBase) {
  			var fs_game = Pointer_stringify(_Cvar_VariableString(allocate(intArrayFromString('fs_game'), 'i8', ALLOC_STACK)));
  
  			var state = {
  				name: name,
  				instructionCount: instructionCount,
  				codeBase: codeBase,
  				dataBase: dataBase,
  				pc: 0,
  				instr: 0
  			};
  
  			var labels = VM.FindLabels(state);
  			var fninstr = 0;
  			var eof = false;
  			var ab = new ArrayBuffer(4);
  			var i32 = new Int32Array(ab);
  			var u32 = new Uint32Array(ab);
  			var f32 = new Float32Array(ab);
  			var callargs = [];
  
  			//
  			// expressions
  			//
  			var exprStack = [];
  
  			function PUSH_EXPR(expr) {
  				exprStack.push(expr);
  			}
  
  			function POP_EXPR(type) {
  				return exprStack.pop();
  			}
  
  			function CAST_STR(type, expr) {
  				switch (type) {
  					case VM.TYPE.F4:
  						return '+(' + expr + ')';
  
  					case VM.TYPE.I4:
  						return '(' + expr + ')|0';
  
  					case VM.TYPE.U4:
  						return '(' + expr + ')>>>0';
  
  					default:
  						throw new Error('unexpected data type');
  				}
  			}
  
  			function BITCAST_STR(type, expr) {
  				if (type === expr.type) {
  					return expr.toString();
  				}
  
  				if (expr.type === VM.TYPE.I4 && type === VM.TYPE.F4) {
  					if (expr instanceof CNST) {
  						i32[0] = expr.value;
  						return CAST_STR(type, f32[0]);
  					}
  
  					if (expr instanceof LOAD4) {
  						// by default, every pointer value is loaded from HEAP32
  						// don't use the scratch array if we can load directly from HEAPF32
  						return CAST_STR(type, 'HEAPF32[((' + OFFSET_STR(expr.addr) + ')>>2)]');
  					}
  
  					return CAST_STR(type, 'i32[0] = ' + expr + ', f32[0]');
  				} else if (expr.type === VM.TYPE.U4 && type === VM.TYPE.F4) {
  					return CAST_STR(type, 'u32[0] = ' + expr + ', f32[0]');
  				} else if (expr.type === VM.TYPE.F4 && type === VM.TYPE.I4) {
  					return CAST_STR(type, 'f32[0] = ' + expr + ', i32[0]');
  				} else if (expr.type === VM.TYPE.U4 && type === VM.TYPE.I4) {
  					return CAST_STR(type, expr.toString());
  				} else if (expr.type === VM.TYPE.F4 && type === VM.TYPE.U4) {
  					return CAST_STR(type, 'f32[0] = ' + expr + ', u32[0]');
  				} else if (expr.type === VM.TYPE.I4 && type === VM.TYPE.U4) {
  					return CAST_STR(type, expr.toString());
  				} else {
  					throw new Error('unsupported bitcast operands ' + expr.type + ' ' + type);
  				}
  			}
  
  			function OFFSET_STR(expr) {
  				if (expr instanceof CNST) {
  					return state.dataBase + expr.value;
  				} else if (expr instanceof LOCAL) {
  					return state.dataBase + expr.offset + '+STACKTOP';
  				}
  				return state.dataBase + '+' + expr;
  			}
  
  			function CNST(value) {
  				var ctor = CNST.ctor;
  				if (!ctor) {
  					ctor = CNST.ctor = function (value) {
  						this.type = VM.TYPE.I4;
  						this.value = value;
  					};
  					ctor.prototype = Object.create(CNST.prototype);
  					ctor.prototype.toString = function () {
  						return this.value.toString();
  					};
  				}
  				return new ctor(value);
  			}
  
  			function LOCAL(offset) {
  				var ctor = LOCAL.ctor;
  				if (!ctor) {
  					ctor = LOCAL.ctor = function (offset) {
  						this.type = VM.TYPE.I4;
  						this.offset = offset;
  					};
  					ctor.prototype = Object.create(LOCAL.prototype);
  					ctor.prototype.toString = function () {
  						return 'STACKTOP+' + this.offset.toString();
  					};
  				}
  				return new ctor(offset);
  			}
  
  			function LOAD4(addr) {
  				var ctor = LOAD4.ctor;
  				if (!ctor) {
  					ctor = LOAD4.ctor = function (addr) {
  						this.type = VM.TYPE.I4;
  						this.addr = addr;
  					};
  					ctor.prototype = Object.create(LOAD4.prototype);
  					ctor.prototype.toString = function () {
  						return 'HEAP32[((' + OFFSET_STR(this.addr) + ')>>2)]';
  					};
  				}
  				return new ctor(addr);
  			}
  
  			function LOAD2(addr) {
  				var ctor = LOAD2.ctor;
  				if (!ctor) {
  					ctor = LOAD2.ctor = function (addr) {
  						this.type = VM.TYPE.I4;
  						this.addr = addr;
  					};
  					ctor.prototype = Object.create(LOAD2.prototype);
  					ctor.prototype.toString = function () {
  						// TODO add makeGetValue u16
  						return 'HEAPU16[' + OFFSET_STR(this.addr) + ' >> 1]';
  					};
  				}
  				return new ctor(addr);
  			}
  
  			function LOAD1(addr) {
  				var ctor = LOAD1.ctor;
  				if (!ctor) {
  					ctor = LOAD1.ctor = function (addr) {
  						this.type = VM.TYPE.I4;
  						this.addr = addr;
  					};
  					ctor.prototype = Object.create(LOAD1.prototype);
  					ctor.prototype.toString = function () {
  						// TODO add makeGetValue u8
  						return 'HEAPU8[' + OFFSET_STR(this.addr) + ']';
  					};
  				}
  				return new ctor(addr);
  			}
  
  			function UNARY(type, op, expr) {
  				var ctor = UNARY.ctor;
  				if (!ctor) {
  					ctor = UNARY.ctor = function (type, op, expr) {
  						this.type = type;
  						this.op = op;
  						this.expr = expr;
  					};
  					ctor.prototype = Object.create(UNARY.prototype);
  					ctor.prototype.toString = function () {
  						var expr = BITCAST_STR(this.type, this.expr);
  
  						switch (this.op) {
  							case 35 /* OP_SEX8 */:
  								return '((' + expr + ')<<24)>>24';
  
  							case 36 /* OP_SEX16 */:
  								return '((' + expr + ')<<16)>>16';
  
  							case 37 /* OP_NEGI */:
  								return '-(' + expr + ')';
  
  							case 49 /* OP_BCOM */:
  								return '(' + expr + ')^-1';
  
  							case 53 /* OP_NEGF */:
  								return '(-.0)-(' + expr + ')';
  
  							default:
  								throw new Error('unknown op type for unary expression');
  						}
  					};
  				}
  				return new ctor(type, op, expr);
  			}
  
  			function BINARY(type, op, lhs, rhs) {
  				var ctor = BINARY.ctor;
  				if (!ctor) {
  					ctor = BINARY.ctor = function (type, op, lhs, rhs) {
  						this.type = type;
  						this.op = op;
  						this.lhs = lhs;
  						this.rhs = rhs;
  					};
  					ctor.prototype = Object.create(BINARY.prototype);
  					ctor.prototype.toString = function () {
  						var lhs = '(' + BITCAST_STR(this.type, this.lhs) + ')';
  						var rhs = '(' + BITCAST_STR(this.type, this.rhs) + ')';
  
  						switch (this.op) {
  							case 38 /* OP_ADD */:
  							case 54 /* OP_ADDF */:
  								return lhs + '+' + rhs;
  
  							case 39 /* OP_SUB */:
  							case 55 /* OP_SUBF */:
  								return lhs + '-' + rhs;
  
  							case 40 /* OP_DIVI */:
  							case 41 /* OP_DIVU */:
  							case 56 /* OP_DIVF */:
  								return lhs + '/' + rhs;
  
  							case 42 /* OP_MODI */:
  							case 43 /* OP_MODU */:
  								return lhs + '%' + rhs;
  
  							case 44 /* OP_MULI */:
  							case 45 /* OP_MULU */:
  								return 'Math.imul(' + lhs + ', ' + rhs +')';
  
  							case 57 /* OP_MULF */:
  								return lhs + '*' + rhs;
  
  							case 46 /* OP_BAND */:
  								return lhs + '&' + rhs;
  
  							case 47 /* OP_BOR */:
  								return lhs + '|' + rhs;
  
  							case 48 /* OP_BXOR */:
  								return lhs + '^' + rhs;
  
  							case 50 /* OP_LSH */:
  								return lhs + '<<' + rhs;
  
  							case 51 /* OP_RSHI */:
  								return lhs + '>>' + rhs;
  
  							case 52 /* OP_RSHU */:
  								return lhs + '>>>' + rhs;
  
  							default:
  								throw new Error('unknown op type for binary expression');
  						}
  					};
  				}
  				return new ctor(type, op, lhs, rhs);
  			}
  
  			function CONVERT(type, from_type, expr) {
  				var ctor = CONVERT.ctor;
  				if (!ctor) {
  					ctor = CONVERT.ctor = function (type, from_type, expr) {
  						this.type = type;
  						this.from_type = from_type;
  						this.expr = expr;
  					};
  					ctor.prototype = Object.create(CONVERT.prototype);
  					ctor.prototype.toString = function () {
  						return CAST_STR(this.type, BITCAST_STR(this.from_type, this.expr));
  					};
  				}
  				return new ctor(type, from_type, expr);
  			}
  
  			//
  			// statements
  			//
  			var moduleStr = '';
  			var indent = 0;
  
  			function EmitStatement(str) {
  				var prefix = '';
  				for (var i = 0; i < indent; i++) {
  					prefix += '\t';
  				}
  				moduleStr += prefix + str + '\n';
  			}
  
  			function EmitEnter(frameSize) {
  				EmitStatement('var fn' + fninstr + ' = FUNCTIONS[' + fninstr + '] = function fn' + fninstr + '(override) {');
  				indent++;
  				EmitStatement('var label = override || ' + fninstr + ';');
  				EmitStatement('while (1) switch (label) {');
  				indent++;
  				EmitStatement('case ' + fninstr + ':');
  				indent++;
  				EmitStatement('STACKTOP -= ' + frameSize + ';');
  			}
  
  			function EmitLeave(frameSize, ret) {
  				// leave the return value on the stack
  				EmitStatement('HEAP32[((' + OFFSET_STR(LOCAL(frameSize - 4)) + ')>>2)]=' + ret + ';');
  				EmitStatement('STACKTOP += ' + frameSize + ';');
  				EmitStatement('return;');
  
  				if (eof) {
  					indent--;
  					indent--;
  					EmitStatement('}');
  					indent--;
  					EmitStatement('};');
  				}
  			}
  
  			function EmitCall(addr) {
  				var translate = {
  					'cgame': {
  						'-101': 'memset',
  						'-102': 'memcpy',
  						'-103': 'strncpy',
  						'-104': 'sin',
  						'-105': 'cos',
  						'-106': 'atan2',
  						'-107': 'sqrt',
  						'-108': 'floor',
  						'-109': 'ceil',
  						'-112': 'acos'
  					},
  					'qagame': {
  						'-101': 'memset',
  						'-102': 'memcpy',
  						'-103': 'strncpy',
  						'-104': 'sin',
  						'-105': 'cos',
  						'-106': 'atan2',
  						'-107': 'sqrt',
  						'-111': 'floor',
  						'-112': 'ceil'
  					},
  					'ui': {
  						'-101': 'memset',
  						'-102': 'memcpy',
  						'-103': 'strncpy',
  						'-104': 'sin',
  						'-105': 'cos',
  						'-106': 'atan2',
  						'-107': 'sqrt',
  						'-108': 'floor',
  						'-109': 'ceil'
  					},
  				};
  
  				// emit return address info
  				EmitStore4(LOCAL(0), fninstr);
  				EmitStore4(LOCAL(4), state.instr + 1);
  
  				// emit args
  				while (callargs.length) {
  					var arg = callargs.shift();
  					EmitStore4(arg.addr, arg.value);
  				}
  
  				// go ahead and directly translate a few syscalls to speed things up
  				var table = translate[state.name];
  				var translation = table && table[addr];
  
  				if (translation) {
  					switch (translation) {
  						case 'memset':
  							EmitStatement('HEAP32[((' + OFFSET_STR(LOCAL(-4)) + ')>>2)]=_memset(' + state.dataBase + '+' + LOAD4(LOCAL(8)) + ', ' + LOAD4(LOCAL(12)) + ', ' + LOAD4(LOCAL(16)) + ');');
  						break;
  
  						case 'memcpy':
  							EmitStatement('HEAP32[((' + OFFSET_STR(LOCAL(-4)) + ')>>2)]=_memcpy(' + state.dataBase + '+' + LOAD4(LOCAL(8)) + ', ' + state.dataBase + '+' + LOAD4(LOCAL(12)) + ', ' + LOAD4(LOCAL(16)) + ');');
  						break;
  
  						case 'strncpy':
  							EmitStatement('HEAP32[((' + OFFSET_STR(LOCAL(-4)) + ')>>2)]=_strncpy(' + state.dataBase + '+' + LOAD4(LOCAL(8)) + ', ' + state.dataBase + '+' + LOAD4(LOCAL(12)) + ', ' + LOAD4(LOCAL(16)) + ');');
  						break;
  
  						case 'sin':
  							EmitStatement('HEAPF32[((' + OFFSET_STR(LOCAL(-4)) + ')>>2)]=Math.sin(' + (BITCAST_STR(VM.TYPE.F4, LOAD4(LOCAL(8)))) + ');');
  						break;
  
  						case 'cos':
  							EmitStatement('HEAPF32[((' + OFFSET_STR(LOCAL(-4)) + ')>>2)]=Math.cos(' + (BITCAST_STR(VM.TYPE.F4, LOAD4(LOCAL(8)))) + ');');
  						break;
  
  						case 'atan2':
  							EmitStatement('HEAPF32[((' + OFFSET_STR(LOCAL(-4)) + ')>>2)]=Math.atan2(' + (BITCAST_STR(VM.TYPE.F4, LOAD4(LOCAL(8)))) + ', ' + (BITCAST_STR(VM.TYPE.F4, LOAD4(LOCAL(12)))) + ');');
  						break;
  
  						case 'sqrt':
  							EmitStatement('HEAPF32[((' + OFFSET_STR(LOCAL(-4)) + ')>>2)]=Math.sqrt(' + (BITCAST_STR(VM.TYPE.F4, LOAD4(LOCAL(8)))) + ');');
  						break;
  
  						case 'floor':
  							EmitStatement('HEAPF32[((' + OFFSET_STR(LOCAL(-4)) + ')>>2)]=Math.floor(' + (BITCAST_STR(VM.TYPE.F4, LOAD4(LOCAL(8)))) + ');');
  						break;
  
  						case 'ceil':
  							EmitStatement('HEAPF32[((' + OFFSET_STR(LOCAL(-4)) + ')>>2)]=Math.ceil(' + (BITCAST_STR(VM.TYPE.F4, LOAD4(LOCAL(8)))) + ');');
  						break;
  
  						case 'acos':
  							EmitStatement('HEAPF32[((' + OFFSET_STR(LOCAL(-4)) + ')>>2)]=Math.acos(' + (BITCAST_STR(VM.TYPE.F4, LOAD4(LOCAL(8)))) + ');');
  						break;
  					}
  				} else {
  					var expr = 'call(' + addr + ')';
  
  					// remove the indirection if we can
  					if (addr instanceof CNST) {
  						if (addr.value >= 0) {
  							expr = 'fn' + addr.value + '()';
  						} else {
  							expr = 'syscall(' + addr.value + ')';
  						}
  					}
  
  					EmitStatement(expr + ';');
  				}
  
  				// push return value to stack
  				PUSH_EXPR(LOAD4(LOCAL(-4)));
  			}
  
  			function EmitJump(label) {
  				EmitStatement('label = ' + label + ';');
  				EmitStatement('break;');
  			}
  
  			function EmitConditionalJump(lhs, rhs, cond, label) {
  				var expr = '(' + lhs + ') ' + cond + ' (' + rhs + ')';
  
  				// MEGA HACK FOR CPMA 1.47
  				// ignore its built in pak-file checking since we repackage our own paks
  				if (fs_game === 'cpma' && name === 'qagame' && (state.instr === 1382 || state.instr === 1392)) {
  					// 1382 is checking if trap_FS_FOpenFile returned 0 for the pak, and if so, jumps to an error block
  					// 1392 is checking if trap_FS_FOpenFile's returned length matches the expected length and if so, jumps to a success block
  					expr = state.instr === 1382 ? '0' : '1';
  				}
  
  				EmitStatement('if (' + expr + ') {');
  				indent++;
  				EmitJump(label);
  				indent--;
  				EmitStatement('}');
  			}
  
  			function EmitStore4(addr, value) {
  				if (value.type === VM.TYPE.F4) {
  					EmitStatement('HEAPF32[((' + OFFSET_STR(addr) + ')>>2)]=' + value + ';');
  				} else {
  					EmitStatement('HEAP32[((' + OFFSET_STR(addr) + ')>>2)]=' + value + ';');
  				}
  			}
  
  			function EmitStore2(addr, value) {
  				EmitStatement('HEAP16[((' + OFFSET_STR(addr) + ')>>1)]=' + value + ';');
  			}
  
  			function EmitStore1(addr, value) {
  				EmitStatement('HEAP8[((' + OFFSET_STR(addr) + ')|0)]=' + value + ';');
  			}
  
  			function EmitBlockCopy(dest, src, bytes) {
  				EmitStatement('(_memcpy(' + OFFSET_STR(dest) + ', ' + OFFSET_STR(src) + ', ' + bytes + ')|0);');
  			}
  
  			EmitStatement('(function () {');
  			indent++;
  
  			EmitStatement('var FUNCTIONS = {};');
  			EmitStatement('var STACKTOP;');
  
  			EmitStatement('function syscall(callnum) {');
  			EmitStatement('\tcallnum = ~callnum;');
  			EmitStatement('\t// save the current vm');
  			EmitStatement('\tvar savedVM = _VM_GetCurrent();');
  			EmitStatement('\tvar stackOnEntry = STACKTOP;');
  			EmitStatement('\tvar image = HEAP32[(((savedVM)+(VM.vm_t.dataBase))>>2)];');
  			EmitStatement('\t// store the callnum in the return address space');
  			EmitStatement('\tvar returnAddr = HEAP32[(((image)+(stackOnEntry + 4))>>2)];');
  			EmitStatement('\tHEAP32[(((image)+(stackOnEntry + 4))>>2)]=callnum;');
  			// MEGA HACK FOR CPMA 1.47
  			// it uses the default model mynx which we don't have. if
  			// it fails to load the default model, the game will exit
  			if (fs_game === 'cpma' && name === 'cgame') {
  				EmitStatement('\tif (callnum === 10 /* trap_FS_FOpenFile */ || callnum === 34 /* trap_S_RegisterSound */ || callnum === 37 /* trap_R_RegisterModel */ || callnum === 38 /* trap_R_RegisterSkin */) {');
  				EmitStatement('\t\tvar modelName = Pointer_stringify(' + state.dataBase + ' + HEAP32[(((image)+(stackOnEntry + 8))>>2)]);');
  				EmitStatement('\t\tif (modelName.indexOf("/mynx") !== -1) {');
  				EmitStatement('\t\t\tmodelName = modelName.replace("/mynx", "/sarge");');
  				EmitStatement('\t\t\tSTACKTOP -= modelName.length+1;');
  				EmitStatement('\t\t\twriteStringToMemory(modelName, ' + state.dataBase + ' + STACKTOP);');
  				EmitStatement('\t\t\tHEAP32[(((image)+(stackOnEntry + 8))>>2)]=STACKTOP;');
  				EmitStatement('\t\t}');
  				EmitStatement('\t}');
  			}
  			EmitStatement('\t// modify VM stack pointer for recursive VM entry');
  			EmitStatement('\tSTACKTOP -= 4;')
  			EmitStatement('\tHEAP32[(((savedVM)+(VM.vm_t.programStack))>>2)]=STACKTOP;');
  			EmitStatement('\t// call into the client');
  			EmitStatement('\tvar systemCall = HEAP32[(((savedVM)+(VM.vm_t.systemCall))>>2)];');
  			EmitStatement('\tvar ret = Runtime.dynCall("ii", systemCall, [image + stackOnEntry + 4]);');
  			EmitStatement('\t// restore return address');
  			EmitStatement('\tHEAP32[(((image)+(stackOnEntry + 4))>>2)]=returnAddr;');
  			EmitStatement('\t// leave the return value on the stack');
  			EmitStatement('\tHEAP32[(((image)+(stackOnEntry - 4))>>2)]=ret;');
  			EmitStatement('\tSTACKTOP = stackOnEntry;');
  			EmitStatement('\tHEAP32[(((savedVM)+(VM.vm_t.programStack))>>2)]=STACKTOP;');
  			EmitStatement('\t_VM_SetCurrent(savedVM);');
  			// intercept trap_UpdateScreen calls coming from cgame and suspend the VM
  			if (name === 'cgame') {
  				EmitStatement('\tif (callnum === 17 /* trap_UpdateScreen */) {');
  				EmitStatement('\t\tthrow { suspend: true };');
  				EmitStatement('\t}');
  			}
  			EmitStatement('\treturn;');
  			EmitStatement('}');
  
  			EmitStatement('function call(addr) {');
  			EmitStatement('\tif (addr >= 0) {');
  			EmitStatement('\t\tvar fn = FUNCTIONS[addr];');
  			EmitStatement('\t\tfn();');
  			EmitStatement('\t\treturn;');
  			EmitStatement('\t}');
  			EmitStatement('\tsyscall(addr);');
  			EmitStatement('}');
  
  			EmitStatement('var ab = new ArrayBuffer(4);');
  			EmitStatement('var i32 = new Int32Array(ab);');
  			EmitStatement('var u32 = new Uint32Array(ab);');
  			EmitStatement('var f32 = new Float32Array(ab);');
  
  			var lastop1, lastop2;
  			for (state.instr = 0, state.pc = 0; state.instr < state.instructionCount; state.instr++) {
  				var op = HEAP8[(((state.codeBase)+(state.pc))|0)];
  
  				state.pc++;
  
  				if (labels[state.instr]) {
  					indent--;
  					EmitStatement('case ' + state.instr + ':');
  					indent++;
  				}
  
  				switch (op) {
  					//
  					// expressions
  					//
  					case 6 /* OP_PUSH */:
  						PUSH_EXPR(CNST(0));
  						eof = true;
  					break;
  
  					case 7 /* OP_POP */:
  						POP_EXPR();
  					break;
  
  					case 8 /* OP_CONST */:
  						PUSH_EXPR(CNST(VM.Constant4(state)));
  					break;
  
  					case 9 /* OP_LOCAL */:
  						PUSH_EXPR(LOCAL(VM.Constant4(state)));
  					break;
  
  					case 27 /* OP_LOAD1 */:
  						PUSH_EXPR(LOAD1(POP_EXPR()));
  					break;
  
  					case 28 /* OP_LOAD2 */:
  						PUSH_EXPR(LOAD2(POP_EXPR()));
  					break;
  
  					case 29 /* OP_LOAD4 */:
  						PUSH_EXPR(LOAD4(POP_EXPR()));
  					break;
  
  					case 35 /* OP_SEX8 */:
  					case 36 /* OP_SEX16 */:
  					case 37 /* OP_NEGI */:
  					case 49 /* OP_BCOM */:
  						PUSH_EXPR(UNARY(VM.TYPE.I4, op, POP_EXPR()));
  					break;
  
  					case 53 /* OP_NEGF */:
  						PUSH_EXPR(UNARY(VM.TYPE.F4, op, POP_EXPR()));
  					break;
  
  					case 38 /* OP_ADD */:
  					case 39 /* OP_SUB */:
  					case 40 /* OP_DIVI */:
  					case 42 /* OP_MODI */:
  					case 44 /* OP_MULI */:
  					case 46 /* OP_BAND */:
  					case 47 /* OP_BOR */:
  					case 48 /* OP_BXOR */:
  					case 50 /* OP_LSH */:
  					case 51 /* OP_RSHI */:
  						var rhs = POP_EXPR();
  						var lhs = POP_EXPR();
  						PUSH_EXPR(BINARY(VM.TYPE.I4, op, lhs, rhs));
  					break;
  
  					case 41 /* OP_DIVU */:
  					case 43 /* OP_MODU */:
  					case 45 /* OP_MULU */:
  					case 52 /* OP_RSHU */:
  						var rhs = POP_EXPR();
  						var lhs = POP_EXPR();
  						PUSH_EXPR(BINARY(VM.TYPE.U4, op, lhs, rhs));
  					break;
  
  					case 54 /* OP_ADDF */:
  					case 55 /* OP_SUBF */:
  					case 56 /* OP_DIVF */:
  					case 57 /* OP_MULF */:
  						var rhs = POP_EXPR();
  						var lhs = POP_EXPR();
  						PUSH_EXPR(BINARY(VM.TYPE.F4, op, lhs, rhs));
  					break;
  
  					case 58 /* OP_CVIF */:
  						PUSH_EXPR(CONVERT(VM.TYPE.F4, VM.TYPE.I4, POP_EXPR()));
  					break;
  
  					case 59 /* OP_CVFI */:
  						PUSH_EXPR(CONVERT(VM.TYPE.I4, VM.TYPE.F4, POP_EXPR()));
  					break;
  
  					//
  					// statements
  					//
  					case 0 /* OP_UNDEF */:
  					case 1 /* OP_IGNORE */:
  					break;
  
  					case 2 /* OP_BREAK */:
  						EmitStatement('debugger;');
  					break;
  
  					case 3 /* OP_ENTER */:
  						fninstr = state.instr;
  						eof = false;
  						EmitEnter(VM.Constant4(state));
  					break;
  
  					case 4 /* OP_LEAVE */:
  						EmitLeave(VM.Constant4(state), BITCAST_STR(VM.TYPE.I4, POP_EXPR()));
  					break;
  
  					case 5 /* OP_CALL */:
  						EmitCall(POP_EXPR());
  					break;
  
  					case 10 /* OP_JUMP */:
  						// OP_LEAVE ops have explicit jumps written out afterwards that we can ignore
  						// RETI4
  						// ADDRGP4 $1
  						// JUMPV
  						var expr = POP_EXPR();
  						if (!(lastop1 === 4 /* OP_LEAVE */ && lastop2 === 8 /* OP_CONST */)) {
  							var instr = BITCAST_STR(VM.TYPE.I4, expr);
  							EmitJump(instr);
  						}
  					break;
  
  					case 11 /* OP_EQ */:
  						var rhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '===', VM.Constant4(state));
  					break;
  
  					case 12 /* OP_NE */:
  						var rhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '!==', VM.Constant4(state));
  					break;
  
  					case 13 /* OP_LTI */:
  						var rhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '<', VM.Constant4(state));
  					break;
  
  					case 14 /* OP_LEI */:
  						var rhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '<=', VM.Constant4(state));
  					break;
  
  					case 15 /* OP_GTI */:
  						var rhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '>', VM.Constant4(state));
  					break;
  
  					case 16 /* OP_GEI */:
  						var rhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '>=', VM.Constant4(state));
  					break;
  
  					case 17 /* OP_LTU */:
  						var rhs = BITCAST_STR(VM.TYPE.U4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.U4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '<', VM.Constant4(state));
  					break;
  
  					case 18 /* OP_LEU */:
  						var rhs = BITCAST_STR(VM.TYPE.U4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.U4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '<=', VM.Constant4(state));
  					break;
  
  					case 19 /* OP_GTU */:
  						var rhs = BITCAST_STR(VM.TYPE.U4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.U4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '>', VM.Constant4(state));
  					break;
  
  					case 20 /* OP_GEU */:
  						var rhs = BITCAST_STR(VM.TYPE.U4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.U4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '>=', VM.Constant4(state));
  					break;
  
  					case 21 /* OP_EQF */:
  						var rhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '===', VM.Constant4(state));
  					break;
  
  					case 22 /* OP_NEF */:
  						var rhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '!==', VM.Constant4(state));
  					break;
  
  					case 23 /* OP_LTF */:
  						var rhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '<', VM.Constant4(state));
  					break;
  
  					case 24 /* OP_LEF */:
  						var rhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '<=', VM.Constant4(state));
  					break;
  
  					case 25 /* OP_GTF */:
  						var rhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '>', VM.Constant4(state));
  					break;
  
  					case 26 /* OP_GEF */:
  						var rhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						var lhs = BITCAST_STR(VM.TYPE.F4, POP_EXPR());
  						EmitConditionalJump(lhs, rhs, '>=', VM.Constant4(state));
  					break;
  
  					case 30 /* OP_STORE1 */:
  						var value = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						var addr = POP_EXPR();
  						EmitStore1(addr, value);
  					break;
  
  					case 31 /* OP_STORE2 */:
  						var value = BITCAST_STR(VM.TYPE.I4, POP_EXPR());
  						var addr = POP_EXPR();
  						EmitStore2(addr, value);
  					break;
  
  					case 32 /* OP_STORE4 */:
  						var value = POP_EXPR();
  						var addr = POP_EXPR();
  						EmitStore4(addr, value);
  					break;
  
  					case 33 /* OP_ARG */:
  						var value = POP_EXPR();
  						var addr = LOCAL(VM.Constant1(state));
  						callargs.push({ addr: addr, value: value });
  					break;
  
  					case 34 /* OP_BLOCK_COPY */:
  						var src = POP_EXPR();
  						var dest = POP_EXPR();
  						var bytes = VM.Constant4(state);
  						EmitBlockCopy(dest, src, bytes);
  					break;
  				}
  
  				lastop1 = lastop2;
  				lastop2 = op;
  			}
  
  			EmitStatement('return Object.create(Object.prototype, {');
  			EmitStatement('\tFUNCTIONS: { value: FUNCTIONS },');
  			EmitStatement('\tSTACKTOP: { get: function () { return STACKTOP; }, set: function (val) { STACKTOP = val; } },');
  			EmitStatement('});');
  			indent--;
  			EmitStatement('})');
  
  			return moduleStr;
  		}};
  
  function _VM_Destroy(vmp) {
  		var handle = HEAP32[(((vmp)+(VM.vm_t.entryOfs))>>2)];
  
  		delete VM.vms[handle];
  	}function _VM_Compile(vmp, headerp) {
  		var current = _VM_GetCurrent();
  		var name = Pointer_stringify(vmp + VM.vm_t.name);
  		var dataBase = HEAP32[(((vmp)+(VM.vm_t.dataBase))>>2)];
  		var codeOffset = HEAP32[(((headerp)+(VM.vmHeader_t.codeOffset))>>2)];
  		var instructionCount = HEAP32[(((headerp)+(VM.vmHeader_t.instructionCount))>>2)];
  
  		var vm;
  		try {
  			var start = Date.now();
  
  			var module = VM.CompileModule(name, instructionCount, headerp + codeOffset, dataBase);
  			vm = eval(module)();
  
  			SYSC.Print('VM file ' + name + ' compiled in ' + (Date.now() - start) + ' milliseconds');
  		} catch (e) {
  			if (e.longjmp || e === 'longjmp') {
  				throw e;
  			}
  			SYSC.Error('fatal', e);
  		}
  
  		var handle = VM.vms.length+1;
  		VM.vms[handle] = vm;
  
  		if (!VM.DestroyPtr) {
  			VM.DestroyPtr = Runtime.addFunction(_VM_Destroy);
  		}
  
  		HEAP32[(((vmp)+(VM.vm_t.entryOfs))>>2)]=handle;
  		HEAP32[(((vmp)+(VM.vm_t.destroy))>>2)]=VM.DestroyPtr;
  	}

  
  function _VM_SuspendCompiled(vmp, stackOnEntry) {
  		var handle = HEAP32[(((vmp)+(VM.vm_t.entryOfs))>>2)];
  		var vm = VM.vms[handle];
  
  		if (!vm) {
  			SYSC.Error('drop', 'invalid vm handle');
  			return;
  		}
  
  		vm.suspended = true;
  		vm.stackOnEntry = stackOnEntry;
  	}function _VM_CallCompiled(vmp, args) {
  		var handle = HEAP32[(((vmp)+(VM.vm_t.entryOfs))>>2)];
  		var vm = VM.vms[handle];
  
  		// we can't re-enter the vm until it's been resumed
  		if (vm.suspended) {
  			SYSC.Error('drop', 'attempted to re-enter suspended vm');
  		}
  
  		// set the current vm
  		var savedVM = _VM_GetCurrent();
  		_VM_SetCurrent(vmp);
  
  		// save off the stack pointer
  		var image = HEAP32[(((vmp)+(VM.vm_t.dataBase))>>2)];
  
  		// set up the stack frame
  		var stackOnEntry = HEAP32[(((vmp)+(VM.vm_t.programStack))>>2)];
  		var stackTop = stackOnEntry - VM.ENTRY_FRAME_SIZE;
  
  		HEAP32[(((image)+(stackTop))>>2)]=-1;
  		HEAP32[(((image)+(stackTop + 4))>>2)]=0;
  
  		for (var i = 0; i < VM.MAX_VMMAIN_ARGS; i++) {
  			var arg = HEAP32[(((args)+(i * 4))>>2)];
  			HEAP32[(((image)+(stackTop + 8 + i * 4))>>2)]=arg;
  		}
  
  		// call into the entry point
  		var result;
  
  		try {
  			var entryPoint = vm.FUNCTIONS[0];
  
  			vm.STACKTOP = stackTop;
  
  			entryPoint();
  
  			if (vm.STACKTOP !== (stackOnEntry - VM.ENTRY_FRAME_SIZE)) {
  				SYSC.Error('fatal', 'program stack corrupted, is ' + vm.STACKTOP + ', expected ' + (stackOnEntry - VM.ENTRY_FRAME_SIZE));
  			}
  
  			result = HEAP32[(((image)+(vm.STACKTOP - 4))>>2)];
  
  			HEAP32[(((vmp)+(VM.vm_t.programStack))>>2)]=stackOnEntry;
  		} catch (e) {
  			if (e.longjmp || e === 'longjmp') {
  				throw e;
  			}
  
  			if (!e.suspend) {
  				SYSC.Error('fatal', e);
  				return;
  			}
  
  			_VM_SuspendCompiled(vmp, stackOnEntry);
  
  			result = VM.SUSPENDED;
  		}
  
  		// restore the current vm
  		_VM_SetCurrent(savedVM);
  
  		// return value is at the top of the stack still
  		return result;
  	}

  function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }

  
  function _rint(x) {
      if (Math.abs(x % 1) !== 0.5) return Math.round(x);
      return x + x % 2 + ((x < 0) ? 1 : -1);
    }var _lrintf=_rint;

  
  
  function __getFloat(text) {
      return /^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?/.exec(text);
    }function __scanString(format, get, unget, varargs) {
      if (!__scanString.whiteSpace) {
        __scanString.whiteSpace = {};
        __scanString.whiteSpace[32] = 1;
        __scanString.whiteSpace[9] = 1;
        __scanString.whiteSpace[10] = 1;
        __scanString.whiteSpace[11] = 1;
        __scanString.whiteSpace[12] = 1;
        __scanString.whiteSpace[13] = 1;
      }
      // Supports %x, %4x, %d.%d, %lld, %s, %f, %lf.
      // TODO: Support all format specifiers.
      format = Pointer_stringify(format);
      var soFar = 0;
      if (format.indexOf('%n') >= 0) {
        // need to track soFar
        var _get = get;
        get = function get() {
          soFar++;
          return _get();
        }
        var _unget = unget;
        unget = function unget() {
          soFar--;
          return _unget();
        }
      }
      var formatIndex = 0;
      var argsi = 0;
      var fields = 0;
      var argIndex = 0;
      var next;
  
      mainLoop:
      for (var formatIndex = 0; formatIndex < format.length;) {
        if (format[formatIndex] === '%' && format[formatIndex+1] == 'n') {
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          HEAP32[((argPtr)>>2)]=soFar;
          formatIndex += 2;
          continue;
        }
  
        if (format[formatIndex] === '%') {
          var nextC = format.indexOf('c', formatIndex+1);
          if (nextC > 0) {
            var maxx = 1;
            if (nextC > formatIndex+1) {
              var sub = format.substring(formatIndex+1, nextC);
              maxx = parseInt(sub);
              if (maxx != sub) maxx = 0;
            }
            if (maxx) {
              var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
              argIndex += Runtime.getAlignSize('void*', null, true);
              fields++;
              for (var i = 0; i < maxx; i++) {
                next = get();
                HEAP8[((argPtr++)|0)]=next;
                if (next === 0) return i > 0 ? fields : fields-1; // we failed to read the full length of this field
              }
              formatIndex += nextC - formatIndex + 1;
              continue;
            }
          }
        }
  
        // handle %[...]
        if (format[formatIndex] === '%' && format.indexOf('[', formatIndex+1) > 0) {
          var match = /\%([0-9]*)\[(\^)?(\]?[^\]]*)\]/.exec(format.substring(formatIndex));
          if (match) {
            var maxNumCharacters = parseInt(match[1]) || Infinity;
            var negateScanList = (match[2] === '^');
            var scanList = match[3];
  
            // expand "middle" dashs into character sets
            var middleDashMatch;
            while ((middleDashMatch = /([^\-])\-([^\-])/.exec(scanList))) {
              var rangeStartCharCode = middleDashMatch[1].charCodeAt(0);
              var rangeEndCharCode = middleDashMatch[2].charCodeAt(0);
              for (var expanded = ''; rangeStartCharCode <= rangeEndCharCode; expanded += String.fromCharCode(rangeStartCharCode++));
              scanList = scanList.replace(middleDashMatch[1] + '-' + middleDashMatch[2], expanded);
            }
  
            var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
            argIndex += Runtime.getAlignSize('void*', null, true);
            fields++;
  
            for (var i = 0; i < maxNumCharacters; i++) {
              next = get();
              if (negateScanList) {
                if (scanList.indexOf(String.fromCharCode(next)) < 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              } else {
                if (scanList.indexOf(String.fromCharCode(next)) >= 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              }
            }
  
            // write out null-terminating character
            HEAP8[((argPtr++)|0)]=0;
            formatIndex += match[0].length;
            
            continue;
          }
        }      
        // remove whitespace
        while (1) {
          next = get();
          if (next == 0) return fields;
          if (!(next in __scanString.whiteSpace)) break;
        }
        unget();
  
        if (format[formatIndex] === '%') {
          formatIndex++;
          var suppressAssignment = false;
          if (format[formatIndex] == '*') {
            suppressAssignment = true;
            formatIndex++;
          }
          var maxSpecifierStart = formatIndex;
          while (format[formatIndex].charCodeAt(0) >= 48 &&
                 format[formatIndex].charCodeAt(0) <= 57) {
            formatIndex++;
          }
          var max_;
          if (formatIndex != maxSpecifierStart) {
            max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
          }
          var long_ = false;
          var half = false;
          var longLong = false;
          if (format[formatIndex] == 'l') {
            long_ = true;
            formatIndex++;
            if (format[formatIndex] == 'l') {
              longLong = true;
              formatIndex++;
            }
          } else if (format[formatIndex] == 'h') {
            half = true;
            formatIndex++;
          }
          var type = format[formatIndex];
          formatIndex++;
          var curr = 0;
          var buffer = [];
          // Read characters according to the format. floats are trickier, they may be in an unfloat state in the middle, then be a valid float later
          if (type == 'f' || type == 'e' || type == 'g' ||
              type == 'F' || type == 'E' || type == 'G') {
            next = get();
            while (next > 0 && (!(next in __scanString.whiteSpace)))  {
              buffer.push(String.fromCharCode(next));
              next = get();
            }
            var m = __getFloat(buffer.join(''));
            var last = m ? m[0].length : 0;
            for (var i = 0; i < buffer.length - last + 1; i++) {
              unget();
            }
            buffer.length = last;
          } else {
            next = get();
            var first = true;
            
            // Strip the optional 0x prefix for %x.
            if ((type == 'x' || type == 'X') && (next == 48)) {
              var peek = get();
              if (peek == 120 || peek == 88) {
                next = get();
              } else {
                unget();
              }
            }
            
            while ((curr < max_ || isNaN(max_)) && next > 0) {
              if (!(next in __scanString.whiteSpace) && // stop on whitespace
                  (type == 's' ||
                   ((type === 'd' || type == 'u' || type == 'i') && ((next >= 48 && next <= 57) ||
                                                                     (first && next == 45))) ||
                   ((type === 'x' || type === 'X') && (next >= 48 && next <= 57 ||
                                     next >= 97 && next <= 102 ||
                                     next >= 65 && next <= 70))) &&
                  (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) { // Stop when we read something that is coming up
                buffer.push(String.fromCharCode(next));
                next = get();
                curr++;
                first = false;
              } else {
                break;
              }
            }
            unget();
          }
          if (buffer.length === 0) return 0;  // Failure.
          if (suppressAssignment) continue;
  
          var text = buffer.join('');
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          switch (type) {
            case 'd': case 'u': case 'i':
              if (half) {
                HEAP16[((argPtr)>>1)]=parseInt(text, 10);
              } else if (longLong) {
                (tempI64 = [parseInt(text, 10)>>>0,(tempDouble=parseInt(text, 10),(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((argPtr)>>2)]=tempI64[0],HEAP32[(((argPtr)+(4))>>2)]=tempI64[1]);
              } else {
                HEAP32[((argPtr)>>2)]=parseInt(text, 10);
              }
              break;
            case 'X':
            case 'x':
              HEAP32[((argPtr)>>2)]=parseInt(text, 16);
              break;
            case 'F':
            case 'f':
            case 'E':
            case 'e':
            case 'G':
            case 'g':
            case 'E':
              // fallthrough intended
              if (long_) {
                HEAPF64[((argPtr)>>3)]=parseFloat(text);
              } else {
                HEAPF32[((argPtr)>>2)]=parseFloat(text);
              }
              break;
            case 's':
              var array = intArrayFromString(text);
              for (var j = 0; j < array.length; j++) {
                HEAP8[(((argPtr)+(j))|0)]=array[j];
              }
              break;
          }
          fields++;
        } else if (format[formatIndex].charCodeAt(0) in __scanString.whiteSpace) {
          next = get();
          while (next in __scanString.whiteSpace) {
            if (next <= 0) break mainLoop;  // End of input.
            next = get();
          }
          unget(next);
          formatIndex++;
        } else {
          // Not a specifier.
          next = get();
          if (format[formatIndex].charCodeAt(0) !== next) {
            unget(next);
            break mainLoop;
          }
          formatIndex++;
        }
      }
      return fields;
    }function _sscanf(s, format, varargs) {
      // int sscanf(const char *restrict s, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var index = 0;
      function get() { return HEAP8[(((s)+(index++))|0)]; };
      function unget() { index--; };
      return __scanString(format, get, unget, varargs);
    }

  var _sqrt=Math_sqrt;

  function _sprintf(s, format, varargs) {
      // int sprintf(char *restrict s, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      return _snprintf(s, undefined, format, varargs);
    }

  function _clock() {
      if (_clock.start === undefined) _clock.start = Date.now();
      return Math.floor((Date.now() - _clock.start) * (1000000/1000));
    }

  function _vfprintf(s, f, va_arg) {
      return _fprintf(s, f, HEAP32[((va_arg)>>2)]);
    }

  function _strncat(pdest, psrc, num) {
      var len = _strlen(pdest);
      var i = 0;
      while(1) {
        HEAP8[((pdest+len+i)|0)]=HEAP8[((psrc+i)|0)];
        if (HEAP8[(((pdest)+(len+i))|0)] == 0) break;
        i ++;
        if (i == num) {
          HEAP8[(((pdest)+(len+i))|0)]=0;
          break;
        }
      }
      return pdest;
    }

  function _ctime(timer) {
      return _asctime(_localtime(timer));
    }

  function _Sys_Cwd() {
  		var cwd = allocate(intArrayFromString(FS.cwd()), 'i8', ALLOC_STACK);
  		return cwd;
  	}

  function _Sys_PIDIsRunning(pid) {
  		return 1;
  	}

  function _Sys_PID() {
  		return 0;
  	}

  function _Sys_GetCurrentUser() {
  		var stack = Runtime.stackSave();
  		var ret = allocate(intArrayFromString('player'), 'i8', ALLOC_STACK);
  		Runtime.stackRestore(stack);
  		return ret;
  	}

  function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      var fd = _fileno(stream);
      return _write(fd, s, _strlen(s));
    }

  function _Sys_ErrorDialog(error) {
  		error = Pointer_stringify(error);
  		console.error(error);
  		process.exit();
  	}

  
  var DLFCN={error:null,errorMsg:null,loadedLibs:{},loadedLibNames:{}};function _dlclose(handle) {
      // int dlclose(void *handle);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/dlclose.html
      if (!DLFCN.loadedLibs[handle]) {
        DLFCN.errorMsg = 'Tried to dlclose() unopened handle: ' + handle;
        return 1;
      } else {
        var lib_record = DLFCN.loadedLibs[handle];
        if (--lib_record.refcount == 0) {
          if (lib_record.module.cleanups) {
            lib_record.module.cleanups.forEach(function(cleanup) { cleanup() });
          }
          delete DLFCN.loadedLibNames[lib_record.name];
          delete DLFCN.loadedLibs[handle];
        }
        return 0;
      }
    }

  function _dlopen(filename, flag) {
      // void *dlopen(const char *file, int mode);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/dlopen.html
      filename = filename === 0 ? '__self__' : (ENV['LD_LIBRARY_PATH'] || '/') + Pointer_stringify(filename);
  
      abort('need to build with DLOPEN_SUPPORT=1 to get dlopen support in asm.js');
  
      if (DLFCN.loadedLibNames[filename]) {
        // Already loaded; increment ref count and return.
        var handle = DLFCN.loadedLibNames[filename];
        DLFCN.loadedLibs[handle].refcount++;
        return handle;
      }
  
      if (filename === '__self__') {
        var handle = -1;
        var lib_module = Module;
        var cached_functions = SYMBOL_TABLE;
      } else {
        var target = FS.findObject(filename);
        if (!target || target.isFolder || target.isDevice) {
          DLFCN.errorMsg = 'Could not find dynamic lib: ' + filename;
          return 0;
        } else {
          FS.forceLoadFile(target);
          var lib_data = intArrayToString(target.contents);
        }
  
        try {
          var lib_module = eval(lib_data)(
            DLFCN.functionTable.length,
            Module
          );
        } catch (e) {
          DLFCN.errorMsg = 'Could not evaluate dynamic lib: ' + filename;
          return 0;
        }
  
        // Not all browsers support Object.keys().
        var handle = 1;
        for (var key in DLFCN.loadedLibs) {
          if (DLFCN.loadedLibs.hasOwnProperty(key)) handle++;
        }
  
        // We don't care about RTLD_NOW and RTLD_LAZY.
        if (flag & 256) { // RTLD_GLOBAL
          for (var ident in lib_module) {
            if (lib_module.hasOwnProperty(ident)) {
              Module[ident] = lib_module[ident];
            }
          }
        }
  
        var cached_functions = {};
      }
      DLFCN.loadedLibs[handle] = {
        refcount: 1,
        name: filename,
        module: lib_module,
        cached_functions: cached_functions
      };
      DLFCN.loadedLibNames[filename] = handle;
  
      return handle;
    }

  function _dlerror() {
      // char *dlerror(void);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/dlerror.html
      if (DLFCN.errorMsg === null) {
        return 0;
      } else {
        if (DLFCN.error) _free(DLFCN.error);
        var msgArr = intArrayFromString(DLFCN.errorMsg);
        DLFCN.error = allocate(msgArr, 'i8', ALLOC_NORMAL);
        DLFCN.errorMsg = null;
        return DLFCN.error;
      }
    }

  function _dlsym(handle, symbol) {
      // void *dlsym(void *restrict handle, const char *restrict name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/dlsym.html
      symbol = '_' + Pointer_stringify(symbol);
  
      if (!DLFCN.loadedLibs[handle]) {
        DLFCN.errorMsg = 'Tried to dlsym() from an unopened handle: ' + handle;
        return 0;
      } else {
        var lib = DLFCN.loadedLibs[handle];
        // self-dlopen means that lib.module is not a superset of
        // cached_functions, so check the latter first
        if (lib.cached_functions.hasOwnProperty(symbol)) {
          return lib.cached_functions[symbol];
        } else {
          if (!lib.module.hasOwnProperty(symbol)) {
            DLFCN.errorMsg = ('Tried to lookup unknown symbol "' + symbol +
                                   '" in dynamic lib: ' + lib.name);
            return 0;
          } else {
            var result = lib.module[symbol];
            if (typeof result == 'function') {
              result = lib.module.SYMBOL_TABLE[symbol];
              assert(result);
              lib.cached_functions = result;
            }
            return result;
          }
        }
      }
    }

  function _Sys_PlatformInit() {
  		_CON_SetIsTTY(process.stdin.isTTY);
  	}

  function _Sys_Dirname(path) {
  		path = Pointer_stringify(path);
  		path = PATH.dirname(path);
  		var dirname = allocate(intArrayFromString(path), 'i8', ALLOC_STACK);
  		return dirname;
  	}

  function _emscripten_exit_with_live_runtime() {
      Module['noExitRuntime'] = true;
      throw 'SimulateInfiniteLoop';
    }

  function _signal(sig, func) {
      // TODO
      return 0;
    }

  function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop) {
      Module['noExitRuntime'] = true;
  
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
          Browser.mainLoop.updateStatus();
          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }
        if (Browser.mainLoop.shouldPause) {
          // catch pauses from non-main loop sources
          Browser.mainLoop.paused = true;
          Browser.mainLoop.shouldPause = false;
          return;
        }
  
        // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
        // VBO double-buffering and reduce GPU stalls.
        GL.newRenderingFrameStarted();
  
        if (Browser.mainLoop.method === 'timeout' && Module.ctx) {
          Module.printErr('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
          Browser.mainLoop.method = ''; // just warn once per call to set main loop
        }
  
        if (Module['preMainLoop']) {
          Module['preMainLoop']();
        }
  
        try {
          Runtime.dynCall('v', func);
        } catch (e) {
          if (e instanceof ExitStatus) {
            return;
          } else {
            if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
            throw e;
          }
        }
  
        if (Module['postMainLoop']) {
          Module['postMainLoop']();
        }
  
        if (Browser.mainLoop.shouldPause) {
          // catch pauses from the main loop itself
          Browser.mainLoop.paused = true;
          Browser.mainLoop.shouldPause = false;
          return;
        }
        Browser.mainLoop.scheduler();
      }
      if (fps && fps > 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          setTimeout(Browser.mainLoop.runner, 1000/fps); // doing this each time means that on exception, we stop
        };
        Browser.mainLoop.method = 'timeout';
      } else {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      }
      Browser.mainLoop.scheduler();
  
      if (simulateInfiniteLoop) {
        throw 'SimulateInfiniteLoop';
      }
    }

  function _Sys_PlatformExit() {
  	}

  
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }

  function _tcsetattr(fildes, optional_actions, termios_p) {
      // http://pubs.opengroup.org/onlinepubs/7908799/xsh/tcsetattr.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (!stream.tty) {
        ___setErrNo(ERRNO_CODES.ENOTTY);
        return -1;
      }
      return 0;
    }

  function _fcntl(fildes, cmd, varargs, dup2) {
      // int fcntl(int fildes, int cmd, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/fcntl.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      switch (cmd) {
        case 0:
          var arg = HEAP32[((varargs)>>2)];
          if (arg < 0) {
            ___setErrNo(ERRNO_CODES.EINVAL);
            return -1;
          }
          var newStream;
          try {
            newStream = FS.open(stream.path, stream.flags, 0, arg);
          } catch (e) {
            FS.handleFSError(e);
            return -1;
          }
          return newStream.fd;
        case 1:
        case 2:
          return 0;  // FD_CLOEXEC makes no sense for a single process.
        case 3:
          return stream.flags;
        case 4:
          var arg = HEAP32[((varargs)>>2)];
          stream.flags |= arg;
          return 0;
        case 12:
        case 12:
          var arg = HEAP32[((varargs)>>2)];
          var offset = 0;
          // We're always unlocked.
          HEAP16[(((arg)+(offset))>>1)]=2;
          return 0;
        case 13:
        case 14:
        case 13:
        case 14:
          // Pretend that the locking is successful.
          return 0;
        case 8:
        case 9:
          // These are for sockets. We don't have them fully implemented yet.
          ___setErrNo(ERRNO_CODES.EINVAL);
          return -1;
        default:
          ___setErrNo(ERRNO_CODES.EINVAL);
          return -1;
      }
      // Should never be reached. Only to silence strict warnings.
      return -1;
    }

  function _tcgetattr(fildes, termios_p) {
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/tcgetattr.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (!stream.tty) {
        ___setErrNo(ERRNO_CODES.ENOTTY);
        return -1;
      }
      return 0;
    }



  function _abort() {
      Module['abort']();
    }

  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }

  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }


  
  function _copysign(a, b) {
      return __reallyNegative(a) === __reallyNegative(b) ? a : -a;
    }var _copysignl=_copysign;

  
  function _fmod(x, y) {
      return x % y;
    }var _fmodl=_fmod;

  var _fabs=Math_abs;







  
  
  
  var GL={counter:1,lastError:0,buffers:[],programs:[],framebuffers:[],renderbuffers:[],textures:[],uniforms:[],shaders:[],currArrayBuffer:0,currElementArrayBuffer:0,byteSizeByTypeRoot:5120,byteSizeByType:[1,1,2,2,4,4,4,2,3,4,8],programInfos:{},stringCache:{},packAlignment:4,unpackAlignment:4,init:function () {
        GL.createLog2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        Browser.moduleContextCreatedCallbacks.push(GL.initExtensions);
      },recordError:function recordError(errorCode) {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },getNewId:function (table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },MINI_TEMP_BUFFER_SIZE:16,miniTempBuffer:null,miniTempBufferViews:[0],MAX_TEMP_BUFFER_SIZE:2097152,tempVertexBuffers1:[],tempVertexBufferCounters1:[],tempVertexBuffers2:[],tempVertexBufferCounters2:[],numTempVertexBuffersPerSize:64,tempIndexBuffers:[],tempQuadIndexBuffer:null,log2ceilLookup:null,createLog2ceilLookup:function (maxValue) {
        GL.log2ceilLookup = new Uint8Array(maxValue+1);
        var log2 = 0;
        var pow2 = 1;
        GL.log2ceilLookup[0] = 0;
        for(var i = 1; i <= maxValue; ++i) {
          if (i > pow2) {
            pow2 <<= 1;
            ++log2;
          }
          GL.log2ceilLookup[i] = log2;
        }
      },generateTempBuffers:function (quads) {
        var largestIndex = GL.log2ceilLookup[GL.MAX_TEMP_BUFFER_SIZE];
        GL.tempVertexBufferCounters1.length = GL.tempVertexBufferCounters2.length = largestIndex+1;
        GL.tempVertexBuffers1.length = GL.tempVertexBuffers2.length = largestIndex+1;
        GL.tempIndexBuffers.length = largestIndex+1;
        for(var i = 0; i <= largestIndex; ++i) {
          GL.tempIndexBuffers[i] = null; // Created on-demand
          GL.tempVertexBufferCounters1[i] = GL.tempVertexBufferCounters2[i] = 0;
          var ringbufferLength = GL.numTempVertexBuffersPerSize;
          GL.tempVertexBuffers1[i] = [];
          GL.tempVertexBuffers2[i] = [];
          var ringbuffer1 = GL.tempVertexBuffers1[i];
          var ringbuffer2 = GL.tempVertexBuffers2[i];
          ringbuffer1.length = ringbuffer2.length = ringbufferLength;
          for(var j = 0; j < ringbufferLength; ++j) {
            ringbuffer1[j] = ringbuffer2[j] = null; // Created on-demand
          }
        }
  
        if (quads) {
          // GL_QUAD indexes can be precalculated
          GL.tempQuadIndexBuffer = GLctx.createBuffer();
          GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.tempQuadIndexBuffer);
          var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
          var quadIndexes = new Uint16Array(numIndexes);
          var i = 0, v = 0;
          while (1) {
            quadIndexes[i++] = v;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+1;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+2;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+2;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+3;
            if (i >= numIndexes) break;
            v += 4;
          }
          GLctx.bufferData(GLctx.ELEMENT_ARRAY_BUFFER, quadIndexes, GLctx.STATIC_DRAW);
          GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, null);
        }
      },getTempVertexBuffer:function getTempVertexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup[sizeBytes];
        var ringbuffer = GL.tempVertexBuffers1[idx];
        var nextFreeBufferIndex = GL.tempVertexBufferCounters1[idx];
        GL.tempVertexBufferCounters1[idx] = (GL.tempVertexBufferCounters1[idx]+1) & (GL.numTempVertexBuffersPerSize-1);
        var vbo = ringbuffer[nextFreeBufferIndex];
        if (vbo) {
          return vbo;
        }
        var prevVBO = GLctx.getParameter(GLctx.ARRAY_BUFFER_BINDING);
        ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
        GLctx.bindBuffer(GLctx.ARRAY_BUFFER, ringbuffer[nextFreeBufferIndex]);
        GLctx.bufferData(GLctx.ARRAY_BUFFER, 1 << idx, GLctx.DYNAMIC_DRAW);
        GLctx.bindBuffer(GLctx.ARRAY_BUFFER, prevVBO);
        return ringbuffer[nextFreeBufferIndex];
      },getTempIndexBuffer:function getTempIndexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup[sizeBytes];
        var ibo = GL.tempIndexBuffers[idx];
        if (ibo) {
          return ibo;
        }
        var prevIBO = GLctx.getParameter(GLctx.ELEMENT_ARRAY_BUFFER_BINDING);
        GL.tempIndexBuffers[idx] = GLctx.createBuffer();
        GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.tempIndexBuffers[idx]);
        GLctx.bufferData(GLctx.ELEMENT_ARRAY_BUFFER, 1 << idx, GLctx.DYNAMIC_DRAW);
        GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, prevIBO);
        return GL.tempIndexBuffers[idx];
      },newRenderingFrameStarted:function newRenderingFrameStarted() {
        var vb = GL.tempVertexBuffers1;
        GL.tempVertexBuffers1 = GL.tempVertexBuffers2;
        GL.tempVertexBuffers2 = vb;
        vb = GL.tempVertexBufferCounters1;
        GL.tempVertexBufferCounters1 = GL.tempVertexBufferCounters2;
        GL.tempVertexBufferCounters2 = vb;
        var largestIndex = GL.log2ceilLookup[GL.MAX_TEMP_BUFFER_SIZE];
        for(var i = 0; i <= largestIndex; ++i) {
          GL.tempVertexBufferCounters1[i] = 0;
        }
      },findToken:function (source, token) {
        function isIdentChar(ch) {
          if (ch >= 48 && ch <= 57) // 0-9
            return true;
          if (ch >= 65 && ch <= 90) // A-Z
            return true;
          if (ch >= 97 && ch <= 122) // a-z
            return true;
          return false;
        }
        var i = -1;
        do {
          i = source.indexOf(token, i + 1);
          if (i < 0) {
            break;
          }
          if (i > 0 && isIdentChar(source[i - 1])) {
            continue;
          }
          i += token.length;
          if (i < source.length - 1 && isIdentChar(source[i + 1])) {
            continue;
          }
          return true;
        } while (true);
        return false;
      },getSource:function (shader, count, string, length) {
        var source = '';
        for (var i = 0; i < count; ++i) {
          var frag;
          if (length) {
            var len = HEAP32[(((length)+(i*4))>>2)];
            if (len < 0) {
              frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)]);
            } else {
              frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)], len);
            }
          } else {
            frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)]);
          }
          source += frag;
        }
        // Let's see if we need to enable the standard derivatives extension
        type = GLctx.getShaderParameter(GL.shaders[shader], 0x8B4F /* GL_SHADER_TYPE */);
        if (type == 0x8B30 /* GL_FRAGMENT_SHADER */) {
          if (GL.findToken(source, "dFdx") ||
              GL.findToken(source, "dFdy") ||
              GL.findToken(source, "fwidth")) {
            source = "#extension GL_OES_standard_derivatives : enable\n" + source;
            var extension = GLctx.getExtension("OES_standard_derivatives");
          }
        }
        return source;
      },computeImageSize:function (width, height, sizePerPixel, alignment) {
        function roundedToNextMultipleOf(x, y) {
          return Math.floor((x + y - 1) / y) * y
        }
        var plainRowSize = width * sizePerPixel;
        var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
        return (height <= 0) ? 0 :
                 ((height - 1) * alignedRowSize + plainRowSize);
      },get:function (name_, p, type) {
        // Guard against user passing a null pointer.
        // Note that GLES2 spec does not say anything about how passing a null pointer should be treated.
        // Testing on desktop core GL 3, the application crashes on glGetIntegerv to a null pointer, but
        // better to report an error instead of doing anything random.
        if (!p) {
          GL.recordError(0x0501 /* GL_INVALID_VALUE */);
          return;
        }
        var ret = undefined;
        switch(name_) { // Handle a few trivial GLES values
          case 0x8DFA: // GL_SHADER_COMPILER
            ret = 1;
            break;
          case 0x8DF8: // GL_SHADER_BINARY_FORMATS
            if (type !== 'Integer') {
              GL.recordError(0x0500); // GL_INVALID_ENUM
            }
            return; // Do not write anything to the out pointer, since no binary formats are supported.
          case 0x8DF9: // GL_NUM_SHADER_BINARY_FORMATS
            ret = 0;
            break;
          case 0x86A2: // GL_NUM_COMPRESSED_TEXTURE_FORMATS
            // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be queried for length),
            // so implement it ourselves to allow C++ GLES2 code get the length.
            var formats = GLctx.getParameter(0x86A3 /*GL_COMPRESSED_TEXTURE_FORMATS*/);
            ret = formats.length;
            break;
          case 0x8B9A: // GL_IMPLEMENTATION_COLOR_READ_TYPE
            ret = 0x1401; // GL_UNSIGNED_BYTE
            break;
          case 0x8B9B: // GL_IMPLEMENTATION_COLOR_READ_FORMAT
            ret = 0x1908; // GL_RGBA
            break;
        }
  
        if (ret === undefined) {
          var result = GLctx.getParameter(name_);
          switch (typeof(result)) {
            case "number":
              ret = result;
              break;
            case "boolean":
              ret = result ? 1 : 0;
              break;
            case "string":
              GL.recordError(0x0500); // GL_INVALID_ENUM
              return;
            case "object":
              if (result === null) {
                // null is a valid result for some (e.g., which buffer is bound - perhaps nothing is bound), but otherwise
                // can mean an invalid name_, which we need to report as an error
                switch(name_) {
                  case 0x8894: // ARRAY_BUFFER_BINDING
                  case 0x8B8D: // CURRENT_PROGRAM
                  case 0x8895: // ELEMENT_ARRAY_BUFFER_BINDING
                  case 0x8CA6: // FRAMEBUFFER_BINDING
                  case 0x8CA7: // RENDERBUFFER_BINDING
                  case 0x8069: // TEXTURE_BINDING_2D
                  case 0x8514: { // TEXTURE_BINDING_CUBE_MAP
                    ret = 0;
                    break;
                  }
                  default: {
                    GL.recordError(0x0500); // GL_INVALID_ENUM
                    return;
                  }
                }
              } else if (result instanceof Float32Array ||
                         result instanceof Uint32Array ||
                         result instanceof Int32Array ||
                         result instanceof Array) {
                for (var i = 0; i < result.length; ++i) {
                  switch (type) {
                    case 'Integer': HEAP32[(((p)+(i*4))>>2)]=result[i];   break;
                    case 'Float':   HEAPF32[(((p)+(i*4))>>2)]=result[i]; break;
                    case 'Boolean': HEAP8[(((p)+(i))|0)]=result[i] ? 1 : 0;    break;
                    default: throw 'internal glGet error, bad type: ' + type;
                  }
                }
                return;
              } else if (result instanceof WebGLBuffer ||
                         result instanceof WebGLProgram ||
                         result instanceof WebGLFramebuffer ||
                         result instanceof WebGLRenderbuffer ||
                         result instanceof WebGLTexture) {
                ret = result.name | 0;
              } else {
                GL.recordError(0x0500); // GL_INVALID_ENUM
                return;
              }
              break;
            default:
              GL.recordError(0x0500); // GL_INVALID_ENUM
              return;
          }
        }
  
        switch (type) {
          case 'Integer': HEAP32[((p)>>2)]=ret;    break;
          case 'Float':   HEAPF32[((p)>>2)]=ret;  break;
          case 'Boolean': HEAP8[(p)]=ret ? 1 : 0; break;
          default: throw 'internal glGet error, bad type: ' + type;
        }
      },getTexPixelData:function (type, format, width, height, pixels, internalFormat) {
        var sizePerPixel;
        switch (type) {
          case 0x1401 /* GL_UNSIGNED_BYTE */:
            switch (format) {
              case 0x1906 /* GL_ALPHA */:
              case 0x1909 /* GL_LUMINANCE */:
                sizePerPixel = 1;
                break;
              case 0x1907 /* GL_RGB */:
                sizePerPixel = 3;
                break;
              case 0x1908 /* GL_RGBA */:
                sizePerPixel = 4;
                break;
              case 0x190A /* GL_LUMINANCE_ALPHA */:
                sizePerPixel = 2;
                break;
              default:
                throw 'Invalid format (' + format + ')';
            }
            break;
          case 0x1403 /* GL_UNSIGNED_SHORT */:
            if (format == 0x1902 /* GL_DEPTH_COMPONENT */) {
              sizePerPixel = 2;
            } else {
              throw 'Invalid format (' + format + ')';
            }
            break;
          case 0x1405 /* GL_UNSIGNED_INT */:
            if (format == 0x1902 /* GL_DEPTH_COMPONENT */) {
              sizePerPixel = 4;
            } else {
              throw 'Invalid format (' + format + ')';
            }
            break;
          case 0x84FA /* UNSIGNED_INT_24_8_WEBGL */:
            sizePerPixel = 4;
            break;
          case 0x8363 /* GL_UNSIGNED_SHORT_5_6_5 */:
          case 0x8033 /* GL_UNSIGNED_SHORT_4_4_4_4 */:
          case 0x8034 /* GL_UNSIGNED_SHORT_5_5_5_1 */:
            sizePerPixel = 2;
            break;
          case 0x1406 /* GL_FLOAT */:
            switch (format) {
              case 0x1907 /* GL_RGB */:
                sizePerPixel = 3*4;
                break;
              case 0x1908 /* GL_RGBA */:
                sizePerPixel = 4*4;
                break;
              default:
                throw 'Invalid format (' + format + ')';
            }
            internalFormat = GLctx.RGBA;
            break;
          default:
            throw 'Invalid type (' + type + ')';
        }
        var bytes = GL.computeImageSize(width, height, sizePerPixel, GL.unpackAlignment);
        if (type == 0x1401 /* GL_UNSIGNED_BYTE */) {
          pixels = HEAPU8.subarray((pixels),(pixels+bytes));
        } else if (type == 0x1406 /* GL_FLOAT */) {
          pixels = HEAPF32.subarray((pixels)>>2,(pixels+bytes)>>2);
        } else if (type == 0x1405 /* GL_UNSIGNED_INT */ || type == 0x84FA /* UNSIGNED_INT_24_8_WEBGL */) {
          pixels = HEAPU32.subarray((pixels)>>2,(pixels+bytes)>>2);
        } else {
          pixels = HEAPU16.subarray((pixels)>>1,(pixels+bytes)>>1);
        }
        return {
          pixels: pixels,
          internalFormat: internalFormat
        }
      },initExtensions:function () {
        if (GL.initExtensions.done) return;
        GL.initExtensions.done = true;
  
        if (!Module.useWebGL) return; // an app might link both gl and 2d backends
  
        GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);
        for (var i = 0; i < GL.MINI_TEMP_BUFFER_SIZE; i++) {
          GL.miniTempBufferViews[i] = GL.miniTempBuffer.subarray(0, i+1);
        }
  
        GL.maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
  
        // Detect the presence of a few extensions manually, this GL interop layer itself will need to know if they exist. 
        GL.compressionExt = GLctx.getExtension('WEBGL_compressed_texture_s3tc') ||
                            GLctx.getExtension('MOZ_WEBGL_compressed_texture_s3tc') ||
                            GLctx.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
  
        GL.anisotropicExt = GLctx.getExtension('EXT_texture_filter_anisotropic') ||
                            GLctx.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
                            GLctx.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
  
        GL.floatExt = GLctx.getExtension('OES_texture_float');
        
        // Extension available from Firefox 26 and Google Chrome 30
        GL.instancedArraysExt = GLctx.getExtension('ANGLE_instanced_arrays');
  
        // These are the 'safe' feature-enabling extensions that don't add any performance impact related to e.g. debugging, and
        // should be enabled by default so that client GLES2/GL code will not need to go through extra hoops to get its stuff working.
        // As new extensions are ratified at http://www.khronos.org/registry/webgl/extensions/ , feel free to add your new extensions
        // here, as long as they don't produce a performance impact for users that might not be using those extensions.
        // E.g. debugging-related extensions should probably be off by default.
        var automaticallyEnabledExtensions = [ "OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives",
                                               "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture",
                                               "OES_element_index_uint", "EXT_texture_filter_anisotropic", "ANGLE_instanced_arrays",
                                               "OES_texture_float_linear", "OES_texture_half_float_linear", "WEBGL_compressed_texture_atc",
                                               "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float",
                                               "EXT_frag_depth", "EXT_sRGB", "WEBGL_draw_buffers", "WEBGL_shared_resources" ];
  
        function shouldEnableAutomatically(extension) {
          for(var i in automaticallyEnabledExtensions) {
            var include = automaticallyEnabledExtensions[i];
            if (ext.indexOf(include) != -1) {
              return true;
            }
          }
          return false;
        }
  
        var extensions = GLctx.getSupportedExtensions();
        for(var e in extensions) {
          var ext = extensions[e].replace('MOZ_', '').replace('WEBKIT_', '');
          if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
            GLctx.getExtension(ext); // Calling .getExtension enables that extension permanently, no need to store the return value to be enabled.
          }
        }
      },populateUniformTable:function (program) {
        var p = GL.programs[program];
        GL.programInfos[program] = {
          uniforms: {},
          maxUniformLength: 0, // This is eagerly computed below, since we already enumerate all uniforms anyway.
          maxAttributeLength: -1 // This is lazily computed and cached, computed when/if first asked, "-1" meaning not computed yet.
        };
  
        var ptable = GL.programInfos[program];
        var utable = ptable.uniforms;
        // A program's uniform table maps the string name of an uniform to an integer location of that uniform.
        // The global GL.uniforms map maps integer locations to WebGLUniformLocations.
        var numUniforms = GLctx.getProgramParameter(p, GLctx.ACTIVE_UNIFORMS);
        for (var i = 0; i < numUniforms; ++i) {
          var u = GLctx.getActiveUniform(p, i);
  
          var name = u.name;
          ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length+1);
  
          // Strip off any trailing array specifier we might have got, e.g. "[0]".
          if (name.indexOf(']', name.length-1) !== -1) {
            var ls = name.lastIndexOf('[');
            name = name.slice(0, ls);
          }
  
          // Optimize memory usage slightly: If we have an array of uniforms, e.g. 'vec3 colors[3];', then 
          // only store the string 'colors' in utable, and 'colors[0]', 'colors[1]' and 'colors[2]' will be parsed as 'colors'+i.
          // Note that for the GL.uniforms table, we still need to fetch the all WebGLUniformLocations for all the indices.
          var loc = GLctx.getUniformLocation(p, name);
          var id = GL.getNewId(GL.uniforms);
          utable[name] = [u.size, id];
          GL.uniforms[id] = loc;
  
          for (var j = 1; j < u.size; ++j) {
            var n = name + '['+j+']';
            loc = GLctx.getUniformLocation(p, n);
            id = GL.getNewId(GL.uniforms);
  
            GL.uniforms[id] = loc;
          }
        }
      }};var GLImmediate={MapTreeLib:null,spawnMapTreeLib:function () {
        /* A naive implementation of a map backed by an array, and accessed by
         * naive iteration along the array. (hashmap with only one bucket)
         */
        function CNaiveListMap() {
          var list = [];
  
          this.insert = function CNaiveListMap_insert(key, val) {
            if (this.contains(key|0)) return false;
            list.push([key, val]);
            return true;
          };
  
          var __contains_i;
          this.contains = function CNaiveListMap_contains(key) {
            for (__contains_i = 0; __contains_i < list.length; ++__contains_i) {
              if (list[__contains_i][0] === key) return true;
            }
            return false;
          };
  
          var __get_i;
          this.get = function CNaiveListMap_get(key) {
            for (__get_i = 0; __get_i < list.length; ++__get_i) {
              if (list[__get_i][0] === key) return list[__get_i][1];
            }
            return undefined;
          };
        };
  
        /* A tree of map nodes.
          Uses `KeyView`s to allow descending the tree without garbage.
          Example: {
            // Create our map object.
            var map = new ObjTreeMap();
  
            // Grab the static keyView for the map.
            var keyView = map.GetStaticKeyView();
  
            // Let's make a map for:
            // root: <undefined>
            //   1: <undefined>
            //     2: <undefined>
            //       5: "Three, sir!"
            //       3: "Three!"
  
            // Note how we can chain together `Reset` and `Next` to
            // easily descend based on multiple key fragments.
            keyView.Reset().Next(1).Next(2).Next(5).Set("Three, sir!");
            keyView.Reset().Next(1).Next(2).Next(3).Set("Three!");
          }
        */
        function CMapTree() {
          function CNLNode() {
            var map = new CNaiveListMap();
  
            this.child = function CNLNode_child(keyFrag) {
              if (!map.contains(keyFrag|0)) {
                map.insert(keyFrag|0, new CNLNode());
              }
              return map.get(keyFrag|0);
            };
  
            this.value = undefined;
            this.get = function CNLNode_get() {
              return this.value;
            };
  
            this.set = function CNLNode_set(val) {
              this.value = val;
            };
          }
  
          function CKeyView(root) {
            var cur;
  
            this.reset = function CKeyView_reset() {
              cur = root;
              return this;
            };
            this.reset();
  
            this.next = function CKeyView_next(keyFrag) {
              cur = cur.child(keyFrag);
              return this;
            };
  
            this.get = function CKeyView_get() {
              return cur.get();
            };
  
            this.set = function CKeyView_set(val) {
              cur.set(val);
            };
          };
  
          var root;
          var staticKeyView;
  
          this.createKeyView = function CNLNode_createKeyView() {
            return new CKeyView(root);
          }
  
          this.clear = function CNLNode_clear() {
            root = new CNLNode();
            staticKeyView = this.createKeyView();
          };
          this.clear();
  
          this.getStaticKeyView = function CNLNode_getStaticKeyView() {
            staticKeyView.reset();
            return staticKeyView;
          };
        };
  
        // Exports:
        return {
          create: function() {
            return new CMapTree();
          },
        };
      },TexEnvJIT:null,spawnTexEnvJIT:function () {
        // GL defs:
        var GL_TEXTURE0 = 0x84C0;
        var GL_TEXTURE_1D = 0x0DE0;
        var GL_TEXTURE_2D = 0x0DE1;
        var GL_TEXTURE_3D = 0x806f;
        var GL_TEXTURE_CUBE_MAP = 0x8513;
        var GL_TEXTURE_ENV = 0x2300;
        var GL_TEXTURE_ENV_MODE = 0x2200;
        var GL_TEXTURE_ENV_COLOR = 0x2201;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
        var GL_TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;
        var GL_TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;
        var GL_TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A;
  
        var GL_SRC0_RGB = 0x8580;
        var GL_SRC1_RGB = 0x8581;
        var GL_SRC2_RGB = 0x8582;
  
        var GL_SRC0_ALPHA = 0x8588;
        var GL_SRC1_ALPHA = 0x8589;
        var GL_SRC2_ALPHA = 0x858A;
  
        var GL_OPERAND0_RGB = 0x8590;
        var GL_OPERAND1_RGB = 0x8591;
        var GL_OPERAND2_RGB = 0x8592;
  
        var GL_OPERAND0_ALPHA = 0x8598;
        var GL_OPERAND1_ALPHA = 0x8599;
        var GL_OPERAND2_ALPHA = 0x859A;
  
        var GL_COMBINE_RGB = 0x8571;
        var GL_COMBINE_ALPHA = 0x8572;
  
        var GL_RGB_SCALE = 0x8573;
        var GL_ALPHA_SCALE = 0x0D1C;
  
        // env.mode
        var GL_ADD      = 0x0104;
        var GL_BLEND    = 0x0BE2;
        var GL_REPLACE  = 0x1E01;
        var GL_MODULATE = 0x2100;
        var GL_DECAL    = 0x2101;
        var GL_COMBINE  = 0x8570;
  
        // env.color/alphaCombiner
        //var GL_ADD         = 0x0104;
        //var GL_REPLACE     = 0x1E01;
        //var GL_MODULATE    = 0x2100;
        var GL_SUBTRACT    = 0x84E7;
        var GL_INTERPOLATE = 0x8575;
  
        // env.color/alphaSrc
        var GL_TEXTURE       = 0x1702;
        var GL_CONSTANT      = 0x8576;
        var GL_PRIMARY_COLOR = 0x8577;
        var GL_PREVIOUS      = 0x8578;
  
        // env.color/alphaOp
        var GL_SRC_COLOR           = 0x0300;
        var GL_ONE_MINUS_SRC_COLOR = 0x0301;
        var GL_SRC_ALPHA           = 0x0302;
        var GL_ONE_MINUS_SRC_ALPHA = 0x0303;
  
        var GL_RGB  = 0x1907;
        var GL_RGBA = 0x1908;
  
        // Our defs:
        var TEXENVJIT_NAMESPACE_PREFIX = "tej_";
        // Not actually constant, as they can be changed between JIT passes:
        var TEX_UNIT_UNIFORM_PREFIX = "uTexUnit";
        var TEX_COORD_VARYING_PREFIX = "vTexCoord";
        var PRIM_COLOR_VARYING = "vPrimColor";
        var TEX_MATRIX_UNIFORM_PREFIX = "uTexMatrix";
  
        // Static vars:
        var s_texUnits = null; //[];
        var s_activeTexture = 0;
  
        var s_requiredTexUnitsForPass = [];
  
        // Static funcs:
        function abort(info) {
          assert(false, "[TexEnvJIT] ABORT: " + info);
        }
  
        function abort_noSupport(info) {
          abort("No support: " + info);
        }
  
        function abort_sanity(info) {
          abort("Sanity failure: " + info);
        }
  
        function genTexUnitSampleExpr(texUnitID) {
          var texUnit = s_texUnits[texUnitID];
          var texType = texUnit.getTexType();
  
          var func = null;
          switch (texType) {
            case GL_TEXTURE_1D:
              func = "texture2D";
              break;
            case GL_TEXTURE_2D:
              func = "texture2D";
              break;
            case GL_TEXTURE_3D:
              return abort_noSupport("No support for 3D textures.");
            case GL_TEXTURE_CUBE_MAP:
              func = "textureCube";
              break;
            default:
              return abort_sanity("Unknown texType: 0x" + texType.toString(16));
          }
  
          var texCoordExpr = TEX_COORD_VARYING_PREFIX + texUnitID;
          if (TEX_MATRIX_UNIFORM_PREFIX != null) {
            texCoordExpr = "(" + TEX_MATRIX_UNIFORM_PREFIX + texUnitID + " * " + texCoordExpr + ")";
          }
          return func + "(" + TEX_UNIT_UNIFORM_PREFIX + texUnitID + ", " + texCoordExpr + ".xy)";
        }
  
        function getTypeFromCombineOp(op) {
          switch (op) {
            case GL_SRC_COLOR:
            case GL_ONE_MINUS_SRC_COLOR:
              return "vec3";
            case GL_SRC_ALPHA:
            case GL_ONE_MINUS_SRC_ALPHA:
              return "float";
          }
  
          return abort_noSupport("Unsupported combiner op: 0x" + op.toString(16));
        }
  
        function getCurTexUnit() {
          return s_texUnits[s_activeTexture];
        }
  
        function genCombinerSourceExpr(texUnitID, constantExpr, previousVar,
                                       src, op)
        {
          var srcExpr = null;
          switch (src) {
            case GL_TEXTURE:
              srcExpr = genTexUnitSampleExpr(texUnitID);
              break;
            case GL_CONSTANT:
              srcExpr = constantExpr;
              break;
            case GL_PRIMARY_COLOR:
              srcExpr = PRIM_COLOR_VARYING;
              break;
            case GL_PREVIOUS:
              srcExpr = previousVar;
              break;
            default:
                return abort_noSupport("Unsupported combiner src: 0x" + src.toString(16));
          }
  
          var expr = null;
          switch (op) {
            case GL_SRC_COLOR:
              expr = srcExpr + ".rgb";
              break;
            case GL_ONE_MINUS_SRC_COLOR:
              expr = "(vec3(1.0) - " + srcExpr + ".rgb)";
              break;
            case GL_SRC_ALPHA:
              expr = srcExpr + ".a";
              break;
            case GL_ONE_MINUS_SRC_ALPHA:
              expr = "(1.0 - " + srcExpr + ".a)";
              break;
            default:
              return abort_noSupport("Unsupported combiner op: 0x" + op.toString(16));
          }
  
          return expr;
        }
  
        function valToFloatLiteral(val) {
          if (val == Math.round(val)) return val + '.0';
          return val;
        }
  
  
        // Classes:
        function CTexEnv() {
          this.mode = GL_MODULATE;
          this.colorCombiner = GL_MODULATE;
          this.alphaCombiner = GL_MODULATE;
          this.colorScale = 1;
          this.alphaScale = 1;
          this.envColor = [0, 0, 0, 0];
  
          this.colorSrc = [
            GL_TEXTURE,
            GL_PREVIOUS,
            GL_CONSTANT
          ];
          this.alphaSrc = [
            GL_TEXTURE,
            GL_PREVIOUS,
            GL_CONSTANT
          ];
          this.colorOp = [
            GL_SRC_COLOR,
            GL_SRC_COLOR,
            GL_SRC_ALPHA
          ];
          this.alphaOp = [
            GL_SRC_ALPHA,
            GL_SRC_ALPHA,
            GL_SRC_ALPHA
          ];
  
          // Map GLenums to small values to efficiently pack the enums to bits for tighter access.
          this.traverseKey = {
            // mode
            0x1E01 /* GL_REPLACE */: 0,
            0x2100 /* GL_MODULATE */: 1,
            0x0104 /* GL_ADD */: 2,
            0x0BE2 /* GL_BLEND */: 3,
            0x2101 /* GL_DECAL */: 4,
            0x8570 /* GL_COMBINE */: 5,
  
            // additional color and alpha combiners
            0x84E7 /* GL_SUBTRACT */: 3,
            0x8575 /* GL_INTERPOLATE */: 4,
  
            // color and alpha src
            0x1702 /* GL_TEXTURE */: 0,
            0x8576 /* GL_CONSTANT */: 1,
            0x8577 /* GL_PRIMARY_COLOR */: 2,
            0x8578 /* GL_PREVIOUS */: 3,
  
            // color and alpha op
            0x0300 /* GL_SRC_COLOR */: 0,
            0x0301 /* GL_ONE_MINUS_SRC_COLOR */: 1,
            0x0302 /* GL_SRC_ALPHA */: 2,
            0x0300 /* GL_ONE_MINUS_SRC_ALPHA */: 3
          };
  
          // The tuple (key0,key1,key2) uniquely identifies the state of the variables in CTexEnv.
          // -1 on key0 denotes 'the whole cached key is dirty'
          this.key0 = -1;
          this.key1 = 0;
          this.key2 = 0;
  
          this.computeKey0 = function() {
            var k = this.traverseKey;
            var key = k[this.mode] * 1638400; // 6 distinct values.
            key += k[this.colorCombiner] * 327680; // 5 distinct values.
            key += k[this.alphaCombiner] * 65536; // 5 distinct values.
            // The above three fields have 6*5*5=150 distinct values -> 8 bits.
            key += (this.colorScale-1) * 16384; // 10 bits used.
            key += (this.alphaScale-1) * 4096; // 12 bits used.
            key += k[this.colorSrc[0]] * 1024; // 14
            key += k[this.colorSrc[1]] * 256; // 16
            key += k[this.colorSrc[2]] * 64; // 18
            key += k[this.alphaSrc[0]] * 16; // 20
            key += k[this.alphaSrc[1]] * 4; // 22
            key += k[this.alphaSrc[2]]; // 24 bits used total.
            return key;
          }
          this.computeKey1 = function() {
            var k = this.traverseKey;
            key = k[this.colorOp[0]] * 4096;
            key += k[this.colorOp[1]] * 1024;             
            key += k[this.colorOp[2]] * 256;
            key += k[this.alphaOp[0]] * 16;
            key += k[this.alphaOp[1]] * 4;
            key += k[this.alphaOp[2]];
            return key;            
          }
          // TODO: remove this. The color should not be part of the key!
          this.computeKey2 = function() {
            return this.envColor[0] * 16777216 + this.envColor[1] * 65536 + this.envColor[2] * 256 + 1 + this.envColor[3];
          }
          this.recomputeKey = function() {
            this.key0 = this.computeKey0();
            this.key1 = this.computeKey1();
            this.key2 = this.computeKey2();
          }
          this.invalidateKey = function() {
            this.key0 = -1; // The key of this texture unit must be recomputed when rendering the next time.
            GLImmediate.currentRenderer = null; // The currently used renderer must be re-evaluated at next render.
          }
        }
  
        function CTexUnit() {
          this.env = new CTexEnv();
          this.enabled_tex1D   = false;
          this.enabled_tex2D   = false;
          this.enabled_tex3D   = false;
          this.enabled_texCube = false;
          this.texTypesEnabled = 0; // A bitfield combination of the four flags above, used for fast access to operations.
  
          this.traverseState = function CTexUnit_traverseState(keyView) {
            if (this.texTypesEnabled) {
              if (this.env.key0 == -1) {
                this.env.recomputeKey();
              }
              keyView.next(this.texTypesEnabled | (this.env.key0 << 4));
              keyView.next(this.env.key1);
              keyView.next(this.env.key2);
            } else {
              // For correctness, must traverse a zero value, theoretically a subsequent integer key could collide with this value otherwise.
              keyView.next(0);
            }
          };
        };
  
        // Class impls:
        CTexUnit.prototype.enabled = function CTexUnit_enabled() {
          return this.texTypesEnabled;
        }
  
        CTexUnit.prototype.genPassLines = function CTexUnit_genPassLines(passOutputVar, passInputVar, texUnitID) {
          if (!this.enabled()) {
            return ["vec4 " + passOutputVar + " = " + passInputVar + ";"];
          }
          var lines = this.env.genPassLines(passOutputVar, passInputVar, texUnitID).join('\n');
  
          var texLoadLines = '';
          var texLoadRegex = /(texture.*?\(.*?\))/g;
          var loadCounter = 0;
          var load;
  
          // As an optimization, merge duplicate identical texture loads to one var.
          while(load = texLoadRegex.exec(lines)) {
            var texLoadExpr = load[1];
            var secondOccurrence = lines.slice(load.index+1).indexOf(texLoadExpr);
            if (secondOccurrence != -1) { // And also has a second occurrence of same load expression..
              // Create new var to store the common load.
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texLoadVar = prefix + 'texload' + loadCounter++;
              var texLoadLine = 'vec4 ' + texLoadVar + ' = ' + texLoadExpr + ';\n';
              texLoadLines += texLoadLine + '\n'; // Store the generated texture load statements in a temp string to not confuse regex search in progress.
              lines = lines.split(texLoadExpr).join(texLoadVar);
              // Reset regex search, since we modified the string.
              texLoadRegex = /(texture.*\(.*\))/g;
            }
          }
          return [texLoadLines + lines];
        }
  
        CTexUnit.prototype.getTexType = function CTexUnit_getTexType() {
          if (this.enabled_texCube) {
            return GL_TEXTURE_CUBE_MAP;
          } else if (this.enabled_tex3D) {
            return GL_TEXTURE_3D;
          } else if (this.enabled_tex2D) {
            return GL_TEXTURE_2D;
          } else if (this.enabled_tex1D) {
            return GL_TEXTURE_1D;
          }
          return 0;
        }
  
        CTexEnv.prototype.genPassLines = function CTexEnv_genPassLines(passOutputVar, passInputVar, texUnitID) {
          switch (this.mode) {
            case GL_REPLACE: {
              /* RGB:
               * Cv = Cs
               * Av = Ap // Note how this is different, and that we'll
               *            need to track the bound texture internalFormat
               *            to get this right.
               *
               * RGBA:
               * Cv = Cs
               * Av = As
               */
              return [
                "vec4 " + passOutputVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
              ];
            }
            case GL_ADD: {
              /* RGBA:
               * Cv = Cp + Cs
               * Av = ApAs
               */
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texVar = prefix + "tex";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
  
              return [
                "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
                "vec3 " + colorVar + " = " + passInputVar + ".rgb + " + texVar + ".rgb;",
                "float " + alphaVar + " = " + passInputVar + ".a * " + texVar + ".a;",
                "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");",
              ];
            }
            case GL_MODULATE: {
              /* RGBA:
               * Cv = CpCs
               * Av = ApAs
               */
              var line = [
                "vec4 " + passOutputVar,
                " = ",
                  passInputVar,
                  " * ",
                  genTexUnitSampleExpr(texUnitID),
                ";",
              ];
              return [line.join("")];
            }
            case GL_DECAL: {
              /* RGBA:
               * Cv = Cp(1 - As) + CsAs
               * Av = Ap
               */
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texVar = prefix + "tex";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
  
              return [
                "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
                [
                  "vec3 " + colorVar + " = ",
                    passInputVar + ".rgb * (1.0 - " + texVar + ".a)",
                      " + ",
                    texVar + ".rgb * " + texVar + ".a",
                  ";"
                ].join(""),
                "float " + alphaVar + " = " + passInputVar + ".a;",
                "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");",
              ];
            }
            case GL_BLEND: {
              /* RGBA:
               * Cv = Cp(1 - Cs) + CcCs
               * Av = As
               */
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texVar = prefix + "tex";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
  
              return [
                "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
                [
                  "vec3 " + colorVar + " = ",
                    passInputVar + ".rgb * (1.0 - " + texVar + ".rgb)",
                      " + ",
                    PRIM_COLOR_VARYING + ".rgb * " + texVar + ".rgb",
                  ";"
                ].join(""),
                "float " + alphaVar + " = " + texVar + ".a;",
                "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");",
              ];
            }
            case GL_COMBINE: {
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
              var colorLines = this.genCombinerLines(true, colorVar,
                                                     passInputVar, texUnitID,
                                                     this.colorCombiner, this.colorSrc, this.colorOp);
              var alphaLines = this.genCombinerLines(false, alphaVar,
                                                     passInputVar, texUnitID,
                                                     this.alphaCombiner, this.alphaSrc, this.alphaOp);
  
              // Generate scale, but avoid generating an identity op that multiplies by one.
              var scaledColor = (this.colorScale == 1) ? colorVar : (colorVar + " * " + valToFloatLiteral(this.colorScale));
              var scaledAlpha = (this.alphaScale == 1) ? alphaVar : (alphaVar + " * " + valToFloatLiteral(this.alphaScale));
  
              var line = [
                "vec4 " + passOutputVar,
                " = ",
                  "vec4(",
                      scaledColor,
                      ", ",
                      scaledAlpha,
                  ")",
                ";",
              ].join("");
              return [].concat(colorLines, alphaLines, [line]);
            }
          }
  
          return abort_noSupport("Unsupported TexEnv mode: 0x" + this.mode.toString(16));
        }
  
        CTexEnv.prototype.genCombinerLines = function CTexEnv_getCombinerLines(isColor, outputVar,
                                                                               passInputVar, texUnitID,
                                                                               combiner, srcArr, opArr)
        {
          var argsNeeded = null;
          switch (combiner) {
            case GL_REPLACE:
              argsNeeded = 1;
              break;
  
            case GL_MODULATE:
            case GL_ADD:
            case GL_SUBTRACT:
              argsNeeded = 2;
              break;
  
            case GL_INTERPOLATE:
              argsNeeded = 3;
              break;
  
            default:
              return abort_noSupport("Unsupported combiner: 0x" + combiner.toString(16));
          }
  
          var constantExpr = [
            "vec4(",
              valToFloatLiteral(this.envColor[0]),
              ", ",
              valToFloatLiteral(this.envColor[1]),
              ", ",
              valToFloatLiteral(this.envColor[2]),
              ", ",
              valToFloatLiteral(this.envColor[3]),
            ")",
          ].join("");
          var src0Expr = (argsNeeded >= 1) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[0], opArr[0])
                                           : null;
          var src1Expr = (argsNeeded >= 2) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[1], opArr[1])
                                           : null;
          var src2Expr = (argsNeeded >= 3) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[2], opArr[2])
                                           : null;
  
          var outputType = isColor ? "vec3" : "float";
          var lines = null;
          switch (combiner) {
            case GL_REPLACE: {
              var line = [
                outputType + " " + outputVar,
                " = ",
                  src0Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_MODULATE: {
              var line = [
                outputType + " " + outputVar + " = ",
                  src0Expr + " * " + src1Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_ADD: {
              var line = [
                outputType + " " + outputVar + " = ",
                  src0Expr + " + " + src1Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_SUBTRACT: {
              var line = [
                outputType + " " + outputVar + " = ",
                  src0Expr + " - " + src1Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_INTERPOLATE: {
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var arg2Var = prefix + "colorSrc2";
              var arg2Line = getTypeFromCombineOp(this.colorOp[2]) + " " + arg2Var + " = " + src2Expr + ";";
  
              var line = [
                outputType + " " + outputVar,
                " = ",
                  src0Expr + " * " + arg2Var,
                  " + ",
                  src1Expr + " * (1.0 - " + arg2Var + ")",
                ";",
              ];
              lines = [
                arg2Line,
                line.join(""),
              ];
              break;
            }
  
            default:
              return abort_sanity("Unmatched TexEnv.colorCombiner?");
          }
  
          return lines;
        }
  
        return {
          // Exports:
          init: function(gl, specifiedMaxTextureImageUnits) {
            var maxTexUnits = 0;
            if (specifiedMaxTextureImageUnits) {
              maxTexUnits = specifiedMaxTextureImageUnits;
            } else if (gl) {
              maxTexUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            }
            s_texUnits = [];
            for (var i = 0; i < maxTexUnits; i++) {
              s_texUnits.push(new CTexUnit());
            }
          },
  
          setGLSLVars: function(uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix) {
            TEX_UNIT_UNIFORM_PREFIX   = uTexUnitPrefix;
            TEX_COORD_VARYING_PREFIX  = vTexCoordPrefix;
            PRIM_COLOR_VARYING        = vPrimColor;
            TEX_MATRIX_UNIFORM_PREFIX = uTexMatrixPrefix;
          },
  
          genAllPassLines: function(resultDest, indentSize) {
            indentSize = indentSize || 0;
  
            s_requiredTexUnitsForPass.length = 0; // Clear the list.
            var lines = [];
            var lastPassVar = PRIM_COLOR_VARYING;
            for (var i = 0; i < s_texUnits.length; i++) {
              if (!s_texUnits[i].enabled()) continue;
  
              s_requiredTexUnitsForPass.push(i);
  
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + i + "_";
              var passOutputVar = prefix + "result";
  
              var newLines = s_texUnits[i].genPassLines(passOutputVar, lastPassVar, i);
              lines = lines.concat(newLines, [""]);
  
              lastPassVar = passOutputVar;
            }
            lines.push(resultDest + " = " + lastPassVar + ";");
  
            var indent = "";
            for (var i = 0; i < indentSize; i++) indent += " ";
  
            var output = indent + lines.join("\n" + indent);
  
            return output;
          },
  
          getUsedTexUnitList: function() {
            return s_requiredTexUnitsForPass;
          },
  
          traverseState: function(keyView) {
            for (var i = 0; i < s_texUnits.length; i++) {
              s_texUnits[i].traverseState(keyView);
            }
          },
  
          getTexUnitType: function(texUnitID) {
            return s_texUnits[texUnitID].getTexType();
          },
  
          // Hooks:
          hook_activeTexture: function(texture) {
            s_activeTexture = texture - GL_TEXTURE0;
          },
  
          hook_enable: function(cap) {
            var cur = getCurTexUnit();
            switch (cap) {
              case GL_TEXTURE_1D:
                if (!cur.enabled_tex1D) {
                  GLImmediate.currentRenderer = null; // Renderer state changed, and must be recreated or looked up again.
                  cur.enabled_tex1D = true;
                  cur.texTypesEnabled |= 1;
                }
                break;
              case GL_TEXTURE_2D:
                if (!cur.enabled_tex2D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex2D = true;
                  cur.texTypesEnabled |= 2;
                }
                break;
              case GL_TEXTURE_3D:
                if (!cur.enabled_tex3D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex3D = true;
                  cur.texTypesEnabled |= 4;
                }
                break;
              case GL_TEXTURE_CUBE_MAP:
                if (!cur.enabled_texCube) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_texCube = true;
                  cur.texTypesEnabled |= 8;
                }
                break;
            }
          },
  
          hook_disable: function(cap) {
            var cur = getCurTexUnit();
            switch (cap) {
              case GL_TEXTURE_1D:
                if (cur.enabled_tex1D) {
                  GLImmediate.currentRenderer = null; // Renderer state changed, and must be recreated or looked up again.
                  cur.enabled_tex1D = false;
                  cur.texTypesEnabled &= ~1;
                }
                break;
              case GL_TEXTURE_2D:
                if (cur.enabled_tex2D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex2D = false;
                  cur.texTypesEnabled &= ~2;
                }
                break;
              case GL_TEXTURE_3D:
                if (cur.enabled_tex3D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex3D = false;
                  cur.texTypesEnabled &= ~4;
                }
                break;
              case GL_TEXTURE_CUBE_MAP:
                if (cur.enabled_texCube) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_texCube = false;
                  cur.texTypesEnabled &= ~8;
                }
                break;
            }
          },
  
          hook_texEnvf: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_RGB_SCALE:
                if (env.colorScale != param) {
                  env.invalidateKey(); // We changed FFP emulation renderer state.
                  env.colorScale = param;
                }
                break;
              case GL_ALPHA_SCALE:
                if (env.alphaScale != param) {
                  env.invalidateKey();
                  env.alphaScale = param;
                }
                break;
  
              default:
                Module.printErr('WARNING: Unhandled `pname` in call to `glTexEnvf`.');
            }
          },
  
          hook_texEnvi: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_MODE:
                if (env.mode != param) {
                  env.invalidateKey(); // We changed FFP emulation renderer state.
                  env.mode = param;
                }
                break;
  
              case GL_COMBINE_RGB:
                if (env.colorCombiner != param) {
                  env.invalidateKey();
                  env.colorCombiner = param;
                }
                break;
              case GL_COMBINE_ALPHA:
                if (env.alphaCombiner != param) {
                  env.invalidateKey();
                  env.alphaCombiner = param;
                }
                break;
  
              case GL_SRC0_RGB:
                if (env.colorSrc[0] != param) {
                  env.invalidateKey();
                  env.colorSrc[0] = param;
                }
                break;
              case GL_SRC1_RGB:
                if (env.colorSrc[1] != param) {
                  env.invalidateKey();
                  env.colorSrc[1] = param;
                }
                break;
              case GL_SRC2_RGB:
                if (env.colorSrc[2] != param) {
                  env.invalidateKey();
                  env.colorSrc[2] = param;
                }
                break;
  
              case GL_SRC0_ALPHA:
                if (env.alphaSrc[0] != param) {
                  env.invalidateKey();
                  env.alphaSrc[0] = param;
                }
                break;
              case GL_SRC1_ALPHA:
                if (env.alphaSrc[1] != param) {
                  env.invalidateKey();
                  env.alphaSrc[1] = param;
                }
                break;
              case GL_SRC2_ALPHA:
                if (env.alphaSrc[2] != param) {
                  env.invalidateKey();
                  env.alphaSrc[2] = param;
                }
                break;
  
              case GL_OPERAND0_RGB:
                if (env.colorOp[0] != param) {
                  env.invalidateKey();
                  env.colorOp[0] = param;
                }
                break;
              case GL_OPERAND1_RGB:
                if (env.colorOp[1] != param) {
                  env.invalidateKey();
                  env.colorOp[1] = param;
                }
                break;
              case GL_OPERAND2_RGB:
                if (env.colorOp[2] != param) {
                  env.invalidateKey();
                  env.colorOp[2] = param;
                }
                break;
  
              case GL_OPERAND0_ALPHA:
                if (env.alphaOp[0] != param) {
                  env.invalidateKey();
                  env.alphaOp[0] = param;
                }
                break;
              case GL_OPERAND1_ALPHA:
                if (env.alphaOp[1] != param) {
                  env.invalidateKey();
                  env.alphaOp[1] = param;
                }
                break;
              case GL_OPERAND2_ALPHA:
                if (env.alphaOp[2] != param) {
                  env.invalidateKey();
                  env.alphaOp[2] = param;
                }
                break;
  
              case GL_RGB_SCALE:
                if (env.colorScale != param) {
                  env.invalidateKey();
                  env.colorScale = param;
                }
                break;
              case GL_ALPHA_SCALE:
                if (env.alphaScale != param) {
                  env.invalidateKey();
                  env.alphaScale = param;
                }
                break;
  
              default:
                Module.printErr('WARNING: Unhandled `pname` in call to `glTexEnvi`.');
            }
          },
  
          hook_texEnvfv: function(target, pname, params) {
            if (target != GL_TEXTURE_ENV) return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_COLOR: {
                for (var i = 0; i < 4; i++) {
                  var param = HEAPF32[(((params)+(i*4))>>2)];
                  if (env.envColor[i] != param) {
                    env.invalidateKey(); // We changed FFP emulation renderer state.
                    env.envColor[i] = param;
                  }
                }
                break
              }
              default:
                Module.printErr('WARNING: Unhandled `pname` in call to `glTexEnvfv`.');
            }
          },
  
          hook_getTexEnviv: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_MODE:
                HEAP32[((param)>>2)]=env.mode;
                return;
  
              case GL_TEXTURE_ENV_COLOR:
                HEAP32[((param)>>2)]=Math.max(Math.min(env.envColor[0]*255, 255, -255));
                HEAP32[(((param)+(1))>>2)]=Math.max(Math.min(env.envColor[1]*255, 255, -255));
                HEAP32[(((param)+(2))>>2)]=Math.max(Math.min(env.envColor[2]*255, 255, -255));
                HEAP32[(((param)+(3))>>2)]=Math.max(Math.min(env.envColor[3]*255, 255, -255));
                return;
  
              case GL_COMBINE_RGB:
                HEAP32[((param)>>2)]=env.colorCombiner;
                return;
  
              case GL_COMBINE_ALPHA:
                HEAP32[((param)>>2)]=env.alphaCombiner;
                return;
  
              case GL_SRC0_RGB:
                HEAP32[((param)>>2)]=env.colorSrc[0];
                return;
  
              case GL_SRC1_RGB:
                HEAP32[((param)>>2)]=env.colorSrc[1];
                return;
  
              case GL_SRC2_RGB:
                HEAP32[((param)>>2)]=env.colorSrc[2];
                return;
  
              case GL_SRC0_ALPHA:
                HEAP32[((param)>>2)]=env.alphaSrc[0];
                return;
  
              case GL_SRC1_ALPHA:
                HEAP32[((param)>>2)]=env.alphaSrc[1];
                return;
  
              case GL_SRC2_ALPHA:
                HEAP32[((param)>>2)]=env.alphaSrc[2];
                return;
  
              case GL_OPERAND0_RGB:
                HEAP32[((param)>>2)]=env.colorOp[0];
                return;
  
              case GL_OPERAND1_RGB:
                HEAP32[((param)>>2)]=env.colorOp[1];
                return;
  
              case GL_OPERAND2_RGB:
                HEAP32[((param)>>2)]=env.colorOp[2];
                return;
  
              case GL_OPERAND0_ALPHA:
                HEAP32[((param)>>2)]=env.alphaOp[0];
                return;
  
              case GL_OPERAND1_ALPHA:
                HEAP32[((param)>>2)]=env.alphaOp[1];
                return;
  
              case GL_OPERAND2_ALPHA:
                HEAP32[((param)>>2)]=env.alphaOp[2];
                return;
  
              case GL_RGB_SCALE:
                HEAP32[((param)>>2)]=env.colorScale;
                return;
  
              case GL_ALPHA_SCALE:
                HEAP32[((param)>>2)]=env.alphaScale;
                return;
  
              default:
                Module.printErr('WARNING: Unhandled `pname` in call to `glGetTexEnvi`.');
            }
          },
  
          hook_getTexEnvfv: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_COLOR:
                HEAPF32[((param)>>2)]=env.envColor[0];
                HEAPF32[(((param)+(4))>>2)]=env.envColor[1];
                HEAPF32[(((param)+(8))>>2)]=env.envColor[2];
                HEAPF32[(((param)+(12))>>2)]=env.envColor[3];
                return;
            }
          }
        };
      },vertexData:null,vertexDataU8:null,tempData:null,indexData:null,vertexCounter:0,mode:-1,rendererCache:null,rendererComponents:[],rendererComponentPointer:0,lastRenderer:null,lastArrayBuffer:null,lastProgram:null,lastStride:-1,matrix:[],matrixStack:[],currentMatrix:0,tempMatrix:null,matricesModified:false,useTextureMatrix:false,VERTEX:0,NORMAL:1,COLOR:2,TEXTURE0:3,NUM_ATTRIBUTES:-1,MAX_TEXTURES:-1,totalEnabledClientAttributes:0,enabledClientAttributes:[0,0],clientAttributes:[],liveClientAttributes:[],currentRenderer:null,modifiedClientAttributes:false,clientActiveTexture:0,clientColor:null,usedTexUnitList:[],fixedFunctionProgram:null,setClientAttribute:function setClientAttribute(name, size, type, stride, pointer) {
        var attrib = GLImmediate.clientAttributes[name];
        if (!attrib) {
          for (var i = 0; i <= name; i++) { // keep flat
            if (!GLImmediate.clientAttributes[i]) {
              GLImmediate.clientAttributes[i] = {
                name: name,
                size: size,
                type: type,
                stride: stride,
                pointer: pointer,
                offset: 0
              };
            }
          }
        } else {
          attrib.name = name;
          attrib.size = size;
          attrib.type = type;
          attrib.stride = stride;
          attrib.pointer = pointer;
          attrib.offset = 0;
        }
        GLImmediate.modifiedClientAttributes = true;
      },addRendererComponent:function addRendererComponent(name, size, type) {
        if (!GLImmediate.rendererComponents[name]) {
          GLImmediate.rendererComponents[name] = 1;
          GLImmediate.enabledClientAttributes[name] = true;
          GLImmediate.setClientAttribute(name, size, type, 0, GLImmediate.rendererComponentPointer);
          GLImmediate.rendererComponentPointer += size * GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
        } else {
          GLImmediate.rendererComponents[name]++;
        }
      },disableBeginEndClientAttributes:function disableBeginEndClientAttributes() {
        for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
          if (GLImmediate.rendererComponents[i]) GLImmediate.enabledClientAttributes[i] = false;
        }
      },getRenderer:function getRenderer() {
        // If no FFP state has changed that would have forced to re-evaluate which FFP emulation shader to use,
        // we have the currently used renderer in cache, and can immediately return that.
        if (GLImmediate.currentRenderer) {
          return GLImmediate.currentRenderer;
        }
        // return a renderer object given the liveClientAttributes
        // we maintain a cache of renderers, optimized to not generate garbage
        var attributes = GLImmediate.liveClientAttributes;
        var cacheMap = GLImmediate.rendererCache;
        var keyView = cacheMap.getStaticKeyView().reset();
  
        // By attrib state:
        var enabledAttributesKey = 0;
        for (var i = 0; i < attributes.length; i++) {
          enabledAttributesKey |= 1 << attributes[i].name;
        }
  
        // By fog state:
        var fogParam = 0;
        if (GLEmulation.fogEnabled) {
          switch (GLEmulation.fogMode) {
            case 0x0801: // GL_EXP2
              fogParam = 1;
              break;
            case 0x2601: // GL_LINEAR
              fogParam = 2;
              break;
            default: // default to GL_EXP
              fogParam = 3;
              break;
          }
        }
        keyView.next((enabledAttributesKey << 2) | fogParam);
  
        // By cur program:
        keyView.next(GL.currProgram);
        if (!GL.currProgram) {
          GLImmediate.TexEnvJIT.traverseState(keyView);
        }
  
        // If we don't already have it, create it.
        var renderer = keyView.get();
        if (!renderer) {
          renderer = GLImmediate.createRenderer();
          GLImmediate.currentRenderer = renderer;
          keyView.set(renderer);
          return renderer;
        }
        GLImmediate.currentRenderer = renderer; // Cache the currently used renderer, so later lookups without state changes can get this fast.
        return renderer;
      },createRenderer:function createRenderer(renderer) {
        var useCurrProgram = !!GL.currProgram;
        var hasTextures = false;
        for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
          var texAttribName = GLImmediate.TEXTURE0 + i;
          if (!GLImmediate.enabledClientAttributes[texAttribName])
            continue;
  
  
          hasTextures = true;
        }
  
        var ret = {
          init: function init() {
            // For fixed-function shader generation.
            var uTexUnitPrefix = 'u_texUnit';
            var aTexCoordPrefix = 'a_texCoord';
            var vTexCoordPrefix = 'v_texCoord';
            var vPrimColor = 'v_color';
            var uTexMatrixPrefix = GLImmediate.useTextureMatrix ? 'u_textureMatrix' : null;
  
            if (useCurrProgram) {
              if (GL.shaderInfos[GL.programShaders[GL.currProgram][0]].type == GLctx.VERTEX_SHADER) {
                this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
                this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
              } else {
                this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
                this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
              }
              this.program = GL.programs[GL.currProgram];
              this.usedTexUnitList = [];
            } else {
              // IMPORTANT NOTE: If you parameterize the shader source based on any runtime values
              // in order to create the least expensive shader possible based on the features being
              // used, you should also update the code in the beginning of getRenderer to make sure
              // that you cache the renderer based on the said parameters.
              if (GLEmulation.fogEnabled) {
                switch (GLEmulation.fogMode) {
                  case 0x0801: // GL_EXP2
                    // fog = exp(-(gl_Fog.density * gl_FogFragCoord)^2)
                    var fogFormula = '  float fog = exp(-u_fogDensity * u_fogDensity * ecDistance * ecDistance); \n';
                    break;
                  case 0x2601: // GL_LINEAR
                    // fog = (gl_Fog.end - gl_FogFragCoord) * gl_fog.scale
                    var fogFormula = '  float fog = (u_fogEnd - ecDistance) * u_fogScale; \n';
                    break;
                  default: // default to GL_EXP
                    // fog = exp(-gl_Fog.density * gl_FogFragCoord)
                    var fogFormula = '  float fog = exp(-u_fogDensity * ecDistance); \n';
                    break;
                }
              }
  
              GLImmediate.TexEnvJIT.setGLSLVars(uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix);
              var fsTexEnvPass = GLImmediate.TexEnvJIT.genAllPassLines('gl_FragColor', 2);
  
              var texUnitAttribList = '';
              var texUnitVaryingList = '';
              var texUnitUniformList = '';
              var vsTexCoordInits = '';
              this.usedTexUnitList = GLImmediate.TexEnvJIT.getUsedTexUnitList();
              for (var i = 0; i < this.usedTexUnitList.length; i++) {
                var texUnit = this.usedTexUnitList[i];
                texUnitAttribList += 'attribute vec4 ' + aTexCoordPrefix + texUnit + ';\n';
                texUnitVaryingList += 'varying vec4 ' + vTexCoordPrefix + texUnit + ';\n';
                texUnitUniformList += 'uniform sampler2D ' + uTexUnitPrefix + texUnit + ';\n';
                vsTexCoordInits += '  ' + vTexCoordPrefix + texUnit + ' = ' + aTexCoordPrefix + texUnit + ';\n';
  
                if (GLImmediate.useTextureMatrix) {
                  texUnitUniformList += 'uniform mat4 ' + uTexMatrixPrefix + texUnit + ';\n';
                }
              }
  
              var vsFogVaryingInit = null;
              if (GLEmulation.fogEnabled) {
                vsFogVaryingInit = '  v_fogFragCoord = abs(ecPosition.z);\n';
              }
  
              var vsSource = [
                'attribute vec4 a_position;',
                'attribute vec4 a_color;',
                'varying vec4 v_color;',
                texUnitAttribList,
                texUnitVaryingList,
                (GLEmulation.fogEnabled ? 'varying float v_fogFragCoord;' : null),
                'uniform mat4 u_modelView;',
                'uniform mat4 u_projection;',
                'void main()',
                '{',
                '  vec4 ecPosition = u_modelView * a_position;', // eye-coordinate position
                '  gl_Position = u_projection * ecPosition;',
                '  v_color = a_color;',
                vsTexCoordInits,
                vsFogVaryingInit,
                '}',
                ''
              ].join('\n').replace(/\n\n+/g, '\n');
  
              this.vertexShader = GLctx.createShader(GLctx.VERTEX_SHADER);
              GLctx.shaderSource(this.vertexShader, vsSource);
              GLctx.compileShader(this.vertexShader);
  
              var fogHeaderIfNeeded = null;
              if (GLEmulation.fogEnabled) {
                fogHeaderIfNeeded = [
                  '',
                  'varying float v_fogFragCoord; ',
                  'uniform vec4 u_fogColor;      ',
                  'uniform float u_fogEnd;       ',
                  'uniform float u_fogScale;     ',
                  'uniform float u_fogDensity;   ',
                  'float ffog(in float ecDistance) { ',
                  fogFormula,
                  '  fog = clamp(fog, 0.0, 1.0); ',
                  '  return fog;                 ',
                  '}',
                  '',
                ].join("\n");
              }
  
              var fogPass = null;
              if (GLEmulation.fogEnabled) {
                fogPass = 'gl_FragColor = vec4(mix(u_fogColor.rgb, gl_FragColor.rgb, ffog(v_fogFragCoord)), gl_FragColor.a);\n';
              }
  
              var fsSource = [
                'precision mediump float;',
                texUnitVaryingList,
                texUnitUniformList,
                'varying vec4 v_color;',
                fogHeaderIfNeeded,
                'void main()',
                '{',
                fsTexEnvPass,
                fogPass,
                '}',
                ''
              ].join("\n").replace(/\n\n+/g, '\n');
  
              this.fragmentShader = GLctx.createShader(GLctx.FRAGMENT_SHADER);
              GLctx.shaderSource(this.fragmentShader, fsSource);
              GLctx.compileShader(this.fragmentShader);
  
              this.program = GLctx.createProgram();
              GLctx.attachShader(this.program, this.vertexShader);
              GLctx.attachShader(this.program, this.fragmentShader);
  
              // As optimization, bind all attributes to prespecified locations, so that the FFP emulation
              // code can submit attributes to any generated FFP shader without having to examine each shader in turn.
              // These prespecified locations are only assumed if GL_FFP_ONLY is specified, since user could also create their
              // own shaders that didn't have attributes in the same locations.
              GLctx.bindAttribLocation(this.program, GLImmediate.VERTEX, 'a_position');
              GLctx.bindAttribLocation(this.program, GLImmediate.COLOR, 'a_color');
              GLctx.bindAttribLocation(this.program, GLImmediate.NORMAL, 'a_normal');
              var maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
              for (var i = 0; i < GLImmediate.MAX_TEXTURES && GLImmediate.TEXTURE0 + i < maxVertexAttribs; i++) {
                GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, 'a_texCoord'+i);
                GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, aTexCoordPrefix+i);
              }
              GLctx.linkProgram(this.program);
            }
  
            // Stores an array that remembers which matrix uniforms are up-to-date in this FFP renderer, so they don't need to be resubmitted
            // each time we render with this program.
            this.textureMatrixVersion = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  
            this.positionLocation = GLctx.getAttribLocation(this.program, 'a_position');
  
            this.texCoordLocations = [];
  
            for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              if (!GLImmediate.enabledClientAttributes[GLImmediate.TEXTURE0 + i]) {
                this.texCoordLocations[i] = -1;
                continue;
              }
  
              if (useCurrProgram) {
                this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, 'a_texCoord' + i);
              } else {
                this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, aTexCoordPrefix + i);
              }
            }
            this.colorLocation = GLctx.getAttribLocation(this.program, 'a_color');
            if (!useCurrProgram) {
              // Temporarily switch to the program so we can set our sampler uniforms early.
              var prevBoundProg = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
              GLctx.useProgram(this.program);
              {
                for (var i = 0; i < this.usedTexUnitList.length; i++) {
                  var texUnitID = this.usedTexUnitList[i];
                  var texSamplerLoc = GLctx.getUniformLocation(this.program, uTexUnitPrefix + texUnitID);
                  GLctx.uniform1i(texSamplerLoc, texUnitID);
                }
              }
              // The default color attribute value is not the same as the default for all other attribute streams (0,0,0,1) but (1,1,1,1),
              // so explicitly set it right at start.
              GLctx.vertexAttrib4fv(this.colorLocation, [1,1,1,1]);
              GLctx.useProgram(prevBoundProg);
            }
  
            this.textureMatrixLocations = [];
            for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              this.textureMatrixLocations[i] = GLctx.getUniformLocation(this.program, 'u_textureMatrix' + i);
            }
            this.normalLocation = GLctx.getAttribLocation(this.program, 'a_normal');
  
            this.modelViewLocation = GLctx.getUniformLocation(this.program, 'u_modelView');
            this.projectionLocation = GLctx.getUniformLocation(this.program, 'u_projection');
  
            this.hasTextures = hasTextures;
            this.hasNormal = GLImmediate.enabledClientAttributes[GLImmediate.NORMAL] &&
                             GLImmediate.clientAttributes[GLImmediate.NORMAL].size > 0 &&
                             this.normalLocation >= 0;
            this.hasColor = (this.colorLocation === 0) || this.colorLocation > 0;
  
            this.floatType = GLctx.FLOAT; // minor optimization
  
            this.fogColorLocation = GLctx.getUniformLocation(this.program, 'u_fogColor');
            this.fogEndLocation = GLctx.getUniformLocation(this.program, 'u_fogEnd');
            this.fogScaleLocation = GLctx.getUniformLocation(this.program, 'u_fogScale');
            this.fogDensityLocation = GLctx.getUniformLocation(this.program, 'u_fogDensity');
            this.hasFog = !!(this.fogColorLocation || this.fogEndLocation ||
                             this.fogScaleLocation || this.fogDensityLocation);
          },
  
          prepare: function prepare() {
            // Calculate the array buffer
            var arrayBuffer;
            if (!GL.currArrayBuffer) {
              var start = GLImmediate.firstVertex*GLImmediate.stride;
              var end = GLImmediate.lastVertex*GLImmediate.stride;
              arrayBuffer = GL.getTempVertexBuffer(end);
              // TODO: consider using the last buffer we bound, if it was larger. downside is larger buffer, but we might avoid rebinding and preparing
            } else {
              arrayBuffer = GL.currArrayBuffer;
            }
  
            // If the array buffer is unchanged and the renderer as well, then we can avoid all the work here
            // XXX We use some heuristics here, and this may not work in all cases. Try disabling GL_UNSAFE_OPTS if you
            // have odd glitches
            var lastRenderer = GLImmediate.lastRenderer;
            var canSkip = this == lastRenderer &&
                          arrayBuffer == GLImmediate.lastArrayBuffer &&
                          (GL.currProgram || this.program) == GLImmediate.lastProgram &&
                          GLImmediate.stride == GLImmediate.lastStride &&
                          !GLImmediate.matricesModified;
            if (!canSkip && lastRenderer) lastRenderer.cleanup();
            if (!GL.currArrayBuffer) {
              // Bind the array buffer and upload data after cleaning up the previous renderer
  
              if (arrayBuffer != GLImmediate.lastArrayBuffer) {
                GLctx.bindBuffer(GLctx.ARRAY_BUFFER, arrayBuffer);
                GLImmediate.lastArrayBuffer = arrayBuffer;
              }
  
              GLctx.bufferSubData(GLctx.ARRAY_BUFFER, start, GLImmediate.vertexData.subarray(start >> 2, end >> 2));
            }
            if (canSkip) return;
            GLImmediate.lastRenderer = this;
            GLImmediate.lastProgram = GL.currProgram || this.program;
            GLImmediate.lastStride == GLImmediate.stride;
            GLImmediate.matricesModified = false;
  
            if (!GL.currProgram) {
              if (GLImmediate.fixedFunctionProgram != this.program) {
                GLctx.useProgram(this.program);
                GLImmediate.fixedFunctionProgram = this.program;
              }
            }
  
            if (this.modelViewLocation && this.modelViewMatrixVersion != GLImmediate.matrixVersion[0/*m*/]) {
              this.modelViewMatrixVersion = GLImmediate.matrixVersion[0/*m*/];
              GLctx.uniformMatrix4fv(this.modelViewLocation, false, GLImmediate.matrix[0/*m*/]);
            }
            if (this.projectionLocation && this.projectionMatrixVersion != GLImmediate.matrixVersion[1/*p*/]) {
              this.projectionMatrixVersion = GLImmediate.matrixVersion[1/*p*/];
              GLctx.uniformMatrix4fv(this.projectionLocation, false, GLImmediate.matrix[1/*p*/]);
            }
  
            var clientAttributes = GLImmediate.clientAttributes;
            var posAttr = clientAttributes[GLImmediate.VERTEX];
  
  
            GLctx.vertexAttribPointer(this.positionLocation, posAttr.size, posAttr.type, false, GLImmediate.stride, posAttr.offset);
            GLctx.enableVertexAttribArray(this.positionLocation);
            if (this.hasNormal) {
              var normalAttr = clientAttributes[GLImmediate.NORMAL];
              GLctx.vertexAttribPointer(this.normalLocation, normalAttr.size, normalAttr.type, true, GLImmediate.stride, normalAttr.offset);
              GLctx.enableVertexAttribArray(this.normalLocation);
            }
            if (this.hasTextures) {
              for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                var attribLoc = this.texCoordLocations[i];
                if (attribLoc === undefined || attribLoc < 0) continue;
                var texAttr = clientAttributes[GLImmediate.TEXTURE0+i];
  
                if (texAttr.size) {
                  GLctx.vertexAttribPointer(attribLoc, texAttr.size, texAttr.type, false, GLImmediate.stride, texAttr.offset);
                  GLctx.enableVertexAttribArray(attribLoc);
                } else {
                  // These two might be dangerous, but let's try them.
                  GLctx.vertexAttrib4f(attribLoc, 0, 0, 0, 1);
                  GLctx.disableVertexAttribArray(attribLoc);
                }
                var t = 2/*t*/+i;
                if (this.textureMatrixLocations[i] && this.textureMatrixVersion[t] != GLImmediate.matrixVersion[t]) { // XXX might we need this even without the condition we are currently in?
                  this.textureMatrixVersion[t] = GLImmediate.matrixVersion[t];
                  GLctx.uniformMatrix4fv(this.textureMatrixLocations[i], false, GLImmediate.matrix[t]);
                }
              }
            }
            if (GLImmediate.enabledClientAttributes[GLImmediate.COLOR]) {
              var colorAttr = clientAttributes[GLImmediate.COLOR];
              GLctx.vertexAttribPointer(this.colorLocation, colorAttr.size, colorAttr.type, true, GLImmediate.stride, colorAttr.offset);
              GLctx.enableVertexAttribArray(this.colorLocation);
            }
            else if (this.hasColor) {
              GLctx.disableVertexAttribArray(this.colorLocation);
              GLctx.vertexAttrib4fv(this.colorLocation, GLImmediate.clientColor);
            }
            if (this.hasFog) {
              if (this.fogColorLocation) GLctx.uniform4fv(this.fogColorLocation, GLEmulation.fogColor);
              if (this.fogEndLocation) GLctx.uniform1f(this.fogEndLocation, GLEmulation.fogEnd);
              if (this.fogScaleLocation) GLctx.uniform1f(this.fogScaleLocation, 1/(GLEmulation.fogEnd - GLEmulation.fogStart));
              if (this.fogDensityLocation) GLctx.uniform1f(this.fogDensityLocation, GLEmulation.fogDensity);
            }
          },
  
          cleanup: function cleanup() {
            GLctx.disableVertexAttribArray(this.positionLocation);
            if (this.hasTextures) {
              for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                if (GLImmediate.enabledClientAttributes[GLImmediate.TEXTURE0+i] && this.texCoordLocations[i] >= 0) {
                  GLctx.disableVertexAttribArray(this.texCoordLocations[i]);
                }
              }
            }
            if (this.hasColor) {
              GLctx.disableVertexAttribArray(this.colorLocation);
            }
            if (this.hasNormal) {
              GLctx.disableVertexAttribArray(this.normalLocation);
            }
            if (!GL.currProgram) {
              GLctx.useProgram(null);
              GLImmediate.fixedFunctionProgram = 0;
            }
            if (!GL.currArrayBuffer) {
              GLctx.bindBuffer(GLctx.ARRAY_BUFFER, null);
              GLImmediate.lastArrayBuffer = null;
            }
  
            GLImmediate.lastRenderer = null;
            GLImmediate.lastProgram = null;
            GLImmediate.matricesModified = true;
          }
        };
        ret.init();
        return ret;
      },setupFuncs:function () {
        // Replace some functions with immediate-mode aware versions. If there are no client
        // attributes enabled, and we use webgl-friendly modes (no GL_QUADS), then no need
        // for emulation
        _glDrawArrays = _emscripten_glDrawArrays = function _glDrawArrays(mode, first, count) {
          if (GLImmediate.totalEnabledClientAttributes == 0 && mode <= 6) {
            GLctx.drawArrays(mode, first, count);
            return;
          }
          GLImmediate.prepareClientAttributes(count, false);
          GLImmediate.mode = mode;
          if (!GL.currArrayBuffer) {
            GLImmediate.vertexData = HEAPF32.subarray((GLImmediate.vertexPointer)>>2,(GLImmediate.vertexPointer + (first+count)*GLImmediate.stride)>>2); // XXX assuming float
            GLImmediate.firstVertex = first;
            GLImmediate.lastVertex = first + count;
          }
          GLImmediate.flush(null, first);
          GLImmediate.mode = -1;
        };
  
        _glDrawElements = _emscripten_glDrawElements = function _glDrawElements(mode, count, type, indices, start, end) { // start, end are given if we come from glDrawRangeElements
          if (GLImmediate.totalEnabledClientAttributes == 0 && mode <= 6 && GL.currElementArrayBuffer) {
            GLctx.drawElements(mode, count, type, indices);
            return;
          }
          GLImmediate.prepareClientAttributes(count, false);
          GLImmediate.mode = mode;
          if (!GL.currArrayBuffer) {
            GLImmediate.firstVertex = end ? start : TOTAL_MEMORY; // if we don't know the start, set an invalid value and we will calculate it later from the indices
            GLImmediate.lastVertex = end ? end+1 : 0;
            GLImmediate.vertexData = HEAPF32.subarray((GLImmediate.vertexPointer)>>2,((end ? GLImmediate.vertexPointer + (end+1)*GLImmediate.stride : TOTAL_MEMORY))>>2); // XXX assuming float
          }
          GLImmediate.flush(count, 0, indices);
          GLImmediate.mode = -1;
        };
  
        // TexEnv stuff needs to be prepared early, so do it here.
        // init() is too late for -O2, since it freezes the GL functions
        // by that point.
        GLImmediate.MapTreeLib = GLImmediate.spawnMapTreeLib();
        GLImmediate.spawnMapTreeLib = null;
  
        GLImmediate.TexEnvJIT = GLImmediate.spawnTexEnvJIT();
        GLImmediate.spawnTexEnvJIT = null;
  
        GLImmediate.setupHooks();
      },setupHooks:function () {
        if (!GLEmulation.hasRunInit) {
          GLEmulation.init();
        }
  
        var glActiveTexture = _glActiveTexture;
        _glActiveTexture = _emscripten_glActiveTexture = function _glActiveTexture(texture) {
          GLImmediate.TexEnvJIT.hook_activeTexture(texture);
          glActiveTexture(texture);
        };
  
        var glEnable = _glEnable;
        _glEnable = _emscripten_glEnable = function _glEnable(cap) {
          GLImmediate.TexEnvJIT.hook_enable(cap);
          glEnable(cap);
        };
        var glDisable = _glDisable;
        _glDisable = _emscripten_glDisable = function _glDisable(cap) {
          GLImmediate.TexEnvJIT.hook_disable(cap);
          glDisable(cap);
        };
  
        var glTexEnvf = (typeof(_glTexEnvf) != 'undefined') ? _glTexEnvf : function(){};
        _glTexEnvf = _emscripten_glTexEnvf = function _glTexEnvf(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_texEnvf(target, pname, param);
          // Don't call old func, since we are the implementor.
          //glTexEnvf(target, pname, param);
        };
        var glTexEnvi = (typeof(_glTexEnvi) != 'undefined') ? _glTexEnvi : function(){};
        _glTexEnvi = _emscripten_glTexEnvi = function _glTexEnvi(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_texEnvi(target, pname, param);
          // Don't call old func, since we are the implementor.
          //glTexEnvi(target, pname, param);
        };
        var glTexEnvfv = (typeof(_glTexEnvfv) != 'undefined') ? _glTexEnvfv : function(){};
        _glTexEnvfv = _emscripten_glTexEnvfv = function _glTexEnvfv(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_texEnvfv(target, pname, param);
          // Don't call old func, since we are the implementor.
          //glTexEnvfv(target, pname, param);
        };
  
        _glGetTexEnviv = function _glGetTexEnviv(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_getTexEnviv(target, pname, param);
        };
  
        _glGetTexEnvfv = function _glGetTexEnvfv(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_getTexEnvfv(target, pname, param);
        };
  
        var glGetIntegerv = _glGetIntegerv;
        _glGetIntegerv = _emscripten_glGetIntegerv = function _glGetIntegerv(pname, params) {
          switch (pname) {
            case 0x8B8D: { // GL_CURRENT_PROGRAM
              // Just query directly so we're working with WebGL objects.
              var cur = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
              if (cur == GLImmediate.fixedFunctionProgram) {
                // Pretend we're not using a program.
                HEAP32[((params)>>2)]=0;
                return;
              }
              break;
            }
          }
          glGetIntegerv(pname, params);
        };
      },initted:false,init:function () {
        Module.printErr('WARNING: using emscripten GL immediate mode emulation. This is very limited in what it supports');
        GLImmediate.initted = true;
  
        if (!Module.useWebGL) return; // a 2D canvas may be currently used TODO: make sure we are actually called in that case
  
        // User can override the maximum number of texture units that we emulate. Using fewer texture units increases runtime performance
        // slightly, so it is advantageous to choose as small value as needed.
        GLImmediate.MAX_TEXTURES = Module['GL_MAX_TEXTURE_IMAGE_UNITS'] || GLctx.getParameter(GLctx.MAX_TEXTURE_IMAGE_UNITS);
  
        GLImmediate.TexEnvJIT.init(GLctx, GLImmediate.MAX_TEXTURES);
  
        GLImmediate.NUM_ATTRIBUTES = 3 /*pos+normal+color attributes*/ + GLImmediate.MAX_TEXTURES;
        GLImmediate.clientAttributes = [];
        GLEmulation.enabledClientAttribIndices = [];
        for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
          GLImmediate.clientAttributes.push({});
          GLEmulation.enabledClientAttribIndices.push(false);
        }
  
        // Initialize matrix library
        // When user sets a matrix, increment a 'version number' on the new data, and when rendering, submit
        // the matrices to the shader program only if they have an old version of the data.
        GLImmediate.matrix = [];
        GLImmediate.matrixStack = [];
        GLImmediate.matrixVersion = [];
        for (var i = 0; i < 2 + GLImmediate.MAX_TEXTURES; i++) { // Modelview, Projection, plus one matrix for each texture coordinate.
          GLImmediate.matrixStack.push([]);
          GLImmediate.matrixVersion.push(0);
          GLImmediate.matrix.push(GLImmediate.matrixLib.mat4.create());
          GLImmediate.matrixLib.mat4.identity(GLImmediate.matrix[i]);
        }
  
        // Renderer cache
        GLImmediate.rendererCache = GLImmediate.MapTreeLib.create();
  
        // Buffers for data
        GLImmediate.tempData = new Float32Array(GL.MAX_TEMP_BUFFER_SIZE >> 2);
        GLImmediate.indexData = new Uint16Array(GL.MAX_TEMP_BUFFER_SIZE >> 1);
  
        GLImmediate.vertexDataU8 = new Uint8Array(GLImmediate.tempData.buffer);
  
        GL.generateTempBuffers(true);
  
        GLImmediate.clientColor = new Float32Array([1, 1, 1, 1]);
      },prepareClientAttributes:function prepareClientAttributes(count, beginEnd) {
        // If no client attributes were modified since we were last called, do nothing. Note that this
        // does not work for glBegin/End, where we generate renderer components dynamically and then
        // disable them ourselves, but it does help with glDrawElements/Arrays.
        if (!GLImmediate.modifiedClientAttributes) {
          GLImmediate.vertexCounter = (GLImmediate.stride * count) / 4; // XXX assuming float
          return;
        }
        GLImmediate.modifiedClientAttributes = false;
  
        // The role of prepareClientAttributes is to examine the set of client-side vertex attribute buffers
        // that user code has submitted, and to prepare them to be uploaded to a VBO in GPU memory
        // (since WebGL does not support client-side rendering, i.e. rendering from vertex data in CPU memory)
        // User can submit vertex data generally in three different configurations:
        // 1. Fully planar: all attributes are in their own separate tightly-packed arrays in CPU memory.
        // 2. Fully interleaved: all attributes share a single array where data is interleaved something like (pos,uv,normal), (pos,uv,normal), ...
        // 3. Complex hybrid: Multiple separate arrays that either are sparsely strided, and/or partially interleave vertex attributes.
  
        // For simplicity, we support the case (2) as the fast case. For (1) and (3), we do a memory copy of the
        // vertex data here to prepare a relayouted buffer that is of the structure in case (2). The reason
        // for this is that it allows the emulation code to get away with using just one VBO buffer for rendering,
        // and not have to maintain multiple ones. Therefore cases (1) and (3) will be very slow, and case (2) is fast.
  
        // Detect which case we are in by using a quick heuristic by examining the strides of the buffers. If all the buffers have identical 
        // stride, we assume we have case (2), otherwise we have something more complex.
        var clientStartPointer = 0x7FFFFFFF;
        var bytes = 0; // Total number of bytes taken up by a single vertex.
        var minStride = 0x7FFFFFFF;
        var maxStride = 0;
        var attributes = GLImmediate.liveClientAttributes;
        attributes.length = 0;
        for (var i = 0; i < 3+GLImmediate.MAX_TEXTURES; i++) {
          if (GLImmediate.enabledClientAttributes[i]) {
            var attr = GLImmediate.clientAttributes[i];
            attributes.push(attr);
            clientStartPointer = Math.min(clientStartPointer, attr.pointer);
            attr.sizeBytes = attr.size * GL.byteSizeByType[attr.type - GL.byteSizeByTypeRoot];
            bytes += attr.sizeBytes;
            minStride = Math.min(minStride, attr.stride);
            maxStride = Math.max(maxStride, attr.stride);
          }
        }
  
        if ((minStride != maxStride || maxStride < bytes) && !beginEnd) {
          // We are in cases (1) or (3): slow path, shuffle the data around into a single interleaved vertex buffer.
          // The immediate-mode glBegin()/glEnd() vertex submission gets automatically generated in appropriate layout,
          // so never need to come down this path if that was used.
          if (!GLImmediate.restrideBuffer) GLImmediate.restrideBuffer = _malloc(GL.MAX_TEMP_BUFFER_SIZE);
          var start = GLImmediate.restrideBuffer;
          bytes = 0;
          // calculate restrided offsets and total size
          for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            var size = attr.sizeBytes;
            if (size % 4 != 0) size += 4 - (size % 4); // align everything
            attr.offset = bytes;
            bytes += size;
          }
          // copy out the data (we need to know the stride for that, and define attr.pointer)
          for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            var srcStride = Math.max(attr.sizeBytes, attr.stride);
            if ((srcStride & 3) == 0 && (attr.sizeBytes & 3) == 0) {
              var size4 = attr.sizeBytes>>2;
              var srcStride4 = Math.max(attr.sizeBytes, attr.stride)>>2;
              for (var j = 0; j < count; j++) {
                for (var k = 0; k < size4; k++) { // copy in chunks of 4 bytes, our alignment makes this possible
                  HEAP32[((start + attr.offset + bytes*j)>>2) + k] = HEAP32[(attr.pointer>>2) + j*srcStride4 + k];
                }
              }
            } else {
              for (var j = 0; j < count; j++) {
                for (var k = 0; k < attr.sizeBytes; k++) { // source data was not aligned to multiples of 4, must copy byte by byte.
                  HEAP8[start + attr.offset + bytes*j + k] = HEAP8[attr.pointer + j*srcStride + k];
                }
              }
            }
            attr.pointer = start + attr.offset;
          }
          GLImmediate.stride = bytes;
          GLImmediate.vertexPointer = start;
        } else {
          // case (2): fast path, all data is interleaved to a single vertex array so we can get away with a single VBO upload.
          if (GL.currArrayBuffer) {
            GLImmediate.vertexPointer = 0;
          } else {
            GLImmediate.vertexPointer = clientStartPointer;
          }
          for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            attr.offset = attr.pointer - GLImmediate.vertexPointer; // Compute what will be the offset of this attribute in the VBO after we upload.
          }
          GLImmediate.stride = Math.max(maxStride, bytes);
        }
        if (!beginEnd) {
          GLImmediate.vertexCounter = (GLImmediate.stride * count) / 4; // XXX assuming float
        }
      },flush:function flush(numProvidedIndexes, startIndex, ptr) {
        startIndex = startIndex || 0;
        ptr = ptr || 0;
  
        var renderer = GLImmediate.getRenderer();
  
        // Generate index data in a format suitable for GLES 2.0/WebGL
        var numVertexes = 4 * GLImmediate.vertexCounter / GLImmediate.stride;
        var emulatedElementArrayBuffer = false;
        var numIndexes = 0;
        if (numProvidedIndexes) {
          numIndexes = numProvidedIndexes;
          if (!GL.currArrayBuffer && GLImmediate.firstVertex > GLImmediate.lastVertex) {
            // Figure out the first and last vertex from the index data
            for (var i = 0; i < numProvidedIndexes; i++) {
              var currIndex = HEAPU16[(((ptr)+(i*2))>>1)];
              GLImmediate.firstVertex = Math.min(GLImmediate.firstVertex, currIndex);
              GLImmediate.lastVertex = Math.max(GLImmediate.lastVertex, currIndex+1);
            }
          }
          if (!GL.currElementArrayBuffer) {
            // If no element array buffer is bound, then indices is a literal pointer to clientside data
            var indexBuffer = GL.getTempIndexBuffer(numProvidedIndexes << 1);
            GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, indexBuffer);
            GLctx.bufferSubData(GLctx.ELEMENT_ARRAY_BUFFER, 0, HEAPU16.subarray((ptr)>>1,(ptr + (numProvidedIndexes << 1))>>1));
            ptr = 0;
            emulatedElementArrayBuffer = true;
          }
        } else if (GLImmediate.mode > 6) { // above GL_TRIANGLE_FAN are the non-GL ES modes
          if (GLImmediate.mode != 7) throw 'unsupported immediate mode ' + GLImmediate.mode; // GL_QUADS
          // GLImmediate.firstVertex is the first vertex we want. Quad indexes are in the pattern
          // 0 1 2, 0 2 3, 4 5 6, 4 6 7, so we need to look at index firstVertex * 1.5 to see it.
          // Then since indexes are 2 bytes each, that means 3
          ptr = GLImmediate.firstVertex*3;
          var numQuads = numVertexes / 4;
          numIndexes = numQuads * 6; // 0 1 2, 0 2 3 pattern
          GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.tempQuadIndexBuffer);
          emulatedElementArrayBuffer = true;
        }
  
        renderer.prepare();
  
        if (numIndexes) {
          GLctx.drawElements(GLctx.TRIANGLES, numIndexes, GLctx.UNSIGNED_SHORT, ptr);
        } else {
          GLctx.drawArrays(GLImmediate.mode, startIndex, numVertexes);
        }
  
        if (emulatedElementArrayBuffer) {
          GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.buffers[GL.currElementArrayBuffer] || null);
        }
  
      }};
  GLImmediate.matrixLib = (function() {
  
  /**
   * @fileoverview gl-matrix - High performance matrix and vector operations for WebGL
   * @author Brandon Jones
   * @version 1.2.4
   */
  
  // Modifed for emscripten: Global scoping etc.
  
  /*
   * Copyright (c) 2011 Brandon Jones
   *
   * This software is provided 'as-is', without any express or implied
   * warranty. In no event will the authors be held liable for any damages
   * arising from the use of this software.
   *
   * Permission is granted to anyone to use this software for any purpose,
   * including commercial applications, and to alter it and redistribute it
   * freely, subject to the following restrictions:
   *
   *    1. The origin of this software must not be misrepresented; you must not
   *    claim that you wrote the original software. If you use this software
   *    in a product, an acknowledgment in the product documentation would be
   *    appreciated but is not required.
   *
   *    2. Altered source versions must be plainly marked as such, and must not
   *    be misrepresented as being the original software.
   *
   *    3. This notice may not be removed or altered from any source
   *    distribution.
   */
  
  
  /**
   * @class 3 Dimensional Vector
   * @name vec3
   */
  var vec3 = {};
  
  /**
   * @class 3x3 Matrix
   * @name mat3
   */
  var mat3 = {};
  
  /**
   * @class 4x4 Matrix
   * @name mat4
   */
  var mat4 = {};
  
  /**
   * @class Quaternion
   * @name quat4
   */
  var quat4 = {};
  
  var MatrixArray = Float32Array;
  
  /*
   * vec3
   */
   
  /**
   * Creates a new instance of a vec3 using the default array type
   * Any javascript array-like objects containing at least 3 numeric elements can serve as a vec3
   *
   * @param {vec3} [vec] vec3 containing values to initialize with
   *
   * @returns {vec3} New vec3
   */
  vec3.create = function (vec) {
      var dest = new MatrixArray(3);
  
      if (vec) {
          dest[0] = vec[0];
          dest[1] = vec[1];
          dest[2] = vec[2];
      } else {
          dest[0] = dest[1] = dest[2] = 0;
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one vec3 to another
   *
   * @param {vec3} vec vec3 containing values to copy
   * @param {vec3} dest vec3 receiving copied values
   *
   * @returns {vec3} dest
   */
  vec3.set = function (vec, dest) {
      dest[0] = vec[0];
      dest[1] = vec[1];
      dest[2] = vec[2];
  
      return dest;
  };
  
  /**
   * Performs a vector addition
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.add = function (vec, vec2, dest) {
      if (!dest || vec === dest) {
          vec[0] += vec2[0];
          vec[1] += vec2[1];
          vec[2] += vec2[2];
          return vec;
      }
  
      dest[0] = vec[0] + vec2[0];
      dest[1] = vec[1] + vec2[1];
      dest[2] = vec[2] + vec2[2];
      return dest;
  };
  
  /**
   * Performs a vector subtraction
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.subtract = function (vec, vec2, dest) {
      if (!dest || vec === dest) {
          vec[0] -= vec2[0];
          vec[1] -= vec2[1];
          vec[2] -= vec2[2];
          return vec;
      }
  
      dest[0] = vec[0] - vec2[0];
      dest[1] = vec[1] - vec2[1];
      dest[2] = vec[2] - vec2[2];
      return dest;
  };
  
  /**
   * Performs a vector multiplication
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.multiply = function (vec, vec2, dest) {
      if (!dest || vec === dest) {
          vec[0] *= vec2[0];
          vec[1] *= vec2[1];
          vec[2] *= vec2[2];
          return vec;
      }
  
      dest[0] = vec[0] * vec2[0];
      dest[1] = vec[1] * vec2[1];
      dest[2] = vec[2] * vec2[2];
      return dest;
  };
  
  /**
   * Negates the components of a vec3
   *
   * @param {vec3} vec vec3 to negate
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.negate = function (vec, dest) {
      if (!dest) { dest = vec; }
  
      dest[0] = -vec[0];
      dest[1] = -vec[1];
      dest[2] = -vec[2];
      return dest;
  };
  
  /**
   * Multiplies the components of a vec3 by a scalar value
   *
   * @param {vec3} vec vec3 to scale
   * @param {number} val Value to scale by
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.scale = function (vec, val, dest) {
      if (!dest || vec === dest) {
          vec[0] *= val;
          vec[1] *= val;
          vec[2] *= val;
          return vec;
      }
  
      dest[0] = vec[0] * val;
      dest[1] = vec[1] * val;
      dest[2] = vec[2] * val;
      return dest;
  };
  
  /**
   * Generates a unit vector of the same direction as the provided vec3
   * If vector length is 0, returns [0, 0, 0]
   *
   * @param {vec3} vec vec3 to normalize
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.normalize = function (vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2],
          len = Math.sqrt(x * x + y * y + z * z);
  
      if (!len) {
          dest[0] = 0;
          dest[1] = 0;
          dest[2] = 0;
          return dest;
      } else if (len === 1) {
          dest[0] = x;
          dest[1] = y;
          dest[2] = z;
          return dest;
      }
  
      len = 1 / len;
      dest[0] = x * len;
      dest[1] = y * len;
      dest[2] = z * len;
      return dest;
  };
  
  /**
   * Generates the cross product of two vec3s
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.cross = function (vec, vec2, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2],
          x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];
  
      dest[0] = y * z2 - z * y2;
      dest[1] = z * x2 - x * z2;
      dest[2] = x * y2 - y * x2;
      return dest;
  };
  
  /**
   * Caclulates the length of a vec3
   *
   * @param {vec3} vec vec3 to calculate length of
   *
   * @returns {number} Length of vec
   */
  vec3.length = function (vec) {
      var x = vec[0], y = vec[1], z = vec[2];
      return Math.sqrt(x * x + y * y + z * z);
  };
  
  /**
   * Caclulates the dot product of two vec3s
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   *
   * @returns {number} Dot product of vec and vec2
   */
  vec3.dot = function (vec, vec2) {
      return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2];
  };
  
  /**
   * Generates a unit vector pointing from one vector to another
   *
   * @param {vec3} vec Origin vec3
   * @param {vec3} vec2 vec3 to point to
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.direction = function (vec, vec2, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0] - vec2[0],
          y = vec[1] - vec2[1],
          z = vec[2] - vec2[2],
          len = Math.sqrt(x * x + y * y + z * z);
  
      if (!len) {
          dest[0] = 0;
          dest[1] = 0;
          dest[2] = 0;
          return dest;
      }
  
      len = 1 / len;
      dest[0] = x * len;
      dest[1] = y * len;
      dest[2] = z * len;
      return dest;
  };
  
  /**
   * Performs a linear interpolation between two vec3
   *
   * @param {vec3} vec First vector
   * @param {vec3} vec2 Second vector
   * @param {number} lerp Interpolation amount between the two inputs
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.lerp = function (vec, vec2, lerp, dest) {
      if (!dest) { dest = vec; }
  
      dest[0] = vec[0] + lerp * (vec2[0] - vec[0]);
      dest[1] = vec[1] + lerp * (vec2[1] - vec[1]);
      dest[2] = vec[2] + lerp * (vec2[2] - vec[2]);
  
      return dest;
  };
  
  /**
   * Calculates the euclidian distance between two vec3
   *
   * Params:
   * @param {vec3} vec First vector
   * @param {vec3} vec2 Second vector
   *
   * @returns {number} Distance between vec and vec2
   */
  vec3.dist = function (vec, vec2) {
      var x = vec2[0] - vec[0],
          y = vec2[1] - vec[1],
          z = vec2[2] - vec[2];
          
      return Math.sqrt(x*x + y*y + z*z);
  };
  
  /**
   * Projects the specified vec3 from screen space into object space
   * Based on the <a href="http://webcvs.freedesktop.org/mesa/Mesa/src/glu/mesa/project.c?revision=1.4&view=markup">Mesa gluUnProject implementation</a>
   *
   * @param {vec3} vec Screen-space vector to project
   * @param {mat4} view View matrix
   * @param {mat4} proj Projection matrix
   * @param {vec4} viewport Viewport as given to gl.viewport [x, y, width, height]
   * @param {vec3} [dest] vec3 receiving unprojected result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.unproject = function (vec, view, proj, viewport, dest) {
      if (!dest) { dest = vec; }
  
      var m = mat4.create();
      var v = new MatrixArray(4);
      
      v[0] = (vec[0] - viewport[0]) * 2.0 / viewport[2] - 1.0;
      v[1] = (vec[1] - viewport[1]) * 2.0 / viewport[3] - 1.0;
      v[2] = 2.0 * vec[2] - 1.0;
      v[3] = 1.0;
      
      mat4.multiply(proj, view, m);
      if(!mat4.inverse(m)) { return null; }
      
      mat4.multiplyVec4(m, v);
      if(v[3] === 0.0) { return null; }
  
      dest[0] = v[0] / v[3];
      dest[1] = v[1] / v[3];
      dest[2] = v[2] / v[3];
      
      return dest;
  };
  
  /**
   * Returns a string representation of a vector
   *
   * @param {vec3} vec Vector to represent as a string
   *
   * @returns {string} String representation of vec
   */
  vec3.str = function (vec) {
      return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ']';
  };
  
  /*
   * mat3
   */
  
  /**
   * Creates a new instance of a mat3 using the default array type
   * Any javascript array-like object containing at least 9 numeric elements can serve as a mat3
   *
   * @param {mat3} [mat] mat3 containing values to initialize with
   *
   * @returns {mat3} New mat3
   */
  mat3.create = function (mat) {
      var dest = new MatrixArray(9);
  
      if (mat) {
          dest[0] = mat[0];
          dest[1] = mat[1];
          dest[2] = mat[2];
          dest[3] = mat[3];
          dest[4] = mat[4];
          dest[5] = mat[5];
          dest[6] = mat[6];
          dest[7] = mat[7];
          dest[8] = mat[8];
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one mat3 to another
   *
   * @param {mat3} mat mat3 containing values to copy
   * @param {mat3} dest mat3 receiving copied values
   *
   * @returns {mat3} dest
   */
  mat3.set = function (mat, dest) {
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      return dest;
  };
  
  /**
   * Sets a mat3 to an identity matrix
   *
   * @param {mat3} dest mat3 to set
   *
   * @returns dest if specified, otherwise a new mat3
   */
  mat3.identity = function (dest) {
      if (!dest) { dest = mat3.create(); }
      dest[0] = 1;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 1;
      dest[5] = 0;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 1;
      return dest;
  };
  
  /**
   * Transposes a mat3 (flips the values over the diagonal)
   *
   * Params:
   * @param {mat3} mat mat3 to transpose
   * @param {mat3} [dest] mat3 receiving transposed values. If not specified result is written to mat
   *
   * @returns {mat3} dest is specified, mat otherwise
   */
  mat3.transpose = function (mat, dest) {
      // If we are transposing ourselves we can skip a few steps but have to cache some values
      if (!dest || mat === dest) {
          var a01 = mat[1], a02 = mat[2],
              a12 = mat[5];
  
          mat[1] = mat[3];
          mat[2] = mat[6];
          mat[3] = a01;
          mat[5] = mat[7];
          mat[6] = a02;
          mat[7] = a12;
          return mat;
      }
  
      dest[0] = mat[0];
      dest[1] = mat[3];
      dest[2] = mat[6];
      dest[3] = mat[1];
      dest[4] = mat[4];
      dest[5] = mat[7];
      dest[6] = mat[2];
      dest[7] = mat[5];
      dest[8] = mat[8];
      return dest;
  };
  
  /**
   * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
   *
   * @param {mat3} mat mat3 containing values to copy
   * @param {mat4} [dest] mat4 receiving copied values
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat3.toMat4 = function (mat, dest) {
      if (!dest) { dest = mat4.create(); }
  
      dest[15] = 1;
      dest[14] = 0;
      dest[13] = 0;
      dest[12] = 0;
  
      dest[11] = 0;
      dest[10] = mat[8];
      dest[9] = mat[7];
      dest[8] = mat[6];
  
      dest[7] = 0;
      dest[6] = mat[5];
      dest[5] = mat[4];
      dest[4] = mat[3];
  
      dest[3] = 0;
      dest[2] = mat[2];
      dest[1] = mat[1];
      dest[0] = mat[0];
  
      return dest;
  };
  
  /**
   * Returns a string representation of a mat3
   *
   * @param {mat3} mat mat3 to represent as a string
   *
   * @param {string} String representation of mat
   */
  mat3.str = function (mat) {
      return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] +
          ', ' + mat[3] + ', ' + mat[4] + ', ' + mat[5] +
          ', ' + mat[6] + ', ' + mat[7] + ', ' + mat[8] + ']';
  };
  
  /*
   * mat4
   */
  
  /**
   * Creates a new instance of a mat4 using the default array type
   * Any javascript array-like object containing at least 16 numeric elements can serve as a mat4
   *
   * @param {mat4} [mat] mat4 containing values to initialize with
   *
   * @returns {mat4} New mat4
   */
  mat4.create = function (mat) {
      var dest = new MatrixArray(16);
  
      if (mat) {
          dest[0] = mat[0];
          dest[1] = mat[1];
          dest[2] = mat[2];
          dest[3] = mat[3];
          dest[4] = mat[4];
          dest[5] = mat[5];
          dest[6] = mat[6];
          dest[7] = mat[7];
          dest[8] = mat[8];
          dest[9] = mat[9];
          dest[10] = mat[10];
          dest[11] = mat[11];
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one mat4 to another
   *
   * @param {mat4} mat mat4 containing values to copy
   * @param {mat4} dest mat4 receiving copied values
   *
   * @returns {mat4} dest
   */
  mat4.set = function (mat, dest) {
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      dest[9] = mat[9];
      dest[10] = mat[10];
      dest[11] = mat[11];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
      return dest;
  };
  
  /**
   * Sets a mat4 to an identity matrix
   *
   * @param {mat4} dest mat4 to set
   *
   * @returns {mat4} dest
   */
  mat4.identity = function (dest) {
      if (!dest) { dest = mat4.create(); }
      dest[0] = 1;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = 1;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 0;
      dest[9] = 0;
      dest[10] = 1;
      dest[11] = 0;
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = 0;
      dest[15] = 1;
      return dest;
  };
  
  /**
   * Transposes a mat4 (flips the values over the diagonal)
   *
   * @param {mat4} mat mat4 to transpose
   * @param {mat4} [dest] mat4 receiving transposed values. If not specified result is written to mat
   *
   * @param {mat4} dest is specified, mat otherwise
   */
  mat4.transpose = function (mat, dest) {
      // If we are transposing ourselves we can skip a few steps but have to cache some values
      if (!dest || mat === dest) {
          var a01 = mat[1], a02 = mat[2], a03 = mat[3],
              a12 = mat[6], a13 = mat[7],
              a23 = mat[11];
  
          mat[1] = mat[4];
          mat[2] = mat[8];
          mat[3] = mat[12];
          mat[4] = a01;
          mat[6] = mat[9];
          mat[7] = mat[13];
          mat[8] = a02;
          mat[9] = a12;
          mat[11] = mat[14];
          mat[12] = a03;
          mat[13] = a13;
          mat[14] = a23;
          return mat;
      }
  
      dest[0] = mat[0];
      dest[1] = mat[4];
      dest[2] = mat[8];
      dest[3] = mat[12];
      dest[4] = mat[1];
      dest[5] = mat[5];
      dest[6] = mat[9];
      dest[7] = mat[13];
      dest[8] = mat[2];
      dest[9] = mat[6];
      dest[10] = mat[10];
      dest[11] = mat[14];
      dest[12] = mat[3];
      dest[13] = mat[7];
      dest[14] = mat[11];
      dest[15] = mat[15];
      return dest;
  };
  
  /**
   * Calculates the determinant of a mat4
   *
   * @param {mat4} mat mat4 to calculate determinant of
   *
   * @returns {number} determinant of mat
   */
  mat4.determinant = function (mat) {
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
          a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
          a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
          a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
  
      return (a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
              a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
              a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
              a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
              a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
              a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33);
  };
  
  /**
   * Calculates the inverse matrix of a mat4
   *
   * @param {mat4} mat mat4 to calculate inverse of
   * @param {mat4} [dest] mat4 receiving inverse matrix. If not specified result is written to mat
   *
   * @param {mat4} dest is specified, mat otherwise, null if matrix cannot be inverted
   */
  mat4.inverse = function (mat, dest) {
      if (!dest) { dest = mat; }
  
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
          a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
          a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
          a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],
  
          b00 = a00 * a11 - a01 * a10,
          b01 = a00 * a12 - a02 * a10,
          b02 = a00 * a13 - a03 * a10,
          b03 = a01 * a12 - a02 * a11,
          b04 = a01 * a13 - a03 * a11,
          b05 = a02 * a13 - a03 * a12,
          b06 = a20 * a31 - a21 * a30,
          b07 = a20 * a32 - a22 * a30,
          b08 = a20 * a33 - a23 * a30,
          b09 = a21 * a32 - a22 * a31,
          b10 = a21 * a33 - a23 * a31,
          b11 = a22 * a33 - a23 * a32,
  
          d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),
          invDet;
  
          // Calculate the determinant
          if (!d) { return null; }
          invDet = 1 / d;
  
      dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
      dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
      dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
      dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
      dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
      dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
      dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
      dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
      dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
      dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
      dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
      dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
      dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
      dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
      dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
      dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
  
      return dest;
  };
  
  /**
   * Copies the upper 3x3 elements of a mat4 into another mat4
   *
   * @param {mat4} mat mat4 containing values to copy
   * @param {mat4} [dest] mat4 receiving copied values
   *
   * @returns {mat4} dest is specified, a new mat4 otherwise
   */
  mat4.toRotationMat = function (mat, dest) {
      if (!dest) { dest = mat4.create(); }
  
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      dest[9] = mat[9];
      dest[10] = mat[10];
      dest[11] = mat[11];
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = 0;
      dest[15] = 1;
  
      return dest;
  };
  
  /**
   * Copies the upper 3x3 elements of a mat4 into a mat3
   *
   * @param {mat4} mat mat4 containing values to copy
   * @param {mat3} [dest] mat3 receiving copied values
   *
   * @returns {mat3} dest is specified, a new mat3 otherwise
   */
  mat4.toMat3 = function (mat, dest) {
      if (!dest) { dest = mat3.create(); }
  
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[4];
      dest[4] = mat[5];
      dest[5] = mat[6];
      dest[6] = mat[8];
      dest[7] = mat[9];
      dest[8] = mat[10];
  
      return dest;
  };
  
  /**
   * Calculates the inverse of the upper 3x3 elements of a mat4 and copies the result into a mat3
   * The resulting matrix is useful for calculating transformed normals
   *
   * Params:
   * @param {mat4} mat mat4 containing values to invert and copy
   * @param {mat3} [dest] mat3 receiving values
   *
   * @returns {mat3} dest is specified, a new mat3 otherwise, null if the matrix cannot be inverted
   */
  mat4.toInverseMat3 = function (mat, dest) {
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2],
          a10 = mat[4], a11 = mat[5], a12 = mat[6],
          a20 = mat[8], a21 = mat[9], a22 = mat[10],
  
          b01 = a22 * a11 - a12 * a21,
          b11 = -a22 * a10 + a12 * a20,
          b21 = a21 * a10 - a11 * a20,
  
          d = a00 * b01 + a01 * b11 + a02 * b21,
          id;
  
      if (!d) { return null; }
      id = 1 / d;
  
      if (!dest) { dest = mat3.create(); }
  
      dest[0] = b01 * id;
      dest[1] = (-a22 * a01 + a02 * a21) * id;
      dest[2] = (a12 * a01 - a02 * a11) * id;
      dest[3] = b11 * id;
      dest[4] = (a22 * a00 - a02 * a20) * id;
      dest[5] = (-a12 * a00 + a02 * a10) * id;
      dest[6] = b21 * id;
      dest[7] = (-a21 * a00 + a01 * a20) * id;
      dest[8] = (a11 * a00 - a01 * a10) * id;
  
      return dest;
  };
  
  /**
   * Performs a matrix multiplication
   *
   * @param {mat4} mat First operand
   * @param {mat4} mat2 Second operand
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.multiply = function (mat, mat2, dest) {
      if (!dest) { dest = mat; }
  
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
          a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
          a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
          a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],
  
          b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3],
          b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7],
          b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11],
          b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
  
      dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
      dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
      dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
      dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
      dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
      dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
      dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
      dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
      dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
      dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
      dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
      dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
      dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
      dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
      dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
      dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
  
      return dest;
  };
  
  /**
   * Transforms a vec3 with the given matrix
   * 4th vector component is implicitly '1'
   *
   * @param {mat4} mat mat4 to transform the vector with
   * @param {vec3} vec vec3 to transform
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  mat4.multiplyVec3 = function (mat, vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2];
  
      dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
      dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
      dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
  
      return dest;
  };
  
  /**
   * Transforms a vec4 with the given matrix
   *
   * @param {mat4} mat mat4 to transform the vector with
   * @param {vec4} vec vec4 to transform
   * @param {vec4} [dest] vec4 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec4} dest if specified, vec otherwise
   */
  mat4.multiplyVec4 = function (mat, vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
  
      dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
      dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
      dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
      dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;
  
      return dest;
  };
  
  /**
   * Translates a matrix by the given vector
   *
   * @param {mat4} mat mat4 to translate
   * @param {vec3} vec vec3 specifying the translation
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.translate = function (mat, vec, dest) {
      var x = vec[0], y = vec[1], z = vec[2],
          a00, a01, a02, a03,
          a10, a11, a12, a13,
          a20, a21, a22, a23;
  
      if (!dest || mat === dest) {
          mat[12] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
          mat[13] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
          mat[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
          mat[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
          return mat;
      }
  
      a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
      a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
      a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];
  
      dest[0] = a00; dest[1] = a01; dest[2] = a02; dest[3] = a03;
      dest[4] = a10; dest[5] = a11; dest[6] = a12; dest[7] = a13;
      dest[8] = a20; dest[9] = a21; dest[10] = a22; dest[11] = a23;
  
      dest[12] = a00 * x + a10 * y + a20 * z + mat[12];
      dest[13] = a01 * x + a11 * y + a21 * z + mat[13];
      dest[14] = a02 * x + a12 * y + a22 * z + mat[14];
      dest[15] = a03 * x + a13 * y + a23 * z + mat[15];
      return dest;
  };
  
  /**
   * Scales a matrix by the given vector
   *
   * @param {mat4} mat mat4 to scale
   * @param {vec3} vec vec3 specifying the scale for each axis
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @param {mat4} dest if specified, mat otherwise
   */
  mat4.scale = function (mat, vec, dest) {
      var x = vec[0], y = vec[1], z = vec[2];
  
      if (!dest || mat === dest) {
          mat[0] *= x;
          mat[1] *= x;
          mat[2] *= x;
          mat[3] *= x;
          mat[4] *= y;
          mat[5] *= y;
          mat[6] *= y;
          mat[7] *= y;
          mat[8] *= z;
          mat[9] *= z;
          mat[10] *= z;
          mat[11] *= z;
          return mat;
      }
  
      dest[0] = mat[0] * x;
      dest[1] = mat[1] * x;
      dest[2] = mat[2] * x;
      dest[3] = mat[3] * x;
      dest[4] = mat[4] * y;
      dest[5] = mat[5] * y;
      dest[6] = mat[6] * y;
      dest[7] = mat[7] * y;
      dest[8] = mat[8] * z;
      dest[9] = mat[9] * z;
      dest[10] = mat[10] * z;
      dest[11] = mat[11] * z;
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the specified axis
   * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for performance
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {vec3} axis vec3 representing the axis to rotate around 
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.rotate = function (mat, angle, axis, dest) {
      var x = axis[0], y = axis[1], z = axis[2],
          len = Math.sqrt(x * x + y * y + z * z),
          s, c, t,
          a00, a01, a02, a03,
          a10, a11, a12, a13,
          a20, a21, a22, a23,
          b00, b01, b02,
          b10, b11, b12,
          b20, b21, b22;
  
      if (!len) { return null; }
      if (len !== 1) {
          len = 1 / len;
          x *= len;
          y *= len;
          z *= len;
      }
  
      s = Math.sin(angle);
      c = Math.cos(angle);
      t = 1 - c;
  
      a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
      a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
      a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];
  
      // Construct the elements of the rotation matrix
      b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
      b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
      b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged last row
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform rotation-specific matrix multiplication
      dest[0] = a00 * b00 + a10 * b01 + a20 * b02;
      dest[1] = a01 * b00 + a11 * b01 + a21 * b02;
      dest[2] = a02 * b00 + a12 * b01 + a22 * b02;
      dest[3] = a03 * b00 + a13 * b01 + a23 * b02;
  
      dest[4] = a00 * b10 + a10 * b11 + a20 * b12;
      dest[5] = a01 * b10 + a11 * b11 + a21 * b12;
      dest[6] = a02 * b10 + a12 * b11 + a22 * b12;
      dest[7] = a03 * b10 + a13 * b11 + a23 * b12;
  
      dest[8] = a00 * b20 + a10 * b21 + a20 * b22;
      dest[9] = a01 * b20 + a11 * b21 + a21 * b22;
      dest[10] = a02 * b20 + a12 * b21 + a22 * b22;
      dest[11] = a03 * b20 + a13 * b21 + a23 * b22;
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the X axis
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.rotateX = function (mat, angle, dest) {
      var s = Math.sin(angle),
          c = Math.cos(angle),
          a10 = mat[4],
          a11 = mat[5],
          a12 = mat[6],
          a13 = mat[7],
          a20 = mat[8],
          a21 = mat[9],
          a22 = mat[10],
          a23 = mat[11];
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged rows
          dest[0] = mat[0];
          dest[1] = mat[1];
          dest[2] = mat[2];
          dest[3] = mat[3];
  
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform axis-specific matrix multiplication
      dest[4] = a10 * c + a20 * s;
      dest[5] = a11 * c + a21 * s;
      dest[6] = a12 * c + a22 * s;
      dest[7] = a13 * c + a23 * s;
  
      dest[8] = a10 * -s + a20 * c;
      dest[9] = a11 * -s + a21 * c;
      dest[10] = a12 * -s + a22 * c;
      dest[11] = a13 * -s + a23 * c;
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the Y axis
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.rotateY = function (mat, angle, dest) {
      var s = Math.sin(angle),
          c = Math.cos(angle),
          a00 = mat[0],
          a01 = mat[1],
          a02 = mat[2],
          a03 = mat[3],
          a20 = mat[8],
          a21 = mat[9],
          a22 = mat[10],
          a23 = mat[11];
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged rows
          dest[4] = mat[4];
          dest[5] = mat[5];
          dest[6] = mat[6];
          dest[7] = mat[7];
  
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform axis-specific matrix multiplication
      dest[0] = a00 * c + a20 * -s;
      dest[1] = a01 * c + a21 * -s;
      dest[2] = a02 * c + a22 * -s;
      dest[3] = a03 * c + a23 * -s;
  
      dest[8] = a00 * s + a20 * c;
      dest[9] = a01 * s + a21 * c;
      dest[10] = a02 * s + a22 * c;
      dest[11] = a03 * s + a23 * c;
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the Z axis
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.rotateZ = function (mat, angle, dest) {
      var s = Math.sin(angle),
          c = Math.cos(angle),
          a00 = mat[0],
          a01 = mat[1],
          a02 = mat[2],
          a03 = mat[3],
          a10 = mat[4],
          a11 = mat[5],
          a12 = mat[6],
          a13 = mat[7];
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged last row
          dest[8] = mat[8];
          dest[9] = mat[9];
          dest[10] = mat[10];
          dest[11] = mat[11];
  
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform axis-specific matrix multiplication
      dest[0] = a00 * c + a10 * s;
      dest[1] = a01 * c + a11 * s;
      dest[2] = a02 * c + a12 * s;
      dest[3] = a03 * c + a13 * s;
  
      dest[4] = a00 * -s + a10 * c;
      dest[5] = a01 * -s + a11 * c;
      dest[6] = a02 * -s + a12 * c;
      dest[7] = a03 * -s + a13 * c;
  
      return dest;
  };
  
  /**
   * Generates a frustum matrix with the given bounds
   *
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.frustum = function (left, right, bottom, top, near, far, dest) {
      if (!dest) { dest = mat4.create(); }
      var rl = (right - left),
          tb = (top - bottom),
          fn = (far - near);
      dest[0] = (near * 2) / rl;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = (near * 2) / tb;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = (right + left) / rl;
      dest[9] = (top + bottom) / tb;
      dest[10] = -(far + near) / fn;
      dest[11] = -1;
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = -(far * near * 2) / fn;
      dest[15] = 0;
      return dest;
  };
  
  /**
   * Generates a perspective projection matrix with the given bounds
   *
   * @param {number} fovy Vertical field of view
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.perspective = function (fovy, aspect, near, far, dest) {
      var top = near * Math.tan(fovy * Math.PI / 360.0),
          right = top * aspect;
      return mat4.frustum(-right, right, -top, top, near, far, dest);
  };
  
  /**
   * Generates a orthogonal projection matrix with the given bounds
   *
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.ortho = function (left, right, bottom, top, near, far, dest) {
      if (!dest) { dest = mat4.create(); }
      var rl = (right - left),
          tb = (top - bottom),
          fn = (far - near);
      dest[0] = 2 / rl;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = 2 / tb;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 0;
      dest[9] = 0;
      dest[10] = -2 / fn;
      dest[11] = 0;
      dest[12] = -(left + right) / rl;
      dest[13] = -(top + bottom) / tb;
      dest[14] = -(far + near) / fn;
      dest[15] = 1;
      return dest;
  };
  
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis
   *
   * @param {vec3} eye Position of the viewer
   * @param {vec3} center Point the viewer is looking at
   * @param {vec3} up vec3 pointing "up"
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.lookAt = function (eye, center, up, dest) {
      if (!dest) { dest = mat4.create(); }
  
      var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
          eyex = eye[0],
          eyey = eye[1],
          eyez = eye[2],
          upx = up[0],
          upy = up[1],
          upz = up[2],
          centerx = center[0],
          centery = center[1],
          centerz = center[2];
  
      if (eyex === centerx && eyey === centery && eyez === centerz) {
          return mat4.identity(dest);
      }
  
      //vec3.direction(eye, center, z);
      z0 = eyex - centerx;
      z1 = eyey - centery;
      z2 = eyez - centerz;
  
      // normalize (no check needed for 0 because of early return)
      len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
      z0 *= len;
      z1 *= len;
      z2 *= len;
  
      //vec3.normalize(vec3.cross(up, z, x));
      x0 = upy * z2 - upz * z1;
      x1 = upz * z0 - upx * z2;
      x2 = upx * z1 - upy * z0;
      len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
      if (!len) {
          x0 = 0;
          x1 = 0;
          x2 = 0;
      } else {
          len = 1 / len;
          x0 *= len;
          x1 *= len;
          x2 *= len;
      }
  
      //vec3.normalize(vec3.cross(z, x, y));
      y0 = z1 * x2 - z2 * x1;
      y1 = z2 * x0 - z0 * x2;
      y2 = z0 * x1 - z1 * x0;
  
      len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
      if (!len) {
          y0 = 0;
          y1 = 0;
          y2 = 0;
      } else {
          len = 1 / len;
          y0 *= len;
          y1 *= len;
          y2 *= len;
      }
  
      dest[0] = x0;
      dest[1] = y0;
      dest[2] = z0;
      dest[3] = 0;
      dest[4] = x1;
      dest[5] = y1;
      dest[6] = z1;
      dest[7] = 0;
      dest[8] = x2;
      dest[9] = y2;
      dest[10] = z2;
      dest[11] = 0;
      dest[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
      dest[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
      dest[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
      dest[15] = 1;
  
      return dest;
  };
  
  /**
   * Creates a matrix from a quaternion rotation and vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     var quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *
   * @param {quat4} quat Rotation quaternion
   * @param {vec3} vec Translation vector
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to a new mat4
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.fromRotationTranslation = function (quat, vec, dest) {
      if (!dest) { dest = mat4.create(); }
  
      // Quaternion math
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
  
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;
  
      dest[0] = 1 - (yy + zz);
      dest[1] = xy + wz;
      dest[2] = xz - wy;
      dest[3] = 0;
      dest[4] = xy - wz;
      dest[5] = 1 - (xx + zz);
      dest[6] = yz + wx;
      dest[7] = 0;
      dest[8] = xz + wy;
      dest[9] = yz - wx;
      dest[10] = 1 - (xx + yy);
      dest[11] = 0;
      dest[12] = vec[0];
      dest[13] = vec[1];
      dest[14] = vec[2];
      dest[15] = 1;
      
      return dest;
  };
  
  /**
   * Returns a string representation of a mat4
   *
   * @param {mat4} mat mat4 to represent as a string
   *
   * @returns {string} String representation of mat
   */
  mat4.str = function (mat) {
      return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + ', ' + mat[3] +
          ', ' + mat[4] + ', ' + mat[5] + ', ' + mat[6] + ', ' + mat[7] +
          ', ' + mat[8] + ', ' + mat[9] + ', ' + mat[10] + ', ' + mat[11] +
          ', ' + mat[12] + ', ' + mat[13] + ', ' + mat[14] + ', ' + mat[15] + ']';
  };
  
  /*
   * quat4
   */
  
  /**
   * Creates a new instance of a quat4 using the default array type
   * Any javascript array containing at least 4 numeric elements can serve as a quat4
   *
   * @param {quat4} [quat] quat4 containing values to initialize with
   *
   * @returns {quat4} New quat4
   */
  quat4.create = function (quat) {
      var dest = new MatrixArray(4);
  
      if (quat) {
          dest[0] = quat[0];
          dest[1] = quat[1];
          dest[2] = quat[2];
          dest[3] = quat[3];
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one quat4 to another
   *
   * @param {quat4} quat quat4 containing values to copy
   * @param {quat4} dest quat4 receiving copied values
   *
   * @returns {quat4} dest
   */
  quat4.set = function (quat, dest) {
      dest[0] = quat[0];
      dest[1] = quat[1];
      dest[2] = quat[2];
      dest[3] = quat[3];
  
      return dest;
  };
  
  /**
   * Calculates the W component of a quat4 from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length. 
   * Any existing W component will be ignored. 
   *
   * @param {quat4} quat quat4 to calculate W component of
   * @param {quat4} [dest] quat4 receiving calculated values. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.calculateW = function (quat, dest) {
      var x = quat[0], y = quat[1], z = quat[2];
  
      if (!dest || quat === dest) {
          quat[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
          return quat;
      }
      dest[0] = x;
      dest[1] = y;
      dest[2] = z;
      dest[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
      return dest;
  };
  
  /**
   * Calculates the dot product of two quaternions
   *
   * @param {quat4} quat First operand
   * @param {quat4} quat2 Second operand
   *
   * @return {number} Dot product of quat and quat2
   */
  quat4.dot = function(quat, quat2){
      return quat[0]*quat2[0] + quat[1]*quat2[1] + quat[2]*quat2[2] + quat[3]*quat2[3];
  };
  
  /**
   * Calculates the inverse of a quat4
   *
   * @param {quat4} quat quat4 to calculate inverse of
   * @param {quat4} [dest] quat4 receiving inverse values. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.inverse = function(quat, dest) {
      var q0 = quat[0], q1 = quat[1], q2 = quat[2], q3 = quat[3],
          dot = q0*q0 + q1*q1 + q2*q2 + q3*q3,
          invDot = dot ? 1.0/dot : 0;
      
      // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
      
      if(!dest || quat === dest) {
          quat[0] *= -invDot;
          quat[1] *= -invDot;
          quat[2] *= -invDot;
          quat[3] *= invDot;
          return quat;
      }
      dest[0] = -quat[0]*invDot;
      dest[1] = -quat[1]*invDot;
      dest[2] = -quat[2]*invDot;
      dest[3] = quat[3]*invDot;
      return dest;
  };
  
  
  /**
   * Calculates the conjugate of a quat4
   * If the quaternion is normalized, this function is faster than quat4.inverse and produces the same result.
   *
   * @param {quat4} quat quat4 to calculate conjugate of
   * @param {quat4} [dest] quat4 receiving conjugate values. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.conjugate = function (quat, dest) {
      if (!dest || quat === dest) {
          quat[0] *= -1;
          quat[1] *= -1;
          quat[2] *= -1;
          return quat;
      }
      dest[0] = -quat[0];
      dest[1] = -quat[1];
      dest[2] = -quat[2];
      dest[3] = quat[3];
      return dest;
  };
  
  /**
   * Calculates the length of a quat4
   *
   * Params:
   * @param {quat4} quat quat4 to calculate length of
   *
   * @returns Length of quat
   */
  quat4.length = function (quat) {
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
      return Math.sqrt(x * x + y * y + z * z + w * w);
  };
  
  /**
   * Generates a unit quaternion of the same direction as the provided quat4
   * If quaternion length is 0, returns [0, 0, 0, 0]
   *
   * @param {quat4} quat quat4 to normalize
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.normalize = function (quat, dest) {
      if (!dest) { dest = quat; }
  
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          len = Math.sqrt(x * x + y * y + z * z + w * w);
      if (len === 0) {
          dest[0] = 0;
          dest[1] = 0;
          dest[2] = 0;
          dest[3] = 0;
          return dest;
      }
      len = 1 / len;
      dest[0] = x * len;
      dest[1] = y * len;
      dest[2] = z * len;
      dest[3] = w * len;
  
      return dest;
  };
  
  /**
   * Performs quaternion addition
   *
   * @param {quat4} quat First operand
   * @param {quat4} quat2 Second operand
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.add = function (quat, quat2, dest) {
      if(!dest || quat === dest) {
          quat[0] += quat2[0];
          quat[1] += quat2[1];
          quat[2] += quat2[2];
          quat[3] += quat2[3];
          return quat;
      }
      dest[0] = quat[0]+quat2[0];
      dest[1] = quat[1]+quat2[1];
      dest[2] = quat[2]+quat2[2];
      dest[3] = quat[3]+quat2[3];
      return dest;
  };
  
  /**
   * Performs a quaternion multiplication
   *
   * @param {quat4} quat First operand
   * @param {quat4} quat2 Second operand
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.multiply = function (quat, quat2, dest) {
      if (!dest) { dest = quat; }
  
      var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3],
          qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];
  
      dest[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
      dest[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
      dest[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
      dest[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
  
      return dest;
  };
  
  /**
   * Transforms a vec3 with the given quaternion
   *
   * @param {quat4} quat quat4 to transform the vector with
   * @param {vec3} vec vec3 to transform
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns dest if specified, vec otherwise
   */
  quat4.multiplyVec3 = function (quat, vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2],
          qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3],
  
          // calculate quat * vec
          ix = qw * x + qy * z - qz * y,
          iy = qw * y + qz * x - qx * z,
          iz = qw * z + qx * y - qy * x,
          iw = -qx * x - qy * y - qz * z;
  
      // calculate result * inverse quat
      dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
      dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
      dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  
      return dest;
  };
  
  /**
   * Multiplies the components of a quaternion by a scalar value
   *
   * @param {quat4} quat to scale
   * @param {number} val Value to scale by
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.scale = function (quat, val, dest) {
      if(!dest || quat === dest) {
          quat[0] *= val;
          quat[1] *= val;
          quat[2] *= val;
          quat[3] *= val;
          return quat;
      }
      dest[0] = quat[0]*val;
      dest[1] = quat[1]*val;
      dest[2] = quat[2]*val;
      dest[3] = quat[3]*val;
      return dest;
  };
  
  /**
   * Calculates a 3x3 matrix from the given quat4
   *
   * @param {quat4} quat quat4 to create matrix from
   * @param {mat3} [dest] mat3 receiving operation result
   *
   * @returns {mat3} dest if specified, a new mat3 otherwise
   */
  quat4.toMat3 = function (quat, dest) {
      if (!dest) { dest = mat3.create(); }
  
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
  
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;
  
      dest[0] = 1 - (yy + zz);
      dest[1] = xy + wz;
      dest[2] = xz - wy;
  
      dest[3] = xy - wz;
      dest[4] = 1 - (xx + zz);
      dest[5] = yz + wx;
  
      dest[6] = xz + wy;
      dest[7] = yz - wx;
      dest[8] = 1 - (xx + yy);
  
      return dest;
  };
  
  /**
   * Calculates a 4x4 matrix from the given quat4
   *
   * @param {quat4} quat quat4 to create matrix from
   * @param {mat4} [dest] mat4 receiving operation result
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  quat4.toMat4 = function (quat, dest) {
      if (!dest) { dest = mat4.create(); }
  
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
  
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;
  
      dest[0] = 1 - (yy + zz);
      dest[1] = xy + wz;
      dest[2] = xz - wy;
      dest[3] = 0;
  
      dest[4] = xy - wz;
      dest[5] = 1 - (xx + zz);
      dest[6] = yz + wx;
      dest[7] = 0;
  
      dest[8] = xz + wy;
      dest[9] = yz - wx;
      dest[10] = 1 - (xx + yy);
      dest[11] = 0;
  
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = 0;
      dest[15] = 1;
  
      return dest;
  };
  
  /**
   * Performs a spherical linear interpolation between two quat4
   *
   * @param {quat4} quat First quaternion
   * @param {quat4} quat2 Second quaternion
   * @param {number} slerp Interpolation amount between the two inputs
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.slerp = function (quat, quat2, slerp, dest) {
      if (!dest) { dest = quat; }
  
      var cosHalfTheta = quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3],
          halfTheta,
          sinHalfTheta,
          ratioA,
          ratioB;
  
      if (Math.abs(cosHalfTheta) >= 1.0) {
          if (dest !== quat) {
              dest[0] = quat[0];
              dest[1] = quat[1];
              dest[2] = quat[2];
              dest[3] = quat[3];
          }
          return dest;
      }
  
      halfTheta = Math.acos(cosHalfTheta);
      sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
  
      if (Math.abs(sinHalfTheta) < 0.001) {
          dest[0] = (quat[0] * 0.5 + quat2[0] * 0.5);
          dest[1] = (quat[1] * 0.5 + quat2[1] * 0.5);
          dest[2] = (quat[2] * 0.5 + quat2[2] * 0.5);
          dest[3] = (quat[3] * 0.5 + quat2[3] * 0.5);
          return dest;
      }
  
      ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta;
      ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta;
  
      dest[0] = (quat[0] * ratioA + quat2[0] * ratioB);
      dest[1] = (quat[1] * ratioA + quat2[1] * ratioB);
      dest[2] = (quat[2] * ratioA + quat2[2] * ratioB);
      dest[3] = (quat[3] * ratioA + quat2[3] * ratioB);
  
      return dest;
  };
  
  /**
   * Returns a string representation of a quaternion
   *
   * @param {quat4} quat quat4 to represent as a string
   *
   * @returns {string} String representation of quat
   */
  quat4.str = function (quat) {
      return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']';
  };
  
  
  return {
    vec3: vec3,
    mat3: mat3,
    mat4: mat4,
    quat4: quat4
  };
  
  })();
  
  ;
  var GLImmediateSetup={};
  
  function _glEnable(x0) { GLctx.enable(x0) }
  
  function _glDisable(x0) { GLctx.disable(x0) }
  
  function _glIsEnabled(x0) { return GLctx.isEnabled(x0) }
  
  function _glGetBooleanv(name_, p) {
      return GL.get(name_, p, 'Boolean');
    }
  
  function _glGetIntegerv(name_, p) {
      return GL.get(name_, p, 'Integer');
    }
  
  function _glGetString(name_) {
      if (GL.stringCache[name_]) return GL.stringCache[name_];
      var ret; 
      switch(name_) {
        case 0x1F00 /* GL_VENDOR */:
        case 0x1F01 /* GL_RENDERER */:
        case 0x1F02 /* GL_VERSION */:
          ret = allocate(intArrayFromString(GLctx.getParameter(name_)), 'i8', ALLOC_NORMAL);
          break;
        case 0x1F03 /* GL_EXTENSIONS */:
          var exts = GLctx.getSupportedExtensions();
          var gl_exts = [];
          for (i in exts) {
            gl_exts.push(exts[i]);
            gl_exts.push("GL_" + exts[i]);
          }
          ret = allocate(intArrayFromString(gl_exts.join(' ')), 'i8', ALLOC_NORMAL);
          break;
        case 0x8B8C /* GL_SHADING_LANGUAGE_VERSION */:
          ret = allocate(intArrayFromString('OpenGL ES GLSL 1.00 (WebGL)'), 'i8', ALLOC_NORMAL);
          break;
        default:
          GL.recordError(0x0500/*GL_INVALID_ENUM*/);
          return 0;
      }
      GL.stringCache[name_] = ret;
      return ret;
    }
  
  function _glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    }
  
  function _glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length);
      GLctx.shaderSource(GL.shaders[shader], source);
    }
  
  function _glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader]);
    }
  
  function _glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program],
                              GL.shaders[shader]);
    }
  
  function _glDetachShader(program, shader) {
      GLctx.detachShader(GL.programs[program],
                              GL.shaders[shader]);
    }
  
  function _glUseProgram(program) {
      GLctx.useProgram(program ? GL.programs[program] : null);
    }
  
  function _glDeleteProgram(program) {
      var program = GL.programs[program];
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[program] = null;
      GL.programInfos[program] = null;
    }
  
  function _glBindAttribLocation(program, index, name) {
      name = Pointer_stringify(name);
      GLctx.bindAttribLocation(GL.programs[program], index, name);
    }
  
  function _glLinkProgram(program) {
      GLctx.linkProgram(GL.programs[program]);
      GL.programInfos[program] = null; // uniforms no longer keep the same names after linking
      GL.populateUniformTable(program);
    }
  
  function _glBindBuffer(target, buffer) {
      var bufferObj = buffer ? GL.buffers[buffer] : null;
  
      if (target == GLctx.ARRAY_BUFFER) {
        GLImmediate.lastArrayBuffer = GL.currArrayBuffer = buffer;
      } else if (target == GLctx.ELEMENT_ARRAY_BUFFER) {
        GL.currElementArrayBuffer = buffer;
      }
  
      GLctx.bindBuffer(target, bufferObj);
    }
  
  function _glGetFloatv(name_, p) {
      return GL.get(name_, p, 'Float');
    }
  
  function _glHint(x0, x1) { GLctx.hint(x0, x1) }
  
  function _glEnableVertexAttribArray(index) {
      GLctx.enableVertexAttribArray(index);
    }
  
  function _glDisableVertexAttribArray(index) {
      GLctx.disableVertexAttribArray(index);
    }
  
  function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
      GLctx.vertexAttribPointer(index, size, type, normalized, stride, ptr);
    }
  
  function _glActiveTexture(x0) { GLctx.activeTexture(x0) }var GLEmulation={fogStart:0,fogEnd:1,fogDensity:1,fogColor:null,fogMode:2048,fogEnabled:false,vaos:[],currentVao:null,enabledVertexAttribArrays:{},hasRunInit:false,init:function () {
        // Do not activate immediate/emulation code (e.g. replace glDrawElements) when in FULL_ES2 mode.
        // We do not need full emulation, we instead emulate client-side arrays etc. in FULL_ES2 code in
        // a straightforward manner, and avoid not having a bound buffer be ambiguous between es2 emulation
        // code and legacy gl emulation code.
  
        if (GLEmulation.hasRunInit) {
          return;
        }
        GLEmulation.hasRunInit = true;
  
        GLEmulation.fogColor = new Float32Array(4);
  
        // Add some emulation workarounds
        Module.printErr('WARNING: using emscripten GL emulation. This is a collection of limited workarounds, do not expect it to work.');
        Module.printErr('WARNING: using emscripten GL emulation unsafe opts. If weirdness happens, try -s GL_UNSAFE_OPTS=0');
  
        // XXX some of the capabilities we don't support may lead to incorrect rendering, if we do not emulate them in shaders
        var validCapabilities = {
          0x0B44: 1, // GL_CULL_FACE
          0x0BE2: 1, // GL_BLEND
          0x0BD0: 1, // GL_DITHER,
          0x0B90: 1, // GL_STENCIL_TEST
          0x0B71: 1, // GL_DEPTH_TEST
          0x0C11: 1, // GL_SCISSOR_TEST
          0x8037: 1, // GL_POLYGON_OFFSET_FILL
          0x809E: 1, // GL_SAMPLE_ALPHA_TO_COVERAGE
          0x80A0: 1  // GL_SAMPLE_COVERAGE
        };
  
        var glEnable = _glEnable;
        _glEnable = _emscripten_glEnable = function _glEnable(cap) {
          // Clean up the renderer on any change to the rendering state. The optimization of
          // skipping renderer setup is aimed at the case of multiple glDraw* right after each other
          if (GLImmediate.lastRenderer) GLImmediate.lastRenderer.cleanup();
          if (cap == 0x0B60 /* GL_FOG */) {
            if (GLEmulation.fogEnabled != true) {
              GLImmediate.currentRenderer = null; // Fog parameter is part of the FFP shader state, we must re-lookup the renderer to use.
              GLEmulation.fogEnabled = true;
            }
            return;
          } else if (cap == 0x0de1 /* GL_TEXTURE_2D */) {
            // XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support
            // it by forwarding to glEnableClientState
            /* Actually, let's not, for now. (This sounds exceedingly broken)
             * This is in gl_ps_workaround2.c.
            _glEnableClientState(cap);
            */
            return;
          } else if (!(cap in validCapabilities)) {
            return;
          }
          glEnable(cap);
        };
  
        var glDisable = _glDisable;
        _glDisable = _emscripten_glDisable = function _glDisable(cap) {
          if (GLImmediate.lastRenderer) GLImmediate.lastRenderer.cleanup();
          if (cap == 0x0B60 /* GL_FOG */) {
            if (GLEmulation.fogEnabled != false) {
              GLImmediate.currentRenderer = null; // Fog parameter is part of the FFP shader state, we must re-lookup the renderer to use.
              GLEmulation.fogEnabled = false;
            }
            return;
          } else if (cap == 0x0de1 /* GL_TEXTURE_2D */) {
            // XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support
            // it by forwarding to glDisableClientState
            /* Actually, let's not, for now. (This sounds exceedingly broken)
             * This is in gl_ps_workaround2.c.
            _glDisableClientState(cap);
            */
            return;
          } else if (!(cap in validCapabilities)) {
            return;
          }
          glDisable(cap);
        };
        _glIsEnabled = _emscripten_glIsEnabled = function _glIsEnabled(cap) {
          if (cap == 0x0B60 /* GL_FOG */) {
            return GLEmulation.fogEnabled ? 1 : 0;
          } else if (!(cap in validCapabilities)) {
            return 0;
          }
          return GLctx.isEnabled(cap);
        };
  
        var glGetBooleanv = _glGetBooleanv;
        _glGetBooleanv = _emscripten_glGetBooleanv = function _glGetBooleanv(pname, p) {
          var attrib = GLEmulation.getAttributeFromCapability(pname);
          if (attrib !== null) {
            var result = GLImmediate.enabledClientAttributes[attrib];
            HEAP8[(p)]=result === true ? 1 : 0;
            return;
          }
          glGetBooleanv(pname, p);
        };
  
        var glGetIntegerv = _glGetIntegerv;
        _glGetIntegerv = _emscripten_glGetIntegerv = function _glGetIntegerv(pname, params) {
          switch (pname) {
            case 0x84E2: pname = GLctx.MAX_TEXTURE_IMAGE_UNITS /* fake it */; break; // GL_MAX_TEXTURE_UNITS
            case 0x8B4A: { // GL_MAX_VERTEX_UNIFORM_COMPONENTS_ARB
              var result = GLctx.getParameter(GLctx.MAX_VERTEX_UNIFORM_VECTORS);
              HEAP32[((params)>>2)]=result*4; // GLES gives num of 4-element vectors, GL wants individual components, so multiply
              return;
            }
            case 0x8B49: { // GL_MAX_FRAGMENT_UNIFORM_COMPONENTS_ARB
              var result = GLctx.getParameter(GLctx.MAX_FRAGMENT_UNIFORM_VECTORS);
              HEAP32[((params)>>2)]=result*4; // GLES gives num of 4-element vectors, GL wants individual components, so multiply
              return;
            }
            case 0x8B4B: { // GL_MAX_VARYING_FLOATS_ARB
              var result = GLctx.getParameter(GLctx.MAX_VARYING_VECTORS);
              HEAP32[((params)>>2)]=result*4; // GLES gives num of 4-element vectors, GL wants individual components, so multiply
              return;
            }
            case 0x8871: pname = GLctx.MAX_COMBINED_TEXTURE_IMAGE_UNITS /* close enough */; break; // GL_MAX_TEXTURE_COORDS
            case 0x807A: { // GL_VERTEX_ARRAY_SIZE
              var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
              HEAP32[((params)>>2)]=attribute ? attribute.size : 0;
              return;
            }
            case 0x807B: { // GL_VERTEX_ARRAY_TYPE
              var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
              HEAP32[((params)>>2)]=attribute ? attribute.type : 0;
              return;
            }
            case 0x807C: { // GL_VERTEX_ARRAY_STRIDE
              var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
              HEAP32[((params)>>2)]=attribute ? attribute.stride : 0;
              return;
            }
            case 0x8081: { // GL_COLOR_ARRAY_SIZE
              var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
              HEAP32[((params)>>2)]=attribute ? attribute.size : 0;
              return;
            }
            case 0x8082: { // GL_COLOR_ARRAY_TYPE
              var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
              HEAP32[((params)>>2)]=attribute ? attribute.type : 0;
              return;
            }
            case 0x8083: { // GL_COLOR_ARRAY_STRIDE
              var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
              HEAP32[((params)>>2)]=attribute ? attribute.stride : 0;
              return;
            }
            case 0x8088: { // GL_TEXTURE_COORD_ARRAY_SIZE
              var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
              HEAP32[((params)>>2)]=attribute ? attribute.size : 0;
              return;
            }
            case 0x8089: { // GL_TEXTURE_COORD_ARRAY_TYPE
              var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
              HEAP32[((params)>>2)]=attribute ? attribute.type : 0;
              return;
            }
            case 0x808A: { // GL_TEXTURE_COORD_ARRAY_STRIDE
              var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
              HEAP32[((params)>>2)]=attribute ? attribute.stride : 0;
              return;
            }
          }
          glGetIntegerv(pname, params);
        };
  
        var glGetString = _glGetString;
        _glGetString = _emscripten_glGetString = function _glGetString(name_) {
          if (GL.stringCache[name_]) return GL.stringCache[name_];
          switch(name_) {
            case 0x1F03 /* GL_EXTENSIONS */: // Add various extensions that we can support
              var ret = allocate(intArrayFromString(GLctx.getSupportedExtensions().join(' ') +
                     ' GL_EXT_texture_env_combine GL_ARB_texture_env_crossbar GL_ATI_texture_env_combine3 GL_NV_texture_env_combine4 GL_EXT_texture_env_dot3 GL_ARB_multitexture GL_ARB_vertex_buffer_object GL_EXT_framebuffer_object GL_ARB_vertex_program GL_ARB_fragment_program GL_ARB_shading_language_100 GL_ARB_shader_objects GL_ARB_vertex_shader GL_ARB_fragment_shader GL_ARB_texture_cube_map GL_EXT_draw_range_elements' +
                     (GL.compressionExt ? ' GL_ARB_texture_compression GL_EXT_texture_compression_s3tc' : '') +
                     (GL.anisotropicExt ? ' GL_EXT_texture_filter_anisotropic' : '')
              ), 'i8', ALLOC_NORMAL);
              GL.stringCache[name_] = ret;
              return ret;
          }
          return glGetString(name_);
        };
  
        // Do some automatic rewriting to work around GLSL differences. Note that this must be done in
        // tandem with the rest of the program, by itself it cannot suffice.
        // Note that we need to remember shader types for this rewriting, saving sources makes it easier to debug.
        GL.shaderInfos = {};
        var glCreateShader = _glCreateShader;
        _glCreateShader = _emscripten_glCreateShader = function _glCreateShader(shaderType) {
          var id = glCreateShader(shaderType);
          GL.shaderInfos[id] = {
            type: shaderType,
            ftransform: false
          };
          return id;
        };
  
        function ensurePrecision(source) {
          if (!/precision +(low|medium|high)p +float *;/.test(source)) {
            source = 'precision mediump float;\n' + source;
          }
          return source;
        }
  
        var glShaderSource = _glShaderSource;
        _glShaderSource = _emscripten_glShaderSource = function _glShaderSource(shader, count, string, length) {
          var source = GL.getSource(shader, count, string, length);
          // XXX We add attributes and uniforms to shaders. The program can ask for the # of them, and see the
          // ones we generated, potentially confusing it? Perhaps we should hide them.
          if (GL.shaderInfos[shader].type == GLctx.VERTEX_SHADER) {
            // Replace ftransform() with explicit project/modelview transforms, and add position and matrix info.
            var has_pm = source.search(/u_projection/) >= 0;
            var has_mm = source.search(/u_modelView/) >= 0;
            var has_pv = source.search(/a_position/) >= 0;
            var need_pm = 0, need_mm = 0, need_pv = 0;
            var old = source;
            source = source.replace(/ftransform\(\)/g, '(u_projection * u_modelView * a_position)');
            if (old != source) need_pm = need_mm = need_pv = 1;
            old = source;
            source = source.replace(/gl_ProjectionMatrix/g, 'u_projection');
            if (old != source) need_pm = 1;
            old = source;
            source = source.replace(/gl_ModelViewMatrixTranspose\[2\]/g, 'vec4(u_modelView[0][2], u_modelView[1][2], u_modelView[2][2], u_modelView[3][2])'); // XXX extremely inefficient
            if (old != source) need_mm = 1;
            old = source;
            source = source.replace(/gl_ModelViewMatrix/g, 'u_modelView');
            if (old != source) need_mm = 1;
            old = source;
            source = source.replace(/gl_Vertex/g, 'a_position');
            if (old != source) need_pv = 1;
            old = source;
            source = source.replace(/gl_ModelViewProjectionMatrix/g, '(u_projection * u_modelView)');
            if (old != source) need_pm = need_mm = 1;
            if (need_pv && !has_pv) source = 'attribute vec4 a_position; \n' + source;
            if (need_mm && !has_mm) source = 'uniform mat4 u_modelView; \n' + source;
            if (need_pm && !has_pm) source = 'uniform mat4 u_projection; \n' + source;
            GL.shaderInfos[shader].ftransform = need_pm || need_mm || need_pv; // we will need to provide the fixed function stuff as attributes and uniforms
            for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              // XXX To handle both regular texture mapping and cube mapping, we use vec4 for tex coordinates.
              var old = source;
              var need_vtc = source.search('v_texCoord' + i) == -1;
              source = source.replace(new RegExp('gl_TexCoord\\[' + i + '\\]', 'g'), 'v_texCoord' + i)
                             .replace(new RegExp('gl_MultiTexCoord' + i, 'g'), 'a_texCoord' + i);
              if (source != old) {
                source = 'attribute vec4 a_texCoord' + i + '; \n' + source;
                if (need_vtc) {
                  source = 'varying vec4 v_texCoord' + i + ';   \n' + source;
                }
              }
  
              old = source;
              source = source.replace(new RegExp('gl_TextureMatrix\\[' + i + '\\]', 'g'), 'u_textureMatrix' + i);
              if (source != old) {
                source = 'uniform mat4 u_textureMatrix' + i + '; \n' + source;
              }
            }
            if (source.indexOf('gl_FrontColor') >= 0) {
              source = 'varying vec4 v_color; \n' +
                       source.replace(/gl_FrontColor/g, 'v_color');
            }
            if (source.indexOf('gl_Color') >= 0) {
              source = 'attribute vec4 a_color; \n' +
                       source.replace(/gl_Color/g, 'a_color');
            }
            if (source.indexOf('gl_Normal') >= 0) {
              source = 'attribute vec3 a_normal; \n' +
                       source.replace(/gl_Normal/g, 'a_normal');
            }
            // fog
            if (source.indexOf('gl_FogFragCoord') >= 0) {
              source = 'varying float v_fogFragCoord;   \n' +
                       source.replace(/gl_FogFragCoord/g, 'v_fogFragCoord');
            }
            source = ensurePrecision(source);
          } else { // Fragment shader
            for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              var old = source;
              source = source.replace(new RegExp('gl_TexCoord\\[' + i + '\\]', 'g'), 'v_texCoord' + i);
              if (source != old) {
                source = 'varying vec4 v_texCoord' + i + ';   \n' + source;
              }
            }
            if (source.indexOf('gl_Color') >= 0) {
              source = 'varying vec4 v_color; \n' + source.replace(/gl_Color/g, 'v_color');
            }
            if (source.indexOf('gl_Fog.color') >= 0) {
              source = 'uniform vec4 u_fogColor;   \n' +
                       source.replace(/gl_Fog.color/g, 'u_fogColor');
            }
            if (source.indexOf('gl_Fog.end') >= 0) {
              source = 'uniform float u_fogEnd;   \n' +
                       source.replace(/gl_Fog.end/g, 'u_fogEnd');
            }
            if (source.indexOf('gl_Fog.scale') >= 0) {
              source = 'uniform float u_fogScale;   \n' +
                       source.replace(/gl_Fog.scale/g, 'u_fogScale');
            }
            if (source.indexOf('gl_Fog.density') >= 0) {
              source = 'uniform float u_fogDensity;   \n' +
                       source.replace(/gl_Fog.density/g, 'u_fogDensity');
            }
            if (source.indexOf('gl_FogFragCoord') >= 0) {
              source = 'varying float v_fogFragCoord;   \n' +
                       source.replace(/gl_FogFragCoord/g, 'v_fogFragCoord');
            }
            source = ensurePrecision(source);
          }
          GLctx.shaderSource(GL.shaders[shader], source);
        };
  
        var glCompileShader = _glCompileShader;
        _glCompileShader = _emscripten_glCompileShader = function _glCompileShader(shader) {
          GLctx.compileShader(GL.shaders[shader]);
        };
  
        GL.programShaders = {};
        var glAttachShader = _glAttachShader;
        _glAttachShader = _emscripten_glAttachShader = function _glAttachShader(program, shader) {
          if (!GL.programShaders[program]) GL.programShaders[program] = [];
          GL.programShaders[program].push(shader);
          glAttachShader(program, shader);
        };
  
        var glDetachShader = _glDetachShader;
        _glDetachShader = _emscripten_glDetachShader = function _glDetachShader(program, shader) {
          var programShader = GL.programShaders[program];
          if (!programShader) {
            Module.printErr('WARNING: _glDetachShader received invalid program: ' + program);
            return;
          }
          var index = programShader.indexOf(shader);
          programShader.splice(index, 1);
          glDetachShader(program, shader);
        };
  
        var glUseProgram = _glUseProgram;
        _glUseProgram = _emscripten_glUseProgram = function _glUseProgram(program) {
          if (GL.currProgram != program) {
            GLImmediate.currentRenderer = null; // This changes the FFP emulation shader program, need to recompute that.
            GL.currProgram = program;
            GLImmediate.fixedFunctionProgram = 0;
            glUseProgram(program);
          }
        }
  
        var glDeleteProgram = _glDeleteProgram;
        _glDeleteProgram = _emscripten_glDeleteProgram = function _glDeleteProgram(program) {
          glDeleteProgram(program);
          if (program == GL.currProgram) {
            GLImmediate.currentRenderer = null; // This changes the FFP emulation shader program, need to recompute that.
            GL.currProgram = 0;
          }
        };
  
        // If attribute 0 was not bound, bind it to 0 for WebGL performance reasons. Track if 0 is free for that.
        var zeroUsedPrograms = {};
        var glBindAttribLocation = _glBindAttribLocation;
        _glBindAttribLocation = _emscripten_glBindAttribLocation = function _glBindAttribLocation(program, index, name) {
          if (index == 0) zeroUsedPrograms[program] = true;
          glBindAttribLocation(program, index, name);
        };
        var glLinkProgram = _glLinkProgram;
        _glLinkProgram = _emscripten_glLinkProgram = function _glLinkProgram(program) {
          if (!(program in zeroUsedPrograms)) {
            GLctx.bindAttribLocation(GL.programs[program], 0, 'a_position');
          }
          glLinkProgram(program);
        };
  
        var glBindBuffer = _glBindBuffer;
        _glBindBuffer = _emscripten_glBindBuffer = function _glBindBuffer(target, buffer) {
          glBindBuffer(target, buffer);
          if (target == GLctx.ARRAY_BUFFER) {
            if (GLEmulation.currentVao) {
              GLEmulation.currentVao.arrayBuffer = buffer;
            }
          } else if (target == GLctx.ELEMENT_ARRAY_BUFFER) {
            if (GLEmulation.currentVao) GLEmulation.currentVao.elementArrayBuffer = buffer;
          }
        };
  
        var glGetFloatv = _glGetFloatv;
        _glGetFloatv = _emscripten_glGetFloatv = function _glGetFloatv(pname, params) {
          if (pname == 0x0BA6) { // GL_MODELVIEW_MATRIX
            HEAPF32.set(GLImmediate.matrix[0/*m*/], params >> 2);
          } else if (pname == 0x0BA7) { // GL_PROJECTION_MATRIX
            HEAPF32.set(GLImmediate.matrix[1/*p*/], params >> 2);
          } else if (pname == 0x0BA8) { // GL_TEXTURE_MATRIX
            HEAPF32.set(GLImmediate.matrix[2/*t*/ + GLImmediate.clientActiveTexture], params >> 2);
          } else if (pname == 0x0B66) { // GL_FOG_COLOR
            HEAPF32.set(GLEmulation.fogColor, params >> 2);
          } else if (pname == 0x0B63) { // GL_FOG_START
            HEAPF32[((params)>>2)]=GLEmulation.fogStart;
          } else if (pname == 0x0B64) { // GL_FOG_END
            HEAPF32[((params)>>2)]=GLEmulation.fogEnd;
          } else if (pname == 0x0B62) { // GL_FOG_DENSITY
            HEAPF32[((params)>>2)]=GLEmulation.fogDensity;
          } else if (pname == 0x0B65) { // GL_FOG_MODE
            HEAPF32[((params)>>2)]=GLEmulation.fogMode;
          } else {
            glGetFloatv(pname, params);
          }
        };
  
        var glHint = _glHint;
        _glHint = _emscripten_glHint = function _glHint(target, mode) {
          if (target == 0x84EF) { // GL_TEXTURE_COMPRESSION_HINT
            return;
          }
          glHint(target, mode);
        };
  
        var glEnableVertexAttribArray = _glEnableVertexAttribArray;
        _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray = function _glEnableVertexAttribArray(index) {
          glEnableVertexAttribArray(index);
          GLEmulation.enabledVertexAttribArrays[index] = 1;
          if (GLEmulation.currentVao) GLEmulation.currentVao.enabledVertexAttribArrays[index] = 1;
        };
  
        var glDisableVertexAttribArray = _glDisableVertexAttribArray;
        _glDisableVertexAttribArray = _emscripten_glDisableVertexAttribArray = function _glDisableVertexAttribArray(index) {
          glDisableVertexAttribArray(index);
          delete GLEmulation.enabledVertexAttribArrays[index];
          if (GLEmulation.currentVao) delete GLEmulation.currentVao.enabledVertexAttribArrays[index];
        };
  
        var glVertexAttribPointer = _glVertexAttribPointer;
        _glVertexAttribPointer = _emscripten_glVertexAttribPointer = function _glVertexAttribPointer(index, size, type, normalized, stride, pointer) {
          glVertexAttribPointer(index, size, type, normalized, stride, pointer);
          if (GLEmulation.currentVao) { // TODO: avoid object creation here? likely not hot though
            GLEmulation.currentVao.vertexAttribPointers[index] = [index, size, type, normalized, stride, pointer];
          }
        };
      },getAttributeFromCapability:function (cap) {
        var attrib = null;
        switch (cap) {
          case 0x0de1: // GL_TEXTURE_2D - XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support it
            // Fall through:
          case 0x8078: // GL_TEXTURE_COORD_ARRAY
            attrib = GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture; break;
          case 0x8074: // GL_VERTEX_ARRAY
            attrib = GLImmediate.VERTEX; break;
          case 0x8075: // GL_NORMAL_ARRAY
            attrib = GLImmediate.NORMAL; break;
          case 0x8076: // GL_COLOR_ARRAY
            attrib = GLImmediate.COLOR; break;
        }
        return attrib;
      }};
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
(function() {'use strict';function n(e){throw e;}var p=void 0,aa=this;function r(e,c){var d=e.split("."),b=aa;!(d[0]in b)&&b.execScript&&b.execScript("var "+d[0]);for(var a;d.length&&(a=d.shift());)!d.length&&c!==p?b[a]=c:b=b[a]?b[a]:b[a]={}};var u="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array;new (u?Uint8Array:Array)(256);var v;for(v=0;256>v;++v)for(var w=v,ba=7,w=w>>>1;w;w>>>=1)--ba;function x(e,c,d){var b,a="number"===typeof c?c:c=0,f="number"===typeof d?d:e.length;b=-1;for(a=f&7;a--;++c)b=b>>>8^y[(b^e[c])&255];for(a=f>>3;a--;c+=8)b=b>>>8^y[(b^e[c])&255],b=b>>>8^y[(b^e[c+1])&255],b=b>>>8^y[(b^e[c+2])&255],b=b>>>8^y[(b^e[c+3])&255],b=b>>>8^y[(b^e[c+4])&255],b=b>>>8^y[(b^e[c+5])&255],b=b>>>8^y[(b^e[c+6])&255],b=b>>>8^y[(b^e[c+7])&255];return(b^4294967295)>>>0}var z=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918E3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],y=u?new Uint32Array(z):z;function A(){}A.prototype.getName=function(){return this.name};A.prototype.getData=function(){return this.data};A.prototype.G=function(){return this.H};r("Zlib.GunzipMember",A);r("Zlib.GunzipMember.prototype.getName",A.prototype.getName);r("Zlib.GunzipMember.prototype.getData",A.prototype.getData);r("Zlib.GunzipMember.prototype.getMtime",A.prototype.G);function C(e){var c=e.length,d=0,b=Number.POSITIVE_INFINITY,a,f,g,k,m,q,t,h,l;for(h=0;h<c;++h)e[h]>d&&(d=e[h]),e[h]<b&&(b=e[h]);a=1<<d;f=new (u?Uint32Array:Array)(a);g=1;k=0;for(m=2;g<=d;){for(h=0;h<c;++h)if(e[h]===g){q=0;t=k;for(l=0;l<g;++l)q=q<<1|t&1,t>>=1;for(l=q;l<a;l+=m)f[l]=g<<16|h;++k}++g;k<<=1;m<<=1}return[f,d,b]};var D=[],E;for(E=0;288>E;E++)switch(!0){case 143>=E:D.push([E+48,8]);break;case 255>=E:D.push([E-144+400,9]);break;case 279>=E:D.push([E-256+0,7]);break;case 287>=E:D.push([E-280+192,8]);break;default:n("invalid literal: "+E)}var ca=function(){function e(a){switch(!0){case 3===a:return[257,a-3,0];case 4===a:return[258,a-4,0];case 5===a:return[259,a-5,0];case 6===a:return[260,a-6,0];case 7===a:return[261,a-7,0];case 8===a:return[262,a-8,0];case 9===a:return[263,a-9,0];case 10===a:return[264,a-10,0];case 12>=a:return[265,a-11,1];case 14>=a:return[266,a-13,1];case 16>=a:return[267,a-15,1];case 18>=a:return[268,a-17,1];case 22>=a:return[269,a-19,2];case 26>=a:return[270,a-23,2];case 30>=a:return[271,a-27,2];case 34>=a:return[272,a-31,2];case 42>=a:return[273,a-35,3];case 50>=a:return[274,a-43,3];case 58>=a:return[275,a-51,3];case 66>=a:return[276,a-59,3];case 82>=a:return[277,a-67,4];case 98>=a:return[278,a-83,4];case 114>=a:return[279,a-99,4];case 130>=a:return[280,a-115,4];case 162>=a:return[281,a-131,5];case 194>=a:return[282,a-163,5];case 226>=a:return[283,a-195,5];case 257>=a:return[284,a-227,5];case 258===a:return[285,a-258,0];default:n("invalid length: "+a)}}var c=[],d,b;for(d=3;258>=d;d++)b=e(d),c[d]=b[2]<<24|b[1]<<16|b[0];return c}();u&&new Uint32Array(ca);function G(e,c){this.i=[];this.j=32768;this.d=this.f=this.c=this.n=0;this.input=u?new Uint8Array(e):e;this.o=!1;this.k=H;this.w=!1;if(c||!(c={}))c.index&&(this.c=c.index),c.bufferSize&&(this.j=c.bufferSize),c.bufferType&&(this.k=c.bufferType),c.resize&&(this.w=c.resize);switch(this.k){case I:this.a=32768;this.b=new (u?Uint8Array:Array)(32768+this.j+258);break;case H:this.a=0;this.b=new (u?Uint8Array:Array)(this.j);this.e=this.D;this.q=this.A;this.l=this.C;break;default:n(Error("invalid inflate mode"))}}var I=0,H=1;G.prototype.g=function(){for(;!this.o;){var e=J(this,3);e&1&&(this.o=!0);e>>>=1;switch(e){case 0:var c=this.input,d=this.c,b=this.b,a=this.a,f=p,g=p,k=p,m=b.length,q=p;this.d=this.f=0;f=c[d++];f===p&&n(Error("invalid uncompressed block header: LEN (first byte)"));g=f;f=c[d++];f===p&&n(Error("invalid uncompressed block header: LEN (second byte)"));g|=f<<8;f=c[d++];f===p&&n(Error("invalid uncompressed block header: NLEN (first byte)"));k=f;f=c[d++];f===p&&n(Error("invalid uncompressed block header: NLEN (second byte)"));k|=f<<8;g===~k&&n(Error("invalid uncompressed block header: length verify"));d+g>c.length&&n(Error("input buffer is broken"));switch(this.k){case I:for(;a+g>b.length;){q=m-a;g-=q;if(u)b.set(c.subarray(d,d+q),a),a+=q,d+=q;else for(;q--;)b[a++]=c[d++];this.a=a;b=this.e();a=this.a}break;case H:for(;a+g>b.length;)b=this.e({t:2});break;default:n(Error("invalid inflate mode"))}if(u)b.set(c.subarray(d,d+g),a),a+=g,d+=g;else for(;g--;)b[a++]=c[d++];this.c=d;this.a=a;this.b=b;break;case 1:this.l(da,ea);break;case 2:fa(this);break;default:n(Error("unknown BTYPE: "+e))}}return this.q()};var K=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],L=u?new Uint16Array(K):K,N=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],O=u?new Uint16Array(N):N,P=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],Q=u?new Uint8Array(P):P,T=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],ga=u?new Uint16Array(T):T,ha=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],U=u?new Uint8Array(ha):ha,V=new (u?Uint8Array:Array)(288),W,ia;W=0;for(ia=V.length;W<ia;++W)V[W]=143>=W?8:255>=W?9:279>=W?7:8;var da=C(V),X=new (u?Uint8Array:Array)(30),Y,ja;Y=0;for(ja=X.length;Y<ja;++Y)X[Y]=5;var ea=C(X);function J(e,c){for(var d=e.f,b=e.d,a=e.input,f=e.c,g;b<c;)g=a[f++],g===p&&n(Error("input buffer is broken")),d|=g<<b,b+=8;g=d&(1<<c)-1;e.f=d>>>c;e.d=b-c;e.c=f;return g}function Z(e,c){for(var d=e.f,b=e.d,a=e.input,f=e.c,g=c[0],k=c[1],m,q,t;b<k;){m=a[f++];if(m===p)break;d|=m<<b;b+=8}q=g[d&(1<<k)-1];t=q>>>16;e.f=d>>t;e.d=b-t;e.c=f;return q&65535}function fa(e){function c(a,c,b){var d,e,f,g;for(g=0;g<a;)switch(d=Z(this,c),d){case 16:for(f=3+J(this,2);f--;)b[g++]=e;break;case 17:for(f=3+J(this,3);f--;)b[g++]=0;e=0;break;case 18:for(f=11+J(this,7);f--;)b[g++]=0;e=0;break;default:e=b[g++]=d}return b}var d=J(e,5)+257,b=J(e,5)+1,a=J(e,4)+4,f=new (u?Uint8Array:Array)(L.length),g,k,m,q;for(q=0;q<a;++q)f[L[q]]=J(e,3);g=C(f);k=new (u?Uint8Array:Array)(d);m=new (u?Uint8Array:Array)(b);e.l(C(c.call(e,d,g,k)),C(c.call(e,b,g,m)))}G.prototype.l=function(e,c){var d=this.b,b=this.a;this.r=e;for(var a=d.length-258,f,g,k,m;256!==(f=Z(this,e));)if(256>f)b>=a&&(this.a=b,d=this.e(),b=this.a),d[b++]=f;else{g=f-257;m=O[g];0<Q[g]&&(m+=J(this,Q[g]));f=Z(this,c);k=ga[f];0<U[f]&&(k+=J(this,U[f]));b>=a&&(this.a=b,d=this.e(),b=this.a);for(;m--;)d[b]=d[b++-k]}for(;8<=this.d;)this.d-=8,this.c--;this.a=b};G.prototype.C=function(e,c){var d=this.b,b=this.a;this.r=e;for(var a=d.length,f,g,k,m;256!==(f=Z(this,e));)if(256>f)b>=a&&(d=this.e(),a=d.length),d[b++]=f;else{g=f-257;m=O[g];0<Q[g]&&(m+=J(this,Q[g]));f=Z(this,c);k=ga[f];0<U[f]&&(k+=J(this,U[f]));b+m>a&&(d=this.e(),a=d.length);for(;m--;)d[b]=d[b++-k]}for(;8<=this.d;)this.d-=8,this.c--;this.a=b};G.prototype.e=function(){var e=new (u?Uint8Array:Array)(this.a-32768),c=this.a-32768,d,b,a=this.b;if(u)e.set(a.subarray(32768,e.length));else{d=0;for(b=e.length;d<b;++d)e[d]=a[d+32768]}this.i.push(e);this.n+=e.length;if(u)a.set(a.subarray(c,c+32768));else for(d=0;32768>d;++d)a[d]=a[c+d];this.a=32768;return a};G.prototype.D=function(e){var c,d=this.input.length/this.c+1|0,b,a,f,g=this.input,k=this.b;e&&("number"===typeof e.t&&(d=e.t),"number"===typeof e.z&&(d+=e.z));2>d?(b=(g.length-this.c)/this.r[2],f=258*(b/2)|0,a=f<k.length?k.length+f:k.length<<1):a=k.length*d;u?(c=new Uint8Array(a),c.set(k)):c=k;return this.b=c};G.prototype.q=function(){var e=0,c=this.b,d=this.i,b,a=new (u?Uint8Array:Array)(this.n+(this.a-32768)),f,g,k,m;if(0===d.length)return u?this.b.subarray(32768,this.a):this.b.slice(32768,this.a);f=0;for(g=d.length;f<g;++f){b=d[f];k=0;for(m=b.length;k<m;++k)a[e++]=b[k]}f=32768;for(g=this.a;f<g;++f)a[e++]=c[f];this.i=[];return this.buffer=a};G.prototype.A=function(){var e,c=this.a;u?this.w?(e=new Uint8Array(c),e.set(this.b.subarray(0,c))):e=this.b.subarray(0,c):(this.b.length>c&&(this.b.length=c),e=this.b);return this.buffer=e};function $(e){this.input=e;this.c=0;this.m=[];this.s=!1}$.prototype.F=function(){this.s||this.g();return this.m.slice()};$.prototype.g=function(){for(var e=this.input.length;this.c<e;){var c=new A,d=p,b=p,a=p,f=p,g=p,k=p,m=p,q=p,t=p,h=this.input,l=this.c;c.u=h[l++];c.v=h[l++];(31!==c.u||139!==c.v)&&n(Error("invalid file signature:"+c.u+","+c.v));c.p=h[l++];switch(c.p){case 8:break;default:n(Error("unknown compression method: "+c.p))}c.h=h[l++];q=h[l++]|h[l++]<<8|h[l++]<<16|h[l++]<<24;c.H=new Date(1E3*q);c.N=h[l++];c.M=h[l++];0<(c.h&4)&&(c.I=h[l++]|h[l++]<<8,l+=c.I);if(0<(c.h&8)){m=[];for(k=0;0<(g=h[l++]);)m[k++]=String.fromCharCode(g);c.name=m.join("")}if(0<(c.h&16)){m=[];for(k=0;0<(g=h[l++]);)m[k++]=String.fromCharCode(g);c.J=m.join("")}0<(c.h&2)&&(c.B=x(h,0,l)&65535,c.B!==(h[l++]|h[l++]<<8)&&n(Error("invalid header crc16")));d=h[h.length-4]|h[h.length-3]<<8|h[h.length-2]<<16|h[h.length-1]<<24;h.length-l-4-4<512*d&&(f=d);b=new G(h,{index:l,bufferSize:f});c.data=a=b.g();l=b.c;c.K=t=(h[l++]|h[l++]<<8|h[l++]<<16|h[l++]<<24)>>>0;x(a,p,p)!==t&&n(Error("invalid CRC-32 checksum: 0x"+x(a,p,p).toString(16)+" / 0x"+t.toString(16)));c.L=d=(h[l++]|h[l++]<<8|h[l++]<<16|h[l++]<<24)>>>0;(a.length&4294967295)!==d&&n(Error("invalid input size: "+(a.length&4294967295)+" / "+d));this.m.push(c);this.c=l}this.s=!0;var F=this.m,s,M,R=0,S=0,B;s=0;for(M=F.length;s<M;++s)S+=F[s].data.length;if(u){B=new Uint8Array(S);for(s=0;s<M;++s)B.set(F[s].data,R),R+=F[s].data.length}else{B=[];for(s=0;s<M;++s)B[s]=F[s].data;B=Array.prototype.concat.apply([],B)}return B};r("Zlib.Gunzip",$);r("Zlib.Gunzip.prototype.decompress",$.prototype.g);r("Zlib.Gunzip.prototype.getMembers",$.prototype.F);}).call(typeof window !== "undefined" ? window : global);
  (function(e){function n(e){var t=[];for(var n=0;n<e.length;n++){var r=e[n];if(r===0){break}t.push(r)}return String.fromCharCode.apply(null,t)}function r(e){var t=n(e);t=parseInt(t,8);return isNaN(t)?null:t}var t=512;var i=function(e){var n=e instanceof ArrayBuffer||typeof Buffer!=="undefined"&&e instanceof Buffer;var r=e instanceof Int8Array||e instanceof Uint8Array;if(!n&&!r){throw new Error("Must specify a valid ArrayBuffer, Buffer, INT8Array or Int8Array.")}this.INT8=r?e:new Int8Array(e);this.headers={};this.pos=0;var i=0;while(i<2){var s=this.pos;var o=this._readHeader();if(!o.name){i++;continue}this.headers[o.name]=o;this.pos+=Math.ceil(o.size/t)*t}};i.prototype._readHeader=function(){var e={name:n(this.INT8.subarray(this.pos,this.pos+=100)),mode:r(this.INT8.subarray(this.pos,this.pos+=8)),uid:r(this.INT8.subarray(this.pos,this.pos+=8)),gid:r(this.INT8.subarray(this.pos,this.pos+=8)),size:r(this.INT8.subarray(this.pos,this.pos+=12)),mtime:r(this.INT8.subarray(this.pos,this.pos+=12)),chksum:r(this.INT8.subarray(this.pos,this.pos+=8)),typeflag:n(this.INT8.subarray(this.pos,this.pos+=1)),linkname:n(this.INT8.subarray(this.pos,this.pos+=100)),magic:n(this.INT8.subarray(this.pos,this.pos+=6)),version:n(this.INT8.subarray(this.pos,this.pos+=2)),uname:n(this.INT8.subarray(this.pos,this.pos+=32)),gname:n(this.INT8.subarray(this.pos,this.pos+=32)),devmajor:r(this.INT8.subarray(this.pos,this.pos+=8)),devminor:r(this.INT8.subarray(this.pos,this.pos+=8)),prefix:n(this.INT8.subarray(this.pos,this.pos+=155))};this.pos+=12;e.offset=this.pos;return e};i.prototype.getMembers=function(){return this.headers};i.prototype.getContent=function(e){var t=this.headers[e];if(!t){return null}return this.INT8.subarray(t.offset,t.offset+t.size)};e.Tar=i;if(typeof define!=="undefined"&&define.amd){define(function(){return i})}else if(typeof module!=="undefined"&&module.exports){module.exports=i}})(typeof window !== "undefined" ? window : global);
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
___buildEnvironment(ENV);
GLEmulation.init();
GLImmediate.setupFuncs(); Browser.moduleContextCreatedCallbacks.push(function() { GLImmediate.init() });
var GLctx; GL.init()
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

staticSealed = true; // seal the static portion of memory

STACK_MAX = STACK_BASE + 5242880;

DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");

 var ctlz_i8 = allocate([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_DYNAMIC);
 var cttz_i8 = allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0], "i8", ALLOC_DYNAMIC);

var Math_min = Math.min;
function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiif(index,a1,a2,a3,a4,a5,a6) {
  try {
    return Module["dynCall_iiiiiif"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vif(index,a1,a2) {
  try {
    Module["dynCall_vif"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiifi(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_iiiifi"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiiiifiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13) {
  try {
    return Module["dynCall_iiiiiiiiiifiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  try {
    Module["dynCall_viiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viifi(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viifi"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13) {
  try {
    return Module["dynCall_iiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiifi(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_iiifi"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_if(index,a1) {
  try {
    return Module["dynCall_if"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  try {
    return Module["dynCall_iiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vifi(index,a1,a2,a3) {
  try {
    Module["dynCall_vifi"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_fii(index,a1,a2) {
  try {
    return Module["dynCall_fii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12) {
  try {
    return Module["dynCall_iiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iif(index,a1,a2) {
  try {
    return Module["dynCall_iif"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viiiiiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_fiiff(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_fiiff"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_f(index) {
  try {
    return Module["dynCall_f"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_i(index) {
  try {
    return Module["dynCall_i"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_iiiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    return Module["dynCall_iiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiii(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_iiiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viif(index,a1,a2,a3) {
  try {
    Module["dynCall_viif"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.cttz_i8|0;var n=env.ctlz_i8|0;var o=env.___rand_seed|0;var p=env._stdout|0;var q=env._stderr|0;var r=env._in6addr_any|0;var s=+env.NaN;var t=+env.Infinity;var u=0;var v=0;var w=0;var x=0;var y=0,z=0,A=0,B=0,C=0.0,D=0,E=0,F=0,G=0.0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=0;var O=0;var P=0;var Q=0;var R=global.Math.floor;var S=global.Math.abs;var T=global.Math.sqrt;var U=global.Math.pow;var V=global.Math.cos;var W=global.Math.sin;var X=global.Math.tan;var Y=global.Math.acos;var Z=global.Math.asin;var _=global.Math.atan;var $=global.Math.atan2;var aa=global.Math.exp;var ba=global.Math.log;var ca=global.Math.ceil;var da=global.Math.imul;var ea=env.abort;var fa=env.assert;var ga=env.asmPrintInt;var ha=env.asmPrintFloat;var ia=env.min;var ja=env.jsCall;var ka=env.invoke_viiiii;var la=env.invoke_iiiiiif;var ma=env.invoke_vif;var na=env.invoke_iiiifi;var oa=env.invoke_iiiiiiiiiifiii;var pa=env.invoke_vii;var qa=env.invoke_ii;var ra=env.invoke_viiiiiiiiiii;var sa=env.invoke_viifi;var ta=env.invoke_iiiiiiiiiiiiii;var ua=env.invoke_iiifi;var va=env.invoke_if;var wa=env.invoke_iiii;var xa=env.invoke_iiiiiiiiiiii;var ya=env.invoke_vi;var za=env.invoke_vifi;var Aa=env.invoke_fii;var Ba=env.invoke_iiiiiiiiiiiii;var Ca=env.invoke_iif;var Da=env.invoke_viiiiiii;var Ea=env.invoke_fiiff;var Fa=env.invoke_iii;var Ga=env.invoke_f;var Ha=env.invoke_i;var Ia=env.invoke_iiiiii;var Ja=env.invoke_viii;var Ka=env.invoke_v;var La=env.invoke_iiiiiiiii;var Ma=env.invoke_iiiii;var Na=env.invoke_viif;var Oa=env.invoke_viiii;var Pa=env._llvm_lifetime_end;var Qa=env._lseek;var Ra=env._getaddrinfo;var Sa=env.__scanString;var Ta=env._fclose;var Ua=env._glLinkProgram;var Va=env._glHint;var Wa=env._fflush;var Xa=env._strtol;var Ya=env._fputc;var Za=env._glGetString;var _a=env._fwrite;var $a=env._send;var ab=env._mktime;var bb=env.__inet_pton6_raw;var cb=env._dlerror;var db=env._rint;var eb=env._glCompileShader;var fb=env._isspace;var gb=env._localtime;var hb=env._read;var ib=env.__inet_ntop6_raw;var jb=env._sprintf;var kb=env._Sys_ErrorDialog;var lb=env._dlclose;var mb=env._fileno;var nb=env._strstr;var ob=env._ctime;var pb=env._fsync;var qb=env._signal;var rb=env._remove;var sb=env._recvfrom;var tb=env._fmod;var ub=env._sendto;var vb=env._sscanf;var wb=env._glCreateShader;var xb=env._round;var yb=env._llvm_va_end;var zb=env._snprintf;var Ab=env._VM_Compile;var Bb=env._Sys_Mkdir;var Cb=env._glVertexAttribPointer;var Db=env.__getFloat;var Eb=env._freeaddrinfo;var Fb=env._connect;var Gb=env._close;var Hb=env._tcsetattr;var Ib=env._strchr;var Jb=env._tcgetattr;var Kb=env._VM_SuspendCompiled;var Lb=env._clock;var Mb=env.___setErrNo;var Nb=env._emscripten_exit_with_live_runtime;var Ob=env._Sys_PID;var Pb=env._Sys_Cwd;var Qb=env._ftell;var Rb=env._glDeleteProgram;var Sb=env._exit;var Tb=env._select;var Ub=env._asctime;var Vb=env._strrchr;var Wb=env._glAttachShader;var Xb=env._fcntl;var Yb=env._ferror;var Zb=env._copysign;var _b=env._localtime_r;var $b=env._glBindAttribLocation;var ac=env._asctime_r;var bc=env._emscripten_memcpy_big;var cc=env._getnameinfo;var dc=env._recv;var ec=env._dlopen;var fc=env._setsockopt;var gc=env._cos;var hc=env._putchar;var ic=env._socket;var jc=env._glActiveTexture;var kc=env._VM_Destroy;var lc=env._mkport;var mc=env._glDetachShader;var nc=env.__exit;var oc=env._Sys_SetEnv;var pc=env._Sys_FreeFileList;var qc=env._tzset;var rc=env._fabsf;var sc=env._floorf;var tc=env.__inet_pton4_raw;var uc=env._glDisableVertexAttribArray;var vc=env._gethostbyname;var wc=env._toupper;var xc=env._glShaderSource;var yc=env._pread;var zc=env._fopen;var Ac=env._open;var Bc=env._sqrtf;var Cc=env._gethostname;var Dc=env._glDisable;var Ec=env._isalnum;var Fc=env._fputs;var Gc=env._qsort;var Hc=env._Sys_PlatformInit;var Ic=env._Sys_Sleep;var Jc=env._Sys_DefaultHomePath;var Kc=env._Sys_PlatformExit;var Lc=env._glEnableVertexAttribArray;var Mc=env._rmdir;var Nc=env._glBindBuffer;var Oc=env._glIsEnabled;var Pc=env._Sys_PIDIsRunning;var Qc=env._srand;var Rc=env._VM_CallCompiled;var Sc=env._gai_strerror;var Tc=env.__formatString;var Uc=env._getenv;var Vc=env._atoi;var Wc=env._vfprintf;var Xc=env._glGetFloatv;var Yc=env._sbrk;var Zc=env._Sys_FS_Shutdown;var _c=env.___errno_location;var $c=env._strerror;var ad=env._glGetIntegerv;var bd=env._llvm_lifetime_start;var cd=env._llvm_bswap_i32;var dd=env.__parseInt;var ed=env._Sys_RandomBytes;var fd=env._vsnprintf;var gd=env._glUseProgram;var hd=env._htonl;var id=env._sysconf;var jd=env._dlsym;var kd=env._fread;var ld=env._abort;var md=env._fprintf;var nd=env.__read_sockaddr;var od=env.___buildEnvironment;var pd=env.__reallyNegative;var qd=env.__write_sockaddr;var rd=env._strncat;var sd=env._htons;var td=env._glEnable;var ud=env._Sys_ListFiles;var vd=env._fseek;var wd=env._sqrt;var xd=env._write;var yd=env._sin;var zd=env._Sys_GetCurrentUser;var Ad=env._ceilf;var Bd=env._longjmp;var Cd=env._emscripten_set_main_loop;var Dd=env._time;var Ed=env._Sys_Dirname;var Fd=env._if_nametoindex;var Gd=env._strpbrk;var Hd=env._ioctl;var Id=env._unlink;var Jd=env._Sys_Milliseconds;var Kd=env.__inet_ntop4_raw;var Ld=env._pwrite;var Md=env._fabs;var Nd=env._strerror_r;var Od=env._bind;var Pd=env._atan2;var Qd=env._glGetBooleanv;var Rd=env._setvbuf;var Sd=env._llvm_bswap_i16;var Td=env._Sys_FS_Startup;var Ud=env._Sys_FOpen;var Vd=env._Sys_Mkfifo;var Wd=0.0;
// EMSCRIPTEN_START_FUNCS
function Mj(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0;e=i;i=i+8|0;f=1;g=0;j=i;i=i+168|0;c[j>>2]=0;while(1)switch(f|0){case 1:k=e|0;pa(50,59672,(l=i,i=i+24|0,c[l>>2]=59560,c[l+8>>2]=59496,c[l+16>>2]=59408,l)|0);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;i=l;m=cy(2550656,f,j)|0;f=24;break;case 24:if((m|0)==(-2|0)){f=23;break}else if((m|0)==0){f=3;break}else{f=2;break};case 2:pa(22,59328,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;i=l;case 3:Zx(1497840,0,6144)|0;n=Fa(54,k|0,4)|0;if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;if((n|0)==0){f=5;break}else{f=4;break};case 4:ya(40,c[k>>2]|0);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;f=6;break;case 5:n=qa(58,0)|0;if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;ya(40,n|0);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;f=6;break;case 6:Zx(1693648,0,24576)|0;c[423410]=0;c[423408]=0;a[768]=1;o=Fa(50,524288,1)|0;if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;c[143848]=o;if((o|0)==0){f=7;break}else{f=8;break};case 7:Ja(8,0,25304,(l=i,i=i+8|0,h[l>>3]=.5,l)|0);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;i=l;case 8:n=o+32|0;p=n;q=o+8|0;c[o+20>>2]=p;c[o+16>>2]=p;c[o+12>>2]=1;c[o+24>>2]=0;c[q>>2]=0;c[o+28>>2]=p;c[o>>2]=524288;c[o+4>>2]=0;p=q;c[o+40>>2]=p;c[o+44>>2]=p;c[o+36>>2]=0;c[o+48>>2]=1919505;c[n>>2]=524256;Ka(4);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;Ja(6,1722632,b|0,1024);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;c[430626]=1722632;c[429560]=1;r=0;s=1722632;f=9;break;case 9:t=(r|0)==0;if(t){w=s;f=10;break}else{x=s;f=13;break};case 10:switch(a[w]|0){case 43:case 10:case 13:{f=11;break};case 34:{y=w;f=14;break};case 0:{f=18;break};default:{z=r;A=w;f=15;break}}break;case 11:B=c[429560]|0;if((B|0)==32){f=18;break}else{f=12;break};case 12:n=w+1|0;c[1722504+(B<<2)>>2]=n;c[429560]=B+1;a[w]=0;w=n;f=10;break;case 13:n=a[x]|0;if((n<<24>>24|0)==34){y=x;f=14;break}else if((n<<24>>24|0)==10|(n<<24>>24|0)==13){f=16;break}else if((n<<24>>24|0)==0){f=18;break}else{z=r;A=x;f=15;break};case 14:z=t&1;A=y;f=15;break;case 15:r=z;s=A+1|0;f=9;break;case 16:C=c[429560]|0;if((C|0)==32){f=18;break}else{f=17;break};case 17:n=x+1|0;c[1722504+(C<<2)>>2]=n;c[429560]=C+1;a[x]=0;x=n;f=13;break;case 18:Ka(56);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;ya(36,0);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;n=wa(6,24864,24520,33)|0;if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;p=c[n+32>>2]|0;D=(p|0)<24?25165824:p<<20;c[154354]=D;E=Fa(50,D|0,1)|0;if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;c[179598]=E;if((E|0)==0){f=19;break}else{f=20;break};case 19:Ja(8,0,24216,(l=i,i=i+8|0,c[l>>2]=(D|0)/1048576|0,l)|0);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;i=l;case 20:p=E+32|0;n=p;q=E+8|0;c[E+20>>2]=n;c[E+16>>2]=n;c[E+12>>2]=1;c[E+24>>2]=0;c[q>>2]=0;c[E+28>>2]=n;c[E>>2]=D;c[E+4>>2]=0;n=q;c[E+40>>2]=n;c[E+44>>2]=n;c[E+36>>2]=0;c[E+48>>2]=1919505;c[p>>2]=D-32;Ka(26);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;p=wa(6,59296,18544,256)|0;if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;c[430622]=p;Ka(18);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;p=wa(6,58840,18544,64)|0;if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;c[423402]=p;p=wa(6,58528,58440,16)|0;if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;c[430924]=p;p=wa(6,58376,2551544,16)|0;if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;c[429582]=p;if((a[c[(c[430924]|0)+4>>2]|0]|0)==0){f=21;break}else{f=22;break};case 21:ya(38,58528);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;f=22;break;case 22:p=Fa(50,1,8)|0;if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;n=p;c[p+4>>2]=52;q=Fa(50,4,1)|0;if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;c[p>>2]=q;c[469154]=(c[469154]|0)+1;c[q>>2]=d;ya(30,n|0);if((u|0)!=0&(v|0)!=0){g=dy(c[u>>2]|0,j)|0;if((g|0)>0){f=-1;break}else return}u=v=0;f=23;break;case 23:i=e;return;case-1:if((g|0)==1){m=v;f=24}u=v=0;break}}function Nj(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;d=i;i=i+8|0;e=d|0;f=c[b>>2]|0;g=c[f>>2]|0;if((f|0)!=0){Gx(f)}Gx(b);c[469154]=(c[469154]|0)-1;Bj();Pi(55304,50);b=c[430622]|0;do{if((b|0)!=0){if((c[b+32>>2]|0)==0){break}Pi(55160,22);Pi(55128,62);Pi(55080,124)}}while(0);Pi(55032,92);Pi(55016,16);Pi(54696,70);Qi(54696,26);Pi(54488,8);Ij();fj(0);b=jk(56712,54480,16)|0;c[430624]=b;Fk(b,1.0,2.0,1);sj();c[378060]=c[378060]&-2;c[430928]=jk(55328,54480,1)|0;c[429568]=jk(54464,54432,1)|0;c[430922]=jk(54336,54480,1)|0;c[429570]=jk(38208,18544,256)|0;c[423396]=jk(54296,54480,520)|0;c[429594]=jk(54128,18544,512)|0;c[423406]=jk(54080,18544,512)|0;c[423404]=jk(54064,18544,0)|0;c[423398]=jk(53672,18544,512)|0;c[430916]=jk(53472,18544,512)|0;c[469150]=jk(53424,18544,64)|0;c[64860]=jk(53408,18544,64)|0;c[469152]=jk(53336,18544,512)|0;c[64864]=jk(53208,18544,512)|0;c[423400]=jk(53152,18544,64)|0;c[430914]=jk(53048,18544,64)|0;c[430920]=jk(52968,18544,0)|0;c[430926]=jk(52888,18544,1)|0;c[423136]=jk(52600,18544,64)|0;c[429564]=jk(52400,18544,1)|0;c[429562]=jk(52336,18544,64)|0;c[429566]=jk(52312,18544,1)|0;c[430930]=jk(52216,18544,64)|0;c[430918]=jk(52184,18544,1)|0;jk(18520,2551544,1088)|0;c[429580]=jk(52136,18544,1)|0;b=Hn(52024,(f=i,i=i+24|0,c[f>>2]=59560,c[f+8>>2]=59496,c[f+16>>2]=59408,f)|0)|0;i=f;c[423134]=jk(51936,b,68)|0;c[429584]=jk(51920,51640,20)|0;b=Hn(21192,(f=i,i=i+8|0,c[f>>2]=71,f)|0)|0;i=f;h=jk(51368,b,20)|0;c[429556]=h;jk(51304,c[h+4>>2]|0,64)|0;fx();bx()|0;h=e;if((ed(h|0,4)|0)==0){_i(56176,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;a[h]=(Yx()|0)%255|0;a[h+1|0]=(Yx()|0)%255|0;a[h+2|0]=(Yx()|0)%255|0;a[h+3|0]=(Yx()|0)%255|0}pm(c[e>>2]&65535);oo();Gg();c[(c[430624]|0)+20>>2]=0;c[429590]=Gj()|0;if((c[429560]|0)>0){e=0;h=0;while(1){b=1722504+(e<<2)|0;j=c[b>>2]|0;do{if((j|0)==0){k=h}else{if((a[j]|0)==0){k=h;break}if((Cn(j,47736,3)|0)==0){k=h;break}Ai(c[b>>2]|0);Ai(46552);k=1}}while(0);b=e+1|0;if((b|0)<(c[429560]|0)){e=b;h=k}else{break}}if((k|0)==0){l=15}}else{l=15}do{if((l|0)==15){if((c[(c[430624]|0)+32>>2]|0)!=0){break}Ai(51272);k=c[429580]|0;if((c[k+32>>2]|0)!=0){break}nk(c[k>>2]|0,54480);nk(51256,51128)}}while(0);nk(51096,54480);Vw(0);nk(51064,18544);c[429588]=1;do{if((c[(c[430928]|0)+32>>2]|0)!=0){if(a[61288]|0){m=c[659022]|0}else{l=(ex()|0)&128;c[659022]=l;a[61288]=1;m=l}if((m|0)!=0){break}nk(55328,18544)}}while(0);m=jk(51024,2551544,33)|0;c[429558]=m;l=c[m+4>>2]|0;if((a[l]|0)==0){_i(50984,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;n=g+4|0;o=c[n>>2]|0;ae[o&127](g,0);i=d;return}c[164648]=Xk(l)|0;_i(50984,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;n=g+4|0;o=c[n>>2]|0;ae[o&127](g,0);i=d;return}function Oj(){var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;b=c[164648]|0;if((b|0)==0){return}d=c[659012]|0;e=bl(2635024+d|0,1023-d|0,b)|0;if((e|0)>0){f=e}else{return}do{e=c[659012]|0;b=e+f|0;do{if((f|0)>0){d=e;g=0;while(1){h=2635024+d|0;i=a[h]|0;if((i<<24>>24|0)==10|(i<<24>>24|0)==13){j=8}else if((i<<24>>24|0)==0){a[h]=10;j=8}else{k=g;l=d+1|0}if((j|0)==8){j=0;h=d+1|0;k=2635024+h|0;l=h}if((l|0)<(b|0)){d=l;g=k}else{break}}a[2635024+b|0]=0;c[659012]=b;if((k|0)==0){j=12;break}g=a[k]|0;a[k]=0;Bi(2,2635024);a[k]=g;g=(c[659012]|0)+(2635024-k)|0;c[659012]=g;_x(2635024,k|0,g+1|0)|0;m=g}else{a[2635024+b|0]=0;c[659012]=b;j=12}}while(0);do{if((j|0)==12){j=0;if(!(b>>>0>1022>>>0)){m=b;break}Bi(2,2635024);c[659012]=0;m=0}}while(0);f=bl(2635024+m|0,1023-m|0,c[164648]|0)|0;}while((f|0)>0);return}function Pj(){var a=0,b=0,d=0;a=i;if((c[429588]|0)==0){i=a;return}b=c[378060]|0;if((b&1|0)==0){i=a;return}c[378060]=b&-2;b=Vk(57840)|0;if((b|0)==0){_i(58280,(d=i,i=i+8|0,c[d>>2]=57840,d)|0);i=d;i=a;return}else{dl(b,58056,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d;Hw(b);xk(b);Uk(b);i=a;return}}function Qj(){var a=0,b=0,d=0,e=0,f=0,g=0;a=i;i=i+64|0;b=a|0;if((xi()|0)!=2){_i(57736,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d;e=64;f=0;i=a;return}rn(b,yi(1)|0,64);un(b,64,57576);_i(57512,(d=i,i=i+8|0,c[d>>2]=b,d)|0);i=d;g=Vk(b)|0;if((g|0)==0){_i(58280,(d=i,i=i+8|0,c[d>>2]=b,d)|0);i=d;e=64;f=0;i=a;return}else{dl(g,58056,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d;Hw(g);xk(g);Uk(g);e=64;f=0;i=a;return}}function Rj(){var b=0,d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,w=0,x=0,y=0,z=0,A=0,B=0.0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;b=i;d=1;e=0;f=i;i=i+168|0;c[f>>2]=0;while(1)switch(d|0){case 1:h=c[469154]|0;j=cy(2550656,d,f)|0;d=58;break;case 58:if((j|0)==0){d=2;break}else{d=57;break};case 2:Ka(46);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;if((c[(c[423404]|0)+32>>2]|0)==0){k=0;d=4;break}else{d=3;break};case 3:l=Ha(12)|0;if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;k=l;d=4;break;case 4:if((c[(c[423398]|0)+32>>2]|0)==0){d=5;break}else{m=1;d=16;break};case 5:if((c[(c[430624]|0)+32>>2]|0)==0){d=7;break}else{d=6;break};case 6:l=Ha(4)|0;if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;m=l;d=16;break;case 7:if((c[(c[429562]|0)+32>>2]|0)==0){d=10;break}else{d=8;break};case 8:n=c[(c[429566]|0)+32>>2]|0;if((n|0)>0){d=9;break}else{d=10;break};case 9:o=1e3/(n|0)|0;d=15;break;case 10:if((c[(c[423136]|0)+32>>2]|0)==0){d=13;break}else{d=11;break};case 11:p=c[(c[429564]|0)+32>>2]|0;if((p|0)>0){d=12;break}else{d=13;break};case 12:o=1e3/(p|0)|0;d=15;break;case 13:q=c[(c[429568]|0)+32>>2]|0;if((q|0)>0){d=14;break}else{o=1;d=15;break};case 14:o=1e3/(q|0)|0;d=15;break;case 15:l=(c[429590]|0)-o-(c[659014]|0)+(c[659016]|0)|0;r=(l|0)>(o|0)?o:l;c[659016]=r;m=o-r|0;d=16;break;case 16:d=17;break;case 17:if((c[(c[423400]|0)+32>>2]|0)==0){d=19;break}else{d=18;break};case 18:r=Ha(16)|0;if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;l=Ha(12)|0;if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;s=l-(c[429590]|0)|0;l=(s|0)<(m|0)?m-s|0:0;t=(r|0)<(l|0)?r:l;d=20;break;case 19:l=Ha(12)|0;if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;r=l-(c[429590]|0)|0;t=(r|0)<(m|0)?m-r|0:0;d=20;break;case 20:if((c[(c[430918]|0)+32>>2]|0)!=0|(t|0)<1){d=21;break}else{d=22;break};case 21:ya(100,0);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;d=23;break;case 22:ya(100,t-1|0);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;d=23;break;case 23:r=Ha(12)|0;if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;w=c[429590]|0;if((r-w|0)<(m|0)){d=17;break}else{d=24;break};case 24:c[659014]=w;r=Ha(18)|0;if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;c[429590]=r;x=r-(c[659014]|0)|0;Ka(116);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;if((c[469154]|0)==(h|0)){d=25;break}else{d=57;break};case 25:y=c[430928]|0;if((c[y+20>>2]|0)==0){d=33;break}else{d=26;break};case 26:if((c[y+32>>2]|0)==0){d=32;break}else{d=27;break};case 27:if(a[61288]|0){d=29;break}else{d=28;break};case 28:r=Ha(6)|0;if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;l=r&128;c[659022]=l;a[61288]=1;z=l;d=30;break;case 29:z=c[659022]|0;d=30;break;case 30:if((z|0)==0){d=31;break}else{d=32;break};case 31:pa(70,55328,18544);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;d=32;break;case 32:c[(c[430928]|0)+20>>2]=0;d=33;break;case 33:l=c[(c[429594]|0)+32>>2]|0;if((l|0)==0){d=34;break}else{A=l;d=38;break};case 34:B=+g[(c[423396]|0)+28>>2];if(B!=0.0){d=35;break}else{d=36;break};case 35:A=~~(+(x|0)*B);d=38;break;case 36:if((c[(c[430916]|0)+32>>2]|0)==0){A=x;d=38;break}else{d=37;break};case 37:A=~~(+(x|0)*B);d=38;break;case 38:if((A|0)<1){d=39;break}else{C=A;d=41;break};case 39:if(+g[(c[423396]|0)+28>>2]!=0.0){d=40;break}else{C=A;d=41;break};case 40:C=1;d=41;break;case 41:D=(c[(c[423400]|0)+32>>2]|0)!=0;if((c[(c[430624]|0)+32>>2]|0)==0){d=44;break}else{d=42;break};case 42:if(D&(C|0)>500){d=43;break}else{E=5e3;d=45;break};case 43:pa(50,57056,(F=i,i=i+8|0,c[F>>2]=C,F)|0);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;i=F;E=5e3;d=45;break;case 44:E=D?200:5e3;d=45;break;case 45:G=(C|0)>(E|0)?E:C;if((c[(c[423404]|0)+32>>2]|0)==0){H=0;d=47;break}else{d=46;break};case 46:l=Ha(12)|0;if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;H=l;d=47;break;case 47:ya(92,G|0);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;if((c[(c[430624]|0)+20>>2]|0)==0){d=50;break}else{d=48;break};case 48:wa(6,56712,18544,0)|0;if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;c[(c[430624]|0)+20>>2]=0;if((c[(c[430624]|0)+32>>2]|0)==0){d=49;break}else{d=50;break};case 49:ya(66,56536);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;Ka(76);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;d=50;break;case 50:if((c[(c[423404]|0)+32>>2]|0)==0){I=0;d=52;break}else{d=51;break};case 51:l=Ha(12)|0;if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;I=l;d=52;break;case 52:Ka(24);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;if((c[(c[423404]|0)+32>>2]|0)==0){d=54;break}else{d=53;break};case 53:l=I-H|0;r=c[33770]|0;s=c[33772]|0;J=c[33774]|0;pa(50,56416,(F=i,i=i+64|0,c[F>>2]=c[429592],c[F+8>>2]=l,c[F+16>>2]=l-r,c[F+24>>2]=H-k,c[F+32>>2]=-(s+J|0),c[F+40>>2]=r,c[F+48>>2]=s,c[F+56>>2]=J,F)|0);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;i=F;d=54;break;case 54:if((c[(c[423406]|0)+32>>2]|0)==0){d=56;break}else{d=55;break};case 55:J=c[469174]|0;s=c[469172]|0;r=c[469168]|0;pa(50,56312,(F=i,i=i+32|0,c[F>>2]=c[469164],c[F+8>>2]=J,c[F+16>>2]=s,c[F+24>>2]=r,F)|0);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;i=F;c[469164]=0;c[469174]=0;c[469172]=0;c[469168]=0;d=56;break;case 56:Ka(86);if((u|0)!=0&(v|0)!=0){e=dy(c[u>>2]|0,f)|0;if((e|0)>0){d=-1;break}else return}u=v=0;c[429592]=(c[429592]|0)+1;d=57;break;case 57:i=b;return;case-1:if((e|0)==1){j=v;d=58}u=v=0;break}}function Sj(a){a=a|0;Zx(a+12|0,0,256)|0;c[a>>2]=0;c[a+4>>2]=0;return}function Tj(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;c[179594]=0;a[575416]=0;Ll(b,d,e,28,f);if((Vj()|0)!=0){return}Ll(b,d,e,68,f);return}function Uj(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0;d=c[423130]|0;if((Cn(b,d,Wx(d|0)|0)|0)!=0){return}d=c[179594]|0;c[179594]=d+1;if((d|0)==0){rn(575416,b,1024);return}d=a[575416]|0;if(d<<24>>24==0){return}else{e=0;f=575416;g=d}while(1){if(!(e>>>0<(Wx(b|0)|0)>>>0)){break}d=ey(g<<24>>24|0)|0;if((d|0)!=(ey(a[b+e|0]|0)|0)){a[f]=0}d=e+1|0;h=575416+d|0;i=a[h]|0;if(i<<24>>24==0){j=10;break}else{e=d;f=h;g=i}}if((j|0)==10){return}a[f]=0;return}function Vj(){var a=0,b=0,d=0,e=0,f=0;a=i;if((c[179594]|0)==0){b=1;i=a;return b|0}d=c[423132]|0;e=Wx(d+12|0)|0;f=e-(Wx(c[423130]|0)|0)|0;rn(d+12+f|0,575416,256-f|0);f=c[423132]|0;d=f+12|0;c[f>>2]=Wx(d|0)|0;if((c[179594]|0)==1){vn(d,256,55400);f=c[423132]|0;c[f>>2]=(c[f>>2]|0)+1;b=1;i=a;return b|0}else{_i(55344,(f=i,i=i+8|0,c[f>>2]=d,f)|0);i=f;b=0;i=a;return b|0}return 0}function Wj(a){a=a|0;var b=0,d=0;b=i;if((Cn(a,575416,Wx(575416)|0)|0)!=0){i=b;return}_i(55696,(d=i,i=i+8|0,c[d>>2]=a,d)|0);i=d;i=b;return}function Xj(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;f=e;e=d;d=b;a:while(1){g=On(d,56272)|0;Oi(g);b=xi()|0;if((a[g+((Wx(g|0)|0)-1)|0]|0)==32){c[423130]=2551544;h=b+1|0;i=2551544}else{j=yi(b-1|0)|0;c[423130]=j;h=b;i=j}if((h|0)<=1){break}k=yi(0)|0;j=a[g]|0;if((j<<24>>24|0)==59){l=0}else if((j<<24>>24|0)==0){m=12;break}else{j=Wx(g|0)|0;b=1;while(1){if(!(b>>>0<j>>>0)){m=12;break a}if((a[g+b|0]|0)==59){l=b;break}else{b=b+1|0}}}if((g+l|0)==0){m=12;break}f=1;e=1;d=g+(l+1)|0}if((m|0)==12){Ti(k,g,h);return}h=a[i]|0;if((h<<24>>24|0)==92|(h<<24>>24|0)==47){h=i+1|0;c[423130]=h;n=h}else{n=i}c[179594]=0;a[575416]=0;if((a[n]|0)==0){return}n=(e|0)!=0;if(n){Si(28)}e=(f|0)!=0;if(e){ik(28)}if((Vj()|0)!=0){return}if(n){Si(68)}if(!e){return}ik(110);return}function Yj(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;i=i+64|0;d=b|0;if((Cn(a,575416,Wx(575416)|0)|0)!=0){e=64;f=0;i=b;return}In(d,fk(a)|0);_i(56e3,(g=i,i=i+16|0,c[g>>2]=a,c[g+8>>2]=d,g)|0);i=g;e=64;f=0;i=b;return}function Zj(a){a=a|0;c[423132]=a;Xj(a+12|0,1,1);return}function _j(){return fk(56088)|0}function $j(){return fk(56016)|0}function ak(){var a=0;if((xi()|0)>1){aj(1,50456,(a=i,i=i+1|0,i=i+7&-8,c[a>>2]=0,a)|0);i=a}else{aj(0,50392,(a=i,i=i+1|0,i=i+7&-8,c[a>>2]=0,a)|0);i=a}}function bk(){ea(0);return}function ck(){var a=0,b=0,d=0.0,e=0.0;a=i;if((xi()|0)!=2){_i(50704,(b=i,i=i+1|0,i=i+7&-8,c[b>>2]=0,b)|0);i=b;i=a;return}d=+Qx(yi(1)|0);b=Gj()|0;e=d;do{}while(!(+((Gj()|0)-b|0)*.001>e));i=a;return}function dk(b){b=b|0;var d=0,e=0,f=0,h=0,i=0,j=0.0,k=0,l=0;d=a[b]|0;if(d<<24>>24==0){e=0}else{f=0;h=0;i=d;do{f=(da((ey(i<<24>>24|0)|0)<<24>>24,h+119|0)|0)+f|0;h=h+1|0;i=a[b+h|0]|0;}while(!(i<<24>>24==0));e=f&255}f=c[785992+(e<<2)>>2]|0;if((f|0)==0){j=0.0;return+j}else{k=f}while(1){if((tn(b,c[k>>2]|0)|0)==0){break}f=c[k+60>>2]|0;if((f|0)==0){j=0.0;l=8;break}else{k=f}}if((l|0)==8){return+j}j=+g[k+28>>2];return+j}function ek(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;d=a[b]|0;if(d<<24>>24==0){e=0}else{f=0;g=0;h=d;do{f=(da((ey(h<<24>>24|0)|0)<<24>>24,g+119|0)|0)+f|0;g=g+1|0;h=a[b+g|0]|0;}while(!(h<<24>>24==0));e=f&255}f=c[785992+(e<<2)>>2]|0;if((f|0)==0){i=0;return i|0}else{j=f}while(1){if((tn(b,c[j>>2]|0)|0)==0){break}f=c[j+60>>2]|0;if((f|0)==0){i=0;k=8;break}else{j=f}}if((k|0)==8){return i|0}i=c[j+32>>2]|0;return i|0}function fk(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;d=a[b]|0;if(d<<24>>24==0){e=0}else{f=0;g=0;h=d;do{f=(da((ey(h<<24>>24|0)|0)<<24>>24,g+119|0)|0)+f|0;g=g+1|0;h=a[b+g|0]|0;}while(!(h<<24>>24==0));e=f&255}f=c[785992+(e<<2)>>2]|0;if((f|0)==0){i=2551464;return i|0}else{j=f}while(1){if((tn(b,c[j>>2]|0)|0)==0){break}f=c[j+60>>2]|0;if((f|0)==0){i=2551464;k=8;break}else{j=f}}if((k|0)==8){return i|0}i=c[j+4>>2]|0;return i|0}function gk(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;f=a[b]|0;if(f<<24>>24==0){g=0}else{h=0;i=0;j=f;do{h=(da((ey(j<<24>>24|0)|0)<<24>>24,i+119|0)|0)+h|0;i=i+1|0;j=a[b+i|0]|0;}while(!(j<<24>>24==0));g=h&255}h=c[785992+(g<<2)>>2]|0;a:do{if((h|0)!=0){g=h;while(1){if((tn(b,c[g>>2]|0)|0)==0){break}j=c[g+60>>2]|0;if((j|0)==0){break a}else{g=j}}rn(d,c[g+4>>2]|0,e);return}}while(0);a[d]=0;return}function hk(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0;d=a[b]|0;if(d<<24>>24==0){e=0}else{f=0;g=0;h=d;do{f=(da((ey(h<<24>>24|0)|0)<<24>>24,g+119|0)|0)+f|0;g=g+1|0;h=a[b+g|0]|0;}while(!(h<<24>>24==0));e=f&255}f=c[785992+(e<<2)>>2]|0;if((f|0)==0){return-2147483648|0}else{i=f}while(1){if((tn(b,c[i>>2]|0)|0)==0){j=7;break}f=c[i+60>>2]|0;if((f|0)==0){j=8;break}else{i=f}}if((j|0)==7){b=c[i+16>>2]|0;return((c[i+20>>2]|0)==0?b:b|1073741824)|0}else if((j|0)==8){return-2147483648|0}return 0}function ik(a){a=a|0;var b=0,d=0;b=c[378056]|0;if((b|0)==0){return}else{d=b}do{b=c[d>>2]|0;if((b|0)!=0){je[a&127](b)}d=c[d+52>>2]|0;}while((d|0)!=0);return}function jk(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;f=i;if((b|0)==0|(d|0)==0){aj(0,50288,(h=i,i=i+1|0,i=i+7&-8,c[h>>2]=0,h)|0);i=h;return 0}do{if((Ib(b|0,92)|0)==0){if((Ib(b|0,34)|0)!=0){j=6;break}if((Ib(b|0,59)|0)==0){k=b}else{j=6}}else{j=6}}while(0);if((j|0)==6){_i(42520,(h=i,i=i+8|0,c[h>>2]=b,h)|0);i=h;k=37544}b=a[k]|0;if(b<<24>>24==0){l=0}else{m=0;n=0;o=b;do{m=(da((ey(o<<24>>24|0)|0)<<24>>24,n+119|0)|0)+m|0;n=n+1|0;o=a[k+n|0]|0;}while(!(o<<24>>24==0));l=m&255}m=c[785992+(l<<2)>>2]|0;a:do{if((m|0)==0){p=0}else{l=m;while(1){if((tn(k,c[l>>2]|0)|0)==0){break}o=c[l+60>>2]|0;if((o|0)==0){p=0;break a}else{l=o}}o=kk(l,d,0)|0;n=l+16|0;b=c[n>>2]|0;do{if((b&4096|0)==0){if((b&128|0)!=0){q=e;r=b;break}q=(e&4096|0)==0?e:e&-4097;r=b}else{if((e&4096|0)!=0){q=e;r=b;break}s=b&-4097;c[n>>2]=s;q=e;r=s}}while(0);do{if((r&128|0)!=0){c[n>>2]=r&-129;b=l+8|0;mj(c[b>>2]|0);c[b>>2]=qj(o)|0;if((q&64|0)==0){break}b=l+12|0;s=c[b>>2]|0;if((s|0)!=0){mj(s)}c[b>>2]=qj(o)|0}}while(0);b=c[n>>2]|0;s=(q&2048|0)!=0;do{if((b&2048|0)==0){t=s?q&-2049:q;u=b}else{if(s){t=q;u=b;break}v=b&-2049;c[n>>2]=v;t=q;u=v}}while(0);c[n>>2]=u|t;b=l+8|0;s=c[b>>2]|0;do{if((a[s]|0)==0){mj(s);c[b>>2]=qj(o)|0}else{if((a[o]|0)==0){break}if((Tx(s,o)|0)==0){break}$i(32168,(h=i,i=i+24|0,c[h>>2]=k,c[h+8>>2]=s,c[h+16>>2]=o,h)|0);i=h}}while(0);o=l+12|0;s=c[o>>2]|0;if((s|0)!=0){c[o>>2]=0;lk(k,s,1)|0;mj(s)}c[378060]=c[378060]|t;w=l;i=f;return w|0}}while(0);while(1){x=p+1|0;if((c[1512248+(p*72|0)>>2]|0)==0){j=37;break}if((x|0)<2048){p=x}else{break}}do{if((j|0)==37){if((p|0)>2047){break}t=1512248+(p*72|0)|0;if((p|0)>=(c[378058]|0)){c[378058]=x}c[t>>2]=qj(k)|0;u=qj(d)|0;c[1512252+(p*72|0)>>2]=u;c[1512268+(p*72|0)>>2]=1;c[1512272+(p*72|0)>>2]=1;g[1512276+(p*72|0)>>2]=+Qx(u);c[1512280+(p*72|0)>>2]=Vc(u|0)|0;c[1512256+(p*72|0)>>2]=qj(d)|0;c[1512284+(p*72|0)>>2]=0;u=c[378056]|0;c[1512300+(p*72|0)>>2]=u;if((u|0)!=0){c[u+56>>2]=t}c[1512304+(p*72|0)>>2]=0;c[378056]=t;c[1512264+(p*72|0)>>2]=e;c[378060]=c[378060]|e;u=a[k]|0;if(u<<24>>24==0){y=0}else{q=0;r=0;m=u;do{q=(da((ey(m<<24>>24|0)|0)<<24>>24,r+119|0)|0)+q|0;r=r+1|0;m=a[k+r|0]|0;}while(!(m<<24>>24==0));y=q&255}c[1512316+(p*72|0)>>2]=y;m=785992+(y<<2)|0;r=c[m>>2]|0;c[1512308+(p*72|0)>>2]=r;if((r|0)!=0){c[r+64>>2]=t}c[1512312+(p*72|0)>>2]=0;c[m>>2]=t;w=t;i=f;return w|0}}while(0);if((c[430620]|0)==0){aj(0,28008,(h=i,i=i+1|0,i=i+7&-8,c[h>>2]=0,h)|0);i=h;return 0}else{w=0;i=f;return w|0}return 0}function kk(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,j=0,k=0,l=0.0,m=0.0,n=0,o=0,p=0.0,q=0;e=i;if((c[a+36>>2]|0)==0|(b|0)==0){f=b;i=e;return f|0}do{if((An(b)|0)==0){if((d|0)!=0){_i(27120,(j=i,i=i+8|0,c[j>>2]=c[a>>2],j)|0);i=j}k=1;l=+Qx(c[a+8>>2]|0)}else{m=+Qx(b);if((c[a+40>>2]|0)==0){k=0;l=m;break}if((Bn(m)|0)!=0){k=0;l=m;break}if((d|0)!=0){_i(27568,(j=i,i=i+8|0,c[j>>2]=c[a>>2],j)|0);i=j}k=1;l=+(~~m|0)}}while(0);n=a+44|0;do{if(l<+g[n>>2]){do{if((d|0)!=0){if((k|0)==0){_i(25720,(j=i,i=i+8|0,c[j>>2]=c[a>>2],j)|0);i=j}else{_i(26376,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j}o=(Bn(+g[n>>2])|0)==0;m=+g[n>>2];if(o){_i(25248,(j=i,i=i+8|0,h[j>>3]=m,j)|0);i=j;break}else{_i(25464,(j=i,i=i+8|0,c[j>>2]=~~m,j)|0);i=j;break}}}while(0);p=+g[n>>2]}else{o=a+48|0;if(!(l>+g[o>>2])){if((k|0)==0){f=b}else{p=l;break}i=e;return f|0}do{if((d|0)!=0){if((k|0)==0){_i(25720,(j=i,i=i+8|0,c[j>>2]=c[a>>2],j)|0);i=j}else{_i(26376,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j}q=(Bn(+g[o>>2])|0)==0;m=+g[o>>2];if(q){_i(24496,(j=i,i=i+8|0,h[j>>3]=m,j)|0);i=j;break}else{_i(24840,(j=i,i=i+8|0,c[j>>2]=~~m,j)|0);i=j;break}}}while(0);p=+g[o>>2]}}while(0);if((Bn(p)|0)==0){l=p;xn(2625552,256,50224,(j=i,i=i+8|0,h[j>>3]=l,j)|0)|0;i=j;if((d|0)==0){f=2625552;i=e;return f|0}_i(23912,(j=i,i=i+8|0,h[j>>3]=l,j)|0);i=j;f=2625552;i=e;return f|0}else{a=~~p;xn(2625552,256,46416,(j=i,i=i+8|0,c[j>>2]=a,j)|0)|0;i=j;if((d|0)==0){f=2625552;i=e;return f|0}_i(24192,(j=i,i=i+8|0,c[j>>2]=a,j)|0);i=j;f=2625552;i=e;return f|0}return 0}function lk(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;f=i;do{if((b|0)==0){h=5}else{if((Ib(b|0,92)|0)!=0){h=5;break}if((Ib(b|0,34)|0)!=0){h=5;break}if((Ib(b|0,59)|0)==0){j=b}else{h=5}}}while(0);if((h|0)==5){_i(42520,(k=i,i=i+8|0,c[k>>2]=b,k)|0);i=k;j=37544}b=a[j]|0;if(b<<24>>24==0){l=0}else{m=0;n=0;o=b;do{m=(da((ey(o<<24>>24|0)|0)<<24>>24,n+119|0)|0)+m|0;n=n+1|0;o=a[j+n|0]|0;}while(!(o<<24>>24==0));l=m&255}m=c[785992+(l<<2)>>2]|0;a:do{if((m|0)!=0){l=m;while(1){if((tn(j,c[l>>2]|0)|0)==0){break}o=c[l+60>>2]|0;if((o|0)==0){break a}else{l=o}}if((d|0)==0){p=c[l+8>>2]|0}else{p=d}o=kk(l,p,1)|0;n=l+16|0;b=c[n>>2]|0;do{if((b&32|0)==0){h=23}else{q=l+12|0;r=c[q>>2]|0;if((r|0)==0){h=23;break}s=c[l+4>>2]|0;if((Tx(o,s)|0)==0){mj(r);c[q>>2]=0;t=l;i=f;return t|0}else{if((Tx(o,r)|0)==0){t=l}else{u=s;break}i=f;return t|0}}}while(0);do{if((h|0)==23){s=c[l+4>>2]|0;if((Tx(o,s)|0)==0){t=l}else{u=s;break}i=f;return t|0}}while(0);c[378060]=c[378060]|b;do{if((e|0)==0){s=c[n>>2]|0;if((s&64|0)!=0){_i(57768,(k=i,i=i+8|0,c[k>>2]=j,k)|0);i=k;t=l;i=f;return t|0}if((s&16|0)!=0){_i(56096,(k=i,i=i+8|0,c[k>>2]=j,k)|0);i=k;t=l;i=f;return t|0}if((s&32|0)==0){if((s&512|0)==0){v=u;break}if((c[(c[414926]|0)+32>>2]|0)!=0){v=u;break}_i(54224,(k=i,i=i+8|0,c[k>>2]=j,k)|0);i=k;t=l;i=f;return t|0}s=l+12|0;r=c[s>>2]|0;do{if((r|0)==0){if((Tx(o,u)|0)==0){t=l}else{break}i=f;return t|0}else{if((Tx(o,r)|0)==0){t=l;i=f;return t|0}else{mj(r);break}}}while(0);_i(55088,(k=i,i=i+8|0,c[k>>2]=j,k)|0);i=k;c[s>>2]=qj(o)|0;c[l+20>>2]=1;r=l+24|0;c[r>>2]=(c[r>>2]|0)+1;t=l;i=f;return t|0}else{r=l+12|0;q=c[r>>2]|0;if((q|0)==0){v=u;break}mj(q);c[r>>2]=0;v=c[l+4>>2]|0}}while(0);n=l+4|0;if((Tx(o,v)|0)==0){t=l;i=f;return t|0}c[l+20>>2]=1;b=l+24|0;c[b>>2]=(c[b>>2]|0)+1;mj(c[n>>2]|0);b=qj(o)|0;c[n>>2]=b;g[l+28>>2]=+Qx(b);c[l+32>>2]=Vc(b|0)|0;t=l;i=f;return t|0}}while(0);if((d|0)==0){t=0;i=f;return t|0}if((e|0)==0){t=jk(j,d,128)|0;i=f;return t|0}else{t=jk(j,d,0)|0;i=f;return t|0}return 0}function mk(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;d=a+4|0;e=c[d>>2]|0;_i(23952,(f=i,i=i+16|0,c[f>>2]=c[a>>2],c[f+8>>2]=e,f)|0);i=f;do{if((c[a+16>>2]&64|0)==0){e=a+8|0;if((tn(c[d>>2]|0,c[e>>2]|0)|0)==0){_i(20848,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;break}else{_i(18280,(f=i,i=i+8|0,c[f>>2]=c[e>>2],f)|0);i=f;break}}}while(0);_i(16632,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;d=c[a+12>>2]|0;if((d|0)==0){i=b;return}_i(59424,(f=i,i=i+8|0,c[f>>2]=d,f)|0);i=f;i=b;return}function nk(a,b){a=a|0;b=b|0;lk(a,b,1)|0;return}function ok(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;e=i;f=a[b]|0;if(f<<24>>24==0){g=0}else{h=0;j=0;k=f;do{h=(da((ey(k<<24>>24|0)|0)<<24>>24,j+119|0)|0)+h|0;j=j+1|0;k=a[b+j|0]|0;}while(!(k<<24>>24==0));g=h&255}h=c[785992+(g<<2)>>2]|0;if((h|0)==0){l=lk(b,d,1)|0;i=e;return}else{m=h}while(1){if((tn(b,c[m>>2]|0)|0)==0){break}h=c[m+60>>2]|0;if((h|0)==0){n=11;break}else{m=h}}if((n|0)==11){l=lk(b,d,1)|0;i=e;return}n=c[m+16>>2]|0;h=(c[m+20>>2]|0)==0?n:n|1073741824;if((h|0)==-2147483648|(h&8192|0)==0){l=lk(b,d,1)|0;i=e;return}if((d|0)==0){aj(1,52064,(o=i,i=i+8|0,c[o>>2]=b,o)|0);i=o}else{aj(1,53064,(o=i,i=i+16|0,c[o>>2]=b,c[o+8>>2]=d,o)|0);i=o}}function pk(a,b){a=a|0;b=b|0;lk(a,b,0)|0;return}function qk(a,b){a=a|0;b=+b;var d=0,e=0,f=0,g=0,j=0;d=i;i=i+32|0;e=~~b;f=d|0;if(+(e|0)==b){xn(f,32,51088,(g=i,i=i+8|0,c[g>>2]=e,g)|0)|0;i=g;j=lk(a,f,1)|0;i=d;return}else{xn(f,32,50224,(g=i,i=i+8|0,h[g>>3]=b,g)|0)|0;i=g;j=lk(a,f,1)|0;i=d;return}}function rk(a){a=a|0;lk(a,0,1)|0;return}function sk(){var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;b=yi(0)|0;d=a[b]|0;if(d<<24>>24==0){e=0}else{f=0;g=0;h=d;do{f=(da((ey(h<<24>>24|0)|0)<<24>>24,g+119|0)|0)+f|0;g=g+1|0;h=a[b+g|0]|0;}while(!(h<<24>>24==0));e=f&255}f=c[785992+(e<<2)>>2]|0;if((f|0)==0){i=0;return i|0}else{j=f}while(1){k=j|0;if((tn(b,c[k>>2]|0)|0)==0){break}f=c[j+60>>2]|0;if((f|0)==0){i=0;l=10;break}else{j=f}}if((l|0)==10){return i|0}if((xi()|0)==1){mk(j);i=1;return i|0}else{j=c[k>>2]|0;lk(j,Hi()|0,0)|0;i=1;return i|0}return 0}function tk(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0;b=i;if((xi()|0)!=2){_i(49464,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d;i=b;return}e=yi(1)|0;f=a[e]|0;if(f<<24>>24==0){g=0}else{h=0;j=0;k=f;do{h=(da((ey(k<<24>>24|0)|0)<<24>>24,j+119|0)|0)+h|0;j=j+1|0;k=a[e+j|0]|0;}while(!(k<<24>>24==0));g=h&255}h=c[785992+(g<<2)>>2]|0;a:do{if((h|0)!=0){g=h;while(1){if((tn(e,c[g>>2]|0)|0)==0){break}k=c[g+60>>2]|0;if((k|0)==0){break a}else{g=k}}mk(g);i=b;return}}while(0);_i(48744,(d=i,i=i+8|0,c[d>>2]=e,d)|0);i=d;i=b;return}function uk(){var b=0,d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;b=i;d=xi()|0;if((d|0)<2){_i(47560,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;i=b;return}if((d|0)==2){f=yi(1)|0;h=yi(1)|0;j=a[h]|0;if(j<<24>>24==0){k=0}else{l=0;m=0;n=j;do{l=(da((ey(n<<24>>24|0)|0)<<24>>24,m+119|0)|0)+l|0;m=m+1|0;n=a[h+m|0]|0;}while(!(n<<24>>24==0));k=l&255}l=c[785992+(k<<2)>>2]|0;a:do{if((l|0)==0){o=1}else{k=l;while(1){if((tn(h,c[k>>2]|0)|0)==0){break}n=c[k+60>>2]|0;if((n|0)==0){o=1;break a}else{k=n}}o=+g[k+28>>2]==0.0|0}}while(0);h=Hn(46416,(e=i,i=i+8|0,c[e>>2]=o,e)|0)|0;i=e;lk(f,h,0)|0;i=b;return}else if((d|0)==3){_i(45832,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;i=b;return}else{e=yi(1)|0;h=a[e]|0;if(h<<24>>24==0){p=0}else{f=0;o=0;l=h;do{f=(da((ey(l<<24>>24|0)|0)<<24>>24,o+119|0)|0)+f|0;o=o+1|0;l=a[e+o|0]|0;}while(!(l<<24>>24==0));p=f&255}f=c[785992+(p<<2)>>2]|0;b:do{if((f|0)==0){q=2551464}else{p=f;while(1){if((tn(e,c[p>>2]|0)|0)==0){break}l=c[p+60>>2]|0;if((l|0)==0){q=2551464;break b}else{p=l}}q=c[p+4>>2]|0}}while(0);e=2;while(1){r=e+1|0;if((r|0)>=(d|0)){s=24;break}if((Tx(q,yi(e)|0)|0)==0){s=23;break}else{e=r}}if((s|0)==23){e=yi(1)|0;lk(e,yi(r)|0,0)|0;i=b;return}else if((s|0)==24){s=yi(1)|0;lk(s,yi(2)|0,0)|0;i=b;return}}}function vk(){var b=0,d=0,e=0,f=0,g=0;b=i;d=xi()|0;e=yi(0)|0;if((d|0)<2){_i(45056,(f=i,i=i+8|0,c[f>>2]=e,f)|0);i=f;i=b;return}if((d|0)==2){tk();i=b;return}d=yi(1)|0;f=lk(d,Ji(2)|0,0)|0;if((f|0)==0){i=b;return}d=a[e+3|0]|0;if((d|0)==97){e=f+16|0;g=c[e>>2]|0;if((g&1|0)!=0){i=b;return}c[e>>2]=g|1;c[378060]=c[378060]|1;i=b;return}else if((d|0)==117){g=f+16|0;e=c[g>>2]|0;if((e&2|0)!=0){i=b;return}c[g>>2]=e|2;c[378060]=c[378060]|2;i=b;return}else if((d|0)==115){d=f+16|0;f=c[d>>2]|0;if((f&4|0)!=0){i=b;return}c[d>>2]=f|4;c[378060]=c[378060]|4;i=b;return}else{i=b;return}}function wk(){var a=0,b=0;a=i;if((xi()|0)==2){lk(yi(1)|0,0,0)|0;i=a;return}else{_i(44304,(b=i,i=i+1|0,i=i+7&-8,c[b>>2]=0,b)|0);i=b;i=a;return}}function xk(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;b=i;i=i+1024|0;d=b|0;e=c[378056]|0;if((e|0)==0){f=1024;g=0;i=b;return}else{h=e}do{e=h|0;j=c[e>>2]|0;a:do{if((j|0)!=0){if((tn(j,43672)|0)==0){break}if((c[h+16>>2]&1|0)==0){break}k=c[h+12>>2]|0;l=c[e>>2]|0;m=Wx(l|0)|0;do{if((k|0)==0){n=c[h+4>>2]|0;if((m+10+(Wx(n|0)|0)|0)>>>0>1024>>>0){_i(42984,(o=i,i=i+8|0,c[o>>2]=l,o)|0);i=o;break a}else{xn(d,1024,42416,(o=i,i=i+16|0,c[o>>2]=l,c[o+8>>2]=n,o)|0)|0;i=o;break}}else{if((m+10+(Wx(k|0)|0)|0)>>>0>1024>>>0){_i(42984,(o=i,i=i+8|0,c[o>>2]=l,o)|0);i=o;break a}else{xn(d,1024,42416,(o=i,i=i+16|0,c[o>>2]=l,c[o+8>>2]=k,o)|0)|0;i=o;break}}}while(0);cl(d,Wx(d|0)|0,a)|0}}while(0);h=c[h+52>>2]|0;}while((h|0)!=0);f=1024;g=0;i=b;return}function yk(){var a=0,b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;a=i;if((xi()|0)>1){b=yi(1)|0}else{b=0}d=c[378056]|0;if((d|0)==0){e=0;_i(36680,(f=i,i=i+8|0,c[f>>2]=e,f)|0);i=f;g=c[378058]|0;_i(35984,(f=i,i=i+8|0,c[f>>2]=g,f)|0);i=f;i=a;return}h=(b|0)==0;j=0;k=d;while(1){d=k|0;l=c[d>>2]|0;do{if((l|0)!=0){if(!h){if((ij(b,l,0)|0)==0){break}}m=k+16|0;if((c[m>>2]&4|0)==0){_i(41472,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}else{_i(41944,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}if((c[m>>2]&8|0)==0){_i(41472,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}else{_i(40808,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}if((c[m>>2]&2|0)==0){_i(41472,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}else{_i(40008,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}if((c[m>>2]&64|0)==0){_i(41472,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}else{_i(39592,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}if((c[m>>2]&16|0)==0){_i(41472,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}else{_i(39192,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}if((c[m>>2]&1|0)==0){_i(41472,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}else{_i(38656,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}if((c[m>>2]&32|0)==0){_i(41472,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}else{_i(38216,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}if((c[m>>2]&512|0)==0){_i(41472,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}else{_i(37872,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}if((c[m>>2]&128|0)==0){_i(41472,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}else{_i(37528,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f}m=c[k+4>>2]|0;_i(37144,(f=i,i=i+16|0,c[f>>2]=c[d>>2],c[f+8>>2]=m,f)|0);i=f}}while(0);d=j+1|0;l=c[k+52>>2]|0;if((l|0)==0){e=d;break}else{j=d;k=l}}_i(36680,(f=i,i=i+8|0,c[f>>2]=e,f)|0);i=f;g=c[378058]|0;_i(35984,(f=i,i=i+8|0,c[f>>2]=g,f)|0);i=f;i=a;return}function zk(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=a+52|0;d=c[b>>2]|0;e=c[a>>2]|0;if((e|0)!=0){mj(e)}e=c[a+4>>2]|0;if((e|0)!=0){mj(e)}e=c[a+12>>2]|0;if((e|0)!=0){mj(e)}e=c[a+8>>2]|0;if((e|0)!=0){mj(e)}e=a+56|0;f=c[e>>2]|0;g=c[b>>2]|0;if((f|0)==0){c[378056]=g}else{c[f+52>>2]=g}g=c[b>>2]|0;if((g|0)!=0){c[g+56>>2]=c[e>>2]}e=a+64|0;g=c[e>>2]|0;b=a+60|0;f=c[b>>2]|0;if((g|0)==0){c[785992+(c[a+68>>2]<<2)>>2]=f}else{c[g+60>>2]=f}f=c[b>>2]|0;if((f|0)==0){h=a;Zx(h|0,0,72)|0;return d|0}c[f+64>>2]=c[e>>2];h=a;Zx(h|0,0,72)|0;return d|0}function Ak(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;b=i;if((xi()|0)!=2){d=yi(0)|0;_i(35176,(e=i,i=i+8|0,c[e>>2]=d,e)|0);i=e;i=b;return}d=yi(1)|0;f=a[d]|0;if(f<<24>>24==0){g=0}else{h=0;j=0;k=f;do{h=(da((ey(k<<24>>24|0)|0)<<24>>24,j+119|0)|0)+h|0;j=j+1|0;k=a[d+j|0]|0;}while(!(k<<24>>24==0));g=h&255}h=c[785992+(g<<2)>>2]|0;if((h|0)==0){i=b;return}else{l=h}while(1){m=l|0;if((tn(d,c[m>>2]|0)|0)==0){break}h=c[l+60>>2]|0;if((h|0)==0){n=12;break}else{l=h}}if((n|0)==12){i=b;return}if((c[l+16>>2]&128|0)==0){n=yi(0)|0;d=c[m>>2]|0;_i(34744,(e=i,i=i+16|0,c[e>>2]=n,c[e+8>>2]=d,e)|0);i=e;i=b;return}else{zk(l)|0;i=b;return}}function Bk(a){a=a|0;var b=0,d=0,e=0,f=0;b=c[378056]|0;if((b|0)==0){return}if((a|0)==0){a=b;while(1){d=c[a+16>>2]|0;if((d&128|0)==0){if((d&1104|0)==0){lk(c[a>>2]|0,c[a+8>>2]|0,0)|0}e=c[a+52>>2]|0}else{e=zk(a)|0}if((e|0)==0){break}else{a=e}}return}else{e=b;while(1){b=c[e+16>>2]|0;if((b&4224|0)==0){if((b&1104|0)==0){lk(c[e>>2]|0,c[e+8>>2]|0,0)|0}f=c[e+52>>2]|0}else{f=zk(e)|0}if((f|0)==0){break}else{e=f}}return}}function Ck(){var a=0,b=0,d=0;a=c[378056]|0;if((a|0)==0){return}else{b=a}while(1){a=c[b+16>>2]|0;if((a&128|0)==0){if((a&1104|0)==0){lk(c[b>>2]|0,c[b+8>>2]|0,0)|0}d=c[b+52>>2]|0}else{d=zk(b)|0}if((d|0)==0){break}else{b=d}}return}function Dk(b){b=b|0;var d=0,e=0;a[2625808]=0;d=c[378056]|0;if((d|0)==0){return 2625808}else{e=d}do{d=c[e>>2]|0;do{if((d|0)!=0){if((c[e+16>>2]&b|0)==0){break}Mn(2625808,d,c[e+4>>2]|0)}}while(0);e=c[e+52>>2]|0;}while((e|0)!=0);return 2625808}function Ek(b){b=b|0;var d=0,e=0;a[2626832]=0;d=c[378056]|0;if((d|0)==0){return 2626832}else{e=d}do{d=c[e>>2]|0;do{if((d|0)!=0){if((c[e+16>>2]&b|0)==0){break}Nn(2626832,d,c[e+4>>2]|0)}}while(0);e=c[e+52>>2]|0;}while((e|0)!=0);return 2626832}function Fk(a,b,d,e){a=a|0;b=+b;d=+d;e=e|0;c[a+36>>2]=1;g[a+44>>2]=b;g[a+48>>2]=d;c[a+40>>2]=e;lk(c[a>>2]|0,c[a+4>>2]|0,1)|0;return}function Gk(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=i;if((e&65|0)==65){$i(34312,(g=i,i=i+8|0,c[g>>2]=b,g)|0);i=g;h=e&-65}else{h=e}e=jk(b,d,h|4096)|0;if((a|0)==0){i=f;return}c[a>>2]=(e-1512248|0)/72|0;c[a+4>>2]=-1;Hk(a);i=f;return}function Hk(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0;b=i;d=c[a>>2]|0;if(!(d>>>0<(c[378058]|0)>>>0)){aj(1,33760,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e}f=c[1512272+(d*72|0)>>2]|0;h=a+4|0;if((f|0)==(c[h>>2]|0)){i=b;return}j=c[1512252+(d*72|0)>>2]|0;if((j|0)==0){i=b;return}c[h>>2]=f;f=Wx(j|0)|0;if((f+1|0)>>>0>256>>>0){aj(1,33168,(e=i,i=i+16|0,c[e>>2]=j,c[e+8>>2]=f,e)|0);i=e}rn(a+16|0,j,256);g[a+8>>2]=+g[1512276+(d*72|0)>>2];c[a+12>>2]=c[1512280+(d*72|0)>>2];i=b;return}function Ik(a,b){a=a|0;b=b|0;if((b|0)!=2){return}b=Pn(a,1,41472)|0;if(!(b>>>0>a>>>0)){return}Xj(b,0,1);return}function Jk(){Zx(1512248|0,0|0,147456|0)|0;Zx(785992|0,0|0,1024|0)|0;c[414926]=jk(32696,32144,72)|0;Pi(31744,128);Pi(31408,60);Qi(31408,12);Pi(30672,36);Qi(30672,12);Pi(30072,36);Qi(30072,12);Pi(29768,36);Qi(29768,12);Pi(29448,36);Qi(29448,12);Pi(29016,64);Qi(29016,12);Pi(28728,20);Qi(28728,12);Pi(28360,98);Pi(27960,58);return}function Kk(){return(c[209560]|0)!=0|0}function Lk(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;d=i;i=i+8192|0;e=d+4096|0;xn(e,4096,16720,(f=i,i=i+16|0,c[f>>2]=b+12288,c[f+8>>2]=b+8192,f)|0)|0;i=f;b=d|0;g=0;a:while(1){xn(b,4096,19016,(f=i,i=i+16|0,c[f>>2]=49536,c[f+8>>2]=g,f)|0)|0;i=f;h=b;j=e;while(1){k=a[j]|0;l=k<<24>>24;m=a[h]|0;n=m<<24>>24;o=(k-97&255)>>>0<26>>>0?l-32|0:l;l=(m-97&255)>>>0<26>>>0?n-32|0:n;if((o|0)==92|(o|0)==58){p=47}else{p=o}if((l|0)==92|(l|0)==58){q=47}else{q=l}if((p|0)!=(q|0)){break}if((p|0)==0){r=10;break a}else{h=h+1|0;j=j+1|0}}j=g+1|0;if((j|0)<9){g=j}else{break}}do{if((r|0)==10){if((g|0)<9){s=1}else{break}t=4096;u=0;i=d;return s|0}}while(0);vn(e,4096,41952);s=(nb($j()|0,e|0)|0)!=0|0;t=4096;u=0;i=d;return s|0}function Mk(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;f=i;i=i+4096|0;g=f|0;h=0;a:while(1){xn(g,4096,19016,(j=i,i=i+16|0,c[j>>2]=d,c[j+8>>2]=h,j)|0)|0;i=j;j=g;k=b;while(1){l=a[k]|0;m=l<<24>>24;n=a[j]|0;o=n<<24>>24;p=(l-97&255)>>>0<26>>>0?m-32|0:m;m=(n-97&255)>>>0<26>>>0?o-32|0:o;if((p|0)==92|(p|0)==58){q=47}else{q=p}if((m|0)==92|(m|0)==58){r=47}else{r=m}if((q|0)!=(r|0)){break}if((q|0)==0){s=h;t=10;break a}else{j=j+1|0;k=k+1|0}}k=h+1|0;if((k|0)<9){h=k}else{s=k;t=10;break}}if((t|0)==10){i=f;return(s|0)<(e|0)|0}return 0}function Nk(){return c[209570]|0}function Ok(a){a=a|0;var b=0,d=0,e=0;b=i;if((a-1|0)>>>0>62>>>0){aj(1,56984,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d}if((c[787064+(a*288|0)>>2]|0)==1){aj(1,56664,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d}e=c[787040+(a*288|0)>>2]|0;if((e|0)==0){aj(1,56504,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d}else{Rd(e|0,0,2,0)|0;i=b;return}}function Pk(a){a=a|0;var b=0,d=0,e=0;b=i;if((a-1|0)>>>0>62>>>0){aj(1,56984,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d;return 0}if((c[787064+(a*288|0)>>2]|0)==1){aj(1,56664,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d;return 0}e=c[787040+(a*288|0)>>2]|0;if((e|0)==0){aj(1,56504,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d;return 0}else{d=Qb(e|0)|0;vd(e|0,0,2)|0;a=Qb(e|0)|0;vd(e|0,d|0,0)|0;i=b;return a|0}return 0}function Qk(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;d=i;i=i+4096|0;e=d|0;do{if((nb(b|0,27608)|0)==0){if((nb(b|0,23704)|0)!=0){break}rn(e,b,4096);f=0;g=e;a:while(1){h=a[g]|0;do{if((h<<24>>24|0)==47|(h<<24>>24|0)==92){if((f|0)==0){a[g]=47;j=1;break}else{_x(g|0,g+1|0,Wx(g|0)|0)|0;j=f;break}}else if((h<<24>>24|0)==0){break a}else{j=0}}while(0);f=j;g=g+1|0}g=Ib(e|0,47)|0;while(1){f=g+1|0;h=a[f]|0;if((h<<24>>24|0)==0){k=0;l=15;break}else if((h<<24>>24|0)!=47){g=f;continue}a[f]=0;if((Bb(e|0)|0)==0){l=13;break}a[f]=47;g=f}if((l|0)==13){aj(0,18120,(m=i,i=i+8|0,c[m>>2]=e,m)|0);i=m;return 0}else if((l|0)==15){n=4096;o=0;i=d;return k|0}}}while(0);_i(20568,(m=i,i=i+8|0,c[m>>2]=b,m)|0);i=m;k=1;n=4096;o=0;i=d;return k|0}function Rk(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;d=i;i=i+4096|0;e=d|0;do{if((sn(b,57728)|0)==0){if((sn(b,57568)|0)!=0){break}if((sn(b,41952)|0)!=0){break}f=c[(c[209574]|0)+4>>2]|0;g=e|0;c[654338]=c[654338]^1;xn(g,4096,37168,(h=i,i=i+16|0,c[h>>2]=838312,c[h+8>>2]=b,h)|0)|0;i=h;j=0;k=g;a:while(1){l=a[k]|0;do{if((l<<24>>24|0)==47|(l<<24>>24|0)==92){if((j|0)==0){a[k]=47;m=1;break}else{_x(k|0,k+1|0,Wx(k|0)|0)|0;m=j;break}}else if((l<<24>>24|0)==0){break a}else{m=0}}while(0);j=m;k=k+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(h=i,i=i+16|0,c[h>>2]=f,c[h+8>>2]=g,h)|0)|0;i=h;rb(2617360+(c[654338]<<12)|0)|0;i=d;return}}while(0);d=pn(b)|0;aj(0,57448,(h=i,i=i+24|0,c[h>>2]=61136,c[h+8>>2]=b,c[h+16>>2]=d,h)|0);i=h}function Sk(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;d=i;i=i+4096|0;if((c[209560]|0)==0){aj(0,57592,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;return 0}f=c[(c[209574]|0)+4>>2]|0;g=d|0;c[654338]=c[654338]^1;if((b|0)==0){h=5}else{if((a[b]|0)==0){h=5}else{j=b}}if((h|0)==5){j=838312}xn(g,4096,37168,(e=i,i=i+16|0,c[e>>2]=j,c[e+8>>2]=2551536,e)|0)|0;i=e;j=0;k=g;a:while(1){l=a[k]|0;do{if((l<<24>>24|0)==47|(l<<24>>24|0)==92){if((j|0)==0){a[k]=47;m=1;break}else{_x(k|0,k+1|0,Wx(k|0)|0)|0;m=j;break}}else if((l<<24>>24|0)==0){break a}else{m=0}}while(0);j=m;k=k+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(e=i,i=i+16|0,c[e>>2]=f,c[e+8>>2]=g,e)|0)|0;i=e;g=c[654338]|0;f=2617360+(g<<12)|0;a[(Wx(f|0)|0)-1+(2617360+(g<<12))|0]=0;g=1;while(1){n=787040+(g*288|0)|0;k=g+1|0;if((c[n>>2]|0)==0){break}if((k|0)<64){g=k}else{h=15;break}}if((h|0)==15){aj(1,57808,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;return 0}c[787064+(g*288|0)>>2]=0;if((c[(c[210602]|0)+32>>2]|0)!=0){_i(56056,(e=i,i=i+8|0,c[e>>2]=f,e)|0);i=e}if((sn(f,57728)|0)!=0){o=pn(f)|0;aj(0,57448,(e=i,i=i+24|0,c[e>>2]=61112,c[e+8>>2]=f,c[e+16>>2]=o,e)|0);i=e;return 0}if((sn(f,57568)|0)!=0){o=pn(f)|0;aj(0,57448,(e=i,i=i+24|0,c[e>>2]=61112,c[e+8>>2]=f,c[e+16>>2]=o,e)|0);i=e;return 0}if((sn(f,41952)|0)!=0){o=pn(f)|0;aj(0,57448,(e=i,i=i+24|0,c[e>>2]=61112,c[e+8>>2]=f,c[e+16>>2]=o,e)|0);i=e;return 0}if((Qk(f)|0)!=0){p=0;i=d;return p|0}$i(55064,(e=i,i=i+8|0,c[e>>2]=f,e)|0);i=e;c[n>>2]=Ud(f|0,54120)|0;rn(787072+(g*288|0)|0,b,256);c[787048+(g*288|0)>>2]=0;p=(c[n>>2]|0)==0?0:g;i=d;return p|0}function Tk(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;e=i;i=i+4096|0;f=e|0;if((c[209560]|0)==0){aj(0,57592,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;return 0}else{h=1}while(1){j=787040+(h*288|0)|0;k=h+1|0;if((c[j>>2]|0)==0){break}if((k|0)<64){h=k}else{l=5;break}}if((l|0)==5){aj(1,57808,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;return 0}c[787064+(h*288|0)>>2]=0;rn(787072+(h*288|0)|0,b,256);Yw();k=c[(c[209574]|0)+4>>2]|0;m=f|0;c[654338]=c[654338]^1;f=(b|0)==0;if(f){l=8}else{if((a[b]|0)==0){l=8}else{n=b}}if((l|0)==8){n=838312}xn(m,4096,37168,(g=i,i=i+16|0,c[g>>2]=n,c[g+8>>2]=2551536,g)|0)|0;i=g;n=0;o=m;a:while(1){p=a[o]|0;do{if((p<<24>>24|0)==47|(p<<24>>24|0)==92){if((n|0)==0){a[o]=47;q=1;break}else{_x(o|0,o+1|0,Wx(o|0)|0)|0;q=n;break}}else if((p<<24>>24|0)==0){break a}else{q=0}}while(0);n=q;o=o+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(g=i,i=i+16|0,c[g>>2]=k,c[g+8>>2]=m,g)|0)|0;i=g;k=c[654338]|0;o=2617360+(k<<12)|0;a[(Wx(o|0)|0)-1+(2617360+(k<<12))|0]=0;if((c[(c[210602]|0)+32>>2]|0)!=0){_i(53e3,(g=i,i=i+8|0,c[g>>2]=o,g)|0);i=g}k=Ud(o|0,16456)|0;c[j>>2]=k;o=787048+(h*288|0)|0;c[o>>2]=0;if((k|0)==0){if((tn(c[(c[209574]|0)+4>>2]|0,c[(c[210610]|0)+4>>2]|0)|0)==0){r=c[j>>2]|0}else{k=c[(c[210610]|0)+4>>2]|0;c[654338]=c[654338]^1;if(f){l=22}else{if((a[b]|0)==0){l=22}else{s=b}}if((l|0)==22){s=838312}xn(m,4096,37168,(g=i,i=i+16|0,c[g>>2]=s,c[g+8>>2]=2551536,g)|0)|0;i=g;s=0;l=m;b:while(1){b=a[l]|0;do{if((b<<24>>24|0)==0){break b}else if((b<<24>>24|0)==47|(b<<24>>24|0)==92){if((s|0)==0){a[l]=47;t=1;break}else{_x(l|0,l+1|0,Wx(l|0)|0)|0;t=s;break}}else{t=0}}while(0);s=t;l=l+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(g=i,i=i+16|0,c[g>>2]=k,c[g+8>>2]=m,g)|0)|0;i=g;m=c[654338]|0;k=2617360+(m<<12)|0;a[(Wx(k|0)|0)-1+(2617360+(m<<12))|0]=0;if((c[(c[210602]|0)+32>>2]|0)!=0){_i(51960,(g=i,i=i+8|0,c[g>>2]=k,g)|0);i=g}g=Ud(k|0,16456)|0;c[j>>2]=g;c[o>>2]=0;r=g}u=(r|0)==0?0:h}else{u=h}c[d>>2]=u;if((u|0)==0){v=-1;i=e;return v|0}v=Pk(u)|0;i=e;return v|0}function Uk(a){a=a|0;var b=0,d=0,e=0;b=i;if((c[209560]|0)==0){aj(0,57592,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d}d=787040+(a*288|0)|0;if((c[787064+(a*288|0)>>2]|0)==1){e=d;Vn(c[e>>2]|0)|0;if((c[787044+(a*288|0)>>2]|0)!=0){Un(c[e>>2]|0)|0}Zx(d|0,0,288)|0;i=b;return}else{e=c[d>>2]|0;if((e|0)!=0){Ta(e|0)|0}Zx(d|0,0,288)|0;i=b;return}}function Vk(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;d=i;i=i+4096|0;e=d|0;if((c[209560]|0)==0){aj(0,57592,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}else{g=1}while(1){h=787040+(g*288|0)|0;j=g+1|0;if((c[h>>2]|0)==0){break}if((j|0)<64){g=j}else{k=5;break}}if((k|0)==5){aj(1,57808,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}c[787064+(g*288|0)>>2]=0;k=c[(c[209574]|0)+4>>2]|0;j=e|0;c[654338]=c[654338]^1;xn(j,4096,37168,(f=i,i=i+16|0,c[f>>2]=838312,c[f+8>>2]=b,f)|0)|0;i=f;e=0;l=j;a:while(1){m=a[l]|0;do{if((m<<24>>24|0)==0){break a}else if((m<<24>>24|0)==47|(m<<24>>24|0)==92){if((e|0)==0){a[l]=47;n=1;break}else{_x(l|0,l+1|0,Wx(l|0)|0)|0;n=e;break}}else{n=0}}while(0);e=n;l=l+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(f=i,i=i+16|0,c[f>>2]=k,c[f+8>>2]=j,f)|0)|0;i=f;j=2617360+(c[654338]<<12)|0;if((c[(c[210602]|0)+32>>2]|0)!=0){_i(49440,(f=i,i=i+8|0,c[f>>2]=j,f)|0);i=f}do{if((sn(j,57728)|0)==0){if((sn(j,57568)|0)!=0){break}if((sn(j,41952)|0)!=0){break}if((Qk(j)|0)!=0){o=0;i=d;return o|0}c[h>>2]=Ud(j|0,54120)|0;rn(787072+(g*288|0)|0,b,256);c[787048+(g*288|0)>>2]=0;o=(c[h>>2]|0)==0?0:g;i=d;return o|0}}while(0);o=pn(j)|0;aj(0,57448,(f=i,i=i+24|0,c[f>>2]=61152,c[f+8>>2]=j,c[f+16>>2]=o,f)|0);i=f;return 0}function Wk(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=i;i=i+4096|0;e=d|0;if((c[209560]|0)==0){aj(0,57592,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}else{g=1}while(1){h=787040+(g*288|0)|0;j=g+1|0;if((c[h>>2]|0)==0){break}if((j|0)<64){g=j}else{k=5;break}}if((k|0)==5){aj(1,57808,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}c[787064+(g*288|0)>>2]=0;rn(787072+(g*288|0)|0,b,256);Yw();k=c[(c[209574]|0)+4>>2]|0;j=e|0;c[654338]=c[654338]^1;xn(j,4096,37168,(f=i,i=i+16|0,c[f>>2]=838312,c[f+8>>2]=b,f)|0)|0;i=f;b=0;e=j;a:while(1){l=a[e]|0;do{if((l<<24>>24|0)==0){break a}else if((l<<24>>24|0)==47|(l<<24>>24|0)==92){if((b|0)==0){a[e]=47;m=1;break}else{_x(e|0,e+1|0,Wx(e|0)|0)|0;m=b;break}}else{m=0}}while(0);b=m;e=e+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(f=i,i=i+16|0,c[f>>2]=k,c[f+8>>2]=j,f)|0)|0;i=f;j=2617360+(c[654338]<<12)|0;if((c[(c[210602]|0)+32>>2]|0)!=0){_i(48720,(f=i,i=i+8|0,c[f>>2]=j,f)|0);i=f}do{if((sn(j,57728)|0)==0){if((sn(j,57568)|0)!=0){break}if((sn(j,41952)|0)!=0){break}if((Qk(j)|0)!=0){n=0;i=d;return n|0}k=Ud(j|0,48672)|0;c[h>>2]=k;c[787048+(g*288|0)>>2]=0;n=(k|0)==0?0:g;i=d;return n|0}}while(0);n=pn(j)|0;aj(0,57448,(f=i,i=i+24|0,c[f>>2]=61176,c[f+8>>2]=j,c[f+16>>2]=n,f)|0);i=f;return 0}function Xk(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;d=i;i=i+4096|0;e=d|0;if((c[209560]|0)==0){aj(0,57592,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}else{g=1}while(1){h=787040+(g*288|0)|0;j=g+1|0;if((c[h>>2]|0)==0){break}if((j|0)<64){g=j}else{k=5;break}}if((k|0)==5){aj(1,57808,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}c[787064+(g*288|0)>>2]=0;rn(787072+(g*288|0)|0,b,256);Yw();k=c[(c[209574]|0)+4>>2]|0;j=e|0;c[654338]=c[654338]^1;xn(j,4096,37168,(f=i,i=i+16|0,c[f>>2]=838312,c[f+8>>2]=b,f)|0)|0;i=f;b=0;e=j;a:while(1){l=a[e]|0;do{if((l<<24>>24|0)==0){break a}else if((l<<24>>24|0)==47|(l<<24>>24|0)==92){if((b|0)==0){a[e]=47;m=1;break}else{_x(e|0,e+1|0,Wx(e|0)|0)|0;m=b;break}}else{m=0}}while(0);b=m;e=e+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(f=i,i=i+16|0,c[f>>2]=k,c[f+8>>2]=j,f)|0)|0;i=f;j=2617360+(c[654338]<<12)|0;if((c[(c[210602]|0)+32>>2]|0)!=0){_i(47392,(f=i,i=i+8|0,c[f>>2]=j,f)|0);i=f}if((sn(j,57728)|0)!=0){n=pn(j)|0;aj(0,57448,(f=i,i=i+24|0,c[f>>2]=61200,c[f+8>>2]=j,c[f+16>>2]=n,f)|0);i=f;return 0}if((sn(j,57568)|0)!=0){n=pn(j)|0;aj(0,57448,(f=i,i=i+24|0,c[f>>2]=61200,c[f+8>>2]=j,c[f+16>>2]=n,f)|0);i=f;return 0}if((sn(j,41952)|0)!=0){n=pn(j)|0;aj(0,57448,(f=i,i=i+24|0,c[f>>2]=61200,c[f+8>>2]=j,c[f+16>>2]=n,f)|0);i=f;return 0}n=Vd(j|0)|0;if((n|0)==0){_i(46312,(f=i,i=i+8|0,c[f>>2]=j,f)|0);i=f;o=0;i=d;return o|0}else{c[h>>2]=n;c[787048+(g*288|0)>>2]=0;o=g;i=d;return o|0}return 0}function Yk(b,c){b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;d=c;c=b;while(1){b=a[c]|0;e=b<<24>>24;f=a[d]|0;g=f<<24>>24;h=(b-97&255)>>>0<26>>>0?e-32|0:e;e=(f-97&255)>>>0<26>>>0?g-32|0:g;if((h|0)==92|(h|0)==58){i=47}else{i=h}if((e|0)==92|(e|0)==58){j=47}else{j=e}if((i|0)!=(j|0)){k=1;l=8;break}if((i|0)==0){k=0;l=8;break}else{d=d+1|0;c=c+1|0}}if((l|0)==8){return k|0}return 0}function Zk(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0;h=i;i=i+4096|0;j=h|0;if((b|0)==0){aj(0,44872,(k=i,i=i+1|0,i=i+7&-8,c[k>>2]=0,k)|0);i=k;return 0}l=a[b]|0;if((l<<24>>24|0)==47|(l<<24>>24|0)==92){m=b+1|0}else{m=b}do{if((nb(m|0,27608)|0)==0){if((nb(m|0,23704)|0)!=0){break}do{if((c[429588]|0)!=0){if((nb(m|0,44216)|0)==0){break}if((e|0)==0){n=0;i=h;return n|0}c[e>>2]=0;n=-1;i=h;return n|0}}while(0);if((e|0)==0){b=d+4|0;l=c[b>>2]|0;if((l|0)==0){o=c[d+8>>2]|0;if((o|0)==0){n=0;i=h;return n|0}p=o+8192|0;q=j|0;c[654338]=c[654338]^1;xn(q,4096,37168,(k=i,i=i+16|0,c[k>>2]=(a[p]|0)==0?838312:p,c[k+8>>2]=m,k)|0)|0;i=k;p=0;r=q;a:while(1){s=a[r]|0;do{if((s<<24>>24|0)==47|(s<<24>>24|0)==92){if((p|0)==0){a[r]=47;t=1;break}else{_x(r|0,r+1|0,Wx(r|0)|0)|0;t=p;break}}else if((s<<24>>24|0)==0){break a}else{t=0}}while(0);p=t;r=r+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(k=i,i=i+16|0,c[k>>2]=o,c[k+8>>2]=q,k)|0)|0;i=k;r=Ud(2617360+(c[654338]<<12)|0,16456)|0;if((r|0)==0){n=0;i=h;return n|0}p=Qb(r|0)|0;vd(r|0,0,2)|0;s=Qb(r|0)|0;vd(r|0,p|0,0)|0;Ta(r|0)|0;n=(s|0)==0?1:s;i=h;return n|0}s=c[l+16404>>2]|0;r=a[m]|0;if(r<<24>>24==0){u=0;v=l}else{p=0;w=0;x=r;while(1){r=(ey(x<<24>>24|0)|0)&255;if((r<<24>>24|0)==92){y=47}else if((r<<24>>24|0)==46){z=w;break}else{y=r}r=(da(y<<24>>24,p+119|0)|0)+w|0;A=p+1|0;B=a[m+A|0]|0;if(B<<24>>24==0){z=r;break}else{p=A;w=r;x=B}}u=z;v=c[b>>2]|0}x=c[(c[v+16408>>2]|0)+(((u>>10^u^u>>20)&s-1)<<2)>>2]|0;if((x|0)==0){n=0;i=h;return n|0}else{C=x}b:while(1){x=m;w=c[C>>2]|0;while(1){p=a[w]|0;l=p<<24>>24;q=a[x]|0;o=q<<24>>24;B=(p-97&255)>>>0<26>>>0?l-32|0:l;l=(q-97&255)>>>0<26>>>0?o-32|0:o;if((B|0)==92|(B|0)==58){D=47}else{D=B}if((l|0)==92|(l|0)==58){E=47}else{E=l}if((D|0)!=(E|0)){break}if((D|0)==0){break b}else{x=x+1|0;w=w+1|0}}w=c[C+12>>2]|0;if((w|0)==0){n=0;F=121;break}else{C=w}}if((F|0)==121){i=h;return n|0}s=c[C+8>>2]|0;n=(s|0)==0?1:s;i=h;return n|0}else{G=1}while(1){s=G+1|0;if((c[787040+(G*288|0)>>2]|0)==0){break}if((s|0)<64){G=s}else{F=41;break}}if((F|0)==41){aj(1,57808,(k=i,i=i+1|0,i=i+7&-8,c[k>>2]=0,k)|0);i=k;return 0}c[e>>2]=G;c[787044+(G*288|0)>>2]=f;s=d+4|0;b=c[s>>2]|0;if((b|0)==0){w=d+8|0;if((c[w>>2]|0)==0){n=-1;i=h;return n|0}x=Wx(m|0)|0;c:do{if((g|0)==0&(c[209566]|0)!=0){l=(x|0)<4;do{if(!l){if((tn(m+(x-4)|0,42392)|0)==0){break c}if((x|0)>=5){if((tn(m+(x-5)|0,39984)|0)==0){break c}if((tn(m+(x-5)|0,37096)|0)==0){break c}}if(l){break}if((tn(m+(x-4)|0,36616)|0)==0){break c}}}while(0);l=Vb(m|0,46)|0;do{if((l|0)!=0){if((Cn(l+1|0,45800,3)|0)!=0){break}B=Vc(l+4|0)|0;if((B|0)==(c[(c[429556]|0)+32>>2]|0)){break c}o=c[1736]|0;if((o|0)==0){break}else{H=0;I=o}do{H=H+1|0;if((I|0)==(B|0)){break c}I=c[6944+(H<<2)>>2]|0;}while((I|0)!=0)}}while(0);c[e>>2]=0;n=-1;i=h;return n|0}}while(0);x=c[w>>2]|0;l=x+8192|0;B=j|0;c[654338]=c[654338]^1;xn(B,4096,37168,(k=i,i=i+16|0,c[k>>2]=(a[l]|0)==0?838312:l,c[k+8>>2]=m,k)|0)|0;i=k;o=0;q=B;d:while(1){p=a[q]|0;do{if((p<<24>>24|0)==47|(p<<24>>24|0)==92){if((o|0)==0){a[q]=47;J=1;break}else{_x(q|0,q+1|0,Wx(q|0)|0)|0;J=o;break}}else if((p<<24>>24|0)==0){break d}else{J=0}}while(0);o=J;q=q+1|0}q=x|0;xn(2617360+(c[654338]<<12)|0,4096,31752,(k=i,i=i+16|0,c[k>>2]=q,c[k+8>>2]=B,k)|0)|0;i=k;o=Ud(2617360+(c[654338]<<12)|0,16456)|0;if((o|0)==0){c[e>>2]=0;n=-1;i=h;return n|0}rn(787072+((c[e>>2]|0)*288|0)|0,m,256);c[787064+((c[e>>2]|0)*288|0)>>2]=0;if((c[(c[210602]|0)+32>>2]|0)!=0){_i(35760,(k=i,i=i+32|0,c[k>>2]=m,c[k+8>>2]=q,c[k+16>>2]=47,c[k+24>>2]=l,k)|0);i=k}c[787040+((c[e>>2]|0)*288|0)>>2]=o;q=Qb(o|0)|0;vd(o|0,0,2)|0;w=Qb(o|0)|0;vd(o|0,q|0,0)|0;n=w;i=h;return n|0}w=c[b+16404>>2]|0;q=a[m]|0;if(q<<24>>24==0){K=0;L=b}else{o=0;p=0;r=q;while(1){q=(ey(r<<24>>24|0)|0)&255;if((q<<24>>24|0)==46){M=p;break}else if((q<<24>>24|0)==92){N=47}else{N=q}q=(da(N<<24>>24,o+119|0)|0)+p|0;A=o+1|0;O=a[m+A|0]|0;if(O<<24>>24==0){M=q;break}else{o=A;p=q;r=O}}K=M;L=c[s>>2]|0}r=(K>>10^K^K>>20)&w-1;if((c[(c[L+16408>>2]|0)+(r<<2)>>2]|0)==0){n=-1;i=h;return n|0}e:do{if((g|0)==0){p=c[209566]|0;if((p|0)==0){break}if((p|0)>0){o=c[L+16388>>2]|0;b=0;while(1){l=b+1|0;if((o|0)==(c[805472+(b<<2)>>2]|0)){break e}if((l|0)<(p|0)){b=l}else{break}}}c[e>>2]=0;n=-1;i=h;return n|0}}while(0);if((Lk(L)|0)==0){c[e>>2]=0;n=-1;i=h;return n|0}w=c[s>>2]|0;b=c[(c[w+16408>>2]|0)+(r<<2)>>2]|0;f:while(1){p=m;o=c[b>>2]|0;while(1){l=a[o]|0;B=l<<24>>24;x=a[p]|0;O=x<<24>>24;q=(l-97&255)>>>0<26>>>0?B-32|0:B;B=(x-97&255)>>>0<26>>>0?O-32|0:O;if((q|0)==92|(q|0)==58){P=47}else{P=q}if((B|0)==92|(B|0)==58){Q=47}else{Q=B}if((P|0)!=(Q|0)){break}if((P|0)==0){break f}else{p=p+1|0;o=o+1|0}}o=c[b+12>>2]|0;if((o|0)==0){n=-1;F=121;break}else{b=o}}if((F|0)==121){i=h;return n|0}r=Wx(m|0)|0;s=w+16400|0;g:do{if((c[s>>2]&1|0)==0){o=(r|0)<7;if(!o){if((tn(m+(r-7)|0,43576)|0)==0){break}}p=(r|0)<4;if(!p){if((tn(m+(r-4)|0,42960)|0)==0){break}if((tn(m+(r-4)|0,42392)|0)==0){break}}if(!o){if((tn(m+(r-7)|0,41896)|0)==0){break}}do{if(!p){if((tn(m+(r-4)|0,41440)|0)==0){break g}if((r|0)>=6){if((tn(m+(r-6)|0,40640)|0)==0){break g}}if((r|0)<5){break}if((tn(m+(r-5)|0,39984)|0)==0){break g}}}while(0);if((tn(m,39552)|0)==0){break}if((nb(m|0,39088)|0)!=0){break}c[s>>2]=c[s>>2]|1}}while(0);if((nb(m|0,38592)|0)!=0){c[s>>2]=c[s>>2]|4}if((nb(m|0,38192)|0)!=0){c[s>>2]=c[s>>2]|2}do{if((f|0)==0){r=c[e>>2]|0;c[787040+(r*288|0)>>2]=c[w+16384>>2];R=r}else{r=w+4096|0;p=Tn(r)|0;o=c[e>>2]|0;c[787040+(o*288|0)>>2]=p;if((p|0)!=0){R=o;break}aj(0,37824,(k=i,i=i+8|0,c[k>>2]=r,k)|0);i=k;return 0}}while(0);rn(787072+(R*288|0)|0,m,256);c[787064+((c[e>>2]|0)*288|0)>>2]=1;s=b+4|0;eo(c[787040+((c[e>>2]|0)*288|0)>>2]|0,c[s>>2]|0)|0;$n(c[787040+((c[e>>2]|0)*288|0)>>2]|0)|0;c[787056+((c[e>>2]|0)*288|0)>>2]=c[s>>2];s=b+8|0;r=c[s>>2]|0;c[787060+((c[e>>2]|0)*288|0)>>2]=r;if((c[(c[210602]|0)+32>>2]|0)==0){n=r;i=h;return n|0}_i(37480,(k=i,i=i+16|0,c[k>>2]=m,c[k+8>>2]=w+4096,k)|0);i=k;n=c[s>>2]|0;i=h;return n|0}}while(0);if((e|0)==0){n=0;i=h;return n|0}c[e>>2]=0;n=-1;i=h;return n|0}function _k(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;f=c[209560]|0;if((f|0)==0){aj(0,57592,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;return 0}a:do{if((b|0)==0){g=f;while(1){h=Zk(a,g,0,d,0)|0;if((h|0)>0){j=h;break}g=c[g>>2]|0;if((g|0)==0){break a}}i=e;return j|0}else{g=f;while(1){h=Zk(a,g,b,d,0)|0;if((h|0)>-1){if((c[b>>2]|0)!=0){j=h;break}}g=c[g>>2]|0;if((g|0)==0){break a}}i=e;return j|0}}while(0);if((b|0)==0){j=0;i=e;return j|0}c[b>>2]=0;j=-1;i=e;return j|0}function $k(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;h=i;i=i+12288|0;j=h+4096|0;k=h+8192|0;if((c[209560]|0)==0){aj(0,57592,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);i=l;return 0}m=(g|0)!=0;if(m){xn(j,4096,35152,(l=i,i=i+8|0,c[l>>2]=f,l)|0)|0;i=l}xn(k,4096,34656,(l=i,i=i+8|0,c[l>>2]=f,l)|0)|0;i=l;f=c[b>>2]|0;g=(f|0)==0;if(g){n=838240}else{n=f}o=c[n>>2]|0;if((o|0)==0){p=-1;q=4096;r=0;s=4096;t=0;i=h;return p|0}n=f+4|0;f=h|0;u=o;a:while(1){o=c[u+8>>2]|0;b:do{if((o|0)==0|(c[209566]|0)!=0){v=c[u+4>>2]|0;if((v|0)==0){break}c:do{if(!g){w=c[n>>2]|0;if((w|0)==0){break}x=v|0;y=w|0;while(1){w=a[y]|0;z=w<<24>>24;A=a[x]|0;B=A<<24>>24;C=(w-97&255)>>>0<26>>>0?z-32|0:z;z=(A-97&255)>>>0<26>>>0?B-32|0:B;if((C|0)==92|(C|0)==58){D=47}else{D=C}if((z|0)==92|(z|0)==58){E=47}else{E=z}if((D|0)!=(E|0)){break c}if((D|0)==0){break b}else{x=x+1|0;y=y+1|0}}}}while(0);if((Zk(k,u,0,0,0)|0)>0){F=33;break a}}else{if(m){v=o+8192|0;c[654338]=c[654338]^1;xn(f,4096,37168,(l=i,i=i+16|0,c[l>>2]=(a[v]|0)==0?838312:v,c[l+8>>2]=j,l)|0)|0;i=l;v=0;y=f;d:while(1){x=a[y]|0;do{if((x<<24>>24|0)==0){break d}else if((x<<24>>24|0)==47|(x<<24>>24|0)==92){if((v|0)==0){a[y]=47;G=1;break}else{_x(y|0,y+1|0,Wx(y|0)|0)|0;G=v;break}}else{G=0}}while(0);v=G;y=y+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(l=i,i=i+16|0,c[l>>2]=o,c[l+8>>2]=f,l)|0)|0;i=l;H=2617360+(c[654338]<<12)|0;I=Ud(H|0,16456)|0;if((I|0)!=0){F=18;break a}}if((Zk(k,u,0,0,0)|0)>0){F=20;break a}}}while(0);o=c[u>>2]|0;if((o|0)==0){p=-1;F=34;break}else{u=o}}if((F|0)==18){Ta(I|0)|0;rn(d,H,e);c[b>>2]=u;p=0;q=4096;r=0;s=4096;t=0;i=h;return p|0}else if((F|0)==20){c[b>>2]=u;p=2;q=4096;r=0;s=4096;t=0;i=h;return p|0}else if((F|0)==33){c[b>>2]=u;p=2;q=4096;r=0;s=4096;t=0;i=h;return p|0}else if((F|0)==34){q=4096;r=0;s=4096;t=0;i=h;return p|0}return 0}function al(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;if((c[209560]|0)==0){aj(0,57592,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}if((d|0)==0){g=0;i=e;return g|0}f=787068+(d*288|0)|0;if((c[f>>2]|0)==0){g=bl(a,b,d)|0;i=e;return g|0}else{c[f>>2]=0;h=bl(a,b,d)|0;c[f>>2]=1;g=h;i=e;return g|0}return 0}function bl(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;if((c[209560]|0)==0){aj(0,57592,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}if((d|0)==0){g=0;i=e;return g|0}c[209562]=(c[209562]|0)+b;h=787040+(d*288|0)|0;if((c[787064+(d*288|0)>>2]|0)!=0){g=ao(c[h>>2]|0,a,b)|0;i=e;return g|0}if((b|0)==0){g=0;i=e;return g|0}d=h|0;h=b;j=a;a=0;while(1){k=kd(j|0,1,h|0,c[d>>2]|0)|0;if((k|0)==0){if((a|0)==0){l=1}else{m=9;break}}else if((k|0)==(-1|0)){m=10;break}else{l=a}if((h|0)==(k|0)){g=b;m=13;break}else{h=h-k|0;j=j+k|0;a=l}}if((m|0)==9){g=b-h|0;i=e;return g|0}else if((m|0)==10){aj(0,34232,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}else if((m|0)==13){i=e;return g|0}return 0}function cl(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;e=i;if((c[209560]|0)==0){aj(0,57592,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}if((d|0)==0){g=0;i=e;return g|0}if((d-1|0)>>>0>62>>>0){aj(1,56984,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}if((c[787064+(d*288|0)>>2]|0)==1){aj(1,56664,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}h=c[787040+(d*288|0)>>2]|0;if((h|0)==0){aj(1,56504,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}a:do{if((b|0)!=0){j=b;k=a;l=0;while(1){m=_a(k|0,1,j|0,h|0)|0;if((m|0)==0){if((l|0)==0){n=1}else{o=13;break}}else if((m|0)==(-1|0)){o=14;break}else{n=l}if((j|0)==(m|0)){break a}else{j=j-m|0;k=k+m|0;l=n}}if((o|0)==13){_i(33664,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;g=0;i=e;return g|0}else if((o|0)==14){_i(32936,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;g=0;i=e;return g|0}}}while(0);if((c[787048+(d*288|0)>>2]|0)==0){g=b;i=e;return g|0}Wa(h|0)|0;g=b;i=e;return g|0}function dl(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+4112|0;f=e|0;g=e+16|0;h=f;c[h>>2]=d;c[h+4>>2]=0;fd(g|0,4096,b|0,f|0)|0;cl(g,Wx(g|0)|0,a)|0;i=e;return}function el(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;e=i;i=i+65536|0;f=e|0;if((c[209560]|0)==0){aj(0,57592,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;return 0}h=787040+(a*288|0)|0;j=787068+(a*288|0)|0;if((c[j>>2]|0)!=0){c[j>>2]=0;k=el(a,b,d)|0;c[j>>2]=1;l=k;i=e;return l|0}if((c[787064+(a*288|0)>>2]|0)!=1){if((a-1|0)>>>0>62>>>0){aj(1,56984,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;return 0}k=c[787040+(a*288|0)>>2]|0;if((k|0)==0){aj(1,56504,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;return 0}if((d|0)==2){m=0}else if((d|0)==0){m=1}else if((d|0)==1){m=2}else{aj(0,32432,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;return 0}l=vd(k|0,b|0,m|0)|0;i=e;return l|0}m=f|0;f=bo(c[787040+(a*288|0)>>2]|0)|0;do{if((b|0)<0){if((d|0)==0){n=f+b|0}else if((d|0)==1){n=(c[787060+(a*288|0)>>2]|0)+b|0}else{n=0}o=(n|0)<0?0:n;p=13}else{if((d|0)==1){q=b-f+(c[787060+(a*288|0)>>2]|0)|0;break}else if((d|0)==2){o=b;p=13;break}else if((d|0)==0){q=b;break}else{aj(0,32432,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;return 0}}}while(0);do{if((p|0)==13){if((o|0)==(f|0)){l=b;i=e;return l|0}else{g=h;eo(c[g>>2]|0,c[787056+(a*288|0)>>2]|0)|0;$n(c[g>>2]|0)|0;q=o;break}}}while(0);if((q|0)>65536){o=q-65537&-65536;h=q;do{bl(m,65536,a)|0;h=h-65536|0;}while((h|0)>65536);r=q-65536-o|0}else{r=q}bl(m,r,a)|0;l=b;i=e;return l|0}function fl(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;e=i;f=c[209560]|0;if((f|0)==0){aj(0,57592,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;return 0}if((b|0)==0){aj(0,44872,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;return 0}g=a[b]|0;if((g<<24>>24|0)==47|(g<<24>>24|0)==92){h=b+1|0}else{h=b}if((nb(h|0,27608)|0)!=0){j=-1;i=e;return j|0}if((nb(h|0,23704)|0)==0){k=f}else{j=-1;i=e;return j|0}a:while(1){f=k+4|0;b=c[f>>2]|0;b:do{if((b|0)!=0){g=c[b+16404>>2]|0;l=a[h]|0;if(l<<24>>24==0){m=0;n=b}else{o=0;p=0;q=l;while(1){l=(ey(q<<24>>24|0)|0)&255;if((l<<24>>24|0)==46){r=p;break}else if((l<<24>>24|0)==92){s=47}else{s=l}l=(da(s<<24>>24,o+119|0)|0)+p|0;t=o+1|0;u=a[h+t|0]|0;if(u<<24>>24==0){r=l;break}else{o=t;p=l;q=u}}m=r;n=c[f>>2]|0}q=(m>>10^m^m>>20)&g-1;if((n|0)==0){break}if((c[(c[n+16408>>2]|0)+(q<<2)>>2]|0)==0){break}p=c[209566]|0;c:do{if((p|0)!=0){if((p|0)<=0){break b}o=c[n+16388>>2]|0;u=0;while(1){l=u+1|0;if((o|0)==(c[805472+(u<<2)>>2]|0)){break c}if((l|0)<(p|0)){u=l}else{break b}}}}while(0);if((Lk(n)|0)==0){break}v=c[f>>2]|0;p=c[(c[v+16408>>2]|0)+(q<<2)>>2]|0;do{g=h;u=c[p>>2]|0;while(1){o=a[u]|0;l=o<<24>>24;t=a[g]|0;w=t<<24>>24;x=(o-97&255)>>>0<26>>>0?l-32|0:l;l=(t-97&255)>>>0<26>>>0?w-32|0:w;if((x|0)==92|(x|0)==58){y=47}else{y=x}if((l|0)==92|(l|0)==58){z=47}else{z=l}if((y|0)!=(z|0)){break}if((y|0)==0){break a}else{g=g+1|0;u=u+1|0}}p=c[p+12>>2]|0;}while((p|0)!=0)}}while(0);f=c[k>>2]|0;if((f|0)==0){j=-1;A=35;break}else{k=f}}if((A|0)==35){i=e;return j|0}if((d|0)==0){j=1;i=e;return j|0}c[d>>2]=c[v+16392>>2];j=1;i=e;return j|0}function gl(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;g=i;i=i+16|0;h=g|0;j=g+8|0;k=c[209560]|0;if((k|0)==0){aj(0,57592,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);i=l;return 0}if((b|0)==0){aj(0,32e3,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);i=l;return 0}if((a[b]|0)==0){aj(0,32e3,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);i=l;return 0}do{if((nb(b|0,42392)|0)==0){m=0}else{n=c[429578]|0;if((n|0)==0){m=1;break}if((c[n+32>>2]|0)!=2){m=1;break}$i(31664,(l=i,i=i+8|0,c[l>>2]=b,l)|0);i=l;if((bl(j,4,c[429576]|0)|0)!=4){if((f|0)==0){o=-1;i=g;return o|0}c[f>>2]=0;o=-1;i=g;return o|0}n=c[j>>2]|0;p=(f|0)==0;if((n|0)==0){if(p){o=1;i=g;return o|0}c[f>>2]=0;o=-1;i=g;return o|0}if(p){o=n;i=g;return o|0}p=yj(n+1|0)|0;c[f>>2]=p;n=bl(p,c[j>>2]|0,c[429576]|0)|0;if((n|0)!=(c[j>>2]|0)){aj(0,31312,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);i=l;return 0}c[209572]=(c[209572]|0)+1;c[209570]=(c[209570]|0)+1;a[p+n|0]=0;o=c[j>>2]|0;i=g;return o|0}}while(0);do{if((d|0)==0){n=k;while(1){q=Zk(b,n,h,0,0)|0;r=c[h>>2]|0;if(!((q|0)<0|(r|0)==0)){s=21;break}p=c[n>>2]|0;if((p|0)==0){s=23;break}else{n=p}}if((s|0)==21){c[j>>2]=q;if((f|0)==0){t=r;s=31;break}else{u=q;s=44;break}}else if((s|0)==23){c[h>>2]=0;c[j>>2]=-1;if((f|0)==0){break}else{s=26;break}}}else{n=Zk(b,d,h,0,e)|0;p=c[h>>2]|0;c[j>>2]=n;v=(f|0)!=0;if((p|0)==0){if(v){s=26;break}else{break}}else{if(v){u=n;s=44;break}else{t=p;s=31;break}}}}while(0);if((s|0)==26){c[f>>2]=0}else if((s|0)==31){e=c[429578]|0;do{if((m|0)!=0&(e|0)!=0){if((c[e+32>>2]|0)!=1){w=t;break}$i(30024,(l=i,i=i+8|0,c[l>>2]=b,l)|0);i=l;cl(j,4,c[429576]|0)|0;Wa(c[787040+((c[429576]|0)*288|0)>>2]|0)|0;w=c[h>>2]|0}else{w=t}}while(0);if((c[209560]|0)==0){aj(0,57592,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);i=l;return 0}t=787040+(w*288|0)|0;if((c[787064+(w*288|0)>>2]|0)==1){e=t;Vn(c[e>>2]|0)|0;if((c[787044+(w*288|0)>>2]|0)!=0){Un(c[e>>2]|0)|0}Zx(t|0,0,288)|0}else{e=c[t>>2]|0;if((e|0)!=0){Ta(e|0)|0}Zx(t|0,0,288)|0}o=c[j>>2]|0;i=g;return o|0}else if((s|0)==44){c[209572]=(c[209572]|0)+1;c[209570]=(c[209570]|0)+1;s=yj(u+1|0)|0;c[f>>2]=s;bl(s,c[j>>2]|0,c[h>>2]|0)|0;a[s+(c[j>>2]|0)|0]=0;f=c[h>>2]|0;if((c[209560]|0)==0){aj(0,57592,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);i=l;return 0}h=787040+(f*288|0)|0;if((c[787064+(f*288|0)>>2]|0)==1){u=h;Vn(c[u>>2]|0)|0;if((c[787044+(f*288|0)>>2]|0)!=0){Un(c[u>>2]|0)|0}Zx(h|0,0,288)|0}else{u=c[h>>2]|0;if((u|0)!=0){Ta(u|0)|0}Zx(h|0,0,288)|0}h=c[429578]|0;do{if((m|0)!=0&(h|0)!=0){if((c[h+32>>2]|0)!=1){break}$i(29720,(l=i,i=i+8|0,c[l>>2]=b,l)|0);i=l;cl(j,4,c[429576]|0)|0;cl(s,c[j>>2]|0,c[429576]|0)|0;Wa(c[787040+((c[429576]|0)*288|0)>>2]|0)|0}}while(0);o=c[j>>2]|0;i=g;return o|0}s=c[429578]|0;if(!((m|0)!=0&(s|0)!=0)){o=-1;i=g;return o|0}if((c[s+32>>2]|0)!=1){o=-1;i=g;return o|0}$i(30576,(l=i,i=i+8|0,c[l>>2]=b,l)|0);i=l;c[j>>2]=0;cl(j,4,c[429576]|0)|0;Wa(c[787040+((c[429576]|0)*288|0)>>2]|0)|0;o=-1;i=g;return o|0}function hl(a,b){a=a|0;b=b|0;return gl(a,0,0,b)|0}function il(a){a=a|0;var b=0,d=0;b=i;if((c[209560]|0)==0){aj(0,57592,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d}if((a|0)==0){aj(0,29416,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d}c[209570]=(c[209570]|0)-1;zj(a);if((c[209570]|0)!=0){i=b;return}Aj();i=b;return}function jl(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;e=i;i=i+344|0;f=e|0;g=e+8|0;h=e+264|0;j=g|0;k=Tn(b)|0;if((Wn(k,f)|0)!=0){l=0;m=80;n=0;o=256;p=0;i=e;return l|0}Sn(k)|0;q=f|0;a:do{if((c[q>>2]|0)==0){r=0;s=0}else{f=0;t=0;while(1){if((Xn(k,h,j,256,0,0,0,0)|0)!=0){break}u=t+1+(Wx(j|0)|0)|0;Zn(k)|0;v=f+1|0;w=c[q>>2]|0;if(v>>>0<w>>>0){f=v;t=u}else{r=u;s=w;break a}}r=t;s=c[q>>2]|0}}while(0);f=oj((s<<4)+r|0)|0;r=f;s=c[q>>2]|0;w=f+(s<<4)|0;f=oj((s<<2)+4|0)|0;s=f;c[s>>2]=c[210606];u=c[q>>2]|0;v=1;while(1){x=v<<1;if(v>>>0>u>>>0){y=v;break}if((x|0)<1025){v=x}else{y=x;break}}v=oj((y<<2)+16416|0)|0;u=v;x=v+16404|0;c[x>>2]=y;z=v+16416|0;A=v+16408|0;c[A>>2]=z;b:do{if((y|0)>0){B=0;C=z;while(1){c[C+(B<<2)>>2]=0;D=B+1|0;if((D|0)>=(y|0)){break b}B=D;C=c[A>>2]|0}}}while(0);rn(v+4096|0,b,4096);b=v+8192|0;rn(b,d,4096);d=Wx(b|0)|0;do{if(d>>>0>4>>>0){if((tn(v+(d+8188)|0,41952)|0)!=0){break}a[v+((Wx(b|0)|0)+8188)|0]=0}}while(0);c[v+16384>>2]=k;c[v+16396>>2]=c[q>>2];Sn(k)|0;c:do{if((c[q>>2]|0)==0){E=1}else{b=h+28|0;d=h+20|0;y=0;z=1;C=w;while(1){if((Xn(k,h,j,256,0,0,0,0)|0)!=0){E=z;break c}if((c[b>>2]|0)==0){F=z}else{c[s+(z<<2)>>2]=c[d>>2];F=z+1|0}En(j)|0;B=c[x>>2]|0;t=a[j]|0;d:do{if(t<<24>>24==0){G=0}else{D=0;H=0;I=t;while(1){J=(ey(I<<24>>24|0)|0)&255;if((J<<24>>24|0)==92){K=47}else if((J<<24>>24|0)==46){G=H;break d}else{K=J}J=(da(K<<24>>24,D+119|0)|0)+H|0;L=D+1|0;M=a[g+L|0]|0;if(M<<24>>24==0){G=J;break}else{D=L;H=J;I=M}}}}while(0);t=(G>>10^G^G>>20)&B-1;I=r+(y<<4)|0;c[I>>2]=C;by(C|0,j|0)|0;H=C+((Wx(j|0)|0)+1)|0;c[r+(y<<4)+4>>2]=co(k)|0;c[r+(y<<4)+8>>2]=c[b>>2];c[r+(y<<4)+12>>2]=c[(c[A>>2]|0)+(t<<2)>>2];c[(c[A>>2]|0)+(t<<2)>>2]=I;Zn(k)|0;I=y+1|0;if(I>>>0<(c[q>>2]|0)>>>0){y=I;z=F;C=H}else{E=F;break}}}}while(0);F=E<<2;c[v+16388>>2]=Ql(f+4|0,F-4|0)|0;c[v+16392>>2]=Ql(f,F)|0;mj(f);c[v+16412>>2]=r;l=u;m=80;n=0;o=256;p=0;i=e;return l|0}function kl(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0;h=i;i=i+20480|0;j=h|0;k=h+4096|0;l=k;m=i;i=i+256|0;n=i;i=i+4|0;i=i+7&-8;o=m|0;if((c[209560]|0)==0){aj(0,57592,(p=i,i=i+1|0,i=i+7&-8,c[p>>2]=0,p)|0);i=p;return 0}if((b|0)==0){c[f>>2]=0;q=0;r=256;s=0;t=16384;u=0;i=h;return q|0}v=(d|0)==0?2551536:d;d=Wx(b|0)|0;w=d-1|0;x=a[b+w|0]|0;if((x<<24>>24|0)==92|(x<<24>>24|0)==47){y=w}else{y=d}d=Wx(v|0)|0;a[o]=0;w=0;x=0;z=0;while(1){A=a[b+x|0]|0;if((A<<24>>24|0)==0){break}else if((A<<24>>24|0)==47|(A<<24>>24|0)==92){B=w+1|0;C=x}else{B=w;C=z}w=B;x=x+1|0;z=C}by(o|0,b|0)|0;a[m+z|0]=0;z=c[209560]|0;if((z|0)==0){c[f>>2]=0;q=0;r=256;s=0;t=16384;u=0;i=h;return q|0}C=(g|0)==0;g=j|0;j=(e|0)==0;x=(y|0)==0?0:y+1|0;B=0;A=z;while(1){z=A+4|0;D=c[z>>2]|0;a:do{if((D|0)==0){E=c[A+8>>2]|0;if((E|0)==0){F=B;break}if((c[209566]|0)!=0&C){F=B;break}G=E+8192|0;c[654338]=c[654338]^1;xn(g,4096,37168,(p=i,i=i+16|0,c[p>>2]=(a[G]|0)==0?838312:G,c[p+8>>2]=b,p)|0)|0;i=p;G=0;H=g;b:while(1){I=a[H]|0;do{if((I<<24>>24|0)==47|(I<<24>>24|0)==92){if((G|0)==0){a[H]=47;J=1;break}else{_x(H|0,H+1|0,Wx(H|0)|0)|0;J=G;break}}else if((I<<24>>24|0)==0){break b}else{J=0}}while(0);G=J;H=H+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(p=i,i=i+16|0,c[p>>2]=E,c[p+8>>2]=g,p)|0)|0;i=p;H=ud(2617360+(c[654338]<<12)|0,v|0,e|0,n|0,0)|0;if((c[n>>2]|0)>0){G=0;I=B;while(1){K=c[H+(G<<2)>>2]|0;c:do{if((I|0)==4095){L=4095}else{if((I|0)>0){M=0;while(1){N=M+1|0;if((tn(K,c[k+(M<<2)>>2]|0)|0)==0){L=I;break c}if((N|0)<(I|0)){M=N}else{break}}}c[k+(I<<2)>>2]=qj(K)|0;L=I+1|0}}while(0);K=G+1|0;if((K|0)<(c[n>>2]|0)){G=K;I=L}else{O=L;break}}}else{O=B}pc(H|0);F=O}else{I=c[209566]|0;d:do{if((I|0)!=0){if((I|0)<=0){F=B;break a}G=c[D+16388>>2]|0;E=0;while(1){K=E+1|0;if((G|0)==(c[805472+(E<<2)>>2]|0)){break d}if((K|0)<(I|0)){E=K}else{F=B;break a}}}}while(0);if((Lk(D)|0)==0){F=B;break}I=c[z>>2]|0;H=c[I+16412>>2]|0;E=I+16396|0;if((c[E>>2]|0)>0){P=0;Q=B}else{F=B;break}while(1){I=c[H+(P<<4)>>2]|0;e:do{if(j){a[o]=0;G=0;K=0;M=0;while(1){N=a[I+K|0]|0;if((N<<24>>24|0)==0){break}else if((N<<24>>24|0)==47|(N<<24>>24|0)==92){R=G+1|0;S=K}else{R=G;S=M}G=R;K=K+1|0;M=S}by(o|0,I|0)|0;a[m+M|0]=0;if((G-w|0)>2|(y|0)>(M|0)){T=Q;break}if((Cn(I,b,y)|0)!=0){T=Q;break}K=Wx(I|0)|0;if((K|0)<(d|0)){T=Q;break}if((tn(I+(K-d)|0,v)|0)!=0){T=Q;break}K=I+x|0;if((Q|0)==4095){T=4095;break}if((Q|0)>0){N=0;while(1){U=N+1|0;if((tn(K,c[k+(N<<2)>>2]|0)|0)==0){T=Q;break e}if((U|0)<(Q|0)){N=U}else{break}}}c[k+(Q<<2)>>2]=qj(K)|0;T=Q+1|0}else{if((jj(e,I,0)|0)==0){T=Q;break}if((Q|0)==4095){T=4095;break}if((Q|0)>0){N=0;while(1){M=N+1|0;if((tn(I,c[k+(N<<2)>>2]|0)|0)==0){T=Q;break e}if((M|0)<(Q|0)){N=M}else{break}}}c[k+(Q<<2)>>2]=qj(I)|0;T=Q+1|0}}while(0);I=P+1|0;if((I|0)<(c[E>>2]|0)){P=I;Q=T}else{F=T;break}}}}while(0);z=c[A>>2]|0;if((z|0)==0){break}else{B=F;A=z}}c[f>>2]=F;if((F|0)==0){q=0;r=256;s=0;t=16384;u=0;i=h;return q|0}f=F<<2;A=oj(f+4|0)|0;B=A;if((F|0)>0){Vx(A|0,l|0,f)|0;V=F}else{V=0}c[B+(V<<2)>>2]=0;q=B;r=256;s=0;t=16384;u=0;i=h;return q|0}function ll(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;g=i;i=i+8|0;h=g|0;a[e]=0;c[h>>2]=0;if((tn(b,28312)|0)==0){j=ml(e,f)|0;i=g;return j|0}k=kl(b,d,0,h,0)|0;d=c[h>>2]|0;a:do{if((d|0)>0){b=e;l=0;m=0;while(1){n=c[k+(l<<2)>>2]|0;o=(Wx(n|0)|0)+1|0;p=o+m|0;if((p+1|0)>=(f|0)){break}by(b|0,n|0)|0;n=l+1|0;if((n|0)<(d|0)){b=b+o|0;l=n;m=p}else{q=d;break a}}c[h>>2]=l;q=l}else{q=d}}while(0);if((c[209560]|0)==0){aj(0,57592,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d;return 0}if((k|0)==0){j=q;i=g;return j|0}d=c[k>>2]|0;if((d|0)!=0){h=0;f=d;do{mj(f);h=h+1|0;f=c[k+(h<<2)>>2]|0;}while((f|0)!=0)}mj(k);j=q;i=g;return j|0}function ml(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0;e=i;i=i+8216|0;f=e|0;g=e+4096|0;h=e+4104|0;j=e+8200|0;k=e+8208|0;l=h|0;a[b]=0;m=ud(c[(c[209574]|0)+4>>2]|0,0,0,k|0,1)|0;n=ud(c[(c[210610]|0)+4>>2]|0,0,0,k|0,1)|0;do{if((m|0)==0){o=0}else{if((c[m>>2]|0)==0){o=0;break}else{p=m;q=0}while(1){k=p+4|0;r=q+1|0;if((c[k>>2]|0)==0){o=r;break}else{p=k;q=r}}}}while(0);do{if((n|0)==0){s=0}else{if((c[n>>2]|0)==0){s=0;break}else{t=n;u=0}while(1){q=t+4|0;p=u+1|0;if((c[q>>2]|0)==0){s=p;break}else{t=q;u=p}}}}while(0);u=oj((s+o<<2)+4|0)|0;o=u;s=(m|0)!=0;do{if(s){t=c[m>>2]|0;if((t|0)==0){v=o;break}else{w=o;x=m;y=t}while(1){c[w>>2]=y;t=x+4|0;p=w+4|0;q=c[t>>2]|0;if((q|0)==0){v=p;break}else{w=p;x=t;y=q}}}else{v=o}}while(0);y=(n|0)!=0;do{if(y){x=c[n>>2]|0;if((x|0)==0){z=v;break}else{A=v;B=n;C=x}while(1){c[A>>2]=C;x=B+4|0;w=A+4|0;q=c[x>>2]|0;if((q|0)==0){z=w;break}else{A=w;B=x;C=q}}}else{z=v}}while(0);c[z>>2]=0;if(s){mj(m)}if(y){mj(n)}if((u|0)==0){D=0;pc(o|0);E=4096;F=0;i=e;return D|0}if((c[o>>2]|0)==0){D=0;pc(o|0);E=4096;F=0;i=e;return D|0}else{G=o;H=0}while(1){u=G+4|0;I=H+1|0;if((c[u>>2]|0)==0){break}else{G=u;H=I}}if(!((H|0)>-1)){D=0;pc(o|0);E=4096;F=0;i=e;return D|0}H=f|0;f=0;G=0;u=0;n=0;y=b;a:while(1){b=c[o+(G<<2)>>2]|0;b:do{if((G|0)==0){if((u|0)==0){J=27}else{K=y;L=n;M=f;N=u}}else{if((G|0)>0){O=0}else{J=27;break}while(1){m=O+1|0;if((tn(c[o+(O<<2)>>2]|0,b)|0)==0){K=y;L=n;M=f;N=1;break b}if((m|0)<(G|0)){O=m}else{J=27;break}}}}while(0);do{if((J|0)==27){J=0;if((tn(b,c[(c[430924]|0)+4>>2]|0)|0)==0){K=y;L=n;M=f;N=0;break}if((Cn(b,27944,1)|0)==0){K=y;L=n;M=f;N=0;break}m=c[(c[210610]|0)+4>>2]|0;c[654338]=c[654338]^1;s=(b|0)==0;if(s){J=31}else{if((a[b]|0)==0){J=31}else{P=b}}if((J|0)==31){J=0;P=838312}xn(H,4096,37168,(Q=i,i=i+16|0,c[Q>>2]=P,c[Q+8>>2]=2551536,Q)|0)|0;i=Q;z=0;v=H;c:while(1){C=a[v]|0;do{if((C<<24>>24|0)==47|(C<<24>>24|0)==92){if((z|0)==0){a[v]=47;R=1;break}else{_x(v|0,v+1|0,Wx(v|0)|0)|0;R=z;break}}else if((C<<24>>24|0)==0){break c}else{R=0}}while(0);z=R;v=v+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(Q=i,i=i+16|0,c[Q>>2]=m,c[Q+8>>2]=H,Q)|0)|0;i=Q;v=2617360+(c[654338]<<12)|0;c[g>>2]=0;pc(ud(v|0,41952,0,g|0,0)|0);if((c[g>>2]|0)<1){v=c[(c[209574]|0)+4>>2]|0;c[654338]=c[654338]^1;if(s){J=41}else{if((a[b]|0)==0){J=41}else{S=b}}if((J|0)==41){J=0;S=838312}xn(H,4096,37168,(Q=i,i=i+16|0,c[Q>>2]=S,c[Q+8>>2]=2551536,Q)|0)|0;i=Q;z=0;C=H;d:while(1){B=a[C]|0;do{if((B<<24>>24|0)==47|(B<<24>>24|0)==92){if((z|0)==0){a[C]=47;T=1;break}else{_x(C|0,C+1|0,Wx(C|0)|0)|0;T=z;break}}else if((B<<24>>24|0)==0){break d}else{T=0}}while(0);z=T;C=C+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(Q=i,i=i+16|0,c[Q>>2]=v,c[Q+8>>2]=H,Q)|0)|0;i=Q;C=2617360+(c[654338]<<12)|0;c[g>>2]=0;pc(ud(C|0,41952,0,g|0,0)|0);if((c[g>>2]|0)<=0){K=y;L=n;M=f;N=0;break}}C=(Wx(b|0)|0)+1|0;a[l]=0;by(l|0,b|0)|0;Vx(h+(Wx(l|0)|0)|0,27480,17)|0;do{if((Tk(l,j)|0)>0){z=c[j>>2]|0;if((z|0)==0){J=68;break}if((z-1|0)>>>0>62>>>0){J=52;break a}s=787064+(z*288|0)|0;if((c[s>>2]|0)==1){J=54;break a}m=c[787040+(z*288|0)>>2]|0;if((m|0)==0){J=56;break a}Zx(l|0,0,4096)|0;B=kd(l|0,1,48,m|0)|0;if((B|0)>-1){a[h+B|0]=0}if((c[209560]|0)==0){J=60;break a}B=787040+(z*288|0)|0;if((c[s>>2]|0)==1){s=B;Vn(c[s>>2]|0)|0;if((c[787044+(z*288|0)>>2]|0)!=0){Un(c[s>>2]|0)|0}Zx(B|0,0,288)|0;break}else{s=c[B>>2]|0;if((s|0)!=0){Ta(s|0)|0}Zx(B|0,0,288)|0;break}}else{J=68}}while(0);if((J|0)==68){J=0;by(l|0,b|0)|0}v=(Wx(l|0)|0)+1|0;if((f+2+C+v|0)>=(d|0)){D=n;J=72;break a}by(y|0,b|0)|0;by(y+C|0,l|0)|0;K=y+(v+C)|0;L=n+1|0;M=C+f+v|0;N=0}}while(0);b=G+1|0;if((b|0)<(I|0)){f=M;G=b;u=N;n=L;y=K}else{D=L;J=72;break}}if((J|0)==52){aj(1,56984,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;return 0}else if((J|0)==54){aj(1,56664,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;return 0}else if((J|0)==56){aj(1,56504,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;return 0}else if((J|0)==60){aj(0,57592,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;return 0}else if((J|0)==72){pc(o|0);E=4096;F=0;i=e;return D|0}return 0}function nl(){var a=0,b=0,d=0,e=0,f=0,g=0,h=0,j=0;a=i;i=i+8|0;b=a|0;do{if((xi()|0)>=2){if((xi()|0)>3){break}d=(xi()|0)==2;e=yi(1)|0;if(d){f=2551536}else{f=yi(2)|0}_i(26224,(g=i,i=i+16|0,c[g>>2]=e,c[g+8>>2]=f,g)|0);i=g;_i(25624,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;d=kl(e,f,0,b,0)|0;e=c[b>>2]|0;if((e|0)>0){h=0;do{_i(25440,(g=i,i=i+8|0,c[g>>2]=c[d+(h<<2)>>2],g)|0);i=g;h=h+1|0;}while((h|0)<(e|0))}if((c[209560]|0)==0){aj(0,57592,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g}if((d|0)==0){i=a;return}e=c[d>>2]|0;if((e|0)!=0){h=0;j=e;do{mj(j);h=h+1|0;j=c[d+(h<<2)>>2]|0;}while((j|0)!=0)}mj(d);i=a;return}}while(0);_i(27032,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;i=a;return}function ol(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;e=d<<2;f=oj(e+4|0)|0;g=f;c[g>>2]=0;if((d|0)>0){h=0}else{i=b;Vx(i|0,f|0,e)|0;mj(f);return}do{a:do{if((h|0)>0){j=c[b+(h<<2)>>2]|0;k=0;while(1){l=c[g+(k<<2)>>2]|0;m=j;while(1){n=a[m]|0;o=n<<24>>24;p=a[l]|0;q=p<<24>>24;r=(n-97&255)>>>0<26>>>0?o-32|0:o;o=(p-97&255)>>>0<26>>>0?q-32|0:q;if((r|0)==92|(r|0)==58){s=47}else{s=r}if((o|0)==92|(o|0)==58){t=47}else{t=o}if((s|0)<(t|0)){u=k;break a}if((s|0)>(t|0)|(s|0)==0){break}else{l=l+1|0;m=m+1|0}}m=k+1|0;if((m|0)<(h|0)){k=m}else{u=m;break}}}else{u=0}}while(0);if((h|0)>(u|0)){k=h;while(1){j=k-1|0;c[g+(k<<2)>>2]=c[g+(j<<2)>>2];if((j|0)>(u|0)){k=j}else{break}}}c[g+(u<<2)>>2]=c[b+(h<<2)>>2];h=h+1|0;}while((h|0)<(d|0));i=b;Vx(i|0,f|0,e)|0;mj(f);return}function pl(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;b=i;i=i+8|0;d=b|0;if((xi()|0)<2){_i(25192,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;_i(24760,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;i=b;return}f=yi(1)|0;_i(25624,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;g=kl(2551536,2551536,f,d,0)|0;f=c[d>>2]|0;ol(g,f);if((f|0)>0){h=0;while(1){j=g+(h<<2)|0;k=c[j>>2]|0;while(1){l=a[k]|0;if((l<<24>>24|0)==0){break}else if((l<<24>>24|0)==92|(l<<24>>24|0)==58){a[k]=47}k=k+1|0}_i(25440,(e=i,i=i+8|0,c[e>>2]=c[j>>2],e)|0);i=e;k=h+1|0;l=c[d>>2]|0;if((k|0)<(l|0)){h=k}else{m=l;break}}}else{m=f}_i(24424,(e=i,i=i+8|0,c[e>>2]=m,e)|0);i=e;if((c[209560]|0)==0){aj(0,57592,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e}if((g|0)==0){i=b;return}e=c[g>>2]|0;if((e|0)!=0){m=0;f=e;do{mj(f);m=m+1|0;f=c[g+(m<<2)>>2]|0;}while((f|0)!=0)}mj(g);i=b;return}function ql(){var a=0,b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0;a=i;_i(24136,(b=i,i=i+1|0,i=i+7&-8,c[b>>2]=0,b)|0);i=b;d=c[209560]|0;if((d|0)!=0){e=d;do{d=e+4|0;f=c[d>>2]|0;do{if((f|0)==0){g=c[e+8>>2]|0;_i(22072,(b=i,i=i+24|0,c[b>>2]=g,c[b+8>>2]=47,c[b+16>>2]=g+8192,b)|0);i=b}else{g=c[f+16396>>2]|0;_i(23856,(b=i,i=i+16|0,c[b>>2]=f+4096,c[b+8>>2]=g,b)|0);i=b;g=c[209566]|0;a:do{if((g|0)!=0){b:do{if((g|0)>0){h=c[(c[d>>2]|0)+16388>>2]|0;j=0;while(1){k=j+1|0;if((h|0)==(c[805472+(j<<2)>>2]|0)){break}if((k|0)<(g|0)){j=k}else{break b}}_i(23408,(b=i,i=i+1|0,i=i+7&-8,c[b>>2]=0,b)|0);i=b;break a}}while(0);_i(23592,(b=i,i=i+1|0,i=i+7&-8,c[b>>2]=0,b)|0);i=b}}while(0);if((Lk(c[d>>2]|0)|0)==0){_i(22264,(b=i,i=i+1|0,i=i+7&-8,c[b>>2]=0,b)|0);i=b;break}else{_i(22784,(b=i,i=i+1|0,i=i+7&-8,c[b>>2]=0,b)|0);i=b;break}}}while(0);e=c[e>>2]|0;}while((e|0)!=0)}_i(21832,(b=i,i=i+1|0,i=i+7&-8,c[b>>2]=0,b)|0);i=b;e=1;do{if((c[787040+(e*288|0)>>2]|0)!=0){_i(21424,(b=i,i=i+16|0,c[b>>2]=e,c[b+8>>2]=787072+(e*288|0),b)|0);i=b}e=e+1|0;}while((e|0)<64);i=a;return}function rl(){var a=0,b=0,d=0,e=0,f=0,g=0,h=0,j=0;a=i;i=i+8|0;b=a|0;if((xi()|0)!=2){_i(21144,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d;i=a;return}e=yi(1)|0;f=c[209560]|0;if((f|0)==0){aj(0,57592,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d}else{g=f}while(1){if((Zk(e,g,b,0,0)|0)>-1){h=c[b>>2]|0;if((h|0)!=0){break}}f=c[g>>2]|0;if((f|0)==0){j=8;break}else{g=f}}if((j|0)==8){c[b>>2]=0;i=a;return}if((c[209560]|0)==0){aj(0,57592,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d}d=787040+(h*288|0)|0;if((c[787064+(h*288|0)>>2]|0)==1){b=d;Vn(c[b>>2]|0)|0;if((c[787044+(h*288|0)>>2]|0)!=0){Un(c[b>>2]|0)|0}Zx(d|0,0,288)|0;i=a;return}else{b=c[d>>2]|0;if((b|0)!=0){Ta(b|0)|0}Zx(d|0,0,288)|0;i=a;return}}function sl(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;if((Zk(a,b,0,0,0)|0)<=0){e=0;i=d;return e|0}f=c[b+4>>2]|0;if((f|0)!=0){_i(20952,(g=i,i=i+16|0,c[g>>2]=a,c[g+8>>2]=f+4096,g)|0);i=g;e=1;i=d;return e|0}f=c[b+8>>2]|0;if((f|0)==0){e=0;i=d;return e|0}_i(20800,(g=i,i=i+16|0,c[g>>2]=a,c[g+8>>2]=f+4096,g)|0);i=g;e=1;i=d;return e|0}function tl(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0;b=i;d=yi(1)|0;e=a[d]|0;if((e<<24>>24|0)==0){_i(20496,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;i=b;return}else if((e<<24>>24|0)==47|(e<<24>>24|0)==92){g=d+1|0}else{g=d}d=c[209560]|0;a:do{if((d|0)!=0){e=d;while(1){if((Zk(g,e,0,0,0)|0)>0){h=c[e+4>>2]|0;if((h|0)!=0){j=7;break}k=c[e+8>>2]|0;if((k|0)!=0){j=9;break}}e=c[e>>2]|0;if((e|0)==0){break a}}if((j|0)==7){_i(20952,(f=i,i=i+16|0,c[f>>2]=g,c[f+8>>2]=h+4096,f)|0);i=f;i=b;return}else if((j|0)==9){_i(20800,(f=i,i=i+16|0,c[f>>2]=g,c[f+8>>2]=k+4096,f)|0);i=f;i=b;return}}}while(0);_i(20272,(f=i,i=i+8|0,c[f>>2]=g,f)|0);i=f;i=b;return}function ul(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;e=i;i=i+8216|0;f=e|0;g=e+4096|0;h=e+8200|0;j=e+8208|0;k=g|0;l=c[209560]|0;a:do{if((l|0)!=0){m=l;b:while(1){n=m+8|0;o=c[n>>2]|0;do{if((o|0)!=0){if((tn(o|0,b)|0)!=0){break}if((tn((c[n>>2]|0)+8192|0,d)|0)==0){break b}}}while(0);m=c[m>>2]|0;if((m|0)==0){break a}}p=4097;q=0;i=e;return}}while(0);rn(838312,d,4096);l=f|0;c[654338]=c[654338]^1;f=(d|0)==0;if(f){r=8}else{if((a[d]|0)==0){r=8}else{s=d}}if((r|0)==8){s=838312}xn(l,4096,37168,(m=i,i=i+16|0,c[m>>2]=s,c[m+8>>2]=2551536,m)|0)|0;i=m;s=0;n=l;c:while(1){o=a[n]|0;do{if((o<<24>>24|0)==47|(o<<24>>24|0)==92){if((s|0)==0){a[n]=47;t=1;break}else{_x(n|0,n+1|0,Wx(n|0)|0)|0;t=s;break}}else if((o<<24>>24|0)==0){break c}else{t=0}}while(0);s=t;n=n+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(m=i,i=i+16|0,c[m>>2]=b,c[m+8>>2]=l,m)|0)|0;i=m;rn(k,2617360+(c[654338]<<12)|0,4097);a[g+((Wx(k|0)|0)-1)|0]=0;g=ud(k|0,41952,0,h|0,0)|0;Gc(g|0,c[h>>2]|0,4,32);if((c[209566]|0)==0){n=ud(k|0,19720,0,j|0,0)|0;Gc(n|0,c[j>>2]|0,4,32);u=n}else{c[j>>2]=0;u=0}n=0;t=0;d:while(1){s=g+(t<<2)|0;o=n;e:while(1){v=(o|0)<(c[j>>2]|0);if((t|0)<(c[h>>2]|0)){if(!v){r=31;break}w=c[s>>2]|0;x=c[u+(o<<2)>>2]|0;y=x;z=w;while(1){A=a[z]|0;B=A<<24>>24;C=a[y]|0;D=C<<24>>24;E=(A-97&255)>>>0<26>>>0?B-32|0:B;B=(C-97&255)>>>0<26>>>0?D-32|0:D;if((E|0)==92|(E|0)==58){F=47}else{F=E}if((B|0)==92|(B|0)==58){G=47}else{G=B}if((F|0)<(G|0)){H=w;break e}if((F|0)>(G|0)|(F|0)==0){I=x;break}else{y=y+1|0;z=z+1|0}}}else{if(!v){break d}I=c[u+(o<<2)>>2]|0}z=u+(o<<2)|0;y=Wx(I|0)|0;do{if((y|0)>=7){if((tn(I+(y-7)|0,19264)|0)!=0){break}x=c[z>>2]|0;c[654338]=c[654338]^1;if(f){r=49}else{if((a[d]|0)==0){r=49}else{J=d}}if((r|0)==49){r=0;J=838312}xn(l,4096,37168,(m=i,i=i+16|0,c[m>>2]=J,c[m+8>>2]=x,m)|0)|0;i=m;x=0;w=l;f:while(1){B=a[w]|0;do{if((B<<24>>24|0)==47|(B<<24>>24|0)==92){if((x|0)==0){a[w]=47;K=1;break}else{_x(w|0,w+1|0,Wx(w|0)|0)|0;K=x;break}}else if((B<<24>>24|0)==0){break f}else{K=0}}while(0);x=K;w=w+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(m=i,i=i+16|0,c[m>>2]=b,c[m+8>>2]=l,m)|0)|0;i=m;w=2617360+(c[654338]<<12)|0;x=oj(12)|0;B=oj(12288)|0;E=x+8|0;c[E>>2]=B;rn(B,k,4096);rn((c[E>>2]|0)+4096|0,w,4096);rn((c[E>>2]|0)+8192|0,c[z>>2]|0,4096);c[x>>2]=c[209560];c[209560]=x}}while(0);o=o+1|0}if((r|0)==31){r=0;H=c[s>>2]|0}c[654338]=c[654338]^1;if(f){r=34}else{if((a[d]|0)==0){r=34}else{L=d}}if((r|0)==34){r=0;L=838312}xn(l,4096,37168,(m=i,i=i+16|0,c[m>>2]=L,c[m+8>>2]=H,m)|0)|0;i=m;z=0;y=l;g:while(1){v=a[y]|0;do{if((v<<24>>24|0)==47|(v<<24>>24|0)==92){if((z|0)==0){a[y]=47;M=1;break}else{_x(y|0,y+1|0,Wx(y|0)|0)|0;M=z;break}}else if((v<<24>>24|0)==0){break g}else{M=0}}while(0);z=M;y=y+1|0}xn(2617360+(c[654338]<<12)|0,4096,31752,(m=i,i=i+16|0,c[m>>2]=b,c[m+8>>2]=l,m)|0)|0;i=m;y=jl(2617360+(c[654338]<<12)|0,c[s>>2]|0)|0;if((y|0)!=0){rn(y|0,k,4096);rn(y+12288|0,d,4096);c[209564]=(c[209564]|0)+(c[y+16396>>2]|0);z=oj(12)|0;c[z+4>>2]=y;c[z>>2]=c[209560];c[209560]=z}n=o;t=t+1|0}pc(g|0);pc(u|0);u=oj(12)|0;g=oj(12288)|0;t=u+8|0;c[t>>2]=g;rn(g,b,4096);rn((c[t>>2]|0)+4096|0,k,4096);rn((c[t>>2]|0)+8192|0,d,4096);c[u>>2]=c[209560];c[209560]=u;p=4097;q=0;i=e;return}function vl(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;e=c[d>>2]|0;d=c[b>>2]|0;while(1){b=a[d]|0;f=b<<24>>24;g=a[e]|0;h=g<<24>>24;i=(b-97&255)>>>0<26>>>0?f-32|0:f;f=(g-97&255)>>>0<26>>>0?h-32|0:h;if((i|0)==92|(i|0)==58){j=47}else{j=i}if((f|0)==92|(f|0)==58){k=47}else{k=f}if((j|0)<(k|0)){l=-1;m=9;break}if((j|0)>(k|0)){l=1;m=9;break}if((j|0)==0){l=0;m=9;break}else{e=e+1|0;d=d+1|0}}if((m|0)==9){return l|0}return 0}function wl(a,b){a=a|0;b=b|0;var d=0;b=c[a>>2]|0;d=c[b>>2]|0;if((b|0)!=0){Gx(b)}Gx(a);c[469154]=(c[469154]|0)-1;ae[c[d+4>>2]&127](d,0);return}function xl(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;a=i;d=0;a:do{do{if((c[787052+(d*288|0)>>2]|0)!=0){if((c[209560]|0)==0){e=4;break a}f=787040+(d*288|0)|0;if((c[787064+(d*288|0)>>2]|0)==1){g=f;Vn(c[g>>2]|0)|0;if((c[787044+(d*288|0)>>2]|0)!=0){Un(c[g>>2]|0)|0}Zx(f|0,0,288)|0;break}else{g=c[f>>2]|0;if((g|0)!=0){Ta(g|0)|0}Zx(f|0,0,288)|0;break}}}while(0);d=d+1|0;}while((d|0)<64);if((e|0)==4){aj(0,57592,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e}e=c[209560]|0;if((e|0)==0){c[209560]=0;Ri(17592);Ri(17304);Ri(17200);Ri(17112);Ri(16952);h=Xi(32,4)|0;j=h|0;k=c[j>>2]|0;l=k;c[l>>2]=b;Zc(h|0);i=a;return}else{m=e}while(1){e=c[m>>2]|0;d=c[m+4>>2]|0;if((d|0)!=0){Un(c[d+16384>>2]|0)|0;mj(c[d+16412>>2]|0);mj(d|0)}d=c[m+8>>2]|0;if((d|0)!=0){mj(d|0)}mj(m);if((e|0)==0){break}else{m=e}}c[209560]=0;Ri(17592);Ri(17304);Ri(17200);Ri(17112);Ri(16952);h=Xi(32,4)|0;j=h|0;k=c[j>>2]|0;l=k;c[l>>2]=b;Zc(h|0);i=a;return}function yl(){var b=0,d=0,e=0,f=0,g=0;b=i;a[2609160]=0;d=c[209560]|0;if((d|0)==0){i=b;return 2609160}else{e=d}do{d=c[e+4>>2]|0;if((d|0)!=0){f=Hn(16792,(g=i,i=i+8|0,c[g>>2]=c[d+16388>>2],g)|0)|0;i=g;vn(2609160,8192,f)}e=c[e>>2]|0;}while((e|0)!=0);i=b;return 2609160}function zl(){var b=0,d=0,e=0,f=0;a[2600968]=0;b=c[209560]|0;if((b|0)==0){return 2600968}else{d=b}do{b=d+4|0;e=c[b>>2]|0;if((e|0)!=0){if((a[2600968]|0)==0){f=e}else{vn(2600968,8192,16680);f=c[b>>2]|0}vn(2600968,8192,f+8192|0)}d=c[d>>2]|0;}while((d|0)!=0);return 2600968}function Al(){var b=0,d=0,e=0,f=0,g=0;b=i;a[2592776]=0;d=c[209560]|0;if((d|0)==0){i=b;return 2592776}else{e=d}do{d=c[e+4>>2]|0;if((d|0)!=0){f=Hn(16792,(g=i,i=i+8|0,c[g>>2]=c[d+16392>>2],g)|0)|0;i=g;vn(2592776,8192,f)}e=c[e>>2]|0;}while((e|0)!=0);i=b;return 2592776}function Bl(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0;b=i;a[2584584]=0;d=c[209560]|0;if((d|0)==0){i=b;return 2584584}else{e=d}do{d=e+4|0;f=c[d>>2]|0;do{if((f|0)!=0){if((c[f+16400>>2]|0)==0){g=c[(c[430924]|0)+4>>2]|0;if((Cn(f+12288|0,g,Wx(g|0)|0)|0)==0){break}h=c[d>>2]|0}else{h=f}g=Hn(16792,(j=i,i=i+8|0,c[j>>2]=c[h+16388>>2],j)|0)|0;i=j;vn(2584584,8192,g)}}while(0);e=c[e>>2]|0;}while((e|0)!=0);i=b;return 2584584}function Cl(){var b=0,d=0,e=0,f=0;a[2576392]=0;b=c[209560]|0;if((b|0)==0){return 2576392}else{d=b}do{b=d+4|0;e=c[b>>2]|0;do{if((e|0)!=0){if((c[e+16400>>2]|0)==0){f=c[(c[430924]|0)+4>>2]|0;if((Cn(e+12288|0,f,Wx(f|0)|0)|0)==0){break}}if((a[2576392]|0)!=0){vn(2576392,8192,16680)}vn(2576392,8192,(c[b>>2]|0)+12288|0);vn(2576392,8192,19720);vn(2576392,8192,(c[b>>2]|0)+8192|0)}}while(0);d=c[d>>2]|0;}while((d|0)!=0);return 2576392}function Dl(a){a=a|0;var b=0,d=0,e=0;b=c[209560]|0;if((b|0)==0){return}d=(a|0)!=0?~a:0;a=b;do{b=c[a+4>>2]|0;if((b|0)!=0){e=b+16400|0;c[e>>2]=c[e>>2]&d}a=c[a>>2]|0;}while((a|0)!=0);return}function El(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;Mi(b);b=xi()|0;f=(b|0)>4096?4096:b;c[209566]=f;b=(f|0)>0;if(b){g=0;do{c[805472+(g<<2)>>2]=Vc(yi(g)|0)|0;g=g+1|0;}while((g|0)<(f|0));h=c[209566]|0}else{h=f}if((h|0)!=0){$i(16544,(h=i,i=i+1|0,i=i+7&-8,c[h>>2]=0,h)|0);i=h}if(b){b=0;do{h=821856+(b<<2)|0;g=c[h>>2]|0;if((g|0)!=0){mj(g)}c[h>>2]=0;b=b+1|0;}while((b|0)<(f|0))}if((d|0)==0){i=e;return}if((a[d]|0)==0){i=e;return}Mi(d);d=xi()|0;f=(d|0)>4096?4096:d;if((f|0)>0){j=0}else{i=e;return}do{c[821856+(j<<2)>>2]=qj(yi(j)|0)|0;j=j+1|0;}while((j|0)<(f|0));i=e;return}function Fl(a,b){a=a|0;b=b|0;var d=0,e=0;b=i;d=c[a>>2]|0;e=c[d>>2]|0;if((d|0)!=0){Gx(d)}Gx(a);c[469154]=(c[469154]|0)-1;if((gl(60936,0,0,0)|0)<1){aj(0,60816,(a=i,i=i+1|0,i=i+7&-8,c[a>>2]=0,a)|0);i=a}else{rn(777472,c[(c[210610]|0)+4>>2]|0,4096);rn(773376,c[(c[209576]|0)+4>>2]|0,4096);ae[c[e+4>>2]&127](e,0);i=b;return}}function Gl(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;fj(60336);fj(59992);fj(59872);d=fk(59872)|0;e=c[(c[430924]|0)+4>>2]|0;f=d;while(1){d=a[f]|0;g=d<<24>>24;h=a[e]|0;i=h<<24>>24;j=(d-97&255)>>>0<26>>>0?g-32|0:g;g=(h-97&255)>>>0<26>>>0?i-32|0:i;if((j|0)==92|(j|0)==58){k=47}else{k=j}if((g|0)==92|(g|0)==58){l=47}else{l=g}if((k|0)!=(l|0)){break}if((k|0)==0){m=8;break}else{e=e+1|0;f=f+1|0}}if((m|0)==8){nk(59872,2551536)}m=Xi(44,4)|0;c[c[m>>2]>>2]=b;Hl(c[(c[430924]|0)+4>>2]|0,m);return}function Hl(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;_i(59472,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;c[209564]=0;c[210602]=jk(59392,59312,0)|0;c[210608]=jk(59272,58776,20)|0;c[209568]=jk(58512,2551536,68)|0;c[210604]=jk(58416,2551536,64)|0;c[210610]=jk(60336,_w()|0,8208)|0;c[210612]=jk(58360,2551536,16)|0;f=Jc()|0;if((f|0)==0){g=3}else{if((a[f]|0)==0){g=3}else{h=f}}if((g|0)==3){h=c[(c[210610]|0)+4>>2]|0}c[209574]=jk(59992,h,8208)|0;c[209576]=jk(59872,2551536,24)|0;h=Xi(28,4100)|0;g=c[h>>2]|0;rn(g,b,4096);c[g+4096>>2]=d;Td(h|0);i=e;return}function Il(a,b){a=a|0;b=b|0;var d=0,e=0;d=Xi(16,8)|0;e=c[d>>2]|0;c[e>>2]=a;c[e+4>>2]=b;xl(0,d);return}function Jl(a,b){a=a|0;b=b|0;var d=0;c[210606]=c[c[a>>2]>>2];b=c[209560]|0;if((b|0)!=0){d=b;do{b=c[d+4>>2]|0;if((b|0)!=0){c[b+16400>>2]=0}d=c[d>>2]|0;}while((d|0)!=0)}c[a+4>>2]=54;Hl(c[(c[430924]|0)+4>>2]|0,a);return}function Kl(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;e=i;a:do{if((d|0)==1){f=Vk(a)|0;c[b>>2]=f;g=((f|0)==0)<<31>>31;h=0;j=f;k=18}else if((d|0)==2){l=0;k=14}else if((d|0)==3){l=1;k=14}else if((d|0)==0){f=c[209560]|0;if((f|0)==0){aj(0,57592,(m=i,i=i+1|0,i=i+7&-8,c[m>>2]=0,m)|0);i=m;return 0}n=(b|0)==0;if(n){o=f;do{p=Zk(a,o,0,1,0)|0;if((p|0)>0){q=0;r=p;k=16;break a}o=c[o>>2]|0;}while((o|0)!=0)}else{o=f;do{p=Zk(a,o,b,1,0)|0;if((p|0)>-1){s=c[b>>2]|0;if((s|0)!=0){t=s;u=0;v=p;k=19;break a}}o=c[o>>2]|0;}while((o|0)!=0)}if(n){w=0;i=e;return w|0}else{c[b>>2]=0;x=0;y=-1;break}}else{aj(0,59800,(m=i,i=i+1|0,i=i+7&-8,c[m>>2]=0,m)|0);i=m;return 0}}while(0);if((k|0)==14){m=Wk(a)|0;c[b>>2]=m;q=l;r=((m|0)==0)<<31>>31;k=16}do{if((k|0)==16){if((b|0)==0){w=r;i=e;return w|0}else{g=r;h=q;j=c[b>>2]|0;k=18;break}}}while(0);if((k|0)==18){if((j|0)==0){x=h;y=g}else{t=j;u=h;v=g;k=19}}do{if((k|0)==19){c[787052+(t*288|0)>>2]=v;c[787068+((c[b>>2]|0)*288|0)>>2]=0;if((d|0)!=0){x=u;y=v;break}c[787068+((c[b>>2]|0)*288|0)>>2]=1;x=u;y=v}}while(0);c[787048+((c[b>>2]|0)*288|0)>>2]=x;w=y;i=e;return w|0}function Ll(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0;h=i;i=i+1032|0;j=h|0;k=h+8|0;l=kl(b,d,0,j,g)|0;g=c[j>>2]|0;ol(l,g);if((g|0)>0){if((e|0)==0){e=0;do{g=l+(e<<2)|0;d=c[g>>2]|0;while(1){b=a[d]|0;if((b<<24>>24|0)==92|(b<<24>>24|0)==58){a[d]=47}else if((b<<24>>24|0)==0){break}d=d+1|0}rn(k,c[g>>2]|0,1024);je[f&127](k);e=e+1|0;}while((e|0)<(c[j>>2]|0))}else{e=0;do{d=l+(e<<2)|0;b=c[d>>2]|0;while(1){m=a[b]|0;if((m<<24>>24|0)==0){break}else if((m<<24>>24|0)==92|(m<<24>>24|0)==58){a[b]=47}b=b+1|0}rn(k,c[d>>2]|0,1024);qn(k,k,1024);je[f&127](k);e=e+1|0;}while((e|0)<(c[j>>2]|0))}}if((c[209560]|0)==0){aj(0,57592,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j}if((l|0)==0){n=1024;o=0;i=h;return}j=c[l>>2]|0;if((j|0)!=0){e=0;k=j;do{mj(k);e=e+1|0;k=c[l+(e<<2)>>2]|0;}while((k|0)!=0)}mj(l);n=1024;o=0;i=h;return}function Ml(){var b=0,d=0;b=c[(c[209576]|0)+4>>2]|0;if((a[b]|0)!=0){d=b;return d|0}d=c[(c[430924]|0)+4>>2]|0;return d|0}function Nl(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;d=i;e=c[b>>2]|0;f=c[e+4>>2]|0;if((e|0)!=0){Gx(e)}Gx(b);c[469154]=(c[469154]|0)-1;if((gl(60936,0,0,0)|0)<1){if((a[777472]|0)==0){aj(0,60816,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e}El(2551536,2551536);nk(60336,777472);nk(59872,773376);a[777472]=0;a[773376]=0;c[b+4>>2]=60;e=c[210606]|0;g=Xi(16,8)|0;h=c[g>>2]|0;c[h>>2]=e;c[h+4>>2]=b;xl(0,g);i=d;return}do{if((tn(c[(c[209576]|0)+4>>2]|0,773376)|0)!=0){if((ej()|0)!=0){break}Ai(59640)}}while(0);rn(777472,c[(c[210610]|0)+4>>2]|0,4096);rn(773376,c[(c[209576]|0)+4>>2]|0,4096);ae[c[f+4>>2]&127](f,0);i=d;return}function Ol(a,b){a=a|0;b=b|0;b=c[a>>2]|0;if((b|0)!=0){Gx(b)}Gx(a);c[469154]=(c[469154]|0)-1;aj(1,59536,(a=i,i=i+1|0,i=i+7&-8,c[a>>2]=0,a)|0);i=a}function Pl(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+4096|0;e=d|0;f=b|0;g=c[f>>2]|0;rn(e,g,4096);h=c[g+4096>>2]|0;g=c[f>>2]|0;if((g|0)!=0){Gx(g)}Gx(b);c[469154]=(c[469154]|0)-1;b=c[(c[210610]|0)+4>>2]|0;if((a[b]|0)!=0){ul(b,e)}b=c[(c[209574]|0)+4>>2]|0;do{if((a[b]|0)!=0){if((tn(b,c[(c[210610]|0)+4>>2]|0)|0)==0){break}Qk(c[(c[209574]|0)+4>>2]|0)|0;ul(c[(c[209574]|0)+4>>2]|0,e)}}while(0);b=c[(c[210612]|0)+4>>2]|0;do{if((a[b]|0)!=0){if((tn(b,e)|0)==0){break}g=c[(c[210610]|0)+4>>2]|0;if((a[g]|0)!=0){ul(g,c[(c[210612]|0)+4>>2]|0)}g=c[(c[209574]|0)+4>>2]|0;if((a[g]|0)==0){break}if((tn(g,c[(c[210610]|0)+4>>2]|0)|0)==0){break}ul(c[(c[209574]|0)+4>>2]|0,c[(c[210612]|0)+4>>2]|0)}}while(0);b=c[(c[209576]|0)+4>>2]|0;do{if((a[b]|0)!=0){if((tn(b,e)|0)==0){break}g=c[(c[210610]|0)+4>>2]|0;if((a[g]|0)!=0){ul(g,c[(c[209576]|0)+4>>2]|0)}g=c[(c[209574]|0)+4>>2]|0;if((a[g]|0)==0){break}if((tn(g,c[(c[210610]|0)+4>>2]|0)|0)==0){break}ul(c[(c[209574]|0)+4>>2]|0,c[(c[209576]|0)+4>>2]|0)}}while(0);Pi(17592,110);Pi(17304,102);Pi(17200,38);Pi(17112,10);Pi(16952,94);a[3792]=0;e=c[209566]|0;if((e|0)>0){j=0;k=838240}else{ql();l=c[209576]|0;m=l+20|0;c[m>>2]=0;_i(58248,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;o=c[209564]|0;_i(58032,(n=i,i=i+8|0,c[n>>2]=o,n)|0);i=n;p=h+4|0;q=c[p>>2]|0;r=q;ae[r&127](h,0);s=4096;t=0;i=d;return}while(1){b=c[k>>2]|0;a:do{if((b|0)==0){u=k}else{g=805472+(j<<2)|0;f=k;v=b;while(1){w=c[v+4>>2]|0;if((w|0)!=0){if((c[g>>2]|0)==(c[w+16388>>2]|0)){break}}w=v|0;x=c[w>>2]|0;if((x|0)==0){u=k;break a}else{f=w;v=x}}a[3792]=1;g=v|0;c[f>>2]=c[g>>2];c[g>>2]=c[k>>2];c[k>>2]=v;u=g}}while(0);b=j+1|0;if((b|0)<(e|0)){j=b;k=u}else{break}}ql();l=c[209576]|0;m=l+20|0;c[m>>2]=0;_i(58248,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;o=c[209564]|0;_i(58032,(n=i,i=i+8|0,c[n>>2]=o,n)|0);i=n;p=h+4|0;q=c[p>>2]|0;r=q;ae[r&127](h,0);s=4096;t=0;i=d;return}function Ql(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;e=i;i=i+88|0;f=e|0;g=e+64|0;h=g|0;c[h>>2]=1732584193;j=g+4|0;c[j>>2]=-271733879;k=g+8|0;c[k>>2]=-1732584194;l=g+12|0;c[l>>2]=271733878;c[g+16>>2]=0;c[179600]=g;do{if((b|0)==0){Rl(a,0);m=a;n=0}else{if((b|0)<=63){m=a;n=b;break}o=f|0;p=b-64|0;q=a;r=b;while(1){s=0;do{t=s<<2;c[f+(s<<2)>>2]=(d[q+(t|2)|0]|0)<<16|(d[q+(t|3)|0]|0)<<24|(d[q+(t|1)|0]|0)<<8|(d[q+t|0]|0);s=s+1|0;}while((s|0)<16);Sl(o);s=r-64|0;t=(c[179600]|0)+16|0;c[t>>2]=(c[t>>2]|0)+64;if((s|0)>63){q=q+64|0;r=s}else{break}}r=p&-64;m=a+(r+64)|0;n=p-r|0}}while(0);Rl(m,n);c[179600]=g;i=e;return c[j>>2]^c[h>>2]^c[k>>2]^c[l>>2]|0}function Rl(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;f=i;i=i+192|0;g=f|0;h=f+128|0;j=g|0;k=(c[179600]|0)+16|0;l=(c[k>>2]|0)+e|0;c[k>>2]=l;k=l<<3;Zx(j|0,0,128)|0;do{if((e|0)==0){a[j]=-128}else{Vx(j|0,b|0,e)|0;a[g+e|0]=-128;if((e|0)<56){break}a[g+120|0]=k;a[g+121|0]=l>>>5;a[g+122|0]=l>>>13;a[g+123|0]=l>>>21;m=0;do{n=m<<2;c[h+(m<<2)>>2]=(d[g+(n|2)|0]|0)<<16|(d[g+(n|3)|0]|0)<<24|(d[g+(n|1)|0]|0)<<8|(d[g+n|0]|0);m=m+1|0;}while((m|0)<16);m=h|0;Sl(m);n=0;do{o=n<<2;c[h+(n<<2)>>2]=(d[g+((o|2)+64)|0]|0)<<16|(d[g+((o|3)+64)|0]|0)<<24|(d[g+((o|1)+64)|0]|0)<<8|(d[g+(o+64)|0]|0);n=n+1|0;}while((n|0)<16);Sl(m);p=64;q=0;r=128;s=0;i=f;return}}while(0);a[g+56|0]=k;a[g+57|0]=l>>>5;a[g+58|0]=l>>>13;a[g+59|0]=l>>>21;l=0;do{k=l<<2;c[h+(l<<2)>>2]=(d[g+(k|2)|0]|0)<<16|(d[g+(k|3)|0]|0)<<24|(d[g+(k|1)|0]|0)<<8|(d[g+k|0]|0);l=l+1|0;}while((l|0)<16);Sl(h|0);p=64;q=0;r=128;s=0;i=f;return}function Sl(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;b=i;d=i;i=i+64|0;Vx(d|0,a|0,64)|0;a=c[179600]|0;e=c[a>>2]|0;f=c[a+4>>2]|0;g=c[a+8>>2]|0;h=c[a+12>>2]|0;a=c[d>>2]|0;j=a+e+(h&~f|g&f)|0;k=j<<3|j>>>29;j=c[d+4>>2]|0;l=j+h+(k&f|g&~k)|0;m=l<<7|l>>>25;l=c[d+8>>2]|0;n=l+g+(m&k|f&~m)|0;o=n<<11|n>>>21;n=c[d+12>>2]|0;p=n+f+(o&m|k&~o)|0;q=p<<19|p>>>13;p=c[d+16>>2]|0;r=p+k+(q&o|m&~q)|0;k=r<<3|r>>>29;r=c[d+20>>2]|0;s=m+r+(k&q|o&~k)|0;m=s<<7|s>>>25;s=c[d+24>>2]|0;t=o+s+(m&k|q&~m)|0;o=t<<11|t>>>21;t=c[d+28>>2]|0;u=q+t+(o&m|k&~o)|0;q=u<<19|u>>>13;u=c[d+32>>2]|0;v=k+u+(q&o|m&~q)|0;k=v<<3|v>>>29;v=c[d+36>>2]|0;w=m+v+(k&q|o&~k)|0;m=w<<7|w>>>25;w=c[d+40>>2]|0;x=o+w+(m&k|q&~m)|0;o=x<<11|x>>>21;x=c[d+44>>2]|0;y=q+x+(o&m|k&~o)|0;q=y<<19|y>>>13;y=c[d+48>>2]|0;z=k+y+(q&o|m&~q)|0;k=z<<3|z>>>29;z=c[d+52>>2]|0;A=m+z+(k&q|o&~k)|0;m=A<<7|A>>>25;A=c[d+56>>2]|0;B=o+A+(m&k|q&~m)|0;o=B<<11|B>>>21;B=o&m;C=c[d+60>>2]|0;d=q+C+(B|k&~o)|0;q=d<<19|d>>>13;d=q&o;D=a+1518500249+k+(q&m|B|d)|0;B=D<<3|D>>>29;D=B&q;k=p+1518500249+m+(B&o|d|D)|0;d=k<<5|k>>>27;k=d&B;m=u+1518500249+o+(d&q|D|k)|0;D=m<<9|m>>>23;m=D&d;o=y+1518500249+q+(D&B|k|m)|0;k=o<<13|o>>>19;o=k&D;q=j+1518500249+B+(k&d|m|o)|0;m=q<<3|q>>>29;q=m&k;B=r+1518500249+d+(m&D|o|q)|0;o=B<<5|B>>>27;B=o&m;d=v+1518500249+D+(o&k|q|B)|0;q=d<<9|d>>>23;d=q&o;D=z+1518500249+k+(q&m|B|d)|0;B=D<<13|D>>>19;D=B&q;k=l+1518500249+m+(B&o|d|D)|0;d=k<<3|k>>>29;k=d&B;m=s+1518500249+o+(d&q|D|k)|0;D=m<<5|m>>>27;m=D&d;o=w+1518500249+q+(D&B|k|m)|0;k=o<<9|o>>>23;o=k&D;q=A+1518500249+B+(k&d|m|o)|0;m=q<<13|q>>>19;q=m&k;B=n+1518500249+d+(m&D|o|q)|0;o=B<<3|B>>>29;B=o&m;d=t+1518500249+D+(o&k|q|B)|0;q=d<<5|d>>>27;d=q&o;D=x+1518500249+k+(q&m|B|d)|0;B=D<<9|D>>>23;D=C+1518500249+m+(B&(q|o)|d)|0;d=D<<13|D>>>19;D=a+1859775393+o+(B^q^d)|0;o=D<<3|D>>>29;D=u+1859775393+q+(d^B^o)|0;q=D<<9|D>>>23;D=p+1859775393+B+(o^d^q)|0;B=D<<11|D>>>21;D=y+1859775393+d+(q^o^B)|0;d=D<<15|D>>>17;D=l+1859775393+o+(B^q^d)|0;o=D<<3|D>>>29;D=w+1859775393+q+(d^B^o)|0;q=D<<9|D>>>23;D=s+1859775393+B+(o^d^q)|0;B=D<<11|D>>>21;D=A+1859775393+d+(q^o^B)|0;d=D<<15|D>>>17;D=j+1859775393+o+(B^q^d)|0;o=D<<3|D>>>29;D=v+1859775393+q+(d^B^o)|0;q=D<<9|D>>>23;D=r+1859775393+B+(o^d^q)|0;B=D<<11|D>>>21;D=z+1859775393+d+(q^o^B)|0;d=D<<15|D>>>17;D=n+1859775393+o+(B^q^d)|0;o=D<<3|D>>>29;D=x+1859775393+q+(d^B^o)|0;q=D<<9|D>>>23;D=t+1859775393+B+(o^d^q)|0;B=D<<11|D>>>21;D=C+1859775393+d+(q^o^B)|0;d=c[179600]|0;c[d>>2]=o+e;c[d+4>>2]=(D<<15|D>>>17)+f;c[d+8>>2]=B+g;c[d+12>>2]=q+h;i=b;return}function Tl(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;if(!(a[3072]|0)){a[3072]=1;cn(659904);f=0;do{g=2048+(f<<2)|0;if((c[g>>2]|0)>0){h=f&255;i=0;do{Ym(659904,h);Ym(688604,h);i=i+1|0;}while((i|0)<(c[g>>2]|0))}f=f+1|0;}while((f|0)<256)}Zx(b|0,0,32)|0;c[b+12>>2]=d;c[b+16>>2]=e;return}function Ul(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;if(!(a[3072]|0)){a[3072]=1;cn(659904);f=0;do{g=2048+(f<<2)|0;if((c[g>>2]|0)>0){h=f&255;i=0;do{Ym(659904,h);Ym(688604,h);i=i+1|0;}while((i|0)<(c[g>>2]|0))}f=f+1|0;}while((f|0)<256)}Zx(b|0,0,32)|0;c[b+12>>2]=d;c[b+16>>2]=e;c[b+8>>2]=1;return}function Vl(a){a=a|0;c[a+20>>2]=0;c[a+4>>2]=0;c[a+28>>2]=0;return}function Wl(a){a=a|0;c[a+8>>2]=0;return}function Xl(a){a=a|0;c[a+24>>2]=0;c[a+28>>2]=0;c[a+8>>2]=1;return}function Yl(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=i;g=e+20|0;if((c[g>>2]|0)>(d|0)){aj(1,57872,(d=i,i=i+1|0,i=i+7&-8,c[d>>2]=0,d)|0);i=d}else{Vx(a|0,e|0,32)|0;c[a+12>>2]=b;Vx(b|0,c[e+12>>2]|0,c[g>>2]|0)|0;i=f;return}}function Zl(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;f=i;c[164920]=(c[164920]|0)+e;g=b+20|0;if(((c[b+16>>2]|0)-(c[g>>2]|0)|0)<4){c[b+4>>2]=1;i=f;return}if((e|0)==0|(e|0)<-31|(e|0)>32){aj(1,59e3,(h=i,i=i+8|0,c[h>>2]=e,h)|0);i=h}do{if((e|0)!=32){if((e|0)>0){if(!((1<<e|0)<=(d|0)|(d|0)<0)){break}c[164908]=(c[164908]|0)+1;break}else{j=1<<e-1;if(!((j|0)<=(d|0)|(d|0)<(-j|0))){break}c[164908]=(c[164908]|0)+1;break}}}while(0);j=(e|0)<0?-e|0:e;if((c[b+8>>2]|0)!=0){if((j|0)==8){a[(c[b+12>>2]|0)+(c[g>>2]|0)|0]=d;c[g>>2]=(c[g>>2]|0)+1;e=b+28|0;c[e>>2]=(c[e>>2]|0)+8;i=f;return}else if((j|0)==32){e=(c[b+12>>2]|0)+(c[g>>2]|0)|0;z=d;a[e]=z;z=z>>8;a[e+1|0]=z;z=z>>8;a[e+2|0]=z;z=z>>8;a[e+3|0]=z;c[g>>2]=(c[g>>2]|0)+4;e=b+28|0;c[e>>2]=(c[e>>2]|0)+32;i=f;return}else if((j|0)==16){e=(c[b+12>>2]|0)+(c[g>>2]|0)|0;z=d&65535;a[e]=z;z=z>>8;a[e+1|0]=z;c[g>>2]=(c[g>>2]|0)+2;e=b+28|0;c[e>>2]=(c[e>>2]|0)+16;i=f;return}else{aj(1,48440,(h=i,i=i+8|0,c[h>>2]=j,h)|0);i=h}}h=-1>>>((32-j|0)>>>0)&d;d=j&7;if((d|0)==0){k=h;l=j}else{e=b+12|0;m=b+28|0;n=0;o=h;do{Wm(o&1,c[e>>2]|0,m);o=o>>1;n=n+1|0;}while((n|0)<(d|0));k=o;l=j-d|0}if((l|0)>0){d=b+12|0;j=b+28|0;o=0;n=k;while(1){an(659904,n&255,c[d>>2]|0,j);k=o+8|0;if((k|0)<(l|0)){o=k;n=n>>8}else{break}}}c[g>>2]=(c[b+28>>2]>>3)+1;i=f;return}function _l(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;e=i;i=i+8|0;f=e|0;g=(b|0)<0?-b|0:b;do{if((c[a+8>>2]|0)==0){h=g&7;if((h|0)==0){j=g;k=0;l=0}else{m=a+12|0;n=a+28|0;o=0;p=0;do{o=(Xm(c[m>>2]|0,n)|0)<<p|o;p=p+1|0;}while((p|0)<(h|0));j=g-h|0;k=h;l=o}if((j|0)>0){p=a+12|0;n=a+28|0;m=l;q=0;while(1){_m(c[172153]|0,f,c[p>>2]|0,n);r=c[f>>2]<<(q|k)|m;s=q+8|0;if((s|0)<(j|0)){m=r;q=s}else{t=r;break}}}else{t=l}c[a+24>>2]=(c[a+28>>2]>>3)+1;u=j;v=t}else{if((g|0)==8){q=a+24|0;m=c[q>>2]|0;n=d[(c[a+12>>2]|0)+m|0]|0;c[q>>2]=m+1;m=a+28|0;c[m>>2]=(c[m>>2]|0)+8;u=8;v=n;break}else if((g|0)==16){n=a+24|0;m=c[n>>2]|0;q=(c[a+12>>2]|0)+m|0;p=(d[q]|d[q+1|0]<<8)<<16>>16<<16>>16;c[n>>2]=m+2;m=a+28|0;c[m>>2]=(c[m>>2]|0)+16;u=16;v=p;break}else if((g|0)==32){p=a+24|0;m=c[p>>2]|0;n=(c[a+12>>2]|0)+m|0;q=d[n]|d[n+1|0]<<8|d[n+2|0]<<16|d[n+3|0]<<24|0;c[p>>2]=m+4;m=a+28|0;c[m>>2]=(c[m>>2]|0)+32;u=32;v=q;break}else{aj(1,41312,(q=i,i=i+8|0,c[q>>2]=g,q)|0);i=q;return 0}}}while(0);if((b|0)>-1){w=v;i=e;return w|0}if((1<<u-1&v|0)==0){w=v;i=e;return w|0}w=-1<<u|v;i=e;return w|0}function $l(a,b){a=a|0;b=b|0;Zl(a,b,8);return}function am(a,b,c){a=a|0;b=b|0;c=c|0;var e=0;if((c|0)>0){e=0}else{return}do{Zl(a,d[b+e|0]|0,8);e=e+1|0;}while((e|0)<(c|0));return}function bm(a,b){a=a|0;b=b|0;Zl(a,b,16);return}function cm(a,b){a=a|0;b=b|0;Zl(a,b,32);return}function dm(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;i=i+1024|0;g=f|0;if((e|0)==0){Zl(b,0,8);i=f;return}h=Wx(e|0)|0;if((h|0)>1023){_i(31224,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j;Zl(b,0,8);i=f;return}rn(g|0,e,1024);if((h|0)>0){e=0;do{j=g+e|0;k=a[j]|0;if(k<<24>>24<0|k<<24>>24==37){a[j]=46}e=e+1|0;}while((e|0)<(h|0))}if((h|0)>-1){l=0}else{i=f;return}while(1){Zl(b,d[g+l|0]|0,8);if((l|0)<(h|0)){l=l+1|0}else{break}}i=f;return}function em(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;i=i+8192|0;g=f|0;if((e|0)==0){Zl(b,0,8);i=f;return}h=Wx(e|0)|0;if((h|0)>8191){_i(26944,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j;Zl(b,0,8);i=f;return}rn(g|0,e,8192);if((h|0)>0){e=0;do{j=g+e|0;k=a[j]|0;if(k<<24>>24<0|k<<24>>24==37){a[j]=46}e=e+1|0;}while((e|0)<(h|0))}if((h|0)>-1){l=0}else{i=f;return}while(1){Zl(b,d[g+l|0]|0,8);if((l|0)<(h|0)){l=l+1|0}else{break}}i=f;return}function fm(a){a=a|0;var b=0;b=(_l(a,8)|0)&255;return((c[a+24>>2]|0)>(c[a+20>>2]|0)?-1:b)|0}function gm(a){a=a|0;var b=0;b=(_l(a,16)|0)<<16>>16;return((c[a+24>>2]|0)>(c[a+20>>2]|0)?-1:b)|0}function hm(a){a=a|0;var b=0;b=_l(a,32)|0;return((c[a+24>>2]|0)>(c[a+20>>2]|0)?-1:b)|0}function im(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;d=b+24|0;e=b+20|0;f=0;while(1){g=(_l(b,8)|0)&255;h=(c[d>>2]|0)>(c[e>>2]|0)?-1:g;if((h|0)==(-1|0)|(h|0)==0){i=f;j=5;break}else if((h|0)==37){k=46}else{k=h}a[2557952+f|0]=(k|0)>127?46:k&255;h=f+1|0;if(h>>>0<1023>>>0){f=h}else{i=h;j=5;break}}if((j|0)==5){a[2557952+i|0]=0;return 2557952}return 0}function jm(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;d=b+24|0;e=b+20|0;f=0;while(1){g=(_l(b,8)|0)&255;h=(c[d>>2]|0)>(c[e>>2]|0)?-1:g;if((h|0)==37){i=46}else if((h|0)==(-1|0)|(h|0)==10|(h|0)==0){j=f;k=5;break}else{i=h}a[2558976+f|0]=(i|0)>127?46:i&255;h=f+1|0;if(h>>>0<1023>>>0){f=h}else{j=h;k=5;break}}if((k|0)==5){a[2558976+j|0]=0;return 2558976}return 0}function km(b,c){b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0;a:do{if((c|0)>0){d=0;e=0;while(1){f=a[b+e|0]|0;g=f<<24>>24;if(f<<24>>24==0){h=d;break a}if((g&128|0)!=0|f<<24>>24==37){i=(e*46|0)+5474|0}else{i=da(g,e+119|0)|0}g=i+d|0;f=e+1|0;if((f|0)<(c|0)){d=g;e=f}else{h=g;break}}}else{h=0}}while(0);return h>>10^h^h>>20|0}function lm(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;if((_l(b,1)|0)==0){c[f>>2]=_l(b,32)|0}else{g=c[e>>2]|0;c[f>>2]=(_l(b,8)|0)+g}if((_l(b,1)|0)==0){c[f+4>>2]=c[e+4>>2];c[f+8>>2]=c[e+8>>2];c[f+12>>2]=c[e+12>>2];a[f+21|0]=a[e+21|0]|0;a[f+22|0]=a[e+22|0]|0;a[f+23|0]=a[e+23|0]|0;c[f+16>>2]=c[e+16>>2];a[f+20|0]=a[e+20|0]|0;return}g=c[f>>2]^d;d=c[e+4>>2]|0;if((_l(b,1)|0)==0){h=d}else{d=_l(b,16)|0;h=c[785]&g^d}c[f+4>>2]=h;h=c[e+8>>2]|0;if((_l(b,1)|0)==0){i=h}else{h=_l(b,16)|0;i=c[785]&g^h}c[f+8>>2]=i;i=c[e+12>>2]|0;if((_l(b,1)|0)==0){j=i}else{i=_l(b,16)|0;j=c[785]&g^i}c[f+12>>2]=j;j=a[e+21|0]|0;if((_l(b,1)|0)==0){k=j}else{j=_l(b,8)|0;k=(c[777]&g^j)&255}a[f+21|0]=k<<24>>24==-128?-127:k;k=a[e+22|0]|0;if((_l(b,1)|0)==0){l=k}else{k=_l(b,8)|0;l=(c[777]&g^k)&255}a[f+22|0]=l<<24>>24==-128?-127:l;l=a[e+23|0]|0;if((_l(b,1)|0)==0){m=l}else{l=_l(b,8)|0;m=(c[777]&g^l)&255}a[f+23|0]=m<<24>>24==-128?-127:m;m=c[e+16>>2]|0;if((_l(b,1)|0)==0){n=m}else{m=_l(b,16)|0;n=c[785]&g^m}c[f+16>>2]=n;n=a[e+20|0]|0;if((_l(b,1)|0)==0){o=n}else{n=_l(b,8)|0;o=(c[777]&g^n)&255}a[f+20|0]=o;return}function mm(){var a=0,b=0,d=0,e=0;a=i;b=0;do{d=c[658600+(b<<2)>>2]|0;if((d|0)!=0){_i(23344,(e=i,i=i+16|0,c[e>>2]=b,c[e+8>>2]=d,e)|0);i=e}b=b+1|0;}while((b|0)<256);i=a;return}function nm(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0.0;f=i;if((d|0)==0){if((b|0)==0){i=f;return}Zl(a,c[b>>2]|0,10);Zl(a,1,1);i=f;return}h=c[d>>2]|0;if(h>>>0>1023>>>0){aj(0,27896,(j=i,i=i+8|0,c[j>>2]=h,j)|0);i=j}j=b;b=d;d=5984;k=0;l=0;while(1){m=c[d+4>>2]|0;n=l+1|0;o=(c[j+m>>2]|0)==(c[b+m>>2]|0)?k:n;if((n|0)<51){d=d+12|0;k=o;l=n}else{break}}if((o|0)==0){if((e|0)==0){i=f;return}Zl(a,h,10);Zl(a,0,1);Zl(a,0,1);i=f;return}Zl(a,h,10);Zl(a,0,1);Zl(a,1,1);Zl(a,o,8);c[164920]=(c[164920]|0)+51;if((o|0)>0){p=5984;q=0}else{i=f;return}while(1){h=c[p+4>>2]|0;e=b+h|0;l=e;a:do{if((c[j+h>>2]|0)==(c[l>>2]|0)){Zl(a,0,1)}else{Zl(a,1,1);k=p+8|0;if((c[k>>2]|0)!=0){if((c[l>>2]|0)==0){Zl(a,0,1);break}else{Zl(a,1,1);Zl(a,c[l>>2]|0,c[k>>2]|0);break}}r=+g[e>>2];k=~~r;if(r==0.0){Zl(a,0,1);c[164920]=(c[164920]|0)+13;break}Zl(a,1,1);do{if(+(k|0)==r){d=k+4096|0;if(!(d>>>0<8192>>>0)){break}Zl(a,0,1);Zl(a,d,13);break a}}while(0);Zl(a,1,1);Zl(a,c[l>>2]|0,32)}}while(0);l=q+1|0;if((l|0)<(o|0)){p=p+12|0;q=l}else{break}}i=f;return}function om(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0.0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;e=i;i=i+472|0;f=e|0;if((b|0)==0){Zx(f|0,0,468)|0;h=f}else{h=b}b=h;f=d;j=1208;k=0;l=0;while(1){m=c[j+4>>2]|0;n=k+1|0;o=(c[b+m>>2]|0)==(c[f+m>>2]|0)?l:n;if((n|0)<48){j=j+12|0;k=n;l=o}else{break}}Zl(a,o,8);c[164920]=48-o+(c[164920]|0);if((o|0)>0){l=1208;k=0;while(1){j=c[l+4>>2]|0;n=f+j|0;m=n;a:do{if((c[b+j>>2]|0)==(c[m>>2]|0)){Zl(a,0,1)}else{Zl(a,1,1);p=c[l+8>>2]|0;if((p|0)!=0){Zl(a,c[m>>2]|0,p);break}q=+g[n>>2];p=~~q;do{if(+(p|0)==q){r=p+4096|0;if(!(r>>>0<8192>>>0)){break}Zl(a,0,1);Zl(a,r,13);break a}}while(0);Zl(a,1,1);Zl(a,c[m>>2]|0,32)}}while(0);m=k+1|0;if((m|0)<(o|0)){l=l+12|0;k=m}else{s=0;t=0;break}}}else{s=0;t=0}while(1){if((c[d+184+(t<<2)>>2]|0)==(c[h+184+(t<<2)>>2]|0)){u=s}else{u=1<<t|s}k=t+1|0;if((k|0)<16){s=u;t=k}else{v=0;w=0;break}}while(1){if((c[d+248+(w<<2)>>2]|0)==(c[h+248+(w<<2)>>2]|0)){x=v}else{x=1<<w|v}t=w+1|0;if((t|0)<16){v=x;w=t}else{y=0;z=0;break}}while(1){if((c[d+376+(z<<2)>>2]|0)==(c[h+376+(z<<2)>>2]|0)){A=y}else{A=1<<z|y}w=z+1|0;if((w|0)<16){y=A;z=w}else{B=0;C=0;break}}while(1){if((c[d+312+(C<<2)>>2]|0)==(c[h+312+(C<<2)>>2]|0)){D=B}else{D=1<<C|B}z=C+1|0;if((z|0)<16){B=D;C=z}else{break}}C=(u|0)!=0;B=(x|0)==0;h=(A|0)==0;z=(D|0)==0;if(B&(C^1)&h&z){Zl(a,0,1);c[164920]=(c[164920]|0)+4;E=468;F=0;i=e;return}Zl(a,1,1);if(C){Zl(a,1,1);Zl(a,u,16);C=0;do{if((1<<C&u|0)!=0){Zl(a,c[d+184+(C<<2)>>2]|0,16)}C=C+1|0;}while((C|0)<16)}else{Zl(a,0,1)}if(B){Zl(a,0,1)}else{Zl(a,1,1);Zl(a,x,16);B=0;do{if((1<<B&x|0)!=0){Zl(a,c[d+248+(B<<2)>>2]|0,16)}B=B+1|0;}while((B|0)<16)}if(h){Zl(a,0,1)}else{Zl(a,1,1);Zl(a,A,16);h=0;do{if((1<<h&A|0)!=0){Zl(a,c[d+376+(h<<2)>>2]|0,16)}h=h+1|0;}while((h|0)<16)}if(z){Zl(a,0,1);E=468;F=0;i=e;return}Zl(a,1,1);Zl(a,D,16);z=0;do{if((1<<z&D|0)!=0){Zl(a,c[d+312+(z<<2)>>2]|0,32)}z=z+1|0;}while((z|0)<16);E=468;F=0;i=e;return}function pm(a){a=a|0;var b=0,d=0,e=0;b=i;c[143850]=jk(55384,58488,256)|0;c[143852]=jk(48040,58488,256)|0;d=Hn(36360,(e=i,i=i+8|0,c[e>>2]=a&65535,e)|0)|0;i=e;c[154406]=jk(41144,d,16)|0;i=b;return}function qm(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0;g=i;h=d;d=i;i=i+32|0;Vx(d,h,32)|0;Zx(b|0,0,32852)|0;c[b>>2]=a;Vx(b+8|0,d|0,32)|0;c[b+40>>2]=e;c[b+44>>2]=0;c[b+48>>2]=1;c[b+32840>>2]=f;i=g;return}function rm(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;b=i;i=i+1432|0;d=b|0;Ul(d,b+32|0,1400);e=a+48|0;cm(d,c[e>>2]|-2147483648);f=a|0;if((c[f>>2]|0)==0){bm(d,c[(c[154406]|0)+32>>2]|0)}g=c[a+32840>>2]|0;cm(d,(da(c[e>>2]|0,g)|0)^g);g=a+16448|0;h=c[g>>2]|0;j=a+16452|0;k=c[j>>2]|0;l=(h+1300|0)>(k|0)?k-h|0:1300;bm(d,h);bm(d,l);am(d,(c[g>>2]|0)+(a+16456)|0,l);h=d+20|0;sm(c[f>>2]|0,c[h>>2]|0,c[d+12>>2]|0,a+8|0);c[a+32844>>2]=Jd()|0;d=c[h>>2]|0;c[a+32848>>2]=d;if((c[(c[143850]|0)+32>>2]|0)!=0){h=c[e>>2]|0;k=c[g>>2]|0;_i(31056,(m=i,i=i+40|0,c[m>>2]=c[2032+(c[f>>2]<<2)>>2],c[m+8>>2]=d,c[m+16>>2]=h,c[m+24>>2]=k,c[m+32>>2]=l,m)|0);i=m}m=(c[g>>2]|0)+l|0;c[g>>2]=m;if((m|0)!=(c[j>>2]|0)|(l|0)==1300){n=1400;o=0;i=b;return}c[e>>2]=(c[e>>2]|0)+1;c[a+16444>>2]=0;n=1400;o=0;i=b;return}function sm(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;f=i;i=i+64|0;h=e;e=i;i=i+32|0;Vx(e,h,32)|0;h=f|0;j=f+32|0;do{if((c[(c[143850]|0)+32>>2]|0)!=0){if(!((c[d>>2]|0)==-1)){break}_i(54008,(k=i,i=i+8|0,c[k>>2]=b,k)|0);i=k}}while(0);k=c[e>>2]|0;if((k|0)==2){l=a^1;m=740876+(l*22472|0)|0;n=c[m>>2]|0;o=n&15;c[m>>2]=n+1;Vx(718408+(l*22472|0)+(o*1404|0)|0,d|0,b)|0;c[718408+(l*22472|0)+(o*1404|0)+1400>>2]=b;i=f;return}else if((k|0)==1|(k|0)==0){i=f;return}else{do{if((a|0)==0){k=c[(c[469152]|0)+32>>2]|0;if((k|0)<=0){break}o=h;Vx(o|0,e|0,32)|0;l=c[164906]|0;n=pj(48)|0;m=n;p=pj(b)|0;c[n+8>>2]=p;Vx(p|0,d|0,b)|0;c[n+4>>2]=b;Vx(n+12|0,o|0,32)|0;o=Jd()|0;c[n+44>>2]=~~(((k|0)>999?999.0:+(k|0))/+g[(c[423396]|0)+28>>2])+o;c[n>>2]=0;if((c[164906]|0)==0){c[164906]=m;i=f;return}else{q=l}do{if((q|0)==0){r=20;break}s=q|0;q=c[s>>2]|0;}while((q|0)!=0);if((r|0)==20){i=f;return}c[s>>2]=m;i=f;return}else if((a|0)==1){l=c[(c[64864]|0)+32>>2]|0;if((l|0)<=0){break}n=j;Vx(n|0,e|0,32)|0;o=c[164906]|0;k=pj(48)|0;p=k;t=pj(b)|0;c[k+8>>2]=t;Vx(t|0,d|0,b)|0;c[k+4>>2]=b;Vx(k+12|0,n|0,32)|0;n=Jd()|0;c[k+44>>2]=~~(((l|0)>999?999.0:+(l|0))/+g[(c[423396]|0)+28>>2])+n;c[k>>2]=0;if((c[164906]|0)==0){c[164906]=p;i=f;return}else{u=o}do{if((u|0)==0){r=20;break}v=u|0;u=c[v>>2]|0;}while((u|0)!=0);if((r|0)==20){i=f;return}c[v>>2]=p;i=f;return}}while(0);Im(b,d,e);i=f;return}}function tm(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;i=i+1432|0;f=e|0;if((b|0)>16384){aj(1,26688,(g=i,i=i+8|0,c[g>>2]=b,g)|0);i=g}c[a+16448>>2]=0;if((b|0)>1299){c[a+16444>>2]=1;c[a+16452>>2]=b;Vx(a+16456|0,d|0,b)|0;rm(a);h=1400;j=0;i=e;return}Ul(f,e+32|0,1400);k=a+48|0;cm(f,c[k>>2]|0);l=a|0;if((c[l>>2]|0)==0){bm(f,c[(c[154406]|0)+32>>2]|0)}m=c[a+32840>>2]|0;cm(f,(da(c[k>>2]|0,m)|0)^m);c[k>>2]=(c[k>>2]|0)+1;am(f,d,b);b=f+20|0;sm(c[l>>2]|0,c[b>>2]|0,c[f+12>>2]|0,a+8|0);c[a+32844>>2]=Jd()|0;f=c[b>>2]|0;c[a+32848>>2]=f;if((c[(c[143850]|0)+32>>2]|0)==0){h=1400;j=0;i=e;return}b=(c[k>>2]|0)-1|0;k=c[a+44>>2]|0;_i(23272,(g=i,i=i+32|0,c[g>>2]=c[2032+(c[l>>2]<<2)>>2],c[g+8>>2]=f,c[g+16>>2]=b,c[g+24>>2]=k,g)|0);i=g;h=1400;j=0;i=e;return}function um(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;Xl(b);e=hm(b)|0;f=(e|0)<0;g=f?e&2147483647:e;e=a|0;if((c[e>>2]|0)==1){gm(b)|0}h=hm(b)|0;j=c[a+32840>>2]|0;if(((da(j,g)|0)^j|0)!=(h|0)){k=0;i=d;return k|0}if(f){h=gm(b)|0;l=gm(b)|0;m=h}else{l=0;m=0}do{if((c[(c[143850]|0)+32>>2]|0)!=0){h=c[2032+(c[e>>2]<<2)>>2]|0;j=c[b+20>>2]|0;if(f){_i(20064,(n=i,i=i+40|0,c[n>>2]=h,c[n+8>>2]=j,c[n+16>>2]=g,c[n+24>>2]=m,c[n+32>>2]=l,n)|0);i=n;break}else{_i(17904,(n=i,i=i+24|0,c[n>>2]=h,c[n+8>>2]=j,c[n+16>>2]=g,n)|0);i=n;break}}}while(0);e=a+44|0;j=c[e>>2]|0;if((g|0)<=(j|0)){do{if((c[(c[143852]|0)+32>>2]|0)==0){if((c[(c[143850]|0)+32>>2]|0)==0){k=0}else{break}i=d;return k|0}}while(0);h=Dm(a+8|0)|0;o=c[e>>2]|0;_i(60696,(n=i,i=i+24|0,c[n>>2]=h,c[n+8>>2]=g,c[n+16>>2]=o,n)|0);i=n;k=0;i=d;return k|0}o=g-1-j|0;j=a+4|0;c[j>>2]=o;do{if((o|0)>0){if((c[(c[143852]|0)+32>>2]|0)==0){if((c[(c[143850]|0)+32>>2]|0)==0){break}}h=Dm(a+8|0)|0;p=c[j>>2]|0;_i(59216,(n=i,i=i+24|0,c[n>>2]=h,c[n+8>>2]=p,c[n+16>>2]=g,n)|0);i=n}}while(0);if(!f){c[e>>2]=g;k=1;i=d;return k|0}f=a+52|0;if((g|0)==(c[f>>2]|0)){q=c[a+56>>2]|0}else{c[f>>2]=g;c[a+56>>2]=0;q=0}f=a+56|0;if((m|0)!=(q|0)){do{if((c[(c[143852]|0)+32>>2]|0)==0){if((c[(c[143850]|0)+32>>2]|0)==0){k=0}else{break}i=d;return k|0}}while(0);q=Dm(a+8|0)|0;_i(57328,(n=i,i=i+8|0,c[n>>2]=q,n)|0);i=n;k=0;i=d;return k|0}do{if((l|0)>=0){q=b+24|0;j=c[q>>2]|0;o=b+20|0;if((j+l|0)>(c[o>>2]|0)){break}if((m+l|0)>>>0>16384>>>0){break}p=b+12|0;Vx(a+60+m|0,(c[p>>2]|0)+j|0,l)|0;j=(c[f>>2]|0)+l|0;c[f>>2]=j;if((l|0)==1300){k=0;i=d;return k|0}if((j|0)>(c[b+16>>2]|0)){j=Dm(a+8|0)|0;h=c[f>>2]|0;_i(54952,(n=i,i=i+16|0,c[n>>2]=j,c[n+8>>2]=h,n)|0);i=n;k=0;i=d;return k|0}else{h=c[p>>2]|0;c[h>>2]=g;Vx(h+4|0,a+60|0,c[f>>2]|0)|0;c[o>>2]=(c[f>>2]|0)+4;c[f>>2]=0;c[q>>2]=4;c[b+28>>2]=32;c[e>>2]=g;k=1;i=d;return k|0}}}while(0);do{if((c[(c[143852]|0)+32>>2]|0)==0){if((c[(c[143850]|0)+32>>2]|0)==0){k=0}else{break}i=d;return k|0}}while(0);g=Dm(a+8|0)|0;_i(55944,(n=i,i=i+8|0,c[n>>2]=g,n)|0);i=n;k=0;i=d;return k|0}function vm(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=c[740876+(a*22472|0)>>2]|0;f=740872+(a*22472|0)|0;g=c[f>>2]|0;do{if((e-g|0)>16){h=e-16|0;c[f>>2]=h;i=h}else{if((g|0)<(e|0)){i=g;break}else{j=0}return j|0}}while(0);g=i&15;c[f>>2]=i+1;i=718408+(a*22472|0)+(g*1404|0)+1400|0;Vx(c[d+12>>2]|0,718408+(a*22472|0)+(g*1404|0)|0,c[i>>2]|0)|0;c[d+20>>2]=c[i>>2];Zx(b|0,0,32)|0;c[b>>2]=2;j=1;return j|0}function wm(){var a=0,b=0,d=0;if((c[164906]|0)==0){return}while(1){a=Jd()|0;b=c[164906]|0;if((c[b+44>>2]|0)>=(a|0)){d=4;break}Im(c[b+4>>2]|0,c[b+8>>2]|0,b+12|0);b=c[164906]|0;c[164906]=c[b>>2];mj(c[b+8>>2]|0);mj(b);if((c[164906]|0)==0){d=4;break}}if((d|0)==4){return}}function xm(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+16400|0;g=b;b=i;i=i+32|0;Vx(b,g,32)|0;g=f|0;h=f+16|0;j=h|0;k=g;c[h>>2]=-1;c[k>>2]=e;c[k+4>>2]=0;fd(h+4|0,16380,d|0,g|0)|0;sm(a,Wx(j|0)|0,j,b);i=f;return}function ym(d,e,f){d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;g=i;i=i+1024|0;h=g|0;j=h|0;if((Tx(d,52840)|0)==0){Zx(e|0,0,32)|0;c[e>>2]=2;k=1;l=1024;m=0;i=g;return k|0}rn(j,d,1024);do{if((a[j]|0)==91){n=5}else{if((Gn(j,58)|0)>1){n=5;break}d=Ib(j|0,58)|0;if((d|0)==0){o=0;p=j;break}a[d]=0;o=d+1|0;p=j}}while(0);if((n|0)==5){n=Ib(j|0,93)|0;if((n|0)==0){q=0}else{a[n]=0;q=(a[n+1|0]|0)==58?n+2|0:0}o=q;p=(a[j]|0)==91?h+1|0:j}if((zm(p,e,f)|0)==0){c[e>>2]=0;k=0;l=1024;m=0;i=g;return k|0}if((o|0)==0){b[e+24>>1]=wn(27960)|0;k=2;l=1024;m=0;i=g;return k|0}else{b[e+24>>1]=wn((Vc(o|0)|0)&65535)|0;k=1;l=1024;m=0;i=g;return k|0}return 0}function zm(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+128|0;g=f|0;if((e|0)==5){h=10}else if((e|0)==4){h=2}else{h=0}e=g;do{if((Am(a,e,128,h)|0)==0){j=0}else{k=b[g>>1]|0;if((k<<16>>16|0)==2){c[d>>2]=4;c[d+4>>2]=c[g+4>>2];b[d+24>>1]=b[e+2>>1]|0;j=1;break}else if((k<<16>>16|0)==10){c[d>>2]=5;Vx(d+8|0,g+8|0,16)|0;b[d+24>>1]=b[e+2>>1]|0;c[d+28>>2]=c[g+24>>2];j=1;break}else{j=1;break}}}while(0);i=f;return j|0}function Am(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;f=i;i=i+40|0;g=f|0;h=f+32|0;c[h>>2]=0;j=b;Zx(j|0,0,16)|0;Zx(g|0,0,32)|0;b=e&65535;c[g+4>>2]=b;c[g+8>>2]=2;k=Ra(a|0,0,g|0,h|0)|0;do{if((k|0)==0){a:do{if(e<<16>>16==0){g=c[(c[164972]|0)+32>>2]|0;if((g&4|0)==0){do{if((g&1|0)!=0){l=c[h>>2]|0;if((l|0)==0){break}else{m=l}do{if((c[m+4>>2]|0)==2){n=m;o=l;break a}m=c[m+28>>2]|0;}while((m|0)!=0)}}while(0);if((g&2|0)==0){p=26;break}l=c[h>>2]|0;if((l|0)==0){p=26;break}else{q=l}while(1){if((c[q+4>>2]|0)==10){n=q;o=l;break a}r=c[q+28>>2]|0;if((r|0)==0){p=26;break}else{q=r}}}else{do{if((g&2|0)!=0){l=c[h>>2]|0;if((l|0)==0){break}else{s=l}do{if((c[s+4>>2]|0)==10){n=s;o=l;break a}s=c[s+28>>2]|0;}while((s|0)!=0)}}while(0);if((g&1|0)==0){p=26;break}l=c[h>>2]|0;if((l|0)==0){p=26;break}else{t=l}while(1){if((c[t+4>>2]|0)==2){n=t;o=l;break a}r=c[t+28>>2]|0;if((r|0)==0){p=26;break}else{t=r}}}}else{l=c[h>>2]|0;if((l|0)==0){p=26;break}else{u=l}while(1){if((c[u+4>>2]|0)==(b|0)){n=u;o=l;break a}g=c[u+28>>2]|0;if((g|0)==0){p=26;break}else{u=g}}}}while(0);if((p|0)==26){_i(25112,(v=i,i=i+8|0,c[v>>2]=a,v)|0);i=v;break}l=n+16|0;g=c[l>>2]|0;if(g>>>0>d>>>0){c[l>>2]=d;w=d}else{w=g}Vx(j|0,c[n+20>>2]|0,w)|0;Eb(o|0);x=1;i=f;return x|0}else{g=Sc(k|0)|0;_i(24712,(v=i,i=i+16|0,c[v>>2]=a,c[v+8>>2]=g,v)|0);i=v}}while(0);v=c[h>>2]|0;if((v|0)==0){x=0;i=f;return x|0}Eb(v|0);x=0;i=f;return x|0}function Bm(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;g=b;b=i;i=i+32|0;Vx(b,g,32)|0;g=d;d=i;i=i+32|0;Vx(d,g,32)|0;g=c[b>>2]|0;if((g|0)!=(c[d>>2]|0)){h=0;i=f;return h|0}if((g|0)==2){h=1;i=f;return h|0}else if((g|0)==4){j=d+4|0;k=b+4|0;l=e>>>0>32>>>0?32:e}else if((g|0)==5){j=d+8|0;k=b+8|0;l=e>>>0>128>>>0?128:e}else{_i(55168,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;h=0;i=f;return h|0}e=l>>3;do{if((e|0)!=0){if((Sx(k,j,e)|0)==0){break}else{h=0}i=f;return h|0}}while(0);b=l&7;if((b|0)==0){h=1;i=f;return h|0}h=(((1<<b)+255&255)<<8-b&((a[j+e|0]^a[k+e|0])&255)|0)==0|0;i=f;return h|0}function Cm(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;d=i;i=i+64|0;e=a;a=i;i=i+32|0;Vx(a,e,32)|0;e=b;b=i;i=i+32|0;Vx(b,e,32)|0;e=d|0;f=d+32|0;Vx(f|0,a|0,32)|0;Vx(e|0,b|0,32)|0;b=c[f>>2]|0;if((b|0)!=(c[e>>2]|0)){g=0;i=d;return g|0}if((b|0)==4){h=e+4|0;j=f+4|0;k=4}else if((b|0)==2){g=1;i=d;return g|0}else if((b|0)==5){h=e+8|0;j=f+8|0;k=16}else{_i(55168,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;g=0;i=d;return g|0}g=(Sx(j,h,k)|0)==0|0;i=d;return g|0}function Dm(d){d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;e=i;i=i+128|0;f=d;d=i;i=i+32|0;Vx(d,f,32)|0;f=e|0;g=c[d>>2]|0;if((g|0)==2){xn(2557904,48,58448,(h=i,i=i+1|0,i=i+7&-8,c[h>>2]=0,h)|0)|0;i=h;i=e;return 2557904}else if((g|0)==1){xn(2557904,48,47976,(h=i,i=i+1|0,i=i+7&-8,c[h>>2]=0,h)|0)|0;i=h;i=e;return 2557904}else if((g|0)==4|(g|0)==5){Zx(f|0,0,128)|0;h=f;if((g|0)==5){b[f>>1]=10;j=f+8|0;k=d+8|0;c[j>>2]=c[k>>2];c[j+4>>2]=c[k+4>>2];c[j+8>>2]=c[k+8>>2];c[j+12>>2]=c[k+12>>2];b[h+2>>1]=b[d+24>>1]|0;c[f+24>>2]=c[d+28>>2];l=28}else if((g|0)==4){b[f>>1]=2;c[f+4>>2]=c[d+4>>2];b[h+2>>1]=b[d+24>>1]|0;l=16}else{l=16}if((cc(h|0,l|0,2557904,48,0,0,1)|0)==0){i=e;return 2557904}a[2557904]=0;i=e;return 2557904}else{i=e;return 2557904}return 0}function Em(e){e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;i=i+256|0;g=e;e=i;i=i+32|0;Vx(e,g,32)|0;g=f|0;h=f+128|0;j=c[e>>2]|0;if((j|0)==1){xn(2557856,48,47976,(k=i,i=i+1|0,i=i+7&-8,c[k>>2]=0,k)|0)|0;i=k;i=f;return 2557856}else if((j|0)==4){l=e+4|0;m=d[l]|d[l+1|0]<<8|d[l+2|0]<<16|d[l+3|0]<<24|0;l=e+24|0;n=(d[l]|d[l+1|0]<<8)<<16>>16;Zx(h|0,0,128)|0;l=h;b[h>>1]=2;c[h+4>>2]=m;b[l+2>>1]=n;if((cc(l|0,16,2557904,48,0,0,1)|0)!=0){a[2557904]=0}l=(sd(n|0)|0)&65535;xn(2557856,48,41120,(k=i,i=i+16|0,c[k>>2]=2557904,c[k+8>>2]=l,k)|0)|0;i=k;i=f;return 2557856}else if((j|0)==5){l=e+24|0;n=(d[l]|d[l+1|0]<<8)<<16>>16;l=e+28|0;m=d[l]|d[l+1|0]<<8|d[l+2|0]<<16|d[l+3|0]<<24|0;Zx(g|0,0,128)|0;l=g;b[g>>1]=10;Vx(g+8|0,e+8|0,16)|0;b[l+2>>1]=n;c[g+24>>2]=m;if((cc(l|0,28,2557904,48,0,0,1)|0)!=0){a[2557904]=0}l=(sd(n|0)|0)&65535;xn(2557856,48,36344,(k=i,i=i+16|0,c[k>>2]=2557904,c[k+8>>2]=l,k)|0)|0;i=k;i=f;return 2557856}else if((j|0)==2){xn(2557856,48,58448,(k=i,i=i+1|0,i=i+7&-8,c[k>>2]=0,k)|0)|0;i=k;i=f;return 2557856}else{i=f;return 2557856}return 0}function Fm(a,d){a=a|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;e=i;i=i+64|0;f=a;a=i;i=i+32|0;Vx(a,f,32)|0;f=d;d=i;i=i+32|0;Vx(d,f,32)|0;f=e|0;g=e+32|0;Vx(g|0,a|0,32)|0;Vx(f|0,d|0,32)|0;h=c[g>>2]|0;if((h|0)!=(c[f>>2]|0)){j=0;i=e;return j|0}if((h|0)==5){k=f+8|0;l=g+8|0;m=16;n=6}else if((h|0)==4){k=f+4|0;l=g+4|0;m=4;n=6}else if((h|0)!=2){_i(55168,(h=i,i=i+1|0,i=i+7&-8,c[h>>2]=0,h)|0);i=h;j=0;i=e;return j|0}do{if((n|0)==6){if((Sx(l,k,m)|0)==0){break}else{j=0}i=e;return j|0}}while(0);if(!(((c[a>>2]|0)-4|0)>>>0<2>>>0)){j=1;i=e;return j|0}j=(b[a+24>>1]|0)==(b[d+24>>1]|0)|0;i=e;return j|0}function Gm(a){a=a|0;var b=0,d=0;b=i;d=a;a=i;i=i+32|0;Vx(a,d,32)|0;i=b;return(c[a>>2]|0)==2|0}function Hm(e,f,g){e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;h=i;i=i+568|0;j=h|0;k=h+128|0;l=h+144|0;m=h+272|0;n=h+288|0;o=h+416|0;p=h+432|0;q=h+560|0;r=p;s=c[868]|0;do{if(!((s|0)==-1)){if((c[g+(s>>>5<<2)>>2]&1<<(s&31)|0)==0){break}c[q>>2]=128;t=f+12|0;u=f+16|0;v=p;w=sb(s|0,c[t>>2]|0,c[u>>2]|0,0,v|0,q|0)|0;if((w|0)==-1){x=c[(_c()|0)>>2]|0;if((x|0)==104|(x|0)==11){break}y=$c(x|0)|0;_i(31032,(z=i,i=i+8|0,c[z>>2]=y,z)|0);i=z;break}y=p+8|0;c[y>>2]=0;c[y+4>>2]=0;do{if(a[664]|0){if((Sx(r,571280,c[q>>2]|0)|0)!=0){A=14;break}if((w|0)<10){B=0;C=128;D=0;i=h;return B|0}y=c[t>>2]|0;if((a[y]|0)!=0){B=0;C=128;D=0;i=h;return B|0}if((a[y+1|0]|0)!=0){B=0;C=128;D=0;i=h;return B|0}if((a[y+2|0]|0)!=0){B=0;C=128;D=0;i=h;return B|0}if((a[y+3|0]|0)==1){c[e>>2]=4;a[e+4|0]=a[(c[t>>2]|0)+4|0]|0;a[e+5|0]=a[(c[t>>2]|0)+5|0]|0;a[e+6|0]=a[(c[t>>2]|0)+6|0]|0;a[e+7|0]=a[(c[t>>2]|0)+7|0]|0;b[e+24>>1]=b[(c[t>>2]|0)+8>>1]|0;c[f+24>>2]=10;break}else{B=0;C=128;D=0;i=h;return B|0}}else{A=14}}while(0);if((A|0)==14){t=b[p>>1]|0;if((t<<16>>16|0)==2){c[e>>2]=4;c[e+4>>2]=c[p+4>>2];b[e+24>>1]=b[v+2>>1]|0}else if((t<<16>>16|0)==10){c[e>>2]=5;Vx(e+8|0,p+8|0,16)|0;b[e+24>>1]=b[v+2>>1]|0;c[e+28>>2]=c[p+24>>2]}c[f+24>>2]=0}if((w|0)<(c[u>>2]|0)){c[f+20>>2]=w;B=1;C=128;D=0;i=h;return B|0}t=e|0;y=d[t]|d[t+1|0]<<8|d[t+2|0]<<16|d[t+3|0]<<24|0;t=e+4|0;x=d[t]|d[t+1|0]<<8|d[t+2|0]<<16|d[t+3|0]<<24|0;t=o|0;Vx(t|0,e+8|0,16)|0;E=e+24|0;F=(d[E]|d[E+1|0]<<8)<<16>>16;E=e+28|0;G=d[E]|d[E+1|0]<<8|d[E+2|0]<<16|d[E+3|0]<<24|0;do{if((y|0)==4|(y|0)==5){Zx(n|0,0,128)|0;E=n;if((y|0)==4){b[n>>1]=2;c[n+4>>2]=x;b[E+2>>1]=F;H=16}else if((y|0)==5){b[n>>1]=10;I=n+8|0;c[I>>2]=c[t>>2];c[I+4>>2]=c[t+4>>2];c[I+8>>2]=c[t+8>>2];c[I+12>>2]=c[t+12>>2];b[E+2>>1]=F;c[n+24>>2]=G;H=28}else{H=16}if((cc(E|0,H|0,2557904,48,0,0,1)|0)==0){break}a[2557904]=0}else if((y|0)==2){xn(2557904,48,58448,(z=i,i=i+1|0,i=i+7&-8,c[z>>2]=0,z)|0)|0;i=z}else if((y|0)==1){xn(2557904,48,47976,(z=i,i=i+1|0,i=i+7&-8,c[z>>2]=0,z)|0)|0;i=z}}while(0);_i(26656,(z=i,i=i+8|0,c[z>>2]=2557904,z)|0);i=z;B=0;C=128;D=0;i=h;return B|0}}while(0);H=c[870]|0;do{if(!((H|0)==-1)){if((c[g+(H>>>5<<2)>>2]&1<<(H&31)|0)==0){break}c[q>>2]=128;n=f+16|0;o=p;A=sb(H|0,c[f+12>>2]|0,c[n>>2]|0,0,o|0,q|0)|0;if((A|0)==-1){r=c[(_c()|0)>>2]|0;if((r|0)==104|(r|0)==11){break}s=$c(r|0)|0;_i(31032,(z=i,i=i+8|0,c[z>>2]=s,z)|0);i=z;break}s=b[p>>1]|0;if((s<<16>>16|0)==2){c[e>>2]=4;c[e+4>>2]=c[p+4>>2];b[e+24>>1]=b[o+2>>1]|0}else if((s<<16>>16|0)==10){c[e>>2]=5;Vx(e+8|0,p+8|0,16)|0;b[e+24>>1]=b[o+2>>1]|0;c[e+28>>2]=c[p+24>>2]}c[f+24>>2]=0;if((A|0)<(c[n>>2]|0)){c[f+20>>2]=A;B=1;C=128;D=0;i=h;return B|0}A=e|0;n=d[A]|d[A+1|0]<<8|d[A+2|0]<<16|d[A+3|0]<<24|0;A=e+4|0;o=d[A]|d[A+1|0]<<8|d[A+2|0]<<16|d[A+3|0]<<24|0;A=m|0;Vx(A|0,e+8|0,16)|0;s=e+24|0;r=(d[s]|d[s+1|0]<<8)<<16>>16;s=e+28|0;y=d[s]|d[s+1|0]<<8|d[s+2|0]<<16|d[s+3|0]<<24|0;do{if((n|0)==2){xn(2557904,48,58448,(z=i,i=i+1|0,i=i+7&-8,c[z>>2]=0,z)|0)|0;i=z}else if((n|0)==1){xn(2557904,48,47976,(z=i,i=i+1|0,i=i+7&-8,c[z>>2]=0,z)|0)|0;i=z}else if((n|0)==4|(n|0)==5){Zx(l|0,0,128)|0;s=l;if((n|0)==4){b[l>>1]=2;c[l+4>>2]=o;b[s+2>>1]=r;J=16}else if((n|0)==5){b[l>>1]=10;G=l+8|0;c[G>>2]=c[A>>2];c[G+4>>2]=c[A+4>>2];c[G+8>>2]=c[A+8>>2];c[G+12>>2]=c[A+12>>2];b[s+2>>1]=r;c[l+24>>2]=y;J=28}else{J=16}if((cc(s|0,J|0,2557904,48,0,0,1)|0)==0){break}a[2557904]=0}}while(0);_i(26656,(z=i,i=i+8|0,c[z>>2]=2557904,z)|0);i=z;B=0;C=128;D=0;i=h;return B|0}}while(0);J=c[510]|0;if((J|0)==-1|(J|0)==(c[870]|0)){B=0;C=128;D=0;i=h;return B|0}if((c[g+(J>>>5<<2)>>2]&1<<(J&31)|0)==0){B=0;C=128;D=0;i=h;return B|0}c[q>>2]=128;g=f+16|0;l=p;m=sb(J|0,c[f+12>>2]|0,c[g>>2]|0,0,l|0,q|0)|0;if((m|0)==-1){q=c[(_c()|0)>>2]|0;if((q|0)==104|(q|0)==11){B=0;C=128;D=0;i=h;return B|0}J=$c(q|0)|0;_i(31032,(z=i,i=i+8|0,c[z>>2]=J,z)|0);i=z;B=0;C=128;D=0;i=h;return B|0}J=b[p>>1]|0;if((J<<16>>16|0)==2){c[e>>2]=4;c[e+4>>2]=c[p+4>>2];b[e+24>>1]=b[l+2>>1]|0}else if((J<<16>>16|0)==10){c[e>>2]=5;Vx(e+8|0,p+8|0,16)|0;b[e+24>>1]=b[l+2>>1]|0;c[e+28>>2]=c[p+24>>2]}c[f+24>>2]=0;if((m|0)<(c[g>>2]|0)){c[f+20>>2]=m;B=1;C=128;D=0;i=h;return B|0}m=e|0;f=d[m]|d[m+1|0]<<8|d[m+2|0]<<16|d[m+3|0]<<24|0;m=e+4|0;g=d[m]|d[m+1|0]<<8|d[m+2|0]<<16|d[m+3|0]<<24|0;m=k|0;Vx(m|0,e+8|0,16)|0;k=e+24|0;p=(d[k]|d[k+1|0]<<8)<<16>>16;k=e+28|0;e=d[k]|d[k+1|0]<<8|d[k+2|0]<<16|d[k+3|0]<<24|0;do{if((f|0)==2){xn(2557904,48,58448,(z=i,i=i+1|0,i=i+7&-8,c[z>>2]=0,z)|0)|0;i=z}else if((f|0)==1){xn(2557904,48,47976,(z=i,i=i+1|0,i=i+7&-8,c[z>>2]=0,z)|0)|0;i=z}else if((f|0)==4|(f|0)==5){Zx(j|0,0,128)|0;k=j;if((f|0)==4){b[j>>1]=2;c[j+4>>2]=g;b[k+2>>1]=p;K=16}else if((f|0)==5){b[j>>1]=10;l=j+8|0;c[l>>2]=c[m>>2];c[l+4>>2]=c[m+4>>2];c[l+8>>2]=c[m+8>>2];c[l+12>>2]=c[m+12>>2];b[k+2>>1]=p;c[j+24>>2]=e;K=28}else{K=16}if((cc(k|0,K|0,2557904,48,0,0,1)|0)==0){break}a[2557904]=0}}while(0);_i(26656,(z=i,i=i+8|0,c[z>>2]=2557904,z)|0);i=z;B=0;C=128;D=0;i=h;return B|0}



function Mt(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0.0,xa=0.0,ya=0.0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0.0,Qa=0;f=i;i=i+2328|0;h=f|0;j=f+56|0;k=f+112|0;l=f+168|0;m=f+224|0;n=f+280|0;o=f+336|0;p=f+392|0;q=f+408|0;r=f+424|0;s=f+440|0;t=f+528|0;u=f+576|0;v=f+584|0;w=f+632|0;x=f+680|0;y=f+736|0;z=f+792|0;A=f+848|0;B=f+904|0;C=f+960|0;D=f+1016|0;E=f+1072|0;F=f+1128|0;G=f+1184|0;H=f+1240|0;I=f+1296|0;J=f+1352|0;K=f+1408|0;L=f+1464|0;M=f+1520|0;N=f+1576|0;O=f+1640|0;P=f+1656|0;Q=f+1712|0;R=f+1768|0;S=f+1824|0;T=f+1880|0;U=f+1936|0;V=f+1992|0;W=f+2048|0;X=f+2104|0;Y=f+2160|0;Z=f+2216|0;_=f+2272|0;$=v;aa=a|0;ba=a+4|0;ca=a+8|0;da=a+12|0;ea=a+16|0;fa=a+20|0;Zx(a|0,0,24)|0;if((b-1|0)>>>0>63>>>0){ue[c[636260]&31](4,47520,(ga=i,i=i+8|0,c[ga>>2]=b,ga)|0);i=ga;ha=44;ia=0;ja=44;ka=0;i=f;return}la=c[2544736+(b<<2)>>2]|0;if((la|0)==0){ue[c[636260]&31](4,57128,(ga=i,i=i+8|0,c[ga>>2]=b,ga)|0);i=ga;ha=44;ia=0;ja=44;ka=0;i=f;return}b=la+76|0;Wq(c[b>>2]|0,t);do{if((c[t+36>>2]&16777215|0)!=14){ma=la+96|0;na=c[ma>>2]|0;if((na&128|0)==0){if(!(+g[la+104>>2]!=0.0)){break}}if(+g[(c[164922]|0)+16>>2]!=0.0){su(c[la+40>>2]|0,c[(c[466014]|0)+4>>2]|0);oa=c[ma>>2]|0}else{oa=na}c[ma>>2]=oa&-129;g[la+104>>2]=0.0}}while(0);if((d|0)==0){c[aa>>2]=1;ha=44;ia=0;ja=44;ka=0;i=f;return}oa=la+96|0;c[oa>>2]=c[oa>>2]&-13;t=la|0;ma=la+48|0;na=la+36|0;pa=(Gp(t,c[ma>>2]|0,c[na>>2]|0)|0)==0;qa=c[oa>>2]|0;if(pa){ra=qa}else{pa=qa|2;c[oa>>2]=pa;ra=pa}do{if((ra&2|0)!=0){pa=p|0;qa=q|0;br(c[ma>>2]|0,pa,qa);sa=r|0;g[sa>>2]=+g[t>>2];g[r+4>>2]=+g[la+4>>2];g[r+8>>2]=+g[la+8>>2]+-3.0;Jo(s,t,pa,qa,sa,c[na>>2]|0,65537);sa=c[s+80>>2]|0;qa=(c[s+4>>2]|0)!=0|(sa|0)==1022|(sa|0)==1023?-1:sa;if((qa|0)==-1){break}sa=hp(qa)|0;if(!(sa>>>0<256>>>0)){break}pa=c[717328+(sa<<2)>>2]|0;if((pa|0)==1){Wq(c[b>>2]|0,v);ta=v+36|0;if((c[ta>>2]&16777215|0)==11){if((c[v+4>>2]&65535|0)!=(sa|0)){ua=21}}else{ua=21}if((ua|0)==21){va=Yq(0,sa)|0;if((va|0)==0){if((c[636484]|0)!=0){ue[c[636260]&31](1,56912,(ga=i,i=i+8|0,c[ga>>2]=c[la+40>>2],ga)|0);i=ga}c[ca>>2]=1;c[da>>2]=qa;c[fa>>2]=c[fa>>2]|32;ha=44;ia=0;ja=44;ka=0;i=f;return}Wq(va,v);c[b>>2]=va;wa=+yp();va=c[ta>>2]|0;switch(va&16777215|0){case 6:{xa=6.0;break};case 11:{xa=10.0;break};case 14:{xa=8.0;break};case 12:{xa=6.0;break};case 13:{xa=6.0;break};case 18:{xa=10.0;break};case 19:{xa=10.0;break};case 2:case 3:case 4:case 7:case 5:case 8:case 9:case 10:{xa=5.0;break};default:{ue[c[636260]&31](3,58728,(ga=i,i=i+8|0,c[ga>>2]=va,ga)|0);i=ga;xa=8.0}}g[la+112>>2]=wa+xa}c[fa>>2]=c[fa>>2]|128;break}else if((pa|0)==2){Wq(c[b>>2]|0,v);va=v+36|0;if((c[va>>2]&16777215|0)==19){if((c[v+4>>2]&65535|0)!=(sa|0)){ua=38}}else{ua=38}if((ua|0)==38){ta=Yq(0,sa)|0;if((ta|0)==0){if((c[636484]|0)!=0){ue[c[636260]&31](1,55608,(ga=i,i=i+8|0,c[ga>>2]=c[la+40>>2],ga)|0);i=ga}c[ca>>2]=1;c[da>>2]=qa;c[fa>>2]=c[fa>>2]|32;ha=44;ia=0;ja=44;ka=0;i=f;return}Wq(ta,v);c[b>>2]=ta;wa=+yp();ta=c[va>>2]|0;switch(ta&16777215|0){case 6:{ya=6.0;break};case 11:{ya=10.0;break};case 14:{ya=8.0;break};case 12:{ya=6.0;break};case 13:{ya=6.0;break};case 18:{ya=10.0;break};case 19:{ya=10.0;break};case 2:case 3:case 4:case 7:case 5:case 8:case 9:case 10:{ya=5.0;break};default:{ue[c[636260]&31](3,58728,(ga=i,i=i+8|0,c[ga>>2]=ta,ga)|0);i=ga;ya=8.0}}g[la+112>>2]=wa+ya}c[fa>>2]=c[fa>>2]|64;break}else{if(!((pa-3|0)>>>0<2>>>0)){c[ca>>2]=1;c[da>>2]=qa;c[fa>>2]=c[fa>>2]|32;ha=44;ia=0;ja=44;ka=0;i=f;return}pa=bt(t)|0;c[la+64>>2]=pa;if((Yp(pa)|0)!=0){break}c[ca>>2]=1;c[da>>2]=qa;c[fa>>2]=c[fa>>2]|32;ha=44;ia=0;ja=44;ka=0;i=f;return}}}while(0);if((Hp(t)|0)!=0){c[oa>>2]=c[oa>>2]|4}s=(Fp(t)|0)==0;na=c[oa>>2]|0;if(s){za=na}else{s=na|8;c[oa>>2]=s;za=s}a:do{if((za&14|0)==0){s=la+44|0;na=O|0;g[na>>2]=+g[t>>2]+ +g[la+12>>2]*+g[s>>2]*-2.0;ma=la+4|0;g[O+4>>2]=+g[ma>>2]+ +g[la+16>>2]*+g[s>>2]*-2.0;ra=la+8|0;qa=la+20|0;g[O+8>>2]=+g[ra>>2]+ +g[qa>>2]*+g[s>>2]*-2.0;s=la+72|0;pa=la+68|0;ta=la+116|0;va=la+120|0;sa=la+124|0;Aa=la+128|0;Ba=la+768|0;Ca=v+36|0;Da=mr(t,na,N|0,0,16)|0;Ea=0;b:while(1){Fa=Da;while(1){Ga=Fa-1|0;if((Fa|0)<=0){Ha=Ea;break b}Ia=N+(Ga<<2)|0;if(($p(c[Ia>>2]|0)|0)==0){Fa=Ga}else{break}}Ja=it(na,c[Ia>>2]|0,c[s>>2]|0,c[pa>>2]|0,ta,va,sa,d,262144,Aa,c[Ba>>2]|0,0)|0;if((Ja|0)!=0){ua=121;break}Fa=Xq(c[Ia>>2]|0,0)|0;if((Fa|0)==0){Da=Ga;Ea=1;continue}else{Ka=Fa}while(1){Wq(Ka,v);if((c[Ca>>2]&16777215|0)==18){c[b>>2]=Ka;c[pa>>2]=c[Ia>>2]}Fa=Xq(c[Ia>>2]|0,Ka)|0;if((Fa|0)==0){Da=Ga;Ea=1;continue b}else{Ka=Fa}}}if((ua|0)==121){c[b>>2]=Ja;c[pa>>2]=c[Ia>>2];Ha=1}do{if((c[636484]|0)==0|(Ha|0)==0){ua=129}else{Ea=c[b>>2]|0;if((Ea|0)!=0){La=Ea;break}ue[c[636260]&31](1,54600,(ga=i,i=i+8|0,c[ga>>2]=c[la+40>>2],ga)|0);i=ga;ua=129}}while(0);if((ua|0)==129){pa=c[b>>2]|0;if((pa|0)==0){break}else{La=pa}}Wq(La,v);pa=c[Ca>>2]|0;c[ea>>2]=pa;Ea=pa&16777215;switch(Ea|0){case 2:{rt(P,la,v);Vx(a|0,P|0,52)|0;break};case 4:{pa=k;Zx(pa|0,0,52)|0;if(+g[qa>>2]<250.0){Da=p|0;g[Da>>2]=+g[v+24>>2]- +g[t>>2];Ba=p+4|0;g[Ba>>2]=+g[v+28>>2]- +g[ma>>2];Aa=p+8|0;g[Aa>>2]=0.0;qt(la,Da,1,k);Ju(c[la+40>>2]|0,Da,400.0);g[k+28>>2]=+g[Da>>2];g[k+32>>2]=+g[Ba>>2];g[k+36>>2]=+g[Aa>>2]}Aa=Q;Vx(Aa|0,pa|0,52)|0;Vx(a|0,Aa|0,52)|0;break};case 6:{Zx(r|0,0,12)|0;Aa=j;Zx(Aa|0,0,52)|0;pa=p|0;g[pa>>2]=+g[v+24>>2]- +g[t>>2];Ba=p+4|0;g[Ba>>2]=+g[v+28>>2]- +g[ma>>2];Da=p+8|0;g[Da>>2]=+g[v+32>>2]- +g[ra>>2];+dn(pa);sa=q|0;g[sa>>2]=+g[pa>>2];g[q+4>>2]=+g[Ba>>2];g[q+8>>2]=+g[Da>>2]*3.0;gn(sa,j+40|0);sa=la+40|0;Ju(c[sa>>2]|0,r|0,0.0);Fu(c[sa>>2]|0);sa=j+20|0;c[sa>>2]=c[sa>>2]|1;g[j+28>>2]=+g[pa>>2];g[j+32>>2]=+g[Ba>>2];g[j+36>>2]=+g[Da>>2];Da=R;Vx(Da|0,Aa|0,52)|0;Vx(a|0,Da|0,52)|0;break};case 7:{xt(S,la,v);Vx(a|0,S|0,52)|0;break};case 5:{zt(T,la,v);Vx(a|0,T|0,52)|0;break};case 8:{Da=h;Zx(Da|0,0,52)|0;Aa=p|0;g[Aa>>2]=+g[v+12>>2]- +g[t>>2];Ba=p+4|0;g[Ba>>2]=+g[v+16>>2]- +g[ma>>2];pa=p+8|0;g[pa>>2]=+g[v+20>>2]- +g[ra>>2];+dn(Aa);qt(la,Aa,1,h);Ju(c[la+40>>2]|0,Aa,400.0);g[h+28>>2]=+g[Aa>>2];g[h+32>>2]=+g[Ba>>2];g[h+36>>2]=+g[pa>>2];gn(Aa,h+40|0);Aa=h+20|0;c[Aa>>2]=c[Aa>>2]|2;Aa=U;Vx(Aa|0,Da|0,52)|0;Vx(a|0,Aa|0,52)|0;break};case 9:{ut(V,la,v);Vx(a|0,V|0,52)|0;break};case 11:{Ct(W,la,v);Vx(a|0,W|0,52)|0;break};case 14:{Gt(X,la,v);Vx(a|0,X|0,52)|0;break};case 12:case 13:{Jt(Y,la,v);Vx(a|0,Y|0,52)|0;break};case 18:{Kt(Z,la,v);Vx(a|0,Z|0,52)|0;break};case 19:{Ft(_,la,v);Vx(a|0,_|0,52)|0;break};case 3:case 10:{break};default:{ue[c[636260]&31](4,53560,(ga=i,i=i+8|0,c[ga>>2]=Ea,ga)|0);i=ga}}c[ea>>2]=c[Ca>>2]}else{Wq(c[b>>2]|0,w);Ea=bt(t)|0;Aa=la+64|0;c[Aa>>2]=Ea;if((Ea|0)==0){c[aa>>2]=1;c[ca>>2]=1;c[da>>2]=0;c[ba>>2]=8;ha=44;ia=0;ja=44;ka=0;i=f;return}Da=d+12|0;if((Ea|0)==(c[Da>>2]|0)){Lt(x,la,d);Vx(a|0,x|0,52)|0;ha=44;ia=0;ja=44;ka=0;i=f;return}Ea=c[b>>2]|0;do{if((Ea|0)==0){ua=79}else{Wq(Ea,v);pa=v+36|0;if(((xq(c[pa>>2]|0)|0)&e|0)==0){ua=79;break}Ba=c[pa>>2]&16777215;if((Ba|0)==14){ya=+g[la+112>>2];if(ya<+yp()){ua=79;break}if((c[oa>>2]&256|0)!=0){ua=79;break}}else if((Ba|0)==11|(Ba|0)==19){if((c[fa>>2]&192|0)!=0){g[la+112>>2]=+yp()+5.0}if((c[Aa>>2]|0)==(c[v>>2]|0)){ua=79;break}ya=+g[la+112>>2];if(ya<+yp()){ua=79;break}}else{if((c[la+72>>2]|0)!=(c[Da>>2]|0)){ua=79;break}ya=+g[la+112>>2];if(ya<+yp()){ua=79;break}if((c[la+68>>2]|0)!=(c[Aa>>2]|0)){ua=79;break}}c[u>>2]=0;Ma=Ea;Na=la+72|0;Oa=la+68|0;ua=96}}while(0);do{if((ua|0)==79){c[u>>2]=0;Yp(c[Aa>>2]|0)|0;Ea=la+72|0;Ca=la+68|0;ra=la+116|0;ma=la+120|0;qa=la+124|0;Ba=it(t,c[Aa>>2]|0,c[Ea>>2]|0,c[Ca>>2]|0,ra,ma,qa,d,e,la+128|0,c[la+768>>2]|0,u)|0;c[la+92>>2]=c[Aa>>2];c[la+100>>2]=0;c[oa>>2]=c[oa>>2]&-257;if((Ba|0)==0){c[b>>2]=0;c[Ea>>2]=c[Da>>2];c[Ca>>2]=c[Aa>>2];break}Wq(Ba,v);ya=+yp();pa=c[v+36>>2]|0;switch(pa&16777215|0){case 6:{Pa=6.0;break};case 11:{Pa=10.0;break};case 14:{Pa=8.0;break};case 12:{Pa=6.0;break};case 13:{Pa=6.0;break};case 18:{Pa=10.0;break};case 19:{Pa=10.0;break};case 2:case 3:case 4:case 7:case 5:case 8:case 9:case 10:{Pa=5.0;break};default:{ue[c[636260]&31](3,58728,(ga=i,i=i+8|0,c[ga>>2]=pa,ga)|0);i=ga;Pa=8.0}}g[la+112>>2]=ya+Pa;pa=(c[ra>>2]|0)==(Ba|0);ya=+g[ma>>2];xa=+yp();if(!pa){if(!(ya<xa)){Ma=Ba;Na=Ea;Oa=Ca;ua=96;break}c[ra>>2]=Ba;g[ma>>2]=+yp()+6.0;c[qa>>2]=1;Ma=Ba;Na=Ea;Oa=Ca;ua=96;break}if(ya>xa){Qa=(c[qa>>2]|0)+1|0}else{Qa=1}c[qa>>2]=Qa;g[ma>>2]=+yp()+6.0;Ma=Ba;Na=Ea;Oa=Ca;ua=96}}while(0);do{if((ua|0)==96){c[b>>2]=Ma;c[Na>>2]=c[Da>>2];c[Oa>>2]=c[Aa>>2];if((Ma|0)==0){break}Wq(Ma,v);Ca=v+36|0;Ea=c[Ca>>2]|0;c[ea>>2]=Ea;Ba=Ea&16777215;switch(Ba|0){case 2:{rt(y,la,v);Vx(a|0,y|0,52)|0;break};case 3:{Ea=o;Zx(Ea|0,0,52)|0;ma=p|0;g[ma>>2]=+g[v+24>>2]- +g[t>>2];qa=p+4|0;g[qa>>2]=+g[v+28>>2]- +g[la+4>>2];ra=p+8|0;g[ra>>2]=0.0;+dn(ma);qt(la,ma,1,o);pa=la+40|0;Au(c[pa>>2]|0);Ju(c[pa>>2]|0,ma,400.0);g[o+28>>2]=+g[ma>>2];g[o+32>>2]=+g[qa>>2];g[o+36>>2]=+g[ra>>2];ra=z;Vx(ra|0,Ea|0,52)|0;Vx(a|0,ra|0,52)|0;break};case 4:{st(A,la,v);Vx(a|0,A|0,52)|0;break};case 6:{Zx(r|0,0,12)|0;ra=n;Zx(ra|0,0,52)|0;Ea=p|0;g[Ea>>2]=+g[v+24>>2]- +g[t>>2];qa=p+4|0;g[qa>>2]=+g[v+28>>2]- +g[la+4>>2];ma=p+8|0;g[ma>>2]=+g[v+32>>2]- +g[la+8>>2];+dn(Ea);pa=q|0;g[pa>>2]=+g[Ea>>2];g[q+4>>2]=+g[qa>>2];g[q+8>>2]=+g[ma>>2]*3.0;gn(pa,n+40|0);pa=la+40|0;Ju(c[pa>>2]|0,r|0,0.0);Fu(c[pa>>2]|0);pa=n+20|0;c[pa>>2]=c[pa>>2]|1;g[n+28>>2]=+g[Ea>>2];g[n+32>>2]=+g[qa>>2];g[n+36>>2]=+g[ma>>2];ma=B;Vx(ma|0,ra|0,52)|0;Vx(a|0,ma|0,52)|0;break};case 7:{vt(C,la,v);Vx(a|0,C|0,52)|0;break};case 5:{yt(D,la,v);Vx(a|0,D|0,52)|0;break};case 8:{ma=m;Zx(ma|0,0,52)|0;ra=p|0;g[ra>>2]=+g[v+12>>2]- +g[t>>2];qa=p+4|0;g[qa>>2]=+g[v+16>>2]- +g[la+4>>2];Ea=p+8|0;g[Ea>>2]=+g[v+20>>2]- +g[la+8>>2];+dn(ra);qt(la,ra,1,m);Ju(c[la+40>>2]|0,ra,400.0);g[m+28>>2]=+g[ra>>2];g[m+32>>2]=+g[qa>>2];g[m+36>>2]=+g[Ea>>2];gn(ra,m+40|0);ra=m+20|0;c[ra>>2]=c[ra>>2]|2;ra=E;Vx(ra|0,ma|0,52)|0;Vx(a|0,ra|0,52)|0;break};case 9:{tt(F,la,v);Vx(a|0,F|0,52)|0;break};case 10:{At(G,la,v);Vx(a|0,G|0,52)|0;break};case 11:{Bt(H,la,v);Vx(a|0,H|0,52)|0;break};case 14:{Gt(I,la,v);Vx(a|0,I|0,52)|0;break};case 12:{Ht(J,la,v);Vx(a|0,J|0,52)|0;break};case 13:{It(K,la,v);Vx(a|0,K|0,52)|0;break};case 18:{ra=l;Zx(ra|0,0,52)|0;ma=p|0;g[ma>>2]=+g[v+12>>2]- +g[t>>2];Ea=p+4|0;g[Ea>>2]=+g[v+16>>2]- +g[la+4>>2];qa=p+8|0;g[qa>>2]=0.0;qt(la,ma,1,l);Ju(c[la+40>>2]|0,ma,400.0);g[l+28>>2]=+g[ma>>2];g[l+32>>2]=+g[Ea>>2];g[l+36>>2]=+g[qa>>2];qa=L;Vx(qa|0,ra|0,52)|0;Vx(a|0,qa|0,52)|0;break};case 19:{Et(M,la,v);Vx(a|0,M|0,52)|0;break};default:{ue[c[636260]&31](4,58728,(ga=i,i=i+8|0,c[ga>>2]=Ba,ga)|0);i=ga}}c[ea>>2]=c[Ca>>2];c[fa>>2]=c[fa>>2]|c[u>>2];break a}}while(0);c[aa>>2]=1;c[fa>>2]=c[fa>>2]|c[u>>2];Zx($|0,0,44)|0}}while(0);if((c[ca>>2]|0)!=0){ca=la+112|0;g[ca>>2]=+g[ca>>2]- +g[la+44>>2]*10.0}g[la+80>>2]=+g[t>>2];g[la+84>>2]=+g[la+4>>2];g[la+88>>2]=+g[la+8>>2];ha=44;ia=0;ja=44;ka=0;i=f;return}function Nt(a){a=a|0;var b=0,d=0,e=0;b=i;if((a-1|0)>>>0>63>>>0){ue[c[636260]&31](4,47520,(d=i,i=i+8|0,c[d>>2]=a,d)|0);i=d;i=b;return}e=c[2544736+(a<<2)>>2]|0;if((e|0)==0){ue[c[636260]&31](4,57128,(d=i,i=i+8|0,c[d>>2]=a,d)|0);i=d;i=b;return}else{c[e+116>>2]=0;c[e+120>>2]=0;c[e+124>>2]=0;i=b;return}}function Ot(a){a=a|0;var b=0,d=0,e=0,f=0.0;b=i;if((a-1|0)>>>0>63>>>0){ue[c[636260]&31](4,47520,(d=i,i=i+8|0,c[d>>2]=a,d)|0);i=d;i=b;return}e=c[2544736+(a<<2)>>2]|0;if((e|0)==0){ue[c[636260]&31](4,57128,(d=i,i=i+8|0,c[d>>2]=a,d)|0);i=d;i=b;return}d=e+120|0;f=+g[d>>2];if(!(f>0.0&f!=0.0)){i=b;return}g[d>>2]=0.0;d=e+124|0;e=c[d>>2]|0;if((e|0)<=0){i=b;return}c[d>>2]=e-1;i=b;return}function Pt(a){a=a|0;var b=0,d=0,e=0;b=i;if((a-1|0)>>>0>63>>>0){ue[c[636260]&31](4,47520,(d=i,i=i+8|0,c[d>>2]=a,d)|0);i=d;i=b;return}e=c[2544736+(a<<2)>>2]|0;if((e|0)==0){ue[c[636260]&31](4,57128,(d=i,i=i+8|0,c[d>>2]=a,d)|0);i=d;i=b;return}else{Zx(e|0,0,772)|0;i=b;return}}function Qt(){et();c[64872]=cv(52504,51552)|0;c[64876]=cv(50608,49856)|0;c[64898]=cv(49136,48288)|0;c[15490]=cv(47024,46048)|0;c[15494]=cv(45424,44568)|0;c[15492]=cv(43952,43312)|0;c[375998]=cv(42736,42152)|0;c[164922]=cv(41632,41224)|0;c[466012]=cv(40344,39712)|0;c[466014]=cv(39376,38824)|0;return 0}function Rt(){var a=0,b=0,d=0;a=1;do{b=2544736+(a<<2)|0;d=c[b>>2]|0;if((d|0)!=0){nv(d);c[b>>2]=0}a=a+1|0;}while((a|0)<65);return}function St(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;d=i;i=i+1680|0;e=d|0;f=d+1128|0;g=e|0;h=d+1064|0;j=f;k=~~+ev(40312,35488);if((k|0)<0){ue[c[636260]&31](3,30328,(l=i,i=i+8|0,c[l>>2]=k,l)|0);i=l;fv(40312,35488);m=32}else{m=k}k=~~+ev(26048,35488);if((k|0)<0){ue[c[636260]&31](3,22664,(l=i,i=i+8|0,c[l>>2]=k,l)|0);i=l;fv(26048,35488);n=32}else{n=k}ay(h|0,b|0,64)|0;hw(19536);b=bw(h)|0;if((b|0)==0){ue[c[636260]&31](3,17496,(l=i,i=i+8|0,c[l>>2]=h,l)|0);i=l;o=0;p=552;q=0;r=64;s=0;t=1060;u=0;i=d;return o|0}k=(m*552|0)+16|0;v=mv((n*208|0)+k|0)|0;w=v;x=v+12|0;c[x>>2]=v+16;y=v+8|0;c[y>>2]=v+k;k=v;c[k>>2]=m;z=v+4|0;c[z>>2]=0;a:do{if((Yv(b,e)|0)!=0){A=f+4|0;while(1){if((Tx(g,60232)|0)==0){Zx(j|0,0,552)|0;if((Dw(b,8,j)|0)==0){B=11;break}C=c[A>>2]|0;if(!((C|0)>-1&(C|0)<(m|0))){B=13;break}Vx((c[x>>2]|0)+(C*552|0)|0,j|0,552)|0;c[(c[x>>2]|0)+((c[A>>2]|0)*552|0)>>2]=1}else{if((Tx(g,56896)|0)!=0){B=22;break}D=c[z>>2]|0;if((D|0)>=(n|0)){B=17;break}Zx((c[y>>2]|0)+(D*208|0)|0,0,208)|0;if((Dw(b,776,(c[y>>2]|0)+((c[z>>2]|0)*208|0)|0)|0)==0){B=19;break}c[z>>2]=(c[z>>2]|0)+1}if((Yv(b,e)|0)==0){break a}}if((B|0)==11){nv(v);cw(b);o=0;p=552;q=0;r=64;s=0;t=1060;u=0;i=d;return o|0}else if((B|0)==13){ue[c[636260]&31](3,58680,(l=i,i=i+16|0,c[l>>2]=C,c[l+8>>2]=h,l)|0);i=l;nv(v);cw(b);o=0;p=552;q=0;r=64;s=0;t=1060;u=0;i=d;return o|0}else if((B|0)==17){ue[c[636260]&31](3,55568,(l=i,i=i+16|0,c[l>>2]=n,c[l+8>>2]=h,l)|0);i=l;nv(v);cw(b);o=0;p=552;q=0;r=64;s=0;t=1060;u=0;i=d;return o|0}else if((B|0)==19){nv(v);cw(b);o=0;p=552;q=0;r=64;s=0;t=1060;u=0;i=d;return o|0}else if((B|0)==22){ue[c[636260]&31](3,54568,(l=i,i=i+16|0,c[l>>2]=g,c[l+8>>2]=h,l)|0);i=l;nv(v);cw(b);o=0;p=552;q=0;r=64;s=0;t=1060;u=0;i=d;return o|0}}}while(0);cw(b);b=c[k>>2]|0;b:do{if((b|0)>0){g=0;n=b;while(1){C=c[x>>2]|0;if((c[C+(g*552|0)>>2]|0)==0){E=n}else{F=C+(g*552|0)+8|0;if((a[F]|0)==0){B=26;break}e=C+(g*552|0)+180|0;if((a[e]|0)==0){B=30;break}j=c[z>>2]|0;c:do{if((j|0)>0){m=c[y>>2]|0;f=0;while(1){G=m+(f*208|0)|0;A=f+1|0;if((Tx(G,e)|0)==0){break}if((A|0)<(j|0)){f=A}else{H=A;I=j;break c}}Vx(C+(g*552|0)+344|0,G|0,208)|0;H=f;I=c[z>>2]|0}else{H=0;I=j}}while(0);if((H|0)==(I|0)){B=36;break}E=c[k>>2]|0}j=g+1|0;if((j|0)<(E|0)){g=j;n=E}else{J=E;break b}}if((B|0)==26){ue[c[636260]&31](3,53528,(l=i,i=i+16|0,c[l>>2]=g,c[l+8>>2]=h,l)|0);i=l;nv(v);o=0;p=552;q=0;r=64;s=0;t=1060;u=0;i=d;return o|0}else if((B|0)==30){ue[c[636260]&31](3,52464,(l=i,i=i+16|0,c[l>>2]=F,c[l+8>>2]=h,l)|0);i=l;nv(v);o=0;p=552;q=0;r=64;s=0;t=1060;u=0;i=d;return o|0}else if((B|0)==36){ue[c[636260]&31](3,51504,(l=i,i=i+16|0,c[l>>2]=(c[x>>2]|0)+(g*552|0)+8,c[l+8>>2]=h,l)|0);i=l;nv(v);o=0;p=552;q=0;r=64;s=0;t=1060;u=0;i=d;return o|0}}else{J=b}}while(0);if((J|0)==0){ue[c[636260]&31](2,50584,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);i=l}ue[c[636260]&31](1,49840,(l=i,i=i+8|0,c[l>>2]=h,l)|0);i=l;o=w;p=552;q=0;r=64;s=0;t=1060;u=0;i=d;return o|0}function Tt(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;if((a-1|0)>>>0>63>>>0){ue[c[636260]&31](4,56824,(e=i,i=i+8|0,c[e>>2]=a,e)|0);i=e;f=11;i=d;return f|0}g=c[2544472+(a<<2)>>2]|0;if((g|0)==0){ue[c[636260]&31](4,46976,(e=i,i=i+8|0,c[e>>2]=a,e)|0);i=e;f=11;i=d;return f|0}a=g|0;h=c[a>>2]|0;if((h|0)!=0){cu(h)}h=c[g+4>>2]|0;if((h|0)!=0){nv(h)}h=eu(b)|0;c[a>>2]=h;if((h|0)==0){ue[c[636260]&31](4,49104,(e=i,i=i+8|0,c[e>>2]=b,e)|0);i=e;f=11;i=d;return f|0}e=c[15488]|0;if((e|0)==0){f=12;i=d;return f|0}b=e|0;a=kv(c[b>>2]<<2)|0;if((c[b>>2]|0)>0){j=e+12|0;e=0;do{c[a+(e<<2)>>2]=fu(h,(c[j>>2]|0)+(e*552|0)+8|0)|0;e=e+1|0;}while((e|0)<(c[b>>2]|0))}c[g+4>>2]=a;f=0;i=d;return f|0}function Ut(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;do{if((b|0)>=1){f=c[15488]|0;if((c[f>>2]|0)<(b|0)){break}if((a-1|0)>>>0>63>>>0){ue[c[636260]&31](4,56824,(g=i,i=i+8|0,c[g>>2]=a,g)|0);i=g;i=e;return}if((c[2544472+(a<<2)>>2]|0)==0){ue[c[636260]&31](4,46976,(g=i,i=i+8|0,c[g>>2]=a,g)|0);i=g;i=e;return}if((f|0)==0){i=e;return}Vx(d|0,(c[f+12>>2]|0)+(b*552|0)|0,552)|0;i=e;return}}while(0);ue[c[636260]&31](3,46896,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;i=e;return}function Vt(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0.0,l=0,m=0.0,n=0,o=0,p=0.0;d=i;if((a-1|0)>>>0>63>>>0){ue[c[636260]&31](4,56824,(e=i,i=i+8|0,c[e>>2]=a,e)|0);i=e;f=0;i=d;return f|0}g=c[2544472+(a<<2)>>2]|0;if((g|0)==0){ue[c[636260]&31](4,46976,(e=i,i=i+8|0,c[e>>2]=a,e)|0);i=e;f=0;i=d;return f|0}e=c[15488]|0;if((e|0)==0){f=0;i=d;return f|0}a=g|0;if((c[a>>2]|0)==0){f=0;i=d;return f|0}h=e|0;if((c[h>>2]|0)<=0){f=0;i=d;return f|0}j=e+12|0;e=g+4|0;g=0;k=0.0;l=0;while(1){do{if((c[(c[j>>2]|0)+(l*552|0)>>2]|0)==0){m=k;n=g}else{o=c[(c[e>>2]|0)+(l<<2)>>2]|0;if((o|0)<0){m=k;n=g;break}p=+iu(b,c[a>>2]|0,o);if(!(p>k)){m=k;n=g;break}m=p;n=l}}while(0);o=l+1|0;if((o|0)<(c[h>>2]|0)){g=n;k=m;l=o}else{f=n;break}}i=d;return f|0}function Wt(a){a=a|0;return}function Xt(){var a=0,b=0,d=0,e=0,f=0;a=1;while(1){b=2544472+(a<<2)|0;d=a+1|0;if((c[b>>2]|0)==0){break}if((d|0)<65){a=d}else{e=0;f=5;break}}if((f|0)==5){return e|0}c[b>>2]=kv(8)|0;e=a;return e|0}function Yt(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;if((a-1|0)>>>0>63>>>0){ue[c[636260]&31](4,56824,(d=i,i=i+8|0,c[d>>2]=a,d)|0);i=d;i=b;return}e=2544472+(a<<2)|0;f=c[e>>2]|0;if((f|0)==0){ue[c[636260]&31](4,46976,(d=i,i=i+8|0,c[d>>2]=a,d)|0);i=d;i=b;return}d=c[f>>2]|0;if((d|0)!=0){cu(d)}d=c[f+4>>2]|0;if((d|0)!=0){nv(d)}nv(c[e>>2]|0);c[e>>2]=0;i=b;return}function Zt(){var a=0,b=0,d=0;a=i;b=St(dv(48272,47008)|0)|0;c[15488]=b;if((b|0)!=0){d=0;i=a;return d|0}ue[c[636260]&31](4,46008,(b=i,i=i+1|0,i=i+7&-8,c[b>>2]=0,b)|0);i=b;d=12;i=a;return d|0}function _t(){var a=0,b=0,d=0,e=0;a=c[15488]|0;if((a|0)!=0){nv(a)}c[15488]=0;a=1;do{b=2544472+(a<<2)|0;d=c[b>>2]|0;if((d|0)!=0){e=c[d>>2]|0;if((e|0)!=0){cu(e)}e=c[d+4>>2]|0;if((e|0)!=0){nv(e)}nv(c[b>>2]|0);c[b>>2]=0}a=a+1|0;}while((a|0)<65);return}function $t(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0;d=i;i=i+1064|0;e=d|0;f=e|0;a:do{if(($v(a,e)|0)==0){h=0}else{do{if((Tx(f,46472)|0)==0){sv(a,56728,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j;if(($v(a,e)|0)!=0){break}rv(a,46816,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j;h=0;break a}}while(0);if((c[e+1024>>2]|0)==3){g[b>>2]=+g[e+1036>>2];h=1;break}else{rv(a,40232,(j=i,i=i+8|0,c[j>>2]=f,j)|0);i=j;h=0;break}}}while(0);i=d;return h|0}function au(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0.0;d=b+8|0;do{if((Av(a,35424)|0)==0){c[d>>2]=0;e=b+12|0;if(($t(a,e)|0)==0){f=0;return f|0}else{h=+g[e>>2];g[b+16>>2]=h;g[b+20>>2]=h;break}}else{c[d>>2]=1;if((Zv(a,30272)|0)==0){f=0;return f|0}if(($t(a,b+12|0)|0)==0){f=0;return f|0}if((Zv(a,25952)|0)==0){f=0;return f|0}if(($t(a,b+16|0)|0)==0){f=0;return f|0}if((Zv(a,25952)|0)==0){f=0;return f|0}if(($t(a,b+20|0)|0)==0){f=0;return f|0}if((Zv(a,22576)|0)==0){f=0}else{break}return f|0}}while(0);f=(Zv(a,19488)|0)!=0|0;return f|0}function bu(a){a=a|0;var b=0;if((a|0)==0){return}b=c[a+24>>2]|0;if((b|0)!=0){bu(b)}b=c[a+28>>2]|0;if((b|0)!=0){bu(b)}nv(a);return}function cu(a){a=a|0;var b=0,d=0,e=0;if(!(+bv(17448)!=0.0)){return}b=a|0;if((c[b>>2]|0)>0){d=0;do{bu(c[a+4+(d<<3)+4>>2]|0);e=c[a+4+(d<<3)>>2]|0;if((e|0)!=0){nv(e)}d=d+1|0;}while((d|0)<(c[b>>2]|0))}nv(a);return}function du(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;b=i;i=i+1064|0;d=b|0;e=d|0;do{if((Zv(a,30272)|0)==0){f=0}else{if((_v(a,3,4096,d)|0)==0){f=0;break}h=d+1032|0;j=c[h>>2]|0;if((Zv(a,22576)|0)==0){f=0;break}if((Zv(a,60200)|0)==0){f=0;break}if(($v(a,d)|0)==0){f=0;break}else{k=0;l=0;m=0}while(1){n=(Tx(e,58656)|0)==0;if(!n){if((Tx(e,56816)|0)!=0){o=33;break}}p=kv(32)|0;q=p;c[p>>2]=j;if((l|0)==0){r=q}else{c[l+28>>2]=q;r=k}if(n){if((m|0)!=0){o=12;break}c[p+4>>2]=999999;s=1}else{if((_v(a,3,4096,d)|0)==0){o=15;break}c[p+4>>2]=c[h>>2];s=m}if((Zv(a,54552)|0)==0){o=19;break}if(($v(a,d)|0)==0){o=19;break}if((Tx(e,60200)|0)==0){if(($v(a,d)|0)==0){o=22;break}else{t=1}}else{t=0}if((Tx(e,53520)|0)==0){if((au(a,q)|0)==0){o=25;break}}else{if((Tx(e,52456)|0)!=0){o=29;break}n=du(a)|0;c[p+24>>2]=n;if((n|0)==0){o=28;break}}if((t|0)!=0){if((Zv(a,50576)|0)==0){o=32;break}}if(($v(a,d)|0)==0){o=35;break}if((Tx(e,50576)|0)==0){o=37;break}else{k=r;l=q;m=s}}if((o|0)==12){rv(a,55520,(u=i,i=i+1|0,i=i+7&-8,c[u>>2]=0,u)|0);i=u;bu(r);f=0;break}else if((o|0)==15){bu(r);f=0;break}else if((o|0)==19){bu(r);f=0;break}else if((o|0)==22){bu(r);f=0;break}else if((o|0)==25){bu(r);f=0;break}else if((o|0)==28){bu(r);f=0;break}else if((o|0)==29){rv(a,51456,(u=i,i=i+8|0,c[u>>2]=e,u)|0);i=u;f=0;break}else if((o|0)==32){bu(r);f=0;break}else if((o|0)==33){bu(k);rv(a,51456,(u=i,i=i+8|0,c[u>>2]=e,u)|0);i=u;f=0;break}else if((o|0)==35){bu(r);f=0;break}else if((o|0)==37){if((s|0)!=0){f=r;break}sv(a,49816,(u=i,i=i+1|0,i=i+7&-8,c[u>>2]=0,u)|0);i=u;h=kv(32)|0;q=h;c[h>>2]=j;c[h+4>>2]=999999;g[h+12>>2]=0.0;c[h+28>>2]=0;c[h+24>>2]=0;if((p|0)==0){f=q;break}c[p+28>>2]=q;f=r;break}}}while(0);i=b;return f|0}function eu(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;b=i;i=i+1064|0;d=b|0;e=d|0;do{if(+bv(17448)!=0.0){f=0}else{g=-1;h=0;while(1){j=c[61440+(h<<2)>>2]|0;if((j|0)==0){k=(g|0)==-1?h:g}else{if((Tx(a,j+1028|0)|0)==0){l=j;m=86;break}else{k=g}}j=h+1|0;if((j|0)<128){g=k;h=j}else{break}}if((m|0)==86){n=1060;o=0;i=b;return l|0}if(!((k|0)==-1)){f=k;break}ue[c[636260]&31](3,49056,(p=i,i=i+8|0,c[p>>2]=a,p)|0);i=p;l=0;n=1060;o=0;i=b;return l|0}}while(0);hw(48256);k=bw(a)|0;if((k|0)==0){ue[c[636260]&31](3,46952,(p=i,i=i+8|0,c[p>>2]=a,p)|0);i=p;l=0;n=1060;o=0;i=b;return l|0}h=kv(1092)|0;g=h;j=h;c[j>>2]=0;rn(h+1028|0,a,64);a:do{if((Yv(k,d)|0)!=0){q=h+4|0;while(1){if((Tx(e,46e3)|0)!=0){m=77;break}if((c[j>>2]|0)>127){m=14;break}if((_v(k,1,0,d)|0)==0){m=16;break}sw(e);r=kv((Wx(e|0)|0)+1|0)|0;c[q+(c[j>>2]<<3)>>2]=r;by(r|0,e|0)|0;if(($v(k,d)|0)==0){m=24;break}if((Tx(e,60200)|0)==0){if(($v(k,d)|0)==0){m=33;break}else{s=1}}else{s=0}if((Tx(e,52456)|0)==0){r=du(k)|0;if((r|0)==0){m=42;break}c[q+(c[j>>2]<<3)+4>>2]=r}else{if((Tx(e,53520)|0)!=0){m=60;break}t=kv(32)|0;r=t;c[t>>2]=0;c[t+4>>2]=999999;c[t+28>>2]=0;c[t+24>>2]=0;if((au(k,r)|0)==0){m=52;break}c[q+(c[j>>2]<<3)+4>>2]=r}if((s|0)!=0){if((Zv(k,50576)|0)==0){m=69;break}}c[j>>2]=(c[j>>2]|0)+1;if((Yv(k,d)|0)==0){break a}}if((m|0)==14){sv(k,45392,(p=i,i=i+1|0,i=i+7&-8,c[p>>2]=0,p)|0);i=p;break}else if((m|0)==16){if(+bv(17448)!=0.0){if((c[j>>2]|0)>0){q=0;do{bu(c[g+4+(q<<3)+4>>2]|0);r=c[g+4+(q<<3)>>2]|0;if((r|0)!=0){nv(r)}q=q+1|0;}while((q|0)<(c[j>>2]|0))}nv(h)}cw(k);l=0;n=1060;o=0;i=b;return l|0}else if((m|0)==24){if(+bv(17448)!=0.0){if((c[j>>2]|0)>0){q=0;do{bu(c[g+4+(q<<3)+4>>2]|0);r=c[g+4+(q<<3)>>2]|0;if((r|0)!=0){nv(r)}q=q+1|0;}while((q|0)<(c[j>>2]|0))}nv(h)}cw(k);l=0;n=1060;o=0;i=b;return l|0}else if((m|0)==33){if(+bv(17448)!=0.0){if((c[j>>2]|0)>0){q=0;do{bu(c[g+4+(q<<3)+4>>2]|0);r=c[g+4+(q<<3)>>2]|0;if((r|0)!=0){nv(r)}q=q+1|0;}while((q|0)<(c[j>>2]|0))}nv(h)}cw(k);l=0;n=1060;o=0;i=b;return l|0}else if((m|0)==42){if(+bv(17448)!=0.0){if((c[j>>2]|0)>0){q=0;do{bu(c[g+4+(q<<3)+4>>2]|0);r=c[g+4+(q<<3)>>2]|0;if((r|0)!=0){nv(r)}q=q+1|0;}while((q|0)<(c[j>>2]|0))}nv(h)}cw(k);l=0;n=1060;o=0;i=b;return l|0}else if((m|0)==52){nv(t);if(+bv(17448)!=0.0){if((c[j>>2]|0)>0){q=0;do{bu(c[g+4+(q<<3)+4>>2]|0);r=c[g+4+(q<<3)>>2]|0;if((r|0)!=0){nv(r)}q=q+1|0;}while((q|0)<(c[j>>2]|0))}nv(h)}cw(k);l=0;n=1060;o=0;i=b;return l|0}else if((m|0)==60){rv(k,51456,(p=i,i=i+8|0,c[p>>2]=e,p)|0);i=p;if(+bv(17448)!=0.0){if((c[j>>2]|0)>0){q=0;do{bu(c[g+4+(q<<3)+4>>2]|0);r=c[g+4+(q<<3)>>2]|0;if((r|0)!=0){nv(r)}q=q+1|0;}while((q|0)<(c[j>>2]|0))}nv(h)}cw(k);l=0;n=1060;o=0;i=b;return l|0}else if((m|0)==69){if(+bv(17448)!=0.0){if((c[j>>2]|0)>0){q=0;do{bu(c[g+4+(q<<3)+4>>2]|0);r=c[g+4+(q<<3)>>2]|0;if((r|0)!=0){nv(r)}q=q+1|0;}while((q|0)<(c[j>>2]|0))}nv(h)}cw(k);l=0;n=1060;o=0;i=b;return l|0}else if((m|0)==77){rv(k,51456,(p=i,i=i+8|0,c[p>>2]=e,p)|0);i=p;if(+bv(17448)!=0.0){if((c[j>>2]|0)>0){q=0;do{bu(c[g+4+(q<<3)+4>>2]|0);r=c[g+4+(q<<3)>>2]|0;if((r|0)!=0){nv(r)}q=q+1|0;}while((q|0)<(c[j>>2]|0))}nv(h)}cw(k);l=0;n=1060;o=0;i=b;return l|0}}}while(0);cw(k);ue[c[636260]&31](1,44544,(p=i,i=i+8|0,c[p>>2]=a,p)|0);i=p;if(+bv(17448)!=0.0){l=g;n=1060;o=0;i=b;return l|0}c[61440+(f<<2)>>2]=g;l=g;n=1060;o=0;i=b;return l|0}function fu(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=c[a>>2]|0;if((d|0)>0){e=0}else{f=-1;return f|0}while(1){g=e+1|0;if((Tx(c[a+4+(e<<3)>>2]|0,b)|0)==0){f=e;h=4;break}if((g|0)<(d|0)){e=g}else{f=-1;h=4;break}}if((h|0)==4){return f|0}return 0}function gu(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,i=0,j=0,k=0.0,l=0.0,m=0.0,n=0.0;d=b;while(1){e=c[a+(c[d>>2]<<2)>>2]|0;f=c[d+4>>2]|0;if((e|0)<(f|0)){b=c[d+24>>2]|0;if((b|0)==0){h=4;break}else{d=b;continue}}i=c[d+28>>2]|0;if((i|0)==0){h=15;break}j=c[i+4>>2]|0;if((e|0)<(j|0)){h=7;break}else{d=i}}if((h|0)==4){k=+g[d+12>>2];return+k}else if((h|0)==7){b=c[d+24>>2]|0;if((b|0)==0){l=+g[d+12>>2]}else{l=+gu(a,b)}b=c[i+24>>2]|0;if((b|0)==0){m=+g[i+12>>2]}else{m=+gu(a,b)}if((j|0)==999999){k=m;return+k}n=+(e-f|0)/+(j-f|0);k=m*n+l*(1.0-n);return+k}else if((h|0)==15){k=+g[d+12>>2];return+k}return 0.0}function hu(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,i=0,j=0,k=0.0,l=0.0,m=0.0,n=0.0,o=0,p=0.0,q=0;d=b;while(1){e=d|0;b=c[a+(c[e>>2]<<2)>>2]|0;f=d+4|0;if((b|0)<(c[f>>2]|0)){h=c[d+24>>2]|0;if((h|0)==0){i=4;break}else{d=h;continue}}j=d+28|0;h=c[j>>2]|0;if((h|0)==0){i=15;break}if((b|0)<(c[h+4>>2]|0)){i=7;break}else{d=h}}if((i|0)==4){h=d+16|0;k=+g[h>>2];l=+((Yx()|0)&32767|0)/32767.0;m=k+l*(+g[d+20>>2]- +g[h>>2]);return+m}else if((i|0)==7){h=c[d+24>>2]|0;if((h|0)==0){b=d+16|0;l=+g[b>>2];k=+((Yx()|0)&32767|0)/32767.0;n=l+k*(+g[d+20>>2]- +g[b>>2])}else{n=+hu(a,h)}h=c[j>>2]|0;b=c[h+24>>2]|0;if((b|0)==0){k=+g[h+16>>2];l=+((Yx()|0)&32767|0)/32767.0;o=c[j>>2]|0;p=k+l*(+g[o+20>>2]- +g[o+16>>2]);q=o}else{p=+gu(a,b);q=h}h=c[q+4>>2]|0;if((h|0)==999999){m=p;return+m}q=c[f>>2]|0;l=+((c[a+(c[e>>2]<<2)>>2]|0)-q|0)/+(h-q|0);m=p*l+n*(1.0-l);return+m}else if((i|0)==15){m=+g[d+12>>2];return+m}return 0.0}function iu(a,b,d){a=a|0;b=b|0;d=d|0;return+(+gu(a,c[b+4+(d<<3)+4>>2]|0))}function ju(a,b,d){a=a|0;b=b|0;d=d|0;return+(+hu(a,c[b+4+(d<<3)+4>>2]|0))}function ku(a){a=a|0;var b=0,d=0,e=0.0,f=0,h=0.0,i=0,j=0.0,k=0.0,l=0.0;b=a;do{a=c[b+24>>2]|0;do{if((a|0)==0){if((c[b+8>>2]|0)!=1){break}d=+((Yx()|0)&32767|0)/32767.0<.01;e=(+((Yx()|0)&32767|0)/32767.0+-.5)*2.0;f=b+20|0;h=+g[f>>2];i=b+16|0;j=+g[i>>2];k=e*(h-j);if(d){d=b+12|0;e=k+ +g[d>>2];g[d>>2]=e;l=e}else{d=b+12|0;e=k*.5+ +g[d>>2];g[d>>2]=e;l=e}if(l<j){g[i>>2]=l;break}if(!(l>h)){break}g[f>>2]=l}else{ku(a)}}while(0);b=c[b+28>>2]|0;}while((b|0)!=0);return}function lu(a){a=a|0;var b=0,d=0;b=a|0;if((c[b>>2]|0)>0){d=0}else{return}do{ku(c[a+4+(d<<3)+4>>2]|0);d=d+1|0;}while((d|0)<(c[b>>2]|0));return}function mu(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0.0,h=0,j=0,k=0,l=0;e=i;a:do{if((c[a+24>>2]|0)==0){if((c[a+8>>2]|0)!=1){break}do{if((c[b+8>>2]|0)==1){if((c[d+8>>2]|0)!=1){break}f=(+g[a+12>>2]+ +g[b+12>>2])*.5;g[d+12>>2]=f;h=d+20|0;if(f>+g[h>>2]){g[h>>2]=f}h=d+16|0;if(!(f>+g[h>>2])){break a}g[h>>2]=f;break a}}while(0);ue[c[636260]&31](3,43248,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j;k=0;i=e;return k|0}else{h=c[b+24>>2]|0;do{if((h|0)!=0){l=c[d+24>>2]|0;if((l|0)==0){break}if((mu(h,h,l)|0)==0){k=0}else{break a}i=e;return k|0}}while(0);ue[c[636260]&31](3,43888,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j;k=0;i=e;return k|0}}while(0);h=c[a+28>>2]|0;b:do{if((h|0)!=0){a=c[b+28>>2]|0;do{if((a|0)!=0){l=c[d+28>>2]|0;if((l|0)==0){break}if((mu(h,a,l)|0)==0){k=0}else{break b}i=e;return k|0}}while(0);ue[c[636260]&31](3,42680,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j;k=0;i=e;return k|0}}while(0);k=1;i=e;return k|0}function nu(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;f=a|0;g=c[f>>2]|0;do{if((g|0)==(c[b>>2]|0)){if((g|0)!=(c[d>>2]|0)){break}if((g|0)>0){h=0}else{i=e;return}do{mu(c[a+4+(h<<3)+4>>2]|0,c[b+4+(h<<3)+4>>2]|0,c[d+4+(h<<3)+4>>2]|0)|0;h=h+1|0;}while((h|0)<(c[f>>2]|0));i=e;return}}while(0);ue[c[636260]&31](3,42088,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;i=e;return}function ou(){var a=0,b=0,d=0,e=0,f=0,g=0;a=0;do{b=61440+(a<<2)|0;d=c[b>>2]|0;if((d|0)!=0){e=d|0;if((c[e>>2]|0)>0){f=0;do{bu(c[d+4+(f<<3)+4>>2]|0);g=c[d+4+(f<<3)>>2]|0;if((g|0)!=0){nv(g)}f=f+1|0;}while((f|0)<(c[e>>2]|0))}nv(d);c[b>>2]=0}a=a+1|0;}while((a|0)<128);return}function pu(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;e=c[636267]|0;f=Hn(45944,(g=i,i=i+8|0,c[g>>2]=b,g)|0)|0;i=g;ae[e&127](a,f);i=d;return}function qu(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;e=c[636267]|0;f=Hn(56632,(g=i,i=i+8|0,c[g>>2]=b,g)|0)|0;i=g;ae[e&127](a,f);i=d;return}function ru(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|131072;return}function su(a,b){a=a|0;b=b|0;ae[c[636267]&127](a,b);return}function tu(a,b){a=a|0;b=b|0;c[(c[636258]|0)+(a*40|0)+36>>2]=b;return}function uu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|1;return}function vu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|65536;return}function wu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|2;return}function xu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|8;return}function yu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;a=c[b>>2]|0;c[b>>2]=(a&268435456|0)==0?a|16:a&-17;return}function zu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;a=c[b>>2]|0;c[b>>2]=(a&268435456|0)==0?a|32768:a&-32769;return}function Au(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|128;return}function Bu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|524288;return}function Cu(a,b){a=a|0;b=b|0;var d=0;d=(c[636258]|0)+(a*40|0)+32|0;c[d>>2]=c[d>>2]|b;return}function Du(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|32;return}function Eu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|256;return}function Fu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|512;return}function Gu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|2048;return}function Hu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|4096;return}function Iu(a){a=a|0;var b=0;b=(c[636258]|0)+(a*40|0)+32|0;c[b>>2]=c[b>>2]|8192;return}function Ju(a,b,d){a=a|0;b=b|0;d=+d;var e=0,f=0.0;e=c[636258]|0;g[e+(a*40|0)+4>>2]=+g[b>>2];g[e+(a*40|0)+8>>2]=+g[b+4>>2];g[e+(a*40|0)+12>>2]=+g[b+8>>2];do{if(d>400.0){f=400.0}else{if(!(d<-400.0)){f=d;break}f=-400.0}}while(0);g[e+(a*40|0)+16>>2]=f;return}function Ku(a,b){a=a|0;b=b|0;var d=0;d=c[636258]|0;g[d+(a*40|0)+20>>2]=+g[b>>2];g[d+(a*40|0)+24>>2]=+g[b+4>>2];g[d+(a*40|0)+28>>2]=+g[b+8>>2];return}function Lu(a,b){a=a|0;b=+b;return}function Mu(a,b,d){a=a|0;b=+b;d=d|0;var e=0;e=(c[636258]|0)+(a*40|0)|0;g[e>>2]=b;Vx(d|0,e|0,40)|0;return}function Nu(a){a=a|0;var b=0,d=0;b=c[636258]|0;d=b+(a*40|0)+32|0;Zx(b+(a*40|0)|0,0,20)|0;c[d>>2]=c[d>>2]<<24&268435456;return}function Ou(){c[636258]=mv((c[636254]|0)*40|0)|0;return 0}function Pu(){nv(c[636258]|0);c[636258]=0;return}function Qu(){return((Lb()|0)*1e3|0|0)/1e6|0|0}function Ru(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0;b=i;i=i+4096|0;d=~~+bv(40216);c[636484]=d;Zx(2545008,0,16)|0;if((d|0)!=0){d=b|0;e=av(35416)|0;f=av(30264)|0;g=av(25936)|0;do{if((a[e]|0)==0){xn(d,4096,17432,(h=i,i=i+1|0,i=i+7&-8,c[h>>2]=0,h)|0)|0;i=h}else{if((a[f]|0)!=0){xn(d,4096,22552,(h=i,i=i+32|0,c[h>>2]=e,c[h+8>>2]=47,c[h+16>>2]=f,c[h+24>>2]=47,h)|0)|0;i=h;break}if((a[g]|0)==0){xn(d,4096,19464,(h=i,i=i+24|0,c[h>>2]=e,c[h+8>>2]=47,c[h+16>>2]=47,h)|0)|0;i=h;break}else{xn(d,4096,22552,(h=i,i=i+32|0,c[h>>2]=e,c[h+8>>2]=47,c[h+16>>2]=g,c[h+24>>2]=47,h)|0)|0;i=h;break}}}while(0);gv(d);}ue[c[636260]&31](1,60160,(h=i,i=i+1|0,i=i+7&-8,c[h>>2]=0,h)|0);i=h;c[636254]=~~+ev(58640,56808);c[636253]=~~+ev(55504,54544);h=Bp()|0;if((h|0)!=0){j=h;i=b;return j|0}h=Ou()|0;if((h|0)!=0){j=h;i=b;return j|0}h=Zt()|0;if((h|0)!=0){j=h;i=b;return j|0}h=Ys()|0;if((h|0)!=0){j=h;i=b;return j|0}h=qs()|0;if((h|0)!=0){j=h;i=b;return j|0}h=Qt()|0;if((h|0)!=0){j=h;i=b;return j|0}c[636250]=1;c[636252]=1;j=0;i=b;return j|0}function Su(){var a=0,b=0,d=0;a=i;if((c[636252]|0)==0){ue[c[636260]&31](3,46752,(b=i,i=i+8|0,c[b>>2]=53496,b)|0);i=b;d=1;i=a;return d|0}else{rs();Rt();Zs();_t();ou();Gr();Cp();Pu();$u();Dv();hv();c[636250]=0;c[636252]=0;iw();d=0;i=a;return d|0}return 0}function Tu(a,b){a=a|0;b=b|0;fv(a,b);return 0}function Uu(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;e=d-1|0;ay(c|0,av(b)|0,e|0)|0;a[c+e|0]=0;return 0}function Vu(a){a=+a;var b=0,d=0,e=0;b=i;if((c[636252]|0)==0){ue[c[636260]&31](3,46752,(d=i,i=i+8|0,c[d>>2]=52432,d)|0);i=d;e=1;i=b;return e|0}else{e=xp(a)|0;i=b;return e|0}return 0}function Wu(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;d=c[636260]|0;if((c[636252]|0)==0){ue[d&31](3,46752,(e=i,i=i+8|0,c[e>>2]=51424,e)|0);i=e;f=1;i=b;return f|0}ue[d&31](1,50528,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;d=Ap(a)|0;if((d|0)!=0){f=d;i=b;return f|0}ys();et();ue[c[636260]&31](1,49760,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;f=0;i=b;return f|0}function Xu(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;if((c[636252]|0)==0){ue[c[636260]&31](3,46752,(e=i,i=i+8|0,c[e>>2]=49024,e)|0);i=e;f=1;i=d;return f|0}g=c[636253]|0;if((a|0)<0|(g|0)<(a|0)){ue[c[636260]&31](3,56560,(e=i,i=i+24|0,c[e>>2]=49024,c[e+8>>2]=a,c[e+16>>2]=g,e)|0);i=e;f=2;i=d;return f|0}else{f=fp(a,b)|0;i=d;return f|0}return 0}function Yu(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return 0}function Zu(a,b){a=a|0;b=b|0;var d=0,e=0;d=i;Vx(2545040,b|0,88)|0;Zx(2550048,0,536)|0;if((a|0)==2){c[637512]=72;c[637513]=8;c[637514]=22;c[637515]=4;c[637516]=10;c[637517]=4;c[637518]=4;c[637519]=22;c[637520]=20;c[637521]=16;c[637522]=62;c[637523]=16;c[637524]=8;c[637525]=26;c[637526]=30;c[637527]=6;c[637528]=12;c[637529]=42;c[637530]=4;c[637531]=4;c[637532]=36;c[637533]=4;c[637534]=8;c[637535]=14;c[637536]=40;c[637537]=42;c[637538]=6;c[637539]=80;c[637540]=16;c[637541]=76;c[637542]=74;c[637549]=94;c[637543]=34;c[637544]=70;c[637545]=26;c[637546]=56;c[637547]=42;c[637548]=58;c[637550]=62;c[637551]=116;c[637552]=106;c[637553]=4;c[637554]=18;c[637556]=4;c[637555]=4;c[637557]=82;c[637558]=4;c[637559]=60;c[637560]=4;c[637561]=4;c[637562]=8;c[637563]=6;c[637564]=4;c[637565]=14;c[637566]=98;c[637567]=18;c[637568]=4;c[637569]=48;c[637570]=26;c[637571]=4;c[637572]=18;c[637573]=4;c[637574]=24;c[637575]=14;c[637576]=4;c[637577]=22;c[637578]=16;c[637579]=8;c[637580]=112;c[637581]=46;c[637582]=10;c[637583]=10;c[637584]=24;c[637585]=46;c[637586]=48;c[637587]=36;c[637588]=38;c[637589]=84;c[637590]=44;c[637591]=64;c[637592]=24;c[637593]=16;c[637594]=40;c[637595]=38;c[637596]=14;c[637597]=4;c[637598]=26;c[637599]=8;c[637600]=36;c[637601]=44;c[637602]=16;c[637603]=6;c[637604]=6;c[637605]=106;c[637606]=14;c[637607]=24;c[637608]=20;c[637609]=20;c[637610]=68;c[637611]=6;c[637612]=52;c[637613]=86;c[637614]=96;c[637615]=6;c[637616]=4;c[637617]=4;c[637618]=102;c[637619]=22;c[637620]=4;c[637621]=8;c[637622]=24;c[637623]=32;c[637624]=56;c[637625]=4;c[637626]=4;c[637627]=10;c[637628]=52;c[637629]=26;c[637630]=10;c[637631]=14;c[637632]=6;c[637633]=28;c[637634]=22;c[637635]=28;c[637636]=18;c[637637]=34;c[637638]=50;c[637639]=22;c[637640]=6;c[637641]=4;c[637642]=4;c[637643]=40;c[637644]=10;c[637645]=20;e=2550048;i=d;return e|0}else{ue[c[636260]&31](3,48184,(b=i,i=i+16|0,c[b>>2]=2,c[b+8>>2]=a,b)|0);i=b;e=0;i=d;return e|0}return 0}function _u(a,c){a=a|0;c=c|0;var e=0,f=0,g=0,h=0,i=0;if((c|0)>0){e=-1;f=0}else{g=-1;return g|0}while(1){h=b[7744+(((d[a+f|0]|0)^(e&65535)>>>8)<<1)>>1]^e<<8;i=f+1|0;if((i|0)<(c|0)){e=h;f=i}else{g=h;break}}return g|0}function $u(){var a=0,b=0;a=c[193338]|0;if((a|0)==0){c[193338]=0;return}else{b=a}do{c[193338]=c[b+20>>2];a=c[b+4>>2]|0;if((a|0)!=0){nv(a)}nv(c[b>>2]|0);nv(b);b=c[193338]|0;}while((b|0)!=0);c[193338]=0;return}function av(a){a=a|0;var b=0,d=0,e=0,f=0;b=c[193338]|0;if((b|0)==0){d=2551504;return d|0}else{e=b}while(1){if((tn(c[e>>2]|0,a)|0)==0){break}b=c[e+20>>2]|0;if((b|0)==0){d=2551504;f=5;break}else{e=b}}if((f|0)==5){return d|0}d=c[e+4>>2]|0;return d|0}function bv(a){a=a|0;var b=0,d=0.0,e=0,f=0;b=c[193338]|0;if((b|0)==0){d=0.0;return+d}else{e=b}while(1){if((tn(c[e>>2]|0,a)|0)==0){break}b=c[e+20>>2]|0;if((b|0)==0){d=0.0;f=5;break}else{e=b}}if((f|0)==5){return+d}d=+g[e+16>>2];return+d}function cv(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0.0,k=0,l=0.0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0.0,u=0,v=0;e=c[193338]|0;a:do{if((e|0)!=0){f=e;while(1){if((tn(c[f>>2]|0,b)|0)==0){h=f;break}f=c[f+20>>2]|0;if((f|0)==0){break a}}return h|0}}while(0);e=jv(24)|0;f=e;Zx(e|0,0,24)|0;i=jv((Wx(b|0)|0)+1|0)|0;c[e>>2]=i;by(i|0,b|0)|0;c[e+20>>2]=c[193338];c[193338]=f;b=jv((Wx(d|0)|0)+1|0)|0;i=e+4|0;c[i>>2]=b;by(b|0,d|0)|0;d=c[i>>2]|0;i=a[d]|0;b:do{if(i<<24>>24==0){j=0.0}else{b=d;k=0;l=0.0;m=i;while(1){n=(k|0)==0;do{if((m-48&255)>>>0>9>>>0){if(!(n&m<<24>>24==46)){j=0.0;break b}o=b+1|0;p=o;q=10;r=a[o]|0;s=9}else{if(!n){p=b;q=k;r=m;s=9;break}t=l*10.0+ +((m<<24>>24)-48|0);u=0;v=b}}while(0);if((s|0)==9){s=0;t=l+ +((r<<24>>24)-48|0)/+(q|0);u=q*10|0;v=p}n=v+1|0;o=a[n]|0;if(o<<24>>24==0){j=t;break}else{b=n;k=u;l=t;m=o}}}}while(0);g[e+16>>2]=j;c[e+12>>2]=1;h=f;return h|0}function dv(a,b){a=a|0;b=b|0;return c[(cv(a,b)|0)+4>>2]|0}function ev(a,b){a=a|0;b=b|0;return+(+g[(cv(a,b)|0)+16>>2])}function fv(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0,l=0.0,m=0,n=0,o=0,p=0,q=0.0,r=0,s=0,t=0,u=0,v=0.0,w=0,x=0;e=c[193338]|0;a:do{if((e|0)==0){f=5}else{h=e;while(1){if((tn(c[h>>2]|0,b)|0)==0){break}i=c[h+20>>2]|0;if((i|0)==0){f=5;break a}else{h=i}}nv(c[h+4>>2]|0);j=h}}while(0);if((f|0)==5){e=jv(24)|0;i=e;Zx(e|0,0,24)|0;k=jv((Wx(b|0)|0)+1|0)|0;c[e>>2]=k;by(k|0,b|0)|0;c[e+20>>2]=c[193338];c[193338]=i;j=i}i=jv((Wx(d|0)|0)+1|0)|0;e=j+4|0;c[e>>2]=i;by(i|0,d|0)|0;d=c[e>>2]|0;e=a[d]|0;if(e<<24>>24==0){l=0.0;m=j+16|0;g[m>>2]=l;n=j+12|0;c[n>>2]=1;return}else{o=d;p=0;q=0.0;r=e}b:while(1){e=(p|0)==0;do{if((r-48&255)>>>0>9>>>0){if(!(e&r<<24>>24==46)){l=0.0;f=14;break b}d=o+1|0;s=d;t=10;u=a[d]|0;f=11}else{if(!e){s=o;t=p;u=r;f=11;break}v=q*10.0+ +((r<<24>>24)-48|0);w=0;x=o}}while(0);if((f|0)==11){f=0;v=q+ +((u<<24>>24)-48|0)/+(t|0);w=t*10|0;x=s}e=x+1|0;h=a[e]|0;if(h<<24>>24==0){l=v;f=14;break}else{o=e;p=w;q=v;r=h}}if((f|0)==14){m=j+16|0;g[m>>2]=l;n=j+12|0;c[n>>2]=1;return}}function gv(b){b=b|0;var d=0,e=0,f=0;d=i;if(!(+ev(45808,56528)!=0.0)){i=d;return}do{if((b|0)!=0){if((a[b]|0)==0){break}if((c[191094]|0)!=0){ue[c[636260]&31](3,40176,(e=i,i=i+8|0,c[e>>2]=763352,e)|0);i=e;i=d;return}f=zc(b|0,35392)|0;c[191094]=f;if((f|0)==0){ue[c[636260]&31](3,30216,(e=i,i=i+8|0,c[e>>2]=b,e)|0);i=e;i=d;return}else{ay(763352,b|0,1024)|0;ue[c[636260]&31](1,25920,(e=i,i=i+8|0,c[e>>2]=763352,e)|0);i=e;i=d;return}}}while(0);ue[c[636260]&31](1,46728,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;i=d;return}function hv(){var a=0,b=0,d=0;a=i;b=c[191094]|0;if((b|0)==0){i=a;return}if((Ta(b|0)|0)==0){c[191094]=0;ue[c[636260]&31](1,19448,(d=i,i=i+8|0,c[d>>2]=763352,d)|0);i=d;i=a;return}else{ue[c[636260]&31](3,22520,(d=i,i=i+8|0,c[d>>2]=763352,d)|0);i=d;i=a;return}}function iv(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;i=i+16|0;e=d|0;if((c[191094]|0)==0){i=d;return}f=e;c[f>>2]=b;c[f+4>>2]=0;Wc(c[191094]|0,a|0,e|0)|0;Wa(c[191094]|0)|0;i=d;return}function jv(a){a=a|0;var b=0,d=0;b=be[c[636268]&127](a+4|0)|0;if((b|0)==0){d=0;return d|0}c[b>>2]=305419896;d=b+4|0;return d|0}function kv(a){a=a|0;var b=0,d=0;b=be[c[636268]&127](a+4|0)|0;if((b|0)==0){d=0}else{c[b>>2]=305419896;d=b+4|0}Zx(d|0,0,a|0)|0;return d|0}function lv(a){a=a|0;var b=0,d=0;b=be[c[636271]&127](a+4|0)|0;if((b|0)==0){d=0;return d|0}c[b>>2]=-2023406815;d=b+4|0;return d|0}function mv(a){a=a|0;var b=0,d=0;b=be[c[636271]&127](a+4|0)|0;if((b|0)==0){d=0}else{c[b>>2]=-2023406815;d=b+4|0}Zx(d|0,0,a|0)|0;return d|0}function nv(a){a=a|0;var b=0;b=a-4|0;if((c[b>>2]|0)!=305419896){return}je[c[636269]&127](b);return}function ov(){return se[c[636270]&31]()|0}function pv(){return}function qv(){return}function rv(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+1040|0;f=e+1024|0;g=e|0;h=f;c[h>>2]=d;c[h+4>>2]=0;fd(g|0,1024,b|0,f|0)|0;f=c[a+2052>>2]|0;a=c[f+1052>>2]|0;ue[c[636260]&31](3,45272,(b=i,i=i+24|0,c[b>>2]=f,c[b+8>>2]=a,c[b+16>>2]=g,b)|0);i=b;i=e;return}function sv(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+1040|0;f=e+1024|0;g=e|0;h=f;c[h>>2]=d;c[h+4>>2]=0;fd(g|0,1024,b|0,f|0)|0;f=c[a+2052>>2]|0;a=c[f+1052>>2]|0;ue[c[636260]&31](2,45272,(b=i,i=i+24|0,c[b>>2]=f,c[b+8>>2]=a,c[b+16>>2]=g,b)|0);i=b;i=e;return}function tv(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;d=i;e=a+2056|0;f=c[e>>2]|0;a:do{if((f|0)==0){g=a+2052|0;h=a+2068|0;j=a+2072|0;while(1){if((qw(c[g>>2]|0,b)|0)!=0){k=1;l=13;break}b:do{if((vw(c[g>>2]|0)|0)!=0){m=c[h>>2]|0;if((m|0)==0){break}else{n=m}while(1){if((c[n+8>>2]|0)!=(c[g>>2]|0)){break b}sv(a,40160,(m=i,i=i+1|0,i=i+7&-8,c[m>>2]=0,m)|0);i=m;m=c[h>>2]|0;if((m|0)==0){break b}if((c[m+8>>2]|0)!=(c[g>>2]|0)){n=m;continue}c[h>>2]=c[m+12>>2];c[j>>2]=(c[j>>2]|0)-(c[m+4>>2]|0);nv(m);n=c[h>>2]|0;if((n|0)==0){break}}}}while(0);m=c[g>>2]|0;o=c[m+2136>>2]|0;if((o|0)==0){k=0;l=13;break}c[g>>2]=o;yw(m);m=c[e>>2]|0;if((m|0)!=0){p=m;break a}}if((l|0)==13){i=d;return k|0}}else{p=f}}while(0);Vx(b|0,p|0,1060)|0;p=c[e>>2]|0;c[e>>2]=c[p+1056>>2];nv(p|0);c[164924]=(c[164924]|0)-1;k=1;i=d;return k|0}function uv(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;f=i;g=i;i=i+1060|0;i=i+7&-8;h=g|0;if((tv(a,g)|0)==0){rv(a,35368,(j=i,i=i+8|0,c[j>>2]=c[b>>2],j)|0);i=j;k=0;l=1060;m=0;i=f;return k|0}n=b+12|0;o=c[n>>2]|0;if((o|0)>(e|0)){rv(a,30176,(j=i,i=i+8|0,c[j>>2]=e,j)|0);i=j;k=0;l=1060;m=0;i=f;return k|0}if((o|0)>0){Zx(d|0,0,((o|0)>1?o<<2:4)|0)|0}if((Tx(h,25904)|0)==0){p=0;q=0}else{o=jv(1060)|0;if((o|0)==0){aj(0,46704,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j;return 0}Vx(o|0,h|0,1056)|0;r=o+1056|0;c[r>>2]=0;c[164924]=(c[164924]|0)+1;s=a+2056|0;c[r>>2]=c[s>>2];c[s>>2]=o;rv(a,35368,(j=i,i=i+8|0,c[j>>2]=c[b>>2],j)|0);i=j;k=0;l=1060;m=0;i=f;return k|0}a:while(1){if((p|0)>=(e|0)){t=12;break}if((p|0)>=(c[n>>2]|0)){t=14;break}o=d+(p<<2)|0;c[o>>2]=0;s=0;r=1;u=q;b:while(1){v=r;w=u;while(1){if((tv(a,g)|0)==0){t=24;break a}if((Tx(h,60152)|0)==0&(w|0)<1){break b}if((Tx(h,25904)|0)==0){v=0;w=w+1|0;continue}if((Tx(h,56800)|0)==0){if((w|0)<2){t=27;break a}else{x=w-1|0}}else{x=w}if((p|0)<(c[n>>2]|0)){break}else{v=0;w=x}}y=jv(1060)|0;if((y|0)==0){t=30;break a}z=y;Vx(y|0,h|0,1056)|0;c[164924]=(c[164924]|0)+1;c[y+1056>>2]=0;if((s|0)==0){c[o>>2]=z;s=z;r=0;u=x;continue}else{c[s+1056>>2]=z;s=z;r=0;u=x;continue}}if((v|0)!=0){sv(a,58616,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j}p=p+1|0;q=w}if((t|0)==12){rv(a,22464,(j=i,i=i+8|0,c[j>>2]=c[b>>2],j)|0);i=j;k=0;l=1060;m=0;i=f;return k|0}else if((t|0)==14){sv(a,19416,(j=i,i=i+8|0,c[j>>2]=c[b>>2],j)|0);i=j;k=0;l=1060;m=0;i=f;return k|0}else if((t|0)==24){rv(a,17408,(j=i,i=i+8|0,c[j>>2]=c[b>>2],j)|0);i=j;k=0;l=1060;m=0;i=f;return k|0}else if((t|0)==27){if((c[d+((c[n>>2]|0)-1<<2)>>2]|0)!=0){k=1;l=1060;m=0;i=f;return k|0}sv(a,55480,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j;k=1;l=1060;m=0;i=f;return k|0}else if((t|0)==30){aj(0,46704,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j;return 0}return 0}function vv(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0;j=i;i=i+8|0;k=j|0;l=jv(1060)|0;if((l|0)==0){aj(0,46704,(m=i,i=i+1|0,i=i+7&-8,c[m>>2]=0,m)|0);i=m;return 0}n=l;Vx(l|0,d|0,1056)|0;c[l+1056>>2]=0;c[164924]=(c[164924]|0)+1;o=c[e+8>>2]|0;if((o|0)==1){e=d+1048|0;jb(l|0,46936,(m=i,i=i+8|0,c[m>>2]=c[e>>2],m)|0)|0;i=m;m=c[e>>2]|0;c[l+1032>>2]=m;g[l+1036>>2]=+(m|0);c[l+1024>>2]=3;c[l+1028>>2]=4104;c[f>>2]=n;c[h>>2]=n;i=j;return 1}else if((o|0)==4){c[k>>2]=Dd(0)|0;m=ob(k|0)|0;e=l;z=34;a[e]=z;z=z>>8;a[e+1|0]=z;rd(l|0,m+11|0,8)|0;e=n+(Wx(l|0)|0)|0;z=34;a[e]=z;z=z>>8;a[e+1|0]=z;Gx(m);c[l+1024>>2]=4;c[l+1028>>2]=Wx(l|0)|0;c[f>>2]=n;c[h>>2]=n;i=j;return 1}else if((o|0)==3){c[k>>2]=Dd(0)|0;m=ob(k|0)|0;k=l;z=34;a[k]=z;z=z>>8;a[k+1|0]=z;rd(l|0,m+4|0,7)|0;rd(l+7|0,m+20|0,4)|0;k=n+(Wx(l|0)|0)|0;z=34;a[k]=z;z=z>>8;a[k+1|0]=z;Gx(m);c[l+1024>>2]=4;c[l+1028>>2]=Wx(l|0)|0;c[f>>2]=n;c[h>>2]=n;i=j;return 1}else if((o|0)==2){by(l|0,c[b+2052>>2]|0)|0;c[l+1024>>2]=4;c[l+1028>>2]=Wx(l|0)|0;c[f>>2]=n;c[h>>2]=n;i=j;return 1}else{c[f>>2]=0;c[h>>2]=0;i=j;return 1}return 0}function wv(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0;h=i;i=i+1576|0;j=h|0;k=h+512|0;Zx(j|0,0,512)|0;l=k|0;if((c[e+8>>2]|0)!=0){vv(b,d,e,f,g)|0;m=1;n=1060;o=0;p=512;q=0;i=h;return m|0}d=e+12|0;do{if((c[d>>2]|0)!=0){if((uv(b,e,j|0,128)|0)==0){m=0}else{break}n=1060;o=0;p=512;q=0;i=h;return m|0}}while(0);r=c[e+20>>2]|0;a:do{if((r|0)==0){s=0;t=0}else{u=e+16|0;v=k+1024|0;w=k+1040|0;x=k+1044|0;y=0;A=0;B=r;b:while(1){C=B|0;c:do{if((c[B+1024>>2]|0)==4){D=c[u>>2]|0;if((D|0)==0){E=19;break}else{F=0;G=D}while(1){if((Tx(G|0,C)|0)==0){break}D=c[G+1056>>2]|0;if((D|0)==0){E=19;break c}else{F=F+1|0;G=D}}if(!((F|0)>-1)){E=19;break}D=c[j+(F<<2)>>2]|0;if((D|0)==0){H=A;I=y;J=B;break}else{K=y;L=A;M=D}while(1){D=jv(1060)|0;if((D|0)==0){E=15;break b}N=D;Vx(D|0,M|0,1056)|0;c[164924]=(c[164924]|0)+1;c[D+1056>>2]=0;if((L|0)==0){O=N}else{c[L+1056>>2]=N;O=K}D=c[M+1056>>2]|0;if((D|0)==0){H=N;I=O;J=B;break}else{K=O;L=N;M=D}}}else{E=19}}while(0);d:do{if((E|0)==19){E=0;e:do{if((a[C]|0)==35){if((a[B+1|0]|0)!=0){E=32;break}D=c[B+1056>>2]|0;f:do{if((D|0)!=0){N=D|0;P=c[u>>2]|0;if((P|0)==0){break}else{Q=0;R=P}while(1){if((Tx(R|0,N)|0)==0){break}P=c[R+1056>>2]|0;if((P|0)==0){break f}else{Q=Q+1|0;R=P}}if(!((Q|0)>-1)){break}N=c[j+(Q<<2)>>2]|0;c[v>>2]=1;c[w>>2]=0;c[x>>2]=0;a[l]=0;P=k+(Wx(l|0)|0)|0;z=34;a[P]=z;z=z>>8;a[P+1|0]=z;if((N|0)!=0){P=N;do{rd(l|0,P|0,1023-(Wx(l|0)|0)|0)|0;P=c[P+1056>>2]|0;}while((P|0)!=0)}rd(l|0,54536,1023-(Wx(l|0)|0)|0)|0;P=jv(1060)|0;if((P|0)==0){E=29;break b}Vx(P|0,l|0,1056)|0;c[P+1056>>2]=0;S=D;T=P;break e}}while(0);sv(b,45328,(U=i,i=i+1|0,i=i+7&-8,c[U>>2]=0,U)|0);i=U;H=A;I=y;J=B;break d}else{E=32}}while(0);if((E|0)==32){E=0;D=jv(1060)|0;if((D|0)==0){E=33;break b}Vx(D|0,C|0,1056)|0;c[D+1056>>2]=0;S=B;T=D}D=T;c[164924]=(c[164924]|0)+1;c[T+1056>>2]=0;if((A|0)==0){H=D;I=D;J=S;break}c[A+1056>>2]=D;H=D;I=y;J=S}}while(0);C=c[J+1056>>2]|0;if((C|0)==0){E=7;break}else{y=I;A=H;B=C}}if((E|0)==7){if((I|0)==0){s=H;t=0;break}else{V=I;W=H}g:while(1){B=V+1056|0;A=V+1024|0;X=V|0;y=W;while(1){Y=c[B>>2]|0;if((Y|0)==0){s=y;t=I;break a}if((a[Y|0]|0)!=35){V=Y;W=y;continue g}if((a[Y+1|0]|0)!=35){break}Z=c[Y+1056>>2]|0;if((Z|0)==0){V=Y;W=y;continue g}x=c[A>>2]|0;if((x|0)==4){if(!(((c[Z+1024>>2]|0)-3|0)>>>0<2>>>0)){break g}w=Z|0;$x(X|0,w|0)|0;_=w}else if((x|0)==1){if((c[Z+1024>>2]|0)!=1){break g}a[V+((Wx(X|0)|0)-1)|0]=0;$x(X|0,Z+1|0)|0;_=Z|0}else{break g}nv(c[B>>2]|0);c[164924]=(c[164924]|0)-1;c[B>>2]=c[Z+1056>>2];nv(_);c[164924]=(c[164924]|0)-1;y=(Z|0)==(y|0)?V:y}if((Y|0)==0){s=y;t=I;break a}else{V=Y;W=y}}rv(b,44512,(U=i,i=i+16|0,c[U>>2]=X,c[U+8>>2]=Z,U)|0);i=U;m=0;n=1060;o=0;p=512;q=0;i=h;return m|0}else if((E|0)==15){aj(0,46704,(U=i,i=i+1|0,i=i+7&-8,c[U>>2]=0,U)|0);i=U;return 0}else if((E|0)==29){aj(0,46704,(U=i,i=i+1|0,i=i+7&-8,c[U>>2]=0,U)|0);i=U;return 0}else if((E|0)==33){aj(0,46704,(U=i,i=i+1|0,i=i+7&-8,c[U>>2]=0,U)|0);i=U;return 0}}}while(0);c[f>>2]=t;c[g>>2]=s;s=c[d>>2]|0;if((s|0)>0){$=0;aa=s}else{m=1;n=1060;o=0;p=512;q=0;i=h;return m|0}while(1){s=c[j+($<<2)>>2]|0;if((s|0)==0){ba=aa}else{g=s;while(1){s=c[g+1056>>2]|0;nv(g|0);c[164924]=(c[164924]|0)-1;if((s|0)==0){break}else{g=s}}ba=c[d>>2]|0}g=$+1|0;if((g|0)<(ba|0)){$=g;aa=ba}else{m=1;break}}n=1060;o=0;p=512;q=0;i=h;return m|0}function xv(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;d=i;i=i+1128|0;e=d|0;f=e|0;g=d+1064|0;if((c[b+2072>>2]|0)>0){h=1;j=64;k=0;l=1060;m=0;i=d;return h|0}if((tv(b,e)|0)==0){rv(b,43840,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;h=0;j=64;k=0;l=1060;m=0;i=d;return h|0}o=e+1052|0;if((c[o>>2]|0)>0){rv(b,43840,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;h=0;j=64;k=0;l=1060;m=0;i=d;return h|0}p=e+1024|0;q=c[p>>2]|0;do{if((q|0)==1){sw(f);r=f;a:while(1){s=r+1|0;while(1){t=a[r]|0;if((t<<24>>24|0)==0){u=f;break a}else if(!((t<<24>>24|0)==92|(t<<24>>24|0)==47)){r=s;continue a}t=a[s]|0;if(!((t<<24>>24|0)==92|(t<<24>>24|0)==47)){r=s;continue a}_x(r|0,s|0,Wx(r|0)|0)|0}}while(1){r=a[u]|0;if((r<<24>>24|0)==47|(r<<24>>24|0)==92){a[u]=47}else if((r<<24>>24|0)==0){break}u=u+1|0}r=ww(f)|0;if((r|0)!=0){v=r;break}by(g|0,b+1024|0)|0;$x(g|0,f|0)|0;w=ww(g)|0;x=39}else if((q|0)==5){if((a[f]|0)!=60){x=38;break}by(g|0,b+1024|0)|0;b:do{if((tv(b,e)|0)==0){x=26}else{while(1){if((c[o>>2]|0)>0){break}if((c[p>>2]|0)==5){if((a[f]|0)==62){break b}}rd(g|0,f|0,63)|0;if((tv(b,e)|0)==0){x=26;break b}}r=jv(1060)|0;if((r|0)==0){aj(0,46704,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;return 0}else{Vx(r|0,f|0,1056)|0;s=r+1056|0;c[s>>2]=0;c[164924]=(c[164924]|0)+1;t=b+2056|0;c[s>>2]=c[t>>2];c[t>>2]=r;x=26;break}}}while(0);do{if((x|0)==26){if((a[f]|0)==62){break}sv(b,43208,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n}}while(0);if((a[g]|0)==0){rv(b,42624,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;h=0;j=64;k=0;l=1060;m=0;i=d;return h|0}else{y=g}c:while(1){r=y+1|0;while(1){t=a[y]|0;if((t<<24>>24|0)==0){z=g;break c}else if(!((t<<24>>24|0)==92|(t<<24>>24|0)==47)){y=r;continue c}t=a[r]|0;if(!((t<<24>>24|0)==92|(t<<24>>24|0)==47)){y=r;continue c}_x(y|0,r|0,Wx(y|0)|0)|0}}while(1){r=a[z]|0;if((r<<24>>24|0)==0){break}else if((r<<24>>24|0)==47|(r<<24>>24|0)==92){a[z]=47}z=z+1|0}w=ww(g)|0;x=39}else{x=38}}while(0);if((x|0)==38){rv(b,43840,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;h=0;j=64;k=0;l=1060;m=0;i=d;return h|0}do{if((x|0)==39){if((w|0)!=0){v=w;break}rv(b,42048,(n=i,i=i+8|0,c[n>>2]=g,n)|0);i=n;h=0;j=64;k=0;l=1060;m=0;i=d;return h|0}}while(0);g=b+2052|0;w=c[g>>2]|0;do{if((w|0)==0){A=0}else{z=v|0;y=w;while(1){if((tn(y|0,z)|0)==0){break}f=c[y+2136>>2]|0;if((f|0)==0){x=46;break}else{y=f}}if((x|0)==46){A=c[g>>2]|0;break}rv(b,56480,(n=i,i=i+8|0,c[n>>2]=z,n)|0);i=n;h=1;j=64;k=0;l=1060;m=0;i=d;return h|0}}while(0);c[v+2136>>2]=A;c[g>>2]=v;h=1;j=64;k=0;l=1060;m=0;i=d;return h|0}function yv(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;d=i;i=i+1064|0;e=d|0;f=e|0;if((c[b+2072>>2]|0)>0){g=1;h=1060;j=0;i=d;return g|0}k=e+1052|0;l=0;while(1){if((tv(b,e)|0)==0){break}if((c[k>>2]|0)>(l|0)){m=5;break}if((Tx(f,41592)|0)==0){l=1}else{m=10;break}}do{if((m|0)==5){l=jv(1060)|0;if((l|0)==0){aj(0,46704,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;return 0}else{Vx(l|0,f|0,1056)|0;k=l+1056|0;c[k>>2]=0;c[164924]=(c[164924]|0)+1;o=b+2056|0;c[k>>2]=c[o>>2];c[o>>2]=l;break}}else if((m|0)==10){if((c[e+1024>>2]|0)!=4){l=jv(1060)|0;if((l|0)==0){aj(0,46704,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;return 0}Vx(l|0,f|0,1056)|0;o=l+1056|0;c[o>>2]=0;c[164924]=(c[164924]|0)+1;k=b+2056|0;c[o>>2]=c[k>>2];c[k>>2]=l;rv(b,40272,(n=i,i=i+8|0,c[n>>2]=f,n)|0);i=n;g=0;h=1060;j=0;i=d;return g|0}l=a[f]|0;if(l<<24>>24==0){p=0}else{k=0;o=0;q=l;while(1){l=(da(o+119|0,q<<24>>24)|0)+k|0;r=o+1|0;s=a[e+r|0]|0;if(s<<24>>24==0){p=l;break}else{k=l;o=r;q=s}}}q=(c[b+2064>>2]|0)+(((p>>>10^p^p>>>20)&1023)<<2)|0;o=c[q>>2]|0;if((o|0)==0){g=1;h=1060;j=0;i=d;return g|0}else{t=0;u=o}while(1){v=u|0;if((Tx(c[v>>2]|0,f)|0)==0){break}o=c[u+28>>2]|0;if((o|0)==0){g=1;m=29;break}else{t=u;u=o}}if((m|0)==29){h=1060;j=0;i=d;return g|0}if((c[u+4>>2]&1|0)!=0){sv(b,39688,(n=i,i=i+8|0,c[n>>2]=f,n)|0);i=n;g=1;h=1060;j=0;i=d;return g|0}o=c[u+28>>2]|0;if((t|0)==0){c[q>>2]=o}else{c[t+28>>2]=o}o=c[u+16>>2]|0;if((o|0)!=0){k=o;while(1){o=c[k+1056>>2]|0;nv(k|0);c[164924]=(c[164924]|0)-1;if((o|0)==0){break}else{k=o}}}k=c[u+20>>2]|0;if((k|0)!=0){q=k;while(1){k=c[q+1056>>2]|0;nv(q|0);c[164924]=(c[164924]|0)-1;if((k|0)==0){break}else{q=k}}}nv(c[v>>2]|0);nv(u);g=1;h=1060;j=0;i=d;return g|0}}while(0);rv(b,41176,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;g=0;h=1060;j=0;i=d;return g|0}function zv(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;d=i;i=i+2128|0;e=d|0;f=d+1064|0;g=f|0;if((c[b+2072>>2]|0)>0){h=1;j=1060;k=0;i=d;return h|0}l=f+1052|0;m=0;while(1){if((tv(b,f)|0)==0){break}if((c[l>>2]|0)>(m|0)){n=5;break}if((Tx(g,41592)|0)==0){m=1}else{n=10;break}}do{if((n|0)==5){m=jv(1060)|0;if((m|0)==0){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}else{Vx(m|0,g|0,1056)|0;p=m+1056|0;c[p>>2]=0;c[164924]=(c[164924]|0)+1;q=b+2056|0;c[p>>2]=c[q>>2];c[q>>2]=m;break}}else if((n|0)==10){m=f+1024|0;if((c[m>>2]|0)!=4){q=jv(1060)|0;if((q|0)==0){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}Vx(q|0,g|0,1056)|0;p=q+1056|0;c[p>>2]=0;c[164924]=(c[164924]|0)+1;r=b+2056|0;c[p>>2]=c[r>>2];c[r>>2]=q;rv(b,38776,(o=i,i=i+8|0,c[o>>2]=g,o)|0);i=o;h=0;j=1060;k=0;i=d;return h|0}q=b+2064|0;r=c[q>>2]|0;p=a[g]|0;if(p<<24>>24==0){s=0}else{t=0;u=0;v=p;while(1){p=(da(u+119|0,v<<24>>24)|0)+t|0;w=u+1|0;x=a[f+w|0]|0;if(x<<24>>24==0){s=p;break}else{t=p;u=w;v=x}}}v=c[r+(((s>>>10^s^s>>>20)&1023)<<2)>>2]|0;a:do{if((v|0)!=0){u=v;while(1){if((Tx(c[u>>2]|0,g)|0)==0){break}t=c[u+28>>2]|0;if((t|0)==0){break a}else{u=t}}if((c[u+4>>2]&1|0)!=0){rv(b,38344,(o=i,i=i+8|0,c[o>>2]=g,o)|0);i=o;h=0;j=1060;k=0;i=d;return h|0}sv(b,37960,(o=i,i=i+8|0,c[o>>2]=g,o)|0);i=o;t=jv(1060)|0;if((t|0)==0){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}Vx(t|0,g|0,1056)|0;x=t+1056|0;c[x>>2]=0;c[164924]=(c[164924]|0)+1;w=b+2056|0;c[x>>2]=c[w>>2];c[w>>2]=t;if((yv(b)|0)==0){h=0}else{break}j=1060;k=0;i=d;return h|0}}while(0);v=jv(32)|0;r=v;Zx(v|0,0,32)|0;t=jv((Wx(g|0)|0)+1|0)|0;w=v;c[w>>2]=t;by(t|0,g|0)|0;t=c[q>>2]|0;x=c[w>>2]|0;p=a[x]|0;if(p<<24>>24==0){y=0}else{z=0;A=0;B=p;while(1){p=(da(A+119|0,B<<24>>24)|0)+z|0;C=A+1|0;D=a[x+C|0]|0;if(D<<24>>24==0){y=p;break}else{z=p;A=C;B=D}}}B=t+(((y>>>10^y^y>>>20)&1023)<<2)|0;c[v+28>>2]=c[B>>2];c[B>>2]=r;B=0;while(1){if((tv(b,f)|0)==0){h=1;n=99;break}if((c[l>>2]|0)>(B|0)){n=29;break}if((Tx(g,41592)|0)==0){B=1}else{n=33;break}}if((n|0)==29){B=jv(1060)|0;if((B|0)==0){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}Vx(B|0,g|0,1056)|0;r=B+1056|0;c[r>>2]=0;c[164924]=(c[164924]|0)+1;t=b+2056|0;c[r>>2]=c[t>>2];c[t>>2]=B;h=1;j=1060;k=0;i=d;return h|0}else if((n|0)==33){b:do{if(((c[f+1044>>2]|0)-(c[f+1040>>2]|0)|0)<=0){if((Tx(g,25904)|0)!=0){break}B=e|0;do{if((Yv(b,e)|0)==0){n=40}else{if((Tx(B,56800)|0)==0){E=0;break}t=jv(1060)|0;if((t|0)==0){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}else{Vx(t|0,B|0,1056)|0;r=t+1056|0;c[r>>2]=0;c[164924]=(c[164924]|0)+1;A=b+2056|0;c[r>>2]=c[A>>2];c[A>>2]=t;n=40;break}}}while(0);c:do{if((n|0)==40){B=v+16|0;u=v+12|0;t=0;d:while(1){A=0;while(1){if((tv(b,f)|0)==0){n=48;break d}if((c[l>>2]|0)>(A|0)){n=44;break d}if((Tx(g,41592)|0)==0){A=1}else{break}}if((c[m>>2]|0)!=4){n=50;break}A=c[B>>2]|0;e:do{if((A|0)!=0){r=0;z=A;while(1){if((Tx(z|0,g)|0)==0){break}x=c[z+1056>>2]|0;if((x|0)==0){break e}else{r=r+1|0;z=x}}if((r|0)>-1){n=55;break d}}}while(0);A=jv(1060)|0;if((A|0)==0){n=57;break}z=A;Vx(A|0,g|0,1056)|0;c[164924]=(c[164924]|0)+1;c[A+1040>>2]=0;c[A+1044>>2]=0;c[A+1052>>2]=0;c[A+1056>>2]=0;if((t|0)==0){c[B>>2]=z}else{c[t+1056>>2]=z}c[u>>2]=(c[u>>2]|0)+1;A=0;while(1){if((tv(b,f)|0)==0){n=68;break d}if((c[l>>2]|0)>(A|0)){n=64;break d}if((Tx(g,41592)|0)==0){A=1}else{break}}if((Tx(g,56800)|0)==0){E=0;break c}if((Tx(g,60152)|0)==0){t=z}else{n=71;break}}do{if((n|0)==44){t=jv(1060)|0;if((t|0)==0){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}else{Vx(t|0,g|0,1056)|0;u=t+1056|0;c[u>>2]=0;c[164924]=(c[164924]|0)+1;B=b+2056|0;c[u>>2]=c[B>>2];c[B>>2]=t;n=48;break}}else if((n|0)==50){rv(b,37208,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;h=0;j=1060;k=0;i=d;return h|0}else if((n|0)==55){rv(b,36784,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;h=0;j=1060;k=0;i=d;return h|0}else if((n|0)==57){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}else if((n|0)==64){t=jv(1060)|0;if((t|0)==0){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}else{Vx(t|0,g|0,1056)|0;B=t+1056|0;c[B>>2]=0;c[164924]=(c[164924]|0)+1;u=b+2056|0;c[B>>2]=c[u>>2];c[u>>2]=t;n=68;break}}else if((n|0)==71){rv(b,35464,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;h=0;j=1060;k=0;i=d;return h|0}}while(0);if((n|0)==48){rv(b,37576,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;h=0;j=1060;k=0;i=d;return h|0}else if((n|0)==68){rv(b,36400,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;h=0;j=1060;k=0;i=d;return h|0}}}while(0);while(1){if((tv(b,f)|0)==0){h=1;n=99;break}if((c[l>>2]|0)>(E|0)){break}if((Tx(g,41592)|0)==0){E=1}else{break b}}if((n|0)==99){j=1060;k=0;i=d;return h|0}t=jv(1060)|0;if((t|0)==0){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}Vx(t|0,g|0,1056)|0;u=t+1056|0;c[u>>2]=0;c[164924]=(c[164924]|0)+1;B=b+2056|0;c[u>>2]=c[B>>2];c[B>>2]=t;h=1;j=1060;k=0;i=d;return h|0}}while(0);m=jv(1060)|0;if((m|0)==0){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}t=v+20|0;B=0;u=m;f:while(1){m=u;Vx(u|0,g|0,1056)|0;A=u+1056|0;c[A>>2]=0;c[164924]=(c[164924]|0)+1;do{if((c[u+1024>>2]|0)==4){if((Tx(u,c[w>>2]|0)|0)!=0){n=85;break}rv(b,34880,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;F=B}else{n=85}}while(0);do{if((n|0)==85){n=0;c[u+1040>>2]=0;c[u+1044>>2]=0;c[u+1052>>2]=0;c[A>>2]=0;if((B|0)==0){c[t>>2]=m;F=m;break}else{c[B+1056>>2]=m;F=m;break}}}while(0);m=0;while(1){if((tv(b,f)|0)==0){break f}if((c[l>>2]|0)>(m|0)){n=91;break f}if((Tx(g,41592)|0)==0){m=1}else{break}}m=jv(1060)|0;if((m|0)==0){n=81;break}else{B=F;u=m}}if((n|0)==81){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}do{if((n|0)==91){u=jv(1060)|0;if((u|0)==0){aj(0,46704,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;return 0}else{Vx(u|0,g|0,1056)|0;B=u+1056|0;c[B>>2]=0;c[164924]=(c[164924]|0)+1;w=b+2056|0;c[B>>2]=c[w>>2];c[w>>2]=u;break}}}while(0);if((F|0)==0){h=1;j=1060;k=0;i=d;return h|0}do{if((Tx(c[t>>2]|0,34520)|0)!=0){if((Tx(F|0,34520)|0)==0){break}else{h=1}j=1060;k=0;i=d;return h|0}}while(0);rv(b,33960,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;h=0;j=1060;k=0;i=d;return h|0}else if((n|0)==99){j=1060;k=0;i=d;return h|0}}}while(0);rv(b,39336,(o=i,i=i+1|0,i=i+7&-8,c[o>>2]=0,o)|0);i=o;h=0;j=1060;k=0;i=d;return h|0}function Av(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;i=i+1064|0;e=d|0;f=e|0;if((Yv(a,e)|0)==0){g=0;h=1060;j=0;i=d;return g|0}if((Tx(f,b)|0)==0){g=1;h=1060;j=0;i=d;return g|0}b=jv(1060)|0;if((b|0)==0){aj(0,46704,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e;return 0}Vx(b|0,f|0,1056)|0;f=b+1056|0;c[f>>2]=0;c[164924]=(c[164924]|0)+1;e=a+2056|0;c[f>>2]=c[e>>2];c[e>>2]=b;g=0;h=1060;j=0;i=d;return g|0}function Bv(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;b=i;i=i+3136|0;d=b|0;e=d|0;f=xw(a,Wx(a|0)|0,33408)|0;Zx(e|0,0,3136)|0;ay(e|0,33408,64)|0;c[d+2052>>2]=f;e=d+2064|0;c[e>>2]=kv(4096)|0;a=zv(d)|0;g=d+2056|0;h=c[g>>2]|0;if((h|0)!=0){j=h;do{c[g>>2]=c[j+1056>>2];nv(j|0);c[164924]=(c[164924]|0)-1;j=c[g>>2]|0;}while((j|0)!=0)}j=c[e>>2]|0;e=0;while(1){g=c[j+(e<<2)>>2]|0;h=e+1|0;if((g|0)!=0){k=g;break}if((h|0)<1024){e=h}else{k=0;break}}nv(j);yw(f);if((a|0)>0){l=k;m=3136;n=0;i=b;return l|0}if((c[d+2060>>2]|0)==0){l=0;m=3136;n=0;i=b;return l|0}d=c[k+16>>2]|0;if((d|0)!=0){a=d;while(1){d=c[a+1056>>2]|0;nv(a|0);c[164924]=(c[164924]|0)-1;if((d|0)==0){break}else{a=d}}}a=c[k+20>>2]|0;if((a|0)!=0){d=a;while(1){a=c[d+1056>>2]|0;nv(d|0);c[164924]=(c[164924]|0)-1;if((a|0)==0){break}else{d=a}}}nv(c[k>>2]|0);nv(k);l=0;m=3136;n=0;i=b;return l|0}function Cv(a){a=a|0;var b=0,d=0;b=Bv(a)|0;if((b|0)==0){d=0;return d|0}c[b+24>>2]=c[196756];c[196756]=b;d=1;return d|0}function Dv(){var a=0,b=0,d=0;a=c[196756]|0;if((a|0)==0){return}else{b=a}do{c[196756]=c[b+24>>2];a=c[b+16>>2]|0;if((a|0)!=0){d=a;while(1){a=c[d+1056>>2]|0;nv(d|0);c[164924]=(c[164924]|0)-1;if((a|0)==0){break}else{d=a}}}d=c[b+20>>2]|0;if((d|0)!=0){a=d;while(1){d=c[a+1056>>2]|0;nv(a|0);c[164924]=(c[164924]|0)-1;if((d|0)==0){break}else{a=d}}}nv(c[b>>2]|0);nv(b);b=c[196756]|0;}while((b|0)!=0);return}function Ev(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;a=i;d=jv(32)|0;e=d;f=b|0;g=jv((Wx(c[f>>2]|0)|0)+1|0)|0;c[d>>2]=g;by(g|0,c[f>>2]|0)|0;c[d+4>>2]=c[b+4>>2];c[d+8>>2]=c[b+8>>2];c[d+12>>2]=c[b+12>>2];c[d+24>>2]=0;c[d+28>>2]=0;f=d+20|0;c[f>>2]=0;g=c[b+20>>2]|0;a:do{if((g|0)!=0){h=0;j=g;while(1){k=jv(1060)|0;if((k|0)==0){break}l=k;Vx(k|0,j|0,1056)|0;c[164924]=(c[164924]|0)+1;c[k+1056>>2]=0;if((h|0)==0){c[f>>2]=l}else{c[h+1056>>2]=l}k=c[j+1056>>2]|0;if((k|0)==0){break a}else{h=l;j=k}}aj(0,46704,(m=i,i=i+1|0,i=i+7&-8,c[m>>2]=0,m)|0);i=m;return 0}}while(0);f=d+16|0;c[f>>2]=0;d=c[b+16>>2]|0;if((d|0)==0){i=a;return e|0}else{n=0;o=d}while(1){d=jv(1060)|0;if((d|0)==0){p=10;break}b=d;Vx(d|0,o|0,1056)|0;c[164924]=(c[164924]|0)+1;c[d+1056>>2]=0;if((n|0)==0){c[f>>2]=b}else{c[n+1056>>2]=b}d=c[o+1056>>2]|0;if((d|0)==0){p=15;break}else{n=b;o=d}}if((p|0)==10){aj(0,46704,(m=i,i=i+1|0,i=i+7&-8,c[m>>2]=0,m)|0);i=m;return 0}else if((p|0)==15){i=a;return e|0}return 0}function Fv(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;e=i;i=i+1064|0;f=e|0;g=f|0;h=f+1052|0;j=0;while(1){if((tv(b,f)|0)==0){break}if((c[h>>2]|0)>(j|0)){k=4;break}if((Tx(g,41592)|0)==0){j=1}else{k=9;break}}do{if((k|0)==4){j=jv(1060)|0;if((j|0)==0){aj(0,46704,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);i=l;return 0}else{Vx(j|0,g|0,1056)|0;h=j+1056|0;c[h>>2]=0;c[164924]=(c[164924]|0)+1;m=b+2056|0;c[h>>2]=c[m>>2];c[m>>2]=j;break}}else if((k|0)==9){if((c[f+1024>>2]|0)!=4){j=jv(1060)|0;if((j|0)==0){aj(0,46704,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);i=l;return 0}Vx(j|0,g|0,1056)|0;m=j+1056|0;c[m>>2]=0;c[164924]=(c[164924]|0)+1;h=b+2056|0;c[m>>2]=c[h>>2];c[h>>2]=j;rv(b,32288,(l=i,i=i+8|0,c[l>>2]=g,l)|0);i=l;n=0;o=1060;p=0;i=e;return n|0}j=c[b+2064>>2]|0;h=a[g]|0;if(h<<24>>24==0){q=0}else{m=0;r=0;s=h;while(1){h=(da(r+119|0,s<<24>>24)|0)+m|0;t=r+1|0;u=a[f+t|0]|0;if(u<<24>>24==0){q=h;break}else{m=h;r=t;s=u}}}s=c[j+(((q>>>10^q^q>>>20)&1023)<<2)>>2]|0;a:do{if((s|0)==0){v=0}else{r=s;while(1){if((Tx(c[r>>2]|0,g)|0)==0){v=r;break a}m=c[r+28>>2]|0;if((m|0)==0){v=0;break}else{r=m}}}}while(0);s=jv(16)|0;c[s>>2]=d;c[s+8>>2]=c[b+2052>>2];j=((d|0)==8^(v|0)==0)&1^1;c[s+4>>2]=j;r=b+2072|0;c[r>>2]=j+(c[r>>2]|0);r=b+2068|0;c[s+12>>2]=c[r>>2];c[r>>2]=s;n=1;o=1060;p=0;i=e;return n|0}}while(0);rv(b,32792,(l=i,i=i+1|0,i=i+7&-8,c[l>>2]=0,l)|0);i=l;n=0;o=1060;p=0;i=e;return n|0}function Gv(a){a=a|0;return Fv(a,8)|0}function Hv(a){a=a|0;return Fv(a,16)|0}function Iv(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;b=i;d=a+2068|0;e=c[d>>2]|0;do{if((e|0)!=0){f=a+2052|0;if((c[e+8>>2]|0)!=(c[f>>2]|0)){break}g=c[e>>2]|0;h=c[e+4>>2]|0;c[d>>2]=c[e+12>>2];j=a+2072|0;c[j>>2]=(c[j>>2]|0)-h;nv(e);if((g|0)==0){break}else if((g|0)==2){rv(a,31520,(k=i,i=i+1|0,i=i+7&-8,c[k>>2]=0,k)|0);i=k;l=0;i=b;return l|0}else{g=jv(16)|0;c[g>>2]=2;c[g+8>>2]=c[f>>2];f=(h|0)==0|0;c[g+4>>2]=f;c[j>>2]=(c[j>>2]|0)+f;c[g+12>>2]=c[d>>2];c[d>>2]=g;l=1;i=b;return l|0}}}while(0);rv(a,31832,(k=i,i=i+1|0,i=i+7&-8,c[k>>2]=0,k)|0);i=k;l=0;i=b;return l|0}function Jv(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=i;d=a+2068|0;e=c[d>>2]|0;do{if((e|0)!=0){if((c[e+8>>2]|0)!=(c[a+2052>>2]|0)){break}f=c[e>>2]|0;c[d>>2]=c[e+12>>2];g=a+2072|0;c[g>>2]=(c[g>>2]|0)-(c[e+4>>2]|0);nv(e);if((f|0)==0){break}else{h=1}i=b;return h|0}}while(0);rv(a,31120,(a=i,i=i+1|0,i=i+7&-8,c[a>>2]=0,a)|0);i=a;h=0;i=b;return h|0}function Kv(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,ea=0,fa=0,ga=0,ha=0.0,ia=0,ja=0,ka=0,la=0,ma=0,na=0.0,oa=0,pa=0,qa=0.0,ra=0,sa=0.0,ta=0,ua=0.0,va=0,wa=0,xa=0.0,ya=0,za=0,Aa=0.0,Ba=0,Ca=0,Da=0,Ea=0.0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0;j=i;i=i+2560|0;k=j|0;l=j+1280|0;m=(e|0)!=0;if(m){c[e>>2]=0}n=(f|0)!=0;if(n){g[f>>2]=0.0}a:do{if((d|0)==0){o=0;p=0;q=86}else{r=b+2064|0;s=(h|0)==0;t=0;u=0;v=0;w=0;x=d;y=0;z=0;A=0;B=0;C=0;b:while(1){D=c[x+1024>>2]|0;do{if((D|0)==5){if((A|0)!=0){q=42;break b}E=x+1028|0;F=c[E>>2]|0;if((F|0)==44){G=C;H=B;I=0;J=z;K=y+1|0;L=x;M=w;N=v;O=u;P=t;break}else if((F|0)==45){if((y|0)<1){q=46;break b}else{G=C;H=B;I=0;J=z;K=y-1|0;L=x;M=w;N=v;O=u;P=t;break}}else{if(s){switch(F|0){case 35:case 28:case 21:case 22:case 32:case 33:case 34:{q=49;break b;break};case 36:{q=51;break};case 16:case 17:{q=53;break};case 30:{q=54;break};case 26:case 27:case 29:case 5:case 6:case 7:case 8:case 9:case 10:case 37:case 38:case 42:case 43:{q=55;break};default:{q=57;break b}}}else{switch(F|0){case 36:case 35:{q=51;break};case 16:case 17:{q=53;break};case 30:{q=54;break};case 26:case 27:case 28:case 29:case 5:case 6:case 7:case 8:case 9:case 10:case 37:case 38:case 21:case 22:case 32:case 33:case 34:case 42:case 43:{q=55;break};default:{q=57;break b}}}if((q|0)==51){q=0;if((z|0)!=0){q=52;break b}}else if((q|0)==53){q=0;rv(b,26016,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q}else if((q|0)==54){q=0;if((z|0)==0){G=C;H=B;I=1;J=0;K=y;L=x;M=w;N=v;O=u;P=t;break}}else if((q|0)==55){q=0;if((z|0)==0){q=56;break b}}if((B|0)>63){q=59;break b}F=B+1|0;R=k+(B*20|0)|0;c[R>>2]=c[E>>2];switch(c[E>>2]|0){case 10:{S=11;break};case 36:{S=16;break};case 37:{S=12;break};case 38:{S=12;break};case 21:{S=13;break};case 22:{S=13;break};case 32:{S=10;break};case 33:{S=8;break};case 34:{S=9;break};case 35:{S=16;break};case 42:{S=5;break};case 43:{S=5;break};case 29:{S=14;break};case 30:{S=14;break};case 5:{S=7;break};case 6:{S=6;break};case 7:{S=12;break};case 8:{S=12;break};case 9:{S=11;break};case 26:case 27:case 28:{S=15;break};default:{S=0}}c[k+(B*20|0)+4>>2]=S;c[k+(B*20|0)+8>>2]=y;c[k+(B*20|0)+16>>2]=0;c[k+(B*20|0)+12>>2]=u;if((u|0)==0){G=C;H=F;I=0;J=0;K=y;L=x;M=w;N=v;O=R;P=R;break}c[u+16>>2]=R;G=C;H=F;I=0;J=0;K=y;L=x;M=w;N=v;O=R;P=t;break}}else if((D|0)==3){if((z|0)!=0){q=33;break b}if((C|0)>63){q=35;break b}R=C+1|0;F=l+(C*20|0)|0;E=c[x+1032>>2]|0;if((A|0)==0){c[F>>2]=E;g[l+(C*20|0)+4>>2]=+g[x+1036>>2]}else{c[F>>2]=-E;g[l+(C*20|0)+4>>2]=-0.0- +g[x+1036>>2]}c[l+(C*20|0)+8>>2]=y;c[l+(C*20|0)+16>>2]=0;c[l+(C*20|0)+12>>2]=w;if((w|0)==0){G=R;H=B;I=0;J=1;K=y;L=x;M=F;N=F;O=u;P=t;break}c[w+16>>2]=F;G=R;H=B;I=0;J=1;K=y;L=x;M=F;N=v;O=u;P=t}else if((D|0)==4){if((A|z|0)!=0){q=9;break b}T=x|0;if((Tx(T,29872)|0)!=0){q=11;break b}F=c[x+1056>>2]|0;if((Tx(F|0,25904)|0)==0){U=1;V=c[F+1056>>2]|0}else{U=0;V=F}if((V|0)==0){q=16;break b}if((c[V+1024>>2]|0)!=4){q=16;break b}if((C|0)>63){q=18;break b}F=C+1|0;R=l+(C*20|0)|0;E=c[r>>2]|0;W=V|0;X=a[W]|0;if(X<<24>>24==0){Y=0}else{Z=0;_=0;$=X;while(1){X=(da(_+119|0,$<<24>>24)|0)+Z|0;aa=_+1|0;ba=a[V+aa|0]|0;if(ba<<24>>24==0){Y=X;break}else{Z=X;_=aa;$=ba}}}$=c[E+(((Y>>>10^Y^Y>>>20)&1023)<<2)>>2]|0;c:do{if(($|0)==0){q=25}else{_=$;while(1){if((Tx(c[_>>2]|0,W)|0)==0){break}Z=c[_+28>>2]|0;if((Z|0)==0){q=25;break c}else{_=Z}}c[R>>2]=1;g[l+(C*20|0)+4>>2]=1.0}}while(0);if((q|0)==25){q=0;c[R>>2]=0;g[l+(C*20|0)+4>>2]=0.0}c[l+(C*20|0)+8>>2]=y;c[l+(C*20|0)+16>>2]=0;c[l+(C*20|0)+12>>2]=w;if((w|0)==0){ca=R}else{c[w+16>>2]=R;ca=v}if((U|0)==0){G=F;H=B;I=A;J=1;K=y;L=V;M=R;N=ca;O=u;P=t;break}W=c[V+1056>>2]|0;if((W|0)==0){q=31;break b}if((Tx(W|0,56800)|0)==0){G=F;H=B;I=A;J=1;K=y;L=W;M=R;N=ca;O=u;P=t}else{q=31;break b}}else{q=83;break b}}while(0);D=c[L+1056>>2]|0;if((D|0)==0){q=85;break}else{t=P;u=O;v=N;w=M;x=D;y=K;z=J;A=I;B=H;C=G}}if((q|0)==9){rv(b,30296,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==11){rv(b,29584,(Q=i,i=i+8|0,c[Q>>2]=T,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==16){rv(b,29248,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==18){rv(b,28832,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==31){rv(b,28456,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=t;ga=ca;break}else if((q|0)==33){rv(b,30296,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==35){rv(b,28832,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==42){rv(b,28112,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==46){rv(b,27712,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==49){rv(b,27312,(Q=i,i=i+8|0,c[Q>>2]=x,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==52){rv(b,26784,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==56){rv(b,25536,(Q=i,i=i+8|0,c[Q>>2]=x,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==57){rv(b,25376,(Q=i,i=i+8|0,c[Q>>2]=x,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==59){rv(b,25040,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==83){rv(b,24656,(Q=i,i=i+8|0,c[Q>>2]=x,Q)|0);i=Q;ea=1;fa=t;ga=v;break}else if((q|0)==85){if((J|0)==0){o=N;p=P;q=86;break}if((K|0)!=0){rv(b,24080,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=P;ga=N;break}if((P|0)==0){ea=0;fa=P;ga=N;break}C=(h|0)==0;B=P;A=N;z=0;ha=0.0;y=0;d:while(1){w=B+16|0;u=c[w>>2]|0;e:do{if((u|0)==0){ia=A;ja=B;ka=w}else{r=A;s=B;D=w;W=u;$=c[B+8>>2]|0;while(1){E=c[W+8>>2]|0;if(($|0)>(E|0)){ia=r;ja=s;ka=D;break e}if(($|0)==(E|0)){if((c[s+4>>2]|0)>=(c[W+4>>2]|0)){ia=r;ja=s;ka=D;break e}}if(((c[s>>2]|0)-35|0)>>>0<2>>>0){la=r}else{la=c[r+16>>2]|0}if((la|0)==0){q=99;break d}_=W+16|0;Z=c[_>>2]|0;if((Z|0)==0){ia=la;ja=W;ka=_;break}else{r=la;s=W;D=_;W=Z;$=E}}}}while(0);u=c[ia+16>>2]|0;w=c[ja>>2]|0;f:do{switch(w|0){case 32:{$=ia|0;c[$>>2]=c[$>>2]&c[u>>2];ma=y;na=ha;oa=z;q=146;break};case 33:{$=ia|0;c[$>>2]=c[$>>2]|c[u>>2];ma=y;na=ha;oa=z;q=146;break};case 34:{$=ia|0;c[$>>2]=c[$>>2]^c[u>>2];ma=y;na=ha;oa=z;q=146;break};case 42:{if((y|0)==0){q=136;break d}if(C){if(ha!=0.0){pa=z;qa=ha;ra=0;q=145;break f}g[ia+4>>2]=+g[u+4>>2];pa=z;qa=ha;ra=0;q=145;break f}else{if((z|0)!=0){pa=z;qa=ha;ra=0;q=145;break f}c[ia>>2]=c[u>>2];pa=0;qa=ha;ra=0;q=145;break f}break};case 43:{if((y|0)!=0){q=143;break d}pa=c[ia>>2]|0;qa=+g[ia+4>>2];ra=1;q=145;break};case 28:{$=c[u>>2]|0;if(($|0)==0){q=110;break d}W=ia|0;c[W>>2]=(c[W>>2]|0)%($|0)|0;pa=z;qa=ha;ra=y;q=145;break};case 10:{$=ia|0;c[$>>2]=(c[$>>2]|0)!=(c[u>>2]|0);$=ia+4|0;g[$>>2]=+(+g[$>>2]!=+g[u+4>>2]|0);ma=y;na=ha;oa=z;q=146;break};case 37:{$=ia|0;c[$>>2]=(c[$>>2]|0)>(c[u>>2]|0);$=ia+4|0;g[$>>2]=+(+g[$>>2]>+g[u+4>>2]|0);ma=y;na=ha;oa=z;q=146;break};case 27:{$=c[u>>2]|0;if(($|0)==0){q=107;break d}sa=+g[u+4>>2];if(!(sa!=0.0)){q=107;break d}W=ia|0;c[W>>2]=(c[W>>2]|0)/($|0)|0;$=ia+4|0;g[$>>2]=+g[$>>2]/sa;pa=z;qa=ha;ra=y;q=145;break};case 29:{$=ia|0;c[$>>2]=(c[$>>2]|0)+(c[u>>2]|0);$=ia+4|0;g[$>>2]=+g[u+4>>2]+ +g[$>>2];ma=y;na=ha;oa=z;q=146;break};case 30:{$=ia|0;c[$>>2]=(c[$>>2]|0)-(c[u>>2]|0);$=ia+4|0;g[$>>2]=+g[$>>2]- +g[u+4>>2];ma=y;na=ha;oa=z;q=146;break};case 5:{$=ia|0;if((c[$>>2]|0)==0){ta=0}else{ta=(c[u>>2]|0)!=0|0}c[$>>2]=ta;$=ia+4|0;if(+g[$>>2]!=0.0){ua=+(+g[u+4>>2]!=0.0|0)}else{ua=0.0}g[$>>2]=ua;pa=z;qa=ha;ra=y;q=145;break};case 36:{$=ia|0;c[$>>2]=(c[$>>2]|0)==0;$=ia+4|0;g[$>>2]=+(+g[$>>2]==0.0|0);va=A;wa=y;xa=ha;ya=z;break};case 35:{$=ia|0;c[$>>2]=~c[$>>2];va=A;wa=y;xa=ha;ya=z;break};case 26:{$=ia|0;c[$>>2]=da(c[$>>2]|0,c[u>>2]|0)|0;$=ia+4|0;g[$>>2]=+g[u+4>>2]*+g[$>>2];ma=y;na=ha;oa=z;q=146;break};case 7:{$=ia|0;c[$>>2]=(c[$>>2]|0)>=(c[u>>2]|0);$=ia+4|0;g[$>>2]=+(+g[$>>2]>=+g[u+4>>2]|0);ma=y;na=ha;oa=z;q=146;break};case 8:{$=ia|0;c[$>>2]=(c[$>>2]|0)<=(c[u>>2]|0);$=ia+4|0;g[$>>2]=+(+g[$>>2]<=+g[u+4>>2]|0);ma=y;na=ha;oa=z;q=146;break};case 9:{$=ia|0;c[$>>2]=(c[$>>2]|0)==(c[u>>2]|0);$=ia+4|0;g[$>>2]=+(+g[$>>2]==+g[u+4>>2]|0);ma=y;na=ha;oa=z;q=146;break};case 38:{$=ia|0;c[$>>2]=(c[$>>2]|0)<(c[u>>2]|0);$=ia+4|0;g[$>>2]=+(+g[$>>2]<+g[u+4>>2]|0);ma=y;na=ha;oa=z;q=146;break};case 21:{$=ia|0;c[$>>2]=c[$>>2]>>c[u>>2];ma=y;na=ha;oa=z;q=146;break};case 22:{$=ia|0;c[$>>2]=c[$>>2]<<c[u>>2];ma=y;na=ha;oa=z;q=146;break};case 6:{$=ia|0;if((c[$>>2]|0)==0){za=(c[u>>2]|0)!=0|0}else{za=1}c[$>>2]=za;$=ia+4|0;if(+g[$>>2]!=0.0){Aa=1.0}else{Aa=+(+g[u+4>>2]!=0.0|0)}g[$>>2]=Aa;pa=z;qa=ha;ra=y;q=145;break};default:{pa=z;qa=ha;ra=y;q=145}}}while(0);if((q|0)==145){q=0;if((w|0)==43){Ba=ia;Ca=u;Da=ra;Ea=qa;Fa=pa;q=147}else if((w|0)==36|(w|0)==35){va=A;wa=ra;xa=qa;ya=pa}else{ma=ra;na=qa;oa=pa;q=146}}if((q|0)==146){q=0;Ba=u;Ca=c[u+16>>2]|0;Da=ma;Ea=na;Fa=oa;q=147}do{if((q|0)==147){q=0;$=Ba+12|0;W=c[$>>2]|0;if((W|0)==0){Ga=Ca;Ha=Ca}else{c[W+16>>2]=Ca;Ga=A;Ha=c[Ba+16>>2]|0}if((Ha|0)==0){va=Ga;wa=Da;xa=Ea;ya=Fa;break}c[Ha+12>>2]=c[$>>2];va=Ga;wa=Da;xa=Ea;ya=Fa}}while(0);u=ja+12|0;w=c[u>>2]|0;$=c[ka>>2]|0;if((w|0)==0){Ia=$;Ja=$}else{c[w+16>>2]=$;Ia=B;Ja=c[ka>>2]|0}if((Ja|0)!=0){c[Ja+12>>2]=c[u>>2]}if((Ia|0)==0){ea=0;fa=0;ga=va;break a}else{B=Ia;A=va;z=ya;ha=xa;y=wa}}if((q|0)==99){rv(b,23800,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=B;ga=A;break}else if((q|0)==107){rv(b,23536,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=B;ga=A;break}else if((q|0)==110){rv(b,23536,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=B;ga=A;break}else if((q|0)==136){rv(b,23312,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=B;ga=A;break}else if((q|0)==143){rv(b,22640,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=B;ga=A;break}}}}while(0);if((q|0)==86){rv(b,24368,(Q=i,i=i+1|0,i=i+7&-8,c[Q>>2]=0,Q)|0);i=Q;ea=1;fa=p;ga=o}o=(ga|0)==0;do{if(!o){if(m){c[e>>2]=c[ga>>2]}if(!n){break}g[f>>2]=+g[ga+4>>2]}}while(0);if((fa|0)!=0){p=fa;do{p=c[p+16>>2]|0;}while((p|0)!=0)}if(!o){o=ga;do{o=c[o+16>>2]|0;}while((o|0)!=0)}if((ea|0)==0){Ka=1;La=1280;Ma=0;Na=1280;Oa=0;i=j;return Ka|0}if(m){c[e>>2]=0}if(!n){Ka=0;La=1280;Ma=0;Na=1280;Oa=0;i=j;return Ka|0}g[f>>2]=0.0;Ka=0;La=1280;Ma=0;Na=1280;Oa=0;i=j;return Ka|0}function Lv(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;h=i;i=i+1080|0;j=h|0;k=h+8|0;l=h+16|0;m=l|0;if((d|0)!=0){c[d>>2]=0}if((e|0)!=0){g[e>>2]=0.0}n=l+1052|0;o=0;while(1){if((tv(b,l)|0)==0){break}if((c[n>>2]|0)>(o|0)){p=8;break}if((Tx(m,41592)|0)==0){o=1}else{p=12;break}}do{if((p|0)==8){o=jv(1060)|0;if((o|0)==0){aj(0,46704,(q=i,i=i+1|0,i=i+7&-8,c[q>>2]=0,q)|0);i=q;return 0}else{Vx(o|0,m|0,1056)|0;r=o+1056|0;c[r>>2]=0;c[164924]=(c[164924]|0)+1;s=b+2056|0;c[r>>2]=c[s>>2];c[s>>2]=o;break}}else if((p|0)==12){o=l+1024|0;s=b+2064|0;r=b+2056|0;t=0;u=0;v=0;a:while(1){w=c[o>>2]|0;do{if((w|0)==4){if((t|0)!=0){x=jv(1060)|0;if((x|0)==0){p=17;break a}y=x;Vx(x|0,m|0,1056)|0;c[164924]=(c[164924]|0)+1;c[x+1056>>2]=0;if((v|0)==0){z=0;A=y;B=y;break}c[v+1056>>2]=y;z=0;A=u;B=y;break}if((Tx(m,29872)|0)==0){y=jv(1060)|0;if((y|0)==0){p=22;break a}x=y;Vx(y|0,m|0,1056)|0;c[164924]=(c[164924]|0)+1;c[y+1056>>2]=0;if((v|0)==0){z=1;A=x;B=x;break}c[v+1056>>2]=x;z=1;A=u;B=x;break}x=c[s>>2]|0;y=a[m]|0;if(y<<24>>24==0){C=0}else{D=0;E=0;F=y;while(1){y=(da(E+119|0,F<<24>>24)|0)+D|0;G=E+1|0;H=a[l+G|0]|0;if(H<<24>>24==0){C=y;break}else{D=y;E=G;F=H}}}F=c[x+(((C>>>10^C^C>>>20)&1023)<<2)>>2]|0;if((F|0)==0){p=30;break a}else{I=F}while(1){if((Tx(c[I>>2]|0,m)|0)==0){break}F=c[I+28>>2]|0;if((F|0)==0){p=30;break a}else{I=F}}x=(wv(b,l,I,j,k)|0)==0;F=c[j>>2]|0;if(x|(F|0)==0){J=0;p=49;break a}x=c[k>>2]|0;if((x|0)==0){J=0;p=49;break a}c[x+1056>>2]=c[r>>2];c[r>>2]=F;z=0;A=u;B=v}else if((w|0)==3|(w|0)==5){F=jv(1060)|0;if((F|0)==0){p=35;break a}x=F;Vx(F|0,m|0,1056)|0;c[164924]=(c[164924]|0)+1;c[F+1056>>2]=0;if((v|0)==0){z=t;A=x;B=x;break}c[v+1056>>2]=x;z=t;A=u;B=x}else{p=38;break a}}while(0);w=0;while(1){if((tv(b,l)|0)==0){break a}if((c[n>>2]|0)>(w|0)){p=42;break a}if((Tx(m,41592)|0)==0){w=1}else{t=z;u=A;v=B;continue a}}}do{if((p|0)==17){aj(0,46704,(q=i,i=i+1|0,i=i+7&-8,c[q>>2]=0,q)|0);i=q;return 0}else if((p|0)==22){aj(0,46704,(q=i,i=i+1|0,i=i+7&-8,c[q>>2]=0,q)|0);i=q;return 0}else if((p|0)==30){rv(b,21984,(q=i,i=i+8|0,c[q>>2]=m,q)|0);i=q;J=0;K=1060;L=0;i=h;return J|0}else if((p|0)==35){aj(0,46704,(q=i,i=i+1|0,i=i+7&-8,c[q>>2]=0,q)|0);i=q;return 0}else if((p|0)==38){rv(b,21672,(q=i,i=i+8|0,c[q>>2]=m,q)|0);i=q;J=0;K=1060;L=0;i=h;return J|0}else if((p|0)==42){v=jv(1060)|0;if((v|0)==0){aj(0,46704,(q=i,i=i+1|0,i=i+7&-8,c[q>>2]=0,q)|0);i=q;return 0}else{Vx(v|0,m|0,1056)|0;u=v+1056|0;c[u>>2]=0;c[164924]=(c[164924]|0)+1;c[u>>2]=c[r>>2];c[r>>2]=v;break}}else if((p|0)==49){K=1060;L=0;i=h;return J|0}}while(0);if((Kv(b,A,d,e,f)|0)==0){J=0;K=1060;L=0;i=h;return J|0}if((A|0)==0){J=1;K=1060;L=0;i=h;return J|0}else{M=A}while(1){r=c[M+1056>>2]|0;nv(M|0);c[164924]=(c[164924]|0)-1;if((r|0)==0){J=1;break}else{M=r}}K=1060;L=0;i=h;return J|0}}while(0);rv(b,22192,(q=i,i=i+1|0,i=i+7&-8,c[q>>2]=0,q)|0);i=q;J=0;K=1060;L=0;i=h;return J|0}function Mv(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0;h=i;i=i+1080|0;j=h|0;k=h+8|0;l=h+16|0;m=l|0;if((d|0)!=0){c[d>>2]=0}if((e|0)!=0){g[e>>2]=0.0}if((tv(b,l)|0)==0){rv(b,21312,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;o=0;p=1060;q=0;i=h;return o|0}if((tv(b,l)|0)==0){rv(b,21064,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;o=0;p=1060;q=0;i=h;return o|0}r=l+1024|0;s=b+2064|0;t=b+2056|0;u=1;v=0;w=0;x=0;a:while(1){y=c[r>>2]|0;do{if((y|0)==3|(y|0)==5){z=a[m]|0;if((z<<24>>24|0)==41){A=u-1|0}else if((z<<24>>24|0)==40){A=u+1|0}else{A=u}if((A|0)<1){B=w;C=40;break a}z=jv(1060)|0;if((z|0)==0){C=35;break a}D=z;Vx(z|0,m|0,1056)|0;c[164924]=(c[164924]|0)+1;c[z+1056>>2]=0;if((v|0)==0){E=A;F=D;G=D;H=x;break}c[v+1056>>2]=D;E=A;F=D;G=w;H=x}else if((y|0)==4){if((x|0)!=0){D=jv(1060)|0;if((D|0)==0){C=13;break a}z=D;Vx(D|0,m|0,1056)|0;c[164924]=(c[164924]|0)+1;c[D+1056>>2]=0;if((v|0)==0){E=u;F=z;G=z;H=0;break}c[v+1056>>2]=z;E=u;F=z;G=w;H=0;break}if((Tx(m,29872)|0)==0){z=jv(1060)|0;if((z|0)==0){C=18;break a}D=z;Vx(z|0,m|0,1056)|0;c[164924]=(c[164924]|0)+1;c[z+1056>>2]=0;if((v|0)==0){E=u;F=D;G=D;H=1;break}c[v+1056>>2]=D;E=u;F=D;G=w;H=1;break}D=c[s>>2]|0;z=a[m]|0;if(z<<24>>24==0){I=0}else{J=0;K=0;L=z;while(1){z=(da(K+119|0,L<<24>>24)|0)+J|0;M=K+1|0;N=a[l+M|0]|0;if(N<<24>>24==0){I=z;break}else{J=z;K=M;L=N}}}L=c[D+(((I>>>10^I^I>>>20)&1023)<<2)>>2]|0;if((L|0)==0){C=26;break a}else{O=L}while(1){if((Tx(c[O>>2]|0,m)|0)==0){break}L=c[O+28>>2]|0;if((L|0)==0){C=26;break a}else{O=L}}D=(wv(b,l,O,j,k)|0)==0;L=c[j>>2]|0;if(D|(L|0)==0){o=0;C=43;break a}D=c[k>>2]|0;if((D|0)==0){o=0;C=43;break a}c[D+1056>>2]=c[t>>2];c[t>>2]=L;E=u;F=v;G=w;H=0}else{C=38;break a}}while(0);if((tv(b,l)|0)==0){B=G;C=40;break}else{u=E;v=F;w=G;x=H}}if((C|0)==13){aj(0,46704,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;return 0}else if((C|0)==18){aj(0,46704,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;return 0}else if((C|0)==26){rv(b,21984,(n=i,i=i+8|0,c[n>>2]=m,n)|0);i=n;o=0;p=1060;q=0;i=h;return o|0}else if((C|0)==35){aj(0,46704,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;return 0}else if((C|0)==38){rv(b,21672,(n=i,i=i+8|0,c[n>>2]=m,n)|0);i=n;o=0;p=1060;q=0;i=h;return o|0}else if((C|0)==40){if((Kv(b,B,d,e,f)|0)==0){o=0;p=1060;q=0;i=h;return o|0}if((B|0)==0){o=1;p=1060;q=0;i=h;return o|0}else{P=B}while(1){B=c[P+1056>>2]|0;nv(P|0);c[164924]=(c[164924]|0)-1;if((B|0)==0){o=1;break}else{P=B}}p=1060;q=0;i=h;return o|0}else if((C|0)==43){p=1060;q=0;i=h;return o|0}return 0}function Nv(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;b=i;i=i+8|0;d=b|0;e=a+2068|0;f=c[e>>2]|0;do{if((f|0)!=0){g=a+2052|0;if((c[f+8>>2]|0)!=(c[g>>2]|0)){break}h=c[f>>2]|0;c[e>>2]=c[f+12>>2];j=a+2072|0;c[j>>2]=(c[j>>2]|0)-(c[f+4>>2]|0);nv(f);if((h&-3|0)==0){break}if((Lv(a,d,0,1)|0)==0){k=0;i=b;return k|0}h=(c[d>>2]|0)==0;l=jv(16)|0;c[l>>2]=4;c[l+8>>2]=c[g>>2];g=h&1;c[l+4>>2]=g;c[j>>2]=(c[j>>2]|0)+g;c[l+12>>2]=c[e>>2];c[e>>2]=l;k=1;i=b;return k|0}}while(0);rv(a,20880,(a=i,i=i+1|0,i=i+7&-8,c[a>>2]=0,a)|0);i=a;k=0;i=b;return k|0}function Ov(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;i=i+8|0;d=b|0;if((Lv(a,d,0,1)|0)==0){e=0;i=b;return e|0}f=(c[d>>2]|0)==0;d=jv(16)|0;c[d>>2]=1;c[d+8>>2]=c[a+2052>>2];g=f&1;c[d+4>>2]=g;f=a+2072|0;c[f>>2]=(c[f>>2]|0)+g;g=a+2068|0;c[d+12>>2]=c[g>>2];c[g>>2]=d;e=1;i=b;return e|0}function Pv(a){a=a|0;var b=0;b=i;rv(a,20664,(a=i,i=i+1|0,i=i+7&-8,c[a>>2]=0,a)|0);i=a;i=b;return 0}function Qv(b){b=b|0;var d=0,e=0,f=0;d=i;i=i+1064|0;e=d|0;f=e|0;a[f]=0;tv(b,e)|0;rv(b,20136,(b=i,i=i+8|0,c[b>>2]=f,b)|0);i=b;i=d;return 0}function Rv(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;b=i;i=i+1064|0;d=b|0;e=d|0;sv(a,19504,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;g=d+1052|0;a:while(1){h=0;while(1){if((tv(a,d)|0)==0){j=9;break a}if((c[g>>2]|0)>(h|0)){break a}if((Tx(e,41592)|0)==0){h=1}else{continue a}}}if((j|0)==9){k=1060;l=0;i=b;return 1}j=jv(1060)|0;if((j|0)==0){aj(0,46704,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}Vx(j|0,e|0,1056)|0;e=j+1056|0;c[e>>2]=0;c[164924]=(c[164924]|0)+1;f=a+2056|0;c[e>>2]=c[f>>2];c[f>>2]=j;k=1060;l=0;i=b;return 1}function Sv(a){a=a|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=i;i=i+2096|0;e=d+1024|0;f=d+1032|0;g=f|0;if((Lv(a,e,0,1)|0)==0){h=0;j=1060;k=0;i=d;return h|0}l=a+2052|0;m=c[l>>2]|0;c[f+1048>>2]=c[m+1052>>2];n=c[m+1028>>2]|0;c[f+1040>>2]=n;c[f+1044>>2]=n;c[f+1052>>2]=0;n=c[e>>2]|0;jb(g|0,46936,(m=i,i=i+8|0,c[m>>2]=(n|0)>-1?n:-n|0,m)|0)|0;i=m;c[f+1024>>2]=3;c[f+1028>>2]=12296;f=jv(1060)|0;if((f|0)==0){aj(0,46704,(m=i,i=i+1|0,i=i+7&-8,c[m>>2]=0,m)|0);i=m;return 0}Vx(f|0,g|0,1056)|0;g=f+1056|0;c[g>>2]=0;c[164924]=(c[164924]|0)+1;n=a+2056|0;c[g>>2]=c[n>>2];c[n>>2]=f;if((c[e>>2]|0)>=0){h=1;j=1060;k=0;i=d;return h|0}e=c[l>>2]|0;l=c[e+1052>>2]|0;f=c[e+1028>>2]|0;e=jv(1060)|0;if((e|0)==0){aj(0,46704,(m=i,i=i+1|0,i=i+7&-8,c[m>>2]=0,m)|0);i=m;return 0}b[e>>1]=45;Vx(e+2|0,d|0,1022)|0;c[e+1024>>2]=5;c[e+1028>>2]=30;c[e+1040>>2]=f;c[e+1044>>2]=f;c[e+1048>>2]=l;c[e+1052>>2]=0;l=e+1056|0;c[l>>2]=0;c[164924]=(c[164924]|0)+1;c[l>>2]=c[n>>2];c[n>>2]=e;h=1;j=1060;k=0;i=d;return h|0}function Tv(a){a=a|0;var d=0,e=0,f=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0.0;d=i;i=i+2096|0;e=d+1024|0;f=d+1032|0;j=f|0;if((Lv(a,0,e,0)|0)==0){k=0;l=1060;m=0;i=d;return k|0}n=a+2052|0;o=c[n>>2]|0;c[f+1048>>2]=c[o+1052>>2];p=c[o+1028>>2]|0;c[f+1040>>2]=p;c[f+1044>>2]=p;c[f+1052>>2]=0;q=+S(+(+g[e>>2]));jb(j|0,18872,(p=i,i=i+8|0,h[p>>3]=q,p)|0)|0;i=p;c[f+1024>>2]=3;c[f+1028>>2]=10248;f=jv(1060)|0;if((f|0)==0){aj(0,46704,(p=i,i=i+1|0,i=i+7&-8,c[p>>2]=0,p)|0);i=p;return 0}Vx(f|0,j|0,1056)|0;j=f+1056|0;c[j>>2]=0;c[164924]=(c[164924]|0)+1;o=a+2056|0;c[j>>2]=c[o>>2];c[o>>2]=f;if(!(+g[e>>2]<0.0)){k=1;l=1060;m=0;i=d;return k|0}e=c[n>>2]|0;n=c[e+1052>>2]|0;f=c[e+1028>>2]|0;e=jv(1060)|0;if((e|0)==0){aj(0,46704,(p=i,i=i+1|0,i=i+7&-8,c[p>>2]=0,p)|0);i=p;return 0}b[e>>1]=45;Vx(e+2|0,d|0,1022)|0;c[e+1024>>2]=5;c[e+1028>>2]=30;c[e+1040>>2]=f;c[e+1044>>2]=f;c[e+1048>>2]=n;c[e+1052>>2]=0;n=e+1056|0;c[n>>2]=0;c[164924]=(c[164924]|0)+1;c[n>>2]=c[o>>2];c[o>>2]=e;k=1;l=1060;m=0;i=d;return k|0}function Uv(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;b=i;i=i+1064|0;d=b|0;e=d|0;if((tv(a,d)|0)==0){rv(a,16472,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;g=0;h=1060;j=0;i=b;return g|0}if((c[d+1052>>2]|0)>0){k=jv(1060)|0;if((k|0)==0){aj(0,46704,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}Vx(k|0,e|0,1056)|0;l=k+1056|0;c[l>>2]=0;c[164924]=(c[164924]|0)+1;m=a+2056|0;c[l>>2]=c[m>>2];c[m>>2]=k;rv(a,60888,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;g=0;h=1060;j=0;i=b;return g|0}a:do{if((c[d+1024>>2]|0)==4){k=c[1696]|0;if((k|0)==0){break}else{n=0;o=k}while(1){k=n+1|0;if((Tx(o,e)|0)==0){break}m=c[6784+(k<<3)>>2]|0;if((m|0)==0){break a}else{n=k;o=m}}g=be[c[6788+(n<<3)>>2]&127](a)|0;h=1060;j=0;i=b;return g|0}}while(0);rv(a,60736,(f=i,i=i+8|0,c[f>>2]=e,f)|0);i=f;g=0;h=1060;j=0;i=b;return g|0}function Vv(a){a=a|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;d=i;i=i+2096|0;e=d+1024|0;f=d+1032|0;h=f|0;if((Mv(a,e,0,1)|0)==0){j=0;k=1060;l=0;i=d;return j|0}m=a+2052|0;n=c[m>>2]|0;c[f+1048>>2]=c[n+1052>>2];o=c[n+1028>>2]|0;c[f+1040>>2]=o;c[f+1044>>2]=o;c[f+1052>>2]=0;o=c[e>>2]|0;jb(h|0,46936,(n=i,i=i+8|0,c[n>>2]=(o|0)>-1?o:-o|0,n)|0)|0;i=n;c[f+1024>>2]=3;c[f+1028>>2]=12296;o=c[e>>2]|0;p=(o|0)>-1?o:-o|0;c[f+1032>>2]=p;g[f+1036>>2]=+(p>>>0>>>0);p=jv(1060)|0;if((p|0)==0){aj(0,46704,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;return 0}Vx(p|0,h|0,1056)|0;h=p+1056|0;c[h>>2]=0;c[164924]=(c[164924]|0)+1;f=a+2056|0;c[h>>2]=c[f>>2];c[f>>2]=p;if((c[e>>2]|0)>=0){j=1;k=1060;l=0;i=d;return j|0}e=c[m>>2]|0;m=c[e+1052>>2]|0;p=c[e+1028>>2]|0;e=jv(1060)|0;if((e|0)==0){aj(0,46704,(n=i,i=i+1|0,i=i+7&-8,c[n>>2]=0,n)|0);i=n;return 0}b[e>>1]=45;Vx(e+2|0,d|0,1022)|0;c[e+1024>>2]=5;c[e+1028>>2]=30;c[e+1040>>2]=p;c[e+1044>>2]=p;c[e+1048>>2]=m;c[e+1052>>2]=0;m=e+1056|0;c[m>>2]=0;c[164924]=(c[164924]|0)+1;c[m>>2]=c[f>>2];c[f>>2]=e;j=1;k=1060;l=0;i=d;return j|0}function Wv(a){a=a|0;var d=0,e=0,f=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0.0;d=i;i=i+2096|0;e=d+1024|0;f=d+1032|0;j=f|0;if((Mv(a,0,e,0)|0)==0){k=0;l=1060;m=0;i=d;return k|0}n=a+2052|0;o=c[n>>2]|0;c[f+1048>>2]=c[o+1052>>2];p=c[o+1028>>2]|0;c[f+1040>>2]=p;c[f+1044>>2]=p;c[f+1052>>2]=0;q=+S(+(+g[e>>2]));jb(j|0,18872,(p=i,i=i+8|0,h[p>>3]=q,p)|0)|0;i=p;c[f+1024>>2]=3;c[f+1028>>2]=10248;q=+S(+(+g[e>>2]));g[f+1036>>2]=q;c[f+1032>>2]=~~q;f=jv(1060)|0;if((f|0)==0){aj(0,46704,(p=i,i=i+1|0,i=i+7&-8,c[p>>2]=0,p)|0);i=p;return 0}Vx(f|0,j|0,1056)|0;j=f+1056|0;c[j>>2]=0;c[164924]=(c[164924]|0)+1;o=a+2056|0;c[j>>2]=c[o>>2];c[o>>2]=f;if(!(+g[e>>2]<0.0)){k=1;l=1060;m=0;i=d;return k|0}e=c[n>>2]|0;n=c[e+1052>>2]|0;f=c[e+1028>>2]|0;e=jv(1060)|0;if((e|0)==0){aj(0,46704,(p=i,i=i+1|0,i=i+7&-8,c[p>>2]=0,p)|0);i=p;return 0}b[e>>1]=45;Vx(e+2|0,d|0,1022)|0;c[e+1024>>2]=5;c[e+1028>>2]=30;c[e+1040>>2]=f;c[e+1044>>2]=f;c[e+1048>>2]=n;c[e+1052>>2]=0;n=e+1056|0;c[n>>2]=0;c[164924]=(c[164924]|0)+1;c[n>>2]=c[o>>2];c[o>>2]=e;k=1;l=1060;m=0;i=d;return k|0}function Xv(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;b=i;i=i+1064|0;d=b|0;e=d|0;if((tv(a,d)|0)==0){rv(a,59936,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;g=0;h=1060;j=0;i=b;return g|0}if((c[d+1052>>2]|0)>0){k=jv(1060)|0;if((k|0)==0){aj(0,46704,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}Vx(k|0,e|0,1056)|0;l=k+1056|0;c[l>>2]=0;c[164924]=(c[164924]|0)+1;m=a+2056|0;c[l>>2]=c[m>>2];c[m>>2]=k;rv(a,59840,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;g=0;h=1060;j=0;i=b;return g|0}a:do{if((c[d+1024>>2]|0)==4){k=c[1656]|0;if((k|0)==0){break}else{n=0;o=k}while(1){k=n+1|0;if((Tx(o,e)|0)==0){break}m=c[6624+(k<<3)>>2]|0;if((m|0)==0){break a}else{n=k;o=m}}g=be[c[6628+(n<<3)>>2]&127](a)|0;h=1060;j=0;i=b;return g|0}}while(0);n=jv(1060)|0;if((n|0)==0){aj(0,46704,(f=i,i=i+1|0,i=i+7&-8,c[f>>2]=0,f)|0);i=f;return 0}Vx(n|0,e|0,1056)|0;o=n+1056|0;c[o>>2]=0;c[164924]=(c[164924]|0)+1;d=a+2056|0;c[o>>2]=c[d>>2];c[d>>2]=n;rv(a,60736,(f=i,i=i+8|0,c[f>>2]=e,f)|0);i=f;g=0;h=1060;j=0;i=b;return g|0}function Yv(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;e=i;i=i+1080|0;f=e|0;g=e+8|0;h=e+16|0;if((tv(b,d)|0)==0){j=0;i=e;return j|0}k=d+1024|0;l=d|0;m=h|0;n=h+1024|0;o=h+1|0;p=b+2056|0;q=b+2072|0;r=b+2064|0;a:while(1){s=c[k>>2]|0;do{if((s|0)==1){t=8}else if((s|0)==5){u=a[l]|0;if((u<<24>>24|0)==35){if((Uv(b)|0)==0){j=0;t=28;break a}else{break}}else if((u<<24>>24|0)==36){if((Xv(b)|0)==0){j=0;t=28;break a}else{break}}else{if((s|0)==1){t=8;break}else{t=16;break}}}else{t=16}}while(0);do{if((t|0)==8){t=0;if((Yv(b,h)|0)==0){t=16;break}if((c[n>>2]|0)==1){a[d+((Wx(l|0)|0)-1)|0]=0;s=Wx(l|0)|0;if((s+1+(Wx(o|0)|0)|0)>>>0>1023>>>0){t=11;break a}$x(l|0,o|0)|0;t=16;break}else{s=jv(1060)|0;if((s|0)==0){t=14;break a}Vx(s|0,m|0,1056)|0;u=s+1056|0;c[u>>2]=0;c[164924]=(c[164924]|0)+1;c[u>>2]=c[p>>2];c[p>>2]=s;t=16;break}}}while(0);do{if((t|0)==16){t=0;if((c[q>>2]|0)!=0){break}if((c[k>>2]|0)!=4){t=27;break a}s=c[r>>2]|0;u=a[l]|0;if(u<<24>>24==0){v=0}else{w=0;x=0;y=u;while(1){u=(da(x+119|0,y<<24>>24)|0)+w|0;z=x+1|0;A=a[d+z|0]|0;if(A<<24>>24==0){v=u;break}else{w=u;x=z;y=A}}}y=c[s+(((v>>>10^v^v>>>20)&1023)<<2)>>2]|0;if((y|0)==0){t=27;break a}else{B=y}while(1){if((Tx(c[B>>2]|0,l)|0)==0){break}y=c[B+28>>2]|0;if((y|0)==0){t=27;break a}else{B=y}}s=(wv(b,d,B,f,g)|0)==0;y=c[f>>2]|0;if(s|(y|0)==0){j=0;t=28;break a}s=c[g>>2]|0;if((s|0)==0){j=0;t=28;break a}c[s+1056>>2]=c[p>>2];c[p>>2]=y;}}while(0);if((tv(b,d)|0)==0){j=0;t=28;break}}if((t|0)==11){rv(b,59768,(C=i,i=i+8|0,c[C>>2]=1024,C)|0);i=C;j=0;i=e;return j|0}else if((t|0)==14){aj(0,46704,(C=i,i=i+1|0,i=i+7&-8,c[C>>2]=0,C)|0);i=C;return 0}else if((t|0)==27){Vx(b+2076|0,l|0,1060)|0;j=1;i=e;return j|0}else if((t|0)==28){i=e;return j|0}return 0}function Zv(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;i=i+1064|0;e=d|0;f=e|0;do{if((Yv(a,e)|0)==0){rv(a,59608,(g=i,i=i+8|0,c[g>>2]=b,g)|0);i=g;h=0}else{if((Tx(f,b)|0)==0){h=1;break}rv(a,59512,(g=i,i=i+16|0,c[g>>2]=b,c[g+8>>2]=f,g)|0);i=g;h=0}}while(0);i=d;return h|0}function _v(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;g=i;i=i+1024|0;h=g|0;j=h|0;if((Yv(b,f)|0)==0){rv(b,59440,(k=i,i=i+1|0,i=i+7&-8,c[k>>2]=0,k)|0);i=k;l=0;m=1024;n=0;i=g;return l|0}if((c[f+1024>>2]|0)!=(d|0)){a[j]=0;switch(d|0){case 4:{a[j]=a[58672]|0;a[j+1|0]=a[58673]|0;a[j+2|0]=a[58674]|0;a[j+3|0]=a[58675]|0;a[j+4|0]=a[58676]|0;break};case 1:{a[j]=a[59384]|0;a[j+1|0]=a[59385]|0;a[j+2|0]=a[59386]|0;a[j+3|0]=a[59387]|0;a[j+4|0]=a[59388]|0;a[j+5|0]=a[59389]|0;a[j+6|0]=a[59390]|0;break};case 5:{Vx(j|0,58496,12)|0;break};case 3:{a[j]=a[59248]|0;a[j+1|0]=a[59249]|0;a[j+2|0]=a[59250]|0;a[j+3|0]=a[59251]|0;a[j+4|0]=a[59252]|0;a[j+5|0]=a[59253]|0;a[j+6|0]=a[59254]|0;break};case 2:{o=h;c[o>>2]=1702127980;c[o+4>>2]=7102834;break};default:{}}rv(b,58392,(k=i,i=i+16|0,c[k>>2]=j,c[k+8>>2]=f,k)|0);i=k;l=0;m=1024;n=0;i=g;return l|0}if((d|0)==3){if((c[f+1028>>2]&e|0)==(e|0)){l=1;m=1024;n=0;i=g;return l|0}if((e&8|0)!=0){o=h;c[o>>2]=1768121700;c[o+4>>2]=7102829}if((e&256|0)!=0){c[h>>2]=7890280}if((e&512|0)!=0){a[j]=a[57976]|0;a[j+1|0]=a[57977]|0;a[j+2|0]=a[57978]|0;a[j+3|0]=a[57979]|0;a[j+4|0]=a[57980]|0;a[j+5|0]=a[57981]|0}if((e&1024|0)!=0){a[j]=a[57800]|0;a[j+1|0]=a[57801]|0;a[j+2|0]=a[57802]|0;a[j+3|0]=a[57803]|0;a[j+4|0]=a[57804]|0;a[j+5|0]=a[57805]|0;a[j+6|0]=a[57806]|0}if((e&8192|0)!=0){o=h+(Wx(j|0)|0)|0;a[o]=a[57688]|0;a[o+1|0]=a[57689]|0;a[o+2|0]=a[57690]|0;a[o+3|0]=a[57691]|0;a[o+4|0]=a[57692]|0;a[o+5|0]=a[57693]|0}if((e&16384|0)!=0){Vx(h+(Wx(j|0)|0)|0,57528,10)|0}if((e&2048|0)!=0){o=h+(Wx(j|0)|0)|0;a[o]=a[57424]|0;a[o+1|0]=a[57425]|0;a[o+2|0]=a[57426]|0;a[o+3|0]=a[57427]|0;a[o+4|0]=a[57428]|0;a[o+5|0]=a[57429]|0;a[o+6|0]=a[57430]|0}if((e&4096|0)!=0){Vx(h+(Wx(j|0)|0)|0,56880,9)|0}rv(b,59512,(k=i,i=i+16|0,c[k>>2]=j,c[k+8>>2]=f,k)|0);i=k;l=0;m=1024;n=0;i=g;return l|0}else if((d|0)==5){if((c[f+1028>>2]|0)==(e|0)){l=1;m=1024;n=0;i=g;return l|0}rv(b,56648,(k=i,i=i+8|0,c[k>>2]=f,k)|0);i=k;l=0;m=1024;n=0;i=g;return l|0}else{l=1;m=1024;n=0;i=g;return l|0}return 0}function $v(a,b){a=a|0;b=b|0;var d=0,e=0;d=i;if((Yv(a,b)|0)!=0){e=1;i=d;return e|0}rv(a,59440,(a=i,i=i+1|0,i=i+7&-8,c[a>>2]=0,a)|0);i=a;e=0;i=d;return e|0}function aw(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;d=jv(1060)|0;if((d|0)==0){aj(0,46704,(e=i,i=i+1|0,i=i+7&-8,c[e>>2]=0,e)|0);i=e}else{Vx(d|0,a+2076|0,1056)|0;e=d+1056|0;c[e>>2]=0;c[164924]=(c[164924]|0)+1;f=a+2056|0;c[e>>2]=c[f>>2];c[f>>2]=d;i=b;return}}function bw(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;d=ww(b)|0;if((d|0)==0){e=0;return e|0}c[d+2136>>2]=0;f=jv(3136)|0;g=f;Zx(f|0,0,3136)|0;ay(f|0,b|0,64)|0;c[f+2052>>2]=d;c[f+2056>>2]=0;c[f+2060>>2]=0;c[f+2068>>2]=0;c[f+2072>>2]=0;d=f+2064|0;c[d>>2]=kv(4096)|0;f=c[196756]|0;if((f|0)==0){e=g;return e|0}else{h=f}while(1){f=Ev(0,h)|0;b=c[d>>2]|0;i=c[f>>2]|0;j=a[i]|0;if(j<<24>>24==0){k=0}else{l=0;m=0;n=j;while(1){j=(da(m+119|0,n<<24>>24)|0)+l|0;o=m+1|0;p=a[i+o|0]|0;if(p<<24>>24==0){k=j;break}else{l=j;m=o;n=p}}}n=b+(((k>>>10^k^k>>>20)&1023)<<2)|0;c[f+28>>2]=c[n>>2];c[n>>2]=f;n=c[h+24>>2]|0;if((n|0)==0){e=g;break}else{h=n}}return e|0}function cw(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;b=a+2052|0;d=c[b>>2]|0;if((d|0)!=0){e=d;do{c[b>>2]=c[e+2136>>2];yw(e);e=c[b>>2]|0;}while((e|0)!=0)}e=a+2056|0;b=c[e>>2]|0;if((b|0)!=0){d=b;do{c[e>>2]=c[d+1056>>2];nv(d|0);c[164924]=(c[164924]|0)-1;d=c[e>>2]|0;}while((d|0)!=0)}d=a+2064|0;e=0;b=c[d>>2]|0;while(1){f=b+(e<<2)|0;g=c[f>>2]|0;if((g|0)==0){h=b}else{i=f;f=g;while(1){c[i>>2]=c[f+28>>2];g=c[f+16>>2]|0;if((g|0)!=0){j=g;while(1){g=c[j+1056>>2]|0;nv(j|0);c[164924]=(c[164924]|0)-1;if((g|0)==0){break}else{j=g}}}j=c[f+20>>2]|0;if((j|0)!=0){g=j;while(1){j=c[g+1056>>2]|0;nv(g|0);c[164924]=(c[164924]|0)-1;if((j|0)==0){break}else{g=j}}}nv(c[f>>2]|0);nv(f);g=c[d>>2]|0;j=g+(e<<2)|0;k=c[j>>2]|0;if((k|0)==0){h=g;break}else{i=j;f=k}}}f=e+1|0;if((f|0)<1024){e=f;b=h}else{break}}b=a+2068|0;e=c[b>>2]|0;if((e|0)==0){l=h}else{h=e;do{c[b>>2]=c[h+12>>2];nv(h);h=c[b>>2]|0;}while((h|0)!=0);l=c[d>>2]|0}if((l|0)==0){m=a|0;nv(m);return}nv(l);m=a|0;nv(m);return}function dw(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=1;while(1){d=571024+(b<<2)|0;e=b+1|0;if((c[d>>2]|0)==0){f=4;break}if((e|0)<64){b=e}else{g=0;break}}do{if((f|0)==4){if((b|0)>63){g=0;break}zw(2551472);e=bw(a)|0;if((e|0)==0){g=0;break}c[d>>2]=e;g=b}}while(0);return g|0}function ew(a){a=a|0;var b=0,d=0,e=0;do{if((a-1|0)>>>0>62>>>0){b=0}else{d=571024+(a<<2)|0;e=c[d>>2]|0;if((e|0)==0){b=0;break}cw(e);c[d>>2]=0;b=1}}while(0);return b|0}function fw(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0;d=i;i=i+1064|0;e=d|0;f=e|0;do{if((a-1|0)>>>0>62>>>0){h=0}else{j=c[571024+(a<<2)>>2]|0;if((j|0)==0){h=0;break}k=Yv(j,e)|0;j=b+16|0;by(j|0,f|0)|0;l=c[e+1024>>2]|0;c[b>>2]=l;c[b+4>>2]=c[e+1028>>2];c[b+8>>2]=c[e+1032>>2];g[b+12>>2]=+g[e+1036>>2];if((l|0)!=1){h=k;break}sw(j);h=k}}while(0);i=d;return h|0}function gw(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;if((a-1|0)>>>0>62>>>0){e=0;return e|0}f=571024+(a<<2)|0;a=c[f>>2]|0;if((a|0)==0){e=0;return e|0}by(b|0,a|0)|0;a=c[(c[f>>2]|0)+2052>>2]|0;if((a|0)==0){g=0}else{g=c[a+1052>>2]|0}c[d>>2]=g;e=1;return e|0}function hw(a){a=a|0;zw(a);return}function iw(){var a=0,b=0,d=0,e=0;a=i;b=1;do{d=c[571024+(b<<2)>>2]|0;if((d|0)!=0){ue[c[636260]&31](3,56376,(e=i,i=i+8|0,c[e>>2]=c[d+2052>>2],e)|0);i=e}b=b+1|0;}while((b|0)<64);i=a;return}function jw(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;e=b+1072|0;b=c[e>>2]|0;if((b|0)==0){f=jv(1024)|0;c[e>>2]=f;g=f}else{g=b}Zx(g|0,0,1024)|0;g=d|0;b=c[g>>2]|0;if((b|0)==0){return}else{h=0;i=g;j=b}do{b=i;g=c[(c[e>>2]|0)+(a[j]<<2)>>2]|0;do{if((g|0)==0){c[d+(h*12|0)+8>>2]=0;k=14}else{f=Wx(j|0)|0;l=0;m=g;while(1){if((Wx(c[m>>2]|0)|0)>>>0<f>>>0){break}n=c[m+8>>2]|0;if((n|0)==0){k=12;break}else{l=m;m=n}}if((k|0)==12){k=0;c[d+(h*12|0)+8>>2]=0;if((m|0)==0){k=14;break}c[m+8>>2]=b;break}c[d+(h*12|0)+8>>2]=m;if((l|0)==0){c[(c[e>>2]|0)+(a[c[i>>2]|0]<<2)>>2]=b;break}else{c[l+8>>2]=b;break}}}while(0);if((k|0)==14){k=0;c[(c[e>>2]|0)+(a[c[i>>2]|0]<<2)>>2]=b}h=h+1|0;i=d+(h*12|0)|0;j=c[i>>2]|0;}while((j|0)!=0);return}function kw(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+1040|0;f=e+1024|0;g=e|0;if((c[a+1064>>2]&1|0)!=0){h=1024;j=0;i=e;return}k=f;c[k>>2]=d;c[k+4>>2]=0;fd(g|0,1024,b|0,f|0)|0;f=c[a+1052>>2]|0;ue[c[636260]&31](3,29832,(b=i,i=i+24|0,c[b>>2]=a,c[b+8>>2]=f,c[b+16>>2]=g,b)|0);i=b;h=1024;j=0;i=e;return}function lw(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+1040|0;f=e+1024|0;g=e|0;if((c[a+1064>>2]&2|0)!=0){h=1024;j=0;i=e;return}k=f;c[k>>2]=d;c[k+4>>2]=0;fd(g|0,1024,b|0,f|0)|0;f=c[a+1052>>2]|0;ue[c[636260]&31](2,29832,(b=i,i=i+24|0,c[b>>2]=a,c[b+8>>2]=f,c[b+16>>2]=g,b)|0);i=b;h=1024;j=0;i=e;return}function mw(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;e=i;f=b+1028|0;g=c[f>>2]|0;h=g+1|0;c[f>>2]=h;j=a[h]|0;a:do{switch(j<<24>>24|0){case 34:{k=34;break};case 116:{k=9;break};case 39:{k=39;break};case 98:{k=8;break};case 97:{k=7;break};case 110:{k=10;break};case 114:{k=13;break};case 102:{k=12;break};case 92:{k=92;break};case 63:{k=63;break};case 120:{l=0;m=g+2|0;b:while(1){c[f>>2]=m;n=a[m]|0;o=n<<24>>24;do{if((n-48&255)>>>0<10>>>0){p=o-48|0}else{if((n-65&255)>>>0<26>>>0){p=o-55|0;break}if(!((n-97&255)>>>0<26>>>0)){break b}p=o-87|0}}while(0);l=p+(l<<4)|0;m=m+1|0}c[f>>2]=m-1;if((l|0)<=255){k=l&255;break a}lw(b,29544,(q=i,i=i+1|0,i=i+7&-8,c[q>>2]=0,q)|0);i=q;k=-1;break};case 118:{k=11;break};default:{if((j-48&255)>>>0>9>>>0){kw(b,29224,(q=i,i=i+1|0,i=i+7&-8,c[q>>2]=0,q)|0);i=q;o=c[f>>2]|0;r=o;s=a[o]|0}else{r=h;s=j}if((s-48&255)>>>0<10>>>0){t=0;u=r;v=s}else{c[f>>2]=r-1;k=0;break a}while(1){w=(t*10|0)-48+(v<<24>>24)|0;o=u+1|0;c[f>>2]=o;n=a[o]|0;if((n-48&255)>>>0<10>>>0){t=w;u=o;v=n}else{break}}c[f>>2]=u;if((w|0)<=255){k=w&255;break a}lw(b,29544,(q=i,i=i+1|0,i=i+7&-8,c[q>>2]=0,q)|0);i=q;k=-1}}}while(0);c[f>>2]=(c[f>>2]|0)+1;a[d]=k;i=e;return 1}function nw(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;f=i;c[d+1024>>2]=(e|0)==34?1:2;g=b+1028|0;h=c[g>>2]|0;c[g>>2]=h+1;j=d|0;a[j]=a[h]|0;h=b+1064|0;k=b+1052|0;l=1;a:while(1){m=c[g>>2]|0;while(1){n=a[m]|0;if(n<<24>>24==92){if((c[h>>2]&8|0)==0){o=6;break}}if((n<<24>>24|0)!=(e|0)){o=30;break}p=m+1|0;c[g>>2]=p;if((c[h>>2]&4|0)!=0){break a}q=c[k>>2]|0;r=p;s=q;while(1){t=a[r]|0;if(t<<24>>24<33){if((t<<24>>24|0)==0){o=26;break a}else if((t<<24>>24|0)==10){u=s+1|0;c[k>>2]=u;v=u}else{v=s}u=r+1|0;c[g>>2]=u;r=u;s=v;continue}if(!(t<<24>>24==47)){break}u=r+1|0;w=a[u]|0;if((w<<24>>24|0)==47){c[g>>2]=u;x=u;while(1){y=x+1|0;c[g>>2]=y;z=a[y]|0;if((z<<24>>24|0)==10){break}else if((z<<24>>24|0)==0){o=26;break a}else{x=y}}y=s+1|0;c[k>>2]=y;z=x+2|0;c[g>>2]=z;if((a[z]|0)==0){o=26;break a}else{r=z;s=y;continue}}else if((w<<24>>24|0)!=42){break}c[g>>2]=u;y=u;z=s;while(1){A=y+1|0;c[g>>2]=A;B=a[A]|0;if((B<<24>>24|0)==10){C=z+1|0;c[k>>2]=C;D=a[A]|0;E=C}else if((B<<24>>24|0)==0){o=26;break a}else{D=B;E=z}if(!(D<<24>>24==42)){y=A;z=E;continue}F=y+2|0;if((a[F]|0)==47){break}else{y=A;z=E}}c[g>>2]=F;if((a[F]|0)==0){o=26;break a}z=y+3|0;c[g>>2]=z;if((a[z]|0)==0){o=26;break a}else{r=z;s=E}}if((t<<24>>24|0)!=(e|0)){o=28;break a}s=r+1|0;c[g>>2]=s;m=s}if((o|0)==6){o=0;mw(b,d+l|0)|0}else if((o|0)==30){o=0;if((n<<24>>24|0)==0){o=31;break}else if((n<<24>>24|0)==10){o=32;break}c[g>>2]=m+1;a[d+l|0]=a[m]|0}if((l|0)>1020){o=3;break}else{l=l+1|0}}if((o|0)==3){kw(b,28792,(G=i,i=i+8|0,c[G>>2]=1024,G)|0);i=G;H=0;i=f;return H|0}else if((o|0)==26){c[g>>2]=p;c[k>>2]=q}else if((o|0)==28){c[g>>2]=p;c[k>>2]=q}else if((o|0)==31){a[d+l|0]=0;kw(b,28432,(G=i,i=i+1|0,i=i+7&-8,c[G>>2]=0,G)|0);i=G;H=0;i=f;return H|0}else if((o|0)==32){a[d+l|0]=0;kw(b,28080,(G=i,i=i+8|0,c[G>>2]=j,G)|0);i=G;H=0;i=f;return H|0}G=l+1|0;a[d+l|0]=e;a[d+G|0]=0;c[d+1028>>2]=G;H=1;i=f;return H|0}function ow(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,k=0,l=0,m=0,n=0,o=0.0,p=0,q=0,r=0.0,s=0.0,t=0,u=0,v=0.0,w=0.0;c[e>>2]=0;g[f>>2]=0.0;if((d&2048|0)!=0){h=0;i=b;j=0.0;a:while(1){k=a[i]|0;do{if((k<<24>>24|0)==0){break a}else if((k<<24>>24|0)==46){if((h|0)!=0){l=34;break a}m=i+1|0;n=10;l=6}else{if((h|0)!=0){m=i;n=h;l=6;break}o=j*10.0+ +((k<<24>>24)-48|0);g[f>>2]=o;p=0;q=i;r=o}}while(0);if((l|0)==6){l=0;o=j+ +((a[m]|0)-48|0)/+(n>>>0>>>0);g[f>>2]=o;p=n*10|0;q=m;r=o}h=p;i=q+1|0;j=r}if((l|0)==34){return}c[e>>2]=~~j;return}if((d&8|0)!=0){l=a[b]|0;if(l<<24>>24==0){s=0.0}else{q=b;i=l;l=0;do{q=q+1|0;l=(i<<24>>24)-48+(l*10|0)|0;c[e>>2]=l;i=a[q]|0;}while(!(i<<24>>24==0));s=+(l>>>0>>>0)}g[f>>2]=s;return}if((d&256|0)!=0){l=b+2|0;if((a[l]|0)==0){t=0}else{i=l;l=0;while(1){q=l<<4;c[e>>2]=q;p=a[i]|0;h=p<<24>>24;do{if((p-97&255)>>>0<6>>>0){m=q-87+h|0;c[e>>2]=m;u=m}else{if((p-65&255)>>>0<6>>>0){m=q-55+h|0;c[e>>2]=m;u=m;break}else{m=q-48+h|0;c[e>>2]=m;u=m;break}}}while(0);h=i+1|0;if((a[h]|0)==0){t=u;break}else{i=h;l=u}}}g[f>>2]=+(t>>>0>>>0);return}if((d&512|0)!=0){t=b+1|0;u=a[t]|0;if(u<<24>>24==0){v=0.0}else{l=t;t=u;u=0;do{u=(t<<24>>24)-48+(u<<3)|0;c[e>>2]=u;l=l+1|0;t=a[l]|0;}while(!(t<<24>>24==0));v=+(u>>>0>>>0)}g[f>>2]=v;return}if((d&1024|0)==0){return}d=b+2|0;b=a[d]|0;if(b<<24>>24==0){w=0.0}else{u=d;d=b;b=0;do{u=u+1|0;b=(d<<24>>24)-48+(b<<1)|0;c[e>>2]=b;d=a[u]|0;}while(!(d<<24>>24==0));w=+(b>>>0>>>0)}g[f>>2]=w;return}function pw(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0;e=i;c[d+1024>>2]=3;f=b+1028|0;g=c[f>>2]|0;h=a[g]|0;j=h<<24>>24==48;do{if(j){k=g+1|0;l=a[k]|0;if((l<<24>>24|0)==120|(l<<24>>24|0)==88){c[f>>2]=k;a[d|0]=a[g]|0;k=c[f>>2]|0;c[f>>2]=k+1;a[d+1|0]=a[k]|0;k=c[f>>2]|0;l=a[k]|0;a:do{if((l-48&255)>>>0<10>>>0|(l-97&255)>>>0<6>>>0|l<<24>>24==65){m=2;n=k;while(1){c[f>>2]=n+1;a[d+m|0]=a[n]|0;o=m+1|0;if((m|0)>1022){break}p=c[f>>2]|0;q=a[p]|0;if((q-48&255)>>>0<10>>>0|(q-97&255)>>>0<6>>>0|q<<24>>24==65){m=o;n=p}else{r=o;s=p;break a}}kw(b,27264,(t=i,i=i+8|0,c[t>>2]=1024,t)|0);i=t;u=0;i=e;return u|0}else{r=2;s=k}}while(0);k=d+1028|0;l=c[k>>2]|256;c[k>>2]=l;v=r;w=l;x=s;break}l=g+1|0;k=a[l]|0;if(!((k<<24>>24|0)==98|(k<<24>>24|0)==66)){y=14;break}c[f>>2]=l;a[d|0]=a[g]|0;l=c[f>>2]|0;c[f>>2]=l+1;a[d+1|0]=a[l]|0;l=c[f>>2]|0;b:do{if(((a[l]|0)-48&255)>>>0<2>>>0){k=2;n=l;while(1){c[f>>2]=n+1;a[d+k|0]=a[n]|0;m=k+1|0;if((k|0)>1022){break}p=c[f>>2]|0;if(((a[p]|0)-48&255)>>>0<2>>>0){k=m;n=p}else{z=m;A=p;break b}}kw(b,26736,(t=i,i=i+8|0,c[t>>2]=1024,t)|0);i=t;u=0;i=e;return u|0}else{z=2;A=l}}while(0);l=d+1028|0;n=c[l>>2]|1024;c[l>>2]=n;v=z;w=n;x=A}else{y=14}}while(0);do{if((y|0)==14){A=0;z=j&1;s=0;r=g;n=h;while(1){if((n<<24>>24|0)==56|(n<<24>>24|0)==57){B=A;C=0}else if((n<<24>>24|0)==46){B=1;C=z}else{if((n-48&255)>>>0>9>>>0){y=21;break}else{B=A;C=z}}c[f>>2]=r+1;a[d+s|0]=a[r]|0;if((s|0)>1021){y=20;break}l=c[f>>2]|0;A=B;z=C;s=s+1|0;r=l;n=a[l]|0}if((y|0)==20){kw(b,25976,(t=i,i=i+8|0,c[t>>2]=1024,t)|0);i=t;u=0;i=e;return u|0}else if((y|0)==21){n=d+1028|0;l=c[n>>2]|((z|0)==0?8:512);c[n>>2]=l;if((A|0)==0){v=s;w=l;x=r;break}k=l|2048;c[n>>2]=k;v=s;w=k;x=r;break}}}while(0);t=d+1028|0;b=a[x]|0;do{if((b<<24>>24|0)==117|(b<<24>>24|0)==85){y=27}else if((b<<24>>24|0)==108|(b<<24>>24|0)==76){if((w&8192|0)==0){C=x+1|0;c[f>>2]=C;B=w|8192;c[t>>2]=B;D=B;E=C;break}else{if(b<<24>>24==85){y=27;break}else{D=w;E=x;break}}}else{D=w;E=x}}while(0);do{if((y|0)==27){if((w&18432|0)!=0){D=w;E=x;break}b=x+1|0;c[f>>2]=b;C=w|16384;c[t>>2]=C;D=C;E=b}}while(0);w=a[E]|0;do{if((w<<24>>24|0)==108|(w<<24>>24|0)==76){if((D&8192|0)==0){c[f>>2]=E+1;c[t>>2]=D|8192;break}else{if(w<<24>>24==85){y=34;break}else{break}}}else if((w<<24>>24|0)==117|(w<<24>>24|0)==85){y=34}}while(0);do{if((y|0)==34){if((D&18432|0)!=0){break}c[f>>2]=E+1;c[t>>2]=D|16384}}while(0);a[d+v|0]=0;ow(d|0,c[t>>2]|0,d+1032|0,d+1036|0);d=c[t>>2]|0;if((d&2048|0)!=0){u=1;i=e;return u|0}c[t>>2]=d|4096;u=1;i=e;return u|0}function qw(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;e=i;f=b+1060|0;if((c[f>>2]|0)!=0){c[f>>2]=0;Vx(d|0,b+1076|0,1060)|0;g=1;i=e;return g|0}f=b+1028|0;c[b+1036>>2]=c[f>>2];h=b+1052|0;j=b+1056|0;c[j>>2]=c[h>>2];k=d|0;Zx(k|0,0,1060)|0;l=c[f>>2]|0;c[b+1040>>2]=l;c[d+1040>>2]=l;l=c[f>>2]|0;a:while(1){m=a[l]|0;if(m<<24>>24<33){if((m<<24>>24|0)==10){c[h>>2]=(c[h>>2]|0)+1}else if((m<<24>>24|0)==0){g=0;n=49;break}o=l+1|0;c[f>>2]=o;l=o;continue}if(!(m<<24>>24==47)){n=20;break}m=l+1|0;o=a[m]|0;if((o<<24>>24|0)==47){c[f>>2]=m;p=m;while(1){q=p+1|0;c[f>>2]=q;r=a[q]|0;if((r<<24>>24|0)==0){g=0;n=49;break a}else if((r<<24>>24|0)==10){break}else{p=q}}c[h>>2]=(c[h>>2]|0)+1;q=p+2|0;c[f>>2]=q;if((a[q]|0)==0){g=0;n=49;break}else{l=q;continue}}else if((o<<24>>24|0)!=42){n=20;break}c[f>>2]=m;q=m;while(1){r=q+1|0;c[f>>2]=r;s=a[r]|0;if((s<<24>>24|0)==10){c[h>>2]=(c[h>>2]|0)+1;t=a[r]|0}else if((s<<24>>24|0)==0){g=0;n=49;break a}else{t=s}if(!(t<<24>>24==42)){q=r;continue}u=q+2|0;if((a[u]|0)==47){break}else{q=r}}c[f>>2]=u;if((a[u]|0)==0){g=0;n=49;break}m=q+3|0;c[f>>2]=m;if((a[m]|0)==0){g=0;n=49;break}else{l=m}}if((n|0)==20){c[b+1044>>2]=l;c[d+1044>>2]=l;c[d+1048>>2]=c[h>>2];c[d+1052>>2]=(c[h>>2]|0)-(c[j>>2]|0);j=c[f>>2]|0;h=a[j]|0;b:do{if((h<<24>>24|0)==39){if((nw(b,d,39)|0)==0){g=0}else{break}i=e;return g|0}else if((h<<24>>24|0)==34){if((nw(b,d,34)|0)==0){g=0}else{break}i=e;return g|0}else{do{if(!((h-48&255)>>>0<10>>>0)){if(h<<24>>24==46){if(((a[j+1|0]|0)-48&255)>>>0<10>>>0){break}}if((c[b+1064>>2]&16|0)!=0){c:do{if(h<<24>>24>32&h<<24>>24!=59){l=0;u=j;while(1){if((l|0)>1023){break}c[f>>2]=u+1;t=l+1|0;a[d+l|0]=a[u]|0;m=c[f>>2]|0;o=a[m]|0;if(o<<24>>24>32&o<<24>>24!=59){l=t;u=m}else{v=t;break c}}kw(b,24992,(w=i,i=i+8|0,c[w>>2]=1024,w)|0);i=w;g=0;i=e;return g|0}else{v=0}}while(0);a[d+v|0]=0;Vx(b+1076|0,k|0,1060)|0;g=1;i=e;return g|0}do{if(!((h-97&255)>>>0<26>>>0)){if((h-65&255)>>>0<26>>>0|h<<24>>24==95){break}u=c[(c[b+1072>>2]|0)+(h<<24>>24<<2)>>2]|0;d:do{if((u|0)!=0){l=c[b+1032>>2]|0;t=u;while(1){x=c[t>>2]|0;y=Wx(x|0)|0;if(!((j+y|0)>>>0>l>>>0)){if((Ux(j,x,y)|0)==0){break}}m=c[t+8>>2]|0;if((m|0)==0){break d}else{t=m}}ay(k|0,x|0,1024)|0;c[f>>2]=(c[f>>2]|0)+y;c[d+1024>>2]=5;c[d+1028>>2]=c[t+4>>2];break b}}while(0);kw(b,24632,(w=i,i=i+1|0,i=i+7&-8,c[w>>2]=0,w)|0);i=w;g=0;i=e;return g|