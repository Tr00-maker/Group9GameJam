class UserInterface {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.unitButtonsCreated = false;
    }

    update() {
        this.repositionToCamera();
        this.displayButtons();
        this.positionButtons();
    }

    repositionToCamera() {
        this.x = cameraSprite.x;
        this.y = cameraSprite.y;
    }

    displayButtons() {
        if (!this.unitButtonsCreated) {
            this.unitButtonsCreated = true;
            this.miningShipButton = new UnitButton('Mining Ship', 'qMining', miningShipCost, this.button1X, this.button1Y, 50, 50, miningButton, miningButtonPressed, miningButtonBlacked);
        }

        this.miningShipButton.update();

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

        this.miningShipButton.sprite.x = this.button1X;
        this.miningShipButton.sprite.y = this.button1Y;
    }
}

class UnitButton {
    constructor(name, type, cost, x, y, w, h, defaultImage, selectedImage, blackedImage) {
        this.sprite = new Sprite(x, y, 'd');
        this.defaultImage = defaultImage;
        this.selectedImage = selectedImage;
        this.blackedImage = blackedImage;
        this.sprite.w = w;
        this.sprite.h = h;
        this.name = name;
        this.type = type;
        this.cost = cost;
        this.sprite.addAni('default', this.defaultImage);
        this.sprite.addAni('pressed', this.selectedImage);
        this.sprite.addAni('blacked', this.blackedImage);
        this.sprite.debug = true;

        this.sprite.d = w;
    }
    update() {
        if (this.cost <= mothership.resource) {
            if (this.isHovered(mx, my) && mouse.released(LEFT)) {
                this.checkPressed();
            }
            if (this.isHovered(mx, my) && mouse.pressing(LEFT)) {
                this.sprite.changeAni('pressed');
                this.sprite.ani.scale = 1.5;
            } else if (this.isHovered(mx, my)) {
                this.sprite.changeAni('pressed');
                this.sprite.ani.scale = 1.2;
            } else {
                this.sprite.changeAni('default');
                this.sprite.ani.scale = 1;
            }
        } else {
            this.sprite.changeAni('blacked')
        }
        
    }
    isHovered(x, y) {
        return (
            x >= this.sprite.x - this.sprite.w/2 && 
            x <= this.sprite.x - this.sprite.w/2 + this.sprite.w && 
            y >= this.sprite.y - this.sprite.h/2 && 
            y <= this.sprite.y - this.sprite.h/2 + this.sprite.h
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
let clickedFlag = false;