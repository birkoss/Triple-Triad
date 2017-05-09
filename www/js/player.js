function Player(newType) {
    this.type = newType;

    this.cards = new Array();
};

Player.prototype = {
    addCard: function(card) {
        this.cards.push(card);
    }
};
