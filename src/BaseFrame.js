"use strict";

var SKP = SKP || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;

    // parent = Slot/Bone/DisplaySkin/Animation

    var BaseFrame = GT.Class.create({
        superclass: BaseElement,

        duration: 1,
        parent: null,


    });

    exports.BaseFrame = BaseFrame;

}(SKP))
