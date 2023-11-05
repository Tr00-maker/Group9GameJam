class Asteroid {
    constructor(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.d = 100;
        this.sprite.color = 'grey';
        targetableSprites.push(this);
        this.sprite.overlaps(allSprites);

        this.sprite.direction = 360;
        this.speed = 0.1;
        this.sprite.speed = this.speed;

        this.resource = 100;
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