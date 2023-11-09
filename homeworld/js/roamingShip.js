//neutral ship that roams freely - can be destroyed to obtain ship scraps
class RoamingShip {
    constructor(x, y) {
        const defaultSpeed = 0.3;
        const defaultHealth = 200;
        const defaultRange = 200;

        super(x, y, defaultSpeed, defaultHealth, defaultRange); 
        
        this.sprite.addAni('default', roamingShipImg);
        this.sprite.addAni('selected', roamingShipSelectedImg);
        this.sprite.d = 30;

        targetableSprites.add(this);
        this.sprite.overlaps(allSprites);
        this.sprite.layer = 1;

        this.name = 'Roaming Ship';

        this.initializeStats();
    }

    initializeStats() {
        this.inPatrol = false
        
    }

    update() {
        if (this.health <= 0) {
            this.dies();
        }
        super.update();
        this.handlePatrol();
    }

    updateAnimation() {
        this.sprite.ani.scale = 2.2;
    }

    dies() {
        this.active = false;
        explosions.push(new Explosion(this.sprite.x, this.sprite.y, explosionShipAni));
        shipscraps.push(new ShipScrap(this.sprite.x, this.sprite.y));
        this.index = roamingShips.indexOf(this);
        if (this.index != -1) {
            roamingShips.splice(this.index, 1);
        }
        this.sprite.remove();
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
        this.handlePatrol();
    }
}

//controlls the automatic spawning of roaming ships during gameplay
class RoamingShipController {
    constructor(timer, max) {
        this.enemyTimer = timer;
        this.enemyMax = max;
        this.enemyCurrent = 0;
        this.lastEnemy = Date.now();

        this.stopped = false;
    }

    update() {
        this.spawnRoamingShip();
    }

    //set spawning location
    randomSpawnCoords() {
        let spawnX, spawnY;
        switch (floor(random(0, 8))) {
            case 0: // Top left
                spawnX = random(0, width/2);
                spawnY = 0;
                break;
                
            case 1: // Left top
                spawnX = 0;
                spawnY = random(0, height/2);
                break;
                
            case 2: // Bottom left
                spawnX = random(0, width/2);
                spawnY = height;
                break;
                
            case 3: // left bottom
                spawnX = width; 
                spawnY = random(0, height/2);
                break;

            case 4: // Top Right
                spawnX = random(width/2, width);
                spawnY = 0;
                break;
                
            case 5: // Right Top
                spawnX = 0;
                spawnY = random(height/2, height);
                break;
                
            case 6: // Bottom Right
                spawnX = random(width/2, width);
                spawnY = height;
                break;
                
            case 7: // Right Bottom
                spawnX = width; 
                spawnY = random(height/2, height);
                break;
        }
        
        return { spawnX, spawnY };
    }

    spawnRoamingShip() {
        const currentTime = Date.now();

        if (currentTime - this.lastEnemy >= this.enemyTimer) {
            roamingShips.push(new RoamingShip(spawnX, spawnY));
            this.lastEnemy = Date.now();
        }
    }
}