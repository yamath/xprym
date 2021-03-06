"use strict";
// Transcrypt'ed from Python, 2017-05-17 18:06:56
function look () {
   var __symbols__ = ['__py3.5__', '__esv5__'];


// ============ Source: /home/yamatteo/venv0/lib/python3.5/site-packages/transcrypt/modules/org/transcrypt/__javascript__/__core__.mod.js ============

    var __all__ = {};
    var __world__ = __all__;
    
    // Nested object creator, part of the nesting may already exist and have attributes
    var __nest__ = function (headObject, tailNames, value) {
        // In some cases this will be a global object, e.g. 'window'
        var current = headObject;
        
        if (tailNames != '') {  // Split on empty string doesn't give empty list
            // Find the last already created object in tailNames
            var tailChain = tailNames.split ('.');
            var firstNewIndex = tailChain.length;
            for (var index = 0; index < tailChain.length; index++) {
                if (!current.hasOwnProperty (tailChain [index])) {
                    firstNewIndex = index;
                    break;
                }
                current = current [tailChain [index]];
            }
            
            // Create the rest of the objects, if any
            for (var index = firstNewIndex; index < tailChain.length; index++) {
                current [tailChain [index]] = {};
                current = current [tailChain [index]];
            }
        }
        
        // Insert it new attributes, it may have been created earlier and have other attributes
        for (var attrib in value) {
            current [attrib] = value [attrib];          
        }       
    };
    __all__.__nest__ = __nest__;
    
    // Initialize module if not yet done and return its globals
    var __init__ = function (module) {
        if (!module.__inited__) {
            module.__all__.__init__ (module.__all__);
            module.__inited__ = true;
        }
        return module.__all__;
    };
    __all__.__init__ = __init__;
    
    
    
    
    // Since we want to assign functions, a = b.f should make b.f produce a bound function
    // So __get__ should be called by a property rather then a function
    // Factory __get__ creates one of three curried functions for func
    // Which one is produced depends on what's to the left of the dot of the corresponding JavaScript property
    var __get__ = function (self, func, quotedFuncName) {
        if (self) {
            if (self.hasOwnProperty ('__class__') || typeof self == 'string' || self instanceof String) {           // Object before the dot
                if (quotedFuncName) {                                   // Memoize call since fcall is on, by installing bound function in instance
                    Object.defineProperty (self, quotedFuncName, {      // Will override the non-own property, next time it will be called directly
                        value: function () {                            // So next time just call curry function that calls function
                            var args = [] .slice.apply (arguments);
                            return func.apply (null, [self] .concat (args));
                        },              
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
                return function () {                                    // Return bound function, code dupplication for efficiency if no memoizing
                    var args = [] .slice.apply (arguments);             // So multilayer search prototype, apply __get__, call curry func that calls func
                    return func.apply (null, [self] .concat (args));
                };
            }
            else {                                                      // Class before the dot
                return func;                                            // Return static method
            }
        }
        else {                                                          // Nothing before the dot
            return func;                                                // Return free function
        }
    }
    __all__.__get__ = __get__;
        
    // Mother of all metaclasses        
    var py_metatype = {
        __name__: 'type',
        __bases__: [],
        
        // Overridable class creation worker
        __new__: function (meta, name, bases, attribs) {
            // Create the class cls, a functor, which the class creator function will return
            var cls = function () {                     // If cls is called with arg0, arg1, etc, it calls its __new__ method with [arg0, arg1, etc]
                var args = [] .slice.apply (arguments); // It has a __new__ method, not yet but at call time, since it is copied from the parent in the loop below
                return cls.__new__ (args);              // Each Python class directly or indirectly derives from object, which has the __new__ method
            };                                          // If there are no bases in the Python source, the compiler generates [object] for this parameter
            
            // Copy all methods, including __new__, properties and static attributes from base classes to new cls object
            // The new class object will simply be the prototype of its instances
            // JavaScript prototypical single inheritance will do here, since any object has only one class
            // This has nothing to do with Python multiple inheritance, that is implemented explictly in the copy loop below
            for (var index = bases.length - 1; index >= 0; index--) {   // Reversed order, since class vars of first base should win
                var base = bases [index];
                for (var attrib in base) {
                    var descrip = Object.getOwnPropertyDescriptor (base, attrib);
                    Object.defineProperty (cls, attrib, descrip);
                }           
            }
            
            // Add class specific attributes to the created cls object
            cls.__metaclass__ = meta;
            cls.__name__ = name;
            cls.__bases__ = bases;
            
            // Add own methods, properties and own static attributes to the created cls object
            for (var attrib in attribs) {
                var descrip = Object.getOwnPropertyDescriptor (attribs, attrib);
                Object.defineProperty (cls, attrib, descrip);
            }
            // Return created cls object
            return cls;
        }
    };
    py_metatype.__metaclass__ = py_metatype;
    __all__.py_metatype = py_metatype;
    
    // Mother of all classes
    var object = {
        __init__: function (self) {},
        
        __metaclass__: py_metatype, // By default, all classes have metaclass type, since they derive from object
        __name__: 'object',
        __bases__: [],
            
        // Object creator function, is inherited by all classes (so could be global)
        __new__: function (args) {  // Args are just the constructor args       
            // In JavaScript the Python class is the prototype of the Python object
            // In this way methods and static attributes will be available both with a class and an object before the dot
            // The descriptor produced by __get__ will return the right method flavor
            var instance = Object.create (this, {__class__: {value: this, enumerable: true}});
            

            // Call constructor
            this.__init__.apply (null, [instance] .concat (args));

            // Return constructed instance
            return instance;
        }   
    };
    __all__.object = object;
    
    // Class creator facade function, calls class creation worker
    var __class__ = function (name, bases, attribs, meta) {         // Parameter meta is optional
        if (meta == undefined) {
            meta = bases [0] .__metaclass__;
        }
                
        return meta.__new__ (meta, name, bases, attribs);
    }
    __all__.__class__ = __class__;
    
    // Define __pragma__ to preserve '<all>' and '</all>', since it's never generated as a function, must be done early, so here
    var __pragma__ = function () {};
    __all__.__pragma__ = __pragma__;
    
    

// ============ Source: /home/yamatteo/venv0/lib/python3.5/site-packages/transcrypt/modules/org/transcrypt/__base__.py ============

/* 000001 */ 	__nest__ (
/* 000001 */ 		__all__,
/* 000001 */ 		'org.transcrypt.__base__', {
/* 000001 */ 			__all__: {
/* 000001 */ 				__inited__: false,
/* 000001 */ 				__init__: function (__all__) {
/* 000005 */ 					var __Envir__ = __class__ ('__Envir__', [object], {
/* 000006 */ 						get __init__ () {return __get__ (this, function (self) {
/* 000007 */ 							self.interpreter_name = 'python';
/* 000008 */ 							self.transpiler_name = 'transcrypt';
/* 000009 */ 							self.transpiler_version = '3.6.25';
/* 000010 */ 							self.target_subdir = '__javascript__';
/* 000010 */ 						});}
/* 000010 */ 					});
/* 000012 */ 					var __envir__ = __Envir__ ();
/* 000012 */ 					__pragma__ ('<all>')
/* 000012 */ 						__all__.__Envir__ = __Envir__;
/* 000012 */ 						__all__.__envir__ = __envir__;
/* 000012 */ 					__pragma__ ('</all>')
/* 000012 */ 				}
/* 000012 */ 			}
/* 000012 */ 		}
/* 000012 */ 	);
/* 000012 */ 

// ============ Source: /home/yamatteo/venv0/lib/python3.5/site-packages/transcrypt/modules/org/transcrypt/__standard__.py ============

/* 000001 */ 	__nest__ (
/* 000001 */ 		__all__,
/* 000001 */ 		'org.transcrypt.__standard__', {
/* 000001 */ 			__all__: {
/* 000001 */ 				__inited__: false,
/* 000001 */ 				__init__: function (__all__) {
/* 000014 */ 					var Exception = __class__ ('Exception', [object], {
/* 000015 */ 						get __init__ () {return __get__ (this, function (self) {
/* 000015 */ 							var kwargs = dict ();
/* 000015 */ 							if (arguments.length) {
/* 000015 */ 								var __ilastarg0__ = arguments.length - 1;
/* 000015 */ 								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
/* 000015 */ 									var __allkwargs0__ = arguments [__ilastarg0__--];
/* 000015 */ 									for (var __attrib0__ in __allkwargs0__) {
/* 000015 */ 										switch (__attrib0__) {
/* 000015 */ 											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
/* 000015 */ 											default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
/* 000015 */ 										}
/* 000015 */ 									}
/* 000015 */ 									delete kwargs.__kwargtrans__;
/* 000015 */ 								}
/* 000015 */ 								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
/* 000015 */ 							}
/* 000015 */ 							else {
/* 000015 */ 								var args = tuple ();
/* 000015 */ 							}
/* 000016 */ 							self.__args__ = args;
/* 000017 */ 							try {
/* 000018 */ 								self.stack = kwargs.error.stack;
/* 000018 */ 							}
/* 000018 */ 							catch (__except0__) {
/* 000020 */ 								self.stack = 'No stack trace available';
/* 000020 */ 							}
/* 000021 */ 						});},
/* 000023 */ 						get __repr__ () {return __get__ (this, function (self) {
/* 000024 */ 							if (len (self.__args__)) {
/* 000025 */ 								return '{}{}'.format (self.__class__.__name__, repr (tuple (self.__args__)));
/* 000025 */ 							}
/* 000026 */ 							else {
/* 000027 */ 								return '{}()'.format (self.__class__.__name__);
/* 000027 */ 							}
/* 000027 */ 						});},
/* 000029 */ 						get __str__ () {return __get__ (this, function (self) {
/* 000030 */ 							if (len (self.__args__) > 1) {
/* 000031 */ 								return str (tuple (self.__args__));
/* 000031 */ 							}
/* 000032 */ 							else if (len (self.__args__)) {
/* 000033 */ 								return str (self.__args__ [0]);
/* 000033 */ 							}
/* 000034 */ 							else {
/* 000035 */ 								return '';
/* 000035 */ 							}
/* 000035 */ 						});}
/* 000035 */ 					});
/* 000037 */ 					var IterableError = __class__ ('IterableError', [Exception], {
/* 000038 */ 						get __init__ () {return __get__ (this, function (self, error) {
/* 000039 */ 							Exception.__init__ (self, "Can't iterate over non-iterable", __kwargtrans__ ({error: error}));
/* 000039 */ 						});}
/* 000039 */ 					});
/* 000041 */ 					var StopIteration = __class__ ('StopIteration', [Exception], {
/* 000042 */ 						get __init__ () {return __get__ (this, function (self, error) {
/* 000043 */ 							Exception.__init__ (self, 'Iterator exhausted', __kwargtrans__ ({error: error}));
/* 000043 */ 						});}
/* 000043 */ 					});
/* 000045 */ 					var ValueError = __class__ ('ValueError', [Exception], {
/* 000046 */ 						get __init__ () {return __get__ (this, function (self, error) {
/* 000047 */ 							Exception.__init__ (self, 'Erroneous value', __kwargtrans__ ({error: error}));
/* 000047 */ 						});}
/* 000047 */ 					});
/* 000049 */ 					var KeyError = __class__ ('KeyError', [Exception], {
/* 000050 */ 						get __init__ () {return __get__ (this, function (self, error) {
/* 000051 */ 							Exception.__init__ (self, 'Invalid key', __kwargtrans__ ({error: error}));
/* 000051 */ 						});}
/* 000051 */ 					});
/* 000053 */ 					var AssertionError = __class__ ('AssertionError', [Exception], {
/* 000054 */ 						get __init__ () {return __get__ (this, function (self, message, error) {
/* 000055 */ 							if (message) {
/* 000056 */ 								Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
/* 000056 */ 							}
/* 000057 */ 							else {
/* 000058 */ 								Exception.__init__ (self, __kwargtrans__ ({error: error}));
/* 000058 */ 							}
/* 000058 */ 						});}
/* 000058 */ 					});
/* 000060 */ 					var NotImplementedError = __class__ ('NotImplementedError', [Exception], {
/* 000061 */ 						get __init__ () {return __get__ (this, function (self, message, error) {
/* 000062 */ 							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
/* 000062 */ 						});}
/* 000062 */ 					});
/* 000064 */ 					var IndexError = __class__ ('IndexError', [Exception], {
/* 000065 */ 						get __init__ () {return __get__ (this, function (self, message, error) {
/* 000066 */ 							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
/* 000066 */ 						});}
/* 000066 */ 					});
/* 000068 */ 					var AttributeError = __class__ ('AttributeError', [Exception], {
/* 000069 */ 						get __init__ () {return __get__ (this, function (self, message, error) {
/* 000070 */ 							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
/* 000070 */ 						});}
/* 000070 */ 					});
/* 000076 */ 					var Warning = __class__ ('Warning', [Exception], {
/* 000076 */ 					});
/* 000081 */ 					var UserWarning = __class__ ('UserWarning', [Warning], {
/* 000081 */ 					});
/* 000084 */ 					var DeprecationWarning = __class__ ('DeprecationWarning', [Warning], {
/* 000084 */ 					});
/* 000087 */ 					var RuntimeWarning = __class__ ('RuntimeWarning', [Warning], {
/* 000087 */ 					});
/* 000092 */ 					var __sort__ = function (iterable, key, reverse) {
/* 000092 */ 						if (typeof key == 'undefined' || (key != null && key .hasOwnProperty ("__kwargtrans__"))) {;
/* 000092 */ 							var key = null;
/* 000092 */ 						};
/* 000092 */ 						if (typeof reverse == 'undefined' || (reverse != null && reverse .hasOwnProperty ("__kwargtrans__"))) {;
/* 000092 */ 							var reverse = false;
/* 000092 */ 						};
/* 000092 */ 						if (arguments.length) {
/* 000092 */ 							var __ilastarg0__ = arguments.length - 1;
/* 000092 */ 							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
/* 000092 */ 								var __allkwargs0__ = arguments [__ilastarg0__--];
/* 000092 */ 								for (var __attrib0__ in __allkwargs0__) {
/* 000092 */ 									switch (__attrib0__) {
/* 000092 */ 										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
/* 000092 */ 										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
/* 000092 */ 										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
/* 000092 */ 									}
/* 000092 */ 								}
/* 000092 */ 							}
/* 000092 */ 						}
/* 000092 */ 						else {
/* 000092 */ 						}
/* 000093 */ 						if (key) {
/* 000094 */ 							iterable.sort ((function __lambda__ (a, b) {
/* 000094 */ 								if (arguments.length) {
/* 000094 */ 									var __ilastarg0__ = arguments.length - 1;
/* 000094 */ 									if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
/* 000094 */ 										var __allkwargs0__ = arguments [__ilastarg0__--];
/* 000094 */ 										for (var __attrib0__ in __allkwargs0__) {
/* 000094 */ 											switch (__attrib0__) {
/* 000094 */ 												case 'a': var a = __allkwargs0__ [__attrib0__]; break;
/* 000094 */ 												case 'b': var b = __allkwargs0__ [__attrib0__]; break;
/* 000094 */ 											}
/* 000094 */ 										}
/* 000094 */ 									}
/* 000094 */ 								}
/* 000094 */ 								else {
/* 000094 */ 								}
/* 000094 */ 								return (key (a) > key (b) ? 1 : -(1));
/* 000094 */ 							}));
/* 000094 */ 						}
/* 000095 */ 						else {
/* 000096 */ 							iterable.sort ();
/* 000096 */ 						}
/* 000098 */ 						if (reverse) {
/* 000099 */ 							iterable.reverse ();
/* 000099 */ 						}
/* 000099 */ 					};
/* 000101 */ 					var sorted = function (iterable, key, reverse) {
/* 000101 */ 						if (typeof key == 'undefined' || (key != null && key .hasOwnProperty ("__kwargtrans__"))) {;
/* 000101 */ 							var key = null;
/* 000101 */ 						};
/* 000101 */ 						if (typeof reverse == 'undefined' || (reverse != null && reverse .hasOwnProperty ("__kwargtrans__"))) {;
/* 000101 */ 							var reverse = false;
/* 000101 */ 						};
/* 000101 */ 						if (arguments.length) {
/* 000101 */ 							var __ilastarg0__ = arguments.length - 1;
/* 000101 */ 							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
/* 000101 */ 								var __allkwargs0__ = arguments [__ilastarg0__--];
/* 000101 */ 								for (var __attrib0__ in __allkwargs0__) {
/* 000101 */ 									switch (__attrib0__) {
/* 000101 */ 										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
/* 000101 */ 										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
/* 000101 */ 										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
/* 000101 */ 									}
/* 000101 */ 								}
/* 000101 */ 							}
/* 000101 */ 						}
/* 000101 */ 						else {
/* 000101 */ 						}
/* 000102 */ 						if (py_typeof (iterable) == dict) {
/* 000103 */ 							var result = copy (iterable.py_keys ());
/* 000103 */ 						}
/* 000104 */ 						else {
/* 000105 */ 							var result = copy (iterable);
/* 000105 */ 						}
/* 000107 */ 						__sort__ (result, key, reverse);
/* 000108 */ 						return result;
/* 000108 */ 					};
/* 000112 */ 					var map = function (func, iterable) {
/* 000113 */ 						return function () {
/* 000113 */ 							var __accu0__ = [];
/* 000113 */ 							var __iterable0__ = iterable;
/* 000113 */ 							for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000113 */ 								var item = __iterable0__ [__index0__];
/* 000113 */ 								__accu0__.append (func (item));
/* 000113 */ 							}
/* 000113 */ 							return __accu0__;
/* 000113 */ 						} ();
/* 000113 */ 					};
/* 000116 */ 					var filter = function (func, iterable) {
/* 000117 */ 						if (func == null) {
/* 000118 */ 							var func = bool;
/* 000118 */ 						}
/* 000119 */ 						return function () {
/* 000119 */ 							var __accu0__ = [];
/* 000119 */ 							var __iterable0__ = iterable;
/* 000119 */ 							for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000119 */ 								var item = __iterable0__ [__index0__];
/* 000119 */ 								if (func (item)) {
/* 000119 */ 									__accu0__.append (item);
/* 000119 */ 								}
/* 000119 */ 							}
/* 000119 */ 							return __accu0__;
/* 000119 */ 						} ();
/* 000119 */ 					};
/* 000203 */ 					var __Terminal__ = __class__ ('__Terminal__', [object], {
/* 000213 */ 						get __init__ () {return __get__ (this, function (self) {
/* 000214 */ 							self.buffer = '';
/* 000216 */ 							try {
/* 000217 */ 								self.element = document.getElementById ('__terminal__');
/* 000217 */ 							}
/* 000217 */ 							catch (__except0__) {
/* 000219 */ 								self.element = null;
/* 000219 */ 							}
/* 000221 */ 							if (self.element) {
/* 000222 */ 								self.element.style.overflowX = 'auto';
/* 000223 */ 								self.element.style.boxSizing = 'border-box';
/* 000224 */ 								self.element.style.padding = '5px';
/* 000225 */ 								self.element.innerHTML = '_';
/* 000225 */ 							}
/* 000227 */ 						});},
/* 000229 */ 						get print () {return __get__ (this, function (self) {
/* 000229 */ 							var sep = ' ';
/* 000229 */ 							var end = '\n';
/* 000229 */ 							if (arguments.length) {
/* 000229 */ 								var __ilastarg0__ = arguments.length - 1;
/* 000229 */ 								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
/* 000229 */ 									var __allkwargs0__ = arguments [__ilastarg0__--];
/* 000229 */ 									for (var __attrib0__ in __allkwargs0__) {
/* 000229 */ 										switch (__attrib0__) {
/* 000229 */ 											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
/* 000229 */ 											case 'sep': var sep = __allkwargs0__ [__attrib0__]; break;
/* 000229 */ 											case 'end': var end = __allkwargs0__ [__attrib0__]; break;
/* 000229 */ 										}
/* 000229 */ 									}
/* 000229 */ 								}
/* 000229 */ 								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
/* 000229 */ 							}
/* 000229 */ 							else {
/* 000229 */ 								var args = tuple ();
/* 000229 */ 							}
/* 000230 */ 							self.buffer = '{}{}{}'.format (self.buffer, sep.join (function () {
/* 000230 */ 								var __accu0__ = [];
/* 000230 */ 								var __iterable0__ = args;
/* 000230 */ 								for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000230 */ 									var arg = __iterable0__ [__index0__];
/* 000230 */ 									__accu0__.append (str (arg));
/* 000230 */ 								}
/* 000230 */ 								return __accu0__;
/* 000230 */ 							} ()), end).__getslice__ (-(4096), null, 1);
/* 000232 */ 							if (self.element) {
/* 000233 */ 								self.element.innerHTML = self.buffer.py_replace ('\n', '<br>');
/* 000234 */ 								self.element.scrollTop = self.element.scrollHeight;
/* 000234 */ 							}
/* 000235 */ 							else {
/* 000236 */ 								console.log (sep.join (function () {
/* 000236 */ 									var __accu0__ = [];
/* 000236 */ 									var __iterable0__ = args;
/* 000236 */ 									for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000236 */ 										var arg = __iterable0__ [__index0__];
/* 000236 */ 										__accu0__.append (str (arg));
/* 000236 */ 									}
/* 000236 */ 									return __accu0__;
/* 000236 */ 								} ()));
/* 000236 */ 							}
/* 000236 */ 						});},
/* 000238 */ 						get input () {return __get__ (this, function (self, question) {
/* 000238 */ 							if (arguments.length) {
/* 000238 */ 								var __ilastarg0__ = arguments.length - 1;
/* 000238 */ 								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
/* 000238 */ 									var __allkwargs0__ = arguments [__ilastarg0__--];
/* 000238 */ 									for (var __attrib0__ in __allkwargs0__) {
/* 000238 */ 										switch (__attrib0__) {
/* 000238 */ 											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
/* 000238 */ 											case 'question': var question = __allkwargs0__ [__attrib0__]; break;
/* 000238 */ 										}
/* 000238 */ 									}
/* 000238 */ 								}
/* 000238 */ 							}
/* 000238 */ 							else {
/* 000238 */ 							}
/* 000239 */ 							self.print ('{}'.format (question), __kwargtrans__ ({end: ''}));
/* 000240 */ 							var answer = window.prompt ('\n'.join (self.buffer.py_split ('\n').__getslice__ (-(16), null, 1)));
/* 000241 */ 							self.print (answer);
/* 000242 */ 							return answer;
/* 000244 */ 						});}
/* 000244 */ 					});
/* 000246 */ 					var __terminal__ = __Terminal__ ();
/* 000246 */ 					__pragma__ ('<all>')
/* 000246 */ 						__all__.AssertionError = AssertionError;
/* 000246 */ 						__all__.AttributeError = AttributeError;
/* 000246 */ 						__all__.DeprecationWarning = DeprecationWarning;
/* 000246 */ 						__all__.Exception = Exception;
/* 000246 */ 						__all__.IndexError = IndexError;
/* 000246 */ 						__all__.IterableError = IterableError;
/* 000246 */ 						__all__.KeyError = KeyError;
/* 000246 */ 						__all__.NotImplementedError = NotImplementedError;
/* 000246 */ 						__all__.RuntimeWarning = RuntimeWarning;
/* 000246 */ 						__all__.StopIteration = StopIteration;
/* 000246 */ 						__all__.UserWarning = UserWarning;
/* 000246 */ 						__all__.ValueError = ValueError;
/* 000246 */ 						__all__.Warning = Warning;
/* 000246 */ 						__all__.__Terminal__ = __Terminal__;
/* 000246 */ 						__all__.__sort__ = __sort__;
/* 000246 */ 						__all__.__terminal__ = __terminal__;
/* 000246 */ 						__all__.filter = filter;
/* 000246 */ 						__all__.map = map;
/* 000246 */ 						__all__.sorted = sorted;
/* 000246 */ 					__pragma__ ('</all>')
/* 000246 */ 				}
/* 000246 */ 			}
/* 000246 */ 		}
/* 000246 */ 	);
/* 000246 */ 

