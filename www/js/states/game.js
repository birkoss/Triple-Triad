var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.mapContainer = this.game.add.group();
        this.cardsContainer = this.game.add.group();
        this.clickBlockerContainer = this.game.add.group();

        this.createPlayers();

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
            card.configure(this.players[0].cards[i]);
            card.x = i * (58);
            //card.x += card.width/2;
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
    createPlayers: function() {
        this.players = new Array();

        let player = new Player("human");
        player.addCard("Dodo");
        player.addCard("Tonberry");
        player.addCard("Dodo");
        player.addCard("Dodo");
        player.addCard("Dodo");
        this.players.push(player);

        let enemy = new Player("AI");
        enemy.addCard("Dodo");
        enemy.addCard("Tonberry");
        enemy.addCard("Dodo");
        enemy.addCard("Dodo");
        enemy.addCard("Dodo");
        this.players.push(enemy);

        this.currentPlayer = 0;
    },

    resolveCombat: function(card, defender) {
        console.log("resolveCombat...");

        let tween = this.game.add.tween(defender.tile.card.scale).to({x:0, y:1}, 300);
        tween.onComplete.add(function() {
            defender.tile.card.setOwner(card.owner);
            let tween = this.game.add.tween(defender.tile.card.scale).to({x:1, y:1}, 300);
            tween.onComplete.add(function() {
                //@TODO: combo this.turnCardPlaced(defender.tile.card);
                this.turnEnd();
            }, this);
            tween.start();
        }, this);
        tween.start();
    },

    addCardToTile: function(card, tile) {
        card.setOwner(this.currentPlayer);
        tile.card = card;
        card.tile = tile;
        tile.addChild(card);
        card.x = card.y = tile.width/2;

        console.log(card.scale);
        if (card.scale.x == 0) {
            let tween = this.game.add.tween(card.scale).to({x:1, y:1}, 300);
            tween.onComplete.add(function() {
                this.turnCardPlaced(card);
            }, this);
            tween.start();
        } else {
            this.turnCardPlaced(card);
        }
    },

    turnStart: function() {
        if (this.players[this.currentPlayer].type == "human") {
            this.clickBlocker.inputEnabled = false;
        } else {
            this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
                let tile = this.players[this.currentPlayer].placeCard(this.map);

                let card = new Card(this.game);
                card.configure(this.players[this.currentPlayer].removeCard());

                card.scale.set(0, 1);
                this.addCardToTile(card, tile);
            }, this);
        }
    },
    turnCardPlaced: function(card) {
        this.clickBlocker.inputEnabled = true;

        let defenders = this.map.getDefenders(card);
        console.log("turnCardPlaced...");
        console.log(defenders);

        if (defenders.length == 0) {
            this.turnEnd();
        } else {
            for (let i=0; i<defenders.length; i++) {
                this.resolveCombat(card, defenders[i]);
            }
        }
    },
    turnEnd: function() {
        if (this.map.getTilesEmpty().length > 0) {
            this.currentPlayer ^= 1;

            this.turnStart();
        } else {
            console.log("@TODO: Pick the winner");
        }
    },

    onDragStart: function(card) {
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
            this.addCardToTile(card, tile);
        }
    }
};
