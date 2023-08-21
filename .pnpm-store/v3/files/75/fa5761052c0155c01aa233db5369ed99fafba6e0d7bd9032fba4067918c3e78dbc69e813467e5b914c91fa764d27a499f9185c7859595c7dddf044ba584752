NODE_PATH ?= ./node_modules
DIST_DIR = ./dist
JS_COMPILER = node_modules/.bin/uglifyjs
JS_TESTER = node_modules/.bin/vows

DOC_DIR = doc
BUILD_DIR = build
DOC_LIST = `ls $(DOC_DIR)/md/`
JS_ENGINE ?= $(shell which node nodejs 2>/dev/null | head -1)

all: clean core doc

clean:
	@echo 'Cleaning up build files'
	@rm -rf dist

core: jstat.js jstat.min.js

jstat.js: \
	src/_header.js \
	src/core.js \
	src/vector.js \
	src/special.js \
	src/distribution.js \
	src/linearalgebra.js \
	src/test.js \
	src/models.js \
	src/regression.js \
	src/_footer.js
	@echo 'Building jStat'
	@mkdir -p $(DIST_DIR)
	@cat $^ > $(DIST_DIR)/$@

jstat.min.js: jstat.js
	@echo 'Minifying jStat'
	@$(JS_COMPILER) < $(DIST_DIR)/$< > $(DIST_DIR)/$@

doc:
	@echo 'Generating documentation'
	@mkdir -p $(DIST_DIR)/docs/assets
	@cp $(DOC_DIR)/assets/*.css $(DIST_DIR)/docs/assets/
	@cp $(DOC_DIR)/assets/*.js $(DIST_DIR)/docs/assets/
	@for i in $(DOC_LIST); do \
		$(JS_ENGINE) $(BUILD_DIR)/doctool.js $(DOC_DIR)/assets/template.html $(DOC_DIR)/md/$${i} $(DIST_DIR)/docs/$${i%.*}.html; \
	done

jstat: jstat.js

install:
	@echo 'Downloading necessary libraries for build'
	@mkdir -p node_modules
	@npm install

test: clean core
	@echo 'Running jStat unit tests'
	@$(JS_TESTER) test/*/*.js

.PHONY: clean core doc install test
