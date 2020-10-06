class Eddie extends Entity {
    static POLYGON = [[320, 0], [313.85128972903374, 19.509032201612825], [295.64145040361177, 38.268343236508976], [266.0702759368145, 55.557023301960214], [226.27416997969522, 70.71067811865474], [177.78247456627273, 83.14696123025452], [122.45869835682875, 92.38795325112868], [62.428903045161064, 98.07852804032305], [1.9594348786357652e-14, 100], [-62.42890304516102, 98.07852804032305], [-122.4586983568287, 92.38795325112868], [-177.78247456627264, 83.14696123025453], [-226.2741699796952, 70.71067811865476], [-266.0702759368145, 55.557023301960214], [-295.64145040361177, 38.26834323650899], [-313.85128972903374, 19.50903220161286], [-320, 1.2246467991473532e-14], [-313.85128972903374, -19.509032201612836], [-295.64145040361177, -38.26834323650897], [-266.07027593681454, -55.55702330196019], [-226.27416997969527, -70.71067811865474], [-177.7824745662727, -83.14696123025452], [-122.4586983568289, -92.38795325112865], [-62.42890304516117, -98.07852804032304], [-5.878304635907295e-14, -100], [62.42890304516106, -98.07852804032305], [122.4586983568288, -92.38795325112866], [177.78247456627258, -83.14696123025455], [226.27416997969516, -70.71067811865477], [266.0702759368145, -55.557023301960214], [295.64145040361166, -38.26834323650904], [313.8512897290337, -19.50903220161287]];
    static AABB = [[-320, -100], [320, 100]];

    static FEET = USERNAME ? new Howl({src: ['assets/audio/feet-loop-lower.mp3'], volume: 0.5, loop: true, mute: true}) : null;

    static TEXTURE_WALKING = USERNAME ? ['assets/eddie/Eddiewalk-1.png', 'assets/eddie/Eddiewalk-2.png', 'assets/eddie/Eddiewalk-3.png', 'assets/eddie/Eddiewalk-4.png', 'assets/eddie/Eddiewalk-5.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;
    static TEXTURE = USERNAME ? PIXI.Texture.from('assets/eddie/Eddie.png') : null;

    constructor(username) {
        super(username);

        this._animatedSprite = new PIXI.AnimatedSprite(Eddie.TEXTURE_WALKING);
        this._animatedSprite.anchor.x = 1133 / 1810;
        this._animatedSprite.anchor.y = 1118 / 1317;
        this._animatedSprite.scale.x = 0.8;
        this._animatedSprite.scale.y = 0.8;
        this._animatedSprite.animationSpeed = 0.15;
        this._animatedSprite.loop = true;
        this._animatedSprite.visible = false;
        this._animatedSprite.play();
        this._container.addChild(this._animatedSprite);

        this._sprite = new PIXI.Sprite(Eddie.TEXTURE);
        this._sprite.anchor.x = 1133 / 1810;
        this._sprite.anchor.y = 1118 / 1317;
        this._sprite.scale.x = 0.8;
        this._sprite.scale.y = 0.8;
        this._container.addChild(this._sprite);

        this._canFireBreath = true;
        this._fireBreathing = false;

        this._health = 6000;
        this._maxHealth = 6000;
        this._lastSentHealth = this._maxHealth;

        this._fireHowlID = null;

        this._lastSpitDamageNoiseTime = 0;

        this._feetVolume = 0.2;
        if (Connection.isEddie()) {
            this._feetHowl = Eddie.FEET;
            this._feetHowlID = this._feetHowl.play();
        }

        this._inSpit = false;
    }

    update(time) {
        const healthPercent = Math.max(this._health / this._maxHealth, 0) * (1 - 0.042 * 2) + 0.042;
        document.getElementById('healthbar-container').style.width = Math.floor((400 * healthPercent)) + 'px';

        if (Connection._deadNames[this._username]) {
            if (Connection.isEddie()) {
                if (document.getElementById('dead-screen').style.display === 'block') {
                    document.getElementById('dead-screen').style.opacity = '100%';
                }
                document.getElementById('dead-screen').style.display = 'block';
            } else {
                delete Connection._players[this._username];
                Connection._deadNames = {};
            }

            return;
        }

        if (this._health <= 0) {
            if (Connection.isEddie()) {
                GravestoneTracker.addEddieGravestone(this._position);
            }
            Connection._deadNames[this._username] = true;
            this.destroy();

            return;
        }

        if (Connection.getClientPlayer() === this) {
            if (this._inSpit) {
                this._health -= GroundSpit.DAMAGE_PER_TICK * Connection._moonratDamageScale;
                AudioSystem.playEddiePainSound(this._position);

                if (time - this._lastSpitDamageNoiseTime > 100) {
                    setTimeout(() => {
                        GroundSpit.DAMAGE.play();
                    }, Math.random() * 50);
                    this._lastSpitDamageNoiseTime = time;
                }
            }

            if (!AbilityManager.shouldSlow(this._username) && StateManager.canAttack()) {
                if (InputManager._mouseLeft && time - Claw._lastTime >= Claw.COOLDOWN) {
                    Claw._lastTime = time;

                    CooldownManager.startCD(CooldownManager.getWidthByIndex(0), Claw.COOLDOWN, 0xa3a3a3);

                    const mousePosition = Camera.getMousePosition();
                    const angle = Math.atan2(mousePosition[1] - this._position[1], mousePosition[0] - this._position[0]);

                    const ability = new Claw(this._username, time, this._position, angle);
                    AbilityManager.addAbility(ability);
                }
            }

            if (InputManager._mouseRight && this._canFireBreath && (this._fireBreathing || time - FireBreath._lastTime >= FireBreath.COOLDOWN) && StateManager.canAttack()) {
                this._canFireBreath = false;
                this._fireBreathing = true;

                const mousePosition = Camera.getMousePosition();
                const angle = Math.atan2(mousePosition[1] - this._position[1], mousePosition[0] - this._position[0]);

                const ability = new FireBreath(this._username, time, this._position, angle);
                AbilityManager.addAbility(ability);
            }

            if (!InputManager._mouseRight && this._canFireBreath && this._fireBreathing) {
                this._fireBreathing = false;
                FireBreath._lastTime = time;

                CooldownManager.startCD(CooldownManager.getWidthByIndex(1), FireBreath.COOLDOWN, 0x973e23);
            }

            if (!AbilityManager.shouldSlow(this._username) && StateManager.canAttack()) {
                if (InputManager._keys[InputManager.KEY_Q] && time - GroundSlam._lastTime >= GroundSlam.COOLDOWN) {
                    GroundSlam._lastTime = time;

                    CooldownManager.startCD(CooldownManager.getWidthByIndex(2), GroundSlam.COOLDOWN, 0x635241);

                    const ability = new GroundSlam(this._username, time, this._position);
                    AbilityManager.addAbility(ability);
                }
            }

            if (!AbilityManager.shouldSlow(this._username) && StateManager.canAttack()) {
                if (InputManager._keys[InputManager.KEY_E] && time - HolyAttack._lastTime >= HolyAttack.COOLDOWN) {
                    HolyAttack._lastTime = time;

                    CooldownManager.startCD(CooldownManager.getWidthByIndex(3), HolyAttack.COOLDOWN, 0xb0a068);

                    const mousePosition = Camera.getMousePosition();
                    const ability = new HolyAttack(this._username, time, mousePosition);
                    AbilityManager.addAbility(ability);
                }
            }

            if (!AbilityManager.shouldSlow(this._username) && StateManager.canAttack()) {
                if (InputManager._keys[InputManager.KEY_SHIFT] && time - Dash._lastTime >= Dash.COOLDOWN) {
                    Dash._lastTime = time;

                    const ability = new Dash(this._username);
                    AbilityManager.addAbility(ability);
                }
            }
        }

        if (!Connection.isEddie()) {
            this._fireBreathing = !!AbilityManager._abilities.find(ability => ability instanceof FireBreath);
        }

        // TODO make available to moonrats
        if (this._fireBreathing) {
            if (!this._fireHowlID) {
                this._fireHowlID = FireBreath.AUDIO.play();
                FireBreath.AUDIO.fade(0, 0.75, 100, this._fireHowlID);
            }

            if (!this._attackSprite) {
                this._attackSprite = new PIXI.AnimatedSprite(FireBreath.ATTACK_TEXTURES, true);
                this._attackSprite.anchor.x = 1133 / 1810;
                this._attackSprite.anchor.y = 1118 / 1317;
                this._attackSprite.scale.x = 0.8;
                this._attackSprite.scale.y = 0.8;
                this._attackSprite.animationSpeed = 0.2;
                this._attackSprite.loop = true;
                this._attackSprite.play();
                this._attackSprite.fire = true;
                this._container.addChild(this._attackSprite);
            }
        } else {
            if (this._fireHowlID) {
                FireBreath.AUDIO.fade(0.75, 0, 100, this._fireHowlID);

                const fireHowlID = this._fireHowlID;
                setTimeout(() => {
                    FireBreath.AUDIO.stop(fireHowlID);
                }, 110);

                this._fireHowlID = null;
            }

            if (this._attackSprite && this._attackSprite.fire) {
                this._attackSprite.destroy();
                this._attackSprite = null;
            }
        }
    }

    sendPackets() {
        if (!TwitchPackets.canSendPacketImmediately()) {
            return;
        }

        const packet = Entity.createPositionPacket(this._position[0], this._position[1]) +
            Entity.createVelocityPacket(this._velocity[0], this._velocity[1]) +
            Entity.createHealthPacket() +
            Entity.createEddieHealthPacket() +
            Entity.createGameStatePacket() +
            Entity.createWaveStatePacket() +
            this._packetAppendString;
        this._packetAppendString = '';

        this._canFireBreath = true;

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

            case Entity.PACKET_TYPE_CLAW: {
                const x = Entity.getFloatFromString(message);
                message = message.substring(4);
                const y = Entity.getFloatFromString(message);
                message = message.substring(4);
                const angle = Entity.getFloatFromString(message);
                message = message.substring(4);

                const claw = new Claw(this._username, Date.now(), [x, y], angle);
                AbilityManager.addAbility(claw);
            } break;

            case Entity.PACKET_TYPE_KNOCKBACK: {
                const entityID = message.charCodeAt(0);
                message = message.substring(1);
                const angle = Entity.getFloatFromString(message);
                message = message.substring(4);

                const knockback = new KnockbackEffect(this._username, entityID, angle);
                AbilityManager.addAbility(knockback);
            } break;

            case Entity.PACKET_TYPE_FIRE_BREATH: {
                const x = Entity.getFloatFromString(message);
                message = message.substring(4);
                const y = Entity.getFloatFromString(message);
                message = message.substring(4);
                const angle = Entity.getFloatFromString(message);
                message = message.substring(4);

                const fireBreath = new FireBreath(this._username, Date.now(), [x, y], angle);
                AbilityManager.addAbility(fireBreath);
            } break;

            case Entity.PACKET_TYPE_GROUND_SLAM: {
                const x = Entity.getFloatFromString(message);
                message = message.substring(4);
                const y = Entity.getFloatFromString(message);
                message = message.substring(4);

                const groundSlam = new GroundSlam(this._username, Date.now(), [x, y]);
                AbilityManager.addAbility(groundSlam);
            } break;

            case Entity.PACKET_TYPE_GROUND_SLAM_KNOCKBACK: {
                const entityID = message.charCodeAt(0);
                message = message.substring(1);
                const angle = Entity.getFloatFromString(message);
                message = message.substring(4);

                const knockback = new GroundSlamKnockbackEffect(this._username, entityID, angle);
                AbilityManager.addAbility(knockback);
            } break;

            case Entity.PACKET_TYPE_HEALTH: {
                const length = message.charCodeAt(0);
                message = message.substring(1);

                for (let i = 0; i < length; i++) {
                    const id = message.charCodeAt(0);
                    message = message.substring(1);

                    const health = message.charCodeAt(0);
                    message = message.substring(1);

                    const entity = Connection._players[TwitchInformation.ID_TO_NAME_MAP[id]];
                    if (entity) {
                        entity._health = health;
                    }
                }
            } break;

            case Entity.PACKET_TYPE_EDDIE_HEALTH: {
                const health = Entity.getIntFromString(message);
                message = message.substring(4);

                if (Connection.getEddie()) {
                    Connection.getEddie()._health = health;
                }
            } break;

            case Entity.PACKET_TYPE_GAME_STATE: {
                const state = message.charCodeAt(0);
                message = message.substring(1);

                StateManager._currentState = state;
            } break;

            case Entity.PACKET_TYPE_HOLY_ATTACK: {
                const x = Entity.getFloatFromString(message);
                message = message.substring(4);
                const y = Entity.getFloatFromString(message);
                message = message.substring(4);

                const ability = new HolyAttack(this._username, Date.now(), [x, y]);
                AbilityManager.addAbility(ability);
            } break;

            case Entity.PACKET_TYPE_WAVE_STATE: {
                const state = message.charCodeAt(0);
                message = message.substring(1);
                const playerLimit = message.charCodeAt(0);
                message = message.substring(1);

                if (WaveSystem._wave !== state || WaveSystem._wave === WaveSystem.PREP_WAVE) {
                    Connection._deadNames = {};
                }
                WaveSystem._wave = state;
                WaveSystem._currentPlayerLimit = playerLimit;
            } break;
        }

        this.processPacket(message);
    }

    getAABB(offset) {
        return Eddie.AABB.map(point => {
            return [point[0] + offset[0], point[1] + offset[1]];
        });
    }

    getPolygon(offset) {
        return Eddie.POLYGON.map(point => {
            return [point[0] + offset[0], point[1] + offset[1]];
        });
    }

    getMaxSpeed() {
        return AbilityManager.shouldSlow(this._username) ? 2 : 8;
    }
}