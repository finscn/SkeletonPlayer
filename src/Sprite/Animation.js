"use strict";

var Sprite = Sprite || {};

(function(exports) {

    var Frame = exports.Frame;
    var ClassicFrame = exports.ClassicFrame;

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

        allowSkipFrame: true,

        duration: 0,
        played: 0,

        framesData: null,
        frames: null,
        frameCount: -1,
        startIndex: 0,
        endIndex: Infinity,

        currentFrame: null,
        currentIndex: -1,
        currentEndTime: -1,
        paused: false,

        img: null,

        skinName: null,
        skinAnchorCenter: false,
        FrameClass: Frame,
        classic: false,

        init: function() {
            if (this.classic) {
                this.FrameClass = ClassicFrame;
            }
            this.setAllowSkipFrame(this.allowSkipFrame);

            this.frames = this.frames || this.getFramesConfig();
            this.duration = this.duration || 0;
            this.frameCount = this.frames.length;
            this.endIndex = Math.min(this.endIndex, this.frameCount - 1);

            if (this.frameCount > 0) {
                var frame = this.createFrame(this.frames[0]);
                this.frames[0] = frame;
                var time = 0;
                for (var i = 1; i < this.frameCount; i++) {
                    var nextFrame = this.createFrame(this.frames[i]);
                    if (frame.duration) {
                        frame.startTime = time;
                        frame.endTime = time + frame.duration;
                    } else {
                        frame.endTime = nextFrame.startTime;
                    }
                    frame.init();
                    time += frame.duration;

                    frame = nextFrame;
                    this.frames[i] = frame;
                }
                if (frame.duration) {
                    frame.startTime = time;
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

        setAllowSkipFrame: function(allow) {
            this.allowSkipFrame = allow;
            if (allow) {
                this.changeFrame = this.nextFrame;
            } else {
                this.changeFrame = this.setFrame;
            }
        },

        getFramesConfig: function() {
            var frames = JSON.parse(JSON.stringify(this.framesData));
            return frames || [];
        },

        createFrame: function(cfg) {
            var frame = new this.FrameClass(cfg);
            frame.animation = this;
            return frame;
        },

        reset: function() {
            this.ended = false;
            this.played = 0;
            this.setFrame(0);
        },

        start: function(index) {
            this.paused = false;
            this.reset();
            if (index > 0) {
                var time = this.frames[index - 1].endTime;
                this.played = time;
                this.setFrame(index);
            }
        },

        changeFrame: null,
        setFrame: function(index) {
            this.currentIndex = index;
            this.currentFrame = this.frames[index];
            this.currentEndTime = this.currentFrame.endTime;
        },

        nextFrame: function() {
            var index = this.currentIndex;
            var frame, endTime;
            for (;;) {
                frame = this.frames[index];
                endTime = frame.endTime;
                if (index == this.endIndex || this.played < endTime) {
                    break;
                }
                index++;
            }
            this.currentIndex = index;
            this.currentFrame = frame;
            this.currentEndTime = endTime;
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
            if (this.paused || this.ended) {
                return false;
            }
            // var last = this.currentIndex;
            if (this.played >= this.currentEndTime) {
                if (this.currentIndex === this.endIndex) {
                    this.onEnd && this.onEnd(timeStep);
                    if (this.loop === true || --this.loop > 0) {
                        // this.played = 0;
                        this.played -= this.currentEndTime;
                        this.currentIndex = this.startIndex;
                    } else {
                        this.ended = true;
                        return false;
                    }
                } else {
                    this.currentIndex++;
                    this.played += timeStep;
                }
            } else {
                this.played += timeStep;
                return false;
            }

            // if (this.changed = last !== this.currentIndex) {
            //     this.changeFrame(this.currentIndex);
            //     return true;
            // }
            // return false;

            this.changeFrame(this.currentIndex);
            return this.changed = true;
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
