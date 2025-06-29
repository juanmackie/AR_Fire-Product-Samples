This folder contains all the tests for AR.js.

Currently all tests are functionnal tests using webdriver.io.
It makes them closer to how user actually use it. Thus it is more robust.

To run the tests, you first need to install the test local server.
Go in ```./test``` and run ```npm install```.

Then you need to run the test server. Still in ```./test```, do
```npm run server```.

Then you run the tests themselves. Still in ```./test```, do
```npm run test```.

It will run all the tests and exit.
If you wanna run specific tests, you can use ```npm run wdio -- --spec ./test/specific-test.js```.
This is the recommended way to develop tests.

If you wanna change the test server, you can look at ```./test/package.json```.
If you wanna change the test themselves, you can look at ```./test/wdio.conf.js```.
It is the configuration file for webdriver.io test runner.
The tests themselves are in ```./test/spec/*.js```.
Each file containing a test suite.
So if you wanna add a new test suite, just create a new file there.
If you wanna add a new test in an existing suite, just append it to the file.

The tests are written in [mocha](https://mochajs.org/) and use [chai](http://chaijs.com/) for assertion.
Webdriver.io contains command to interact with the browser.
[Webdriver.io API doc is here](http://webdriver.io/api.html).

It is all running in a local instance of Selenium.
It is started/stopped automatically by webdriver.io test runner.
Currently, the tests are done in chrome only. More browser could be added later.
It is possible to run those tests on a remote selenium server, e.g. saucelabs.
It would be cool to run that on each commit.

For more details, see [./TODO.md](./TODO.md)
