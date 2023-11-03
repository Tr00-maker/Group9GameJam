class Projectile {
    constructor(x, y, direction, speed, damage, radius, array, animation) {
        this.sprite = new Sprite(x, y, 'd');
        array.push(this);
        this.sprite.overlaps(allSprites);

        this.sprite.ani = animation;
        this.sprite.animation.scale = 1;

        this.sprite.d = 20;
        this.sprite.rotation = direction;
        this.sprite.rotationLock = true;

        this.sprite.direction = direction;
        this.sprite.speed = speed;
        this.damage = damage;
        this.radius = radius; //use for explosions?
        
        this.sprite.debug = true;
    }

    update() {
        this.handleCollision();
        this.handleOutOfBounds();
    }

    handleCollision() {
        let x = this.sprite.x;
        let y = this.sprite.y;

        for (let ship of selectableSprites) {
            if (this.sprite.collides(ship.sprite)) {
                this.dies();
                ship.takeDamage(x, y, this.damage);
            }
        }
    }

    handleOutOfBounds() {
        if (dist(this.sprite.x, this.sprite.y, wdith, height) >  100) {
            this.dies();
        }
    }

    dies() {
        this.index = this.array.indexOf(this);
        if (this.index !== -1) {
            this.array.splice(this.index, 1);
        }
        this.sprite.remove();
    }

}
let playerProjectiles = [];
let enemyProjectiles = [];