class Missile{
    constructor(x, y, dmg, health, radius) {
        this.sprite = new Sprite();
        this.initializeSprite(x, y);
        this.initializeStatus();
        this.health = health;
        this.damage = dmg;
        this.radius = radius;
        
    }
    
    initializeSprite(x, y) {
        
        this.sprite.d = 10;
        this.sprite.addAni('default', missileImg);
        this.sprite.addAni('selected', missileImg);
        //selectableSprites.push(this);
        this.sprite.collides(allSprites);
        this.sprite.type = 'bomb-drone';

        this.handleDestination();
        this.sprite.text = 'bomba';
        this.sprite.textColor = 'red';
        this.sprite.textSize = 20;
    }


    initializeStatus() {
        this.speed = 1.4;
        this.resetStatusFlags();
        this.enemy = null;

    }

    resetStatusFlags() {
        this.selected = false;
        this.isMining = false;
        this.targeting = false;
        this.targetClicked = false;
    }
    //these run every frame
    update() {
        //this.handleSelection();
        console.log('1', this.sprite.w, this.sprite.h);
        //this.handleDestination();
        //this.updateAnimation();
        if(this.targeting == true)
        {
            this.setTarget(this.enemy);
            this.explode(this, this.enemy);
        }
        console.log('enemy', this.enemy);
        console.log('3', this.sprite.x, this.sprite.y);
        //this.explode(this.sprite, this.target);
    }

    handleDestination() {
        let closestDistance = Number.MAX_VALUE;
        let closestShip = this.enemy;
        console.log('handled', this.sprite.x);  
        for (let ship of enemyUnits) {
            let currentDistance = dist(this.sprite.x, this.sprite.y, ship.sprite.x, ship.sprite.y);
            console.log('ship', ship, this.sprite.x, ship.sprite.w, this.sprite.h);
            if (currentDistance < closestDistance) {
                closestDistance = currentDistance;
                closestShip = ship;
                console.log('closest');
            }
        }

        
        console.log('closestship', closestShip);
        if(closestShip != null)
        {   
            this.enemy = closestShip.sprite;
            this.setTarget(closestShip);
        }
        
        return;
    }    

    setTarget(target) {
        console.log(this.enemy, 'target', this.sprite.x, this.sprite.w, this.sprite.h);
        this.setTargetVector(target.sprite.x, target.sprite.y);
        this.targeting = target;
        this.sprite.move(this.distance, this.direction, this.speed);
        this.targeting = true;
        this.targetClicked = true;
        console.log(this.enemy, 'target2', this.sprite.x);
    }


    updateAnimation() {
        this.sprite.ani.scale = 1.5;
        this.sprite.text = this.resource;
        //this.sprite.ani = this.selected ? 'selected' : 'default';
        this.sprite.rotateTowards(this.sprite.direction, 0.05);

    }

    setTargetVector(x, y) {
        this.target = createVector(x, y);
        this.directionVector = p5.Vector.sub(this.target, createVector(this.sprite.x, this.sprite.y));
        this.sprite.direction = this.direction;
        this.direction = this.directionVector.heading();
        this.distance = this.directionVector.mag();
    }
    //apply given damage
    takeDamage(x, y, damage, radius) {
        this.health -= damage;
        this.dies();
    }
    // damage target
    explode(missile, enemy) {
        //console.log('explode');
        if (dist(missile.sprite.x, missile.sprite.y, enemy.sprite.x, enemy.sprite.y) <= 5)
        {
            enemy.takeDamage(missile.sprite.x, missile.sprite.y, this.damage, this.radius);
            this.sprite.remove();
            console.log('removed');
        }
    }

    dies()
    {
        if(this.health <= 0)
        {
            this.sprite.remove();
            console.log('died');
        }
        
    }
}
