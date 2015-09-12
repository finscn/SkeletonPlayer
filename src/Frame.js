"use strict";

var SKP = SKP || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var Composite = exports.Composite;

    var KeyFrame = GT.Class.create({

        tweenEasing: 0,
        tweenRotate: 0,
        duration: 1,
        event: null,
        sound: null,
        action: null,
        transform: null,

        init: function() {

        },

    });

    exports.KeyFrame = KeyFrame;

}(SKP))
