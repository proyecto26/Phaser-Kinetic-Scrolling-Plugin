# Kinetic Scrolling Plugin for Phaser Framework

![Kinetic Scrolling Plugin](https://raw.githubusercontent.com/jdnichollsc/Phaser-Kinetic-Scrolling-Plugin/gh-pages/img/plugin.png)

The vertical and horizontal scrolling is a very useful feature in the games for example to display a section of levels and with this plugin you can simulate the scrolling within a **canvas** element of **HTML5**... so check this awesome plugin for **Phaser Framework**!

> Kinetic scrolling based on http://ariya.ofilabs.com/2013/11/javascript-kinetic-scrolling-part-2.html

## Download the Plugin

[![NPM](https://nodei.co/npm/phaser-kinetic-scrolling-plugin.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/phaser-kinetic-scrolling-plugin/)

Install via [bower](http://bower.io)

`bower i phaser-kinetic-scrolling-plugin --save`

Install via [npm](https://www.npmjs.com)

`npm i phaser-kinetic-scrolling-plugin --save`

## Load the Plugin

```javascript
this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
```

## Change Default Settings of the Plugin - *_It isn't necessary, default is horizontal_*

```javascript
this.game.kineticScrolling.configure({
    kineticMovement: true,
    timeConstantScroll: 325, //really mimic iOS
    horizontalScroll: true,
    verticalScroll: false,
    horizontalWheel: true,
    verticalWheel: false,
    deltaWheel: 40,
    onUpdate: null //A function to get the delta values if it's required (deltaX, deltaY)
});
```

## Start the Plugin

```javascript
this.game.kineticScrolling.start();
```

## Stop the Plugin

```javascript
this.game.kineticScrolling.stop();
```

## Full Example

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
The repository has some examples of the plugin, to run the examples created by the community execute the command `gulp examples` from the terminal:
- Horizontal scrolling
- Horizontal scrolling with scrollbar
- Horizontal scrolling and pressing events
- Horizontal and Vertical scrolling (Mouse wheel too)
- onUpdate callback to track delta

## Collaborators
[<img alt="jdnichollsc" src="https://avatars3.githubusercontent.com/u/2154886?v=3&s=117" width="117">](https://github.com/jdnichollsc) | [<img alt="daniel-mf" src="https://avatars1.githubusercontent.com/u/4193707?s=117&v=4" width="117">](https://github.com/daniel-mf) | [<img alt="VitaZheltyakov" src="https://avatars3.githubusercontent.com/u/5693437?v=3&s=117" width="117">](https://github.com/VitaZheltyakov) | [<img alt="iamchristopher" src="https://avatars2.githubusercontent.com/u/5909516?v=3&s=117" width="117">](https://github.com/iamchristopher) | [<img alt="daaaabeen" src="https://avatars0.githubusercontent.com/u/3760804?s=117&v=3" width="117">](https://github.com/daaaabeen) |
:---: |:---: |:---: |:---: |:---: |
[Nicholls](mailto:jdnichollsc@hotmail.com) | [Daniel](mailto:echo.dmf@gmail.com) | [Vitaliy](mailto:vita-zhelt@yandex.ru) | [Chris Wright](https://twitter.com/jorbascrumps) | [Daaaabeen](mailto:dianbin.lee@gmail.com) |

## Other Projects
- **[IonPhaser](http://market.ionic.io/plugins/ionphaser)**
- **[Rotate Sprite Extension](https://github.com/jdnichollsc/Phaser-Rotate-Sprite-Extension)**

## Supporting
I believe in Unicorns 🦄
Support [me](http://www.paypal.me/jdnichollsc/2), if you do too.

## Happy scrolling
Made with <3

<img width="150px" src="http://phaser.azurewebsites.net/assets/nicholls.png" align="right">
