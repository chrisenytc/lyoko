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

var Datastore = require('nedb'),
    debug = require('./debugger.js');

module.exports = function databaseManager() {
    //Database storage
    var databases = {};
    //Instances
    databases.users = new Datastore({
        filename: __dirname + '/db/users.db',
        autoload: true
    });
    //Show connection message
    debug('Databases started', 'success');

    return databases;
};
