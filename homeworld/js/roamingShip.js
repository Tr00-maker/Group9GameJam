//neutral ship that roams freely - can be destroyed to obtain ship scraps
class RoamingShip {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.speed = 0.3;
        this.health = 200;
        this.range = 200;
        this.x = null;
        this.y = null;
        
        this.sprite.addAni('default', roamingShipImg);
        this.sprite.addAni('selected', roamingShipSelectedImg);
        this.sprite.d = 50;

        targetableSprites.push(this);
        enemyUnits.push(this);
        this.sprite.overlaps(allSprites);
        this.sprite.layer = 1;

        this.sprite.debug = true;
        this.name = 'Roaming Ship';

        this.initializeStats();
    }

    initializeStats() {
        this.inPatrol = false;
        this.active = true;
   
    }

    update() {
        if (mothership.targetSprite === this) {
            console.log('targeted');
        }
        //save the x and y coords for when the ship is destoryed to spawn an explosion and ship scrap

        if (this.health <= 0) {
            this.dies(this.x, this.y);
        }
        this.handlePatrol();
        this.updateAnimation();
        this.showTarget();
    }

    updateAnimation() {
        this.sprite.ani.scale = 2.2;
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

    takeDamage(damage) {
        this.health -= damage;
        this.x = this.sprite.x;
        this.y = this.sprite.y;
    }

    //when ships die, the drop a random amount of ship scraps (1- 10) and create an explosion
    dies(x, y) {
        this.active = false;
        let scrapCount = floor(random(1, 3));

        for (let i = 0; i < scrapCount; i++) {
            shipScraps.push(new ShipScrap(x + random() * 20 - 10, y + random() * 20 - 10));
        }
        explosions.push(new Explosion(x, y, explosionShipAni));

        roamingShipController.enemyCurrent--;
        this.index = enemyUnits.indexOf(this);
        if (this.index != -1) {
            enemyUnits.splice(this.index, 1);
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
        if (this.enemyCurrent < this.eenmyMax) {
            this.spawnRoamingShip();
        }
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
            const { spawnX, spawnY} = this.randomSpawnCoords();
            enemyUnits.push(new RoamingShip(spawnX, spawnY));
            this.enemyCurrent++
            this.lastEnemy = Date.now();
        }
    }
}