class UserInterface {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.overlaps(allSprites);
        this.sprite.layer = 3;
        this.x = x;
        this.y = y;

        this.sprite.draw = () => {
            push();
            fill(0);
            stroke('#39FF14');
            strokeWeight(2);
            rect(0, 0, 200, windowHeight - 1);
            pop();

            push();
            fill('#39FF14');
            strokeWeight(0);
            textSize(20);
            textFont('Pixelify Sans');
            text('Resource:' +'\n' + mothership.resource, -80, -530);
            text('Ship Scraps:' +'\n' + mothership.scrap, -80, -460);
            text('Ships:' +'\n' + selectableSprites.length, -80, -390);
            text('Mining Ships:' +'\n' + miningShips.length, -80, -320);
            text('Battle Ships:' +'\n' + battleShips.length, -80, -250);
            pop();

            push();
            fill('#39FF14');
            strokeWeight(0);
            textSize(25);
            textAlign(CENTER, CENTER);
            textFont('Pixelify Sans');
            text('Keyboard Inputs:' +'\n' + '( Q ) - Go to next Mining Ship  ( E ) - Go to next Battle Ship  ( X ) - Go to MotherShip   ( Space ) - Toggle Pause', 1000, -530);
            pop();
        }

        this.initializeButtons();

        this.buttons = false;
    }

    initializeButtons() {
        //queue buttons
        qMining = new Button('Build: Mining', 'qMining', 40, this.x, this.y - 160, 175, 60, 'Resource');
        qBattle = new Button('Build: Battle', 'qBattle', 50, this.x, this.y + 60, 175, 60, 'Resource');
        qDread = new Button('Build: Dreadnought', 'qDread', 80, this.x, this.y + 60, 175, 80, 'Resource');

        //upgrade buttons
        uMining1 = new Button('Upgrade: Mining Lv1', 'uMining1', 15, this.x, this.y - 160, 175, 60, 'Ship Scraps');
        uBattle1 = new Button('Upgrade: Battle Lv1', 'uBattle1', 20, this.x, this.y - 160, 175, 60, 'Ship Scraps');
      
        //command buttons
        recallButton = new Button('Recall', 'recall', 0, this.x, this.y + 325, 50, 50, ' ');
        harvestButton = new Button('Harvest', 'harvest', 0, this.x, this.y + 350, 50, 50, ' ');
        //huntButton = new Button('Hunt', 'hunt', this.x, 0, this.y + 400, 50, 50, ' ');
    }
    
    getVisibleEnemiesInArea(area) {
        return enemyUnits.filter(enemy => enemy.isVisible() && this.isShipInArea(enemy, area));
    }

    getAsteroidsInArea() {
        const area = {
            x1: cameraSprite.x - windowWidth / 2,
            y1: cameraSprite.y - windowHeight / 2,
            x2: cameraSprite.x + windowWidth / 2,
            y2: cameraSprite.y + windowHeight / 2,
        };

        return asteroids.filter(asteroid => this.isAsteroidInArea(asteroid, area))
    }

    isShipInArea(ship, area) {
        return (
            ship.sprite.x >= area.x1 &&
            ship.sprite.x <= area.x2 && 
            ship.sprite.y >= area.y1 &&
            ship.sprite.y <= area.y2
        );
    }

    isAsteroidInArea(asteroid, area) {
        return (
            asteroid.sprite.x >= area.x1 &&
            asteroid.sprite.x <= area.x2 && 
            asteroid.sprite.y >= area.y1 &&
            asteroid.sprite.y <= area.y2
        );
    }

    divideMiningShipsIntoGroups(numMiningShips, numGroups) {
        const groups = Array.from({length: numGroups }, () => []);
        for (let i = 0; i < numMiningShips; i++) {
            groups[i % numGroups].push(miningShips[i]);
        }
        return groups;
    }

    updateButtons() {
        qMining.sprite.x = this.sprite.x;
        qMining.sprite.y = this.sprite.y - 160;

        qBattle.sprite.x = this.sprite.x;
        qBattle.sprite.y = this.sprite.y - 60;

        qDread.sprite.x = this.sprite.x;
        qDread.sprite.y = this.sprite.y + 40;
      
            
        qMining.update();
        qBattle.update();
        qDread.update();
      
        if (recallButton) {
          recallButton.sprite.x = this.sprite.x;
          recallButton.sprite.y = this.sprite.y + 300;
          recallButton.update()
        }
      
        if (harvestButton) {
          harvestButton.sprite.x = this.sprite.x;
          harvestButton.sprite.y = this.sprite.y + 350;
          harvestButton.update()
        }
      
        if (huntButton) {   
          huntButton.sprite.x = this.sprite.x;
          huntButton.sprite.y = this.sprite.y + 400;
          huntButton.update()
        }

        if(uMining1) {
            uMining1.sprite.x = this.sprite.x;
            uMining1.sprite.y = this.sprite.y + 140;
            uMining1.update();
        }

        if(uMining2) {
            uMining2.sprite.x = this.sprite.x;
            uMining2.sprite.y = this.sprite.y + 140;
            uMining2.update();
        }

        if (uBattle1) {
            uBattle1.sprite.x = this.sprite.x;
            uBattle1.sprite.y = this.sprite.y + 240;
            uBattle1.update();
        }

        if (uBattle2) {
            uBattle2.sprite.x = this.sprite.x;
            uBattle2.sprite.y = this.sprite.y + 240;
            uBattle2.update();
        }

        if(uDread) {
            uDread.sprite.x = this.sprite.x;
            uDread.sprite.y = this.sprite.y + 140;
            uDread.update();
        }

    }
    
    update() {
        this.sprite.x = cameraSprite.x - windowWidth/2 + 100;
        this.sprite.y = cameraSprite.y;

        this.updateButtons();
    }


}
let qMining, qBattle, qDread;
let uMining1, uBattle1, uDread, uMining2, uBattle2;
let recallButton, harvestButton, huntButton;