// ============ Source: /home/yamatteo/venv0/lib/python3.5/site-packages/transcrypt/modules/org/transcrypt/__javascript__/__builtin__.mod.js ============

    var __call__ = function (/* <callee>, <this>, <params>* */) {   // Needed for __base__ and __standard__ if global 'opov' switch is on
        var args = [] .slice.apply (arguments);
        if (typeof args [0] == 'object' && '__call__' in args [0]) {        // Overloaded
            return args [0] .__call__ .apply (args [1], args.slice (2));
        }
        else {                                                              // Native
            return args [0] .apply (args [1], args.slice (2));
        }
    };
    __all__.__call__ = __call__;

    // Initialize non-nested modules __base__ and __standard__ and make its names available directly and via __all__
    // They can't do that itself, because they're regular Python modules
    // The compiler recognizes their names and generates them inline rather than nesting them
    // In this way it isn't needed to import them everywhere

    // __base__

    __nest__ (__all__, '', __init__ (__all__.org.transcrypt.__base__));
    var __envir__ = __all__.__envir__;

    // __standard__

    __nest__ (__all__, '', __init__ (__all__.org.transcrypt.__standard__));

    var Exception = __all__.Exception;
    var IterableError = __all__.IterableError;
    var StopIteration = __all__.StopIteration;
    var ValueError = __all__.ValueError;
    var KeyError = __all__.KeyError;
    var AssertionError = __all__.AssertionError;
    var NotImplementedError = __all__.NotImplementedError;
    var IndexError = __all__.IndexError;
    var AttributeError = __all__.AttributeError;

    // Warnings Exceptions
    var Warning = __all__.Warning;
    var UserWarning = __all__.UserWarning;
    var DeprecationWarning = __all__.DeprecationWarning;
    var RuntimeWarning = __all__.RuntimeWarning;

    var __sort__ = __all__.__sort__;
    var sorted = __all__.sorted;

    var map = __all__.map;
    var filter = __all__.filter;

    __all__.print = __all__.__terminal__.print;
    __all__.input = __all__.__terminal__.input;

    var __terminal__ = __all__.__terminal__;
    var print = __all__.print;
    var input = __all__.input;

    // Complete __envir__, that was created in __base__, for non-stub mode
    __envir__.executor_name = __envir__.transpiler_name;

    // Make make __main__ available in browser
    var __main__ = {__file__: ''};
    __all__.main = __main__;

    // Define current exception, there's at most one exception in the air at any time
    var __except__ = null;
    __all__.__except__ = __except__;
    
     // Creator of a marked dictionary, used to pass **kwargs parameter
    var __kwargtrans__ = function (anObject) {
        anObject.__kwargtrans__ = null; // Removable marker
        anObject.constructor = Object;
        return anObject;
    }
    __all__.__kwargtrans__ = __kwargtrans__;

    // 'Oneshot' dict promotor, used to enrich __all__ and help globals () return a true dict
    var __globals__ = function (anObject) {
        if (isinstance (anObject, dict)) {  // Don't attempt to promote (enrich) again, since it will make a copy
            return anObject;
        }
        else {
            return dict (anObject)
        }
    }
    __all__.__globals__ = __globals__
    
    // Partial implementation of super () .<methodName> (<params>)
    var __super__ = function (aClass, methodName) {        
        // Lean and fast, no C3 linearization, only call first implementation encountered
        // Will allow __super__ ('<methodName>') (self, <params>) rather than only <className>.<methodName> (self, <params>)
        
        for (var index = 0; index < aClass.__bases__.length; index++) {
            var base = aClass.__bases__ [index];
            if (methodName in base) {
               return base [methodName];
            }
        }

        throw new Exception ('Superclass method not found');    // !!! Improve!
    }
    __all__.__super__ = __super__
        
    // Python property installer function, no member since that would bloat classes
    var property = function (getter, setter) {  // Returns a property descriptor rather than a property
        if (!setter) {  // ??? Make setter optional instead of dummy?
            setter = function () {};
        }
        return {get: function () {return getter (this)}, set: function (value) {setter (this, value)}, enumerable: true};
    }
    __all__.property = property;
    
    // Conditional JavaScript property installer function, prevents redefinition of properties if multiple Transcrypt apps are on one page
    var __setProperty__ = function (anObject, name, descriptor) {
        if (!anObject.hasOwnProperty (name)) {
            Object.defineProperty (anObject, name, descriptor);
        }
    }
    __all__.__setProperty__ = __setProperty__
    
    // Assert function, call to it only generated when compiling with --dassert option
    function assert (condition, message) {  // Message may be undefined
        if (!condition) {
            throw AssertionError (message, new Error ());
        }
    }

    __all__.assert = assert;

    var __merge__ = function (object0, object1) {
        var result = {};
        for (var attrib in object0) {
            result [attrib] = object0 [attrib];
        }
        for (var attrib in object1) {
            result [attrib] = object1 [attrib];
        }
        return result;
    };
    __all__.__merge__ = __merge__;

    // Manipulating attributes by name
    
    var dir = function (obj) {
        var aList = [];
        for (var aKey in obj) {
            aList.push (aKey);
        }
        aList.sort ();
        return aList;
    };
    __all__.dir = dir;

    var setattr = function (obj, name, value) {
        obj [name] = value;
    };
    __all__.setattr = setattr;

    var getattr = function (obj, name) {
        return obj [name];
    };
    __all__.getattr= getattr;

    var hasattr = function (obj, name) {
        try {
            return name in obj;
        }
        catch (exception) {
            return false;
        }
    };
    __all__.hasattr = hasattr;

    var delattr = function (obj, name) {
        delete obj [name];
    };
    __all__.delattr = (delattr);

    // The __in__ function, used to mimic Python's 'in' operator
    // In addition to CPython's semantics, the 'in' operator is also allowed to work on objects, avoiding a counterintuitive separation between Python dicts and JavaScript objects
    // In general many Transcrypt compound types feature a deliberate blend of Python and JavaScript facilities, facilitating efficient integration with JavaScript libraries
    // If only Python objects and Python dicts are dealt with in a certain context, the more pythonic 'hasattr' is preferred for the objects as opposed to 'in' for the dicts
    var __in__ = function (element, container) {
        if (py_typeof (container) == dict) {        // Currently only implemented as an augmented JavaScript object
            return container.hasOwnProperty (element);
        }
        else {                                      // Parameter 'element' itself is an array, string or a plain, non-dict JavaScript object
            return (
                container.indexOf ?                 // If it has an indexOf
                container.indexOf (element) > -1 :  // it's an array or a string,
                container.hasOwnProperty (element)  // else it's a plain, non-dict JavaScript object
            );
        }
    };
    __all__.__in__ = __in__;

    // Find out if an attribute is special
    var __specialattrib__ = function (attrib) {
        return (attrib.startswith ('__') && attrib.endswith ('__')) || attrib == 'constructor' || attrib.startswith ('py_');
    };
    __all__.__specialattrib__ = __specialattrib__;

    // Len function for any object
    var len = function (anObject) {
        if (anObject) {
            var l = anObject.length;
            if (l == undefined) {
                var result = 0;
                for (var attrib in anObject) {
                    if (!__specialattrib__ (attrib)) {
                        result++;
                    }
                }
                return result;
            }
            else {
                return l;
            }
        }
        else {
            return 0;
        }
    };
    __all__.len = len;

    // General conversions

    function __i__ (any) {  //  Conversion to iterable
        return py_typeof (any) == dict ? any.py_keys () : any;
    }

    function __t__ (any) {  // Conversion to truthyness, __ ([1, 2, 3]) returns [1, 2, 3], needed for nonempty selection: l = list1 or list2]
        return (['boolean', 'number'] .indexOf (typeof any) >= 0 || any instanceof Function || len (any)) ? any : false;
        // JavaScript functions have a length attribute, denoting the number of parameters
        // Python objects are JavaScript functions, but their length doesn't matter, only their existence
        // By the term 'any instanceof Function' we make sure that Python objects aren't rejected when their length equals zero
    }
    __all__.__t__ = __t__;

    var bool = function (any) {     // Always truly returns a bool, rather than something truthy or falsy
        return !!__t__ (any);
    };
    bool.__name__ = 'bool';         // So it can be used as a type with a name
    __all__.bool = bool;

    var float = function (any) {
        if (any == 'inf') {
            return Infinity;
        }
        else if (any == '-inf') {
            return -Infinity;
        }
        else if (isNaN (parseFloat (any))) {    // Call to parseFloat needed to exclude '', ' ' etc.
            throw ValueError (new Error ());
        }
        else {
            return +any;
        }
    };
    float.__name__ = 'float';
    __all__.float = float;

    var int = function (any) {
        return float (any) | 0
    };
    int.__name__ = 'int';
    __all__.int = int;

    var py_typeof = function (anObject) {
        var aType = typeof anObject;
        if (aType == 'object') {    // Directly trying '__class__ in anObject' turns out to wreck anObject in Chrome if its a primitive
            try {
                return anObject.__class__;
            }
            catch (exception) {
                return aType;
            }
        }
        else {
            return (    // Odly, the braces are required here
                aType == 'boolean' ? bool :
                aType == 'string' ? str :
                aType == 'number' ? (anObject % 1 == 0 ? int : float) :
                null
            );
        }
    };
    __all__.py_typeof = py_typeof;

    var isinstance = function (anObject, classinfo) {
        function isA (queryClass) {
            if (queryClass == classinfo) {
                return true;
            }
            for (var index = 0; index < queryClass.__bases__.length; index++) {
                if (isA (queryClass.__bases__ [index], classinfo)) {
                    return true;
                }
            }
            return false;
        }

        if (classinfo instanceof Array) {   // Assume in most cases it isn't, then making it recursive rather than two functions saves a call
            for (var index = 0; index < classinfo.length; index++) {
                var aClass = classinfo [index];
                if (isinstance (anObject, aClass)) {
                    return true;
                }
            }
            return false;
        }

        try {                   // Most frequent use case first
            return '__class__' in anObject ? isA (anObject.__class__) : anObject instanceof classinfo;
        }
        catch (exception) {     // Using isinstance on primitives assumed rare
            var aType = py_typeof (anObject);
            return aType == classinfo || (aType == bool && classinfo == int);
        }
    };
    __all__.isinstance = isinstance;

    var callable = function (anObject) {
        if ( typeof anObject == 'object' && '__call__' in anObject ) {
            return true;
        }
        else {
            return typeof anObject === 'function';
        }
    };
    __all__.callable = callable;

    // Repr function uses __repr__ method, then __str__, then toString
    var repr = function (anObject) {
        try {
            return anObject.__repr__ ();
        }
        catch (exception) {
            try {
                return anObject.__str__ ();
            }
            catch (exception) { // anObject has no __repr__ and no __str__
                try {
                    if (anObject == null) {
                        return 'None';
                    }
                    else if (anObject.constructor == Object) {
                        var result = '{';
                        var comma = false;
                        for (var attrib in anObject) {
                            if (!__specialattrib__ (attrib)) {
                                if (attrib.isnumeric ()) {
                                    var attribRepr = attrib;                // If key can be interpreted as numerical, we make it numerical
                                }                                           // So we accept that '1' is misrepresented as 1
                                else {
                                    var attribRepr = '\'' + attrib + '\'';  // Alpha key in dict
                                }

                                if (comma) {
                                    result += ', ';
                                }
                                else {
                                    comma = true;
                                }
                                result += attribRepr + ': ' + repr (anObject [attrib]);
                            }
                        }
                        result += '}';
                        return result;
                    }
                    else {
                        return typeof anObject == 'boolean' ? anObject.toString () .capitalize () : anObject.toString ();
                    }
                }
                catch (exception) {
                    console.log ('ERROR: Could not evaluate repr (<object of type ' + typeof anObject + '>)');
                    console.log (exception);
                    return '???';
                }
            }
        }
    };
    __all__.repr = repr;

    // Char from Unicode or ASCII
    var chr = function (charCode) {
        return String.fromCharCode (charCode);
    };
    __all__.chr = chr;

    // Unicode or ASCII from char
    var ord = function (aChar) {
        return aChar.charCodeAt (0);
    };
    __all__.org = ord;

    // Maximum of n numbers
    var max = Math.max;
    __all__.max = max;

    // Minimum of n numbers
    var min = Math.min;
    __all__.min = min;

    // Absolute value
    var abs = Math.abs;
    __all__.abs = abs;

    // Bankers rounding
    var round = function (number, ndigits) {
        if (ndigits) {
            var scale = Math.pow (10, ndigits);
            number *= scale;
        }

        var rounded = Math.round (number);
        if (rounded - number == 0.5 && rounded % 2) {   // Has rounded up to odd, should have rounded down to even
            rounded -= 1;
        }

        if (ndigits) {
            rounded /= scale;
        }

        return rounded;
    };
    __all__.round = round;

    // BEGIN unified iterator model

    function __jsUsePyNext__ () {       // Add as 'next' method to make Python iterator JavaScript compatible
        try {
            var result = this.__next__ ();
            return {value: result, done: false};
        }
        catch (exception) {
            return {value: undefined, done: true};
        }
    }

    function __pyUseJsNext__ () {       // Add as '__next__' method to make JavaScript iterator Python compatible
        var result = this.next ();
        if (result.done) {
            throw StopIteration (new Error ());
        }
        else {
            return result.value;
        }
    }

    function py_iter (iterable) {                   // Alias for Python's iter function, produces a universal iterator / iterable, usable in Python and JavaScript
        if (typeof iterable == 'string' || '__iter__' in iterable) {    // JavaScript Array or string or Python iterable (string has no 'in')
            var result = iterable.__iter__ ();                          // Iterator has a __next__
            result.next = __jsUsePyNext__;                              // Give it a next
        }
        else if ('selector' in iterable) {                              // Assume it's a JQuery iterator
            var result = list (iterable) .__iter__ ();                  // Has a __next__
            result.next = __jsUsePyNext__;                              // Give it a next
        }
        else if ('next' in iterable) {                                  // It's a JavaScript iterator already,  maybe a generator, has a next and may have a __next__
            var result = iterable
            if (! ('__next__' in result)) {                             // If there's no danger of recursion
                result.__next__ = __pyUseJsNext__;                      // Give it a __next__
            }
        }
        else if (Symbol.iterator in iterable) {                         // It's a JavaScript iterable such as a typed array, but not an iterator
            var result = iterable [Symbol.iterator] ();                 // Has a next
            result.__next__ = __pyUseJsNext__;                          // Give it a __next__
        }
        else {
            throw IterableError (new Error ()); // No iterator at all
        }
        result [Symbol.iterator] = function () {return result;};
        return result;
    }

    function py_next (iterator) {               // Called only in a Python context, could receive Python or JavaScript iterator
        try {                                   // Primarily assume Python iterator, for max speed
            var result = iterator.__next__ ();
        }
        catch (exception) {                     // JavaScript iterators are the exception here
            var result = iterator.next ();
            if (result.done) {
                throw StopIteration (new Error ());
            }
            else {
                return result.value;
            }
        }
        if (result == undefined) {
            throw StopIteration (new Error ());
        }
        else {
            return result;
        }
    }

    function __PyIterator__ (iterable) {
        this.iterable = iterable;
        this.index = 0;
    }

    __PyIterator__.prototype.__next__ = function () {
        if (this.index < this.iterable.length) {
            return this.iterable [this.index++];
        }
        else {
            throw StopIteration (new Error ());
        }
    };

    function __JsIterator__ (iterable) {
        this.iterable = iterable;
        this.index = 0;
    }

    __JsIterator__.prototype.next = function () {
        if (this.index < this.iterable.py_keys.length) {
            return {value: this.index++, done: false};
        }
        else {
            return {value: undefined, done: true};
        }
    };

    // END unified iterator model

    // Reversed function for arrays
    var py_reversed = function (iterable) {
        iterable = iterable.slice ();
        iterable.reverse ();
        return iterable;
    };
    __all__.py_reversed = py_reversed;

    // Zip method for arrays and strings
    var zip = function () {
        var args = [] .slice.call (arguments);
        if (typeof args [0] == 'string') {
            for (var i = 0; i < args.length; i++) {
                args [i] = args [i] .split ('');
            }
        }
        var shortest = args.length == 0 ? [] : args.reduce (    // Find shortest array in arguments
            function (array0, array1) {
                return array0.length < array1.length ? array0 : array1;
            }
        );
        return shortest.map (                   // Map each element of shortest array
            function (current, index) {         // To the result of this function
                return args.map (               // Map each array in arguments
                    function (current) {        // To the result of this function
                        return current [index]; // Namely it's index't entry
                    }
                );
            }
        );
    };
    __all__.zip = zip;

    // Range method, returning an array
    function range (start, stop, step) {
        if (stop == undefined) {
            // one param defined
            stop = start;
            start = 0;
        }
        if (step == undefined) {
            step = 1;
        }
        if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
            return [];
        }
        var result = [];
        for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
            result.push(i);
        }
        return result;
    };
    __all__.range = range;

    // Any, all and sum

    function any (iterable) {
        for (var index = 0; index < iterable.length; index++) {
            if (bool (iterable [index])) {
                return true;
            }
        }
        return false;
    }
    function all (iterable) {
        for (var index = 0; index < iterable.length; index++) {
            if (! bool (iterable [index])) {
                return false;
            }
        }
        return true;
    }
    function sum (iterable) {
        var result = 0;
        for (var index = 0; index < iterable.length; index++) {
            result += iterable [index];
        }
        return result;
    }

    __all__.any = any;
    __all__.all = all;
    __all__.sum = sum;

    // Enumerate method, returning a zipped list
    function enumerate (iterable) {
        return zip (range (len (iterable)), iterable);
    }
    __all__.enumerate = enumerate;

    // Shallow and deepcopy

    function copy (anObject) {
        if (anObject == null || typeof anObject == "object") {
            return anObject;
        }
        else {
            var result = {};
            for (var attrib in obj) {
                if (anObject.hasOwnProperty (attrib)) {
                    result [attrib] = anObject [attrib];
                }
            }
            return result;
        }
    }
    __all__.copy = copy;

    function deepcopy (anObject) {
        if (anObject == null || typeof anObject == "object") {
            return anObject;
        }
        else {
            var result = {};
            for (var attrib in obj) {
                if (anObject.hasOwnProperty (attrib)) {
                    result [attrib] = deepcopy (anObject [attrib]);
                }
            }
            return result;
        }
    }
    __all__.deepcopy = deepcopy;

    // List extensions to Array

    function list (iterable) {                                      // All such creators should be callable without new
        var instance = iterable ? [] .slice.apply (iterable) : [];  // Spread iterable, n.b. array.slice (), so array before dot
        // Sort is the normal JavaScript sort, Python sort is a non-member function
        return instance;
    }
    __all__.list = list;
    Array.prototype.__class__ = list;   // All arrays are lists (not only if constructed by the list ctor), unless constructed otherwise
    list.__name__ = 'list';

    /*
    Array.from = function (iterator) { // !!! remove
        result = [];
        for (item of iterator) {
            result.push (item);
        }
        return result;
    }
    */

    Array.prototype.__iter__ = function () {return new __PyIterator__ (this);};

    Array.prototype.__getslice__ = function (start, stop, step) {
        if (start < 0) {
            start = this.length + start;
        }

        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }
        else if (stop > this.length) {
            stop = this.length;
        }

        var result = list ([]);
        for (var index = start; index < stop; index += step) {
            result.push (this [index]);
        }

        return result;
    };

    Array.prototype.__setslice__ = function (start, stop, step, source) {
        if (start < 0) {
            start = this.length + start;
        }

        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }

        if (step == null) { // Assign to 'ordinary' slice, replace subsequence
            Array.prototype.splice.apply (this, [start, stop - start] .concat (source));
        }
        else {              // Assign to extended slice, replace designated items one by one
            var sourceIndex = 0;
            for (var targetIndex = start; targetIndex < stop; targetIndex += step) {
                this [targetIndex] = source [sourceIndex++];
            }
        }
    };

    Array.prototype.__repr__ = function () {
        if (this.__class__ == set && !this.length) {
            return 'set()';
        }

        var result = !this.__class__ || this.__class__ == list ? '[' : this.__class__ == tuple ? '(' : '{';

        for (var index = 0; index < this.length; index++) {
            if (index) {
                result += ', ';
            }
            result += repr (this [index]);
        }

        if (this.__class__ == tuple && this.length == 1) {
            result += ',';
        }

        result += !this.__class__ || this.__class__ == list ? ']' : this.__class__ == tuple ? ')' : '}';;
        return result;
    };

    Array.prototype.__str__ = Array.prototype.__repr__;

    Array.prototype.append = function (element) {
        this.push (element);
    };

    Array.prototype.clear = function () {
        this.length = 0;
    };

    Array.prototype.extend = function (aList) {
        this.push.apply (this, aList);
    };

    Array.prototype.insert = function (index, element) {
        this.splice (index, 0, element);
    };

    Array.prototype.remove = function (element) {
        var index = this.indexOf (element);
        if (index == -1) {
            throw ValueError (new Error ());
        }
        this.splice (index, 1);
    };

    Array.prototype.index = function (element) {
        return this.indexOf (element);
    };

    Array.prototype.py_pop = function (index) {
        if (index == undefined) {
            return this.pop ();  // Remove last element
        }
        else {
            return this.splice (index, 1) [0];
        }
    };

    Array.prototype.py_sort = function () {
        __sort__.apply  (null, [this].concat ([] .slice.apply (arguments)));    // Can't work directly with arguments
        // Python params: (iterable, key = None, reverse = False)
        // py_sort is called with the Transcrypt kwargs mechanism, and just passes the params on to __sort__
        // __sort__ is def'ed with the Transcrypt kwargs mechanism
    };

    Array.prototype.__add__ = function (aList) {
        return list (this.concat (aList));
    };

    Array.prototype.__mul__ = function (scalar) {
        var result = this;
        for (var i = 1; i < scalar; i++) {
            result = result.concat (this);
        }
        return result;
    };

    Array.prototype.__rmul__ = Array.prototype.__mul__;

    // Tuple extensions to Array

    function tuple (iterable) {
        var instance = iterable ? [] .slice.apply (iterable) : [];
        instance.__class__ = tuple; // Not all arrays are tuples
        return instance;
    }
    __all__.tuple = tuple;
    tuple.__name__ = 'tuple';

    // Set extensions to Array
    // N.B. Since sets are unordered, set operations will occasionally alter the 'this' array by sorting it

    function set (iterable) {
        var instance = [];
        if (iterable) {
            for (var index = 0; index < iterable.length; index++) {
                instance.add (iterable [index]);
            }


        }
        instance.__class__ = set;   // Not all arrays are sets
        return instance;
    }
    __all__.set = set;
    set.__name__ = 'set';

    Array.prototype.__bindexOf__ = function (element) { // Used to turn O (n^2) into O (n log n)
    // Since sorting is lex, compare has to be lex. This also allows for mixed lists

        element += '';

        var mindex = 0;
        var maxdex = this.length - 1;

        while (mindex <= maxdex) {
            var index = (mindex + maxdex) / 2 | 0;
            var middle = this [index] + '';

            if (middle < element) {
                mindex = index + 1;
            }
            else if (middle > element) {
                maxdex = index - 1;
            }
            else {
                return index;
            }
        }

        return -1;
    };

    Array.prototype.add = function (element) {
        if (this.indexOf (element) == -1) { // Avoid duplicates in set
            this.push (element);
        }
    };

    Array.prototype.discard = function (element) {
        var index = this.indexOf (element);
        if (index != -1) {
            this.splice (index, 1);
        }
    };

    Array.prototype.isdisjoint = function (other) {
        this.sort ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) != -1) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.issuperset = function (other) {
        this.sort ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) == -1) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.issubset = function (other) {
        return set (other.slice ()) .issuperset (this); // Sort copy of 'other', not 'other' itself, since it may be an ordered sequence
    };

    Array.prototype.union = function (other) {
        var result = set (this.slice () .sort ());
        for (var i = 0; i < other.length; i++) {
            if (result.__bindexOf__ (other [i]) == -1) {
                result.push (other [i]);
            }
        }
        return result;
    };

    Array.prototype.intersection = function (other) {
        this.sort ();
        var result = set ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) != -1) {
                result.push (other [i]);
            }
        }
        return result;
    };

    Array.prototype.difference = function (other) {
        var sother = set (other.slice () .sort ());
        var result = set ();
        for (var i = 0; i < this.length; i++) {
            if (sother.__bindexOf__ (this [i]) == -1) {
                result.push (this [i]);
            }
        }
        return result;
    };

    Array.prototype.symmetric_difference = function (other) {
        return this.union (other) .difference (this.intersection (other));
    };

    Array.prototype.py_update = function () {   // O (n)
        var updated = [] .concat.apply (this.slice (), arguments) .sort ();
        this.clear ();
        for (var i = 0; i < updated.length; i++) {
            if (updated [i] != updated [i - 1]) {
                this.push (updated [i]);
            }
        }
    };

    Array.prototype.__eq__ = function (other) { // Also used for list
        if (this.length != other.length) {
            return false;
        }
        if (this.__class__ == set) {
            this.sort ();
            other.sort ();
        }
        for (var i = 0; i < this.length; i++) {
            if (this [i] != other [i]) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.__ne__ = function (other) { // Also used for list
        return !this.__eq__ (other);
    };

    Array.prototype.__le__ = function (other) {
        return this.issubset (other);
    };

    Array.prototype.__ge__ = function (other) {
        return this.issuperset (other);
    };

    Array.prototype.__lt__ = function (other) {
        return this.issubset (other) && !this.issuperset (other);
    };

    Array.prototype.__gt__ = function (other) {
        return this.issuperset (other) && !this.issubset (other);
    };

    // String extensions

    function str (stringable) {
        try {
            return stringable.__str__ ();
        }
        catch (exception) {
            try {
                return repr (stringable);
            }
            catch (exception) {
                return String (stringable); // No new, so no permanent String object but a primitive in a temporary 'just in time' wrapper
            }
        }
    };
    __all__.str = str;

    String.prototype.__class__ = str;   // All strings are str
    str.__name__ = 'str';

    String.prototype.__iter__ = function () {new __PyIterator__ (this);};

    String.prototype.__repr__ = function () {
        return (this.indexOf ('\'') == -1 ? '\'' + this + '\'' : '"' + this + '"') .py_replace ('\t', '\\t') .py_replace ('\n', '\\n');
    };

    String.prototype.__str__ = function () {
        return this;
    };

    String.prototype.capitalize = function () {
        return this.charAt (0).toUpperCase () + this.slice (1);
    };

    String.prototype.endswith = function (suffix) {
        return suffix == '' || this.slice (-suffix.length) == suffix;
    };

    String.prototype.find  = function (sub, start) {
        return this.indexOf (sub, start);
    };

    String.prototype.__getslice__ = function (start, stop, step) {
        if (start < 0) {
            start = this.length + start;
        }

        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }

        var result = '';
        if (step == 1) {
            result = this.substring (start, stop);
        }
        else {
            for (var index = start; index < stop; index += step) {
                result = result.concat (this.charAt(index));
            }
        }
        return result;
    }

    // Since it's worthwhile for the 'format' function to be able to deal with *args, it is defined as a property
    // __get__ will produce a bound function if there's something before the dot
    // Since a call using *args is compiled to e.g. <object>.<function>.apply (null, args), the function has to be bound already
    // Otherwise it will never be, because of the null argument
    // Using 'this' rather than 'null' contradicts the requirement to be able to pass bound functions around
    // The object 'before the dot' won't be available at call time in that case, unless implicitly via the function bound to it
    // While for Python methods this mechanism is generated by the compiler, for JavaScript methods it has to be provided manually
    // Call memoizing is unattractive here, since every string would then have to hold a reference to a bound format method
    __setProperty__ (String.prototype, 'format', {
        get: function () {return __get__ (this, function (self) {
            var args = tuple ([] .slice.apply (arguments).slice (1));
            var autoIndex = 0;
            return self.replace (/\{(\w*)\}/g, function (match, key) {
                if (key == '') {
                    key = autoIndex++;
                }
                if (key == +key) {  // So key is numerical
                    return args [key] == undefined ? match : str (args [key]);
                }
                else {              // Key is a string
                    for (var index = 0; index < args.length; index++) {
                        // Find first 'dict' that has that key and the right field
                        if (typeof args [index] == 'object' && args [index][key] != undefined) {
                            return str (args [index][key]); // Return that field field
                        }
                    }
                    return match;
                }
            });
        });},
        enumerable: true
    });

    String.prototype.isnumeric = function () {
        return !isNaN (parseFloat (this)) && isFinite (this);
    };

    String.prototype.join = function (strings) {
        return strings.join (this);
    };

    String.prototype.lower = function () {
        return this.toLowerCase ();
    };

    String.prototype.py_replace = function (old, aNew, maxreplace) {
        return this.split (old, maxreplace) .join (aNew);
    };

    String.prototype.lstrip = function () {
        return this.replace (/^\s*/g, '');
    };

    String.prototype.rfind = function (sub, start) {
        return this.lastIndexOf (sub, start);
    };

    String.prototype.rsplit = function (sep, maxsplit) {    // Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
        if (sep == undefined || sep == null) {
            sep = /\s+/;
            var stripped = this.strip ();
        }
        else {
            var stripped = this;
        }

        if (maxsplit == undefined || maxsplit == -1) {
            return stripped.split (sep);
        }
        else {
            var result = stripped.split (sep);
            if (maxsplit < result.length) {
                var maxrsplit = result.length - maxsplit;
                return [result.slice (0, maxrsplit) .join (sep)] .concat (result.slice (maxrsplit));
            }
            else {
                return result;
            }
        }
    };

    String.prototype.rstrip = function () {
        return this.replace (/\s*$/g, '');
    };

    String.prototype.py_split = function (sep, maxsplit) {  // Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
        if (sep == undefined || sep == null) {
            sep = /\s+/;
            var stripped = this.strip ();
        }
        else {
            var stripped = this;
        }

        if (maxsplit == undefined || maxsplit == -1) {
            return stripped.split (sep);
        }
        else {
            var result = stripped.split (sep);
            if (maxsplit < result.length) {
                return result.slice (0, maxsplit).concat ([result.slice (maxsplit).join (sep)]);
            }
            else {
                return result;
            }
        }
    };

    String.prototype.startswith = function (prefix) {
        return this.indexOf (prefix) == 0;
    };

    String.prototype.strip = function () {
        return this.trim ();
    };

    String.prototype.upper = function () {
        return this.toUpperCase ();
    };

    String.prototype.__mul__ = function (scalar) {
        var result = this;
        for (var i = 1; i < scalar; i++) {
            result = result + this;
        }
        return result;
    };

    String.prototype.__rmul__ = String.prototype.__mul__;

    // Dict extensions to object

    function __keys__ () {
        var keys = [];
        for (var attrib in this) {
            if (!__specialattrib__ (attrib)) {
                keys.push (attrib);
            }
        }
        return keys;
    }

    function __items__ () {
        var items = [];
        for (var attrib in this) {
            if (!__specialattrib__ (attrib)) {
                items.push ([attrib, this [attrib]]);
            }
        }
        return items;
    }

    function __del__ (key) {
        delete this [key];
    }

    function __clear__ () {
        for (var attrib in this) {
            delete this [attrib];
        }
    }

    function __getdefault__ (aKey, aDefault) {  // Each Python object already has a function called __get__, so we call this one __getdefault__
        var result = this [aKey];
        return result == undefined ? (aDefault == undefined ? null : aDefault) : result;
    }

    function __setdefault__ (aKey, aDefault) {
        var result = this [aKey];
        if (result != undefined) {
            return result;
        }
        var val = aDefault == undefined ? null : aDefault;
        this [aKey] = val;
        return val;
    }

    function __pop__ (aKey, aDefault) {
        var result = this [aKey];
        if (result != undefined) {
            delete this [aKey];
            return result;
        } else {
            // Identify check because user could pass None
            if ( aDefault === undefined ) {
                throw KeyError (aKey, new Error());
            }
        }
        return aDefault;
    }
    
    function __popitem__ () {
        var aKey = Object.keys (this) [0];
        if (aKey == null) {
            throw KeyError (aKey, new Error ());
        }
        var result = tuple ([aKey, this [aKey]]);
        delete this [aKey];
        return result;
    }
    
    function __update__ (aDict) {
        for (var aKey in aDict) {
            this [aKey] = aDict [aKey];
        }
    }
    
    function __dgetitem__ (aKey) {
        return this [aKey];
    }
    
    function __dsetitem__ (aKey, aValue) {
        this [aKey] = aValue;
    }

    function dict (objectOrPairs) {
        var instance = {};
        if (!objectOrPairs || objectOrPairs instanceof Array) { // It's undefined or an array of pairs
            if (objectOrPairs) {
                for (var index = 0; index < objectOrPairs.length; index++) {
                    var pair = objectOrPairs [index];
                    if ( !(pair instanceof Array) || pair.length != 2) {
                        throw ValueError(
                            "dict update sequence element #" + index +
                            " has length " + pair.length +
                            "; 2 is required", new Error());
                    }
                    var key = pair [0];
                    var val = pair [1];
                    if (!(objectOrPairs instanceof Array) && objectOrPairs instanceof Object) {
                         // User can potentially pass in an object
                         // that has a hierarchy of objects. This
                         // checks to make sure that these objects
                         // get converted to dict objects instead of
                         // leaving them as js objects.
                         
                         if (!isinstance (objectOrPairs, dict)) {
                             val = dict (val);
                         }
                    }
                    instance [key] = val;
                }
            }
        }
        else {
            if (isinstance (objectOrPairs, dict)) {
                // Passed object is a dict already so we need to be a little careful
                // N.B. - this is a shallow copy per python std - so
                // it is assumed that children have already become
                // python objects at some point.
                
                var aKeys = objectOrPairs.py_keys ();
                for (var index = 0; index < aKeys.length; index++ ) {
                    var key = aKeys [index];
                    instance [key] = objectOrPairs [key];
                }
            } else if (objectOrPairs instanceof Object) {
                // Passed object is a JavaScript object but not yet a dict, don't copy it
                instance = objectOrPairs;
            } else {
                // We have already covered Array so this indicates
                // that the passed object is not a js object - i.e.
                // it is an int or a string, which is invalid.
                
                throw ValueError ("Invalid type of object for dict creation", new Error ());
            }
        }

        // Trancrypt interprets e.g. {aKey: 'aValue'} as a Python dict literal rather than a JavaScript object literal
        // So dict literals rather than bare Object literals will be passed to JavaScript libraries
        // Some JavaScript libraries call all enumerable callable properties of an object that's passed to them
        // So the properties of a dict should be non-enumerable
        __setProperty__ (instance, '__class__', {value: dict, enumerable: false, writable: true});
        __setProperty__ (instance, 'py_keys', {value: __keys__, enumerable: false});
        __setProperty__ (instance, '__iter__', {value: function () {new __PyIterator__ (this.py_keys ());}, enumerable: false});
        __setProperty__ (instance, Symbol.iterator, {value: function () {new __JsIterator__ (this.py_keys ());}, enumerable: false});
        __setProperty__ (instance, 'py_items', {value: __items__, enumerable: false});
        __setProperty__ (instance, 'py_del', {value: __del__, enumerable: false});
        __setProperty__ (instance, 'py_clear', {value: __clear__, enumerable: false});
        __setProperty__ (instance, 'py_get', {value: __getdefault__, enumerable: false});
        __setProperty__ (instance, 'py_setdefault', {value: __setdefault__, enumerable: false});
        __setProperty__ (instance, 'py_pop', {value: __pop__, enumerable: false});
        __setProperty__ (instance, 'py_popitem', {value: __popitem__, enumerable: false});
        __setProperty__ (instance, 'py_update', {value: __update__, enumerable: false});
        __setProperty__ (instance, '__getitem__', {value: __dgetitem__, enumerable: false});    // Needed since compound keys necessarily
        __setProperty__ (instance, '__setitem__', {value: __dsetitem__, enumerable: false});    // trigger overloading to deal with slices
        return instance;
    }

    __all__.dict = dict;
    dict.__name__ = 'dict';
    
    // Docstring setter

    function __setdoc__ (docString) {
        this.__doc__ = docString;
        return this;
    }

    // Python classes, methods and functions are all translated to JavaScript functions
    __setProperty__ (Function.prototype, '__setdoc__', {value: __setdoc__, enumerable: false});

    // General operator overloading, only the ones that make most sense in matrix and complex operations

    var __neg__ = function (a) {
        if (typeof a == 'object' && '__neg__' in a) {
            return a.__neg__ ();
        }
        else {
            return -a;
        }
    };
    __all__.__neg__ = __neg__;

    var __matmul__ = function (a, b) {
        return a.__matmul__ (b);
    };
    __all__.__matmul__ = __matmul__;

    var __pow__ = function (a, b) {
        if (typeof a == 'object' && '__pow__' in a) {
            return a.__pow__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rpow__ (a);
        }
        else {
            return Math.pow (a, b);
        }
    };
    __all__.pow = __pow__;

    var __jsmod__ = function (a, b) {
        if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return a % b;
        }
    };
    __all__.__jsmod__ = __jsmod__;
    
    var __mod__ = function (a, b) {
        if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return ((a % b) + b) % b;
        }
    };
    __all__.mod = __mod__;

    // Overloaded binary arithmetic
    
    var __mul__ = function (a, b) {
        if (typeof a == 'object' && '__mul__' in a) {
            return a.__mul__ (b);
        }
        else if (typeof b == 'object' && '__rmul__' in b) {
            return b.__rmul__ (a);
        }
        else if (typeof a == 'string') {
            return a.__mul__ (b);
        }
        else if (typeof b == 'string') {
            return b.__rmul__ (a);
        }
        else {
            return a * b;
        }
    };
    __all__.__mul__ = __mul__;

    var __div__ = function (a, b) {
        if (typeof a == 'object' && '__div__' in a) {
            return a.__div__ (b);
        }
        else if (typeof b == 'object' && '__rdiv__' in b) {
            return b.__rdiv__ (a);
        }
        else {
            return a / b;
        }
    };
    __all__.__div__ = __div__;

    var __add__ = function (a, b) {
        if (typeof a == 'object' && '__add__' in a) {
            return a.__add__ (b);
        }
        else if (typeof b == 'object' && '__radd__' in b) {
            return b.__radd__ (a);
        }
        else {
            return a + b;
        }
    };
    __all__.__add__ = __add__;

    var __sub__ = function (a, b) {
        if (typeof a == 'object' && '__sub__' in a) {
            return a.__sub__ (b);
        }
        else if (typeof b == 'object' && '__rsub__' in b) {
            return b.__rsub__ (a);
        }
        else {
            return a - b;
        }
    };
    __all__.__sub__ = __sub__;

    // Overloaded binary bitwise
    
    var __lshift__ = function (a, b) {
        if (typeof a == 'object' && '__lshift__' in a) {
            return a.__lshift__ (b);
        }
        else if (typeof b == 'object' && '__rlshift__' in b) {
            return b.__rlshift__ (a);
        }
        else {
            return a << b;
        }
    };
    __all__.__lshift__ = __lshift__;

    var __rshift__ = function (a, b) {
        if (typeof a == 'object' && '__rshift__' in a) {
            return a.__rshift__ (b);
        }
        else if (typeof b == 'object' && '__rrshift__' in b) {
            return b.__rrshift__ (a);
        }
        else {
            return a >> b;
        }
    };
    __all__.__rshift__ = __rshift__;

    var __or__ = function (a, b) {
        if (typeof a == 'object' && '__or__' in a) {
            return a.__or__ (b);
        }
        else if (typeof b == 'object' && '__ror__' in b) {
            return b.__ror__ (a);
        }
        else {
            return a | b;
        }
    };
    __all__.__or__ = __or__;

    var __xor__ = function (a, b) {
        if (typeof a == 'object' && '__xor__' in a) {
            return a.__xor__ (b);
        }
        else if (typeof b == 'object' && '__rxor__' in b) {
            return b.__rxor__ (a);
        }
        else {
            return a ^ b;
        }
    };
    __all__.__xor__ = __xor__;

    var __and__ = function (a, b) {
        if (typeof a == 'object' && '__and__' in a) {
            return a.__and__ (b);
        }
        else if (typeof b == 'object' && '__rand__' in b) {
            return b.__rand__ (a);
        }
        else {
            return a & b;
        }
    };
    __all__.__and__ = __and__;    
        
    // Overloaded binary compare
    
    var __eq__ = function (a, b) {
        if (typeof a == 'object' && '__eq__' in a) {
            return a.__eq__ (b);
        }
        else {
            return a == b;
        }
    };
    __all__.__eq__ = __eq__;

    var __ne__ = function (a, b) {
        if (typeof a == 'object' && '__ne__' in a) {
            return a.__ne__ (b);
        }
        else {
            return a != b
        }
    };
    __all__.__ne__ = __ne__;

    var __lt__ = function (a, b) {
        if (typeof a == 'object' && '__lt__' in a) {
            return a.__lt__ (b);
        }
        else {
            return a < b;
        }
    };
    __all__.__lt__ = __lt__;

    var __le__ = function (a, b) {
        if (typeof a == 'object' && '__le__' in a) {
            return a.__le__ (b);
        }
        else {
            return a <= b;
        }
    };
    __all__.__le__ = __le__;

    var __gt__ = function (a, b) {
        if (typeof a == 'object' && '__gt__' in a) {
            return a.__gt__ (b);
        }
        else {
            return a > b;
        }
    };
    __all__.__gt__ = __gt__;

    var __ge__ = function (a, b) {
        if (typeof a == 'object' && '__ge__' in a) {
            return a.__ge__ (b);
        }
        else {
            return a >= b;
        }
    };
    __all__.__ge__ = __ge__;
    
    // Overloaded augmented general
    
    var __imatmul__ = function (a, b) {
        if ('__imatmul__' in a) {
            return a.__imatmul__ (b);
        }
        else {
            return a.__matmul__ (b);
        }
    };
    __all__.__imatmul__ = __imatmul__;

    var __ipow__ = function (a, b) {
        if (typeof a == 'object' && '__pow__' in a) {
            return a.__ipow__ (b);
        }
        else if (typeof a == 'object' && '__ipow__' in a) {
            return a.__pow__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rpow__ (a);
        }
        else {
            return Math.pow (a, b);
        }
    };
    __all__.ipow = __ipow__;

    var __ijsmod__ = function (a, b) {
        if (typeof a == 'object' && '__imod__' in a) {
            return a.__ismod__ (b);
        }
        else if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return a % b;
        }
    };
    __all__.ijsmod__ = __ijsmod__;
    
    var __imod__ = function (a, b) {
        if (typeof a == 'object' && '__imod__' in a) {
            return a.__imod__ (b);
        }
        else if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return ((a % b) + b) % b;
        }
    };
    __all__.imod = __imod__;
    
    // Overloaded augmented arithmetic
    
    var __imul__ = function (a, b) {
        if (typeof a == 'object' && '__imul__' in a) {
            return a.__imul__ (b);
        }
        else if (typeof a == 'object' && '__mul__' in a) {
            return a = a.__mul__ (b);
        }
        else if (typeof b == 'object' && '__rmul__' in b) {
            return a = b.__rmul__ (a);
        }
        else if (typeof a == 'string') {
            return a = a.__mul__ (b);
        }
        else if (typeof b == 'string') {
            return a = b.__rmul__ (a);
        }
        else {
            return a *= b;
        }
    };
    __all__.__imul__ = __imul__;

    var __idiv__ = function (a, b) {
        if (typeof a == 'object' && '__idiv__' in a) {
            return a.__idiv__ (b);
        }
        else if (typeof a == 'object' && '__div__' in a) {
            return a = a.__div__ (b);
        }
        else if (typeof b == 'object' && '__rdiv__' in b) {
            return a = b.__rdiv__ (a);
        }
        else {
            return a /= b;
        }
    };
    __all__.__idiv__ = __idiv__;

    var __iadd__ = function (a, b) {
        if (typeof a == 'object' && '__iadd__' in a) {
            return a.__iadd__ (b);
        }
        else if (typeof a == 'object' && '__add__' in a) {
            return a = a.__add__ (b);
        }
        else if (typeof b == 'object' && '__radd__' in b) {
            return a = b.__radd__ (a);
        }
        else {
            return a += b;
        }
    };
    __all__.__iadd__ = __iadd__;

    var __isub__ = function (a, b) {
        if (typeof a == 'object' && '__isub__' in a) {
            return a.__isub__ (b);
        }
        else if (typeof a == 'object' && '__sub__' in a) {
            return a = a.__sub__ (b);
        }
        else if (typeof b == 'object' && '__rsub__' in b) {
            return a = b.__rsub__ (a);
        }
        else {
            return a -= b;
        }
    };
    __all__.__isub__ = __isub__;

    // Overloaded augmented bitwise
    
    var __ilshift__ = function (a, b) {
        if (typeof a == 'object' && '__ilshift__' in a) {
            return a.__ilshift__ (b);
        }
        else if (typeof a == 'object' && '__lshift__' in a) {
            return a = a.__lshift__ (b);
        }
        else if (typeof b == 'object' && '__rlshift__' in b) {
            return a = b.__rlshift__ (a);
        }
        else {
            return a <<= b;
        }
    };
    __all__.__ilshift__ = __ilshift__;

    var __irshift__ = function (a, b) {
        if (typeof a == 'object' && '__irshift__' in a) {
            return a.__irshift__ (b);
        }
        else if (typeof a == 'object' && '__rshift__' in a) {
            return a = a.__rshift__ (b);
        }
        else if (typeof b == 'object' && '__rrshift__' in b) {
            return a = b.__rrshift__ (a);
        }
        else {
            return a >>= b;
        }
    };
    __all__.__irshift__ = __irshift__;

    var __ior__ = function (a, b) {
        if (typeof a == 'object' && '__ior__' in a) {
            return a.__ior__ (b);
        }
        else if (typeof a == 'object' && '__or__' in a) {
            return a = a.__or__ (b);
        }
        else if (typeof b == 'object' && '__ror__' in b) {
            return a = b.__ror__ (a);
        }
        else {
            return a |= b;
        }
    };
    __all__.__ior__ = __ior__;

    var __ixor__ = function (a, b) {
        if (typeof a == 'object' && '__ixor__' in a) {
            return a.__ixor__ (b);
        }
        else if (typeof a == 'object' && '__xor__' in a) {
            return a = a.__xor__ (b);
        }
        else if (typeof b == 'object' && '__rxor__' in b) {
            return a = b.__rxor__ (a);
        }
        else {
            return a ^= b;
        }
    };
    __all__.__ixor__ = __ixor__;

    var __iand__ = function (a, b) {
        if (typeof a == 'object' && '__iand__' in a) {
            return a.__iand__ (b);
        }
        else if (typeof a == 'object' && '__and__' in a) {
            return a = a.__and__ (b);
        }
        else if (typeof b == 'object' && '__rand__' in b) {
            return a = b.__rand__ (a);
        }
        else {
            return a &= b;
        }
    };
    __all__.__iand__ = __iand__;
    
    // Indices and slices

    var __getitem__ = function (container, key) {                           // Slice c.q. index, direct generated call to runtime switch
        if (typeof container == 'object' && '__getitem__' in container) {
            return container.__getitem__ (key);                             // Overloaded on container
        }
        else {
            return container [key];                                         // Container must support bare JavaScript brackets
        }
    };
    __all__.__getitem__ = __getitem__;

    var __setitem__ = function (container, key, value) {                    // Slice c.q. index, direct generated call to runtime switch
        if (typeof container == 'object' && '__setitem__' in container) {
            container.__setitem__ (key, value);                             // Overloaded on container
        }
        else {
            container [key] = value;                                        // Container must support bare JavaScript brackets
        }
    };
    __all__.__setitem__ = __setitem__;

    var __getslice__ = function (container, lower, upper, step) {           // Slice only, no index, direct generated call to runtime switch
        if (typeof container == 'object' && '__getitem__' in container) {
            return container.__getitem__ ([lower, upper, step]);            // Container supports overloaded slicing c.q. indexing
        }
        else {
            return container.__getslice__ (lower, upper, step);             // Container only supports slicing injected natively in prototype
        }
    };
    __all__.__getslice__ = __getslice__;

    var __setslice__ = function (container, lower, upper, step, value) {    // Slice, no index, direct generated call to runtime switch
        if (typeof container == 'object' && '__setitem__' in container) {
            container.__setitem__ ([lower, upper, step], value);            // Container supports overloaded slicing c.q. indexing
        }
        else {
            container.__setslice__ (lower, upper, step, value);             // Container only supports slicing injected natively in prototype
        }
    };
    __all__.__setslice__ = __setslice__;



