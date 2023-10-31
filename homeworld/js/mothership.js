class Mothership {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.addAni('default', mothershipImg);
        this.sprite.addAni('selected', mothershipSelectedImg);
        this.sprite.rotationLock = true;
        this.sprite.overlaps(allSprites);

        //display
        this.sprite.d = 100;
        this.sprite.color = 'yellow';
        this.selected = false;

        //resources
        this.resource = 0;

        //buttons
        this.buttonsCreated = false;
        selectableSprites.push(this);
    }

    update() {
        this.sprite.ani.scale = 3;
        this.receiveResource();
        if (this.selected) {
            this.sprite.ani = 'selected';
            
            this.selectedUI();
        } else {
            this.sprite.ani = 'default';
            this.removeUI();
        }
    }

    receiveResource() {
        for (let i = miningShips.length - 1; i >= 0; i--) {
            if (dist(miningShips[i].sprite.x, miningShips[i].sprite.y, this.sprite.x, this.sprite.y) <= 100) {
                miningShips[i].transferResource(this);
            }
        }
    }

    spawnMiningShip() {
        miningShips.push(new MiningShip(this.sprite.x + (random() * 200 - 100), this.sprite.y + (random() * 200 - 100)));
    }

    selectedUI() {

        if (!this.buttonsCreated) {
            this.buttonsCreated = true;
            buttons.push(new Button('Mining Ship', miningShipCost, uiX + uiW/2, uiY + uiH/2, 50, 50, miningShipImg));
        }
    }

    removeUI() {
        this.buttonsCreated = false;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].remove();
        }
    }
}

class Button {
    constructor(name, cost,  x, y, w, h, image) {
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.sprite = new Sprite(x + this.w/2, y + this.h/2, 'd');
        this.sprite.addAni('default', image);
        this.sprite.d = 50;
        this.name = name;
        this.cost = cost;
        this.color = defaultButtonColor;
    }

    update() {
        push();
        fill(this.color);
        rect(this.x, this.y, this.w, this.h);
        pop();

        push();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(20);
        text(this.name + ': ' + this.cost, this.x + this.w/2, this.y - 10);
        pop();
        if (this.isHovered(mouseX, mouseY) && mouse.pressed(LEFT)) {
            this.checkPressed();
        }
        if (this.isHovered(mouseX, mouseY) && mouse.pressing(LEFT)) {
            this.color = pressedButtonColor;
        } else if (this.isHovered(mouseX, mouseY)) {
            this.color = hoveredButtonColor;
        } else {
            this.color = defaultButtonColor;
        }
    }

    isHovered(x, y) {
        return (
            x >= this.x && 
            x <= this.x + this.w && 
            y >= this.y && 
            y <= this.y + this.h
        );
    }

    checkPressed() {  
        switch(this.name) {
            case 'Mining Ship':
            this.queueMiningShip();
            break;
        } 
    }

    queueMiningShip() {
        if (mothership.resource >= 50) {
            mothership.resource -= 50;
            mothership.spawnMiningShip();
        }
    }

    remove() {
        this.index = buttons.indexOf(this);
        if (this.index != -1) {
            buttons.splice(this.index, 1);
        }
        this.sprite.remove();
    }

}