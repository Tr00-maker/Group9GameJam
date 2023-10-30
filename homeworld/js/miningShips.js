let gamePause = false;
let selectionSquare;
let mothership;
let asteroids = [];
let miningShips = [];
let selectableSprites = [];
let selectionFlag = false;
let mothershipImg, asteroidImg, miningTargetImg, miningShipImg, miningShipSelectedImg, spaceBackground;

function preload() {
    spaceBackground = loadImage('./images/gif1.gif');
    asteroidImg = loadAnimation('./images/asteroid.png');
    miningTargetImg = loadAnimation('./images/miningTarget.png');
    miningShipImg = loadAnimation('./images/ships.png', { frameSize: [32, 32], frames: 1, row: 0, col: 1 });
    mothershipImg = loadAnimation('./images/ships.png', { frameSize: [32, 32], frames: 1, row: 2, col: 1 });
    miningShipSelectedImg = loadAnimation('./images/selected.png', { frameSize: [32, 32], frames: 1, row: 0, col: 1 });
}

function setup() {
    new Canvas(windowWidth, windowHeight, 'pixelated');
    selectionSquare = new SelectionSquare();
    mothership = new Mothership(width/2, height/2);
    asteroids.push(new Asteroid(mothership.sprite.x - 500, mothership.sprite.y - 250));
    asteroids.push(new Asteroid(mothership.sprite.x + 500, mothership.sprite.y - 250));
    spaceBackground.resize(400, 400);
}

function draw() {
    background(255);
    
    drawBackground();

    resourceDisplay();

    if (kb.pressed('space')) {
        gamePause = !gamePause;
    }
    
    world.step(gamePause ? -1 : 0);
    allSprites.autoUpdate = !gamePause;
    
    if (!gamePause) {
        gameStateUpdate();    
    }
}

function drawBackground() {
    for (let x = 0; x < windowWidth; x += 400) {
        for (let y = 0; y < windowHeight; y += 400) {
            image(spaceBackground, x, y, 400, 400);
        }
    }
}

function gameStateUpdate() {
    selectionSquare.display();
    mothership.receiveResource();
    
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].update();
    }

    for (let i = miningShips.length - 1; i >= 0; i--) {
        miningShips[i].update();
    }

    if (mouse.presses(LEFT) && !selectionFlag) {
        for (let i = selectableSprites.length - 1; i >= 0; i--) {
            selectableSprites[i].selected = false;
        }
    }
    
    mothership.spawnMiningShip();
}

class Mothership {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.addAni(mothershipImg);
        this.sprite.ani.scale = 2;
        this.sprite.rotationLock = true;
        this.sprite.overlaps(allSprites);

        //display
        this.sprite.d = 50;
        this.sprite.color = 'yellow';
        this.selected = false;

        //resources
        this.resource = 0;
    }

    receiveResource() {
        for (let i = miningShips.length - 1; i >= 0; i--) {
            if (dist(miningShips[i].sprite.x, miningShips[i].sprite.y, this.sprite.x, this.sprite.y) <= 100) {
                miningShips[i].transferResource(this);
            }
        }
    }

    spawnMiningShip() {
        if (this.sprite.mouse.pressed()) {
            miningShips.push(new MiningShip(this.sprite.x + (random() * 200 - 100), this.sprite.y + (random() * 200 - 100)));
        } 
    }
}

