class MiningShip extends PlayerShip {
    constructor(x, y) {
        const defaultSpeed = 0.75;
        const defaultHealth = 100;
        const defaultRange = 100;

        super(x, y, defaultSpeed, defaultHealth, defaultRange); 

        this.sprite.addAni('default', miningShipImg);
        this.sprite.addAni('selected', miningShipSelectedImg);
        this.sprite.d = 20;
        
        this.name = 'Mining Ship';
        this.detectionRange = this.range*1.5;
        this.initializeResources();
    }

    initializeResources() {
        this.resource = 0;
        this.scrap = 0;
        this.lastMined = 0;
        this.capacity = 10;
        this.miningRate = 0.5;
        this.sprite.text = this.resource + ' ' + this.scrap;
        this.sprite.textColor = 'white';
        this.sprite.textSize = 10;
    }

    update() {
        super.update();
        let mothershipRange = dist(mothership.sprite.x, mothership.sprite.y, this.sprite.x, this.sprite.y);
        if (mothershipRange <= this.range) {
            this.depositResource();
        }
        this.updateAnimation();
    }

    updateAnimation() {
        this.sprite.ani.scale = 1.5;
        this.sprite.text = this.resource + ' ' + this.scrap;

    }

    showUI() {

    }

    removeUI() {

    }

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

    //minging ship resource gathering logic
    handleMiningLogic(target) {
        let targetRange = dist(target.sprite.x, target.sprite.y, this.sprite.x, this.sprite.y);

        if (this.resource < this.capacity && targetRange < this.range) {
            this.mineTarget(target);
            this.handleMoveToTarget();
        }

        if (this.resource < this.capacity && targetRange > this.range) {
            this.handleMoveToTarget();
        }

        if (this.resource === this.capacity || !target.active) {
            this.returnToMothership();
        }

        if (!this.targetSprite.active) {
            this.targetSprite = null;
        }

    }

    //return miners to mothership
    returnToMothership() {
        let mothershipRange = dist(mothership.sprite.x, mothership.sprite.y, this.sprite.x, this.sprite.y);
        
        if (mothershipRange > this.range) {
            this.setTarget(mothership.sprite.x, mothership.sprite.y);
            this.sprite.rotateTo(this.target, this.rotationSpeed);
            this.sprite.move(this.distance, this.direction, this.speed);
        } 

        if (mothershipRange <= this.range) {
            if (this.targetSprite === null) {
                this.sprite.speed = 0;
                this.state = 'idle';
            }
        }

    }
    
    depositResource() {
        mothership.resource += this.resource;
        mothership.scrap += this.scrap;
        this.resource = 0;
        this.scrap = 0;
    }
}
