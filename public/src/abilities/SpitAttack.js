class SpitAttack extends Ability {
    static AUDIO = USERNAME ? new Howl({src: ['assets/audio/spit.mp3'], volume: 0.5}) : null;

    static TEXTURES = USERNAME ? ['assets/spitattack/Goop-1.png', 'assets/spitattack/Goop-2.png', 'assets/spitattack/Goop-3.png', 'assets/spitattack/Goop-4.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static ATTACK_TEXTURES = USERNAME ? ['assets/spitattack/Bones-1.png', 'assets/spitattack/Bones-2.png', 'assets/spitattack/Bones-3.png', 'assets/spitattack/Bones-4.png', 'assets/spitattack/Bones-4.png', 'assets/spitattack/Bones-5.png', 'assets/spitattack/Bones-5.png', 'assets/spitattack/Bones-6.png', 'assets/spitattack/Bones-6.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static SIZE = 80;

    static _lastTime = 0;
    static COOLDOWN = 8000;

    constructor(parentUsername, time, position, desiredPosition) {
        super(parentUsername);

        this._startTime = time;
        this._startPosition = [position[0], position[1]];
        this._position = [position[0], position[1]];
        this._desiredPosition = desiredPosition;

        this._position[1] -= 150;

        const angle = Math.atan2(this._desiredPosition[1] - this._position[1], this._desiredPosition[0] - this._position[0]);

        this._position[0] += Math.cos(angle) * SpitAttack.SIZE * 1.2;
        this._position[1] += Math.sin(angle) * SpitAttack.SIZE;

        this._sprite = new PIXI.AnimatedSprite(SpitAttack.TEXTURES, true);
        this._sprite.scale.x = 0.4;
        this._sprite.scale.y = 0.4;
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.8;
        this._sprite.animationSpeed = 0.6;
        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1];
        this._sprite.zIndex = this._position[1];
        this._sprite.rotation = angle - Math.PI / 2;
        this._sprite.zIndex = this._sprite.position.y;
        this._sprite.play();
        this._sprite.loop = true;
        Renderer._container.addChild(this._sprite);

        AudioSystem.playSound(SpitAttack.AUDIO, this._startPosition);

        if (this.getParent()) {
            this.getParent()._attackSprite = new PIXI.AnimatedSprite(SpitAttack.ATTACK_TEXTURES, true);
            this.getParent()._attackSprite.anchor.x = 0.5;
            this.getParent()._attackSprite.anchor.y = 0.9;
            this.getParent()._attackSprite.scale.x = 0.5;
            this.getParent()._attackSprite.scale.y = 0.5;
            this.getParent()._attackSprite.animationSpeed = 0.5;
            this.getParent()._attackSprite.loop = false;
            this.getParent()._attackSprite._spit = true;
            this.getParent()._attackSprite.play();
            this.getParent()._attackSprite.onComplete = () => {
                if (!this.getParent() || !this.getParent()._attackSprite || !this.getParent()._attackSprite._spit) {
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
        }

        this._landed = false;
    }

    update(time) {
        const dx = this._desiredPosition[0] - this._position[0];
        const dy = this._desiredPosition[1] - this._position[1];
        const d = Math.sqrt(dx * dx + dy * dy);

        const oldPosition = [this._position[0], this._position[1]];

        if (d <= 30) {
            this._position[0] = this._desiredPosition[0];
            this._position[1] = this._desiredPosition[1];

            const groundSpit = new GroundSpit(this._parentUsername, time, this._position);
            AbilityManager.addAbility(groundSpit);

            this._landed = true;
            return;
        } else {
            this._position[0] += dx / d * 30;
            this._position[1] += dy / d * 30;
        }

        const aabb = [this._position, this._position];
        const polygons = LevelManager.queryPolygons(aabb);
        for (let i = 0; i < polygons.length; i++) {
            if (PolygonMath.isPointInPolygon2D(this._position, polygons[i])) {
                const groundSpit = new GroundSpit(this._parentUsername, time, oldPosition);
                AbilityManager.addAbility(groundSpit);

                this._landed = true;
                return;
            }
        }

        if (this._sprite) {
            this._sprite.position.x = this._position[0];
            this._sprite.position.y = this._position[1];
            this._sprite.zIndex = this._sprite.position.y;
        }
    }

    isActive(time) {
        return !this._landed;
    }

    shouldSlow(time) {
        return time - this._startTime <= 800;
    }

    getPacket() {
        return String.fromCharCode(Entity.PACKET_TYPE_SPIT_ATTACK) +
            Entity.getStringFromFloat(this._startPosition[0]) +
            Entity.getStringFromFloat(this._startPosition[1]) +
            Entity.getStringFromFloat(this._desiredPosition[0]) +
            Entity.getStringFromFloat(this._desiredPosition[1]);
    }
}