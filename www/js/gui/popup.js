function Popup(game) {
    Phaser.Group.call(this, game);

    this.overlayContainer = this.game.add.group();
    this.popupContainer = this.game.add.group();

    this.containers = new Array();

    this.maxWidth = this.game.width - 40;
    this.padding = 16;

    this.background = new Ninepatch(this.game, "ninepatch:background");
    this.popupContainer.addChild(this.background);
}

Popup.prototype = Object.create(Phaser.Group.prototype);
Popup.prototype.constructor = Popup;

Popup.SPEED = 300;

Popup.prototype.getContainer = function(containerName) {
    let container = null;
    this.containers.forEach(function(singleContainer) {
        if (singleContainer.name == containerName) {
            container = singleContainer;
        }
    }, this);

    /* Create the new container */
    if (container == null) {
        let group = this.game.add.group();
        this.popupContainer.add(group);

        container = {group:group, name:containerName};
        this.containers.push(container);
    }

    return container;
};

Popup.prototype.close = function() {
    this.hide();
};

Popup.prototype.createOverlay = function(opacity, color) {
    if (opacity == null) {
        opacity = 0.5;
    }
    if (color == null) {
        color = 0x000000;
    }
    let background = this.overlayContainer.create(0, 0, "tile:blank");
    background.tint = color;
    background.alpha = opacity;
    background.width = this.game.width;
    background.height = this.game.height;
    background.inputEnabled = true;
};

Popup.prototype.createTitle = function(label) {
    let container = this.getContainer("title").paddingTop = 0;
    let group = this.getContainer("title").group;

    let background = new Ninepatch(this.game, "ninepatch:blue");
    background.resize(this.maxWidth, 50);

    let text = this.game.add.bitmapText(0, 0, "font:gui", label, 16);
    text.anchor.set(0.5, 0.5);
    text.y += background.height/2;
    text.x += background.width/2;
    background.addChild(text);

    group.addChild(background);
};

Popup.prototype.createCloseButton = function() {
    let group = this.getContainer("closeButton").group;

    let btnClose = group.create(0, 0, "gui:btnClose");
    let iconClose = group.create(0, 0, "icon:close");
    iconClose.anchor.set(0.5, 0.5);
    iconClose.x = btnClose.width/2;
    iconClose.y = btnClose.height/2;
    btnClose.addChild(iconClose);

    console.log(this);
    btnClose.inputEnabled = true;
    btnClose.events.onInputUp.add(function() {
        this.close();
    }, this);

    this.getContainer("closeButton").outside = true;
};

Popup.prototype.generate = function() {
    let containerY = 0;
    this.containers.forEach(function(singleContainer) {
        if (singleContainer.outside == undefined) {
            let paddingBottom = this.padding;
            if (singleContainer.x != undefined) {
                singleContainer.group.x = singleContainer.x;
            } else {
                singleContainer.group.x = (this.maxWidth - singleContainer.group.width) / 2;
            }

            if (singleContainer.paddingTop == undefined) {
                containerY += this.padding;
            }
            singleContainer.group.y = containerY;

            containerY += singleContainer.group.height;
        }
    }, this);

    containerY += this.padding;

    this.background.resize(this.maxWidth, containerY);

    this.popupContainer.x = (this.game.width - this.background.width) /2;
    this.popupContainer.y = (this.game.height - this.background.height) /2;

    /* Close button */
    let group = this.getContainer("closeButton").group;
    if (group.height > 0) {
        group.x = this.popupContainer.width - group.width/2;
        group.y = - group.height/2;
    }

    this.popupContainer.destinationY = -this.popupContainer.height;
    this.popupContainer.originalY = this.popupContainer.y;

    this.popupContainer.y = this.popupContainer.destinationY;

    this.show();
};

Popup.prototype.hide = function() {
    this.overlayContainer.alpha = 0;
    this.overlayContainer.getChildAt(0).inputEnabled = false;

    let tween = this.game.add.tween(this.popupContainer).to({y:this.popupContainer.destinationY}, Popup.SPEED);
    tween.onComplete.add(function() {
        this.destroy();
    }, this);
    tween.start();
};

Popup.prototype.show = function() {
    this.game.add.tween(this.popupContainer).to({y:this.popupContainer.originalY}, Popup.SPEED).start();
};
