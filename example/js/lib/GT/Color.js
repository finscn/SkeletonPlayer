"use strict";

var GT = GT || {};

(function(exports) {

    var Color = {

        hexToRgb: function(hex) {
            var r = hex[0] + hex[1];
            var g = hex[2] + hex[3];
            var b = hex[4] + hex[5];

            return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
        },

        hexToHsl: function(hex) {
            var rgb = Color.hexToRgb(hex);
            return Color.rgbToHsl(rgb[0], rgb[1], rgb[2]);
        },

        rgbToHex: function(r, g, b) {

            var pad2 = function(c) {
                return c.length == 1 ? '0' + c : '' + c;
            };

            var hex = [
                pad2(Math.round(r).toString(16)),
                pad2(Math.round(g).toString(16)),
                pad2(Math.round(b).toString(16))
            ];

            return hex.join("");
        },

        rgbToHsl: function(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0;
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }

                h /= 6;
            }

            return [h * 360, s * 100, l * 100]
        },

        hslToRgb: function(h, s, l) {

            var r, g, b;

            if (String(s).lastIndexOf("%") > 0) {
                s = parseFloat(s) / 100;
            }
            if (String(l).lastIndexOf("%") > 0) {
                l = parseFloat(l) / 100;
            }
            if (s === 0) {
                r = g = b = l;
            } else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                var hue2rgb = Color._hue2rgb;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return [r * 255, g * 255, b * 255];
        },
        _hue2rgb: function(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        },

        hslToHex: function(h, s, l) {
            var rgb = Color.hslToRgb(h, s, l);
            return Color.rgbToHex(rgb[0], rgb[1], rgb[2]);
        }
    };

    exports.Color = Color;

}(GT));
