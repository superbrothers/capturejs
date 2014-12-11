all: test lint
lint:
		node_modules/.bin/eslint bin/capturejs lib/ test/
pack:
		npm pack
clean:
		rm -rf node_modules
		rm -f *.png *.jpg *.gif *.tgz
test:
		rm -f test/actual/*.gif
		./node_modules/nodeunit/bin/nodeunit test
.PHONY: lint clean test
