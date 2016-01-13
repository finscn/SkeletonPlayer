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
            p.x = imgInfo.x;
            p.y = imgInfo.y;
            p.w = imgInfo.w;
            p.h = imgInfo.h;
            p.ox = (p.ox || 0) + imgInfo.ox;
            p.oy = (p.oy || 0) + imgInfo.oy;
        },

        getImg: function(name) {
            if (this.imagePool) {
                return this.imagePool[name];
            }
            return this.img || this.animation.img;
        },
        getImgInfo: function(name) {
            var skinName = this.skinName || this.animation.skinName;
            if (skinName) {
                name = skinName + name;
            }
            var mappingInfo, imgInfo;
            if (this.imageMapping && (mappingInfo = this.imageMapping[name])) {
                var img = this.getImg(mappingInfo.img);
                imgInfo = {
                    img: img,
                    x: mappingInfo.x,
                    y: mappingInfo.y,
                    w: mappingInfo.w,
                    h: mappingInfo.h,
                    ox: mappingInfo.ox || 0,
                    oy: mappingInfo.oy || 0,
                    sw: mappingInfo.sw,
                    sh: mappingInfo.sh,
                }
            } else {
                var img = this.getImg(name);
                imgInfo = {
                    img: img,
                    x: 0,
                    y: 0,
                    w: img.width,
                    h: img.height,
                    ox: 0,
                    oy: 0,
                    sw: img.width,
                    sh: img.height,
                }
            }
            if (this.animation.skinCenterAnchor) {
                imgInfo.ox -= imgInfo.sw / 2;
                imgInfo.oy -= imgInfo.sh / 2;
            }
            return imgInfo;
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
                context.drawImage(p.img, p.x, p.y, p.w, p.h, p.ox, p.oy, p.w, p.h);
                context.restore();
            } else {
                context.drawImage(p.img, p.x, p.y, p.w, p.h, x + p.ox, y + p.oy, p.w, p.h);
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
                context.strokeRect(0, 0, p.w, p.h);
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
