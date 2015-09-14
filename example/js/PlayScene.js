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
        this.skeleton = new Dragons.Skeleton({
            rawData: armature
        });
        this.skeleton.init();

        var anim = this.skeleton.animationMap["Run"];
        var animData = anim.getAnimationData(1500, 60);
        this.anim = new Sprite.Animation(animData)
        this.anim.init();
        this.anim.start();

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
        this.anim.update(timeStep, now);
        // if (this.cooldown <= -1) {

        // this.cooldown = 0;
        // // this.frameIndex += 0.2;
        // this.frameIndex += this.anim.duration / 50;
        // this.updateFrames();

        // } else {
        //     this.cooldown--;
        // }
    },


    render: function(context, timeStep, now) {
        var Me = this;
        var anim = this.anim;
        this.renderBg(context, timeStep, now);

        var x = Me.width / 2,
            y = Me.height / 2;

        context.fillStyle = "#666666";
        context.fillRect(0, y, this.width, 2);
        context.fillRect(x, 0, 2, this.height);

        this.anim.x = x;
        this.anim.y = y;
        this.anim.render(context, timeStep, now);

        context.translate(x, y);
        Utils.strokeAABB(context, anim.currentFrame.aabb, "blue");
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
        this.updateFrames(this.frameIndex);
        console.log(this.frameIndex)
    },

    handlePan: function(dx, dy, x, y, sx, sy, now) {

    },

    handleInput: function(x, y, now) {

    },

});
