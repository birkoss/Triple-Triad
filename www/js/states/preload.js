var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('card:background', 'images/cards/background.png');
        this.load.image('card:frame', 'images/cards/frame.png');
        this.load.image('card:border', 'images/cards/border.png');

        this.load.spritesheet('unit:skeleton', 'images/tiles/units/skeleton.png', 16, 16);
        this.load.spritesheet('unit:peon', 'images/tiles/units/peon.png', 16, 16);
        this.load.spritesheet('unit:archer', 'images/tiles/units/archer.png', 16, 16);
        this.load.spritesheet('unit:dwarf', 'images/tiles/units/dwarf.png', 16, 16);
        this.load.spritesheet('unit:farmer', 'images/tiles/units/farmer.png', 16, 16);
        this.load.spritesheet('unit:priest', 'images/tiles/units/priest.png', 16, 16);
        this.load.spritesheet('unit:crocodile', 'images/tiles/units/crocodile.png', 16, 16);
        this.load.spritesheet('unit:rat', 'images/tiles/units/rat.png', 16, 16);
        this.load.spritesheet('unit:small-demon', 'images/tiles/units/small-demon.png', 16, 16);

        this.load.spritesheet('ninepatch:background', 'images/gui/panel.png', 8, 8);
        this.load.spritesheet('ninepatch:blue', 'images/gui/title.png', 8, 8);
        this.load.spritesheet('gui:btnLevel', 'images/gui/buttons/level.png', 49, 49);
        this.load.spritesheet('gui:btnLevelLocked', 'images/gui/buttons/level-locked.png', 49, 49);

        this.load.image('map:grass', 'images/maps/grass.png');

        this.load.image('tile:blank', 'images/tiles/blank.png');

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');

        this.load.json('data:cards', 'data/cards.json');
        this.load.json('data:enemies', 'data/enemies.json');
    },
    create: function() {
        GAME.json = {};
        GAME.json['cards'] = this.cache.getJSON('data:cards');
        GAME.json['enemies'] = this.cache.getJSON('data:enemies');

        this.state.start('Level'); /* Game/Debug */
    }
};
