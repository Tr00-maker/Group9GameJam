class EnemyUnit {
    constructor(x, y, speed, health) {
        this.sprite = new Sprite(x, y, 'd');

        this.speed = speed;
        this.health = health;

        this.sprite.debug = true;

        targetableSprites.push(this);
        this.sprite.overlaps(allSprites);

        this.sprite.direction = 0;
        this.sprite.speed = this.speed;

        this.active = true;
    }

    update() {
        this.showTarget();
    }
    
    showTarget() {
        this.sprite.ani = 'default';

        for (let i = 0; i < selectableSprites.length; i++) {
            if (selectableSprites[i].selected && selectableSprites[i].targetSprite === this) {
                this.sprite.ani = 'selected';
                break;
            }
        }
    }

    dies() {
        this.index = enemyUnits.indexOf(this);
        if (this.index != -1) {
            enemyUnits.splice(this.index, 1);
        }
        this.sprite.remove();
    }

}

class ShootingUnit extends EnemyUnit {
    constructor(x, y) {
        const defaultSpeed = 0.4;
        const defaultHealth = 100;
        super(x, y, defaultSpeed, defaultHealth);
        this.sprite.d = 30;
        
        this.name = 'Shooting Unit';

        this.sprite.addAni('default', shootingUnitImg);
        this.sprite.addAni('selected', shootingUnitDamagedImg);
    }

    update() {
        super.update();
        this.updateAnimation();

        this.testDeath();
    }

    updateAnimation() {
        this.sprite.ani.scale = 1.5;
    }

    testDeath() {
        this.health-=0.05;
        if (this.health <= 0) {
            this.dies();
        }
    }

    dies() {
        this.active = false;
        setTimeout(() => {
            this.sprite.remove();
            this.index = enemyUnits.indexOf(this)
            if (this.index != -1) {
                enemyUnits.splice(this.index, 1);
            }
        }, 100);
    }
}