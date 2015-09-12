"use strict";

var SKP = SKP || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var BoneFrame = exports.BoneFrame;

    var Bone = GT.Class.create({
        superclass: BaseElement,

        neme: null,
        scale: 1,
        offset: 0,
        pX: 0,
        pY: 0,

        parent: null,
        keyFrames: null,
        animation: null,
        skeleton: null,

        absolute: null,

        init: function() {
            Composite.apply(this);
            this.setRawData(this.rawData);
            this.initAttributes([
                "name",
                "scale",
                "offset",
                "pX",
                "pY",
            ]);
            this.initAttribute("id", this.name);
            this.baseBone = this.skeleton.boneMap[this.name];
            this.slots = [];
            this.frameMatrix = {};

            this.initFrames(this.rawData.frame);
        },

        initFrames: function(frames) {
            var Me = this;
            this.frames = [];
            var startIndex = 0;
            frames.forEach(function(frameData) {
                var frame = new BoneFrame({
                    parent: Me,
                    animation: Me.animation,
                    skeleton: Me.skeleton,
                    rawData: frameData
                });
                frame.init();
                frame.startIndex = startIndex;
                startIndex = frame.endIndex = frame.duration + startIndex;
                Me.frames.push(frame);
            });
        },

        updateRelational: function() {
            var boneMap = this.animation.boneMap;
            var parentName = this.baseBone.parentName
            var parentBone = boneMap[parentName];
            if (parentBone) {
                parentBone.addChild(this);
            }
        },

        prepareFrame: function(index, parentMatrix) {
            var info = this.getFrameTweenInfo(index);
            // {
            //     passed: passed,
            //     duration: prevFrame.duration,
            //     t: passed / prevFrame.duration,
            //     prevFrame: prevFrame,
            //     nextFrame: nextFrame
            // }
            var transform = this.getDefaultTransform();
            if (info) {
                transform = this.getTweenTransform(info.prevFrame, info.nextFrame, info.t)
            }
            var frame = new BoneFrame({
                parent: this,
            });
            frame.transform = transform;

            var matrix = this.frameMatrix[index] = frame.createMatrix(parentMatrix);
            this.children.forEach(function(child) {
                child.prepareFrame(index, matrix);
            });
        },

    });

    exports.Bone = Bone;

}(SKP))
