runExample({
    scene: {
        init: function () {
            //I f you want change the default configuration before start the plugin
            this.kineticScrolling.configure({
                onUpdate: function (x, y) {
                    console.log('x=' + x + ', y='+ y);
                }
            })
        },
        create: function () {
            this.addHeader('onUpdate callback to track delta');

            // Starts the plugin
            this.kineticScrolling.start();

            this.addRectangles();
        },
    },
})
