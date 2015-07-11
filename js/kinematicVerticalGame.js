
var kinematicVerticalGame = new Phaser.Game(210, 360, Phaser.AUTO, 'kinematicVerticalGame', {
    init: function () {
        this.game.stage.backgroundColor = '#FFF';

        //Load the plugin
        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

        //Configure the plugin
        this.game.kineticScrolling.configure({
            verticalScroll: true,
            horizontalScroll: false
        });
    },
    preload: function () {
        this.game.load.image('mobile', mobileURI);
        this.game.load.image('horizontalScroll', horizontalScrollURI);
    },
    create: function () {

        //Starts the plugin
        this.game.kineticScrolling.start();

        this.rectangles = [];

        var initY = 80;

        for (var i = 0; i < 26; i++) {
            this.rectangles.push(this.createRectangle(this.game.world.centerX - 50, initY, 100, 100));
            this.index = this.game.add.text(this.game.world.centerX, initY + 50, i + 1,
                        { font: 'bold 50px Arial', align: "center" });
            this.index.anchor.set(0.5);
            initY += 125;
        }

        //Changing the world height
        this.game.world.setBounds(0, 0, this.game.width, 130 * this.rectangles.length);

        this.mobile = this.game.add.sprite(0, 0, 'mobile');
        this.mobile.fixedToCamera = true;
        this.mobile.anchor.set(0.5);
        this.mobile.angle = -90;
        this.mobile.scale.set(0.4);
        this.mobile.cameraOffset.setTo(this.game.width / 2, this.game.height / 2);

        //this.game.add.tween(this.horizontalScroll.scale).to({ x: 0.9, y: 0.9 }, 800, "Linear", true, 0, -1).yoyo(true, 100);
    },
    createRectangle: function (x, y, w, h) {
        var sprite = this.game.add.graphics(x, y);
        sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRect(0, 0, w, h);
        return sprite;
    }
});