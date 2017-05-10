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
        for (let i=0; i<this.players[0].cards.length; i++) {
            let card = new Card(this.game);
            let cardSize = card.backgroundContainer.width;
            card.configure(this.players[0].cards[i]);
            card.x = i * ((this.mapContainer.width-cardSize)/(this.players[0].cards.length-1));
            card.x += cardSize/2;
            if (i % 2 == 1) {
                card.y += cardSize/2;
            }
            card.y += cardSize/2;
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
        for (let i=0; i<GAME.config.deck.length; i++) {
            player.addCard(GAME.config.deck[i]);
        }
        this.players.push(player);

        /* Enemy */
        let currentLevel = "level1";
        GAME.json['enemies'].forEach(function(singleEnemy) {
            if (singleEnemy.id == currentLevel) {
                let cards = Phaser.ArrayUtils.shuffle(singleEnemy.decks.slice(0));
                let enemy = new Player("AI");
                for (let i=0; i<Math.min(player.cards.length, cards.length); i++) {
                    enemy.addCard(cards[i]);
                }
                this.players.push(enemy);
            }
        }, this);


        this.currentPlayer = 0;
    },

    resolveCombat: function(card, defender) {
        console.log("resolveCombat...");

        var self = this;
        defender.tile.card.flip(function() {
            defender.tile.card.changeOwner(card.owner);
            defender.tile.card.flip(function() {
                //@TODO: combo this.turnCardPlaced(defender.tile.card);
                self.turnEnd();
            });
        });
    },

    addCardToTile: function(card, tile) {
        card.isPlaced();
        card.setOwner(this.currentPlayer);
        tile.card = card;
        card.tile = tile;
        tile.addChild(card);
        card.x = card.y = tile.width/2;

        console.log(card.scale);
        if (card.scale.x == 0) {
            var self = this;
            card.flip(function() {
                self.turnCardPlaced(card);
            });
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
            let winnerPlayer = this.map.getWinner();
            let cards = this.map.getCardsTradable(winnerPlayer);
            console.log("@TODO: Winner: " + winnerPlayer);
            console.log(cards);
        }
    },

    onDragStart: function(card) {
        this.cardsContainer.bringToTop(card);
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
