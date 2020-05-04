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
const config = {
    // other directives
    // ...

    plugins: {
        scene: [
            {
                key: KineticScrollingPlugin.NAME,
                plugin: KineticScrollingPlugin,
                mapping: KineticScrollingPlugin.NAME,
            },
        ],
    },
};

new Phaser.Game(config);
```

## Change Default Settings of the Plugin - *_It isn't necessary, default is horizontal_*

```javascript
// in scene
this.kineticScrolling.configure({
    kineticMovement: true,
    timeConstantScroll: 325, //really mimic iOS
    horizontalScroll: true,
    verticalScroll: false,
    horizontalWheel: true,
    verticalWheel: false,
    deltaWheel: 40,
    onUpdate: null // A function to get the delta values if it's required (deltaX, deltaY)
});
```

## Start the Plugin

```javascript
// in scene
this.kineticScrolling.start();
```

## Stop the Plugin

```javascript
// in scene
this.kineticScrolling.stop();
```

## Full Example

```javascript
const Phaser = require('phaser');
const KineticScrollingPlugin = require('phaser-kinetic-scrolling-plugin');

new Phaser.Game({
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'phaser-example',
    plugins: {
        scene: [
            {
                key: KineticScrollingPlugin.NAME,
                plugin: KineticScrollingPlugin,
                mapping: KineticScrollingPlugin.NAME,
            },
        ],
    },
    scene: {
        create: function () {
            // Starts the plugin
            this.kineticScrolling.start();

            // If you want change the default configuration after start the plugin
            this.kineticScrolling.configure({
                horizontalScroll: true,
                verticalScroll: false,
            });

            this.add.text(this.cameras.main.width*0.01, this.cameras.main.height*0.01, "Horizontal scroll", { font: "16px Arial", fill: "#ffffff" });


            this.rectangles = [];

            var initX = 50;

            for (var i = 0; i < 25; i++) {
                this.rectangles.push(this.createRectangle(initX, this.cameras.main.centerY - 100, 250, 200));
                this.add.text(initX + 50, this.cameras.main.centerY - 50, i + 1,
                    { font: 'bold 150px Arial', align: "center" });
                initX += 300;
            }

            // Changing the world width
            this.cameras.main.setBounds(0, 0, 302 * this.rectangles.length, this.cameras.main.height);
        },
        extend: {
            createRectangle: function (x, y, w, h) {
                const sprite = this.add.graphics({
                    x, y
                });
                sprite.fillStyle(Phaser.Display.Color.RandomRGB(100, 255).color, 1);
                sprite.bounds = new Phaser.Geom.Rectangle(0, 0, w, h);
                sprite.fillRect(0, 0, w, h);
                return sprite;
            },
        }
    }
})
```

## Examples
The repository has some examples of the plugin, to run the examples created by the community execute the command `gulp examples` from the terminal:
- Horizontal scrolling
- Horizontal scrolling with scrollbar
- Horizontal scrolling and pressing events
- Horizontal and Vertical scrolling (Mouse wheel too)
- onUpdate callback to track delta

## Collaborators
[<img alt="jdnichollsc" src="https://avatars3.githubusercontent.com/u/2154886?v=3&s=117" width="117">](https://github.com/jdnichollsc) | [<img alt="daniel-mf" src="https://avatars1.githubusercontent.com/u/4193707?s=117&v=4" width="117">](https://github.com/daniel-mf) | [<img alt="VitaZheltyakov" src="https://avatars3.githubusercontent.com/u/5693437?v=3&s=117" width="117">](https://github.com/VitaZheltyakov) | [<img alt="iamchristopher" src="https://avatars2.githubusercontent.com/u/5909516?v=3&s=117" width="117">](https://github.com/iamchristopher) | [<img alt="daaaabeen" src="https://avatars0.githubusercontent.com/u/3760804?s=117&v=3" width="117">](https://github.com/daaaabeen) | [<img alt="insideone" src="https://avatars1.githubusercontent.com/u/16841572?s=460&v=4" width="117">](https://github.com/insideone) |
:---: |:---: |:---: |:---: |:---: |:---: |
[Nicholls](mailto:jdnichollsc@hotmail.com) | [Daniel](mailto:echo.dmf@gmail.com) | [Vitaliy](mailto:vita-zhelt@yandex.ru) | [Chris Wright](https://twitter.com/jorbascrumps) | [Daaaabeen](mailto:dianbin.lee@gmail.com) | [inside](mailto:xim.nenko@gmail.com) |

## Other Projects
- **[IonPhaser](http://market.ionic.io/plugins/ionphaser)**
- **[Rotate Sprite Extension](https://github.com/jdnichollsc/Phaser-Rotate-Sprite-Extension)**

## Supporting
I believe in Unicorns 🦄
Support [me](http://www.paypal.me/jdnichollsc/2), if you do too.

## Happy scrolling
Made with <3

<img width="150px" src="https://github.com/jdnichollsc/jdnichollsc.github.io/blob/master/assets/nicholls.png?raw=true" align="right">
