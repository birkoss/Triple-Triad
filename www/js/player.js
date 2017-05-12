function Player(newOwner, newType) {
    this.owner = newOwner;
    this.type = newType;

    this.cards = new Array();
};

Player.prototype = {
    addCard: function(card) {
        this.cards.push(card);
    },
    /*
     * Map all tiles for each card using a priority value
     *
     * Rules
     *
     * Hiding a weak side: +5
     * Hiding a strong side: -5
     * Leaving a weak side open: -10
     * Capturing a tile: 25
     * Capturing 2 tiles: 75
     */
    placeCard: function(map) {
        let emptyTiles = map.getTilesEmpty();
        let bestTile = null;

        let cardsPerTiles = new Array();

        let weakThreshold = 5;
        let strongThreshold = 6;

        this.cards.forEach(function(singleCard) {
            let card = GAME.getCard(singleCard);
            let cardPerTiles = {cardName:singleCard, tiles:[]};

            map.getTilesEmpty().forEach(function(singleTile) {
                let value = 0;

                let neighboors = [
                    {gridX:singleTile.gridX-1, gridY:singleTile.gridY, stat:"left"},
                    {gridX:singleTile.gridX+1, gridY:singleTile.gridY, stat:"right"},
                    {gridX:singleTile.gridX, gridY:singleTile.gridY-1, stat:"up"},
                    {gridX:singleTile.gridX, gridY:singleTile.gridY+1, stat:"down"}
                ];

                neighboors.forEach(function(neighboor) {
                    let tile = map.getTileAt(neighboor.gridX, neighboor.gridY);
                    
                    /* Protecting a weak side on ourself (Best with the map limit) */
                    if (card.stats[neighboor.stat] < weakThreshold) {
                        if (tile == null) {
                            value += 10;
                        } else if (tile.card != null) {
                            value += 5;
                        }
                    }

                    /* Protecting a good side on ourself */
                    if (card.stats[neighboor.stat] > strongThreshold) {
                        if (tile == null || tile.card == null) {
                            value -= 10;
                        }
                    }

                }, this);

                console.log("VALUE:" + value);
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
