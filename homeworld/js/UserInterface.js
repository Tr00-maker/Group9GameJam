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
            text('Mining Ships:' +'\n' + miningShips.length, -80, -390);
            text('Battle Ships:' +'\n' + battleShips.length, -80, -320);
            pop();
        }

        this.title = false;
        this.buttons = false;
    }

    initializeTitle() {

    }
    
    update() {
        this.sprite.x = cameraSprite.x - windowWidth/2 + 100;
        this.sprite.y = cameraSprite.y;

        this.initializeTitle();

    }


}
let title, nextButton, prevButton, qMining, qBattle, qTurret;

// let unitButtons = [qMining, qBattle];

let buttonsDrawn = false;
function drawUi() {
    // push();
    // fill(0);
    // stroke('#39FF14');
    // strokeWeight(2);
    // rect(cameraSprite.x - windowWidth/2 + 5, cameraSprite.y + windowHeight/2 - 305, 300, 300);
    // pop();

    // push();
    // fill('#39FF14');
    // strokeWeight(0);
    // textSize(20);
    // textFont('Pixelify Sans');
    // text('Build Ships: ', cameraSprite.x - windowWidth/2 + 25, cameraSprite.y + windowHeight/2 - 275);
    // pop();

    // if (!buttonsDrawn) {
    //     buttonsDrawn = true;
    //     qMining = new Button('Mining Ship', qMining, miningShipCost, cameraSprite.x, cameraSprite.y, 30, 25);
    // }
    // qMining.update();
}

let unitButtons = [qMining];

class Button {
    constructor(name, type, cost, x, y, w, h) {
        this.sprite = new Sprite(x, y, 'd');
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.sprite.draw = () => {
            push();
            fill(0);
            stroke('#39FF14');
            strokeWeight(2);
            rect(0, 0, this.w, this.h);
            pop();
        };

        this.sprite.overlaps(allSprites);
        this.name = name;
        this.type = type;
        this.cost = cost;
    }
    update() {
        if (this.cost <= mothership.resource) {
            if (this.isHovered(mx, my) && mouse.released(LEFT)) {
                this.checkPressed();
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