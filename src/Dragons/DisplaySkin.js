"use strict";

var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;

    var DisplaySkin = GT.Class.create({
        superclass: BaseElement,

        name: "displayName",
        type: "image", // image / armature
        transform: null, // x, y, skX, skY, scX, scY

        parentName: null,
        skeleton: null,
        skinSet: null,
        rawData: null,

        parent: null, // slot

        init: function() {
            this.setRawData(this.rawData);
            this.initAttribute("name");
            this.initAttribute("type");
            this.initAttribute("id", this.name);
            this.setTransform(this.rawData.transform);
            this.updateRelational();
        },

        updateRelational: function() {
            var slotMap = this.skeleton.slotMap;
            var parentSlot = slotMap[this.parentName];
            if (parentSlot) {
                this.parent = parentSlot;
                parentSlot.addDisplaySkin(this);
            }
        },

        clone: function() {
            var displaySkin = new DisplaySkin({
                parentName: this.parentName,
                skeleton: this.skeleton,
                rawData: this.rawData
            });
            displaySkin.init();
            return displaySkin;
        },

    });

    exports.DisplaySkin = DisplaySkin;

}(Dragons))
