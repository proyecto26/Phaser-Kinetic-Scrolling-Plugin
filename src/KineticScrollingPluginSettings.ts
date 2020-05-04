/**
 * Settings to change behaviour of Kinetic Scrolling plugin.
 */
interface KineticScrollingPluginSettings {
    /**
     * Enable or disable the kinematic motion.
     */
    kineticMovement?: boolean;

    /**
     * The rate of deceleration for the scrolling.
     */
    timeConstantScroll?: number;

    /**
     * Enable or disable the horizontal scrolling.
     */
    horizontalScroll?: boolean;

    /**
     * Enable or disable the vertical scrolling.
     */
    verticalScroll?: boolean;

    /**
     * Enable or disable the horizontal scrolling with the mouse wheel.
     */
    horizontalWheel?: boolean;

    /**
     * Enable or disable the vertical scrolling with the mouse wheel.
     */
    verticalWheel?: boolean;

    /**
     * Delta increment of the mouse wheel.
     */
    deltaWheel?: number;

    /**
     * A function to get the delta values if it's required (deltaX, deltaY).
     */
    onUpdate?: Function;

    /**
     * Phaser button code to start drag (LEFT_BUTTON, RIGHT_BUTTON, etc).
     */
    button?: number;
}

export default KineticScrollingPluginSettings;
