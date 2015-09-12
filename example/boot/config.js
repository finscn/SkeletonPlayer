"use strict";
var Config = {
    gameKey: "doudizhu",
    moneyName: "元",
    moneySymbol: "¥",
    ver: 0.01,
    port: window.location.port,
    // port: 8001,

    // imgScale: 3,
    // width: 640,
    // height: 960,

    imgScale: 2,
    width: 640 * 1.5,
    height: 832 * 1.5,
    // height: 960,

    // viewWidth: 320,
    // viewHeight: 960,
    FPS: 60,
    // FPS: 30,
    useStaticTimeStep: true,
    innerWidthOrigin: window.innerWidth,
    innerHeightOrigin: window.innerHeight,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
};

(function() {
    // var r = window.innerWidth / window.innerHeight;
    // var minR = 640 / 1010;
    // var maxR = 640 / 830;
    // r = Math.min(maxR, Math.max(minR, r));
    // Config.height = Config.width / r >> 0;
    // // alert(Config.height);


    var realR = window.innerWidth / window.innerHeight;
    var minR = 640 / 1010;
    var maxR = 640 / 830;
    var r = Math.min(maxR, Math.max(minR, realR));
    if (realR <= maxR) {
        Config.height = Config.width / r >> 0;
    } else {
        // Config.height = Config.width / realR >> 0;
        Config.width = Config.height * realR >> 0;
    }

}());



Config.timeStep = 1000 / Config.FPS >> 0;

if (!window.devicePixelRatio) {
    window.devicePixelRatio = 1;
}

window.debug = true;
window.log = function(args) {
    if (window.debug) {
        console.log.apply(console, arguments);
    }
};
