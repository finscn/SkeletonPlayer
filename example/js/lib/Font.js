var FontMapping = FontMapping || {};
var Font = {
    getName: function(name, style) {
        var mname = FontMapping[style ? name + " " + style : name];
        if (mname) {
            name = mname;
        } else {
            // name = FontMapping["default"];
        }
        return name;
    },
    getStyle: function(size, name, style) {
        size = size || 12;
        if (style == "normal") {
            style = null;
        }
        if (window.App) {
            name = Font.getName(name, style);
            return size + "px " + name;
        }
        style = style ? style + " " : "";
        return style + size + "px " + name;
    }

};
