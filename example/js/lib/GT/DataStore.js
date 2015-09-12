"use strict";

var GT = GT || {};

(function(exports) {

    var DataStore = function(options) {
        for (var key in options) {
            this[key] = options[key];
        }
    };

    DataStore.ID_SEED = 1;

    var proto = {

        constructor: DataStore,

        _data: null,

        withId: false,

        autoDepersist: false,

        serializePrefix: ">>S<<",

        init: function() {
            this.id = this.id || "DS_" + DataStore.ID_SEED++;
            if (this.withId) {
                this.keyPrefix = this.id + "@";
            } else {
                this.keyPrefix = "";
            }

            if (this.autoDepersist) {
                this.depersist();
            } else {
                if (this.data) {
                    this._data = this.data;
                } else {
                    this._data = {};
                }
            }
        },

        get: function(key) {
            return this._data[key];
        },

        set: function(key, value) {
            this._data[key] = value;
        },

        update: function(key, objValue) {
            var dataOrig = this._data[key] || {};
            for (var key in objValue) {
                dataOrig[key] = objValue[key];
            }
            this._data[key] = dataOrig;
            return dataOrig;
        },

        remove: function(key) {
            var value = this._data[key];
            delete this._data[key]
            return value;
        },

        getRawData: function() {
            return this._data;
        },
        setRawData: function(data) {
            this._data = data;
        },

        getData: function() {
            var data = {};
            for (var key in this._data) {
                data[key] = this._data[key];
            }
            return data;
        },

        setData: function(data, override) {
            if (override) {
                this._data = {};
            }
            for (var key in data) {
                this._data[key] = data[key];
            }
            return this._data;
        },

        clearData: function() {
            this._data = {};
        },


        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////


        save: function(key, value) {
            if (arguments.length == 1) {
                value = this.get(key);
            } else {
                this.set(key, value);
            }
            window.localStorage.setItem(this.keyPrefix + key, value);
        },
        load: function(key, parse) {
            var value = window.localStorage.getItem(this.keyPrefix + key);
            if (parse) {
                value = this.parseValue(value);
            }
            this.set(key, value);
            return value;
        },
        delete: function(key) {
            var value = window.localStorage.getItem(this.keyPrefix + key);
            window.localStorage.removeItem(this.keyPrefix + key);
            this.remove(key);
            return value;
        },

        clear: function() {
            for (var key in this._data) {
                window.localStorage.removeItem(this.keyPrefix + key);
            }
            window.localStorage.removeItem(this.serializePrefix + "@" + this.id);
            this._data = {};
        },


        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////


        serialize: function() {
            return JSON.stringify(this._data);
        },

        deserialize: function(s, override) {
            var data = s ? JSON.parse(s) : {};
            if (override) {
                this._data = data;
            } else {
                for (var key in data) {
                    this.set(key, data[key]);
                }
            }
            return data;
        },

        persist: function() {
            var s = this.serialize();
            window.localStorage.setItem(this.serializePrefix + "@" + this.id, s);
            return s;
        },

        depersist: function() {
            var s = window.localStorage.getItem(this.serializePrefix + "@" + this.id);
            return this.deserialize(s, true);
        },

        parseValue: function(v) {
            if (v === null || v === undefined) {
                return v;
            }
            if (v === "true") {
                v = true;
            } else if (v === "false") {
                v = false;
            } else if (v === "null") {
                v = null;
            } else if (v === "undefined") {
                v = undefined;
            } else if (!isNaN(Number(v))) {
                v = Number(v);
            }
            return v;
        },

        simpleClone: function(data) {
            return JSON.parse(JSON.stringify(data));
        },

        setCookie: function(key, value) {
            var domainPrefix = window.location.host;
            window.document.cookie = key + "=" + value + "; " + "" + "path=/; domain=" + domainPrefix + ";";
        },
        getCookie: function(key) {
            var r = new RegExp("(?:^|;+|\\s+)" + key + "=([^;]*)");
            var m = window.document.cookie.match(r);
            return (!m ? "" : m[1]);
        },
        removeCookie: function(key) {
            var domainPrefix = window.location.host;
            window.document.cookie = key + "=; expires=Mon, 13 Jun 1982 06:00:00 GMT; " + "path=/; domain=" + domainPrefix + ";";
        },

    };

    for (var p in proto) {
        DataStore.prototype[p] = proto[p];
    }

    exports.DataStore = DataStore;

}(GT));
