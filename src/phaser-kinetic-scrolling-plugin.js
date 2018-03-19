/**
 * Phaser Kinetic Scrolling Plugin
 * @author       Juan Nicholls <jdnichollsc@hotmail.com>
 * @copyright    2018 Juan Nicholls - http://jdnichollsc.github.io/Phaser-Kinetic-Scrolling-Plugin/
 * @license      {@link http://opensource.org/licenses/MIT}
 * @version 1.0.8
 */

(function (Phaser) {
    'use strict';

    /**
    * Kinetic Scrolling is a Phaser plugin that allows vertical and horizontal scrolling with kinetic motion.
    * It works with the Phaser.Camera
    *
    * @class Phaser.Plugin.KineticScrolling
    * @constructor
    * @param {Object} game - The Game object is the instance of the game, where the magic happens.
    * @param {Any} parent  - The object that owns this plugin, usually Phaser.PluginManager.
    */
    Phaser.Plugin.KineticScrolling = function (game, parent) {
        Phaser.Plugin.call(this, game, parent);

        this.pointerId = null;
        this.dragging = false;
        this.pressedDown = false;
        this.timestamp = 0;
        this.callbackID = 0;

        this.targetX = 0;
        this.targetY = 0;

        this.autoScrollX = false;
        this.autoScrollY = false;

        this.startX = 0;
        this.startY = 0;

        this.velocityX = 0;
        this.velocityY = 0;

        this.amplitudeX = 0;
        this.amplitudeY = 0;

        this.directionWheel = 0;

        this.velocityWheelX = 0;
        this.velocityWheelY = 0;

        // if less than the two values is a Tap
        this.thresholdOfTapTime = 100;
        this.thresholdOfTapDistance = 10;

        this.settings = {
            kineticMovement: true,
            timeConstantScroll: 325, //really mimic iOS
            horizontalScroll: true,
            verticalScroll: false,
            horizontalWheel: true,
            verticalWheel: false,
            deltaWheel: 40,
            onUpdate: null
        };
    };

    Phaser.Plugin.KineticScrolling.prototype = Object.create(Phaser.Plugin.prototype);
    Phaser.Plugin.KineticScrolling.prototype.constructor = Phaser.Plugin.KineticScrolling;

    /**
    * Change Default Settings of the plugin
    *
    * @method Phaser.Plugin.KineticScrolling#configure
    * @param {Object}  [options] - Object that contain properties to change the behavior of the plugin.
    * @param {number}  [options.timeConstantScroll=325] - The rate of deceleration for the scrolling.
    * @param {boolean} [options.kineticMovement=true]   - Enable or Disable the kinematic motion.
    * @param {boolean} [options.horizontalScroll=true]  - Enable or Disable the horizontal scrolling.
    * @param {boolean} [options.verticalScroll=false]   - Enable or Disable the vertical scrolling.
    * @param {boolean} [options.horizontalWheel=true]   - Enable or Disable the horizontal scrolling with mouse wheel.
    * @param {boolean} [options.verticalWheel=false]    - Enable or Disable the vertical scrolling with mouse wheel.
    * @param {number}  [options.deltaWheel=40]          - Delta increment of the mouse wheel.
    */
    Phaser.Plugin.KineticScrolling.prototype.configure = function (options) {

        if (options) {
            for (var property in options) {
                if (this.settings.hasOwnProperty(property)) {
                    this.settings[property] = options[property];
                }
            }
        }

    };

    /**
    * Start the Plugin.
    *
    * @method Phaser.Plugin.KineticScrolling#start
    */
    Phaser.Plugin.KineticScrolling.prototype.start = function () {

        this.game.input.onDown.add(this.beginMove, this);

        this.callbackID = this.game.input.addMoveCallback(this.moveCamera, this);

        this.game.input.onUp.add(this.endMove, this);

        this.game.input.mouse.mouseWheelCallback = this.mouseWheel.bind(this);
    };

    /**
    * Event triggered when a pointer is pressed down, resets the value of variables.
    */
    Phaser.Plugin.KineticScrolling.prototype.beginMove = function (pointer) {

        this.pointerId = pointer.id;
        this.startX = this.game.input.x;
        this.startY = this.game.input.y;

        this.screenX = pointer.screenX;
        this.screenY = pointer.screenY;

        this.pressedDown = true;

        this.timestamp = Date.now();

        // the time of press down
        this.beginTime = this.timestamp;

        this.velocityY = this.amplitudeY = this.velocityX = this.amplitudeX = 0;

    };

    /**
    * Event triggered when the activePointer receives a DOM move event such as a mousemove or touchmove.
    * The camera moves according to the movement of the pointer, calculating the velocity.
    */
    Phaser.Plugin.KineticScrolling.prototype.moveCamera = function (pointer, x, y) {

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
        if (
            this.now - this.beginTime < this.thresholdOfTapTime
            && Math.abs(pointer.screenY - this.screenY) < this.thresholdOfTapDistance
            && Math.abs(pointer.screenX - this.screenX) < this.thresholdOfTapDistance
        ) {
            return;
        }

        if (this.settings.horizontalScroll) {
            deltaX = x - this.startX;
            if (deltaX !== 0) {
                this.dragging = true;
            }
            this.startX = x;
            this.velocityX = 0.8 * (1000 * deltaX / (1 + elapsed)) + 0.2 * this.velocityX;
            this.game.camera.x -= deltaX;
        }

        if (this.settings.verticalScroll) {
            deltaY = y - this.startY;
            if (deltaY !== 0) {
                this.dragging = true;
            }
            this.startY = y;
            this.velocityY = 0.8 * (1000 * deltaY / (1 + elapsed)) + 0.2 * this.velocityY;
            this.game.camera.y -= deltaY;
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

    };

    /**
     * Indicates when camera can move in the x axis
     * @return {boolean}
     */
    Phaser.Plugin.KineticScrolling.prototype.canCameraMoveX = function () {
        return this.game.camera.x > 0 && this.game.camera.x + this.game.camera.width < this.game.camera.bounds.right;
    };

    /**
     * Indicates when camera can move in the y axis
     * @return {boolean}
     */
    Phaser.Plugin.KineticScrolling.prototype.canCameraMoveY = function () {
        return this.game.camera.y > 0 && this.game.camera.y + this.game.camera.height < this.game.camera.bounds.height;
    };

    /**
    * Event triggered when a pointer is released, calculates the automatic scrolling.
    */
    Phaser.Plugin.KineticScrolling.prototype.endMove = function () {

        this.pointerId = null;
        this.pressedDown = false;
        this.autoScrollX = false;
        this.autoScrollY = false;

        if (!this.settings.kineticMovement) return;

        this.now = Date.now();

        if (this.game.input.activePointer.withinGame) {
            if (this.velocityX > 10 || this.velocityX < -10) {
                this.amplitudeX = 0.8 * this.velocityX;
                this.targetX = Math.round(this.game.camera.x - this.amplitudeX);
                this.autoScrollX = true;
            }

            if (this.velocityY > 10 || this.velocityY < -10) {
                this.amplitudeY = 0.8 * this.velocityY;
                this.targetY = Math.round(this.game.camera.y - this.amplitudeY);
                this.autoScrollY = true;
            }
        }
        if (!this.game.input.activePointer.withinGame) {
            this.velocityWheelXAbs = Math.abs(this.velocityWheelX);
            this.velocityWheelYAbs = Math.abs(this.velocityWheelY);
            if (
                this.settings.horizontalScroll
                && (this.velocityWheelXAbs < 0.1 || !this.game.input.activePointer.withinGame)
            ) {
                this.autoScrollX = true;
            }
            if (
                this.settings.verticalScroll
                && (this.velocityWheelYAbs < 0.1 || !this.game.input.activePointer.withinGame)
            ) {
                this.autoScrollY = true;
            }
        }
    };

    /**
    * Event called after all the core subsystems and the State have updated, but before the render.
    * Create the deceleration effect.
    */
    Phaser.Plugin.KineticScrolling.prototype.update = function () {

        this.elapsed = Date.now() - this.timestamp;
        this.velocityWheelXAbs = Math.abs(this.velocityWheelX);
        this.velocityWheelYAbs = Math.abs(this.velocityWheelY);

        var delta = 0;
        if (this.autoScrollX && this.amplitudeX != 0) {

            delta = -this.amplitudeX * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
            if (this.canCameraMoveX() && (delta > 0.5 || delta < -0.5)) {
                this.game.camera.x = this.targetX - delta;
            }
            else {
                this.autoScrollX = false;
                this.game.camera.x = this.targetX;
            }
        }

        if (this.autoScrollY && this.amplitudeY != 0) {

            delta = -this.amplitudeY * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
            if (this.canCameraMoveY() && (delta > 0.5 || delta < -0.5)) {
                this.game.camera.y = this.targetY - delta;
            }
            else {
                this.autoScrollY = false;
                this.game.camera.y = this.targetY;
            }
        }

        if (!this.autoScrollX && !this.autoScrollY) {
            this.dragging = false;
        }

        if (this.settings.horizontalWheel  && this.velocityWheelXAbs > 0.1) {
            this.dragging = true;
            this.amplitudeX = 0;
            this.autoScrollX = false;
            this.game.camera.x -= this.velocityWheelX;
            this.velocityWheelX *= 0.95;
        }

        if (this.settings.verticalWheel && this.velocityWheelYAbs > 0.1) {
            this.dragging = true;
            this.autoScrollY = false;
            this.game.camera.y -= this.velocityWheelY;
            this.velocityWheelY *= 0.95;
        }
    };

    /**
    * Event called when the mousewheel is used, affect the direction of scrolling.
    */
    Phaser.Plugin.KineticScrolling.prototype.mouseWheel = function (event) {
        if (!this.settings.horizontalWheel && !this.settings.verticalWheel) return;

        event.preventDefault();

        var delta = this.game.input.mouse.wheelDelta * 120 / this.settings.deltaWheel;

        if (this.directionWheel != this.game.input.mouse.wheelDelta) {
            this.velocityWheelX = 0;
            this.velocityWheelY = 0;
            this.directionWheel = this.game.input.mouse.wheelDelta;
        }

        if (this.settings.horizontalWheel) {
            this.autoScrollX = false;

            this.velocityWheelX += delta;

            if (typeof this.settings.onUpdate === 'function') {
                var deltaX = 0;
                if (this.game.camera.x > 0 && this.game.camera.x + this.game.camera.width < this.game.camera.bounds.width) {
                    deltaX = delta;
                }

                this.settings.onUpdate(deltaX, 0);
            }
        }

        if (this.settings.verticalWheel) {
            this.autoScrollY = false;

            this.velocityWheelY += delta;

            if (typeof this.settings.onUpdate === 'function') {
                var deltaY = 0;
                if (this.game.camera.y > 0 && this.game.camera.y + this.game.camera.height < this.game.camera.bounds.height) {
                    deltaY = delta;
                }

                this.settings.onUpdate(0, deltaY);
            }
        }

    };

    /**
    * Stop the Plugin.
    *
    * @method Phaser.Plugin.KineticScrolling#stop
    */
    Phaser.Plugin.KineticScrolling.prototype.stop = function () {

        this.game.input.onDown.remove(this.beginMove, this);

        if (this.callbackID) {
            this.game.input.deleteMoveCallback(this.callbackID);
        }
        else {
            this.game.input.deleteMoveCallback(this.moveCamera, this);
        }

        this.game.input.onUp.remove(this.endMove, this);

        this.game.input.mouse.mouseWheelCallback = null;

    };

} (Phaser));
