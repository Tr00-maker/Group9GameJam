function playStateSetup() {
    spaceBackground.resize(400, 400);
    userInterface = new UserInterface();
    playerUpgradeController = new PlayerUpgradeController();
    selectionSquare = new SelectionSquare();
    asteroidController = new AsteroidController(3000, 50);
    roamingShipController = new RoamingShipController(10000, 10);

    mothership = new Mothership(width/2, height/2);
    mothershipUnit = (new MothershipUnit(1000, 1000));
    
    for (let i = 0; i < startingAsteroids; i++) {
        asteroids.push(new Asteroid(width/2 + (random() * width - width/2), height/2 + (random() * height - height/2), random(0, 360)));
        asteroidController.enemyCurrent++;
    }
    for (let i = 0; i < startingRoamingShips; i++) {
        enemyUnits.push(new RoamingShip(width/2 + (random() * width - width/2), height/2 + (random() * height - height/2), random(0, 360)));
        roamingShipController.enemyCurrent++;
    }
    
    miningShips.push(new MiningShip(mothership.sprite.x + (random() * 200 - 100), mothership.sprite.y + (random() * 200 - 100)));
    miningShips.push(new MiningShip(mothership.sprite.x + (random() * 200 - 100), mothership.sprite.y + (random() * 200 - 100)));
    miningShips.push(new MiningShip(mothership.sprite.x + (random() * 200 - 100), mothership.sprite.y + (random() * 200 - 100)));
    
    battleShips.push(new BattleShip(mothership.sprite.x + (random() * 400 - 200), mothership.sprite.y + (random() * 400 - 200)));
    
    enemyUnits.push(new ShootingUnit(mothershipUnit.sprite.x + (random() * 200 - 100), mothershipUnit.sprite.y + (random() * 200 - 100)));
    enemyUnits.push(new MiningShipUnit(mothershipUnit.sprite.x + (random() * 200 - 100), mothershipUnit.sprite.y + (random() * 200 - 100)));
    enemyUnits.push(new MiningShipUnit(mothershipUnit.sprite.x + (random() * 200 - 100), mothershipUnit.sprite.y + (random() * 200 - 100)));
    enemyUnits.push(new MiningShipUnit(mothershipUnit.sprite.x + (random() * 200 - 100), mothershipUnit.sprite.y + (random() * 200 - 100)));
    enemyUnits.push(new MiningShipUnit(mothershipUnit.sprite.x + (random() * 200 - 100), mothershipUnit.sprite.y + (random() * 200 - 100)));

    missiles.push(new Missile(mothership.sprite.x + (random() * 200 - 100), mothership.sprite.y + (random() * 200 - 100), 10, 10, 10));
}

function playState() {
    drawBackground();
    userInterface.update();
    playStatePause();
    playStateUpdate();    
}

function playStatePause() {
    if (kb.pressed('space')) {
        gamePause = !gamePause;
    } 
    world.step(gamePause ? -1 : 0);
    //allSprites.autoUpdate = !gamePause;  
}

function playStateUpdate() {
    if (!gamePause) {
        selectionSquare.display();
        mothership.update();
        asteroidController.update();
        roamingShipController.update();

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

        for (let i = explosions.length - 1; i >= 0; i--) {
            explosions[i].update();
        }

        for (let i = roamingShips.length - 1; i >= 0; i--) {
            roamingShips[i].update();
        }

        for (let i = shipScraps.length - 1; i >= 0; i--) {
            shipScraps[i].update();
        }

        //missiles
        for (let i = missiles.length - 1; i >= 0; i--) {
            console.log(missiles[i].sprite.x);
            //missiles[i].update();
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

