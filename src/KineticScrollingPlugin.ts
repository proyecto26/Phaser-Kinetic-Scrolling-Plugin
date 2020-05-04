import Phaser from 'phaser';
import KineticScrollingPluginSettings from './KineticScrollingPluginSettings';
import KineticScrollingPluginEvents from './KineticScrollingPluginEvents'

// noinspection JSUnusedGlobalSymbols
export default class KineticScrollingPlugin extends Phaser.Plugins.ScenePlugin {
    get camera(): Phaser.Cameras.Scene2D.Camera {
        return this.scene.cameras.main;
    }

    public static readonly NAME = 'kineticScrolling';

    private readonly STAGE_INPUT_EVENT_HANDLERS = {
        [Phaser.Input.Events.POINTER_DOWN]: this.beginMove,
        [Phaser.Input.Events.POINTER_MOVE]: this.moveCamera,
        [Phaser.Input.Events.POINTER_UP]: this.endMove,
        [Phaser.Input.Events.POINTER_WHEEL]: this.mouseWheel,
        [Phaser.Input.Events.GAME_OUT]: this.gameOutTracker,
        [Phaser.Input.Events.GAME_OVER]: this.gameOverTracker,
    };

    private readonly GAME_EVENT_HANDLERS = {
        [Phaser.Core.Events.PRE_RENDER]: this.update,
    };

    private settings: KineticScrollingPluginSettings;

    private pointerId: number|null;

    private dragging: boolean;

    private pressedDown: boolean;

    private timestamp: number;

    private beginTime: number;

    private screenX: number;

    private screenY: number;

    private targetX: number;

    private targetY: number;

    private autoScrollX: boolean;

    private autoScrollY: boolean;

    private startX: number;

    private startY: number;

    private velocityX: number;

    private velocityY: number;

    private amplitudeX: number;

    private amplitudeY: number;

    private directionWheel: number;

    private velocityWheelX: number;

    private velocityWheelY: number;

    private readonly thresholdOfTapTime: number;

    private readonly thresholdOfTapDistance: number;

    private thresholdReached: boolean;

    private clearMovementTimer: number|null;

    private now: number;

    private pointerWithinGame: boolean;

    private elapsed: number;

