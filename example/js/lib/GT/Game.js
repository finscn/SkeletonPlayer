"use strict";

var GT = GT || {};

(function(exports) {

    var Class = exports.Class;

    /***************************/
    /********** Game ***********/
    /***************************/

    var Game = Class.create({

        id: null,
        width: 600,
        height: 400,
        viewWidth: 0,
        viewHeight: 0,
        FPS: 60,
        caption: '',
        context: null, // graphic-context
        useStaticTimeStep: false,
        frame: 0,
        timeBlank: 0,

        init: function() {

            this._width = this.width;
            this._height = this.height;
            this.offsetX = 0;
            this.offsetY = 0;

            if (this.beforeInit) {
                this.beforeInit.apply(this, arguments);
            }

            var Me = this;
            // if (requestAnimationFrame.mock) {
            //     this._run = function() {
            //         Me.run();
            //     };
            // } else {
            //     this._run = function() {
            //         Me.rafId = requestAnimationFrame(Me._runCore);
            //     };
            //     this._runCore = function() {
            //         Me.run();
            //     }
            // }
            this._run = function() {
                Me.run();
            };

            this.timer = {
                now: 0,
                last: 0,
                // step: Math.round(1000 / this.FPS)
                step: Math.floor(1000 / this.FPS)
            };
            this.staticTimeStep = this.timer.step;

            this.initGraphicContext();

            if (this.onInit) {
                this.onInit.apply(this, arguments);
            }
        },

        // implement by yourself
        initGraphicContext: function() {

        },

        start: function() {
            this.timer.now = Date.now();
            this.timer.last = this.timer.now;
            this.paused = false;
            this.running = true;
            this.frame = 0;
            if (this.onStart) {
                this.onStart();
            }
            this.run();
        },
        stop: function() {
            this.running = false;
            if (this.onStop) {
                this.onStop();
            }
        },
        stopNow: function() {
            // clearTimeout(this.loopId);
            cancelAnimationFrame(this.loopId);
            this.running = false;
            if (this.onStop) {
                this.onStop();
            }
        },
        pause: function() {
            this.paused = true;
            if (this.onPause) {
                this.onPause();
            }
        },
        resume: function() {
            this.paused = false;
            if (this.onResume) {
                this.onResume();
            }
        },

        pauseLoop: function() {
            this.running = false;
            if (this.loopId) {
                // clearTimeout(this.loopId);
                cancelAnimationFrame(this.loopId);
            }
        },
        resumeLoop: function() {
            this.timer.last = Date.now();
            this.run();
        },

        run: function() {
            var now = this.timer.now = Date.now();
            var timeStep = now - this.timer.last;
            // this.loopId = setTimeout(this._run, this.staticTimeStep);
            this.loopId = requestAnimationFrame(this._run, this.staticTimeStep);
            var blank = timeStep - this.staticTimeStep;
            if (blank >= 0) {
                // this.timer.last = now;
                this.timer.last = now - blank;

                this.handleInput(timeStep, now);
                if (!this.paused && timeStep > 1) {
                    timeStep = this.useStaticTimeStep ? this.staticTimeStep : timeStep;
                    this.frame++;
                    this.update(timeStep, now);
                    this.render(timeStep, now);
                }
                if (!this.running && this.loopId) {
                    clearTimeout(this.loopId);
                    cancelAnimationFrame(this.rafId);
                }
            }
        },

        setScene: function(scene) {
            if (this.scene && this.scene.leave) {
                this.scene.leave();
            }
            this.frame = 0;
            this.scene = scene;
            scene.enter();
        },

        update: function(timeStep, now) {
            if (this.scene) {
                this.scene.update(timeStep, now);
            }
        },

        render: function(timeStep, now) {
            if (this.scene) {
                this.scene.render(this.context, timeStep, now);
            }
        },

        handleInput: function(timeStep, now) {
            if (this.scene) {
                this.scene.handleInput(timeStep, now);
            }
        },
        // some hooks, implement by yourself
        onInit: null,
        onStart: null,
        onPause: null,
        onResume: null,
        onStop: null,

    });

    exports.Game = Game;


    /***************************/
    /********** Scene **********/
    /***************************/

    var Scene = Class.create({

        id: null,
        frame: 0,
        init: function(game) {

        },
        enter: function() {

        },
        leave: function(nextScene) {

        },
        jumpToScene: function(sceneClass) {
            var scene = new sceneClass();
            scene.init(this.game);
            this.game.setScene(scene);
            return scene;
        },
        update: function(timeStep, now) {

        },
        render: function(context, timeStep, now) {

        },
        handleInput: function(timeStep, now) {

        }
    });

    exports.Scene = Scene;


    /***************************/
    /*********** rAF ***********/
    /***************************/
    (function() {
        var vendors = ['ms', 'moz', 'webkit'];
        for (var i = 0; !window.requestAnimationFrame && i < vendors.length; ++i) {
            var p = vendors[i];
            window.requestAnimationFrame = window[p + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[p + 'CancelAnimationFrame'] || window[p + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                return window.setTimeout(callback, 16);
            };
            window.requestAnimationFrame.mock = true;
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                return window.clearTimeout(id);
            };
        }
    }());


}(GT));
