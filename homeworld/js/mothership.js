class Mothership extends PlayerShip {
    constructor(x, y) {
        const defaultSpeed = playerUpgradeController.mothershipStat.speed;
        const defaultHealth = playerUpgradeController.mothershipStat.health;
        const defaultRange = playerUpgradeController.mothershipStat.range;
        const defaultSize = playerUpgradeController.mothershipStat.size;

        super(x, y, defaultSpeed, defaultHealth, defaultRange); 
        
        this.sprite.addAni('default', mothershipImg);
        this.sprite.addAni('selected', mothershipSelectedImg);
        this.sprite.d = defaultSize;

        this.name = 'Mothership';
        
        this.initializeResources();
    }

    initializeResources() {
        this.resource = 100;
        this.scrap = 1;
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
        new MiningShip(this.sprite.x + (random() * 200 - 100), this.sprite.y + (random() * 200 - 100));
    }

    spawnBattleShip() {
        new BattleShip(this.sprite.x + (random() * 200 - 100), this.sprite.y + (random() * 200 - 100));
    }

    spawnMissile()
    {
        new Missile(this.sprite.x + (random() * 300 - 50), this.sprite.y + (random() * 300 - 50), 10, 10);
    }


    updateAnimation() {
        this.sprite.ani.scale = this.sprite.d / 22;
    }

}

