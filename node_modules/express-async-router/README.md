# express-async-router

`express-async-router` is an [Express] [Router] wrapper which automatically manage `Promise`.

## Getting Started

`express-async-router` works exactly as Express [Router].
If you're not family with Express Router API, please see [Router] documentation.

### Installation

`express-async-router` can be installed using NPM:

```shell
$ npm install express-async-router --save
```

### Usage

First import `express-async-router` in your project:

```javascript
var AsyncRouter = require("express-async-router").AsyncRouter;
```

Then instanciate `AsyncRouter`:

```javascript
var router = AsyncRouter();
```

You're ready to use `AsyncRouter` the same way as Express [Router] but without worrying about `Promise`.

```javascript
router.get("/", function (req, res) {
	return myGetOperation()
		.then(myOtherOperation);
});

router.post("/:test", function (req, res) {
	return myParametrizedOperation(req.params.test)
		.then(myOtherOperation);
});

router.use(function (req, res) {
	return myMiddlewareOperation()
		.then(myOtherOperation);
});
```

## Options

`express-async-router` works exactly as Express [Router] so it can take the same options plus some additionnals to manage how request is sent.

By default, `express-async-router` sends the Promise result by using `res.send(result)` if headers was not already sent. You can customize this behavior by passing `sender` option when creating `AsyncRouter`.

### options.send

**Type**: `boolean` | **Default**: `true`

If set to `false`, `AsyncRouter` will never try to send `Promise` result.

### options.sender

**Type**: `(req, res, value) => Thenable` | **Default**: `function (req, res, value) { res.send(value); }`

If set, it will override the default `AsyncRouter` `sender` function.


Examples:

```javascript
var router = AsyncRouter({ send: false });
```
Or

```javascript
var router = AsyncRouter({ sender: mySender });

function mySender(req, res, value) { 
	res.rend(value.template, value.data); 
}

router.get("/", function () {
	return myOperation().then(function (data) {
		return {
			template: "index",
			data: data
		};
	});
});
```

### send

## Promise handling

`express-async-router` automatically handles Promises when it can.

### param(name: string, handler: (req, res, param) => Thenable)

A special `Router.param` override which automatically calls `next` function when returned `Promise` resolves.
If returned `Promise` rejects, rejected `Error` is transfered to `next` function.
If result is not a `Promise`, `next` function is immediatelly called.

Example:
```javascript
router.param("test", function (req, res, param) {
	return getTestEntity(param)
		.then(function(entity) {
			req.test = entity;
		});
});
```

### _[method]_(name: string, handler: (req, res) => Thenable)

A `Router[method]` wrapper which automatically calls `next` function when returned `Promise` resolves.
If returned `Promise` rejects, rejected `Error` is transfered to `next` function.
If result is not a `Promise`, `next` function is immediatelly called.

Examples:
```javascript
router.get("/", function () {
	return getTestEntities();
});

router.post("/:test", function (req) {
	return getTestEntity(req.params.test);
});
```

### use(...handlers[]: (req, res) => Thenable)
### use(name: string | RegExp | string[], ...handlers[]: (req, res) => Thenable)

A `Router.use` wrapper which automatically calls `next` function when returned `Promise` resolves.
If returned `Promise` rejects, rejected `Error` is transfered to `next` function.
If result is not a `Promise`, `next` function is immediatelly called.

__NOTE: If you declare 3 arguments in your function, `next` will only be called when an error occured.__

Examples:
```javascript
router.use(function (req) {
	return validateToken(req.header("MyCustomToken"))
		.then(function (user) {
			req.user = user;
		});
});

router.use("/test", function (req) {
	return validateToken(req.header("MyCustomToken"))
		.then(function (user) {
			req.user = user;
		});
});

router.use(myCustomAuth, serveStatic(__dirname + "/public"), function (req) {
	return logToServer(req)
		.then(function () {
			console.log(req);
		});
});

```

### use(...handlers[]: (err, req, res, next) => Thenable)
### use(name: string | RegExp | string[], ...handlers[]: (err, req, res, next) => Thenable)

A `Router.use` wrapper for Error handling which automatically calls `next` function when returned `Promise` resolves.
If returned `Promise` rejects, rejected `Error` is transfered to `next` function.
If result is not a `Promise`, `next` function is immediatelly called.

__WARNING: You must declare the 4 arguments to your function to be recognized as an Error handler. This is for compatibility with Native Middlewares.__

Examples:
```javascript
router.use(function (err, req, res, next) {
	return logError(err)
		.then(function () {
			console.error(err);
			res.send(500, "An error occured!");
		});
});

router.use("/test", function (err, req, res, next) {
	return logError(err)
		.then(function () {
			console.error(err);
			res.send(500, "An error occured!");
		});
});

router.use(function (err, req, res, next) {
	return logError(err)
		.then(function () {
			console.error(err);
			res.send(500, "An error occured!");
		});
});
```

## Contribute

### Install Global Dependencies

`express-router-async` needs some development dependencies:

* [Grunt](http://gruntjs.com)
* [tsd](http://definitelytyped.org/tsd/)

```shell
$ npm install -g grunt-cli tsd
```

### Install Project dependencies

```shell
$ npm install
```

### Build project

```shell
$ grunt
```


[Express]: http://expressjs.com/
[Router]: http://expressjs.com/4x/api.html#router