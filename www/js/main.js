/*
 * Animate the enemy on placed on the map
 * Make the map as an island
 */
var GAME = GAME || {};

GAME.config = {};
GAME.config.cards = {"card9":1, "card8":1, "card16":1, "card5":1, "card19":1};
GAME.config.deck = ["card9", "card8", "card16", "card5", "card19"];
GAME.config.levels = ["level1"];

GAME.scale = {sprite:6, normal:1};
GAME.scale.normal = Math.max(1, Math.min(6, Math.floor(window.innerWidth / 320) * 2));

GAME.save = function() {
    let fields = ["decks", "cards", "levels"];

    let data = {};
    fields.forEach(function(field) {
        data[field] = GAME.config[field];
    }, this);

    localStorage.setItem('game_config', JSON.stringify(data));
};

GAME.load = function() {
    let data = localStorage.getItem('game_config');
    if (data != null) {
        data = JSON.parse(data);
        GAME.config = Object.assign(GAME.config, data);
    }
};

GAME.getCard = function(cardID) {
    let card = null;
    GAME.json["cards"].forEach(function(singleCard) {
        if (singleCard.id == cardID) {
            card = singleCard;
        }
    }, this);
    return card;
};

GAME.getLevel = function(levelID) {
    let level = null;
    GAME.json["levels"].forEach(function(singleLevel) {
        if (singleLevel.id == levelID) {
            level = singleLevel;
        }
    }, this);
    return level;
};

GAME.load();

/* Phaser */

GAME.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

GAME.game.state.add('Boot', GAME.Boot);
GAME.game.state.add('Preload', GAME.Preload);
GAME.game.state.add('Main', GAME.Main);
GAME.game.state.add('Game', GAME.Game);
GAME.game.state.add('Level', GAME.Level);
GAME.game.state.add('Debug', GAME.Debug);

GAME.game.state.start('Boot');
