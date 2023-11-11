//canvas barriers
let bT, bL, bB, bR, bCT, bCL, bCB, bCR;
let barrierArray = [];
let cameraBarrierArray = [];

function canvasBarrierSprites() {
    bT = new Sprite(width/2, 10, width, 20, 's');
    bT.color = color(0,0);
    bT.stroke = color(0,0);
    bL = new Sprite(10, height/2, 20, height, 's');
    bL.color = color(0,0);
    bL.stroke = color(0,0);
    bB = new Sprite(width/2, height, width, 20, 's');
    bB.color = color(0,0);
    bB.stroke = color(0,0);
    bR = new Sprite(width, height/2, 20, height, 's');
    bR.color = color(0,0);
    bR.stroke = color(0,0);

    bCT = new Sprite(width/2, windowHeight/2, width, 20, 'k');
    bCT.color = color(0,0);
    bCT.stroke = color(0,0);
    bCL = new Sprite(windowWidth/2, height/2, 20, height, 'k');
    bCL.color = color(0,0);
    bCL.stroke = color(0,0);
    bCB = new Sprite(width/2, height - windowHeight/2, width, 20, 'k');
    bCB.color = color(0,0);
    bCB.stroke = color(0,0);
    bCR = new Sprite(width - windowWidth/2, height/2, 20, height, 'k');
    bCR.color = color(0,0);
    bCR.stroke = color(0,0);

    barrierArray = [bT, bL, bB, bR];
    cameraBarrierArray = [bCT, bCL, bCB, bCR];
}
