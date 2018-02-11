var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser-example', {
    init: function () {

        //Load the plugin
        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

        //If you want change the default configuration before start the plugin
    },
    create: function () {

        //Starts the plugin
        this.game.kineticScrolling.start();

        //If you want change the default configuration after start the plugin

        this.info = this.game.add.text(game.world.width*0.01, game.world.height*0.01, "Horizontal scroll and input events", { 
            font: "22px Arial", 
            fill: "#ffffff" 
        });
        this.info.fixedToCamera = true;

        this.rectangles = [];

        var initX = 50;

        for (var i = 0; i < 25; i++) {
            this.rectangles.push(this.createRectangle(initX, this.game.world.centerY - 100, 250, 200));
            this.index = this.game.add.text(initX + 125, this.game.world.centerY, i + 1,
                        { font: 'bold 150px Arial', align: "center" });
            this.index.anchor.set(0.5);
            initX += 300;
        }

        //Changing the world width
        this.game.world.setBounds(0, 0, 302 * this.rectangles.length, this.game.height);
    },

    createRectangle: function (x, y, w, h) {
        var sprite = this.game.add.graphics(x, y);
        sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRect(0, 0, w, h);
        // Adding processing of clicking on the box
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function(e) {
            // Processing of pressing should be carried out delayed
            if (typeof e.timerInputDown !== "undefined") clearTimeout(e.timerInputDown);
            e.timerInputDown = window.setTimeout(function(e) {
               // Checks scroll
               if (!this.game.kineticScrolling.dragging) game.add.tween(e).to({ alpha: 0, y: '-100' }, 300, Phaser.Easing.Linear.None, true);
            }, 200, e);
        }, this);
        sprite.events.onInputUp.add(function(e) {
            if (typeof e.timerInputUp !== "undefined") clearTimeout(e.timerInputUp);
            e.timerInputUp = window.setTimeout(function(e) {
               if (!this.game.kineticScrolling.dragging) game.add.tween(e).to({ alpha: 1, y: y }, 300, Phaser.Easing.Linear.None, true);
            }, 200, e);
        }, this);

        return sprite;
    }
});