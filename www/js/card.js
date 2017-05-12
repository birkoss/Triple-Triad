function Card(game) {
    Phaser.Sprite.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.arrowsContainer = this.game.add.group();
    this.addChild(this.arrowsContainer);

    this.unitContainer = this.game.add.group();
    this.addChild(this.unitContainer);

    this.statsContainer = this.game.add.group();
    this.addChild(this.statsContainer);

    this.onCardDragStart = new Phaser.Signal();
    this.onCardDragStop = new Phaser.Signal();

    this.createCard();
};

Card.prototype = Object.create(Phaser.Sprite.prototype);
Card.prototype.constructor = Card;

Card.prototype.compare = function(otherCard) {
    console.log("COMPARE");
    console.log(otherCard);
    let diffX = otherCard.tile.gridX - this.tile.gridX;
    let diffY = otherCard.tile.gridY - this.tile.gridY;

    let attackingValue = defendingValue = 0;
    if (diffX == -1) {
        attackingValue = this.stats.left.text;
        defendingValue = otherCard.stats.right.text;
    } else if (diffX == 1) {
        attackingValue = this.stats.right.text;
        defendingValue = otherCard.stats.left.text;
    } else if (diffY == -1) {
        attackingValue = this.stats.up.text;
        defendingValue = otherCard.stats.down.text;
    } else if (diffY == 1) {
        attackingValue = this.stats.down.text;
        defendingValue = otherCard.stats.up.text;
    }

    if (attackingValue > defendingValue) {
        return 1;
    } else if (attackingValue < defendingValue) {
        return -1;
    }
 
    return 0
};

Card.prototype.configure = function(cardName) {
    GAME.json.cards.forEach(function(singleCard) {
        if (singleCard.name == cardName) {
            this.cardName = cardName;
            if (singleCard.sprite != null) {
                let unit = this.unitContainer.create(0, 0, "unit:" + singleCard.sprite);
                unit.animations.add("idle", [0, 1], 2, true);
                unit.anchor.set(0.5, 0.5);
                unit.scale.setTo(2, 2);
            }

            /* Update the stats from the card */
            for (let stat in singleCard.stats) {
                this.stats[stat].setText(singleCard.stats[stat]);
            }
        }
    }, this);
};

Card.prototype.setOwner = function(newOwner) {
    this.firstOwner = newOwner;
    this.changeOwner(newOwner);
};

Card.prototype.changeOwner = function(newOwner) {
    this.owner = newOwner;
    this.backgroundContainer.getChildAt(0).tint = (this.owner == 0 ? 0x597dcf : 0xd34549);
};

Card.prototype.createCard = function() {
    let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.anchor.set(0.5, 0.5);
    let border = this.backgroundContainer.create(0, 0, "card:border");
    border.anchor.set(0.5, 0.5);
    let frame = this.backgroundContainer.create(0, 0, "card:frame");
    frame.anchor.set(0.5, 0.5);
    //frame.x = (border.width/2);
    //frame.y = (border.height/2);

    this.stats = {};
    this.stats.left = this.game.add.bitmapText(0, 0, "font:gui", "1", 16);
    this.stats.left.anchor.set(0.5, 0.5);
    this.stats.left.x = -border.width/2 + 12;
    this.statsContainer.addChild(this.stats.left);
    this.stats.right = this.game.add.bitmapText(0, 0, "font:gui", "1", 16);
    this.stats.right.anchor.set(0.5, 0.5);
    this.stats.right.x = -border.width/2 + border.width - 12;
    this.statsContainer.addChild(this.stats.right);
    this.stats.down = this.game.add.bitmapText(0, 0, "font:gui", "1", 16);
    this.stats.down.anchor.set(0.5, 0);
    this.stats.down.y = -border.height/2 + border.height - 7 - this.stats.down.height;
    this.statsContainer.addChild(this.stats.down);
    this.stats.up = this.game.add.bitmapText(0, 0, "font:gui", "1", 16);
    this.stats.up.anchor.set(0.5, 0);
    this.stats.up.y = -border.height/2 + 6;
    this.statsContainer.addChild(this.stats.up);

    background.width = border.width - 6;
    background.height = border.height - 6;
};

Card.prototype.flip = function(callback) {
    let tweenSpeed = 300;
    let tweenScale = this.scale.x;
    tweenScale ^= 1;

    let tween = this.game.add.tween(this.scale).to({x:tweenScale}, tweenSpeed);
    if (callback != null) {
        tween.onComplete.add(function() {
            callback();
        }, this);
    }
    tween.start();
};

Card.prototype.isPlaced = function() {
    this.unitContainer.getChildAt(0).animations.play("idle");
};

Card.prototype.setInteractive = function(state, isDraggable) {
    if (isDraggable == null) {
        isDraggable = true;
    }
    if (state) {
        this.originalX = this.x;
        this.originalY = this.y;

        this.inputEnabled = true;
        if (isDraggable) {
            this.input.enableDrag();
            this.events.onDragStart.add(this.onDragStart, this);
            this.events.onDragStop.add(this.onDragStop, this);
        }
    } else {
        this.inputEnabled = false;
    }
};

/* Events */

Card.prototype.onDragStart = function(tile, pointer) {
    this.onCardDragStart.dispatch(this);
};

Card.prototype.onDragStop = function(tile, pointer) {
    this.onCardDragStop.dispatch(this, pointer);
};
