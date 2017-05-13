var GAME = GAME || {};

GAME.Level = function() {};

GAME.Level.prototype = {
    create: function() {
        this.selectorContainer = this.game.add.group();
        this.popupContainer = this.game.add.group();

        this.selector = new Popup(this.game);

        this.selector.createTitle("Choose a level");

        this.createLevel();

        this.selector.generate();

        this.selectorContainer.addChild(this.selector);
    },

    createLevel() {
        let group = this.selector.getContainer("levels").group;

        let padding = 16;
        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                let isLocked = false;
                let index = (y * 3) + x;
                if (index > 1) {
                    isLocked = true;
                }
                let button = this.game.add.button(0, 0, (isLocked ? 'gui:btnLevelLocked' : 'gui:btnLevel'), this.onLevelButtonClicked, this, 1, 0, 1, 0);
                if (isLocked) {
                    button.frame = 1;
                    button.inputEnabled = false;
                }
                button.x = x * (button.width + padding)
                button.y = y * (button.height + padding);
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
    },
    onLevelButtonClicked: function(button, pointer) {
        console.log(button.level);

        let popup = new Popup(this.game);
        popup.createOverlay(0.5);
        popup.createTitle("Level " + button.level);

        popup.createCloseButton();

        let group = popup.getContainer("buttons").group;
        let buttonPlay = this.game.add.button(0, 0, "gui:btnGreen", this.onBtnPlayClicked, this, 1, 0, 1, 0);
        buttonPlay.level = button.level;
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
    }
};
