var GAME = GAME || {};

GAME.Main = function() {};

GAME.Main.prototype = {
    create: function() {
        this.mapContainer = this.game.add.group();
        this.buttonsContainer = this.game.add.group();

        this.panelContainer = this.game.add.group();

        this.createMap();

        this.createPanel();

        this.createButtonPlay();
    },
    update: function() {
    },

    /* Misc methods */

    createButton: function(buttonLabel, callback) {
        let button = this.game.add.button(0, 0, 'btn:large', callback, this, 1, 0, 1, 0);
        button.x = (this.game.width - button.width)/2;

        button.y = (this.game.height) - (button.height);
        button.originalY = button.y;
        button.y = this.game.height;

        let label = this.game.add.bitmapText(0, 0, "font:gui", buttonLabel, 20);
        label.anchor.set(0.5, 0.5);
        label.x = button.width/2;
        label.y = button.height/2;
        button.addChild(label);

        this.buttonsContainer.addChild(button);

        return button;
    },
    createButtonPlay: function() {
        let button = this.createButton("GO", this.onBtnPlayClicked);
        this.showButton(button);
    },
    createCoins: function(container) {
        this.coinsIcon = container.create(0, 0, "tile:coins");
        this.coinsIcon.scale.setTo(GAME.scale.normal + 1, GAME.scale.normal + 1);
        this.coinsIcon.anchor.set(1, 0.5);
        this.coinsIcon.x = 0;
        this.coinsIcon.y = this.coinsIcon.height/2;

        let label = this.game.add.bitmapText(0, 0, "font:gui", "x", 20);
        label.anchor.set(1, 0.5);
        label.x = this.coinsIcon.x - this.coinsIcon.width - 4;
        label.y = this.coinsIcon.height/2;
        label.y--;
        container.addChild(label);

        this.coinsLabel = this.game.add.bitmapText(0, 0, "font:gui", GAME.config.coins, 20);
        this.coinsLabel.anchor.set(1, 0.5);
        this.coinsLabel.x = label.x - label.width - 4;
        this.coinsLabel.y = this.coinsIcon.height/2;
        this.coinsLabel.y --;
        container.addChild(this.coinsLabel);
    },
    createMap: function() {

    },
    createPanel: function() {
        let panel = this.panelContainer.create(0, 0, 'tile:blank');

        let coinsContainer = this.game.add.group();
        this.panelContainer.add(coinsContainer);
        this.createCoins(coinsContainer);
        coinsContainer.y = GAME.scale.sprite;
        coinsContainer.x = this.game.width - GAME.scale.sprite;

        panel.tint = 0xff00ff;
        panel.width = this.game.width;
        panel.height = coinsContainer.height + (GAME.scale.sprite * 2);
    },

    showButton: function(button) {
        this.game.add.tween(button).to({y:button.originalY}, 1000, Phaser.Easing.Elastic.Out).start();
    },

    onBtnPlayClicked: function(tile, pointer) {
        this.state.start("Game");
    }
};
