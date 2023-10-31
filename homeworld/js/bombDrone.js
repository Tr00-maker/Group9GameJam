class MiningShip {
    constructor(x, y) {
        this.initializeSprite(x, y);
        this.initializeResources();
        this.initializeStatus();
    }
    
    initializeSprite(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.d = 10;
        this.sprite.addAni('default', miningShipImg);
        this.sprite.addAni('selected', miningShipSelectedImg);
        selectableSprites.push(this);
        this.sprite.overlaps(allSprites);
    }


    initializeStatus() {
        this.speed = 1.2;
        this.resetStatusFlags();
    }

    resetStatusFlags() {
        this.selected = false;
        this.isMining = false;
        this.targeting = false;
        this.targetClicked = false;
        this.miningTarget = 'none';
    }

    update() {
        this.handleSelection();
        this.handleDestination();
        this.handleReturning();
        this.returnFromInactiveAsteroid();
        this.checkOverlapAndSpread();
        this.updateAnimation();
    }
    
    handleSelection() {
        if (this.sprite.mouse.presses(LEFT)) {
            selectableSprites.forEach(sprite => sprite.selected = false);
            this.selected = true;
            setTimeout(() => selectionSquare.selectionFlag = false, 100);
        }
    } 

    handleDestination() {
        if (!this.selected) return;
    
        if (mouse.pressed(RIGHT)) {
            for (let target of targets) {
                if (target.sprite.mouse.pressed(RIGHT)) {
                    this.setTarget(target);
                    return;
                }
            }

        }
    }    

    setTarget(target) {
        this.setTargetVector(target.sprite.x, target.sprite.y);
        this.targeting = target;
        this.sprite.move(this.distance, this.direction, this.speed);
        this.movingToTarget = true;
        this.targetClicked = true;
    }


    checkOverlapAndSpread() {
        for (let ship of miningShips) {
            if (this === ship) continue;
            
            const distToShip = dist(this.sprite.x, this.sprite.y, ship.sprite.x, ship.sprite.y);
            const distToMothership = dist(this.sprite.x, this.sprite.y, mothership.sprite.x, mothership.sprite.y);
            
            if (this.sprite.speed === 0 && (distToShip <= this.sprite.d * 2 || distToMothership <= this.sprite.d * 2)) {
                let dir = createVector(this.sprite.x - ship.sprite.x, this.sprite.y - ship.sprite.y);
                dir.setMag(0.2);
                this.sprite.x += dir.x;
                this.sprite.y += dir.y;
            }
        }
    }

    updateAnimation() {
        this.sprite.ani.scale = 1.5;
        this.sprite.text = this.resource;
        this.sprite.ani = this.selected ? 'selected' : 'default';

        this.sprite.rotateTowards(this.sprite.direction, 0.05);

    }

    setTargetVector(x, y) {
        this.target = createVector(x, y);
        this.directionVector = p5.Vector.sub(this.target, createVector(this.sprite.x, this.sprite.y));
        this.sprite.direction = this.direction;
        this.direction = this.directionVector.heading();
        this.distance = this.directionVector.mag();
    }

    explode(enemy) {
        if (dist(this.sprite.x, this.sprite.y, enemy.sprite.x, enemy.sprite.y) <= 5)
        recipient.resource += this.resource;
        this.resource = 0;
    }
}
