# mini-utils
A mini script of utilities for Node and the Browser.<br>
This DOES extend the prototype of some things.

## Cross-environment Utils:
  * isNode() - Boolean - Is the script running under Node?
  * isWebWorker() - Boolean - Is the script running in a WebWorker?
  * inherits(class, superClass) - undefined - Minimal implementation of Node's `inherits`.
  * guid() - String - Generate a GUID (well, a pseudo-GUID).
  * EventEmitter() - Class - Minimal implementation of Node's `EventEmitter`.

## Browser-Only Utils:
  * Document/HTMLDocument Extensions:
    * get(String) - HTMLElement - Get an element based on a query string (only accepts '#id', '.class', or 'tagName').
  * HTMLElement Extensions:
    * remove() - this - Remove the current element.
    * text([String]) - String/this - If given no parameters, returns the element's text. If given the first parameter, replaces the element's text with the new text.
    * hasMultipleOfClass(String) - Boolean - Check if the element has multiple occurrences of a class.
    * hasClass(String) - Boolean - Check if the element has a certain class.
    * addClass(String) - this - Add the specified class to the element.
    * removeClass(String) - this - Remoce the specified class to the element.
    * css(String/Object/Array[, String/Array]) - String/undefined, throws! - Easier with a table:

|         First parameter         |         Second parameter         |       Return Value      |
|:-------------------------------:|:--------------------------------:|:-----------------------:|
|      String - Property name     |               this               | String - Property value |
|      String - Property name     |      String - Property Value     |           this          |
|  Object - Object of properties  |               this               |           this          |
| Array - Array of property names | Array - Array of property values |           this          |

## Node-Only Utils:
None yet.
