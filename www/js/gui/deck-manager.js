function DeckManager(game) {
    Phaser.Group.call(this, game);

    this.popup = null;
}

DeckManager.prototype = Object.create(Phaser.Group.prototype);
DeckManager.prototype.constructor = DeckManager;

DeckManager.prototype.selectCard = function(cardID) {
    let deckContainer = this.popup.getContainer("deck").group;

    /* Pick the first free position */
    let position = -1;
    for (let i=0; i<5; i++) {
        if (deckContainer.getChildAt(i).children.length == 1) {
            position = i;
            break;
        }
    }

    /* If a position is free */
    if (position >= 0) {
        let card = new Card(this.game);
        card.configure(cardID);
        card.scale.setTo(0.5, 0.5);
        card.setOwner(0);
        deckContainer.getChildAt(position).addChild(card);
        card.x += 25;
        card.y += 25;

        card.inputEnabled = true;
        card.events.onInputUp.add(this.removeFromDeck, this);
    }
};

DeckManager.prototype.generate = function() {
    this.popup = new Popup(this.game);
    this.popup.maxWidth = this.game.width - 16;
    this.popup.createTitle("Your deck");

    let deckContainer = this.popup.getContainer("deck").group;
    for (let i=0; i<5; i++) {
        let singleGroup = this.game.add.group();
        deckContainer.add(singleGroup);

        let background = singleGroup.create(0, 0, "card:background");
        background.alpha = 0.2;
        background.width = 50;
        background.height = 50;

        if (GAME.config.deck.length > i) {
            this.selectCard(GAME.config.deck[i]);
        }
        singleGroup.x = i* 55;
    }

    let listViewContainer = this.popup.getContainer("listView").group;
    let listViewBackground = new Ninepatch(this.game, "ninepatch:blue");
    listViewContainer.addChild(listViewBackground);

    listViewBackground.resize(248, 250);

    let maxCols = 4;

    for (let i=0; i<Math.ceil(GAME.json.cards.length/maxCols); i++) {
        let g = this.game.add.group();

        let sprite = g.create(0, 0, "tile:blank");
        sprite.col = i;
        sprite.width = 215;
        sprite.height = 50;
        sprite.alpha = 0;

        sprite.inputEnabled = true;
        sprite.events.onInputUp.add(this.onCardSelected, this);

        g.addChild(sprite);

        for (let c=0; c<maxCols; c++) {
            let index = (i + c);
            if (index < GAME.json.cards.length) {
                let card = new Card(this.game);
                card.configure(GAME.json.cards[index].id);
                card.setOwner(1);
                card.scale.set(0.5, 0.5);
                card.x += 25;
                card.y += 25;

                card.x += (c * 55);

                g.addChild(card);
            }
        }

        this.popup.listViewItems.push(g);
    }

    this.popup.addButton("Ok", this.onBtnChooseCardClicked, this, "gui:btnYellow");

    this.popup.generate();
};

DeckManager.prototype.removeFromDeck = function(card, pointer) {
    card.destroy();
};

DeckManager.prototype.onCardSelected = function(background, pointer) {
    let index = (background.col * 4);
    let container = this.popup.getContainer("listView").group;
    let clickX = pointer.x - container.x - 25;
    let tile = Math.floor(clickX / 55);

    if (index + tile < this.popup.listViewItems.length) {
        console.log(this.popup.listViewItems[background.col].getChildAt(1 + tile).cardID);
        this.selectCard(this.popup.listViewItems[background.col].getChildAt(1 + tile).cardID);
    }
};
