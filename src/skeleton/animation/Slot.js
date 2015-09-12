"use strict";

var SKP = SKP || {};

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

            this.displaySkins = [];
            this.baseSlot.displaySkins.forEach(function(displaySkin) {
                Me.displaySkins.push(displaySkin.clone());
            });

            this.initFrames(this.rawData.frame);

        },

        initFrames: function(frames) {
            var Me = this;
            this.frames = [];
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
            var displayIndex = 0;
            if (info) {
                displayIndex = info.prevFrame.displayIndex || 0;
            }
            var skin = this.displaySkins[displayIndex];

            var matrix = new Matrix(1, 0, 0, 1, 0, 0);
            matrix.concat(skin.matrix);
            matrix.concat(this.parent.frameMatrix[frameIndex]);

            var frame = {
                parent: this,
                skin: skin,
                matrix: matrix,
            };

            var poly = [
                matrix.transformPoint(skin.aabb[0], skin.aabb[1]),
                matrix.transformPoint(skin.aabb[2], skin.aabb[1]),
                matrix.transformPoint(skin.aabb[2], skin.aabb[3]),
                matrix.transformPoint(skin.aabb[0], skin.aabb[3]),
            ];
            frame.oobb = poly;
            return frame;
        },


    });

    exports.Slot = Slot;

}(SKP))
