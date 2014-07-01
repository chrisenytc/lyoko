'use strict';

/*
 * Module Dependencies
 */

var util = require('util');

module.exports = function(app, db, config) {
    //Root Application
    var ApplicationController = app.getLib('baseApplication');

    function IndexController() {
        ApplicationController.call(this);
    }

    util.inherits(IndexController, ApplicationController);

    IndexController.prototype.index = {
        on: function(data) {
            //Create socket instance
            var socket = this;
            //Callback handler

            function callback(err, result, msg) {
                if (err) {
                    return socket.send(['index', 'list'], {
                        error: err
                    });
                }
                if (!result) {
                    return socket.send(['index', 'list'], {
                        error: msg
                    });
                }
                return socket.send(['index', 'list'], result);
            }

            return callback(null, {welcome: 'Welcome to Lyoko', data: data});
        }
    };

    return IndexController;
};
