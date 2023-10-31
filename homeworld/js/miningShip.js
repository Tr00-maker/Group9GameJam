class MiningShip {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.d = 20;
        this.sprite.addAni('default', miningShipImg);
        this.sprite.addAni('selected', miningShipSelectedImg);
        

        selectableSprites.push(this);
        this.sprite.overlaps(allSprites);
        
        //resources
        this.resource = 0;
        this.sprite.text = this.resource;
        this.sprite.textColor = 'white';
        this.sprite.textSize = 20;

        //default stats
        this.miningRate = 1;
        this.lastMined = 0;
        this.capacity = 10;
        this.speed = 1;

        //status
        this.selected = false;
        this.returning = false;
        this.isMining = false;
        this.movingToAsteroid = false;
        this.asteroidClicked = false;
        this.miningTarget = 'none';
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
        this.stationarySpread();
        this.animationUpdate();
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
                    this.miningTarget = 'none';
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

    stationarySpread() {
        for (let i = 0; i < miningShips.length; i++) {
            if (this !== miningShips[i]) {
                let overlappingMiningShip = dist(this.sprite.x, this.sprite.y, miningShips[i].sprite.x, miningShips[i].sprite.y) <= this.sprite.d * 2;
                let overlappingMothership = dist(this.sprite.x, this.sprite.y, mothership.sprite.x, mothership.sprite.y) <= this.sprite.d * 2;
                if ((overlappingMiningShip || overlappingMothership) && this.sprite.speed === 0) {
                    let dir = createVector(this.sprite.x - miningShips[i].sprite.x, this.sprite.y - miningShips[i].sprite.y);
                    dir.setMag(0.2);
                    this.sprite.x += dir.x;
                    this.sprite.y += dir.y;
                }
            }
        }
    }

    animationUpdate() {
        this.sprite.ani.scale = 1.5;
        this.sprite.text = this.resource;
        this.sprite.rotateTowards(this.sprite.direction, 0.05);
        if (this.selected) {
            this.sprite.ani = 'selected';
        } else {
            this.sprite.ani = 'default';
        }
    }
}