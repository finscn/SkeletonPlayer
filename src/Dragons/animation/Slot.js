"use strict";

var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var SlotFrame = exports.SlotFrame;

    var Slot = GT.Class.create({
        superclass: BaseElement,

        name: null,
        parent: null, // bone
        skin: null,

        scale: 1,
        offset: 0,

        init: function() {

            this.setRawData(this.rawData);
            this.initAttributes([
                "name",
                "scale",
                "offset",
            ]);
            this.initAttribute("id", this.name);

            var Me = this;

            this.baseSlot = this.skeleton.slotMap[this.name];
            this.parentName = this.baseSlot.parentName;
            this.parent = this.animation.boneMap[this.parentName];
            this.parent.slots.push(this);

            this.displayNodes = [];
            this.baseSlot.displayNodes.forEach(function(displayNode) {
                Me.displayNodes.push(displayNode.clone());
            });

            this.initFrames(this.rawData.frame);

        },

        initFrames: function(frames) {
            var Me = this;
            this.frames = [];
            if (!frames) {
                return;
            }
            var startIndex = 0;
            frames.forEach(function(frameData) {
                var frame = new SlotFrame({
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

        getPlayFrame: function(frameIndex) {

            var info = this.getFrameTweenInfo(frameIndex);
            var displayIndex = this.baseSlot.displayIndex || 0;
            var alpha = 1;
            if (info && info.prevFrame) {
                displayIndex = info.prevFrame.displayIndex || 0;
                if (displayIndex < 0) {
                    // console.log(info.prevFrame.rawData)
                    return null;
                }
                var color = this.getTweenColor(info.prevFrame, info.nextFrame, info.passedPercent);
                alpha = color.aM / 100;
            }
            if (displayIndex < 0) {
                return null;
            }
            var skin = this.displayNodes[displayIndex];
            var matrix = new Matrix(1, 0, 0, 1, 0, 0);
            matrix.concat(skin.matrix);
            matrix.concat(this.parent.frameMatrix[frameIndex]);

            var frame = {
                parent: this,
                imgName: skin.name,
                matrix: matrix,
                alpha: alpha,
                displayIndex: displayIndex,
                slotZ: skin.parent.z || 0,
            };
            return frame;
        },


    });

    exports.Slot = Slot;

}(Dragons));
