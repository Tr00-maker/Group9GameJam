class Explosion {
    constructor(x, y, ani) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.overlaps(allSprites);
        this.sprite.d = 30
        this.ani = ani;
        this.sprite.ani = this.ani;
        this.sprite.ani.frame = 0;

        explosions.push(this);
    }

    update() {
        //check if the explosions animation has reached its last frame - then remove
        switch(this.ani) {
            case explosionShipAni:
                if (this.sprite.ani.frame === 7) {
                    this.dies();
                }
                break;
            case explosionBulletAni:
                if (this.sprite.ani.frame === 6) {
                    this.dies();
                }
                break;
        }
    }

    dies() {
        this.index = explosions.indexOf(this);
        if (this.index != -1) {
            explosions.splice(this.index, 1);
        }
        this.sprite.remove();
    }


}