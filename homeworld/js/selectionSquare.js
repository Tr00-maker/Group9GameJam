class SelectionSquare {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.sprite = new Sprite(0, 0, 'd');
        this.sprite.overlaps(allSprites);
        this.sprite.w = 0;
        this.sprite.h = 0;

        this.drawing = false;
        this.selectionFlag = false;
    }
    
    display() {
        if (!this.drawing) {
            this.x = mx;
            this.y = my;
        } else {
            this.sprite.x = min(this.x, mx);
            this.sprite.y = min(this.y, my);
            this.sprite.w = abs(mx - this.x);
            this.sprite.h = abs(my - this.y);
    
            push();
            fill(255, 255, 255, 50);
            stroke(255);
            strokeWeight(0.5);
            rect(this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h);
            pop();
        }

        if (mouse.pressing(LEFT) && !this.isInUiBar(mx, my)) {
            this.drawing = true;
        }

        if (mouse.released(LEFT) && this.drawing && !this.isInUiBar(mx, my)) {
            this.drawing = false;
            setTimeout(() => this.selectionFlag = false, 200);
        }
  
        for (let i = selectableSprites.length - 1; i >= 0; i--) {
            if (this.drawing) {        
                if (this.isInSelectionSquare(selectableSprites[i].sprite)) {
                    selectableSprites[i].selected = true;
                    this.selectionFlag = true;
                } else if (!this.isInUiBar(mx, my)) {
                    selectableSprites[i].selected = false;
                }            
            } else if (!this.drawing && !this.selectionFlag && !this.isInUiBar(mx, my)) {
                if (mouse.released(LEFT)) {
                    selectableSprites[i].selected = false;
                }
            }
        }
    
    }

    isInSelectionSquare(otherSprite) {
        return (
            otherSprite.x + otherSprite.w / 2 > this.sprite.x &&
            otherSprite.x - otherSprite.w / 2 < this.sprite.x + this.sprite.w &&
            otherSprite.y + otherSprite.h / 2 > this.sprite.y &&
            otherSprite.y - otherSprite.h / 2 < this.sprite.y + this.sprite.h
        );
    }

    isInUiBar(x, y) {
        return (
            x >= uiX && 
            x <= uiX + uiW && 
            y >= uiY && 
            y <= uiY + uiH
        );
    }     
}