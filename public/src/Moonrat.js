class Moonrat extends Entity {
    static MOONRAT_TYPE_TANK = 0;
    static MOONRAT_TYPE_SPITRAT = 1;
    static MOONRAT_TYPE_HOODRAT = 2;

    static TANK_FEET = USERNAME ? new Howl({src: ['assets/audio/feet-loop-lower.mp3'], volume: 2, loop: true, mute: true}) : null;
    static TANK_NOISE = USERNAME ? new Howl({src: ['assets/audio/heavy-breathing-loop.mp3'], volume: 0.1, loop: true}) : null;
    static TANK_POLYGON = [[80, 0], [78.46282243225843, 7.8036128806451295], [73.91036260090294, 15.307337294603592], [66.51756898420362, 22.222809320784087], [56.568542494923804, 28.2842712474619], [44.44561864156818, 33.25878449210181], [30.614674589207187, 36.95518130045147], [15.607225761290266, 39.23141121612922], [4.898587196589413e-15, 40], [-15.607225761290255, 39.23141121612922], [-30.614674589207176, 36.95518130045147], [-44.44561864156816, 33.25878449210181], [-56.5685424949238, 28.284271247461902], [-66.51756898420362, 22.222809320784087], [-73.91036260090294, 15.307337294603595], [-78.46282243225843, 7.803612880645145], [-80, 4.898587196589413e-15], [-78.46282243225843, -7.803612880645135], [-73.91036260090294, -15.307337294603586], [-66.51756898420363, -22.22280932078408], [-56.56854249492382, -28.2842712474619], [-44.445618641568174, -33.25878449210181], [-30.614674589207226, -36.95518130045146], [-15.607225761290293, -39.23141121612921], [-1.4695761589768237e-14, -40], [15.607225761290264, -39.23141121612922], [30.6146745892072, -36.955181300451464], [44.445618641568146, -33.25878449210182], [56.56854249492379, -28.28427124746191], [66.51756898420362, -22.222809320784087], [73.91036260090291, -15.307337294603617], [78.46282243225842, -7.803612880645149]];
    static TANK_AABB = [[-80, -40], [80, 40]];

    static SPITRAT_FEET = USERNAME ? new Howl({src: ['assets/audio/feet-loop-high.mp3'], volume: 2, loop: true, mute: true}) : null;
    static SPITRAT_NOISE = USERNAME ? new Howl({src: ['assets/audio/gross-noises-loop.mp3'], volume: 0.5, loop: true}) : null;
    static SPITRAT_POLYGON = [[30, 0], [29.423558412096913, 3.9018064403225647], [27.716385975338603, 7.653668647301796], [24.944088369076358, 11.111404660392044], [21.213203435596427, 14.14213562373095], [16.667106990588067, 16.629392246050905], [11.480502970952696, 18.477590650225736], [5.85270966048385, 19.61570560806461], [1.83697019872103e-15, 20], [-5.852709660483846, 19.61570560806461], [-11.480502970952692, 18.477590650225736], [-16.66710699058806, 16.629392246050905], [-21.213203435596423, 14.142135623730951], [-24.94408836907636, 11.111404660392044], [-27.716385975338603, 7.653668647301798], [-29.423558412096913, 3.9018064403225723], [-30, 2.4492935982947065e-15], [-29.423558412096913, -3.9018064403225674], [-27.716385975338607, -7.653668647301793], [-24.944088369076365, -11.11140466039204], [-21.21320343559643, -14.14213562373095], [-16.667106990588067, -16.629392246050905], [-11.48050297095271, -18.47759065022573], [-5.8527096604838595, -19.615705608064605], [-5.510910596163089e-15, -20], [5.852709660483849, -19.61570560806461], [11.480502970952701, -18.477590650225732], [16.667106990588056, -16.62939224605091], [21.21320343559642, -14.142135623730955], [24.944088369076358, -11.111404660392044], [27.716385975338596, -7.653668647301808], [29.42355841209691, -3.9018064403225745]];
    static SPITRAT_AABB = [[-30, -20], [30, 20]];

    static HOODRAT_FEET = USERNAME ? new Howl({src: ['assets/audio/feet-loop-mid.mp3'], volume: 2, loop: true, mute: true}) : null;
    static HOODRAT_NOISE = USERNAME ? new Howl({src: ['assets/audio/pouncer-loop.mp3'], volume: 0.5, loop: true}) : null;
    static HOODRAT_POLYGON = [[120, 0], [117.69423364838765, 5.852709660483847], [110.86554390135441, 11.480502970952694], [99.77635347630543, 16.667106990588067], [84.8528137423857, 21.213203435596423], [66.66842796235227, 24.944088369076358], [45.92201188381078, 27.716385975338603], [23.4108386419354, 29.423558412096913], [7.34788079488412e-15, 30], [-23.410838641935385, 29.423558412096913], [-45.92201188381077, 27.716385975338603], [-66.66842796235224, 24.94408836907636], [-84.85281374238569, 21.213203435596427], [-99.77635347630545, 16.667106990588067], [-110.86554390135441, 11.480502970952697], [-117.69423364838765, 5.852709660483859], [-120, 3.67394039744206e-15], [-117.69423364838765, -5.852709660483851], [-110.86554390135443, -11.48050297095269], [-99.77635347630546, -16.66710699058806], [-84.85281374238572, -21.213203435596423], [-66.66842796235227, -24.944088369076358], [-45.92201188381084, -27.716385975338596], [-23.410838641935438, -29.42355841209691], [-2.2043642384652355e-14, -30], [23.410838641935396, -29.423558412096913], [45.922011883810804, -27.7163859753386], [66.66842796235223, -24.944088369076365], [84.85281374238568, -21.21320343559643], [99.77635347630543, -16.667106990588067], [110.86554390135439, -11.480502970952712], [117.69423364838764, -5.852709660483861]];
    static HOODRAT_AABB = [[-120, -30], [120, 30]];

    static POLYGON = Moonrat.TANK_POLYGON;
    static AABB = Moonrat.TANK_AABB;

    static TEXTURE_TANKRAT_WALKING = USERNAME ? ['assets/tankrat/Titan-1.png', 'assets/tankrat/Titan-2.png', 'assets/tankrat/Titan-3.png', 'assets/tankrat/Titan-4.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;
    static TEXTURE_TANKRAT = USERNAME ? PIXI.Texture.from('assets/tankrat/Titan.png') : null;

    static TEXTURE_SPITRAT_WALKING = USERNAME ? ['assets/spitrat/Bones-1.png', 'assets/spitrat/Bones-2.png', 'assets/spitrat/Bones-3.png', 'assets/spitrat/Bones-4.png', 'assets/spitrat/Bones-5.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;
    static TEXTURE_SPITRAT = USERNAME ? PIXI.Texture.from('assets/spitrat/Bones.png') : null;

    static TEXTURE_HOODRAT_WALKING = USERNAME ? ['assets/hoodrat/Feral-1.png', 'assets/hoodrat/Feral-2.png', 'assets/hoodrat/Feral-3.png', 'assets/hoodrat/Feral-4.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;
    static TEXTURE_HOODRAT = USERNAME ? PIXI.Texture.from('assets/hoodrat/Feral.png') : null;

    static _lastBurningAudioTime = 0;

    constructor(username) {
        super(username);

        this._desiredMoonratType = Math.floor(Math.random() * 3);
        this._currentMoonratType = null;

        // play noises if they odnt attack for a long time
        this._lastAttackTime = Date.now();

        this._feetVolume = 2;

        this._lastPainTime = 0;

        this._lastFireParticleCreateTime = 0;

        this._position = LevelManager.getMoonratSpawn();
        this._oldPosition = [this._position[0], this._position[1]];

        this._lastInsideArena = false;
    }

    update(time) {
        if (Connection._deadNames[this._username]) {
            return;
        }

        if (this._health <= 0) {
            Connection._deadNames[this._username] = true;
            this.destroy();

            GravestoneTracker.addMoonratGravestone(this._position, this._currentMoonratType);

            AudioSystem.playDeathSound(this._position);

            if (this._username === USERNAME) {
                window.location.reload();
            }

            return;
        }

        const insideArena = WaveSystem.getWavePrepPolygon();
        if (this._lastInsideArena !== insideArena) {
            this._lastInsideArena = insideArena;

            let closestPoint = null;
            let closestDistanceSquared = Number.MAX_VALUE;

            for (let i = 0; i < LevelManager._drawingPolygons.length; i++) {
                const polygon = LevelManager._drawingPolygons[i];

                for (let a = 0; a < polygon.length; a++) {
                    const point = polygon[a];
                    const nextPoint = polygon[(a + 1) % polygon.length];

                    const line = [point, nextPoint];

                    const nearestPoint = PolygonMath.nearestPointOnLineSegment(line, this._position);
                    const dx = nearestPoint[0] - this._position[0];
                    const dy = nearestPoint[1] - this._position[1];
                    const d2 = dx * dx + dy * dy;

                    if (d2 < closestDistanceSquared) {
                        closestDistanceSquared = d2;
                        closestPoint = nearestPoint;
                    }
                }
            }

            if (closestPoint) {
                this._position[0] = closestPoint[0];
                this._position[1] = closestPoint[1];
            }
        }

        if (time - this._burnTime <= 2500 && Connection.isEddie()) {
            this._health -= 0.24 * Connection._eddieDamageScale;

            if (time - Moonrat._lastBurningAudioTime > 4000 && Math.random() < 0.001) {
                Moonrat._lastBurningAudioTime = time;
                AudioSystem.playSound(AudioSystem.BURNING_DAD, this._position);
            }

            if (time - this._lastPainTime > 600) {
                AudioSystem.playPainSound(this._position, this._currentMoonratType);
                this._lastPainTime = time;
            }

            if (time - this._lastFireParticleCreateTime > 200) {
                this._lastFireParticleCreateTime = time;

                const visualFireParticlePosition = [this._position[0] + Math.random() * 80 - 40, this._position[1] + Math.random() * 40 - 20];
                const visualFireParticle = new VisualFireParticle(this._username, time, visualFireParticlePosition);
                AbilityManager.addAbility(visualFireParticle);
            }
        }

        if (this._desiredMoonratType !== this._currentMoonratType) {
            this._currentMoonratType = this._desiredMoonratType;

            switch (this._desiredMoonratType) {
                case Moonrat.MOONRAT_TYPE_TANK: {
                    this._health = this._health / this._maxHealth * 160;
                    this._maxHealth = 160;
                    this._lastSentHealth = this._maxHealth;

                    Moonrat.POLYGON = Moonrat.TANK_POLYGON;
                    Moonrat.AABB = Moonrat.TANK_AABB;

                    if (this._attackSprite) {
                        this._attackSprite.destroy();
                        this._attackSprite = null;
                    }

                    this._animatedSprite && this._animatedSprite.destroy();
                    this._animatedSprite = new PIXI.AnimatedSprite(Moonrat.TEXTURE_TANKRAT_WALKING);
                    this._animatedSprite.anchor.x = 0.5;
                    this._animatedSprite.anchor.y = 0.9;
                    this._animatedSprite.scale.x = 0.5;
                    this._animatedSprite.scale.y = 0.5;
                    this._animatedSprite.animationSpeed = 0.2;
                    this._animatedSprite.loop = true;
                    this._animatedSprite.visible = false;
                    this._animatedSprite.play();
                    this._container.addChild(this._animatedSprite);

                    this._sprite && this._sprite.destroy();
                    this._sprite = new PIXI.Sprite(Moonrat.TEXTURE_TANKRAT);
                    this._sprite.anchor.x = 0.5;
                    this._sprite.anchor.y = 0.9;
                    this._sprite.scale.x = 0.5;
                    this._sprite.scale.y = 0.5;
                    this._container.addChild(this._sprite);

                    if (this._noiseHowl) {
                        this._noiseHowl.stop(this._noiseID);
                    }
                    this._noiseHowl = Moonrat.TANK_NOISE;
                    this._noiseID = AudioSystem.playSound(this._noiseHowl, this._position);

                    if (this._feetHowl) {
                        this._feetHowl.stop(this._feetHowlID);
                    }
                    this._feetHowl = Moonrat.TANK_FEET;
                    this._feetHowlID = AudioSystem.playSound(this._feetHowl, this._position);
                } break;

                case Moonrat.MOONRAT_TYPE_SPITRAT: {
                    this._health = this._health / this._maxHealth * 60;
                    this._maxHealth = 60;
                    this._lastSentHealth = this._maxHealth;

                    Moonrat.POLYGON = Moonrat.SPITRAT_POLYGON;
                    Moonrat.AABB = Moonrat.SPITRAT_AABB;

                    if (this._attackSprite) {
                        this._attackSprite.destroy();
                        this._attackSprite = null;
                    }

                    this._animatedSprite && this._animatedSprite.destroy();
                    this._animatedSprite = new PIXI.AnimatedSprite(Moonrat.TEXTURE_SPITRAT_WALKING);
                    this._animatedSprite.anchor.x = 0.5;
                    this._animatedSprite.anchor.y = 0.9;
                    this._animatedSprite.scale.x = 0.5;
                    this._animatedSprite.scale.y = 0.5;
                    this._animatedSprite.animationSpeed = 0.25;
                    this._animatedSprite.loop = true;
                    this._animatedSprite.visible = false;
                    this._animatedSprite.play();
                    this._container.addChild(this._animatedSprite);

                    this._sprite && this._sprite.destroy();
                    this._sprite = new PIXI.Sprite(Moonrat.TEXTURE_SPITRAT);
                    this._sprite.anchor.x = 0.5;
                    this._sprite.anchor.y = 0.9;
                    this._sprite.scale.x = 0.5;
                    this._sprite.scale.y = 0.5;
                    this._container.addChild(this._sprite);

                    if (this._noiseHowl) {
                        this._noiseHowl.stop(this._noiseID);
                    }
                    this._noiseHowl = Moonrat.SPITRAT_NOISE;
                    this._noiseID = AudioSystem.playSound(this._noiseHowl, this._position);

                    if (this._feetHowl) {
                        this._feetHowl.stop(this._feetHowlID);
                    }
                    this._feetHowl = Moonrat.SPITRAT_FEET;
                    this._feetHowlID = AudioSystem.playSound(this._feetHowl, this._position);
                } break;

                case Moonrat.MOONRAT_TYPE_HOODRAT: {
                    this._health = this._health / this._maxHealth * 90;
                    this._maxHealth = 90;
                    this._lastSentHealth = this._maxHealth;

                    Moonrat.POLYGON = Moonrat.HOODRAT_POLYGON;
                    Moonrat.AABB = Moonrat.HOODRAT_AABB;

                    if (this._attackSprite) {
                        this._attackSprite.destroy();
                        this._attackSprite = null;
                    }

                    this._animatedSprite && this._animatedSprite.destroy();
                    this._animatedSprite = new PIXI.AnimatedSprite(Moonrat.TEXTURE_HOODRAT_WALKING);
                    this._animatedSprite.anchor.x = 0.5;
                    this._animatedSprite.anchor.y = 0.8;
                    this._animatedSprite.scale.x = 0.5;
                    this._animatedSprite.scale.y = 0.5;
                    this._animatedSprite.animationSpeed = 0.2;
                    this._animatedSprite.loop = true;
                    this._animatedSprite.visible = false;
                    this._animatedSprite.play();
                    this._container.addChild(this._animatedSprite);

                    this._sprite && this._sprite.destroy();
                    this._sprite = new PIXI.Sprite(Moonrat.TEXTURE_HOODRAT);
                    this._sprite.anchor.x = 0.5;
                    this._sprite.anchor.y = 0.8;
                    this._sprite.scale.x = 0.5;
                    this._sprite.scale.y = 0.5;
                    this._container.addChild(this._sprite);

                    if (this._noiseHowl) {
                        this._noiseHowl.stop(this._noiseID);
                    }
                    this._noiseHowl = Moonrat.HOODRAT_NOISE;
                    this._noiseID = AudioSystem.playSound(this._noiseHowl, this._position);

                    if (this._feetHowl) {
                        this._feetHowl.stop(this._feetHowlID);
                    }
                    this._feetHowl = Moonrat.HOODRAT_FEET;
                    this._feetHowlID = AudioSystem.playSound(this._feetHowl, this._position);
                } break;
            }
        }

        if (Connection.getClientPlayer() === this) {
            switch (this._currentMoonratType) {
                case Moonrat.MOONRAT_TYPE_TANK: {
                    if (InputManager._mouseLeft && time - TankAttack._lastTime >= TankAttack.COOLDOWN) {
                        TankAttack._lastTime = time;

                        CooldownManager.startCD(192, TankAttack.COOLDOWN, 0xa3a3a3);

                        const mousePosition = Camera.getMousePosition();
                        const angle = Math.atan2(mousePosition[1] - this._position[1], mousePosition[0] - this._position[0]);

                        const ability = new TankAttack(this._username, time, this._position, angle);
                        AbilityManager.addAbility(ability);

                        this._lastAttackTime = time;
                    }
                } break;

                case Moonrat.MOONRAT_TYPE_SPITRAT: {
                    if (InputManager._mouseLeft && time - SpitAttack._lastTime >= SpitAttack.COOLDOWN) {
                        SpitAttack._lastTime = time;

                        CooldownManager.startCD(192, SpitAttack.COOLDOWN, 0x70a049);

                        const mousePosition = Camera.getMousePosition();
                        const ability = new SpitAttack(this._username, time, this._position, mousePosition);
                        AbilityManager.addAbility(ability);

                        this._lastAttackTime = time;
                    }
                } break;

                case Moonrat.MOONRAT_TYPE_HOODRAT: {
                    if (InputManager._mouseLeft && time - PounceAttack._lastTime >= PounceAttack.COOLDOWN) {
                        PounceAttack._lastTime = time;

                        CooldownManager.startCD(192, PounceAttack.COOLDOWN, 0xc27f38);

                        const mousePosition = Camera.getMousePosition();
                        const angle = Math.atan2(mousePosition[1] - this._position[1], mousePosition[0] - this._position[0]);
                        const ability = new PounceAttack(this._username, time, angle);
                        AbilityManager.addAbility(ability);

                        this._lastAttackTime = time;
                    }
                } break;
            }
        }

        if (time - this._lastAttackTime > 4000) {
            // dont play noises to much
            this._lastAttackTime = time - 2000;
            if (Math.random() < 0.05) {
                this._lastAttackTime = time;
                switch (this._currentMoonratType) {
                    case Moonrat.MOONRAT_TYPE_TANK: {
                        AudioSystem.playTankSound(this._position);
                    } break;

                    case Moonrat.MOONRAT_TYPE_SPITRAT: {
                        AudioSystem.playSpitterSound(this._position);
                    } break;

                    case Moonrat.MOONRAT_TYPE_HOODRAT: {
                        AudioSystem.playPouncerSound(this._position);
                    } break;
                }
            }
        }
    }

    sendPackets() {
        if (!TwitchPackets.canSendPacketImmediately()) {
            return;
        }

        const packet = Entity.createPositionPacket(this._position[0], this._position[1]) +
            Entity.createVelocityPacket(this._velocity[0], this._velocity[1]) +
            Entity.createMoonratTypePacket(this._currentMoonratType) +
            this._packetAppendString;
        this._packetAppendString = '';

        TwitchPackets.send(packet);
    }

    processPacket(message) {
        if (!message) {
            return;
        }

        const packetType = message.charCodeAt(0);
        message = message.substring(1);

        switch (packetType) {
            case Entity.PACKET_TYPE_POSITION: {
                const x = Entity.getFloatFromString(message);
                message = message.substring(4);
                const y = Entity.getFloatFromString(message);
                message = message.substring(4);

                this.setPosition(Date.now(), x, y);
            } break;

            case Entity.PACKET_TYPE_VELOCITY: {
                const x = Entity.getFloatFromString(message);
                message = message.substring(4);
                const y = Entity.getFloatFromString(message);
                message = message.substring(4);

                this.setVelocity(x, y);
            } break;

            case Entity.PACKET_TYPE_MOONRAT_TYPE: {
                const type = message.charCodeAt(0);
                message = message.substring(1);

                this._desiredMoonratType = type;
            } break;

            case Entity.PACKET_TYPE_TANK_ATTACK: {
                const x = Entity.getFloatFromString(message);
                message = message.substring(4);
                const y = Entity.getFloatFromString(message);
                message = message.substring(4);
                const angle = Entity.getFloatFromString(message);
                message = message.substring(4);

                const ability = new TankAttack(this._username, Date.now(), [x, y], angle);
                AbilityManager.addAbility(ability);

                this._lastAttackTime = Date.now();
            } break;

            case Entity.PACKET_TYPE_SPIT_ATTACK: {
                const x = Entity.getFloatFromString(message);
                message = message.substring(4);
                const y = Entity.getFloatFromString(message);
                message = message.substring(4);
                const endX = Entity.getFloatFromString(message);
                message = message.substring(4);
                const endY = Entity.getFloatFromString(message);
                message = message.substring(4);

                const ability = new SpitAttack(this._username, Date.now(), [x, y], [endX, endY]);
                AbilityManager.addAbility(ability);

                this._lastAttackTime = Date.now();
            } break;

            case Entity.PACKET_TYPE_GROUND_SPIT: {
                const x = Entity.getFloatFromString(message);
                message = message.substring(4);
                const y = Entity.getFloatFromString(message);
                message = message.substring(4);

                const ability = new GroundSpit(this._username, Date.now(), [x, y]);
                AbilityManager.addAbility(ability);
            } break;

            case Entity.PACKET_TYPE_POUNCE_ATTACK: {
                const angle = Entity.getFloatFromString(message);
                message = message.substring(4);

                const ability = new PounceAttack(this._username, Date.now(), angle);
                AbilityManager.addAbility(ability);

                this._lastAttackTime = Date.now();
            } break;
        }

        this.processPacket(message);
    }

    getAABB(offset) {
        return Moonrat.AABB.map(point => {
            return [point[0] + offset[0], point[1] + offset[1]];
        });
    }

    getPolygon(offset) {
        return Moonrat.POLYGON.map(point => {
            return [point[0] + offset[0], point[1] + offset[1]];
        });
    }

    getMaxSpeed() {
        return AbilityManager.shouldSlow(this._username) ? 1.5 : 6;
    }
}