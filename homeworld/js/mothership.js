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

    setIdle() {
        
    }

    spawnMiningShip() {
        miningShips.push(new MiningShip(this.sprite.x + (random() * 200 - 100), this.sprite.y + (random() * 200 - 100)));
    }
    spawnMissile()
    {
        missiles.push(new Missile(this.sprite.x + (random() * 300 - 50), this.sprite.y + (random() * 300 - 50), 30, 10));
    }


    updateAnimation() {
        this.sprite.ani.scale = 3;
    }

    showUI() {
        if (!this.buttonsCreated) {
            this.buttonsCreated = true;
            buttons.push(new UnitButton('Mining Ship', miningShipCost, uiX + uiW/2, uiY + uiH/2, 50, 50, miningShipImg));
            buttons.push(new UnitButton('Missile', missileCost, uiX + uiW/3, uiY + uiH/2, 50, 50, missileImg));
        }
    }

    removeUI() {
        this.buttonsCreated = false;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].remove();
        }
    }
}
