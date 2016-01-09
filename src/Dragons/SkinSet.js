"use strict";

var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var DisplaySkin = exports.DisplaySkin;

    var SkinSet = GT.Class.create({
        superclass: BaseElement,

        name: null,

        skeleton: null,
        displaySkins: null,

        init: function() {
            this.setRawData(this.rawData);
            this.initAttribute("name");
            this.initAttribute("id", this.name);

            this.initDisplaySkins(this.rawData.slot);
        },

        initDisplaySkins: function(slots) {
            var Me = this;
            this.displaySkins = [];
            this.displaySkinMap = {};

            slots.forEach(function(slotData) {
                Me.initDisplaySkin(slotData);
            });
        },

        initDisplaySkin: function(slotData) {
            var Me = this;
            var displaySkins = slotData.display;
            displaySkins.forEach(function(displaySkinData) {
                var displaySkin = new DisplaySkin({
                    parentName: slotData.name,
                    skeleton: Me.skeleton,
                    rawData: displaySkinData
                });
                displaySkin.init();
                Me.displaySkinMap[displaySkin.name] = true;
                Me.displaySkins.push(displaySkin);
            });

        }
    });

    exports.SkinSet = SkinSet;

}(Dragons))
