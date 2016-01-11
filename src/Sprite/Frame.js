"use strict";

var Sprite = Sprite || {};

(function(exports) {

    var Frame = function(options) {
        for (var p in options) {
            this[p] = options[p];
        }
    };

    var proto = {

        constructor: Frame,

        duration: null,
        imgName: null,
        alpha: 1,
        matrix: null,

        startTime: null,
        endTime: null,
        animation: null,

        init: function() {
            this.imagePool = exports.ImagePool;
            this.imageMapping = exports.ImageMapping;
            this.skinName = this.skinName || this.animation.skinName || "";
            if (this.pieces) {
                this.initPieces();
                this.render = this.renderPieces;
            } else {
                this.initPiece(this);
                this.render = this.renderSelf;
            }
        },

        initPieces: function() {
            this.pieceCount = this.pieces.length;
            for (var i = 0; i < this.pieceCount; i++) {
                var p = this.pieces[i];
                this.initPiece(p);
            }
        },

        initPiece: function(p) {
            p.alpha = p.alpha || p.alpha === 0 ? p.alpha : 1;
            var imgInfo = this.getImgInfo(p.imgName);
            p.img = imgInfo.img;
            p.sx = imgInfo.x;
            p.sy = imgInfo.y;
            p.sw = imgInfo.w;
            p.sh = imgInfo.h;
            p.ox = p.ox || 0;
            p.oy = p.oy || 0;
            p.x = p.x || 0;
            p.y = p.y || 0;
            p.w = p.w || 0;
            p.h = p.h || 0;
        },

        getImgInfo: function(name) {
            if (this.skinName) {
                name = this.skinName + name;
            }
            var mappingInfo;
            if (this.imageMapping && (mappingInfo = this.imageMapping[name])) {
                return {
                    img: this.imagePool[mappingInfo.img],
                    x: mappingInfo.x,
                    y: mappingInfo.y,
                    w: mappingInfo.w,
                    h: mappingInfo.h,
                }
            } else {
                var img = this.imagePool[name];
                return {
                    img: img,
                    x: 0,
                    y: 0,
                    w: img.width,
                    h: img.height,
                }
            }

        },
        renderPieces: function(context, x, y) {
            for (var i = 0; i < this.pieceCount; i++) {
                var p = this.pieces[i];
                this.renderPiece(context, p, x, y);
            }
        },

        renderPiece: function(context, p, x, y) {
            context.globalAlpha = p.alpha;
            var m = p.matrix;
            if (m) {
                context.save();
                context.transform(m.a, m.b, m.c, m.d, m.tx + x, m.ty + y);
                context.drawImage(p.img, p.sx, p.sy, p.sw, p.sh, p.ox, p.oy, p.sw, p.sh);
                context.restore();
            } else {
                context.drawImage(p.img, p.sx, p.sy, p.sw, p.sh, x + p.ox, y + p.oy, p.sw, p.sh);
            }
            context.globalAlpha = 1;
        },
        renderSelf: function(context, x, y) {
            this.renderPiece(context, this, x, y);
        },
        renderPieceBorder: function(context, x, y) {
            var ps, count = this.pieceCount;
            if (!count) {
                ps = [this];
                count = 1;
            } else {
                ps = this.pieces;
            }
            for (var i = 0; i < count; i++) {
                var p = ps[i];
                context.save();
                context.globalAlpha = p.alpha;
                var m = p.matrix;
                context.transform(m.a, m.b, m.c, m.d, m.e, m.f);
                context.strokeStyle = "#ff6600";
                context.strokeRect(0, 0, p.sw, p.sh);
                context.strokeRect(0, 0, 2, 2);
                context.restore();
            }
        }

    };

    for (var p in proto) {
        Frame.prototype[p] = proto[p];
    }

    exports.Frame = Frame;


})(Sprite);
