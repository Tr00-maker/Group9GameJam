class UserInterface {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.unitButtonsCreated = false;
        this.commandButtonsCreated = false;
        this.unitButtons = [];
    }

    update() {
        this.repositionToCamera();
        this.displayTopBar();
        this.displayBottomBar();
        this.displayButtons();
        this.positionButtons();
    }

    repositionToCamera() {
        this.x = cameraSprite.x;
        this.y = cameraSprite.y;
    }

    displayTopBar() {
        let x = this.x - windowWidth/2;
        let y = this.y - windowHeight/2;

        push();
        fill(255, 100);
        stroke(0);
        strokeWeight(3);
        rect(x, y, windowWidth, 30);
        pop();

        push();
        fill(255);
        textAlign(CENTER,CENTER);
        textSize(15);
        text('Resource: ' + mothership.resource, x + 75, y + 15);
        pop();

        push();
        fill(255);
        textAlign(CENTER,CENTER);
        textSize(15);
        text('Ship Scraps: ' + mothership.scrap, x + 300, y + 15);
        pop();
    }

    displayBottomBar() {
        let x = this.x - windowWidth/2;
        let y = this.y + windowHeight/2 - 100;

        push();
        fill(255, 100);
        stroke(0);
        strokeWeight(3);
        rect(x, y, windowWidth, 100);
        pop();

        uiX = x;
        uiY = y;
        uiW = windowWidth;
        uiH = 100;
    }

    displayButtons() {
        if (!this.unitButtonsCreated) {
            this.unitButtonsCreated = true;
            this.miningShipButton = new UnitButton('Mining Ship', 'qMining', miningShipCost, 0, 0, 50, 50, miningShipImg);
            this.battleShipButton = new UnitButton('Battle Ship', 'qBattle', miningShipCost, this.button2X, this.button2Y, 50, 50, battleShipImg);
        }

        if (!this.commandButtonsCreated) {
            this.commandButtonsCreated = true;
            this.recallButton = new Button('Recall', 'recall', this.button3X, this.button3Y, 50, 50);
            this.harvestButton = new Button('Harvest', 'harvest', this.button4X, this.button4Y, )

        }
        this.miningShipButton.update();
        this.battleShipButton.update();
    }

    positionButtons() {
        let x = this.x - windowWidth/2;
        let y = this.y + windowHeight/2 - 100;

        this.button1X = x + 100;
        this.button1Y = y + 30;

        this.button2X = x + 300;
        this.button2Y = y + 30;

        this.button3X = x + 500;
        this.button3Y = y + 30;

        this.button4X = x + 700;
        this.button4Y = y + 30;

        this.miningShipButton.x = this.button1X;
        this.miningShipButton.y = this.button1Y;

        this.battleShipButton.x = this.button2X;
        this.battleShipButton.y = this.button2Y;

        this.recallButton.x = this.button3X;
        this.recallButton.y = this.button3Y;

        this.harvestButton.x = this.button4X;
        this.harvestButton.y = this.button4Y;
    }
}

class UnitButton {
    constructor(name, type, cost, x = 0, y = 0, w, h, image) {
        console.log(x + " " + y);
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.sprite = new Sprite(this.x + this.w/2, this.y + this.h/2, 'd');
        this.sprite.addAni('default', image);
        this.sprite.d = w;
        this.name = name;
        this.type = type;
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
        
        if (this.isHovered(mx, my) && mouse.released(LEFT)) {
            this.checkPressed();
        }
        if (this.isHovered(mx, my) && mouse.pressing(LEFT)) {
            this.color = pressedButtonColor;
        } else if (this.isHovered(mx, my)) {
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
            clickedFlag = true;
            switch(this.type) {
                case 'qMining':
                this.queueMiningShip();
                break;
                case 'qBattle':
                this.queueBattleShip();
                break;
            } 
        }
        if (clickedFlag) {
            setTimeout(() => clickedFlag = false, 200);
        }
    }

    queueMiningShip() {
        if (mothership.resource >= this.cost) {
            mothership.resource -= this.cost;
            mothership.spawnMiningShip();
        }
    }

    queueBattleShip() {
        if (mothership.resource >= this.cost) {
            mothership.resource -= this.cost;
            mothership.spawnBattleShip();
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
        this.index = unitButtons.indexOf(this);
        if (this.index != -1) {
            unitButtons.splice(this.index, 1);
        }
        this.sprite.remove();
    }
}

class Button {
    constructor(name, type,  x = 0, y = 0, w, h) {
        console.log(x + " " + y);
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.name = name;
        this.type = type;
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
        
        if (this.isHovered(mx, my) && mouse.released(LEFT)) {
            this.checkPressed();
        }
        if (this.isHovered(mx, my) && mouse.pressing(LEFT)) {
            this.color = pressedButtonColor;
        } else if (this.isHovered(mx, my)) {
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
            clickedFlag = true;
            switch(this.type) {
                case 'qMining':
                this.queueMiningShip();
                break;
                case 'qBattle':
                this.queueBattleShip();
                break;
            } 
        }
        if (clickedFlag) {
            setTimeout(() => clickedFlag = false, 200);
        }
    }

    remove() {
        this.index = unitButtons.indexOf(this);
        if (this.index != -1) {
            unitButtons.splice(this.index, 1);
        }
        this.sprite.remove();
    }
}

let clickedFlag = false;
