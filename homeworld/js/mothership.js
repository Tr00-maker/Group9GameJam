let RECALL_RADIUS=25;

class Mothership extends PlayerShip {
    constructor(x, y) {
        const defaultSpeed = playerUpgradeController.mothershipStat.speed;
        const defaultHealth = playerUpgradeController.mothershipStat.health;
        const defaultRange = playerUpgradeController.mothershipStat.range;
        const defaultSize = playerUpgradeController.mothershipStat.size;

        super(x, y, defaultSpeed, defaultHealth, defaultRange); 

        this.RECALL_RADIUS = 25;
        
        this.sprite.addAni('default', mothershipImg);
        this.sprite.addAni('selected', mothershipSelectedImg);
        this.sprite.d = defaultSize;

        this.name = 'Mothership';
        
        this.initializeResources();
    }

    initializeResources() {
        this.resource = 100;
        this.scrap = 0;
        this.RECALL_RADIUS = 25;
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
        missiles.push(new Missile(this.sprite.x + (random() * 300 - 50), this.sprite.y + (random() * 300 - 50), 10, 10));
    }

    recallUnits() {
        console.log("[Recalling Units]")
        //iterate over all miningships and move them back to mothership
        for (const miningShip of miningShips) {
            console.log('Checking mining ship...')
            const distance = dist(this.sprite.x, this.sprite.y, miningShip.sprite.x, miningShip.sprite.y);
            console.log('Distance to mining ship: ', distance);
            if (dist(this.sprite.x, this.sprite.y, miningShip.sprite.x, miningShip.sprite.y) >= miningShip.range) {
                console.log('Recalling mining ship')
                miningShip.returnToMothership();
            }
        }

        //iterate over all battleships and move them back to the mothership
        for (const battleship of battleShips) {
            console.log('Checking battle ship...')
            const distance = dist(this.sprite.x, this.sprite.y, battleship.sprite.x, battleship.sprite.y);
            console.log('Distance to battle ship: ', distance);
            if (dist(this.sprite.x, this.sprite.y, battleship.sprite.x, battleship.sprite.y) >= battleship.range) {
                console.log('Recalling battle ship')
                battleship.returnToMothership();
            }
        }
    }


    updateAnimation() {
        this.sprite.ani.scale = this.sprite.d / 22;
    }

}

