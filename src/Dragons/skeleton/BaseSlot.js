"use strict";

var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var DisplayNode = exports.DisplayNode;


    var BaseSlot = GT.Class.create({
        superclass: BaseElement,

        name: "slotName",
        z: 0,
        parentName: null, // parent: "boneName"
        displayIndex: 0,

        skeleton: null,
        parent: null, // bone
        displayNodes: null,

        blendMode: null,
        color: null,

        init: function() {
            this.setRawData(this.rawData);
            this.initAttributes([
                "name",
                "displayIndex",
                "z", ["parent", null, "parentName"],
            ]);

            this.setColorOffset(this.rawData.color);

            this.displayNodeMap = {};
            this.displayNodes = [];

            this.updateRelational();
        },

        addDisplayNode: function(displayNode) {
            if (displayNode && !this.displayNodeMap[displayNode.name]) {
                this.displayNodeMap[displayNode.name] = true;
                this.displayNodes.push(displayNode);
            }
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
