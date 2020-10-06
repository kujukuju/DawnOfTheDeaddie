class PounceAttack extends Ability {
    static AUDIO_CHOICES = USERNAME ? [
        new Howl({src: ['assets/audio/pounce/pounce-1.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pounce/pounce-2.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pounce/pounce-3.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pounce/pounce-4.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pounce/pounce-5.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pounce/pounce-6.mp3'], volume: 1}),
    ] : null;

    static ATTACK_TEXTURES = USERNAME ? ['assets/pounceattack/Feral-5.png', 'assets/pounceattack/Feral-5.png', 'assets/pounceattack/Feral-5.png', 'assets/pounceattack/Feral-1.png', 'assets/pounceattack/Feral-2.png', 'assets/pounceattack/Feral-3.png', 'assets/pounceattack/Feral-2.png', 'assets/pounceattack/Feral-3.png', 'assets/pounceattack/Feral-2.png', 'assets/pounceattack/Feral-3.png', 'assets/pounceattack/Feral-2.png', 'assets/pounceattack/Feral-3.png', 'assets/pounceattack/Feral-2.png', 'assets/pounceattack/Feral-3.png', 'assets/pounceattack/Feral-4.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static _lastTime = 0;
    static COOLDOWN = 1600;

    constructor(parentUsername, time, angle) {
        super(parentUsername);

        this._startTime = time;
        this._angle = angle;

        if (this.getParent()) {
            this.getParent()._attackSprite = new PIXI.AnimatedSprite(PounceAttack.ATTACK_TEXTURES, true);
            this.getParent()._attackSprite.anchor.x = 0.5;
            this.getParent()._attackSprite.anchor.y = 0.8;
            this.getParent()._attackSprite.scale.x = 0.5;
            this.getParent()._attackSprite.scale.y = 0.5;
            this.getParent()._attackSprite.animationSpeed = 0.5;
            this.getParent()._attackSprite.loop = false;
            this.getParent()._attackSprite._pounce = true;
            this.getParent()._attackSprite.play();
            this.getParent()._attackSprite.onComplete = () => {
                if (!this.getParent() || !this.getParent()._attackSprite || !this.getParent()._attackSprite._pounce) {
                    return;
                }

                this.getParent()._attackSprite.destroy();
                this.getParent()._attackSprite = null;
            };
            this.getParent()._container.addChild(this.getParent()._attackSprite);

            const position = this.getParent().getPosition(time);
            const howl = PounceAttack.AUDIO_CHOICES[Math.floor(Math.random() * PounceAttack.AUDIO_CHOICES.length)];
            AudioSystem.playSound(howl, position);
        }


        if (this._parentUsername === USERNAME) {
            if (this.getParent()) {
                this.getParent()._velocity[0] = Math.cos(this._angle) * 12;
                this.getParent()._velocity[1] = Math.sin(this._angle) * 12;

                this.getParent()._packetAppendString += this.getPacket();
            }
        }

        this._hit = false;
    }

    update(time) {
        if (this.getParent()) {
            if (time - this._startTime <= 600) {
                if (this._parentUsername === USERNAME) {
                    this.getParent()._velocity[0] += Math.cos(this._angle) * Entity.ACCEL * 2;
                    this.getParent()._velocity[1] += Math.sin(this._angle) * Entity.ACCEL * 2;
                }
            }

            if (Connection.isEddie() && Connection.getEddie()) {
                const dx = this.getParent()._velocity[0];
                const dy = this.getParent()._velocity[1];

                const eddiePosition = Connection.getEddie().getPosition(time);
                const eddiePolygon = Connection.getEddie().getPolygon([0, 0]).map(point => {
                    return [point[0] * 1.8 + eddiePosition[0], point[1] * 1.6 + eddiePosition[1]];
                });

                if (PolygonMath.isPointInPolygon2D(this.getParent().getPosition(time - 500), eddiePolygon)) {
                    this._hit = true;

                    const d = Math.sqrt(dx * dx + dy * dy);
                    const damage = Math.max((d - this.getParent().getMaxSpeed()) * 4, 24);
                    console.log(damage);
                    Connection.getEddie()._health -= damage * Connection._moonratDamageScale;
                    AudioSystem.playEddiePainSound(eddiePosition);
                }

            }
        }
    }

    isActive(time) {
        return time - this._startTime <= 1200 && !this._hit;
    }

    shouldSlow(time) {
        return false;
    }

    getPacket() {
        return String.fromCharCode(Entity.PACKET_TYPE_POUNCE_ATTACK) +
            Entity.getStringFromFloat(this._angle);
    }
}