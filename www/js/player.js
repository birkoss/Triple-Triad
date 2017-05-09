function Player(newType) {
    this.type = newType;

    this.cards = new Array();
};

Player.prototype = {
    addCard: function(card) {
        this.cards.push(card);
    },
    placeCard: function(map) {
        console.log(map);
        let emptyTiles = map.getTilesEmpty();
        let bestTile = null;

        /*
        map.getTilesEmpty().forEach(function(tile) {
            
        }, this);
        */

        return emptyTiles[0];
    },
    removeCard: function() {
        return this.cards.shift();
    }
};
