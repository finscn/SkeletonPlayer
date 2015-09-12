"use strict";

var PlayScene = GT.Class.create({
    superclass: GT.Scene,

    x: 0,
    y: 0,

    name: "startScene",
    first: true,
    bgColor: "rgba(30,10,40,0.5)",
    init: function(game) {

        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;

        this.initBg();
        this.initUI(this.game);

        var Me = this;

        var data = DragonBonesData["Robot"];

        var armature = data.armature[0];
        this.skeleton = new SKP.Skeleton({
            rawData: armature
        });
        this.skeleton.init();

        window.skeleton = this.skeleton;
        window.animation = this.skeleton.animationMap["Run"];
        // window.animation = this.skeleton.animationMap["Walk"];

        this.frameIndex = 0;
        this.updateFrames();
        // var frameIndex = 0;
        // animation.prepareFrame(frameIndex);
        // this.frames = [];
        // animation.slots.forEach(function(slot) {
        //     var frame = slot.getPlayFrame(frameIndex);
        //     // console.log(frame.matrix);
        //     Me.frames.push(frame);
        // });
    },


    initBg: function() {

    },

    initUI: function(game) {
        var Me = this;

    },

    enter: function() {
        var Me = this;

    },

    leave: function() {

    },

    cooldown: 0,
    update: function(timeStep, now) {
        var Me = this;

        // if (this.cooldown <= -1) {
            this.cooldown = 0;
            this.frameIndex += 0.2;
            this.updateFrames();
        // } else {
        //     this.cooldown--;
        // }
    },

    updateFrames: function() {
        var Me = this;
        var frameIndex = (this.frameIndex) % animation.duration;
        animation.prepareFrame(frameIndex);
        this.frames = [];
        var minX = Infinity,
            maxX = -Infinity;
        var minY = Infinity,
            maxY = -Infinity;
        animation.slots.forEach(function(slot) {
            var frame = slot.getPlayFrame(frameIndex);
            frame.oobb.forEach(function(p) {
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
            // console.log(frame.matrix);
            Me.frames.push(frame);
        });
        animation.aabb = [
            minX, minY, maxX, maxY
        ];

    },

    render: function(context, timeStep, now) {

        var Me = this;
        this.renderBg(context, timeStep, now);

        var x = Me.width / 2,
            y = Me.height / 2;

        context.fillStyle = "#666666";
        context.fillRect(0, y, this.width, 2);
        context.fillRect(x, 0, 2, this.height);

        Me.frames.forEach(function(frame) {
            animation.renderFrame(context, frame, x, y);
        });
        context.translate(x, y);
        animation.strokeAABB(context, animation.aabb, "blue");
        context.translate(-x, -y);
        // Utils.renderEntities(this.monsters, context, timeStep, now);

    },

    renderBg: function(context, timeStep, now) {
        context.fillStyle = "rgba(200,200,200,1)";
        context.fillRect(0, 0, this.width, this.height);
        // context.drawImage(this.bgImg, this.bgX, this.bgY, this.bgW, this.bgH);
    },

    handleStart: function(x, y, now) {
        // var rs = this.page.checkTouch("onTouchStart", x, y, 1);

    },

    handleEnd: function(x, y, now) {
        // var rs = this.page.checkTouch("onTouchEnd", x, y, 1);

    },

    handleTap: function(x, y, now) {
        // var rs = this.page.checkTouch("onTap", x, y, 1);
        // if (!rs) {
        //     this.player.action(x, y);
        // }
        this.frameIndex += 0.25;
        this.updateFrames();
        console.log(this.frameIndex)
    },

    handlePan: function(dx, dy, x, y, sx, sy, now) {

    },

    handleInput: function(x, y, now) {

    },

});
