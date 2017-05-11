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

        this.cards.forEach(function(singleCard) {
            let cardPerTiles = {cardName:singleCard, tiles:[]};

            map.getTilesEmpty().forEach(function(singleTile) {
                let surrounding = {
                    '-1x0':false,
                    '1x0':false,
                    '0x-1':false,
                    '0x1':false
                };
                let value = 0;

                let neighboors = map.getNeighboorsAt(singleTile.gridX, singleTile.gridY);
                neighboors.forEach(function(neighboor) {
                    let diffX = neighboor.gridX - singleTile.gridX;
                    let diffY = neighboor.gridY - singleTile.gridY;

                    let tile = map.getTileAt(neighboor.gridX, neighboor.gridY);
                    if (tile.card != null) {// && tile.card.owner != this.owner) {
                        surrounding[diffX+"x"+diffY] = tile;
                    } else if (tile.card == null) {
                        surrounding[diffX+"x"+diffY] = true;
                    }
                }, this);

                /* Hiding a weak spot = +5 */
                let weakThreshold = 5;

                console.log(surrounding);

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
