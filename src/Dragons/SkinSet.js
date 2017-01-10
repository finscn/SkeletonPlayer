"use strict";

var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var DisplayNode = exports.DisplayNode;

    var SkinSet = GT.Class.create({
        superclass: BaseElement,

        name: null,

        skeleton: null,
        displayNodes: null,

        init: function() {
            this.setRawData(this.rawData);
            this.initAttribute("name");
            this.initAttribute("id", this.name);

            this.initDisplayNodes(this.rawData.slot);
        },

        initDisplayNodes: function(slots) {
            var Me = this;
            this.displayNodes = [];
            this.displayNodeMap = {};

            slots.forEach(function(slotData) {
                Me.initDisplayNode(slotData);
            });
        },

        initDisplayNode: function(slotData) {
            var Me = this;
            var displayNodes = slotData.display;
            displayNodes.forEach(function(displayNodeData) {
                var displayNode = new DisplayNode({
                    parentName: slotData.name,
                    skeleton: Me.skeleton,
                    rawData: displayNodeData
                });
                displayNode.init();
                Me.displayNodeMap[displayNode.name] = true;
                Me.displayNodes.push(displayNode);
            });

        }
    });

    exports.SkinSet = SkinSet;

}(Dragons))
