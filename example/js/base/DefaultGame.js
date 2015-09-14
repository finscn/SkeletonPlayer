"use strict";

var DefaultGame = GT.Class.create({
    superclass: GT.Game,

    FPS: 45,
    width: 600,
    height: 400,
    caption: '',
    useStaticTimeStep: false,
    keyState: null,
    pixelRatio: null,
    minSideRatio: 0.5,
    maxSideRatio: 0.95,

    ignoreResize: false,
    autoLoad: true,

    croppingColor: "#060606",

    cropView: true,

    waitingDisplayed: false,

    scaleMode: null,

    onInit: function(caption) {
        this.scaler = new GT.Scaler({
            width: this.width,
            height: this.height,
            scaleMode: this.scaleMode === null ? GT.Scaler.ASPECT_FIT : this.scaleMode,
            // scaleMode: GT.Scaler.CENTER
            // scaleMode: GT.Scaler.ASPECT_FIT
            // scaleMode: GT.Scaler.HEIGHT_FIT
            // scaleMode: GT.Scaler.ASPECT_FILL
        });
        this.setViewSize(this.viewWidth, this.viewHeight);

        this.timeTask = new GT.TimeTask();
        this.caption = caption;
        this.initEvent();
        this.initInput();

        // this.beforeLoad();

        // var scene = new StartScene();
        if (this.autoLoad) {
            this.load();
        }
    },

    log: function(args) {
        console.log.apply(console, args);
    },

    load: function() {
        var scene = new LoadingScene();
        scene.init(this);
        this.setScene(scene);
    },

    initGraphicContext: function() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
    },

    resetScroll: function() {
        setTimeout(function() {
            window.scrollX = 0;
            window.scrollY = 0;
        }, 10);
    },

    setViewSize: function(w, h) {
        this.viewWidth = w || window.innerWidth;
        this.viewHeight = h || window.innerHeight;

        this.resize();
    },

    setSize: function(w, h) {
        this.width = w;
        this.height = h;

        this.resize();

    },

    resize: function() {

        this.long = Math.max(this.width, this.height);
        this.short = Math.min(this.width, this.height);

        if (window.orientation == 90 || window.orientation == -90) {
            this.landscape = true;
        } else {
            this.landscape = false;
        }

        this.scaler.setSize(this.width, this.height);
        this.scaler.setScreenSize(this.viewWidth, this.viewHeight);
        this.scaler.update();
        var useTransform = false;
        this.scaler.resizeCanvas(this.canvas, useTransform);
        this.fullWidth = this.scaler.fullWidth;
        this.fullHeight = this.scaler.fullHeight;

        if (this.canvas.parentNode && this.canvas.parentNode != document.body) {
            // this.canvas.parentNode.style.width = this.canvas.style.width;
            // this.canvas.parentNode.style.height = this.canvas.style.height;
            this.canvas.parentNode.style.width = this.viewWidth + "px";
            this.canvas.parentNode.style.height = this.viewHeight + "px";
        }

        this.offsetX = this.scaler.offsetX;
        this.offsetY = this.scaler.offsetY;
        this.pixelRatio = 1 / this.scaler.scale;

        // alert([this.viewWidth, this.viewHeight, "-", this.fullWidth, this.fullHeight, "-", this.offsetX, this.offsetY])

        if (this.scene) {
            this.scene.width = this.width;
            this.scene.height = this.height;
            if (this.scene.resize) {
                this.scene.resize();
            }
        }

        this.onResize();
    },



    initEvent: function() {
        var Me = this;
        Me.keyState = Me.keyState || {};

        Me.ax = 0;
        Me.ay = 0;
        Me.az = 0;
        window.addEventListener("devicemotion", function(event) {
            var a = event.accelerationIncludingGravity;
            if (a) {
                Me.ax = a.x;
                Me.ay = a.y;
                Me.az = a.z;
            }
        });

        window.addEventListener("keydown", function(event) {
            Me.keyState[event.keyCode] = true;
        }, true);

        window.addEventListener("keyup", function(event) {
            Me.keyState[event.keyCode] = false;
        }, true);

        window.addEventListener("pagehide", function(event) {
            Me.pageHidden = true;
        }, true);
        window.addEventListener("pageshow", function(event) {
            Me.pageHidden = false;
        }, true);

        var hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        document.addEventListener(visibilityChange, function(event) {
            if (document[hidden]) {
                Me.pageHidden = true;
                Me.onPageHidden();
            } else {
                Me.pageHidden = false;
                Me.onPageVisible();
            }
        }, false);
    },

    noop: function() {},

    initInput: function() {},
    beforeLoad: function() {},
    afterLoad: function() {},
    onStart: function() {},

    onResize: function() {},
    onOrientationChange: function() {},

    onPageHidden: function() {},
    onPageVisible: function() {},


    setScene: function(scene) {
        if (this.scene && this.scene.leave) {
            this.scene.leave();
        }
        this.frame = 0;
        this.scene = scene;
        TouchInfo.reset();
        scene.enter();
    },

    handleInput: function(timeStep, now) {

        var start = TouchInfo.firstStart;
        var end = TouchInfo.firstEnd;
        var tap = TouchInfo.firstTap;
        var pan = TouchInfo.firstPan;
        var swipe = TouchInfo.firstSwipe;

        if (this.waitingDisplayed) {
            return;
        }
        if (this.modalComponent) {
            if (start) {
                var time = now - start.time;
                if (time < 400) {
                    // console.log(start, this.modalComponent.aabb);
                    this.modalComponent.touchStart(start.x, start.y, now);
                    TouchInfo.firstTap = null;
                }
            }
            if (tap) {
                var time = now - tap.time;
                if (time < 400) {
                    // console.log(tap, this.modalComponent.aabb)
                    this.modalComponent.tap(tap.x, tap.y, now);
                    TouchInfo.firstTap = null;
                }
            }
            return;
        }

        if (this.scene) {

            if (this.scene.handleStart) {
                if (start) {
                    this.scene.handleStart(start.x, start.y, now);
                    TouchInfo.firstStart = null;
                }
            }

            if (this.scene.handlePan) {
                if (pan) {
                    this.scene.handlePan(pan.dx, pan.dy, pan.x, pan.y, pan.sx, pan.sy, now);
                    TouchInfo.firstPan.dx = 0;
                    TouchInfo.firstPan.dy = 0;
                    TouchInfo.firstPan = null;
                }
            }

            if (this.scene.handleSwipe) {
                if (swipe) {
                    // for (var id in swipe) {
                    //     var info = swipe[id];
                    //     if (info) {
                    //         this.scene.handleSwipe(info, timeStep, now);
                    //         delete swipe[id];
                    //     }
                    // }
                    this.scene.handleSwipe(swipe.vx, swipe.vy, swipe.sx, swipe.sy, now);
                    TouchInfo.firstSwipe = null;
                }
            }


            if (this.scene.handleEnd) {
                if (end) {
                    var time = now - end.time;
                    if (time < 400) {
                        this.scene.handleEnd(end.x, end.y, now);
                        TouchInfo.firstEnd = null;
                    }
                }
            }

            if (this.scene.handleTap) {
                if (tap) {
                    var time = now - tap.time;
                    if (time < 400) {
                        this.scene.handleTap(tap.x, tap.y, now);
                        TouchInfo.firstTap = null;
                    }
                }
            }



            if (this.scene.handleInput) {
                this.scene.handleInput(timeStep, now);
            }
        }
    },

    update: function(timeStep, now) {
        // timeStep = Config.timeStep;
        if (this.pageHidden) {
            return;
        }
        timeStep = Math.min(timeStep, 100);

        this.timeTask.update(timeStep, now);
        TWEEN.update();
        if (this.scene) {
            this.scene.update(timeStep, now);
        }
        this.checkLazyResources(timeStep, now);
    },
    checkLazyResources: function(timeStep, now) {
        this.lazyCooldown -= timeStep;
        if (this.lazyCooldown > 0) {
            return;
        }
        this.lazyCooldown = 300;
        for (var id in Utils.lazyImages) {
            var img = ResourcePool.get(id);
            if (img) {
                var images = Utils.lazyImages[id];
                images.forEach(function(imageInfo) {
                    imageInfo.img = img;
                });
                delete Utils.lazyImages[id];
            }
        }
    },

    render: function(timeStep, now) {
        if (this.pageHidden) {
            return;
        }
        timeStep = Math.min(timeStep, 100);
        var ctx = this.context;
        // ctx.clearRect(0, 0, this.fullWidth, this.fullHeight);
        if (this.scene) {
            if (this.offsetX || this.offsetY) {
                ctx.translate(this.offsetX, this.offsetY);
            }

            this.scene.render(ctx, timeStep, now);

            if (this.debug) {
                // ctx.lineWidth = 8;
                // ctx.strokeStyle = "red";
                // ctx.strokeRect(0, 0, this.width, this.height);
            }

            if (this.offsetX || this.offsetY) {
                ctx.translate(-this.offsetX, -this.offsetY);
                if (!this.cropView) {
                    return;
                }
                if (this.offsetX > 0) {
                    if (this.croppingColor) {
                        ctx.fillStyle = this.croppingColor;
                        ctx.fillRect(0, this.offsetY - 1, this.offsetX, this.fullHeight - this.offsetY * 2 + 2);
                        ctx.fillRect(this.offsetX + this.width, this.offsetY - 1, this.offsetX + 2, this.fullHeight - this.offsetY * 2 + 2);
                    } else {
                        ctx.clearRect(0, this.offsetY - 1, this.offsetX, this.fullHeight - this.offsetY * 2 + 2);
                        ctx.clearRect(this.offsetX + this.width, this.offsetY - 1, this.offsetX + 2, this.fullHeight - this.offsetY * 2 + 2);
                    }
                }
                if (this.offsetY > 0) {
                    if (this.croppingColor) {
                        ctx.fillStyle = this.croppingColor;
                        ctx.fillRect(-1, -2, this.fullWidth + 2, this.offsetY + 2);
                        ctx.fillRect(-1, this.offsetY + this.height, this.fullWidth + 2, this.offsetY + 2);
                    } else {
                        ctx.clearRect(-1, -2, this.fullWidth + 2, this.offsetY + 2);
                        ctx.clearRect(-1, this.offsetY + this.height, this.fullWidth + 2, this.offsetY + 2);
                    }
                }
                ///////////////////
            }
        }

        this.afterRender(ctx, timeStep, now);
    },
    afterRender: function(context, timeStep, now) {

    },

    isInFrame: function() {
        return window.parent != window;
    },
    isInWeixin: function() {
        return !!window.WeixinJSBridge;
    },
    isInEndGame: function() {
        return this.isInFrame() && !!window.eg && window.name == "endgame";
    },
    isUnderWeixin: function() {
        return this.browser.weixin || !!window.WeixinJSBridge;
    },
    isUnderWeibo: function() {
        return this.browser.weibo;
    },
    isUnderQQ: function() {
        return this.browser.qq;
    },
});
