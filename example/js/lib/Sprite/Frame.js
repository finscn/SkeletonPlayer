"use strict";

var Sprite = Sprite || {};

(function(exports) {

    var ImagePool = exports.ImagePool;
    var ImageMapping = exports.ImageMapping;
    var AnimationPool = exports.AnimationPool;


    var Frame = function(options) {
        for (var p in options) {
            this[p] = options[p];
        }
    };

    var proto = {

        constructor: Frame,
        pieces: null,
        time: null,
        endTime: null,
        duration: null,
        pieceCount: 0,
        quick: true,
        init: function() {
            // this.pieces = this.pieces || [];
            // this.time = this.time || 0;
            // this.endTime = this.endTime || 0;
            this.duration = this.duration || this.endTime - this.time || 0;
            if (this.pieces) {
                this.initPieces();
                this.render = this.renderPieces;
            } else {
                this.initPiece(this);
                this.render = this.renderSelf;
            }
            this.initAABB();
        },

        initPieces: function() {
            this.pieceCount = this.pieces.length;
            for (var i = 0; i < this.pieceCount; i++) {
                var p = this.pieces[i];
                p.zIndex = p.zIndex || 0;
                this.initPiece(p);
            }
            this.pieces.sort(function(a, b) {
                return a.zIndex - b.zIndex;
            });
        },
        initPiece: function(p) {
            p.imgName = p.imgName || p.imgId;
            p.w = p.w || 0;
            p.h = p.h || 0;
            p.x = p.x || 0;
            p.y = p.y || 0;
            p.rotation = p.rotation || 0;
            p.scaleX = p.scaleX || 1;
            p.scaleY = p.scaleY || 1;
            p.alpha = p.alpha || p.alpha === 0 ? p.alpha : 1;

            var mappingInfo;
            var imgOX = 0,
                imgOY = 0;
            var imgP = p.img;
            if (ImageMapping && (mappingInfo = ImageMapping[p.imgName])) {
                p.img = ImagePool[mappingInfo.img];
                if (!p.img && (!imgP || imgP.tagName != "IMG" && imgP.tagName != "CANVAS")) {
                    p._imgKey = mappingInfo.img;
                    p._useMapping = true;
                } else if (!p.img) {
                    p.img = imgP;
                }
                p.ix = mappingInfo.x;
                p.iy = mappingInfo.y;
                p.iw = mappingInfo.w;
                p.ih = mappingInfo.h;
                imgOX = mappingInfo.ox || 0;
                imgOY = mappingInfo.oy || 0;
            } else {
                p.img = ImagePool[p.imgName];
                if (!p.img && (!imgP || imgP.tagName != "IMG" && imgP.tagName != "CANVAS")) {
                    p._imgKey = p.imgName;
                    p._useMapping = false;
                } else if (!p.img) {
                    p.img = imgP;
                }

                if (p.img) {
                    var iw = p.img.width,
                        ih = p.img.height;
                    p.iw = p.iw || iw;
                    p.ih = p.ih || ih;
                    p.w = p.w || iw;
                    p.h = p.h || ih;
                }
                p.ix = p.ix || 0;
                p.iy = p.iy || 0;
            }

            var ox = p.ox;
            if (String(ox).indexOf("%") > 0) {
                ox = p.iw * parseFloat(ox) / 100;
            } else {
                ox = ox || 0;
            }
            var oy = p.oy;
            if (String(oy).indexOf("%") > 0) {
                oy = p.ih * parseFloat(oy) / 100;
            } else {
                oy = oy || 0;
            }
            p.ox = ox + imgOX;
            p.oy = oy + imgOY;

        },

        initAABB: function() {
            var ps, count = this.pieceCount;
            if (!count) {
                ps = [this];
                count = 1;
            } else {
                ps = this.pieces;
            }
            var minX = Infinity,
                minY = Infinity;
            var maxX = -Infinity,
                maxY = -Infinity;
            for (var i = 0; i < count; i++) {
                var p = ps[i];
                var aabbP = this.getPieceAABB(p);
                if (aabbP[0] < minX) {
                    minX = aabbP[0];
                }
                if (aabbP[1] < minY) {
                    minY = aabbP[1];
                }
                if (aabbP[2] > maxX) {
                    maxX = aabbP[2];
                }
                if (aabbP[3] > maxY) {
                    maxY = aabbP[3];
                }
            }
            this.aabb = [
                minX, minY,
                maxX, maxY
            ];
        },
        getPieceAABB: function(p) {
            var r = p.rotation;
            var cos = Math.cos(r),
                sin = Math.sin(r);
            var x1 = p.ox,
                y1 = p.oy,
                x2 = x1 + p.iw,
                y2 = y1 + p.ih;
            var getRotated = function(x, y) {
                return [(x * cos - y * sin) * p.scaleX + p.x, (x * sin + y * cos) * p.scaleY + p.y];
            }
            var v0 = getRotated(x1, y1),
                v1 = getRotated(x2, y1),
                v2 = getRotated(x2, y2),
                v3 = getRotated(x1, y2)
            var aabb = [
                Math.min(v0[0], v1[0], v2[0], v3[0]),
                Math.min(v0[1], v1[1], v2[1], v3[1]),
                Math.max(v0[0], v1[0], v2[0], v3[0]),
                Math.max(v0[1], v1[1], v2[1], v3[1])
            ];
            return aabb;
        },

        renderPieces: function(context, x, y) {
            for (var i = 0; i < this.pieceCount; i++) {
                var p = this.pieces[i];
                this.renderPiece(context, p, x, y);
            }
        },
        renderPiece: function(context, p, x, y) {
            if (!p.img) {
                // for lazy loading
                var img = ImagePool[p._imgKey];
                console.log(img, p._imgKey);
                if (!img) {
                    return;
                }
                p.img = img;
                if (!p._useMapping) {
                    var iw = p.img.width,
                        ih = p.img.height;
                    p.iw = p.iw || iw;
                    p.ih = p.ih || ih;
                    p.w = p.w || iw;
                    p.h = p.h || ih;
                }
            }

            if (this.quick) {
                context.drawImage(p.img, p.ix, p.iy, p.iw, p.ih, p.x + x + p.ox, p.y + y + p.oy, p.iw, p.ih);
                return;
            }
            context.save();
            context.globalAlpha = p.alpha;
            context.translate(p.x + x, p.y + y);
            context.rotate(p.rotation);
            context.scale(p.scaleX, p.scaleY);
            context.drawImage(p.img, p.ix, p.iy, p.iw, p.ih, p.ox, p.oy, p.iw, p.ih);
            context.restore();
        },
        renderSelf: function(context, x, y) {
            this.renderPiece(context, this, x, y);
        },
        renderAABB: function(context, x, y) {
            context.strokeStyle = "#ff00ff";
            var b = this.aabb;
            context.strokeRect(b[0] + x, b[1] + y, b[2] - b[0], b[3] - b[1]);
            // for (var i = 0; i < this.pieceCount; i++) {
            // var p = this.pieces[i];
            // var b = p.aabb;
            // context.strokeRect(b[0] + x, b[1] + y, b[2] - b[0], b[3] - b[1]);
            // }
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
                context.translate(p.x + x, p.y + y);
                context.scale(p.scaleX, p.scaleY);
                context.rotate(p.rotation);
                context.strokeStyle = "#ff6600";
                context.strokeRect(p.ox, p.oy, p.iw, p.ih);
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
