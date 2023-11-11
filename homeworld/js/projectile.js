class Projectile {
    constructor(x, y, direction, speed, damage, radius, animation, array) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.overlaps(allSprites);
        this.array = array;

        this.sprite.ani = animation;
        this.sprite.animation.scale = 0.2;

        this.sprite.d = 10;
        this.sprite.rotation = direction;
        this.sprite.rotationLock = true;

        this.sprite.direction = direction;
        this.sprite.speed = speed;
        this.damage = damage;
        this.radius = radius; //use for explosions?
        
        this.sprite.debug = false;
    }

    update() {
        this.handleCollision();
        //this.handleOutOfBounds();
    }

    handleCollision() {
        let x = this.sprite.x;
        let y = this.sprite.y;

        if (this.array === enemyProjectiles) {
            for (let ship of selectableSprites) {
                if (dist(ship.sprite.x, ship.sprite.y, this.sprite.x, this.sprite.y) < ship.sprite.d/2) {
                    console.log(this.array);
                    this.dies();
                    ship.takeDamage(this.damage);
                    //create a new instance of an explosion
                    explosions.push(new Explosion(x, y, explosionBulletAni));
                }
            }
        }

        if (this.array === playerProjectiles) {
            for (let ship of enemyUnits) {
                if (dist(ship.sprite.x, ship.sprite.y, this.sprite.x, this.sprite.y) < ship.sprite.d/2) {
                    console.log('overlap Detected');
                    ship.takeDamage(this.damage);
                    this.dies();
                    //create a new instance of an explosion
                    explosions.push(new Explosion(x, y, explosionBulletAni));
                }
            }
        }
        if (this.sprite.collides(bT) || this.sprite.collides(bL) || this.sprite.collides(bB) || this.sprite.collides(bR)) {
            this.index = this.array.indexOf(this);
            if (this.index !== -1) {
                this.array.splice(this.index, 1);
            }
            this.sprite.remove();
        }
    }

    handleOutOfBounds() {
        if (dist(this.sprite.x, this.sprite.y, width, height) >  100) {
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
let redBulletImg, tealBulletImg;