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

var Lyoko = require('./lyoko.js'),
    lyoko = new Lyoko(),
    debug = require('./debugger.js'),
    banner = require('./banner.js');

exports.run = function (port) {
    if (process.env.NODE_ENV !== 'test') {
        //Banner
        banner();
    }
    //Load dependencies
    lyoko.loader();
    //Start
    lyoko.loadSockets(process.env.PORT || port || 8081, function () {
        debug('Server running on port '.green + ' [ ' + String(process.env.PORT || port || 8081).bold + ' ]', 'success');
    });
};
