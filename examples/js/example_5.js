var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser-example', {
    init: function () {

        //Load the plugin
        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

        //If you want change the default configuration before start the plugin

        this.game.kineticScrolling.configure({
            onUpdate: function (x, y) {
                console.log('x=' + x + ', y='+ y);
            }
        })
    },
    create: function () {

        //Starts the plugin
        this.game.kineticScrolling.start();

        //If you want change the default configuration after start the plugin

        this.info = this.game.add.text(game.world.width*0.01, game.world.height*0.01, "onUpdate callback to track delta", {
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

        return sprite;
    }
});
