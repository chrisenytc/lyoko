'use strict';

/*
 * Module Dependencies
 */

var chai = require('chai'),
    ns = require('nssocket'),
    Bootstrap = require('../lib/core/bootstrap.js'),
    Lyoko = require('../lib/core/lyoko.js'),
    lyoko = new Lyoko(),
    expect = chai.expect;

describe('Lyoko framework', function () {

    describe('#constructor()', function () {

        it('should be a function', function () {

            expect(Lyoko).to.be.a('function');

        });

    });

    describe('#instance()', function () {

        it('should be a object', function () {

            expect(lyoko).to.be.a('object');

        });

    });

    describe('#connection()', function () {

        it('should be return a object from socket connection', function (done) {

            //Start test server
            Bootstrap.run(8081);

            var socket = new ns.NsSocket({
                reconnect: true,
                type: 'tcp4',
            });

            socket.on('start', function () {
                //Get data
                socket.data(['index', 'list'], function (data) {
                    expect(data).to.be.a('object');
                    socket.end();
                    done();
                });
                //Send data
                socket.send(['index', 'index'], {
                    dataFromClient: 'Hello Server :)'
                });

            });

            socket.connect(8081);

        });

    });

});
