var GAME = GAME || {};

GAME.Level = function() {};

GAME.Level.prototype = {
    create: function() {
        this.selectorContainer = this.game.add.group();
        this.popupContainer = this.game.add.group();

        this.selector = new Popup(this.game);

        this.selector.createTitle("Choose a level");

        this.page = 0;
        this.limit = 9;
        this.createLevel();

        this.selector.generate();

        this.selectorContainer.addChild(this.selector);

    },

    createLevel() {
        let group = this.selector.getContainer("levels").group;
        group.removeAll();

        let padding = 16;
        for (let y=0; y<4; y++) {
            for (let x=0; x<3; x++) {
                let isLocked = false;
                let index = ((y * 3) + x) + (this.page * this.limit);

                if (index < GAME.json['levels'].length) {
                    if (GAME.config.levels.indexOf("level" + (index+1)) == -1) {
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
                    button.level = index;
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
    onLevelButtonClicked: function(button, pointer) {
        let levelID = "level1";
        let level = GAME.getLevel(levelID);

        let popup = new Popup(this.game);
        popup.createOverlay(0.5);
        popup.createTitle("Level " + button.level);

        popup.createCloseButton();

        //popup.getContainer("cards").outside = true;
        popup.getContainer("cards").paddingTop = 43;
        popup.getContainer("cards").paddingBottom = 0;//12;
        let cards = popup.getContainer("cards").group;
        let cardIndex = 0;
        level.cards.forEach(function(cardName) {
            let cardY = Math.floor(cardIndex / 3);
            let cardX = cardIndex - (cardY * 3);
            let c = new Card(this.game);
            c.x = cardX * (58 + 16);
            c.y = cardY * (54 + 16);
            if (cardY == 1) {
                c.x += 36;
            }
            c.x -= 6;
            c.configure(cardName);
            //c.scale.setTo(0.5, 0.5);
            c.setOwner(1);
            c.preview();
            cards.addChild(c);

            cardIndex++;
        }, this);
        popup.getContainer("cards").x = ((this.game.width - cards.width) /2);

        let group = popup.getContainer("buttons").group;
        let buttonPlay = this.game.add.button(0, 0, "gui:btnGreen", this.onBtnPlayClicked, this, 1, 0, 1, 0);
        buttonPlay.level = levelID;
        let textPlay = this.game.add.bitmapText(0, 0, "font:gui", "Play", 16);
        textPlay.anchor.set(0.5, 0.5);
        textPlay.x += buttonPlay.width/2;
        textPlay.y += buttonPlay.height/2;
        buttonPlay.addChild(textPlay);
        group.addChild(buttonPlay);

        popup.generate();

        this.popupContainer.addChild(popup);
    },
    onBtnPlayClicked: function(button, pointer) {
        this.state.start("Game");
    },
    onBtnChangePageClicked: function(button, pointer) {
        this.page += button.direction;

        this.createLevel();
    }
};
