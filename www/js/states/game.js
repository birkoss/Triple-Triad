var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.mapContainer = this.game.add.group();
        this.enemyCardsContainer = this.game.add.group();
        this.cardsContainer = this.game.add.group();
        this.clickBlockerContainer = this.game.add.group();

        this.rules = {
            "trade": "one",
            "game": {
                "open": false
            }
        };

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
        this.rules.game.open = true;
        if (this.rules.game.open) {
            for (let i=0; i<this.players[1].cards.length; i++) {
                let card = this.createCard(this.players[1].cards[i], 1, i);
                card.setInteractive(true);
                card.events.onInputDown.add(this.onDragEnemyStart, this);
                card.events.onInputUp.add(this.onDragEnemyStop, this);
                this.enemyCardsContainer.addChild(card);
            }

            this.enemyCardsContainer.x = this.mapContainer.x;
            this.enemyCardsContainer.y = this.mapContainer.y;
            this.mapContainer.y = (this.game.height - this.mapContainer.height) / 2;
        }

        for (let i=0; i<this.players[0].cards.length; i++) {
            let card = this.createCard(this.players[0].cards[i], 0, i);
            card.setInteractive(true);
            card.onCardDragStart.add(this.onDragStart, this);
            card.onCardDragStop.add(this.onDragStop, this);
            this.cardsContainer.addChild(card);
        }

        this.cardsContainer.y = (this.mapContainer.y*2) + this.mapContainer.height;
        if (this.enemyCardsContainer.height > 0) {
            this.cardsContainer.y = this.game.height - 50 - this.enemyCardsContainer.y;
        }
        this.cardsContainer.x = this.mapContainer.x;
    },
    createCard: function(cardID, owner, index) {
        let card = new Card(this.game);
        let cardSize = card.backgroundContainer.width;
        if (this.rules.game.open) {
            cardSize /= 2;
        }
        card.configure(cardID);
        card.x = index * ((this.mapContainer.width-cardSize)/(4));
        card.x += cardSize/2;
        if (this.rules.game.open) {
            card.scale.set(0.5, 0.5);
        }
        if (index % 2 == 1 && !this.rules.game.open) {
            card.y += cardSize/2;
        }
        card.y += cardSize/2;
        card.setOwner(owner);

        return card;
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

        let player = new Player(0, "human");
        for (let i=0; i<GAME.config.deck.length; i++) {
            player.addCard(GAME.config.deck[i]);
        }
        this.players.push(player);

        /* Enemy */
        let currentLevel = GAME.config.levelID;
        GAME.json['levels'].forEach(function(singleLevel) {
            if (singleLevel.id == currentLevel) {
                let cards = Phaser.ArrayUtils.shuffle(singleLevel.cards.slice(0));
                let enemy = new Player(1, "AI");
                //enemy.addCard("Skeleton");
                for (let i=0; i<Math.min(player.cards.length, cards.length); i++) {
                    enemy.addCard(cards[i]);
                }
                this.players.push(enemy);

                /* Apply the enemy rules */
                if (singleLevel.rules != undefined ) {
                    this.rules.trade = singleLevel.rules.trade;
                    for (let i=0; i<singleLevel.rules.game.length; i++) {
                        this.rules.game[singleLevel.rules.game[i]] = true;
                    }
                }
            }
        }, this);

        /* Pick a random starting player */
        /* @TODO: Show the starting player */
        this.currentPlayer = this.game.rnd.between(0, 1);
    },

    resolveCombat: function(card, defender) {
        console.log("resolveCombat...");

        var self = this;
        defender.tile.card.flip(function() {
            defender.tile.card.changeOwner(card.owner);
            defender.tile.card.flip(function() {
                //@TODO: combo this.turnCardPlaced(defender.tile.card);
                self.remainingDefenders--;
                if (self.remainingDefenders <= 0) {
                    self.turnEnd();
                }
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
                /* Get the best possible position to move */
                let bestPosition = this.players[this.currentPlayer].placeCard(this.map);
                let tile = bestPosition.tile;
                let cardID = this.players[this.currentPlayer].removeCard(bestPosition.cardID);
                console.log(cardID + " from the enemy");
                console.log(this.enemyCardsContainer);
                console.log(this.players[1]);
                console.log("------------------");

                /* If the game is OPEN, use the existing card instance of the enemy */
                if (this.rules.game.open) {
                    let card = null;
                    this.enemyCardsContainer.forEach(function(singleCard) {
                        if (singleCard.cardID == cardID) {
                            card = singleCard;
                        }
                    }, this);

                    card.scale.set(1, 1);
                    let newX = tile.width/2 + tile.worldPosition.x;
                    let newY = tile.height/2 + tile.worldPosition.y;
                    let tween = this.game.add.tween(card).to({x:newX, y:newY}, 300);
                    tween.onComplete.add(function() {
                        this.addCardToTile(card, tile);
                    }, this);
                    tween.start();
                } else {
                    /* If the game is not OPEN, create a new card instance */
                    let card = new Card(this.game);
                    card.configure(cardID);
                    card.scale.set(0, 1);
                    this.addCardToTile(card, tile);
                }
            }, this);
        }
    },
    turnCardPlaced: function(card) {
        this.clickBlocker.inputEnabled = true;

        let defenders = this.map.getDefenders(card);

        if (defenders.length == 0) {
            this.turnEnd();
        } else {
            /* @TODO: Fix a bug where if MULTIPLE cards are turned, the turn ended is triggered after EACH cards */
            this.remainingDefenders = defenders.length;
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
            this.showEndPopup(winnerPlayer, cards);
            console.log("@TODO: Winner: " + winnerPlayer);
            console.log(cards);
        }
    },
    showEndPopup: function(winnerID, cards) {
        let popup = new Popup(this.game);
        popup.createTitle(winnerID == 0 ? "You win" : "You lose");

        let description = popup.getContainer("description").group;
        let descriptionText = this.game.add.bitmapText(0, 0, "font:gui", (winnerID == "0" ? "Choose a card to keep" : "This is the card the enemy kept"), 16);
        descriptionText.tint = 0x959595;
        descriptionText.maxWidth = popup.maxWidth - popup.padding;
        description.addChild(descriptionText);

        let listViewContainer = popup.getContainer("listView").group;
        let listViewBackground = new Ninepatch(this.game, "ninepatch:blue");
        listViewContainer.addChild(listViewBackground);

        listViewBackground.resize(popup.maxWidth - (popup.padding*2), 150);

        let highestStrength = 0;
        let bestCard = null;
        cards.forEach(function(cardID) {
            let cardInfo = GAME.getCard(cardID);
            /* Find the best card for the enemy to pick */
            if (cardInfo.strength > highestStrength) {
                bestCard = cardID;
                highestStrength = cardInfo.strength;
            }
            
            let g = this.game.add.group()
            let sprite = g.create(0, 0, "tile:blank");
            sprite.width = 240;
            sprite.height = 100;
            sprite.alpha = 0;

            let c = new Card(this.game);
            c.configure(cardID);
            c.setOwner(winnerID);
            c.x += 50;
            c.y += 50;
            g.addChild(c);

            let qtyLabel = this.game.add.bitmapText(0, 0, "font:gui", "Qty:" + (GAME.config.cards[cardID] == null ? 0 : GAME.config.cards[cardID]), 16);
            qtyLabel.anchor.set(0, 0.5);
            qtyLabel.y = g.height/2;
            qtyLabel.x = ((100 - qtyLabel.width) / 2) + 105;
            
            g.addChild(qtyLabel);
            
            popup.listViewItems.push(g);
        }, this);

        if (winnerID == 0) {
            popup.listViewItems[0].getChildAt(0).alpha = 0.5;
            for (let i=0; i<popup.listViewItems.length; i++) {
                popup.listViewItems[i].getChildAt(0).inputEnabled = true;
                popup.listViewItems[i].getChildAt(0).events.onInputUp.add(this.onWinnerCardPicked, this);
            }
        } else {
            /* The enemy pick a card, and it's removed from your deck */
            if (GAME.config.cards[bestCard] != null) {
                for (let i=0; i<popup.listViewItems.length; i++) {
                    popup.listViewItems[i].getChildAt(0).alpha = 0.5;
                }
                let qty = GAME.config.cards[bestCard];
                if (qty > 1 || GAME.config.starterDecl.indexOf(bestCard)) {
                    GAME.config.cards[bestCard]--;
                    GAME.save();
                }
            }
        }
        
        if (winnerID == 0) {
            let levelNumber = parseInt(GAME.config.levelID.substr(5));
            let newLevel = "level" + (levelNumber+1);

            if (GAME.config.levels.indexOf(newLevel) == -1) {
                /* @TODO: Should show it in the popup! */
                /* @TODO: Instead of unlocking, should save it (and change page if needed, and unlock it from the level selection state */
                GAME.config.levels.push(newLevel);
                GAME.save();
            }
            popup.addButton("Choose", this.onBtnChooseCardClicked, this, "gui:btnYellow");
        } else {
            popup.addButton("Retry", this.onBtnRetryClicked, this, "gui:btnYellow");
        }

        popup.generate();

        this.popup = popup;
    },

    onDragStart: function(card) {
        if (this.rules.game.open) {
            card.scale.set(1, 1);
        }
        this.cardsContainer.bringToTop(card);
    },
    onDragEnemyStart: function(card) {
        if (this.rules.game.open) {
            card.scale.set(1, 1);
        }
        this.enemyCardsContainer.bringToTop(card);
    },
    onDragStop: function(card, pointer) {
        let cursor = {x:pointer.worldX, y:pointer.worldY};

        let tile = this.map.getTileAtWorldPosition(cursor.x, cursor.y);
        if (tile == null) {
            card.x = card.originalX;
            card.y = card.originalY;

            if (this.rules.game.open) {
                card.scale.set(0.5, 0.5);
            }
        } else {
            card.setInteractive(false);
            this.addCardToTile(card, tile);
        }
    },
    onDragEnemyStop: function(card, pointer) {
        card.x = card.originalX;
        card.y = card.originalY;
        if (this.rules.game.open) {
            card.scale.set(0.5, 0.5);
        }
    },
    onBtnRetryClicked: function(button, pointer) {
        this.state.restart();
    },
    onBtnChooseCardClicked: function(button, pointer) {
        let group = this.popup.getContainer("listView").group.getChildAt(1);

        for (let i=0; i<group.children.length; i++) {
            if (group.getChildAt(i).getChildAt(0).alpha > 0) {
                let cardID = group.getChildAt(i).getChildAt(1).cardID;
                if (GAME.config.cards[cardID] == undefined) {
                    GAME.config.cards[cardID] = 0;
                }

                GAME.config.cards[cardID] ++;
                GAME.save();
            }
        }
        this.state.start("Level");
    },
    onWinnerCardPicked: function(card, pointer) {
        let container = card.parent.parent;
        for (let i=0; i<container.children.length; i++) {
            container.children[i].getChildAt(0).alpha = 0;
        }
        card.alpha = 0.5;
    }
};
