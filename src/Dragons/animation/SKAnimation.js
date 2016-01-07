"use strict";

var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var DisplaySkin = exports.DisplaySkin;

    var Bone = exports.Bone;
    var Slot = exports.Slot;

    var MainFrame = exports.MainFrame;
    var BoneFrame = exports.BoneFrame;
    var SlotFrame = exports.SlotFrame;

    var SKAnimation = GT.Class.create({
        superclass: BaseElement,

        name: null, // 动画名称
        duration: 0, // 动画总帧数
        fadeInTime: 0, //【可选属性】淡入时间，默认为0
        scale: 1, //【可选属性】动画时间轴的缩放，默认为1，数值越大，播放时间越长, 目前DB Pro暂未实现
        playTimes: 1, //【可选属性】播放次数，默认为1，0是无限循环

        frames: null,
        bones: null,
        slots: null,

        skeleton: null,
        rawData: null,

        init: function() {
            this.setRawData(this.rawData);
            this.initAttributes([
                "name",
                "duration",
                "fadeInTime",
                "scale",
                "playTimes",
            ]);
            this.initAttribute("id", this.name);

            // frames: null,
            // bones: null,
            // slots: null,
            this.initBones(this.rawData.bone);
            this.initSlots(this.rawData.slot);

            this.initFrames(this.rawData.frame);

        },

        initFrames: function(frames) {
            var Me = this;
            this.frames = [];
            var startIndex = 0;
            frames.forEach(function(frameData) {
                var frame = new MainFrame({
                    animation: Me,
                    skeleton: Me.skeleton,
                    rawData: frameData,
                });
                frame.init();
                frame.startIndex = startIndex;
                startIndex = frame.endIndex = (frame.duration || 0.11) + startIndex;
                Me.frames.push(frame);
            });
        },

        initBones: function(bones) {
            var Me = this;
            this.bones = [];
            this.boneMap = {};
            bones.forEach(function(boneData) {
                var bone = new Bone({
                    animation: Me,
                    skeleton: Me.skeleton,
                    rawData: boneData
                });
                bone.init();
                Me.bones.push(bone);
                Me.boneMap[bone.name] = bone;
            });

            this.topBones = [];
            this.topBoneMap = {};
            this.bones.forEach(function(bone) {
                bone.updateRelational();
                if (!bone.parent) {
                    Me.topBones.push(bone);
                    Me.topBoneMap[bone.name] = bone;
                }
            });

        },

        initSlots: function(slots) {
            var Me = this;
            this.slots = [];
            slots.forEach(function(slotData) {
                var slot = new Slot({
                    animation: Me,
                    skeleton: Me.skeleton,
                    rawData: slotData
                });
                slot.init();
                Me.slots.push(slot);
            });
        },

        prepareFrame: function(index) {
            this.topBones.forEach(function(bone) {
                bone.prepareFrame(index);
            });
        },


        renderFrame: function(context, frame, x, y) {

            var img = frame.imgInfo.img;

            // if (frame.matrix) {
            context.save();

            var matrix = frame.matrix;

            context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx + x, matrix.ty + y);
            // context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx + x, matrix.ty + y);

            context.globalAlpha = frame.alpha;
            context.drawImage(img, -img.width / 2, -img.height / 2);
            context.globalAlpha = 1;

            context.restore();

            this.strokePoly(context, frame.oobb, "red", x, y);

        },

        getAnimationData: function(duration, FPS, invert) {
            var frameCount = FPS * duration / 1000;
            var timeStep = duration / frameCount;
            var frameStep = this.duration / frameCount;
            var frameIndex = 0,
                time = 0;
            var frames = [];
            for (var i = 0; i < frameCount; i++) {
                this.prepareFrame(frameIndex);
                var frame = {
                    duration: timeStep,
                    pieces: []
                };

                var minX = Infinity,
                    maxX = -Infinity;
                var minY = Infinity,
                    maxY = -Infinity;
                this.slots.forEach(function(slot) {
                    var slotFrame = slot.getPlayFrame(frameIndex);
                    if (!slotFrame) {
                        return;
                    }
                    var piece = {
                        displayIndex: slotFrame.displayIndex,
                        slotZ: slotFrame.slotZ,
                        imgName: slotFrame.imgName,
                        matrix: slotFrame.matrix,
                        alpha: slotFrame.alpha,
                        ox: slotFrame.ox,
                        oy: slotFrame.oy,
                        oobb: slotFrame.oobb,
                    };
                    piece.oobb.forEach(function(p) {
                        if (p[0] < minX) {
                            minX = p[0];
                        } else if (p[0] > maxX) {
                            maxX = p[0];
                        }
                        if (p[1] < minY) {
                            minY = p[1];
                        } else if (p[1] > maxY) {
                            maxY = p[1];
                        }
                    });
                    // console.log(piece.matrix);
                    frame.pieces.push(piece);
                });
                frame.pieces.sort(function(a, b) {
                    return a.slotZ - b.slotZ;
                });
                frame.aabb = [
                    minX, minY, maxX, maxY
                ];
                frames.push(frame);
                time += timeStep;
                frameIndex += frameStep;
            }

            if (invert) {
                for (var i = frames.length - 2; i > 0; i--) {
                    frames.push(frames[i]);
                }
            }
            var animation = {
                framesData: frames,
                loop: this.playTimes === 0 ? true : this.playTimes - 1,
            };
            return animation;
        }

    });

    exports.SKAnimation = SKAnimation;

}(Dragons))
