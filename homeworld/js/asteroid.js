class Asteroid {
    constructor(x, y, direction) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.d = 100;
        this.sprite.color = 'grey';
        targetableSprites.push(this);
        this.sprite.overlaps(allSprites);

        this.sprite.direction = direction;
        this.speed = 0.1;
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
        this.sprite.rotation += 0.1;
        this.sprite.text = this.resource;
        this.showTarget();
        if (this.resource <= 0) {
            this.dies();                    
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
        switch (floor(random(0, 4))) {
            case 0: // Top quadrant
                spawnX = random() * width;
                spawnY = 0;
                direction = random(-5, 5);
                break;
                
            case 1: // Left quadrant
                spawnX = 0;
                spawnY = random() * height;
                direction = random(265, 275);
                break;
                
            case 2: // Bottom quadrant
                spawnX = random() * width;
                spawnY = height;
                direction = random(85, 95);
                break;
                
            case 3: // Right quadrant
                spawnX = width; 
                spawnY = random() * height;
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