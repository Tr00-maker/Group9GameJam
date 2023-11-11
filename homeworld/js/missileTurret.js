class BattleShip extends PlayerShip {
    constructor(x, y) {
        const defaultSpeed = 1;
        const defaultHealth = 250;
        const defaultRange = 500;

        super(x, y, defaultSpeed, defaultHealth, defaultRange); 
        
        this.sprite.addAni('default', turretImg);
        this.sprite.addAni('selected', turretImg);
        this.sprite.d = 50;

        this.name = 'Missile Turret';

        this.initializeStats();
    }

    initializeStats() {
        this.fireRate = 0.4;
        this.lastFired = 0;
        this.detetctionRange = this.range*1.5; // set the distance that the ships can detect enemies
    }

    update() {
        super.update();
        this.findClosestUnit();
    }

    updateAnimation() {
        this.sprite.ani.scale = 1.5;
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

    

    checkOnTarget() {
        if (this.onTarget) {
            this.shoot();
        }
    }
}