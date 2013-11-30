REPORTER = spec
COMPONENT = ./node_modules/.bin/component

build: components index.js
	@$(COMPONENT) build --dev -o ./test

components: component.json
	@$(COMPONENT) install --dev

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) \
		./test/index.js

test-phantom: build
	@./node_modules/.bin/mocha-phantomjs ./test/index.html

test-cov: lib-cov
	@FENDJS_ROUTER=1 $(MAKE) test REPORTER=html-cov > ./coverage.html
	@rm -rf ./lib-cov

test-coveralls: lib-cov
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@FENDJS_ROUTER=1 $(MAKE) test REPORTER=mocha-lcov-reporter | ./node_modules/.bin/coveralls
	@rm -rf ./lib-cov

lib-cov: index.js
	@./node_modules/.bin/jscoverage ./index.js ./lib-cov/index.js

clean:
	@rm -fr build components
	@rm -f ./test/build.js
	@rm -f ./coverage.html

.PHONY: clean test
