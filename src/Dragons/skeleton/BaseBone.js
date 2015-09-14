"use strict";

var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var DisplaySkin = exports.DisplaySkin;

    var BaseBone = GT.Class.create({
        superclass: BaseElement,

        name: "boneName", // 骨骼名称
        length: 0, //【可选属性】骨骼长度，默认0
        parentName: null, // 父骨骼名称
        transform: null, // 骨骼的属性参数（属性可选）// x：X轴坐标偏移, y: Y轴坐标偏移，默认0 // scX:X轴缩放值，scY:Y轴缩放值，默认1  // skX:X轴旋转值，skY:Y轴旋转值, 默认0

        skeleton: null,
        parent: null,
        slots: null,

        init: function() {
            Composite.apply(this);

            this.setRawData(this.rawData);
            this.initAttributes([
                "name",
                "length",

                ["parent", null, "parentName"],
            ]);
            this.initAttribute("id", this.name);

            this.setTransform(this.rawData.transform);

            this.slots = [];
        },

        updateRelational: function() {
            var boneMap = this.skeleton.boneMap;
            var parentBone = boneMap[this.parentName];
            if (parentBone) {
                parentBone.addChild(this);
            }
        },

    });

    exports.BaseBone = BaseBone;

}(Dragons))
