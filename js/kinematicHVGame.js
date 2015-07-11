
var kinematicHVGame = new Phaser.Game(900, 550, Phaser.AUTO, 'kinematicHVGame', {
    init: function () {
        this.game.stage.backgroundColor = '#FFF';

        //Load the plugin
        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

        //Configure the plugin
        this.game.kineticScrolling.configure({
            verticalScroll: true,
            horizontalScroll: true
        });
    },
    preload: function () {
        this.game.load.image('mobile', mobileURI);
        this.game.load.image('tv', 'img/tv.png');
        this.game.load.image('zelda', 'img/zelda.png');
    },
    create: function () {

        //Starts the plugin
        this.game.kineticScrolling.start();        

        this.map = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'zelda');
        this.map.anchor.set(0.5);

        this.tv = this.game.add.sprite(0, 0, 'tv');
        this.tv.fixedToCamera = true;
        this.tv.anchor.set(0.5);
        this.tv.scale.set(1);
        this.tv.cameraOffset.setTo(this.game.width / 2, this.game.height / 2);

        //Changing the world height
        this.game.world.setBounds(0, 0, this.map.width, this.map.length);

    },
    createRectangle: function (x, y, w, h) {
        var sprite = this.game.add.graphics(x, y);
        sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRect(0, 0, w, h);
        return sprite;
    }
});