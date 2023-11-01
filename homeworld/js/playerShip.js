class PlayerShip {
    constructor(x, y, speed, health) {
        this.sprite = new Sprite(x, y, 'd');
        this.speed = speed;
        this.health = health;
        
        this.sprite.debug = true;
        selectableSprites.push(this);
        this.sprite.overlaps(allSprites);
        
        this.selected = false;
        this.movingToUnit = false;
        this.unitClicked = false;
        this.unitTarget = 'none';
    } 

    update() {
        this.handleSelection();
        this.handleDestination();
        this.updateDirection();
    }

    handleSelection() {
        if (this.sprite.mouse.presses(LEFT)) {
            selectableSprites.forEach(sprite => sprite.selected = false);
            this.selected = true;
            setTimeout(() => selectionSquare.selectionFlag = false, 100);
        }
    }

    handleDestination() {
        if (this.movingToUnit && this.unitTarget && this.sprite.speed != 0) {
            this.setTargetVector(this.unitTarget.sprite.x, this.unitTarget.sprite.y);
            this.sprite.move(this.distance, this.direction, this.speed);
        }

        if (!this.selected) return;
    
        if (mouse.pressed(RIGHT)) {
            for (let unit of enemyUnits) {
                if (unit.sprite.mouse.pressed(RIGHT)) {
                    this.setEnemyTarget(unit);
                    return;
                }
            }

            this.clearUnitTarget();
        }
    }   

    setEnemyTarget(unit) {
        this.setTargetVector(unit.sprite.x, unit.sprite.y);
        this.unitTarget = unit;
        this.sprite.move(this.distance, this.direction, this.speed);
        this.movingToUnit = true;
        this.unitClicked = true;
    }

    clearUnitTarget() {
        this.setTargetVector(mouseX, mouseY);
        this.unitTarget = 'none';
        this.sprite.move(this.distance, this.direction, this.speed);
        this.movingToUnit = false;
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

    setTargetVector(x, y) {
        this.target = createVector(x, y);
        this.directionVector = p5.Vector.sub(this.target, createVector(this.sprite.x, this.sprite.y));
        this.sprite.direction = this.direction;
        this.direction = this.directionVector.heading();
        this.distance = this.directionVector.mag();
    }

    updateDirection() {
        this.sprite.rotateTowards(this.sprite.direction, 0.05);
        this.sprite.ani = this.selected ? 'selected' : 'default';
    }
}
