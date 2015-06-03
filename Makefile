
start:
	npm start

test:
	npm test

test-cov:
	npm run test-coverage

test-cov-html:
	npm run test-coverage-html

test-cov-mac:
	npm run test-coverage-html
	open -a Safari ./test/coverage.html

.PHONY: start test
