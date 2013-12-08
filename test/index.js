/**
 * Import(s)
 */

var Router = (typeof window !== 'undefined' && window !== null) 
  ? require('fendjs-router') : require(process.env.FENDJS_ROUTER ? '../lib-cov/' : '../');
var expect = require('expect.js');

/**
 * Test(s)
 */

describe('fendjs-router', function () {
  describe('Router(options)', function () {
    describe('without options', function () {
      before(function (done) {
        this.router = new Router();
        done();
      });
      describe('routes', function () {
        it('expect to be empty', function (done) {
          expect(this.router.routes).to.be.empty();
          done();
        });
      });
      describe('sensitive', function () {
        it('expect to be undefined', function (done) {
          expect(this.router.sensitive).to.be(undefined);
          done();
        });
      });
      describe('strict', function () {
        it('expect to be undefined', function (done) {
          expect(this.router.strict).to.be(undefined);
          done();
        });
      });
    });

    describe('with `{ sensitive: true, strict: true }` options', function () {
      before(function (done) {
        this.router = new Router({ sensitive: true, strict: true });
        done();
      });
      describe('routes', function () {
        it('expect to be empty', function (done) {
          expect(this.router.routes).to.be.empty();
          done();
        });
      });
      describe('sensitive', function () {
        it('expect to be true', function (done) {
          expect(this.router.sensitive).to.be(true);
          done();
        });
      });
      describe('strict', function () {
        it('expect to be true', function (done) {
          expect(this.router.strict).to.be(true);
          done();
        });
      });
    });
  });

  describe('Router#route(method, path, callbacks)', function () {
    var router;
    beforeEach(function (done) {
      router = new Router();
      done();
    });

    describe('without arguments', function () {
      it('expect to throw error', function (done) {
        expect(function () {
          router.route();
        }).to.throwException();
        done();
      });
    });

    describe('with arguments', function () {
      describe('basic pattern', function () {
        it('should be popluated', function (done) {
          var cb1 = function () {};
          var cb2 = function () {};

          router.route('get', '/', cb1);
          router.route('post', '/user/:id', cb2);

          expect(router.routes).to.have.property('get');
          expect(router.routes).to.have.property('post');
          expect(router.routes).to.not.have.property('put');

          expect(router.routes['get']).to.have.length(1);
          expect(router.routes['post']).to.have.length(1);

          expect(router.routes['get'][0].path).to.be('/');
          expect(router.routes['post'][0].path).to.be('/user/:id');

          expect(router.routes['get'][0].callbacks[0]).to.be(cb1);
          expect(router.routes['post'][0].callbacks[0]).to.be(cb2);

          expect(router.routes['get'][0].keys).to.empty();
          expect(router.routes['post'][0].keys[0]).to.eql({ name: 'id', optional: false });

          expect(router.routes['get'][0].regexp.toString()).to.be('/^\\/\\/?$/i');
          expect(router.routes['post'][0].regexp.toString()).to.be('/^\\/user\\/(?:([^\\/]+?))\\/?$/i');
          done();
        });
      });

      describe('multiple callbacks', function () {
        describe('with null', function () {
          it('expect to throw', function(){
            expect(function () {
              router.route('get', '/foo', null, function () {});
            }).to.throwException();
          })
        });

        describe('with undefined', function () {
          it('expect to throw', function(){
            expect(function () {
              router.route('get', '/foo', undefined, function () {});
            }).to.throwException();
          })
        });

        describe('with not a function', function () {
          it('expect to throw', function(){
            expect(function () {
              router.route('get', '/foo', 'not a function', function () {});
            }).to.throwException();
          })
        });

        describe('with are functions', function () {
          it('expect to not throw', function(){
            expect(function () {
              router.route('get', '/foo', function () {}, function () {});
            }).to.not.throwException();
          })
        });
      });
    });
  });
});

