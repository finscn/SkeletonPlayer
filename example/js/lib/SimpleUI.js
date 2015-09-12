var SimpleUI = function(options) {
    for (var key in options) {
        this[key] = options[key];
    }
};

(function(exports) {

    var proto = {

        constructor: SimpleUI,

        x: 0,
        y: 0,
        width: 120,
        height: 70,
        alpha: 1,
        img: null,
        sx: null,
        sy: null,
        sw: null,
        sh: null,
        init: function() {
            if (this.img) {
                this.sx = this.sx || 0;
                this.sy = this.sy || 0;
                this.sw = this.sw || this.img.width;
                this.sh = this.sh || this.img.height;
            }
        },
        isInRegion: function(x, y) {
            return this.x < x && this.y < y && x < this.x + this.width && y < this.y + this.height;
        },
        onTap: function(x, y) {

        },
        update: function(timeStep, now) {

        },
        render: function(context, timeStep, now) {
            context.globalAlpha = this.alpha;
            if (this.img) {
                context.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.width, this.height);
            }
            context.globalAlpha = 1;
        },


    };

    for (var p in proto) {
        SimpleUI.prototype[p] = proto[p];
    }

    if (typeof module != "undefined") {
        module.exports = SimpleUI;
    }

}());
