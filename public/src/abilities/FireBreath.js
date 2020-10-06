class FireBreath extends Ability {
    static AUDIO = USERNAME ? new Howl({src: ['assets/audio/fire.mp3'], volume: 0, loop: true}) : null;

    static ATTACK_TEXTURES = USERNAME ? ['assets/firebreath/Eddiefire-1.png', 'assets/firebreath/Eddiefire-2.png', 'assets/firebreath/Eddiefire-3.png', 'assets/firebreath/Eddiefire-4.png', 'assets/firebreath/Eddiefire-5.png', 'assets/firebreath/Eddiefire-6.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static SIZE = 320;

    static _lastTime = 0;
    static COOLDOWN = 12000;

    constructor(parentUsername, time, position, angle) {
        super(parentUsername);

        this._startTime = time;
        this._position = [position[0], position[1]];
        this._angle = angle;

        if (this._parentUsername === USERNAME) {
            if (this.getParent()) {
                this.getParent()._packetAppendString += this.getPacket();
            }
        }
    }

    update(time) {
        if (!Connection.getEddie()) {
            return;
        }

        const angle = this._angle + Math.random() * Math.PI / 3 - Math.PI / 6;
        const nextPosition = [this._position[0] + Math.cos(angle) * FireBreath.SIZE * 2, this._position[1] + Math.sin(angle) * FireBreath.SIZE];
        const startPosition = [
            this._position[0] + Connection.getEddie()._sprite.width * 0.4 * Math.sign(Connection.getEddie()._container.scale.x) * 0.6,
            this._position[1] - Connection.getEddie()._sprite.height * 0.5,
        ];

        const particle = new FireParticle(this._parentUsername, time, startPosition, nextPosition, angle);
        AbilityManager.addAbility(particle);
    }

    isActive(time) {
        return time - this._startTime <= 550;
    }

    shouldSlow(time) {
        return true;
    }

    getPacket() {
        return String.fromCharCode(Entity.PACKET_TYPE_FIRE_BREATH) +
            Entity.getStringFromFloat(this._position[0]) +
            Entity.getStringFromFloat(this._position[1]) +
            Entity.getStringFromFloat(this._angle);
    }
}