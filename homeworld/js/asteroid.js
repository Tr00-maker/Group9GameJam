class Asteroid {
    constructor(x, y, direction) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.layer = 0;
        this.sprite.d = 100;
        this.sprite.color = 'grey';
        targetableSprites.push(this);
        this.sprite.overlaps(allSprites);

        this.sprite.direction = direction;
        this.speed = random(0.1, 0.5);
        this.sprite.speed = this.speed;

        this.resource = 500;
        this.sprite.textColor = 'white';
        this.sprite.textSize = 20;
        this.sprite.text = this.resource;
        
        this.active = true;

        this.sprite.addAni('default', asteroidImg);
        this.sprite.addAni('selected', miningTargetImg);
    }

    update() {
        this.sprite.rotation += 0.5 * this.sprite.speed;
        this.sprite.text = this.resource;
        this.showTarget();
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
    }
    
    transferResource(miningShip) {
        if (this.resource > 0) {
            miningShip.mineTarget(this);
        } else {
            this.dies();                    
        }
    }
    
    dies() {
        this.active = false;
        setTimeout(() => {
            this.sprite.remove();
            this.index = asteroids.indexOf(this)
            if (this.index != -1) {
                asteroids.splice(this.index, 1);
            }
        }, 100);
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
        this.spawnAsteroid();
    }

    randomSpawnCoords() {
        let spawnX, spawnY, direction;
        switch (floor(random(0, 8))) {
            case 0: // Top left
                spawnX = random(0, width/2);
                spawnY = 0;
                direction = random(-10, -80);
                break;
                
            case 1: // Left top
                spawnX = 0;
                spawnY = random(0, height/2);
                direction = random(-365, -355);
                break;
                
            case 2: // Bottom left
                spawnX = random(0, width/2);
                spawnY = height;
                direction = random(5, 10);
                break;
                
            case 3: // left bottom
                spawnX = width; 
                spawnY = random(0, height/2);
                direction = random(255, 265);
                break;

            case 4: // Top quadrant
                spawnX = random(width/2, width);
                spawnY = 0;
                direction = random(-4, -8);
                break;
                
            case 5: // Left quadrant
                spawnX = 0;
                spawnY = random(height/2, height);
                direction = random(265, 275);
                break;
                
            case 6: // Bottom quadrant
                spawnX = random(width/2, width);
                spawnY = height;
                direction = random(85, 95);
                break;
                
            case 7: // Right quadrant
                spawnX = width; 
                spawnY = random(height/2, height);
                direction = random(175, 185);
                break;
        }
        
        return { spawnX, spawnY, direction };
    }

    spawnAsteroid() {
        const currentTime = Date.now();

        if (currentTime - this.lastEnemy >= this.enemyTimer) {
            const { spawnX, spawnY, direction } = this.randomSpawnCoords();
            asteroids.push(new Asteroid(spawnX, spawnY, direction));
            this.lastEnemy = Date.now();
        }
    }
}