runExample({
    scene: {
        create: function () {
            this.addHeader('Horizontal scroll with scrollbar')

            // Starts the plugin
            this.kineticScrolling.start()

            this.addRectangles()

            // Create scrollbar
            if (this.cameras.main.getBounds().width > this.cameras.main.width) {
                this.scroll = this.createRectangle(0, 0, 50, 10)
                this.scroll.setScrollFactor(0)
                // Remember the value of the position of the camera
                this.scroll.cameraX = this.cameras.main.scrollX
            }
        },

        update: function () {
            // If there is a change in position of the camera, then change the
            // position of the scrollbar
            if ((typeof this.scroll !== 'undefined')
                && (this.scroll.cameraX !== this.cameras.main.scrollX)
            ) {
                this.scroll.x = (this.cameras.main.scrollX /
                    (this.cameras.main.getBounds().width - this.cameras.main.width)) *
                    (this.cameras.main.width - 50)
                this.scroll.cameraX = this.cameras.main.scrollX
            }
        },
    },
})
