"use strict";

var Dragons = Dragons || {
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
            matrix.rotate(this.transform.rotation);
            matrix.scale(this.transform.scaleX, this.transform.scaleY);
            matrix.translate(this.transform.x, this.transform.y);
            this.matrix = matrix;
        },

        getDefaultColor: function(color) {
            return {
                rO: 0,
                gO: 0,
                bO: 0,
                aO: 0,
                rM: 100,
                gM: 100,
                bM: 100,
                aM: 100
            };
        },

        setColorOffset: function(color) {
            // aM, rM, gM, bM, aO, rO, gO, bO
            var defaultValue = this.getDefaultColor();
            this.color = color || {};
            for (var p in defaultValue) {
                if (!(p in this.color)) {
                    this.color[p] = defaultValue[p];
                }
            }
        },

        setTweenEasing: function(tweenEasing) {
            if (tweenEasing === 0) {
                this.easingFunction = this.tweenLinear;
            } else if (!tweenEasing) {
                this.easingFunction = this.tweenNone;
            }
        },
        setTweenCurve: function(curve) {
            // var defaultValue = [
            //     0, 0,
            //     1, 1
            // ];
            this.curve = curve; // || defaultValue;
            if (curve) {
                this.easingFunction = this.createTweenBezier(curve);
            }
        },

        createTweenBezier: function(points) {
            var bezier = new BezierEasing(points);
            return function(t) {
                return bezier.get(t);
            };
        },

        tweenNone: function(t) {
            return t >= 1 ? 1 : 0;
        },
        tweenLinear: function(t) {
            return t;
        },

        easingFunction: function(t) {
            return t;
        },

        clampAngle: function(angle) {
            angle = angle % 360;
            if (angle > 180) {
                angle = angle - 360;
            } else if (angle < -180) {
                angle = 360 + angle;
            }
            return angle;
        },
        getTweenValue: function(a, b, passedPercent) {
            return a + (b - a) * this.easingFunction(passedPercent);
        },
        getTweenAngle: function(a, b, passedPercent, tweenRotate) {
            tweenRotate = tweenRotate || 0;

            var d = b - a;
            d = this.clampAngle(d);

            d += 360 * tweenRotate;

            if (d == 0) {
                return a;
            }

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
            var ta = (a + d * this.easingFunction(passedPercent));
            // console.log(a, b, passedPercent, ta)
            return ta;
        },

        getTweenTransform: function(prevFrame, nextFrame, passedPercent) {
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
            var x = prevFrame.getTweenValue(pT.x, nT.x, passedPercent);
            var y = prevFrame.getTweenValue(pT.y, nT.y, passedPercent);
            var scaleX = prevFrame.getTweenValue(pT.scaleX, nT.scaleX, passedPercent);
            var scaleY = prevFrame.getTweenValue(pT.scaleY, nT.scaleY, passedPercent);

            var angle;

            var pA = pT.angle,
                nA = nT.angle;
            if (this.baseBone) {
                var baseAngle = this.baseBone.transform.angle;
                pA = this.clampAngle(pA + baseAngle);
                nA = this.clampAngle(nA + baseAngle);
                angle = prevFrame.getTweenAngle(pA, nA, passedPercent, prevFrame.tweenRotate);
                angle -= baseAngle;
            } else {
                angle = prevFrame.getTweenAngle(pA, nA, passedPercent, prevFrame.tweenRotate);
            }

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

        getTweenColor: function(prevFrame, nextFrame, passedPercent) {
            var pC = prevFrame.color || this.getDefaultColor();
            if (!nextFrame) {
                return {
                    rO: pC.rO,
                    gO: pC.gO,
                    bO: pC.bO,
                    aO: pC.aO,
                    rM: pC.rM,
                    gM: pC.gM,
                    bM: pC.bM,
                    aM: pC.aM,
                }
            }
            var nC = nextFrame.color || this.getDefaultColor();
            var keys = [
                "rO", "gO", "bO", "aO",
                "rM", "gM", "bM", "aM",
            ];
            var color = {};
            var Me = this;
            keys.forEach(function(k) {
                color[k] = prevFrame.getTweenValue(pC[k], nC[k], passedPercent);
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
                passedPercent: passed / prevFrame.duration,
                duration: prevFrame.duration,
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

}(Dragons));
