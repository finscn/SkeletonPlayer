var DomUI = function(options) {
    for (var key in options) {
        this[key] = options[key];
    }
};

(function(exports) {

    var proto = {

        constructor: DomUI,

        containerId: "ui-container",
        container: null,

        init: function() {
            this.tapListeners = this.tapListeners || {};
            this.container = this.$id(this.containerId);
            this.uiList = document.querySelectorAll("#" + this.containerId + " > div");
        },

        $id: function(id) {
            return document.getElementById(id);
        },

        showContainer: function() {
            this.container.style.visibility = "visible";
            this.container.style.left = "0px";
            this.container.style.top = "0px";
        },

        hideContainer: function() {
            this.container.style.visibility = "hidden";
            this.container.style.left = "-120%";
            this.container.style.top = "-120%";
        },

        show: function(id, mask) {
            this.showContainer();
            var ui = this.$id(id);
            for (var i = 0, len = this.uiList.length; i < len; i++) {
                var _ui = this.uiList[i];
                if (_ui != ui) {
                    _ui.style.display = "none";
                }
            }
            ui.style.display = "block";

            if (mask) {
                this.container.classList.add("ui-mask");
            } else {
                this.container.classList.remove("ui-mask");
            }
        },

        hide: function(id) {
            this.hideContainer();
            var ui = this.$id(id);
            ui.style.display = "none";
        },

        onTouchMove: function(event) {
            var dom = this.lastButton
            if (dom) {
                dom.style.transform = "scale(1,1)"
                dom.style.webkitTransform = "scale(1,1)"
                this.lastButton = null;
                // dom.touched = false;
            }
        },
        onTouchStart: function(event) {
            var dom = event.target;
            var id = dom.id;
            var fn = this.tapListeners[id];
            if (fn && !dom.touched) {
                dom.style.transform = "scale(0.9,0.9)"
                dom.style.webkitTransform = "scale(0.9,0.9)"
                dom.touched = true;
                this.lastButton = dom;
                return true;
            }
            if (this.container.contains(dom)){
                return true;
            }
        },
        onTouchTap: function(event) {
            var dom = event.target;
            var id = dom.id;
            var fn = this.tapListeners[id];
            if (fn) {
                dom.style.transform = "scale(1,1)"
                dom.style.webkitTransform = "scale(1,1)"
                dom.touched = false;
                fn(event);
                this.lastButton = null;
                return true;
            }
            if (this.container.contains(dom)){
                return true;
            }
        },
        onTouchEnd: function(event) {
            var dom = event.target;
            var id = dom.id;
            var fn = this.tapListeners[id];
            if (fn) {
                dom.style.transform = "scale(1,1)"
                dom.style.webkitTransform = "scale(1,1)"
                dom.touched = false;
                this.lastButton = null;
                return true;
            }
            if (this.container.contains(dom)){
                return true;
            }
        },

    };

    for (var p in proto) {
        DomUI.prototype[p] = proto[p];
    }

    if (typeof module != "undefined") {
        module.exports = DomUI;
    }

}());
