
class MiningShipUnit extends EnemyUnit {
    constructor(x, y) {
        const defaultSpeed = 0.75;
        const defaultHealth = 100;
        const defaultRange = 100;
        super(x, y, defaultSpeed, defaultHealth, defaultRange);
        miningShipUnits.push(this);
        this.name = 'Mining Ship Unit';
        
        this.detectionRange = this.range*1.5;
        this.sprite.addAni('default', miningShipUnitImg);
        this.sprite.addAni('selected', miningShipUnitSelectedImg);
        this.sprite.d = 30;

        this.initializeResources();
        
    }

    initializeResources() {
        this.resource = 0;
        this.lastMined = 0;
        this.capacity = 10;
        this.miningRate = 0.5;
        this.sprite.text = this.resource;
        this.sprite.textColor = 'white';
        this.sprite.textSize = 20;
    }

    update() {
        super.update();
        this.updateAnimation();
        this.findClosestAsteroid();
        this.sprite.text = this.resource;

        let mothershipRange = dist(mothershipUnit.sprite.x, mothershipUnit.sprite.y, this.sprite.x, this.sprite.y);
        if (mothershipRange <= this.range) {
            this.depositResource();
        }
    }

    updateAnimation() {
        this.sprite.ani.scale = 1.5;
    }

    //constantly searches for the closest asteroid and restes the mingin ships target to that
    findClosestAsteroid() {
        let closestDistance = Number.MAX_VALUE;
        let closestAsteroid = null;

        for (let asteroid of asteroids) {
            let currentDistance = dist(this.sprite.x, this.sprite.y, asteroid.sprite.x, asteroid.sprite.y);
            if (currentDistance < closestDistance) {
                closestDistance = currentDistance;
                closestAsteroid = asteroid;
            }
        }

        if (closestAsteroid) {
            this.targetSprite = closestAsteroid;
            this.state = 'mining';
        } else {
            this.targetSprite = null;
            this.state = 'idle';
        }
    }

    //minging ship resource gathering logic
    handleMiningLogic(target) {
        let targetRange = dist(target.sprite.x, target.sprite.y, this.sprite.x, this.sprite.y);

        if (this.resource < this.capacity && targetRange < this.range) {
            this.mineTarget(target);
            this.handleMoveToAsteroid();
        }

        if (this.resource < this.capacity && targetRange > this.range) {
            this.handleMoveToAsteroid();
        }

        if (this.resource === this.capacity || !target.active) {
            this.returnToMothership();
        }

        if (!this.targetSprite.active) {
            this.targetSprite = null;
        }

    }

    //handle moving the mining ship to and from asteroids logic
    handleMoveToAsteroid() {
        if (this.targetSprite) {
            this.setTarget(this.targetSprite.sprite.x, this.targetSprite.sprite.y);
            this.sprite.rotateTo(this.target, this.rotationSpeed);
    
            if (!this.onTarget) {
                this.sprite.move(this.distance, this.direction, this.speed);
            } else if (this.onTarget && this.sprite.speed != 0) {
                this.sprite.speed -=0.1;
                this.handleEnemyUnitSpread();
            }
    
            if (dist(this.sprite.x, this.sprite.y, this.targetSprite.sprite.x, this.targetSprite.sprite.y) < this.range) {
                this.onTarget = true;
            } else {
                this.onTarget = false;
            }
            
        } else {
            this.onTarget = false;
        }
    }

    //return miners to mothership
    returnToMothership() {
        let mothershipRange = dist(mothershipUnit.sprite.x, mothershipUnit.sprite.y, this.sprite.x, this.sprite.y);
        
        if (mothershipRange > this.range) {

            this.sprite.rotateTo(mothershipUnit.sprite, this.rotationSpeed);
            this.sprite.moveTo(mothershipUnit.sprite, this.speed);
        } 

        if (mothershipRange <= this.range) {
            return;
        }

    }
    
    //mines the asteroid
    mineTarget(target) {
        const currentTime = Date.now();
        const miningDelay = 1000/this.miningRate

        if (currentTime - this.lastMined >= miningDelay) {
            if (this.resource < this.capacity) {
                this.resource += 1;
                target.resource -= 1;
                this.lastMined = currentTime;
            }
        }
    }

    //deposits the mining ships resources to the mothership
    depositResource() {
        mothershipUnit.resource += this.resource;
        this.resource = 0;
    }

}