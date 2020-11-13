var chai = require('chai');
chai.should();

var sinon = require('sinon');
chai.use(require('sinon-chai'));

var healthcheck = require('../lib/healthcheck');

describe('express-healthcheck', function () {

    it('exports a function', function () {
        healthcheck.should.be.a('function');
    });

    describe('middleware', function () {

        var req, res, next;

        beforeEach(function () {
            req = {};
            res = {
                json: sinon.stub(),
                status: sinon.stub()
            };
            res.status.returns(res);
            next = sinon.stub();
            sinon.stub(process, 'uptime').returns(100);
        });
        afterEach(function () {
            process.uptime.restore();
        });

        it('returns a middleware', function () {
            healthcheck().should.be.a('function');
            healthcheck().length.should.equal(3);
        });

        it('responds with json', function () {
            healthcheck()(req, res, next);
            res.json.should.have.been.calledOnce;
        });

        it('responds with 200 status', function () {
            healthcheck()(req, res, next);
            res.status.should.have.been.calledWith(200);
        });

        it('responds with process uptime as body', function () {
            healthcheck()(req, res, next);
            res.status.should.have.been.calledBefore(res.json);
            res.json.should.have.been.calledWith({ uptime: 100 });
        });

        describe('`test` method', function () {

            describe('when returning a value', function () {

                it('responds with 200 for falsy return values', function () {
                    healthcheck({
                        test: function () { return; }
                    })(req, res, next);
                    res.json.should.have.been.calledOnce;
                    res.status.should.have.been.calledOnce;
                    res.status.should.have.been.calledBefore(res.json);
                    res.status.should.have.been.calledWith(200);
                });

                it('responds with 500 for truthy return values', function () {
                    healthcheck({
                        test: function () { return true; }
                    })(req, res, next);
                    res.json.should.have.been.calledOnce;
                    res.status.should.have.been.calledOnce;
                    res.status.should.have.been.calledWith(500);
                    res.status.should.have.been.calledBefore(res.json);
                });

                it('responds with return value as body for truthy return values', function () {
                    healthcheck({
                        test: function () { return { error: true }; }
                    })(req, res, next);
                    res.json.should.have.been.calledOnce;
                    res.json.should.have.been.calledWith({ error: true });
                });

            });

            describe('when taking a callback', function () {

                it('responds with 200 for falsy callback values', function () {
                    healthcheck({
                        test: function (callback) { callback(); }
                    })(req, res, next);
                    res.json.should.have.been.calledOnce;
                    res.status.should.have.been.calledOnce;
                    res.status.should.have.been.calledBefore(res.json);
                    res.status.should.have.been.calledWith(200);
                });

                it('responds with 500 for truthy callback values', function () {
                    healthcheck({
                        test: function (callback) { callback(true); }
                    })(req, res, next);
                    res.json.should.have.been.calledOnce;
                    res.status.should.have.been.calledOnce;
                    res.status.should.have.been.calledBefore(res.json);
                    res.status.should.have.been.calledWith(500);
                });

                it('responds with return value as body for truthy return values', function () {
                    healthcheck({
                        test: function (callback) { callback({ error: true }); }
                    })(req, res, next);
                    res.json.should.have.been.calledOnce;
                    res.json.should.have.been.calledWith({ error: true });
                });

            });

            describe('when throwing', function () {

                it('responds with 200 if no error thrown', function () {
                    healthcheck({
                        test: function () {}
                    })(req, res, next);
                    res.json.should.have.been.calledOnce;
                    res.status.should.have.been.calledOnce;
                    res.status.should.have.been.calledBefore(res.json);
                    res.status.should.have.been.calledWith(200);
                });

                it('responds with 500 for truthy callback values', function () {
                    healthcheck({
                        test: function () { throw new Error('An error'); }
                    })(req, res, next);
                    res.json.should.have.been.calledOnce;
                    res.status.should.have.been.calledOnce;
                    res.status.should.have.been.calledBefore(res.json);
                    res.status.should.have.been.calledWith(500);
                });

                it('responds with return value as body for truthy return values', function () {
                    healthcheck({
                        test: function () { throw new Error('An error'); }
                    })(req, res, next);
                    res.json.should.have.been.calledOnce;
                    res.json.should.have.been.calledWith(new Error('An error'));
                });

            });

        });

        describe('`healthy` method', function () {

            it('responds with return value of method as response body', function () {
                healthcheck({
                    healthy: function () { return { everything: 'is ok' }; }
                })(req, res, next);
                res.json.should.have.been.calledWithExactly({ everything: 'is ok' });
            });

        });

    });

    it('integrates with an express server', function (done) {
      var app = require('express')();
      var request = require('supertest');
      app.use('/healthcheck', healthcheck());
      request(app)
        .get('/healthcheck')
        .expect(200)
        .expect(function (res) {
          res.body.should.have.property('uptime');
        })
        .end(done);
    });

});
