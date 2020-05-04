import Phaser from 'phaser';
import KineticScrollingPluginSettings from './KineticScrollingPluginSettings';
import KineticScrollingPluginEvents from './KineticScrollingPluginEvents';
export default class KineticScrollingPlugin extends Phaser.Plugins.ScenePlugin {
    get camera(): Phaser.Cameras.Scene2D.Camera;
    static readonly NAME = "kineticScrolling";
    private readonly STAGE_INPUT_EVENT_HANDLERS;
    private readonly GAME_EVENT_HANDLERS;
    private settings;
    private pointerId;
    private dragging;
    private pressedDown;
    private timestamp;
    private beginTime;
    private screenX;
    private screenY;
    private targetX;
    private targetY;
    private autoScrollX;
    private autoScrollY;
    private startX;
    private startY;
    private velocityX;
    private velocityY;
    private amplitudeX;
    private amplitudeY;
    private directionWheel;
    private velocityWheelX;
    private velocityWheelY;
    private readonly thresholdOfTapTime;
    private readonly thresholdOfTapDistance;
    private thresholdReached;
    private clearMovementTimer;
    private now;
    private pointerWithinGame;
    private elapsed;
    private clickHelperActiveObjects;
    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager);
    /**
     * Change Default Settings of the plugin
     */
    configure(settings: KineticScrollingPluginSettings): void;
    /**
     * Start the Plugin.
     */
    start(): void;
    /**
     * Stop the Plugin.
     */
    stop(): void;
    private attachEventHandlers;
    private removeEventHandlers;
    /**
     * Event triggered when a pointer is pressed down, resets the value of
     * variables.
     */
    private beginMove;
    /**
     * Event triggered when the activePointer receives a DOM move event such as a mousemove or touchmove.
     * The camera moves according to the movement of the pointer, calculating the velocity.
     */
    private moveCamera;
    private isTap;
    private canCameraMoveX;
    private canCameraMoveY;
    private gameOutTracker;
    private gameOverTracker;
    /**
     * Event triggered when a pointer is released, calculates the automatic scrolling.
     */
    private endMove;
    get velocityWheelXAbs(): number;
    get velocityWheelYAbs(): number;
    /**
     * Event called after all the core subsystems and the State have updated, but before the render.
     * Create the deceleration effect.
     */
    private update;
    /**
     * Event called when the mousewheel is used, affect the direction of scrolling.
     */
    private mouseWheel;
    addClickEvents(obj: Phaser.GameObjects.Graphics, events: KineticScrollingPluginEvents): void;
    cancelClickEventHelpers(): void;
}
