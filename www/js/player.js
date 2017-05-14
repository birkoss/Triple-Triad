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

        let cardsValues = {};

        let weakThreshold = 5;
        let strongThreshold = 6;
        let highestValue = 0;

        let cardObject = new Card(map.game);
        cardObject.alpha = 0;

        this.cards.forEach(function(singleCard) {
            let card = GAME.getCard(singleCard);
            let cardPerTiles = {cardID:singleCard, tiles:[]};

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

                    /* Leaving a weak side open */
                    if (card.stats[neighboor.stat] < weakThreshold) {
                        if (tile != null && tile.card == null) {
                            value -= 10;
                        }
                    }

                    /* Can flip other cards */
                    /* @TODO: Should check the difference (example: Flipping a 4 with a 5 is better than with a 7 */
                    if (tile != null && tile.card != null && tile.card.owner != this.owner) {
                        cardObject.tile = singleTile;
                        cardObject.configure(singleCard);
                        let result = cardObject.compare(tile.card);
                        if (result > 0) {
                            value += 25;
                        }
                    }

                }, this);

                if (cardsValues[value] == null) {
                    cardsValues[value] = [];
                }
                cardsValues[value].push({cardID:singleCard, tile:singleTile});
                if (value > highestValue) {
                    highestValue = value;
                }
            }, this);
        }, this);

        console.log(cardsValues);
        console.log(highestValue);

        cardObject.destroy();

        return cardsValues[highestValue][map.game.rnd.integerInRange(0, cardsValues[highestValue].length-1)];
    },
    removeCard: function(cardID) {
        if (cardID == null) {
            return this.cards.shift();
        } else {
            return this.cards.splice(this.cards.indexOf(cardID), 1);
        }
    }
};
