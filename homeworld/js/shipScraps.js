//resource for upgrading ships
class ShipScrap {
    constructor(x, y, value) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.overlaps(allSprites);
        this.sprite.d = 10;
        this.value = value;
        this.sprite.ani = gearImg;

        this.scrap = 1;
    }

    update() {
        //animate the ship scrap
        this.sprite.rotation += 0.8;
        if (this.sprite.ani.scale < 1) {
            this.sprite.ani.scale += 0.003;
        } else {
            this.sprite.ani.scale = 0.9;
        }

        this.move();
    }

    move() {
        for (let ship of miningShips) {
            let distance = dist(this.sprite.x, this.sprite.y, ship.sprite.x, ship.sprite.y);
            if (distance < ship.detectionRange) {
                // If within range of a mining ship, move to it 
                let speed = 2 / distance;
                this.sprite.moveTowards(ship.sprite, speed);
            } 
            //if within pickup range transfer the resource
            if (distance < ship.sprite.d) {
                this.transferResource(ship);
            }
        }
    }

    transferResource(miningShip) {
        if (this.scrap > 0) {
            miningShip.scrap += this.scrap;
            this.scrap = 0;
        } else {
            this.dies();                    
        }
    }

    dies() {
        this.active = false;
        this.index = shipScraps.indexOf(this)
        if (this.index != -1) {
            shipScraps.splice(this.index, 1);
        }
        this.sprite.remove();
    }
}
let shipScraps = [];