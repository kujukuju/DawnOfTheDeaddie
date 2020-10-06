class HolyAttack extends Ability {
    static AUDIO = USERNAME ? new Howl({src: ['assets/audio/heal-maybe.mp3'], volume: 0.5}) : null;

    static TEXTURES = USERNAME ? ['assets/holyattack/Better-1.png', 'assets/holyattack/Better-2.png', 'assets/holyattack/Better-3.png', 'assets/holyattack/Better-4.png', 'assets/holyattack/Better-5.png', 'assets/holyattack/Better-6.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static ATTACK_TEXTURES = USERNAME ?  ['assets/holyattack/Eddiehalo-1.png', 'assets/holyattack/Eddiehalo-2.png', 'assets/holyattack/Eddiehalo-3.png', 'assets/holyattack/Eddiehalo-4.png', 'assets/holyattack/Eddiehalo-5.png', 'assets/holyattack/Eddiehalo-6.png', 'assets/holyattack/Eddiehalo-7.png', 'assets/holyattack/Eddiehalo-5.png', 'assets/holyattack/Eddiehalo-6.png', 'assets/holyattack/Eddiehalo-7.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static _lastTime = 0;
    static COOLDOWN = 16000;

    constructor(parentUsername, time, position) {
        super(parentUsername);

        this._startTime = time;
        this._position = [position[0], position[1]];

        this._sprite = new PIXI.AnimatedSprite(HolyAttack.TEXTURES, true);
        this._sprite.scale.x = 2;
        this._sprite.scale.y = 2;
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 760 / 1327;
        this._sprite.animationSpeed = 0.05;
        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1] - (900 - 760) * this._sprite.scale.y;
        this._sprite.zIndex = this._sprite.position.y;
        this._sprite.loop = false;
        this._sprite.play();
        Renderer._container.addChild(this._sprite);

        HolyAttack.AUDIO.play();

        if (this.getParent()) {
            if (this.getParent()._attackSprite) {
                this.getParent()._attackSprite.destroy();
                this.getParent()._attackSprite = null;
            }

            this.getParent()._attackSprite = new PIXI.AnimatedSprite(HolyAttack.ATTACK_TEXTURES, true);
            this.getParent()._attackSprite.anchor.x = 1133/1810;
            this.getParent()._attackSprite.anchor.y = 1118/1317;
            this.getParent()._attackSprite.scale.x = 0.8;
            this.getParent()._attackSprite.scale.y = 0.8;
            this.getParent()._attackSprite.animationSpeed = 0.2;
            this.getParent()._attackSprite.loop = false;
            this.getParent()._attackSprite._holy = true;
            this.getParent()._attackSprite.play();
            this.getParent()._attackSprite.onComplete = () => {
                if (!this.getParent() || !this.getParent()._attackSprite || !this.getParent()._attackSprite._holy) {
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

        this._launched = false;
    }

    update(time) {
        const duration = Connection.isEddie() ? 3000 : 2000;
        if (time - this._startTime >= duration) {
            this._launched = true;

            const ability = new GroundHolyAttack(this._parentUsername, time, this._position);
            AbilityManager.addAbility(ability);
        }
    }

    isActive(time) {
        return !this._launched;
    }

    shouldSlow(time) {
        return time - this._startTime <= 800;
    }

    getPacket() {
        return String.fromCharCode(Entity.PACKET_TYPE_HOLY_ATTACK) +
            Entity.getStringFromFloat(this._position[0]) +
            Entity.getStringFromFloat(this._position[1]);
    }
}