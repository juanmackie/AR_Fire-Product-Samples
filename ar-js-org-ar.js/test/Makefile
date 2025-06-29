# server for the tests
server:
	http-server \
		--cors='*' \
		-p 8080 \
		../.

# run all the tests
test:
	./node_modules/.bin/wdio wdio.conf.js

# run all the tests and watch for changes
watch:
	./node_modules/.bin/wdio wdio.conf.js --watch

# run a specific test
test-one:
	./node_modules/.bin/wdio wdio.conf.js --spec $(SPEC)


# # run all the tests
# test-travis:
# 	./node_modules/.bin/wdio wdio.conf.js --host 127.0.0.1 --port 4445  --user $$SAUCE_USERNAME --key $$SAUCE_ACCESS_KEY
#
# # run a specific test
# test-one-travis:
# 	./node_modules/.bin/wdio wdio.conf.js --host 127.0.0.1 --port 4445  --user $$SAUCE_USERNAME --key $$SAUCE_ACCESS_KEY \
# 		--spec $(SPEC)


# # run all the tests
# test-travis-old:
# 	SAUCE_USERNAME=ar-js SAUCE_ACCESS_KEY=0bf62700-7432-4233-82a0-537917db2887 \
# 	./node_modules/.bin/wdio wdio.conf.js --host 127.0.0.1 --port 4445
#
# # run a specific test
# test-one-travis-old:
# 	SAUCE_USERNAME=ar-js SAUCE_ACCESS_KEY=0bf62700-7432-4233-82a0-537917db2887 \
# 	./node_modules/.bin/wdio wdio.conf.js --host 127.0.0.1 --port 4445 \
# 		--spec $(SPEC)



# publish the coverage report to coveralls
publish-coverage:
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

# open the coverage report
view-coverage:
	open ./coverage/lcov-report/index.html
