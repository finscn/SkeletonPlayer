"use strict";

var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var DisplaySkin = exports.DisplaySkin;
    var SkinSet = exports.SkinSet;

    var BaseBone = exports.BaseBone;
    var BaseSlot = exports.BaseSlot;
    var SKAnimation = exports.SKAnimation;

    var Skeleton = GT.Class.create({
        superclass: BaseElement,

        name: "skeletonName",
        // TODO
        type: null,
        frameRate: 24,
        aabb: null,

        bones: null,
        slots: null,
        skinSets: null,
        animations: null,

        // TODO
        globalFrameRate: null,
        isGlobal: null,

        init: function() {
            this.rawData = this.rawData || this.json.armature[0];
            this.setRawData(this.rawData);

            this.initAttributes([
                "name",
                "type",
                "frameRate",
                "aabb"
            ]);

            this.initBones(this.rawData.bone);

            this.initSlots(this.rawData.slot);

            this.initSkinSets(this.rawData.skin);
            this.initAnimations(this.rawData.animation);
        },
        loadImage: function(file, callback) {
            var img = new Image();
            img.src = file;
            img.onload = function(event) {
                if (callback) {
                    callback(img, event)
                }
            };
            return img;
        },
        loadSkeletonJSON: function(file, async, callback) {
            var Me = this;
            this.loadJSON(file, async, function(json, xhr) {
                Me.json = json;
                Me.init();
                if (callback) {
                    callback(json, xhr);
                }
            });
        },
        loadTextureJSON: function(file, async, callback) {
            var Me = this;
            var imgMapping = {};
            this.loadJSON(file, async, function(json, xhr) {
                var name = json.name;
                var imagePath = json.imagePath;
                var subTexture = json.SubTexture;
                subTexture.forEach(function(t) {
                    var key = t.name;
                    var info = {
                        img: name,
                        x: t.x,
                        y: t.y,
                        w: t.width,
                        h: t.height,
                        ox: -t.frameX,
                        oy: -t.frameY,
                        sw: t.frameWidth,
                        sh: t.frameHeight,
                    };
                    imgMapping[key] = info;
                });
                if (callback) {
                    callback(imgMapping);
                }
            });
            return imgMapping;
        },

        loadJSON: function(url, async, callback) {

            async = !!async; // async=== false ? false : true;
            var method = "GET";
            var Me = this;
            var onResponse = function() {
                var text = xhr.responseText;
                var json = JSON.parse(text);
                if (callback) {
                    callback(json, xhr);
                }
            };
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, async);

            if (async) {
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        onResponse();
                    }
                }
            }
            xhr.send();
            if (!async) {
                onResponse();
            }
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
                var skinSet = new SkinSet({
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
                var animation = new SKAnimation({
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

}(Dragons))
