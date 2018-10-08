declare module Phaser {
    module Plugin {
        /**
         * Settings to change behaviour of Kinetic Scrolling plugin.
         */
        interface KineticScrollingSettings {
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
            onUpdate?: Function
        }

        /**
         * Kinetic Scrolling is a Phaser plugin that allows vertical and horizontal scrolling with kinetic motion.
         * It works with the Phaser.Camera
         */
        export class KineticScrolling extends Phaser.Plugin {
            /**
             * @param game The Game object is the instance of the game, where the magic happens.
             * @param parent The object that owns this plugin, usually Phaser.PluginManager.
             */
            constructor(game: Phaser.Game, parent: Phaser.PluginManager);

            /**
             * Start the Plugin.
             */
            public start(): void;

            /**
             * Stop the Plugin.
             */
            public stop(): void;

            /**
             * Change Default Settings of the plugin
             * @param options Object that contain properties to change the behavior of the plugin.
             */
            public configure(options: KineticScrollingSettings): void;
        }
    }

    interface Game {
        /**
         * Instance of the plugin that handles kinetic scrolling with mouse, dragging or mouse wheel.
         */
        kineticScrolling: Plugin.KineticScrolling;
    }
}

declare module "phaser-kinetic-scrolling-plugin" { }
