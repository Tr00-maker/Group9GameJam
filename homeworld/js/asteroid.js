class Asteroid {
    constructor(x, y, direction) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.layer = 0;
        this.sprite.d = 125;
        this.sprite.color = 'grey';
        targetableSprites.push(this);
        asteroids.push(this);

        for (let s of selectableSprites){
            for (let e of enemyUnits) {
                for (let a of asteroids) {
                    this.sprite.overlaps(s.sprite);
                    this.sprite.overlaps(e.sprite);
                    this.sprite.overlaps(a.sprite);
                }
            }
        }
        this.sprite.overlaps(bCT);
        this.sprite.overlaps(bCL);
        this.sprite.overlaps(bCB);
        this.sprite.overlaps(bCR);

        this.sprite.direction = direction;
        this.speed = random(0.1, 0.5);
        this.sprite.speed = this.speed;

        this.resource = 200;
        this.sprite.textColor = 'white';
        this.sprite.textSize = 20;
        this.sprite.text = this.resource;
        
        this.active = true;

        this.sprite.addAni('default', asteroidImg);
        this.sprite.addAni('selected', miningTargetImg);
        this.sprite.addAni('dies', asteroidDiesAni);
        this.sprite.changeAni('default');
        this.sprite.ani.frame = 0;

        this.sprite.debug = false;
    }

    update() {
        this.sprite.ani.scale = 3;
        this.sprite.rotation += 0.5 * this.sprite.speed;
        this.sprite.text = this.resource;
        this.showTarget();
        
        if (this.sprite.collides(bT) || this.sprite.collides(bL) || this.sprite.collides(bB) || this.sprite.collides(bR)) {
            this.sprite.remove();
            asteroidController.enemyCurrent--;
            this.index = asteroids.indexOf(this)
            if (this.index != -1) {
                asteroids.splice(this.index, 1);
            }
        }
        if (this.resource <= 0) {
            this.dies();                    
        }

        this.sprite.speed = this.speed;

        for (let ship of miningShips) {
            let distance = dist(this.sprite.x, this.sprite.y, ship.sprite.x, ship.sprite.y);
            if (distance < ship.detectionRange) {
                // If within range of a mining ship, slow down and stop checking
                this.sprite.speed = 0.05;
                break;
            } 
        }

        for (let ship of miningShipUnits) {
            let distance = dist(this.sprite.x, this.sprite.y, ship.sprite.x, ship.sprite.y);
            if (distance < ship.detectionRange) {
                // If within range of a mining ship, slow down and stop checking
                this.sprite.speed = 0.05;
                break;
            } 
        }
    }
    
    transferResource(miningShip) {
        if (this.resource > 0) {
            miningShip.mineTarget(this);
        } else {
            this.dies();                    
        }
    }
    
    dies() {
        console.log('ast col b and dies');
        this.active = false;
        this.sprite.changeAni('dies');
        if (this.sprite.ani.frame === 6) {
            this.sprite.remove();
            asteroidController.enemyCurrent--;
            this.index = asteroids.indexOf(this)
            if (this.index != -1) {
                asteroids.splice(this.index, 1);
            }
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
}

class AsteroidController {
    constructor(timer, max) {
        this.enemyTimer = timer;
        this.enemyMax = max;
        this.enemyCurrent = 0;
        this.lastEnemy = Date.now();

        this.stopped = false;
    }

    update() {
        if (this.enemyCurrent < this.enemyMax) {
            this.spawnAsteroid();
        }
    }

    randomSpawnCoords() {
        let spawnX, spawnY, direction;
        switch (floor(random(0, 8))) {
            case 0: // Top left
                spawnX = random(100, width/2);
                spawnY = 100;
                direction = random(20, 70);
                break;
                
            case 1: // Left top
                spawnX = 100;
                spawnY = random(100, height/2);
                direction = random(20, 70);
                break;
                
            case 2: // Bottom left
                spawnX = random(100, width/2);
                spawnY = height;
                direction = random(290, 340);
                break;
                
            case 3: // left bottom
                spawnX = width; 
                spawnY = random(100, height/2);
                direction = random(290, 340);
                break;

            case 4: // Top right
                spawnX = random(width/2, width - 100);
                spawnY = 100;
                direction = random(110, 160);
                break;
                
            case 5: // right top
                spawnX = width;
                spawnY = random(100, height/2);
                direction = random(110, 160);
                break;
                
            case 6: // Bottom right
                spawnX = random(width/2, width - 100);
                spawnY = height;
                direction = random(200, 250);
                break;
                
            case 7: // Right bottom
                spawnX = width; 
                spawnY = random(height/2, height - 100);
                direction = random(200, 250);
                break;
        }
        
        return { spawnX, spawnY, direction };
    }

    spawnAsteroid() {
        const currentTime = Date.now();

        if (currentTime - this.lastEnemy >= this.enemyTimer) {
            const { spawnX, spawnY, direction } = this.randomSpawnCoords();
            asteroids.push(new Asteroid(spawnX, spawnY, direction));
            this.enemyCurrent++;
            this.lastEnemy = Date.now();
            console.log('new asteroid' + ' ' + this.enemyCurrent);
        }

    }
}