let unitButtons = [qMining, qBattle, qDread];

class Button {
    constructor(name, type, cost, x, y, w, h, resource) {
        this.sprite = new Sprite(x, y, 'd');
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.resource = resource;

        this.color = color(57,255,20);
        
        this.timer = 0;
        this.isWaiting = false; // Track if the button is in a waiting state
        this.fillProgress = 0; // Progress of the fill bar (0 to 1)

        this.sprite.overlaps(allSprites);
        this.name = name;
        this.type = type;
        this.cost = cost;

        this.sprite.debug = true;
    }

    update() {
        if (this.type !== 'recall' && this.type !== 'hunt' && this.type !== 'harvest') {
            this.sprite.draw = () => {
                push();
                fill(0);
                stroke(this.color);
                strokeWeight(2);
                rect(0, 0, this.w, this.h);
                pop();

                push();
                fill(this.color);
                strokeWeight(0);
                textSize(18);
                textFont('Pixelify Sans');
                textAlign(CENTER, CENTER);
                
                    text(this.name + '\n' + this.resource + ': '+ this.cost, 0, 0);
                pop();

                push();
                fill(57,255,20, 100);
                noStroke();
                rectMode(CORNER);
                rect(-this.w/2, -this.h/2, this.fillProgress * this.w, this.h);
                pop();
            };
        }

        if (this.type === 'recall' || this.type === 'hunt' || this.type === 'harvest') {
            this.sprite.draw = () => {
                push();
                fill(0);
                stroke(this.color);
                strokeWeight(2);
                rect(0, 0, this.w, this.h);
                pop();

                push();
                fill(this.color);
                strokeWeight(0);
                textSize(18);
                textFont('Pixelify Sans');
                textAlign(CENTER, CENTER);
                text(this.name, 0, 0);
                pop();

                push();
                fill(57,255,20, 100);
                noStroke();
                rectMode(CORNER);
                rect(-this.w/2, -this.h/2, this.fillProgress * this.w, this.h);
                pop();
            };
        }

        if (this.isWaiting) {
            const currentTime = Date.now();
            this.fillProgress = min((currentTime - this.timer) / 3000, 1);
        }

        if (this.type === 'qMining' || this.type === 'qBattle' || this.type === 'qDread') {
            if (this.cost <= mothership.resource && !this.isWaiting) {
                if (this.isHovered(mx, my) && mouse.released(LEFT)) {
                    this.checkPressed(this.type);
                }
                if (this.isHovered(mx, my) && mouse.pressing(LEFT)) {
                    this.color = color(57,255,20, 200);
                } else if (this.isHovered(mx, my)) {
                    this.color = color(57,255,20, 100);
                } else {
                    this.color = color(57,255,20);
                }
            } else {
                this.color = color(57,255,20, 100);
            }
        }

        if (this.type === 'uMining1' || this.type === 'uBattle1' || this.type === 'uMining2' || this.type === 'uBattle2') {
            if (this.cost <= mothership.scrap && !this.isWaiting) {
                if (this.isHovered(mx, my) && mouse.released(LEFT)) {
                    this.checkPressed(this.type);
                }
                if (this.isHovered(mx, my) && mouse.pressing(LEFT)) {
                    this.color = color(57,255,20, 200);
                } else if (this.isHovered(mx, my)) {
                    this.color = color(57,255,20, 100);
                } else {
                    this.color = color(57,255,20);
                }
            } else {
                this.color = color(57,255,20, 100);
            }
        }

        if (this.type === 'recall' || this.type === 'harvest' || this.type === 'hunt') {
            if (this.cost <= mothership.scrap && !this.isWaiting) {
                if (this.isHovered(mx, my) && mouse.released(LEFT)) {
                    this.checkPressed(this.type);
                }
                if (this.isHovered(mx, my) && mouse.pressing(LEFT)) {
                    this.color = color(57,255,20, 200);
                } else if (this.isHovered(mx, my)) {
                    this.color = color(57,255,20, 100);
                } else {
                    this.color = color(57,255,20);
                }
            } else {
                this.color = color(57,255,20, 100);
            }
        }
        
    }

