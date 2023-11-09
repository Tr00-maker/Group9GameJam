//resource for upgrading ships
class ShipScrap {
    constructor(x, y, value) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.overlaps(allSprites);
        this.sprite.d = 10;
        this.value = value;
        this.sprite.ani = gearImg;
    }

    update() {
        //animate the ship scrap
        this.rotation += 0.5;
        if (this.sprite.ani.scale < 2) {
            this.sprite.ani.scale += 0.2;
        } else {
            this.sprite.ani.scale = 1;
        }
    }

    move() {

    }
}
let shipScraps = [];