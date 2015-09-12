"use strict";

var GT = GT || {};

(function(exports) {

    var StateEntity = function() {

    };

    StateEntity.apply = function(entity) {
        var proto = StateEntity.prototype;
        for (var p in proto) {
            if (!(p in entity)) {
                entity[p] = proto[p];
            }
        }
    };

    StateEntity.prototype = {
        // constructor: StateEntity,

        lastState: null,
        lastStateName: null,
        state: null,
        stateName: null,

        setState: function(state) {
            this.state = state;
            this.stateName = state.name;
        },

        changeState: function(newState, timeStep, now) {
            if (this.state) {
                this.state.exit(this, timeStep, now);
            }
            this.lastState = this.state;
            this.lastStateName = this.stateName;
            this.state = newState;
            this.stateName = newState.name;
            newState.enter(this, timeStep, now);
            console.log(this.lastStateName + " ---> " + this.stateName)
        },

        suspendState: function(newState, timeStep, now) {
            if (this.state) {
                this.state.suspend(this, timeStep, now);
            }
            this.lastState = this.state;
            this.lastStateName = this.stateName;
            this.state = newState;
            this.stateName = newState.name;
            newState.enter(this, timeStep, now);
        },

        resumeState: function(lastState, timeStep, now) {
            lastState = lastState || this.lastState;
            if (this.state) {
                this.state.exit(this, timeStep, now);
            }
            this.lastState = this.state;
            this.lastStateName = this.stateName;
            this.state = lastState;
            this.stateName = lastState.name;
            lastState.resume(this, timeStep, now);
        },

        executeState: function(timeStep, now) {
            if (this.state) {
                this.state.execute(this, timeStep, now);
            }
        },

        resetState: function(timeStep, now) {
            if (this.state) {
                this.state.reset(this, timeStep, now);
            }
        }

    };

    exports.StateEntity = StateEntity;

}(GT));
