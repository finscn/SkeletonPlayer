"use strict";

var Sprite = Sprite || {};

(function(exports) {

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

        img: null,
        imageMapping: null,

        duration: 0,
        played: 0,
        frames: null,
        frameCount: -1,
        startIndex: 0,
        endIndex: Infinity,

        currentFrame: null,
        currentIndex: -1,
        currentEndTime: -1,
        paused: false,

        init: function() {
            this.frames = this.frames || this.getFramesConfig();
            this.frameCount = this.frames.length;
            this.endIndex = Math.min(this.endIndex, this.frameCount - 1);
            this.duration = this.duration || 0;

            if (this.frameCount > 0) {
                var frame = new Frame(this.frames[0]);
                this.frames[0] = frame;
                var time = 0;
                for (var i = 1; i < this.frameCount; i++) {
                    var nextFrame = new Frame(this.frames[i]);
                    if (frame.duration) {
                        frame.time = time;
                        frame.endTime = time + frame.duration;
                    } else {
                        frame.endTime = nextFrame.time;
                    }
                    frame.init();
                    time += frame.duration;

                    frame = nextFrame;
                    this.frames[i] = frame;
                }
                if (frame.duration) {
                    frame.time = time;
                    frame.endTime = time + frame.duration;
                }
                if (!this.duration && frame.endTime) {
                    this.duration = frame.endTime;
                } else if (!frame.endTime) {
                    frame.endTime = this.duration || time;
                }
                frame.init();

                this.reset();
            }
        },

        reset: function() {
            this.played = 0;
            this.setFrame(0);
        },

        getFramesConfig: function() {
            return [];
        },

        start: function() {
            this.setFrame(0);
            this.paused = false;
        },

        setFrame: function(index) {
            this.currentIndex = index;
            this.currentFrame = this.frames[index];
            if (!this.currentFrame) {
                // console.log("error Animation Index", index, this.frameCount);
            }
            this.currentEndTime = this.currentFrame.endTime;
        },

        setTime: function(time) {
            time = time % this.duration;
            var index = 0;
            for (var i = this.endIndex; i >= 0; i--) {
                var frame = this.frames[i];
                if (time >= frame.time) {
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
                    if (this.loop) {
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