    private clickHelperActiveObjects: Phaser.GameObjects.Graphics[];

    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager);

        this.pointerId = null;

        this.pressedDown = false;
        this.timestamp = 0;
        this.beginTime = 0;

        this.screenX = 0;
        this.screenY = 0;

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

        // for a smoother scrolling start
        this.thresholdReached = false;

        this.clearMovementTimer = null;

        this.now = 0;

        this.clickHelperActiveObjects = [];

        this.settings = {
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
    }

    /**
     * Change Default Settings of the plugin
     */
    configure(settings: KineticScrollingPluginSettings): void {
        this.settings = {...this.settings, ...settings};
    }

    /**
     * Start the Plugin.
     */
    public start(): void {
        this.dragging = true;

        this.attachEventHandlers(this.scene.input, this.STAGE_INPUT_EVENT_HANDLERS);
        this.attachEventHandlers(this.game.events, this.GAME_EVENT_HANDLERS);
    }

    /**
     * Stop the Plugin.
     */
    public stop(): void {
        this.pressedDown = false;
        this.removeEventHandlers(this.scene.input, this.STAGE_INPUT_EVENT_HANDLERS);
        this.removeEventHandlers(this.game.events, this.GAME_EVENT_HANDLERS);
    }

    private attachEventHandlers(to: Phaser.Events.EventEmitter, handlers: {[event: string]: Function}): void {
        for (const event in handlers) {
            if (!handlers.hasOwnProperty(event)) {
                continue;
            }

            to.addListener(
                event,
                handlers[event],
                this
            );
        }
    }

    private removeEventHandlers(to: Phaser.Events.EventEmitter, handlers: {[event: string]: Function}): void {
        for (const event in handlers) {
            if (!handlers.hasOwnProperty(event)) {
                continue;
            }

            to.removeListener(
                event,
                handlers[event],
                this
            );
        }
    }

    /**
     * Event triggered when a pointer is pressed down, resets the value of
     * variables.
     */
    private beginMove(pointer: Phaser.Input.Pointer) {
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
    }

    /**
     * Event triggered when the activePointer receives a DOM move event such as a mousemove or touchmove.
     * The camera moves according to the movement of the pointer, calculating the velocity.
     */
    private moveCamera(pointer: Phaser.Input.Pointer): void {
        clearTimeout(this.clearMovementTimer);

        if (!this.pressedDown) {
            return;
        }

        // If it is not the current pointer
        if (this.pointerId !== pointer.id) {
            return;
        }

        this.now = Date.now();
        const elapsed = this.now - this.timestamp;
        this.timestamp = this.now;

        let deltaX = 0;
        let deltaY = 0;

        // It`s a fast tap not move
        if (
            this.isTap()
            && Math.abs(pointer.worldY - this.screenY) < this.thresholdOfTapDistance
            && Math.abs(pointer.worldX - this.screenX) < this.thresholdOfTapDistance
        ) {
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
            let updateX = 0;
            if (this.canCameraMoveX()) {
                updateX = deltaX;
            }

            let updateY = 0;
            if (this.canCameraMoveY()) {
                updateY = deltaY;
            }

            this.settings.onUpdate(updateX, updateY);
        }

        this.clearMovementTimer = setTimeout(() => {
            this.velocityX = 0;
            this.velocityY = 0;
        }, 20);
    }

    private isTap() {
        return (this.now - this.beginTime) < this.thresholdOfTapTime;
    }

    private canCameraMoveX() {
        const bounds = this.camera.getBounds();
        if (bounds.isEmpty()) {
            return true;
        }

        return this.camera.scrollX > 0 && this.camera.scrollX + this.camera.width < bounds.right;
    }

    private canCameraMoveY() {
        const bounds = this.camera.getBounds();
        if (bounds.isEmpty()) {
            return true;
        }

        return this.camera.scrollY > 0 && this.camera.scrollY + this.camera.height < bounds.height;
    }

    private gameOutTracker(): void {
        this.pointerWithinGame = false;
        this.pressedDown = false;
    }

    private gameOverTracker(): void {
        this.pointerWithinGame = true;
    }

    /**
     * Event triggered when a pointer is released, calculates the automatic scrolling.
     */
    private endMove(): void {
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
        } else {
            if (this.settings.horizontalScroll && this.velocityWheelXAbs < 0.1) {
                this.autoScrollX = true;
            }
            if (this.settings.verticalScroll && this.velocityWheelYAbs < 0.1) {
                this.autoScrollY = true;
            }
        }
    }

    get velocityWheelXAbs(): number {
        return Math.abs(this.velocityWheelX);
    }

    get velocityWheelYAbs(): number {
        return Math.abs(this.velocityWheelY);
    }

    /**
     * Event called after all the core subsystems and the State have updated, but before the render.
     * Create the deceleration effect.
     */
    private update() {
        this.elapsed = Date.now() - this.timestamp;

        if (this.autoScrollX && this.amplitudeX !== 0) {
            const delta = -this.amplitudeX * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
            if (this.canCameraMoveX() && (delta > 0.5 || delta < -0.5)) {
                this.camera.scrollX = this.targetX - delta;
            } else {
                this.autoScrollX = false;
                this.camera.scrollX = this.targetX;
            }
        }

        if (this.autoScrollY && this.amplitudeY !== 0) {
            const delta = -this.amplitudeY * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
            if (this.canCameraMoveY() && (delta > 0.5 || delta < -0.5)) {
                this.camera.scrollY = this.targetY - delta;
            } else {
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
    }

    // noinspection JSUnusedLocalSymbols
    /**
     * Event called when the mousewheel is used, affect the direction of scrolling.
     */
    private mouseWheel(
        pointer: Phaser.Input.Pointer,
        currentlyOver: Phaser.GameObjects.GameObject[],
        deltaX: number,
        deltaY: number
    ) {
        if (!this.settings.horizontalWheel && !this.settings.verticalWheel) {
            return;
        }

        if (this.settings.horizontalWheel) {
            this.autoScrollX = false;
            this.velocityWheelX += deltaX;
            if (typeof this.settings.onUpdate === 'function') {
                this.settings.onUpdate(
                    deltaX,
                    this.camera.scrollX > 0
                    && this.camera.scrollX + this.camera.width < this.camera.worldView.width
                        ? deltaX : 0
                );
            }
        }

        if (this.settings.verticalWheel) {
            this.autoScrollY = false;
            this.velocityWheelY += deltaY;
            if (typeof this.settings.onUpdate === 'function') {
                this.settings.onUpdate(
                    deltaY,
                    this.camera.scrollY > 0
                    && this.camera.scrollY + this.camera.height < this.camera.worldView.height
                        ? deltaY : 0
                );
            }
        }
    }

    addClickEvents(obj: Phaser.GameObjects.Graphics, events: KineticScrollingPluginEvents) {
        if (obj.getData('kineticScrollingClickHelpers')) {
            const helpers = obj.getData('kineticScrollingClickHelpers');
            for (const eventName in events) {
                if (events.hasOwnProperty(eventName)) {
                    // noinspection JSUnfilteredForInLoop
                    // @ts-ignore
                    helpers[eventName] = events[eventName];
                }
            }

            return;
        }

        const helpers = {...events};

        obj.setData('kineticScrollingClickHelpers', helpers);
        events.inputIsDown = false;

        obj
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                const helpers = obj.getData('kineticScrollingClickHelpers') as KineticScrollingPluginEvents;

                helpers.downTimer = setTimeout(() => {
                    helpers.downTimer = null;
                    if (!this.thresholdReached) {
                        this.clickHelperActiveObjects.push(obj);
                        helpers.inputIsDown = true;
                        helpers.down && helpers.down(obj);
                    }
                }, this.thresholdOfTapTime + 10);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.clickHelperActiveObjects.splice(this.clickHelperActiveObjects.indexOf(obj));
                const helpers = obj.getData('kineticScrollingClickHelpers') as KineticScrollingPluginEvents;

                if (helpers.inputIsDown) {
                    helpers.up && helpers.up(obj);
                    this.isTap() && helpers.click && helpers.click(obj);
                    helpers.inputIsDown = false;
                } else if (helpers.downTimer && !this.thresholdReached) {
                    // It was a perfect tap, so we trigger all the events at once
                    clearTimeout(helpers.downTimer);
                    helpers.down    && helpers.down(obj);
                    helpers.up      && helpers.up(obj);
                    helpers.click   && helpers.click(obj);
                }
            });
    }

    cancelClickEventHelpers () {
        this.clickHelperActiveObjects.forEach(function (obj) {
            const helpers = obj.getData('kineticScrollingClickHelpers') as KineticScrollingPluginEvents;
            const inputIsDown = helpers.inputIsDown;
            helpers.inputIsDown = false;
            if (inputIsDown && helpers.up) {
                helpers.up(obj);
            }
        });
    };
}
