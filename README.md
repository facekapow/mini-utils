# mini-utils [![npm](https://img.shields.io/npm/v/mini-utils.svg)](https://www.npmjs.com/package/mini-utils) [![Bower](https://img.shields.io/bower/v/mini-util.svg)](http://bower.io/search/?q=mini-util)
A mini script of utilities for Node and the Browser.<br>
This DOES extend the prototype of some things.<br>
2.8kb minified and gzipped.

## Install
### Node:
```bash
npm install mini-utils
```

### Bower:
```bash
bower install mini-util
```

## Usage
### Node:
```js
var __ = require('mini-utils'); // Double underscore
```

### Bower:
Add this to your HTML `<head>`:
```html
<script src="/path/to/your/bower_components/mini-util/mini-utils.min.js"></script>
```
If you want to use the script in a WebWorker, in the WebWorker you must:
```js
importScripts('/path/to/your/bower_components/mini-util/mini-utils.min.js');
```
Use the `__` variable to access mini-utils. Example:
```js
__.isNode(); // Again, double underscore
```

## List of utilities:

### Cross-environment Utils:
  * isNode() - Boolean - Is the script running in Node?
  * isBrowser() - Boolean - Is the script running in a browser?
  * isWebWorker() - Boolean - Is the script running in a WebWorker?
  * isElectron() - Boolean - Is the script running in Electron?
  * inherits(Class, Class) - undefined - Minimal implementation of Node's `inherits`. The first parameter is the class that inherits, and the second parameter is the superclass.
  * guid() - String - Generate a GUID (well, a pseudo-GUID).
  * EventEmitter() - Class - Minimal implementation of Node's `EventEmitter`. Full Node API is supported (including deprecated functions) (Node API link: https://nodejs.org/api/events.html).
  * nextTick(Function) - Unknown - A little nextTick shim (return depends on what method is used to achieve the shim).
  * clone(Object) - Object - Creates a clone of an object and returns it.

### Node-Only Utils (inlcudes Electron):
  * homeDir() - String - Returns the user's home directory path.

### WebWorker & Browser Utils (includes Electron):
  * import(String, Function) - undefined - Requests a script from the url given in the first option, and executes the code and calls the function in the second option (which should accept an error parameter and a parameter containing the exports from the requested script).
  * importSync(String) - Object - Synchronous version of `import`. Returns the script's exports. WARNING: Uses synchronous version of XMLHttpRequest, which *may* hang the browser, **strongly advised to use the async version above**!
  * easyRequest(String[, Function]) - undefined/data - Performs a GET XMLHttpRequest with the url from the first parameter. If given a callback function, this performs the XMLHttpRequest asynchronously and passes the data to the callback (callback should accept first option as an error, second option as data). If not given a callback, this performs the XMLHttpRequest synchronously and returns the data. **Advised to use the async version**!
  * easyPost(String[, data[, Function]]) - undefined/data - Exactly like the easyRequest function above, except performs a POST request and sends the data in the second parameter. Again, **advised to use the async version**!

### WebWorker-Only Utils:
  * PROTO-EXTENSION - self Extensions:
    * emit(String/data[, ...data]) - Boolean - If the first parameter is not a string, it acts like `postMessage`. Otherwise, it emits the event specified in the first parameter, and optionally passes the rest of the arguments as extra data. Returns true if the event has listeners, false otherwise.
    * on(String, Function) - this - Can act like `onmessage` when given 'message' as the event. When the event specified in the first parameter is fired, the callback in the second parameter is called.
    * once(String, Function) - this - Can act like `onmessage` when given 'message' as the event (except only fires once). When the event specified in the first parameter is fired, the callback in the second parameter is called. After the callback is done, it is removed from the listeners for that event.
    * removeListener(String, Function) - this - If found, and it matches the second parameter, the callback function for an the event specified in the first parameter is removed.
    * removeAllListeners(String) - this - Removes all listeners for the event specified in the first parameter.

