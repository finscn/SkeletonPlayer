"use strict";


window.addEventListener("load", function() {

});

window.document.addEventListener("touchend", function(event) {
    if (event.target.tagName == "INPUT") {
        event.stopPropagation();
    }else{
        event.preventDefault();
    }
}, false);

window.document.addEventListener("touchmove", function(event) {
    event.preventDefault();
}, false);

// var sizeInfo="";
// setInterval(function(){
//     var t="onorientationchange" in window;
//     sizeInfo=[t,window.orientation,window.innerWidth, window.innerHeight].join(",")
// },1000)


window.addEventListener("resize", function() {
    if (game.ignoreResize){
        return;
    }
    Config.innerWidth = window.innerWidth;
    Config.innerHeight = window.innerHeight;
    // console.log(game.scaler, Config)
    if (game.scaler) {
        // setTimeout(function() {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        game.setViewSize(vw, vh);
        // }, 20);
    }
});



(function() {
    var _octimetout;
    window.addEventListener("orientationchange", function(event) {
        if (_octimetout) {
            clearTimeout(_octimetout)
        }
        _octimetout = setTimeout(function() {
            window._orientationchange()
        }, 8);
    }, false);

    window._orientationchange = function() {
        //TODO iOS
        if (window.orientation == 90 || window.orientation == -90) {

        } else {

        }
        Utils.resetViewport();
        setTimeout(function() {
            window.scrollX = 0;
            window.scrollY = 0;
            if (game && game.onOrientationChange) {
                game.onOrientationChange();
            }
        }, 8)
    }

}());



var KeyState = {};
var Key = {
    ENTER: 13,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    A: 65,
    D: 68,
    J: 74,
    K: 75,
    L: 76,
    P: 80,
    R: 82,
    S: 83,
    W: 87,
};

window.addEventListener("keydown", function(event) {
    KeyState[event.keyCode] = true;
}, true);

window.addEventListener("keyup", function(event) {
    KeyState[event.keyCode] = false;
}, true);