class SelectionSquare {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.drawing = false;
        this.selection = false;
        this.sprite = new Sprite(0, 0, 'd');
        this.sprite.w = 0;
        this.sprite.h = 0;
        this.sprite.overlaps(allSprites);
    }

    display() {
        if (!this.drawing) {
            this.x = mouseX;
            this.y = mouseY;
        }
        if (mouse.pressing(LEFT)) {
            this.drawing = true;
    
            this.sprite.x = min(this.x, mouseX);
            this.sprite.y = min(this.y, mouseY);
            this.sprite.w = abs(mouseX - this.x);
            this.sprite.h = abs(mouseY - this.y);
    
            push();
            fill(255, 255, 255, 50);
            stroke(255);
            strokeWeight(0.5);
            rect(this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h);
            pop();
        } else {
            this.drawing = false;
        }
        for (let i = selectableSprites.length - 1; i >= 0; i--) {
            if (this.isInSelectionSquare(selectableSprites[i].sprite)) {
                selectableSprites[i].selected = true;
                selectionFlag = true;
            } else if (mouse.pressing(LEFT)) {
                selectableSprites[i].selected = false;
            }
        }
        if (mouse.released(LEFT)) {
            setTimeout(() => {
                selectionFlag = false;
            }, 100);
        }
    }

    isInSelectionSquare(otherSprite) {
        return (
            otherSprite.x + otherSprite.w / 2 > this.sprite.x &&
            otherSprite.x - otherSprite.w / 2 < this.sprite.x + this.sprite.w &&
            otherSprite.y + otherSprite.h / 2 > this.sprite.y &&
            otherSprite.y - otherSprite.h / 2 < this.sprite.y + this.sprite.h
        );
    }
}

class MiningShip {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.d = 20;
        this.sprite.addAni('default', miningShipImg);
        this.sprite.addAni('selected', miningShipSelectedImg);
        this.sprite.ani.scale = 1.5;
        this.sprite.rotationLock = true;
        this.sprite.color = 'red';
        

        selectableSprites.push(this);
        this.sprite.overlaps(allSprites);
        
        //resources
        this.resource = 0;
        this.sprite.text = this.resource;
        this.sprite.textColor = 'white';
        this.sprite.textSize = 20;

        //default stats
        this.miningRate = 5;// 5 ticks per second
        this.lastMined = 0;
        this.capacity = 10;
        this.speed = 1;

        //status
        this.selected = false;
        this.returning = false;
        this.isMining = false;
        this.movingToAsteroid = false;
        this.miningTarget = 'none';
        this.asteroidClicked = false;
    }
    
    update() {
        this.pointSelect();
        this.setDestination();
        this.returnFromInactiveAsteroid();
        if (this.returning) {
            this.checkReturnedToMothership();
        }
        if (!this.miningTarget.active) {
            this.miningTarget = 'none';
        }  
        this.sprite.text = this.resource;
        this.sprite.rotation = this.sprite.direction;
        if (this.selected) {
            this.sprite.ani = 'selected';
            this.sprite.ani.scale = 1.5;
        } else {
            this.sprite.ani = 'default';
            this.sprite.ani.scale = 1.5;
        }
    }

    pointSelect() {
        if (this.sprite.mouse.presses(LEFT)) {
            for (let i = selectableSprites.length - 1; i >= 0; i--) {
                selectableSprites[i].selected = false;
            }
            this.selected = true;
            selectionFlag = true;
            setTimeout(() => {
                selectionFlag = false;
            }, 100);
        }
    }

    setDestination() { 
        this.asteroidClicked = false;  
        if (this.selected) {
            this.sprite.color = 'blue';
                for (let i = 0; i < asteroids.length; i++) {
                    if (asteroids[i].sprite.mouse.pressed(RIGHT)) {
                        this.setTargetVector(asteroids[i].sprite.x, asteroids[i].sprite.y);
                        this.miningTarget = asteroids[i];
                        console.log('this.miningTarget :'+ this.miningTarget);
                        this.sprite.move(this.distance, this.direction, this.speed);
                        this.movingToAsteroid = true;
                        this.returning = false;
                        this.asteroidClicked = true;
                    }
                }
                if (mouse.pressed(RIGHT) && !this.asteroidClicked) {
                    this.setTargetVector(mouseX, mouseY);
                    this.sprite.move(this.distance, this.direction, this.speed);
                    this.returning = false;
                }
            } else {
            this.sprite.color = 'red';
        }    
    }

    checkReturnedToMothership() {
        if (dist(this.sprite.x, this.sprite.y, mothership.sprite.x, mothership.sprite.y) <= 100) {
            console.log('returned');
            this.sprite.speed = 0;
            this.returning = false;
            if (this.miningTarget !== 'none') {
                this.returnToAsteroid(this.miningTarget);
            }
        }
    }

    returnToAsteroid(asteroid) {
        this.sprite.moveTo(asteroid.sprite, this.speed);
    }

    returnToMothership(destination) {
        if (!this.returning) {
            if (dist(this.sprite.x, this.sprite.y, destination.sprite.x, destination.sprite.y) > 100) {
                this.returning = true;
                this.sprite.moveTo(destination.sprite, this.speed);
            }
        }
    }

    returnFromInactiveAsteroid() {
        if ((this.isMining || this.movingToAsteroid) && this.miningTarget === 'none') {
            this.returnToMothership(mothership);
            this.isMining = false;
            this.movingToAsteroid = false;
        }
    }

    setTargetVector(x, y) {
        this.target = createVector(x, y);
        this.directionVector = p5.Vector.sub(this.target, createVector(this.sprite.x, this.sprite.y));
        this.direction = this.directionVector.heading();
        this.distance = this.directionVector.mag();
    }

    mine(asteroid) {
        this.isMining = true;
        const currentTime = Date.now();
        const miningDelay = 1000/this.miningRate

        if (currentTime - this.lastMined >= miningDelay) {
            if (this.resource < this.capacity) {
                this.resource += 1;
                asteroid.resource -= 1;
                this.lastMined = currentTime;
            } else {
                if (this.resource === this.capacity) {
                    this.returnToMothership(mothership);
                }
            }
        }
    }

    transferResource(recipient) {
        if (dist(this.sprite.x, this.sprite.y, recipient.sprite.x, recipient.sprite.y) <= 200)
        recipient.resource += this.resource;
        this.resource = 0;
    }
}

