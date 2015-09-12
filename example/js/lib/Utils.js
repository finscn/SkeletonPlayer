"use strict";

var Utils;
(function(exports) {
    Utils = Utils || {};

    var _utils = {

        DEG_TO_RAD: Math.PI / 180,
        RAD_TO_DEG: 180 / Math.PI,
        HALF_PI: Math.PI / 2,
        DOUBLE_PI: Math.PI * 2,

        isZero: function(num) {
            return num < 0.001 && num > -0.001;
        },

        random: function(min, max) {
            return (max - min) * Math.random() + min;
        },
        randomInt: function(min, max) {
            return ((max - min + 1) * Math.random() + min) >> 0;
        },
        probability: function(p) {
            return (1000 * Math.random() + 1 >> 0) / 1000 <= p;
        },

        randomHit: function(pList, total) {
            var len = pList.length;
            if (!total) {
                total = 0;
                for (var i = 0; i < len; i++) {
                    total += pList[i];
                }
            }
            var r = total * Math.random();
            var check = 0;
            for (var i = 0; i < len; i++) {
                check += pList[i];
                if (r < check) {
                    return i;
                }
            }
            return -1;
        },
        randomPick: function(list) {
            return list[Math.random() * list.length >> 0];
        },

        generateRandomFunction: function(seed) {
            seed = seed || Date.now() >> 0xF;
            return function() {
                seed = (214013 * seed + 2531011) & 4294967295;
                return seed / 4294967296;
            };
        },

        arrayShuffle: function(arr) {
            for (var i = arr.length - 1; i > 0; i--) {
                var rnd = (Math.random() * i) >> 0;
                var temp = arr[i];
                arr[i] = arr[rnd];
                arr[rnd] = temp;
            }
            return arr;
        },

        arrayUnique: function(arr) {
            var result = [];
            var json = {};
            for (var i = 0, len = arr.length; i < len; i++) {
                var value = arr[i];
                if (!json[value]) {
                    json[value] = 1;
                    result.push(value);
                }
            }
            return result;
        },

        cloneSimple: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        merger: function(receiver, supplier, override) {
            for (var key in supplier) {
                if (override !== false || !(key in receiver)) {
                    receiver[key] = supplier[key];
                }
            }
            return receiver;
        },
        simpleClone: function(data) {
            return JSON.parse(JSON.stringify(data));
        },

        serialize: function(data) {
            return JSON.stringify(data);
        },

        deserialize: function(data) {
            return JSON.parse(data);
        },

        parseTime: function(time) {
            var sec = time / 1000 >> 0;
            var min = sec / 60 >> 0;
            sec = sec % 60;
            var cs = (time % 1000) / 10 >> 0;
            return [min, sec, cs];
        },

        endWith: function(str, subStr) {
            var idx = str.indexOf(subStr);
            return idx >= 0 && idx === str.length - subStr.length;
        },

        /////////////////////////////////////////
        /////////////////////////////////////////
        /////////////////////////////////////////


        checkPointInRect: function(px, py, x, y, w, h) {
            return x < px && y < py && px < x + w && py < y + h;
        },
        checkPointInAABB: function(x, y, aabb) {
            return aabb[0] < x && aabb[1] < y && x < aabb[2] && y < aabb[3];
        },
        checkLineAABB: function(x1, x2, y1, aabb) {
            return aabb[0] < x2 && aabb[1] < y1 && aabb[2] > x1 && aabb[3] > y1;
        },
        checkCollideAABB: function(aabb, aabb2) {
            return aabb[0] < aabb2[2] && aabb[1] < aabb2[3] && aabb[2] > aabb2[0] && aabb[3] > aabb2[1];
        },

        "$id": function(id) {
            return document.getElementById(id);
        },

        "$q": function(q) {
            return document.querySelector(q);
        },
        "$qs": function(q) {
            return document.querySelectorAll(q);
        },

        screenAdapter: function() {

        },

        createCanvas: function(width, height) {
            var canvas = document.createElement("canvas");
            canvas.retinaResolutionEnabled = false;
            canvas.width = width;
            canvas.height = height;
            return canvas;
        },

        lazyImages: {},
        getImageInfo: function(id, img) {
            if (typeof id != "string") {
                if (id.tagName) {
                    img = id;
                } else {
                    return null;
                }
            } else {
                img = ResourcePool.get(id);
            }
            if (img) {
                return {
                    "img": img,
                    "x": 0,
                    "y": 0,
                    "w": img.width,
                    "h": img.height,
                    "ox": 0,
                    "oy": 0,
                    "sw": img.width,
                    "sh": img.height,
                }
            }
            var mapping = (typeof ImageMapping != "undefined") ? ImageMapping[id] : null;
            if (mapping) {
                var imgId = mapping["img"];
                var img = ResourcePool.get(imgId);
                var info = {
                    "x": mapping["x"],
                    "y": mapping["y"],
                    "w": mapping["w"],
                    "h": mapping["h"],
                    "ox": mapping["ox"],
                    "oy": mapping["oy"],
                    "sw": mapping["sw"],
                    "sh": mapping["sh"],
                }
                if (img) {
                    info.img = img;
                } else {
                    if (!Utils.blankImage) {
                        Utils.blankImage = document.createElement("canvas");
                        Utils.blankImage.width = 1023;
                        Utils.blankImage.height = 1023;
                    }
                    info.img = Utils.blankImage;
                    var list = Utils.lazyImages[imgId] = Utils.lazyImages[imgId] || [];
                    list.push(info);
                }

                return info;
            } else {
                console.log("Utils.getImageInfo err : ", id)
            }
            return null;
        },
        getImageAABB: function(img, x, y, scale) {
            x = x || 0;
            y = y || 0;
            scale = scale || 1;
            return [
                x,
                y,
                x + img.width * scale,
                y + img.height * scale
            ]
        },
        getImageInfoAABB: function(img, x, y, scale) {
            x = x || 0;
            y = y || 0;
            scale = scale || 1;
            return [
                x,
                y,
                x + img.w * scale,
                y + img.h * scale
            ]
        },

        strokeAABB: function(context, aabb, color) {
            color = color || "red";
            var bak = context.strokeStyle;
            context.strokeStyle = color;
            context.strokeRect(aabb[0], aabb[1], aabb[2] - aabb[0], aabb[3] - aabb[1]);
            context.strokeStyle = bak;
        },
        fillAABB: function(context, aabb, color) {
            color = color || "red";
            var bak = context.fillStyle;
            context.fillStyle = color;
            context.fillRect(aabb[0], aabb[1], aabb[2] - aabb[0], aabb[3] - aabb[1]);
            context.fillStyle = bak;
        },
        renderImageCenter: function(context, img, parent, ox, oy, scale) {
            ox = ox || 0;
            oy = oy || 0;
            scale = scale || 1;
            var sw = img.width * scale,
                sh = img.height * scale;
            context.drawImage(img, 0, 0, img.width, img.height, ((parent.width - sw) >> 1) + ox, ((parent.height - sh) >> 1) + oy,
                sw, sh);
        },

        renderEntities: function(entities, context, timeStep, now) {
            var i = 0,
                len = entities.length;
            while (i < len) {
                var e = entities[i];
                if (e._to_remove_) {
                    len--;
                    entities.splice(i, 1);
                    continue;
                }
                e.render(context, timeStep, now);
                i++;
            }
        },
        renderText: function(context, text, charsheet, x, y, space) {
            x = x || 0;
            y = y || 0;
            space = space || 0;
            var x1 = x;
            for (var i = 0; i < text.length; i++) {
                var c = text[i];
                if (c === " ") {
                    x += space + space;
                    continue;
                    // c = "space"
                } else if (c == ".") {
                    c = "dot"
                } else if (c == "分") {
                    c = "point";
                }
                var n = charsheet[c];
                if (n) {
                    context.drawImage(n.img, n.x, n.y, n.w, n.h, x, y, n.w, n.h);
                    x += n.w + space;
                }
            }
            return x - x1;
        },
        renderImageInfo: function(context, imgInfo, x, y, w, h) {
            x = x || 0;
            y = y || 0;
            context.drawImage(imgInfo.img, imgInfo.x, imgInfo.y, imgInfo.w, imgInfo.h,
                x + imgInfo.ox >> 0, y + imgInfo.oy >> 0, w || imgInfo.w, h || imgInfo.h);
        },
        renderInfoImg: function(context, imgInfo, x, y, w, h) {
            x = x || 0;
            y = y || 0;
            context.drawImage(imgInfo.img, imgInfo.x, imgInfo.y, imgInfo.w, imgInfo.h,
                x, y, w || imgInfo.w, h || imgInfo.h);
        },

        createDrawInfo: function(img, display) {
            var imgInfo = Utils.getImageInfo(img);
            if (!imgInfo || !imgInfo.img) {
                return null;
            }
            imgInfo.ix = imgInfo.x;
            imgInfo.iy = imgInfo.y;
            imgInfo.iw = imgInfo.w;
            imgInfo.ih = imgInfo.h;
            imgInfo.x = 0;
            imgInfo.y = 0;
            imgInfo.alpha = 1;
            // imgInfo.scaleX = 1;
            // imgInfo.scaleY = 1;
            imgInfo.scale = 1;
            imgInfo.flipX = false;
            imgInfo.flipY = false;
            imgInfo.rotation = 0;
            imgInfo.display = !!display;
            return imgInfo;
        },
        renderDrawInfo: function(context, drawInfo, offsetX, offsetY) {
            var di = drawInfo;
            if (di.display && di.alpha > 0) {
                var x = di.ox + (offsetX || 0);
                var y = di.oy + (offsetY || 0);
                var rotation = di.rotation % Utils.DOUBLE_PI;
                var scaleX = di.scale * (di.flipX ? -1 : 1);
                var scaleY = di.scale * (di.flipY ? -1 : 1);
                if (scaleX != 1 || scaleY != 1 || rotation != 0) {
                    context.save();
                    context.translate(di.x, di.y);
                    if (rotation) {
                        context.rotate(rotation);
                    }
                    context.scale(scaleX, scaleY);
                } else {
                    x += di.x;
                    y += di.y;
                }
                context.globalAlpha = di.alpha < 1 ? di.alpha : 1;
                context.drawImage(di.img, di.ix, di.iy, di.iw, di.ih, x, y, di.w, di.h);
                if (scaleX != 1 || scaleY != 1 || rotation != 0) {
                    context.restore();
                } else {
                    context.globalAlpha = 1;
                }
            }
        },

        loadImage: function(src, callback) {
            var img = new Image();
            img.onload = function(event) {
                callback(img, event);
            };
            img.onerror = function(event) {
                callback(null, event);
            };
            img.src = src;
            return img;
        },

        loadImages: function(cfgList, callback) {
            // src  id  onLoad(img, $next)
            var count = cfgList.length;
            var imgList = new Array(count);
            var idx = -1;
            var $next = function() {
                idx++;
                if (idx >= count) {
                    callback(imgList);
                    return;
                }
                var cfg = cfgList[idx];
                var img = new Image();
                img.src = cfg.src;
                img.id = cfg.id;
                img.onload = function(event) {
                    imgList[idx] = img;
                    if (cfg.onLoad) {
                        cfg.onLoad.call(img, img);
                    }
                    $next();
                };
                img.onerror = function() {
                    $next();
                };
            }
            $next();
            return imgList;
        },

        preloadImages: function(srcList, callback) {
            var img = new Image();
            var totalCount = srcList.length;
            var idx = 0;
            img.src = srcList[idx];
            img.onload = function() {
                idx++;
                if (idx === totalCount) {
                    callback(idx, totalCount);
                    return;
                }
                img.src = srcList[idx];
            }
        },

        // 简单的ajax工具函数, 不包含超时、取消、跨浏览器、XML等非常复杂情况
        simpleAjax: function(url, options) {
            /*
                options: {
                    callback: 回调函数,
                    method: 请求方式,
                    async: 是否同步,
                    json: 以 'application/json' 方式提交的对象,
                    data: 普通post的参数(不能与 json 共存)
                }
            */
            options = options || {};
            var callback = options.callback;
            var method = (options.method || "GET").toUpperCase(),
                async = options.async === false ? false : true;

            var json = options.json || null,
                data;
            if (json) {
                data = JSON.stringify(json);
            } else {
                data = options.data;
                // 如果 data不是字符串和数字,那么当做object处理, 生成queryString.
                if (data && (typeof data != "string" && typeof data != "number")) {
                    var str = "";
                    for (var k in data) {
                        str += '&' + k + '=' + data[k];
                    }
                    data = str.substr(1);
                }
            }

            var xhr = new XMLHttpRequest();
            xhr.open(method, url, async);
            if (json) {
                xhr.setRequestHeader('Content-type', 'application/json');
            } else if (method == "POST") {
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
            }
            if (callback) {
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        callback(xhr.responseText, xhr);
                    }
                }
            }
            xhr.send(data);
            // 异步请求时, 这个返回值没有意义
            return xhr.responseText;
        },

        includeJSCode: function(code, onload) {
            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            var script = document.createElement("script");
            script.type = "text/javascript";
            // script.charset = "UTF-8";
            // script.defer = false;

            script.innerHTML = code || "";
            head.appendChild(script);
            // setTimeout(function(){
            script.innerHTML = code || "";
            // var _code=script.innerHTML;
            // _code+="";
            // for (var i=0;i<9999;i++){
            //     var _t=script.innerHTML[i];
            // }
            if (window["debug"]) {
                // alert(script.innerHTML);
            }
            // },10);

            // script.innerHTML = code;
            // script.appendChild(document.createTextNode(code));

            // head.insertBefore(script, head.firstChild);

            // if (onload) {
            //     onload(script);
            // }
            return script;
        },

        includeJS: function(src, onload) {

            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.charset = "UTF-8";
            script.defer = false;
            script.src = src;
            head.appendChild(script);
            script.src = src;
            // head.insertBefore(script, head.firstChild);

            var done = false;
            script.onload = script.onreadystatechange = function(e) {
                if (!done &&
                    (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                    done = true;
                    if (onload) {
                        onload(script);
                    }
                    this.onload = this.onreadystatechange = this.onerror = null;
                }
            };
            script.onerror = function(e) {
                if (onload) {
                    onload(e);
                }
                this.onload = this.onreadystatechange = this.onerror = null;
            };
            return script;
        },

        jsonp: function(url, options, callbackFn) {
            if (typeof options == "function") {
                callbackFn = options;
                options = null;
            }
            options = options || {};
            var id = Utils.jsonp.ID ? (++Utils.jsonp.ID) : 1;
            var callbackName = options.callback = options.callback || "_cb" + id + "_" + (Math.random() * 100 >> 0);

            var queryString = [];
            for (var key in options) {
                key = Utils.encodeURIComponent(key);
                var value = Utils.encodeURIComponent(options[key]);
                queryString.push(key + "=" + value);
            }

            if (queryString.length > 0) {
                url = url + ((url.indexOf("?") > 0 ? "&" : "?")) + queryString.join("&");
            }

            window[callbackName] = callbackFn;
            var script = Utils.includeJS(url, function() {
                setTimeout(function() {
                    script.parentNode.removeChild(script);
                    delete window[callbackName];
                }, 197);
            });

        },

        getAbsolutePath: function(relativePath) {
            var a = document.createElement("a");
            a.href = relativePath;
            var absolutePath = a.href;
            return absolutePath;
        },

        getBrowserInfo: function() {
            var browser = {};

            if (!window.navigator || !window.navigator.userAgent) {
                return browser;
            }
            var ua = window.navigator.userAgent.toLowerCase();
            // alert(ua);
            var match =
                /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(chromium)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                /(safari)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) || !/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];


            browser[match[1]] = true;

            browser.mobile = ua.indexOf("mobile") > 0 || "ontouchstart" in window;

            browser.weixin = /micromessenger/.test(ua);
            browser.weibo = /weibo/.test(ua);
            browser.QQBrowser = /qqbrowser/.test(ua);
            browser.QQ = (/qq/.test(ua)) && !browser.QQBrowser;

            browser.iPhone = /iphone/.test(ua);
            browser.iPad = /ipad/.test(ua);
            browser.iPod = /ipod/.test(ua);
            browser.iOS = browser.iPhone || browser.iPad || browser.iPod;
            browser.iOS4 = browser.iOS && ua.indexOf("os 4") > 0;
            browser.iOS5 = browser.iOS && ua.indexOf("os 5") > 0;
            browser.iOS6 = browser.iOS && ua.indexOf("os 6") > 0;
            browser.iOS7 = browser.iOS && ua.indexOf("os 7") > 0;
            browser.iOS8 = browser.iOS && ua.indexOf("os 8") > 0;
            browser.iOS9 = browser.iOS && ua.indexOf("os 9") > 0;

            browser.android = /android/.test(ua);
            browser.android2 = /android 2/.test(ua);
            browser.android4 = /android 4/.test(ua);
            browser.android44 = /android 4.4/.test(ua);
            browser.wp = /iemobile/.test(ua) || ua.indexOf("windows phone") > 0;

            browser.retain = window.devicePixelRatio >= 1.5;

            browser.viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            browser.screen = {
                width: window.screen.availWidth * (window.devicePixelRatio || 1),
                height: window.screen.availHeight * (window.devicePixelRatio || 1)
            };

            return browser;
        },
        encodeURIComponent: function(str) {
            return encodeURIComponent(str);
        },
        decodeURIComponent: function(str) {
            return decodeURIComponent(str);
        },

        getUrlParams: function() {
            var params = {};
            var queryStr = window.location.search;
            if (queryStr) {
                queryStr = queryStr.substring(1);
                var args = queryStr.split("&");
                for (var i = 0, a, nv; a = args[i]; i++) {
                    nv = args[i] = a.split("=");
                    params[nv[0]] = nv.length > 1 ? Utils.decodeURIComponent(nv[1]) : true;
                }
            }
            return params;
        },

        conditionTask: function(conditionFn, task, interval) {
            interval = interval || 300;
            var intervalId = setInterval(function() {
                if (conditionFn()) {
                    clearInterval(intervalId);
                    task();
                    return;
                }
            }, interval);
        },

        resetViewport: function() {
            Utils.setViewport("device-width", null)
        },
        setViewport: function(width, height) {
            if (!document.head) {
                return;
            }
            var meta = document.querySelector ? document.querySelector('meta[name=viewport]') : null;
            if (!meta) {
                meta = document.createElement("meta");
                document.head.appendChild(meta);
                meta.setAttribute("name", "viewport");
            }
            var content = [
                "width=" + width,
                height ? ("height=" + height) : "",
                "user-scalable=" + "no",
                "minimum-scale=" + 1,
                "maximum-scale=" + 1,
                "initial-scale=" + 1,
                // "minimal-ui",
                // "target-densitydpi=device-dpi",
                // "target-densitydpi=" + "160dpi",
            ];
            meta.setAttribute("content", content.join(", "));
        },

        scaleViewport: function(scale, userScalable) {
            scale = scale || 1;
            var content = [
                "width=device-width",
                "user-scalable=" + (userScalable ? "yes" : "no"),
                "minimum-scale=" + scale / (userScalable ? 2 : 1), // 最多缩小到 50%
                "maximum-scale=" + scale * (userScalable ? 2 : 1), // 最多放大到 200%
                "initial-scale=" + scale
            ].join(", ");
            var meta = document.createElement("meta");
            meta.setAttribute("name", "viewport");
            meta.setAttribute("content", content);
            var root = document.head || document.documentElement || document.body;
            if (root.firstChild) {
                root.insertBefore(meta, root.firstChild)
            } else {
                root.appendChild(meta);
            }
            return true;
        },

        autoScaleViewport: function(designWidth, designHeight, cb) {
            Utils.scaleViewport(1);
            setTimeout(function() {
                var innerW = window.innerWidth,
                    innerH = window.innerHeight;
                var scaleX = designWidth ? innerW / designWidth || 0 : 0,
                    scaleY = designHeight ? innerH / designHeight || 0 : 0;
                // alert([scaleX,scaleY,designWidth, designHeight,innerW,innerH])
                var scale = Math.max(scaleX, scaleY);
                Utils.scaleViewport(scale);
                if (cb) {
                    setTimeout(function() {
                        cb(scale);
                    }, 110);
                }
            }, 110)
        },

        setCookie: function(key, value) {
            var domainPrefix = window.location.host;
            window.document.cookie = key + "=" + value + "; " + "" + "path=/; domain=" + domainPrefix + ";";
        },
        getCookie: function(key) {
            // var r = new RegExp("(?:^|;+|\\s+)" + key + "=([^;]*?)(?:;|$)");
            // var r = new RegExp("(?:^|;+|\\s+);
            // speedMode = ([^;]*?)(?:;|$)"))
            var r = new RegExp("(?:^|;+|\\s+)" + key + "=([^;]*)");
            var m = window.document.cookie.match(r);
            return (!m ? "" : m[1]);
        },
        removeCookie: function(key) {
            var domainPrefix = window.location.host;
            window.document.cookie = key + "=; expires=Mon, 13 Jun 1982 06:00:00 GMT; " + "path=/; domain=" + domainPrefix + ";";
        }

    };

    for (var p in _utils) {
        Utils[p] = _utils[p];
    }

    exports["$id"] = Utils["$id"];

}(this));
