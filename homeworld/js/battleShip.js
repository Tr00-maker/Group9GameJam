class BattleShip extends PlayerShip {
    constructor(x, y) {
        const defaultSpeed = 0.8;
        const defaultHealth = 200;
        const defaultRange = 200;

        super(x, y, defaultSpeed, defaultHealth, defaultRange); 
        
        this.sprite.addAni('default', battleShipImg);
        this.sprite.addAni('selected', battleShipSelectedImg);
        this.sprite.d = 30;

        this.name = 'Battle Ship';

        this.initializeStats();
    }

    initializeStats() {
        this.fireRate = 1;
        this.lastFired = 0;
        this.shotSpeed = 5;
        this.damage = 10;
        this.detetctionRange = this.range*1.5; // set the distance that the ships can detect enemies
    }

    update() {
        super.update();
        this.findClosestUnit();
    }

    updateAnimation() {
        this.sprite.ani.scale = 1.5;
    }

    showUI() {
        
    }

    removeUI() {
        
    }

    shoot() {
        const currentTime = Date.now();
        const shotDelay = 1000/this.fireRate;

        if (currentTime - this.lastFired >= shotDelay) {
            playerProjectiles.push(new Projectile(
                this.sprite.x + this.sprite.d * cos(this.sprite.rotation), 
                this.sprite.y + this.sprite.d * sin(this.sprite.rotation), 
                this.sprite.rotation, 
                this.shotSpeed, 
                this.damage, 10/* radius*/, 
                tealBulletImg, 
                playerProjectiles));
            this.lastFired = currentTime;
        }
    }

    //finds nearest enemy unit
    findClosestUnit() {
        let closestDistance = Number.MAX_VALUE;
        let closestShip = null;

        for (let ship of enemyUnits) {
            let currentDistance = dist(this.sprite.x, this.sprite.y, ship.sprite.x, ship.sprite.y);
            if (currentDistance < closestDistance) {
                closestDistance = currentDistance;
                closestShip = ship;
            }
        }

        if ((!this.targetSprite || this.autoTarget) && (this.state === 'idle' || this.state === 'hasTarget' && this.sprite.speed === 0)) {
            if (closestDistance < this.detetctionRange) { 
                this.targetSprite = closestShip;
                this.autoTarget = true; //set to true on setMouseTarget() - right clicking not on a sprite and false when setSpriteTarget() method is run in PlayerShip class
            } else {
                this.targetSprite = null;
                this.state = 'idle';
            }
        }

        if (this.targetSprite && this.targetSprite === closestShip) {
            this.state = 'hasTarget';
            this.checkOnTarget();
            //if target is set to a non enemy eg. asteroid wait unti the sprite reaches the target, then set autoTarget to true 
        } else if(this.targetSprite && this.targetSprite !== closestShip && (this.state === 'idle' || this.state === 'hasTarget' && this.sprite.speed === 0)) {
            this.autoTarget = true;
        }
    }

    checkOnTarget() {
        if (this.onTarget) {
            this.shoot();
        }
    }
}