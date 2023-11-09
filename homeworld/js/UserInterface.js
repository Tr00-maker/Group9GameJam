class UserInterface {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.unitButtonsCreated = false;
    }

    update() {
        this.repositionToCamera();
        //this.displayButtons();
        //.positionButtons();
    }

    repositionToCamera() {
        this.x = cameraSprite.x;
        this.y = cameraSprite.y;
    }

    displayButtons() {
        if (!this.unitButtonsCreated) {
            this.unitButtonsCreated = true;
            this.miningShipButton = new UnitButton('Mining Ship', 'qMining', miningShipCost, 0, 0, 50, 50, miningButton, miningButtonPressed, miningButtonBlacked);
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
        this.sprite.overlaps(allSprites);
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
            unitButtons.splice(this.index, 1)
        }
        this.sprite.remove();
    }
}
let clickedFlag = false;

class BottomUi {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.layer = 3;
        this.sprite.ani = squareUiImg;
        this.sprite.ani.scale = 3.5
        this.sprite.overlaps(allSprites);
        this.title = false;
        this.buttons = false;
        this.state = 'Build Ship';
    }

    initializeTitle() {
        if (!this.title) {
            switch(this.state) {
                case 'Build Ship':
                qMining = new UnitButton('Mining Ship', 'qMining', miningShipCost, 0, 0, 50, 50, miningButton, miningButtonPressed, miningButtonBlacked);
                qBattle = new UnitButton('Battle Ship', 'qBattle', miningShipCost, 0, 0, 50, 50, battleButton, battleButtonPressed, battleButtonBlacked);
                qTurret = new UnitButton('Mining Ship', 'qMining', miningShipCost, 0, 0, 50, 50, turretButton, turretButtonPressed, turretButtonBlacked);
            }
            title = new Sprite(this.sprite.x, this.sprite.y - 100, 120, 30);
            title.overlaps(allSprites);
            title.ani = titleFrameImg;
            title.ani.scale = 2.5;
            title.textSize = 30;
            title.textStroke = 'black';
            title.textStrokeWeight  = 5;
            title.textColor = color(0);
            title.text = this.state;
            title.pixelPerfect;
        }
        this.title = true;
        title.x = this.sprite.x;
        title.y = this.sprite.y - 100;
        
        switch(this.state) {
            case 'Build Ship':
            qMining.sprite.x = this.sprite.x - 75;
            qMining.sprite.y = this.sprite.y - 35;
            qMining.update();

            qBattle.sprite.x = qMining.sprite.x;
            qBattle.sprite.y = qMining.sprite.y + 75;
            qBattle.update();

            qTurret.sprite.x = qMining.sprite.x;
            qTurret.sprite.y = qMining.sprite.y + 150;
            qTurret.update();
        }
    }
    update() {
        this.sprite.x = cameraSprite.x - windowWidth/2 + 230;
        this.sprite.y = cameraSprite.y + windowHeight/3 - 10;

        this.initializeTitle();

    }


}
let title, nextButton, prevButton, qMining, qBattle, qTurret;

let unitButtons = [qMining, qBattle];