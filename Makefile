
start:
	npm start

test:
	npm test

cov:
	npm run test-coverage

cov-html:
	npm run test-coverage-html

cov-mac:
	npm run test-coverage-html
	open -a Safari ./test/coverage.html

.PHONY: start test
