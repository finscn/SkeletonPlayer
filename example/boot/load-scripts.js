"use strict";

(function(exports) {


    exports.getJSList = function(root) {
        root = root || "";

        var list = [
            // [JS-FILE]


            "boot/config.js",
            "boot/resource-list.js",

            "js/lib/init.js",

            "js/lib/Tween.js",
            "js/lib/Slider.js",
            "js/lib/Font.js",
            "js/lib/Utils.js",
            "js/lib/ImageUtils.js",
            "js/lib/DomUI.js",


            "js/lib/GT/Class.js",
            "js/lib/GT/Game.js",
            "js/lib/GT/Color.js",
            "js/lib/GT/EventDispatcher.js",
            "js/lib/GT/ProcessQ.js",
            "js/lib/GT/ResourcePool.js",
            "js/lib/GT/Scaler.js",
            "js/lib/GT/Sound.js",
            "js/lib/GT/TimeTask.js",
            "js/lib/GT/DisplayObject.js",
            "js/lib/GT/DataStore.js",


            "js/lib/GT/toucher/Controller.js",
            "js/lib/GT/toucher/TouchWrapper.js",
            "js/lib/GT/toucher/Listener.js",
            "js/lib/GT/toucher/gesture/Any.js",
            "js/lib/GT/toucher/gesture/Tap.js",
            "js/lib/GT/toucher/gesture/Pan.js",
            "js/lib/GT/toucher/gesture/Swipe.js",
            "js/lib/GT/toucher/gesture/Pinch.js",
            "js/lib/GT/toucher/gesture/Rotate.js",
            "js/lib/GT/toucher/components/Joybutton.js",
            "js/lib/GT/toucher/components/Joystick.js",



            "js/base/DefaultGame.js",
            "js/base/gesture.js",


"../src/Dragons/Matrix.js",
"../src/Dragons/bezier-easing.js",
"../src/Dragons/BaseElement.js",
"../src/Dragons/Composite.js",
"../src/Dragons/DisplaySkin.js",
"../src/Dragons/SkinSet.js",

"../src/Dragons/animation/SlotFrame.js",
"../src/Dragons/animation/BoneFrame.js",
"../src/Dragons/animation/MainFrame.js",
"../src/Dragons/animation/Slot.js",
"../src/Dragons/animation/Bone.js",
"../src/Dragons/animation/SKAnimation.js",

"../src/Dragons/skeleton/BaseSlot.js",
"../src/Dragons/skeleton/BaseBone.js",
"../src/Dragons/skeleton/Skeleton.js",

"../src/Sprite/Sprite.js",
"../src/Sprite/Frame.js",
"../src/Sprite/Animation.js",

            "js/anim/Robot.js",
            "js/anim/text1.js",
            "js/LoadingScene.js",
            // "js/StartScene.js",
            "js/PlayScene.js",

            "js/init-event.js",
            "js/main.js",

            // #### [JS-FILE]

        ];

        list.forEach(function(js, idx) {
            list[idx] = root + js;
        });
        return list;
    }


    exports.getInputJSList = function(root) {
        root = root || "";
        var list = [


        ];

        list.forEach(function(js, idx) {
            list[idx] = root + js;
        });

        return list;
    }

})(typeof exports == "undefined" ? this : exports);
