/*
 * Animate the enemy on placed on the map
 * Make the map as an island
 */
var GAME = GAME || {};

GAME.config = {};
GAME.config.cards = {"Farmer":1, "Peon":1, "Dwarf":1, "Archer":1, "Priest":1};
GAME.config.deck = ["Farmer", "Peon", "Dwarf", "Archer", "Priest"];

GAME.scale = {sprite:6, normal:1};
GAME.scale.normal = Math.max(1, Math.min(6, Math.floor(window.innerWidth / 320) * 2));

GAME.save = function() {
    let fields = ["decks"];

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

GAME.getCard = function(cardName) {
    let card = null;
    GAME.json["cards"].forEach(function(singleCard) {
        if (singleCard.name == cardName) {
            card = singleCard;
        }
    }, this);
    return card;
};

GAME.load();

/* Phaser */

GAME.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

GAME.game.state.add('Boot', GAME.Boot);
GAME.game.state.add('Preload', GAME.Preload);
GAME.game.state.add('Main', GAME.Main);
GAME.game.state.add('Game', GAME.Game);

GAME.game.state.start('Boot');
