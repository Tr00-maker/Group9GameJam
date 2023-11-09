const state = {
    current: '',
    start: 'start',
    play: 'play',
}

function loopStates() {
    switch(state.current) {
        case state.start:
            startState();
            break;
        case state.play:
            playState();
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
    }
}