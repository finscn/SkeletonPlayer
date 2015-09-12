"use strict";

var LoadingScene = GT.Class.create({
    superclass: GT.Scene,

    name: "LoadingScene",

    x: 0,
    y: 0,
    process: 0,
    showLoading: false,
    showStart: false,


    init: function(game) {

        this.game = game;

        this.loadBgImg = $id("load-bg");
        this.loadValueImg = $id("load-value");
        this.initLoader();
        this.resize();
    },
    resize: function() {
        this.width = game.width;
        this.height = game.height;
    },
    initLoader: function() {
        var Me = this;
        var options = {
            parent: Me,
            defaultType: "img",
            wrapAudio: true,
            parallel: true,
            interval: 50,
            delay: 10,
            onProgressing: function(timeStep, queue) {
                var loaded = queue.finishedWeight,
                    total = queue.totalWeight,
                    results = queue.resultPool;
                Me.process = loaded / total;
            },
            onFinish: function(queue) {
                var loaded = queue.finishedWeight,
                    total = queue.totalWeight,
                    results = queue.resultPool;
                for (var id in results) {
                    ResourcePool.add(id, results[id]);
                }
                setTimeout(function() {
                    Me.onLoad(loaded, total, results);
                }, queue.delay);
            }
        };
        this.loader = new ProcessQ(options);
        this.loader.items = resourceList;
        this.loader.init();
    },

    startLoad: function() {
        if (this.game.beforeLoad) {
            this.game.beforeLoad();
        }
        this.loaded = false;
        this.loading = true;
        this.loader.start();
    },

    onLoad: function(loaded, total, results) {

        this.loaded = true;
        this.loading = false;
        if (this.game.afterLoad) {
            this.game.afterLoad();
        }
        var Me = this;
        setTimeout(function() {
            Me.onReady();
        }, 200);
    },

    onReady: function() {
        game.gotoStart();
    },

    enter: function() {
        dataLogEvent("Loading_start");
        this.showLoading = true;
        this.startLoad();
    },

    leave: function() {

    },

    update: function(timeStep, now) {

        if (this.showLoading) {
            if (this.process >= 1) {
                this.process = 1;
            }
        } else {

        }

    },

    render: function(context, timeStep, now) {
        context.clearRect(0, 0, this.width, this.height);
        if (this.showLoading) {

            var p = Math.min(1, this.process);

            if (this.loadValueImg) {
                var y = (this.height - this.loadValueImg.height >> 1) - 80;
                if (this.loadBgImg) {
                    var ox = 0;
                    var oy = 0;
                    context.drawImage(this.loadBgImg, (this.width - this.loadBgImg.width >> 1) + ox, y + oy);
                }
                var w = this.loadValueImg.width * p;
                if (w) {
                    context.drawImage(this.loadValueImg, 0, 0,
                        w, this.loadValueImg.height,
                        this.width - this.loadValueImg.width >> 1, y,
                        w, this.loadValueImg.height
                    );
                }
            } else {
                var width = this.width;
                context.fillStyle = "#ffffff";
                context.fillRect(0, this.height * 2 / 3 >> 0, width * p, 4);
            }

        }
    }

});
