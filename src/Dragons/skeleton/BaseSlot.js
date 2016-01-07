"use strict";

var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var DisplaySkin = exports.DisplaySkin;


    var BaseSlot = GT.Class.create({
        superclass: BaseElement,

        name: "slotName",
        z: 0 ,
        parentName: null, // parent: "boneName"
        displayIndex: 0,

        skeleton: null,
        parent: null, // bone
        displaySkins: null,

        blendMode: null,
        color: null,

        init: function() {
            this.setRawData(this.rawData);
            this.initAttributes([
                "name",
                "displayIndex",
                "z",
                ["parent", null, "parentName"],
            ]);

            this.setColorOffset(this.rawData.color);

            this.displaySkins = [];

            this.updateRelational();
        },

        updateRelational: function() {
            var boneMap = this.skeleton.boneMap;
            var parentBone = boneMap[this.parentName];
            if (parentBone) {
                this.parent = parentBone;
                parentBone.slots.push(this);
            }
        },
    });

    exports.BaseSlot = BaseSlot;

}(Dragons))
