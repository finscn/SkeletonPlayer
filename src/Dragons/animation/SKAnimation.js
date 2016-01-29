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

        minDuration: 0.11,

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
                startIndex = frame.endIndex = (frame.duration || Me.minDuration) + startIndex;
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
            slots.forEach(function(slotData, idx) {
                var slot = new Slot({
                    _idx: idx,
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

        getMainFrame: function(index, startIndex) {
            startIndex = startIndex || 0;
            var keyFrame = null;
            for (var i = startIndex, len = this.frames.length; i < len; i++) {
                var frame = this.frames[i];
                // if (frame.startIndex <= index && index < frame.endIndex) {
                if (frame.startIndex <= index) {
                    keyFrame = frame;
                    break;
                }
            }
            return keyFrame;
        },

        // options : inverse, scale, allowSkipFrame, skinName ...
        getAnimationData: function(duration, FPS, options) {
            options = options || {};
            var inverse = options.inverse || false;
            var scaleX = options.scaleX || options.scale || 1;
            var scaleY = options.scaleY || options.scale || scaleX;
            var allowSkipFrame = options.allowSkipFrame || false;
            var skinName = options.skinName || "";

            var frameCount = FPS * duration / 1000;
            var timeStep = duration / frameCount;
            var frameStep = this.duration / frameCount;
            var frameIndexFloat = 0,
                time = 0;
            var frames = [];
            var mainFrameStart = 0;
            for (var i = 0; i < frameCount; i++) {
                this.prepareFrame(frameIndexFloat);
                var mainFrame = this.getMainFrame(frameIndexFloat, mainFrameStart);
                var frame = {
                    duration: timeStep,
                    pieces: []
                };
                if (mainFrame) {
                    mainFrameStart++;
                    frame.event = mainFrame.event;
                    frame.action = mainFrame.action;
                    frame.sound = mainFrame.sound;
                }

                // var minX = Infinity,
                //     maxX = -Infinity;
                // var minY = Infinity,
                //     maxY = -Infinity;
                this.slots.forEach(function(slot) {
                    var slotFrame = slot.getPlayFrame(frameIndexFloat);
                    if (!slotFrame) {
                        return;
                    }

                    var piece = {
                        displayIndex: slotFrame.displayIndex,
                        zIndex: slotFrame.slotZ,
                        slotName: slot.name,
                        imgName: slotFrame.imgName,
                        alpha: slotFrame.alpha,
                        matrix: slotFrame.matrix,
                        ox: slotFrame.ox,
                        oy: slotFrame.oy,
                    };

                    piece.ox *= scaleX;
                    piece.oy *= scaleY;
                    piece.matrix.tx *= scaleX;
                    piece.matrix.ty *= scaleY;

                    frame.pieces.push(piece);
                });
                frame.pieces.sort(function(a, b) {
                    var d = a.zIndex - b.zIndex;
                    return d == 0 ? a.displayIndex - b.displayIndex : d;
                });
                // frame.pieces.forEach(function(p) {
                //     delete p.displayIndex;
                // });

                // frame.aabb = [
                //     minX, minY, maxX, maxY
                // ];
                frames.push(frame);
                time += timeStep;
                frameIndexFloat += frameStep;
            }

            if (inverse) {
                for (var i = frames.length - 2; i > 0; i--) {
                    frames.push(frames[i]);
                }
            }
            var animation = {
                framesData: frames,
                skinName: skinName,
                loop: this.playTimes === 0 ? true : this.playTimes - 1,
            };
            return animation;
        },

    });

    exports.SKAnimation = SKAnimation;

}(Dragons))
