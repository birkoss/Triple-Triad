var GAME = GAME || {};

GAME.Level = function() {};

GAME.Level.prototype = {
    create: function() {
        this.panelContainer = this.game.add.group();
        this.selectorContainer = this.game.add.group();
        this.popupContainer = this.game.add.group();

        this.selector = new Popup(this.game);

        this.selector.createTitle("Choose a level");

        this.page = 0;
        this.limit = 9;
        this.createLevel();

        this.selector.generate();

        this.selectorContainer.addChild(this.selector);

        this.createPanel();
    },

    createLevel() {
        let group = this.selector.getContainer("levels").group;
        group.removeAll();

        let padding = 16;
        for (let y=0; y<4; y++) {
            for (let x=0; x<3; x++) {
                let isLocked = false;
                let index = ((y * 3) + x) + (this.page * this.limit);
                let levelID = "level" + (index+1);

                if (index < GAME.json['levels'].length) {
                    if (GAME.config.levels.indexOf(levelID) == -1) {
                        isLocked = true;
                    }
                    let button = this.game.add.button(0, 0, (isLocked ? 'gui:btnLevelLocked' : 'gui:btnLevel'), this.onLevelButtonClicked, this, 1, 0, 1, 0);
                    if (isLocked) {
                        button.frame = 1;
                        button.inputEnabled = false;
                    }
                    button.x = x * (button.width + (padding/2)) + padding*3;
                    button.y = y * (button.height + (padding/2));
                    group.addChild(button);

                    let label = this.game.add.bitmapText(0, 0, "font:gui", (index+1), 16);
                    if (isLocked) {
                        label.tint = 0xcccccc;
                        label.y = 2;
                    }
                    label.anchor.set(0.5, 0.5);
                    label.x += button.width/2;
                    label.y += button.height/2 - 2;
                    button.addChild(label);
                    button.levelID = levelID;
                }
            }
        }

        let background = group.create(0, 0, "tile:blank");
        background.width = group.width + (padding * 3);
        background.height = group.height;
        background.alpha = 0;

        /* Create navigation button */
        let canGoBack = (this.page == 0 ? false : true);
        let button = this.game.add.button(0, 0, "gui:btnChangePage", this.onBtnChangePageClicked, this, 0, 0, 0, 0);
        button.anchor.set(0, 0.5);
        button.x = 0;
        button.y = group.height/2;
        button.direction = -1;
        if (!canGoBack) {
            button.frame = 1;
            button.inputEnabled = false;
        }
        let buttonIcon = group.create(0, 0, "icon:changePage");
        buttonIcon.anchor.set(0.5, 0.5);
        buttonIcon.x = button.width/2;
        buttonIcon.y = 0;
        buttonIcon.angle = 90;
        button.addChild(buttonIcon);
        group.addChild(button);

        let canGoFoward = (GAME.json['levels'].length < (this.page * this.limit) + 12 ? false : true);
        button = this.game.add.button(0, 0, "gui:btnChangePage", this.onBtnChangePageClicked, this, 0, 0, 0, 0);
        button.direction = 1;
        button.anchor.set(1, 0.5);
        button.x = group.width;
        button.y = group.height/2;
        if (!canGoFoward) {
            button.frame = 1;
            button.inputEnabled = false;
        }

        buttonIcon = group.create(0, 0, "icon:changePage");
        buttonIcon.anchor.set(0.5, 0.5);
        buttonIcon.x = -button.width/2;
        buttonIcon.y = 0;
        buttonIcon.angle = 270;
        button.addChild(buttonIcon);

        group.addChild(button);
    },
    createPanel: function() {
        let background = new Ninepatch(this.game, 'ninepatch:background');
        this.panelContainer.addChild(background);

        let button = this.game.add.button(0, 16, "gui:btnRed", this.onChangeDeckClicked, this, 1, 0, 1, 0);
        button.x = this.game.width - button.width/2 - 16;
        this.panelContainer.addChild(button);

        background.resize(this.game.width, button.height/2 + 32);

        let label = this.game.add.bitmapText(0, 0, "font:gui", "Deck", 16);
        label.anchor.set(0.5, 0.5);
        label.x += button.width/2;
        label.y += button.height/2 - 2;
        button.addChild(label);
        button.scale.setTo(0.5, 0.5);
    },
    onLevelButtonClicked: function(button, pointer) {
        let levelID = button.levelID;
        let level = GAME.getLevel(levelID);

        let popup = new Popup(this.game);
        popup.createOverlay(0.5);
        popup.createTitle("Level " + levelID);

        popup.createCloseButton();

        let description = popup.getContainer("description").group;
        let descriptionText = this.game.add.bitmapText(0, 0, "font:gui", "This is the deck of your enemy", 16);
        descriptionText.tint = 0x959595;
        descriptionText.maxWidth = popup.maxWidth - popup.padding;
        description.addChild(descriptionText);
        
        let listViewContainer = popup.getContainer("listView").group;
        let listViewBackground = new Ninepatch(this.game, "ninepatch:blue");
        listViewContainer.addChild(listViewBackground);

        listViewBackground.resize(popup.maxWidth - (popup.padding*2), 150);


        level.cards.forEach(function(cardID) {
            let g = this.game.add.group()
            let sprite = g.create(0, 0, "tile:blank");
            sprite.width = 240;
            sprite.height = 100;
            sprite.alpha = 0;

            let c = new Card(this.game);
            c.configure(cardID);
            c.setOwner(1);
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

        let group = popup.getContainer("buttons").group;
        let buttonPlay = this.game.add.button(0, 0, "gui:btnGreen", this.onBtnPlayClicked, this, 1, 0, 1, 0);
        buttonPlay.levelID = levelID;
        let textPlay = this.game.add.bitmapText(0, 0, "font:gui", "Fight", 16);
        textPlay.anchor.set(0.5, 0.5);
        textPlay.x += buttonPlay.width/2;
        textPlay.y += buttonPlay.height/2;
        buttonPlay.addChild(textPlay);
        group.addChild(buttonPlay);

        popup.generate();

        this.popupContainer.addChild(popup);
    },
    onBtnPlayClicked: function(button, pointer) {
        GAME.config.levelID = button.levelID;
        this.state.start("Game");
    },
    onBtnChangePageClicked: function(button, pointer) {
        this.page += button.direction;

        this.createLevel();
    },
    onChangeDeckClicked: function() {
        let manager = new DeckManager(this.game);
        manager.generate();
    }
};
