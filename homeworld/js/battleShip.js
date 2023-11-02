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
    }

    update() {
        super.update();
    }

    updateAnimation() {
        this.sprite.ani.scale = 1.5;
    }

    showUI() {

    }

    removeUI() {
        
    }

    shoot() {
        const currentTime = Date.now();
        const shotDelay = 1000/this.fireRate;

        if (currentTime - this.lastFired > shotDelay) {
            //instantiate a projectile

            this.lastFired = Date.now();
        }
    }
}