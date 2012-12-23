jslint:
		@find . -type d \( -name node_modules -o -name .git \) -prune -o \( -name "*.js" -o -name "*.json" \) -print0 | xargs -0 ./node_modules/jslint/bin/jslint.js
pack:
		npm pack
clean:
		rm -rf node_modules
		rm -f *.png *.jpg *.gif *.tgz
.PHONY: jshint clean
