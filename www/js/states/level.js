var GAME = GAME || {};

GAME.Level = function() {};

GAME.Level.prototype = {
    create: function() {
        this.panelContainer = this.game.add.group();
        this.levelsContainer = this.game.add.group();

        this.createPanel();
    },

    createPanel() {
        let padding = 32;
        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                let index = (y * 3) + x;
                let button = this.game.add.button(0, 0, (index < 2 ? 'gui:btnLevel' : 'gui:btnLevelLocked'), null, null, 1, 0, 1, 0);
                button.x = x * (button.width + padding)
                button.y = y * (button.height + padding);
                this.levelsContainer.addChild(button);
            }
        }

        this.levelsContainer.x = (this.game.width - this.levelsContainer.width) / 2;
        this.levelsContainer.y = ((this.game.height - this.levelsContainer.height) / 2) + 25;


        let background = new Ninepatch(this.game, "ninepatch:background");
        background.resize(this.game.width - 32, 50 + (padding * 2) + this.levelsContainer.height);

        this.panelContainer.addChild(background);

        let title = new Ninepatch(this.game, "ninepatch:blue");
        title.resize(background.width, 50);

        this.panelContainer.addChild(title);

        this.panelContainer.x = (this.game.width - background.width) / 2;
        this.panelContainer.y = (this.game.height - background.height) / 2;

    }
};
