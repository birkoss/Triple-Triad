var GAME = GAME || {};

GAME.Level = function() {};

GAME.Level.prototype = {
    create: function() {
        this.panelContainer = this.game.add.group();
        this.levelsContainer = this.game.add.group();

        this.createPanel();
    },

    createPanel() {
        let padding = 16;
        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                let isLocked = false;
                let index = (y * 3) + x;
                if (index > 1) {
                    isLocked = true;
                }
                let button = this.game.add.button(0, 0, (isLocked ? 'gui:btnLevelLocked' : 'gui:btnLevel'), null, null, 1, 0, 1, 0);
                if (isLocked) {
                    button.frame = 1;
                    button.inputEnabled = false;
                }
                button.x = x * (button.width + padding)
                button.y = y * (button.height + padding);
                this.levelsContainer.addChild(button);

                let label = this.game.add.bitmapText(0, 0, "font:gui", (index+1), 16);
                if (isLocked) {
                    label.tint = 0xcccccc;
                    label.y = 2;
                }
                label.anchor.set(0.5, 0.5);
                label.x += button.width/2;
                label.y += button.height/2 - 2;
                button.addChild(label);
            }
        }

        this.levelsContainer.x = (this.game.width - this.levelsContainer.width) / 2;
        this.levelsContainer.y = ((this.game.height - this.levelsContainer.height) / 2) + 25;


        let background = new Ninepatch(this.game, "ninepatch:background");
        background.resize(this.game.width - (40), 50 + (padding * 2) + this.levelsContainer.height);

        this.panelContainer.addChild(background);

        let title = new Ninepatch(this.game, "ninepatch:blue");
        title.resize(background.width, 50);

        this.panelContainer.addChild(title);

        this.panelContainer.x = (this.game.width - background.width) / 2;
        this.panelContainer.y = (this.game.height - background.height) / 2;

        let btnClose = this.panelContainer.create(0, 0, "gui:btnClose");
        btnClose.x = this.panelContainer.width - btnClose.width/2;
        btnClose.y -= btnClose.height/2;
        let iconClose = this.panelContainer.create(0, 0, "icon:close");
        iconClose.anchor.set(0.5, 0.5);
        iconClose.x = btnClose.width/2;
        iconClose.y = btnClose.height/2;
        btnClose.addChild(iconClose);


    }
};
