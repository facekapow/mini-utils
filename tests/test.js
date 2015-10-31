'use strict';

(function() {
  function passTest(test, info) {
    if (!test.timedOut && test.timer) clearTimeout(test.timer);
    setTimeout(function() {
      document.getElementById(test.resSpan).innerHTML = 'Pass.';
      document.getElementById(test.result).className = 'green';
      if (info) {
        document.getElementById(test.infoElm).innerHTML = info;
      }
    }, 500);
  }

  function warnTest(test, info) {
    if (!test.timedOut && test.timer) clearTimeout(test.timer);
    setTimeout(function() {
      document.getElementById(test.resSpan).innerHTML = 'Warning!';
      document.getElementById(test.result).className = 'yellow';
      if (info) {
        document.getElementById(test.infoElm).innerHTML = info;
      }
    }, 500);
  }

  function warnPassTest(test, info) {
    if (!test.timedOut && test.timer) clearTimeout(test.timer);
    setTimeout(function() {
      document.getElementById(test.resSpan).innerHTML = 'Pass.';
      document.getElementById(test.result).className = 'yellow';
      if (info) {
        document.getElementById(test.infoElm).innerHTML = info;
      }
    }, 500);
  }

  function failTest(test, info) {
    if (!test.timedOut && test.timer) clearTimeout(test.timer);
    setTimeout(function() {
      document.getElementById(test.resSpan).innerHTML = 'Fail!';
      document.getElementById(test.result).className = 'red';
      if (info) {
        document.getElementById(test.infoElm).innerHTML = info;
      }
    }, 500);
  }

  function runningTest(test) {
    document.getElementById(test.resSpan).innerHTML = 'Running...';
  }

  function appendTest(type, test, timeout) {
    var tbody;
    switch(type) {
      case 0:
        tbody = document.getElementById('cross_tests');
        break;
      case 1:
        tbody = document.getElementById('wwb_tests');
        break;
      case 2:
        tbody = document.getElementById('ww_tests');
        break;
      case 3:
        tbody = document.getElementById('b_tests');
        break;
    }
    var tr = document.createElement('tr');
    var td_test = document.createElement('td');
    var td_result = document.createElement('td');
    var span = document.createElement('span');
    var info = document.createElement('div');
    info.style.display = 'none';
    info.style.position = 'fixed';
    info.style.backgroundColor = 'white';
    info.style.border = '1px solid black';
    td_test.innerHTML = test;
    info.id = 'test_' + type + '_' + test + '_info';
    td_result.id = 'test_' + type + '_' + test + '_td';
    span.id = 'test_' + type + '_' + test + '_text';
    span.innerHTML = 'Pending...';
    td_result.addEventListener('mousemove', function(e) {
      info.style.left = e.clientX + 'px';
      info.style.top = e.clientY + 'px';
      info.style.display = 'block';
    });
    td_result.addEventListener('mouseleave', function(e) {
      info.style.display = 'none';
    });
    td_result.className = 'yellow';
    td_result.appendChild(span);
    td_result.appendChild(info);
    tr.appendChild(td_test);
    tr.appendChild(td_result);
    tbody.appendChild(tr);
    var obj = {
      resSpan: span.id,
      result: td_result.id,
      infoElm: info.id,
      timedOut: false
    }
    if (timeout) {
      obj.startTimer = function() {
        obj.timer = setTimeout(function() {
          obj.timedOut = true;
          span.innerHTML = 'Fail.';
          td_result.className = 'yellow';
          info.innerHTML = 'Timed out.';
        }, timeout+500);
      }
    }
    return obj;
  }

  //
  // BEGIN Tests
  //

  function isNodeTest(t, cb) {
    if (!__.isNode()) {
      passTest(t, 'Correctly id\'d environment.');
    } else {
      failTest(t, 'Incorrectly id\'d environment.');
    }
    cb();
  }

  function isBrowserTest(t, cb) {
    if (__.isBrowser()) {
      passTest(t, 'Correctly id\'d environment.');
    } else {
      failTest(t, 'Incorrectly id\'d environment.');
    }
    cb();
  }

  function inheritsTest(t, cb) {
    function testSuperClass() {}
    testSuperClass.prototype.works = true;

    function testClass() {
      if (this.works) {
        passTest(t, 'Correctly inherited from super class.');
      } else {
        failTest(t, 'Incorrectly inherited from super class.');
      }
    }
    __.inherits(testClass, testSuperClass);

    var testInstance = new testClass();
    cb();
  }

  function guidTest(t, cb) {
    var str = __.guid();
    if (typeof str === undefined) {
      failTest(t, 'Did not generate a GUID.');
      return cb();
    }
    var arr = str.split('-');
    var valid = true;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].match(/^[a-f0-9]+$/gi) === null) {
        valid = false;
        break;
      }
    }
    if (valid) {
      passTest(t, 'Correctly generated a GUID.');
    } else {
      failTest(t, 'Incorrectly generated a GUID.');
    }
    cb();
  }

  function eventEmitterTest(t, cb) {
    var emitter = new __.EventEmitter();

    var timer;
    emitter.on('event', function(data) {
      if (!data) {
        failTest(t, 'Did not receive data.');
        return cb();
      }
      clearTimeout(timer);
      var times = 0;
      emitter.once('event2', function() {
        times++;
      });
      emitter.emit('event2');
      emitter.emit('event2');
      if (times !== 1) {
        failTest(t, '\'once\' listener called more than once.');
        return cb();
      }
      if (emitter.getMaxListeners() !== 10) {
        failTest(t, 'Deafult max number of listeners does not equal 10.');
        return cb();
      }
      emitter.setMaxListeners(15);
      if (emitter.getMaxListeners() !== 15) {
        failTest(t, 'New max number of listeners does not equal 15.');
        return cb();
      }
      emitter.addListener('event3', function() {
        clearTimeout(timer);
        var onemitted = false;
        function listener() {
          onemitted = true;
          failTest(t, 'Event listener not removed.');
          cb();
        }
        emitter.on('event4', listener);
        emitter.removeListener('event4', listener);
        emitter.emit('event4');
        if (onemitted) {
          return;
        }
        var emitted = false;
        function listener2() {
          emitted = true;
          failTest(t, 'Event listener not removed.');
          cb();
        }
        emitter.on('event5', listener2);
        emitter.on('event5', listener2);
        emitter.removeAllListeners('event5');
        emitter.emit('event5');
        if (emitted === true) {
          failTest(t, 'All event listeners not removed.');
          return cb();
        }
        function event6listener() {}
        emitter.on('event6', event6listener);
        var listeners = emitter.listeners('event6');
        if (listeners.length !== 1) {
          failTest(t, 'Too many or too little listeners attached to event.');
          return cb();
        }
        if (listeners[0] !== event6listener) {
          console.log(listeners);
          failTest(t, 'Listener does not equal what it should.');
          return cb();
        }
        passTest(t, 'Emitter functioned correctly.');
        cb();
      });
      timer = setTimeout(function() {
        failTest(t, 'Took too long to emit event.');
        return cb();
      }, 1000);
      emitter.emit('event3');
    });
    if (emitter.listenerCount('event') !== 1) {
      failTest(t, 'Too many or too little listeners attached to event.');
      return cb();
    }
    timer = setTimeout(function() {
      failTest(t, 'Took too long to emit event.');
      return cb();
    }, 1000);
    emitter.emit('event', 'some data');
  }

  function nextTickTest(t, cb) {
    var i = 0;
    __.nextTick(function() {
      if (i === 3) {
        passTest(t, 'Correctly called function.');
      } else {
        failTest(t, 'Incorrectly called function.');
      }
      cb();
    });
    i = 3;
  }

  function cloneTest(t, cb) {
    var obj = {
      someProp: 'prop'
    }

    var clone = __.clone(obj);

    if (typeof clone === 'undefined') {
      failTest(t, 'Returned undefined.');
      return cb();
    }

    if (clone === obj) {
      failTest(t, 'Did not correctly clone object.');
    } else {
      passTest(t, 'Correctly cloned object.');
    }
    cb();
  }

  function importTest(t, cb) {
    __.import('/imported', function(err, imported) {
      if (err) {
        failTest(t, 'Errored while retrieving data.');
        return cb();
      }

      if (!imported.someProp) {
        failTest(t, 'Does not contain the right imported properties.');
        return cb();
      }

      if (imported.someProp !== 'prop') {
        failTest(t, 'Imported properties are not correct.');
      } else {
        passTest(t, 'Correctly imported script.');
      }
      cb();
    });
  }

  function importSyncTest(t, cb) {
    var imported;
    try {
      imported = __.importSync('/imported');
    } catch(e) {
      failTest(t, 'Errored while retrieving data.');
      return cb();
    }

    if (!imported.someProp) {
      failTest(t, 'Does not contain the right imported properties. USE THE ASYNC VERSION ABOVE!');
      return cb();
    }

    if (imported.someProp !== 'prop') {
      failTest(t, 'Imported properties are not correct. USE THE ASYNC VERSION ABOVE!');
    } else {
      warnPassTest(t, 'Correctly imported script. USE THE ASYNC VERSION ABOVE!');
    }
    cb();
  }

  function easyRequestTest(t, cb) {
    __.easyRequest('/req.txt', function(err, data) {
      if (err) {
        failTest(t, 'Errored while retrieving data.');
        return cb();
      }

      if (!data) {
        failTest(t, 'Failed to retreive data.');
        return cb();
      }

      if (data !== 'some text.\n') {
        failTest(t, 'Incorrectly retrieved data.');
        return cb();
      }

      var syncdata;
      try {
        syncdata = __.easyRequest('/req.txt');
      } catch(e) {
        failTest(t, 'Errored while retrieving data synchronously.');
        return cb();
      }

      if (!syncdata) {
        failTest(t, 'Failed to retreive data synchronously.');
        return cb();
      }

      if (syncdata !== 'some text.\n') {
        failTest(t, 'Incorrectly retrieved data synchronously.');
      } else {
        passTest(t, 'Correctly retrieved data.');
      }
      cb();
    });
  }

  function easyPostTest(t, cb) {
    __.easyPost('/postURL', '4', function(err, data) {
      if (err) {
        failTest(t, 'Errored while posting/retrieving data.');
        return cb();
      }

      if (!data) {
        failTest(t, 'Failed to post/retrieve data.');
        return cb();
      }

      if (data !== '16') {
        failTest(t, 'Incorrectly posted/retrieved data.');
        return cb();
      }

      var syncdata;
      try {
        syncdata = __.easyPost('/postURL', '4');
      } catch(e) {
        failTest(t, 'Errored while posting/retrieving data synchronously.');
        return cb();
      }

      if (!syncdata) {
        failTest(t, 'Failed to post/retrieve data synchronously.');
        return cb();
      }

      if (syncdata !== '16') {
        failTest(t, 'Incorrectly posted/retrieved data synchronously.');
      } else {
        passTest(t, 'Correctly posted/retrieved data.');
      }
      cb();
    });
  }

  function documentGetTest(t, cb) {
    var elm = document.get('#b_tests');
    if (!elm) {
      failTest(t, 'Incorrectly retreived element.');
      return cb();
    }
    if (elm.id !== 'b_tests') {
      failTest(t, 'Incorrectly retreived element.');
    } else {
      passTest(t, 'Correctly retreived element.');
    }
    cb();
  }

  function documentCreateTest(t, cb) {
    var elm = document.create('p', {
      css: {
        display: 'none'
      },
      id: 'foo'
    });
    if (elm.id !== 'foo' || elm.style.display !== 'none') {
      failTest(t, 'Incorrectly created element.');
    } else {
      passTest(t, 'Correctly created element.');
    }
    cb();
  }

  function elmOnTest(t, cb) {
    var elm = document.createElement('button');
    elm.on('click', function() {
      passTest(t, 'Correctly fired event.');
      cb();
    });
    elm.click();
  }

  function elmOnceTest(t, cb) {
    var elm = document.createElement('button');
    var clicks = 0;
    elm.once('click', function() {
      clicks++;
    });
    elm.click();
    elm.click();
    if (clicks !== 1) {
      failTest(t, 'Incorrectly fired event.');
    } else {
      passTest(t, 'Correctly fired event.');
    }
    cb();
  }

  function elmRemoveTest(t, cb) {
    var parent = document.createElement('div');
    var elm = document.createElement('button');
    parent.appendChild(elm);
    elm.remove();
    if (parent.childNodes[0] && parent.childNodes[0] !== elm) {
      failTest(t, 'Incorrectly removed element.');
    } else {
      passTest(t, 'Correctly removed element.');
    }
    cb();
  }

  function elmTextTest(t, cb) {
    var elm = document.createElement('p');
    elm.textContent = 'txt';
    if (elm.text() !== elm.textContent) {
      failTest(t, 'Incorrectly retreived text.');
      return cb();
    }
    elm.text('foo');
    if (elm.textContent !== 'foo') {
      failTest(t, 'Incorrectly set text.');
    } else {
      passTest(t, 'Correctly set/retreived text.');
    }
    cb();
  }

  function elmHasMultipleOfClassTest(t, cb) {
    var elm = document.createElement('p');
    elm.className = 'foo foo faf';
    if (elm.hasMultipleOfClass('foo') !== true || elm.hasMultipleOfClass('faf') === true) {
      failTest(t, 'Incorrectly analyzed number of classes.');
    } else {
      passTest(t, 'Correctly analyzed number of classes.');
    }
    cb();
  }

  function elmHasClassTest(t, cb) {
    var elm = document.createElement('p');
    elm.className = 'someClass';
    if (elm.hasClass('someClass') !== true || elm.hasClass('someOtherClass') === true) {
      failTest(t, 'Incorrectly analyzed classes.');
    } else {
      passTest(t, 'Correctly analyzed classes.');
    }
    cb();
  }

  function elmAddClassTest(t, cb) {
    var elm = document.createElement('p');
    elm.addClass('someClass');
    if (elm.className !== 'someClass') {
      failTest(t, 'Incorrectly added class.');
    } else {
      passTest(t, 'Correctly added class.');
    }
    cb();
  }

  function elmRemoveClassTest(t, cb) {
    var elm = document.createElement('p');
    elm.className = 'someClass someOtherClass';
    elm.removeClass('someClass');
    if (elm.className !== 'someOtherClass') {
      failTest(t, 'Incorrectly removed class.');
    } else {
      passTest(t, 'Correctly removed class.');
    }
    cb();
  }

  function elmHideTest(t, cb) {
    var elm = document.createElement('p');
    elm.hide();
    if (elm.style.display !== 'none') {
      failTest(t, 'Incorrectly hid element.');
    } else {
      passTest(t, 'Correctly hid element.');
    }
    cb();
  }

  function elmShowTest(t, cb) {
    var elm = document.createElement('p');
    elm.style.display = 'none';
    elm.show();
    if (elm.style.display !== '') {
      failTest(t, 'Incorrectly showed element.');
    } else {
      passTest(t, 'Correctly showed element.');
    }
    cb();
  }

  function elmToggleTest(t, cb) {
    var elm = document.createElement('p');
    elm.style.display = 'none';
    elm.toggle();
    if (elm.style.display !== '') {
      failTest(t, 'Incorrectly toggled element.');
      return cb();
    }
    elm.toggle();
    if (elm.style.display !== 'none') {
      failTest(t, 'Incorrectly toggled element.');
    } else {
      passTest(t, 'Correctly toggled element.');
    }
    cb();
  }

  function elmCssTest(t, cb) {
    var elm = document.createElement('p');
    if (elm.css('display') !== '') {
      failTest(t, 'Incorrectly retreived property.');
      return cb();
    }
    var arr = elm.css(['display']);
    if (arr[0] !== '') {
      failTest(t, 'Incorrectly retreived property.');
      return cb();
    }
    elm.css('display', 'none');
    if (elm.style.display !== 'none') {
      failTest(t, 'Incorrectly set property.');
      return cb();
    }
    elm.css({
      display: 'block'
    });
    if (elm.style.display !== 'block') {
      failTest(t, 'Incorrectly set property.');
      return cb();
    }
    elm.css(['display'], ['inline']);
    if (elm.style.display !== 'inline') {
      failTest(t, 'Incorrectly set property.');
    } else {
      passTest(t, 'Correctly retreived/set property.');
    }
    cb();
  }

  //
  // END Tests
  //

  //
  // test types
  // 0 = cross-environment
  // 1 = webworker & browser
  // 3 = browser only
  //

  var tests = [
    {
      type: 0,
      test: '__.isNode',
      func: isNodeTest,
      timeout: 1000
    },
    {
      type: 0,
      test: '__.isBrowser',
      func: isBrowserTest,
      timeout: 1000
    },
    {
      type: 0,
      test: '__.inherits',
      func: inheritsTest,
      timeout: 1000
    },
    {
      type: 0,
      test: '__.guid',
      func: guidTest,
      timeout: 1000
    },
    {
      type: 0,
      test: '__.EventEmitter',
      func: eventEmitterTest,
      timeout: null
    },
    {
      type: 0,
      test: '__.nextTick',
      func: nextTickTest,
      timeout: 1000
    },
    {
      type: 0,
      test: '__.clone',
      func: cloneTest,
      timeout: 1000
    },
    {
      type: 1,
      test: '__.import',
      func: importTest,
      timeout: 5000
    },
    {
      type: 1,
      test: '__.importSync',
      func: importSyncTest,
      timeout: 5000
    },
    {
      type: 1,
      test: '__.easyRequest',
      func: easyRequestTest,
      timeout: 5000
    },
    {
      type: 1,
      test: '__.easyPost',
      func: easyPostTest,
      timeout: 5000
    },
    {
      type: 3,
      test: 'document.get',
      func: documentGetTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'document.create',
      func: documentCreateTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.on',
      func: elmOnTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.once',
      func: elmOnceTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.remove',
      func: elmRemoveTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.text',
      func: elmTextTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.hasMultipleOfClass',
      func: elmHasMultipleOfClassTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.hasClass',
      func: elmHasClassTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.addClass',
      func: elmAddClassTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.removeClass',
      func: elmRemoveClassTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.hide',
      func: elmHideTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.show',
      func: elmShowTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.toggle',
      func: elmToggleTest,
      timeout: 1000
    },
    {
      type: 3,
      test: 'elm.css',
      func: elmCssTest,
      timeout: 1000
    }
  ];

  var testObjects = [];

  function executeItAll() {
    //
    // BEGIN Styling
    //
    function centerIt() {
      var center = document.getElementById('centered');
      var left = (window.innerWidth/2)-(center.clientWidth/2);
      center.style.marginLeft = left + 'px';
    }
    document.addEventListener('resize', centerIt);
    centerIt();
    //
    // END Styling
    //

    //
    // BEGIN Test Generation
    //
    for (var i = 0; i < tests.length; i++) {
      testObjects.push({
        func: tests[i].func,
        test: appendTest(tests[i].type, tests[i].test, tests[i].timeout)
      });
    }
    //
    // END Test Generation
    //

    //
    // BEGIN Test Running
    //
    var i = 0;
    function runTests(pos) {
      if (pos < testObjects.length) {
        var t = testObjects[pos].test;
        runningTest(t);
        setTimeout(function() {
          testObjects[pos].func(t, function() {
            setTimeout(function() {
              runTests(pos+1);
            }, 500);
          });
        }, 500);
      }
    }
    setTimeout(function() {
      runTests(i);
    }, 1000);
    //
    // END Test Running
    //
  }

  var docReady = false;
  var docOn = false;
  var docOnce = false;

  document.ready(function() {
    var t = appendTest(3, 'document.ready', null);
    runningTest(t);
    passTest(t, 'Correctly listened for event.');
    docReady = true;
  });

  document.on('DOMContentLoaded', function() {
    var t = appendTest(3, 'document.on', null);
    runningTest(t);
    passTest(t, 'Correctly listened for event.');
    docOn = true;
  });

  document.once('DOMContentLoaded', function() {
    var t = appendTest(3, 'document.once', null);
    runningTest(t);
    passTest(t, 'Correctly listened for event.');
    docOnce = true;
    executeItAll();
  });

  document.addEventListener('DOMContentLoaded', function() {
    if (!docReady) {
      var t = appendTest(3, 'document.ready', null);
      runningTest(t);
      failTest(t, 'Incorrectly listened for event.');
    }
    if (!docOn) {
      var t = appendTest(3, 'document.on', null);
      runningTest(t);
      failTest(t, 'Incorrectly listened for event.');
    }
    if (!docOnce) {
      var t = appendTest(3, 'document.once', null);
      runningTest(t);
      failTest(t, 'Incorrectly listened for event.');
    }
    if (!docReady || !docOn || !docOnce) {
      executeItAll();
    }
  });
})();
