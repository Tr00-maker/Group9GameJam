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
    }

    update() {
        super.update();
        this.shoot();
    }

    updateAnimation() {
        this.sprite.ani.scale = 1.5;
    }

    showUI() {
        
    }

    removeUI() {
        
    }

    shoot() {
        for (let unit of enemyUnits) {
            if (this.onTarget && this.targetSprite === unit) {
                const currentTime = Date.now();
                const shotDelay = 1000/this.fireRate;
    
                if (currentTime - this.lastFired >= shotDelay) {
                    playerProjectiles.push(new Projectile(
                        this.sprite.x + this.sprite.d * cos(this.sprite.rotation), 
                        this.sprite.y + this.sprite.d * sin(this.sprite.rotation), 
                        this.sprite.rotation, 
                        this.shotSpeed, 
                        this.damage, 10, 
                        tealBulletImg, 
                        playerProjectiles));
                    this.lastFired = currentTime;
                }
            }
        }
    }
}