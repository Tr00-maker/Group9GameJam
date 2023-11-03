function playStateSetup() {
    spaceBackground.resize(400, 400);

    selectionSquare = new SelectionSquare();

    mothership = new Mothership(width/2, height/2);

    asteroids.push(new Asteroid(mothership.sprite.x - 500, mothership.sprite.y - 250));
    
    //miningShips.push(new MiningShip(mothership.sprite.x + (random() * 200 - 100), mothership.sprite.y + (random() * 200 - 100)));
    
    battleShips.push(new BattleShip(mothership.sprite.x + (random() * 400 - 200), mothership.sprite.y + (random() * 400 - 200)));
    battleShips.push(new BattleShip(mothership.sprite.x + (random() * 400 - 200), mothership.sprite.y + (random() * 400 - 200)));
    battleShips.push(new BattleShip(mothership.sprite.x + (random() * 400 - 200), mothership.sprite.y + (random() * 400 - 200)));
    
    enemyUnits.push(new ShootingUnit(100, 200));
    enemyUnits.push(new ShootingUnit(300, 100));
    enemyUnits.push(new ShootingUnit(200, 200));

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
    world.step(gamePause ? -1 : 0);
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

        for (let i = selectableSprites.length - 1; i >= 0; i--) {
            selectableSprites[i].update();
        } 

        for (let i = enemyUnits.length - 1; i >= 0; i--) {
            enemyUnits[i].update();
        } 

        for (let i = playerProjectiles.length - 1; i >= 0; i--) {
            playerProjectiles[i].update();
        } 

        for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
            enemyProjectiles[i].update();
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
