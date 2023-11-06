function playStateSetup() {
    spaceBackground.resize(400, 400);

    selectionSquare = new SelectionSquare();

    asteroidController = new AsteroidController(4000, 50);

    mothership = new Mothership(width/2, height/2);
    for (let i = 0; i < startingAsteroids; i++) {
        asteroids.push(new Asteroid(width/2 + (random() * width - width/2), height/2 + (random() * height - height/2), random(0, 360)));
    }
    
    miningShips.push(new MiningShip(mothership.sprite.x + (random() * 200 - 100), mothership.sprite.y + (random() * 200 - 100)));
    
    battleShips.push(new BattleShip(mothership.sprite.x + (random() * 400 - 200), mothership.sprite.y + (random() * 400 - 200)));
    
    enemyUnits.push(new ShootingUnit(100, 200));
    enemyUnits.push(new MothershipUnit(300, 200));

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
        asteroidController.update();
        
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


        //missiles
        for (let i = missiles.length - 1; i >= 0; i--) {
            missiles[i].update();
        } 
    }
}

function drawBackground() {
    for (let x = 0; x < width; x += 400) {
        for (let y = 0; y < height; y += 400) {
            image(spaceBackground, x, y, 400, 400);
        }
    }
}

function setUiSize() {
    uiW = windowWidth;
    uiH = windowHeight/6;
    uiX = cameraSprite.x - windowWidth/2;
    uiY = cameraSprite.y + windowHeight/2 - uiH;
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