// ============ Source: /home/yamatteo/yamath/look/look.py ============

/* 000001 */ 	(function () {
/* 000004 */ 		var clean = function () {
/* 000004 */ 			var args = tuple ([].slice.apply (arguments).slice (0));
/* 000005 */ 			var __iterable0__ = args;
/* 000005 */ 			for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000005 */ 				var id = __iterable0__ [__index0__];
/* 000006 */ 				$ ('#{}'.format (id)).empty ();
/* 000006 */ 			}
/* 000006 */ 		};
/* 000009 */ 		var hide = function () {
/* 000009 */ 			var args = tuple ([].slice.apply (arguments).slice (0));
/* 000010 */ 			var __iterable0__ = args;
/* 000010 */ 			for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000010 */ 				var id = __iterable0__ [__index0__];
/* 000011 */ 				$ ('#{}'.format (id)).hide ();
/* 000011 */ 			}
/* 000011 */ 		};
/* 000014 */ 		var load = function (id, query) {
/* 000015 */ 			clean (id);
/* 000016 */ 			show ('loadingBoard');
/* 000017 */ 			var success = function (d) {
/* 000018 */ 				$ ('#{}'.format (id)).html (d);
/* 000019 */ 				hide ('loadingBoard');
/* 000019 */ 			};
/* 000022 */ 			$.ajax (dict ({'method': 'GET', 'url': 'html/?{}'.format (query), 'success': success, 'error': (function __lambda__ (d) {
/* 000024 */ 				return load (id, 'command=error');
/* 000024 */ 			})}));
/* 000024 */ 		};
/* 000028 */ 		var loadMessage = function (id, msg) {
/* 000029 */ 			load (id, 'command=message&message={}'.format (encodeURIComponent (msg)));
/* 000029 */ 		};
/* 000031 */ 		var show = function () {
/* 000031 */ 			var args = tuple ([].slice.apply (arguments).slice (0));
/* 000032 */ 			var __iterable0__ = args;
/* 000032 */ 			for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000032 */ 				var id = __iterable0__ [__index0__];
/* 000033 */ 				$ ('#{}'.format (id)).show ();
/* 000033 */ 			}
/* 000033 */ 		};
/* 000036 */ 		var hookAdmin = function () {
/* 000037 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000038 */ 			clean ('goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000039 */ 			load ('activeBoard', 'command=admin');
/* 000040 */ 			show ('activeBoard', 'navbar');
/* 000040 */ 		};
/* 000043 */ 		var hookChangePassword = function () {
/* 000044 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000045 */ 			var username = $ ("input[name='username']").val ();
/* 000046 */ 			var old_passplain = $ ("input[name='old_passplain']").val ();
/* 000047 */ 			var new_passplain = $ ("input[name='new_passplain']").val ();
/* 000048 */ 			print (username, old_passplain, new_passplain);
/* 000049 */ 			if (changepassword (username, old_passplain, new_passplain)) {
/* 000050 */ 				loadMessage ('goodnews', 'La password è stata cambiata');
/* 000051 */ 				show ('goodnews');
/* 000051 */ 			}
/* 000052 */ 			else {
/* 000053 */ 				loadMessage ('badnews', 'Non è stato possibile cambiare la password');
/* 000054 */ 				show ('badnews');
/* 000054 */ 			}
/* 000055 */ 			load ('navbar', 'command=navbar');
/* 000056 */ 			load ('activeBoard', 'command=profile');
/* 000057 */ 			show ('navbar', 'activeBoard');
/* 000057 */ 		};
/* 000060 */ 		var changepassword = function (username, old_passplain, new_passplain) {
/* 000061 */ 			var httpPost = function (theUrl) {
/* 000062 */ 				var xmlHttp = new XMLHttpRequest;
/* 000063 */ 				xmlHttp.open ('POST', theUrl, false);
/* 000064 */ 				xmlHttp.send (null);
/* 000065 */ 				return tuple ([xmlHttp.status, xmlHttp.responseText]);
/* 000065 */ 			};
/* 000066 */ 			var __left0__ = httpPost ('back/?command=changepassword&username={}&old_passplain={}&new_passplain={}'.format (username, old_passplain, new_passplain));
/* 000066 */ 			var status = __left0__ [0];
/* 000066 */ 			var text = __left0__ [1];
/* 000067 */ 			if (status == 200) {
/* 000068 */ 				return text;
/* 000068 */ 			}
/* 000069 */ 			else {
/* 000070 */ 				print ('error in change password');
/* 000071 */ 				return false;
/* 000071 */ 			}
/* 000071 */ 		};
/* 000075 */ 		var hookContent = function () {
/* 000076 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000077 */ 			clean ('goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000078 */ 			load ('activeBoard', 'command=content');
/* 000079 */ 			show ('activeBoard', 'navbar');
/* 000079 */ 		};
/* 000082 */ 		var hookLogin = function () {
/* 000083 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000084 */ 			var username = login ();
/* 000085 */ 			clean ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000086 */ 			if (!(username)) {
/* 000087 */ 				loadMessage ('badnews', 'Non è stato possibile accedere. Ritenta o contatta il tuo insegnante');
/* 000088 */ 				show ('badnews');
/* 000088 */ 			}
/* 000089 */ 			load ('navbar', 'command=navbar&username={}'.format (username));
/* 000090 */ 			load ('welcomeBoard', 'command=welcomeBoard&username={}'.format (username));
/* 000091 */ 			show ('navbar', 'welcomeBoard');
/* 000091 */ 		};
/* 000094 */ 		var login = function () {
/* 000095 */ 			var username = $ ("input[name='username']").val ();
/* 000096 */ 			var password = $ ("input[name='password']").val ();
/* 000097 */ 			var httpGet = function (theUrl) {
/* 000098 */ 				var xmlHttp = new XMLHttpRequest;
/* 000099 */ 				xmlHttp.open ('GET', theUrl, false);
/* 000100 */ 				xmlHttp.send (null);
/* 000101 */ 				return tuple ([xmlHttp.status, xmlHttp.responseText]);
/* 000101 */ 			};
/* 000102 */ 			var __left0__ = httpGet ('back/?command=login&username={}&password={}'.format (username, password));
/* 000102 */ 			var status = __left0__ [0];
/* 000102 */ 			var text = __left0__ [1];
/* 000103 */ 			if (status == 200) {
/* 000104 */ 				$.cookie ('authtoken', text);
/* 000105 */ 				return username;
/* 000105 */ 			}
/* 000106 */ 			else {
/* 000107 */ 				return false;
/* 000107 */ 			}
/* 000107 */ 		};
/* 000109 */ 		var hookLogout = function () {
/* 000110 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000111 */ 			clean ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000112 */ 			$.removeCookie ('authtoken');
/* 000113 */ 			load ('navbar', 'command=navbar');
/* 000114 */ 			load ('welcomeBoard', 'command=welcomeBoard');
/* 000115 */ 			show ('navbar', 'welcomeBoard');
/* 000115 */ 		};
/* 000118 */ 		var hookMain = function () {
/* 000119 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000120 */ 			clean ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000121 */ 			try {
/* 000122 */ 				var username = unmask ($.cookie ('authtoken'));
/* 000122 */ 			}
/* 000122 */ 			catch (__except0__) {
/* 000124 */ 				var username = null;
/* 000124 */ 			}
/* 000125 */ 			load ('navbar', 'command=navbar&username={}'.format (username));
/* 000126 */ 			load ('welcomeBoard', 'command=welcomeBoard&username={}'.format (username));
/* 000127 */ 			show ('navbar', 'welcomeBoard');
/* 000127 */ 		};
/* 000130 */ 		var unmask = function (token) {
/* 000131 */ 			var httpGet = function (theUrl) {
/* 000132 */ 				var xmlHttp = new XMLHttpRequest;
/* 000133 */ 				xmlHttp.open ('GET', theUrl, false);
/* 000134 */ 				xmlHttp.send (null);
/* 000135 */ 				return tuple ([xmlHttp.status, xmlHttp.responseText]);
/* 000135 */ 			};
/* 000136 */ 			var __left0__ = httpGet ('back/?command=unmask&token={}'.format (token));
/* 000136 */ 			var status = __left0__ [0];
/* 000136 */ 			var text = __left0__ [1];
/* 000137 */ 			if (status == 200) {
/* 000138 */ 				return text;
/* 000138 */ 			}
/* 000139 */ 			else {
/* 000140 */ 				print ('unmask request', token);
/* 000141 */ 				return false;
/* 000141 */ 			}
/* 000141 */ 		};
/* 000144 */ 		var hookNewClassroom = function () {
/* 000145 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000146 */ 			var ref = $ ("input[name='ref']").val ();
/* 000147 */ 			var httpPost = function (theUrl) {
/* 000148 */ 				var xmlHttp = new XMLHttpRequest;
/* 000149 */ 				xmlHttp.open ('POST', theUrl, false);
/* 000150 */ 				xmlHttp.send (null);
/* 000151 */ 				return xmlHttp.status;
/* 000151 */ 			};
/* 000152 */ 			if (httpPost ('back/?command=newClassroom&ref={}'.format (ref)) == 200) {
/* 000153 */ 				loadMessage ('goodnews', 'La classe è stata creata con successo');
/* 000154 */ 				show ('goodnews');
/* 000154 */ 			}
/* 000155 */ 			else {
/* 000156 */ 				loadMessage ('badnews', 'Non è stato possibile creare il profilo');
/* 000157 */ 				show ('badnews');
/* 000157 */ 			}
/* 000158 */ 			load ('activeBoard', 'command=admin');
/* 000159 */ 			show ('navbar', 'activeBoard');
/* 000159 */ 		};
/* 000162 */ 		var hookProfile = function () {
/* 000163 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000164 */ 			clean ('goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000165 */ 			load ('activeBoard', 'command=profile');
/* 000166 */ 			show ('navbar', 'activeBoard');
/* 000166 */ 		};
/* 000169 */ 		var hookSignup = function () {
/* 000170 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000171 */ 			if (signup ()) {
/* 000172 */ 				loadMessage ('goodnews', 'Il profilo è stato creato con successo');
/* 000173 */ 				show ('goodnews');
/* 000173 */ 			}
/* 000174 */ 			else {
/* 000175 */ 				loadMessage ('badnews', 'Non è stato possibile creare il profilo');
/* 000176 */ 				show ('badnews');
/* 000176 */ 			}
/* 000177 */ 			load ('navbar', 'command=navbar');
/* 000178 */ 			load ('welcomeBoard', 'command=welcomeBoard');
/* 000179 */ 			show ('navbar', 'welcomeBoard');
/* 000180 */ 			return false;
/* 000180 */ 		};
/* 000183 */ 		var signup = function () {
/* 000184 */ 			var username = $ ("input[name='username']").val ();
/* 000185 */ 			var password = $ ("input[name='password']").val ();
/* 000186 */ 			var httpPost = function (theUrl) {
/* 000187 */ 				var xmlHttp = new XMLHttpRequest;
/* 000188 */ 				xmlHttp.open ('POST', theUrl, false);
/* 000189 */ 				xmlHttp.send (null);
/* 000190 */ 				return xmlHttp.status;
/* 000190 */ 			};
/* 000191 */ 			if (httpPost ('back/?command=signup&username={}&password={}'.format (username, password)) == 200) {
/* 000192 */ 				return true;
/* 000192 */ 			}
/* 000193 */ 			else {
/* 000194 */ 				return false;
/* 000194 */ 			}
/* 000194 */ 		};
/* 000196 */ 		load ('navbar', 'command=navbar');
/* 000197 */ 		load ('welcomeBoard', 'command=welcomeBoard');
/* 000198 */ 		show ('welcomeBoard');
/* 000199 */ 		hide ('loadingBoard');
/* 000199 */ 		__pragma__ ('<all>')
/* 000199 */ 			__all__.changepassword = changepassword;
/* 000199 */ 			__all__.clean = clean;
/* 000199 */ 			__all__.hide = hide;
/* 000199 */ 			__all__.hookAdmin = hookAdmin;
/* 000199 */ 			__all__.hookChangePassword = hookChangePassword;
/* 000199 */ 			__all__.hookContent = hookContent;
/* 000199 */ 			__all__.hookLogin = hookLogin;
/* 000199 */ 			__all__.hookLogout = hookLogout;
/* 000199 */ 			__all__.hookMain = hookMain;
/* 000199 */ 			__all__.hookNewClassroom = hookNewClassroom;
/* 000199 */ 			__all__.hookProfile = hookProfile;
/* 000199 */ 			__all__.hookSignup = hookSignup;
/* 000199 */ 			__all__.load = load;
/* 000199 */ 			__all__.loadMessage = loadMessage;
/* 000199 */ 			__all__.login = login;
/* 000199 */ 			__all__.show = show;
/* 000199 */ 			__all__.signup = signup;
/* 000199 */ 			__all__.unmask = unmask;
/* 000199 */ 		__pragma__ ('</all>')
/* 000199 */ 	}) ();
/* 000199 */    return __all__;
}
window ['look'] = look ();
