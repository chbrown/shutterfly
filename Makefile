SHELL := bash
PATH := /usr/local/bin/:$(PATH)

all: bookmarklet.js

node_modules/.bin/uglifyjs:
	npm install uglify-js

bookmarklet.js: src.js node_modules/.bin/uglifyjs
	echo -n javascript: > $@
	node_modules/.bin/uglifyjs $< | perl -pe 'chomp if eof' >>$@
