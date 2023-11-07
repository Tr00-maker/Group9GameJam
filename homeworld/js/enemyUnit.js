class EnemyUnit {
    constructor(x, y, speed, health, range) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.layer = 2;

        this.speed = speed;
        this.health = health;
        this.range = range;
        this.rotationSpeed = this.speed*3;

        this.sprite.debug = false;
        targetableSprites.push(this);
        enemyUnits.push(this);
        this.sprite.overlaps(allSprites);

        this.sprite.direction = 0;
        this.sprite.speed = this.speed;

        this.active = true;
        this.inPatrol = false;

        this.state = 'idle';
    }

    update() {
        this.showTarget();    

        switch(this.state) {
            case 'idle':
                this.handleIdle();
                break;
            case 'combat':
                this.handleCombat();
                break;
            case 'mining':
                this.handleMiningLogic(this.targetSprite);
                break;
            case 'patrol':
                this.handlePatrol();
                break;
        }
    }

    //set the target vector
    setTarget(x, y) {
        this.target = createVector(x, y);
        this.directionVector = p5.Vector.sub(this.target, createVector(this.sprite.x, this.sprite.y));
        this.direction = this.directionVector.heading();
        this.distance = this.directionVector.mag(); 
        this.state = 'hasTarget';
    }

    //sets a target destination
    setSpriteTarget(target) {
        this.setTarget(target.sprite.x, target.sprite.y);
        this.targetSprite = target;
        this.autoTarget = false;
    }

    //basic patrol method - change this to whatever
    async handlePatrol() {
        if (this.inPatrol) return;
        this.inPatrol = true;

        let x = random(0, width - 300);
        let y = random(0, height - 300);
    
        this.sprite.rotateTo(x, y, this.rotationSpeed);
        await this.sprite.moveTo(x, y, this.speed);
        
        this.inPatrol = false;
        // After the moveTo is complete, call handlePatrol again if still in patrol state
        if (this.state === 'patrol') {
            this.handlePatrol();
        }
    }
    
    // shows this sprite as the target sprite when a selected player ship is targeting it
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

    //stops sprite in idle state
    handleIdle() {
        this.sprite.speed = 0;
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


class MothershipUnit extends EnemyUnit {
    constructor(x, y) {
        const defaultSpeed = 0.2;
        const defaultHealth = 2000;
        super(x, y, defaultSpeed, defaultHealth);
        
        this.name = 'Mothership Unit';
        
        this.sprite.addAni('default', mothershipUnitUnitImg);
        this.sprite.addAni('selected', shootingUnitSelectedImg);
        this.sprite.d = 70;

        this.resource = 0;
        this.sprite.text = this.resource;
        this.sprite.textColor = 'white';
        this.sprite.textSize = 20;
    }

    update() {
        super.update();

        this.spawnUnits();
        
        this.sprite.text = this.resource;
        if (!this.closestShip) {
            this.state = 'patrol';
        }

        this.updateAnimation();
    }

    updateAnimation() {
        this.sprite.ani.scale = 3;
    }

    //spawns a mining ship every 5 enemy units, else it spawn a shooting ship
    spawnUnits() {
        if (this.resource >= miningShipCost) {
            if (enemyUnits.length % 5 === 0) {
                this.resource -= miningShipCost;  // Deduct the cost for mining ship
                enemyUnits.push(new MiningShipUnit(this.sprite.x + (random() * 200 - 100), this.sprite.y + (random() * 200 - 100)));
            } else {
                this.resource -= miningShipCost;  // Deduct the cost for shooting unit, assuming it has a different cost
                enemyUnits.push(new ShootingUnit(this.sprite.x + (random() * 200 - 100), this.sprite.y + (random() * 200 - 100)));
            }
        }
    }
    

}

class ShootingUnit extends EnemyUnit {
    constructor(x, y) {
        const defaultSpeed = 0.5;
        const defaultHealth = 100;
        const defaultRange = 200;
        super(x, y, defaultSpeed, defaultHealth, defaultRange);
        
        this.name = 'Shooting Unit';
        this.detectionRange = this.range*1.5;
        this.sprite.addAni('default', shootingUnitImg);
        this.sprite.addAni('selected', shootingUnitSelectedImg);
        this.sprite.d = 30;

        this.closestShip = null;
        this.fireRate = 0.5;
        this.lastFired = 0;
        this.shotSpeed = 3;
        this.damage = 5;
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
        if (distToClosestShip < this.detetetionRange && distToClosestShip > this.detetetionRange/1.2) {
            this.sprite.moveTo(this.closestShip.sprite, this.speed);
        } else if (distToClosestShip < this.detetetionRange/1.2 && distToClosestShip > this.range) {
            this.sprite.attractTo(this.closestShip.sprite, this.speed/3);
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
            this.state = 'patrol';
        }
        console.log('detecting combat ' + this.closestShip)
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