## Browser-Only Utils (includes Electron):
  * PROTO-EXTENSION - EventTarget Extensions:
    * emit(String/data[, ...data]) - Boolean - If the first parameter is not a string, it acts like `postMessage`. Otherwise, it emits the event specified in the first parameter, and optionally passes the rest of the arguments as extra data. Returns true if the event has listeners, false otherwise.
    * on(String, Function) - this - Can act like `onmessage` when given 'message' as the event. When the event specified in the first parameter is fired, the callback in the second parameter is called.
    * once(String, Function) - this - Can act like `onmessage` when given 'message' as the event (except only fires once). When the event specified in the first parameter is fired, the callback in the second parameter is called. After the callback is done, it is removed from the listeners for that event.
    * removeListener(String, Function) - this - If found, and it matches the second parameter, the callback function for an the event specified in the first parameter is removed.
  * PROTO-EXTENSION - Worker Extensions:
    * emit(String/data[, ...data]) - Boolean - If the first parameter is not a string, it acts like `postMessage`. Otherwise, it emits the event specified in the first parameter, and optionally passes the rest of the arguments as extra data. Returns true if the event has listeners, false otherwise.
    * on(String, Function) - this - Can act like `onmessage` when given 'message' as the event. When the event specified in the first parameter is fired, the callback in the second parameter is called.
    * once(String, Function) - this - Can act like `onmessage` when given 'message' as the event (except only fires once). When the event specified in the first parameter is fired, the callback in the second parameter is called. After the callback is done, it is removed from the listeners for that event.
    * removeListener(String, Function) - this - If found, and it matches the second parameter, the callback function for an the event specified in the first parameter is removed.
    * removeAllListeners(String) - this - Removes all listeners for the event specified in the first parameter.
  * PROTO-EXTENSION - Document/HTMLDocument Extensions:
    * on(String, Function) - this - When the event specified in the first parameter is fired, the callback in the second parameter is called.
    * once(String, Function) - this - When the event specified in the first parameter is fired, the callback in the second parameter is called. After the callback is done, it is removed from the listeners for that event.
    * ready(Function) - this - When the document is ready, the callback function is called.
    * get(String) - HTMLElement - Get an element based on a query string (only accepts '#id', '.class', or 'tagName').
    * create(String[, Object]) - HTMLElement - Create an element from a tag, and optionally initialize it with properties from the second argument.
  * PROTO-EXTENSION - HTMLElement Extensions:
    * on(String, Function) - this - When the event specified in the first parameter is fired, the callback in the second parameter is called.
    * once(String, Function) - this - When the event specified in the first parameter is fired, the callback in the second parameter is called. After the callback is done, it is removed from the listeners for that event.
    * remove() - this - Remove the current element.
    * text([String]) - String/this - If given no parameters, returns the element's text. If given the first parameter, replaces the element's text with the new text.
    * html([String]) - String/this - If given no parameters, returns the element's html. If given the first parameter, replaces the element's html with the new html.
    * centerToWindow([Boolean]) - this - If given no parameters, it centers the element horizontally and vertically relative to the window. If the parameter is true, it only centers the element horizontally relative to the window. If the parameter is false, it only centers the element vertically relative to the window.
    * prependChild(child) - this - Inserts the given child before the first node, essentially prepending the child.
    * hasMultipleOfClass(String) - Boolean - Check if the element has multiple occurrences of a class.
    * hasClass(String) - Boolean - Check if the element has a certain class.
    * addClass(String) - this - Add the specified class to the element.
    * removeClass(String) - this - Remove the specified class to the element.
    * hide() - this - Hide the element.
    * show() - this - Show the element.
    * toggle() - this - Toggle the display state of the element.
    * css(String/Object/Array[, String/Array]) - String/undefined, throws! - Easier with a table:

|         First parameter         |         Second parameter         |            Return Value          |
|:-------------------------------:|:--------------------------------:|:--------------------------------:|
|      String - Property name     |             undefined            |       String - Property value    |
|      String - Property name     |      String - Property Value     |                this              |
|  Object - Object of properties  |             undefined            |                this              |
| Array - Array of property names |             undefined            | Array - Array of property values |
| Array - Array of property names | Array - Array of property values |                this              |

### Node-Only Utils:
None yet.