    isHovered(x, y) {
        return (
            x >= this.sprite.x - this.w / 2 &&
            x <= this.sprite.x + this.w / 2 &&
            y >= this.sprite.y - this.h / 2 &&
            y <= this.sprite.y + this.h / 2
        );
    }  

    checkPressed(type) {
        const currentTime = Date.now();
        
        if (!this.isWaiting && !clickedFlag) {
            clickedFlag = true;
            this.isWaiting = true;
            this.timer = currentTime;
            this.fillProgress = 0;
            
            if (type === 'qMining' || type === 'qBattle' || type === 'qDread') 
            {
                if (mothership.resource >= this.cost) {
                    mothership.resource -= this.cost;  
                    setTimeout(() => {
                        this.isWaiting = false;
                        clickedFlag = false;
                        this.fillProgress = 0;
            
                        switch(type) {
                            case 'qMining':
                                mothership.spawnMiningShip();
                                break;
                            case 'qBattle':
                                mothership.spawnBattleShip();
                                break;
                            case 'qDread':
                                mothership.spawnDread();
                                break;
                        }
                        
                    }, 3000);
                }
            }
        }

        if (type === 'uMining1' || type === 'uBattle1'|| type === 'uMining2' || type === 'uBattle2') {
            if (mothership.scrap >= this.cost) {
                mothership.scrap -= this.cost;  
                setTimeout(() => {
                    this.isWaiting = false;
                    clickedFlag = false;
                    this.fillProgress = 0;
        
                    switch(type) {
                        case 'uMining1':
                            playerUpgradeController.upgradeMiningLv1();
                            uMining1.sprite.remove();
                            uMining2 = new Button('Upgrade: Mining Lv2', 'uMining2', 25, this.x, this.y - 160, 175, 60, 'Ship Scraps');
                            break;
                        case 'uBattle1':
                            playerUpgradeController.upgradeBattleLv1();
                            uBattle1.sprite.remove();
                            uBattle2 = new Button('Upgrade: Battle Lv2', 'uBattle2', 30, this.x, this.y - 160, 175, 60, 'Ship Scraps');
                            break;
                        case 'uMining2':
                            playerUpgradeController.upgradeMiningLv2();
                            uMining2.sprite.remove();
                            break;
                        case 'uBattle2':
                            playerUpgradeController.upgradeBattleLv2();
                            uBattle2.sprite.remove();
                            break;
                    }
                    
                }, 3000);
            }
        }
        
        if (type === 'recall' || type === 'harvest'|| type === 'hunt') { 
            setTimeout(() => {
                this.isWaiting = false;
                clickedFlag = false;
                this.fillProgress = 0;
                }, 3000);

                switch(type) {
                case 'recall':
                    mothership.recallUnits();
                    break;
                case 'harvest':
                    mothership.harvestAsteroids();
                    break;
                case 'hunt':
                    break;
            } 
        }
    }
}
  
let clickedFlag = false;
