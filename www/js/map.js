function Map(game, width, height) {
    Phaser.Group.call(this, game);

    this.gridWidth = width;
    this.gridHeight = height;

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.createMap();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.createMap = function() {
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            let cell = this.game.add.tileSprite(0, 0, 94, 94, 'map:grass');
            cell.x = gridX * (cell.width+3);
            cell.y = gridY * (cell.height+3);

            cell.gridX = gridX;
            cell.gridY = gridY;

            cell.card = null;

            this.backgroundContainer.addChild(cell);
        }
    }
};

/* Helpers */

Map.prototype.createTile = function(gridX, gridY, spriteName) {
    let tile = this.game.add.sprite(0, 0, spriteName);
    tile.scale.setTo(GAME.scale.sprite, GAME.scale.sprite);
    tile.anchor.set(0.5, 0.5);
    tile.x = tile.width * gridX;
    tile.y = tile.height * gridY;

    tile.x += tile.width/2;
    tile.y += tile.height/2;

    tile.gridX = gridX;
    tile.gridY = gridY;

    return tile;
};

Map.prototype.getDefenders = function(card) {
    let defenders = new Array();

    this.getNeighboorsAt(card.tile.gridX, card.tile.gridY).forEach(function(neighboor) {
        let tile = this.getTileAt(neighboor.gridX, neighboor.gridY);
        if (tile != null && tile.card != null && tile.card.owner != card.owner) {
            let diffX = tile.gridX - card.tile.gridX;
            let diffY = tile.gridY - card.tile.gridY;

            let attackingValue = defendingValue = 0;
            if (diffX == -1) {
                attackingValue = card.stats.left.text;
                defendingValue = tile.card.stats.right.text;
            } else if (diffX == 1) {
                attackingValue = card.stats.right.text;
                defendingValue = tile.card.stats.left.text;
            } else if (diffY == -1) {
                attackingValue = card.stats.up.text;
                defendingValue = tile.card.stats.down.text;
            } else if (diffY == 1) {
                attackingValue = card.stats.down.text;
                defendingValue = tile.card.stats.up.text;
            }

            if (attackingValue > defendingValue) {
                defenders.push(tile.card);
            }
        }
    }, this);

    return defenders;
};

Map.prototype.getNeighboorsAt = function(gridX, gridY, onlyAdjacent, depth, excludeStartingPosition) {
    if (depth == undefined) { depth = 1; }
    if (onlyAdjacent == undefined) { onlyAdjacent = true; }
    if (excludeStartingPosition == undefined) { excludeStartingPosition = true; }

    let neighboors = new Array();
    for (let y=-depth; y<=depth; y++) {
        for (let x=-depth; x<=depth; x++) {
            if ((x == 0 && y == 0) && excludeStartingPosition) { continue; }
            if (onlyAdjacent && (x != 0 && y != 0)) { continue; }

            let newX = gridX + x;
            let newY = gridY + y;
            if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {
                neighboors.push({gridX:newX, gridY:newY});
            }
        }
    }
    return neighboors;
};

Map.prototype.getTileAt = function(gridX, gridY) {
    let wantedTile = null;

    this.backgroundContainer.forEach(function(tile) {
        if (tile.gridX == gridX && tile.gridY == gridY) {
            wantedTile = tile;
        }
    }, this);

    return wantedTile;
};

Map.prototype.getTilesEmpty = function() {
    let tiles = new Array();

    this.backgroundContainer.forEach(function(tile) {
        if (tile.card == null) {
            tiles.push(tile);
        }
    }, this);

    return tiles;
};

Map.prototype.getTileAtWorldPosition = function(worldX, worldY) {
    let tile = null;

    this.backgroundContainer.forEach(function(singleTile) {
        /* Stop if the tile already have a card */
        if (singleTile.card != null) {
            return;
        }
        if (worldX >= singleTile.worldPosition.x && worldX <= singleTile.worldPosition.x + singleTile.width && worldY >= singleTile.worldPosition.y && worldY <= singleTile.worldPosition.y + singleTile.height) {
        tile = singleTile;
        }
    }, this);

    return tile;
};

/* Get all NEW cards owned by toOwner */
Map.prototype.getCardsTradable = function(toOwner) {
    let cards = new Array();
    this.backgroundContainer.forEach(function(singleTile) {
        if (singleTile.card.owner == toOwner && singleTile.card.owner.firstOwner != toOwner) {
            cards[] = singleTile.card;
        }
    }, this);
    return cards;
};

Map.prototype.getWinner = function() {
    let totalTiles = [0, 0];
    this.backgroundContainer.forEach(function(singleTile) {
        totalTiles[singleTile.card.owner]++;
    }, this);
    return (totalTiles[0] > totalTiles[1] ? 0 : 1);
};
