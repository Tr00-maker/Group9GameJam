let gamePause = false;
let selectionSquare;
let mothership;
let asteroids = [];
let miningShips = [];
let selectableSprites = [];
let selectionFlag = false;

function setup() {
    new Canvas(windowWidth, windowHeight);
    selectionSquare = new SelectionSquare();
    mothership = new Mothership(width/2, height/2);
    asteroids.push(new Asteroid(mothership.sprite.x - 400, mothership.sprite.y - 400));
}

function draw() {
    background(255);
    
    textDecript();

    selectionSquare.display();
    mothership.updateSelection();


    if (kb.pressed('space')) {
        gamePause = !gamePause;
    }

    world.step(gamePause ? -1 : 0);
    allSprites.autoUpdate = !gamePause;
    
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].move();
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
            fill(0, 0, 0, 100);
            stroke(0);
            strokeWeight(1);
            rect(this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h);
            pop();
        } else {
            this.drawing = false;
            this.selection = true;
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

class Mothership {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.overlaps(allSprites);

        //display
        this.sprite.d = 50;
        this.sprite.color = 'yellow';
        this.selected = false;
    }

    updateSelection() {
        if (this.selected) {
            this.sprite.color = 'blue';
        } else {
            this.sprite.color = 'yellow';
        }
    }
    spawnMiningShip() {
        if (this.sprite.mouse.pressed()) {
            miningShips.push(new MiningShip(this.sprite.x + (random() * 50), this.sprite.y + (random() * 50)));
        } 
    }
}


class MiningShip {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.d = 20;
        this.sprite.color = 'red';
        this.selected = false;
        selectableSprites.push(this);
        this.sprite.overlaps(allSprites);
    }
    
    update() {
        this.pointSelect();
        this.move();
    }
    pointSelect() {
        if (this.sprite.mouse.presses()) {
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
    move() {
        if (this.selected) {
            this.sprite.color = 'blue';
            if (mouse.pressed(RIGHT)) {
                this.setTarget(mouseX, mouseY);
                this.sprite.move(this.distance, this.direction, 1);
            }
        } else {
            this.sprite.color = 'red';
        }
    }

    setTarget(x, y) {
        this.target = createVector(x, y);
        this.directionVector = p5.Vector.sub(this.target, createVector(this.sprite.x, this.sprite.y));
        this.direction = this.directionVector.heading();
        this.distance = this.directionVector.mag();
    }

}


class Asteroid {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');

        this.sprite.d = 30;
        this.sprite.color = 'black';

        this.sprite.direction = 360;
        this.sprite.speed = 0.5;
    }

    move() {
        for (let i = miningShips.length - 1; i >= 0; i--) {
            if (dist(miningShips[i].sprite.x, miningShips[i].sprite.y, this.sprite.x, this.sprite.y) <= 100) {
                this.sprite.speed = 0;
            } else {
                this.sprite.speed = 0.5;
            }
        }
    }

}

function textDecript() {
    push();
    fill(0);
    textSize(20);
    text('Left Click yellow circle (mothership) to spawn mining ship\n drag mouse with left click to select units\n right click mouse to move units\n will rewrite to clean it up obviously\n I wrote it using vectors, so later we can add funcionality to q up movement like in other rts game\n havent worked any of that out yet tho', 100, 100);
    pop();
}
