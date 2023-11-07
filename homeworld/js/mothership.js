class Mothership extends PlayerShip {
    constructor(x, y, dmg) {
        const defaultSpeed = 0.2;
        const defaultHealth = 1000;
        const defaultRange = 200;

        super(x, y, defaultSpeed, defaultHealth, defaultRange); 
        
        this.sprite.addAni('default', mothershipImg);
        this.sprite.addAni('selected', mothershipSelectedImg);
        this.sprite.d = 70;

        this.name = 'Mothership';
        
        this.initializeResources();
    }

    initializeResources() {
        this.resource = 100;
    }

    update() {
        super.update();
        this.updateAnimation();
    }

    setSpawnTarget() {
        if (this.targetSprite) {
            if (this.targetSprite.active) {
                this.spawnTarget = this.targetSprite;
            } else {
                this.spawnTarget = null;
            }
        } else {
            this.spawnTarget = null;
        }
    }

    spawnMiningShip() {
        miningShips.push(new MiningShip(this.sprite.x + (random() * 200 - 100), this.sprite.y + (random() * 200 - 100)));
    }

    spawnBattleShip() {
        battleShips.push(new BattleShip(this.sprite.x + (random() * 200 - 100), this.sprite.y + (random() * 200 - 100)));
    }

    spawnMissile()
    {
        missiles.push(new Missile(this.sprite.x + (random() * 300 - 50), this.sprite.y + (random() * 300 - 50), 30, 10));
    }


    updateAnimation() {
        this.sprite.ani.scale = 3;
    }

}

