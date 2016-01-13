"use strict";

var Sprite = Sprite || {};

(function(exports) {

    var ImagePool = exports.ImagePool || {};
    var ImageMapping = exports.ImageMapping || {};
    var AnimationPool = exports.AnimationPool || {};

    exports.ImagePool = ImagePool;
    exports.ImageMapping = ImageMapping;
    exports.AnimationPool = AnimationPool;

    exports.animationOptions = function(cfg, imgName, anim) {
        anim = anim || {};
        for (var p in cfg) {
            if (!(p in anim)) {
                anim[p] = cfg[p];
            }
        }
        if (!("loop" in anim)) {
            anim.loop = cfg.loop || false;
        }
        if (!("ox" in anim)) {
            anim.ox = cfg.ox || 0;
        }
        if (!("oy" in anim)) {
            anim.oy = cfg.oy || 0;
        }

        var frames = anim.frames = [];
        if (Array.isArray(cfg.frames)) {
            for (var i = 0; i < cfg.frames.length; i++) {
                var index = cfg.frames[i];
                var d = Array.isArray(cfg.duration) ? cfg.duration[i] : cfg.duration;
                frames.push({
                    imgName: imgName + "-" + index,
                    duration: d,
                });
            }
        } else {
            for (var i = 0; i < cfg.frames; i++) {
                var index = i;
                var d = Array.isArray(cfg.duration) ? cfg.duration[i] : cfg.duration;
                frames.push({
                    imgName: imgName + "-" + index,
                    duration: d,
                });
            }
        }
        return anim;
    };

})(Sprite);
