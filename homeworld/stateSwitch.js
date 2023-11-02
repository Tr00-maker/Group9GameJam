const state = {
    current: '',
    start: 'start',
    play: 'play',
    menu: 'menu',
}

function loopStates() {
    switch(state.current) {
        case state.start:
            startState();
            break;
        case state.play:
            playState();
            break;
        case state.menu:
            menuState();
            break;
        case state.gameOver:
            gameOverState();
            break;
    }
}

function changeState(nextState) {
    switch(nextState) {
        case state.start:
            startStateSetup();
            state.current = 'start';
            break;
        case state.play:
            playStateSetup();       
            state.current = 'play';
            break;
        case state.menu:
            menuStateSetup();
            state.current = 'menu';
            break;
    }
}

function clearScreen() {
    allSprites.remove();
    clear();
}