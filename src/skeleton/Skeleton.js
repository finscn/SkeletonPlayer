"use strict";

var SKP = SKP || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var DisplaySkin = exports.DisplaySkin;

    var BaseBone = exports.BaseBone;
    var BaseSlot = exports.BaseSlot;
    var BaseSkinSet = exports.BaseSkinSet;
    var Animation = exports.Animation;

    var Skeleton = GT.Class.create({
        superclass: BaseElement,

        name: "skeletonName",

        bones: null,
        slots: null,
        skinSets: null,
        animations: null,

        init: function() {
            this.setRawData(this.rawData);
            this.initAttribute("name");

            this.initBones(this.rawData.bone);
            this.initSlots(this.rawData.slot);
            this.initSkinSets(this.rawData.skin);

            this.initAnimations(this.rawData.animation);

        },

        initBones: function(bones) {
            var Me = this;
            this.bones = [];
            this.boneMap = {};
            bones.forEach(function(boneData) {
                var bone = new BaseBone({
                    skeleton: Me,
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
            this.slotMap = {};
            slots.forEach(function(slotData) {
                var slot = new BaseSlot({
                    skeleton: Me,
                    rawData: slotData
                });
                slot.init();
                Me.slots.push(slot);
                Me.slotMap[slot.name] = slot;
            });
            Me.slots.sort(function(a, b) {
                return a.z - b.z;
            });
        },

        initSkinSets: function(skinSets) {
            var Me = this;
            this.skinSets = [];
            this.skinSetMap = {};
            skinSets.forEach(function(skinSetData) {
                var skinSet = new BaseSkinSet({
                    skeleton: Me,
                    rawData: skinSetData
                });
                skinSet.init();
                Me.skinSets.push(skinSet);
                Me.skinSetMap[skinSet.name] = skinSet;
            });
        },

        initAnimations: function(animations) {
            var Me = this;
            this.animations = [];
            this.animationMap = {};
            animations.forEach(function(animationData) {
                var animation = new Animation({
                    skeleton: Me,
                    rawData: animationData
                });
                animation.init();
                Me.animations.push(animation);
                Me.animationMap[animation.name] = animation;
            });
        }
    });

    exports.Skeleton = Skeleton;

}(SKP))
