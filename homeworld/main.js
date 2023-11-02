//game state
let gamePause = false;

//mothership
let mothershipImg, mothership;

//buttons
let buttons = [];
let miningShipCost = 50;
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
let asteroidImg;

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

    battleShipImg = loadAnimation('./images/ships.png', { frameSize: [32, 32], frames: 1, row: 1, col: 1 });
    battleShipSelectedImg = loadAnimation('./images/selected.png', { frameSize: [32, 32], frames: 1, row: 1, col: 1 });

    shootingUnitImg = loadAnimation('./images/ships.png', { frameSize: [32, 32], frames: 1, row: 1, col: 0 });
    shootingUnitDamagedImg = loadAnimation('./images/selected.png', { frameSize: [32, 32], frames: 1, row: 1, col: 0 });
}

function setup() {
    new Canvas(windowWidth, windowHeight, 'pixelated');
    changeState(state.play);
}

function draw() {  
    loopStates();
}
