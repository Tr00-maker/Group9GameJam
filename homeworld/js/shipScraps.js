class ShipScrap {
    constructor(x, y, value) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.overlaps(allSprites);
        this.sprite.d = 10;
        this.value = value;
        this.sprite.ani = gearImg;
    }

    update() {
        this.rotation += 0.5;
    }

    move() {

    }
}