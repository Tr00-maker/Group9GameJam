class EnemyUnit {
    constructor(x, y, speed, health, range) {
        this.sprite = new Sprite(x, y, 'd');

        this.speed = speed;
        this.health = health;
        this.range = 200;
        this.detetctionRange = this.range*2;
        this.rotationSpeed = this.speed*3;

        this.sprite.debug = true;

        targetableSprites.push(this);
        this.sprite.overlaps(allSprites);

        this.sprite.direction = 0;
        this.sprite.speed = this.speed;

        this.active = true;

        this.closestShip = null;

        this.state = 'idle';

        this.fireRate = 0.5;
        this.lastFired = 0;
        this.shotSpeed = 3;
        this.damage = 5;
    }

    update() {
        this.showTarget();
        this.handleDetectCombat();     

        switch(this.state) {
            case 'idle':
                this.handleIdle();
                break;
            case 'combat':
                this.handleCombat();
                break;
        }
    }
    
    showTarget() {
        this.sprite.ani = 'default';

        for (let i = 0; i < selectableSprites.length; i++) {
            if (selectableSprites[i].selected && selectableSprites[i].targetSprite === this) {
                this.sprite.ani = 'selected';
                break;
            }
        }
    }

    takeDamage(x, y, damage, radius) {
        this.health -= damage;
        console.log('damage taken');
        if (this.health <= 0) {
            //explosions.push(new explosion(x, y, damage)) add later
            this.dies();
        }
    }

    dies() {
        this.active = false;
        setTimeout(() => {
            this.sprite.remove();
            this.index = enemyUnits.indexOf(this)
            if (this.index != -1) {
                enemyUnits.splice(this.index, 1);
            }
        }, 100);
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

    //stops sprite in idle state
    handleIdle() {
        this.sprite.speed = 0;
        this.handleDetectCombat();
    }

    //moves and shoots while in combat state
    handleCombat() {
        this.sprite.rotateTo(this.closestShip.sprite, this.rotaionSpeed);

        let distToClosestShip = dist(this.sprite.x, this.sprite.y, this.closestShip.sprite.x, this.closestShip.sprite.y);

        //at max range move toward player ships
        if (distToClosestShip < this.detetctionRange && distToClosestShip > this.detetctionRange/1.2) {
            this.sprite.moveTo(this.closestShip.sprite, this.speed);
        } else if (distToClosestShip < this.detetctionRange/1.2 && distToClosestShip > this.range) {
            this.sprite.attractTo(this.closestShip.sprite, this.speed);
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

        let distToClosestUnit = dist(this.sprite.x, this.sprite.y, closestShip.sprite.x, closestShip.sprite.y);

        if (distToClosestUnit < this.detetctionRange) {
            this.closestShip = closestShip;
            this.state = 'combat';
        } else {
            this.closestShip = null;
            this.state = 'idle';
        }
    }

    //moves away from player ships when too close
    handlePlayerShipSpread() {
        for (let i = selectableSprites.length - 1; i >= 0; i--) {
            let ship = selectableSprites[i];
            let dir = createVector(this.sprite.x - ship.sprite.x, this.sprite.y - ship.sprite.y);
            dir.setMag(0.2);
            this.sprite.x += dir.x;
            this.sprite.y += dir.y;
        }
    }

    //spread apart from other enemy units when stacked
    handleEnemyUnitSpread() {
        for (let i = enemyUnits.length - 1; i >= 0; i--) {
            let unit = enemyUnits[i];
            if (this !== unit) {

                const distToUnit = dist(this.sprite.x, this.sprite.y, unit.sprite.x, unit.sprite.y);
                
                if ((this.sprite.speed === 0 || this.closestShip) && (distToUnit <= this.sprite.d)) {
                    let dir = createVector(this.sprite.x - unit.sprite.x, this.sprite.y - unit.sprite.y);
                    dir.setMag(0.2);
                    this.sprite.x += dir.x;
                    this.sprite.y += dir.y;
                }

            }        
        }
    }
}

class ShootingUnit extends EnemyUnit {
    constructor(x, y) {
        const defaultSpeed = 0.3;
        const defaultHealth = 100;
        super(x, y, defaultSpeed, defaultHealth);
        this.sprite.d = 30;
        
        this.name = 'Shooting Unit';

        this.sprite.addAni('default', shootingUnitImg);
        this.sprite.addAni('selected', shootingUnitDamagedImg);
    }

    update() {
        super.update();
        this.updateAnimation();
    }

    updateAnimation() {
        this.sprite.ani.scale = 1.5;
    }

}