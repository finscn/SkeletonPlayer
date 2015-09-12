"use strict";

var GT = GT || {};

(function(exports) {

    var State = function(cfg) {
        for (var key in cfg) {
            this[key] = cfg[key];
        }
    };

    State.prototype = {

        constructor: State,

        name: null,

        enter: function(entity, timeStep, now) {

        },
        execute: function(entity, timeStep, now) {

        },
        exit: function(entity, timeStep, now) {

        },
        suspend: function(entity, timeStep, now) {

        },
        resume: function(entity, timeStep, now) {

        },
        reset: function(entity, timeStep, now) {

        }
    };

}(GT));
