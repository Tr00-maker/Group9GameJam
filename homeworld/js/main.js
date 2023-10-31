//game state
let gamePause = false;

//mothership
let mothershipImg, mothership;

//buttons
let buttons = [];
let button;
let miningShipCost = 50;
const defaultButtonColor = [255, 255, 255, 100];
const hoveredButtonColor = [255, 255, 255, 200];
const pressedButtonColor = [255, 255, 255, 255];

//selectionSquare
let selectionSquare;
let selectableSprites = [];

//mining ships
let miningShips = [];
let miningTargetImg, miningShipImg, miningShipSelectedImg;

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
}

function setup() {
    new Canvas(windowWidth, windowHeight, 'pixelated');
    changeState(state.play);
}

function draw() {  
    loopStates();
}
