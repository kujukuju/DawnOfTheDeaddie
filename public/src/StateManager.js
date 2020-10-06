class StateManager {
    static STATE_INTRODUCTION = 0;
    static STATE_CREDIT = 1;
    static STATE_DOT_DOT_DOT = 2;
    static STATE_LORE = 3;
    static STATE_ABILITY_INTRO = 4;
    static STATE_ABILITY_TESTING = 5;
    static STATE_MOONRAT_INFO = 6;
    static STATE_MOONRAT_CONNECT = 7;
    static STATE_NEXT_WAVE = 8;
    static STATE_ZOOM_OUT_LIGHTS_ON = 9;
    static STATE_WIN = 10;
    static STATE_ZOOM_IN_LIGHTS_OFF = 11;

    static _lastStageTime = Date.now();
    static _currentState = StateManager.STATE_INTRODUCTION;

    static update(time) {
        if (window.localStorage && window.localStorage.getItem('skip')) {
            if (StateManager._currentState < StateManager.STATE_MOONRAT_CONNECT) {
                StateManager._currentState = StateManager.STATE_MOONRAT_CONNECT;
                StateManager._lastStageTime = time;
            }
        }

        switch (StateManager._currentState) {
            case StateManager.STATE_INTRODUCTION: {
                StateManager._hideEverything();

                if (Connection.isEddie()) {
                    Connection.getEddie()._health = Connection.getEddie()._maxHealth;
                    document.getElementById('introduction').style.opacity = '100%';
                    document.getElementById('introduction').style.zIndex = 100;

                    if (time - StateManager._lastStageTime > 7800) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_CREDIT;
                    }
                } else {
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                }
            } break;

            case StateManager.STATE_CREDIT: {
                StateManager._hideEverything();

                if (Connection.isEddie()) {
                    Connection.getEddie()._health = Connection.getEddie()._maxHealth;
                    document.getElementById('credit').style.opacity = '100%';
                    document.getElementById('credit').style.zIndex = 100;

                    if (time - StateManager._lastStageTime > 6000) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_DOT_DOT_DOT;
                    } else if (InputManager._keys[InputManager.KEY_LEFT] && time - StateManager._lastStageTime > 250) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_INTRODUCTION;
                    }
                } else {
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                }
            } break;

            case StateManager.STATE_DOT_DOT_DOT: {
                StateManager._hideEverything();

                if (Connection.isEddie()) {
                    Connection.getEddie()._health = Connection.getEddie()._maxHealth;
                    document.getElementById('dotdotdot').style.opacity = '100%';
                    document.getElementById('dotdotdot').style.zIndex = 100;

                    if (time - StateManager._lastStageTime > 4500) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_LORE;
                    } else if (InputManager._keys[InputManager.KEY_LEFT] && time - StateManager._lastStageTime > 250) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_CREDIT;
                    }
                } else {
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                }
            } break;

            case StateManager.STATE_LORE: {
                StateManager._hideEverything();

                if (Connection.isEddie()) {
                    Connection.getEddie()._health = Connection.getEddie()._maxHealth;
                    document.getElementById('lore').style.opacity = '100%';
                    document.getElementById('lore').style.zIndex = 100;

                    if (time - StateManager._lastStageTime > 13000) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_ABILITY_INTRO;
                    } else if (InputManager._keys[InputManager.KEY_LEFT] && time - StateManager._lastStageTime > 250) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_DOT_DOT_DOT;
                    }
                } else {
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                }
            } break;

            case StateManager.STATE_ABILITY_INTRO: {
                StateManager._hideEverything();

                if (Connection.isEddie()) {
                    Connection.getEddie()._health = Connection.getEddie()._maxHealth;
                    document.getElementById('ability-intro').style.opacity = '100%';
                    document.getElementById('ability-intro').style.zIndex = 100;

                    if (time - StateManager._lastStageTime > 11000) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_ABILITY_TESTING;
                    } else if (InputManager._keys[InputManager.KEY_LEFT] && time - StateManager._lastStageTime > 250) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_LORE;
                    }
                } else {
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                }
            } break;

            case StateManager.STATE_ABILITY_TESTING: {
                StateManager._hideEverything();

                if (Connection.isEddie()) {
                    Connection.getEddie()._health = Connection.getEddie()._maxHealth;
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;

                    if (time - StateManager._lastStageTime > 30000) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_MOONRAT_INFO;
                    } else if (InputManager._keys[InputManager.KEY_LEFT] && time - StateManager._lastStageTime > 250) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_ABILITY_INTRO;
                    }
                } else {
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                }
            } break;

            case StateManager.STATE_MOONRAT_INFO: {
                StateManager._hideEverything();

                if (Connection.isEddie()) {
                    Connection.getEddie()._health = Connection.getEddie()._maxHealth;
                    document.getElementById('moonrat-ability-intro').style.opacity = '100%';
                    document.getElementById('moonrat-ability-intro').style.zIndex = 100;

                    if (time - StateManager._lastStageTime > 18000) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_MOONRAT_CONNECT;
                    } else if (InputManager._keys[InputManager.KEY_LEFT] && time - StateManager._lastStageTime > 250) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_ABILITY_TESTING;
                    }
                } else {
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                }
            } break;

            case StateManager.STATE_MOONRAT_CONNECT: {
                StateManager._hideEverything();

                if (Connection.isEddie()) {
                    Connection.getEddie()._health = Connection.getEddie()._maxHealth;
                    document.getElementById('moonrat-connect-info').style.opacity = '100%';
                    document.getElementById('moonrat-connect-info').style.zIndex = 100;
                    document.getElementById('connect-info-static').style.display = 'block';

                    if (time - StateManager._lastStageTime > 8000) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_NEXT_WAVE;
                    } else if (InputManager._keys[InputManager.KEY_LEFT] && time - StateManager._lastStageTime > 250) {
                        if (window.localStorage && window.localStorage.getItem('skip')) {
                            window.localStorage && window.localStorage.removeItem('skip');
                        }

                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_MOONRAT_INFO;
                    }
                } else {
                    document.getElementById('pleb-chooser').style.display = 'block';
                    document.getElementById('pleb-chooser').style.top = '50%';
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                }
            } break;

            case StateManager.STATE_NEXT_WAVE: {
                StateManager._hideEverything();

                if (Connection.isEddie()) {
                    Connection.getEddie()._health = Connection.getEddie()._maxHealth;
                    document.getElementById('next-wave-announcement').style.opacity = '100%';
                    document.getElementById('next-wave-announcement').style.zIndex = 100;
                    document.getElementById('connect-info-static').style.display = 'block';

                    if (time - StateManager._lastStageTime > 4000) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_ZOOM_OUT_LIGHTS_ON;

                        WaveSystem.nextWave();
                    }
                } else {
                    document.getElementById('pleb-chooser').style.display = 'block';
                    document.getElementById('pleb-chooser').style.top = '50%';
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                }
            } break;

            case StateManager.STATE_ZOOM_OUT_LIGHTS_ON: {
                StateManager._hideEverything();

                if (Connection.isEddie()) {
                    if (time - StateManager._lastStageTime > 1000) {
                        Camera.force(StateManager._lastStageTime + 20000, [2430, -1810], 0.09);
                    }
                    const speech = AudioSystem.SPEECHES[WaveSystem._nextWave - 1];
                    const duration = speech ? speech._duration * 1000 : 0;
                    if (time - StateManager._lastStageTime > 18200 - duration) {
                        AudioSystem.playSpeech(WaveSystem._nextWave - 1);
                    }
                    Connection.getEddie()._health = Connection.getEddie()._maxHealth;
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                    if (Connection.isEddie()) {
                        document.getElementById('connect-info-static').style.display = 'block';
                    }

                    if (time - StateManager._lastStageTime > 19000) {
                        StateManager._lastStageTime = time;
                        StateManager._currentState = StateManager.STATE_ZOOM_IN_LIGHTS_OFF;
                    }
                } else {
                    document.getElementById('pleb-chooser').style.display = 'block';
                    document.getElementById('pleb-chooser').style.top = '0%';
                    document.getElementById('pleb-chooser').style.transform = 'translateX(-50%) translateY(-25%) scale(0.5)';
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                }
            } break;

            case StateManager.STATE_WIN: {
                StateManager._hideEverything();

                if (!StateManager._hasWon) {
                    StateManager._hasWon = true;

                    let delay = 1400;
                    setTimeout(() => {
                        document.getElementById('win-1').style.opacity = '100%';
                    }, delay);
                    delay += 2100;
                    setTimeout(() => {
                        document.getElementById('win-2').style.opacity = '100%';
                    }, delay);
                    delay += 4800;
                    setTimeout(() => {
                        document.getElementById('win-3').style.opacity = '100%';
                    }, delay);
                    delay += 2100;
                    setTimeout(() => {
                        document.getElementById('win-4').style.opacity = '100%';
                    }, delay);
                    delay += 4800;
                    setTimeout(() => {
                        document.getElementById('win-5').style.opacity = '100%';
                    }, delay);
                    delay += 8000;
                    setTimeout(() => {
                        document.getElementById('win-6').style.opacity = '100%';
                    }, delay);
                }

                if (Connection.isEddie()) {
                    Connection.getEddie()._health = Connection.getEddie()._maxHealth;
                    document.getElementById('win-screen').style.opacity = '100%';
                    document.getElementById('win-screen').style.zIndex = 100;
                } else {
                    document.getElementById('canvas-container').style.opacity = '100%';
                    document.getElementById('canvas-container').style.zIndex = 100;
                }
            } break;

            case StateManager.STATE_ZOOM_IN_LIGHTS_OFF: {
                StateManager._hideEverything();

                // turn lights off
                window.localStorage && window.localStorage.setItem('skip', 'true');

                document.getElementById('canvas-container').style.opacity = '100%';
                document.getElementById('canvas-container').style.zIndex = 100;
                document.getElementById('remaining-moonrats').style.opacity = '100%';
                if (Connection.isEddie()) {
                    document.getElementById('connect-info-static').style.display = 'block';
                }
            } break;

            default:
                break;
        }
    }

    static _hasWon = false;

    static canAttack() {
        return StateManager._currentState === StateManager.STATE_ZOOM_IN_LIGHTS_OFF || StateManager._currentState === StateManager.STATE_ABILITY_TESTING;
    }

    static initialize() {
        document.getElementById('tankrat-button').onclick = () => {
            const entity = Connection.getClientPlayer();
            if (entity && entity instanceof Moonrat) {
                entity._desiredMoonratType = Moonrat.MOONRAT_TYPE_TANK;
            }
        };
        document.getElementById('spitrat-button').onclick = () => {
            const entity = Connection.getClientPlayer();
            if (entity && entity instanceof Moonrat) {
                entity._desiredMoonratType = Moonrat.MOONRAT_TYPE_SPITRAT;
            }
        };
        document.getElementById('pouncerat-button').onclick = () => {
            const entity = Connection.getClientPlayer();
            if (entity && entity instanceof Moonrat) {
                entity._desiredMoonratType = Moonrat.MOONRAT_TYPE_HOODRAT;
            }
        };
    }

    static _hideEverything() {
        document.getElementById('canvas-container').style.opacity = '0%';
        document.getElementById('canvas-container').style.zIndex = 10;
        document.getElementById('introduction').style.opacity = '0%';
        document.getElementById('introduction').style.zIndex = 10;
        document.getElementById('credit').style.opacity = '0%';
        document.getElementById('credit').style.zIndex = 10;
        document.getElementById('dotdotdot').style.opacity = '10%';
        document.getElementById('dotdotdot').style.zIndex = 10;
        document.getElementById('lore').style.opacity = '0%';
        document.getElementById('lore').style.zIndex = 10;
        document.getElementById('ability-intro').style.opacity = '0%';
        document.getElementById('ability-intro').style.zIndex = 10;
        document.getElementById('moonrat-ability-intro').style.opacity = '0%';
        document.getElementById('moonrat-ability-intro').style.zIndex = 10;
        document.getElementById('moonrat-connect-info').style.opacity = '0%';
        document.getElementById('moonrat-connect-info').style.zIndex = 10;
        document.getElementById('connect-info-static').style.display = 'none';
        document.getElementById('pleb-chooser').style.display = 'none';
        document.getElementById('pleb-chooser').style.top = '50%';
        document.getElementById('next-wave-announcement').style.opacity = '0%';
        document.getElementById('next-wave-announcement').style.zIndex = 10;
        document.getElementById('remaining-moonrats').style.opacity = '0%';
        document.getElementById('win-screen').style.opacity = '0%';
        document.getElementById('win-screen').style.zIndex = 10;
    }

    static winContinue() {
        StateManager._lastStageTime = Date.now();
        StateManager._currentState = StateManager.STATE_NEXT_WAVE;
    }
}