class Missile{
    constructor(x, y, dmg, health) {
        this.initializeSprite(x, y);
        this.initializeStatus();
        this.health = health;
        this.damage = dmg;
    }
    
    initializeSprite(x, y) {
        this.sprite = new Sprite(x, y, 'd');
        this.sprite.d = 10;
        this.sprite.addAni('default', missileImg);
        this.sprite.addAni('selected', missileImg);
        selectableSprites.push(this);
        this.sprite.overlaps(allSprites);
        this.sprite.type = 'bomb-drone';

        
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
        this.updateAnimation();
    }
    
    handleSelection() {
        if (this.sprite.mouse.presses(LEFT)) {
            selectableSprites.forEach(sprite => sprite.selected = false);
            this.selected = true;
            console.log('missile select');
            setTimeout(() => selectionSquare.selectionFlag = false, 100);
        }
    } 

    handleDestination() {
        if (!this.selected) return;
    
        if (mouse.pressed(RIGHT)) {
            for (let target of selectableSprites) {
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
            enemy.defaultHealth -= this.damage;
            this.resource = 0;
            this.sprite.remove();
        }
    }
}
