"use strict";

var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;

    var MainFrame = GT.Class.create({
        superclass: BaseElement,

        duration: 1,
        event: null,
        sound: null,
        action: null,

        animation: null,
        skeleton: null,

        parent: null,

        init: function() {
            this.setRawData(this.rawData);
            this.initAttributes([
                "duration",
                "event",
                "sound",
                "action",
            ]);
        },

    });

    exports.MainFrame = MainFrame;

}(Dragons))
