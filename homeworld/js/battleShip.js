class BattleShip extends PlayerShip {
    constructor(x, y) {
        const defaultSpeed = playerUpgradeController.battleShipStat.speed;
        const defaultHealth = playerUpgradeController.battleShipStat.health;
        const defaultRange = playerUpgradeController.battleShipStat.range;
        const defaultSize = playerUpgradeController.battleShipStat.size;

        super(x, y, defaultSpeed, defaultHealth, defaultRange); 
        
        this.sprite.addAni('default', battleShipImg);
        this.sprite.addAni('selected', battleShipSelectedImg);
        this.sprite.d = defaultSize;

        battleShips.push(this);
        
        this.name = 'Battle Ship';

        this.initializeStats();
    }

    initializeStats() {
        this.fireRate = playerUpgradeController.battleShipStat.fireRate;
        this.shotSpeed = playerUpgradeController.battleShipStat.shotSpeed;
        this.damage = playerUpgradeController.battleShipStat.damage;
        this.lastFired = 0;
    }

    update() {
        super.update();
        this.updateAnimation();
        this.findClosestUnit();
    }

    updateAnimation() {
        this.sprite.ani.scale = this.sprite.d / 20;
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
            if (closestDistance < this.detectionRange) { 
                this.targetSprite = closestShip;
                this.autoTarget = true; //set to true on setMouseTarget() - right clicking not on a sprite and false when setSpriteTarget() method is run in PlayerShip class
            } else {
                this.targetSprite = null;
                this.state = 'idle';
            }
        }

        for (let enemy of enemyUnits) {
            if (this.targetSprite && this.targetSprite === closestShip) {
                this.state = 'hasTarget';
                this.checkOnTarget();
                //if target is set to a non enemy eg. asteroid wait unti the sprite reaches the target, then set autoTarget to true 
            } else if(this.targetSprite && this.targetSprite !== enemy && (this.state === 'idle' || this.state === 'hasTarget' && this.sprite.speed === 0)) {
                this.autoTarget = true;
            }
        }
    }

    checkOnTarget() {
        if (this.onTarget) {
            this.shoot();
        }
    }
}