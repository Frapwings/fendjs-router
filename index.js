/**
 * Import(s)
 */

var Route = require('fendjs-route');
var debug = require('debug')('fendjs-router:index');

/**
 * Export(s)
 */

exports = module.exports = Router;

/**
 * Initialize a new Router.
 *  
 * @api public
 */

function Router (options) {
  options = options || {};
  this.sensitive = options.sensitive;
  this.strict = options.strict;
  this.routes = {};
}

/**
 * Route `method`, `path`, and one or more callbacks.
 *
 * @param {String} method
 * @param {String} path
 * @param {Function} callback...
 * @return {Router} for chaining
 * @api public
 */

Router.prototype.route = function (method, path, callbacks) {
  var method = method.toLowerCase();
  var callbacks = flatten([].slice.call(arguments, 2));

  if (!path) throw new Error('Router#' + method + '() requires a path');

  callbacks.forEach(function(fn){
    if ('function' == typeof fn) return;
    var type = {}.toString.call(fn);
    var msg = '.' + method + '() requires callback functions but got a ' + type;
    throw new Error(msg);
  });

  debug('defined %s %s', method, path);
  var route = new Route(path, callbacks, {
    sensitive: this.sensitive,
    strict: this.strict
  });

  (this.routes[method] = this.routes[method] || []).push(route);
  return this;
};


function flatten (arr, ret) {
  var ret = ret || [];
  var len = arr.length;
  for (var i = 0; i < len; ++i) {
    if (Array.isArray(arr[i])) {
      flatten(arr[i], ret);
    } else {
      ret.push(arr[i]);
    }
  }
  return ret;
};
