"use strict";

var GT = GT || {};

(function(exports) {

    var DisplayObject = function(options) {
        for (var key in options) {
            this[key] = options[key];
        }
    };


    var proto = {
        constructor: DisplayObject,

        DEG_TO_RAD: Math.PI / 180,
        RAD_TO_DEG: 180 / Math.PI,
        HALF_PI: Math.PI / 2,
        DOUBLE_PI: Math.PI * 2,

        img: null,
        sx: null,
        sy: null,
        sw: null,
        sh: null,

        x: 0,
        y: 0,
        width: null,
        height: null,
        anchorX: 0,
        anchorY: 0,
        offsetX: 0,
        offsetY: 0,
        offsetW: 0,
        offsetH: 0,

        scale: 1,
        scaleX: 1,
        scaleY: 1,
        flipX: false,
        flipY: false,
        rotation: 0,

        visible: true,

        renderX: 0,
        renderY: 0,
        absoluteAlpha: 0,


        init: function() {
            this.children = [];
            this.childrenMap = {};

            this.setImg(this.img);
            this.setImgInfo(this.sx, this.sy, this.sw, this.sh);
            this.computeAbsoluteData();
        },

        setImg: function(img) {
            this.img = img;
        },
        setImgInfo: function(sx, sy, sw, sh) {
            if (sx === null || sx === undefined) {
                sx = 0;
            }
            if (sy === null || sy === undefined) {
                sy = 0;
            }
            if (sw === null || sw === undefined) {
                sw = this.img.width;
            }
            if (sh === null || sh === undefined) {
                sh = this.img.height;
            }
            this.sx = sx;
            this.sy = sy;
            this.sw = sw;
            this.sh = sh;

            if (this.width === null || this.width === undefined) {
                this.width = this.sw;
            }
            if (this.height === null || this.height === undefined) {
                this.height = this.sh;
            }
        },

        setScale: function(scale) {
            this.scale = scale;
            this.scaleX = scale;
            this.scaleY = scale;
        },

        isInRegion: function(x, y) {
            var aabb = this.aabb;
            return aabb[0] < x && x < aabb[2] && aabb[1] < y && y < aabb[3];
        },

        update: function(timeStep, now) {

        },

        updateAABB: function() {
            var x = this.absoluteX - this.anchorX;
            var y = this.absoluteY - this.anchorY;
            this.aabb[0] = x;
            this.aabb[1] = y;
            this.aabb[2] = x + this.width;
            this.aabb[3] = y + this.height;
        },

        simpleRender: function(context, timeStep, now) {
            if (!this.img) {
                return;
            }
            var x = this.x - this.anchorX + this.offsetX;
            var y = this.y - this.anchorY + this.offsetY;
            var w = this.width + this.offsetW;
            var h = this.height + this.offsetH;
            context.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, x, y, w, h);
        },

        renderSelf: function(context, timeStep, now) {
            context.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.renderX, this.renderY, this.renderW, this.renderH);
        },
        renderChildren: function(context, timeStep, now) {
            this.children.forEach(function(child) {
                child.render(context, timeStep, now);
            });
        },
        render: function(context, timeStep, now) {
            if (!this.visible) {
                return false;
            }
            if (this.parent) {
                this.absoluteAlpha = this.alpha * (this.parent.absoluteAlpha || 1);
            } else {
                this.absoluteAlpha = this.alpha;
            }
            this.absoluteAlpha = this.absoluteAlpha > 1 ? 1 : this.absoluteAlpha;
            if (this.absoluteAlpha <= 0) {
                return false;
            }
            var x = -this.anchorX;
            var y = -this.anchorY;
            var scaleX = this.scaleX * (this.flipX ? -1 : 1);
            var scaleY = this.scaleY * (this.flipY ? -1 : 1);
            var rotation = this.rotation % this.DOUBLE_PI;
            if (scaleX != 1 || scaleY != 1 || rotation != 0) {
                context.save();
                context.translate(this.x, this.y);
                if (rotation) {
                    context.rotate(rotation);
                }
                context.scale(scaleX, scaleY);
            } else {
                x += this.x;
                y += this.y;
            }
            this.renderX = x + this.offsetX;
            this.renderY = y + this.offsetY;
            this.renderW = this.width + this.offsetW;
            this.renderH = this.height + this.offsetH;
            context.globalAlpha = this.absoluteAlpha;
            this.renderSelf(context, timeStep, now);
            if (this.children) {
                this.renderChildren(context, timeStep, now);
            }
            if (scaleX != 1 || scaleY != 1 || rotation != 0) {
                context.restore();
            } else {
                context.globalAlpha = 1;
            }
            this.absoluteAlpha = 1;
        },

        computeAbsoluteData: function(parent) {
            parent = parent || this.parent;
            if (this.absolute || !parent) {
                this.absoluteAlpha = this.alpha;
                this.absoluteX = this.x;
                this.absoluteY = this.y;
                this.absoluteRotation = this.rotation;
                this.absoluteScale = this.scale;
                this.absoluteScaleX = this.scaleX;
                this.absoluteScaleY = this.scaleY;
                this.absoluteFlipX = this.flipX;
                this.absoluteFlipY = this.flipY;
                return;
            }
            this.absoluteAlpha = this.alpha * parent.absoluteAlpha;
            this.absoluteX = this.x + parent.absoluteX;
            this.absoluteY = this.y + parent.absoluteY;
            this.absoluteRotation = this.rotation + parent.absoluteRotation;
            this.absoluteScale = this.scale * parent.absoluteScale;
            this.absoluteScaleX = this.scaleX * parent.absoluteScaleX;
            this.absoluteScaleY = this.scaleY * parent.absoluteScaleY;
            this.absoluteFlipX = this.flipX ^ parent.absoluteFlipX;
            this.absoluteFlipY = this.flipY ^ parent.absoluteFlipY;
        },


        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        //////////////////////////////////////////////////


        addChild: function(child) {
            child.id = (child.id || child.id === 0) ? child.id : DisplayObject.generateId();
            this.childrenMap[child.id] = child;
            this.children.push(child);
            child.parent = this;
        },
        getChildById: function(id) {
            return this.childrenMap[id];
        },
        getChildAt: function(index) {
            return this.children[index];
        },
        removeChild: function(child) {
            var index = this.indexOf(child);
            if (index >= 0) {
                delete this.childrenMap[child.id];
                this.children.splice(index, 1);
                child.parent = null;
                return child;
            }
            return false;
        },
        removeChildById: function(id) {
            var child = this.childrenMap[id];
            if (child) {
                return this.removeChild(child);
            }
            return false;
        },
        removeChildAt: function(index) {
            var child = this.children[index];
            if (child) {
                delete this.childrenMap[child.id];
                this.children.splice(index, 1);
                child.parent = null;
                return child;
            }
            return false;
        },
        indexOf: function(child) {
            for (var i = 0, len = this.children.length; i < len; i++) {
                if (this.children[i] === child) {
                    return i;
                }
            }
            return -1;
        },
        hasChild: function(child) {
            return !!this.children[child.id];
        },
        sortChildrenBy: function(key) {
            DisplayObject.insertSort(this.children, key);
        }

    };

    DisplayObject._ID_SEED = 0;
    DisplayObject.generateId = function() {
        DisplayObject._ID_SEED++;
        var id = "do_" + DisplayObject._ID_SEED;
        return id;
    };

    DisplayObject.insertSort = function(array, sortKey) {
        var t1, t2;
        var count = array.length;
        for (var i = 1; i < count; i++) {
            t1 = array[i];
            var sortValue = t1[sortKey];
            for (var j = i; j > 0 && (t2 = array[j - 1])[sortKey] > sortValue; j--) {
                array[j] = t2;
            }
            array[j] = t1;
        }
    };

    for (var p in proto) {
        DisplayObject.prototype[p] = proto[p];
    }

    exports.DisplayObject = DisplayObject;

}(GT));
