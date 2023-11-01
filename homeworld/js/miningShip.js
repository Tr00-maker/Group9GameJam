class MiningShip extends PlayerShip {
    constructor(x, y) {
        const defaultSpeed = 1;
        const defaultHealth = 100;
        super(x, y, defaultSpeed, defaultHealth); 

        this.sprite.d = 20;
        this.sprite.addAni('default', miningShipImg);
        this.sprite.addAni('selected', miningShipSelectedImg);
        this.name = 'Mining Ship';

        this.initializeResources();
        this.initializeStatus();
    }

    initializeResources() {
        this.resource = 0;
        this.lastMined = 0;
        this.capacity = 10;
        this.miningRate = 2;
        this.sprite.text = this.resource;
        this.sprite.textColor = 'white';
        this.sprite.textSize = 20;
    }

    initializeStatus() {
        this.selected = false;
        this.returning = false;
        this.isMining = false;
        this.movingToAsteroid = false;
        this.asteroidClicked = false;
        this.miningTarget = 'none';
    }

    update() {
        super.update();
        this.handleDestination();
        this.handleReturning();
        this.returnFromInactiveAsteroid();
        this.checkOverlapAndSpread(); 
        this.updateAnimation();
    }

    handleDestination() {
        if (this.movingToAsteroid && this.miningTarget && this.sprite.speed != 0) {
            this.setTargetVector(this.miningTarget.sprite.x, this.miningTarget.sprite.y);
            this.sprite.move(this.distance, this.direction, this.speed);
        }
    
        if (this.returning && mothership) {
            this.setTargetVector(mothership.sprite.x, mothership.sprite.y);
            this.sprite.move(this.distance, this.direction, this.speed);
        }
        
        if (!this.selected) return;
    
        if (mouse.pressed(RIGHT)) {
            for (let asteroid of asteroids) {
                if (asteroid.sprite.mouse.pressed(RIGHT)) {
                    this.setMiningTarget(asteroid);
                    return;
                }
            }

            this.clearMiningTarget();
        }
    }    

    setMiningTarget(asteroid) {
        this.setTargetVector(asteroid.sprite.x, asteroid.sprite.y);
        this.miningTarget = asteroid;
        this.sprite.move(this.distance, this.direction, this.speed);
        this.movingToAsteroid = true;
        this.returning = false;
        this.asteroidClicked = true;
    }

    clearMiningTarget() {
        this.setTargetVector(mouseX, mouseY);
        this.miningTarget = 'none';
        this.sprite.move(this.distance, this.direction, this.speed);
        this.returning = false;
        this.isMining = false;
        this.movingToAsteroid = false;
    }
      

    handleReturning() {
        if (this.miningTarget && !this.miningTarget.active) {
            this.miningTarget = 'none';
        }
    
        if (this.returning && dist(this.sprite.x, this.sprite.y, mothership.sprite.x, mothership.sprite.y) <= 100) {
            this.sprite.speed = 0;
            this.returning = false;
            if (this.miningTarget !== 'none') {
                this.returnToAsteroid(this.miningTarget);
            }
        }
    }
    
    shouldReturn() {
        return (this.isMining || this.movingToAsteroid) && this.miningTarget === 'none';
    }

    checkOverlapAndSpread() {
        for (let ship of miningShips) {
            if (this === ship) continue;
            
            const distToShip = dist(this.sprite.x, this.sprite.y, ship.sprite.x, ship.sprite.y);
            const distToMothership = dist(this.sprite.x, this.sprite.y, mothership.sprite.x, mothership.sprite.y);
            
            if (this.sprite.speed === 0 && (distToShip <= this.sprite.d * 2 || distToMothership <= this.sprite.d * 2)) {
                let dir = createVector(this.sprite.x - ship.sprite.x, this.sprite.y - ship.sprite.y);
                dir.setMag(0.2);
                this.sprite.x += dir.x;
                this.sprite.y += dir.y;
            }
        }
    }

    updateAnimation() {
        this.sprite.ani.scale = 1.5;
        this.sprite.text = this.resource;

    }

    setTargetVector(x, y) {
        this.target = createVector(x, y);
        this.directionVector = p5.Vector.sub(this.target, createVector(this.sprite.x, this.sprite.y));
        this.sprite.direction = this.direction;
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
                if (this.resource === this.capacity && !this.returning) {
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
        if (!this.returning && dist(this.sprite.x, this.sprite.y, destination.sprite.x, destination.sprite.y) > 100) {
            this.returning = true;
            this.sprite.moveTo(destination.sprite, this.speed);
        }
    }    

    returnFromInactiveAsteroid() {
        if ((this.isMining || this.movingToAsteroid) && this.miningTarget === 'none') {
            this.returnToMothership(mothership);
            this.returning = true;
            this.isMining = false;
            this.movingToAsteroid = false;
        }
    }
}
