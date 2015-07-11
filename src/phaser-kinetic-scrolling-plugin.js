/**
* Phaser Kinetic Scrolling Plugin
* @author Juan Nicholls - www.nicholls.co
* @version 0.1.1
*/
(function (Phaser) {
    'use strict';

    Phaser.Plugin.KineticScrolling = function (game, parent) {
        Phaser.Plugin.call(this, game, parent);


        this.dragging = false;
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


        this.settings = {
            timeConstant: 325, //really mimic iOS
            kineticMovement: true,
            horizontalScroll: true,
            verticalScroll: false
        };
    };

    Phaser.Plugin.KineticScrolling.prototype = Object.create(Phaser.Plugin.prototype);
    Phaser.Plugin.KineticScrolling.prototype.constructor = Phaser.Plugin.KineticScrolling;

    /**
    * Change Default Settings of the plugin
    *
    * @method Phaser.Plugin.KineticScrolling#configure
    * @param {Object}  [options]                       - Object that contain properties to change the behavior of the plugin.
    * @param {number}  [options.timeConstant=325]      - The rate of deceleration for the scrolling.
    * @param {boolean} [options.kineticMovement=true]  - Enable or Disable the kinematic motion.
    * @param {boolean} [options.horizontalScroll=true] - Enable or Disable the horizontal scrolling.
    * @param {boolean} [options.verticalScroll=false]  - Enable or Disable the vertical scrolling.
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

    Phaser.Plugin.KineticScrolling.prototype.start = function () {

        this.game.input.onDown.add(this.beginMove, this);

        this.callbackID = this.game.input.addMoveCallback(this.moveCamera, this);

        this.game.input.onUp.add(this.endMove, this);

    };

    Phaser.Plugin.KineticScrolling.prototype.beginMove = function () {

        this.startX = this.game.input.x;
        this.startY = this.game.input.y;

        this.dragging = true;

        this.timestamp = Date.now();

        this.velocityY = this.amplitudeY = this.velocityX = this.amplitudeX = 0;

    };

    Phaser.Plugin.KineticScrolling.prototype.moveCamera = function (pointer, x, y) {

        if (!this.dragging) return;

        this.now = Date.now();
        var elapsed = this.now - this.timestamp;
        this.timestamp = this.now;

        if (this.settings.horizontalScroll) {
            var delta = x - this.startX; //Compute move distance
            this.startX = x;
            this.velocityX = 0.8 * (1000 * delta / (1 + elapsed)) + 0.2 * this.velocityX;
            this.game.camera.x -= delta;
        }

        if (this.settings.verticalScroll) {
            var delta = y - this.startY; //Compute move distance
            this.startY = y;
            this.velocityY = 0.8 * (1000 * delta / (1 + elapsed)) + 0.2 * this.velocityY;
            this.game.camera.y -= delta;
        }

    };

    Phaser.Plugin.KineticScrolling.prototype.endMove = function () {

        this.dragging = false;
        this.autoScrollX = false;
        this.autoScrollY = false;

        if (!this.settings.kineticMovement) return;

        this.now = Date.now();

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

    };

    Phaser.Plugin.KineticScrolling.prototype.update = function () {

        this.elapsed = Date.now() - this.timestamp;

        if (this.autoScrollX && this.amplitudeX != 0) {

            var delta = -this.amplitudeX * Math.exp(-this.elapsed / this.settings.timeConstant);
            if (delta > 0.5 || delta < -0.5) {
                this.game.camera.x = this.targetX - delta;
            }
            else {
                this.autoScrollX = false;
                this.game.camera.x = this.targetX;
            }
        }

        if (this.autoScrollY && this.amplitudeY != 0) {

            var delta = -this.amplitudeY * Math.exp(-this.elapsed / this.settings.timeConstant);
            if (delta > 0.5 || delta < -0.5) {
                this.game.camera.y = this.targetY - delta;
            }
            else {
                this.autoScrollY = false;
                this.game.camera.y = this.targetY;
            }
        }

    };

    Phaser.Plugin.KineticScrolling.prototype.stop = function () {

        this.game.input.onDown.remove(this.beginMove, this);

        this.game.input.deleteMoveCallback(this.callbackID);

        this.game.input.onUp.remove(this.endMove, this);

    };

} (Phaser));
