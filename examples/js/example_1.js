runExample({
    scene: {
        create: function () {
            this.addHeader('Horizontal scroll');

            // Starts the plugin
            this.kineticScrolling.start();

            // If you want change the default configuration after start the plugin
            this.kineticScrolling.configure({
                horizontalScroll: true,
                verticalScroll: false,
            });

            this.addRectangles();
        }
    }
});
