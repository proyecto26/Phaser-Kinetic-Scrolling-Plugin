function runExample(config) {
    return new Promise(resolve => {
        window.exports = {};

        requirejs.config({
            enforceDefine: true,
            paths: {
                'Phaser': 'https://cdn.jsdelivr.net/npm/phaser@3.23.0/dist/phaser',
                'phaser-kinetic-scrolling-plugin': '/dist/KineticScrollingPlugin'
            },
            map: {
                '*': {
                    'phaser': 'Phaser',
                }
            },
            shim: {
                'phaser-kinetic-scrolling-plugin': {
                    exports: 'KineticScrollingPlugin',
                }
            }
        });

        require(['Phaser'], (Phaser) => {
            require(['phaser-kinetic-scrolling-plugin'], KineticScrollingPlugin => {

                const defaultExtend = {
                    createRectangle(x, y, w, h) {
                        return this.add.rectangle(
                            x, y, w, h,
                            Phaser.Display.Color.RandomRGB(100, 255).color
                        );
                    },

                    addRectangles() {
                        this.rectangles = [];

                        let initX = 200;

                        for (let i = 0; i < 25; i++) {
                            this.rectangles.push(this.createRectangle(initX, this.cameras.main.centerY - 50, 250, 200));
                            this.add.text(
                                initX - 100,
                                this.cameras.main.centerY - 150,
                                i + 1,
                                { font: 'bold 150px Arial', align: 'center' }
                            );

                            initX += 300;
                        }

                        // Changing the world width
                        this.cameras.main.setBounds(0, 0, 302 * this.rectangles.length, this.cameras.main.height);
                    },

                    addHeader(text) {
                        this.add.text(
                            this.cameras.main.width*0.01,
                            this.cameras.main.height*0.01,
                            text,
                            { font: "16px Arial", fill: "#ffffff" }
                        ).setScrollFactor(0);
                    }
                };

                const gameConfig = Object.assign({
                    type: Phaser.AUTO,
                    width: 1024,
                    height: 768,
                    parent: 'phaser-example',
                    plugins: {
                        scene: [
                            {
                                key: KineticScrollingPlugin.NAME,
                                plugin: KineticScrollingPlugin,
                                mapping: KineticScrollingPlugin.NAME,
                            },
                        ],
                    },

                }, config);

                if ('scene' in gameConfig) {
                    gameConfig.scene.extend = Object.assign(
                        defaultExtend,
                        typeof config.scene.extend === 'object'
                            ? config.scene.extend
                            : {}
                    );
                }

                resolve(new Phaser.Game(gameConfig));
            });
        });
    });
}
