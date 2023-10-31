class Asteroid {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.d = 100;
        this.sprite.color = 'grey';

        this.sprite.direction = 360;
        this.speed = 0.1;
        this.sprite.speed = this.speed;

        this.resource = 200;
        this.sprite.textColor = 'white';
        this.sprite.textSize = 20;
        this.sprite.text = this.resource;
        
        this.active = true;
    }

    update() {
        this.sprite.rotation += 0.1;
        this.sprite.text = this.resource;
        this.move();
        this.showMiningTarget();
    }

    move() {
        let beingMinedByAnyShip = false;
        
        for (let i = 0; i < miningShips.length; i++) {
            if (dist(miningShips[i].sprite.x, miningShips[i].sprite.y, this.sprite.x, this.sprite.y) <= 100) {
                beingMinedByAnyShip = true;
                this.transferResource(miningShips[i]);
            }
        }
    
        if (beingMinedByAnyShip) {
            this.sprite.speed = 0;
        } else {
            this.sprite.speed = this.speed;
        }
    }
    

    transferResource(miningShip) {
        if (this.resource > 0) {
            miningShip.mine(this);
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

    showMiningTarget() {
        this.sprite.addAni('default', asteroidImg);

        for (let i = 0; i < miningShips.length; i++) {
            if (miningShips[i].selected && miningShips[i].miningTarget === this) {
                this.sprite.addAni('miningTarget', miningTargetImg);
                break;
            }
        }
    }
}