// class UnitButton {
//     constructor(name, type, cost, x, y, w, h, defaultImage, selectedImage, blackedImage) {
//         this.sprite = new Sprite(x, y, 'd');
//         this.sprite.overlaps(allSprites);
//         this.defaultImage = defaultImage;
//         this.selectedImage = selectedImage;
//         this.blackedImage = blackedImage;
//         this.sprite.w = w;
//         this.sprite.h = h;
//         this.name = name;
//         this.type = type;
//         this.cost = cost;
//         this.sprite.addAni('default', this.defaultImage);
//         this.sprite.addAni('pressed', this.selectedImage);
//         this.sprite.addAni('blacked', this.blackedImage);

//         this.sprite.d = w;
//     }
//     update() {
//         if (this.cost <= mothership.resource) {
//             if (this.isHovered(mx, my) && mouse.released(LEFT)) {
//                 this.checkPressed();
//             }
//             if (this.isHovered(mx, my) && mouse.pressing(LEFT)) {
//                 this.sprite.changeAni('pressed');
//                 this.sprite.ani.scale = 1.5;
//             } else if (this.isHovered(mx, my)) {
//                 this.sprite.changeAni('pressed');
//                 this.sprite.ani.scale = 1.2;
//             } else {
//                 this.sprite.changeAni('default');
//                 this.sprite.ani.scale = 1;
//             }
//         } else {
//             this.sprite.changeAni('blacked')
//         }
        
//     }
//     isHovered(x, y) {
//         return (
//             x >= this.sprite.x - this.sprite.w/2 && 
//             x <= this.sprite.x - this.sprite.w/2 + this.sprite.w && 
//             y >= this.sprite.y - this.sprite.h/2 && 
//             y <= this.sprite.y - this.sprite.h/2 + this.sprite.h
//         );
//     }

//     checkPressed() {  
//         if (!clickedFlag) {
//             clickedFlag = true;
//             switch(this.type) {
//                 case 'qMining':
//                 this.queueMiningShip();
//                 break;
//                 case 'qBattle':
//                 this.queueBattleShip();
//                 break;
//             } 
//         }
//         if (clickedFlag) {
//             setTimeout(() => clickedFlag = false, 200);
//         }
//     }

//     queueMiningShip() {
//         if (mothership.resource >= this.cost) {
//             mothership.resource -= this.cost;
//             mothership.spawnMiningShip();
//         }
//     }

//     queueBattleShip() {
//         if (mothership.resource >= this.cost) {
//             mothership.resource -= this.cost;
//             mothership.spawnBattleShip();
//         }
//     }

//     queueMissile()
//     {
//         if(mothership.resource >= this.cost)
//         {
//             mothership.resource -= this.cost;
//             mothership.spawnMissile();
//         }
//     }

//     remove() {
//         this.index = unitButtons.indexOf(this);
//         if (this.index != -1) {
//             unitButtons.splice(this.index, 1)
//         }
//         this.sprite.remove();
//     }
// }
// let clickedFlag = false;

class BottomUi {
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
        }

        this.initializeButtons();

        this.buttons = false;
    }

    initializeButtons() {
        qMining = new Button('Mining Ship', 'qMining', miningShipCost, this.x, this.y - 160, 175, 60);
        qBattle = new Button('Battle Ship', 'qBattle', miningShipCost, this.x, this.y + 60, 175, 60);
    }

    updateButtons() {
        qMining.sprite.x = this.sprite.x;
        qMining.sprite.y = this.sprite.y - 160;
        qBattle.sprite.x = this.sprite.x;
        qBattle.sprite.y = this.sprite.y - 60;
        qMining.update();
        qBattle.update();
    }
    
    update() {
        this.sprite.x = cameraSprite.x - windowWidth/2 + 100;
        this.sprite.y = cameraSprite.y;

        this.updateButtons();

    }


}
let qMining, qBattle, qTurret;

let unitButtons = [qMining, qBattle];

class Button {
    constructor(name, type, cost, x, y, w, h) {
        this.sprite = new Sprite(x, y, 'd');
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        this.timer = 0;
        this.isWaiting = false; // Track if the button is in a waiting state
        this.fillProgress = 0; // Progress of the fill bar (0 to 1)

        this.sprite.draw = () => {
            push();
            fill(0);
            stroke('#39FF14');
            strokeWeight(2);
            rect(0, 0, this.w, this.h);
            pop();

            push();
            fill('#39FF14');
            strokeWeight(0);
            textSize(20);
            textFont('Pixelify Sans');
            textAlign(CENTER, CENTER);
            text('Build:' +' ' + this.name + '\nResource: ' + this.cost, 0, 0);
            pop();

            push();
            fill('#39FF14');
            noStroke();
            rectMode(CORNER);
            rect(-this.w/2, -this.h/2, this.fillProgress * this.w, this.h);
            pop();
        };

        this.sprite.overlaps(allSprites);
        this.name = name;
        this.type = type;
        this.cost = cost;
    }
    update() {
        if (this.isWaiting) {
            const currentTime = Date.now();
            this.fillProgress = Math.min((currentTime - this.timer) / 3000, 1);
        }

        if (this.cost <= mothership.resource && !this.isWaiting) {
            if (this.isHovered(mx, my) && mouse.released(LEFT)) {
                this.checkPressed(this.type);
            }
            if (this.isHovered(mx, my) && mouse.pressing(LEFT)) {

            } else if (this.isHovered(mx, my)) {

            } else {

            }
        } else {

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

    checkPressed(type) {
        const currentTime = Date.now();
        
        if (!this.isWaiting && !clickedFlag) {
            clickedFlag = true;
            this.isWaiting = true;
            this.timer = currentTime;
            this.fillProgress = 0;
            
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
                    }
                    
                }, 3000);
            }
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