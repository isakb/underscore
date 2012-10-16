TEST_TIMEOUT = 2000
TEST_REPORTER = spec

lib/blunderscore.js: src/blunderscore.ls
	@livescript -c -o lib src

.PHONY: lib/blunderscore.js
