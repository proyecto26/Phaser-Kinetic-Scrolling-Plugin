var kinematicHVLoadState = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize(true);

        //Load the plugin
        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

        //Configure the plugin
        this.game.kineticScrolling.configure({
            verticalScroll: true,
            horizontalScroll: true
        });
    },
    preload: function () {
        this.game.load.image('loading', 'img/loading.png');
        this.game.load.image('loadingborder', 'img/loadingborder.png');
        this.game.load.image('tv', 'img/tv.png');

        this.game.load.audio('zelda', ['audio/zelda.ogg', 'audio/zelda.mp3']);
    },
    create: function () {
        this.game.state.start('play');
    }
};

var kinematicHVGameState = {
    preload: function () {
        this.labelloading = this.game.add.text(this.game.world.centerX - 70,
                                     this.game.world.centerY - 70,
                                     'cargando...',
                                     { font: '30px Arial', fill: '#fff' });
        this.labelloading.anchor.setTo(0.5, 0.5);
        this.preloadingborder = this.game.add.sprite(this.game.world.centerX - 70, this.game.world.centerY - 30, 'loadingborder');
        this.preloadingborder.x -= this.preloadingborder.width / 2;
        this.preloading = this.game.add.sprite(this.game.world.centerX - 70, this.game.world.centerY - 26, 'loading');
        this.preloading.x -= this.preloading.width / 2;
        this.game.load.setPreloadSprite(this.preloading, 0);

        this.tv = this.game.add.sprite(0, 0, 'tv');
        this.tv.fixedToCamera = true;
        this.tv.anchor.set(0.5);
        this.tv.scale.set(1);
        this.tv.cameraOffset.setTo(this.game.width / 2, this.game.height / 2);

        this.game.load.image('zelda', 'img/zelda.png');
        this.game.load.image('scroll', 'img/scroll.png');


        var self = this;
        this.music = this.game.add.audio('zelda');
        this.music.loop = true;
        this.music.play();

        this.game.sound.mute = true;

        var inview = new Waypoint.Inview({
            element: this.game.canvas,
            enter: function (direction) {
                self.game.sound.mute = false;
            },
            exited: function (direction) {
                self.game.sound.mute = true;
            }
        })
    },
    create: function () {
        //Starts the plugin
        this.game.kineticScrolling.start();

        //Changing the world height
        var zeldaMap = this.game.cache.getImage("zelda");
        this.game.world.setBounds(0, 0, zeldaMap.width, zeldaMap.height);

        this.game.camera.x = this.game.world.centerX - 200;
        this.game.camera.y = this.game.world.centerY + 480;

        this.map = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'zelda');
        this.map.anchor.set(0.5);

        this.game.world.bringToTop(this.tv);

        this.scroll = this.game.add.image(0, 0, 'scroll');
        this.scroll.anchor.set(0.5);
        this.scroll.fixedToCamera = true;
        this.scroll.cameraOffset.setTo(this.game.width / 2 + 150, this.game.height - 150);

        this.game.add.tween(this.scroll.scale).to({ x: 0.9, y: 0.9 }, 800, "Linear", true, 0, -1).yoyo(true, 100);
    }
};

var kinematicHVGame = new Phaser.Game(900, 550, Phaser.AUTO, 'kinematicHVGame');

kinematicHVGame.state.add('load', kinematicHVLoadState);
kinematicHVGame.state.add('play', kinematicHVGameState);
kinematicHVGame.state.start('load');