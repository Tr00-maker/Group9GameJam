class PlayerShip {
    constructor(x, y, speed, health, range) {
        this.sprite = new Sprite(x, y, 'd');
        this.speed = speed;
        this.health = health;
        this.range = range;
        this.rotationSpeed = this.speed*5;
        this.sprite.rotationLock = true;
        this.sprite.bounciness = 0.01;
        
        this.sprite.debug = true;
        selectableSprites.push(this);
        this.sprite.overlaps(allSprites);
        
        this.state = 'spawned';

        this.moveTimer = 0;
    } 

    update() {
        if (this.selected && mouse.pressed(RIGHT)) {
            this.handleSetTarget();
        }
        
        if (this.selected) {
            this.showUI();
        } else {
            this.removeUI();
        }

        switch(this.state) {
            case 'idle':
                this.handleIdle();
                break;
            case 'spawned':
                this.handleSpawned();
                break;
            case 'hasTarget':
                this.handleHasTarget();
                break;
        }

        this.updateSelection();
        this.handleSpread();
        this.handleStateReset();
    }

    //resets the state to idle if the target has not moved or has no target
    handleStateReset() {
        const currentTime = Date.now();

        if (this.targetSprite || this.sprite.speed != 0) {
            this.moveTimer = Date.now();
        }

        if (this.state != 'idle' && currentTime - this.moveTimer > 3000) {
            this.state = 'idle';
        }
    }
    //check if a target is set
    handleSetTarget() {
        for (let targetableSprite of targetableSprites) {
            if (targetableSprite.sprite.mouse.pressed(RIGHT)) {
                this.setSpriteTarget(targetableSprite);
                return;
            }
        }

        this.setMouseTarget();
    }

    //sets a target destination
    setSpriteTarget(target) {
        this.setTarget(target.sprite.x, target.sprite.y);
        this.targetSprite = target;
    }

    //sets a mouse destination
    setMouseTarget() {
        this.setTarget(mouseX, mouseY);
        this.sprite.rotateTo(this.target, this.rotationSpeed);
        this.sprite.move(this.distance, this.direction, this.speed);
        this.targetSprite = null;
    }

    //set the target vector
    setTarget(x, y) {
        this.target = createVector(x, y);
        this.directionVector = p5.Vector.sub(this.target, createVector(this.sprite.x, this.sprite.y));
        this.direction = this.directionVector.heading();
        this.distance = this.directionVector.mag(); 
        this.state = 'hasTarget';

        this.buttonsCreated = false;
    }

    //handle moving to the target
    handleHasTarget() {  
        switch(this.name) {
            case 'Mining Ship':
                for (let asteroid of asteroids) {
                    if (this.targetSprite != asteroid) {
                        this.handleMoveToTarget();
                    } else if (this.targetSprite === asteroid) {
                        this.handleMiningLogic(asteroid);
                    } else {
                        this.returnToMothership();
                        return
                    }
                    if (!this.targetSprite) {
                        this.handleMoveToTarget();
                    }
                }
                break;
            case 'Battle Ship':
                this.handleMoveToTarget();
                break;
            case 'Mothership':
                if (this.targetSprite) {
                    if (this.targetSprite.active) {
                        this.spawnTarget = this.targetSprite;
                    } else {
                        this.spawnTarget = null;
                    }
                }
                break;
        }

        if (this.targetSprite) {

            if (!this.targetSprite.active) {
                this.state = 'idle';
            }
        }
    }

    //continuously move to target until reaching the onTarget distance at which point the ships will spread
    handleMoveToTarget() {
        if (this.targetSprite) {
            this.setTarget(this.targetSprite.sprite.x, this.targetSprite.sprite.y);
            this.sprite.rotateTo(this.target, this.rotationSpeed);
    
            if (!this.onTarget) {
                this.sprite.move(this.distance, this.direction, this.speed);
            } else if (this.onTarget && this.sprite.speed != 0) {
                this.sprite.speed -=0.1;
            }
    
            if (dist(this.sprite.x, this.sprite.y, this.targetSprite.sprite.x, this.targetSprite.sprite.y) < this.range) {
                this.onTarget = true;
            } else {
                this.onTarget = false;
            }
            
        } else {
            this.onTarget = false;
        }
    }

    //all ships are spawned in the spawned state, they will pre set there target on the motherships target sprite
    handleSpawned() {
        if (mothership.spawnTarget) {
            this.targetSprite = mothership.spawnTarget;
            this.state = 'hasTarget';
        }
    }

    //stops sprites in the idle state
    handleIdle() {
        this.sprite.speed = 0;
    }

    //spreads the ships apart when not moving or are on target
    handleSpread() {
        for (let i = selectableSprites.length - 1; i >= 0; i--) {
            let ship = selectableSprites[i];
            if (this !== ship && this.sprite != mothership.sprite) {

                const distToShip = dist(this.sprite.x, this.sprite.y, ship.sprite.x, ship.sprite.y);
                
                if ((this.sprite.speed === 0 || this.onTarget) && (distToShip <= this.sprite.d * 2)) {
                    let dir = createVector(this.sprite.x - ship.sprite.x, this.sprite.y - ship.sprite.y);
                    dir.setMag(0.2);
                    this.sprite.x += dir.x;
                    this.sprite.y += dir.y;
                }

            }
            
        }
    }

    updateSelection() {
        this.sprite.ani = this.selected ? 'selected' : 'default';
    }

    takeDamage(x, y, damage, radius) {
        this.health -= this.damage;
        if (this.health <= 0) {
            //explosions.push(new explosion(x, y, damage)) add later
            this.dies();
        }
    }

    dies() {
        this.index = selectableSprites.indexOf(this);
        if (this.index != -1) {
            selectableSprites.splice(this.index, 1);
        }
        this.sprite.remove()
    }

}

//anything added to the array can be set as a target by all player ships
let targetableSprites = [];


