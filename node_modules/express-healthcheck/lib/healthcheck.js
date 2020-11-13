module.exports = function (options) {
    options = options || {};
    options.test = options.test || function () {};
    if (typeof options.test !== 'function') {
        throw new Error('express-healthcheck `test` method must be a function');
    }
    options.healthy = options.healthy || function () {
        return { uptime: process.uptime() };
    };
    if (typeof options.healthy !== 'function') {
        throw new Error('express-healthcheck `healthy` method must be a function');
    }
    if (options.test.length === 0) {
        var test = options.test;
        options.test = function (callback) {
            callback(test());
        };
    }
    return function (req, res, next) {
        try {
            options.test(function (err) {
                var status = 200,
                    response = options.healthy();
                if (err) {
                    status = 500;
                    response = err;
                }
                res.status(status).json(response);
            });
        } catch (e) {
            res.status(500).json(e);
        }
    };
};
