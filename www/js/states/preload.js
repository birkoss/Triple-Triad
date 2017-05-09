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

        this.load.image('map:grass', 'images/maps/grass.png');

        this.load.image('tile:blank', 'images/tiles/blank.png');

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');

        this.load.json('data:cards', 'data/cards.json');
    },
    create: function() {
        GAME.json = {};
        GAME.json['cards'] = this.cache.getJSON('data:cards');

        this.state.start('Game'); /* Game/Debug */
    }
};
