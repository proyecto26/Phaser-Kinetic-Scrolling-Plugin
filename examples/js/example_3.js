runExample({
    scene: {
        create: function () {
            this.addHeader('Horizontal scroll and input events');

            // Starts the plugin
            this.kineticScrolling.start();

            this.addRectangles();
        },

        extend: {
            createRectangle: function (x, y, w, h) {
                const sprite = this.add.rectangle(
                    x, y, w, h,
                    Phaser.Display.Color.RandomRGB(100, 255).color
                );

                this.kineticScrolling.addClickEvents(sprite, {
                    down: () => {
                        console.log('DOWN!');
                        this.tweens.add({
                            targets: sprite,
                            alpha: .5,
                            y: '-=30',
                            duration: 300,
                            ease: Phaser.Math.Easing.Linear,
                        });
                    },
                    up: () => {
                        console.log('UP!');
                        this.tweens.add({
                            targets: sprite,
                            alpha: 1,
                            y: '+=30',
                            duration: 300,
                            ease: Phaser.Math.Easing.Linear,
                        });
                    },
                    click: () => {
                        console.log('CLICK!');
                    }
                });

                return sprite;
            }
        },
    }
})
