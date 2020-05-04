"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var phaser_1 = __importDefault(require("phaser"));
// noinspection JSUnusedGlobalSymbols
var KineticScrollingPlugin = /** @class */ (function (_super) {
    __extends(KineticScrollingPlugin, _super);
    function KineticScrollingPlugin(scene, pluginManager) {
        var _a, _b;
        var _this = _super.call(this, scene, pluginManager) || this;
        _this.STAGE_INPUT_EVENT_HANDLERS = (_a = {},
            _a[phaser_1.default.Input.Events.POINTER_DOWN] = _this.beginMove,
            _a[phaser_1.default.Input.Events.POINTER_MOVE] = _this.moveCamera,
            _a[phaser_1.default.Input.Events.POINTER_UP] = _this.endMove,
            _a[phaser_1.default.Input.Events.POINTER_WHEEL] = _this.mouseWheel,
            _a[phaser_1.default.Input.Events.GAME_OUT] = _this.gameOutTracker,
            _a[phaser_1.default.Input.Events.GAME_OVER] = _this.gameOverTracker,
            _a);
        _this.GAME_EVENT_HANDLERS = (_b = {},
            _b[phaser_1.default.Core.Events.PRE_RENDER] = _this.update,
            _b);
        _this.pointerId = null;
        _this.pressedDown = false;
        _this.timestamp = 0;
        _this.beginTime = 0;
        _this.screenX = 0;
        _this.screenY = 0;
        _this.targetX = 0;
        _this.targetY = 0;
        _this.autoScrollX = false;
        _this.autoScrollY = false;
        _this.startX = 0;
        _this.startY = 0;
        _this.velocityX = 0;
        _this.velocityY = 0;
        _this.amplitudeX = 0;
        _this.amplitudeY = 0;
        _this.directionWheel = 0;
        _this.velocityWheelX = 0;
        _this.velocityWheelY = 0;
        // if less than the two values is a Tap
        _this.thresholdOfTapTime = 100;
        _this.thresholdOfTapDistance = 10;
        // for a smoother scrolling start
        _this.thresholdReached = false;
        _this.clearMovementTimer = null;
        _this.now = 0;
        _this.clickHelperActiveObjects = [];
        _this.settings = {
            kineticMovement: true,
            // really mimic iOS
            timeConstantScroll: 325,
            horizontalScroll: true,
            verticalScroll: false,
            horizontalWheel: true,
            verticalWheel: false,
            deltaWheel: 40,
            onUpdate: null,
            button: null
        };
        return _this;
    }
    Object.defineProperty(KineticScrollingPlugin.prototype, "camera", {
        get: function () {
            return this.scene.cameras.main;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Change Default Settings of the plugin
     */
    KineticScrollingPlugin.prototype.configure = function (settings) {
        this.settings = __assign(__assign({}, this.settings), settings);
    };
    /**
     * Start the Plugin.
     */
    KineticScrollingPlugin.prototype.start = function () {
        this.dragging = true;
        this.attachEventHandlers(this.scene.input, this.STAGE_INPUT_EVENT_HANDLERS);
        this.attachEventHandlers(this.game.events, this.GAME_EVENT_HANDLERS);
    };
    /**
     * Stop the Plugin.
     */
    KineticScrollingPlugin.prototype.stop = function () {
        this.pressedDown = false;
        this.removeEventHandlers(this.scene.input, this.STAGE_INPUT_EVENT_HANDLERS);
        this.removeEventHandlers(this.game.events, this.GAME_EVENT_HANDLERS);
    };
    KineticScrollingPlugin.prototype.attachEventHandlers = function (to, handlers) {
        for (var event_1 in handlers) {
            if (!handlers.hasOwnProperty(event_1)) {
                continue;
            }
            to.addListener(event_1, handlers[event_1], this);
        }
    };
    KineticScrollingPlugin.prototype.removeEventHandlers = function (to, handlers) {
        for (var event_2 in handlers) {
            if (!handlers.hasOwnProperty(event_2)) {
                continue;
            }
            to.removeListener(event_2, handlers[event_2], this);
        }
    };
    /**
     * Event triggered when a pointer is pressed down, resets the value of
     * variables.
     */
    KineticScrollingPlugin.prototype.beginMove = function (pointer) {
        if (this.settings.button && pointer.button !== this.settings.button) {
            return;
        }
        this.pointerId = pointer.id;
        this.startX = pointer.x;
        this.startY = pointer.y;
        this.screenX = pointer.worldX;
        this.screenY = pointer.worldY;
        this.pressedDown = true;
        this.thresholdReached = false;
        this.timestamp = Date.now();
        // the time of press down
        this.beginTime = this.timestamp;
        this.velocityY = this.amplitudeY = this.velocityX = this.amplitudeX = 0;
    };
    /**
     * Event triggered when the activePointer receives a DOM move event such as a mousemove or touchmove.
     * The camera moves according to the movement of the pointer, calculating the velocity.
     */
    KineticScrollingPlugin.prototype.moveCamera = function (pointer) {
        var _this = this;
        clearTimeout(this.clearMovementTimer);
        if (!this.pressedDown) {
            return;
        }
        // If it is not the current pointer
        if (this.pointerId !== pointer.id) {
            return;
        }
        this.now = Date.now();
        var elapsed = this.now - this.timestamp;
        this.timestamp = this.now;
        var deltaX = 0;
        var deltaY = 0;
        // It`s a fast tap not move
        if (this.isTap()
            && Math.abs(pointer.worldY - this.screenY) < this.thresholdOfTapDistance
            && Math.abs(pointer.worldX - this.screenX) < this.thresholdOfTapDistance) {
            return;
        }
        if (!this.thresholdReached) {
            this.thresholdReached = true;
            this.startX = pointer.x;
            this.startY = pointer.y;
            this.cancelClickEventHelpers();
            return;
        }
        if (this.settings.horizontalScroll) {
            deltaX = pointer.x - this.startX;
            if (deltaX !== 0) {
                this.dragging = true;
            }
            this.startX = pointer.x;
            this.velocityX = 0.8 * (1000 * deltaX / (1 + elapsed)) + 0.2 * this.velocityX;
            this.camera.scrollX -= deltaX;
        }
        if (this.settings.verticalScroll) {
            deltaY = pointer.y - this.startY;
            if (deltaY !== 0) {
                this.dragging = true;
            }
            this.startY = pointer.y;
            this.velocityY = 0.8 * (1000 * deltaY / (1 + elapsed)) + 0.2 * this.velocityY;
            this.camera.scrollY -= deltaY;
        }
        if (typeof this.settings.onUpdate === 'function') {
            var updateX = 0;
            if (this.canCameraMoveX()) {
                updateX = deltaX;
            }
            var updateY = 0;
            if (this.canCameraMoveY()) {
                updateY = deltaY;
            }
            this.settings.onUpdate(updateX, updateY);
        }
        this.clearMovementTimer = setTimeout(function () {
            _this.velocityX = 0;
            _this.velocityY = 0;
        }, 20);
    };
    KineticScrollingPlugin.prototype.isTap = function () {
        return (this.now - this.beginTime) < this.thresholdOfTapTime;
    };
    KineticScrollingPlugin.prototype.canCameraMoveX = function () {
        var bounds = this.camera.getBounds();
        if (bounds.isEmpty()) {
            return true;
        }
        return this.camera.scrollX > 0 && this.camera.scrollX + this.camera.width < bounds.right;
    };
    KineticScrollingPlugin.prototype.canCameraMoveY = function () {
        var bounds = this.camera.getBounds();
        if (bounds.isEmpty()) {
            return true;
        }
        return this.camera.scrollY > 0 && this.camera.scrollY + this.camera.height < bounds.height;
    };
    KineticScrollingPlugin.prototype.gameOutTracker = function () {
        this.pointerWithinGame = false;
        this.pressedDown = false;
    };
    KineticScrollingPlugin.prototype.gameOverTracker = function () {
        this.pointerWithinGame = true;
    };
    /**
     * Event triggered when a pointer is released, calculates the automatic scrolling.
     */
    KineticScrollingPlugin.prototype.endMove = function () {
        clearTimeout(this.clearMovementTimer);
        this.pointerId = null;
        this.pressedDown = false;
        this.autoScrollX = false;
        this.autoScrollY = false;
        if (!this.settings.kineticMovement) {
            return;
        }
        this.now = Date.now();
        if (this.pointerWithinGame) {
            if (Math.abs(this.velocityX) > 10) {
                this.amplitudeX = 0.8 * this.velocityX;
                this.targetX = Math.round(this.camera.scrollX - this.amplitudeX);
                this.autoScrollX = true;
            }
            if (Math.abs(this.velocityY) > 10) {
                this.amplitudeY = 0.8 * this.velocityY;
                this.targetY = Math.round(this.camera.scrollY - this.amplitudeY);
                this.autoScrollY = true;
            }
        }
        else {
            if (this.settings.horizontalScroll && this.velocityWheelXAbs < 0.1) {
                this.autoScrollX = true;
            }
            if (this.settings.verticalScroll && this.velocityWheelYAbs < 0.1) {
                this.autoScrollY = true;
            }
        }
    };
    Object.defineProperty(KineticScrollingPlugin.prototype, "velocityWheelXAbs", {
        get: function () {
            return Math.abs(this.velocityWheelX);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KineticScrollingPlugin.prototype, "velocityWheelYAbs", {
        get: function () {
            return Math.abs(this.velocityWheelY);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Event called after all the core subsystems and the State have updated, but before the render.
     * Create the deceleration effect.
     */
    KineticScrollingPlugin.prototype.update = function () {
        this.elapsed = Date.now() - this.timestamp;
        if (this.autoScrollX && this.amplitudeX !== 0) {
            var delta = -this.amplitudeX * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
            if (this.canCameraMoveX() && (delta > 0.5 || delta < -0.5)) {
                this.camera.scrollX = this.targetX - delta;
            }
            else {
                this.autoScrollX = false;
                this.camera.scrollX = this.targetX;
            }
        }
        if (this.autoScrollY && this.amplitudeY !== 0) {
            var delta = -this.amplitudeY * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
            if (this.canCameraMoveY() && (delta > 0.5 || delta < -0.5)) {
                this.camera.scrollY = this.targetY - delta;
            }
            else {
                this.autoScrollY = false;
                this.camera.scrollY = this.targetY;
            }
        }
        if (!this.autoScrollX && !this.autoScrollY) {
            this.dragging = false;
        }
        if (this.settings.horizontalWheel && this.velocityWheelXAbs > 0.1) {
            this.dragging = true;
            this.amplitudeX = 0;
            this.autoScrollX = false;
            this.camera.scrollX -= this.velocityWheelX;
            this.velocityWheelX *= 0.95;
        }
        if (this.settings.verticalWheel && this.velocityWheelYAbs > 0.1) {
            this.dragging = true;
            this.autoScrollY = false;
            this.camera.scrollY -= this.velocityWheelY;
            this.velocityWheelY *= 0.95;
        }
    };
    // noinspection JSUnusedLocalSymbols
    /**
     * Event called when the mousewheel is used, affect the direction of scrolling.
     */
    KineticScrollingPlugin.prototype.mouseWheel = function (pointer, currentlyOver, deltaX, deltaY) {
        if (!this.settings.horizontalWheel && !this.settings.verticalWheel) {
            return;
        }
        if (this.settings.horizontalWheel) {
            this.autoScrollX = false;
            this.velocityWheelX += deltaX;
            if (typeof this.settings.onUpdate === 'function') {
                this.settings.onUpdate(deltaX, this.camera.scrollX > 0
                    && this.camera.scrollX + this.camera.width < this.camera.worldView.width
                    ? deltaX : 0);
            }
        }
        if (this.settings.verticalWheel) {
            this.autoScrollY = false;
            this.velocityWheelY += deltaY;
            if (typeof this.settings.onUpdate === 'function') {
                this.settings.onUpdate(deltaY, this.camera.scrollY > 0
                    && this.camera.scrollY + this.camera.height < this.camera.worldView.height
                    ? deltaY : 0);
            }
        }
    };
    KineticScrollingPlugin.prototype.addClickEvents = function (obj, events) {
        var _this = this;
        if (obj.getData('kineticScrollingClickHelpers')) {
            var helpers_1 = obj.getData('kineticScrollingClickHelpers');
            for (var eventName in events) {
                if (events.hasOwnProperty(eventName)) {
                    // noinspection JSUnfilteredForInLoop
                    // @ts-ignore
                    helpers_1[eventName] = events[eventName];
                }
            }
            return;
        }
        var helpers = __assign({}, events);
        obj.setData('kineticScrollingClickHelpers', helpers);
        events.inputIsDown = false;
        obj
            .setInteractive()
            .on(phaser_1.default.Input.Events.GAMEOBJECT_POINTER_DOWN, function () {
            var helpers = obj.getData('kineticScrollingClickHelpers');
            helpers.downTimer = setTimeout(function () {
                helpers.downTimer = null;
                if (!_this.thresholdReached) {
                    _this.clickHelperActiveObjects.push(obj);
                    helpers.inputIsDown = true;
                    helpers.down && helpers.down(obj);
                }
            }, _this.thresholdOfTapTime + 10);
        })
            .on(phaser_1.default.Input.Events.GAMEOBJECT_POINTER_UP, function () {
            _this.clickHelperActiveObjects.splice(_this.clickHelperActiveObjects.indexOf(obj));
            var helpers = obj.getData('kineticScrollingClickHelpers');
            if (helpers.inputIsDown) {
                helpers.up && helpers.up(obj);
                _this.isTap() && helpers.click && helpers.click(obj);
                helpers.inputIsDown = false;
            }
            else if (helpers.downTimer && !_this.thresholdReached) {
                // It was a perfect tap, so we trigger all the events at once
                clearTimeout(helpers.downTimer);
                helpers.down && helpers.down(obj);
                helpers.up && helpers.up(obj);
                helpers.click && helpers.click(obj);
            }
        });
    };
    KineticScrollingPlugin.prototype.cancelClickEventHelpers = function () {
        this.clickHelperActiveObjects.forEach(function (obj) {
            var helpers = obj.getData('kineticScrollingClickHelpers');
            var inputIsDown = helpers.inputIsDown;
            helpers.inputIsDown = false;
            if (inputIsDown && helpers.up) {
                helpers.up(obj);
            }
        });
    };
    ;
    KineticScrollingPlugin.NAME = 'kineticScrolling';
    return KineticScrollingPlugin;
}(phaser_1.default.Plugins.ScenePlugin));
exports.default = KineticScrollingPlugin;
