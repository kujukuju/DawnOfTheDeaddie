class Connection {
    static _players = {};
    static _lastActiveTime = {};

    static _deadNames = {};

    static _moonratDamageScale = 1;
    static _eddieDamageScale = 1;

    static initialize() {
        TwitchPackets.connectPermanent(USERNAME, 'the_kuju', CLIENT, SECRET, REFRESH);

        TwitchPackets.addListener(TwitchPackets.EVENT_MESSAGE, (event) => {
            const username = event.username;
            const message = event.message;

            if (username === 'the_kuju') {
                // I have no idea how to balance this game lol
                if (message.startsWith('!moonratdamage ')) {
                    try {
                        const damageScale = Number.parseFloat(message.substring('!moonratdamage '.length)) || 1;
                        Connection._moonratDamageScale = damageScale;
                    } catch (error) {}
                }
                if (message.startsWith('!eddiedamage ')) {
                    try {
                        const damageScale = Number.parseFloat(message.substring('!eddiedamage '.length)) || 1;
                        Connection._eddieDamageScale = damageScale;
                    } catch (error) {}
                }
                if (message.startsWith('!reloadmoonrats')) {
                    if (!Connection.isEddie()) {
                        window.location.reload()
                    }
                }
                if (message.startsWith('!reloadeddie')) {
                    if (Connection.isEddie()) {
                        window.location.reload()
                    }
                }
                if (message.startsWith('!killmoonrats')) {
                    if (Connection.isEddie()) {
                        Object.values(Connection._players).filter(entity => entity instanceof Moonrat).forEach(moonrat => {
                            moonrat._health = 0;
                        });
                    }
                }
            }

            if (!TwitchInformation.NAME_TO_ID_MAP.hasOwnProperty(username)) {
                return;
            }

            if (Connection._deadNames[username]) {
                return;
            }

            if (!WaveSystem.isInWave(username) && !WaveSystem.willBeInWave(username)) {
                return;
            }

            try {
                Connection._processPacket(username, message);
            } catch (error) {}
        });

        Connection._players[USERNAME] = Connection._createEntity(USERNAME);
    }

    static update(time) {
        for (const name in Connection._players) {
            if (name === USERNAME) {
                continue;
            }

            if (time - Connection._lastActiveTime[name] > 3000) {
                if (Connection._players[name]) {
                    Connection._players[name].destroy();
                }
                delete Connection._players[name];
                delete Connection._lastActiveTime[name];
            }
        }
    }

    static _processPacket(username, message) {
        Connection._lastActiveTime[username] = Date.now();
        Connection._players[username] = Connection._players[username] || Connection._createEntity(username);

        Connection._players[username].processPacket(message);
    }

    static _createEntity(username) {
        if (username === TwitchInformation.EDDIE_NAME) {
            return new Eddie(username);
        }

        return new Moonrat(username);
    }

    static getEddie() {
        return Connection._players[TwitchInformation.EDDIE_NAME] || null;
    }

    static getClientPlayer() {
        return Connection._players[USERNAME] || null;
    }

    static isEddie() {
        return USERNAME === TwitchInformation.EDDIE_NAME;
    }
}