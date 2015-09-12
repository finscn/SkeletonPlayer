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

            "js/lib/GT/state/State.js",
            "js/lib/GT/state/StateEntity.js",

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

            "js/lib/CUI.js/Class.js",
            "js/lib/CUI.js/Utils.js",
            "js/lib/CUI.js/Composite.js",
            "js/lib/CUI.js/EventDispatcher.js",
            "js/lib/CUI.js/TouchTarget.js",
            "js/lib/CUI.js/Slider.js",
            "js/lib/CUI.js/Font.js",
            "js/lib/CUI.js/renderer/BaseRenderer.js",
            "js/lib/CUI.js/renderer/TextRenderer.js",
            "js/lib/CUI.js/renderer/ImageRenderer.js",
            "js/lib/CUI.js/layout/BaseLayout.js",
            "js/lib/CUI.js/layout/VBoxLayout.js",
            "js/lib/CUI.js/layout/HBoxLayout.js",
            "js/lib/CUI.js/layout/TableLayout.js",
            "js/lib/CUI.js/layout/Layout.js",
            "js/lib/CUI.js/Component.js",
            "js/lib/CUI.js/Root.js",
            "js/lib/CUI.js/widget/Blank.js",
            "js/lib/CUI.js/widget/Label.js",
            "js/lib/CUI.js/widget/Button.js",
            "js/lib/CUI.js/widget/Page.js",
            "js/lib/CUI.js/widget/Panel.js",
            "js/lib/CUI.js/widget/ProgressBar.js",
            "js/lib/CUI.js/widget/ScrollArea.js",


            "js/lib/Sprite/Sprite.js",
            "js/lib/Sprite/Animation.js",
            "js/lib/Sprite/Frame.js",


            "js/base/DefaultGame.js",
            "js/base/gesture.js",



"../src/Matrix.js",
"../src/BaseElement.js",
"../src/Composite.js",
"../src/DisplaySkin.js",

"../src/skeleton/BaseSkinSet.js",
"../src/skeleton/BaseSlot.js",
"../src/skeleton/BaseBone.js",

"../src/skeleton/animation/SlotFrame.js",
"../src/skeleton/animation/BoneFrame.js",
"../src/skeleton/animation/MainFrame.js",
"../src/skeleton/animation/Slot.js",
"../src/skeleton/animation/Bone.js",
"../src/skeleton/animation/Animation.js",

"../src/skeleton/Skeleton.js",


            "js/anim/Robot.js",
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
