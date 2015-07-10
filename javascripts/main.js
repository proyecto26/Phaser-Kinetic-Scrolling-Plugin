
var kinematicGame = new Phaser.Game(898, 430, Phaser.AUTO, 'kinematicGame', {
    init: function () {
        this.game.stage.backgroundColor = '#FFF';
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize(true);

        //Load the plugin
        this.game.kinectScrolling = this.game.plugins.add(Phaser.Plugin.KinectScrolling);
    },
    preload: function () {
        this.game.load.image('mobile', mobileURI);
        this.game.load.image('horizontalScroll', horizontalScrollURI);
    },
    create: function () {

        //Starts the plugin
        this.game.kinectScrolling.start();

        this.rectangles = [];

        var initX = 180;

        for (var i = 0; i < 26; i++) {
            this.rectangles.push(this.createRectangle(initX, this.game.world.centerY - 100, 250, 200));
            this.index = this.game.add.text(initX + 125, this.game.world.centerY, i + 1,
                        { font: 'bold 150px Arial', align: "center" });
            this.index.anchor.set(0.5);
            initX += 300;
        }

        //Changing the world width
        this.game.world.setBounds(0, 0, 320 * this.rectangles.length, this.game.height);

        this.mobile = this.game.add.sprite(0, 0, 'mobile');
        this.mobile.fixedToCamera = true;
        this.mobile.cameraOffset.setTo(0, 0);

        this.horizontalScroll = this.game.add.image(0, 0, 'horizontalScroll');
        this.horizontalScroll.anchor.set(0.5);
        this.horizontalScroll.scale.set(0.7);
        this.horizontalScroll.fixedToCamera = true;
        this.horizontalScroll.cameraOffset.setTo(this.game.width/2, this.game.height - 120);

        this.game.add.tween(this.horizontalScroll.scale).to({  x: 0.9, y: 0.9 }, 800, "Linear", true, 0, -1).yoyo(true, 100);
    },
    createRectangle: function (x, y, w, h) {
        var sprite = this.game.add.graphics(x, y);
        sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRect(0, 0, w, h);
        return sprite;
    }
});