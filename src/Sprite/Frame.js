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
            p.imgInfo = this.animation.getImgInfo(p.imgName);
            p.img = p.imgInfo.img;
            p.ix = p.imgInfo.x;
            p.iy = p.imgInfo.y;
            p.iw = p.imgInfo.w;
            p.ih = p.imgInfo.h;
            p.ox = p.ox || 0;
            p.oy = p.oy || 0;
            p.x = p.x || 0;
            p.y = p.y || 0;
            p.w = p.w || 0;
            p.h = p.h || 0;
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
                context.drawImage(p.img, p.ix, p.iy, p.iw, p.ih, p.ox, p.oy, p.iw, p.ih);
                context.restore();
            } else {
                context.drawImage(p.img, p.ix, p.iy, p.iw, p.ih, x + p.ox, y + p.oy, p.iw, p.ih);
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
                context.strokeRect(0, 0, p.iw, p.ih);
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
