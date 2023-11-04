class Mothership extends PlayerShip {
    constructor(x, y, dmg) {
        const defaultSpeed = 0.2;
        const defaultHealth = 1000;
        super(x, y, defaultSpeed, defaultHealth); 
        
        this.sprite.addAni('default', mothershipImg);
        this.sprite.addAni('selected', mothershipSelectedImg);
        this.sprite.d = 70;

        this.name = 'Mothership';
        this.buttonsCreated = false;
        
        this.initializeResources();
    }

    initializeResources() {
        this.resource = 0;
    }

    update() {
        super.update();
        this.receiveResource();
        this.updateAnimation();
    }

    receiveResource() {
        for (let i = miningShips.length - 1; i >= 0; i--) {
            if (dist(miningShips[i].sprite.x, miningShips[i].sprite.y, this.sprite.x, this.sprite.y) <= 100) {
                miningShips[i].transferResource(this);
            }
        }
    }

    spawnMiningShip() {
        miningShips.push(new MiningShip(this.sprite.x + (random() * 200 - 100), this.sprite.y + (random() * 200 - 100)));
    }
    spawnMissile()
    {
        missiles.push(new Missile(this.sprite.x + (random() * 300 - 50), this.sprite.y + (random() * 300 - 50), 30, 10));
    }


    selectedUI() {
        if (!this.buttonsCreated) {
            this.buttonsCreated = true;
            buttons.push(new Button('Mining Ship', miningShipCost, uiX + uiW/2, uiY + uiH/2, 50, 50, miningShipImg));
            buttons.push(new Button('Missile', missileCost, uiX + uiW/3, uiY + uiH/2, 50, 50, missileImg));
        }
    }

    removeUI() {
        this.buttonsCreated = false;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].remove();
        }
    }

    updateAnimation() {
        this.sprite.ani.scale = 3;
        if (this.selected) {
            this.sprite.ani = 'selected';
            this.selectedUI();
        } else {
            this.sprite.ani = 'default';
            this.removeUI();
        }
    }
}
