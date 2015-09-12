"use strict";

var SKP = SKP || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;

    var SlotFrame = GT.Class.create({
        superclass: BaseElement,

        duration: 1,
        displayIndex: 0,
        zOrder: 0,
        tweenEasing: 0,
        action: null,

        color: null, // color:  rM, gM, bM, aM,  rO, gO, bO, aO
        curve: null,

        parent: null,

        init: function() {
            this.setRawData(this.rawData);
            this.initAttributes([
                "duration",
                "displayIndex",
                "zOrder",
                "tweenEasing",
                "action",
            ]);
            this.setColorOffset(this.rawData.color);
            this.setTweenCurve(this.rawData.curve);

            this.computeAbsoluteColor();
        },

        computeAbsoluteColor: function() {
            var baseColor = this.parent.baseSlot.color;
            this.absoluteColor = {
                rO: baseColor.rO + this.color.rO,
                gO: baseColor.gO + this.color.gO,
                bO: baseColor.bO + this.color.bO,
                aO: baseColor.aO + this.color.aO,

                rM: baseColor.rM * this.color.rM,
                gM: baseColor.gM * this.color.gM,
                bM: baseColor.bM * this.color.bM,
                aM: baseColor.aM * this.color.aM,
            };
        },

    });

    exports.SlotFrame = SlotFrame;

}(SKP))
