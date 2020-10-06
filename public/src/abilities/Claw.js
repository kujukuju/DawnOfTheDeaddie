class Claw extends Ability {
    static AUDIO = USERNAME ? new Howl({src: ['assets/audio/claw.mp3'], volume: 1}) : null;

    static TEXTURES = USERNAME ? ['assets/claw/Claw-1.png', 'assets/claw/Claw-2.png', 'assets/claw/Claw-3.png', 'assets/claw/Claw-4.png', 'assets/claw/Claw-5.png', 'assets/claw/Claw-6.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static ATTACK_TEXTURES = USERNAME ? ['assets/claw/Eddieswipe-1.png', 'assets/claw/Eddieswipe-1.png', 'assets/claw/Eddieswipe-1.png', 'assets/claw/Eddieswipe-1.png', 'assets/claw/Eddieswipe-1.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static _lastTime = 0;
    static COOLDOWN = 800;

    static SIZE = 800;
    static DAMAGE = 24;

    constructor(parentUsername, time, position, angle) {
        super(parentUsername);

        this._startTime = time;
        this._startPosition = [position[0], position[1]];
        this._position = [position[0], position[1]];
        this._angle = angle;

        this._position[0] += Math.cos(angle) * Claw.SIZE;
        this._position[1] += Math.sin(angle) * Claw.SIZE / 2;

        this._sprite = new PIXI.AnimatedSprite(Claw.TEXTURES, true);
        this._sprite.anchor.x = 580/1032;
        this._sprite.anchor.y = 690/1006;
        this._sprite.scale.x = 1.5;
        this._sprite.scale.y = 1;
        this._sprite.animationSpeed = 0.5;
        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1];
        this._sprite.zIndex = this._position[1];
        this._sprite.rotation = angle - Math.PI / 2;
        this._sprite.zIndex = this._position[1];
        this._sprite.play();
        this._sprite.loop = false;
        this._sprite.onComplete = () => {
            this._sprite.destroy();
            this._sprite = null;
        };
        Renderer._container.addChild(this._sprite);

        Claw.AUDIO.play();

        if (this.getParent()) {
            if (this.getParent()._attackSprite) {
                this.getParent()._attackSprite.destroy();
                this.getParent()._attackSprite = null;
            }

            this.getParent()._attackSprite = new PIXI.AnimatedSprite(Claw.ATTACK_TEXTURES, true);
            this.getParent()._attackSprite.anchor.x = 1133/1810;
            this.getParent()._attackSprite.anchor.y = 1118/1317;
            this.getParent()._attackSprite.scale.x = 0.8;
            this.getParent()._attackSprite.scale.y = 0.8;
            this.getParent()._attackSprite.animationSpeed = 0.5;
            this.getParent()._attackSprite.loop = false;
            this.getParent()._attackSprite._claw = true;
            this.getParent()._attackSprite.play();
            this.getParent()._attackSprite.onComplete = () => {
                if (!this.getParent() || !this.getParent()._attackSprite || !this.getParent()._attackSprite._claw) {
                    return;
                }

                this.getParent()._attackSprite.destroy();
                this.getParent()._attackSprite = null;
            };
            this.getParent()._container.addChild(this.getParent()._attackSprite);
        }

        if (this._parentUsername === USERNAME) {
            if (this.getParent()) {
                this.getParent()._packetAppendString += this.getPacket();
            }

            setTimeout(() => {
                const moonrats = Object.values(Connection._players).filter(entity => entity instanceof Moonrat);
                for (let i = 0; i < moonrats.length; i++) {
                    const moonrat = moonrats[i];
                    const position = moonrat.getPosition(time - 500);

                    const moonratAngle = Math.atan2(position[1] - this._startPosition[1], position[0] - this._startPosition[0]);
                    if (Math.abs(MathHelper.radiansBetweenAngles(moonratAngle, this._angle)) < Math.PI / 2) {
                        if (MathHelper.isPointInsideOval(position, this._startPosition, [Claw.SIZE * 2 + 140, Claw.SIZE + 180])) {
                            moonrat._health -= Claw.DAMAGE * Connection._eddieDamageScale;

                            const knockbackEffect = new KnockbackEffect(this._parentUsername, TwitchInformation.NAME_TO_ID_MAP[moonrat._username], moonratAngle);
                            AbilityManager.addAbility(knockbackEffect);

                            setTimeout(() => {
                                if (moonrat._health > 0) {
                                    AudioSystem.playPainSound(position, moonrat._currentMoonratType);
                                    moonrat._lastPainTime = Date.now();
                                }
                            }, Math.random() * 100);
                        }
                    }
                }
            }, 100);
        }
    }

    update(time) {

    }

    isActive(time) {
        return time - this._startTime <= 400;
    }

    shouldSlow(time) {
        return this.isActive(time);
    }

    getPacket() {
        return String.fromCharCode(Entity.PACKET_TYPE_CLAW) +
            Entity.getStringFromFloat(this._startPosition[0]) +
            Entity.getStringFromFloat(this._startPosition[1]) +
            Entity.getStringFromFloat(this._angle);
    }
}