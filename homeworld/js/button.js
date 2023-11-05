class UnitButton {
    constructor(name, cost,  x, y, w, h, image) {
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.sprite = new Sprite(x + this.w/2, y + this.h/2, 'd');
        this.sprite.addAni('default', image);
        this.sprite.d = w;
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
        if (this.isHovered(mouseX, mouseY) && mouse.released(LEFT)) {
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
        if (!clickedFlag) {
            switch(this.name) {
                case 'Mining Ship':
                this.queueMiningShip();
                break;
                case 'Missile':
                this.queueMissile();
                break;
            } 
        }
        if (clickedFlag) {
            setTimeout(() => clickedFlag = false, 200);
        }
    }

    queueMiningShip() {
        if (mothership.resource >= 50) {
            mothership.resource -= 50;
            mothership.spawnMiningShip();
        }
    }
    queueMissile()
    {
        if(mothership.resource >= this.cost)
        {
            mothership.resource -= this.cost;
            mothership.spawnMissile();
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
let clickedFlag = false;