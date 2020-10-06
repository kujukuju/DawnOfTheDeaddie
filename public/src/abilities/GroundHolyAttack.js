class GroundHolyAttack extends Ability {
    static AUDIO = USERNAME ? new Howl({src: ['assets/audio/heal.mp3'], volume: 0.5}) : null;

    static TEXTURES = USERNAME ? ['assets/holyattack/Better-7.png', 'assets/holyattack/Better-8.png', 'assets/holyattack/Better-9.png', 'assets/holyattack/Better-10.png', 'assets/holyattack/Better-11.png', 'assets/holyattack/Better-12.png', 'assets/holyattack/Better-13.png', 'assets/holyattack/Better-14.png', 'assets/holyattack/Better-15.png', 'assets/holyattack/Better-16.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static WIDTH = 730 * 2;
    static HEIGHT = 270 * 2;

    static DAMAGE = 140;

    constructor(parentUsername, time, position) {
        super(parentUsername);

        this._startTime = time;
        this._position = [position[0], position[1]];

        this._sprite = new PIXI.AnimatedSprite(GroundHolyAttack.TEXTURES, true);
        this._sprite.scale.x = 2;
        this._sprite.scale.y = 2;
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 760 / 1327;
        this._sprite.animationSpeed = 0.4;
        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1] - (900 - 760) * this._sprite.scale.y;
        this._sprite.zIndex = this._sprite.position.y;
        this._sprite.loop = false;
        this._sprite.play();
        this._sprite.onComplete = () => {
            this._sprite.destroy();
            this._sprite = null;
        };
        Renderer._container.addChild(this._sprite);

        GroundHolyAttack.AUDIO.play();

        if (Connection.isEddie() && Connection.getEddie()) {
            const moonrats = Object.values(Connection._players).filter(entity => entity instanceof Moonrat);
            for (let i = 0; i < moonrats.length; i++) {
                const moonratPosition = moonrats[i].getPosition(time - 500);
                const moonratWidth = Moonrat.TANK_AABB[1][0] - Moonrat.TANK_AABB[0][0];
                const moonratHeight = Moonrat.TANK_AABB[1][1] - Moonrat.TANK_AABB[0][1];
                const moonratDimensions = [moonratWidth * 0.8, moonratHeight * 0.8];

                if (MathHelper.overlapOval(this._position, [GroundHolyAttack.WIDTH, GroundHolyAttack.HEIGHT], moonratPosition, moonratDimensions)) {
                    moonrats[i]._health -= GroundHolyAttack.DAMAGE * Connection._eddieDamageScale;

                    AudioSystem.playPainSound(moonrats[i]._position, moonrats[i]._currentMoonratType);
                    moonrats[i]._lastPainTime = time;
                }
            }

            const eddiePosition = Connection.getEddie().getPosition(time);
            const eddieDimensions = [Eddie.AABB[1][0] - Eddie.AABB[0][0], Eddie.AABB[1][1] - Eddie.AABB[0][1]];
            if (MathHelper.overlapOval(this._position, [GroundHolyAttack.WIDTH, GroundHolyAttack.HEIGHT], eddiePosition, eddieDimensions)) {
                Connection.getEddie()._health = Math.min(Connection.getEddie()._maxHealth, Connection.getEddie()._health + 600);
            }
        }
    }

    update(time) {

    }

    isActive(time) {
        return !!this._sprite;
    }

    shouldSlow(time) {
        return false;
    }
}