class Asteroid {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.d = 100;
        this.sprite.color = 'grey';

        this.sprite.direction = 360;
        this.sprite.speed = 0;

        this.resource = 200;
        this.sprite.textColor = 'white';
        this.sprite.textSize = 20;
        this.sprite.text = this.resource;
        this.active = true;
    }

    update() {
        this.sprite.rotation += 0.1;
        this.sprite.text = this.resource;
        this.move();
        this.showMiningTarget();
    }

    move() {
        for (let i = miningShips.length - 1; i >= 0; i--) {
            if (dist(miningShips[i].sprite.x, miningShips[i].sprite.y, this.sprite.x, this.sprite.y) <= 100) {
                this.sprite.speed = 0;
                this.transferResource(miningShips[i]);
            } else {
                this.sprite.speed = 0;
            }
        }
    }

    transferResource(miningShip) {
        if (this.resource > 0) {
            miningShip.mine(this);
        } else {
            this.dies();                    
        }
    }

    dies() {
        this.active = false;
        setTimeout(() => {
            this.sprite.remove();
            this.index = asteroids.indexOf(this)
            if (this.index != -1) {
                asteroids.splice(this.index, 1);
            }
        }, 100);
    }

    showMiningTarget() {
        this.sprite.addAni('default', asteroidImg);

        for (let i = 0; i < miningShips.length; i++) {
            if (miningShips[i].selected && miningShips[i].miningTarget === this) {
                this.sprite.addAni('miningTarget', miningTargetImg);
                break;
            }
        }
    }
}


let resourceDisplayX = 100;
let resourceDisplayY = 25;
function resourceDisplay() {
    push();
    stroke(0);
    strokeWeight(4);
    fill(255, 100);
    rect(0, 0, width, 50);
    pop();

    push();
    textSize(20);
    fill(0);
    stroke(255);
    textAlign(LEFT, CENTER);
    text('Resource: ' + mothership.resource, resourceDisplayX, resourceDisplayY);
    pop();
}
