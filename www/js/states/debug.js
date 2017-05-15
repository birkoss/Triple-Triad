var GAME = GAME || {};

GAME.Debug = function() {};

GAME.Debug.prototype = {
    init: function() {
    },
    create: function() {
        let bounds = new Phaser.Rectangle(50, 50, 300, 120);
        let options = {
            direction: 'y',
            overflow: 100,
            padding: 10,
            searchForClicks: true
        };
        let listView = new PhaserListView.ListView(this.game, this.world, bounds, options);
        let items = [];
        for(let i=0; i<8; i++) {
            let sprite = this.game.add.sprite(0, 0, "tile:blank");
            sprite.width = 150;
            sprite.height = 80;
            sprite.inputEnabled = true;
            sprite.events.onInputUp.add(function() { console.log("UP"); }, this);
            items.push(items);
            listView.add(sprite);
        }
    }
};
