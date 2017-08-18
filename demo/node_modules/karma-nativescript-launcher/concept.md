Unit testing NativeScript projects
==================================

NativeScript projects need a way to write and execute unit tests.

Design goals
------------

* Users should write tests on their dev machine and execute them on a device or emulator with no friction.
* Users should be able to use a testing framework they're familiar with.
* There should be a mode of operation in which test are executed as soon as any test file is changed.
* There should be a way to integrate the unit test runner into a build server running continuous integration (CI).
* The tests should run in a NativeScript environment with the same native bits as the app for which the tests are written.
* There should be a way to author and execute unit tests for iOS without needing a Mac.

Karma
-----
A lot of the above requirements can be met if we base the project around the [Karma](http://karma-runner.github.io) unit test runner.

Karma lets users write unit tests in the framework of their choice and only brokers the execution and gathering of test results from
the execution environments. Karma has adapters for popular frameworks like Jasmine, QUnit and Mocha.

Karma supports a mode of operation where it listens for changes to the unit test files and orders a rerun of the tests.

Karma has a client-server architecture, where the server runs on the dev machine, listens for changes and orders test execution.
The client is a web application that traditionally runs in a browser and uses socket.io to pass orders and results from the
test framework back to the server. The karma client can be modified to run outside a browser in a JavaScript-only environment.

Basing the {N} unit test runner on Karma will allow to easily write tests and run them on any device or emulator in real time,
using any unit test framework they wish (provided there's a Karma adapter for it).

Karma serves the unit test code as it changes on demand, so, architecturally, the unit test code is not part of the deployed
app that executes the run.

Environment
-----------
The unit test runner can be implemented as a NativeScript app itself. This way it can be deployed straight into the NativeScript
companion app. There's no need for a separate "unit test runner" app and also no need for the user to build an app for each
unit test run in the simple case where they don't need to modify the native bits of the app.

The launcher will provide host information (IP, etc.) to the runner on the device so that the device can connect to the 
Karma server hosted on the dev machine. Once the runner boots and connects to the Karma server it can execute tests by order
of Karma server. The unit test runner will restart after every successful run, so that subsequent runs can execute in a clean
environment. If there's a way to achieve good isolation between test runs, then the restart can be avoided. It's easy to restart
an app in Android, but not as easy in iOS, i.e. not always possible.

When the test runner receives the code to run, it will need to save it locally, so that `require()`'s among the files, as well
as the file system API work the same as they do in the tested app.

Example workflow
----------------
New and existing NativeScript apps won't have unit test code, because there's no way to run any yet. A user can create
a unit test project as part of their {N} project by running:

```
$ tns test init
```

The above command needs to do the following:
* Create a `test/` folder in their project with an example test.
* Install `karma` using npm.
* Install an adapter for some unit testing framework, e.g. Jasmine, or user selectable (npm).
* Install the NativeScript unit test runner for Karma using npm.
* Create a `karma.conf.js` configuration file for Karma that ties everything together.

The user can then proceed with writing unit tests for their app.
ash
To execute the tests the user runs:

```
$ tns test
```

The above command will run Karma and the NativeScript launcher, which need to do the following:
* Decide which devices and emulators to run the tests on.
* Decide which app to use for a container: the {N} companion app, the user app, or maybe build and deploy a dedicated unit test runner app.
* Determine the network configuration of the host and devices and figure out how the device will connect to the Karma server on the dev machine.
* Upload the unit test runner app code into the container app.
* Start the app or ask the user to start it.

When the app loads, it should be able to connect to the Karma server and start running tests as the server orders them.

Continuous integration
----------------------
The `tns test` command can take additional arguments that specify options for booting an AVD or Genymotion emulator or the iOS simulator.
Having those options will allow the use of the `tns` CLI in CI build scripts.

The `tns test` command can take an argument that specifies whether the tests need to be run continuously as files change or once, e.g.
`--single` or `--watch`.