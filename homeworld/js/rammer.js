class EnemyDread extends EnemyUnit {
    constructor(x, y) {
        const defaultSpeed = 0.2;
        const defaultHealth = 1800;
        const defaultRange = 400;
        super(x, y, defaultSpeed, defaultHealth, defaultRange);
        
        this.name = 'Shooting Unit';
        this.detectionRange = this.range*1.5;
        this.sprite.addAni('default', shootingUnitImg);
        this.sprite.addAni('selected', shootingUnitSelectedImg);
        this.sprite.d = 50;

        this.closestShip = null;
        this.fireRate = 0.4;
        this.lastFired = 0;
        this.shotSpeed = 12;
        this.damage = 20;
    }

    update() {
        super.update();
        this.handleDetectCombat(); 
        this.updateAnimation();
    }

    updateAnimation() {
        this.sprite.ani.scale = 1.5;
    }

    //moves and shoots while in combat - modify it to whatver you like
    handleCombat() {
        this.sprite.rotateTo(this.closestShip.sprite, this.rotaionSpeed);

        let distToClosestShip = dist(this.sprite.x, this.sprite.y, this.closestShip.sprite.x, this.closestShip.sprite.y);

        //at max range move toward player ships
        if (distToClosestShip < this.detectionRange && distToClosestShip > this.detectionRange/1.2) {
            this.sprite.moveTo(this.closestShip.sprite, this.speed);
        } else if (distToClosestShip < this.detectionRange && distToClosestShip > this.range) {
            this.sprite.attractTo(this.closestShip.sprite, 0.3*(this.speed/3));
        } else if (distToClosestShip < this.range) {
            this.shoot();
            this.handlePlayerShipSpread();
        }
    }

    //constantly checks for player ships in the detenction range and switches in or out of combat state
    handleDetectCombat() {
        let closestDistance = Number.MAX_VALUE;
        let closestShip = null;
        
        for (let ship of selectableSprites) {
            let currentDistance = dist(this.sprite.x, this.sprite.y, ship.sprite.x, ship.sprite.y);
            if (currentDistance < closestDistance) {
                closestDistance = currentDistance;
                closestShip = ship;
            }
        }
        if(closestShip != null)
        {
            let distToClosestUnit = dist(this.sprite.x, this.sprite.y, closestShip.sprite.x, closestShip.sprite.y);

            if (distToClosestUnit < this.detectionRange) {
                this.closestShip = closestShip;
                this.state = 'combat';
            } else {
                this.closestShip = null;
                this.state = 'patrol';
            }
            if (this.closestShip) {

                console.log('detecting combat ' + this.closestShip);
            }
        }
        
    }

    //shoots at the units rotation
    shoot() {
        if (this.closestShip) {
            const currentTime = Date.now();
            const shotDelay = 1000/this.fireRate;

            if (currentTime - this.lastFired >= shotDelay) {
                enemyProjectiles.push(new Projectile(
                    this.sprite.x + this.sprite.d * cos(this.sprite.rotation), 
                    this.sprite.y + this.sprite.d * sin(this.sprite.rotation), 
                    this.sprite.rotation, 
                    this.shotSpeed, 
                    this.damage, 10, 
                    redBulletImg, 
                    enemyProjectiles));
                this.lastFired = currentTime;
            }
        }
    }
}