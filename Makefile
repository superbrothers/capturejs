NAME=`node -pe 'require("./package.json").name'`
VERSION=`node -pe 'require("./package.json").version'`

jshint: capture.js
		jshint $^
clean:
		rm -rf node_modules
		rm -f *.png *.jpg *.gif *.tgz
tar: clean
		tar czf $(NAME)-$(VERSION).tgz --exclude=".git" .
.PHONY: jshint clean tar
