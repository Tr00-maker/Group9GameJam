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

        this.sprite.health = 10
        this.sprite.text = 'bomba';
        this.sprite.textColor = 'red';
        this.sprite.textSize = 20;
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
        if (dist(this.sprite.x, this.sprite.y, enemy.sprite.x, enemy.sprite.y) <= 1)
        {
            recipient.health -= 20;
            this.resource = 0;
            this.sprite.remove();
        }
    }
}
