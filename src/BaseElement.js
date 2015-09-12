"use strict";

var SKP = SKP || {
    Class: GT.Class
};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var Composite = exports.Composite;

    var BaseElement = GT.Class.create({
        rawData: null,
        userData: null,

        setRawData: function(rawData) {
            this.rawData = JSON.parse(JSON.stringify(rawData));
        },
        initAttributes: function(options) {
            var Me = this;
            options.forEach(function(op) {
                if (typeof op == "string") {
                    Me.initAttribute(op)
                } else {
                    Me.initAttribute(op[0], op[1], op[2]);
                }
            });
        },

        initAttribute: function(name, defaultValue, newName) {
            newName = newName || name;
            if (arguments.length == 1) {
                defaultValue = this[name];
            }
            var rawData = this.rawData;
            if (name in rawData) {
                this[newName] = rawData[name]
            } else {
                this[newName] = defaultValue;
            }
            return this[newName];
        },
        getDefaultTransform: function() {
            return {
                x: 0,
                y: 0,
                scX: 1,
                scY: 1,
                skX: 0,
                skY: 0,

                scaleX: 1,
                scaleY: 1,
                angle: 0,
                rotation: 0
            };
        },
        setTransform: function(transform) {
            var defaultValue = this.getDefaultTransform();

            this.transform = transform || {};
            for (var p in defaultValue) {
                if (!(p in this.transform)) {
                    this.transform[p] = defaultValue[p];
                }
            }
            this.transform.angle = this.transform.skX;
            this.transform.rotation = this.transform.skX * Math.PI / 180;
            this.transform.scaleX = this.transform.scX;
            this.transform.scaleY = this.transform.scY;

            var matrix = new Matrix(1, 0, 0, 1, 0, 0);
            matrix.scale(this.transform.scaleX, this.transform.scaleY);
            matrix.rotate(this.transform.rotation);
            matrix.translate(this.transform.x, this.transform.y);
            this.matrix = matrix;
        },

        setColorOffset: function(color) {
            // aM, rM, gM, bM, aO, rO, gO, bO
            var defaultValue = {
                rO: 0,
                gO: 0,
                bO: 0,
                aO: 0,
                rM: 100,
                gM: 100,
                bM: 100,
                aM: 100
            };
            this.color = color || {};
            for (var p in defaultValue) {
                if (!(p in this.color)) {
                    this.color[p] = defaultValue[p];
                }
            }
        },

        setTweenCurve: function(curve) {
            // var defaultValue = [
            //     0, 0,
            //     1, 1
            // ];
            this.curve = curve; // || defaultValue;
            // for (var p in defaultValue) {
            //     if (!(p in this.curve)) {
            //         this.curve[p] = defaultValue[p];
            //     }
            // }
            if (this.curve) {
                // this.tweenFunction = this.createCubicBezier.call(null, this.curve);
            }
        },

        createCubicBezier: function(p0, p1, p2, p3) {
            return function(t) {
                return p0 * Math.pow(1 - t, 3) + 3 * p1 * t * Math.pow(1 - t, 2) + 3 * p2 * Math.pow(t, 2) * (1 - t) + p3 * Math.pow(t, 3);
            };
        },

        tweenFunction: function(t) {
            return t;
        },

        getTweenValue: function(a, b, t) {
            return a + (b - a) * this.tweenFunction(t);
        },
        getTweenAngle: function(a, b, t, tweenRotate) {
            var d = b + 360 * tweenRotate - a;
            // d = d % 360;
            // d += (d < 0 ? -1 : 1) * (360 * tweenRotate);

            // if (d == 0) {
            //     return a;
            // }
            // if (spin < 0) {
            //     d = d - 360;
            // } else {
            //     d = d + 360;
            // }
            // d = d % 360;
            // console.log(a, b, d, "--", spin,b-a)
            var ta = (a + d * this.tweenFunction(t));
            // console.log(a, b, t, ta)
            return ta;
        },

        getTweenTransform: function(prevFrame, nextFrame, t) {
            var pT = prevFrame.transform;
            if (!nextFrame) {
                return {
                    x: pT.x,
                    y: pT.y,
                    scX: pT.scX,
                    scY: pT.scY,
                    skX: pT.skX,
                    skY: pT.skY,
                    scaleX: pT.scaleX,
                    scaleY: pT.scaleY,
                    angle: pT.angle,
                    rotation: pT.rotation,
                }
            }
            var nT = nextFrame.transform;
            var x = prevFrame.getTweenValue(pT.x, nT.x, t);
            var y = prevFrame.getTweenValue(pT.y, nT.y, t);
            var scaleX = prevFrame.getTweenValue(pT.scaleX, nT.scaleX, t);
            var scaleY = prevFrame.getTweenValue(pT.scaleY, nT.scaleY, t);
            var angle = prevFrame.getTweenAngle(pT.angle, nT.angle, t, prevFrame.tweenRotate);
            var transform = {
                x: x,
                y: y,
                scX: scaleX,
                scY: scaleY,
                skX: angle,
                skY: angle,
                scaleX: scaleX,
                scaleY: scaleY,
                angle: angle,
                rotation: angle * Math.PI / 180,
            };
            // console.log(transform)
            return transform;
        },

        getTweenColor: function(prevFrame, nextFrame, t) {
            var pT = prevFrame.color,
                nT = nextFrame.color;
            var keys = [
                "rO", "gO", "bO", "aO",
                "rM", "gM", "bM", "aM",
            ];
            var color = {};
            var Me = this;
            keys.forEach(function(k) {
                color[k] = prevFrame.getTweenValue(pT[k], nT[k], t);
            });
            return color;
        },

        getFrameTweenInfo: function(index) {
            var prevFrame, nextFrame;
            var passed = 0;
            for (var i = 0, len = this.frames.length; i < len; i++) {
                var keyFrame = this.frames[i];
                // console.log(i, '-', keyFrame.startIndex, index, keyFrame.endIndex)
                if (keyFrame.startIndex <= index && index < keyFrame.endIndex) {
                    prevFrame = keyFrame;
                    passed = index - keyFrame.startIndex;
                    if (passed > 0) {
                        nextFrame = this.frames[i + 1] || null;
                    }
                    // console.log(passed)
                    break;
                }
            }
            // console.log(index, prevFrame);
            if (!prevFrame) {
                return null;
            }
            return {
                passed: passed,
                duration: prevFrame.duration,
                t: passed / prevFrame.duration,
                prevFrame: prevFrame,
                nextFrame: nextFrame
            };
        },

        strokeAABB: function(context, aabb) {
            context.beginPath();
            context.moveTo(aabb[0], aabb[1]);
            context.lineTo(aabb[2], aabb[1]);
            context.lineTo(aabb[2], aabb[3]);
            context.lineTo(aabb[0], aabb[3]);
            context.closePath();
            context.stroke();
        },

        strokePoly: function(context, vertices, color, tx, ty) {
            tx = tx || 0;
            ty = ty || 0;
            if (color) {
                context.strokeStyle = color;
            }
            var vertexCount = vertices.length;
            var a = vertices[0];
            var first = a;
            context.beginPath();
            context.moveTo(a[0] + tx, a[1] + ty);
            for (var j = 1; j < vertexCount; j++) {
                var a = vertices[j];
                context.lineTo(a[0] + tx, a[1] + ty);
            }
            context.closePath();
            context.stroke();
        }
    });

    exports.BaseElement = BaseElement;

}(SKP))
