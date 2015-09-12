'use strict';

var GT = GT || {};

(function(exports) {

    var TimeTask = function(options) {
        for (var p in options) {
            this[p] = options[p];
        }
        this.queue = this.queue || [];
    };

    var proto = {

        constructor: TimeTask,

        reset: function() {
            this.queue.length = 0;
        },

        size: function() {
            return this.queue.length;
        },

        task: function(fn, timeout, isInterval) {
            if (!timeout) {
                fn();
            } else {
                this.addTask(fn, timeout, isInterval);
            }
            return this;
        },

        addTask: function(fn, timeout, isInterval) {
            this.queue.push({
                fn: fn,
                _time: timeout,
                timeout: timeout,
                interval: isInterval,
            });
            return this.queue.length;
        },

        getTask: function(fn) {
            for (var i = 0, len = this.queue.length; i < len; i++) {
                var task = this.queue[i];
                if (task.fn === fn) {
                    return task;
                }
            }
            return null;
        },

        changeTask: function(fn, newTimeout) {
            var task = this.getTask(fn);
            var delta = newTimeout - task.timeout;
            task._time = Math.max(0, task._time + delta);
            task.timeout = newTimeout;
            return task;
        },

        removeTaskAt: function(idx) {
            this.queue.splice(idx, 1);
        },

        removeTask: function(fn, all) {
            for (var i = 0, len = this.queue.length; i < len; i++) {
                var task = this.queue[i];
                if (task.fn === fn) {
                    this.queue.splice(i, 1);
                    if (!all) {
                        break;
                    }
                    len--;
                    i--;
                }
            }
            return this.queue.length;
        },

        update: function(timeStep, now) {
            for (var i = 0, len = this.queue.length; i < len; i++) {
                var task = this.queue[i];
                if ((task._time -= timeStep) <= 0) {
                    var fn = task.fn;
                    fn();
                    if (!task.interval) {
                        this.queue.splice(i, 1);
                        len--;
                        i--;
                    } else {
                        task._time = task.timeout;
                    }
                }
            }
        }

    };

    for (var p in proto) {
        TimeTask.prototype[p] = proto[p];
    }

    exports.TimeTask = TimeTask;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TimeTask;
    }

})(GT);
