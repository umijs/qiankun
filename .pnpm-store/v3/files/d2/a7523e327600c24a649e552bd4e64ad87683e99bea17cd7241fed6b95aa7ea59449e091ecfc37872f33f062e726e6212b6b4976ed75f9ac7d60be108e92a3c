var MathJax = {debug:true};

var window = {
  MathJax: MathJax
};
var navigator = {};
var document = null;

exports.MathJax = MathJax;

(function (BASENAME) {
  var BASE = window[BASENAME];
  if (!BASE) {BASE = window[BASENAME] = {}}

  var PROTO = [];  // a static object used to indicate when a prototype is being created
  var OBJECT = function (def) {
    var obj = def.constructor; if (!obj) {obj = function () {}}
    for (var id in def) {if (id !== 'constructor' && def.hasOwnProperty(id)) {obj[id] = def[id]}}
    return obj;
  };
  var CONSTRUCTOR = function () {
    return function () {return arguments.callee.Init.call(this,arguments)};
  };

  BASE.Object = OBJECT({
    constructor: CONSTRUCTOR(),
    
    Subclass: function (def,classdef) {
      var obj = CONSTRUCTOR();
      obj.SUPER = this; obj.Init = this.Init;
      obj.Subclass = this.Subclass; obj.Augment = this.Augment;
      obj.protoFunction = this.protoFunction;
      obj.can = this.can; obj.has = this.has; obj.isa = this.isa;
      obj.prototype = new this(PROTO);
      obj.prototype.constructor = obj;  // the real constructor
      obj.Augment(def,classdef);
      return obj;
    },
  
    Init: function (args) {
      var obj = this;
      if (args.length === 1 && args[0] === PROTO) {return obj}
      if (!(obj instanceof args.callee)) {obj = new args.callee(PROTO)}
      return obj.Init.apply(obj,args) || obj;
    },
    
    Augment: function (def,classdef) {
      var id;
      if (def != null) {
        for (id in def) {if (def.hasOwnProperty(id)) {this.protoFunction(id,def[id])}}
        // MSIE doesn't list toString even if it is not native so handle it separately
        if (def.toString !== this.prototype.toString && def.toString !== {}.toString)
          {this.protoFunction('toString',def.toString)}
      }
      if (classdef != null) {
        for (id in classdef) {if (classdef.hasOwnProperty(id)) {this[id] = classdef[id]}}
      }
      return this;
    },
  
    protoFunction: function (id,def) {
      this.prototype[id] = def;
      if (typeof def === "function") {def.SUPER = this.SUPER.prototype}
    },
  
    prototype: {
      Init: function () {},
      SUPER: function (fn) {return fn.callee.SUPER},
      can: function (method) {return typeof(this[method]) === "function"},
      has: function (property) {return typeof(this[property]) !== "undefined"},
      isa: function (obj) {return (obj instanceof Object) && (this instanceof obj)}
    },
  
    can: function (method)   {return this.prototype.can.call(this,method)},
    has: function (property) {return this.prototype.has.call(this,property)},
    isa: function (obj) {
      var constructor = this;
      while (constructor) {
        if (constructor === obj) {return true} else {constructor = constructor.SUPER}
      }
      return false;
    },


    SimpleSUPER: OBJECT({
      constructor: function (def) {return this.SimpleSUPER.define(def)},

      define: function (src) {
	var dst = {};
	if (src != null) {
          for (var id in src) {if (src.hasOwnProperty(id)) {dst[id] = this.wrap(id,src[id])}}
	  // MSIE doesn't list toString even if it is not native so handle it separately
          if (src.toString !== this.prototype.toString && src.toString !== {}.toString)
            {dst.toString = this.wrap('toString',src.toString)}
	}
	return dst;
      },

      wrap: function (id,f) {
        if (typeof(f) !== 'function' || !f.toString().match(/\.\s*SUPER\s*\(/)) {return f}
        var fn = function () {
          this.SUPER = fn.SUPER[id];
          try {var result = f.apply(this,arguments)} catch (err) {delete this.SUPER; throw err}
          delete this.SUPER;
          return result;
        }
        fn.toString = function () {return f.toString.apply(f,arguments)}
        return fn;
      }

    })
  });

  BASE.Object.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  
  BASE.Object.Array = Array;

})("MathJax");

/**********************************************************/

/*
 *  Create a callback function from various forms of data:
 *  
 *     MathJax.Callback(fn)    -- callback to a function
 *
 *     MathJax.Callback([fn])  -- callback to function
 *     MathJax.Callback([fn,data...])
 *                             -- callback to function with given data as arguments
 *     MathJax.Callback([object,fn])
 *                             -- call fn with object as "this"
 *     MathJax.Callback([object,fn,data...])
 *                             -- call fn with object as "this" and data as arguments
 *     MathJax.Callback(["method",object])
 *                             -- call method of object wth object as "this"
 *     MathJax.Callback(["method",object,data...])
 *                             -- as above, but with data as arguments to method
 *
 *     MathJax.Callback({hook: fn, data: [...], object: this})
 *                             -- give function, data, and object to act as "this" explicitly
 *
 *     MathJax.Callback("code")  -- callback that compiles and executes a string
 *
 *     MathJax.Callback([...],i)
 *                             -- use slice of array starting at i and interpret
 *                                result as above.  (Used for passing "arguments" array
 *                                and trimming initial arguments, if any.)
 */

/*
 *    MathJax.Callback.After([...],cb1,cb2,...)
 *                             -- make a callback that isn't called until all the other
 *                                ones are called first.  I.e., wait for a union of
 *                                callbacks to occur before making the given callback.
 */

/*
 *  MathJax.Callback.Queue([callback,...])
 *                             -- make a synchronized queue of commands that process
 *                                sequentially, waiting for those that return uncalled
 *                                callbacks.
 */

/*
 *  MathJax.Callback.Signal(name)
 *                             -- finds or creates a names signal, to which listeners
 *                                can be attached and are signaled by messages posted
 *                                to the signal.  Responses can be asynchronous.
 */

(function (BASENAME) {
  var BASE = window[BASENAME];
  if (!BASE) {BASE = window[BASENAME] = {}}
  //
  //  Create a callback from an associative array
  //
  var CALLBACK = function (data) {
    var cb = function () {return arguments.callee.execute.apply(arguments.callee,arguments)};
    for (var id in CALLBACK.prototype) {
      if (CALLBACK.prototype.hasOwnProperty(id)) {
        if (typeof(data[id]) !== 'undefined') {cb[id] = data[id]}
                                         else {cb[id] = CALLBACK.prototype[id]}
      }
    }
    cb.toString = CALLBACK.prototype.toString;
    return cb;
  };
  CALLBACK.prototype = {
    isCallback: true,
    hook: function () {},
    data: [],
    object: window,
    execute: function () {
      if (!this.called || this.autoReset) {
        this.called = !this.autoReset;
        return this.hook.apply(this.object,this.data.concat([].slice.call(arguments,0)));
      }
    },
    reset: function () {delete this.called},
    toString: function () {return this.hook.toString.apply(this.hook,arguments)}
  };
  var ISCALLBACK = function (f) {
    return (typeof(f) === "function" && f.isCallback);
  }

  //
  //  Evaluate a string in global context
  //
  var EVAL = function (code) {return eval.call(window,code)}
  var TESTEVAL = function () {
    EVAL("var __TeSt_VaR__ = 1"); // check if it works in global context
    if (window.__TeSt_VaR__) {
      try { delete window.__TeSt_VaR__; } // NOTE IE9 throws when in IE7 mode
      catch (error) { window.__TeSt_VaR__ = null; } 
    } else {
      if (window.execScript) {
        // IE
        EVAL = function (code) {
          BASE.__code = code;
          code = "try {"+BASENAME+".__result = eval("+BASENAME+".__code)} catch(err) {"+BASENAME+".__result = err}";
          window.execScript(code);
          var result = BASE.__result; delete BASE.__result; delete BASE.__code;
          if (result instanceof Error) {throw result}
          return result;
        }
      } else {
        // Safari2
        EVAL = function (code) {
          BASE.__code = code;
          code = "try {"+BASENAME+".__result = eval("+BASENAME+".__code)} catch(err) {"+BASENAME+".__result = err}";
          var head = (document.getElementsByTagName("head"))[0]; if (!head) {head = document.body}
          var script = document.createElement("script");
          script.appendChild(document.createTextNode(code));
          head.appendChild(script); head.removeChild(script);
          var result = BASE.__result; delete BASE.__result; delete BASE.__code;
          if (result instanceof Error) {throw result}
          return result;
        }
      }
    }
    TESTEVAL = null;
  }

  //
  //  Create a callback from various types of data
  //
  var USING = function (args,i) {
    if (arguments.length > 1) {
      if (arguments.length === 2 && !(typeof arguments[0] === 'function') &&
          arguments[0] instanceof Object && typeof arguments[1] === 'number')
            {args = [].slice.call(args,i)}
      else {args = [].slice.call(arguments,0)}
    }
    if (args instanceof Array && args.length === 1) {args = args[0]}
    if (typeof args === 'function') {
      if (args.execute === CALLBACK.prototype.execute) {return args}
      return CALLBACK({hook: args});
    } else if (args instanceof Array) {
      if (typeof(args[0]) === 'string' && args[1] instanceof Object &&
                 typeof args[1][args[0]] === 'function') {
        return CALLBACK({hook: args[1][args[0]], object: args[1], data: args.slice(2)});
      } else if (typeof args[0] === 'function') {
        return CALLBACK({hook: args[0], data: args.slice(1)});
      } else if (typeof args[1] === 'function') {
        return CALLBACK({hook: args[1], object: args[0], data: args.slice(2)});
      }
    } else if (typeof(args) === 'string') {
      if (TESTEVAL) TESTEVAL();
      return CALLBACK({hook: EVAL, data: [args]});
    } else if (args instanceof Object) {
      return CALLBACK(args);
    } else if (typeof(args) === 'undefined') {
      return CALLBACK({});
    }
    throw Error("Can't make callback from given data");
  };
  
  //
  //  Wait for a given time to elapse and then perform the callback
  //
  var DELAY = function (time,callback) {
    callback = USING(callback);
    callback.timeout = setTimeout(callback,time);
    return callback;
  };

  //
  //  Callback used by AFTER, QUEUE, and SIGNAL to check if calls have completed
  //
  var WAITFOR = function (callback,signal) {
    callback = USING(callback);
    if (!callback.called) {WAITSIGNAL(callback,signal); signal.pending++}
  };
  var WAITEXECUTE = function () {
    var signals = this.signal; delete this.signal;
    this.execute = this.oldExecute; delete this.oldExecute;
    var result = this.execute.apply(this,arguments);
    if (ISCALLBACK(result) && !result.called) {WAITSIGNAL(result,signals)} else {
      for (var i = 0, m = signals.length; i < m; i++) {
        signals[i].pending--;
        if (signals[i].pending <= 0) {signals[i].call()}
      }
    }
  };
  var WAITSIGNAL = function (callback,signals) {
    if (!(signals instanceof Array)) {signals = [signals]}
    if (!callback.signal) {
      callback.oldExecute = callback.execute;
      callback.execute = WAITEXECUTE;
      callback.signal = signals;
    } else if (signals.length === 1) {callback.signal.push(signals[0])}
      else {callback.signal = callback.signal.concat(signals)}
  };

  //
  //  Create a callback that is called when a collection of other callbacks have
  //  all been executed.  If the callback gets called immediately (i.e., the
  //  others are all already called), check if it returns another callback
  //  and return that instead.
  //
  var AFTER = function (callback) {
    callback = USING(callback);
    callback.pending = 0;
    for (var i = 1, m = arguments.length; i < m; i++)
      {if (arguments[i]) {WAITFOR(arguments[i],callback)}}
    if (callback.pending === 0) {
      var result = callback();
      if (ISCALLBACK(result)) {callback = result}
    }
    return callback;
  };

  //
  //  An array of prioritized hooks that are executed sequentially
  //  with a given set of data.
  //
  var HOOKS = MathJax.Object.Subclass({
    //
    //  Initialize the array and the auto-reset status
    //
    Init: function (reset) {
      this.hooks = [];
      this.remove = []; // used when hooks are removed during execution of list
      this.reset = reset;
      this.running = false;
    },
    //
    //  Add a callback to the list, in priority order (default priority is 10)
    //
    Add: function (hook,priority) {
      if (priority == null) {priority = 10}
      if (!ISCALLBACK(hook)) {hook = USING(hook)}
      hook.priority = priority;
      var i = this.hooks.length;
      while (i > 0 && priority < this.hooks[i-1].priority) {i--}
      this.hooks.splice(i,0,hook);
      return hook;
    },
    Remove: function (hook) {
      for (var i = 0, m = this.hooks.length; i < m; i++) {
        if (this.hooks[i] === hook) {
          if (this.running) {this.remove.push(i)}
            else {this.hooks.splice(i,1)}
          return;
        }
      }
    },
    //
    //  Execute the list of callbacks, resetting them if requested.
    //  If any return callbacks, return a callback that will be 
    //  executed when they all have completed.
    //  Remove any hooks that requested being removed during processing.
    //
    Execute: function () {
      var callbacks = [{}];
      this.running = true;
      for (var i = 0, m = this.hooks.length; i < m; i++) {
        if (this.reset) {this.hooks[i].reset()}
        var result = this.hooks[i].apply(window,arguments);
        if (ISCALLBACK(result) && !result.called) {callbacks.push(result)}
      }
      this.running = false;
      if (this.remove.length) {this.RemovePending()}
      if (callbacks.length === 1) {return null}
      if (callbacks.length === 2) {return callbacks[1]}
      return AFTER.apply({},callbacks);
    },
    //
    //  Remove hooks that asked to be removed during execution of list
    //
    RemovePending: function () {
      this.remove = this.remove.sort();
      for (var i = this.remove.length-1; i >= 0; i--) {this.hooks.splice(i,1)}
      this.remove = [];
    }

  });
  
  //
  //  Run an array of callbacks passing them the given data.
  //  (Legacy function, since this has been replaced by the HOOKS object).
  //
  var EXECUTEHOOKS = function (hooks,data,reset) {
    if (!hooks) {return null}
    if (!(hooks instanceof Array)) {hooks = [hooks]}
    if (!(data instanceof Array))  {data = (data == null ? [] : [data])}
    var handler = HOOKS(reset);
    for (var i = 0, m = hooks.length; i < m; i++) {handler.Add(hooks[i])}
    return handler.Execute.apply(handler,data);
  };
   
  //
  //  Command queue that performs commands in order, waiting when
  //  necessary for commands to complete asynchronousely
  //
  var QUEUE = BASE.Object.Subclass({
    //
    //  Create the queue and push any commands that are specified
    //
    Init: function () {
      this.pending = this.running = 0;
      this.queue = [];
      this.Push.apply(this,arguments);
    },
    //
    //  Add commands to the queue and run them. Adding a callback object
    //  (rather than a callback specification) queues a wait for that callback.
    //  Return the final callback for synchronization purposes.
    //
    Push: function () {
      var callback;
      for (var i = 0, m = arguments.length; i < m; i++) {
        callback = USING(arguments[i]);
        if (callback === arguments[i] && !callback.called)
          {callback = USING(["wait",this,callback])}
        this.queue.push(callback);
      }
      if (!this.running && !this.pending) {this.Process()}
      return callback;
    },
    //
    //  Process the command queue if we aren't waiting on another command
    //
    Process: function (queue) {
      while (!this.running && !this.pending && this.queue.length) {
        var callback = this.queue[0];
        queue = this.queue.slice(1); this.queue = [];
        this.Suspend(); var result = callback(); this.Resume();
        if (queue.length) {this.queue = queue.concat(this.queue)}
        if (ISCALLBACK(result) && !result.called) {WAITFOR(result,this)}
      }
    },
    //
    //  Suspend/Resume command processing on this queue
    //
    Suspend: function () {this.running++},
    Resume: function () {if (this.running) {this.running--}},
    //
    //  Used by WAITFOR to restart the queue when an action completes
    //
    call: function () {this.Process.apply(this,arguments)},
    wait: function (callback) {return callback}
  });
  
  //
  //  Create a named signal that listeners can attach to, to be signaled by
  //  postings made to the signal.  Posts are queued if they occur while one
  //  is already in process.
  //
  var SIGNAL = QUEUE.Subclass({
    Init: function (name) {
      QUEUE.prototype.Init.call(this);
      this.name = name;
      this.posted = [];              // the messages posted so far
      this.listeners = HOOKS(true);  // those with interest in this signal
      this.posting = false;
      this.callback = null;
    },
    //
    // Post a message to the signal listeners, with callback for when complete
    //
    Post: function (message,callback,forget) {
      callback = USING(callback);
      if (this.posting || this.pending) {
        this.Push(["Post",this,message,callback,forget]);
      } else {
        this.callback = callback; callback.reset();
        if (!forget) {this.posted.push(message)}
        this.Suspend(); this.posting = true;
        var result = this.listeners.Execute(message);
        if (ISCALLBACK(result) && !result.called) {WAITFOR(result,this)}
        this.Resume(); this.posting = false;
        if (!this.pending) {this.call()}
      }
      return callback;
    },
    //
    //  Clear the post history (so new listeners won't get old messages)
    //
    Clear: function (callback) {
      callback = USING(callback);
      if (this.posting || this.pending) {
        callback = this.Push(["Clear",this,callback]);
      } else {
        this.posted = [];
        callback();
      }
      return callback;
    },
    //
    //  Call the callback (all replies are in) and process the command queue
    //
    call: function () {this.callback(this); this.Process()},
    
    //
    //  A listener calls this to register interest in the signal (so it will be called
    //  when posts occur).  If ignorePast is true, it will not be sent the post history.
    //
    Interest: function (callback,ignorePast,priority) {
      callback = USING(callback);
      this.listeners.Add(callback,priority);
      if (!ignorePast) {
        for (var i = 0, m = this.posted.length; i < m; i++) {
          callback.reset();
          var result = callback(this.posted[i]);
          if (ISCALLBACK(result) && i === this.posted.length-1) {WAITFOR(result,this)}
        }
      }
      return callback;
    },
    //
    //  A listener calls this to remove itself from a signal
    //
    NoInterest: function (callback) {
      this.listeners.Remove(callback);
    },
    
    //
    //  Hook a callback to a particular message on this signal
    //
    MessageHook: function (msg,callback,priority) {
      callback = USING(callback);
      if (!this.hooks) {this.hooks = {}; this.Interest(["ExecuteHooks",this])}
      if (!this.hooks[msg]) {this.hooks[msg] = HOOKS(true)}
      this.hooks[msg].Add(callback,priority);
      for (var i = 0, m = this.posted.length; i < m; i++)
        {if (this.posted[i] == msg) {callback.reset(); callback(this.posted[i])}}
      callback.msg = msg; // keep track so we can remove it
      return callback;
    },
    //
    //  Execute the message hooks for the given message
    //
    ExecuteHooks: function (msg) {
      var type = ((msg instanceof Array) ? msg[0] : msg);
      if (!this.hooks[type]) {return null}
      return this.hooks[type].Execute(msg);
    },
    //
    //  Remove a hook safely
    //
    RemoveHook: function (hook) {
      this.hooks[hook.msg].Remove(hook);
    }
    
  },{
    signals: {},  // the named signals
    find: function (name) {
      if (!SIGNAL.signals[name]) {SIGNAL.signals[name] = new SIGNAL(name)}
      return SIGNAL.signals[name];
    }
  });
  
  //
  //  The main entry-points
  //
  BASE.Callback = BASE.CallBack = USING;
  BASE.Callback.Delay = DELAY;
  BASE.Callback.After = AFTER;
  BASE.Callback.Queue = QUEUE;
  BASE.Callback.Signal = SIGNAL.find;
  BASE.Callback.Hooks = HOOKS;
  BASE.Callback.ExecuteHooks = EXECUTEHOOKS;
})("MathJax");


/**********************************************************/

(function (BASENAME) {
  var BASE = window[BASENAME];
  if (!BASE) {BASE = window[BASENAME] = {}}
  
  var isSafari2 = (navigator.vendor === "Apple Computer, Inc." &&
                   typeof navigator.vendorSub === "undefined");
  var sheets = 0; // used by Safari2

  //
  //  Update sheets count and look up the head object
  //  
  var HEAD = function (head) {
    return null;
/*
    if (document.styleSheets && document.styleSheets.length > sheets)
      {sheets = document.styleSheets.length}
    if (!head) {
      head = document.head || ((document.getElementsByTagName("head"))[0]);
      if (!head) {head = document.body}
    }
    return head;
*/
  };
  
  //
  //  Remove scripts that are completed so they don't clutter up the HEAD.
  //  This runs via setTimeout since IE7 can't remove the script while it is running.
  //
  var SCRIPTS = [];  // stores scripts to be removed after a delay
  var REMOVESCRIPTS = function () {
    for (var i = 0, m = SCRIPTS.length; i < m; i++) {BASE.Ajax.head.removeChild(SCRIPTS[i])}
    SCRIPTS = [];
  };
  
  var PATH = {};
  PATH[BASENAME] = "";  // empty path gets the root URL
  
  BASE.Ajax = {
    loaded: {},         // files already loaded
    loading: {},        // files currently in process of loading
    loadHooks: {},      // hooks to call when files are loaded
    timeout: 15*1000,   // timeout for loading of files (15 seconds)
    styleDelay: 1,      // delay to use before styles are available
    config: {
      root: "",         // URL of root directory to load from
      path: PATH        // paths to named URL's (e.g., [MathJax]/...)
    },

    STATUS: {
      OK: 1,         // file is loading or did load OK
      ERROR: -1      // file timed out during load
    },

    //
    //  Return a complete URL to a file (replacing any root names)
    //
    fileURL: function (file) {
      var match = file.match(/^\[([-._a-z0-9]+)\]/i);
      if (match && match[1] in PATH)
        {file = (PATH[match[1]]||this.config.root) + file.substr(match[1].length+2)}
      return file;
    },
    //
    //  Replace root names if URL includes one
    //
    fileName: function (url) {
      var root = this.config.root;
      if (url.substr(0,root.length) === root) {url = "["+BASENAME+"]"+url.substr(root.length)}
      else {
        for (var id in PATH) {if (PATH.hasOwnProperty(id) && PATH[id]) {
          if (url.substr(0,PATH[id].length) === PATH[id])
            {url = "["+id+"]"+url.substr(PATH[id].length); break}
        }}
      }
      return url;
    },
    //
    //  Cache-breaking revision number for file
    //
    fileRev: function (file) {
      var rev = BASE.cdnFileVersions[name] || BASE.cdnVersion;
      if (rev) {rev = "?rev="+rev}
      return rev;
    },
    urlRev: function (file) {return this.fileURL(file)+this.fileRev(file)},
    
    //
    //  Load a file if it hasn't been already.
    //  Make sure the file URL is "safe"?
    //
    Require: function (file,callback) {
      callback = BASE.Callback(callback); var type;
      if (file instanceof Object) {
        for (var i in file)
          {if (file.hasOwnProperty(i)) {type = i.toUpperCase(); file = file[i]}}
      } else {type = file.split(/\./).pop().toUpperCase()}
      file = this.fileURL(file);
      // FIXME: check that URL is OK
      if (this.loaded[file]) {
        callback(this.loaded[file]);
      } else {
        var FILE = {}; FILE[type] = file;
        this.Load(FILE,callback);
      }
      return callback;
    },

    //
    //  Load a file regardless of where it is and whether it has
    //  already been loaded.
    //
    Load: function (file,callback) {
      callback = BASE.Callback(callback); var type;
      if (file instanceof Object) {
        for (var i in file)
          {if (file.hasOwnProperty(i)) {type = i.toUpperCase(); file = file[i]}}
      } else {type = file.split(/\./).pop().toUpperCase()}
      file = this.fileURL(file);
      if (this.loading[file]) {
        this.addHook(file,callback);
      } else {
        this.head = HEAD(this.head);
        if (this.loader[type]) {this.loader[type].call(this,file,callback)}
          else {throw Error("Can't load files of type "+type)}
      }
      return callback;
    },
    
    //
    //  Register a load hook for a particular file (it will be called when
    //  loadComplete() is called for that file)
    //
    LoadHook: function (file,callback,priority) {
      callback = BASE.Callback(callback);
      if (file instanceof Object)
        {for (var i in file) {if (file.hasOwnProperty(i)) {file = file[i]}}}
      file = this.fileURL(file);
      if (this.loaded[file]) {callback(this.loaded[file])}
        else {this.addHook(file,callback,priority)}
      return callback;
    },
    addHook: function (file,callback,priority) {
      if (!this.loadHooks[file]) {this.loadHooks[file] = MathJax.Callback.Hooks()}
      this.loadHooks[file].Add(callback,priority);
      callback.file = file;
    },
    removeHook: function (hook) {
      if (this.loadHooks[hook.file]) {
        this.loadHooks[hook.file].Remove(hook);
        if (!this.loadHooks[hook.file].hooks.length) {delete this.loadHooks[hook.file]}
      }
    },
    
    //
    //  Used when files are combined in a preloading configuration file
    //
    Preloading: function () {
      for (var i = 0, m = arguments.length; i < m; i++) {
        var file = this.fileURL(arguments[i]);
        if (!this.loading[file] && !this.loaded[file]) {this.loading[file] = {preloaded: true}}
      }
    },
    
    //
    //  Code used to load the various types of files
    //  (JS for JavaScript, CSS for style sheets)
    //
    loader: {
      //
      //  Create a SCRIPT tag to load the file
      //
      JS: function (file,callback) {
        var name = this.fileName(file);
        var timeout = BASE.Callback(["loadTimeout",this,file]);
	this.loading[file] = {
	  callback: callback,
	  timeout: setTimeout(timeout,this.timeout),
	  status: this.STATUS.OK,
	  script: null
	};
	//
	// Add this to the structure above after it is created to prevent recursion
	//  when loading the initial localization file (before loading messsage is available)
	//
	this.loading[file].message = BASE.Message.File(name);
        if (window.System) {
          window.System.import(file).catch(timeout);
        } else {
          timeout();  // indicate a load failure
        }
      },
      //
      //  Create a LINK tag to load the style sheet
      //
      CSS: function (file,callback) {
        var name = this.fileName(file);
        var link = document.createElement("link");
        link.rel = "stylesheet"; link.type = "text/css";
        link.href = file+this.fileRev(name);
        this.loading[file] = {
          callback: callback,
          message: BASE.Message.File(name),
          status: this.STATUS.OK
        };
        this.head.appendChild(link);
        this.timer.create.call(this,[this.timer.file,file],link);
      }
    },
    
    //
    //  Timing code for checking when style sheets are available.
    //
    timer: {
      //
      //  Create the timing callback and start the timing loop.
      //  We use a delay because some browsers need it to allow the styles
      //  to be processed.
      //
      create: function (callback,node) {
        callback = BASE.Callback(callback);
        if (node.nodeName === "STYLE" && node.styleSheet &&
            typeof(node.styleSheet.cssText) !== 'undefined') {
          callback(this.STATUS.OK); // MSIE processes style immediately, but doesn't set its styleSheet!
        } else if (window.chrome && node.nodeName === "LINK") {
          callback(this.STATUS.OK); // Chrome doesn't give access to cssRules for stylesheet in
                                    //   a link node, so we can't detect when it is loaded.
        } else if (isSafari2) {
          this.timer.start(this,[this.timer.checkSafari2,sheets++,callback],this.styleDelay);
        } else {
          this.timer.start(this,[this.timer.checkLength,node,callback],this.styleDelay);
        }
        return callback;
      },
      //
      //  Start the timer for the given callback checker
      //
      start: function (AJAX,check,delay,timeout) {
        check = BASE.Callback(check);
        check.execute = this.execute; check.time = this.time;
        check.STATUS = AJAX.STATUS; check.timeout = timeout || AJAX.timeout;
        check.delay = check.total = delay || 0;
        if (delay) {setTimeout(check,delay)} else {check()}
      },
      //
      //  Increment the time total, increase the delay
      //  and test if we are past the timeout time.
      //  
      time: function (callback) {
        this.total += this.delay;
        this.delay = Math.floor(this.delay * 1.05 + 5);
        if (this.total >= this.timeout) {callback(this.STATUS.ERROR); return 1}
        return 0;
      },
      //
      //  For JS file loads, call the proper routine according to status
      //
      file: function (file,status) {
        if (status < 0) {BASE.Ajax.loadTimeout(file)} else {BASE.Ajax.loadComplete(file)}
      },
      //
      //  Call the hook with the required data
      //
      execute: function () {this.hook.call(this.object,this,this.data[0],this.data[1])},
      //
      //  Safari2 doesn't set the link's stylesheet, so we need to look in the
      //  document.styleSheets array for the new sheet when it is created
      //
      checkSafari2: function (check,length,callback) {
        if (check.time(callback)) return;
        if (document.styleSheets.length > length &&
            document.styleSheets[length].cssRules &&
            document.styleSheets[length].cssRules.length)
          {callback(check.STATUS.OK)} else {setTimeout(check,check.delay)}
      },
      //
      //  Look for the stylesheets rules and check when they are defined
      //  and no longer of length zero.  (This assumes there actually ARE
      //  some rules in the stylesheet.)
      //  
      checkLength: function (check,node,callback) {
        if (check.time(callback)) return;
        var isStyle = 0; var sheet = (node.sheet || node.styleSheet);
        try {if ((sheet.cssRules||sheet.rules||[]).length > 0) {isStyle = 1}} catch(err) {
          if (err.message.match(/protected variable|restricted URI/)) {isStyle = 1}
          else if (err.message.match(/Security error/)) {
            // Firefox3 gives "Security error" for missing files, so
            //   can't distinguish that from OK files on remote servers.
            //   or OK files in different directory from local files.
            isStyle = 1; // just say it is OK (can't really tell)
          }
        }
        if (isStyle) {
          // Opera 9.6 requires this setTimeout
          setTimeout(BASE.Callback([callback,check.STATUS.OK]),0);
        } else {
          setTimeout(check,check.delay);
        }
      }
    },

    //
    //  JavaScript code must call this when they are completely initialized
    //  (this allows them to perform asynchronous actions before indicating
    //  that they are complete).
    //
    loadComplete: function (file) {
      file = this.fileURL(file);
      var loading = this.loading[file];
      if (loading && !loading.preloaded) {
        BASE.Message.Clear(loading.message);
        if (loading.timeout) clearTimeout(loading.timeout);
	if (loading.script) {
	  if (SCRIPTS.length === 0) {setTimeout(REMOVESCRIPTS,0)}
	  SCRIPTS.push(loading.script);
	}
        this.loaded[file] = loading.status; delete this.loading[file];
        this.addHook(file,loading.callback);
      } else {
        if (loading) {delete this.loading[file]}
        this.loaded[file] = this.STATUS.OK;
        loading = {status: this.STATUS.OK}
      }
      if (!this.loadHooks[file]) {return null}
      return this.loadHooks[file].Execute(loading.status);
    },
    
    //
    //  If a file fails to load within the timeout period (or the onerror handler
    //  is called), this routine runs to signal the error condition.
    //  
    loadTimeout: function (file) {
      if (this.loading[file].timeout) {clearTimeout(this.loading[file].timeout)}
      this.loading[file].status = this.STATUS.ERROR;
      this.loadError(file);
      this.loadComplete(file);
    },
    
    //
    //  The default error hook for file load failures
    //
    loadError: function (file) {
      BASE.Message.Set(["LoadFailed","File failed to load: %1",file],null,2000);
      BASE.Hub.signal.Post(["file load error",file]);
    },

    //
    //  Defines a style sheet from a hash of style declarations (key:value pairs
    //  where the key is the style selector and the value is a hash of CSS attributes 
    //  and values).
    //
    Styles: function (styles,callback) {
      var styleString = this.StyleString(styles);
      if (styleString === "") {
        callback = BASE.Callback(callback);
        callback();
      } else {
        var style = document.createElement("style"); style.type = "text/css";
        this.head = HEAD(this.head);
        this.head.appendChild(style);
        if (style.styleSheet && typeof(style.styleSheet.cssText) !== 'undefined') {
          style.styleSheet.cssText = styleString;
        } else {
          style.appendChild(document.createTextNode(styleString));
        }
        callback = this.timer.create.call(this,callback,style);
      }
      return callback;
    },
    
    //
    //  Create a stylesheet string from a style declaration object
    //
    StyleString: function (styles) {
      if (typeof(styles) === 'string') {return styles}
      var string = "", id, style;
      for (id in styles) {if (styles.hasOwnProperty(id)) {
        if (typeof styles[id] === 'string') {
          string += id + " {"+styles[id]+"}\n";
        } else if (styles[id] instanceof Array) {
          for (var i = 0; i < styles[id].length; i++) {
            style = {}; style[id] = styles[id][i];
            string += this.StyleString(style);
          }
        } else if (id.substr(0,6) === '@media') {
          string += id + " {"+this.StyleString(styles[id])+"}\n";
        } else if (styles[id] != null) {
          style = [];
          for (var name in styles[id]) {if (styles[id].hasOwnProperty(name)) {
            if (styles[id][name] != null) 
              {style[style.length] = name + ': ' + styles[id][name]}
          }}
          string += id +" {"+style.join('; ')+"}\n";
        }
      }}
      return string;
    }
  };
  
})("MathJax");

/**********************************************************/

MathJax.HTML = {
  setDocument: function (doc) {document = this.document = doc},
  //
  //  Create an HTML element with given attributes and content.
  //  The def parameter is an (optional) object containing key:value pairs
  //  of the attributes and their values, and contents is an (optional)
  //  array of strings to be inserted as text, or arrays of the form
  //  [type,def,contents] that describes an HTML element to be inserted
  //  into the current element.  Thus the contents can describe a complete
  //  HTML snippet of arbitrary complexity.  E.g.:
  //  
  //    MathJax.HTML.Element("span",{id:"mySpan",style{"font-style":"italic"}},[
  //        "(See the ",["a",{href:"http://www.mathjax.org"},["MathJax home page"]],
  //        " for more details.)"]);
  // 
  Element: function (type,def,contents) {
    var obj = document.createElement(type), id;
    if (def) {
      if (def.hasOwnProperty("style")) {
        var style = def.style; def.style = {};
        for (id in style) {if (style.hasOwnProperty(id))
          {def.style[id.replace(/-([a-z])/g,this.ucMatch)] = style[id]}}
      }
      MathJax.Hub.Insert(obj,def);
      for (id in def) {
        if (id === "role" || id.substr(0,5) === "aria-") obj.setAttribute(id,def[id]);
      }
    }
    if (contents) {
      if (!MathJax.Object.isArray(contents)) {contents = [contents]}
      for (var i = 0, m = contents.length; i < m; i++) {
        if (MathJax.Object.isArray(contents[i])) {
          obj.appendChild(this.Element(contents[i][0],contents[i][1],contents[i][2]));
        } else if (type === "script") { // IE throws an error if script is added as a text node
          this.setScript(obj, contents[i]);
        } else {
          obj.appendChild(document.createTextNode(contents[i]));
        }
      }
    }
    return obj;
  },
  ucMatch: function (match,c) {return c.toUpperCase()},
  addElement: function (span,type,def,contents) {return span.appendChild(this.Element(type,def,contents))},
  TextNode: function (text) {return document.createTextNode(text)},
  addText: function (span,text) {return span.appendChild(this.TextNode(text))},

  //
  //  Set and get the text of a script
  //
  setScript: function (script,text) {
    if (this.setScriptBug) {script.text = text} else {
      while (script.firstChild) {script.removeChild(script.firstChild)}
      this.addText(script,text);
    }
  },
  getScript: function (script) {return script.innerText}
}

/**********************************************************/

MathJax.Localization = {
  
  locale: "en",
  directory: "[MathJax]/localization",
  strings: {
    // Currently, this list is not modified by the MathJax-i18n script. You can
    // run the following command in MathJax/unpacked/localization to update it:
    //
    // find . -name "*.js" | xargs grep menuTitle\: | grep -v qqq | sed 's/^\.\/\(.*\)\/.*\.js\:  /    "\1"\: \{/' | sed 's/,$/\},/' | sed 's/"English"/"English", isLoaded: true/' > tmp ; sort tmp > tmp2 ; sed '$ s/,$//' tmp2 ; rm tmp*
    //
    // This only takes languages with localization data so you must also add
    // the languages that use a remap but are not translated at all.
    //
    "ast": {menuTitle: "asturianu"},
    "bg": {menuTitle: "\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438"},
    "bcc": {menuTitle: "\u0628\u0644\u0648\u0686\u06CC"},
    "br": {menuTitle: "brezhoneg"},
    "ca": {menuTitle: "catal\u00E0"},
    "cdo": {menuTitle: "M\u00ECng-d\u0115\u0324ng-ng\u1E73\u0304"},
    "cs": {menuTitle: "\u010De\u0161tina"},
    "da": {menuTitle: "dansk"},
    "de": {menuTitle: "Deutsch"},
    "en": {menuTitle: "English", isLoaded: true},
    "eo": {menuTitle: "Esperanto"},
    "es": {menuTitle: "espa\u00F1ol"},
    "fa": {menuTitle: "\u0641\u0627\u0631\u0633\u06CC"},
    "fi": {menuTitle: "suomi"},
    "fr": {menuTitle: "fran\u00E7ais"},
    "gl": {menuTitle: "galego"},
    "he": {menuTitle: "\u05E2\u05D1\u05E8\u05D9\u05EA"},
    "ia": {menuTitle: "interlingua"},
    "it": {menuTitle: "italiano"},
    "ja": {menuTitle: "\u65E5\u672C\u8A9E"},
    "kn": {menuTitle: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1"},
    "ko": {menuTitle: "\uD55C\uAD6D\uC5B4"},
    "lb": {menuTitle: "L\u00EBtzebuergesch"},
    "lt": {menuTitle: "lietuvi\u0173"},
    "mk": {menuTitle: "\u043C\u0430\u043A\u0435\u0434\u043E\u043D\u0441\u043A\u0438"},
    "nl": {menuTitle: "Nederlands"},
    "oc": {menuTitle: "occitan"},
    "pl": {menuTitle: "polski"},
    "pt": {menuTitle: "portugus\u00EA"},
    "pt-br": {menuTitle: "portugu\u00EAs do Brasil"},
    "ru": {menuTitle: "\u0440\u0443\u0441\u0441\u043A\u0438\u0439"},
    "sco": {menuTitle: "Scots"},
    "scn": {menuTitle: "sicilianu"},
    "sl": {menuTitle: "sloven\u0161\u010Dina"},
    "sv": {menuTitle: "svenska"},
    "tr": {menuTitle: "T\u00FCrk\u00E7e"},
    "uk": {menuTitle: "\u0443\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430"},
    "vi": {menuTitle: "Ti\u1EBFng Vi\u1EC7t"},
    "zh-hans": {menuTitle: "\u4E2D\u6587\uFF08\u7B80\u4F53\uFF09"}
  },

  //
  //  The pattern for substitution escapes:
  //      %n or %{n} or %{plural:%n|option1|option1|...} or %c
  //
  pattern: /%(\d+|\{\d+\}|\{[a-z]+:\%\d+(?:\|(?:%\{\d+\}|%.|[^\}])*)+\}|.)/g,

  SPLIT: ("axb".split(/(x)/).length === 3 ?
    function (string,regex) {return string.split(regex)} :
    //
    //  IE8 and below don't do split() correctly when the pattern includes
    //    parentheses (the split should include the matched exrepssions).
    //    So implement it by hand here.
    // 
    function (string,regex) {
      var result = [], match, last = 0;
      regex.lastIndex = 0;
      while ((match = regex.exec(string))) {
        result.push(string.substr(last,match.index-last));
        result.push.apply(result,match.slice(1));
        last = match.index + match[0].length;
      }
      result.push(string.substr(last));
      return result;
    }),
  
  _: function (id,phrase) {
    if (phrase instanceof Array) {return this.processSnippet(id,phrase)}
    return this.processString(this.lookupPhrase(id,phrase),[].slice.call(arguments,2));
  },
  
  processString: function (string,args,domain) {
    //
    //  Process arguments for substitution
    //    If the argument is a snippet (and we are processing snippets) do so,
    //    Otherwise, if it is a number, convert it for the lacale
    //
    var i, m;
    for (i = 0, m = args.length; i < m; i++) {
      if (domain && args[i] instanceof Array) {args[i] = this.processSnippet(domain,args[i])}
    }
    //
    //  Split string at escapes and process them individually
    //
    var parts = this.SPLIT(string,this.pattern);
    for (i = 1, m = parts.length; i < m; i += 2) {
      var c = parts[i].charAt(0);  // first char will be { or \d or a char to be kept literally
      if (c >= "0" && c <= "9") {    // %n
        parts[i] = args[parts[i]-1];
        if (typeof parts[i] === "number") parts[i] = this.number(parts[i]);
      } else if (c === "{") {        // %{n} or %{plural:%n|...}
        c = parts[i].substr(1);
        if (c >= "0" && c <= "9") {  // %{n}
          parts[i] = args[parts[i].substr(1,parts[i].length-2)-1];
          if (typeof parts[i] === "number") parts[i] = this.number(parts[i]);
        } else {                     // %{plural:%n|...}
          var match = parts[i].match(/^\{([a-z]+):%(\d+)\|(.*)\}$/);
          if (match) {
            if (match[1] === "plural") {
              var n = args[match[2]-1];
              if (typeof n === "undefined") {
                parts[i] = "???";        // argument doesn't exist
              } else {
                n = this.plural(n) - 1;  // index of the form to use
                var plurals = match[3].replace(/(^|[^%])(%%)*%\|/g,"$1$2%\uEFEF").split(/\|/); // the parts (replacing %| with a special character)
                if (n >= 0 && n < plurals.length) {
                  parts[i] = this.processString(plurals[n].replace(/\uEFEF/g,"|"),args,domain);
                } else {
                  parts[i] = "???";      // no string for this index
                }
              }
            } else {parts[i] = "%"+parts[i]}  // not "plural", put back the % and leave unchanged
          }
        }
      }
      if (parts[i] == null) {parts[i] = "???"}
    }
    //
    //  If we are not forming a snippet, return the completed string
    //  
    if (!domain) {return parts.join("")}
    //
    //  We need to return an HTML snippet, so buld it from the
    //  broken up string with inserted parts (that could be snippets)
    //
    var snippet = [], part = "";
    for (i = 0; i < m; i++) {
      part += parts[i]; i++;  // add the string and move on to substitution result
      if (i < m) {
        if (parts[i] instanceof Array)  {        // substitution was a snippet
          snippet.push(part);                        // add the accumulated string
          snippet = snippet.concat(parts[i]);        // concatenate the substution snippet
          part = "";                                 // start accumulating a new string
        } else {                                 // substitution was a string
          part += parts[i];                          // add to accumulating string
        }
      }
    }
    if (part !== "") {snippet.push(part)} // add final string
    return snippet;
  },
  
  processSnippet: function (domain,snippet) {
    var result = [];   // the new snippet
    //
    //  Look through the original snippet for
    //   strings or snippets to translate
    //
    for (var i = 0, m = snippet.length; i < m; i++) {
      if (snippet[i] instanceof Array) {
        //
        //  This could be a sub-snippet:
        //    ["tag"] or ["tag",{properties}] or ["tag",{properties},snippet]
        //  Or it could be something to translate:
        //    [id,string,args] or [domain,snippet]
        var data = snippet[i];
        if (typeof data[1] === "string") {        // [id,string,args]
          var id = data[0]; if (!(id instanceof Array)) {id = [domain,id]}
          var phrase = this.lookupPhrase(id,data[1]);
          result = result.concat(this.processMarkdown(phrase,data.slice(2),domain));
        } else if (data[1] instanceof Array) {    // [domain,snippet]
          result = result.concat(this.processSnippet.apply(this,data));
        } else if (data.length >= 3) {            // ["tag",{properties},snippet]
          result.push([data[0],data[1],this.processSnippet(domain,data[2])]);
        } else {                                  // ["tag"] or ["tag",{properties}]
          result.push(snippet[i]);
        }
      } else {                                    // a string
        result.push(snippet[i]);
      }
    }
    return result;
  },
  
  markdownPattern: /(%.)|(\*{1,3})((?:%.|.)+?)\2|(`+)((?:%.|.)+?)\4|\[((?:%.|.)+?)\]\(([^\s\)]+)\)/,
  //   %c or *bold*, **italics**, ***bold-italics***, or `code`, or [link](url)
   
  processMarkdown: function (phrase,args,domain) {
    var result = [], data;
    //
    //  Split the string by the Markdown pattern
    //    (the text blocks are separated by 
    //      c,stars,star-text,backtics,code-text,link-text,URL).
    //  Start with teh first text string from the split.
    //
    var parts = phrase.split(this.markdownPattern);
    var string = parts[0];
    //
    //  Loop through the matches and process them
    //
    for (var i = 1, m = parts.length; i < m; i += 8) {
      if (parts[i+1]) {        // stars (for bold/italic)
        //
        //  Select the tag to use by number of stars (three stars requires two tags)
        //
        data = this.processString(parts[i+2],args,domain);
        if (!(data instanceof Array)) {data = [data]}
        data = [["b","i","i"][parts[i+1].length-1],{},data]; // number of stars determines type
        if (parts[i+1].length === 3) {data = ["b",{},data]}  // bold-italic
      } else if (parts[i+3]) { //  backtics (for code)
        //
        //  Remove one leading or trailing space, and process substitutions
        //  Make a <code> tag
        //
        data = this.processString(parts[i+4].replace(/^\s/,"").replace(/\s$/,""),args,domain);
        if (!(data instanceof Array)) {data = [data]}
        data = ["code",{},data];
      } else if (parts[i+5]) { //  hyperlink
        //
        //  Process the link text, and make an <a> tag with the URL
        //
        data = this.processString(parts[i+5],args,domain);
        if (!(data instanceof Array)) {data = [data]}
        data = ["a",{href:this.processString(parts[i+6],args),target:"_blank"},data];
      } else {
        //
        //  Escaped character (%c) gets added into the string.
        //
        string += parts[i]; data = null;
      }
      //
      //  If there is a tag to insert,
      //     Add any pending string, then push the tag
      //
      if (data) {
        result = this.concatString(result,string,args,domain);
        result.push(data); string = "";
      }
      //
      //  Process the string that follows matches pattern
      //
      if (parts[i+7] !== "") {string += parts[i+7]}
    };
    //
    //  Add any pending string and return the resulting snippet
    //
    result = this.concatString(result,string,args,domain);
    return result;
  },
  concatString: function (result,string,args,domain) {
    if (string != "") {
      //
      //  Process the substutions.
      //  If the result is not a snippet, turn it into one.
      //  Then concatenate the snippet to the current one
      //
      string = this.processString(string,args,domain);
      if (!(string instanceof Array)) {string = [string]}
      result = result.concat(string);
    }
    return result;
  },

  lookupPhrase: function (id,phrase,domain) {
    //
    //  Get the domain and messageID
    //
    if (!domain) {domain = "_"}
    if (id instanceof Array) {domain = (id[0] || "_"); id = (id[1] || "")}
    //
    //  Check if the data is available and if not,
    //    load it and throw a restart error so the calling
    //    code can wait for the load and try again.
    //
    var load = this.loadDomain(domain);
    if (load) {MathJax.Hub.RestartAfter(load)}
    //
    //  Look up the message in the localization data
    //    (if not found, the original English is used)
    //
    var localeData = this.strings[this.locale];
    if (localeData) {
      if (localeData.domains && domain in localeData.domains) {
        var domainData = localeData.domains[domain];
        if (domainData.strings && id in domainData.strings)
          {phrase = domainData.strings[id]}
      }
    }
    //
    //  return the translated phrase
    //
    return phrase;
  },
  
  //
  //  Load a langauge data file from the proper
  //  directory and file.
  //
  loadFile: function (file,data,callback) {
    callback = MathJax.Callback(callback);
    file = (data.file || file);  // the data's file name or the default name
    if (!file.match(/\.js$/)) {file += ".js"} // add .js if needed
    //
    //  Add the directory if the file doesn't
    //  contain a full URL already.
    //
    if (!file.match(/^([a-z]+:|\[MathJax\])/)) {
      var dir = (this.strings[this.locale].directory  || 
                 this.directory + "/" + this.locale ||
                 "[MathJax]/localization/" + this.locale);
      file = dir + "/" + file;
    }
    //
    //  Load the file and mark the data as loaded (even if it
    //  failed to load, so we don't continue to try to load it
    //  over and over).
    //
    var load = MathJax.Ajax.Require(file,function () {data.isLoaded = true; return callback()});
    //
    //  Return the callback if needed, otherwise null.
    //
    return (load.called ? null : load);
  },
  
  //
  //  Check to see if the localization data are loaded
  //  for the given domain; if not, load the data file,
  //  and return a callback for the loading operation.
  //  Otherwise return null (data are loaded).
  //  
  loadDomain: function (domain,callback) {
    var load, localeData = this.strings[this.locale];
    if (localeData) {
      if (!localeData.isLoaded) {
        load = this.loadFile(this.locale,localeData);
        if (load) {
          return MathJax.Callback.Queue(
            load,["loadDomain",this,domain] // call again to load domain
          ).Push(callback||{});
        }
      }
      if (localeData.domains && domain in localeData.domains) {
        var domainData = localeData.domains[domain];
        if (!domainData.isLoaded) {
          load = this.loadFile(domain,domainData);
          if (load) {return MathJax.Callback.Queue(load).Push(callback)}
        }
      }
    } 
    // localization data are loaded, so just do the callback
    return MathJax.Callback(callback)();
  },

  //
  //  Perform a function, properly handling
  //  restarts due to localization file loads.
  //
  //  Note that this may return before the function
  //  has been called successfully, so you should
  //  consider fn as running asynchronously.  (Callbacks
  //  can be used to synchronize it with other actions.)
  //
  Try: function (fn) {
    fn = MathJax.Callback(fn); fn.autoReset = true;
    try {fn()} catch (err) {
      if (!err.restart) {throw err}
      MathJax.Callback.After(["Try",this,fn],err.restart);
    }
  },

  //
  //  Reset the current language
  //
  resetLocale: function(locale) {
    // Selection algorithm:
    // 1) Downcase locale name (e.g. "en-US" => "en-us")
    // 2) Try a parent language (e.g. "en-us" => "en")
    // 3) Try the fallback specified in the data (e.g. "pt" => "pt-br")
    // 4) Otherwise don't change the locale.
    if (!locale) return;
    locale = locale.toLowerCase();
    while (!this.strings[locale]) {
      var dashPos = locale.lastIndexOf("-");
      if (dashPos === -1) return;
      locale = locale.substring(0, dashPos);
    }
    var remap = this.strings[locale].remap;
    this.locale = remap ? remap : locale;
  },

  //
  //  Set the current language
  //
  setLocale: function(locale) {
    this.resetLocale(locale);
    if (MathJax.Menu) {this.loadDomain("MathMenu")}
  },

  //
  //  Add or update a language or domain
  //
  addTranslation: function (locale,domain,definition) {
    var data = this.strings[locale], isNew = false;
    if (!data) {data = this.strings[locale] = {}; isNew = true}
    if (!data.domains) {data.domains = {}}
    if (domain) {
      if (!data.domains[domain]) {data.domains[domain] = {}}
      data = data.domains[domain];
    }
    MathJax.Hub.Insert(data,definition);
    if (isNew && MathJax.Menu.menu) {MathJax.Menu.CreateLocaleMenu()}
  },
  
  //
  //  Set CSS for an element based on font requirements
  //
  setCSS: function (div) {
    var locale = this.strings[this.locale];
    if (locale) {
      if (locale.fontFamily) {div.style.fontFamily = locale.fontFamily}
      if (locale.fontDirection) {
        div.style.direction = locale.fontDirection;
        if (locale.fontDirection === "rtl") {div.style.textAlign = "right"}
      }
    }
    return div;
  },
  
  //
  //  Get the language's font family or direction
  //
  fontFamily: function () {
    var locale = this.strings[this.locale];
    return (locale ? locale.fontFamily : null);
  },
  fontDirection: function () {
    var locale = this.strings[this.locale];
    return (locale ? locale.fontDirection : null);
  },

  //
  //  Get the language's plural index for a number
  //
  plural: function (n) {
    var locale = this.strings[this.locale];
    if (locale && locale.plural) {return locale.plural(n)}
    // default
    if (n == 1) {return 1} // one
    return 2; // other
  },

  //
  //  Convert a number to language-specific form
  //
  number: function(n) {
    var locale = this.strings[this.locale];
    if (locale && locale.number) {return locale.number(n)}
    // default
    return n;
  }
};


/**********************************************************/

MathJax.Message = {
  localize: function (message) {
    return MathJax.Localization._(message,message);
  },
  
  filterText: function (text,n,id) {
    if (MathJax.Hub.config.messageStyle === "simple") {
      if (id === "LoadFile") {
        if (!this.loading) {this.loading = this.localize("Loading") + " "}
        text = this.loading; this.loading += ".";
      } else if (id === "ProcessMath") {
        if (!this.processing) {this.processing = this.localize("Processing") + " "}
        text = this.processing; this.processing += ".";
      } else if (id === "TypesetMath") {
        if (!this.typesetting) {this.typesetting = this.localize("Typesetting") + " "}
        text = this.typesetting; this.typesetting += ".";
      }
    }
    return text;
  },
  
  Set: function (text,n,clearDelay) {
    if (MathJax.debug) {
      if (Array.isArray(text)) {
        text = MathJax.Localization._.apply(MathJax.Localization,text);
      }
      console.log("Message: "+text);
    }
  },

  Clear: function (n,delay) {},
  Remove: function () {},
  File: function (file) {
    return this.Set(["LoadFile","Loading %1",file],null,null);
  },
  
  Log: function () {}
};

/**********************************************************/

MathJax.Hub = {
  config: {
    root: "./mathjax2/legacy",
    config: [],      // list of configuration files to load
    jax: [],         // list of input and output jax to load
    extensions: [],  // list of extensions to load
    preJax: null,    // pattern to remove from before math script tag
    postJax: null,   // pattern to remove from after math script tag
    displayAlign: 'center',       // how to align displayed equations (left, center, right)
    displayIndent: '0',           // indentation for displayed equations (when not centered)
    preRemoveClass: 'MathJax_Preview', // class of objects to remove preceeding math script
    showProcessingMessages: true, // display "Processing math: nn%" messages or not
    messageStyle: "normal",       // set to "none" or "simple" (for "Loading..." and "Processing...")
    delayStartupUntil: "none",    // set to "onload" to delay setup until the onload handler runs
                                  // set to "configured" to delay startup until MathJax.Hub.Configured() is called
                                  // set to a Callback to wait for before continuing with the startup
    skipStartupTypeset: false,    // set to true to skip PreProcess and Process during startup
    elements: [],             // array of elements to process when none is given explicitly
    positionToHash: true,    // after initial typeset pass, position to #hash location?
     
    showMathMenu: true,      // attach math context menu to typeset math?
    showMathMenuMSIE: true,  // separtely determine if MSIE should have math menu
                             //  (since the code for that is a bit delicate)
    
    menuSettings: {
      zoom: "None",        //  when to do MathZoom
      CTRL: false,         //    require CTRL for MathZoom?
      ALT: false,          //    require Alt or Option?
      CMD: false,          //    require CMD?
      Shift: false,        //    require Shift?
      discoverable: false, //  make math menu discoverable on hover?
      zscale: "200%",      //  the scaling factor for MathZoom
      renderer: null,      //  set when Jax are loaded
      font: "Auto",        //  what font HTML-CSS should use
      context: "MathJax",  //  or "Browser" for pass-through to browser menu
      locale: null,        //  the language to use for messages
      mpContext: false,    //  true means pass menu events to MathPlayer in IE
      mpMouse: false,      //  true means pass mouse events to MathPlayer in IE
      texHints: true,      //  include class names for TeXAtom elements
      FastPreview: null,   //  use PreviewHTML output as preview?
      assistiveMML: null,  //  include hidden MathML for screen readers?
      inTabOrder: true,    //  set to false if math elements should be included in the tabindex
      semantics: false     //  add semantics tag with original form in MathML output
    },
    
    errorSettings: {
       // localized HTML snippet structure for message to use
      message: ["[",["MathProcessingError","Math Processing Error"],"]"],
      style: {color: "#CC0000", "font-style":"italic"}  // style for message
    },
    
    ignoreMMLattributes: {}  // attributes not to copy to HTML-CSS or SVG output
                             //   from MathML input (in addition to the ones in MML.nocopyAttributes).
                             //   An id set to true will be ignored, one set to false will
                             //   be allowed (even if other criteria normally would prevent
                             //   it from being copied); use false carefully!
  },
  
  preProcessors: MathJax.Callback.Hooks(true), // list of callbacks for preprocessing (initialized by extensions)
  inputJax: {},          // mime-type mapped to input jax (by registration)
  outputJax: {order:{}}, // mime-type mapped to output jax list (by registration)

  processSectionDelay: 50, // pause between input and output phases of processing
  processUpdateTime: 250, // time between screen updates when processing math (milliseconds)
  processUpdateDelay: 10, // pause between screen updates to allow other processing (milliseconds)

  signal: MathJax.Callback.Signal("Hub"), // Signal used for Hub events

  Config: function (def) {
    this.Insert(this.config,def);
    if (this.config.Augment) {this.Augment(this.config.Augment)}
  },
  CombineConfig: function (name,def) {
    var config = this.config, id, parent; name = name.split(/\./);
    for (var i = 0, m = name.length; i < m; i++) {
      id = name[i]; if (!config[id]) {config[id] = {}}
      parent = config; config = config[id];
    }
    parent[id] = config = this.Insert(def,config);
    return config;
  },
  
  Register: {
    PreProcessor: function () {return MathJax.Hub.preProcessors.Add.apply(MathJax.Hub.preProcessors,arguments)},
    MessageHook: function () {return MathJax.Hub.signal.MessageHook.apply(MathJax.Hub.signal,arguments)},
    StartupHook: function () {return MathJax.Hub.Startup.signal.MessageHook.apply(MathJax.Hub.Startup.signal,arguments)},
    LoadHook: function () {return MathJax.Ajax.LoadHook.apply(MathJax.Ajax,arguments)}
  },
  UnRegister: {
    PreProcessor: function (hook) {MathJax.Hub.preProcessors.Remove(hook)},
    MessageHook: function (hook) {MathJax.Hub.signal.RemoveHook(hook)},
    StartupHook: function (hook) {MathJax.Hub.Startup.signal.RemoveHook(hook)},
    LoadHook: function (hook) {MathJax.Ajax.removeHook(hook)}
  },
  
  setRenderer: function (renderer,type) {
    if (!renderer) return;
    if (!MathJax.OutputJax[renderer]) {
      this.config.menuSettings.renderer = "";
      var file = "[MathJax]/jax/output/"+renderer+"/config.js";
      return MathJax.Ajax.Require(file,["setRenderer",this,renderer,type]);
    } else {
      this.config.menuSettings.renderer = renderer;
      if (type == null) {type = "jax/mml"}
      var jax = this.outputJax;
      if (jax[type] && jax[type].length) {
        if (renderer !== jax[type][0].id) {
          jax[type].unshift(MathJax.OutputJax[renderer]);
          return this.signal.Post(["Renderer Selected",renderer]);
        }
      }
      return null;
    }
  },

  Queue: function () {
    return this.queue.Push.apply(this.queue,arguments);
  },
  
  RestartAfter: function (callback) {
    throw this.Insert(Error("restart"),{restart: MathJax.Callback(callback)});
  },
  
  Insert: function (dst,src) {
    for (var id in src) {if (src.hasOwnProperty(id)) {
      // allow for concatenation of arrays?
      if (typeof src[id] === 'object' && !(src[id] instanceof Array) &&
         (typeof dst[id] === 'object' || typeof dst[id] === 'function')) {
        this.Insert(dst[id],src[id]);
      } else {
        dst[id] = src[id];
      }
    }}
    return dst;
  },

  // Old browsers (e.g. Internet Explorer <= 8) do not support trim().
  SplitList: ("trim" in String.prototype ?
              function (list) {return list.trim().split(/\s+/)} :
              function (list) {return list.replace(/^\s+/,'').
                                           replace(/\s+$/,'').split(/\s+/)})
};

//
//  Storage area for extensions and preprocessors
//
MathJax.Extension = {};

MathJax.Hub.Startup = {
  queue:   MathJax.Callback.Queue(),           // Queue used for startup actions
  signal:  MathJax.Callback.Signal("Startup")  // Signal used for startup events
};

MathJax.Ajax.config.root = MathJax.Hub.config.root;

/**********************************************************/

(function (BASENAME) {
  var BASE = window[BASENAME], ROOT = "["+BASENAME+"]";
  var HUB = BASE.Hub, AJAX = BASE.Ajax, CALLBACK = BASE.Callback;

  var JAX = MathJax.Object.Subclass({
    JAXFILE: "jax.js",
    require: null, // array of files to load before jax.js is complete
    config: {},
    //
    //  Make a subclass and return an instance of it.
    //  (FIXME: should we replace config with a copy of the constructor's
    //   config?  Otherwise all subclasses share the same config structure.)
    //
    Init: function (def,cdef) {
      if (arguments.length === 0) {return this}
      return (this.constructor.Subclass(def,cdef))();
    },
    //
    //  Augment by merging with class definition (not replacing)
    //
    Augment: function (def,cdef) {
      var cObject = this.constructor, ndef = {};
      if (def != null) {
        for (var id in def) {if (def.hasOwnProperty(id)) {
          if (typeof def[id] === "function")
            {cObject.protoFunction(id,def[id])} else {ndef[id] = def[id]}
        }}
        // MSIE doesn't list toString even if it is not native so handle it separately
        if (def.toString !== cObject.prototype.toString && def.toString !== {}.toString)
          {cObject.protoFunction('toString',def.toString)}
      }
      HUB.Insert(cObject.prototype,ndef);
      cObject.Augment(null,cdef);
      return this;
    },
    Translate: function (script,state) {
      throw Error(this.directory+"/"+this.JAXFILE+" failed to define the Translate() method");
    },
    Register: function (mimetype) {},
    Config: function () {
      this.config = HUB.CombineConfig(this.id,this.config);
      if (this.config.Augment) {this.Augment(this.config.Augment)}
    },
    Startup: function () {},
    loadComplete: function (file) {
      if (file === "config.js") {
        return AJAX.loadComplete(this.directory+"/"+file);
      } else {
        var queue = CALLBACK.Queue();
        queue.Push(
          ["Post",HUB.Startup.signal,this.id+" Jax Config"],
          ["Config",this],
          ["Post",HUB.Startup.signal,this.id+" Jax Startup"],
          ["Startup",this],
          ["Post",HUB.Startup.signal,this.id+" Jax Ready"]
        );
        if (this.copyTranslate) {
          queue.Push(
            [function (THIS) {
              THIS.preProcess  = THIS.preTranslate;
              THIS.Process     = THIS.Translate;
              THIS.postProcess = THIS.postTranslate;
            },this.constructor.prototype]
          );
        }
        return queue.Push(["loadComplete",AJAX,this.directory+"/"+file]);
      }
    }
  },{
    id: "Jax",
    version: "2.6.0",
    directory: ROOT+"/jax",
    extensionDir: ROOT+"/extensions"
  });

  /***********************************/

  BASE.InputJax = JAX.Subclass({
    elementJax: "mml",  // the element jax to load for this input jax
    sourceMenuTitle: /*_(MathMenu)*/ ["Original","Original Form"],
    copyTranslate: true,
    Process: function (script,state) {
      throw Error("Input jax failed to load properly")
    },
    needsUpdate: function (jax) {
      var script = jax.SourceElement();
      return (jax.originalText !== BASE.HTML.getScript(script));
    },
    Register: function (mimetype) {
      if (!HUB.inputJax) {HUB.inputJax = {}}
      HUB.inputJax[mimetype] = this;
    }
  },{
    id: "InputJax",
    version: "2.6.0",
    directory: JAX.directory+"/input",
    extensionDir: JAX.extensionDir
  });

  /***********************************/

  BASE.OutputJax = JAX.Subclass({
    copyTranslate: true,
    preProcess: function (state) {
      throw Error("Output jax failed to load properly");
    },
    Register: function (mimetype) {
      var jax = HUB.outputJax;
      if (!jax[mimetype]) {jax[mimetype] = []}
      //  If the output jax is earlier in the original configuration list, put it first here
      if (jax[mimetype].length && (this.id === HUB.config.menuSettings.renderer ||
            (jax.order[this.id]||0) < (jax.order[jax[mimetype][0].id]||0)))
        {jax[mimetype].unshift(this)} else {jax[mimetype].push(this)}
    },
    Remove: function (jax) {}
  },{
    id: "OutputJax",
    version: "2.6.0",
    directory: JAX.directory+"/output",
    extensionDir: JAX.extensionDir,
    fontDir: ROOT+(BASE.isPacked?"":"/..")+"/fonts",
    imageDir: ROOT+(BASE.isPacked?"":"/..")+"/images"
  });
  
  /***********************************/

  BASE.ElementJax = JAX.Subclass({
    // make a subclass, not an instance
    Init: function (def,cdef) {return this.constructor.Subclass(def,cdef)},
    
    inputJax: null,
    outputJax: null,
    inputID: null,
    originalText: "",
    mimeType: "",
    sourceMenuTitle: /*_(MathMenu)*/ ["MathMLcode","MathML Code"],
    
    Text: function (text,callback) {
      var script = this.SourceElement();
      BASE.HTML.setScript(script,text);
      script.MathJax.state = this.STATE.UPDATE;
      return HUB.Update(script,callback);
    },
    Reprocess: function (callback) {
      var script = this.SourceElement();
      script.MathJax.state = this.STATE.UPDATE;
      return HUB.Reprocess(script,callback);
    },
    Update: function (callback) {return this.Rerender(callback)},
    Rerender: function (callback) {
      var script = this.SourceElement();
      script.MathJax.state = this.STATE.OUTPUT;
      return HUB.Process(script,callback);
    },
    Remove: function (keep) {
      if (this.hover) {this.hover.clear(this)}
      BASE.OutputJax[this.outputJax].Remove(this);
      if (!keep) {
        HUB.signal.Post(["Remove Math",this.inputID]); // wait for this to finish?
        this.Detach();
      }
    },
    needsUpdate: function () {
      return BASE.InputJax[this.inputJax].needsUpdate(this);
    },

    SourceElement: function () {return document.getElementById(this.inputID)},
    
    Attach: function (script,inputJax) {
      var jax = script.MathJax.elementJax;
      if (script.MathJax.state === this.STATE.UPDATE) {
        jax.Clone(this);
      } else {
        jax = script.MathJax.elementJax = this;
        if (script.id) {this.inputID = script.id}
          else {script.id = this.inputID = BASE.ElementJax.GetID(); this.newID = 1}
      }
      jax.originalText = BASE.HTML.getScript(script);
      jax.inputJax = inputJax;
      if (jax.root) {jax.root.inputID = jax.inputID}
      return jax;
    },
    Detach: function () {
      var script = this.SourceElement(); if (!script) return;
      try {delete script.MathJax} catch(err) {script.MathJax = null}
      if (this.newID) {script.id = ""}
    },
    Clone: function (jax) {
      var id;
      for (id in this) {
        if (!this.hasOwnProperty(id)) continue;
        if (typeof(jax[id]) === 'undefined' && id !== 'newID') {delete this[id]}
      }
      for (id in jax) {
        if (!jax.hasOwnProperty(id)) continue;
        if (typeof(this[id]) === 'undefined' || (this[id] !== jax[id] && id !== 'inputID'))
          {this[id] = jax[id]}
      }
    }
  },{
    id: "ElementJax",
    version: "2.6.0",
    directory: JAX.directory+"/element",
    extensionDir: JAX.extensionDir,
    ID: 0,  // jax counter (for IDs)
    STATE: {
      PENDING: 1,      // script is identified as math but not yet processed
      PROCESSED: 2,    // script has been processed
      UPDATE: 3,       // elementJax should be updated
      OUTPUT: 4        // output should be updated (input is OK)
    },
    
    GetID: function () {this.ID++; return "MathJax-Element-"+this.ID},
    Subclass: function () {
      var obj = JAX.Subclass.apply(this,arguments);
      obj.loadComplete = this.prototype.loadComplete;
      return obj;
    }
  });
  BASE.ElementJax.prototype.STATE = BASE.ElementJax.STATE;
  
})("MathJax");

MathJax.Hub.Browser = {Select: function () {}};
