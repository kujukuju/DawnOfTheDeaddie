class Entity {
    static TEXTURE_WHITE = USERNAME ? PIXI.Texture.from('assets/white.png') : null;

    static PACKET_TYPE_POSITION = 0;
    static PACKET_TYPE_VELOCITY = 1;
    static PACKET_TYPE_MOONRAT_TYPE = 2;
    static PACKET_TYPE_CLAW = 3;
    static PACKET_TYPE_KNOCKBACK = 4;
    static PACKET_TYPE_FIRE_BREATH = 5;
    static PACKET_TYPE_GROUND_SLAM = 6;
    static PACKET_TYPE_GROUND_SLAM_KNOCKBACK = 7;
    static PACKET_TYPE_TANK_ATTACK = 8;
    static PACKET_TYPE_HEALTH = 9;
    static PACKET_TYPE_EDDIE_HEALTH = 10;
    static PACKET_TYPE_SPIT_ATTACK = 11;
    static PACKET_TYPE_GROUND_SPIT = 12;
    static PACKET_TYPE_POUNCE_ATTACK = 13;
    static PACKET_TYPE_GAME_STATE = 14;
    static PACKET_TYPE_HOLY_ATTACK = 15;
    static PACKET_TYPE_WAVE_STATE = 16;

    static ACCEL = 0.8;

    static _buffer = new ArrayBuffer(4);
    static _floatBuffer = new Float32Array(Entity._buffer);
    static _intBuffer = new Int32Array(Entity._buffer);

    constructor(username) {
        this._username = username;

        this._position = [0, 0];
        this._oldPosition = [0, 0];
        this._velocity = [0, 0];
        this._oldVelocity = [0, 0];
        this._positionTime = 0;
        this._oldPositionTime = 0;

        this._forceOffsetTime = 0;
        this._forceOffset = [0, 0];

        this._container = new PIXI.Container();
        Renderer._container.addChild(this._container);

        this._attackSprite = null;
        this._animatedSprite = null;
        this._sprite = null;

        if (this instanceof Moonrat) {
            this._healthBar = new PIXI.Container();
            this._container.addChild(this._healthBar);

            const healthBarBackground = new PIXI.Sprite(Entity.TEXTURE_WHITE);
            healthBarBackground.width = 120;
            healthBarBackground.height = 12;
            healthBarBackground.position.x = -60;
            healthBarBackground.position.y = -12;
            healthBarBackground.tint = 0x572323;
            this._healthBar.addChild(healthBarBackground);

            this._healthBarForeground = new PIXI.Sprite(Entity.TEXTURE_WHITE);
            this._healthBarForeground.width = 116;
            this._healthBarForeground.height = 8;
            this._healthBarForeground.position.x = -58;
            this._healthBarForeground.position.y = -10;
            this._healthBarForeground.tint = 0xe22f2f;
            this._healthBar.addChild(this._healthBarForeground);
        }

        this._lastSentHealth = 1;
        this._health = 1;
        this._maxHealth = 1;

        this._noiseHowl = null;
        this._noiseID = null;

        this._feetVolume = 0;
        this._feetHowl = null;
        this._feetHowlID = null;

        this._packetAppendString = '';

        // lol wtf is this, preventing n^3 loops, compromising for n^2
        this._groundSlamTime = 0;

        this._burnTime = 0;
    }

    update(time) {

    }

    updateLocal(time) {
        if (Connection._deadNames[this._username]) {
            return;
        }

        const position = [this._position[0], this._position[1]];
        const velocity = [this._velocity[0], this._velocity[1]];

        const accel = [0, 0];
        if (InputManager._keys[InputManager.KEY_A]) {
            accel[0] -= 1;
        }
        if (InputManager._keys[InputManager.KEY_D]) {
            accel[0] += 1;
        }
        if (InputManager._keys[InputManager.KEY_W]) {
            accel[1] -= 1;
        }
        if (InputManager._keys[InputManager.KEY_S]) {
            accel[1] += 1;
        }

        const accelLength = Math.sqrt(accel[0] * accel[0] + accel[1] * accel[1]);
        if (accelLength) {
            accel[0] /= accelLength;
            accel[1] /= accelLength;
        }

        velocity[0] += accel[0] * Entity.ACCEL * 2;
        velocity[1] += accel[1] * Entity.ACCEL * 2;

        // friction
        const velocityLength = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
        if (velocityLength) {
            if (velocityLength <= Entity.ACCEL) {
                velocity[0] = 0;
                velocity[1] = 0;
            } else {
                const angle = Math.atan2(velocity[1], velocity[0]);
                velocity[0] = Math.cos(angle) * (velocityLength - Entity.ACCEL);
                velocity[1] = Math.sin(angle) * (velocityLength - Entity.ACCEL);
            }
        }

        // max speed
        const newVelocityLength = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
        if (newVelocityLength > this.getMaxSpeed()) {
            if (newVelocityLength - Entity.ACCEL * 2 <= this.getMaxSpeed()) {
                const angle = Math.atan2(velocity[1], velocity[0]);
                velocity[0] = Math.cos(angle) * this.getMaxSpeed();
                velocity[1] = Math.sin(angle) * this.getMaxSpeed()
            } else {
                const angle = Math.atan2(velocity[1], velocity[0]);
                velocity[0] = Math.cos(angle) * (newVelocityLength - Entity.ACCEL * 2);
                velocity[1] = Math.sin(angle) * (newVelocityLength - Entity.ACCEL * 2);
            }
        }

        position[0] += velocity[0];
        position[1] += velocity[1];

        let loopCount = 0;
        let foundPolygon = false;
        do {
            loopCount++;
            foundPolygon = false;

            const aabb = this.getAABB(position);
            const polygons = LevelManager.queryPolygons(aabb);

            if (Connection.getEddie() && !Connection.isEddie()) {
                const eddieOffset = Connection.getEddie().getPosition(time - 500);
                const eddieAABB = Connection.getEddie().getAABB(eddieOffset);
                if (PolygonMath.overlapAABB(aabb, eddieAABB)) {
                    polygons.push(Connection.getEddie().getPolygon(eddieOffset));
                }
            }

            if (polygons.length) {
                const polygon = this.getPolygon(position);
                for (let i = 0; i < polygons.length; i++) {
                    const offset = MathHelper.overlapPolygons(polygons[i], polygon);

                    if (offset) {
                        foundPolygon = true;
                        position[0] += offset[0] * 1.05;
                        position[1] += offset[1] * 1.05;

                        break;
                    }
                }
            }
        } while (foundPolygon && loopCount < 4);

        if (Connection.isEddie() && Connection.getEddie()) {
            const aabb = this.getAABB(position);

            const moonrats = Object.values(Connection._players).filter(entity => entity instanceof Moonrat);
            for (let i = 0; i < moonrats.length; i++) {
                const moonratAABB = moonrats[i].getAABB(moonrats[i].getPosition(time - 500));

                if (PolygonMath.overlapAABB(aabb, moonratAABB)) {
                    const polygon = this.getPolygon(position);
                    const moonratPolygon = moonrats[i].getPolygon(moonrats[i].getPosition(time - 500));

                    const offset = MathHelper.overlapPolygons(polygon, moonratPolygon);
                    if (offset) {
                        moonrats[i].forceOffset(time - 500, offset[0], offset[1]);
                    }
                }
            }
        }

        this.setPosition(time, position[0], position[1]);
        this.setVelocity(velocity[0], velocity[1]);
    }

    updateRender(time) {
        if (!this._sprite || !this._animatedSprite) {
            return;
        }

        if (this._healthBar) {
            if (this._health === this._maxHealth) {
                this._healthBar.alpha = 0;
            } else {
                this._healthBar.alpha = 1;
            }

            this._healthBar.position.y = -this._sprite.height * this._sprite.anchor.y;
            this._healthBarForeground.width = Math.max(0, this._health / this._maxHealth) * 116;
        }

        const position = this.getPosition(time);
        this._container.position.x = position[0];
        this._container.position.y = position[1];

        if (this._noiseHowl) {
            AudioSystem.setPosition(this._noiseHowl, this._noiseID, position);
        }

        this._sprite.visible = true;
        this._animatedSprite.visible = false;
        let feetHowlMuted = true;
        if (this._position[0] < this._oldPosition[0] - 1) {
            this._container.scale.x = -Math.abs(this._container.scale.x);
            if (this._healthBar) {
                this._healthBar.scale.x = -Math.abs(this._healthBar.scale.x);
            }
            this._sprite.visible = false;
            this._animatedSprite.visible = true;
            feetHowlMuted = false;
        }
        if (this._position[0] > this._oldPosition[0] + 1) {
            this._container.scale.x = Math.abs(this._container.scale.x);
            if (this._healthBar) {
                this._healthBar.scale.x = Math.abs(this._healthBar.scale.x);
            }
            this._sprite.visible = false;
            this._animatedSprite.visible = true;
            feetHowlMuted = false;
        }
        if (this._position[1] < this._oldPosition[1] - 1) {
            this._sprite.visible = false;
            this._animatedSprite.visible = true;
            feetHowlMuted = false;
        }
        if (this._position[1] > this._oldPosition[1] + 1) {
            this._sprite.visible = false;
            this._animatedSprite.visible = true;
            feetHowlMuted = false;
        }

        if (this._attackSprite) {
            this._sprite.visible = false;
            this._animatedSprite.visible = false;
            this._attackSprite.visible = true;
        }

        if (this._feetHowl) {
            if (this instanceof Moonrat) {
                AudioSystem.setPosition(this._feetHowl, this._feetHowlID, position);
            }

            const dx = this._position[0] - this._oldPosition[0];
            const dy = this._position[1] - this._oldPosition[1];
            const d = Math.sqrt(dx * dx + dy * dy) / ((this._positionTime - this._oldPositionTime) || 1000) * 16;
            const volume = Math.max(0, Math.min(1, d / this.getMaxSpeed()));
            this._feetHowl.volume(volume * this._feetVolume, this._feetHowlID);

            this._feetHowl.mute(feetHowlMuted, this._feetHowlID);
        }
    }

    getPosition(time) {
        const over = time - this._oldPositionTime;
        const under = this._positionTime - this._oldPositionTime;
        if (under === 0) {
            return [this._oldPosition[0], this._oldPosition[1]];
        }
        const dt = Math.min(1, Math.max(0, over / under));

        if (dt === 0) {
            return [this._oldPosition[0], this._oldPosition[1]];
        }
        if (dt === 1) {
            return [this._position[0], this._position[1]];
        }

        const tangentialScale = under / 16;
        const tangentials = [[this._oldVelocity[0] * tangentialScale, this._oldVelocity[1] * tangentialScale], [this._velocity[0] * tangentialScale, this._velocity[1] * tangentialScale]];

        const returnPosition = hermite(dt, [this._oldPosition, this._position], tangentials);
        const forcedOffset = this.getForceOffset(time);
        returnPosition[0] += forcedOffset[0];
        returnPosition[1] += forcedOffset[1];

        return returnPosition;
    }

    setPosition(time, x, y) {
        this._oldPosition[0] = this._position[0];
        this._oldPosition[1] = this._position[1];
        this._oldPositionTime = this._positionTime;

        this._position[0] = x;
        this._position[1] = y;
        this._positionTime = time;
    }

    setVelocity(x, y) {
        this._oldVelocity[0] = this._velocity[0];
        this._oldVelocity[1] = this._velocity[1];

        this._velocity[0] = x;
        this._velocity[1] = y;
    }

    forceOffset(time, x, y) {
        const currentOffset = this.getForceOffset(time);
        this._forceOffset[0] = currentOffset[0];
        this._forceOffset[1] = currentOffset[1];

        this._forceOffset[0] += x;
        this._forceOffset[1] += y;
        this._forceOffsetTime = time;
    }

    getForceOffset(time) {
        const percent = 1 - Math.min(1, Math.max(0, (time - this._forceOffsetTime) / 500));

        return [this._forceOffset[0] * percent, this._forceOffset[1] * percent];
    }

    static createPositionPacket(x, y) {
        return String.fromCharCode(Entity.PACKET_TYPE_POSITION) + Entity.getStringFromFloat(x) + Entity.getStringFromFloat(y);
    }

    static createVelocityPacket(x, y) {
        return String.fromCharCode(Entity.PACKET_TYPE_VELOCITY) + Entity.getStringFromFloat(x) + Entity.getStringFromFloat(y);
    }

    static createMoonratTypePacket(type) {
        return String.fromCharCode(Entity.PACKET_TYPE_MOONRAT_TYPE) + String.fromCharCode(type);
    }

    static createHealthPacket() {
        const healthThings = [];

        const moonrats = Object.values(Connection._players).filter(entity => entity instanceof Moonrat);
        for (let i = 0; i < moonrats.length; i++) {
            const entity = moonrats[i];

            if (entity._health !== entity._lastSentHealth) {
                entity._lastSentHealth = entity._health;
                healthThings.push({
                    id: TwitchInformation.NAME_TO_ID_MAP[entity._username],
                    health: Math.max(0, entity._health),
                });
            }
        }

        if (!healthThings.length) {
            return '';
        }

        return String.fromCharCode(Entity.PACKET_TYPE_HEALTH) +
            String.fromCharCode(healthThings.length) +
            healthThings.map(healthThing => {
                return String.fromCharCode(healthThing.id) + String.fromCharCode(healthThing.health);
            }).join('');
    }

    static createEddieHealthPacket() {
        return String.fromCharCode(Entity.PACKET_TYPE_EDDIE_HEALTH) + Entity.getStringFromInt(Math.max(0, Connection.getEddie()._health));
    }

    static createGameStatePacket() {
        return String.fromCharCode(Entity.PACKET_TYPE_GAME_STATE) + String.fromCharCode(StateManager._currentState);
    }

    static createWaveStatePacket() {
        return String.fromCharCode(Entity.PACKET_TYPE_WAVE_STATE) + String.fromCharCode(WaveSystem._wave) + String.fromCharCode(WaveSystem._currentPlayerLimit);
    }

    static getFloatFromString(string) {
        const byte1 = string.charCodeAt(0);
        const byte2 = string.charCodeAt(1);
        const byte3 = string.charCodeAt(2);
        const byte4 = string.charCodeAt(3);

        Entity._intBuffer[0] = (byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4;

        return Entity._floatBuffer[0];
    }

    static getStringFromFloat(value) {
        Entity._floatBuffer[0] = value;

        const intVal = Entity._intBuffer[0];

        const byte1 = (intVal & 0xff000000) >>> 24;
        const byte2 = (intVal & 0x00ff0000) >>> 16;
        const byte3 = (intVal & 0x0000ff00) >>> 8;
        const byte4 = intVal & 0x000000ff;

        return String.fromCharCode(byte1) + String.fromCharCode(byte2) + String.fromCharCode(byte3) + String.fromCharCode(byte4);
    }

    static getIntFromString(string) {
        const byte1 = string.charCodeAt(0);
        const byte2 = string.charCodeAt(1);
        const byte3 = string.charCodeAt(2);
        const byte4 = string.charCodeAt(3);

        return (byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4;
    }

    static getStringFromInt(value) {
        Entity._intBuffer[0] = value;

        const intVal = Entity._intBuffer[0];

        const byte1 = (intVal & 0xff000000) >>> 24;
        const byte2 = (intVal & 0x00ff0000) >>> 16;
        const byte3 = (intVal & 0x0000ff00) >>> 8;
        const byte4 = intVal & 0x000000ff;

        return String.fromCharCode(byte1) + String.fromCharCode(byte2) + String.fromCharCode(byte3) + String.fromCharCode(byte4);
    }

    getAABB(offset) {

    }

    getPolygon(offset) {

    }

    getMaxSpeed() {
        return 2;
    }

    destroy() {
        if (this._sprite) {
            this._sprite.destroy();
            this._sprite = null;
        }

        if (this._animatedSprite) {
            this._animatedSprite.destroy();
            this._animatedSprite = null;
        }

        if (this._healthBar) {
            this._healthBar.destroy();
            this._healthBar = null;
        }

        if (this._container) {
            this._container.destroy();
            this._container = null;
        }

        if (this._noiseHowl) {
            this._noiseHowl.stop(this._noiseID);
            this._noiseHowl = null;
        }

        if (this._feetHowl) {
            this._feetHowl.stop(this._feetHowlID);
            this._feetHowl = null;
        }
    }
}