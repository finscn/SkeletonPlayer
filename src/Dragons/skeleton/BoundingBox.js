var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var DisplayNode = exports.DisplayNode;
    var BoneFrame = exports.BoneFrame;

    // TODO
    var BoundingBox = GT.Class.create({
        superclass: DisplayNode,

        type: "boundingBox",

        // type = boundingBox :
        subType : "rectangle", // ellipse / polygon
        width : 0, // for rectangle & ellipse
        height : 0, // for rectangle & ellipse
        color: 0,
        vertices: null, // [] ; for type = boundingBox & subType = polygon

    });

    exports.BoundingBox = BoundingBox;

}(Dragons));
