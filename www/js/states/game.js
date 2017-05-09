var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.mapContainer = this.game.add.group();
        this.cardsContainer = this.game.add.group();
        this.clickBlockerContainer = this.game.add.group();

        this.players = [{'type':'human'}, {'type':'human'}];
        this.currentPlayer = 0;

        this.createMap();

        this.createCards();

        this.clickBlocker = this.clickBlockerContainer.create(0, 0, "tile:blank");
        this.clickBlocker.width = this.game.width;
        this.clickBlocker.height = this.game.height;
        this.clickBlocker.alpha = 0;
        this.clickBlocker.inputEnabled = true;


        this.turnStart();
    },

    /* Misc methods */
    createCards: function() {
        for (let i=0; i<5; i++) {
            let card = new Card(this.game);
            /* @TODO: Fix the position */
            card.configure('Dodo');
            card.x = i * (58);
            card.setInteractive(true);
            card.setOwner(this.currentPlayer);
            card.onCardDragStart.add(this.onDragStart, this);
            card.onCardDragStop.add(this.onDragStop, this);
            this.cardsContainer.addChild(card);
        }

        this.cardsContainer.y = (this.mapContainer.y*2) + this.mapContainer.height;
        this.cardsContainer.x = this.mapContainer.x;
    },

    createMap: function() {
        this.map = new Map(this.game, 3, 3);

        let background = this.mapContainer.create(0, 0, "tile:blank");
        background.tint = 0x363636;
        background.width = (this.map.gridWidth * 97) + 3;
        background.height = (this.map.gridHeight * 97) + 3;
        this.mapContainer.addChild(this.map);

        this.map.x = (this.mapContainer.width - this.map.width)/2;
        this.map.y = (this.mapContainer.height - this.map.height)/2;
        this.mapContainer.x = (this.game.width - this.mapContainer.width)/2;
        this.mapContainer.y = this.mapContainer.x;
    },

    resolveCombat: function(card, defender) {
        let win = true;

        if (defender.counter) {
        }

        if (win) {
            defender.tile.card.setOwner(card.owner);
            this.turnCardPlaced(defender.tile.card);
        } else {
            card.setOwner(defender.tile.card.owner);
            /* @TODO: Not sure it's safe, or it we SHOULD reparse when losing, should verify ... */
            this.turnCardPlaced(card);
        }
    },

    turnStart: function() {
        console.log(this.currentPlayer);
        if (this.players[this.currentPlayer].type == "human") {
            this.clickBlocker.inputEnabled = false;
        } else {

        }
    },
    turnCardPlaced: function(card) {
        this.clickBlocker.inputEnabled = true;

        let defenders = this.map.getDefenders(card);

        if (defenders.length == 0) {
            this.turnEnd();
        } else if (defenders.length == 1) {
            this.resolveCombat(card, defenders[0]);
        } else {
            console.log(defenders);
        }
    },
    turnEnd: function() {
        this.currentPlayer ^= 1;

        this.turnStart();
    },

    onDragStart: function(card) {
        console.log(card);
        this.cardsContainer.swap(card, this.cardsContainer.getChildAt(this.cardsContainer.children.length - 1));
    },
    onDragStop: function(card, pointer) {
        let cursor = {x:pointer.worldX, y:pointer.worldY};

        let tile = this.map.getTileAtWorldPosition(cursor.x, cursor.y);
        if (tile == null) {
            console.log("NOP: " + card.x + "x" + card.y + " from " + card.originalX + "x" + card.originalY);
            card.x = card.originalX;
            card.y = card.originalY;
        } else {
            card.setInteractive(false);
            /* @TODO Ugly hack, should be removed.... */
            card.setOwner(this.currentPlayer);
            tile.card = card;
            card.tile = tile;
            tile.addChild(card);
            card.x = card.y = -3;

            this.turnCardPlaced(card);
        }
    }
};
