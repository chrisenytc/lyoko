/*
 * lyoko
 * https://github.com/chrisenytc/lyoko
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

/*
 * Module Dependencies
 */

var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    debug = require('./debugger.js'),
    join = path.resolve,
    readdir = fs.readdirSync,
    exists = fs.existsSync,
    configStorage = {},
    serviceStorage = {};

/*
 * Public Methods
 */

/**
 * @class Lyoko
 *
 * @constructor
 *
 * Constructor responsible for provide a application server and helpers
 *
 * @example
 *
 *     var lyoko = new Lyoko();
 *
 */

var Lyoko = module.exports = function () {
    //Get version
    this.version = require('../../package.json').version;
    //Load files
    this.load = function (root, cb) {
        var fullPath = join(__dirname, '..', '..', 'api', root);
        var ENV = process.env.NODE_ENV || 'development';
        //
        if (root === 'config') {
            var configPath = join(fullPath, ENV);
            //Read this directory
            if (exists(configPath)) {
                readdir(configPath).forEach(function (file) {
                    if (fs.statSync(join(configPath, file)).isFile()) {
                        //Resolve file path
                        var filePath = join(configPath, file);
                        //Check if this file exists
                        if (exists(filePath)) {
                            //Run callback
                            var fileName = file.replace(/\.js$/, '');
                            fileName = fileName.replace(/\.json$/, '');
                            cb(filePath, fileName);
                        }
                    }
                });
            } else {
                console.log('ERROR: The '.red + ENV.white + ' environment not exists in api/config'.red);
                process.exit(0);
            }
        } else {
            //Read this directory
            readdir(fullPath).forEach(function (file) {
                if (fs.statSync(join(fullPath, file)).isFile()) {
                    //Resolve file path
                    var filePath = join(fullPath, file);
                    //Check if this file exists
                    if (exists(filePath)) {
                        //Run callback
                        var fileName = file.replace(/\.js$/, '');
                        fileName = fileName.replace(/\.json$/, '');
                        cb(filePath, fileName);
                    }
                }
            });
        }
    };
};

/**
 * Method responsible for load all dependencies
 *
 * @example
 *
 *     lyoko.loader();
 *
 * @method loader
 * @public
 */

Lyoko.prototype.loader = function loader() {
    //Load Settings
    this.load('config', function (filePath, fileName) {
        //Require configs
        var config = require(filePath);
        //Set Property
        configStorage[fileName] = config;
    });
    //Debug
    debug('Custom settings loaded', 'success');
    //Load WebServices
    this.load('services', function (filePath, fileName) {
        //Check if exists
        if (exists(filePath)) {
            //Require webservice
            var service = require(filePath);
            serviceStorage[fileName] = service;
        }
    });
    //Debug
    debug('Services loaded', 'success');
};

/**
 * Method responsible for get configs
 *
 * @example
 *
 *     lyoko.getConfig('fileName');
 *
 * @method getConfig
 * @public
 * @param {Object} fileName Name of config file
 */

Lyoko.prototype.getConfig = function getConfig(fileName) {

    if (fileName) {
        return configStorage[fileName] || null;
    } else {
        return configStorage;
    }
};

/**
 * Method responsible for get services
 *
 * @example
 *
 *     lyoko.getService('fileName');
 *
 * @method getService
 * @public
 * @param {Object} fileName Name of service file
 */

Lyoko.prototype.getService = function getService(fileName) {

    if (_.isFunction(serviceStorage[fileName])) {
        return serviceStorage[fileName].call(this) || null;
    }

    return serviceStorage[fileName] || null;
};

/**
 * Method responsible for get libs
 *
 * @example
 *
 *     lyoko.getLib();
 *
 * @method getLib
 * @public
 * @param {String} fileName Name of lib file
 */

Lyoko.prototype.getLib = function getLib(fileName) {
    //Load Lib
    return require(join(__dirname, '..', fileName));
};

/**
 * Method responsible for loadding sockets
 *
 * @example
 *
 *     lyoko.loadSockets(8081, function() {});
 *
 * @method loadSockets
 * @public
 * @param {Object} port Port of socket
 * @param {Function} cb Callback
 */

Lyoko.prototype.loadSockets = function (port, cb) {
    //Create Database
    var NS = require('nssocket'),
        DB = require(join(__dirname, 'database.js'))(),
        lyoko = new Lyoko(),
        loader = this;

    //Sockets
    NS.createServer(function (socket) {

        loader.load('sockets', function (filePath, fileName) {
            //Require configs
            var sockets = require(filePath)(lyoko, DB, lyoko.getConfig());
            //Load All Sockets
            _.each(sockets.prototype, function (s, key) {
                //Handle requests
                if (s.hasOwnProperty('on') && _.isFunction(s.on)) {
                    socket.data([fileName, key], s.on);
                }
                if (s.hasOwnProperty('send')) {
                    socket.send([fileName, key], s.send);
                }
            });
        });

        socket.on('end', function () {
            debug('Connection closed', 'error');
        });

    }).listen(port);

    //Run callback
    cb();
};
