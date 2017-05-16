var GAME = GAME || {};

GAME.Debug = function() {};

GAME.Debug.prototype = {
    init: function() {
    },
    create: function() {
        let deckManager = new DeckManager(this.game);
        deckManager.generate();
    }
};
