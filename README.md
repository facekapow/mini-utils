# mini-utils [![npm](https://img.shields.io/npm/v/mini-utils.svg)](https://www.npmjs.com/package/mini-utils) [![Bower](https://img.shields.io/bower/v/mini-util.svg)](http://bower.io/search/?q=mini-util)
A mini script of utilities for Node and the Browser.<br>
This DOES extend the prototype of some things.

## Cross-environment Utils:
  * isNode() - Boolean - Is the script running in Node?
  * isBrowser() - Boolean - Is the script running in a browser?
  * isWebWorker() - Boolean - Is the script running in a WebWorker?
  * inherits(class, superClass) - undefined - Minimal implementation of Node's `inherits`.
  * guid() - String - Generate a GUID (well, a pseudo-GUID).
  * EventEmitter() - Class - Minimal implementation of Node's `EventEmitter`.

## WebWorker-Only Utils:
  * self Extensions:
    * emit(String/data[, ...data]) - this - If the first parameter is not a string, it acts like `postMessage`. Otherwise, it emits the event specified in the first parameter, and optionally passes the rest of the arguments as extra data.
    * on(String, Function) - this - Can act like `onmessage` when given 'message' as the event. When the event specified in the first parameter is fired, the callback in the second parameter is called.
    * once(String, Function) - this - Can act like `onmessage` when given 'message' as the event (except only fires once). When the event specified in the first parameter is fired, the callback in the second parameter is called. After the callback is done, it is removed from the listeners for that event.

## Browser-Only Utils:
  * Worker Extensions:
    * emit(String/data[, ...data]) - this - If the first parameter is not a string, it acts like `postMessage`. Otherwise, it emits the event specified in the first parameter, and optionally passes the rest of the arguments as extra data.
    * on(String, Function) - this - Can act like `onmessage` when given 'message' as the event. When the event specified in the first parameter is fired, the callback in the second parameter is called.
    * once(String, Function) - this - Can act like `onmessage` when given 'message' as the event (except only fires once). When the event specified in the first parameter is fired, the callback in the second parameter is called. After the callback is done, it is removed from the listeners for that event.
  * Document/HTMLDocument Extensions:
    * on(String, Function) - this - When the event specified in the first parameter is fired, the callback in the second parameter is called.
    * once(String, Function) - this - When the event specified in the first parameter is fired, the callback in the second parameter is called. After the callback is done, it is removed from the listeners for that event.
    * ready(Function) - this - When the document is ready, the callback function is called.
    * get(String) - HTMLElement - Get an element based on a query string (only accepts '#id', '.class', or 'tagName').
    * create(String[, Object]) - HTMLElement - Create an element from a tag, and optionally initialize it with properties from the second argument.
  * HTMLElement Extensions:
    * on(String, Function) - this - When the event specified in the first parameter is fired, the callback in the second parameter is called.
    * once(String, Function) - this - When the event specified in the first parameter is fired, the callback in the second parameter is called. After the callback is done, it is removed from the listeners for that event.
    * remove() - this - Remove the current element.
    * text([String]) - String/this - If given no parameters, returns the element's text. If given the first parameter, replaces the element's text with the new text.
    * hasMultipleOfClass(String) - Boolean - Check if the element has multiple occurrences of a class.
    * hasClass(String) - Boolean - Check if the element has a certain class.
    * addClass(String) - this - Add the specified class to the element.
    * removeClass(String) - this - Remove the specified class to the element.
    * hide() - this - Hide the element.
    * show() - this - Show the element.
    * toggle() - this - Toggle the display state of the element.
    * css(String/Object/Array[, String/Array]) - String/undefined, throws! - Easier with a table:

|         First parameter         |         Second parameter         |       Return Value      |
|:-------------------------------:|:--------------------------------:|:-----------------------:|
|      String - Property name     |               this               | String - Property value |
|      String - Property name     |      String - Property Value     |           this          |
|  Object - Object of properties  |               this               |           this          |
| Array - Array of property names | Array - Array of property values |           this          |

## Node-Only Utils:
None yet.
