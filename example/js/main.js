"use strict";

var Color = GT.Color;
var EventDispatcher = GT.EventDispatcher;
var ProcessQ = GT.ProcessQ;
var ResourcePool = GT.ResourcePool;
var Scaler = GT.Scaler;
var Sound = GT.Sound;
var TimeTask = GT.TimeTask;

var dataForShare;


var game = new DefaultGame({

    appVer: 0.9,

    FPS: Config.FPS,
    useStaticTimeStep: Config.useStaticTimeStep,
    width: Config.width,
    height: Config.height,
    minSideRatio: 0.5,
    maxSideRatio: 0.85,

    autoLoad: false,

    incomingCommandDataQueue: [],

    dataEyeKey: null,


    waitingDisplayed: false,
    waitingRotation: 0,

    onlineCount: 0,

    accountType: null,
    accountId: null,

    initInput: function() {

        initTouchController();
        initTapListener();
        initPanListener();
        initSwipeListener();

        if (controller) {
            controller.pixelRatio = this.pixelRatio || 1;
            controller.offsetX = -this.offsetX || 0;
            controller.offsetY = -this.offsetY || 0;
        }

        this.initGameUI();

    },

    onOrientationChange: function() {
        this.setViewSize();
    },
    onResize: function() {
        if (controller) {
            controller.pixelRatio = this.pixelRatio || 1;
            controller.offsetX = -this.offsetX || 0;
            controller.offsetY = -this.offsetY || 0;
        }
    },
    reload: function() {

    },
    afterLoad: function() {

    },

    gotoStart: function() {
        this.gotoPlay();
    },

    gotoPlay: function() {
        var scene = new PlayScene();
        scene.init(this);
        this.setScene(scene);
    },

    initGameUI: function() {

    },

    afterRender: function(context, timeStep, now) {

    },

    smartPlay: function(soundId, args) {
        if (!Sound.muted) {
            Sound.smartPlay(soundId, args)
        }
    }

    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
});



var startGame = function() {

    // OneSDK.getUserInfo(function(userInfo) {
    //     // console.log(userInfo)
    //     userInfo = userInfo || {};
    //     game.userInfo = userInfo;
    //     game.accountId = userInfo.accountId || "";
    //     game.accountType = userInfo.accountType || "";
    //     game.loadUserIcon(game.userInfo.icon, function(img) {
    //         game.userImg = img || null;
    //     });
    // });

    window.scrollX = 0;
    window.scrollY = 0;

    var vw = window.innerWidth;
    var vh = window.innerHeight;

    if (!("ontouchstart" in window) && window.location.href.indexOf("http") !== 0) {
        // vw = 320;
        // vh = 504;
        // vh = 516;
        // vh = 416;
    } else {


    }
    // console.log(vw, vh)

    var s = "";
    var dataEyeKey = "da";
    dataEyeKey += "taE" + s + "yeKey";
    game[dataEyeKey] = 'B9B52A8EEAFD56FDB6D8E1228833B8E9';

    game.viewWidth = vw;
    game.viewHeight = vh;
    game.init();

    game.load();
    game.start();

    // game.domUI=new DomUI();
    // game.domUI.init();

};

var containerDom, infoDom;
var ImageMapping;
window.addEventListener("load", function() {
    containerDom = $id("container");
    infoDom = $id("info");

    Sprite.ImagePool = ResourcePool.cache;
    Sprite.ImageMapping = ImageMapping;

    var params = Utils.getUrlParams();

    game.debug = params.debug;
    game.local = !!params.local;
    game.fog = !!params.fog;
    game.b = !!params.b;
    game.browser = Utils.getBrowserInfo();
    game.adHeight = 100;

    startGame();

});

function dataLogPV(pageName) {};

function dataLogEvent(eventName, data) {};

function dataLogPayment(productId, amount) {};
