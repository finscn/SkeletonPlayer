var ImageUtils = {

    createCanvas: function(width, height) {
        var canvas = document.createElement("canvas");
        canvas.retinaResolutionEnabled = false;
        canvas.width = width;
        canvas.height = height;
        return canvas;
    },
    limitImage: function(img, limit, min) {
        var w = img.width;
        var h = img.height;
        var tw, th;
        var m = min ? Math.min(w, h) : Math.max(w, h);
        if (m == w) {
            if (m > limit) {
                tw = limit;
                th = h * limit / w;
            }
        } else {
            if (m > limit) {
                th = limit;
                tw = w * limit / h;
            }
        }
        if (tw && th) {
            return ImageUtils.scaleImage(img, tw, th);
        }
        return img;
    },
    scaleImage: function(img, width, height, cutWidth, cutHeight) {
        var canvas = ImageUtils.createCanvas(width, height);
        var x = 0,
            y = 0;
        if (cutWidth) {
            canvas.width = cutWidth;
            x = cutWidth - width >> 1;
        }
        if (cutHeight) {
            canvas.width = cutHeight;
            y = cutHeight - height >> 1;
        }
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, x, y, width, height);
        return canvas;
    },
    cloneImage: function(img) {
        return ImageUtils.scaleImage(img, img.width, img.height);
    },
    scaleImageH: function(img, width, cutHeight) {
        var iw = img.width;
        var ih = img.height;
        var height = Math.round(ih * width / iw);
        return ImageUtils.scaleImage(img, width, height, null, cutHeight);
    },

    scaleImageV: function(img, height, cutWidth) {
        var iw = img.width;
        var ih = img.height;
        var width = Math.round(iw * height / ih);
        return ImageUtils.scaleImage(img, width, height, cutWidth, null);
    },

    readImageFromFile: function(fileId, onImgLoad) {
        window.URL = window.URL || window.webkitURL;
        if (!window.URL) {
            return false;
        }
        var input = document.getElementById(fileId);
        if (!input) {
            return false;
        }
        input.addEventListener('change', function(event) {
            var dom = event.target;
            if (dom.files.length < 1) {
                return;
            }
            var file = dom.files[0];
            var img = new Image();
            img.onload = function() {
                input.value = null;
                window.URL.revokeObjectURL(this.src);
                onImgLoad(img);
            };
            img.src = window.URL.createObjectURL(file);;
        });
        return true;
    },

    getImgPixels: function(img, x, y, w, h, tempCanvas) {
        if (arguments.length == 2) {
            tempCanvas = x;
            x = 0;
        }
        x = x || 0;
        y = y || 0;
        w = w || img.width;
        h = h || img.height;
        if (!tempCanvas) {
            tempCanvas = ImageUtils.createCanvas(w, h);
        } else {
            tempCanvas.width = w;
            tempCanvas.height = h;
        }
        var ctx = tempCanvas.getContext("2d");
        ctx = tempCanvas.getContext('2d');
        ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
        var pixels = ctx.getImageData(0, 0, w, h).data;
        return pixels
    },

    scaleHard: function(img, scale, en, tempCanvas) {
        var alphaEnhance = 1.5;
        var alphaLimit = 15;

        var origWidth = img.width,
            origHeight = img.height;
        var origCtx, origPixels;
        if (img.getContext) {
            origCtx = img.getContext('2d');
        } else {
            if (!tempCanvas) {
                tempCanvas = ImageUtils.createCanvas(origWidth, origHeight);
            } else {
                tempCanvas.width = origWidth;
                tempCanvas.height = origHeight;
            }
            origCtx = tempCanvas.getContext('2d');
            origCtx.drawImage(img, 0, 0);
        }
        origPixels = origCtx.getImageData(0, 0, origWidth, origHeight);

        var widthScaled = origWidth * scale;
        var heightScaled = origHeight * scale;

        var scaled = ImageUtils.createCanvas(widthScaled, heightScaled);

        var scaledCtx = scaled.getContext('2d');
        var scaledPixels = scaledCtx.getImageData(0, 0, widthScaled, heightScaled);
        var origData = origPixels.data;
        var scaledData = scaledPixels.data;

        // var offetX = origWidth % 2 === 0 ? -1 : 0;
        // var offetY = origHeight % 2 === 0 ? -1 : 0;
        var offset1 = origWidth / 4 >> 0;
        offset1 -= offset1 % 2;
        var _offset2 = origWidth % 5 + 1;
        var offset2 = 0;
        var offset3 = 0;

        // alert(origData.constructor)
        var ob = origData.buffer;
        if (ob) {
            var buf = new ArrayBuffer(scaledData.length);
            var scaled_buf8 = new Uint8ClampedArray(buf);
            var scaled_data = new Uint32Array(buf);

            var orig_data = new Uint32Array(ob);
            for (var y = 0; y < heightScaled; y++) {
                var indexScaled = y * widthScaled;

                var _y = y / scale >> 0;
                if (en) {
                    offset3 = _y % 3;
                    // _y = (_y + offset1) % origHeight;
                    if (_y == origHeight - 1 && origHeight % 2 === 0) {
                        _y = 0;
                    } else if (_y % 2 === 0) {
                        _y = (_y + 2) % origHeight;
                    }
                    offset2 = _y % _offset2;
                }

                var indexRow = _y * origWidth;

                for (var x = 0; x < widthScaled; x++) {
                    var _x = x / scale >> 0;

                    if (en) {
                        _x = (_x + offset1 + offset2 + offset3) % origWidth;
                        _x = origWidth - 1 - _x;
                    }
                    var index = indexRow + _x;

                    scaled_data[indexScaled] = orig_data[index];
                    indexScaled += 1;
                }
            }
            scaledPixels.data.set(scaled_buf8);
        } else {
            for (var y = 0; y < heightScaled; y++) {
                var indexScaled = y * widthScaled;
                indexScaled <<= 2;
                var _y = y / scale >> 0;
                if (en) {
                    offset3 = _y % 3;
                    // _y = (_y + offset1) % origHeight;
                    if (_y == origHeight - 1 && origHeight % 2 === 0) {
                        _y = 0;
                    } else if (_y % 2 === 0) {
                        _y = (_y + 2) % origHeight;
                    }
                    offset2 = _y % _offset2;
                }
                var indexRow = _y * origWidth;
                for (var x = 0; x < widthScaled; x++) {
                    var _x = x / scale >> 0;
                    if (en) {
                        _x = (_x + offset1 + offset2 + offset3) % origWidth;
                        _x = origWidth - 1 - _x;
                    }
                    var index = indexRow + _x;
                    index <<= 2;
                    scaledData[indexScaled + 0] = origData[index + 0];
                    scaledData[indexScaled + 1] = origData[index + 1];
                    scaledData[indexScaled + 2] = origData[index + 2];
                    scaledData[indexScaled + 3] = origData[index + 3];

                    // var alpha = origData[index + 3];
                    // alpha = alpha < alphaLimit ? 0 : alpha;
                    // scaledData[indexScaled + 3] = Math.min(255, Math.round(alpha * alphaEnhance));

                    indexScaled += 4;
                }
            }
        }

        scaledCtx.putImageData(scaledPixels, 0, 0);
        return scaled;
    },

    scaleOnLoad: function(img, scale) {
        scale = scale || Config.imgScale;
        if (scale <= 1) {
            return;
        }
        var t = Date.now();
        var en = img.src.indexOf(".x5.") > 0;
        img.loader.img = ImageUtils.scaleHard(img, scale, en);
        t = Date.now() - t;
        window.scaleTime = window.scaleTime || 0;
        setTimeout(function() {
            window.scaleTime += t;
        }, 10)
    },

    drawLine: function(context, img, x1, y1, x2, y2) {
        var iw = img.width;
        var ih = img.height;
        var dx = x2 - x1,
            dy = y2 - y1;
        var angle = Math.atan2(dy, dx);

        var lw = ih >> 1;
        var length = Math.sqrt(dx * dx + dy * dy) + lw;

        context.save();
        context.translate(x1, y1);
        context.rotate(angle);
        context.drawImage(img, 0, 0, iw, ih, -lw, -lw, length, ih);
        context.restore();

    },

};

// (function() {
//     if (window["debug"]) {
//         alert("ImageUtils loaded")
//     }
// }());
