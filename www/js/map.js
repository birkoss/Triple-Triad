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
            /*
            let block = this.createTile(gridX, gridY, "tile:grass");
            block.frame = (gridY == 0 ? 0 : 1);
            this.blocksContainer.addChild(block);

            block.inputEnabled = true;
            block.events.onInputDown.add(this.onBlockInputDown, this);
            block.events.onInputOut.add(this.onBlockInputOut, this);
            block.events.onInputUp.add(this.onBlockInputUp, this);
            */
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

    card.arrowsContainer.forEach(function(singleArrow) {
        let x = card.tile.gridX + singleArrow.direction.x;
        let y = card.tile.gridY + singleArrow.direction.y;

        if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
            let tile = this.getTileAt(x, y);
            if (tile != null && tile.card != null && tile.card.owner != card.owner) {
                let counter = false;
                tile.card.arrowsContainer.forEach(function(singleDefenderArrow) {
                    if (singleDefenderArrow.id == singleArrow.oppositeArrow) {
                        counter = true;
                    }
                }, this);
                defenders.push({tile:tile,counter:counter});
            }
        }
    }, this);

    return defenders;
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

Map.prototype.getTileAtRandom = function() {
    let tiles = this.getTilesEmpty();

    return tiles[Math.floor(Math.random() * (tiles.length-1))];
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
