'use strict';

var http = require('http');
var fs = require('fs');
var MiniRoute = require('mini-route');
var miniFile = require('mini-file');
var miniCompress = require('mini-compress');
var mime = require('mime');

var server = http.createServer();
var router = new MiniRoute(server, {
  notFound: true
});

miniFile(router, __dirname);

router.get('/mini-utils.js', function(req, res) {
  miniCompress(req, fs.readFileSync(__dirname + '/../mini-utils.js'), function(err, compressed, encoding) {
    if (err) {
      res.statusCode = 500;
      return res.end('500 internal server error.');
    }

    var headers = {
      'content-type': mime.lookup(__dirname + '/../mini-utils.js')
    };

    if (encoding) {
      headers['content-encoding'] = encoding;
    }

    res.writeHead(200, headers);

    res.end(compressed);
  });
});

router.get('/mini-utils.min.js', function(req, res) {
  miniCompress(req, fs.readFileSync(__dirname + '/../mini-utils.min.js'), function(err, compressed, encoding) {
    if (err) {
      res.statusCode = 500;
      return res.end('500 internal server error.');
    }

    var headers = {
      'content-type': mime.lookup(__dirname + '/../mini-utils.min.js')
    };

    if (encoding) {
      headers['content-encoding'] = encoding;
    }

    res.writeHead(200, headers);

    res.end(compressed);
  });
});

router.post('/postURL', function(req, res) {
  var data = '';

  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    var n = parseInt(data);
    res.writeHead(200, {
      'content-type': 'text/plain'
    });
    res.end((n+12).toString());
  });
});

server.listen(8080);
