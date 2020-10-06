class WaveSystem {
    static MAX_PLAYERS = 40;

    static PREP_WAVE = 0;
    static ENEMY_COUNT = [0, 4, 8, 14, 22, 32, 40, 40];

    static _wave = WaveSystem.PREP_WAVE;
    static _nextWave = WaveSystem.PREP_WAVE + 1;
    static _nextWaveTime = 0;
    static _currentPlayerLimit = 0;
    static _foundPlayersThisWave = false;

    static _maxMoonrats = 0;

    static update(time) {
        if (WaveSystem._nextWaveTime && time >= WaveSystem._nextWaveTime) {
            Connection._deadNames = {};
            Connection.getEddie()._health = Connection.getEddie()._maxHealth;
            WaveSystem._wave = WaveSystem._nextWave;
            WaveSystem._nextWaveTime = 0;
        }

        const aliveMoonratCount = Object.values(Connection._players).filter(entity => (entity instanceof Moonrat) && !Connection._deadNames[entity._username]).length;
        WaveSystem._maxMoonrats = Math.max(WaveSystem._maxMoonrats, aliveMoonratCount);
        document.getElementById('remaining-top').innerText = '' + aliveMoonratCount;
        document.getElementById('remaining-bottom').innerText = '' + WaveSystem._maxMoonrats;

        if (Connection.isEddie()) {
            WaveSystem._currentPlayerLimit = WaveSystem.getPlayerLimit(WaveSystem._wave);

            if (aliveMoonratCount) {
                WaveSystem._foundPlayersThisWave = true;
            }

            if (aliveMoonratCount === 0 && WaveSystem._foundPlayersThisWave) {
                WaveSystem._foundPlayersThisWave = false;
                if (WaveSystem._wave === 7) {
                    StateManager._currentState = StateManager.STATE_WIN;
                } else {
                    StateManager._currentState = StateManager.STATE_NEXT_WAVE;
                }
                StateManager._lastStageTime = time;

                document.getElementById('wave-counter').innerText = 'Night ' + (WaveSystem._wave + 1);
            }
        } else {
            if (WaveSystem._wave === WaveSystem.PREP_WAVE) {
                if (Connection.getClientPlayer()) {
                    Connection.getClientPlayer()._health = Connection.getClientPlayer()._maxHealth;
                }
            }
        }
    }

    static getPlayerLimit(wave) {
        if (wave >= WaveSystem.ENEMY_COUNT.length) {
            return WaveSystem.MAX_PLAYERS;
        } else {
            return WaveSystem.ENEMY_COUNT[wave];
        }
    }

    static nextWave() {
        WaveSystem._nextWave = WaveSystem._wave + 1;
        WaveSystem._wave = WaveSystem.PREP_WAVE;
        WaveSystem._nextWaveTime = Date.now() + 20000;

        Connection._deadNames = {};
        if (Connection.isEddie() && Connection.getEddie()) {
            Connection.getEddie()._health = Connection.getEddie()._maxHealth;
        }
    }

    static getWavePrepPolygon() {
        if (Connection.isEddie()) {
            return false;
        }

        if (WaveSystem.isInWave() && StateManager._currentState !== StateManager.STATE_WIN) {
            return false;
        }

        return true;
    }

    static getMaxPlayers() {
        return WaveSystem._currentPlayerLimit;
    }

    static isInWave(username) {
        username = username || USERNAME;
        return TwitchInformation.NAME_TO_ID_MAP[username] <= WaveSystem.getMaxPlayers();
    }

    static willBeInWave(username) {
        username = username || USERNAME;
        return TwitchInformation.NAME_TO_ID_MAP[username] <= WaveSystem.getPlayerLimit(WaveSystem._nextWave);
    }
}