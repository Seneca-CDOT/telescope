"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var DEFAULT_SENDER = function (req, res, val) { res.send(val); }, SHORTCUTS_METHODS = ["all", "get", "post", "put", "delete", "patch", "options", "head"];
var ASYNC_MARKER = typeof Symbol !== "undefined" ? Symbol("ASYNC_MARKER") : "__ASYNC_MARKER__";
function AsyncRouter(options) {
    var sender = getSender(options), innerRouter = express.Router(options), asyncRouter = function () {
        return innerRouter.apply(this, arguments);
    };
    wrapAllMatchers(asyncRouter, sender, innerRouter);
    asyncRouter[ASYNC_MARKER] = true;
    asyncRouter.param = function param() {
        if (typeof arguments[1] === "function" && arguments[1].length === 3) {
            innerRouter.param(arguments[0], wrapParamHandler(arguments[1]));
            return this;
        }
        innerRouter.param.apply(innerRouter, arguments);
        return this;
    };
    asyncRouter.route = function route(path) {
        var r = innerRouter.route(path);
        wrapAllMatchers(r, sender);
        return r;
    };
    asyncRouter.use = function use() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        innerRouter.use.apply(innerRouter, args.map(function (arg) {
            if (Array.isArray(arg)) {
                return arg.map(function (a) { return isHandlerOrErrorHandler(a) ? wrapHandlerOrErrorHandler(a) : a; });
            }
            if (isHandlerOrErrorHandler(arg)) {
                return wrapHandlerOrErrorHandler(arg);
            }
            return arg;
        }));
        return this;
    };
    return asyncRouter;
}
exports.AsyncRouter = AsyncRouter;
function create(options) {
    return AsyncRouter(options);
}
exports.create = create;
function getSender(options) {
    if (!options) {
        return DEFAULT_SENDER;
    }
    var send = options.send, sender = options.sender;
    delete options.send;
    delete options.sender;
    if (send !== false) {
        return sender || DEFAULT_SENDER;
    }
}
function wrapAllMatchers(route, sender, router) {
    router = router || route;
    SHORTCUTS_METHODS.forEach(function (method) {
        route[method] = wrapMatcher(router, router[method], sender);
    });
}
function wrapMatcher(router, routerMatcher, sender) {
    var _this = this;
    return function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var last = args.length - 1, mappedArgs = args.map(function (arg, i) {
            if (i === last) {
                return wrapHandler(arg, sender);
            }
            if (Array.isArray(arg)) {
                return arg.map(function (a) { return isHandlerOrErrorHandler(a) ? wrapHandlerOrErrorHandler(a) : a; });
            }
            if (isHandlerOrErrorHandler(arg)) {
                return wrapHandlerOrErrorHandler(arg);
            }
            return arg;
        });
        routerMatcher.apply(router, [name].concat(mappedArgs));
        return _this;
    };
}
function wrapHandler(handler, sender) {
    return function (req, res, next) {
        try {
            next = once(next);
            toCallback(handler.call(this, req, res, next), next, req, res, function (result) {
                if (sender && !res.headersSent) {
                    return sender(req, res, result);
                }
            });
        }
        catch (err) {
            next(err);
        }
    };
}
function wrapParamHandler(handler) {
    return function (req, res, next, param) {
        try {
            next = once(next);
            toCallback(handler.call(this, req, res, param), next, req, res);
        }
        catch (err) {
            next(err);
        }
    };
}
function wrapHandlerOrErrorHandler(handler) {
    if (handler.length === 4) {
        return function (err, req, res, next) {
            try {
                next = once(next);
                toCallback(handler.call(this, err, req, res, next), next, req, res);
            }
            catch (err) {
                next(err);
            }
        };
    }
    return function (req, res, next) {
        try {
            next = once(next);
            toCallback(handler.call(this, req, res, next), next, req, res, handler.length === 3);
        }
        catch (err) {
            next(err);
        }
    };
}
function toCallback(thenable, next, req, res, end) {
    if (!thenable || typeof thenable.then !== "function") {
        thenable = Promise.resolve(thenable);
    }
    if (typeof end === "function") {
        thenable = thenable.then(end);
    }
    thenable.then(function () {
        if (next && !end && !res.headersSent) {
            next();
        }
    }, function (err) {
        if (typeof err === "string") {
            err = new Error(err);
        }
        next(err);
    });
}
function isHandlerOrErrorHandler(handler) {
    return typeof handler === "function" && handler[ASYNC_MARKER] !== true;
}
function once(fn) {
    var called = false;
    return function () {
        if (called) {
            return;
        }
        called = true;
        fn.apply(this, arguments);
    };
}
