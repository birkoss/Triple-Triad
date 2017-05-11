function Player(newType) {
    this.type = newType;

    this.cards = new Array();
};

Player.prototype = {
    addCard: function(card) {
        this.cards.push(card);
    },
    placeCard: function(map) {
        let emptyTiles = map.getTilesEmpty();
        let bestTile = null;

        let cardsPerTiles = new Array();

        this.cards.forEach(function(singleCard) {
            let cardPerTiles = {cardName:singleCard, tiles:[]};

            map.getTilesEmpty().forEach(function(singleTile) {
                let value = 0;

                cardPerTiles.tiles.push({gridX:singleTile.gridX, gridY:singleTile.gridY, value:value});
            }, this);

            cardsPerTiles.push(cardPerTiles);
        }, this);

        console.log(cardsPerTiles);

        return emptyTiles[0];
    },
    removeCard: function() {
        return this.cards.shift();
    }
};
