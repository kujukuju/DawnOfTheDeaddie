class TankAttack extends Ability {
    static AUDIO = USERNAME ? new Howl({src: ['assets/audio/punch.mp3'], volume: 1}) : null;

    static TEXTURES = USERNAME ? ['assets/tankattack/Punch-1.png', 'assets/tankattack/Punch-2.png', 'assets/tankattack/Punch-3.png', 'assets/tankattack/Punch-4.png', 'assets/tankattack/Punch-5.png', 'assets/tankattack/Punch-6.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static ATTACK_TEXTURES = USERNAME ? ['assets/tankattack/Titan-1.png', 'assets/tankattack/Titan-2.png', 'assets/tankattack/Titan-3.png', 'assets/tankattack/Titan-4.png', 'assets/tankattack/Titan-5.png', 'assets/tankattack/Titan-6.png', 'assets/tankattack/Titan-7.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static SIZE = 220;

    static _lastTime = 0;
    static COOLDOWN = 1200;
    static DAMAGE = 65;

    constructor(parentUsername, time, position, angle) {
        super(parentUsername);

        this._startTime = time;
        this._startPosition = [position[0], position[1]];
        this._position = [position[0], position[1]];
        this._angle = angle;

        this._position[0] += Math.cos(angle) * TankAttack.SIZE * 1.2;
        this._position[1] += Math.sin(angle) * TankAttack.SIZE - 50;

        this._testingPoints = [
            [this._startPosition[0] + Math.cos(angle - Math.PI / 6) * TankAttack.SIZE * 1.8, this._startPosition[1] + Math.sin(angle - Math.PI / 6) * TankAttack.SIZE * 1.6],
            [this._startPosition[0] + Math.cos(angle) * TankAttack.SIZE * 1.8, this._startPosition[1] + Math.sin(angle) * TankAttack.SIZE * 1.6],
            [this._startPosition[0] + Math.cos(angle + Math.PI / 6) * TankAttack.SIZE * 1.8, this._startPosition[1] + Math.sin(angle + Math.PI / 6) * TankAttack.SIZE * 1.6],
        ];

        this._sprite = new PIXI.AnimatedSprite(TankAttack.TEXTURES, true);
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 1;
        this._sprite.animationSpeed = 0.6;
        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1];
        this._sprite.zIndex = this._position[1];
        this._sprite.rotation = angle - Math.PI / 2;
        this._sprite.play();
        this._sprite.loop = false;
        this._sprite.onComplete = () => {
            this._sprite.destroy();
            this._sprite = null;
        };
        Renderer._container.addChild(this._sprite);

        AudioSystem.playSound(TankAttack.AUDIO, this._position);

        if (this.getParent()) {
            this.getParent()._attackSprite = new PIXI.AnimatedSprite(TankAttack.ATTACK_TEXTURES, true);
            this.getParent()._attackSprite.anchor.x = 0.5;
            this.getParent()._attackSprite.anchor.y = 0.9;
            this.getParent()._attackSprite.scale.x = 0.5;
            this.getParent()._attackSprite.scale.y = 0.5;
            this.getParent()._attackSprite.animationSpeed = 0.5;
            this.getParent()._attackSprite.loop = false;
            this.getParent()._attackSprite._tank = true;
            this.getParent()._attackSprite.play();
            this.getParent()._attackSprite.onComplete = () => {
                if (!this.getParent() || !this.getParent()._attackSprite || !this.getParent()._attackSprite._tank) {
                    return;
                }

                this.getParent()._attackSprite.destroy();
                this.getParent()._attackSprite = null;
            };
            this.getParent()._container.addChild(this.getParent()._attackSprite);
        }

        if (this._parentUsername === USERNAME) {
            if (this.getParent()) {
                this.getParent()._velocity[0] = Math.cos(this._angle) * 24;
                this.getParent()._velocity[1] = Math.sin(this._angle) * 24;

                this.getParent()._packetAppendString += this.getPacket();
            }
        }

        if (Connection.isEddie() && Connection.getEddie()) {
            const eddiePosition = Connection.getEddie().getPosition(time);
            const eddiePolygon = Connection.getEddie().getPolygon(eddiePosition);
            if (PolygonMath.isPointInPolygon2D(this._testingPoints[0], eddiePolygon) || PolygonMath.isPointInPolygon2D(this._testingPoints[1], eddiePolygon) || PolygonMath.isPointInPolygon2D(this._testingPoints[2], eddiePolygon)) {
                Connection.getEddie()._health -= TankAttack.DAMAGE * Connection._moonratDamageScale;
                AudioSystem.playEddiePainSound(eddiePosition);
            }
        }
    }

    update(time) {
        this._position[0] += Math.cos(this._angle) * 15;
        this._position[1] += Math.sin(this._angle) * 15;

        if (this._sprite) {
            this._sprite.position.x = this._position[0];
            this._sprite.position.y = this._position[1];
            this._sprite.zIndex = this._sprite.position.y;
        }
    }

    isActive(time) {
        return time - this._startTime <= 400;
    }

    shouldSlow(time) {
        return false;
    }

    getPacket() {
        return String.fromCharCode(Entity.PACKET_TYPE_TANK_ATTACK) +
            Entity.getStringFromFloat(this._startPosition[0]) +
            Entity.getStringFromFloat(this._startPosition[1]) +
            Entity.getStringFromFloat(this._angle);
    }
}