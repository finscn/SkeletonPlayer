"use strict";

var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;

    var BoneFrame = GT.Class.create({
        superclass: BaseElement,

        duration: 1,
        event: null,
        sound: null,
        tweenEasing: 0,

        // TODO
        tweenRotate: 0,
        spin: 0,

        transform: null,
        curve: null,

        parent: null,

        init: function() {
            if (this.rawData){
                this.setRawData(this.rawData);
                this.initAttributes([
                    "duration",
                    "event",
                    "sound",
                    "tweenRotate",
                ]);
                this.setTransform(this.rawData.transform);
                this.setTweenEasing(this.rawData.tweenEasing);
                this.setTweenCurve(this.rawData.curve);
            }

        },

        createMatrix: function(parentMatrix) {
            var scaleX = this.transform.scaleX;
            var scaleY = this.transform.scaleY;
            var rotation = this.transform.rotation;
            var x = this.transform.x;
            var y = this.transform.y;

            var baseBone = this.parent ? this.parent.baseBone : null;
            if (baseBone && baseBone.transform) {
                scaleX *= baseBone.transform.scaleX;
                scaleY *= baseBone.transform.scaleY;
                rotation += baseBone.transform.rotation;
                x += baseBone.transform.x;
                y += baseBone.transform.y;
            }

            var matrix = new Matrix(1, 0, 0, 1, 0, 0);
            matrix.scale(scaleX, scaleY);
            matrix.rotate(rotation);
            matrix.translate(x, y);

            if (parentMatrix) {
                matrix.concat(parentMatrix);
            }

            return matrix;
        },

    });

    exports.BoneFrame = BoneFrame;

}(Dragons));
