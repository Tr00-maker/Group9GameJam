function playStateSetup() {
    selectionSquare = new SelectionSquare();
    mothership = new Mothership(width/2, height/2);
    asteroids.push(new Asteroid(mothership.sprite.x - 500, mothership.sprite.y - 250));
    asteroids.push(new Asteroid(mothership.sprite.x + 500, mothership.sprite.y - 250));
    
    miningShips.push(new MiningShip(mothership.sprite.x + (random() * 200 - 100), mothership.sprite.y + (random() * 200 - 100)));
    miningShips.push(new MiningShip(mothership.sprite.x + (random() * 200 - 100), mothership.sprite.y + (random() * 200 - 100)));
    miningShips.push(new MiningShip(mothership.sprite.x + (random() * 200 - 100), mothership.sprite.y + (random() * 200 - 100)));
    
    spaceBackground.resize(400, 400);
    gamePause = false;
}

function playState() {
    drawBackground();
    setUiSize();
    resourceDisplay();
    playStatePause();
    playStateUpdate();    
}

function playStatePause() {
    if (kb.pressed('space')) {
        gamePause = !gamePause;
    } 
    //world.step(gamePause ? -1 : 0);
    allSprites.autoUpdate = !gamePause;  
}

function playStateUpdate() {
    if (!gamePause) {
        selectionSquare.display();
        mothership.update();
        
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].update();
        }

        for (let i = asteroids.length - 1; i >= 0; i--) {
            asteroids[i].update();
        }

        for (let i = miningShips.length - 1; i >= 0; i--) {
            miningShips[i].update();
        }
        //missiles
        for (let i = missiles.length - 1; i >= 0; i--) {
            missiles[i].update();
        } 
    }
}

function drawBackground() {
    for (let x = 0; x < windowWidth; x += 400) {
        for (let y = 0; y < windowHeight; y += 400) {
            image(spaceBackground, x, y, 400, 400);
        }
    }
}

function setUiSize() {
    uiW = width;
    uiH = height/6;
    uiX = 0;
    uiY = height - uiH;
    resourceTextX = uiX + 100;
    resourceTextY = uiY + 25;
}

function resourceDisplay() {
    //bottom bar
    push();
    stroke(0);
    strokeWeight(4);
    fill(255, 100);
    rect(uiX, uiY, uiW, uiH);
    pop();

    //resource text
    push();
    textSize(20);
    fill(255);
    textAlign(LEFT, CENTER);
    text('Resource: ' + mothership.resource, resourceTextX, resourceTextY);
    pop();
}
