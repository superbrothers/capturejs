NAME=`node -pe 'require("./package.json").name'`
VERSION=`node -pe 'require("./package.json").version'`

jslint:
		@find . -type d \( -name node_modules -o -name .git \) -prune -o \( -name "*.js" -o -name "*.json" \) -print0 | xargs -0 ./node_modules/jslint/bin/jslint.js
clean:
		rm -rf node_modules
		rm -f *.png *.jpg *.gif *.tgz
tar: clean
		tar czf $(NAME)-$(VERSION).tgz --exclude=".git" *
.PHONY: jshint clean tar
