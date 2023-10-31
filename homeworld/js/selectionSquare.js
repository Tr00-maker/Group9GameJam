class SelectionSquare {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.drawing = false;
        this.selection = false;
        this.sprite = new Sprite(0, 0, 'd');
        this.sprite.w = 0;
        this.sprite.h = 0;
        this.sprite.overlaps(allSprites);
    }

    display() {
        if (!this.drawing) {
            this.x = mouseX;
            this.y = mouseY;
        }
        if (mouse.pressing(LEFT)) {
            this.drawing = true;
    
            this.sprite.x = min(this.x, mouseX);
            this.sprite.y = min(this.y, mouseY);
            this.sprite.w = abs(mouseX - this.x);
            this.sprite.h = abs(mouseY - this.y);
    
            push();
            fill(255, 255, 255, 50);
            stroke(255);
            strokeWeight(0.5);
            rect(this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h);
            pop();
        } else {
            this.drawing = false;
        }
        for (let i = selectableSprites.length - 1; i >= 0; i--) {
            if (this.isInSelectionSquare(selectableSprites[i].sprite)) {
                selectableSprites[i].selected = true;
                selectionFlag = true;
            } else if (mouse.presses(LEFT)) {
                const insideUiBar = this.isInUiBar(mouseX, mouseY);
                if (!insideUiBar) {
                    selectableSprites[i].selected = false;
                    console.log(`Deselected sprite at index ${i}`);
                }
            }            
        }
        if (mouse.released(LEFT)) {
            setTimeout(() => {
                selectionFlag = false;
            }, 100);
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
        const isInBar = (
            x >= uiX && 
            x <= uiX + uiW && 
            y >= uiY && 
            y <= uiY + uiH
        );
        console.log(`MouseX: ${x}, MouseY: ${y}, isInBar: ${isInBar}`);
        return isInBar;
    }     
}