//game state
let gamePause = false;

//mothership
let mothershipImg, mothership;

//buttons
let buttons = [];
let miningShipCost = 50;
let missileCost = 40;
const defaultButtonColor = [255, 255, 255, 100];
const hoveredButtonColor = [255, 255, 255, 200];
const pressedButtonColor = [255, 255, 255, 255];

//selectionSquare
let selectionSquare;

let selectableSprites = [];//holds all player ships

//mining ships
let miningShips = [];
let miningTargetImg, miningShipImg, miningShipSelectedImg;

//battle ships
let battleShips = [];
let battleShipImg, battleShipSelectedImg;

//enemy units
let enemyUnits = [];
let shootingUnitImg, shootingUnitDamagedImg;

//asteroids
let asteroids = [];
let asteroidController;
let startingAsteroids = 20;

//missiles
let missiles = [];
let missileImg;

//background
let spaceBackground;

//ui bar
let uiW, uiH, uiX, uiY, resourceTextX, resourceTextY;

function preload() {
    spaceBackground = loadImage('./images/gif1.gif');

    asteroidImg = loadAnimation('./images/asteroid.png');
    miningTargetImg = loadAnimation('./images/miningTarget.png');

    miningShipImg = loadAnimation('./images/ships.png', { frameSize: [32, 32], frames: 1, row: 0, col: 1 });
    miningShipSelectedImg = loadAnimation('./images/selected.png', { frameSize: [32, 32], frames: 1, row: 0, col: 1 });

    mothershipImg = loadAnimation('./images/ships.png', { frameSize: [32, 32], frames: 1, row: 2, col: 1 });
    mothershipSelectedImg = loadAnimation('./images/selected.png', { frameSize: [32, 32], frames: 1, row: 2, col: 1 });
    missileImg = loadAnimation('./images/redmissile.png');

    battleShipImg = loadAnimation('./images/ships.png', { frameSize: [32, 32], frames: 1, row: 1, col: 1 });
    battleShipSelectedImg = loadAnimation('./images/selected.png', { frameSize: [32, 32], frames: 1, row: 1, col: 1 });

    shootingUnitImg = loadAnimation('./images/ships.png', { frameSize: [32, 32], frames: 1, row: 1, col: 0 });
    shootingUnitSelectedImg = loadAnimation('./images/selected.png', { frameSize: [32, 32], frames: 1, row: 1, col: 0 });

    mothershipUnitUnitImg = loadAnimation('./images/ships.png', { frameSize: [32, 32], frames: 1, row: 2, col: 0 });
    mothershipUnitSelectedImg = loadAnimation('./images/selected.png', { frameSize: [32, 32], frames: 1, row: 2, col: 0 });

    redBulletImg = loadImage('./images/redBullet.png');
    tealBulletImg = loadImage('./images/tealBullet.png');
}

function setup() {
    new Canvas(5000, 5000, 'pixelated x1');
    changeState(state.play);

    //test pan cam ini
    initializeCamera();
}

function draw() {  
    clear();
    cameraEffect(); 
    loopStates();
}

function initializeCamera() {
    cameraSprite = new Sprite(width/2, height/2, 'n');
    cameraSprite.d = 10;
    cameraSprite.color = color(255, 0);
    cameraSprite.stroke = color(0,0);
}

function cameraEffect() {
    tx = windowWidth/2 - cameraSprite.x;
    ty = windowHeight/2 - cameraSprite.y;
    translate(tx, ty);
    mx = mouseX - tx;
    my = mouseY - ty;
    
    let aspectRatio = windowWidth / windowHeight;
    let cameraSpeed = 0.0075;

    if (mx < cameraSprite.x - windowWidth/2 + 75 && cameraSprite.x > windowWidth/2 ||
        mx > cameraSprite.x + windowWidth/2 - 75 && cameraSprite.x < width - windowWidth/2) {
            cameraSprite.moveTowards(mx, my, cameraSpeed);
        } else if (my < cameraSprite.y - windowHeight/2 + 75 && cameraSprite.y > windowHeight/2 ||
        my > cameraSprite.y + windowHeight/2 - 10  && cameraSprite.y < height - windowHeight/2) {
        cameraSprite.moveTowards(mx, my, cameraSpeed*aspectRatio);
    } else if (cameraSprite.speed >0) {
        cameraSprite.speed = 0;
    }
}

//var for cameraEffect
let cameraSprite, tx, ty, mx, my;