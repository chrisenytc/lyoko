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
    Banner = fs.readFileSync(__dirname + '/banner.txt', 'utf-8');

require('colors');

module.exports = function() {
    console.log();
    console.log(Banner.red.bold);
    console.log();
    console.log(' --------------------------------------------'.red);
    console.log('  A powerful tcp socket framework for node.js');
    console.log();
    console.log('  Repo => '.bold.white + 'https://github.com/chrisenytc/lyoko'.white);
    console.log();
    console.log('  Powered by => '.bold.white + 'Christopher EnyTC'.white);
    console.log();
    console.log(' --------------------------------------------'.red);
    console.log();
};