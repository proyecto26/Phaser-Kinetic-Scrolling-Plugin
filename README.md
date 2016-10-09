# Kinetic Scrolling Plugin for Phaser Framework

![Kinetic Scrolling Plugin](https://raw.githubusercontent.com/jdnichollsc/Phaser-Kinetic-Scrolling-Plugin/gh-pages/img/plugin.png)

I wanted to simulate horizontal and vertical scrolling in my games to display levels or a section of authors using only the canvas element in HTML5, but I couldn't find a good solution... so I decided to create my own plugin to Phaser Framework :D

> Kinetic scrolling based on http://ariya.ofilabs.com/2013/11/javascript-kinetic-scrolling-part-2.html

##Download the Plugin

Install via [bower](http://bower.io)

`bower i phaser-kinetic-scrolling-plugin --save`

Install via [npm](https://www.npmjs.com)

`npm i phaser-kinetic-scrolling-plugin --save`

##Load the Plugin

```javascript
this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
```

##Change Default Settings of the Plugin - *_It isn't necessary, default is horizontal_*

```javascript
this.game.kineticScrolling.configure({
    kineticMovement: true,
    timeConstantScroll: 325, //really mimic iOS
    horizontalScroll: true,
    verticalScroll: false,
    horizontalWheel: true,
    verticalWheel: false,
    deltaWheel: 40
});
```

##Start the Plugin

```javascript
this.game.kineticScrolling.start();
```

##Stop the Plugin

```javascript
this.game.kineticScrolling.stop();
```

##Full Example

```javascript
var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', {
    init: function () {

        //Load the plugin
        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

        //If you want change the default configuration before start the plugin
    },
    create: function () {

        //Starts the plugin
        this.game.kineticScrolling.start();

        //If you want change the default configuration after start the plugin

        this.rectangles = [];

        var initX = 50;

        for (var i = 0; i < 26; i++) {
            this.rectangles.push(this.createRectangle(initX, this.game.world.centerY - 100, 250, 200));
            this.index = this.game.add.text(initX + 125, this.game.world.centerY, i + 1,
                        { font: 'bold 150px Arial', align: "center" });
            this.index.anchor.set(0.5);
            initX += 300;
        }

        //Changing the world width
        this.game.world.setBounds(0, 0, 320 * this.rectangles.length, this.game.height);
    },
    createRectangle: function (x, y, w, h) {
        var sprite = this.game.add.graphics(x, y);
        sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRect(0, 0, w, h);
        return sprite;
    }
});
```

## Examples
The repository has some examples of the plugin:
- Horizontal scrolling
- Horizontal scrolling with scrollbar
- Horizontal scrolling and pressing events
- Horizontal and Vertical scrolling (Mouse wheel too)

# Happy scrolling
Made with <3

<img width="150px" src="http://phaser.azurewebsites.net/assets/nicholls.png" align="right">
