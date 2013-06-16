all: test lint
lint:
		@find . -type d \( -name node_modules -o -name .git \) -prune -o \( -name "*.js" -o -name "*.json" \) -print0 | xargs -0 ./node_modules/jslint/bin/jslint.js
pack:
		npm pack
clean:
		rm -rf node_modules
		rm -f *.png *.jpg *.gif *.tgz
test:
		rm -f test/actual/*.gif
		./node_modules/nodeunit/bin/nodeunit test
.PHONY: lint clean test
