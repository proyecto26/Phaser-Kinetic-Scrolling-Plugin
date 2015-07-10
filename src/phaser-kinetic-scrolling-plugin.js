/**
* Phaser Kinetic Scrolling Plugin
* @author Juan Nicholls - www.nicholls.co
* @version 0.1.1
*/
(function (Phaser) {
    'use strict';

    Phaser.Plugin.KineticScrolling = function (game, parent) {
        Phaser.Plugin.call(this, game, parent);

        this.kineticMovement = true;

        this.dragging = false;
        this.autoScroll = false;
        this.timeConstant = 325; //really mimic iOS
        this.startX = 0;
        this.timestamp = 0;
        this.velocity = 0;
        this.amplitude = 0;
        this.callbackID = 0;
    };

    Phaser.Plugin.KineticScrolling.prototype = Object.create(Phaser.Plugin.prototype);
    Phaser.Plugin.KineticScrolling.prototype.constructor = Phaser.Plugin.KineticScrolling;

    /**
    * Swith the kinematic movement from true or false
    *
    * @method Phaser.Plugin.KineticScrolling#init
    * @param {boolean} kineticMovement - Enable or Disable the kinematic motion
    */
    Phaser.Plugin.KineticScrolling.prototype.init = function (kineticMovement) {

        if (kineticMovement !== undefined) this.kineticMovement = kineticMovement;

    };

    Phaser.Plugin.KineticScrolling.prototype.start = function () {

        this.game.input.onDown.add(this.beginMove, this);

        this.callbackID = this.game.input.addMoveCallback(this.moveCamera, this);

        this.game.input.onUp.add(this.endMove, this);

    };

    Phaser.Plugin.KineticScrolling.prototype.beginMove = function () {

        this.startX = this.game.input.x;

        this.dragging = true;

        this.timestamp = Date.now();

        this.velocity = this.amplitude = 0;

    };

    Phaser.Plugin.KineticScrolling.prototype.moveCamera = function (pointer, x) {

        if (!this.dragging) return;

        var delta = x - this.startX; //Compute move distance

        this.startX = x;

        this.now = Date.now();

        var elapsed = this.now - this.timestamp;

        this.timestamp = this.now;

        var v = 1000 * delta / (1 + elapsed);

        this.velocity = 0.8 * v + 0.2 * this.velocity;

        this.game.camera.x -= delta;

    };

    Phaser.Plugin.KineticScrolling.prototype.endMove = function () {

        this.dragging = false;

        this.autoScroll = false;

        if (this.kineticMovement && (this.velocity > 10 || this.velocity < -10)) {

            this.amplitude = 0.8 * this.velocity;

            this.now = Date.now();

            this.target = Math.round(this.game.camera.x - this.amplitude);

            this.autoScroll = true;
        }

    };

    Phaser.Plugin.KineticScrolling.prototype.update = function () {

        if (this.autoScroll && this.amplitude != 0) {

            this.elapsed = Date.now() - this.timestamp;

            var delta = -this.amplitude * Math.exp(-this.elapsed / this.timeConstant);

            if (delta > 0.5 || delta < -0.5) {

                this.game.camera.x = this.target - delta;
            }
            else {
                this.autoScroll = false;

                this.game.camera.x = this.target;
            }
        }

    };

    Phaser.Plugin.KineticScrolling.prototype.stop = function () {

        this.game.input.onDown.add(this.beginMove, this);

        this.game.input.deleteMoveCallback(this.callbackID);

        this.game.input.onUp.add(this.endMove, this);

    };

} (Phaser));