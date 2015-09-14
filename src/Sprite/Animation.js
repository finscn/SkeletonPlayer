"use strict";

var Sprite = Sprite || {};

(function(exports) {

    var ImagePool = exports.ImagePool;
    var ImageMapping = exports.ImageMapping;
    var AnimationPool = exports.AnimationPool;
    var Frame = exports.Frame;

    var Animation = function(options) {
        for (var p in options) {
            this[p] = options[p];
        }
    };

    var proto = {

        constructor: Animation,

        x: 0,
        y: 0,
        ox: 0,
        oy: 0,
        parent: null,

        loop: false,
        framesData: null,

        frames: null,
        duration: 0,
        played: 0,
        frameCount: -1,
        startIndex: 0,
        endIndex: Infinity,

        currentFrame: null,
        currentIndex: -1,
        currentEndTime: -1,
        paused: false,

        rawData: null,

        init: function() {
            this.frames = this.frames || this.getFramesConfig();
            this.frameCount = this.frames.length;
            this.endIndex = Math.min(this.endIndex, this.frameCount - 1);

            if (this.frameCount > 0) {
                var time = 0;
                var prevFrame;
                for (var i = 0; i < this.frameCount; i++) {
                    var frame = new Frame(this.frames[i]);
                    frame.animation = this;
                    if (frame.duration) {
                        frame.startTime = time;
                        frame.endTime = time + frame.duration;
                    }
                    frame.init();
                    time += frame.duration;
                    this.frames[i] = frame;
                }
                this.duration = this.duration || time;
                this.reset();
            } else {
                this.duration = this.duration || 0;
            }
        },

        setRawData: function(rawData) {
            this.rawData = JSON.parse(JSON.stringify(rawData));
        },

        getFramesConfig: function() {
            var frames = JSON.parse(JSON.stringify(this.framesData));
            return frames || [];
        },

        reset: function() {
            this.played = 0;
            this.setFrame(0);
        },

        start: function() {
            this.setFrame(0);
            this.paused = false;
        },

        getImgInfo: function(imgName) {
            var img = ResourcePool.get(imgName);
            return {
                img: img,
                x: 0,
                y: 0,
                w: img.width,
                h: img.height,
            };
        },

        setFrame: function(index) {
            this.currentIndex = index;
            this.currentFrame = this.frames[index];
            if (!this.currentFrame) {
                console.log("error Animation Index", index, this.frameCount);
            }
            this.currentEndTime = this.currentFrame.endTime;
        },

        setTime: function(time) {
            time = time % this.duration;
            var index = 0;
            for (var i = this.endIndex; i >= 0; i--) {
                var frame = this.frames[i];
                if (time >= frame.startTime) {
                    index = i;
                    break;
                }
            }
            this.played = time;
            this.setFrame(index);
        },

        update: function(timeStep) {
            if (this.paused) {
                return false;
            }
            var last = this.currentIndex;
            if (this.played >= this.currentEndTime) {
                if (this.currentIndex === this.endIndex) {
                    this.onEnd && this.onEnd(timeStep);
                    if (this.loop === true || --this.loop > 0) {
                        this.played = 0;
                        this.currentIndex = this.startIndex;
                    }
                } else {
                    this.currentIndex++;
                    this.played += timeStep;
                }
                this.setFrame(this.currentIndex);

            } else {
                this.played += timeStep;
            }
            return last !== this.currentIndex;
        },

        onEnd: null,

        render: function(context) {

            var x, y;
            var frame = this.currentFrame;
            // var flip = 1;
            if (this.flip) {
                // flip = -1;
                context.save();
                context.translate(this.x, this.y);
                context.scale(-1, 1);
                x = this.ox;
                y = this.oy;
            } else {
                x = this.x + this.ox;
                y = this.y + this.oy;
            }
            frame.render(context, x, y);
            if (this.debug) {
                frame.renderAABB(context, x, y);
                frame.renderPieceBorder(context, x, y);
                context.strokeRect(x - 2, y - 2, 4, 4);
            }
            if (this.flip) {
                // context.scale(-1, 1);
                context.restore();
            }
        }
    };


    for (var p in proto) {
        Animation.prototype[p] = proto[p];
    }

    exports.Animation = Animation;

})(Sprite);
