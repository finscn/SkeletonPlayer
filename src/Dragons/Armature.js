var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var DisplayNode = exports.DisplayNode;
    var BoneFrame = exports.BoneFrame;

    // TODO
    var Armature = GT.Class.create({
        superclass: DisplayNode,

        type: "armature",

        pivot: undefined,

        // 子骨架指向的骨架名、网格包含的贴图名 (可选属性 默认: null, 仅对子骨架、网格有效)
        path: "path",
    });

    exports.Armature = Armature;

}(Dragons));
